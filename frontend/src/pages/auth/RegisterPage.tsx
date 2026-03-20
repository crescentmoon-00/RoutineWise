import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    try {
      await register(formData.email, formData.password, formData.firstName, formData.lastName);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Branding */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-primary mb-2">RoutineWise</h1>
          <p className="text-on-surface-variant">Create your account</p>
        </div>

        {/* Register Card */}
        <div className="bg-surface-container-lowest rounded-[1rem] p-8 shadow-[0_20px_50px_rgba(47,92,155,0.1)]">
          <h2 className="text-2xl font-bold text-on-surface mb-6">Get started</h2>

          {error && (
            <div className="mb-4 p-3 bg-error-container/30 text-error rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="text"
                label="First name"
                placeholder="John"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                autoComplete="given-name"
              />

              <Input
                type="text"
                label="Last name"
                placeholder="Doe"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                autoComplete="family-name"
              />
            </div>

            <Input
              type="email"
              label="Email"
              placeholder="you@example.com"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />

            <Input
              type="password"
              label="Password"
              placeholder="••••••••"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="new-password"
              helperText="Must be at least 8 characters"
            />

            <Input
              type="password"
              label="Confirm password"
              placeholder="••••••••"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-on-surface-variant">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-primary hover:text-primary_container font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Terms Notice */}
        <div className="mt-4 text-center text-xs text-on-surface-variant">
          By creating an account, you agree to our Terms of Service and Privacy Policy.
        </div>
      </div>
    </div>
  );
};
