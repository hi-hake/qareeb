import { useState, useEffect, useMemo, useRef } from 'react';
import { AuthPage } from './components/AuthPage';
import { CartDrawer } from './components/CartDrawer';
import { Categories } from './components/Categories';
import { CheckoutModal } from './components/CheckoutModal';
import { CompareModal } from './components/CompareModal';
import { Deals } from './components/Deals';
import { FeedbackModal } from './components/FeedbackModal';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { MerchantDash } from './components/MerchantDash';
import { OrdersModal } from './components/OrdersModal';
import { ToastStack } from './components/ToastStack';
import { DEMO, PN } from './data/catalog';
import { useToasts } from './hooks/useToasts';
import { T } from './lib/i18n';
import { buildPrices } from './lib/pricing';
import { K, load, save } from './lib/storage';
import { fmt, go, hash, hav, mulberry } from './lib/utils';
import { mockStores } from './services/mockStores';
import { fetchOSMStores, forwardGeocode, reverseGeocode } from './services/osm';

/* ================= التطبيق ================= */
export function App(){
  const pf = load(K.prefs, {});
  const [lang,setLang] = useState(pf.lang==='en'?'en':'ar');
  const [dark,setDark] = useState(pf.dark!==false);
  const [radius,setRadius] = useState(Math.min(10,Math.max(1,(+pf.radius)||2)));
  const t=(k,v)=>T(lang,k,v);

  const [toasts,toast]=useToasts();
  const [view,setView]=useState('home');
  const [authRole,setAuthRole]=useState('customer');
  const [coords,setCoords]=useState({...DEMO});
  const [area,setArea]=useState('مدينة نصر، القاهرة');
  const [locSource,setLocSource]=useState('demo');
  const [detecting,setDetecting]=useState(false);
  const [stores,setStores]=useState([]);
  const [loading,setLoading]=useState(true);
  const [source,setSource]=useState('mock');
  const [reseed,setReseed]=useState(0);
  const [category,setCategory]=useState('all');
  const [query,setQuery]=useState('');
  const [areaInput,setAreaInput]=useState('');
  const [areaBusy,setAreaBusy]=useState(false);

  const [cart,setCart]=useState(()=>{ const c=load(K.cart,[]); return Array.isArray(c)?c:[]; });
  const [auth,setAuth]=useState(()=>load(K.session,null));
  const [orders,setOrders]=useState(()=>{ const o=load(K.orders,[]); return Array.isArray(o)?o:[]; });
  const [merchants,setMerchants]=useState(()=>{ const m=load(K.merchants,[]); return Array.isArray(m)?m:[]; });
  const [msess,setMsess]=useState(()=>load(K.msession,null));

  const [cartOpen,setCartOpen]=useState(false);
  const [checkoutOpen,setCheckoutOpen]=useState(false);
  const [ordersOpen,setOrdersOpen]=useState(false);
  const [compare,setCompare]=useState(null);
  const [avatarMenu,setAvatarMenu]=useState(false);
  const [feedbackOpen,setFeedbackOpen]=useState(false);
  const [mobileMenu,setMobileMenu]=useState(false);
  const [pulse,setPulse]=useState(false);
  const announceRef=useRef(false);

  /* الثيم والاتجاه */
  useEffect(()=>{
    const el=document.documentElement;
    el.dataset.theme = dark?'dark':'light';
    el.lang=lang; el.dir = lang==='ar'?'rtl':'ltr';
  },[dark,lang]);

  /* الحفظ في localStorage */
  useEffect(()=>{ save(K.cart,cart); },[cart]);
  useEffect(()=>{ save(K.orders,orders); },[orders]);
  useEffect(()=>{ auth ? save(K.session,auth) : localStorage.removeItem(K.session); },[auth]);
  useEffect(()=>{ save(K.prefs,{lang,dark,radius}); },[lang,dark,radius]);

  /* مزامنة المتاجر المسجّلة من تاب تاني (حدث storage) */
  useEffect(()=>{
    const h=e=>{ if(e.key===K.merchants) setMerchants(load(K.merchants,[])); };
    window.addEventListener('storage',h);
    return ()=>window.removeEventListener('storage',h);
  },[]);

  /* جلب المتاجر: OSM الحقيقي + المتاجر المسجّلة من لوحة التجار، ولو فشل كل حاجة → تجريبي */
  useEffect(()=>{
    let on=true; setLoading(true);
    const tm=setTimeout(async ()=>{
      let real=false, list=[];
      try{
        list=await fetchOSMStores(coords,radius);
        if(list.length>=3) real=true; else list=[];
      }catch(e){}
      if(!real){ try{ list=await mockStores(coords,radius,reseed); }catch(e){ list=[]; } }
      /* متاجر التجار المسجّلين على قريب */
      const merch=[];
      (Array.isArray(merchants)?merchants:[]).forEach(mt=>{
        if(!mt || mt.open===false || mt.lat==null || mt.lng==null) return;
        const d=hav(coords,{lat:mt.lat,lng:mt.lng});
        if(d>radius) return;
        const rr=mulberry(hash('merch|'+mt.id));
        merch.push({ id:'merch_'+mt.id, name:mt.storeName, merchant:mt, registered:true,
          distance:+d.toFixed(2), eta:Math.round(5+d*4+rr()*8), rating:4.6, open:true });
      });
      const all=list.concat(merch).sort((a,b)=>a.distance-b.distance);
      if(!on) return;
      setStores(all); setSource(real?'osm':'mock'); setLoading(false);
      if(announceRef.current){
        announceRef.current=false;
        toast(real?'success':'warn', real ? t('toast.osmOk',{n:all.length}) : t('toast.osmFail'));
      }
    },600);
    return ()=>{ on=false; clearTimeout(tm); };
  },[coords,radius,reseed,merchants]);

  /* محرك المقارنة */
  const prices = useMemo(()=>buildPrices(coords,radius,reseed,stores),[coords,radius,reseed,stores]);
  const visible = useMemo(()=>prices.filter(d=>{
    const p=d.product; const q=query.trim().toLowerCase();
    return (category==='all'||p.cat===category) && (!q || p.name_en.toLowerCase().includes(q) || p.name_ar.includes(query.trim()));
  }),[prices,category,query]);

  /* حسابات السلة */
  const cartCount = cart.reduce((s,i)=>s+i.qty,0);
  const subtotal = cart.reduce((s,i)=>s+i.price*i.qty,0);
  const delivery = cart.length===0 ? 0 : (subtotal>=300 ? 0 : 20);
  const total = subtotal+delivery;
  const etaMax = cart.length ? Math.max(...cart.map(i=>i.store.eta)) : 15;
  const regCount = stores.filter(s=>s.registered).length;

  const addCheapest = data => {
    const best=data.best; if(!best) return;
    const key=data.product.id+'|'+best.store.id;
    setCart(prev=>{
      const i=prev.findIndex(x=>x.key===key);
      if(i>=0){ const c=prev.slice(); c[i]={...c[i],qty:c[i].qty+1}; return c; }
      return prev.concat({key,product:data.product,store:best.store,price:best.price,qty:1});
    });
    toast('success', t('toast.added',{n:PN(data.product,lang),s:best.store.name,p:fmt(best.price,lang)}));
  };
  const chQty=(key,d)=>setCart(prev=>prev.flatMap(it=> it.key===key ? (it.qty+d<=0?[]:[{...it,qty:it.qty+d}]) : [it]));
  const removeItem=key=>setCart(prev=>prev.filter(it=>it.key!==key));

  const handleCheckout=()=>{
    if(!auth){ setCartOpen(false); toast('warn', t('toast.needLogin')); setAuthRole('customer'); setView('auth'); return; }
    setCartOpen(false); setCheckoutOpen(true);
  };
  const handlePlaced=o=>{
    setOrders(prev=>[o].concat(prev));
    setCart([]);
    toast('success', t('toast.order',{id:o.id}));
  };
  const handleCustomerLogin=u=>{ setAuth(u); setView('home'); };

  /* إدارة التجار */
  const currentMerchant = useMemo(()=> merchants.find(x=>x.id===msess)||null, [merchants,msess]);
  const saveMerchant=nm=>{
    const list=load(K.merchants,[]);
    const i=list.findIndex(x=>x.id===nm.id);
    if(i>=0) list[i]=nm; else list.push(nm);
    save(K.merchants,list); setMerchants(list);
  };
  const handleMerchantLogin=m=>{
    const list=load(K.merchants,[]);
    if(!list.some(x=>x.id===m.id)){ const nl=list.concat(m); save(K.merchants,nl); setMerchants(nl); }
    save(K.msession,m.id); setMsess(m.id); setView('merchant');
  };
  const merchantLogout=()=>{ localStorage.removeItem(K.msession); setMsess(null); setView('home'); toast('info', t('toast.mOut')); };

  const detect=()=>{
    setDetecting(true);
    if(!navigator.geolocation){ setDetecting(false); return; }
    navigator.geolocation.getCurrentPosition(async pos=>{
      const c={lat:+pos.coords.latitude.toFixed(4), lng:+pos.coords.longitude.toFixed(4)};
      let a=null;
      try{ a=await reverseGeocode(c.lat,c.lng); }catch(e){}
      setCoords(c); setArea(a||`${c.lat.toFixed(2)}, ${c.lng.toFixed(2)}`); setLocSource('gps'); setDetecting(false);
      announceRef.current=true;
      toast('success', t('toast.locOk',{a:a||'…'}));
    }, ()=>{
      setCoords({...DEMO}); setArea('مدينة نصر، القاهرة'); setLocSource('demo'); setDetecting(false);
      announceRef.current=true;
      toast('warn', t('toast.locDenied'));
    }, {timeout:9000, maximumAge:60000});
  };

  const submitArea=async e=>{
    e.preventDefault();
    const v=areaInput.trim(); if(!v||areaBusy) return;
    setAreaBusy(true);
    let ok=false, nm=v;
    try{
      const g=await forwardGeocode(v);
      if(g){ setCoords({lat:g.lat,lng:g.lng}); nm=g.name||v; ok=true; }
    }catch(err){}
    if(ok){
      setArea(nm); setLocSource('manual'); announceRef.current=true;
      toast('success', t('toast.locSet',{a:nm}));
    }else{
      toast('warn', t('toast.areaFail'));
    }
    setAreaBusy(false); setAreaInput('');
  };

  const openAuth=role=>{ setAuthRole(role); setView('auth'); };
  const jumpZone=()=>{ go('zone'); setPulse(true); setTimeout(()=>setPulse(false),1700); };
  const toggleLang=()=>{ const nl=lang==='ar'?'en':'ar'; setLang(nl); toast('info', nl==='ar'?'تم التحويل للعربية':'Switched to English'); };
  const doLogout=()=>{ setAuth(null); setAvatarMenu(false); toast('info', lang==='ar'?'تم تسجيل الخروج':'Signed out'); };

  const statusText = detecting ? t('hero.detecting')
    : locSource==='gps' ? t('hero.statusOk',{a:area})
    : locSource==='manual' ? t('hero.statusSet',{a:area})
    : t('hero.statusDemo',{a:area});

  const anyOpen = view==='home' && (compare||feedbackOpen||cartOpen||checkoutOpen||ordersOpen);
  useEffect(()=>{
    const h=e=>{ if(e.key==='Escape'){ setCompare(null); setFeedbackOpen(false); setCartOpen(false); setCheckoutOpen(false); setOrdersOpen(false); setAvatarMenu(false); setMobileMenu(false);} };
    window.addEventListener('keydown',h); return ()=>window.removeEventListener('keydown',h);
  },[]);
  useEffect(()=>{ document.body.style.overflow=anyOpen?'hidden':''; },[anyOpen]);


  return (
    <>
      {view==='auth' && (
        <AuthPage role={authRole} setRole={setAuthRole} lang={lang} t={t} toast={toast}
          onBack={()=>setView('home')} onLogin={handleCustomerLogin} onMerchantLogin={handleMerchantLogin}/>
      )}
      {view==='merchant' && (currentMerchant ? (
        <MerchantDash merchant={currentMerchant} onSave={saveMerchant} onLogout={merchantLogout}
          onExit={()=>setView('home')} lang={lang} t={t} toast={toast}/>
      ) : (
        <AuthPage role="merchant" setRole={setAuthRole} lang={lang} t={t} toast={toast}
          onBack={()=>setView('home')} onLogin={handleCustomerLogin} onMerchantLogin={handleMerchantLogin}/>
      ))}

      {view==='home' && (
        <div className="min-h-screen bg-bg">
          <Header t={t} lang={lang} dark={dark} setDark={setDark} toggleLang={toggleLang}
            auth={auth} doLogout={doLogout} openAuth={openAuth} area={area}
            query={query} setQuery={setQuery} radius={radius} jumpZone={jumpZone}
            currentMerchant={currentMerchant} setView={setView} cartCount={cartCount} setCartOpen={setCartOpen}
            avatarMenu={avatarMenu} setAvatarMenu={setAvatarMenu} setOrdersOpen={setOrdersOpen}
            mobileMenu={mobileMenu} setMobileMenu={setMobileMenu}/>

          <Hero t={t} lang={lang} radius={radius} setRadius={setRadius}
            areaInput={areaInput} setAreaInput={setAreaInput} areaBusy={areaBusy} submitArea={submitArea}
            pulse={pulse} detecting={detecting} locSource={locSource} source={source}
            statusText={statusText} coords={coords} detect={detect}/>

          <Categories t={t} category={category} setCategory={setCategory}/>

          <Deals t={t} lang={lang} visible={visible} stores={stores} radius={radius} loading={loading}
            regCount={regCount} source={source} reseed={reseed} setReseed={setReseed}
            query={query} setQuery={setQuery} setCategory={setCategory}
            addCheapest={addCheapest} setCompare={setCompare}/>

          <Footer t={t} auth={auth} openAuth={openAuth} setCheckoutOpen={setCheckoutOpen}
            setCartOpen={setCartOpen} setOrdersOpen={setOrdersOpen} setFeedbackOpen={setFeedbackOpen}/>

          <CompareModal data={compare} lang={lang} t={t} onClose={()=>setCompare(null)} onAdd={addCheapest}/>
          <FeedbackModal open={feedbackOpen} onClose={()=>setFeedbackOpen(false)} t={t}
            onSend={()=>{ setFeedbackOpen(false); toast('success', t('fb.ok')); }}/>
          <CartDrawer open={cartOpen} onClose={()=>setCartOpen(false)} cart={cart} lang={lang} t={t}
            chQty={chQty} removeItem={removeItem} subtotal={subtotal} delivery={delivery} total={total}
            onCheckout={handleCheckout}/>
          <CheckoutModal open={checkoutOpen} onClose={()=>setCheckoutOpen(false)} cart={cart} user={auth} area={area}
            lang={lang} t={t} subtotal={subtotal} delivery={delivery} total={total} etaMax={etaMax}
            onPlaced={handlePlaced}/>
          <OrdersModal open={ordersOpen} onClose={()=>setOrdersOpen(false)} orders={orders} lang={lang} t={t}/>
        </div>
      )}

      <ToastStack toasts={toasts} lang={lang}/>
    </>
  );
}
