import type { ReactNode } from 'react';
import { Typography } from 'antd';
import styles from './OperationalPage.module.css';

const { Paragraph, Title } = Typography;

interface OperationalPageProps {
  /**
   * Primary page title.
   */
  title: string;
  /**
   * Short operational context below the title.
   */
  subtitle?: string;
  /**
   * Compact controls shown in the page header.
   */
  actions?: ReactNode;
  /**
   * Status strip shown below the page header.
   */
  stateStrip?: ReactNode;
  /**
   * Main workflow content.
   */
  children: ReactNode;
}

/**
 * Provides the dense operational page frame used by the shared style.
 */
export default function OperationalPage({ title, subtitle, actions, stateStrip, children }: OperationalPageProps) {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <div>
            <Title className={styles.title} level={2}>
              {title}
            </Title>
            {subtitle ? <Paragraph className={styles.subtitle}>{subtitle}</Paragraph> : null}
          </div>
          {actions ? <div className={styles.actions}>{actions}</div> : null}
        </header>
        {stateStrip ? <section className={styles.stateStrip}>{stateStrip}</section> : null}
        <section className={styles.content}>{children}</section>
      </div>
    </main>
  );
}
