import { Icon } from './Icon';
import { cn } from '../lib/utils';

/* التنبيهات — على مستوى كل الصفحات */
export function ToastStack({ toasts, lang }){
  return (
    <div className={cn('fixed bottom-5 z-[95] flex flex-col gap-2 w-[min(92vw,370px)]', lang==='ar'?'left-5':'right-5')}>
      {toasts.map(to=>(
        <div key={to.id} className="toast">
          <span className={cn('ti','ti-'+to.kind)}>
            <Icon name={to.kind==='success'?'check':to.kind==='warn'?'alert-triangle':'info'} size={14}/>
          </span>
          <span className="text-[13px] text-txt leading-snug">{to.msg}</span>
        </div>
      ))}
    </div>
  );
}
