import { forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useUIStore, type Toast as ToastType } from '@/store/uiStore';
import { cn } from '@/utils/cn';

const ToastIcon = ({ type }: { type: ToastType['type'] }) => {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  };

  return icons[type];
};

const ToastItem = forwardRef<HTMLDivElement, { toast: ToastType }>(({ toast }, ref) => {
  const { removeToast } = useUIStore();

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200',
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border',
        'min-w-[300px] max-w-md',
        bgColors[toast.type]
      )}
    >
      <ToastIcon type={toast.type} />
      <p className="flex-1 text-sm text-secondary-800">{toast.message}</p>
      <button
        onClick={() => removeToast(toast.id)}
        className="p-1 rounded hover:bg-black/5 transition-colors"
      >
        <X className="w-4 h-4 text-secondary-500" />
      </button>
    </motion.div>
  );
});

ToastItem.displayName = 'ToastItem';

const ToastContainer = () => {
  const { toasts } = useUIStore();

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
