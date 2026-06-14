import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  showPasswordToggle?: boolean;
}

export function Input({ className = '', type, showPasswordToggle, ...props }: InputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  if (isPassword && showPasswordToggle) {
    return (
      <div className={styles.wrapper}>
        <input
          className={`${styles.root} ${styles.withToggle} ${className}`}
          type={inputType}
          {...props}
        />
        <button
          type="button"
          className={styles.toggle}
          onClick={() => setShowPassword(!showPassword)}
          tabIndex={-1}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
    );
  }

  return <input className={`${styles.root} ${className}`} type={type} {...props} />;
}
