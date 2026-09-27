import { Request, Response } from 'express';
import crypto from 'crypto';
import { User, Profile, RefreshToken } from '../models';
import { hashPassword, verifyPassword } from '../utils/password';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import { signupSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from '../validators/authValidator';

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = signupSchema.parse(req.body);
    const { email, password, firstName, lastName, username, role } = validatedData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ success: false, message: 'Email already exists' });
      return;
    }

    const existingUsername = await Profile.findOne({ username });
    if (existingUsername) {
      res.status(400).json({ success: false, message: 'Username already taken' });
      return;
    }

    const hashedPassword = await hashPassword(password);
    const userRole = role || 'CANDIDATE';

    const user = new User({
      email,
      passwordHash: hashedPassword,
      role: userRole,
      status: 'ACTIVE' // Auto-active for simplicity right now
    });
    await user.save();

    const profile = new Profile({
      userId: user._id,
      firstName,
      lastName,
      username
    });
    await profile.save();

    res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ success: false, message: 'Validation error', errors: error.errors });
      return;
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const { email, password } = validatedData;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }

    const isMatch = await verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }

    if (user.status !== 'ACTIVE') {
      res.status(403).json({ success: false, message: 'Account is not active' });
      return;
    }

    user.lastLoginAt = new Date();
    await user.save();

    const payload = { id: user.id, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshTokenStr = generateRefreshToken(payload);

    // Save refresh token to db
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    const family = crypto.randomBytes(16).toString('hex'); // Token family for rotation tracking

    await new RefreshToken({
      token: refreshTokenStr,
      userId: user._id,
      expiresAt,
      family
    }).save();

    res.cookie('refreshToken', refreshTokenStr, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({
      success: true,
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ success: false, message: 'Validation error', errors: error.errors });
      return;
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.cookies;
    if (refreshToken) {
      await RefreshToken.findOneAndUpdate({ token: refreshToken }, { isRevoked: true });
      res.clearCookie('refreshToken');
    }
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      res.status(401).json({ success: false, message: 'Refresh token missing' });
      return;
    }

    const tokenDoc = await RefreshToken.findOne({ token: refreshToken });

    if (!tokenDoc) {
      // Missing token but cookie was sent. Just clear the cookie.
      res.clearCookie('refreshToken');
      res.status(401).json({ success: false, message: 'Invalid refresh token' });
      return;
    }

    // Reuse detection
    if (tokenDoc.isRevoked) {
      // Potential theft! Revoke all tokens in this family or for this user.
      await RefreshToken.updateMany({ family: tokenDoc.family }, { isRevoked: true });
      res.clearCookie('refreshToken');
      res.status(403).json({ success: false, message: 'Security alert: Token reuse detected. All sessions revoked.' });
      return;
    }

    if (tokenDoc.expiresAt < new Date()) {
      tokenDoc.isRevoked = true;
      await tokenDoc.save();
      res.clearCookie('refreshToken');
      res.status(401).json({ success: false, message: 'Refresh token expired' });
      return;
    }

    const user = await User.findById(tokenDoc.userId);
    if (!user || user.status !== 'ACTIVE') {
      res.status(401).json({ success: false, message: 'User not active or deleted' });
      return;
    }

    // ROTATION: Mark old as revoked, issue new
    tokenDoc.isRevoked = true;
    
    const payload = { id: user.id, role: user.role };
    const newAccessToken = generateAccessToken(payload);
    const newRefreshTokenStr = generateRefreshToken(payload);

    tokenDoc.replacedByToken = newRefreshTokenStr;
    await tokenDoc.save();

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await new RefreshToken({
      token: newRefreshTokenStr,
      userId: user._id,
      expiresAt,
      family: tokenDoc.family // Keep the same family
    }).save();

    res.cookie('refreshToken', newRefreshTokenStr, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({ success: true, accessToken: newAccessToken });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }
    const user = await User.findById(req.user.id).select('-passwordHash -resetPasswordToken -resetPasswordExpires');
    const profile = await Profile.findOne({ userId: req.user.id });
    
    res.status(200).json({ success: true, user, profile });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = forgotPasswordSchema.parse(req.body);
    const user = await User.findOne({ email });

    // Always return success even if user not found (security best practice)
    if (!user) {
      res.status(200).json({ success: true, message: 'If that email is registered, a password reset link has been sent.' });
      return;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = hashedResetToken;
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
    await user.save();

    // Dispatch password reset email via notification service
    // In production, this sends a real email; in development it mocks it
    const { notifyUser } = await import('../utils/notificationService');
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
    await notifyUser(
      user.id,
      'SYSTEM_ALERT',
      'Password Reset Request',
      `You requested a password reset. Click the link below to set a new password. This link expires in 15 minutes.\n\n${resetLink}\n\nIf you did not request this, ignore this email.`
    );

    res.status(200).json({ success: true, message: 'If that email is registered, a password reset link has been sent.' });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ success: false, message: 'Validation error', errors: error.errors });
      return;
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, newPassword } = resetPasswordSchema.parse(req.body);
    const hashedResetToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedResetToken,
      resetPasswordExpires: { $gt: new Date() }
    });

    if (!user) {
      res.status(400).json({ success: false, message: 'Invalid or expired password reset token.' });
      return;
    }

    user.passwordHash = await hashPassword(newPassword);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Revoke all existing sessions to force relogin
    await RefreshToken.updateMany({ userId: user._id }, { isRevoked: true });

    res.status(200).json({ success: true, message: 'Password has been successfully reset. Please log in.' });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ success: false, message: 'Validation error', errors: error.errors });
      return;
    }
    res.status(500).json({ success: false, message: error.message });
  }
};
