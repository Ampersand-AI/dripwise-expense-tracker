import React from 'react';
import { ButtonHTMLAttributes } from 'react';
import styles from './styles.module.css';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  icon?: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  icon,
  className,
  ...props
}) => {
  return (
    <button
      className={cn(
        styles.button,
        styles[variant],
        styles[size],
        className
      )}
      {...props}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
