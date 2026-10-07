import { hash, mulberry } from '../lib/utils';

export function HeroScene(){
  const far=[[0,58,110],[58,36,150],[94,46,92],[140,30,132],[170,52,84],[222,38,168],[260,46,96],[306,60,120],[366,34,88],[400,54,150],[454,40,100],[494,64,130],[558,36,92],[594,50,142],[644,44,104],[688,58,124],[746,34,86],[780,52,148],[832,40,98],[872,50,120],[922,38,132]];
  const wr=mulberry(hash('farwin')); const wins=[];
  far.forEach(b=>{ const cols=Math.max(1,Math.floor((b[1]-8)/15)); const rows=Math.max(1,Math.floor((b[2]-10)/30));
    for(let c=0;c<cols;c++)for(let r2=0;r2<rows;r2++){ if(wr()<0.25){ const lit=wr()<0.75; wins.push({x:b[0]+7+c*15,y:340-b[2]+9+r2*30,lit,tw:lit&&wr()<0.35}); } }
  });
  const lwr=mulberry(hash('lwin')); const lwins=[];
  for(let c=0;c<4;c++)for(let r2=0;r2<5;r2++){ if(lwr()<0.5) lwins.push({x:16+c*34,y:70+r2*60,lit:lwr()<0.3}); }
  const rwr=mulberry(hash('rwin')); const rwins=[];
  for(let c=0;c<5;c++)for(let r2=0;r2<4;r2++){ if(rwr()<0.5) rwins.push({x:740+c*45,y:54+r2*66,lit:rwr()<0.28}); }
  return (
    <svg viewBox="0 0 960 560" preserveAspectRatio="xMidYMax slice" className="w-full h-full" aria-hidden="true">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#050D17"/><stop offset="0.45" stopColor="#0A2233"/>
          <stop offset="0.7" stopColor="#173B54"/><stop offset="0.84" stopColor="#5C4B41"/>
          <stop offset="0.94" stopColor="#C06A3A"/><stop offset="1" stopColor="#D8834C"/>
        </linearGradient>
        <linearGradient id="roadg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#123041"/><stop offset="1" stopColor="#081422"/>
        </linearGradient>
        <radialGradient id="glow"><stop offset="0" stopColor="#FFC46B" stopOpacity=".4"/><stop offset="1" stopColor="#FFC46B" stopOpacity="0"/></radialGradient>
        <radialGradient id="mglow"><stop offset="0" stopColor="#CFE9F2" stopOpacity=".25"/><stop offset="1" stopColor="#CFE9F2" stopOpacity="0"/></radialGradient>
      </defs>
      <rect width="960" height="560" fill="url(#sky)"/>
      <g fill="#CFE9F2">
        {[[70,42],[150,88],[260,30],[330,66],[430,46],[520,86],[610,36],[700,72],[790,44],[880,90],[500,26],[240,110]].map((p,i)=>
          <circle key={i} cx={p[0]} cy={p[1]} r={i%3===0?1.6:1.1} opacity={0.15+(i%4)*0.1} className="tw" style={{animationDelay:(i*0.6)+'s'}}/>)}
      </g>
      <circle cx="140" cy="64" r="60" fill="url(#mglow)"/><circle cx="140" cy="64" r="22" fill="#E6EFF3" opacity=".92"/>
      {far.map((b,i)=><rect key={i} x={b[0]} y={340-b[2]} width={b[1]} height={b[2]+2} fill="#0C2436"/>)}
      {wins.map((w,i)=><rect key={i} x={w.x} y={w.y} width="5" height="7" fill={w.lit?'#FFC46B':'#133550'} className={w.tw?'tw':''} style={w.tw?{animationDelay:(i%7*0.5)+'s'}:null}/>)}
      <g>
        <rect x="-12" y="48" width="174" height="402" fill="#071523"/>
        {lwins.map((w,i)=><rect key={i} x={w.x} y={w.y} width="22" height="30" fill={w.lit?'#F5B45E':'#16394C'} opacity=".92"/>)}
        <rect x="6" y="374" width="128" height="74" fill="#040C13"/><rect x="16" y="386" width="66" height="50" fill="#FFAE5C" opacity=".85"/>
        <path d="M38 386 v50 M60 386 v50" stroke="#040C13" strokeWidth="4"/>
        <rect x="92" y="390" width="30" height="58" fill="#0E2A3B"/>
        <rect x="0" y="360" width="140" height="15" rx="4" fill="#FF7A3C"/>
        {[14,46,78,110].map((x,i)=><rect key={i} x={x} y="360" width="14" height="15" fill="#F2E3D0" opacity=".9"/>)}
      </g>
      <g>
        <rect x="712" y="30" width="262" height="420" fill="#071523"/>
        {rwins.map((w,i)=><rect key={i} x={w.x} y={w.y} width="24" height="30" fill={w.lit?'#FFC46B':'#16394C'} opacity=".92"/>)}
        <rect x="734" y="378" width="196" height="70" fill="#040C13"/><rect x="746" y="392" width="112" height="46" fill="#FFD9A0" opacity=".8"/>
        <rect x="746" y="368" width="112" height="14" fill="#2ACFEA" opacity=".9"/><rect x="868" y="394" width="34" height="54" fill="#0E2A3B"/>
        <rect x="726" y="360" width="212" height="15" rx="4" fill="#2ACFEA"/>
        {[740,778,816,854,892].map((x,i)=><rect key={i} x={x} y="360" width="16" height="15" fill="#04121D" opacity=".85"/>)}
      </g>
      <g fill="#16394A"><rect x="596" y="198" width="7" height="250"/><path d="M600 205 L560 213 L560 223 L600 217 Z"/><rect x="589" y="444" width="20" height="7"/></g>
      <ellipse cx="562" cy="221" rx="11" ry="7" fill="#FFD9A0"/><circle cx="562" cy="221" r="30" fill="url(#glow)" className="halo"/>
      <g fill="#12303F"><rect x="248" y="286" width="5" height="162"/><path d="M250 291 L222 297 L222 305 L250 300 Z"/></g>
      <ellipse cx="224" cy="303" rx="8" ry="5" fill="#FFD9A0" opacity=".9"/>
      <rect x="0" y="448" width="960" height="18" fill="#132B3A"/><rect x="0" y="448" width="960" height="2.5" fill="#25505F"/>
      <rect x="0" y="466" width="960" height="94" fill="url(#roadg)"/>
      <path d="M110 560 L452 468" stroke="#2A5B74" strokeWidth="3" fill="none" opacity=".8"/>
      <path d="M850 560 L508 468" stroke="#2A5B74" strokeWidth="3" fill="none" opacity=".8"/>
      <g fill="#C9DCE6" opacity=".22"><path d="M474 544 h22 l-5 -26 h-13 z"/><path d="M483 508 h11 l-2.5 -14 h-6 z"/><path d="M487 484 h6 l-1 -9 h-4 z"/></g>
      <ellipse cx="300" cy="538" rx="24" ry="6" fill="#0A1826" stroke="#1C3E52" strokeWidth="1.5"/>
      <g>
        <ellipse cx="565" cy="551" rx="128" ry="11" fill="#01050A" opacity=".6"/>
        <ellipse cx="565" cy="547" rx="72" ry="5" fill="#2ACFEA" opacity=".1"/>
        <circle cx="470" cy="520" r="30" fill="#0C141D" stroke="#2B3E4A" strokeWidth="5"/><circle cx="470" cy="520" r="11" fill="#40667A"/><circle cx="470" cy="520" r="3.5" fill="#AFC3CC"/>
        <circle cx="664" cy="520" r="30" fill="#0C141D" stroke="#2B3E4A" strokeWidth="5"/><circle cx="664" cy="520" r="11" fill="#40667A"/><circle cx="664" cy="520" r="3.5" fill="#AFC3CC"/>
        <path d="M506 505 Q562 522 608 513 L608 523 L502 521 Z" fill="#1B84A0"/>
        <path d="M486 428 C464 452 460 492 480 512 L508 512 C494 490 496 456 510 434 Z" fill="#2ACFEA"/>
        <path d="M498 444 C484 462 482 492 490 508" fill="none" stroke="#8FE9F8" strokeWidth="2" opacity=".75"/>
        <path d="M510 434 L522 398" stroke="#C7D6DE" strokeWidth="7" strokeLinecap="round"/>
        <path d="M522 398 Q534 386 556 388" stroke="#C7D6DE" strokeWidth="6" fill="none" strokeLinecap="round"/>
        <path d="M548 386 L542 368" stroke="#C7D6DE" strokeWidth="3"/>
        <ellipse cx="540" cy="363" rx="9" ry="6" fill="#0E2230" stroke="#C7D6DE" strokeWidth="2"/>
        <circle cx="472" cy="449" r="7" fill="#FFE3A1" stroke="#C7D6DE" strokeWidth="2"/>
        <path d="M700 428 L746 428 L746 462" stroke="#AFC3CC" strokeWidth="4" fill="none" strokeLinecap="round"/>
        <path d="M600 516 C592 464 612 430 654 420 C702 408 732 442 728 486 C726 506 712 516 694 516 Z" fill="#2ACFEA"/>
        <path d="M612 510 C606 472 622 444 654 434" fill="none" stroke="#8FE9F8" strokeWidth="2" opacity=".75"/>
        <rect x="702" y="398" width="46" height="34" rx="3" fill="#FF7A3C" stroke="#C24C1E" strokeWidth="2"/>
        <path d="M702 410 h46 M702 422 h46" stroke="#C24C1E" strokeWidth="1.5"/>
        <circle cx="714" cy="395" r="8" fill="#E5382B"/><circle cx="730" cy="393" r="9" fill="#F59B2E"/><circle cx="742" cy="397" r="6.5" fill="#3F8F4F"/>
        <path d="M606 412 Q634 390 682 394 Q700 398 694 408 Q688 416 662 416 L630 418 Z" fill="#26211C"/>
        <rect x="724" y="450" width="7" height="11" rx="2" fill="#FF7A3C"/>
      </g>
    </svg>
  );
}
