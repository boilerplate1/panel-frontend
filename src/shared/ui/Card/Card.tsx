import React from 'react';
import styles from './Card.module.css';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'glass' | 'outline' | 'flat';
  padding?: 'none' | 'small' | 'medium' | 'large';
  onClick?: () => void;
}

export function Card({
  children,
  className = '',
  variant = 'flat',
  padding = 'medium',
  onClick,
}: CardProps) {
  const rootClasses = [
    styles.root,
    styles[variant],
    styles[`padding-${padding}`],
    onClick ? styles.clickable : '',
    className,
  ].join(' ');

  return (
    <div className={rootClasses} onClick={onClick}>
      {children}
    </div>
  );
}

export default Card;
