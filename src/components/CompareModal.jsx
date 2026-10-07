import { Icon } from './Icon';
import { Modal } from './ui/Modal';
import { PN } from '../data/catalog';
import { save } from '../lib/storage';
import { cn, fmt } from '../lib/utils';

export function CompareModal({ data, lang, t, onClose, onAdd }){
  if (!data) return null;
  const p = data.product;
  const avail = data.entries.filter(e=>e.inStock).sort((a,b)=>a.price-b.price);
  const oos = data.entries.filter(e=>!e.inStock);
  const max = avail.length ? avail[avail.length-1].price : 1;
  const save = data.best ? Math.round((max - data.best.price)*100)/100 : 0;
  return (
    <Modal open onClose={onClose} maxW="max-w-xl">
      <div className="modal-card">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="eyebrow">{lang==='ar'?'محرك المقارنة':'PRICE ENGINE'}</div>
            <h3 className="text-xl font-bold text-txt mt-1">{t('cmp.title',{n:PN(p,lang)})}</h3>
          </div>
          <button onClick={onClose} className="ibtn" aria-label={t('cmp.close')}><Icon name="x" size={17}/></button>
        </div>
        <div className="mt-5 space-y-4">
          {avail.map(e=>{
            const isB = e === data.best;
            return (
              <div key={e.store.id}>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    {e.store.registered && <Icon name="badge-check" size={13} className="text-teal shrink-0"/>}
                    <span className={cn('text-[13.5px] font-semibold truncate', e.store.registered?'text-teal':'text-txt')}>{e.store.name}</span>
                    <span className="flex items-center gap-1 text-[11px] text-dim shrink-0 tabular-nums">
                      <Icon name="timer" size={11}/>{e.store.eta} {t('unit.min')} · {e.store.distance.toFixed(1)} {t('unit.km')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {isB && <span className="badge-best">{t('card.best')}</span>}
                    <span className={cn('text-sm font-bold tabular-nums', isB && 'text-best')}>{fmt(e.price,lang)}</span>
                  </div>
                </div>
                <div className="bar-track"><div className={cn('bar', isB && 'bar-best')} style={{width: Math.max(8,(e.price/max)*100)+'%'}}/></div>
              </div>
            );
          })}
          {oos.map(e=>(
            <div key={'o'+e.store.id} className="flex items-center justify-between text-dim">
              <span className="text-[13px]">{e.store.name}</span>
              <span className="text-[11px]">{t('card.out')}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
          <p className="text-[12.5px] text-dim flex-1"><Icon name="badge-percent" size={13} className="text-best inline align-[-2px]"/> {t('cmp.save',{p:fmt(save,lang)})}</p>
          <button className="btn-primary h-11 px-6 w-full sm:w-auto" onClick={()=>{ onAdd(data); onClose(); }}>
            <Icon name="shopping-basket" size={15}/>{t('card.addCheapest')}
          </button>
        </div>
      </div>
    </Modal>
  );
}
