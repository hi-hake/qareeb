export const cn = (...a) => a.filter(Boolean).join(' ');

export function hash(s){ let h=2166136261; for(let i=0;i<s.length;i++){ h^=s.charCodeAt(i); h=Math.imul(h,16777619);} return h>>>0; }

export function mulberry(a){ return function(){ a|=0; a=(a+0x6D2B79F5)|0; let t=Math.imul(a^(a>>>15),1|a); t=(t+Math.imul(t^(t>>>7),61|t))^t; return ((t^(t>>>14))>>>0)/4294967296; }; }

export const fmt = (n, lang) => { const v=+n; const s = v%1===0 ? String(v) : v.toFixed(2); return lang==='ar' ? `${s} ج.م` : `${s} EGP`; };

export const go = id => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior:'smooth', block:'start' }); };

export const sleep = ms => new Promise(r=>setTimeout(r,ms));

export function hav(a,b){
  const R=6371, rad=x=>x*Math.PI/180;
  const s = Math.sin(rad(b.lat-a.lat)/2)**2 + Math.cos(rad(a.lat))*Math.cos(rad(b.lat))*Math.sin(rad(b.lng-a.lng)/2)**2;
  return 2*R*Math.asin(Math.sqrt(s));
}
