import React from 'react';
import { Input } from '../Input/Input';
import { Label } from '../Label/Label';
import styles from './FormField.module.css';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  containerClassName?: string;
}

export function FormField({
  label,
  error,
  required,
  containerClassName = '',
  ...props
}: FormFieldProps) {
  return (
    <div className={`${styles.root} ${containerClassName}`}>
      <Label required={required}>{label}</Label>
      <Input required={required} {...props} />
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
}
