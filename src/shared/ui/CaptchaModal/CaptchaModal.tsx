import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Turnstile from 'react-turnstile';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import styles from './CaptchaModal.module.css';

interface CaptchaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (token: string) => void;
  siteKey: string;
}

export function CaptchaModal({ isOpen, onClose, onVerify, siteKey }: CaptchaModalProps) {
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Use portal to render at the end of document body
  if (typeof document === 'undefined') return null;

  const content = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal / BottomSheet Container */}
          <motion.div
            className={isMobile ? styles.bottomSheet : styles.modal}
            initial={isMobile ? { y: '100%' } : { opacity: 0, scale: 0.95, y: '-50%', x: '-50%' }}
            animate={isMobile ? { y: 0 } : { opacity: 1, scale: 1, y: '-50%', x: '-50%' }}
            exit={isMobile ? { y: '100%' } : { opacity: 0, scale: 0.95, y: '-50%', x: '-50%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className={styles.header}>
              <h3 className={styles.title}>{t('auth.captcha_title', 'Подтвердите, что вы человек')}</h3>
              <button className={styles.closeBtn} onClick={onClose}>
                <X size={20} />
              </button>
            </div>

            <div className={styles.content}>
              <div className={styles.captchaWrapper}>
                <Turnstile
                  sitekey={siteKey}
                  onVerify={onVerify}
                  theme="dark"
                  language={t('shared.lang_code', 'ru')}
                />
              </div>
              <p className={styles.hint}>
                {t('auth.captcha_hint', 'Это помогает нам защитить ваш аккаунт от ботов')}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(content, document.body);
}
