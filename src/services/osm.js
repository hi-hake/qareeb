import { hash, hav, mulberry } from '../lib/utils';

const OVP = ['https://overpass-api.de/api/interpreter','https://overpass.kumi.systems/api/interpreter'];

const osmCache = new Map();

function buildOverpassQuery(coords, radiusKm){
  const r = Math.round(radiusKm*1000);
  const shops = '^(supermarket|convenience|greengrocer|bakery|butcher|dairy|confectionery|beverages|deli|frozen_food)$';
  return `[out:json][timeout:20];(
    node(around:${r},${coords.lat},${coords.lng})["shop"~"${shops}"];
    way(around:${r},${coords.lat},${coords.lng})["shop"~"${shops}"];
  );out center 60;`;
}

function mapOSM(data, coords, radiusKm){
  return (data.elements||[]).map(el=>{
    const lat = el.lat!=null ? el.lat : (el.center && el.center.lat);
    const lon = el.lon!=null ? el.lon : (el.center && el.center.lon);
    if(lat==null) return null;
    const tg = el.tags||{};
    const name = tg['name:ar'] || tg.name || tg['name:en'];
    if(!name) return null;
    const d = hav(coords, {lat,lon});
    if(d > radiusKm) return null;
    const id = 'osm'+el.type+el.id;
    const r = mulberry(hash(id));
    return { id, name, distance:+d.toFixed(2), eta:Math.round(6+d*4+r()*12), rating:+(3.7+r()*1.2).toFixed(1), open:true };
  }).filter(Boolean).sort((a,b)=>a.distance-b.distance).slice(0,6);
}

export async function fetchOSMStores(coords, radiusKm){
  const key = `${coords.lat.toFixed(3)},${coords.lng.toFixed(3)},${Math.round(radiusKm*1000)}`;
  if(osmCache.has(key)) return osmCache.get(key);
  const body = 'data='+encodeURIComponent(buildOverpassQuery(coords,radiusKm));
  let lastErr=null;
  for(const ep of OVP){
    try{
      const ctl=new AbortController(); const tm=setTimeout(()=>ctl.abort(),9000);
      const res=await fetch(ep,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body,signal:ctl.signal});
      clearTimeout(tm);
      if(!res.ok) throw new Error('http '+res.status);
      const list = mapOSM(await res.json(), coords, radiusKm);
      osmCache.set(key,list);
      return list;
    }catch(e){ lastErr=e; }
  }
  throw lastErr || new Error('osm');
}

async function nominatim(path){
  const ctl=new AbortController(); const tm=setTimeout(()=>ctl.abort(),8000);
  const res=await fetch('https://nominatim.openstreetmap.org/'+path,{signal:ctl.signal,headers:{'Accept':'application/json'}});
  clearTimeout(tm);
  if(!res.ok) throw new Error('geo');
  return res.json();
}

export async function reverseGeocode(lat,lng){
  const d = await nominatim(`reverse?lat=${lat}&lon=${lng}&format=jsonv2&zoom=16&accept-language=ar,en`);
  const a=(d&&d.address)||{};
  return a.suburb || a.neighbourhood || a.quarter || a.village || a.town || a.city || a.state
       || (d&&d.display_name ? d.display_name.split(',')[0] : null);
}

export async function forwardGeocode(q){
  const d = await nominatim(`search?q=${encodeURIComponent(q)}&format=jsonv2&limit=1&accept-language=ar,en&countrycodes=eg`);
  if(!d||!d[0]) return null;
  const parts=(d[0].display_name||'').split(',');
  return { lat:+d[0].lat, lng:+d[0].lon, name:(parts[0]||q).trim() };
}
