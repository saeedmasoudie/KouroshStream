// Global type definitions

declare global {
  interface Window {
    turnstile?: {
      reset: () => void;
      remove: () => void;
      render: (element: HTMLElement, options: any) => string;
    };
  }
}

export {};
