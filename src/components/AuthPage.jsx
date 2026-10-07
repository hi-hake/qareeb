import { useState, Fragment } from 'react';
import { HeroScene } from './HeroScene';
import { Icon } from './Icon';
import { Logo } from './Logo';
import { Field } from './ui/Field';
import { K, load, passHash, save } from '../lib/storage';
import { cn, hash, sleep } from '../lib/utils';

export function AuthPage({ role, setRole, lang, t, onBack, onLogin, onMerchantLogin, toast }){
  const [mode,setMode]=useState('login');
  const [f,setF]=useState({store:'',owner:'',phone:'',name:'',email:'',pass:'',pass2:''});
  const [err,setErr]=useState({});
  const [busy,setBusy]=useState(false);
  const [show,setShow]=useState(false);
  const set=(k,v)=>{ setF(x=>({...x,[k]:v})); setErr(x=>({...x,[k]:undefined})); };
  const isM = role==='merchant';

  const submit=async e=>{
    e.preventDefault();
    const errs={};
    if(isM){
      if(mode==='reg'){
        if(f.store.trim().length<3) errs.store=t('m.errStore');
        if(f.owner.trim().length<3) errs.owner=t('auth.errName');
        if(!/^01[0125]\d{8}$/.test(f.phone.replace(/\s/g,''))) errs.phone=t('m.errPhone');
      }
    } else if(mode==='reg' && f.name.trim().length<3) errs.name=t('auth.errName');
    if(!/^\S+@\S+\.\S+$/.test(f.email)) errs.email=t('auth.errEmail');
    if(f.pass.length<6) errs.pass=t('auth.errPass');
    if(mode==='reg' && f.pass!==f.pass2) errs.pass2=t('auth.errMatch');
    setErr(errs);
    if(Object.keys(errs).length) return;
    setBusy(true); await sleep(400);

    if(isM){
      const list=load(K.merchants,[]);
      if(mode==='reg'){
        if(list.some(u=>u.email===f.email)){ setErr({email:t('auth.errExists')}); setBusy(false); return; }
        const m={ id:'m'+Date.now().toString(36), storeName:f.store.trim(), ownerName:f.owner.trim(),
          phone:f.phone.trim(), email:f.email, passHash:await passHash(f.pass),
          lat:null, lng:null, area:null, open:true, products:{}, ts:Date.now() };
        save(K.merchants, list.concat(m));
        setBusy(false); toast('success', t('m.welcome',{s:m.storeName}));
        onMerchantLogin(m); return;
      } else {
        const m=list.find(x=>x.email===f.email);
        const hp=await passHash(f.pass);
        setBusy(false);
        if(!m || m.passHash!==hp){ setErr({pass:t('auth.errCreds')}); return; }
        toast('success', t('m.welcome',{s:m.storeName}));
        onMerchantLogin(m); return;
      }
    }

    const users=load(K.users,[]);
    if(mode==='reg'){
      if(users.some(u=>u.email===f.email)){ setErr({email:t('auth.errExists')}); setBusy(false); return; }
      const u={name:f.name.trim(),email:f.email,hash:await passHash(f.pass)};
      save(K.users,users.concat(u));
      setBusy(false);
      toast('success', t('auth.regOk',{n:u.name}));
      onLogin({name:u.name,email:u.email});
    }else{
      const u=users.find(x=>x.email===f.email);
      const hp=await passHash(f.pass);
      setBusy(false);
      if(!u || u.hash!==hp){ setErr({pass:t('auth.errCreds')}); return; }
      toast('success', t('toast.welcome',{n:u.name}));
      onLogin({name:u.name,email:u.email});
    }
  };

  const title = isM ? t(mode==='login'?'m.title.login':'m.title.reg')
                    : t(mode==='login'?'auth.title':'auth.createTitle');
  const sub   = isM ? t(mode==='login'?'m.sub.login':'m.sub.reg')
                    : t(mode==='login'?'auth.loginSub':'auth.regSub');
  const feats = isM ? [['map-pin',t('m.f1')],['scale',t('m.f2')],['map',t('m.f3')]]
                    : [['map-pin',t('auth.f1')],['scale',t('auth.f2')],['truck',t('auth.f3')]];

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <div className="h-16 flex items-center justify-between px-4 sm:px-8 border-b" style={{borderColor:'var(--line)'}}>
        <button onClick={onBack} aria-label="قريب"><Logo size={36}/></button>
        <button className="btn-ghost h-9" onClick={onBack}>
          <Icon name={lang==='ar'?'arrow-right':'arrow-left'} size={14}/>{t('auth.back')}
        </button>
      </div>
      <div className="flex-1 grid lg:grid-cols-2">
        <div className="flex items-center justify-center px-4 sm:px-8 py-10">
          <div className="w-full max-w-sm rise">
            <div className="eyebrow">{t(isM?'m.sideKicker':'auth.brand')}</div>
            <h1 className="text-2xl sm:text-[28px] font-bold text-txt mt-2">{title}</h1>
            <p className="text-dim text-[13.5px] mt-2 leading-relaxed">{sub}</p>

            {/* تبويب الدور: مشتري / صاحب متجر */}
            <div className="flex p-1 rounded-full border mt-6" style={{borderColor:'var(--line)',background:'var(--panel)'}}>
              {[['customer','auth.roleCustomer'],['merchant','auth.roleMerchant']].map(([r,k])=>(
                <button key={r} type="button" onClick={()=>{setRole(r); setMode('login'); setErr({});}}
                  className={cn('flex-1 h-9 rounded-full text-[13px] font-semibold transition',
                    role===r ? 'bg-teal text-[#032530]' : 'text-dim hover:text-txt')}>
                  {t(k)}
                </button>
              ))}
            </div>

            {/* تبويب الدخول / إنشاء */}
            <div className="flex p-1 rounded-full border mt-3" style={{borderColor:'var(--line)',background:'var(--panel)'}}>
              {['login','reg'].map(m=>(
                <button key={m} type="button" onClick={()=>{setMode(m); setErr({});}}
                  className={cn('flex-1 h-9 rounded-full text-[13px] font-semibold transition',
                    mode===m ? 'bg-teal/15 text-teal' : 'text-dim hover:text-txt')}>
                  {t(m==='login'?'auth.tabLogin':'auth.tabReg')}
                </button>
              ))}
            </div>

            <form className="mt-6 space-y-4" onSubmit={submit}>
              {isM && mode==='reg' && (
                <Fragment>
                  <Field label={t('m.storeName')} icon="store" error={err.store}>
                    <input className="inp ps-10" value={f.store} onChange={e=>set('store',e.target.value)} placeholder={lang==='ar'?'مثال: بقالة الأمانة':'e.g. Al Amana Grocery'}/>
                  </Field>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label={t('m.ownerName')} icon="user" error={err.owner}>
                      <input className="inp ps-10" value={f.owner} onChange={e=>set('owner',e.target.value)}/>
                    </Field>
                    <Field label={t('m.phone')} icon="phone" error={err.phone}>
                      <input className="inp ps-10 tabular-nums" dir="ltr" inputMode="tel" placeholder="01xxxxxxxxx" value={f.phone} onChange={e=>set('phone',e.target.value.replace(/[^\d+]/g,''))}/>
                    </Field>
                  </div>
                </Fragment>
              )}
              {!isM && mode==='reg' && (
                <Field label={t('auth.name')} icon="user" error={err.name}>
                  <input className="inp ps-10" autoComplete="name" value={f.name} onChange={e=>set('name',e.target.value)}/>
                </Field>
              )}
              <Field label={t('auth.email')} icon="mail" error={err.email}>
                <input type="email" dir="ltr" className="inp ps-10" autoComplete="email" value={f.email} onChange={e=>set('email',e.target.value)}/>
              </Field>
              <Field label={t('auth.pass')} icon="lock" error={err.pass}>
                <input type={show?'text':'password'} dir="ltr" className="inp ps-10 pe-11"
                  autoComplete={mode==='login'?'current-password':'new-password'} value={f.pass} onChange={e=>set('pass',e.target.value)}/>
                <button type="button" onClick={()=>setShow(v=>!v)} aria-label={t('auth.show')}
                  className="absolute end-3 top-[13px] text-dim hover:text-txt"><Icon name={show?'eye-off':'eye'} size={15}/></button>
              </Field>
              {mode==='reg' && (
                <Field label={t('auth.confirm')} icon="shield-check" error={err.pass2}>
                  <input type={show?'text':'password'} dir="ltr" className="inp ps-10" autoComplete="new-password" value={f.pass2} onChange={e=>set('pass2',e.target.value)}/>
                </Field>
              )}
              <button type="submit" disabled={busy} className="btn-primary w-full h-11 mt-2 text-[14px]">
                {busy
                  ? <Fragment><span className="spinner"/>{t('auth.busy')}</Fragment>
                  : <Fragment><Icon name={mode==='login'?'log-in':'user-plus'} size={16}/>{t(mode==='login'?'auth.submit':'auth.create')}</Fragment>}
              </button>
            </form>

            <p className="text-center text-[12.5px] text-dim mt-5">
              {mode==='login' ? t(isM?'auth.newHere':'auth.newHere') : t('auth.haveAccount')}{' '}
              <button type="button" className="text-teal font-semibold hover:underline"
                onClick={()=>{setMode(mode==='login'?'reg':'login'); setErr({});}}>
                {mode==='login' ? t('auth.createOne') : t('auth.signIn')}
              </button>
            </p>
            {!isM && (
              <p className="text-center text-[12px] text-dim mt-3 border-t pt-4" style={{borderColor:'var(--line)'}}>
                {t('auth.orOwner')}{' '}
                <button type="button" className="text-orange font-semibold hover:underline" onClick={()=>{setRole('merchant'); setMode('login'); setErr({});}}>
                  {t('auth.ownerLink')}
                </button>
              </p>
            )}
          </div>
        </div>
        <div className="hidden lg:block relative overflow-hidden border-s min-h-[560px]" style={{borderColor:'var(--line)'}}>
          <div className="absolute inset-0"><HeroScene/></div>
          <div className="absolute inset-0" style={{background:'linear-gradient(to right, rgba(4,10,16,.15), var(--bg) 90%)'}}/>
          <div className="absolute inset-x-0 bottom-0 p-10">
            <span className="kicker">{t(isM?'m.sideKicker':'auth.sideKicker')}</span>
            <h2 className="mt-4 text-3xl font-bold" style={{color:'#F4F9FB'}}>{t(isM?'m.sideTitle':'auth.sideTitle')}</h2>
            <p className="mt-3 text-[14px] max-w-sm leading-relaxed" style={{color:'#BFD6E2'}}>{t(isM?'m.sideSub':'auth.sideSub')}</p>
            <div className="mt-7 space-y-3">
              {feats.map(([ic,tx])=>(
                <div key={tx} className="flex items-center gap-3 text-[13px]" style={{color:'#C7D9E3'}}>
                  <span className="zone-ic" style={{width:30,height:30,borderRadius:9}}><Icon name={ic} size={15}/></span>{tx}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
