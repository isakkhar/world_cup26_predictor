import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Modal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  hideCancel?: boolean;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', hideCancel = false }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            <motion.div 
              className="modal-container"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2>{title}</h2>
              <p>{message}</p>
              <div className="modal-actions">
                {!hideCancel && <button className="modal-btn-secondary" onClick={onClose}>Cancel</button>}
                <button className="modal-btn-primary" onClick={onConfirm}>{confirmText}</button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
