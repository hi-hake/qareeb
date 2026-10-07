import { Icon } from './Icon';
import { Logo } from './Logo';
import { SearchBar } from './SearchBar';
import { IconBtn } from './ui/IconBtn';
import { go } from '../lib/utils';

/* ================= شريط التنقل ================= */
const initials = n => (n.replace(/[^a-zA-Z0-9]/g,'').slice(0,2)||'Q').toUpperCase();


export function Header({ t, lang, dark, setDark, toggleLang, auth, doLogout, openAuth, area, query, setQuery, radius, jumpZone, currentMerchant, setView, cartCount, setCartOpen, avatarMenu, setAvatarMenu, setOrdersOpen, mobileMenu, setMobileMenu }){
  return (
    <header className="sticky top-0 z-50 navbg border-b" style={{borderColor:'var(--line)'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="h-16 flex items-center gap-4">
          <button onClick={()=>window.scrollTo({top:0,behavior:'smooth'})} aria-label="قريب — الرئيسية"><Logo size={38}/></button>
          <div className="hidden md:flex items-center gap-1">
            <button className="nav-on" onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}>{t('nav.home')}</button>
            <button className="nav-off" onClick={()=>go('deals')}>{t('nav.shop')}</button>
            {auth
              ? <button className="nav-off" onClick={doLogout}>{t('nav.logout')}</button>
              : <button className="nav-off" onClick={()=>openAuth('customer')}>{t('nav.login')}</button>}
          </div>
          <div className="hidden lg:flex flex-1 justify-center max-w-[440px]">
            <SearchBar query={query} setQuery={setQuery} radius={radius} t={t} go={go} jumpZone={jumpZone}/>
          </div>
          <div className="flex-1 lg:hidden"/>
          <div className="flex items-center gap-1">
            <div className="hidden xl:flex items-center gap-1.5 text-xs text-dim me-2">
              <Icon name="map-pin" size={13} className="text-teal"/><span className="max-w-[150px] truncate">{area}</span>
            </div>
            {currentMerchant && <IconBtn icon="store" label={t('m.dash')} onClick={()=>setView('merchant')}/>}
            <IconBtn icon={dark?'sun':'moon'} label="تبديل المظهر" onClick={()=>setDark(v=>!v)}/>
            <button className="langbtn" onClick={toggleLang} aria-label="اللغة">
              <Icon name="globe" size={15}/><span className="hidden sm:inline">{lang==='ar'?'EN':'عربي'}</span>
            </button>
            <button className="ibtn" onClick={()=>setCartOpen(true)} aria-label={t('cart.title')}>
              <Icon name="shopping-cart" size={17}/>
              {cartCount>0 && <span key={cartCount} className="cart-badge pop">{cartCount}</span>}
            </button>
            {auth ? (
              <div className="relative">
                <button className="avatar" onClick={()=>setAvatarMenu(v=>!v)} aria-label="حسابي">{initials(auth.name)}</button>
                {avatarMenu && (
                  <div className="avmenu rise">
                    <p className="text-sm font-semibold text-txt truncate">{auth.name}</p>
                    <p className="text-xs text-dim truncate">{auth.email}</p>
                    <button className="btn-ghost w-full h-9 mt-4 text-[12.5px]"
                      onClick={()=>{setOrdersOpen(true); setAvatarMenu(false);}}>
                      <Icon name="package" size={14}/>{t('orders.title')}
                    </button>
                    <button className="btn-ghost w-full h-9 mt-2 text-[12.5px]" onClick={doLogout}>
                      <Icon name="log-out" size={14}/>{t('nav.logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <IconBtn icon="user" label={t('nav.login')} onClick={()=>openAuth('customer')}/>
            )}
            <button className="ibtn md:hidden" onClick={()=>setMobileMenu(v=>!v)} aria-label="القائمة"><Icon name="menu" size={18}/></button>
          </div>
        </div>
      </div>
      <div className="lg:hidden px-4 sm:px-6 pb-3">
        <SearchBar query={query} setQuery={setQuery} radius={radius} t={t} go={go} jumpZone={jumpZone}/>
      </div>
      {mobileMenu && (
        <div className="md:hidden px-4 sm:px-6 pb-3 flex flex-col gap-1 border-t pt-3" style={{borderColor:'var(--line)'}}>
          <button className="nav-on text-start" onClick={()=>{window.scrollTo({top:0,behavior:'smooth'});setMobileMenu(false);}}>{t('nav.home')}</button>
          <button className="nav-off text-start" onClick={()=>{go('deals');setMobileMenu(false);}}>{t('nav.shop')}</button>
          <button className="nav-off text-start" onClick={()=>{setMobileMenu(false);openAuth('merchant');}}>{t('foot.forOwners')}</button>
        </div>
      )}
    </header>
  );
}
