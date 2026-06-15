import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import styles from './Modal.module.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className={`${styles.modal} ${isMobile ? styles.modalMobile : ''}`}
            initial={isMobile ? { y: '100%' } : { opacity: 0, scale: 0.95, y: '-50%', x: '-50%' }}
            animate={isMobile ? { y: 0 } : { opacity: 1, scale: 1, y: '-50%', x: '-50%' }}
            exit={isMobile ? { y: '100%' } : { opacity: 0, scale: 0.95, y: '-50%', x: '-50%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className={styles.header}>
              <h3 className={styles.title}>{title}</h3>
              <button className={styles.closeBtn} onClick={onClose} type="button">
                <X size={20} />
              </button>
            </div>

            <div className={styles.content}>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
