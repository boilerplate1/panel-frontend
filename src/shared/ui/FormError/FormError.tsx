import { AlertCircle } from 'lucide-react';
import styles from './FormError.module.css';

interface FormErrorProps {
  message: string;
  className?: string;
}

export function FormError({ message, className = '' }: FormErrorProps) {
  return (
    <div className={`${styles.root} ${className}`} role="alert">
      <AlertCircle className={styles.icon} size={22} aria-hidden="true" />
      <span className={styles.message}>{message}</span>
    </div>
  );
}
