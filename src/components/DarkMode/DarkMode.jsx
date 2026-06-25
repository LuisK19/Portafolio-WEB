import React, { useEffect, useState } from 'react';
import {
SunOutlined, MoonOutlined
} from '@ant-design/icons';

function DarkModeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    // Detectar preferencia del sistema o localStorage
    const saved = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (saved === 'true' || (!saved && prefersDark)) {
      document.body.classList.add('dark-mode');
      setDark(true);
    }
  }, []);

  const toggleDarkMode = () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    setDark(isDark);
    localStorage.setItem('darkMode', isDark);
  };

  return (
    <button className='dark-mode-toggle' onClick={toggleDarkMode}>
      {dark ? <SunOutlined /> : <MoonOutlined />}
    </button>
  );
}

export default DarkModeToggle;