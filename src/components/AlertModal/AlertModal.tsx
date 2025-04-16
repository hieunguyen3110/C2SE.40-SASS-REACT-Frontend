import React from 'react';
import styles from './AlertModal.module.scss';
import { motion } from 'framer-motion';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  content: React.ReactNode;
  onConfirm?: () => void;
  confirmText?: string;
}

const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  title = 'Alert',
  content,
  onConfirm,
  confirmText = 'OK',
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <motion.div 
        className={styles.modalContainer}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      >
        <div className={styles.modalHeader}>
          <h2>{title}</h2>
          <IconButton className={styles.closeButton} onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </div>
        
        <div className={styles.modalContent}>
          {content}
        </div>
        
        <div className={styles.modalActions}>
          {onConfirm && (
            <button 
              className={styles.confirmButton} 
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          )}
          <button 
            className={styles.cancelButton} 
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AlertModal;
