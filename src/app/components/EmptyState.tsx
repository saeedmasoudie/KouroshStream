import React from "react";
import { Search, Database, AlertCircle } from "lucide-react";
import { useLanguage } from "@/app/context/LanguageContext";
import { motion as Motion } from "motion/react";

interface EmptyStateProps {
  type?: "search" | "filter" | "data" | "error";
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({ type = "data", message, action }) => {
  const { t } = useLanguage();

  const getIcon = () => {
    switch (type) {
      case "search":
        return <Search className="w-16 h-16 text-gray-700 mb-6" />;
      case "filter":
        return <AlertCircle className="w-16 h-16 text-gray-700 mb-6" />;
      case "error":
        return <AlertCircle className="w-16 h-16 text-red-500/50 mb-6" />;
      default:
        return <Database className="w-16 h-16 text-gray-700 mb-6" />;
    }
  };

  const defaultMessage = {
    search: t("noResults") || "No results found for your search.",
    filter: t("noResults") || "No items match your filters.",
    data: "No data available at the moment.",
    error: "An error occurred while loading data.",
  }[type];

  return (
    <Motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 px-6 text-center bg-white/5 border border-white/10 rounded-[2rem] backdrop-blur-sm"
    >
      {getIcon()}
      <h3 className="text-xl font-bold text-gray-400 mb-2">
        {message || defaultMessage}
      </h3>
      <p className="text-gray-500 max-w-sm mx-auto mb-8">
        {type === "search" 
          ? "Try adjusting your keywords or check for spelling errors." 
          : "Check back later or try a different category."}
      </p>
      
      {action && (
        <button
          onClick={action.onClick}
          className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
        >
          {action.label}
        </button>
      )}
    </Motion.div>
  );
};
