import { Icon } from './Icon';
import { CATS } from '../data/catalog';
import { cn } from '../lib/utils';

/* ================= الأقسام ================= */
export function Categories({ t, category, setCategory }){
  return (
    <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 pt-12">
      <div className="eyebrow">الأقسام</div>
      <h2 className="text-[26px] sm:text-3xl font-bold text-txt mt-1.5">{t('cat.title')}</h2>
      <div className="cats-row flex gap-4 sm:gap-6 overflow-x-auto pb-3 -mx-1 px-1 mt-7">
        <button onClick={()=>setCategory('all')} className={cn('cat-btn', category==='all' && 'on')} aria-pressed={category==='all'}>
          <span className={cn('cat-circle', category==='all' && 'on')}><Icon name="layout-grid" size={24}/></span>
          <span className="cat-lbl">{t('cat.all')}</span>
        </button>
        {CATS.map(c=>{
          const on = category===c.id;
          return (
            <button key={c.id} onClick={()=>setCategory(on?'all':c.id)} className={cn('cat-btn', on && 'on')} aria-pressed={on}>
              <span className={cn('cat-circle', on && 'on')}><Icon name={c.icon} size={24} sw={on?2.2:1.8}/></span>
              <span className="cat-lbl">{t('cat.'+c.id)}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
