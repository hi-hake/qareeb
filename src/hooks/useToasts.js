import { useState, useCallback } from 'react';

export function useToasts(){
  const [toasts,setToasts]=useState([]);
  const toast=useCallback((kind,msg)=>{
    const id=Date.now()+Math.random();
    setToasts(ts=>ts.concat({id,kind,msg}));
    setTimeout(()=>setToasts(ts=>ts.filter(x=>x.id!==id)), 3400);
  },[]);
  return [toasts, toast];
}
