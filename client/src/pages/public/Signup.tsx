import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../lib/axios';
import { UserPlus } from 'lucide-react';

const signupSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type SignupForm = z.infer<typeof signupSchema>;

const Signup = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema)
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data: SignupForm) => {
    setErrorMsg('');
    try {
      await api.post('/auth/signup', data);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Signup failed. Please try again.');
    }
  };

  if (success) {
    return (
      <div className="flex justify-center py-20 px-4">
        <div className="w-full max-w-md bg-white border border-border rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-success-light text-success rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Account Created!</h2>
          <p className="text-text-secondary">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center py-16 px-4">
      <div className="w-full max-w-lg bg-white border border-border rounded-xl shadow-lg p-8">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center text-primary">
            <UserPlus className="w-6 h-6" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center text-text-primary mb-2">Create an Account</h2>
        <p className="text-center text-text-secondary text-sm mb-8">Join InternAtlas and start finding opportunities.</p>
        
        {errorMsg && (
          <div className="bg-error-light text-error text-sm p-3 rounded-md mb-6 font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">First Name</label>
              <input 
                {...register('firstName')}
                type="text" 
                className={`w-full border rounded-md px-4 py-2 text-sm focus:outline-none focus:border-primary ${errors.firstName ? 'border-error' : 'border-border'}`}
              />
              {errors.firstName && <p className="text-error text-xs mt-1">{errors.firstName.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Last Name</label>
              <input 
                {...register('lastName')}
                type="text" 
                className={`w-full border rounded-md px-4 py-2 text-sm focus:outline-none focus:border-primary ${errors.lastName ? 'border-error' : 'border-border'}`}
              />
              {errors.lastName && <p className="text-error text-xs mt-1">{errors.lastName.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Username</label>
            <input 
              {...register('username')}
              type="text" 
              className={`w-full border rounded-md px-4 py-2 text-sm focus:outline-none focus:border-primary ${errors.username ? 'border-error' : 'border-border'}`}
            />
            {errors.username && <p className="text-error text-xs mt-1">{errors.username.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Email</label>
            <input 
              {...register('email')}
              type="email" 
              className={`w-full border rounded-md px-4 py-2 text-sm focus:outline-none focus:border-primary ${errors.email ? 'border-error' : 'border-border'}`}
            />
            {errors.email && <p className="text-error text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Password</label>
            <input 
              {...register('password')}
              type="password" 
              className={`w-full border rounded-md px-4 py-2 text-sm focus:outline-none focus:border-primary ${errors.password ? 'border-error' : 'border-border'}`}
            />
            {errors.password && <p className="text-error text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-primary text-white font-bold rounded-md py-2.5 hover:bg-primary-dark transition-colors disabled:opacity-70 disabled:cursor-not-allowed mt-4"
          >
            {isSubmitting ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-sm text-text-secondary mt-6">
          Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
