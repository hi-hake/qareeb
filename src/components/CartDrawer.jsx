import { Fragment } from 'react';
import { Art } from './Art';
import { Icon } from './Icon';
import { PN } from '../data/catalog';
import { cn, fmt } from '../lib/utils';

export function CartDrawer({ open, onClose, cart, lang, t, chQty, removeItem, subtotal, delivery, total, onCheckout }){
  const side = lang==='ar' ? 'left-0' : 'right-0';
  const off = lang==='ar' ? '-translate-x-full' : 'translate-x-full';
  return (
    <Fragment>
      {open && <div className="fixed inset-0 z-[75] bg-[#02060B]/70 backdrop-blur-[2px]" onClick={onClose}/>}
      <div className={cn('fixed top-0 h-full w-[min(100vw,420px)] z-[80] bg-bg flex flex-col shadow-2xl transition-transform duration-300',
        side, open ? 'translate-x-0' : off)} role="dialog" aria-label={t('cart.title')}>
        <div className="flex items-center justify-between px-5 h-16 border-b" style={{borderColor:'var(--line)'}}>
          <h3 className="text-lg font-bold text-txt flex items-center gap-2"><Icon name="shopping-cart" size={18} className="text-teal"/>{t('cart.title')}</h3>
          <button onClick={onClose} className="ibtn" aria-label={t('cmp.close')}><Icon name="x" size={17}/></button>
        </div>
        {cart.length===0 ? (
          <div className="flex-1 grid place-items-center p-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-teal/10 text-teal grid place-items-center"><Icon name="shopping-basket" size={26}/></div>
              <h4 className="mt-4 text-lg font-bold text-txt">{t('cart.empty')}</h4>
              <p className="text-dim text-sm mt-1.5 max-w-[220px] mx-auto leading-relaxed">{t('cart.emptyHint')}</p>
            </div>
          </div>
        ) : (
          <Fragment>
            <div className="flex-1 overflow-y-auto px-5">
              {cart.map(it=>(
                <div key={it.key} className="flex gap-3 py-4 border-b" style={{borderColor:'var(--line)'}}>
                  <div className="cardtop w-16 h-14 rounded-lg grid place-items-center shrink-0"><Art id={it.product.id} className="h-10 w-auto"/></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-2">
                      <h5 className="text-sm font-semibold text-txt truncate">{PN(it.product,lang)}</h5>
                      <span className="text-sm text-txt tabular-nums font-semibold">{fmt(it.price*it.qty,lang)}</span>
                    </div>
                    <p className="text-xs text-dim truncate">{it.store.name} · {fmt(it.price,lang)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button className="qty-btn" onClick={()=>chQty(it.key,-1)} aria-label="إنقاص"><Icon name="minus" size={12}/></button>
                      <span className="text-sm text-txt tabular-nums w-5 text-center">{it.qty}</span>
                      <button className="qty-btn" onClick={()=>chQty(it.key,1)} aria-label="زيادة"><Icon name="plus" size={12}/></button>
                      <button className="qty-btn ms-auto" onClick={()=>removeItem(it.key)} aria-label="حذف"><Icon name="trash-2" size={13}/></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t px-5 py-4 space-y-1.5" style={{borderColor:'var(--line)'}}>
              <div className="flex justify-between text-[13px] text-dim"><span>{t('cart.subtotal')}</span><span className="tabular-nums">{fmt(subtotal,lang)}</span></div>
              <div className="flex justify-between text-[13px] text-dim"><span>{t('cart.delivery')}</span><span className="tabular-nums">{delivery===0 ? '—' : fmt(delivery,lang)}</span></div>
              {delivery>0 && <p className="text-[11px] text-dim">{t('cart.freeHint',{p:fmt(300-subtotal,lang)})}</p>}
              <div className="flex justify-between text-base font-bold text-txt pt-1.5"><span>{t('cart.total')}</span><span className="tabular-nums text-teal">{fmt(total,lang)}</span></div>
              <button className="btn-primary w-full h-11 mt-2 text-[14px]" onClick={onCheckout}>
                <Icon name={lang==='ar'?'arrow-left':'arrow-right'} size={16}/>{t('cart.checkout')}
              </button>
            </div>
          </Fragment>
        )}
      </div>
    </Fragment>
  );
}
