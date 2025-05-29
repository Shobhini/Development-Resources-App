import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function Home() {
  // Remove showText state since it's not being used
  const { isDarkMode } = useTheme();

  const text = "Development Resources Hub";
  const [currentText, setCurrentText] = useState("");
  const fixedCharacter = "W";
  const [showCursor, setShowCursor] = useState(true);

  const startTypewriter = () => {
    let index = currentText.length;
    const interval = setInterval(() => {
      if (index < text.length) {
        setCurrentText(text.substring(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setCurrentText(fixedCharacter);
          startTypewriter();
        }, 500);
      }
    }, 200);
  };

  useEffect(() => {
    // Remove setShowText since we removed the state
    setCurrentText(fixedCharacter);
    startTypewriter();

    const cursorInterval = setInterval(() => {
      setShowCursor((prevShowCursor) => !prevShowCursor);
    }, 250);

    return () => {
      clearInterval(cursorInterval);
    };
  }, []);

  return (
    <div className="flex flex-col justify-start w-full">
      <motion.div
        className="flex flex-col gap-8"
        initial={{ opacity: 0, translateX: -100 }}
        animate={{ opacity: 1, translateX: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-7xl text-gray-900 dark:text-white leading-[5rem] tracking-wider drop-shadow-xl font-bold transition-colors duration-300">
          {currentText}
          {showCursor && <span className="cursor-blink">|</span>}
        </h1>
        <h2 className="text-4xl text-gray-800 dark:text-gray-200 leading-[4rem] tracking-wider drop-shadow-xl transition-colors duration-300">
          Get Empowered <span className="text-gray-700 dark:text-gray-300"> with </span> <br />
          Development 
          <br />
          <span className="text-gray-700 dark:text-gray-300"> Resources </span>
        </h2>
        <p className="text-lg w-4/5 text-gray-600 dark:text-gray-400 transition-colors duration-300">
          Explore our vast collection of web/android development resources, designed to
          give you the knowledge and tools you need to succeed in the world of development!
        </p>
      </motion.div>
    </div>
  );
}
