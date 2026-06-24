import type { ReactNode } from 'react';
import styles from './Badge.module.css';

type BadgeVariant = 'neutral' | 'success' | 'warning' | 'danger' | 'info';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
}

export function Badge({ children, variant = 'neutral', size = 'md', className = '' }: BadgeProps) {
  return (
    <span className={`${styles.root} ${styles[variant]} ${styles[size]} ${className}`.trim()}>
      {children}
    </span>
  );
}
