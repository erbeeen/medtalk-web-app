import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import Toast from '../components/Toast';

interface ToastMessage {
  id: string;
  message: string;
  type?: 'success' | 'error';
  duration?: number;
  actionLabel?: string;
  onActionClick?: () => void;
}

interface ToastContextType {
  addToast: (message: string, options?: Omit<ToastMessage, 'id' | 'message'>) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((message: string, options?: Omit<ToastMessage, 'id' | 'message'>) => {
    const id = Math.random().toString(36).substr(2, 9); // Simple unique ID
    const newToast: ToastMessage = { id, message, duration: 2000, ...options };
    setToasts((prevToasts) => [...prevToasts, newToast]);

    // Auto-remove after duration
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, newToast.duration);
  }, []);

  const onClose = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {createPortal(
        <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2">
          {toasts.map((toast) => (
            <Toast key={toast.id} {...toast} onClose={onClose} />
          ))}
        </div>,
        document.body // Portals toasts to the body to avoid z-index issues
      )}
    </ToastContext.Provider>
  );
};
