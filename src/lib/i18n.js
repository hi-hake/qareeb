import { STR } from '../data/strings';

export function T(lang, key, vars){
  let s = (STR[lang] && STR[lang][key]) || STR.ar[key] || key;
  if (vars) for (const k in vars) s = s.replace(new RegExp('\\{'+k+'\\}','g'), vars[k]);
  return s;
}

export const merchLabel=(k,lang)=> lang==='ar'
  ? (k===1?'متجر مسجّل واحد':k===2?'متجرين مسجّلين':(k>=3&&k<=10?k+' متاجر مسجّلة':k+' متجر مسجّل'))
  : (k===1?'1 registered store':k+' registered stores');
