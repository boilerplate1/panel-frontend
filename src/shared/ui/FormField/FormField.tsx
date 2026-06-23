import React from 'react';
import { Input } from '../Input/Input';
import { Label } from '../Label/Label';
import styles from './FormField.module.css';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  containerClassName?: string;
  showPasswordToggle?: boolean;
}

export function FormField({
  label,
  error,
  hint,
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
      {hint && <div className={styles.hint}>{hint}</div>}
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
}
