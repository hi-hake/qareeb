# قريب (Qareeb) — نسخة React

تحويل لتطبيق "قريب" من ملف HTML واحد (React عن طريق Babel Standalone في المتصفح) إلى مشروع **Vite + React** عادي بملفات منفصلة.

## التشغيل

```bash
npm install
npm run dev       # سيرفر التطوير على http://localhost:5173
npm run build     # بناء نسخة الإنتاج في dist/
npm run preview   # معاينة نسخة الإنتاج
```

## إيه اللي اتغيّر عن الملف الأصلي

- **Babel Standalone + CDN scripts** (React, ReactDOM, lucide, Tailwind CDN, Leaflet) →
  استبدلوا بحزم npm حقيقية (`react`, `react-dom`, `lucide-react`, `leaflet`) وبـ **Tailwind
  v3** مُدار بـ PostCSS بدل الـ Play CDN.
- الملف الواحد (2296 سطر) اتقسّم لموديولات حسب المسؤولية:
  - `src/data/` — الثوابت والنصوص (منتجات، متاجر، ترجمات).
  - `src/lib/` — دوال مساعدة عامة (تنسيق، تخزين محلي، حساب الأسعار، تحقق كروت الدفع).
  - `src/services/` — التكامل مع OpenStreetMap/Overpass/Nominatim والبيانات التجريبية.
  - `src/components/` — كل مكوّن React في ملفه، بما فيها `components/ui/` للمكوّنات العامة
    زي `Modal` و`IconBtn` و`Field`.
  - `src/App.jsx` — منطق التطبيق الرئيسي وربط المكوّنات ببعض.
- أيقونات **lucide** كانت بتتحمّل من CDN وتترسم بـ `data-lucide` في الـ DOM مباشرة؛ دلوقتي
  بتتسحب كمكوّنات React من `lucide-react` عن طريق خريطة أسماء واحدة في
  `src/components/Icon.jsx` (سهل تضيف عليها أي أيقونة جديدة).
- خريطة **Leaflet** (`src/components/StoreMap.jsx`) بقت بتستورد `leaflet` كباكدج بدل
  `window.L` العالمية، وبتتعامل مع فشل تحميل المكتبة بعرض رسالة بديلة بدل ما تفترض إنها
  دايمًا موجودة.
- كل التصرفات والمنطق (السلة، تسجيل الدخول، لوحة التاجر، مقارنة الأسعار، تحديد الموقع،
  الدفع التجريبي، التخزين في localStorage) **متطابقة تمامًا** مع النسخة الأصلية — مفيش
  إعادة كتابة للمنطق، بس نقل وتقسيم.

## ملاحظات

- الخطوط (Space Grotesk / IBM Plex Sans Arabic) لسه بتتحمّل من Google Fonts زي الأصل.
- بيانات المتاجر التجريبية وأسعار المنتجات لسه Mock — مفيش باك-إند حقيقي، بالظبط زي
  الملف الأصلي (البيانات بتتخزن في `localStorage`).
