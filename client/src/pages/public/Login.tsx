import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../lib/axios';
import { useAuth } from '../../context/AuthContext';
import { LogIn } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

const Login = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema)
  });
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (data: LoginForm) => {
    setErrorMsg('');
    try {
      const res = await api.post('/auth/login', data);
      login(res.data.accessToken, res.data.user);
      
      const params = new URLSearchParams(window.location.search);
      const returnTo = params.get('returnTo');
      navigate(returnTo || '/student/dashboard');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center py-16 px-4">
      <div className="w-full max-w-md bg-white border border-border rounded-xl shadow-lg p-8">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center text-primary">
            <LogIn className="w-6 h-6" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center text-text-primary mb-2">Welcome Back</h2>
        <p className="text-center text-text-secondary text-sm mb-8">Sign in to continue your career journey.</p>
        
        {errorMsg && (
          <div className="bg-error-light text-error text-sm p-3 rounded-md mb-6 font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Email</label>
            <input 
              {...register('email')}
              type="email" 
              className={`w-full border rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 ${errors.email ? 'border-error' : 'border-border focus:border-primary'}`}
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-error text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="block text-sm font-medium text-text-secondary">Password</label>
              <Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link>
            </div>
            <input 
              {...register('password')}
              type="password" 
              className={`w-full border rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 ${errors.password ? 'border-error' : 'border-border focus:border-primary'}`}
              placeholder="••••••••"
            />
            {errors.password && <p className="text-error text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-primary text-white font-bold rounded-md py-2.5 hover:bg-primary-dark transition-colors disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-text-secondary mt-6">
          Don't have an account? <Link to="/signup" className="text-primary font-bold hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
