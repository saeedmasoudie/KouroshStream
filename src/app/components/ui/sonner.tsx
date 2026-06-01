import { Toaster as Sonner, ToasterProps } from "sonner";
import { useLanguage } from "@/app/context/LanguageContext";

const Toaster = ({ ...props }: ToasterProps) => {
  const { dir } = useLanguage();

  return (
    <Sonner
      theme="dark"
      dir={dir}
      position={dir === "rtl" ? "top-left" : "top-right"}
      className="toaster group"
      toastOptions={{
        style: {
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(12px)',
          color: 'white',
        },
        className: 'rounded-xl shadow-2xl',
      }}
      {...props}
    />
  );
};

export { Toaster };
