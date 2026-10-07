export function luhn(num){
  if(!/^\d+$/.test(num)) return false;
  let sum=0, alt=false;
  for(let i=num.length-1;i>=0;i--){ let d=+num[i]; if(alt){ d*=2; if(d>9)d-=9; } sum+=d; alt=!alt; }
  return num.length>=13 && sum%10===0;
}

export function cardBrand(d){
  if(/^4/.test(d)) return 'visa';
  if(/^(5[1-5]|2[2-7])/.test(d)) return 'mc';
  return 'gen';
}

export const fmtCard = v => v.replace(/\D/g,'').slice(0,16).replace(/(\d{4})(?=\d)/g,'$1 ');

export const fmtExp  = v => { const d=v.replace(/\D/g,'').slice(0,4); return d.length>2 ? d.slice(0,2)+'/'+d.slice(2) : d; };
