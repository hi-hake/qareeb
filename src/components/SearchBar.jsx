import { Icon } from './Icon';

/* ================= شريط البحث ================= */
export function SearchBar({ query, setQuery, radius, t, go, jumpZone }){
  const label = t('nav.search',{r:radius});
  return (
    <form className="srch w-full" role="search" onSubmit={e=>{ e.preventDefault(); go('deals'); }}>
      <Icon name="search" size={16} className="text-dim"/>
      <input
        type="search" value={query} onChange={e=>setQuery(e.target.value)}
        placeholder={label} aria-label={label}
        className="flex-1 min-w-0 bg-transparent outline-none text-[13.5px] text-txt placeholder:text-dim"
        style={{fontFamily:'inherit'}}/>
      <button type="button" className="radchip" onClick={jumpZone} aria-label={t('hero.radius',{r:radius})} title={t('hero.radius',{r:radius})}>
        <Icon name="map-pin" size={11}/>{radius} {t('unit.km')}
      </button>
    </form>
  );
}
