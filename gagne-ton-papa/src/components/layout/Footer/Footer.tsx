// src/components/layout/Footer/Footer.tsx

import styles from './Footer.module.css'

interface FooterProps {
  onRestart: () => void
  onHint: () => void
}

export function Footer({ onRestart, onHint }: FooterProps) {
  return (
    <footer className={styles.footer}>
      <button
        className={`${styles.btn} ${styles.restart}`}
        onClick={onRestart}
        aria-label="Recommencer"
      >
        <span className={styles.icon}>↺</span>
        <span className={styles.label}>RECOMMENCER</span>
      </button>

      <button
        className={`${styles.btn} ${styles.hint}`}
        onClick={onHint}
        aria-label="Indice"
      >
        <span className={styles.icon}>💡</span>
        <span className={styles.label}>INDICE</span>
      </button>
    </footer>
  )
}
