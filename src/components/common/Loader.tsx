import { cn } from '@/utils/cn';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white' | 'secondary';
  fullScreen?: boolean;
  text?: string;
}

const Loader = ({
  size = 'md',
  color = 'primary',
  fullScreen = false,
  text,
}: LoaderProps) => {
  const sizes = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  const colors = {
    primary: 'border-primary-600 border-t-transparent',
    white: 'border-white border-t-transparent',
    secondary: 'border-secondary-600 border-t-transparent',
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={cn(
          'rounded-full animate-spin',
          sizes[size],
          colors[color]
        )}
      />
      {text && (
        <p
          className={cn(
            'text-sm font-medium',
            color === 'white' ? 'text-white' : 'text-secondary-600'
          )}
        >
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default Loader;
