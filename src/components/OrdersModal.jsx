import { useState, useEffect } from 'react';
import { Icon } from './Icon';
import { Modal } from './ui/Modal';
import { fmt } from '../lib/utils';

export function OrdersModal({ open, onClose, orders, lang, t }){
  const [,setTick]=useState(0);
  useEffect(()=>{ if(!open) return; const i=setInterval(()=>setTick(x=>x+1),30000); return ()=>clearInterval(i); },[open]);
  if(!open) return null;
  const st=o=>{ const m=(Date.now()-o.ts)/60000; return m<3?'prep':m<15?'way':'done'; };
  const stColor={prep:'#FFB020',way:'#2ACFEA',done:'#2ED37C'};
  return (
    <Modal open onClose={onClose} maxW="max-w-md">
      <div className="modal-card">
        <div className="flex items-start justify-between">
          <div><div className="eyebrow">{t('orders.eyebrow')}</div><h3 className="text-xl font-bold text-txt mt-1">{t('orders.title')}</h3></div>
          <button onClick={onClose} className="ibtn" aria-label={t('co.close')}><Icon name="x" size={17}/></button>
        </div>
        {orders.length===0 ? (
          <div className="text-center py-10">
            <div className="w-14 h-14 mx-auto rounded-full bg-teal/10 text-teal grid place-items-center"><Icon name="package" size={24}/></div>
            <p className="text-dim text-sm mt-4">{t('orders.empty')}</p>
          </div>
        ) : (
          <div className="mt-5 space-y-3 max-h-[55vh] overflow-y-auto">
            {orders.map(o=>{
              const s=st(o);
              return (
                <div key={o.id+o.ts} className="border rounded-xl p-4" style={{borderColor:'var(--line)'}}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-txt tabular-nums">{o.id}</span>
                    <span className="text-[10.5px] font-bold rounded-full px-2.5 py-1"
                      style={{color:stColor[s],background:'color-mix(in srgb,'+stColor[s]+' 14%, transparent)'}}>{t('orders.'+s)}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11.5px] text-dim mt-1.5">
                    <span>{new Date(o.ts).toLocaleString(lang==='ar'?'ar-EG':'en-GB',{dateStyle:'medium',timeStyle:'short'})}</span>
                    <span className="tabular-nums">{t('orders.items',{n:o.items})}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2.5">
                    <span className="text-[11.5px] text-dim flex items-center gap-1.5"><Icon name="credit-card" size={12}/><span dir="ltr" className="tabular-nums">{o.card}</span></span>
                    <span className="text-sm font-bold text-teal tabular-nums">{fmt(o.total,lang)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
}
