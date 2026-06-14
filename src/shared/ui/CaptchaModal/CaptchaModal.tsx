import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ReCAPTCHA from 'react-google-recaptcha';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { Drawer } from '../Drawer/Drawer';
import styles from './CaptchaModal.module.css';

interface CaptchaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (token: string) => void;
  siteKey?: string;
}

export function CaptchaModal({ isOpen, onClose, onVerify, siteKey }: CaptchaModalProps) {
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isOpen && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }, [isOpen]);

  const handleRecaptchaChange = (token: string | null) => {
    if (token) {
      onVerify(token);
    }
  };

  if (typeof document === 'undefined') return null;

  const captchaContent = siteKey ? (
    <div className={styles.captchaWrapper}>
      <ReCAPTCHA
        ref={recaptchaRef}
        sitekey={siteKey}
        onChange={handleRecaptchaChange}
        theme="dark"
        size="normal"
        hl={t('shared.lang_code', 'ru')}
      />
    </div>
  ) : (
    <div className={styles.configError} role="alert">
      {t('auth.captcha_config_error', 'Captcha is not configured. Set VITE_RECAPTCHA_SITE_KEY.')}
    </div>
  );

  const hintText = (
    <p className={styles.hint}>
      {t('auth.captcha_hint', 'Это помогает нам защитить ваш аккаунт от ботов')}
    </p>
  );

  if (isMobile) {
    return (
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        title={t('auth.captcha_title', 'Подтвердите, что вы человек')}
      >
        <div className={styles.mobileContent}>
          {captchaContent}
          {hintText}
        </div>
      </Drawer>
    );
  }

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
            className={styles.modal}
            initial={{ opacity: 0, scale: 0.95, y: '-50%', x: '-50%' }}
            animate={{ opacity: 1, scale: 1, y: '-50%', x: '-50%' }}
            exit={{ opacity: 0, scale: 0.95, y: '-50%', x: '-50%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className={styles.header}>
              <h3 className={styles.title}>{t('auth.captcha_title', 'Подтвердите, что вы человек')}</h3>
              <button className={styles.closeBtn} onClick={onClose} type="button">
                <X size={20} />
              </button>
            </div>

            <div className={styles.content}>
              {captchaContent}
              {hintText}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
