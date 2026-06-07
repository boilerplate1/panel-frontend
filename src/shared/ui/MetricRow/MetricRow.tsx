import styles from './MetricRow.module.css';

interface MetricRowProps {
  label: string;
  value: string;
  className?: string;
  tone?: 'surface' | 'bare';
}

export function MetricRow({ label, value, className, tone = 'surface' }: MetricRowProps) {
  return (
    <div className={`${styles.root} ${tone === 'bare' ? styles.bare : ''} ${className ?? ''}`.trim()}>
      <span className={styles.label}>{label}</span>
      <strong className={styles.value}>{value}</strong>
    </div>
  );
}
