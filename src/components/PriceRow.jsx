import { Icon } from './Icon';
import { cn, fmt } from '../lib/utils';

export function PriceRow({ e, isBest, lang, t }){
  const s = e.store;
  return (
    <div className="prow">
      <div className="flex items-center gap-2 min-w-0">
        {s.registered
          ? <span title={t('card.reg')} className="text-teal shrink-0"><Icon name="badge-check" size={14}/></span>
          : <Icon name="store" size={13} className={isBest?'text-best':'text-dim'}/>}
        <span className={cn('text-[13px] truncate', s.registered?'text-teal font-semibold':'text-txt')}>{s.name}</span>
        <span className="text-[11px] text-dim shrink-0 tabular-nums">{s.distance.toFixed(1)} {t('unit.km')}</span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {isBest && <span className="badge-best">{t('card.best')}</span>}
        {e.inStock
          ? <span className={cn('text-[13px] font-semibold tabular-nums', isBest ? 'text-best' : 'text-txt')}>{fmt(e.price, lang)}</span>
          : <span className="text-[11px] text-dim">{t('card.out')}</span>}
      </div>
    </div>
  );
}
