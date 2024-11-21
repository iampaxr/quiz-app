import { useTheme } from "@/components/context/ThemeContext";
import React from "react";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

const Dialog: React.FC<DialogProps> = ({ isOpen, onClose, title, content }) => {
  const { isDarkTheme } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`${isDarkTheme ? "bg-gray-800 text-white" : "bg-white text-gray-800"} p-6 rounded-lg max-w-md w-full`}
      >
        <h2
          className={`text-xl font-bold mb-4 ${isDarkTheme ? "text-white" : "text-gray-900"}`}
        >
          {title}
        </h2>
        <p className={isDarkTheme ? "text-gray-300" : "text-gray-600"}>
          {content}
        </p>
        <button
          className={`mt-4 px-4 py-2 rounded transition-colors duration-200 ${
            isDarkTheme
              ? "bg-blue-700 text-white hover:bg-blue-600"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Dialog;
