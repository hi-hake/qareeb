import { useState, useRef, Fragment } from 'react';
import { Art } from './Art';
import { Icon } from './Icon';
import { PriceRow } from './PriceRow';
import { PN, PU } from '../data/catalog';
import { fmt } from '../lib/utils';

export function ProductCard({ data, index, loading, lang, t, onAdd, onCompare }){
  const p = data.product;
  const [added, setAdded] = useState(false);
  const tm = useRef();
  const handleAdd = () => {
    onAdd(data);
    setAdded(true);
    clearTimeout(tm.current);
    tm.current = setTimeout(()=>setAdded(false), 1300);
  };
  return (
    <article className="card rise" style={{ animationDelay: (index*70)+'ms' }}>
      <div className="cardtop px-5 pt-5 pb-4">
        <div className="h-36 grid place-items-center"><Art id={p.id} className="h-32 w-auto"/></div>
        <h3 className="mt-3 font-semibold text-[15.5px] leading-snug" style={{color:'#143049'}}>
          {PN(p,lang)} <span className="text-[12px] font-medium" style={{color:'#5B7488'}}>· {PU(p,lang)}</span>
        </h3>
        <p className="mt-1 text-[13px] font-bold" style={{color:'#0F6E8C'}}>{t('card.from',{p:fmt(data.from!=null?data.from:p.price,lang)})}</p>
      </div>
      <div className="p-4 pt-3.5 flex flex-col gap-3 flex-1">
        <div className="flex items-center gap-1.5 lblup text-dim"><Icon name="map-pin" size={12} className="text-teal"/>{t('card.nearby')}</div>
        <div>
          {loading
            ? [66,54,60].map((w,i)=><div key={i} className="py-2.5"><span className="skel block" style={{width:w+'%'}}/></div>)
            : data.listed.map(e=><PriceRow key={e.store.id} e={e} isBest={e===data.best} lang={lang} t={t}/>)}
        </div>
        <div className="mt-auto flex gap-2">
          <button onClick={handleAdd} disabled={!data.best || loading} className="btn-primary flex-1 h-10">
            {added
              ? <Fragment><Icon name="check" size={15} sw={2.6}/>{t('card.added')}</Fragment>
              : <Fragment><Icon name="shopping-basket" size={15}/>{t('card.addCheapest')}
                  {data.best && <span className="tabular-nums opacity-75">· {fmt(data.best.price,lang)}</span>}</Fragment>}
          </button>
          <button onClick={()=>onCompare(data)} className="btn-ghost h-10 px-3" title={t('card.compare')}>
            <Icon name="scale" size={15}/>
            <span className="hidden sm:inline">{t('card.compare')}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
