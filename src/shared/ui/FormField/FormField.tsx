import React from 'react';
import { Input } from '../Input/Input';
import { Label } from '../Label/Label';
import styles from './FormField.module.css';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  containerClassName?: string;
  showPasswordToggle?: boolean;
}

export function FormField({
  label,
  error,
  required,
  containerClassName = '',
  showPasswordToggle,
  ...props
}: FormFieldProps) {
  return (
    <div className={`${styles.root} ${containerClassName}`}>
      <Label className={styles.label} required={required}>
        {label}
      </Label>
      <Input required={required} showPasswordToggle={showPasswordToggle} {...props} />
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
}
