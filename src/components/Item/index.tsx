import React from 'react';
import styles from './styles.module.css';
import { cn } from '@/lib/utils';

interface ItemProps {
  title: string;
  value?: string | number;
  description?: string;
  meta?: React.ReactNode;
  tag?: string;
  status?: 'pending' | 'processed' | 'reimbursed';
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

const Item: React.FC<ItemProps> = ({
  title,
  value,
  description,
  meta,
  tag,
  status,
  onClick,
  className,
  children,
}) => {
  return (
    <div 
      className={cn(styles.item, className)}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        {value && <div className={styles.value}>{value}</div>}
      </div>
      
      {description && <div className={styles.description}>{description}</div>}
      
      {children}
      
      <div className={styles.meta}>
        {tag && <span className={styles.tag}>{tag}</span>}
        {status && (
          <span className={cn(styles.tag, styles[status])}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        )}
        {meta}
      </div>
    </div>
  );
};

export default Item;
