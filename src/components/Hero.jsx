import { Fragment } from 'react';
import { HeroScene } from './HeroScene';
import { Icon } from './Icon';
import { cn } from '../lib/utils';

/* ================= البطل ================= */
export function Hero({ t, lang, radius, setRadius, areaInput, setAreaInput, areaBusy, submitArea, pulse, detecting, locSource, source, statusText, coords, detect }){
  return (
    <section className="relative overflow-hidden">
      <div className="hero-art">
        <HeroScene/>
        <div className="absolute inset-0 scrim1"/>
        <div className="absolute inset-0 scrim2"/>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-14 pb-16 sm:pt-20 sm:pb-24 grid lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] gap-12 items-center">
        <div>
          <span className="kicker"><Icon name="map-pin" size={12}/>{t('hero.kicker')}</span>
          <h1 className="mt-6 font-bold" style={{fontSize:'clamp(2.15rem,4.6vw,3.5rem)',lineHeight:lang==='ar'?1.3:1.05,color:'#F4F9FB'}}>
            <Fragment>
              {lang==='ar' ? 'بقالتك القريبة، ' : 'Your local grocery, '}
              <span className="hl">{lang==='ar'?'بكل سهولة.':'made easy.'}
                <svg className="hl-line" viewBox="0 0 230 12" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M4 9 C 70 2 165 2 226 8" fill="none" stroke="#2ACFEA" strokeWidth="4.5" strokeLinecap="round"/>
                </svg>
              </span>
            </Fragment>
          </h1>
          <p className="mt-5 max-w-xl text-[16px] sm:text-[17px] leading-loose" style={{color:'#BFD6E2'}}>{t('hero.sub',{r:radius})}</p>
          <form onSubmit={submitArea} className="areapill mt-8 max-w-md">
            <Icon name="map-pin" size={18} className="text-teal"/>
            <input value={areaInput} onChange={e=>setAreaInput(e.target.value)} placeholder={t('hero.areaPh')} aria-label={t('hero.areaPh')}/>
            <button type="submit" className="area-go" disabled={areaBusy} aria-label="حدّد المنطقة">
              {areaBusy ? <span className="spinner"/> : <Icon name={lang==='ar'?'arrow-left':'arrow-right'} size={19} sw={2.4}/>}
            </button>
          </form>
        </div>

        <div className="lg:justify-self-end w-full max-w-md">
          <div id="zone" className={cn('zone p-5 sm:p-6', pulse && 'zone-pulse')}>
            <div className="flex items-start gap-3">
              <span className="zone-ic"><Icon name="crosshair" size={20}/></span>
              <div className="flex-1">
                <h3 className="font-bold text-txt text-[17px]">{t('hero.zoneTitle')}</h3>
                <p className="text-xs text-dim mt-1 leading-relaxed">{t('hero.zoneDesc')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4 text-[12.5px]">
              <span className={cn('dot', detecting && 'dot-busy', locSource==='gps' && 'dot-ok')}/>
              <span className="text-txt">{statusText}</span>
            </div>
            <p className="text-[10.5px] text-dim mt-1 tabular-nums" dir="ltr">{coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}</p>
            <div className="flex items-center gap-2 mt-2.5 text-[11px]">
              <span className={cn('dot', source==='osm' && 'dot-ok')}/>
              <span className="text-dim">{t('zone.source')}: <span className={source==='osm'?'text-best font-semibold':''}>{source==='osm'?t('zone.osm'):t('zone.mock')}</span></span>
            </div>
            <button onClick={detect} disabled={detecting} className="btn-primary w-full h-11 mt-4 text-[14px]">
              {detecting ? <Fragment><span className="spinner"/>{t('hero.detecting')}</Fragment>
                         : <Fragment><Icon name="locate-fixed" size={16}/>{t('hero.detect')}</Fragment>}
            </button>
            <div className="mt-5">
              <div className="flex items-baseline justify-between">
                <span className="text-[13px] font-semibold text-txt">{t('hero.radius',{r:radius})}</span>
                <span className="text-[11px] text-dim tabular-nums">1 – 10 كم</span>
              </div>
              <input type="range" min="1" max="10" step="1" value={radius}
                onChange={e=>setRadius(parseInt(e.target.value,10))}
                className="qrange mt-3 w-full" style={{'--fill':(((radius-1)/9)*100).toFixed(1)+'%'}}
                aria-label={t('hero.radius',{r:radius})}/>
              <div className="flex justify-between text-[10px] text-dim mt-1.5 tabular-nums px-0.5">
                <span>1 كم</span><span>5</span><span>10 كم</span>
              </div>
            </div>
            <p className="text-[11px] text-dim mt-3 leading-relaxed">
              المتاجر والأسعار بتتحدّث تلقائيًا أول ما تغيّر النطاق — ببيانات حقيقية من OpenStreetMap.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
