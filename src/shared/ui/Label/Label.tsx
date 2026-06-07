import styles from './Label.module.css';
import type { ReactNode } from 'react';

interface LabelProps {
  children: ReactNode;
  required?: boolean;
  className?: string;
}

export function Label({ children, required, className = '' }: LabelProps) {
  return (
    <label className={`${styles.root} ${className}`}>
      {children}
      {required && <span className={styles.required}>*</span>}
    </label>
  );
}
