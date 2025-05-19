
import { AnimatePresence, motion } from 'framer-motion';
import { Terminal } from 'lucide-react';
import React, { createContext, useContext, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';

export type AlertType = 'info' | 'success' | 'warning' | 'error';

interface AlertState {
  title: string;
  visible: boolean;
  message: string;
  type: AlertType;
}

interface AlertContextProps {
  showAlert: (params: {
    title: string;
    message: string;
    type?: AlertType;
  }) => void;
}

const AlertContext = createContext<AlertContextProps | undefined>(undefined);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alert, setAlert] = useState<AlertState>({
    visible: false,
    title: '',
    message: '',
    type: 'info',
  });

  const showAlert = ({ title, message, type = 'info' }: Partial<AlertState>) => {
    setAlert({ visible: true, title: title || "", message: message || "", type });
    setTimeout(() => setAlert((prev) => ({ ...prev, visible: false })), 3000);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <AnimatePresence>
        {alert.visible && (
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed top-4 right-0 w-full max-w-md px-4 z-[5000]"
          >
            <Alert variant={alert.type}>
              <Terminal className="h-4 w-4" />
              <AlertTitle>{alert.title}</AlertTitle>
              <AlertDescription>{alert.message}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>
    </AlertContext.Provider>
  );
};

export const useAlert = (): AlertContextProps => {
  const context = useContext(AlertContext);
  if (!context) throw new Error('useAlert must be used within an AlertProvider');
  return context;
};
