import { useState, useEffect, Fragment } from 'react';
import { Art } from './Art';
import { CardVisual, brandMark } from './CardVisual';
import { Icon } from './Icon';
import { Field } from './ui/Field';
import { Modal } from './ui/Modal';
import { PN } from '../data/catalog';
import { fmtCard, fmtExp, luhn } from '../lib/card';
import { cn, fmt, sleep } from '../lib/utils';

export function CheckoutModal({ open, onClose, cart, user, area, lang, t, subtotal, delivery, total, etaMax, onPlaced }){
  const [step,setStep]=useState('addr');
  const [addr,setAddr]=useState({name:'',phone:'',street:'',notes:''});
  const [aerr,setAerr]=useState({});
  const [card,setCard]=useState({num:'',name:'',exp:'',cvv:''});
  const [perr,setPerr]=useState({});
  const [proc,setProc]=useState(-1);
  const [done,setDone]=useState(null);

  useEffect(()=>{
    if(open){
      setStep('addr'); setDone(null); setProc(-1); setAerr({}); setPerr({});
      setAddr(a=>({...a, name:(user&&user.name)||a.name||''}));
    }
  },[open,user]);
  if(!open) return null;

  const tryClose=()=>{ if(step!=='proc') onClose(); };
  const vAddr=()=>{
    const e={};
    if(addr.name.trim().length<3) e.name=t('auth.errName');
    if(!/^01[0125]\d{8}$/.test(addr.phone.replace(/\s/g,''))) e.phone=t('co.errPhone');
    if(addr.street.trim().length<5) e.street=t('co.errStreet');
    setAerr(e); return !Object.keys(e).length;
  };
  const vCard=()=>{
    const d=card.num.replace(/\D/g,''); const e={};
    if(!(d.length===16 && luhn(d))) e.num=t('pay.errNumber');
    if(card.name.trim().length<3) e.name=t('pay.errName');
    const m=/^(\d{2})\/(\d{2})$/.exec(card.exp);
    if(!m) e.exp=t('pay.errExp');
    else{ const mm=+m[1], yy=2000+ +m[2]; if(mm<1||mm>12|| new Date(yy,mm,0,23,59)<new Date()) e.exp=t('pay.errExp'); }
    if(!/^\d{3,4}$/.test(card.cvv)) e.cvv=t('pay.errCvv');
    setPerr(e); return !Object.keys(e).length;
  };
  const pay=async ()=>{
    if(!vCard()) return;
    setStep('proc'); setProc(0);
    await sleep(650); setProc(1);
    await sleep(650); setProc(2);
    await sleep(750);
    const digits=card.num.replace(/\D/g,'');
    const o={
      id:'QR-'+(1000+Math.floor(Math.random()*9000)), ts:Date.now(), eta:etaMax+4, total,
      items:cart.reduce((s,i)=>s+i.qty,0),
      addr:{...addr, area},
      card:'•••• '+digits.slice(-4),
    };
    setDone(o); setStep('done'); onPlaced(o);
  };

  const steps=[t('co.step1'),t('co.step2'),t('co.step3')];
  const sIdx = step==='addr'?0 : step==='pay'?1 : 2;
  const ArrowF = lang==='ar'?'arrow-left':'arrow-right';
  const ArrowB = lang==='ar'?'arrow-right':'arrow-left';

  return (
    <Modal open onClose={tryClose} maxW="max-w-3xl">
      <div className="modal-card !p-0 overflow-hidden">
        <div className="flex items-center justify-between px-6 pt-5">
          <div>
            <div className="eyebrow">{t('cart.title')}</div>
            <h3 className="text-lg font-bold text-txt mt-0.5">{t('co.title')}</h3>
          </div>
          <button onClick={tryClose} className="ibtn" aria-label={t('co.close')}><Icon name="x" size={17}/></button>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 px-6 py-4 mt-1">
          {steps.map((s,i)=>(
            <Fragment key={i}>
              <div className="flex items-center gap-2">
                <span className={cn('w-7 h-7 rounded-full grid place-items-center text-[12px] font-bold border shrink-0',
                  i<sIdx ? 'bg-teal/15 text-teal border-teal/40'
                  : i===sIdx ? 'bg-teal text-[#032530] border-teal'
                  : 'text-dim')} style={i>=sIdx?{borderColor:i===sIdx?'#2ACFEA':'var(--line)'}:null}>
                  {i<sIdx ? <Icon name="check" size={13} sw={2.6}/> : i+1}
                </span>
                <span className={cn('text-[12px] font-semibold whitespace-nowrap', i===sIdx?'text-txt':'text-dim')}>{s}</span>
              </div>
              {i<steps.length-1 && <span className="flex-1 h-px min-w-[14px]" style={{background:'var(--line)'}}/>}
            </Fragment>
          ))}
        </div>
        <div className="border-t" style={{borderColor:'var(--line)'}}>
          {step==='done' && done ? (
            <div className="p-6 sm:p-10 text-center rise">
              <div className="w-16 h-16 mx-auto rounded-full bg-best/15 text-best grid place-items-center"><Icon name="check" size={30} sw={2.5}/></div>
              <h4 className="mt-4 text-xl font-bold text-txt">{t('co.done')}</h4>
              <div className="mt-6 max-w-sm mx-auto space-y-2.5 text-start">
                <div className="flex items-center justify-between rounded-xl border px-4 py-3" style={{borderColor:'var(--line)',background:'var(--panel2)'}}>
                  <span className="text-xs text-dim">{t('co.orderId')}</span>
                  <span className="font-bold text-teal tabular-nums">{done.id}</span>
                </div>
                <div className="flex items-center gap-3 text-[13px] text-txt">
                  <Icon name="truck" size={16} className="text-teal"/>{t('co.eta',{m:done.eta})}
                </div>
                <div className="flex items-center gap-3 text-[13px] text-txt">
                  <Icon name="credit-card" size={16} className="text-teal"/>
                  <span>{t('co.paidWith')} <span dir="ltr" className="font-semibold tabular-nums">{done.card}</span></span>
                </div>
                <div className="flex items-start gap-3 text-[13px] text-txt">
                  <Icon name="map-pin" size={16} className="text-teal mt-0.5"/>
                  <span>{t('co.to')}: {done.addr.street}، {done.addr.area} — <span dir="ltr" className="tabular-nums">{done.addr.phone}</span></span>
                </div>
              </div>
              <button className="btn-primary h-11 px-8 mt-7" onClick={onClose}>{t('co.continue')}</button>
            </div>
          ) : (
            <div className="grid md:grid-cols-[minmax(0,1fr)_264px]">
              <div className="p-5 sm:p-6">
                {step==='addr' && (
                  <div className="space-y-4 rise">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label={t('auth.name')} icon="user" error={aerr.name}>
                        <input className="inp ps-10" value={addr.name} autoComplete="name"
                          onChange={e=>{setAddr(a=>({...a,name:e.target.value})); setAerr(x=>({...x,name:undefined}));}}/>
                      </Field>
                      <Field label={t('co.phone')} icon="phone" error={aerr.phone}>
                        <input className="inp ps-10 tabular-nums" dir="ltr" inputMode="tel" placeholder="01xxxxxxxxx" autoComplete="tel"
                          value={addr.phone} onChange={e=>{setAddr(a=>({...a,phone:e.target.value.replace(/[^\d+]/g,'')})); setAerr(x=>({...x,phone:undefined}));}}/>
                      </Field>
                    </div>
                    <Field label={t('co.street')} icon="home" error={aerr.street}>
                      <input className="inp ps-10" autoComplete="street-address"
                        value={addr.street} onChange={e=>{setAddr(a=>({...a,street:e.target.value})); setAerr(x=>({...x,street:undefined}));}}/>
                    </Field>
                    <div className="flex items-center gap-2 text-[12.5px] text-dim">
                      <Icon name="map-pin" size={14} className="text-teal"/>
                      <span>{t('co.area')}: <span className="text-txt font-semibold">{area}</span></span>
                    </div>
                    <Field label={t('co.notes')} icon="message-square">
                      <textarea className="inp" style={{height:64}} value={addr.notes} onChange={e=>setAddr(a=>({...a,notes:e.target.value}))}/>
                    </Field>
                    <button className="btn-primary w-full h-11 mt-1" onClick={()=>{ if(vAddr()) setStep('pay'); }}>
                      <Icon name={ArrowF} size={15}/>{t('co.next')}
                    </button>
                  </div>
                )}
                {step==='pay' && (
                  <div className="space-y-4 rise">
                    <CardVisual num={card.num} name={card.name} exp={card.exp}/>
                    <Field label={t('pay.number')} icon="credit-card" error={perr.num}>
                      <input dir="ltr" inputMode="numeric" autoComplete="cc-number" className="inp ps-10 pe-11 tabular-nums"
                        placeholder="4242 4242 4242 4242" value={card.num}
                        onChange={e=>{setCard(c=>({...c,num:fmtCard(e.target.value)})); setPerr(x=>({...x,num:undefined}));}}/>
                      <span className="absolute end-3 top-[13px]">{brandMark(card.num)}</span>
                    </Field>
                    <Field label={t('pay.name')} icon="user" error={perr.name}>
                      <input dir="ltr" className="inp ps-10" autoComplete="cc-name" value={card.name}
                        onChange={e=>{setCard(c=>({...c,name:e.target.value})); setPerr(x=>({...x,name:undefined}));}}/>
                    </Field>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label={t('pay.exp')} icon="calendar" error={perr.exp}>
                        <input dir="ltr" inputMode="numeric" autoComplete="cc-exp" className="inp ps-10 tabular-nums" placeholder="MM/YY"
                          value={card.exp} onChange={e=>{setCard(c=>({...c,exp:fmtExp(e.target.value)})); setPerr(x=>({...x,exp:undefined}));}}/>
                      </Field>
                      <Field label={t('pay.cvv')} icon="lock" error={perr.cvv}>
                        <input dir="ltr" inputMode="numeric" autoComplete="cc-csc" maxLength={4} className="inp ps-10 tabular-nums" placeholder="123"
                          value={card.cvv} onChange={e=>{setCard(c=>({...c,cvv:e.target.value.replace(/\D/g,'').slice(0,4)})); setPerr(x=>({...x,cvv:undefined}));}}/>
                      </Field>
                    </div>
                    <p className="flex items-start gap-2 text-[11.5px] text-dim leading-relaxed">
                      <Icon name="shield-check" size={14} className="text-teal mt-0.5"/>{t('pay.demo')}
                    </p>
                    <div className="flex gap-2">
                      <button className="btn-ghost h-11 px-4" onClick={()=>setStep('addr')}><Icon name={ArrowB} size={14}/>{t('co.back')}</button>
                      <button className="btn-primary flex-1 h-11" onClick={pay}>
                        <Icon name="lock" size={15}/>{t('pay.pay',{p:fmt(total,lang)})}
                      </button>
                    </div>
                  </div>
                )}
                {step==='proc' && (
                  <div className="py-10 text-center rise">
                    <div className="bigspin"/>
                    <h4 className="mt-5 font-bold text-txt text-lg">{t('pay.processing')}</h4>
                    <div className="mt-6 w-full max-w-xs mx-auto space-y-3 text-start">
                      {[0,1,2].map(i=>(
                        <div key={i} className="flex items-center gap-3 text-[13px]">
                          {proc>i
                            ? <span className="w-5 h-5 rounded-full bg-best/15 text-best grid place-items-center"><Icon name="check" size={11} sw={3}/></span>
                            : proc===i
                              ? <span className="mini-spin"/>
                              : <span className="w-5 h-5 rounded-full border grid place-items-center" style={{borderColor:'var(--line)'}}/>}
                          <span className={proc>=i?'text-txt':'text-dim'}>{t('pay.p'+i)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <aside className="md:border-s p-5" style={{borderColor:'var(--line)',background:'var(--panel2)'}}>
                <h4 className="text-[13px] font-bold text-txt">{t('co.summary')}</h4>
                <div className="mt-3 space-y-2">
                  {cart.slice(0,4).map(it=>(
                    <div key={it.key} className="flex items-center gap-2.5">
                      <div className="cardtop w-9 h-9 rounded-lg grid place-items-center shrink-0"><Art id={it.product.id} className="h-6 w-auto"/></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] text-txt truncate">{PN(it.product,lang)} ×{it.qty}</p>
                        <p className="text-[10.5px] text-dim truncate">{it.store.name}</p>
                      </div>
                      <span className="text-[12px] text-txt tabular-nums font-semibold">{fmt(it.price*it.qty,lang)}</span>
                    </div>
                  ))}
                  {cart.length>4 && <p className="text-[11px] text-dim">+{cart.length-4}</p>}
                </div>
                <div className="border-t mt-4 pt-3 space-y-1.5" style={{borderColor:'var(--line)'}}>
                  <div className="flex justify-between text-[12px] text-dim"><span>{t('cart.subtotal')}</span><span className="tabular-nums">{fmt(subtotal,lang)}</span></div>
                  <div className="flex justify-between text-[12px] text-dim"><span>{t('cart.delivery')}</span><span className="tabular-nums">{delivery===0?'—':fmt(delivery,lang)}</span></div>
                  <div className="flex justify-between text-[15px] font-bold text-txt pt-1"><span>{t('cart.total')}</span><span className="tabular-nums text-teal">{fmt(total,lang)}</span></div>
                  <p className="flex items-center gap-1.5 text-[11px] text-dim pt-1"><Icon name="timer" size={12} className="text-teal"/>{t('co.eta',{m:etaMax+4})}</p>
                </div>
              </aside>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
