import { cn } from '../../lib/utils';

export function Modal({ open, onClose, children, maxW='max-w-lg' }){
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-[#020609]/70 backdrop-blur-sm" onClick={onClose}/>
      <div className={cn('relative w-full rise', maxW)}>{children}</div>
    </div>
  );
}
