import { hash } from './utils';

export const K = { cart:'qareeb_cart', users:'qareeb_users', session:'qareeb_session', orders:'qareeb_orders', prefs:'qareeb_prefs',
             merchants:'qareeb_merchants', msession:'qareeb_msession' };

export const load = (k, fb) => { try{ const v=JSON.parse(localStorage.getItem(k)); return v==null?fb:v; }catch(e){ return fb; } };

export const save = (k, v) => { try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} };

export async function passHash(s){
  try{
    const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
    return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('');
  }catch(e){ return 'x'+hash('salt|'+s).toString(16); }
}
