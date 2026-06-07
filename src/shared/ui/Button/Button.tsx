import type { ButtonHTMLAttributes, ReactNode, ElementType } from 'react';
import styles from './Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  children: ReactNode;
  as?: ElementType;
  [key: string]: any;
}

export function Button({
  children,
  variant = 'primary',
  size = 'medium',
  className = '',
  as: Component = 'button',
  ...props
}: ButtonProps) {
  return (
    <Component
      className={`${styles.root} ${styles[variant]} ${styles[size]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
