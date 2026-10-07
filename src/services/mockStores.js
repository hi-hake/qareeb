import { STORE_POOL } from '../data/catalog';
import { hash, mulberry } from '../lib/utils';

export function mockStores(coords, radius, reseed){
  const r = mulberry(hash(`stores|${coords.lat}|${coords.lng}|${radius}|${reseed}`));
  const count = 3 + Math.floor(r()*3);
  const pool = STORE_POOL.slice();
  const picked = [];
  for(let i=0;i<count;i++) picked.push(pool.splice(Math.floor(r()*pool.length),1)[0]);
  return new Promise(res => setTimeout(() => res(
    picked.map(s => {
      const dist = 0.25 + r()*(radius-0.25);
      return { ...s, distance:+dist.toFixed(2), eta:Math.round(6 + dist*4 + r()*12), rating:+(3.7+r()*1.2).toFixed(1), open:r()>0.12 };
    }).sort((a,b)=>a.distance-b.distance)
  ), 450 + r()*450));
}
