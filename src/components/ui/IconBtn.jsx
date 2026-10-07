import { Icon } from '../Icon';

export function IconBtn({ icon, label, onClick, children }){
  return <button onClick={onClick} aria-label={label} title={label} className="ibtn">{icon ? <Icon name={icon} size={17}/> : children}</button>;
}
