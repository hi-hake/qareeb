import { Icon } from './Icon';
import { ProductCard } from './ProductCard';
import { merchLabel } from '../lib/i18n';
import { cn } from '../lib/utils';

/* ================= شبكة العروض ================= */
export function Deals({ t, lang, visible, stores, radius, loading, regCount, source, reseed, setReseed, query, setQuery, setCategory, addCheapest, setCompare }){
  return (
    <section id="deals" className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-20">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-7">
        <div>
          <div className="eyebrow">العروض</div>
          <h2 className="text-[26px] sm:text-3xl font-bold text-txt mt-1.5">{t('grid.title')}</h2>
          <p className="text-dim text-[13px] mt-1.5 flex items-center gap-2">
            {t('grid.info',{n:visible.length, m:stores.length, r:radius})}
            {loading && <span className="mini-spin"/>}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {regCount>0 && (
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-semibold rounded-full border px-3 py-1.5"
              style={{borderColor:'rgba(42,207,234,.35)',color:'#2ACFEA'}}>
              <Icon name="badge-check" size={12}/>{merchLabel(regCount,lang)}
            </span>
          )}
          <span className="hidden sm:inline-flex items-center gap-2 text-[11px] font-semibold rounded-full border px-3 py-1.5"
            style={{borderColor:source==='osm'?'rgba(46,211,124,.35)':'var(--line)', color:source==='osm'?'#2ED37C':'var(--dim)'}}>
            <span className={cn('dot', source==='osm' && 'dot-ok')}/>
            {source==='osm' ? t('zone.osm') : t('zone.mock')}
          </span>
          <button onClick={()=>setReseed(r=>r+1)} className="flex items-center gap-2 text-xs font-semibold text-teal border border-teal/30 bg-teal/10 rounded-full px-4 py-2 hover:bg-teal/20 transition">
            <span key={reseed} className="spinonce inline-flex"><Icon name="refresh-cw" size={13}/></span>{t('grid.refresh')}
          </button>
        </div>
      </div>
      {visible.length===0 ? (
        <div className="empty">
          <Icon name="search" size={28} className="text-dim"/>
          <p className="text-dim text-sm mt-4">{t('grid.empty',{q:query.trim()})}</p>
          <button className="btn-ghost h-9 px-4 mt-5" onClick={()=>{setQuery(''); setCategory('all');}}>{t('grid.clear')}</button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((d,i)=>
            <ProductCard key={d.product.id} data={d} index={i} loading={loading} lang={lang} t={t}
              onAdd={addCheapest} onCompare={setCompare}/>)}
        </div>
      )}
    </section>
  );
}
