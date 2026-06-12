import styles from './FormError.module.css';

interface FormErrorProps {
  message: string;
  className?: string;
}

export function FormError({ message, className = '' }: FormErrorProps) {
  return (
    <div className={`${styles.root} ${className}`} role="alert">
      <span className={styles.message}>{message}</span>
    </div>
  );
}
