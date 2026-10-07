import { memo } from 'react';
import {
  Apple, ArrowLeft, ArrowRight, BadgeCheck, BadgePercent, Beef, Calendar, Carrot, Check,
  CircleAlert, CircleCheck, CircleDot, Cookie, CreditCard, Croissant, Crosshair, CupSoda,
  Eye, EyeOff, Globe, House, Info, LayoutGrid, LocateFixed, Lock, LogIn, LogOut, Mail,
  MapPin, MapPinOff, Menu, MessageSquare, Milk, Minus, Moon, Package, Phone, Plus,
  RefreshCw, Scale, Search, Send, ShieldCheck, ShoppingBasket, ShoppingCart, SprayCan,
  Store, Sun, Timer, Trash2, TriangleAlert, Truck, User, UserPlus, Wifi, X,
} from 'lucide-react';

/* الأيقونات بتتنادى بالاسم (kebab-case) زي ما كانت في النسخة القديمة،
   وأي أيقونة جديدة تحتاجها ضيفها هنا وفي الـ import فوق. */
const ICONS = {
  'apple': Apple, 'arrow-left': ArrowLeft, 'arrow-right': ArrowRight,
  'badge-check': BadgeCheck, 'badge-percent': BadgePercent, 'beef': Beef,
  'calendar': Calendar, 'carrot': Carrot, 'check': Check,
  'alert-circle': CircleAlert, 'alert-triangle': TriangleAlert,
  'check-circle-2': CircleCheck, 'circle-dot': CircleDot,
  'cookie': Cookie, 'credit-card': CreditCard, 'croissant': Croissant,
  'crosshair': Crosshair, 'cup-soda': CupSoda, 'eye': Eye, 'eye-off': EyeOff,
  'globe': Globe, 'home': House, 'info': Info, 'layout-grid': LayoutGrid,
  'locate-fixed': LocateFixed, 'lock': Lock, 'log-in': LogIn, 'log-out': LogOut,
  'mail': Mail, 'map-pin': MapPin, 'map-pin-off': MapPinOff, 'menu': Menu,
  'message-square': MessageSquare, 'milk': Milk, 'minus': Minus, 'moon': Moon,
  'package': Package, 'phone': Phone, 'plus': Plus, 'refresh-cw': RefreshCw,
  'scale': Scale, 'search': Search, 'send': Send, 'shield-check': ShieldCheck,
  'shopping-basket': ShoppingBasket, 'shopping-cart': ShoppingCart,
  'spray-can': SprayCan, 'store': Store, 'sun': Sun, 'timer': Timer,
  'trash-2': Trash2, 'truck': Truck, 'user': User, 'user-plus': UserPlus,
  'wifi': Wifi, 'x': X,
};

export const Icon = memo(function Icon({ name, size=18, className='', sw=2 }){
  const Cmp = ICONS[name];
  if (!Cmp && import.meta.env.DEV) console.warn(`[Icon] الأيقونة "${name}" مش متسجّلة في components/Icon.jsx`);
  return (
    <span className={'icn '+className} style={{ width:size, height:size, '--sw':sw }} aria-hidden="true">
      {Cmp ? <Cmp/> : null}
    </span>
  );
});
