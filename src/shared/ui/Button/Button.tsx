import type { ButtonHTMLAttributes, ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import styles from './Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'accentSoft';
  size?: 'small' | 'medium' | 'large';
  children: ReactNode;
  as?: ElementType;
}

export function Button({
  children,
  variant = 'primary',
  size = 'medium',
  className = '',
  as: Component = 'button',
  ...props
}: ButtonProps & ComponentPropsWithoutRef<ElementType>) {
  return (
    <Component
      className={`${styles.root} ${styles[variant]} ${styles[size]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
