/**
 * Honeypot utilities for spam prevention
 * Honeypots are hidden fields that humans can't see but bots will fill
 */

import React, { useState } from 'react';

/**
 * Generate a honeypot field name that looks legitimate to bots
 */
export const generateHoneypotFieldName = (): string => {
  const fieldNames = [
    'website',
    'url',
    'homepage',
    'email_confirm',
    'phone_number',
    'company',
    'address',
  ];
  return fieldNames[Math.floor(Math.random() * fieldNames.length)];
};

/**
 * Check if honeypot was triggered (field filled by bot)
 */
export const isHoneypotTriggered = (honeypotValue: string): boolean => {
  return honeypotValue !== '' && honeypotValue !== null && honeypotValue !== undefined;
};

/**
 * React hook for honeypot field
 */
export const useHoneypot = () => {
  const [honeypotValue, setHoneypotValue] = useState('');
  const [honeypotField] = useState(generateHoneypotFieldName());

  const isBot = isHoneypotTriggered(honeypotValue);

  return {
    honeypotField,
    honeypotValue,
    setHoneypotValue,
    isBot,
  };
};

/**
 * Honeypot input component (invisible to humans, visible to bots)
 */
interface HoneypotInputProps {
  fieldName: string;
  value: string;
  onChange: (value: string) => void;
}

export const HoneypotInput: React.FC<HoneypotInputProps> = ({
  fieldName,
  value,
  onChange,
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: '-9999px',
        width: '1px',
        height: '1px',
        opacity: 0,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
      tabIndex={-1}
    >
      <label htmlFor={fieldName}>Leave this field empty</label>
      <input
        type="text"
        id={fieldName}
        name={fieldName}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
        tabIndex={-1}
      />
    </div>
  );
};

/**
 * Time-based spam detection
 * Bots typically fill forms too quickly
 */
export const useFormTimingCheck = (minimumTimeMs: number = 3000) => {
  const [formStartTime] = useState(Date.now());

  const isSubmittedTooQuickly = (): boolean => {
    const elapsedTime = Date.now() - formStartTime;
    return elapsedTime < minimumTimeMs;
  };

  return { isSubmittedTooQuickly };
};

/**
 * Browser fingerprint check (very basic, not foolproof)
 */
export const getBrowserFingerprint = (): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return 'unknown';

  ctx.textBaseline = 'top';
  ctx.font = '14px Arial';
  ctx.fillText('Browser fingerprint', 2, 2);

  return canvas.toDataURL().slice(-50);
};

/**
 * Check for suspicious behavior patterns
 */
export const isSuspiciousBehavior = (formData: {
  submissionTime: number;
  honeypotTriggered: boolean;
  fingerprintChanged: boolean;
}): boolean => {
  return (
    formData.honeypotTriggered ||
    formData.submissionTime < 2000 ||
    formData.fingerprintChanged
  );
};
