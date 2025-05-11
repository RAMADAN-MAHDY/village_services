import React from 'react';

const LanguageSwitcher: React.FC<{ languages: string[]; onSwitch: (language: string) => void }> = ({ languages, onSwitch }) => {
  return (
    <div className="language-switcher flex items-center space-x-4 p-2 bg-gray-100 rounded-md shadow-md">
      {languages?.map((language, index) => (
        <button
          key={index}
          onClick={() => onSwitch(language)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {language}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;