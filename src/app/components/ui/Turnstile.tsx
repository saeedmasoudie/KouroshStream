import React from "react";
import { MockCaptcha } from "../MockCaptcha";

interface TurnstileProps {
  siteKey: string;
  onSuccess: (token: string) => void;
  onError?: (error?: any) => void;
  onExpire?: () => void;
  theme?: 'light' | 'dark' | 'auto';
}

/**
 * Turnstile Wrapper Component (Demo Mode)
 *
 * This component wraps MockCaptcha to maintain the same API as Cloudflare Turnstile.
 * To use real Cloudflare Turnstile captcha:
 *
 * 1. Install the package: pnpm add @marsidev/react-turnstile
 * 2. Uncomment the import below and comment out MockCaptcha
 * 3. Get a site key from https://dash.cloudflare.com/?to=/:account/turnstile
 * 4. Update API_CONFIG.TURNSTILE_SITE_KEY in src/app/config/api.ts
 * 5. Uncomment the ReactTurnstile component and comment out MockCaptcha
 */

// import { Turnstile as ReactTurnstile } from "@marsidev/react-turnstile";

export const Turnstile: React.FC<TurnstileProps> = ({
  siteKey,
  onSuccess,
  onError,
  onExpire,
  theme = 'dark'
}) => {
  return (
    <div className="flex justify-center w-full">
      {/* Demo Mode: Using MockCaptcha */}
      <MockCaptcha onVerify={onSuccess} />

      {/* Production Mode: Uncomment this and comment out MockCaptcha above
      <ReactTurnstile
        siteKey={siteKey}
        onSuccess={onSuccess}
        onError={onError}
        onExpire={onExpire}
        options={{
          theme: theme,
        }}
      />
      */}
    </div>
  );
};
