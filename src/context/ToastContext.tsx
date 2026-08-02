import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

type ToastType = 'success' | 'error';
interface Toast { id: string; message: string; type: ToastType; }
interface ToastCtx { push: (message: string, type?: ToastType) => void; }

const Ctx = createContext<ToastCtx | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3800);
  }, []);

  const remove = (id: string) => setToasts((t) => t.filter((x) => x.id !== id));

  return (
    <Ctx.Provider value={{ push }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2.5 w-[min(92vw,360px)]">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="glass card animate-scale-in flex items-start gap-3 p-3.5 shadow-xl"
          >
            {t.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" style={{ color: 'rgb(16 185 129)' }} />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: 'rgb(239 68 68)' }} />
            )}
            <p className="text-sm flex-1" style={{ color: 'rgb(var(--text))' }}>{t.message}</p>
            <button onClick={() => remove(t.id)} className="transition-colors" style={{ color: 'rgb(var(--text-faint))' }}>
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export function useToast() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useToast must be used within ToastProvider');
  return c;
}
