import { PRODUCTS } from '../data/catalog';
import { hash, mulberry } from './utils';

export function buildPrices(coords, radius, reseed, stores){
  return PRODUCTS.map(p => {
    const entries = stores.map(s => {
      /* متجر تاجر مسجّل: السعر والتوفر من صاحب المتجر نفسه */
      if (s.merchant){
        const mp = (s.merchant.products||{})[p.id];
        if(!mp || !mp.avail || !(mp.price>0)) return { store:s, inStock:false, price:p.price };
        return { store:s, inStock:true, price: Math.round(mp.price*100)/100 };
      }
      /* متجر محاكى/OSM: سعر مولّد بالبذرة */
      const r = mulberry(hash(`price|${p.id}|${s.id}|${coords.lat},${coords.lng}|${radius}|${reseed}`));
      const inStock = r() > 0.08;
      const price = p.price * (1.05 + r()*0.38);
      return { store:s, inStock, price: Math.round(price*4)/4 };
    });
    const avail = entries.filter(e => e.inStock);
    let best = null;
    if (avail.length){
      const sims = avail.filter(e=>!e.store.merchant);
      const merch = avail.filter(e=>e.store.merchant);
      let bSim = sims.length ? sims.reduce((a,b)=>a.price<=b.price?a:b) : null;
      if (bSim) bSim.price = p.price;               /* أرخص متجر محاكى يثبّت على السعر المعلن */
      let bMer = merch.length ? merch.reduce((a,b)=>a.price<=b.price?a:b) : null; /* أرخص تاجر بسعره الحقيقي */
      best = (bSim && bMer) ? (bMer.price<=bSim.price?bMer:bSim) : (bSim||bMer);
    }
    const byDist = avail.slice().sort((a,b)=>a.store.distance-b.store.distance);
    let listed = byDist.slice(0,3);
    if (best && !listed.includes(best))
      listed = byDist.slice(0,2).concat([best]).sort((a,b)=>a.store.distance-b.store.distance);
    const from = Math.min(p.price, best?best.price:p.price); /* لو تاجر رخّص، «يبدأ من» تنزل لسعره */
    return { product:p, entries, best, listed, from };
  });
}
