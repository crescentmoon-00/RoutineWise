import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_BASE}/auth/request-password-reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to request password reset');
      }

      setIsSubmitted(true);
    } catch (err) {
      setError('Failed to request password reset. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black text-primary mb-2">RoutineWise</h1>
          </div>

          <div className="bg-surface-container-lowest rounded-[1rem] p-8 shadow-[0_20px_50px_rgba(47,92,155,0.1)] text-center">
            <div className="w-16 h-16 bg-secondary_container/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">✉️</span>
            </div>

            <h2 className="text-2xl font-bold text-on-surface mb-2">Check your email</h2>

            <p className="text-on-surface-variant mb-6">
              We've sent a password reset link to <strong>{email}</strong> if an account exists with this email.
            </p>

            <p className="text-sm text-on-surface-variant mb-6">
              Didn't receive the email? Check your spam folder or{' '}
              <button
                onClick={() => setIsSubmitted(false)}
                className="text-primary hover:text-primary_container font-medium"
              >
                try again
              </button>
            </p>

            <Link to="/login">
              <Button variant="secondary" size="lg" className="w-full">
                Back to sign in
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Branding */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-primary mb-2">RoutineWise</h1>
        </div>

        {/* Forgot Password Card */}
        <div className="bg-surface-container-lowest rounded-[1rem] p-8 shadow-[0_20px_50px_rgba(47,92,155,0.1)]">
          <h2 className="text-2xl font-bold text-on-surface mb-2">Reset your password</h2>
          <p className="text-on-surface-variant mb-6">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-error-container/30 text-error rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              label="Email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send reset link'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-primary hover:text-primary_container font-medium transition-colors"
            >
              ← Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
