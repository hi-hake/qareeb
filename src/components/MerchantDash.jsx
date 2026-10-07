import { useState, useEffect, useRef } from 'react';
import { Art } from './Art';
import { Icon } from './Icon';
import { Logo } from './Logo';
import { PriceInput } from './PriceInput';
import { StoreMap } from './StoreMap';
import { PN, PRODUCTS, PU } from '../data/catalog';
import { cn, fmt } from '../lib/utils';
import { reverseGeocode } from '../services/osm';

export function MerchantDash({ merchant, onSave, onLogout, lang, t, toast, onExit }){
  const [m,setM]=useState(()=>({ ...merchant, open:merchant.open!==false, products:merchant.products||{} }));
  const [saveState,setSaveState]=useState('idle');
  const [invTab,setInvTab]=useState('all');
  const [locBusy,setLocBusy]=useState(false);
  const saveTimer=useRef(); const pending=useRef(null); const reqId=useRef(0);
  const onSaveRef=useRef(onSave); onSaveRef.current=onSave;

  const flush=()=>{ if(!pending.current) return; onSaveRef.current(pending.current); pending.current=null; setSaveState('saved'); setTimeout(()=>setSaveState('idle'),1600); };
  const queue=nm=>{ pending.current=nm; setSaveState('saving'); clearTimeout(saveTimer.current); saveTimer.current=setTimeout(flush,500); };
  const update=patch=>setM(prev=>{ const nm={...prev,...patch}; queue(nm); return nm; });
  const setProd=(pid,patch)=>setM(prev=>{ const prods={...prev.products,[pid]:{...prev.products[pid],...patch}}; const nm={...prev,products:prods}; queue(nm); return nm; });
  useEffect(()=>()=>{ clearTimeout(saveTimer.current); if(pending.current) onSaveRef.current(pending.current); },[]);

  const hasLoc = m.lat!=null && m.lng!=null;
  const availList = PRODUCTS.filter(p=>{ const mp=m.products[p.id]; return mp&&mp.avail&&mp.price>0; });
  const visible = m.open && hasLoc && availList.length>0;
  const cntA = PRODUCTS.filter(p=>m.products[p.id]&&m.products[p.id].avail).length;

  const pickLoc=async (lat,lng)=>{
    const id=++reqId.current;
    const c={lat:+(+lat).toFixed(5), lng:+(+lng).toFixed(5)};
    update({...c, area:''});
    let a=null; try{ a=await reverseGeocode(c.lat,c.lng); }catch(e){}
    if(id!==reqId.current) return;
    update({area:a||`${c.lat.toFixed(3)}, ${c.lng.toFixed(3)}`});
    toast('success', t('toast.mLoc'));
  };
  const gps=()=>{
    if(!navigator.geolocation) return;
    setLocBusy(true);
    navigator.geolocation.getCurrentPosition(pos=>{
      pickLoc(pos.coords.latitude,pos.coords.longitude); setLocBusy(false);
    },()=>{ setLocBusy(false); toast('warn', t('toast.locDenied')); },{timeout:9000});
  };
  const toggleAvail=p=>{
    const cur=m.products[p.id];
    if(cur&&cur.avail) setProd(p.id,{avail:false});
    else setProd(p.id,{avail:true, price:(cur&&cur.price>0)?cur.price:p.price});
  };
  const rows=PRODUCTS.filter(p=>{
    const mp=m.products[p.id];
    if(invTab==='avail') return mp&&mp.avail;
    if(invTab==='un') return !(mp&&mp.avail);
    return true;
  });
  const chk=(ok,label)=>(
    <div className="flex items-center gap-2.5 text-[12.5px]">
      <Icon name={ok?'check-circle-2':'alert-circle'} size={15} className={ok?'text-best':'text-orange'}/>
      <span className={ok?'text-txt':'text-dim'}>{label}</span>
    </div>);

  return (
    <div className="min-h-screen bg-bg">
      <header className="sticky top-0 z-40 navbg border-b" style={{borderColor:'var(--line)'}}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3">
          <Logo size={36}/>
          <div className="hidden sm:block ms-2 border-s ps-4" style={{borderColor:'var(--line)'}}>
            <div className="eyebrow">{t('m.dash')}</div>
            <div className="text-sm font-bold text-txt truncate max-w-[200px]">{m.storeName}</div>
          </div>
          <div className="flex-1"/>
          {saveState!=='idle' && (
            <span className={cn('flex items-center gap-1.5 text-[11px] font-semibold', saveState==='saving'?'text-dim':'text-best')}>
              {saveState==='saving' ? <span className="mini-spin"/> : <Icon name="check" size={12} sw={3}/>}
              {saveState==='saving'?t('m.saving'):t('m.saved')}
            </span>
          )}
          <button className="btn-ghost h-9" onClick={onExit}>
            <Icon name="eye" size={14}/><span className="hidden sm:inline">{t('m.viewStore')}</span>
          </button>
          <button className="btn-ghost h-9" onClick={onLogout}>
            <Icon name="log-out" size={14}/><span className="hidden sm:inline">{t('m.logout')}</span>
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 grid lg:grid-cols-[minmax(0,1fr)_350px] gap-6 items-start">
        {/* منتجات وأسعار المتجر */}
        <section className="card p-5">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <h2 className="text-lg font-bold text-txt">{t('m.invTitle')}</h2>
              <p className="text-[12px] text-dim mt-1 max-w-md leading-relaxed">{t('m.invHint')}</p>
            </div>
            <div className="flex gap-2">
              <button className="ftab" onClick={()=>PRODUCTS.forEach(p=>setProd(p.id,{avail:true, price:(m.products[p.id]&&m.products[p.id].price>0)?m.products[p.id].price:p.price}))}>{t('m.markAll')}</button>
              <button className="ftab" onClick={()=>PRODUCTS.forEach(p=>setProd(p.id,{avail:false}))}>{t('m.clearAll')}</button>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            {[['all',t('m.all')+' · '+PRODUCTS.length],['avail',t('m.avail')+' · '+cntA],['un',t('m.un')+' · '+(PRODUCTS.length-cntA)]].map(([k,l])=>(
              <button key={k} className={cn('ftab',invTab===k&&'on')} onClick={()=>setInvTab(k)}>{l}</button>
            ))}
          </div>
          <div className="mt-3">
            {rows.map(p=>{
              const mp=m.products[p.id]||{};
              const cheaper = mp.avail && mp.price>0 && mp.price<p.price;
              return (
                <div key={p.id} className="flex items-center gap-3 py-3 border-b last:border-b-0" style={{borderColor:'var(--line)'}}>
                  <div className="cardtop w-12 h-11 rounded-lg grid place-items-center shrink-0"><Art id={p.id} className="h-8 w-auto"/></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13.5px] font-semibold text-txt truncate">
                      {PN(p,lang)} <span className="text-[11px] font-normal text-dim">· {PU(p,lang)}</span>
                    </p>
                    <p className="text-[11px] text-dim mt-0.5 flex items-center gap-1.5 flex-wrap">
                      <span>{t('m.market',{p:fmt(p.price,lang)})}</span>
                      {cheaper && <span className="badge-best">{t('m.cheaper')}</span>}
                    </p>
                  </div>
                  <label className="sw" title={t(mp.avail?'m.avail':'m.un')}>
                    <input type="checkbox" checked={!!mp.avail} onChange={()=>toggleAvail(p)}/>
                    <span className="sw-track"/><span className="sw-dot"/>
                  </label>
                  <PriceInput value={mp.price>0?mp.price:null} disabled={!mp.avail}
                    onCommit={v=>setProd(p.id,{price:v})} suffix={lang==='ar'?'ج.م':'EGP'}/>
                </div>
              );
            })}
          </div>
        </section>

        <aside className="space-y-6">
          {/* حالة الظهور + مفتوح/مقفول */}
          <div className="card p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-[15px] font-bold text-txt">{t('m.stats')}</h3>
                <p className="text-[11.5px] text-dim mt-0.5">{t('m.openHint')}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn('text-[12px] font-bold', m.open?'text-best':'text-orange')}>{t(m.open?'m.open':'m.closed')}</span>
                <label className="sw sw-lg">
                  <input type="checkbox" checked={m.open} onChange={()=>update({open:!m.open})}/>
                  <span className="sw-track"/><span className="sw-dot"/>
                </label>
              </div>
            </div>
            <div className="mt-4 space-y-2.5">
              {chk(hasLoc, t('m.chkLoc'))}
              {chk(availList.length>0, t('m.chkInv'))}
              {chk(m.open, t('m.chkOpen'))}
            </div>
            <div className="mt-4 rounded-xl p-3.5 text-[12.5px] font-semibold flex items-center gap-2.5"
              style={visible?{background:'rgba(46,211,124,.1)',color:'#2ED37C'}:{background:'rgba(255,122,60,.1)',color:'#FF7A3C'}}>
              <Icon name={visible?'eye':'eye-off'} size={15}/>
              <span>{visible ? t('m.visible',{a:m.area||'…'}) : t('m.notVisible')}</span>
            </div>
          </div>

          {/* الموقع على الخريطة */}
          <div className="card p-5">
            <h3 className="text-[15px] font-bold text-txt">{t('m.locTitle')}</h3>
            <p className="text-[11.5px] text-dim mt-1 leading-relaxed">{t('m.locHint')}</p>
            <div className="mt-3"><StoreMap lat={m.lat} lng={m.lng} onPick={pickLoc} t={t}/></div>
            <button className="btn-ghost w-full h-10 mt-3" onClick={gps} disabled={locBusy}>
              {locBusy ? <span className="mini-spin"/> : <Icon name="locate-fixed" size={15}/>}
              {locBusy ? t('m.locating') : t('m.useGps')}
            </button>
            <div className="mt-3 text-[12.5px] flex items-center gap-2">
              <Icon name="map-pin" size={14} className="text-teal shrink-0"/>
              {hasLoc
                ? <span className="text-txt">{t('m.locAt',{a:m.area||t('m.locating')})}</span>
                : <span className="text-dim">{t('m.locNone')}</span>}
            </div>
            {hasLoc && (
              <p className="text-[10.5px] text-dim mt-1.5 flex items-center gap-1.5">
                <Icon name="circle-dot" size={11} className="text-teal"/>{t('m.circleHint')}
              </p>
            )}
          </div>

          {/* معاينة شكل المتجر عند العملاء */}
          <div className="card p-5">
            <h3 className="text-[15px] font-bold text-txt">{t('m.preview')}</h3>
            {availList.length===0 ? (
              <p className="text-[12px] text-dim mt-2 leading-relaxed">{t('m.noProducts')}</p>
            ) : (()=>{
              const p=availList[0]; const mp=m.products[p.id]; const cheaper=mp.price<=p.price;
              return (
                <div className="mt-3">
                  <p className="text-[11.5px] text-dim">{t('m.previewHint',{n:PN(p,lang)})}</p>
                  <div className="mt-2 rounded-xl border p-3" style={{borderColor:'var(--line)',background:'var(--panel2)'}}>
                    <div className="prow">
                      <div className="flex items-center gap-2 min-w-0">
                        <Icon name="badge-check" size={14} className="text-teal shrink-0"/>
                        <span className="text-[13px] text-teal font-semibold truncate">{m.storeName}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {cheaper && <span className="badge-best">{t('card.best')}</span>}
                        <span className={cn('text-[13px] font-semibold tabular-nums', cheaper&&'text-best')}>{fmt(mp.price,lang)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </aside>
      </main>
    </div>
  );
}
