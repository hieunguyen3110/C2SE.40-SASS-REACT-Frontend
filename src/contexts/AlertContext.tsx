import React, { createContext, useContext, useState, ReactNode } from 'react';
import AlertModal from '../components/AlertModal/AlertModal';

type AlertContextType = {
  alert: (options: {
    title?: string;
    content: ReactNode;
    onConfirm?: () => void;
    confirmText?: string;
  }) => void;
};

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('Alert');
  const [content, setContent] = useState<ReactNode>(null);
  const [onConfirmAction, setOnConfirmAction] = useState<(() => void) | undefined>(undefined);
  const [confirmText, setConfirmText] = useState('OK');

  const alert = ({
    title = 'Alert',
    content,
    onConfirm,
    confirmText = 'OK',
  }: {
    title?: string;
    content: ReactNode;
    onConfirm?: () => void;
    confirmText?: string;
  }) => {
    setTitle(title);
    setContent(content);
    setOnConfirmAction(() => onConfirm);
    setConfirmText(confirmText);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleConfirm = () => {
    if (onConfirmAction) {
      onConfirmAction();
    }
    closeModal();
  };

  return (
    <AlertContext.Provider value={{ alert }}>
      {children}
      <AlertModal
        isOpen={isOpen}
        onClose={closeModal}
        title={title}
        content={content}
        onConfirm={onConfirmAction ? handleConfirm : undefined}
        confirmText={confirmText}
      />
    </AlertContext.Provider>
  );
};

export const useAlert = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
}; 