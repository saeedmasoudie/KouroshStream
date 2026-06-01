import React, { useState } from 'react';
import { Button } from './ui/button';
import { CheckCircle2 } from 'lucide-react';

interface MockCaptchaProps {
  onVerify: (token: string) => void;
  className?: string;
}

/**
 * Mock Captcha Component for Demo Purposes
 *
 * This is a simple checkbox-based captcha replacement for demonstration.
 * In production, replace this with a real captcha solution like:
 * - Cloudflare Turnstile
 * - Google reCAPTCHA
 * - hCaptcha
 * - Custom verification system
 */
export const MockCaptcha: React.FC<MockCaptchaProps> = ({ onVerify, className = '' }) => {
  const [verified, setVerified] = useState(false);

  const handleVerify = () => {
    setVerified(true);
    // Generate a mock token for demo purposes
    const mockToken = `demo_token_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    onVerify(mockToken);
  };

  return (
    <div className={`border border-gray-300 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900 ${className}`}>
      {!verified ? (
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="mock-captcha-checkbox"
            onChange={handleVerify}
            className="w-5 h-5 cursor-pointer"
          />
          <label htmlFor="mock-captcha-checkbox" className="cursor-pointer text-sm">
            I'm not a robot (Demo Mode)
          </label>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-sm">Verified ✓</span>
        </div>
      )}
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        Demo captcha for testing. Replace with real captcha in production.
      </p>
    </div>
  );
};
