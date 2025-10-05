import React, { useEffect, useState } from 'react';
import { MdClose } from 'react-icons/md';

interface ToastProps {
  id: string;
  message: string;
  type?: 'success' | 'error';
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({
  id,
  message,
  type = 'success',
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    return () => clearTimeout(timeout);
  }, []);

  const transitionClasses = `
    transition-all 
    duration-300 
    ease-out
    transform
  `;

  const bgColorClass = {
    success: 'bg-primary/90',
    error: 'bg-delete/80'
  }[type];

  const visibilityClasses = isVisible
    ? 'opacity-100 translate-y-0' // End state (visible)
    : 'opacity-0 translate-y-full'; // Start state (hidden below)

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose(id);
    }, 300);
  };

  return (
    <div
      className={`
        ${bgColorClass}
        text-white px-4 py-2 rounded-md shadow-lg flex gap-2
        items-center justify-center min-w-[150px]
        ${transitionClasses} 
        ${visibilityClasses}
      `}
      role="alert"
      style={!isVisible ? { willChange: 'transform, opacity' } : {}}
    >
      <span className="text-sm">{message}</span>
      <div 
        className="p-0.5 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700/50 rounded-sm"
        onClick={handleClose}>
        <MdClose />
      </div>
    </div>
  );
};

export default Toast;
