import { Icon } from './Icon';
import { Logo } from './Logo';
import { go } from '../lib/utils';

/* ================= التذييل ================= */
export function Footer({ t, auth, setCheckoutOpen, setCartOpen, setOrdersOpen, openAuth, setFeedbackOpen }){
  return (
    <footer className="border-t" style={{borderColor:'var(--line)'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid md:grid-cols-[1.5fr_1fr_1.7fr] gap-10">
        <div>
          <Logo size={34}/>
          <p className="text-sm text-dim mt-5 max-w-xs leading-relaxed">{t('foot.desc')}</p>
        </div>
        <nav>
          <h4 className="fcol-h">{t('foot.links')}</h4>
          <div className="flex flex-col items-start gap-2.5 mt-4">
            <button className="text-sm text-dim hover:text-teal transition" onClick={()=>go('deals')}>{t('foot.shop')}</button>
            <button className="text-sm text-dim hover:text-teal transition" onClick={()=>{ if(auth) setCheckoutOpen(true); else setCartOpen(true); }}>{t('foot.checkout')}</button>
            <button className="text-sm text-dim hover:text-teal transition" onClick={()=>setOrdersOpen(true)}>{t('foot.track')}</button>
            <button className="text-sm text-dim hover:text-orange transition" onClick={()=>openAuth('merchant')}>{t('foot.forOwners')}</button>
          </div>
        </nav>
        <div>
          <h4 className="fcol-h">{t('foot.about')}</h4>
          <p className="text-sm text-dim mt-4 leading-relaxed max-w-sm">{t('foot.aboutText')}</p>
        </div>
      </div>
      <div className="flex justify-center pb-8">
        <div className="flex items-center gap-1 rounded-full border p-1.5 transition hover:border-teal/50" style={{borderColor:'var(--line)', background:'var(--panel)'}}>
          <button className="flex items-center gap-2 px-5 py-2 rounded-full text-[13px] font-semibold text-teal hover:bg-teal/10 transition" onClick={()=>go('categories')}>
            <Icon name="layout-grid" size={15}/>{t('foot.browse')}
          </button>
          <button className="flex items-center gap-2 px-5 py-2 rounded-full text-[13px] font-semibold text-teal hover:bg-teal/10 transition" onClick={()=>setFeedbackOpen(true)}>
            <Icon name="message-square" size={15}/>{t('foot.comment')}
          </button>
        </div>
      </div>
      <div className="border-t" style={{borderColor:'var(--line)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-wrap items-center justify-between gap-3">
          <span className="text-[11px] font-medium" style={{color:'#7B8A96'}}>Edit with <span style={{color:'#E4483B',fontWeight:700}}>Lovable</span></span>
          <span className="text-xs text-dim">{t('foot.rights')}</span>
        </div>
      </div>
    </footer>
  );
}
