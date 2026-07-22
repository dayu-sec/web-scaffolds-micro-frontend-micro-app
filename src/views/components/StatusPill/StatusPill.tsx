import styles from './StatusPill.module.css';

export type StatusPillTone = 'active' | 'danger' | 'disabled' | 'neutral' | 'success' | 'warning';

interface StatusPillProps {
  /**
   * Semantic state represented by the pill.
   */
  tone?: StatusPillTone;
  /**
   * Visible label so status never relies on color alone.
   */
  label: string;
  /**
   * Optional compact detail text.
   */
  detail?: string;
}

/**
 * Compact semantic status indicator with non-color state text.
 */
export default function StatusPill({ tone = 'neutral', label, detail }: StatusPillProps) {
  return (
    <span className={`${styles.pill} ${styles[tone]}`} title={detail ? `${label}: ${detail}` : label}>
      <span aria-hidden className={styles.dot} />
      <span className={styles.label}>{label}</span>
      {detail ? <span className={styles.detail}>{detail}</span> : null}
    </span>
  );
}
