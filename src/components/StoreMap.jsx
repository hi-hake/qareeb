import { useState, useEffect, useRef } from 'react';
import { Icon } from './Icon';
import { DEMO } from '../data/catalog';
import L from 'leaflet';

/* ================= خريطة تحديد مكان المتجر (Leaflet + OSM) ================= */
function qPin(){
  return L.divIcon({ className:'', html:'<div class="qpin"><span class="qpin-body"></span></div>', iconSize:[30,30], iconAnchor:[15,27] });
}
export function StoreMap({ lat, lng, onPick, t }){
  const elRef=useRef(null), mapRef=useRef(null), mkRef=useRef(null), ciRef=useRef(null);
  const pickRef=useRef(onPick); pickRef.current=onPick;
  const [failed,setFailed]=useState(false);

  useEffect(()=>{
    if(!elRef.current) return;
    let mp;
    try{
      mp=L.map(elRef.current,{ center:[lat||DEMO.lat, lng||DEMO.lng], zoom: lat?15:12 });
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(mp);
      mp.on('click',e=>pickRef.current(e.latlng.lat,e.latlng.lng));
    }catch(e){ setFailed(true); return; }
    mapRef.current=mp;
    const tm=setTimeout(()=>mp.invalidateSize(),120);
    return ()=>{ clearTimeout(tm); mp.remove(); mapRef.current=null; mkRef.current=null; ciRef.current=null; };
  },[]);

  useEffect(()=>{
    const mp=mapRef.current; if(!mp||lat==null||lng==null) return;
    const pos=[lat,lng];
    if(!mkRef.current){
      mkRef.current=L.marker(pos,{icon:qPin(),draggable:true}).addTo(mp);
      mkRef.current.on('dragend',()=>{ const p=mkRef.current.getLatLng(); pickRef.current(p.lat,p.lng); });
    } else mkRef.current.setLatLng(pos);
    if(!ciRef.current) ciRef.current=L.circle(pos,{radius:2000,color:'#2ACFEA',weight:1.5,opacity:.7,fillColor:'#2ACFEA',fillOpacity:.07}).addTo(mp);
    else ciRef.current.setLatLng(pos);
    mp.setView(pos, Math.max(mp.getZoom(),14));
  },[lat,lng]);

  return (
    <div className="relative">
      <div ref={elRef} className="qmap"/>
      {failed && (
        <div className="absolute inset-0 rounded-[14px] grid place-items-center p-6 text-center" style={{background:'var(--panel2)'}}>
          <div>
            <Icon name="map-pin-off" size={24} className="text-dim mx-auto"/>
            <p className="text-[12px] text-dim mt-3 max-w-[230px] leading-relaxed mx-auto">{t('m.mapFail')}</p>
          </div>
        </div>
      )}
    </div>
  );
}
