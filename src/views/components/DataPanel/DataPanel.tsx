import type { ReactNode } from 'react';
import { Spin } from 'antd';
import styles from './DataPanel.module.css';

type DataPanelStateType = 'disabled' | 'empty' | 'error' | 'loading';

interface DataPanelState {
  type: DataPanelStateType;
  title: string;
  description?: string;
}

interface DataPanelProps {
  /**
   * Optional class hook for page-level sizing without changing panel semantics.
   */
  className?: string;
  /**
   * Panel heading.
   */
  title: string;
  /**
   * Secondary metadata below the title.
   */
  meta?: string;
  /**
   * Compact action controls.
   */
  actions?: ReactNode;
  /**
   * Optional state override for loading, empty, error, or disabled panels.
   */
  state?: DataPanelState;
  /**
   * Main panel content.
   */
  children?: ReactNode;
  /**
   * Optional class hook for scrollable or full-height panel bodies.
   */
  bodyClassName?: string;
  /**
   * Optional panel footer metadata.
   */
  footer?: ReactNode;
}

/**
 * Dense operational panel with explicit lifecycle states.
 */
export default function DataPanel({
  className,
  title,
  meta,
  actions,
  state,
  children,
  bodyClassName,
  footer,
}: DataPanelProps) {
  const isDisabled = state?.type === 'disabled';

  return (
    <article className={`${styles.panel} ${isDisabled ? styles.disabled : ''} ${className ?? ''}`}>
      <header className={styles.header}>
        <div>
          <h3 className={styles.title}>{title}</h3>
          {meta ? <div className={styles.meta}>{meta}</div> : null}
        </div>
        {actions ? <div className={styles.actions}>{actions}</div> : null}
      </header>
      <div className={`${styles.body} ${bodyClassName ?? ''}`}>{state ? <PanelState state={state} /> : children}</div>
      {footer ? <footer className={styles.footer}>{footer}</footer> : null}
    </article>
  );
}

function PanelState({ state }: { state: DataPanelState }) {
  return (
    <div className={`${styles.state} ${state.type === 'error' ? styles.error : ''}`} role="status">
      <div>
        {state.type === 'loading' ? <Spin size="small" /> : null}
        <span className={styles.stateTitle}>{state.title}</span>
        {state.description ? <span className={styles.stateDescription}>{state.description}</span> : null}
      </div>
    </div>
  );
}
