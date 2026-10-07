export const DEMO = { lat: 30.0566, lng: 31.3300 };

export const STORE_POOL = [
  { id:'metro', name:'Metro Market' }, { id:'bim', name:'BIM' },
  { id:'kheir', name:'Kheir Zaman' }, { id:'carrefour', name:'Carrefour Express' },
  { id:'seoudi', name:'Seoudi Market' }, { id:'abuzeid', name:'Abu Zeid Grocery' },
  { id:'fathalla', name:'Fathalla Market' }, { id:'greenbasket', name:'Green Basket' },
];

export const PRODUCTS = [
  { id:'tomato',  cat:'vegetables', price:18,  unit_ar:'1 كجم',  unit_en:'1 kg',   name_ar:'طماطم بلدي',       name_en:'Fresh Tomatoes' },
  { id:'cucumber',cat:'vegetables', price:15,  unit_ar:'1 كجم',  unit_en:'1 kg',   name_ar:'خيار',             name_en:'Cucumber' },
  { id:'banana',  cat:'fruits',     price:25,  unit_ar:'1 كجم',  unit_en:'1 kg',   name_ar:'موز',              name_en:'Bananas' },
  { id:'orange',  cat:'fruits',     price:18,  unit_ar:'1 كجم',  unit_en:'1 kg',   name_ar:'برتقال',           name_en:'Navel Oranges' },
  { id:'milk',    cat:'dairy',      price:30,  unit_ar:'1 لتر',  unit_en:'1 L',    name_ar:'لبن كامل الدسم',   name_en:'Whole Milk' },
  { id:'bread',   cat:'bakery',     price:3,   unit_ar:'رغيف',   unit_en:'loaf',   name_ar:'عيش بلدي',         name_en:'Local Bread Loaf' },
  { id:'chicken', cat:'meat',       price:150, unit_ar:'1 كجم',  unit_en:'1 kg',   name_ar:'صدور فراخ طازة',   name_en:'Fresh Chicken Breast' },
  { id:'oj',      cat:'beverages',  price:25,  unit_ar:'1 لتر',  unit_en:'1 L',    name_ar:'عصير برتقال',      name_en:'Orange Juice' },
  { id:'soap',    cat:'household',  price:45,  unit_ar:'750 مل', unit_en:'750 ml', name_ar:'صابون أطباق',      name_en:'Dish Soap' },
  { id:'chips',   cat:'snacks',     price:12,  unit_ar:'150 جم', unit_en:'150 g',  name_ar:'شيبسي بالملح',     name_en:'Salted Potato Chips' },
];

export const PN = (p, lang) => lang==='ar' ? p.name_ar : p.name_en;

export const PU = (p, lang) => lang==='ar' ? p.unit_ar : p.unit_en;

export const CATS = [
  { id:'vegetables', icon:'carrot' },   { id:'fruits', icon:'apple' },
  { id:'dairy', icon:'milk' },          { id:'bakery', icon:'croissant' },
  { id:'meat', icon:'beef' },           { id:'beverages', icon:'cup-soda' },
  { id:'household', icon:'spray-can' }, { id:'snacks', icon:'cookie' },
];
