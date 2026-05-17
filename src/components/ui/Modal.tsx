import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import './Modal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message?: string;
  children?: React.ReactNode;
  confirmText?: string;
  hideCancel?: boolean;
}

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  children,
  confirmText = 'Confirm', 
  hideCancel = false 
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-overlay" onClick={onClose}>
          <motion.div 
            className="modal-content"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close-x" onClick={onClose} aria-label="Close modal">
              <X size={20} />
            </button>
            <h2>{title}</h2>
            {message && <p>{message}</p>}
            {children}
            <div className="modal-actions">
              {!hideCancel && (
                <button className="modal-btn-cancel" onClick={onClose}>
                  Cancel
                </button>
              )}
              <button className="modal-btn-confirm" onClick={onConfirm}>
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
