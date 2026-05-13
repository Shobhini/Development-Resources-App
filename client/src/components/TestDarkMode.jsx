import { useTheme } from '../context/ThemeContext';

const TestDarkMode = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className="fixed top-4 left-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50">
      <p className="text-black dark:text-white">
        Current mode: {isDarkMode ? 'Dark' : 'Light'}
      </p>
      <button 
        onClick={toggleTheme}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Toggle Theme
      </button>
    </div>
  );
};

export default TestDarkMode;