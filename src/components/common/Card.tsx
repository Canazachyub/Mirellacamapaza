import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = ({
  children,
  hover = false,
  padding = 'md',
  className,
  ...props
}: CardProps) => {
  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-4 md:p-6',
    lg: 'p-6 md:p-8',
  };

  return (
    <div
      className={cn(
        'bg-white rounded-xl shadow-lg overflow-hidden',
        hover && 'hover:shadow-xl transition-shadow duration-300',
        paddings[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const CardHeader = ({ children, className, ...props }: CardHeaderProps) => {
  return (
    <div
      className={cn('border-b border-secondary-200 pb-4 mb-4', className)}
      {...props}
    >
      {children}
    </div>
  );
};

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4';
}

export const CardTitle = ({
  children,
  as: Component = 'h3',
  className,
  ...props
}: CardTitleProps) => {
  return (
    <Component
      className={cn('text-lg font-semibold text-secondary-900', className)}
      {...props}
    >
      {children}
    </Component>
  );
};

interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
}

export const CardDescription = ({
  children,
  className,
  ...props
}: CardDescriptionProps) => {
  return (
    <p className={cn('text-sm text-secondary-600 mt-1', className)} {...props}>
      {children}
    </p>
  );
};

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const CardContent = ({ children, className, ...props }: CardContentProps) => {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  );
};

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const CardFooter = ({ children, className, ...props }: CardFooterProps) => {
  return (
    <div
      className={cn('border-t border-secondary-200 pt-4 mt-4', className)}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
