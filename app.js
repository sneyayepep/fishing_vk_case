/* VK Market — interactive product concept, no VK API or payments */
(() => {
  'use strict';
  const STORAGE = 'vk-market-pilot-2026-v2';
  const SELLER_ID = 'archive';
  const DEMO_COMMISSION_RATE = 0.05; // Hypothetical MVP rate, not an actual VK tariff.
  const fmt = new Intl.NumberFormat('ru-RU');
  const money = (n) => `${fmt.format(Number(n) || 0)} ₽`;
  const dateIn = (days) => { const d = new Date(); d.setDate(d.getDate() + days); d.setHours(19, 0, 0, 0); return d.toISOString(); };
  const dateLabel = (iso, withTime = false) => new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}) }).format(new Date(iso));
  const escapeHTML = (s) => String(s ?? '').replace(/[&<>"']/g, (x) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
  const image = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1000&q=82`;
  const photos = {
    jacket: image('photo-1544923246-77307dd654cb'),
    lamp: image('photo-1507473885765-e6ed057f782c'),
    bag: image('photo-1548036328-c9fa89d128fa'),
    chair: image('photo-1503602642458-232111445657'),
    camera: image('photo-1516035069371-29a1b244cc32'),
    sneaker: image('photo-1542291026-7eec264c27ff'),
    vase: image('photo-1578749556568-bc2c40e68b61'),
    sweater: image('photo-1434389677669-e08b4cac3105'),
    coffee: image('photo-1559056199-641a0ac8b55e'),
    beauty: image('photo-1608248543803-ba4f8c70ae0b'),
    vinyl: image('photo-1461360228754-6e81c478b882'),
    decor: image('photo-1490312278390-ab64016e0aa9'),
    bread: image('photo-1509440159596-0249088772ff'),
    berries: image('photo-1464965911861-746a04b4bca6'),
    cheese: image('photo-1559561853-08451507cbe7'),
    honey: image('photo-1587049352851-8d4e89133924'),
    chocolate: image('photo-1511381939415-e44015466834'),
    granola: image('photo-1517673400267-0251440c45dc'),
    eggs: image('photo-1506976785307-8732e854ad03'),
    pasta: image('photo-1551183053-bf91a1d81141'),
    oil: image('photo-1474979266404-7eaacbcd87c5'),
    cookies: image('photo-1499636136210-6f4ee915583e'),
    tomatoes: image('photo-1546094096-0df4bcaaa337'),
    tea: image('photo-1597318181409-cf64d0b5d8a2'),
  };
  // Original vector illustration is visible offline; photos load over it when online.
  function illustration(p) {
    const motif = p.visual || (p.category==='Продукты питания' ? 'food' : null) || (p.id==='p1'||p.id==='p8'?'jacket':p.id==='p2'||p.id==='p12'?'lamp':p.id==='p3'?'bag':p.id==='p4'?'chair':p.id==='p5'?'camera':p.id==='p6'?'shoe':p.id==='p7'?'vase':p.id==='p9'?'coffee':p.id==='p10'?'beauty':p.id==='p11'?'vinyl':p.category==='Гардероб'?'jacket':'vase');
    const common='stroke="#47566e" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"';
    const shapes={
      jacket:`<path d="M64 36 43 50 27 87l23 13 13-17v79h94V83l13 17 23-13-16-37-21-14-27 21h-38Z" fill="#879eb5" ${common}/><path d="m83 38 27 32 27-32m-27 32v90m0-72v2m0 18v2m0 18v2" fill="none" stroke="#dce9f4" stroke-width="3"/><path d="m64 36 24-6 22 40 22-40 24 6m-66 63h61" fill="none" ${common}/><path d="m68 122 28 0m28 0h28" stroke="#b4c8d9" stroke-width="2"/>`,
      lamp:`<ellipse cx="110" cy="176" rx="58" ry="10" fill="#647486" opacity=".17"/><path d="M82 57 49 112h122l-33-55Z" fill="#d4ba9f" ${common}/><path d="M108 112v49m-37 5h78l-9-11H80Z" fill="#b7a089" ${common}/><path d="M92 58h36" stroke="#5c6171" stroke-width="4"/>`,
      bag:`<path d="M61 85c0-37 17-53 49-53s49 16 49 53" fill="none" stroke="#74675d" stroke-width="12"/><path d="M51 83q59-22 118 0l10 90H41Z" fill="#b99479" ${common}/><path d="M44 110h132M90 126h40" fill="none" stroke="#e3c5ae" stroke-width="4"/><path d="m89 81 0 31m42-31v31" stroke="#6a574e" stroke-width="4"/>`,
      chair:`<rect x="63" y="29" width="94" height="92" rx="29" fill="#b38d6d" ${common}/><path d="M57 111h106l-6 28H63Z" fill="#9c785c" ${common}/><path d="m67 138-12 51m94-51 12 51" ${common} stroke-width="6"/><path d="M90 49v49m20-51v52m20-51v50" stroke="#d0b098" stroke-opacity=".7"/>`,
      camera:`<rect x="32" y="69" width="156" height="98" rx="13" fill="#4c5460" ${common}/><path d="m61 69 15-24h58l15 24" fill="#677381" ${common}/><circle cx="111" cy="118" r="34" fill="#bbc5cf" ${common}/><circle cx="111" cy="118" r="24" fill="#354255" ${common}/><circle cx="111" cy="118" r="12" fill="#657c92"/><rect x="44" y="80" width="22" height="9" rx="3" fill="#c9d7e5"/>`,
      shoe:`<path d="M28 134q28 3 58-39 19 33 37 34 15 1 31 13 18 10 41 12v21H24Z" fill="#cf625f" ${common}/><path d="M34 160h157M90 118l14 14m-4-24 16 15m-4-24 17 14" stroke="#f6d8d5" stroke-width="4"/><path d="M23 174h171" stroke="#556071" stroke-width="6"/>`,
      vase:`<path d="M84 37h52l-8 30c27 19 29 52 22 80-5 23-19 32-40 32s-35-9-40-32c-7-28-5-61 22-80Z" fill="#cdb69f" ${common}/><path d="M86 38h48M76 120c20 10 47 11 68 0" stroke="#efe5d6" stroke-width="5"/><ellipse cx="110" cy="40" rx="26" ry="7" fill="#99826d"/>`,
      coffee:`<path d="M66 44h88l-11 126H77Z" fill="#b8a08b" ${common}/><path d="m73 61 74 0M83 151h54" stroke="#e2d0bb" stroke-width="5"/><circle cx="110" cy="111" r="27" fill="#e8d5bd"/><path d="M100 107c14-22 31 7 10 20-18-2-24-18-10-20Z" fill="#8a644c"/>`,
      beauty:`<rect x="47" y="72" width="59" height="106" rx="12" fill="#eee6db" ${common}/><rect x="114" y="54" width="58" height="124" rx="10" fill="#b5bbb1" ${common}/><path d="M63 57h26v15H63Zm63-18h33v15h-33" fill="#918e8b" ${common}/><path d="M60 119h32m34-9h33" stroke="#9a9b95" stroke-width="3"/>`,
      vinyl:`<rect x="43" y="32" width="134" height="150" rx="3" fill="#c6aca1" ${common}/><circle cx="110" cy="107" r="61" fill="#32353c"/><circle cx="110" cy="107" r="41" fill="none" stroke="#5d6370" stroke-width="1.6"/><circle cx="110" cy="107" r="22" fill="#a0807d"/><circle cx="110" cy="107" r="4" fill="#e8dfda"/>`,
      bread:`<path d="M43 118c-9-23 11-61 67-67 56 6 76 44 67 67l-8 52H51Z" fill="#c98d52" ${common}/><path d="m72 92 14 19m12-32 13 22m18-19 12 21" stroke="#f4d8ae" stroke-width="8" stroke-linecap="round"/><path d="M49 148q62 16 122 0" fill="none" stroke="#e6b47b" stroke-width="5"/>`,
      berries:`<path d="M42 119q1 61 68 61t68-61Z" fill="#e9d9c9" ${common}/><ellipse cx="110" cy="119" rx="69" ry="17" fill="#d8c1ae"/><g fill="#da4455"><circle cx="62" cy="107" r="20"/><circle cx="89" cy="108" r="22"/><circle cx="117" cy="104" r="22"/><circle cx="151" cy="109" r="21"/><circle cx="106" cy="82" r="22"/></g><g fill="#5c8e58"><path d="m62 83 0-13m-7 7 14-5m37-10 1-14m-9 6 17-3m35 39 5-15" stroke="#5c8e58" stroke-width="5" stroke-linecap="round"/></g>`,
      cheese:`<path d="M37 134 156 74l28 80-119 32Z" fill="#ffdb86" ${common}/><path d="M37 134 156 74l28 12-119 60Z" fill="#ffeeb8" ${common}/><circle cx="103" cy="143" r="9" fill="#e9b758"/><circle cx="148" cy="128" r="11" fill="#e9b758"/><circle cx="81" cy="169" r="7" fill="#e9b758"/>`,
      honey:`<rect x="64" y="56" width="92" height="123" rx="16" fill="#e9b649" ${common}/><rect x="71" y="43" width="78" height="22" rx="5" fill="#88694c" ${common}/><rect x="73" y="107" width="75" height="38" rx="8" fill="#ffedbf"/><path d="M105 114c-20 18 5 29 14 11" fill="none" stroke="#d29d36" stroke-width="6" stroke-linecap="round"/>`,
      chocolate:`<rect x="52" y="43" width="117" height="139" rx="8" fill="#7d503e" ${common}/><path d="M91 43v139m39-139v139M52 89h117M52 135h117" stroke="#b67e59" stroke-width="5"/><path d="M60 51h26v29H60m39-29h22v29H99m40-29h22v29h-22" fill="#9d6a4f"/>`,
      granola:`<path d="M35 117q8 66 75 66t75-66Z" fill="#f2ebdb" ${common}/><ellipse cx="110" cy="116" rx="76" ry="21" fill="#d7b68d" ${common}/><g fill="#a37442"><circle cx="67" cy="107" r="10"/><circle cx="89" cy="121" r="11"/><circle cx="113" cy="103" r="12"/><circle cx="139" cy="121" r="12"/><circle cx="160" cy="108" r="9"/></g><g fill="#e0c69b"><ellipse cx="99" cy="102" rx="9" ry="4"/><ellipse cx="147" cy="103" rx="10" ry="4"/></g>`,
      eggs:`<rect x="36" y="97" width="148" height="82" rx="14" fill="#b6c2ae" ${common}/><path d="M48 98v-29q0-13 14-13h95q14 0 14 13v29" fill="#d6ded0" ${common}/><g fill="#eee0c4"><ellipse cx="67" cy="106" rx="18" ry="25"/><ellipse cx="109" cy="106" rx="18" ry="25"/><ellipse cx="151" cy="106" rx="18" ry="25"/></g><path d="M36 136h148" stroke="#8c9e8a" stroke-width="4"/>`,
      pasta:`<ellipse cx="110" cy="150" rx="82" ry="32" fill="#eee5da" ${common}/><g fill="none" stroke="#e3b765" stroke-width="8" stroke-linecap="round"><path d="M55 141q22-54 48-1t50-6"/><path d="M58 157q26-45 50-4t54-9"/><path d="M67 126q44-27 72 16"/><path d="M68 166q35-22 82-5"/></g><path d="m125 107 15-20" stroke="#5c9358" stroke-width="6"/>`,
      oil:`<rect x="79" y="63" width="62" height="116" rx="13" fill="#81995e" ${common}/><path d="M96 63V34h28v29" fill="#6b7b56" ${common}/><rect x="99" y="21" width="22" height="17" rx="3" fill="#4a5947" ${common}/><rect x="87" y="101" width="46" height="50" rx="6" fill="#e8e0b8"/><path d="M101 137q18-16 20-25" stroke="#79964e" stroke-width="4"/>`,
      cookies:`<g fill="#c79b69" ${common}><circle cx="83" cy="136" r="39"/><circle cx="135" cy="108" r="36"/></g><g fill="#704b3e"><circle cx="68" cy="122" r="6"/><circle cx="96" cy="148" r="7"/><circle cx="85" cy="118" r="5"/><circle cx="146" cy="98" r="6"/><circle cx="129" cy="116" r="5"/></g>`,
      tomatoes:`<g fill="#da5d49" ${common}><circle cx="74" cy="124" r="32"/><circle cx="132" cy="127" r="35"/><circle cx="112" cy="85" r="30"/></g><g fill="#579058"><path d="m75 89-11-11 11 5 12-9-5 16m31-35-8-12 9 5 12-9-4 17m13 37-8-11 11 6 11-8-5 17" stroke="#579058" stroke-width="5" stroke-linejoin="round"/></g>`,
      tea:`<path d="M48 98h118v35q0 44-59 44t-59-44Z" fill="#dae8da" ${common}/><path d="M167 105h8q26 0 20 25-5 16-32 14" fill="none" ${common}/><path d="M65 116h83" stroke="#adc3ad" stroke-width="6"/><path d="M92 71q-12-14 1-30m28 33q-12-14 1-30" fill="none" stroke="#91aa96" stroke-width="5" stroke-linecap="round"/>`,
      fish:`<path d="M36 110C73 58 133 52 170 99l27-27v76l-27-27c-37 47-97 41-134-11Z" fill="#7fa9ba" ${common}/><circle cx="72" cy="103" r="6" fill="#243e53"/><path d="m95 78 22 28-22 28m34-57 22 29-22 28" fill="none" stroke="#d4eff5" stroke-width="5" stroke-linecap="round"/>`,
      rod:`<path d="M40 176 164 35" stroke="#82664b" stroke-width="9" stroke-linecap="round"/><path d="m72 138 94-104" stroke="#374e61" stroke-width="4"/><circle cx="81" cy="133" r="29" fill="#8eafbf" ${common}/><circle cx="81" cy="133" r="18" fill="#e9f4f7" ${common}/><path d="m80 163 11 26m-13-55h-24" fill="none" ${common}/>`,
      reel:`<circle cx="107" cy="109" r="54" fill="#819aaf" ${common}/><circle cx="107" cy="109" r="33" fill="#d8e8ef" ${common}/><circle cx="107" cy="109" r="14" fill="#537387"/><path d="m158 114 30 18-13 20m-73-98V27" fill="none" stroke="#537387" stroke-width="9" stroke-linecap="round"/>`,
      tackle:`<rect x="36" y="70" width="148" height="106" rx="12" fill="#b8cdd7" ${common}/><path d="M39 106h143M77 106v66m70-66v66" stroke="#7294a8" stroke-width="4"/><rect x="83" y="51" width="54" height="19" rx="6" fill="#8eafbf" ${common}/><path d="M58 132h14m34 0h14m34 0h14" stroke="#e8f1f5" stroke-width="6" stroke-linecap="round"/>`,
      boots:`<path d="M42 43h51v98l18 24v21H33v-31h9Zm89 0h50v98l17 24v21h-77v-31h10Z" fill="#7896a0" ${common}/><path d="M34 171h76m12 0h77" stroke="#dbe8e8" stroke-width="6"/>`,
      vest:`<path d="m61 34-23 37 18 119h108l18-119-23-37-25 21h-48Z" fill="#789c83" ${common}/><path d="M110 55v132M61 109h39v36H66m59-36h38v36h-33" fill="none" stroke="#e1f0dd" stroke-width="5"/>`,
      thermos:`<rect x="77" y="41" width="66" height="145" rx="15" fill="#88a7ae" ${common}/><rect x="83" y="26" width="54" height="26" rx="7" fill="#5d7e8e" ${common}/><path d="M86 101h48m-48 13h48" stroke="#dbe9e9" stroke-width="5"/>`,
      cap:`<path d="M48 117c0-46 26-73 63-73s62 27 62 73Z" fill="#7798ac" ${common}/><path d="M34 117h165q-35 41-102 23Z" fill="#a6c0c9" ${common}/>`,
      bottle:`<rect x="69" y="68" width="82" height="112" rx="16" fill="#e6d5b1" ${common}/><rect x="87" y="43" width="46" height="29" rx="5" fill="#8ab9c7" ${common}/><circle cx="110" cy="125" r="24" fill="#fff3d5"/><path d="M110 110v30m-15-15h30" stroke="#e8b65d" stroke-width="5"/>`,
      knife:`<path d="M45 161 150 50q31-20 33-9t-12 36L70 179Z" fill="#c4d6de" ${common}/><path d="m44 161 26 18" stroke="#6c8499" stroke-width="15" stroke-linecap="round"/>`,
      kettle:`<ellipse cx="110" cy="181" rx="63" ry="9" fill="#466574" opacity=".16"/><path d="M61 88h98l-10 77q-2 10-13 10H84q-11 0-13-10Z" fill="#879faa" ${common}/><path d="M56 88h108l-6-14H62Z" fill="#c6d5dd" ${common}/><path d="M96 73V61h28v12M76 85Q73 38 110 33q37 5 34 52" fill="none" ${common}/><path d="M74 116h72m-69 28h66" stroke="#cce0e6" stroke-width="5"/>`,
      lure:`<path d="M42 114q29-47 99-20l31 20-31 20q-70 27-99-20Z" fill="#63aac4" ${common}/><path d="m41 114-22-18v36Z" fill="#4e91a4" ${common}/><path d="M79 94q21 24 46 32m-24-37q15 14 35 19" stroke="#e6f2cf" stroke-width="7" fill="none"/><circle cx="145" cy="111" r="5" fill="#344857"/><path d="M78 139v19m52-22v22" fill="none" ${common}/><path d="m78 158-11 6m11-6 12 6m40-6-11 6m11-6 12 6" fill="none" ${common}/><path d="m25 116-9 0" ${common}/>`,
      food:`<path d="M35 125q7 65 75 65t75-65Z" fill="#e8d1b6" ${common}/><ellipse cx="110" cy="125" rx="75" ry="20" fill="#f4e8d5"/><circle cx="86" cy="110" r="21" fill="#ecaa6b"/><circle cx="125" cy="108" r="26" fill="#bb7552"/>`
    };
    return `<svg class="product-illustration" aria-hidden="true" viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg"><ellipse cx="110" cy="190" rx="72" ry="10" fill="#52687c" opacity=".09"/>${shapes[motif] || shapes.food}</svg>`;
  }
  const communities = [
    { id:'archive', name:'Речной Бисквит', handle:'rechnoy.biskvit', avatar:'Р', followers:'14,2 тыс.', category:'Торты и пирожные на заказ', color:'#dfe8f5', description:'Кондитерская из Рыбинска: торты, бенто, капкейки и десерты на заказ с речным декором и аккуратной упаковкой.', city:'Рыбинск', url:'https://vk.com/' },
    { id:'forma', name:'Волжский Дом', handle:'volga.home', avatar:'В', followers:'8,7 тыс.', category:'Дом и дача', color:'#e7e3d4', description:'Домашний текстиль, посуда и декор с мягкими отсылками к воде, берегу и лету у реки.', city:'Москва', url:'https://vk.com/' },
    { id:'mellow', name:'Щучий Гардероб', handle:'pike.wardrobe', avatar:'Щ', followers:'6,1 тыс.', category:'Гардероб', color:'#e6dde9', description:'Одежда и аксессуары для города и поездок: спокойные силуэты, волны, камыши и речные оттенки.', city:'Санкт-Петербург', url:'https://vk.com/' },
    { id:'lavka', name:'Пойма Hobby', handle:'poyma.hobby', avatar:'П', followers:'5,4 тыс.', category:'Хобби и развлечения', color:'#d8e7df', description:'Игры, аксессуары для прогулок и вещи для уютного отдыха на природе и у воды.', city:'Новосибирск', url:'https://vk.com/' },
    { id:'utro', name:'Пристань Care', handle:'pristan.care', avatar:'П', followers:'4,9 тыс.', category:'Красота и здоровье', color:'#f0e1de', description:'Повседневный уход, солнцезащита и витамины для спокойного ритма и поездок на свежий воздух.', city:'Петропавловск-Камчатский', url:'https://vk.com/' },
  ];
  const originalProducts = [
    { id:'p1', seller:'archive', title:'Торт «Речной закат» на заказ', category:'Продукты питания', price:4200, stock:6, color:'#eef3f8', photo:'./assets/p01.jpg', visual:'food', description:'Бисквитный торт с ягодной начинкой и декором в виде волн, камышей и золотых рыбок. Подходит для семейного праздника или заказа в подарок.', badge:'Лидер заказов', prepDays:'24–48 часов', deliveryDays:'1 день по Рыбинску', returnPolicy:'Условия возврата зависят от причины. Претензию о недостатке или несоответствии можно подать в разделе заказа.', madeToOrder:true, weightKg:2.1 },
    { id:'p2', seller:'forma', title:'Плед «Волжская линия»', category:'Дом и дача', price:3490, stock:9, color:'#eef3f8', photo:'./assets/p02.jpg', visual:'chair', description:'Мягкий плед для дома и дачи в песочно-голубой палитре с волнообразным рисунком.', badge:'Для уютных вечеров', deliveryDays:'1–2 дня по Рыбинску', returnPolicy:'Возврат и претензии оформляются в истории заказа. Условия зависят от причины и применимых правил.', weightKg:0.8 },
    { id:'p3', seller:'mellow', title:'Свитшот «Волжская волна»', category:'Гардероб', price:3890, stock:8, color:'#eef3f8', photo:'./assets/p03.jpg', visual:'jacket', description:'Свободный свитшот из плотного хлопка с графичным принтом волны на спине.', size:'S–XL', deliveryDays:'1–2 дня по Рыбинску', returnPolicy:'Возврат и претензии оформляются в истории заказа. Условия зависят от причины и применимых правил.', weightKg:0.6 },
    { id:'p4', seller:'forma', title:'Набор кружек «У причала», 2 шт.', category:'Дом и дача', price:1790, stock:12, color:'#eef3f8', photo:'./assets/p04.jpg', visual:'lamp', description:'Две керамические кружки в голубых оттенках с тонким рисунком рыбьей чешуи.', badge:'Пара для кухни', deliveryDays:'1–2 дня по Рыбинску', returnPolicy:'Возврат и претензии оформляются в истории заказа. Условия зависят от причины и применимых правил.', weightKg:1.0 },
    { id:'p5', seller:'archive', title:'Бенто-торт «Золотая рыбка»', category:'Продукты питания', price:1850, stock:10, color:'#eef3f8', photo:'./assets/p05.jpg', visual:'food', description:'Мини-торт на 2–4 персоны с гладким кремом, надписью по запросу и декором в речной палитре.', badge:'Персонализация', prepDays:'24 часа', deliveryDays:'1 день по Рыбинску', returnPolicy:'Условия возврата зависят от причины. Претензию о недостатке или несоответствии можно подать в разделе заказа.', madeToOrder:true, weightKg:0.7 },
    { id:'p6', seller:'mellow', title:'Дождевик «Туман над рекой»', category:'Гардероб', price:4590, stock:5, color:'#eef3f8', photo:'./assets/p06.jpg', visual:'vest', description:'Лёгкий влагозащитный дождевик с матовой фурнитурой и глубоким капюшоном.', size:'S–XL', badge:'Для прогулок в непогоду', deliveryDays:'1–2 дня по Рыбинску', returnPolicy:'Возврат и претензии оформляются в истории заказа. Условия зависят от причины и применимых правил.', weightKg:0.7 },
    { id:'p7', seller:'forma', title:'Поднос «Линия берега»', category:'Дом и дача', price:1590, stock:14, color:'#eef3f8', photo:'./assets/p07.jpg', visual:'vase', description:'Деревянный поднос для завтраков и сервировки с рисунком береговой линии.', deliveryDays:'1–2 дня по Рыбинску', returnPolicy:'Возврат и претензии оформляются в истории заказа. Условия зависят от причины и применимых правил.', weightKg:0.8 },
    { id:'p8', seller:'archive', title:'Эклеры «Голубая волна», 6 шт.', category:'Продукты питания', price:1320, stock:18, color:'#eef3f8', photo:'./assets/p08.jpg', visual:'food', description:'Набор эклеров с голубой глазурью, сливочным кремом и декоративными шоколадными рыбками.', badge:'На заказ к празднику', prepDays:'12–24 часа', deliveryDays:'В день изготовления по Рыбинску', returnPolicy:'Условия возврата зависят от причины. Претензию о недостатке или несоответствии можно подать в разделе заказа.', madeToOrder:true, weightKg:0.6 },
    { id:'p9', seller:'lavka', title:'Настольная игра «Речная экспедиция»', category:'Хобби и развлечения', price:2290, stock:11, color:'#eef3f8', photo:'./assets/p09.jpg', visual:'camera', description:'Семейная настольная игра про путешествие по воде, шлюзы и поиск спрятанных знаков на карте.', badge:'Для вечеров дома', deliveryDays:'1–2 дня по Рыбинску', returnPolicy:'Возврат и претензии оформляются в истории заказа. Условия зависят от причины и применимых правил.', weightKg:0.9 },
    { id:'p10', seller:'lavka', title:'Набор для пикника «У причала»', category:'Хобби и развлечения', price:2790, stock:7, color:'#eef3f8', photo:'./assets/p10.jpg', visual:'bag', description:'Плед, компактные приборы и контейнеры для неспешного пикника у воды.', badge:'Готовый комплект', deliveryDays:'1–2 дня по Рыбинску', returnPolicy:'Возврат и претензии оформляются в истории заказа. Условия зависят от причины и применимых правил.', weightKg:1.5 },
    { id:'p11', seller:'archive', title:'Капкейки «На отмели», 6 шт.', category:'Продукты питания', price:1680, stock:15, color:'#eef3f8', photo:'./assets/p11.jpg', visual:'food', description:'Шесть капкейков с голубым кремом, карамельными камышами и миниатюрными рыбками из мастики.', badge:'Хит для праздников', prepDays:'24 часа', deliveryDays:'В день изготовления по Рыбинску', returnPolicy:'Условия возврата зависят от причины. Претензию о недостатке или несоответствии можно подать в разделе заказа.', madeToOrder:true, weightKg:0.8 },
    { id:'p12', seller:'forma', title:'Аромасвеча «У воды»', category:'Дом и дача', price:990, stock:20, color:'#eef3f8', photo:'./assets/p12.jpg', visual:'beauty', description:'Свеча с ароматом свежего воздуха, древесины и чистого хлопка в стеклянном стакане.', deliveryDays:'1–2 дня по Рыбинску', returnPolicy:'Возврат и претензии оформляются в истории заказа. Условия зависят от причины и применимых правил.', weightKg:0.5 },
    { id:'p13', seller:'forma', title:'Подушка «Карпы», 45×45 см', category:'Дом и дача', price:1390, stock:10, color:'#eef3f8', photo:'./assets/p13.jpg', visual:'vase', description:'Декоративная подушка с графичным рисунком карпов и спокойной природной палитрой.', deliveryDays:'1–2 дня по Рыбинску', returnPolicy:'Возврат и претензии оформляются в истории заказа. Условия зависят от причины и применимых правил.', weightKg:0.6 },
    { id:'p14', seller:'forma', title:'Ланч-бокс «Причал»', category:'Дом и дача', price:1190, stock:16, color:'#eef3f8', photo:'./assets/p14.jpg', visual:'tackle', description:'Удобный контейнер для еды с герметичной крышкой и декоративной вставкой в речной гамме.', deliveryDays:'1–2 дня по Рыбинску', returnPolicy:'Возврат и претензии оформляются в истории заказа. Условия зависят от причины и применимых правил.', weightKg:0.4 },
    { id:'p15', seller:'lavka', title:'Бинокль «Берег», 8×25', category:'Хобби и развлечения', price:3190, stock:6, color:'#eef3f8', photo:'./assets/p15.jpg', visual:'camera', description:'Компактный бинокль для прогулок, поездок и наблюдения за природой.', badge:'Для выходных', deliveryDays:'1–2 дня по Рыбинску', returnPolicy:'Возврат и претензии оформляются в истории заказа. Условия зависят от причины и применимых правил.', weightKg:0.6 },
    { id:'p16', seller:'lavka', title:'Термос «Тихая заводь», 0,8 л', category:'Хобби и развлечения', price:1990, stock:13, color:'#eef3f8', photo:'./assets/p16.jpg', visual:'thermos', description:'Термос с двойными стенками и мягким градиентом цвета воды на корпусе.', deliveryDays:'1–2 дня по Рыбинску', returnPolicy:'Возврат и претензии оформляются в истории заказа. Условия зависят от причины и применимых правил.', weightKg:0.7 },
    { id:'p17', seller:'archive', title:'Набор пирожных «Кувшинки», 4 шт.', category:'Продукты питания', price:1490, stock:14, color:'#eef3f8', photo:'./assets/p17.svg', visual:'food', description:'Нежные пирожные с ягодным центром и кремовым декором в виде кувшинок.', prepDays:'12–24 часа', deliveryDays:'В день изготовления по Рыбинску', returnPolicy:'Условия возврата зависят от причины. Претензию о недостатке или несоответствии можно подать в разделе заказа.', madeToOrder:true, weightKg:0.5 },
    { id:'p18', seller:'archive', title:'Имбирное печенье «Рыбки», набор', category:'Продукты питания', price:980, stock:20, color:'#eef3f8', photo:'./assets/p18.svg', visual:'cookies', description:'Хрустящее печенье в форме рыбок с глазурью в голубых и песочных оттенках.', badge:'Для подарка', prepDays:'12 часов', deliveryDays:'1 день по Рыбинску', returnPolicy:'Условия возврата зависят от причины. Претензию о недостатке или несоответствии можно подать в разделе заказа.', madeToOrder:true, weightKg:0.35 },
    { id:'p19', seller:'archive', title:'Трайфл «Тихая заводь»', category:'Продукты питания', price:520, stock:25, color:'#eef3f8', photo:'./assets/p19.svg', visual:'food', description:'Порционный десерт в стакане с ванильным кремом, черникой и голубой крошкой.', prepDays:'6–12 часов', deliveryDays:'В день изготовления по Рыбинску', returnPolicy:'Условия возврата зависят от причины. Претензию о недостатке или несоответствии можно подать в разделе заказа.', madeToOrder:true, weightKg:0.25 },
    { id:'p20', seller:'lavka', title:'Скетчбук «Рыбинские берега»', category:'Хобби и развлечения', price:840, stock:18, color:'#eef3f8', photo:'./assets/p20.svg', visual:'vinyl', description:'Плотные листы и мягкая обложка с иллюстрацией набережной и воды.', deliveryDays:'1–2 дня по Рыбинску', returnPolicy:'Возврат и претензии оформляются в истории заказа. Условия зависят от причины и применимых правил.', weightKg:0.4 },
    { id:'p21', seller:'lavka', title:'Органайзер «Навигатор» для творчества', category:'Хобби и развлечения', price:1260, stock:15, color:'#eef3f8', photo:'./assets/p21.svg', visual:'tackle', description:'Контейнер для кистей, маркеров и мелочей с модульными секциями и прочной защёлкой.', deliveryDays:'1–2 дня по Рыбинску', returnPolicy:'Возврат и претензии оформляются в истории заказа. Условия зависят от причины и применимых правил.', weightKg:0.7 },
    { id:'p22', seller:'utro', title:'Рыбий жир в капсулах, 60 шт.', category:'Красота и здоровье', price:690, stock:18, color:'#eef3f8', photo:'./assets/p22.svg', visual:'bottle', description:'Пищевая добавка для демонстрации категории. Состав и ограничения смотрите на упаковке; это не лекарство.', badge:'Категория здоровья', deliveryDays:'1–2 дня по Рыбинску', returnPolicy:'Условия возврата зависят от состояния упаковки и основания обращения. Претензии оформляются через заказ.', weightKg:0.15 },
    { id:'p23', seller:'utro', title:'Солнцезащитный крем SPF 50', category:'Красота и здоровье', price:890, stock:21, color:'#eef3f8', photo:'./assets/p23.svg', visual:'bottle', description:'Лёгкий солнцезащитный крем для прогулок и поездок за город.', deliveryDays:'1–2 дня по Рыбинску', returnPolicy:'Условия возврата зависят от состояния упаковки и основания обращения. Претензии оформляются через заказ.', weightKg:0.12 },
    { id:'p24', seller:'utro', title:'Бальзам для губ «Свежий ветер»', category:'Красота и здоровье', price:260, stock:34, color:'#eef3f8', photo:'./assets/p24.svg', visual:'bottle', description:'Компактный бальзам для губ с мягкой текстурой и удобным форматом.', deliveryDays:'1–2 дня по Рыбинску', returnPolicy:'Условия возврата зависят от состояния упаковки и основания обращения. Претензии оформляются через заказ.', weightKg:0.05 },
    { id:'p25', seller:'utro', title:'Крем для рук «Мягкая вода»', category:'Красота и здоровье', price:390, stock:27, color:'#eef3f8', photo:'./assets/p25.svg', visual:'beauty', description:'Уходовый крем для рук с маслом ши и лёгким ароматом хлопка.', deliveryDays:'1–2 дня по Рыбинску', returnPolicy:'Условия возврата зависят от состояния упаковки и основания обращения. Претензии оформляются через заказ.', weightKg:0.08 },
    { id:'p26', seller:'utro', title:'Увлажняющая маска «Голубая лагуна»', category:'Красота и здоровье', price:1190, stock:12, color:'#eef3f8', photo:'./assets/p26.svg', visual:'beauty', description:'Маска для лица с комфортной текстурой и освежающим действием.', deliveryDays:'1–2 дня по Рыбинску', returnPolicy:'Условия возврата зависят от состояния упаковки и основания обращения. Претензии оформляются через заказ.', weightKg:0.1 },
    { id:'p27', seller:'mellow', title:'Панама «Камыш»', category:'Гардероб', price:1490, stock:17, color:'#eef3f8', photo:'./assets/p27.svg', visual:'cap', description:'Панама из хлопка с лаконичной вышивкой и мягкими зелёно-голубыми оттенками.', deliveryDays:'1–2 дня по Рыбинску', returnPolicy:'Возврат и претензии оформляются в истории заказа. Условия зависят от причины и применимых правил.', weightKg:0.2 },
    { id:'p28', seller:'mellow', title:'Шоппер «Судак»', category:'Гардероб', price:1290, stock:22, color:'#eef3f8', photo:'./assets/p28.svg', visual:'bag', description:'Вместительная сумка-шоппер с авторским принтом рыбы и береговых растений.', deliveryDays:'1–2 дня по Рыбинску', returnPolicy:'Возврат и претензии оформляются в истории заказа. Условия зависят от причины и применимых правил.', weightKg:0.3 },
    { id:'p29', seller:'mellow', title:'Футболка «Тихая вода»', category:'Гардероб', price:1890, stock:19, color:'#eef3f8', photo:'./assets/p29.svg', visual:'sweater', description:'Базовая футболка из хлопка с минималистичным принтом волны на груди.', size:'S–XL', deliveryDays:'1–2 дня по Рыбинску', returnPolicy:'Возврат и претензии оформляются в истории заказа. Условия зависят от причины и применимых правил.', weightKg:0.25 },
    { id:'p30', seller:'mellow', title:'Шарф «Устье»', category:'Гардероб', price:2190, stock:9, color:'#eef3f8', photo:'./assets/p30.svg', visual:'sweater', description:'Лёгкий шарф с абстрактным речным узором и мягкой текстурой.', deliveryDays:'1–2 дня по Рыбинску', returnPolicy:'Возврат и претензии оформляются в истории заказа. Условия зависят от причины и применимых правил.', weightKg:0.28 },
  ];
  const originalDrops = [
    {id:'d1', seller:'archive', title:'РЕЧНОЙ ПРАЗДНИК / 01', subtitle:'Торт, капкейки и эклеры для небольшого праздника', description:'Лимитированная сладкая коллекция от «Речного Бисквита»: праздничный торт, набор капкейков и голубые эклеры в одной подборке. Подходит для семейных встреч и камерных событий.', cover:originalProducts.find(p=>p.id==='p1').photo, startsAt:dateIn(3), status:'announced', itemIds:['p1','p8','p11'], limit:1},
    {id:'d2', seller:'archive', title:'СЛАДКИЙ БЕРЕГ / 02', subtitle:'Бенто-торт, печенье-рыбки и трайфлы', description:'Компактная коллекция для тёплого вечера: персональный бенто-торт, имбирное печенье и порционные трайфлы с декором в речной эстетике.', cover:originalProducts.find(p=>p.id==='p5').photo, startsAt:dateIn(6), status:'announced', itemIds:['p5','p18','p19'], limit:2},
  ];
  const demoPosts = [
    {id:'s1',author:'@rybinsk.weekend',name:'Выходные в Рыбинске',product:'p1',views:24100,opens:1218,orders:36,paid:22,date:'18 ноя'},
    {id:'s2',author:'@sweet.city.guide',name:'Сладкий гид',product:'p5',views:18800,opens:944,orders:28,paid:19,date:'16 ноя'},
    {id:'s3',author:'@volga.family',name:'Семейный Рыбинск',product:'p11',views:13900,opens:702,orders:19,paid:13,date:'14 ноя'},
    {id:'s4',author:'@rybinsk.events',name:'Городские события',product:'p8',views:12600,opens:610,orders:14,paid:9,date:'11 ноя'},
    {id:'s5',author:'@small.business.ru',name:'Малый бизнес рядом',product:'p1',views:9700,opens:436,orders:11,paid:7,date:'9 ноя'},
  ];
  const initialReviews = [
    {id:'seed-review-1',productId:'p1',orderId:null,rating:5,author:'Анна',text:'Торт приехал аккуратно упакованным, декор очень красивый. Вживую даже лучше, чем на фото.',date:'2026-11-15T12:00:00.000Z',demo:true},
    {id:'seed-review-2',productId:'p5',orderId:null,rating:5,author:'Елена',text:'Заказывали бенто-торт в подарок. Подпись сделали точно по просьбе, вкус нежный.',date:'2026-11-10T12:00:00.000Z',demo:true},
    {id:'seed-review-3',productId:'p8',orderId:null,rating:4,author:'Мария',text:'Эклеры свежие, глазурь красивая, а упаковка удобная для самовывоза.',date:'2026-11-17T10:00:00.000Z',demo:true},
    {id:'seed-review-4',productId:'p11',orderId:null,rating:5,author:'Олег',text:'Капкейки отлично смотрелись на празднике. Детали декора получились очень аккуратными.',date:'2026-11-13T13:00:00.000Z',demo:true},
    {id:'seed-review-5',productId:'p18',orderId:null,rating:4,author:'Светлана',text:'Печенье симпатичное и вкусное, взяли набор для подарка. Всё доставили вовремя.',date:'2026-11-09T17:00:00.000Z',demo:true}
  ];
  const defaultLogistics = () => ({address:'Рыбинск, Крестовая улица, 52 (демо)',handlingDays:2,regions:['Рыбинск'],methods:{cdek:true,yandex:true,courier:true,self:true},contact:'Сообщения сообщества'});
  const shopPosts = [
    {id:'community-post-1',productId:'p1',date:'20 ноября, 11:20',text:'Показываем наш торт «Речной закат» поближе: голубая глазурь, ягодная начинка и маленькие рыбки из декора. В карточке — сроки изготовления, доставка по Рыбинску и стоимость.'},
    {id:'community-post-2',productId:'p11',date:'18 ноября, 18:40',text:'Для камерного праздника собрали набор капкейков «На отмели». Их можно заказать прямо из поста, а в карточке посмотреть описание, рейтинг и варианты получения.'}
  ];
  function defaultState() { return { products:structuredClone(originalProducts), drops:structuredClone(originalDrops), orders:[], cart:[], favorites:['p2'], following:['archive'], reminders:[], connected:true, notifications:true, theme:'light', logistics:defaultLogistics(), returns:[], issues:[], reviews:structuredClone(initialReviews), shopEvents:[], commissionPayments:[] }; }


  const saved = (() => {try {return JSON.parse(localStorage.getItem(STORAGE)) || {};} catch{return {};}})();
  let model = {...defaultState(), ...saved};
  // Compatible with demo localStorage created before shipments, returns and ratings were added.
  if(!Array.isArray(model.returns)) model.returns=[];
  if(!Array.isArray(model.issues)) model.issues=[];
  if(!Array.isArray(model.shopEvents)) model.shopEvents=[];
  if(!Array.isArray(model.reviews)) model.reviews=structuredClone(initialReviews);
  if(!Array.isArray(model.commissionPayments)) model.commissionPayments=[];
  model.logistics={...defaultLogistics(),...(model.logistics||{}),methods:{...defaultLogistics().methods,...(model.logistics?.methods||{})}};

  if (model.logisticsVersion !== 'rybinsk-2026-v1') {
    model.logistics = defaultLogistics();
    model.logisticsVersion = 'rybinsk-2026-v1';
    try { localStorage.setItem(STORAGE, JSON.stringify(model)); } catch {}
  }
  if (model.reviewSeedVersion !== 'river-market-reviews-v1') {
    const userReviews = (Array.isArray(model.reviews) ? model.reviews : []).filter(r => !r.demo);
    model.reviews = [...structuredClone(initialReviews), ...userReviews];
    model.reviewSeedVersion = 'river-market-reviews-v1';
    try { localStorage.setItem(STORAGE, JSON.stringify(model)); } catch {}
  }

  // Update only the seeded demo assortment once. Preserve custom seller products and other user data.
  if (model.catalogVersion !== 'river-market-2026-v1') {
    // Treat all built-in IDs as seeded products, including newly added fishing and beauty items.
    // Otherwise the initial migration duplicates p25–p30 on a fresh install.
    const builtInIds = new Set(originalProducts.map(p => p.id));
    const customProducts = Array.isArray(model.products)
      ? model.products.filter(p => !builtInIds.has(p.id))
      : [];
    model.products = [...structuredClone(originalProducts), ...customProducts];
    model.catalogVersion = 'river-market-2026-v1';
    try { localStorage.setItem(STORAGE, JSON.stringify(model)); } catch {}
  }
  // Merge missing demo items without touching products created by the user.
  if (!Array.isArray(model.products)) model.products = structuredClone(originalProducts);
  const knownIds = new Set(model.products.map(p => p.id));
  for (const p of originalProducts) {
    if (!knownIds.has(p.id)) model.products.push(structuredClone(p));
  }
  // Fix duplicate seed IDs left by an earlier demo migration; keep the first saved entry.
  const seedIds = new Set(originalProducts.map(p => p.id));
  const seenSeedIds = new Set();
  model.products = model.products.filter(p => {
    if (!seedIds.has(p.id)) return true;
    if (seenSeedIds.has(p.id)) return false;
    seenSeedIds.add(p.id);
    return true;
  });
  // Rename the previously seeded SPF product for returning users without resetting their cart or orders.
  // The four new beauty products are merged above by stable IDs into existing localStorage.
  if (model.beautyCatalogVersion !== 'beauty-2026-v2') {
    const spf = model.products.find(p=>p.id==='p10');
    if (spf && spf.title==='Крем SPF 50 для отдыха у воды') {
      spf.title='Солнцезащитный крем SPF 50, 50 мл';
      spf.description='Крем с высокой степенью защиты от солнца для ежедневного использования. Способ применения указан на упаковке.';
    }
    model.beautyCatalogVersion='beauty-2026-v2';
    try { localStorage.setItem(STORAGE, JSON.stringify(model)); } catch {}
  }
  // Refresh only the two built-in drops, preserving launch status, dates, reminders and user-created drops.
  // Saved browser data otherwise keeps the old vintage/ceramics copy forever.
  if (model.dropContentVersion !== 'river-drops-2026-v1') {
    if (!Array.isArray(model.drops)) model.drops = [];
    for (const seed of originalDrops) {
      const existing = model.drops.find(d=>d.id===seed.id);
      if (existing) {
        Object.assign(existing, {
          title:seed.title, subtitle:seed.subtitle, description:seed.description,
          cover:seed.cover, itemIds:[...seed.itemIds]
        });
      } else model.drops.push(structuredClone(seed));
    }
    model.dropContentVersion = 'river-drops-2026-v1';
    try { localStorage.setItem(STORAGE, JSON.stringify(model)); } catch {}
  }
  // Product artwork update only for seeded SKUs; user-created items and orders are preserved.
  if (model.artworkVersion !== 'original-river-products-v1') {
    const seedPhotos=new Map(originalProducts.map(p=>[p.id,p.photo]));
    model.products.forEach(p=>{if(seedPhotos.has(p.id))p.photo=seedPhotos.get(p.id);});
    for(const seed of originalDrops){const old=model.drops.find(d=>d.id===seed.id);if(old)old.cover=seed.cover;}
    model.artworkVersion='original-river-products-v1';
    try{localStorage.setItem(STORAGE,JSON.stringify(model));}catch{}
  }
  if (model.deliveryProvidersVersion !== 'rybinsk-providers-v2') {
    model.logistics={...model.logistics, regions:['Рыбинск'],methods:{cdek:true,yandex:true,courier:true,self:true}};
    model.deliveryProvidersVersion='rybinsk-providers-v2';
    try{localStorage.setItem(STORAGE,JSON.stringify(model));}catch{}
  }
  const ONBOARDING_KEY = 'vk-market-guided-tour-v3';
  const ONBOARDING_RESUME_KEY = 'vk-market-guided-tour-session-v2';
  const savedTour = (() => {
    try {
      const value=JSON.parse(sessionStorage.getItem(ONBOARDING_RESUME_KEY)||'null');
      return value && ['buyer','seller'].includes(value.role) && Number.isInteger(value.step) && value.step>=0 ? value : null;
    } catch { return null; }
  })();
  let ui = {onboarding:false, onboardingPreview:!!savedTour, onboardingStep:savedTour?.step??0, onboardingRole:savedTour?.role??'buyer',category:'Все', query:'', sort:'popular', minPrice:'', maxPrice:'', inStock:false, filtersOpen:false, filterDraft:null, period:30, metric:'opens', analyticsCategory:'Все', analyticsProduct:'all', modal:null, editing:null, toast:'', sidebar:false, checkoutDraft:null, currentOrder:null, currentProduct:null, currentReturn:null, currentSource:null};
  const persist = () => { try { localStorage.setItem(STORAGE, JSON.stringify(model)); } catch{} };
  // The first-run guide is separate from shop data and never resets orders.
  if (model.theme !== 'light') { model.theme = 'light'; persist(); }
  const community = (id) => communities.find(s=>s.id===id) || communities[0];
  const cityFrom=(name)=>({'Москва':'Москвы','Санкт-Петербург':'Санкт-Петербурга','Новосибирск':'Новосибирска','Рыбинск':'Рыбинска','Петропавловск-Камчатский':'Петропавловска-Камчатского'}[name]||name);
  const product = (id) => model.products.find(p=>p.id===id);
  const ownedProducts = () => model.products.filter(p=>p.seller===SELLER_ID);
  const ownOrders = () => model.orders.filter(o=>o.seller===SELLER_ID);
  // Orders are distinct from synthetic Shop-post statistics. Cancelled orders never count.
  const orderSummary = (category='Все', productId='all') => {
    const eligible = ownOrders().filter(o=>o.status!=='Отменён');
    const totals = eligible.map(o=>{
      if(category==='Все' && productId==='all') return Number(o.total)||0;
      return o.items.reduce((sum,item)=>{
        const p=product(item.id);
        if(!p || p.seller!==SELLER_ID || (category!=='Все'&&p.category!==category) || (productId!=='all'&&p.id!==productId)) return sum;
        return sum + (Number(item.unitPrice ?? p.price)||0)*item.qty;
      },0);
    }).filter(total=>total>0);
    const total=totals.reduce((sum,value)=>sum+value,0);
    return {count:totals.length,total,average:totals.length?total/totals.length:null};
  };

  // Settlement demo: the fee is calculated on goods only, after simulated payment
  // AND fulfilment. No commission is taken on shipping or an unpaid/cancelled order.
  const commissionEligibleOrders = () => ownOrders().filter(o => o.paid === true && o.status === 'Завершён');
  const commissionItemBase = (o) => {
    const refundedItems = new Set(model.returns.filter(r => r.orderId === o.id && r.status === 'refunded').map(r => r.productId));
    return (o.items||[]).reduce((total, item) => {
      if (refundedItems.has(item.id)) return total;
      return total + Math.max(0, Number(item.unitPrice ?? product(item.id)?.price ?? 0)) * Math.max(0, Number(item.qty)||0);
    }, 0);
  };
  const commissionRecognitionDate = (o) => {
    const events = Array.isArray(o.events) ? o.events : [];
    const paid = o.paidAt || events.findLast?.(e => /Тестовая оплата подтверждена/i.test(e.label||''))?.at || o.createdAt;
    const fulfilled = o.completedAt || events.findLast?.(e => /Получение зафиксировано/i.test(e.label||''))?.at || o.createdAt;
    return new Date(Math.max(new Date(paid).getTime()||0, new Date(fulfilled).getTime()||0)).toISOString();
  };
  const commissionLedger = () => commissionEligibleOrders().map(o => {
    const base=commissionItemBase(o);
    return {orderId:o.id, base, fee:Math.round(base*DEMO_COMMISSION_RATE), at:commissionRecognitionDate(o)};
  }).filter(x=>x.base>0);
  const commissionPeriodStart = (days) => Date.now() - days*24*60*60*1000;
  const commissionPeriodTotals = (days) => {
    const start=commissionPeriodStart(days);
    const earned=commissionLedger().filter(x => new Date(x.at).getTime()>=start);
    const payments=model.commissionPayments.filter(x => x.seller===SELLER_ID && new Date(x.at).getTime()>=start);
    return {count:earned.length,base:earned.reduce((n,x)=>n+x.base,0),fee:earned.reduce((n,x)=>n+x.fee,0),paid:payments.reduce((n,x)=>n+x.amount,0)};
  };
  const commissionBalance = () => {
    const charged=commissionLedger().reduce((n,x)=>n+x.fee,0);
    const paid=model.commissionPayments.filter(x=>x.seller===SELLER_ID).reduce((n,x)=>n+x.amount,0);
    return {charged,paid,due:Math.max(0,charged-paid),credit:Math.max(0,paid-charged)};
  };
  const commissionSection = () => {
    const active=commissionPeriodTotals(ui.period),balance=commissionBalance();
    const rows=[7,30,90].map(days=>{
      const x=commissionPeriodTotals(days);
      return `<tr class="${days===ui.period?'commission-selected-row':''}"><td><strong>${days} дней</strong>${days===ui.period?'<span class="commission-current">Выбрано</span>':''}</td><td>${fmt.format(x.count)}</td><td>${money(x.base)}</td><td>${money(x.fee)}</td><td><strong>${money(x.paid)}</strong></td></tr>`;
    }).join('');
    return `<section class="commission-section panel" aria-label="Комиссия Маркета">
      <div class="commission-heading"><div><div class="eyebrow">ФИНАНСЫ МАГАЗИНА</div><h2>Комиссия VK Маркета</h2><p>Расчёт за ${ui.period} дней · только «Речной Бисквит» · независимо от фильтра категории</p></div><span class="commission-rate">5% <small>условная ставка</small></span></div>
      <div class="commission-kpis"><div class="commission-kpi"><span>База для комиссии</span><strong>${money(active.base)}</strong><small>Без доставки и возвратов</small></div><div class="commission-kpi"><span>Начислено за период</span><strong>${money(active.fee)}</strong><small>${active.count} оплаченных и завершённых заказов</small></div><div class="commission-kpi commission-paid"><span>Уплачено Маркету за период</span><strong>${money(active.paid)}</strong><small>Только отмеченные выплаты</small></div><div class="commission-kpi"><span>Остаток к оплате</span><strong>${money(balance.due)}</strong><small>За всё время, включая другие периоды</small></div></div>
      <div class="commission-toolbar"><p>Начисления — по дате завершения оплаченного заказа, выплаты — по дате тестового перевода. Возвращённые товары исключаются; реальные деньги не списываются.</p><div class="commission-buttons">${!model.commissionDemoLoaded && !ownOrders().length?`<button class="btn outline" type="button" data-action="seed-commission-demo">Пример за 90 дней</button>`:''}<button type="button" class="btn primary commission-pay-button" data-action="settle-commission" ${balance.due>0?'':'disabled'}>${icon('wallet',17)} Провести тестовую выплату ${money(balance.due)}</button></div></div>
      ${balance.credit>0?`<p class="commission-credit">Переплата после корректировки возвратов: ${money(balance.credit)}. Она не считается новой выплатой.</p>`:''}
      <div class="commission-history"><div><h3>Сравнение периодов</h3><small>Периоды пересекаются: 7 дней входят в 30 и 90. Суммы строк не складываются. Начисления и выплаты могут приходиться на разные дни.</small></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Период</th><th>Заказов</th><th>База</th><th>Начислено</th><th>Уплачено Маркету</th></tr></thead><tbody>${rows}</tbody></table></div></div>
    </section>`;
  };

  // All shipping, payment and return events below are local demo simulations, never carrier/API confirmations.
  const deliveryTypes = {cdek:'СДЭК — пункт выдачи', yandex:'Яндекс Маркет — пункт выдачи', courier:'Курьер до двери в Рыбинске', self:'Самовывоз из магазина', pvz:'Пункт выдачи (старый демозаказ)'};
  const deliveryMethods=['cdek','yandex','courier','self'];
  const demoCities=['Рыбинск'];
  const pointNames={'Рыбинск':{
    cdek:['СДЭК · Крестовая улица, 58 (демо)','СДЭК · улица Герцена, 12 (демо)'],
    yandex:['Яндекс Маркет · улица Пушкина, 8 (демо)','Яндекс Маркет · улица Бабушкина, 17 (демо)']
  }};
  const isPickupPoint=(method)=>['cdek','yandex','pvz'].includes(method);
  const logisticsFor=(sellerId)=>{
    if(sellerId===SELLER_ID) return model.logistics;
    const seller=community(sellerId);
    return {address:`${seller.city} · адрес самовывоза уточняется (демо)`,handlingDays:1,regions:['Россия'],methods:{cdek:true,yandex:true,courier:true,self:true},contact:'Сообщения сообщества'};
  };
  // Demonstration route estimates: delivery times/costs are intentionally not carrier quotes.
  const deliveryZones={
    archive:{cdek:'1–2 дня',yandex:'1–2 дня',courier:'1 день'},
    forma:{cdek:'3–5 дней',yandex:'4–6 дней',courier:'4–6 дней'},
    mellow:{cdek:'4–6 дней',yandex:'5–7 дней',courier:'5–7 дней'},
    lavka:{cdek:'7–11 дней',yandex:'8–12 дней',courier:'8–12 дней'},
    utro:{cdek:'12–18 дней',yandex:'14–20 дней',courier:'14–20 дней'}
  };
  const quoteDelivery=(method,city,items=model.cart,sellerId=null)=>{
    const seller=sellerId||product(items[0]?.id)?.seller||SELLER_ID;
    const cfg=logisticsFor(seller);
    const goods=items.map(i=>({p:product(i.id),qty:i.qty})).filter(x=>x.p);
    const kg=goods.reduce((n,x)=>n+(Number(x.p.weightKg)||0.6)*x.qty,0);
    const fresh=goods.some(({p})=>Boolean(p.madeToOrder) && p.category==='Продукты питания' && !/печень/i.test(p.title));
    const originCity=community(seller).city,local=originCity===city;
    const provider={cdek:'СДЭК (демо)',yandex:'Яндекс Маркет (демо)',courier:'Курьер до двери (демо)',self:`Магазин «${community(seller).name}»`,pvz:'ПВЗ (демо)'};
    const fail=(reason)=>({available:false,reason,originCity,city,provider:provider[method]||'Доставка (демо)'});
    if(!method||!cfg.methods?.[method])return fail('Этот способ продавцом не подключён');
    if(city!=='Рыбинск')return fail('В демонстрации указан город покупателя Рыбинск');
    if(method==='self' && !local)return fail(`Самовывоз доступен только в городе продавца — ${originCity}. Выберите доставку в Рыбинск.`);
    if(fresh && !local)return fail('Свежие десерты не отправляются между городами в этом демо');
    if(fresh && isPickupPoint(method))return fail('Для свежих тортов и пирожных ПВЗ недоступны. Выберите курьера или самовывоз.');
    if(isPickupPoint(method)&&kg>15)return fail('Вес превышает демонстрационный лимит ПВЗ 15 кг');
    if(method==='courier'&&kg>30)return fail('Вес превышает демонстрационный лимит курьера 30 кг');
    const zones=deliveryZones[seller]||deliveryZones.forma;
    const shippingDays=method==='self'?'после подготовки':zones[method==='pvz'?'cdek':method]||'Срок уточняется';
    const days=Math.max(1,Number(cfg.handlingDays)||1);
    const prep=goods.some(({p})=>p.madeToOrder)?'Изготовление по карточке товара':`Подготовка ${days} дн.`;
    const tier={archive:0,forma:1,mellow:2,lavka:3,utro:4}[seller]??2;
    const base={cdek:249,yandex:199,courier:350,self:0,pvz:249};
    const extra={cdek:180,yandex:190,courier:220,self:0,pvz:180};
    const cost=(base[method]||0)+tier*(extra[method]||0);
    return {available:true,price:cost,window:method==='self'?`${prep} · самовывоз в ${city}`:`${prep} + доставка ${shippingDays}`,shippingDays,originCity,city,kg:Math.round(kg*10)/10,provider:provider[method],reason:''};
  };
  const deliveryPreview=(p)=>{
    const modes=['cdek','yandex','courier','self'];
    const quotes=modes.map(m=>quoteDelivery(m,'Рыбинск',[{id:p.id,qty:1}],p.seller)).filter(q=>q.available);
    if(!quotes.length)return 'Способы уточняются у продавца';
    const isLocal=community(p.seller).city==='Рыбинск';
    const chosen=quotes.find(q=>isLocal&&q.shippingDays==='1 день')||quotes[0];
    return `${chosen.shippingDays}${p.madeToOrder?' после изготовления':` + подготовка ${Math.max(1,Number(logisticsFor(p.seller).handlingDays)||1)} дн.`} · пример`;
  };
  const allShipStatuses = ['not_created','created','accepted','transit','waiting','delivered'];
  const shipNames = {not_created:'Не оформлено',created:'Оформлено',accepted:'Принято перевозчиком',transit:'В пути',waiting:'Ожидает получения',delivered:'Вручено',preparing:'Готовится',ready:'Готово к выдаче',received:'Получено',delayed:'Задержано',lost:'Утрачено',damaged:'Повреждено'};
  const event = (label) => ({at:new Date().toISOString(),label});
  const orderIsReceived = (o) => o.status==='Завершён'||['delivered','received'].includes(o.shipment?.status);
  const canReview = (o,pid) => Boolean(o && orderIsReceived(o) && o.items.some(i=>i.id===pid) && o.status!=='Отменён');
  const myReview = (orderId,pid) => model.reviews.find(r=>r.orderId===orderId && r.productId===pid && !r.demo);
  const requestFor = (id) => model.returns.find(r=>r.id===id);
  const orderFor = (id) => model.orders.find(o=>o.id===id);
  const buyerReturns = (o) => model.returns.filter(r=>r.orderId===o.id);
  const carrierTimeline = (o) => {
    const events=[{label:'Заказ оформлен',at:o.createdAt},...(o.events||[])];
    if(o.shipment?.events)events.push(...o.shipment.events);
    return events.sort((a,b)=>new Date(a.at)-new Date(b.at));
  };
  const fmtDateTime = (iso) => iso?dateLabel(iso,true):'—';
  const timeline = (events) => `<ol class="event-timeline">${events.map(e=>`<li><span class="event-dot"></span><div><strong>${escapeHTML(e.label)}</strong><small>${fmtDateTime(e.at)}</small></div></li>`).join('')}</ol>`;
  const ratingStars = (score) => `<span class="review-stars" aria-label="${score} из 5">${'★'.repeat(Math.max(0,Math.min(5,score)))}<span>${'★'.repeat(5-Math.max(0,Math.min(5,score)))}</span></span>`;
  const reviewSection = (p) => {const list=model.reviews.filter(r=>r.productId===p.id).slice().reverse();const summary=reviewStats(p.id);return `<section class="block reviews-section" id="reviews"><div class="section-header"><div><h2>Отзывы о товаре</h2><p>Оценки покупателей</p></div>${ratingMarkup(p.id)}</div>${!list.length?'<div class="panel reviews-empty">Отзывов пока нет. После получения заказа можно оставить первый.</div>':`<div class="reviews-grid">${list.map(r=>`<article class="panel review-card"><div class="review-top"><strong>${escapeHTML(r.author)}</strong>${ratingStars(r.rating)}</div><small>${dateLabel(r.date)} ${r.demo?'· тестовый отзыв':'· подтверждённая покупка'}</small><p>${escapeHTML(r.text)}</p></article>`).join('')}</div>`}<div class="review-help">${icon('info',17)} Оставить отзыв можно из полученного заказа в профиле. Отзывы не публикуются в VK и сохраняются только в браузере.</div></section>`;};
  const shopEventsFor = (id) => model.shopEvents.filter(x=>x.productId===id);
  const shopPostStats = () => {
    const posts=shopPosts.map(post=>{
      const opens=model.shopEvents.filter(x=>x.postId===post.id&&x.kind==='open').length;
      const orders=ownOrders().filter(o=>o.status!=='Отменён').filter(o=>o.items.some(i=>i.sourcePostId===post.id)).length;
      return {...post,opens,orders};
    });
    return {posts,totalOpens:posts.reduce((s,p)=>s+p.opens,0),totalOrders:posts.reduce((s,p)=>s+p.orders,0)};
  };
  const reviewAnalytics = () => {
    const products=ownedProducts().filter(p=>(ui.analyticsCategory==='Все'||p.category===ui.analyticsCategory)&&(ui.analyticsProduct==='all'||p.id===ui.analyticsProduct));
    const ratings=products.flatMap(p=>model.reviews.filter(r=>r.productId===p.id));
    const avg=ratings.length?(ratings.reduce((s,r)=>s+r.rating,0)/ratings.length):null;
    const groups=products.map(p=>({p,...reviewStats(p.id)})).sort((a,b)=>b.count-a.count);
    return `<section class="block review-analytics"><div class="section-header"><div><h2>Оценки и отзывы</h2><p>По выбранным товарам «Речной Бисквит» · тестовые и оставленные в браузере отзывы</p></div></div><div class="stats-grid rating-stats">${statCard('Средний рейтинг',avg===null?'—':`${avg.toFixed(1).replace('.',',')} / 5`,'Средняя оценка по опубликованным отзывам','star')}${statCard('Всего отзывов',String(ratings.length),'Отзывы выбранных товаров','comment')}${statCard('Товаров с оценкой',String(groups.filter(g=>g.count).length),`Из ${products.length} выбранных товаров`,'box')}</div><div class="panel table-panel"><div class="table-wrap"><table class="data-table"><thead><tr><th>Товар</th><th>Категория</th><th>Рейтинг</th><th>Отзывы</th></tr></thead><tbody>${groups.map(x=>`<tr><td>${escapeHTML(x.p.title)}</td><td>${escapeHTML(x.p.category)}</td><td>${x.average===null?'—':`★ ${x.average.toFixed(1).replace('.',',')}`}</td><td>${x.count}</td></tr>`).join('')||'<tr><td colspan="4">Нет товаров по выбранному фильтру</td></tr>'}</tbody></table></div></div></section>`;
  };
  const localShopAnalytics = () => {const stats=shopPostStats(), rows=stats.posts.filter(post=>{const p=product(post.productId);return p&&(ui.analyticsCategory==='Все'||p.category===ui.analyticsCategory)&&(ui.analyticsProduct==='all'||p.id===ui.analyticsProduct);});return `<section class="block local-shop-analytics"><div class="section-header"><div><h2>Публикации нашего сообщества</h2><p>Переходы и заказы из публикаций сообщества</p></div>${button('Открыть сообщество','navigate','outline',`data-route="community/archive"`)}</div><div class="stats-grid local-shop-stats">${statCard('Переходов из постов',String(rows.reduce((s,p)=>s+p.opens,0)),'Клики по товару в публикации','link')}${statCard('Заказов из постов',String(rows.reduce((s,p)=>s+p.orders,0)),'Источник сохраняется в заказе','bag')}</div><div class="panel table-panel"><div class="table-wrap"><table class="data-table"><thead><tr><th>Пост</th><th>Товар</th><th>Открытия</th><th>Заказы</th></tr></thead><tbody>${rows.map(p=>`<tr><td>${escapeHTML(p.date)}</td><td>${escapeHTML(product(p.productId)?.title||'')}</td><td>${p.opens}</td><td>${p.orders}</td></tr>`).join('')||'<tr><td colspan="4">В этой категории нет постов сообщества</td></tr>'}</tbody></table></div></div></section>`;};

  const drop = (id) => model.drops.find(d=>d.id===id);
  const route = () => decodeURIComponent(location.hash.replace(/^#\/?/,'') || 'welcome');
  const studio = () => route().startsWith('studio/');
  const activeView = () => route().split('/')[0];
  const go = (r) => { ui.modal=null; ui.sidebar=false; if(location.hash === '#'+r){render();} else location.hash = r; window.scrollTo({top:0,behavior:ui.onboarding?'instant':'smooth'}); };
  const icons = {
    search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    home:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/><path d="M9 21v-8h6v8"/>',
    grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    bag:'<path d="M5 8h14l1 13H4L5 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/>',
    heart:'<path d="M20.8 4.7a5.5 5.5 0 0 0-7.8 0L12 5.8l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.5a5.5 5.5 0 0 0 0-7.8Z"/>',
    cart:'<circle cx="9" cy="20" r="1"/><circle cx="19" cy="20" r="1"/><path d="M2 3h2l3 13h12l3-9H5"/>',
    user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c.5-4 3-6 8-6s7.5 2 8 6"/>',
    chart:'<path d="M3 3v18h18"/><path d="m6 16 5-6 4 3 6-8"/>',
    box:'<path d="m3 7 9-4 9 4-9 4-9-4Z"/><path d="M3 7v10l9 4 9-4V7M12 11v10"/>',
    layers:'<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 9h8M8 13h8M8 17h5"/>',
    fire:'<path d="M12 22c5 0 8-3.6 8-8 0-3.2-1.5-5.4-4-8-.2 3.3-2.4 4-3 4 0-3-1.1-5.6-3-8-1 4-6 7.1-6 12 0 4.5 3 8 8 8Z"/><path d="M12 22c2 0 3-1.5 3-3.2 0-1.2-.6-2.1-2-3.5-.1 1.6-2.8 2-2.8 4 0 1.5.8 2.7 1.8 2.7Z"/>',
    settings:'<circle cx="12" cy="12" r="3"/><path d="m9.5 2 5 0 .8 3 2 1.2 3-.7 2.5 4.3-2.2 2.2v2.4l2.2 2.1-2.5 4.3-3-.7-2 1.2-.8 3h-5l-.8-3-2-1.2-3 .7L1.2 16.5l2.2-2.1V12l-2.2-2.2 2.5-4.3 3 .7 2-1.2z" transform="translate(1 -1) scale(.92)"/>',
    arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>',
    back:'<path d="m15 18-6-6 6-6"/>',
    chevron:'<path d="m9 18 6-6-6-6"/>',
    down:'<path d="m6 9 6 6 6-6"/>',
    plus:'<path d="M12 5v14M5 12h14"/>',
    minus:'<path d="M5 12h14"/>',
    close:'<path d="M5 5 19 19M19 5 5 19"/>',
    check:'<path d="m4 12 5 5 11-11"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
    bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 8-3 9h18c0-1-3-2-3-9ZM10 21h4"/>',
    moon:'<path d="M20 15.5A8 8 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z"/>',
    sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.5 1.5m11.2 11.2 1.5 1.5M2 12h2m16 0h2M4.9 19.1l1.5-1.5M17.6 6.4l1.5-1.5"/>',
    'mouse-pointer-click':'<path d="M4 3v15l4-4 3 7 3-1-3-7 6-1z"/><path d="m15 3 1-2m4 6 3-1m-7 1 3-3"/>',
    eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
    edit:'<path d="M12 20h9M4 16l11-11 4 4L8 20H4z"/>',
    external:'<path d="M12 4h8v8M20 4l-9 9"/><path d="M20 14v6H4V4h6"/>',
    info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v1"/>',
    wallet:'<rect x="2" y="5" width="20" height="15" rx="3"/><path d="M2 9h20M17 15h2"/>',
    filter:'<path d="M3 5h18M6 12h12M9 19h6"/>',
    location:'<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
    gift:'<rect x="3" y="9" width="18" height="12" rx="1"/><path d="M12 9v12M3 13h18M12 9c-7 0-7-6-3.5-6C11 3 12 6 12 9Zm0 0c7 0 7-6 3.5-6C13 3 12 6 12 9Z"/>',
    refresh:'<path d="M20 7V3l-3 3a8 8 0 1 0 3 10M20 3v5h-5"/>',
    spark:'<path d="m12 2 2.6 7.4L22 12l-7.4 2.6L12 22l-2.6-7.4L2 12l7.4-2.6L12 2Z"/>',
    truck:'<path d="M2 6h12v12H2zM14 10h4l4 4v4h-8z"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="19" r="2"/>',
    comment:'<path d="M21 11a8 8 0 0 1-8 8H5l-3 3v-9a9 9 0 1 1 19-2Z"/>',
    star:'<path d="m12 2 3.2 6.6 7.3 1.1-5.3 5.1 1.3 7.2L12 17.7l-6.5 3.4 1.3-7.2L1.5 9.7l7.3-1.1z"/>',
    link:'<path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-2 2M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l2-2"/>',
  };
  const icon = (name, size=20) => `<svg aria-hidden="true" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${icons[name]||icons.grid}</svg>`;
  const button = (text, action, cls='primary', extra='') => `<button type="button" class="btn ${cls}" data-action="${action}" ${extra}>${text}</button>`;
  const isFav = (id) => model.favorites.includes(id);
  const empty = (symbol, title, desc, action, label) => `<div class="empty-state"><div class="empty-symbol">${icon(symbol,36)}</div><h3>${title}</h3><p>${desc}</p>${action?button(label,action,'primary'):''}</div>`;
  const topNav = [ ['market','home','Маркет'],['search','search','Поиск'],['favorites','heart','Избранное'],['cart','cart','Корзина'],['profile','user','Профиль'] ];
  const sellerNav = [ ['studio/overview','grid','Обзор'],['studio/products','box','Товары'],['studio/orders','bag','Заказы'],['studio/returns','refresh','Возвраты'],['studio/drops','fire','Дропы'],['studio/analytics','chart','Аналитика'],['studio/settings','settings','Настройки'] ];
  const navLink = ([path,glyph,name]) => `<button class="nav-item ${route()===path || (path==='profile'&&route()==='orders') ? 'selected':''}" data-action="navigate" data-route="${path}" aria-label="${name}">${icon(glyph,20)}<span>${name}</span>${path==='cart'&&model.cart.length?`<b class="nav-count">${model.cart.reduce((s,x)=>s+x.qty,0)}</b>`:''}</button>`;
  const sidebar = () => `<aside class="sidebar ${ui.sidebar?'sidebar-open':''}"><div class="sidebar-section"><div class="sidebar-label">${studio()?'Речной Бисквит':'Навигация'}</div>${(studio()?sellerNav:topNav).map(navLink).join('')}${!studio()?`<button class="nav-item ${route()==='returns'?'selected':''}" data-action="navigate" data-route="returns">${icon('refresh',20)}<span>Возвраты</span></button>`:''}</div><div class="sidebar-footer"><button class="side-utility" data-action="open-onboarding">${icon('info',20)}<span>${ui.onboardingPreview?'Продолжить обучение':'Как это работает'}</span></button><button class="side-utility" data-action="navigate" data-route="welcome">${icon('layers',20)}<span>Сменить режим</span></button>${studio()?`<button class="side-utility" data-action="navigate" data-route="studio/settings">${icon('settings',20)}<span>Настройки</span></button>`:''}</div></aside>`;
  const head = () => `<header class="topbar"><div class="topbar-inner"><button class="mobile-menu icon-btn" aria-label="Открыть меню" data-action="toggle-sidebar">${icon('grid',22)}</button><button class="brand" data-action="navigate" data-route="market"><span class="brand-mark">vk</span><span>Маркет</span></button><form class="global-search" data-form="global-search"><span>${icon('search',18)}</span><input name="q" value="${escapeHTML(ui.query)}" placeholder="Поиск по товарам и магазинам" aria-label="Поиск товаров"/><button aria-label="Искать" type="submit">${icon('search',17)}</button></form><div class="header-actions"><span class="buyer-city" title="Город покупателя">${icon('location',16)} Рыбинск ${icon('down',14)}</span><button class="header-cart icon-btn" aria-label="Корзина" title="Корзина" data-action="navigate" data-route="cart">${icon('cart',20)}${model.cart.length?'<i></i>':''}</button><button class="avatar-btn" title="Профиль" data-action="navigate" data-route="profile">ВК</button></div></div></header>`;
  const pImage = (p, type='') => `<div class="product-visual ${type} ${String(p.photo||'').startsWith('./assets/')?'asset-photo':''}" style="--visual:${escapeHTML(p.color||'#e8ebf0')}">${illustration(p)}<img src="${escapeHTML(p.photo || '')}" alt="${escapeHTML(p.title)}" loading="lazy" onerror="this.style.display='none'" /></div>`;
  const sellerAvatar = (s, size='') => `<span class="seller-avatar ${size}" style="background:${s.color}">${escapeHTML(s.avatar)}</span>`;
  const badge = (label, cls='') => `<span class="status-pill ${cls}">${escapeHTML(label)}</span>`;
  const reviewStats = (id) => {const items=model.reviews.filter(r=>r.productId===id);return {count:items.length,average:items.length?items.reduce((s,r)=>s+r.rating,0)/items.length:null};};
  const ratingMarkup = (id, small=false) => {const r=reviewStats(id);return `<span class="rating-line ${small?'rating-small':''}" aria-label="${r.count?`Оценка ${r.average.toFixed(1)} из пяти, отзывов: ${r.count}`:'Пока нет отзывов'}"><span class="rating-star">★</span> ${r.count?r.average.toFixed(1).replace('.',','):'—'} <span class="rating-count">${r.count?`· ${r.count} отзыв${r.count===1?'':'ов'}`:'Нет отзывов'}</span></span>`;};
  const productCard = (p, index=0) => `<article class="product-card" style="animation-delay:${Math.min(index*45,250)}ms"><button class="product-picture" data-action="navigate" data-route="product/${p.id}" aria-label="Открыть ${escapeHTML(p.title)}">${pImage(p)}${p.badge?`<span class="photo-label">${escapeHTML(p.badge)}</span>`:''}</button><button class="fav-btn ${isFav(p.id)?'on':''}" data-action="favorite" data-id="${p.id}" aria-label="${isFav(p.id)?'Убрать из избранного':'В избранное'}">${icon('heart',18)}</button><div class="product-meta"><div class="product-price">${money(p.price)}${p.oldPrice?`<span class="old-price">${money(p.oldPrice)}</span>`:''}</div><button class="product-title" data-action="navigate" data-route="product/${p.id}">${escapeHTML(p.title)}</button>${ratingMarkup(p.id,true)}<button class="product-seller" data-action="navigate" data-route="community/${p.seller}">${escapeHTML(community(p.seller).name)}</button><small class="product-origin">Отправка из ${escapeHTML(cityFrom(community(p.seller).city))}</small><div class="card-actions">${p.stock?`<span class="subtle-stock">${p.stock<4?'Мало осталось':'В наличии'}</span>`:'<span class="out-stock">Нет в наличии</span>'}<button class="circle-action" data-action="add-cart" data-id="${p.id}" ${p.stock?'':'disabled'} aria-label="Добавить в корзину">${icon('plus',18)}</button></div></div></article>`;
  const productsGrid = (arr) => `<div class="products-grid">${arr.map(productCard).join('')}</div>`;
  const dropLabel = (d) => d.status==='live'?'Уже в продаже':d.status==='soldout'?'Распродано':d.status==='ended'?'Завершён':'Скоро старт';
  const dropCard = (d, large=false) => `<button class="drop-card ${large?'drop-large':''}" data-action="navigate" data-route="drop/${d.id}"><div class="drop-image" style="--visual:${d.seller==='archive'?'#d2d8df':'#e5ddd2'}">${illustration(product(d.itemIds[0])||model.products[0])}<img src="${escapeHTML(d.cover)}" alt="" loading="lazy" onerror="this.style.display='none'" /></div><div class="drop-overlay"><span class="drop-badge">${icon('fire',14)} ${dropLabel(d)}</span><div><span class="drop-by">${escapeHTML(community(d.seller).name)}</span><h3>${escapeHTML(d.title)}</h3><p>${escapeHTML(d.subtitle)}</p><span class="drop-link">${d.status==='announced'?dateLabel(d.startsAt,true):'Смотреть коллекцию'} ${icon('arrow',15)}</span></div></div></button>`;
  
const sellerContext = () => `<div class="seller-context" aria-label="Текущий магазин">${sellerAvatar(community(SELLER_ID))}<div><strong>${escapeHTML(community(SELLER_ID).name)}</strong><span>Магазин из Рыбинска</span></div><button class="seller-context-link" data-action="navigate" data-route="community/${SELLER_ID}">Открыть сообщество и шопсы ${icon('arrow',15)}</button></div>`;

  const pageIntro = (eyebrow,title,sub,actions='') => `${studio()?sellerContext():''}<div class="page-intro"><div><div class="eyebrow">${eyebrow}</div><h1>${title}</h1>${sub?`<p>${sub}</p>`:''}</div>${actions?`<div class="page-tools">${actions}</div>`:''}</div>`;
  const sectionHeader = (title,sub='',link='',to='') => `<div class="section-header"><div><h2>${title}</h2>${sub?`<p>${sub}</p>`:''}</div>${link?`<button class="text-link" data-action="navigate" data-route="${to}">${link} ${icon('arrow',16)}</button>`:''}</div>`;
  
const welcome = () => `<div class="welcome-page"><div class="welcome-head"><span class="welcome-logo"><span class="brand-mark">vk</span> Маркет</span><div class="welcome-kicker">Покупки и продажи через сообщества</div><h1>Добро пожаловать в <em>Маркет</em></h1><p>Одна платформа для покупок из публикаций VK и управления продажами. Выберите, с какой стороны хотите начать.</p></div><div class="welcome-choice"><button class="welcome-role buyer" data-action="choose-role" data-route="market"><span class="welcome-icon">${icon('cart',28)}</span><span class="welcome-role-text"><strong>Я покупатель</strong><small>Товары, любимые магазины, доставки и возвраты</small></span><span class="welcome-arrow">${icon('arrow',22)}</span></button><button class="welcome-role seller" data-action="choose-role" data-route="studio/overview"><span class="welcome-icon">${icon('grid',28)}</span><span class="welcome-role-text"><strong>Я продавец</strong><small>Товары, дропы, шопсы, заказы и аналитика магазина</small></span><span class="welcome-arrow">${icon('arrow',22)}</span></button></div></div>`;
  const shopPost = (post) => {const p=product(post.productId);if(!p)return '';return `<article class="shop-post panel"><div class="shop-post-head">${sellerAvatar(community('archive'))}<div><b>Речной Бисквит</b><small>${escapeHTML(post.date)} · Публикация сообщества</small></div><span class="shop-post-tag">Шопс</span></div><p class="shop-post-copy">${escapeHTML(post.text)}</p><button type="button" class="shop-post-image" data-action="shop-open" data-id="${p.id}" data-post="${post.id}" aria-label="Посмотреть товар из публикации">${pImage(p)}<span>Товар в публикации · ${money(p.price)} ${icon('arrow',18)}</span></button><div class="shop-attachment"><div>${pImage(p)}<span><strong>${escapeHTML(p.title)}</strong><small>${money(p.price)} · ${p.stock?'В наличии':'Распродано'}</small></span></div><div class="shop-actions">${button('О товаре','shop-open','outline',`data-id="${p.id}" data-post="${post.id}"`)}${button(`${icon('cart',16)} В корзину`,'shop-buy','primary',`data-id="${p.id}" data-post="${post.id}" ${p.stock?'':'disabled'}`)}</div></div><div class="shop-foot">${icon('heart',17)} 124 <span>${icon('comment',17)} 12</span><small>Реакции — пример · переходы и покупки из этого поста учитываются отдельно</small></div></article>`;};
  
const market = () => `<div class="market-page"><div class="hero"><div class="hero-text"><span class="hero-overline">ПОКУПКИ ИЗ СООБЩЕСТВ VK <span class="hero-star">✦</span></span><h1>Покупки из<br/><em>сообществ VK</em></h1><div class="hero-actions">${button(`Смотреть каталог ${icon('arrow',18)}`,'open-search','primary btn-lg')}${button(`Открыть дропы ${icon('fire',17)}`,'scroll-drops','light btn-lg')}</div></div><div class="hero-image" role="img" aria-label="Товары и коллекции магазинов ВКонтакте">${illustration(product('p1'))}<img src="${escapeHTML(product('p1')?.photo||photos.coffee)}" alt="Торт Речной закат"/></div><span class="hero-shape one"></span><span class="hero-shape two"></span></div><section class="block" id="categories">${sectionHeader('Категории Маркета','')}<div class="category-row">${[['Гардероб','👕','#f2e2ea'],['Дом и дача','⌂','#e6e9da'],['Хобби и развлечения','✦','#eee5ff'],['Продукты питания','◉','#fff0d9'],['Красота и здоровье','✿','#f7e5e3']].map(([n,g,c])=>`<button class="category-tile" data-action="category" data-name="${n}"><span class="category-art" style="background:${c}">${g}</span><span>${n}</span>${icon('arrow',15)}</button>`).join('')}</div></section><section class="block" id="drops">${sectionHeader('Ближайшие дропы','','Все дропы','studio/drops')}<div class="drop-grid">${model.drops.slice(0,2).map(d=>dropCard(d)).join('')}</div></section><section class="block">${sectionHeader('Подборка на сегодня','','Смотреть всё','search')}${productsGrid(model.products.slice(0,8))}</section><section class="block">${sectionHeader('Сообщества и магазины','')}<div class="community-grid">${communities.map(s=>`<button class="community-tile" data-action="navigate" data-route="community/${s.id}">${sellerAvatar(s,'large')}<div><strong>${escapeHTML(s.name)}</strong><p>${escapeHTML(s.category)}</p><small>${s.followers} подписчиков</small></div>${icon('arrow',18)}</button>`).join('')}</div></section></div>`;

  const filteredProducts = (filters = ui) => {
    let arr = model.products.filter(p =>
      (filters.category === 'Все' || p.category === filters.category) &&
      (!ui.query || `${p.title} ${community(p.seller).name} ${p.description}`.toLowerCase().includes(ui.query.toLowerCase())) &&
      (!filters.inStock || p.stock > 0) &&
      (!filters.minPrice || p.price >= Number(filters.minPrice)) &&
      (!filters.maxPrice || p.price <= Number(filters.maxPrice))
    );
    if (ui.sort === 'cheap') arr.sort((a,b) => a.price - b.price);
    if (ui.sort === 'expensive') arr.sort((a,b) => b.price - a.price);
    return arr;
  };
  const activeFilterCount = () => Number(ui.category !== 'Все') + Number(Boolean(ui.minPrice)) + Number(Boolean(ui.maxPrice)) + Number(ui.inStock);
  const filterChips = () => {
    const chips = [];
    if (ui.query) chips.push(['query', `Поиск: ${ui.query}`]);
    if (ui.category !== 'Все') chips.push(['category', ui.category]);
    if (ui.minPrice || ui.maxPrice) chips.push(['price', `Цена: ${ui.minPrice ? money(ui.minPrice) : 'от 0 ₽'} — ${ui.maxPrice ? money(ui.maxPrice) : 'любая'}`]);
    if (ui.inStock) chips.push(['inStock', 'Только в наличии']);
    if (!chips.length) return '';
    return `<div class="active-filters" aria-label="Применённые фильтры">${chips.map(([key,label]) => `<button type="button" class="filter-chip" data-action="remove-filter-chip" data-key="${key}" aria-label="Убрать фильтр: ${escapeHTML(label)}">${escapeHTML(label)} ${icon('close',14)}</button>`).join('')}<button type="button" class="clear-chips" data-action="clear-filters">Сбросить всё</button></div>`;
  };
  const filterDrawer = () => {
    if (!ui.filtersOpen) return '';
    const f = ui.filterDraft || ui;
    const matching = filteredProducts(f).length;
    return `<div class="filter-backdrop" data-action="close-filter-backdrop">
      <section class="filter-drawer" role="dialog" aria-modal="true" aria-labelledby="filter-heading">
        <div class="filter-drawer-head"><div><span class="filter-overline">НАСТРОЙКА ВЫДАЧИ</span><h2 id="filter-heading">Фильтры</h2></div><button type="button" class="filter-drawer-close" data-action="close-filters" aria-label="Закрыть фильтры">${icon('close',21)}</button></div>
        <div class="filter-drawer-content">
          <fieldset class="filter-group"><legend>Категория</legend><div class="filter-categories">${['Все','Продукты питания','Хобби и развлечения','Дом и дача','Гардероб','Красота и здоровье'].map(c => `<label class="filter-radio"><input type="radio" name="filter-category" data-draft-filter="category" value="${escapeHTML(c)}" ${f.category===c?'checked':''}/><span>${escapeHTML(c)}</span></label>`).join('')}</div></fieldset>
          <fieldset class="filter-group"><legend>Цена, ₽</legend><div class="filter-price-fields"><label>От <input type="number" min="0" step="1" placeholder="0" data-draft-filter="minPrice" value="${escapeHTML(f.minPrice)}" inputmode="numeric" /></label><label>До <input type="number" min="0" step="1" placeholder="Любая" data-draft-filter="maxPrice" value="${escapeHTML(f.maxPrice)}" inputmode="numeric" /></label></div><div class="filter-price-presets"><button type="button" data-action="price-preset" data-min="" data-max="1000">До 1 000 ₽</button><button type="button" data-action="price-preset" data-min="1000" data-max="5000">1 000–5 000 ₽</button><button type="button" data-action="price-preset" data-min="5000" data-max="">От 5 000 ₽</button></div></fieldset>
          <fieldset class="filter-group"><legend>Доступность</legend><label class="filter-toggle"><span><strong>Только в наличии</strong><small>Скрыть товары, которых сейчас нет</small></span><input type="checkbox" data-draft-filter="inStock" ${f.inStock?'checked':''}/></label></fieldset>
        </div>
        <div class="filter-drawer-footer"><button type="button" class="filter-reset" data-action="reset-draft-filters">Сбросить</button><button type="button" class="btn primary filter-apply" data-action="apply-filters">Показать <span data-filter-result-count>${fmt.format(matching)}</span> товаров</button></div>
      </section>
    </div>`;
  };
  const search = () => {
    const results = filteredProducts();
    const count = activeFilterCount();
    return `<div class="search-page">${pageIntro('КАТАЛОГ','Поиск товаров','Находите интересные вещи у продавцов из сообществ VK.')}
      <div class="catalog-toolbar"><form class="catalog-search" data-form="catalog-search">${icon('search',19)}<input type="search" name="q" value="${escapeHTML(ui.query)}" placeholder="Название товара или магазина" aria-label="Поиск по каталогу"/><button type="submit" aria-label="Найти товары">${icon('arrow',18)}</button></form>
      <button type="button" class="filter-open-btn ${count?'has-filters':''}" data-action="open-filters" aria-haspopup="dialog" aria-expanded="false">${icon('filter',18)} Фильтры ${count?`<span class="filter-count">${count}</span>`:''}</button>
      <label class="catalog-sort"><span>Сортировка</span><select data-filter="sort" aria-label="Сортировать товары"><option value="popular" ${ui.sort==='popular'?'selected':''}>Популярные</option><option value="cheap" ${ui.sort==='cheap'?'selected':''}>Сначала дешевле</option><option value="expensive" ${ui.sort==='expensive'?'selected':''}>Сначала дороже</option></select></label></div>
      ${filterChips()}<div class="catalog-results-head"><strong>${fmt.format(results.length)} ${results.length%10===1&&results.length%100!==11?'товар':([2,3,4].includes(results.length%10)&&![12,13,14].includes(results.length%100))?'товара':'товаров'}</strong><span>Из магазинов ВКонтакте</span></div>
      ${results.length ? productsGrid(results) : empty('search','Ничего не найдено','Попробуйте изменить запрос или сбросить фильтры.','clear-filters','Сбросить фильтры')}</div>`;
  };
  const breadcrumb = (back,title) => `<button class="breadcrumb" data-action="navigate" data-route="${back}">${icon('back',17)} ${title}</button>`;
  
const productPage = (id) => { const p=product(id); if(!p)return notFound(); const s=community(p.seller); const cfg=logisticsFor(p.seller); const returnText=p.returnPolicy || (p.madeToOrder || p.category==='Продукты питания' ? 'Товары на заказ и продукты питания не подлежат возврату после получения, кроме случаев брака.' : 'Возврат возможен в течение 7 дней после получения в рамках демонстрационного сценария.'); return `<div class="detail-page">${breadcrumb('search','К каталогу')}<div class="product-detail panel"><div class="detail-gallery">${pImage(p,'detail-photo')}</div><div class="detail-content"><div class="eyebrow">${escapeHTML(p.category)}</div><h1>${escapeHTML(p.title)}</h1><div class="detail-price">${money(p.price)}${p.oldPrice?`<s>${money(p.oldPrice)}</s>`:''}</div><div class="availability ${p.stock?'':'out-stock'}">${icon(p.stock?'check':'info',16)} ${p.stock?`В наличии · ${p.stock} шт.`:'Нет в наличии'}</div>${p.badge?`<div class="tag-row">${badge(p.badge,'soft')}</div>`:''}<button class="rating-anchor" data-action="scroll-reviews">${ratingMarkup(p.id)} ${icon('chevron',15)}</button><div class="detail-buy">${button(`${icon('cart',19)} В корзину`,'add-cart','primary btn-lg',`data-id="${p.id}" ${p.stock?'':'disabled'}`)}${button(icon('heart',20),'favorite',isFav(id)?'outline favorited btn-lg':'outline btn-lg',`data-id="${p.id}" aria-label="В избранное"`)}</div><div class="detail-fine">${icon('truck',17)} Из ${escapeHTML(cityFrom(s.city))} в Рыбинск · способы и стоимость при оформлении</div><div class="separator"></div><div class="seller-summary">${sellerAvatar(s)}<div><strong>${escapeHTML(s.name)}</strong><span>${s.followers} подписчиков · ${escapeHTML(s.city)}</span></div><button class="text-link" data-action="navigate" data-route="community/${s.id}">О продавце ${icon('chevron',16)}</button></div><p class="detail-description">${escapeHTML(p.description)}</p>${p.size?`<p class="spec-row"><span>Размер</span><strong>${escapeHTML(p.size)}</strong></p>`:''}${p.condition?`<p class="spec-row"><span>Состояние</span><strong>${escapeHTML(p.condition)}</strong></p>`:''}<p class="spec-row"><span>Категория</span><strong>${escapeHTML(p.category)}</strong></p><p class="spec-row"><span>Город продавца</span><strong>${escapeHTML(s.city)}</strong></p>${p.prepDays?`<p class="spec-row"><span>Изготовление</span><strong>${escapeHTML(p.prepDays)}</strong></p>`:''}<p class="spec-row"><span>Доставка в Рыбинск</span><strong>${escapeHTML(deliveryPreview(p))}</strong></p><p class="spec-row"><span>Возврат</span><strong>${escapeHTML(returnText)}</strong></p><div class="seller-link"><a href="${s.url}" target="_blank" rel="noopener noreferrer">${icon('external',16)} Открыть сообщество VK</a><span>Переход во ВКонтакте</span></div></div></div>${reviewSection(p)}<section class="block">${sectionHeader('От этого продавца')}${productsGrid(model.products.filter(x=>x.seller===p.seller && x.id!==p.id).slice(0,4))}</section></div>`;};

  const communityPage = (id) => {const s=community(id);return `<div class="community-page">${breadcrumb('market','К Маркету')}<div class="community-hero panel"><div class="community-banner" style="--community-accent:${s.color}"><div class="big-watermark">${escapeHTML(s.avatar)}</div></div><div class="community-body">${sellerAvatar(s,'huge')}<div class="community-heading"><div><div class="eyebrow">МАГАЗИН ИЗ СООБЩЕСТВА</div><h1>${escapeHTML(s.name)} <span class="verified">${icon('check',13)}</span></h1><p>${escapeHTML(s.description)}</p><div class="community-hint">${escapeHTML(s.city)} · ${s.followers} подписчиков · ${model.products.filter(p=>p.seller===id).length} товаров</div></div><div class="community-actions">${button(`${icon('heart',18)} ${model.following.includes(id)?'Вы подписаны':'Подписаться'}`,'follow',model.following.includes(id)?'outline':'primary',`data-id="${id}"`)}<a class="btn light" href="${s.url}" target="_blank" rel="noopener noreferrer">${icon('external',17)} Сообщество VK</a></div></div></div></div><section class="block">${sectionHeader('Товары магазина')}${productsGrid(model.products.filter(p=>p.seller===id))}</section>${id==='archive'?`<section class="block shop-feed">${sectionHeader('Посты сообщества · шопсы','Товары прикреплены к публикациям. Откройте карточку или добавьте товар прямо из поста.')}${shopPosts.map(shopPost).join('')}</section>`:''}</div>`;};
  const favorites = () => {const list=model.products.filter(p=>model.favorites.includes(p.id));return `<div>${pageIntro('ЛИЧНАЯ ПОДБОРКА','Избранное','Сохраняйте понравившееся, чтобы вернуться к нему позже.')}${list.length?productsGrid(list):empty('heart','Пока ничего нет','Нажмите на сердечко у товара — он появится здесь.','open-search','Искать товары')}${model.following.length?`<section class="block">${sectionHeader('Ваши подписки')}<div class="community-grid">${communities.filter(s=>model.following.includes(s.id)).map(s=>`<button class="community-tile" data-action="navigate" data-route="community/${s.id}">${sellerAvatar(s)}<strong>${escapeHTML(s.name)}</strong>${icon('arrow',18)}</button>`).join('')}</div></section>`:''}</div>`;};
  const cartTotal = () => model.cart.reduce((sum,x)=>sum+(product(x.id)?.price||0)*x.qty,0);
  const cart = () => `<div>${pageIntro('ПОКУПКИ','Корзина','Оформление заказа в рамках одного магазина.')}${model.cart.length?`<div class="cart-layout"><div class="panel cart-list">${model.cart.map(item=>{const p=product(item.id);if(!p)return '';return `<div class="cart-item">${pImage(p)}<div class="cart-text"><button class="product-title" data-action="navigate" data-route="product/${p.id}">${escapeHTML(p.title)}</button><span class="muted">${escapeHTML(community(p.seller).name)}</span><strong>${money(p.price)}</strong><button class="remove-item" data-action="remove-cart" data-id="${p.id}">Удалить</button></div><div class="qty-controls"><button data-action="qty-down" data-id="${p.id}" aria-label="Уменьшить">${icon('minus',16)}</button><span>${item.qty}</span><button data-action="qty-up" data-id="${p.id}" aria-label="Увеличить">${icon('plus',16)}</button></div></div>`;}).join('')}</div><aside class="panel order-summary"><h3>Ваш заказ</h3><p>${model.cart.reduce((s,x)=>s+x.qty,0)} товара</p><div class="summary-line"><span>Товары</span><b>${money(cartTotal())}</b></div><div class="summary-line"><span>Доставка</span><span>Уточним позже</span></div><div class="summary-total"><span>Итого</span><strong>${money(cartTotal())}</strong></div>${button(`Перейти к оформлению ${icon('arrow',18)}`,'checkout','primary btn-wide btn-lg')}<small>Это демо. Реальные платежи не выполняются.</small></aside></div>`:empty('cart','Корзина пуста','Добавьте товар из каталога — и он появится здесь.','open-search','Перейти в каталог')}</div>`;
  const orderStatusClass = (st) => st==='Завершён'?'success':st==='Отменён'?'danger':st==='Новый'?'blue':'soft';
  const ordersList = (seller=false) => {const arr=seller?ownOrders():model.orders;return arr.length?`<div class="orders-list">${arr.slice().reverse().map(o=>`<article class="order-card panel"><div class="order-info"><div><strong>Заказ № ${escapeHTML(o.id)}</strong><p>${fmtDateTime(o.createdAt)} · ${escapeHTML(community(o.seller).name)}</p></div>${badge(o.status,orderStatusClass(o.status))}</div><div class="order-products">${o.items.map(i=>`<span>${escapeHTML(product(i.id)?.title||i.id)} × ${i.qty}</span>`).join('')}</div><div class="order-bottom"><strong>${money(o.total)}</strong><span class="order-payment">${icon('truck',15)} ${escapeHTML(shipNames[o.shipment?.status||'not_created']||'Не оформлено')}</span>${button('Детали и доставка','navigate','primary',`data-route="${seller?'studio/order':'order'}/${o.id}"`)}${!seller?button('Возврат / претензия','open-return','outline',`data-id="${o.id}"`):''}</div></article>`).join('')}</div>`:empty('bag','Заказов пока нет',seller?'Оформите тестовый заказ в покупательской части.':'Заказы появятся после первой покупки.',seller?'switch-buyer':'open-search',seller?'Открыть Маркет':'Найти товары');};
  const profile = () => `<div>${pageIntro('ВАШ ПРОФИЛЬ','Личный кабинет','Все покупки, избранные товары и подписки в одном месте.')}<div class="profile-grid"><div class="profile-card panel"><span class="profile-avatar">ВК</span><div><h2>Пользователь VK</h2><p>Профиль покупателя</p></div>${badge('Покупатель','soft')}</div><button class="profile-shortcut panel" data-action="navigate" data-route="orders">${icon('bag',24)}<strong>Мои заказы</strong><span>${model.orders.length} заказов</span>${icon('arrow',18)}</button><button class="profile-shortcut panel" data-action="navigate" data-route="favorites">${icon('heart',24)}<strong>Избранное</strong><span>${model.favorites.length} товаров</span>${icon('arrow',18)}</button><button class="profile-shortcut panel" data-action="navigate" data-route="returns">${icon('refresh',24)}<strong>Возвраты и обращения</strong><span>Заявки, статусы, деньги</span>${icon('arrow',18)}</button><button class="profile-shortcut panel" data-action="navigate" data-route="returns">${icon('refresh',24)}<strong>Возвраты</strong><span>Мои обращения и их статусы</span>${icon('arrow',18)}</button></div><div class="panel settings-inline"><div><strong>Напоминания о дропах</strong><p>Управляйте напоминаниями о будущих дропах.</p></div><label class="switch"><input type="checkbox" data-setting="notifications" ${model.notifications?'checked':''} /><span></span></label></div>${model.orders.length?`<section class="block">${sectionHeader('Последние заказы','','Все заказы','orders')}${ordersList(false)}</section>`:''}</div>`;
  const dropsPage = (id) => {const d=drop(id);if(!d)return notFound();const s=community(d.seller);const live=d.status==='live';const finished=['soldout','ended'].includes(d.status);return `<div class="drop-page">${breadcrumb('market','К Маркету')}<div class="drop-head panel"><div class="drop-cover" style="--visual:#e5e2db">${illustration(product(d.itemIds[0])||model.products[0])}<img src="${escapeHTML(d.cover)}" alt="${escapeHTML(d.title)}" onerror="this.style.display='none'"/></div><div class="drop-info">${badge(dropLabel(d),live?'success':finished?'soft':'blue')}<p class="eyebrow">ЛИМИТИРОВАННАЯ КОЛЛЕКЦИЯ</p><h1>${escapeHTML(d.title)}</h1><p class="drop-subtitle">${escapeHTML(d.subtitle)}</p><div class="seller-mini">${sellerAvatar(s)} <strong>${escapeHTML(s.name)}</strong></div><p class="drop-description">${escapeHTML(d.description)}</p>${d.status==='announced'?`<div class="countdown-box"><span>До старта осталось</span><strong data-countdown="${d.id}">${countdown(d.startsAt)}</strong><small>Старт: ${dateLabel(d.startsAt,true)}</small></div>${button(`${icon('bell',18)} ${model.reminders.includes(d.id)?'Напоминание включено':'Напомнить о запуске'}`,'remind',model.reminders.includes(d.id)?'outline btn-lg':'primary btn-lg',`data-id="${d.id}"`)}`:live?`<div class="live-box">${icon('check',18)} Дроп открыт — товары доступны к покупке</div>`:`<div class="live-box muted">Коллекция завершена. Следите за следующими запусками.</div>`}<p class="demo-explain">Получение: доступный пункт выдачи, курьер или самовывоз; сборка заказа от ${logisticsFor(d.seller).handlingDays} дней. Возвраты товаров дропа оформляются на тех же условиях, что и обычных заказов. Уведомления и резерв имитируются в браузере.</p></div></div><section class="block">${sectionHeader('В коллекции',`${d.itemIds.length} товара · ${live?'можно заказать':finished?'дроп завершён':'продажи ещё не начались'}`)}<div class="products-grid">${d.itemIds.map((id,i)=>{const p=product(id);if(!p)return '';return `<div class="drop-product-wrap">${productCard(p,i)}${!live?`<div class="drop-locked">${icon(finished?'check':'clock',17)} ${finished?'Дроп завершён':'Продажи с начала дропа'}</div>`:''}</div>`;}).join('')}</div></section></div>`;};
  const notFound = () => empty('search','Страница не найдена','Откройте Маркет, чтобы продолжить.','switch-buyer','Открыть Маркет');
  const statCard = (title,value,delta,glyph) => `<div class="stat-card panel"><div class="stat-top"><span>${title}</span><span class="stat-icon">${icon(glyph,19)}</span></div><strong>${value}</strong><small>${delta}</small></div>`;
  const overview = () => {const active=ownOrders().filter(o=>o.status!=='Отменён');const revenue=active.reduce((s,o)=>s+(Number(o.total)||0),0);const average=active.length?revenue/active.length:null;const low=ownedProducts().filter(p=>p.stock<=2);return `<div>${pageIntro('КАБИНЕТ ПРОДАВЦА','Обзор магазина',`Добро пожаловать обратно. Вот что происходит в «Речной Бисквит».`,button(`${icon('plus',18)} Добавить товар`,'new-product','primary'))}${!model.connected?`<div class="notice">Сообщество не подключено. <button data-action="navigate" data-route="studio/settings">Настроить подключение</button></div>`:''}<div class="stats-grid">${statCard('Заказов',fmt.format(active.length),'+ новые заказы за время демо','bag')}${statCard('Сумма заказов',money(revenue),'Не является оплаченной выручкой','wallet')}${statCard('Средний чек',average===null?'—':money(Math.round(average)),'Сумма / оформленные заказы','chart')}${statCard('Товаров в каталоге',fmt.format(ownedProducts().length),'Товары «Речной Бисквит»','box')}</div><div class="dashboard-grid"><section class="panel dashboard-section"><div class="section-header"><h2>Последние заказы</h2><button class="text-link" data-action="navigate" data-route="studio/orders">Все заказы ${icon('arrow',16)}</button></div>${active.length?`<div class="mini-orders">${active.slice(-3).reverse().map(o=>`<div><span>№ ${o.id}</span><strong>${money(o.total)}</strong>${badge(o.status,orderStatusClass(o.status))}</div>`).join('')}</div>`:empty('bag','Новых заказов нет','Оформите демозаказ в покупательской части.','switch-buyer','Перейти в Маркет')}</section><section class="panel dashboard-section"><div class="section-header"><h2>Ближайшие дропы</h2><button class="text-link" data-action="navigate" data-route="studio/drops">Управление ${icon('arrow',16)}</button></div>${model.drops.filter(d=>d.seller==='archive').slice(0,1).map(d=>`<div class="next-drop">${pImage(product(d.itemIds[0]))}<div><strong>${escapeHTML(d.title)}</strong><p>${dropLabel(d)}</p><small>${dateLabel(d.startsAt,true)}</small></div></div>`).join('')||'<p>Пока нет дропов.</p>'}</section></div><section class="block">${sectionHeader('Товары, требующие внимания','У этих позиций заканчивается остаток','В каталог','studio/products')}<div class="low-stock-grid">${low.map(p=>`<button class="low-stock" data-action="navigate" data-route="studio/products">${pImage(p)}<div><b>${escapeHTML(p.title)}</b><span>Осталось: ${p.stock} шт.</span></div>${icon('arrow',16)}</button>`).join('')||'<div class="panel muted pad">Все остатки в норме</div>'}</div></section></div>`;};
  const sellerProducts = () => {const list=ownedProducts();return `<div>${pageIntro('РЕЧНОЙ БИСКВИТ','Товары',`Редактируйте каталог, цены и остатки.`,button(`${icon('plus',18)} Добавить товар`,'new-product','primary'))}<div class="panel table-panel"><div class="table-top"><strong>${list.length} товаров</strong><span>Данные сохранены в этом браузере</span></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Товар</th><th>Категория</th><th>Цена</th><th>Остаток</th><th></th></tr></thead><tbody>${list.map(p=>`<tr><td><div class="table-product">${pImage(p)}<span>${escapeHTML(p.title)}</span></div></td><td>${escapeHTML(p.category)}</td><td><strong>${money(p.price)}</strong></td><td><div class="stock-editor"><button data-action="stock-down" data-id="${p.id}" aria-label="Уменьшить остаток">${icon('minus',15)}</button><b>${p.stock}</b><button data-action="stock-up" data-id="${p.id}" aria-label="Увеличить остаток">${icon('plus',15)}</button></div></td><td><button class="icon-btn" title="Редактировать" data-action="edit-product" data-id="${p.id}">${icon('edit',18)}</button></td></tr>`).join('')}</tbody></table></div></div></div>`;};
  const sellerOrders = () => `<div>${pageIntro('РЕЧНОЙ БИСКВИТ','Заказы','Меняйте статусы и отслеживайте выполнение демонстрационных заказов.')}${ordersList(true)}</div>`;
  const sellerDrops = () => `<div>${pageIntro('РЕЧНОЙ БИСКВИТ','Дропы','Запускайте небольшие коллекции и собирайте интерес заранее.',button(`${icon('plus',18)} Создать дроп`,'new-drop','primary'))}<div class="seller-drop-list">${model.drops.filter(d=>d.seller==='archive').map(d=>`<div class="panel seller-drop-row"><div class="seller-drop-photo"><img src="${escapeHTML(d.cover)}" alt="" onerror="this.style.display='none'"/></div><div class="seller-drop-text">${badge(dropLabel(d),d.status==='live'?'success':'soft')}<h3>${escapeHTML(d.title)}</h3><p>${d.itemIds.length} товара · ${dateLabel(d.startsAt,true)}</p><small>${model.reminders.includes(d.id)?'Вы подписались на уведомление':'Напоминания доступны покупателям'}</small></div><div class="seller-drop-actions">${button('Посмотреть','view-drop','outline',`data-id="${d.id}"`)}${d.status==='announced'?button(`${icon('fire',16)} Запустить демо`,'launch-drop','primary',`data-id="${d.id}"`):d.status==='live'?button('Завершить дроп','end-drop','outline',`data-id="${d.id}"`):''}</div></div>`).join('')||empty('fire','Нет дропов','Создайте первую лимитированную коллекцию.','new-drop','Создать дроп')}</div><div class="notice">${icon('info',17)} В живой версии старт должен зависеть от времени, часового пояса и серверного остатка. Здесь запуск включается вручную для демонстрации.</div></div>`;
  const analyticsDataset = () => {
    const posts=demoPosts.filter(x=>{
      const p=product(x.product);
      return p && p.seller===SELLER_ID && (ui.analyticsCategory==='Все'||p.category===ui.analyticsCategory) && (ui.analyticsProduct==='all'||p.id===ui.analyticsProduct);
    });
    const factor=ui.period===7?.29:ui.period===90?2.35:1;
    const sum=field=>Math.round(posts.reduce((total,post)=>total+post[field],0)*factor);
    return {posts,views:sum('views'),opens:sum('opens'),orders:sum('orders'),paid:sum('paid'),factor};
  };
  const analyticsTools = () => {
    const categories=[...new Set(ownedProducts().map(p=>p.category))].sort((a,b)=>a.localeCompare(b,'ru'));
    const products=ownedProducts().filter(p=>ui.analyticsCategory==='Все'||p.category===ui.analyticsCategory);
    return `<div class="analytics-toolbar panel"><div class="segmented">${[7,30,90].map(n=>`<button class="${ui.period===n?'active':''}" data-action="period" data-period="${n}">${n} дней</button>`).join('')}</div><label>Категория <select aria-label="Категория товаров магазина" data-filter="analyticsCategory"><option value="Все">Все категории</option>${categories.map(cat=>`<option value="${escapeHTML(cat)}" ${ui.analyticsCategory===cat?'selected':''}>${escapeHTML(cat)}</option>`).join('')}</select></label><label>Товар <select aria-label="Товар магазина" data-filter="analyticsProduct"><option value="all">Все товары</option>${products.map(p=>`<option value="${p.id}" ${ui.analyticsProduct===p.id?'selected':''}>${escapeHTML(p.title)}</option>`).join('')}</select></label><button class="outline-button" data-action="reset-analytics-filter">Сбросить</button><button class="outline-button" data-action="analytics-info">${icon('info',16)} Метрики</button></div>`;
  };
  const orderAnalyticsCards = () => {
    const actual=orderSummary(ui.analyticsCategory,ui.analyticsProduct);
    const scoped=ui.analyticsCategory!=='Все'||ui.analyticsProduct!=='all';
    return `<section class="orders-analytics"><div class="section-header"><div><h2>Заказы магазина</h2><p>Из оформленных в этом браузере заказов «Речной Бисквит» · за всё время</p></div></div><div class="stats-grid seller-orders-stats">${statCard('Средний чек',actual.average===null?'—':money(Math.round(actual.average)),scoped?'Средняя стоимость выбранных товаров в заказе':'Сумма / оформленные заказы','chart')}${statCard('Сумма оформленных заказов',money(actual.total),'Не является оплаченной выручкой','wallet')}${statCard('Заказов',fmt.format(actual.count),'Отменённые не учитываются','bag')}</div>${scoped?'<p class="analytics-note">При выборе категории или товара считаем только их стоимость внутри заказа. Один заказ может содержать товары разных категорий.</p>':''}</section>`;
  };
  const categoryAnalytics = (a) => {
    const categories=[...new Set(ownedProducts().map(p=>p.category))].filter(cat=>ui.analyticsCategory==='Все'||cat===ui.analyticsCategory);
    const rows=categories.map(cat=>{
      const items=ownedProducts().filter(p=>p.category===cat && (ui.analyticsProduct==='all'||p.id===ui.analyticsProduct));
      if(!items.length)return '';
      const posts=a.posts.filter(post=>product(post.product)?.category===cat);
      const openings=Math.round(posts.reduce((n,post)=>n+post.opens,0)*a.factor);
      const orders=Math.round(posts.reduce((n,post)=>n+post.orders,0)*a.factor);
      return `<tr><td><strong>${escapeHTML(cat)}</strong></td><td>${items.length}</td><td>${posts.length?fmt.format(openings):'Нет данных'}</td><td>${posts.length?fmt.format(orders):'Нет данных'}</td><td>${posts.length&&openings?`${(orders/openings*100).toFixed(2).replace('.',',')}%`:'—'}</td></tr>`;
    }).join('');
    return `<section class="block category-analytics"><div class="section-header"><div><h2>По категориям товаров</h2><p>Публикации товаров магазина «Речной Бисквит»</p></div></div><div class="panel table-panel"><div class="table-wrap"><table class="data-table"><thead><tr><th>Категория</th><th>Товаров</th><th>Открытия</th><th>Заказы из шопсов</th><th>Заказы / открытия</th></tr></thead><tbody>${rows}</tbody></table></div><div class="table-note">«Нет данных» означает отсутствие связанных публикаций, а не нулевые продажи.</div></div></section>`;
  };
  const areaChart = (period,metric) => {const count=period===7?7:period===90?14:12;const ys=Array.from({length:count},(_,i)=>[22,35,28,51,43,62,50,70,59,82,68,94,74,88][i]||60).map((n,i)=>Math.max(10,n+(metric==='orders'?-10:0)+(period===7?i*2:0)));const coords=ys.map((v,i)=>[32+i*644/(count-1),188-v*1.55]);const path=coords.map(([x,y],i)=>`${i?'L':'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');return `<svg class="area-chart" viewBox="0 0 710 215" role="img" aria-label="Динамика ${metric==='orders'?'заказов':'открытий'} за ${period} дней"><defs><linearGradient id="areaFade" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#0077ff" stop-opacity=".22"/><stop offset="1" stop-color="#0077ff" stop-opacity="0"/></linearGradient></defs>${[42,89,136,183].map(y=>`<line x1="32" x2="678" y1="${y}" y2="${y}" stroke="currentColor" stroke-opacity=".1" stroke-dasharray="5 6"/>`).join('')}<path d="${path} L676 199 L32 199 Z" fill="url(#areaFade)"/><path d="${path}" fill="none" stroke="#0077ff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>${coords.map(([x,y],i)=>i===coords.length-1?`<circle cx="${x}" cy="${y}" r="5" fill="#0077ff" stroke="white" stroke-width="3"/>`:'').join('')}</svg>`;};
  const demographic = () => {const age=[['<18',4,4],['18–24',28,21],['25–34',22,13],['35–44',6,5],['45–54',2,1],['55+',1,1]];return `<div class="demographic-bars">${age.map(([l,m,f])=>`<div class="age-column"><div class="age-bars"><span class="age-male" style="height:${m/28*100}%" title="Мужчины ${m}%"></span><span class="age-female" style="height:${f/28*100}%" title="Женщины ${f}%"></span></div><small>${l.replace('<','&lt;')}</small></div>`).join('')}</div><div class="chart-legend"><span><i class="dot blue"></i> Мужчины · 58%</span><span><i class="dot pink"></i> Женщины · 42%</span></div>`;};
  const cityBar = (city,val) => `<div class="city-row"><span>${city}</span><div><i style="width:${Math.max(4,val/6.1*100)}%"></i></div><strong>${String(val).replace('.',',')}%</strong></div>`;
  const analytics = () => {
    const a=analyticsDataset();
    const conv=a.opens?(a.orders/a.opens*100).toFixed(2).replace('.',','):'—';
    const metricVal=ui.metric==='orders'?a.orders:a.opens;
    const totalPosts=demoPosts.filter(post=>product(post.product)?.seller===SELLER_ID).length;
    const top=`${pageIntro('РЕЧНОЙ БИСКВИТ','Аналитика магазина','Заказы только этого продавца и отдельная статистика известных шопсов.')}${analyticsTools()}${orderAnalyticsCards()}${commissionSection()}${reviewAnalytics()}${localShopAnalytics()}`;
    if(!a.posts.length) return `<div class="analytics-page">${top}${categoryAnalytics(a)}${empty('chart','Нет статистики по шопсам для выбранной категории','Известных публикаций пока нет. Это не означает, что не было просмотров или продаж.','reset-analytics-filter','Смотреть все категории')}</div>`;
    return `<div class="analytics-page">${top}<div class="section-header shop-analytics-heading"><div><h2>Шопсы и публикации</h2><p>Показатели публикаций магазина «Речной Бисквит»</p></div></div><div class="stats-grid analytics-stats">${statCard('Просмотры шопсов',fmt.format(a.views),'Охват публикаций · пример','eye')}${statCard('Открытия карточек',fmt.format(a.opens),'Переходы из известных шопсов','link')}${statCard('Оформленные заказы',fmt.format(a.orders),'Не равно оплаченным','bag')}${statCard('Конверсия в заказ',conv+'%','Заказы / открытия карточки','chart')}</div>${categoryAnalytics(a)}<div class="analytics-main"><div class="panel analytics-line"><div class="section-header"><div><h2>Динамика · иллюстрация</h2><p>Открытия товаров и оформленные заказы</p></div><div class="segmented compact"><button class="${ui.metric==='opens'?'active':''}" data-action="metric" data-metric="opens">Открытия</button><button class="${ui.metric==='orders'?'active':''}" data-action="metric" data-metric="orders">Заказы</button></div></div><div class="line-total">${fmt.format(metricVal)} <span>${ui.metric==='orders'?'оформленных заказов':'открытий карточек'}</span></div>${areaChart(ui.period,ui.metric)}<div class="x-labels"><span>${ui.period} дней назад</span><span>Сегодня</span></div></div><div class="panel audience-card"><div class="section-header"><h2>Источники магазина · общий пример</h2></div><div class="source-row"><span class="source-icon shop">${icon('link',18)}</span><div><strong>Публикации и шопсы</strong><p>Известный источник</p></div><b>58%</b></div><div class="progress-bar"><i style="width:58%"></i></div><div class="source-row"><span class="source-icon other">${icon('search',18)}</span><div><strong>Другие переходы</strong><p>Поиск, сообщества и прочее</p></div><b>42%</b></div><div class="progress-bar secondary"><i style="width:42%"></i></div><div class="hint-note">Доли приведены для магазина в целом, независимо от фильтра категории. Неизвестные источники не приписываются авторам.</div></div></div><div class="analytics-bottom"><div class="panel audience-demographics"><div class="section-header"><h2>Аудитория сообщества · все товары</h2>${icon('info',16)}</div>${demographic()}</div><div class="panel cities"><div class="section-header"><h2>Города</h2><span class="muted">% аудитории</span></div>${[['Рыбинск',41.2],['Ярославль',14.6],['Москва',11.4],['Тутаев',6.8],['Углич',4.2],['Прочие',21.8]].map(([n,v])=>cityBar(n,v)).join('')}</div></div><section class="block"><div class="section-header"><div><h2>Публикации, которые привели покупателей</h2><p>Известные шопсы «Речной Бисквит» · пример за ${ui.period} дней</p></div>${badge(`${a.posts.length} из ${totalPosts} публикаций`,'soft')}</div><div class="panel table-panel"><div class="table-wrap"><table class="data-table analytics-table"><thead><tr><th>Автор / публикация</th><th>Товар</th><th>Просмотры</th><th>Открытия</th><th>Заказы</th><th>Оплачено*</th></tr></thead><tbody>${a.posts.map(p=>`<tr><td><div class="author-cell"><span class="author-avatar">${escapeHTML(p.name[0])}</span><span><strong>${escapeHTML(p.name)}</strong><small>${escapeHTML(p.author)} · ${p.date}</small></span></div></td><td>${escapeHTML(product(p.product)?.title)}</td><td>${fmt.format(Math.round(p.views*a.factor))}</td><td>${fmt.format(Math.round(p.opens*a.factor))}</td><td><strong>${fmt.format(Math.round(p.orders*a.factor))}</strong></td><td>${fmt.format(Math.round(p.paid*a.factor))}</td></tr>`).join('')}</tbody></table></div>${a.posts.length?'':`<div class="pad muted">Нет доступной статистики по выбранному товару.</div>`}<div class="table-note">* Оплачено — условный демонстрационный столбец. В рабочем сервисе показатель зависит от подтверждённого статуса оплаты.</div></div></section></div>`;};
  const settings = () => `<div>${pageIntro('РЕЧНОЙ БИСКВИТ','Настройки','Подключите существующее сообщество и настройте работу магазина.')}<div class="settings-stack"><div class="panel settings-card"><div class="settings-item"><div class="settings-icon">${icon('link',22)}</div><div><h2>Сообщество VK</h2><p>Работайте через существующее бизнес-сообщество, без создания нового профиля.</p></div>${badge(model.connected?'Подключено':'Не подключено',model.connected?'success':'danger')}</div><div class="connected-community">${sellerAvatar(community('archive'))}<div><strong>Речной Бисквит</strong><span>vk.com · демонстрационное сообщество</span></div>${button(model.connected?'Отключить':'Подключить','connect-community',model.connected?'outline':'primary')}</div><p class="hint-note">В реальном приложении здесь требуется авторизация VK и проверка прав администратора.</p></div><div class="panel settings-card"><div class="settings-item"><div class="settings-icon">${icon('bell',22)}</div><div><h2>Уведомления</h2><p>Управляйте согласием на оповещения о дропах.</p></div><label class="switch"><input data-setting="notifications" type="checkbox" ${model.notifications?'checked':''} /><span></span></label></div></div><div class="panel settings-card logistics-settings"><div class="settings-item"><div class="settings-icon">${icon('truck',22)}</div><div><h2>Логистика магазина · демо</h2><p>Методы получения, адрес отправки и сроки подготовки конкретного магазина.</p></div></div><form class="form-stack" data-form="logistics"><label>Адрес отправки / самовывоза<input name="address" maxlength="150" required value="${escapeHTML(model.logistics.address)}"/></label><label>Подготовка, дней<input type="number" name="handlingDays" min="1" max="14" required value="${model.logistics.handlingDays}"/></label><details class="delivery-method-picker"><summary class="delivery-method-trigger"><span class="delivery-method-summary"><strong>Способы получения</strong><small data-delivery-method-count>Выбрано ${deliveryMethods.filter(k=>model.logistics.methods[k]).length} из ${deliveryMethods.length}</small></span><span class="delivery-method-chevron">${icon('chevron',19)}</span></summary><div class="delivery-method-list">${deliveryMethods.map(k=>`<label class="delivery-method-choice"><input type="checkbox" name="method_${k}" ${model.logistics.methods[k]?'checked':''}/><span>${deliveryTypes[k]}</span></label>`).join('')}</div></details><div class="seller-logistics-city"><div class="seller-logistics-label">Город отправки магазина</div><div class="seller-logistics-city-value">Рыбинск — адрес магазина «Речной Бисквит»</div><input type="hidden" name="region_Рыбинск" value="1"/><small>Другие магазины Маркета находятся в других городах России.</small></div><small>Тарифы, сроки и перевозчик только тестовые. Проверка API и ограничений нужна для реального запуска.</small><button type="submit" class="btn primary">Сохранить настройки доставки</button></form></div><div class="panel settings-card"><div class="settings-item"><div class="settings-icon">${icon('refresh',22)}</div><div><h2>Сохранённые данные</h2><p>Возвратите исходные товары, заказы и состояние дропов.</p></div>${button('Сбросить данные','reset','outline')}</div></div></div></div>`;
  const buyerReturnsPage = () => {
    const requests=model.returns.slice().reverse();
    return `<div class="buyer-returns-page">${pageIntro('ПОКУПАТЕЛЮ · РЫБИНСК','Возвраты и обращения','Отслеживайте претензии и подавайте обращения по конкретному заказу. Демо.')}
    <div class="returns-guide panel"><div class="returns-guide-icon">${icon('refresh',24)}</div><div><h2>Как оформить возврат</h2><p>Откройте заказ, выберите товар и причину, затем способ передачи — СДЭК, Яндекс Маркет, курьер или магазин. После отправки появится номер обращения и история событий.</p></div>${button('Мои заказы','navigate','primary',`data-route="orders"`)}</div>
    <section class="block"><div class="section-header"><h2>Ваши обращения</h2></div>${requests.length?`<div class="return-list">${requests.map(r=>`<button class="panel return-item" data-action="navigate" data-route="return/${r.id}"><span><strong>Обращение № ${escapeHTML(r.id)}</strong><small>Заказ № ${escapeHTML(r.orderId)} · ${escapeHTML(product(r.productId)?.title||'Товар')}</small><small>${escapeHTML(r.reason)}</small></span>${badge(r.status==='created'?'Зарегистрировано':r.status==='refunded'?'Средства возвращены (демо)':'В работе','soft')}${icon('chevron',18)}</button>`).join('')}</div>`:empty('refresh','Возвратов пока нет','После оформления заказа здесь появятся зарегистрированные обращения.','open-search','Перейти в каталог')}</section>
    <section class="block"><div class="section-header"><h2>Выберите заказ для обращения</h2></div>${ordersList(false)}</section></div>`;
  };
  const screens = {welcome,market,search,favorites,cart,profile,returns:buyerReturnsPage,'studio/returns':()=>sellerReturns(),orders:()=>`<div>${pageIntro('ВАШ ПРОФИЛЬ','Мои заказы','Статусы и история оформленных заказов.')}${ordersList(false)}</div>`,'studio/overview':overview,'studio/products':sellerProducts,'studio/orders':sellerOrders,'studio/drops':sellerDrops,'studio/analytics':analytics,'studio/settings':settings};
  const content = () => {let r=route();if(r.startsWith('studio/order/'))return orderDetail(r.split('/')[2]);if(r.startsWith('order/'))return orderDetail(r.split('/')[1]);if(r.startsWith('studio/return/'))return returnDetail(r.split('/')[2]);if(r.startsWith('return/'))return returnDetail(r.split('/')[1]);if(r.startsWith('product/'))return productPage(r.split('/')[1]);if(r.startsWith('community/'))return communityPage(r.split('/')[1]);if(r.startsWith('drop/'))return dropsPage(r.split('/')[1]);return (screens[r]||notFound)();};
  const checkoutForm = () => {
    const d=ui.checkoutDraft||{city:'Рыбинск',method:'courier',point:'',address:'',recipient:'Покупатель VK',phone:'+7 900 000-00-00',payment:'Тестовая оплата (демо)'};
    const sellerId=product(model.cart[0]?.id)?.seller||SELLER_ID;
    const cfg=logisticsFor(sellerId);
    const variants=deliveryMethods.map(method=>({method,...quoteDelivery(method,'Рыбинск')}));
    const valid=variants.filter(v=>v.available);
    const mode=valid.some(v=>v.method===d.method)?d.method:(valid[0]?.method||'courier');
    const q=quoteDelivery(mode,'Рыбинск');
    const points=(pointNames['Рыбинск']||{})[mode]||[];
    return `<div class="modal-head"><span class="eyebrow">ОФОРМЛЕНИЕ ЗАКАЗА</span><h2>Доставка и получение</h2><p>Отправка из ${escapeHTML(cityFrom(community(sellerId).city))} в Рыбинск. Все сроки и тарифы — демонстрационный пример.</p></div><form data-form="checkout" class="form-stack checkout-form">
      <div class="fixed-city">${icon('location',18)} <div><b>Рыбинск</b><small>Город покупателя в демо · изменить нельзя</small></div></div><input type="hidden" name="city" value="Рыбинск"/>
      <fieldset class="delivery-choices"><legend>Способ доставки</legend>${variants.map(v=>`<label class="delivery-option ${v.method===mode?'selected':''} ${v.available?'':'is-disabled'}"><input type="radio" name="method" data-checkout="method" value="${v.method}" ${v.method===mode?'checked':''} ${v.available?'':'disabled'}/><span class="delivery-option-icon">${icon(v.method==='courier'?'truck':v.method==='self'?'home':'location',20)}</span><span class="delivery-option-body"><strong>${escapeHTML(deliveryTypes[v.method])}</strong><small>${escapeHTML(v.available?`${v.shippingDays} · ${money(v.price)} · пример`:v.reason)}</small></span><span class="delivery-option-check">${v.available?icon('check',15):'—'}</span></label>`).join('')}</fieldset>
      <div data-checkout-destination>${isPickupPoint(mode)?`<label>Пункт выдачи<select name="point" required>${points.map(x=>`<option value="${escapeHTML(x)}" ${x===d.point?'selected':''}>${escapeHTML(x)}</option>`).join('')}</select></label>`:mode==='courier'?`<label>Адрес доставки курьером<input name="address" required minlength="6" maxlength="180" value="${escapeHTML(d.address)}" placeholder="Улица, дом, квартира (Рыбинск)" /></label>`:`<div class="delivery-address">${icon('location',19)} <span><b>Самовывоз из магазина</b><small>${escapeHTML(cfg.address)}</small></span></div>`}</div>
      <div class="field-two"><label>Получатель<input name="recipient" value="${escapeHTML(d.recipient)}" required minlength="2" maxlength="80" /></label><label>Телефон<input name="phone" value="${escapeHTML(d.phone)}" type="tel" required minlength="10" maxlength="25" /></label></div>
      <label>Оплата<select name="payment"><option ${d.payment?.startsWith('Тестовая')?'selected':''}>Тестовая оплата (демо)</option><option ${d.payment?.startsWith('При')?'selected':''}>При получении (демо)</option></select></label>
      <div data-checkout-quote><div class="delivery-quote ${q.available?'':'unavailable'}"><div>${icon('truck',19)} <strong>${q.available?escapeHTML(q.provider):'Тариф недоступен'}</strong></div><p>${q.available?`${escapeHTML(q.window)} · ${escapeHTML(q.originCity)} → Рыбинск · вес около ${q.kg} кг`:escapeHTML(q.reason||'Уточните способ доставки')}</p><div><span>Товары</span><b>${money(cartTotal())}</b></div><div><span>Доставка</span><b>${q.available?money(q.price):'Уточняется'}</b></div><div class="quote-total"><span>Итого</span><strong>${q.available?money(cartTotal()+q.price):'—'}</strong></div></div></div>
      <button class="btn primary btn-wide btn-lg" type="submit" ${q.available?'':'disabled'}>${icon('check',18)} Подтвердить демозаказ</button><small>Тарифы, сроки и адреса ПВЗ вымышлены для демонстрации. Никакие средства не списываются.</small></form>`;
  };
  const reviewForm = () => {
    const o=orderFor(ui.currentOrder), p=product(ui.currentProduct), old=myReview(ui.currentOrder,ui.currentProduct);
    if(!o||!p||!canReview(o,p.id))return '<p>Отзыв доступен после получения товара.</p>';
    return `<div class="modal-head"><span class="eyebrow">ОТЗЫВ О ПОКУПКЕ</span><h2>${escapeHTML(p.title)}</h2><p>Ваш отзыв появится в карточке товара и в аналитике продавца. Сохранённые данные остаются в браузере.</p></div><form class="form-stack" data-form="review"><input type="hidden" name="orderId" value="${escapeHTML(o.id)}"/><input type="hidden" name="productId" value="${escapeHTML(p.id)}"/><label>Оценка от 1 до 5<select name="rating" required>${[5,4,3,2,1].map(n=>`<option value="${n}" ${Number(old?.rating||5)===n?'selected':''}>${'★'.repeat(n)} ${n} из 5</option>`).join('')}</select></label><label>Ваш отзыв<textarea name="text" rows="4" minlength="10" maxlength="900" required placeholder="Что понравилось, как товар показал себя после покупки?">${escapeHTML(old?.text||'')}</textarea></label><button type="submit" class="btn primary btn-wide">${old?'Обновить отзыв':'Опубликовать отзыв'}</button></form>`;
  };
  const issueForm = () => {
    const o=orderFor(ui.currentOrder);if(!o)return '';
    return `<div class="modal-head"><span class="eyebrow">ОБРАЩЕНИЕ ПО ЗАКАЗУ</span><h2>Сообщить о проблеме</h2><p>Заказ № ${escapeHTML(o.id)}. Обращение фиксируется сразу; продавец увидит его в реестре.</p></div><form class="form-stack" data-form="issue"><label>Тема<select name="kind"><option>Задержана доставка</option><option>Товар повреждён</option><option>Ошибка адреса</option><option>Вопрос по оплате</option><option>Другая проблема</option></select></label><label>Что произошло?<textarea name="description" rows="4" minlength="8" required placeholder="Опишите ситуацию"></textarea></label><button class="btn primary btn-wide" type="submit">Отправить обращение</button></form>`;
  };
  const returnForm = () => {
    const o=orderFor(ui.currentOrder);if(!o)return '';
    return `<div class="modal-head"><span class="eyebrow">ВОЗВРАТ · ПРЕТЕНЗИЯ</span><h2>Оформить обращение</h2><p>Заявка регистрируется сразу, без предварительного «разрешения» магазина. Условия зависят от причины и товара.</p></div><form class="form-stack" data-form="return">
      <div class="return-order-summary">Заказ № ${escapeHTML(o.id)} · ${escapeHTML(community(o.seller).name)}</div>
      <label>Товар<select name="productId" required>${o.items.map(i=>`<option value="${escapeHTML(i.id)}">${escapeHTML(product(i.id)?.title||i.title||i.id)} · ${money((i.unitPrice??product(i.id)?.price??0)*i.qty)}</option>`).join('')}</select></label>
      <label>Причина обращения<select name="reason" required><option>Отказ от качественного товара</option><option>Недостаток / повреждение</option><option>Не тот товар</option><option>Другая проблема</option></select></label>
      <label>Комментарий<textarea name="comment" rows="3" required minlength="5" placeholder="Опишите причину обращения"></textarea></label>
      <label>Фото или видео — необязательно<input type="file" name="evidence" accept="image/*,video/*"/><small>Демо сохраняет только название файла, без загрузки.</small></label>
      <label>Способ передачи товара<select name="method"><option value="cdek">СДЭК — пункт выдачи (демо)</option><option value="yandex">Яндекс Маркет — пункт выдачи (демо)</option>${community(o.seller).city==='Рыбинск'?`<option value="self">Передать продавцу в Рыбинске</option>`:''}<option value="courier">Курьер — по согласованию</option></select></label>
      <div class="notice return-legal">Требование можно зарегистрировать и до получения товара. Для обычного отказа от качественного товара момент передачи и применимые правила учитываются отдельно. Обратная доставка может быть платной — без автоматического списания.</div>
      <button type="submit" class="btn primary btn-wide">Зарегистрировать обращение ${icon('arrow',17)}</button></form>`;
  };
  const orderDetail = (id) => {
    const o=orderFor(id);if(!o)return notFound();const seller=studio(),sh=o.shipment||{status:'not_created',events:[]},q=o.shipping||{},isSelf=q.method==='self',rec=orderIsReceived(o);
    const label=shipNames[sh.status]||'Не оформлено';const payment= o.paid?'Тестовая оплата подтверждена':o.paymentStatus||'Ожидает оплаты (демо)';
    const next=sh.status==='not_created'?'create-shipment':'advance-shipment';const nextLabel=sh.status==='not_created'?'Оформить отправление':isSelf?sh.status==='preparing'?'Готово к выдаче':'Отметить получение':sh.status==='created'?'Передано перевозчику':sh.status==='accepted'?'В пути':sh.status==='transit'?'Ожидает получения':'Подтвердить вручение';
    const canAdvance=sh.status==='not_created'||(isSelf?!['received'].includes(sh.status):!['delivered'].includes(sh.status));
    const returns=buyerReturns(o);
    return `<div class="order-detail-page">${breadcrumb(seller?'studio/orders':'orders','К списку заказов')}${pageIntro(seller?'РЕЧНОЙ БИСКВИТ':'МОИ ПОКУПКИ',`Заказ № ${escapeHTML(o.id)}`,`Оформлен ${fmtDateTime(o.createdAt)} · ${escapeHTML(community(o.seller).name)}`)}<div class="order-detail-grid"><div class="panel order-detail-main"><div class="order-detail-title"><h2>Состав заказа</h2>${badge(o.status,orderStatusClass(o.status))}</div>${o.items.map(i=>{const p=product(i.id);return `<div class="order-line">${p?pImage(p):''}<div><strong>${escapeHTML(p?.title||i.title||i.id)}</strong><small>${i.qty} шт. · ${money(i.unitPrice??p?.price??0)}</small>${i.sourcePostId?'<small class="source-tag">Из шопса сообщества</small>':''}</div>${!seller&&canReview(o,i.id)?button(myReview(o.id,i.id)?'Изменить отзыв':'Оставить отзыв','open-review','outline',`data-order="${o.id}" data-id="${i.id}"`):''}</div>`;}).join('')}<div class="order-amounts"><div><span>Товары</span><b>${money(o.items.reduce((a,i)=>a+(i.unitPrice??product(i.id)?.price??0)*i.qty,0))}</b></div><div><span>Доставка</span><b>${q.price==null?'Уточняется':money(q.price)}</b></div><div class="quote-total"><span>Итого</span><strong>${money(o.total)}</strong></div></div></div><div class="panel order-detail-sidebar"><h2>Доставка и оплата</h2><div class="order-detail-field"><span>Способ</span><strong>${escapeHTML(deliveryTypes[q.method]||o.delivery||'Уточняется')}</strong></div><div class="order-detail-field"><span>Откуда</span><strong>${escapeHTML(q.originCity||community(o.seller).city)}</strong></div><div class="order-detail-field"><span>Куда / адрес</span><strong>${escapeHTML(q.destination||o.address||'—')}</strong></div><div class="order-detail-field"><span>Срок</span><strong>${escapeHTML(q.window||'Уточняется')}</strong></div><div class="order-detail-field"><span>Отправление</span><strong>${escapeHTML(label)}</strong></div><div class="order-detail-field"><span>Трек-номер</span><strong>${escapeHTML(sh.trackingId||'Не сформирован')}</strong></div><div class="order-detail-field"><span>Оплата</span><strong>${escapeHTML(payment)}</strong></div><p class="hint-note">Тарифы, сроки и статусы ниже приведены для примера; оплата не списывается.</p></div></div><div class="order-detail-grid"><section class="panel order-events"><h2>История событий</h2>${timeline(carrierTimeline(o))}${sh.exception?`<div class="warning-strip">${icon('info',17)} Исключение: ${escapeHTML(sh.exception)}. Требуется решение продавца.</div>`:''}</section><section class="panel order-next"><h2>${seller?'Управление отправлением':'Действия по заказу'}</h2>${seller?`${!o.paid?button('Подтвердить тестовую оплату','simulate-payment','outline',`data-id="${o.id}"`):''}${o.status==='Новый'?button('Подтвердить заказ','confirm-order','outline',`data-id="${o.id}"`):''}${canAdvance&&o.status!=='Отменён'?button(nextLabel,next,'primary',`data-id="${o.id}"`):''}${sh.status!=='not_created'&&!rec?`${button('Демо: задержано','shipment-exception','outline',`data-id="${o.id}" data-exception="Задержано"`)}${button('Демо: утрачено','shipment-exception','outline',`data-id="${o.id}" data-exception="Утрачено"`)}`:''}${sh.exception?button('Проблема решена','resolve-exception','outline',`data-id="${o.id}"`):''}`:`${button('Проблема с заказом','open-issue','outline',`data-id="${o.id}"`)}${button('Возврат / претензия','open-return','primary',`data-id="${o.id}"`)}<p class="hint-note">Обращение регистрируется сразу. Возврат и претензия — отдельные сценарии от отслеживания доставки.</p>`}${button('Сообщество продавца','navigate','outline',`data-route="community/${o.seller}"`)}</section></div>${returns.length?`<section class="block"><div class="section-header"><h2>Возвраты по заказу</h2></div><div class="return-list">${returns.map(r=>`<button class="panel return-item" data-action="navigate" data-route="${seller?'studio/return':'return'}/${r.id}"><span><strong>Обращение № ${r.id}</strong><small>${escapeHTML(r.reason)} · ${fmtDateTime(r.createdAt)}</small></span>${badge(r.status==='refunded'?'Деньги возвращены (демо)':r.status==='disputed'?'На разборе':r.status==='approved'?'Согласован':r.status==='processing'?'В работе':'Открыто','soft')}${icon('chevron',18)}</button>`).join('')}</div></section>`:''}${!seller?`<section class="block"><div class="section-header"><h2>Вопросы и обращения</h2></div><p class="hint-note">Связь с продавцом доступна через его сообщество. Реальные сообщения и поддержка VK не подключены.</p>${model.issues.filter(i=>i.orderId===o.id).map(i=>`<div class="panel issue-preview"><b>Обращение № ${i.id}</b> · ${escapeHTML(i.kind)}<p>${escapeHTML(i.description)}</p><small>${escapeHTML(i.status)} · ${fmtDateTime(i.createdAt)}</small></div>`).join('')}</section>`:''}</div>`;
  };
  const sellerReturns = () => {
    const returns=model.returns.filter(r=>orderFor(r.orderId)?.seller===SELLER_ID);
    const issues=model.issues.filter(i=>orderFor(i.orderId)?.seller===SELLER_ID);
    return `<div>${pageIntro('РЕЧНОЙ БИСКВИТ','Возвраты и обращения','Реестр претензий, статусы возвращаемых товаров и финансовых операций. Демо.')}<section class="block"><div class="section-header"><h2>Заявки на возврат</h2>${badge(`${returns.length} обращений`,'soft')}</div>${returns.length?`<div class="return-list">${returns.slice().reverse().map(r=>`<button class="panel return-item" data-action="navigate" data-route="studio/return/${r.id}"><span><strong>№ ${r.id} · заказ ${r.orderId}</strong><small>${escapeHTML(product(r.productId)?.title||r.productId)} · ${escapeHTML(r.reason)}</small><small>${fmtDateTime(r.createdAt)}</small></span>${badge(r.status==='refunded'?'Возвращены (демо)':r.status==='disputed'?'Разбор':r.status==='created'?'Новое':'В работе','soft')}${icon('chevron',18)}</button>`).join('')}</div>`:empty('refresh','Обращений пока нет','Покупатель сможет подать обращение после получения заказа.')}</section><section class="block"><div class="section-header"><h2>Проблемы с заказами</h2></div>${issues.length?`<div class="return-list">${issues.slice().reverse().map(i=>`<div class="panel issue-preview"><b>№ ${i.id} · заказ ${i.orderId}</b><p>${escapeHTML(i.kind)} · ${escapeHTML(i.description)}</p><small>${escapeHTML(i.status)} · ${fmtDateTime(i.createdAt)}</small>${i.status==='Новое'?button('Взять в работу','issue-process','outline',`data-id="${i.id}"`):''}</div>`).join('')}</div>`:'<div class="panel reviews-empty">Пока нет обращений о проблемах с доставкой или оплатой.</div>'}</section></div>`;
  };
  const returnDetail = (id) => {
    const r=requestFor(id);if(!r)return notFound();const o=orderFor(r.orderId),seller=studio(),p=product(r.productId);
    const stages={created:'Зарегистрировано',processing:'Принято в работу',awaiting:'Ожидается отправка',transit:'Возврат в пути',received:'Получено продавцом',approved:'Решение принято',initiated:'Возврат средств инициирован',refunded:'Средства возвращены (демо)',closed_unpaid:'Закрыто без выплаты',disputed:'Передано на разбор'};
    const price=(o?.items.find(i=>i.id===r.productId)?.unitPrice??p?.price??0)*(o?.items.find(i=>i.id===r.productId)?.qty||1);
    const shipping=(/Недостаток|Не тот товар/.test(r.reason)&&o?.items.length===1)?Number(o.shipping?.price||0):0;
    const payable=o?.paid?price+shipping:0;
    const refund=r.refund||{status:'Не инициирован',amount:0};
    const steps={created:['Взять в работу','processing'],processing:['Указать способ отправки','awaiting'],awaiting:['Демо: возврат в пути','transit'],transit:['Получено продавцом','received'],received:['Согласовать возврат','approved'],approved:[o?.paid?'Инициировать тестовый возврат средств':'Закрыть без денежного перевода',o?.paid?'initiated':'closed_unpaid'],initiated:['Подтвердить тестовый возврат средств','refunded']};
    const next=steps[r.status];
    return `<div class="return-detail-page">${breadcrumb(seller?'studio/returns':`order/${r.orderId}`,'Назад к обращениям')}${pageIntro('ВОЗВРАТ',`Обращение № ${escapeHTML(r.id)}`,`Заказ № ${escapeHTML(r.orderId)} · ${fmtDateTime(r.createdAt)}`)}<div class="order-detail-grid"><section class="panel"><div class="order-detail-title"><h2>${escapeHTML(p?.title||r.productId)}</h2>${badge(stages[r.status]||r.status,'soft')}</div><div class="order-detail-field"><span>Основание</span><strong>${escapeHTML(r.reason)}</strong></div><p class="return-comment">${escapeHTML(r.comment)}</p><div class="order-detail-field"><span>Способ передачи</span><strong>${escapeHTML(deliveryTypes[r.method]||r.method)}</strong></div><div class="order-detail-field"><span>Адрес / код</span><strong>${escapeHTML(isPickupPoint(r.method)?`Тестовый код RET-${r.id}`:r.method==='self'?logisticsFor(o?.seller||SELLER_ID).address:'Согласовывается с продавцом')}</strong></div>${r.evidence?`<small class="hint-note">Прикреплено название файла (демо): ${escapeHTML(r.evidence)}</small>`:''}<div class="notice">Обращение нельзя удалить или задним числом изменить дату. Статусы являются демонстрационными.</div></section><section class="panel"><h2>Расчёт возврата</h2><div class="order-detail-field"><span>Товар</span><strong>${money(price)}</strong></div><div class="order-detail-field"><span>Первичная доставка</span><strong>${money(shipping)} ${shipping?'· включена в расчёт':'· условия зависят от причины'}</strong></div><div class="order-detail-field"><span>Обратная доставка</span><strong>Уточняется · без списания</strong></div><div class="order-detail-field"><span>Всего потенциально</span><strong>${money(price+shipping)}</strong></div><div class="order-detail-field"><span>К возврату через оплату</span><strong>${money(payable)} ${!o?.paid?'· тестовая оплата не подтверждена':''}</strong></div><div class="order-detail-field"><span>Статус средств</span><strong>${escapeHTML(refund.status)}</strong></div><div class="order-detail-field"><span>ID операции</span><strong>${escapeHTML(refund.id||'Не создан')}</strong></div><div class="notice">Это расчёт для демо, не юридическое заключение и не реальный перевод средств.</div></section></div><div class="order-detail-grid"><section class="panel order-events"><h2>История обращения</h2>${timeline(r.events)}</section><section class="panel order-next"><h2>${seller?'Решение продавца':'Статус обращения'}</h2>${seller&&next?button(next[0],'advance-return','primary',`data-id="${r.id}"`):''}${seller&&r.status!=='refunded'&&r.status!=='disputed'?button('Передать на разбор','dispute-return','outline',`data-id="${r.id}"`):''}${!seller?`<p>Следите за событиями здесь. Требование уже зарегистрировано, отдельно «одобрение заявки» не требуется.</p>${button('Сообщество продавца','navigate','outline',`data-route="community/${o?.seller||'archive'}"`)}${button('Сообщить о проблеме','open-issue','outline',`data-id="${o?.id}"`)}`:''}${r.status==='disputed'?'<p class="hint-note">Обращение передано на разбор. Решение и правовые сроки не подменяются автоматикой.</p>':''}</section></div></div>`;
  };

  const modal = () => {if(!ui.modal)return '';const close=`<button class="modal-close icon-btn" data-action="close-modal" aria-label="Закрыть">${icon('close',20)}</button>`;let inner='';if(ui.modal==='checkout'){inner=checkoutForm();} else if(ui.modal==='review'){inner=reviewForm();} else if(ui.modal==='return'){inner=returnForm();} else if(ui.modal==='issue'){inner=issueForm();} else if(ui.modal==='product'){const p=ui.editing?product(ui.editing):null;inner=`<div class="modal-head"><span class="eyebrow">КАТАЛОГ</span><h2>${p?'Редактировать товар':'Новый товар'}</h2><p>Заполните карточку товара сообщества «Речной Бисквит».</p></div><form data-form="product" class="form-stack"><label>Название<input required name="title" maxlength="80" value="${escapeHTML(p?.title||'')}" placeholder="Например, торт «Речной закат»"/></label><div class="form-row"><label>Цена, ₽<input required type="number" min="1" max="10000000" name="price" value="${p?.price||''}"/></label><label>Остаток, шт.<input required type="number" min="0" max="100000" name="stock" value="${p?.stock??1}"/></label></div><label>Категория<select name="category">${['Гардероб','Дом и дача','Хобби и развлечения','Продукты питания','Красота и здоровье'].map(c=>`<option ${p?.category===c?'selected':''}>${c}</option>`).join('')}</select></label><label>Ссылка на фото (HTTPS)<input name="photo" type="url" placeholder="https://..." value="${escapeHTML(p?.photo||'')}"/></label><label>Описание<textarea name="description" rows="3" required placeholder="Особенности товара">${escapeHTML(p?.description||'')}</textarea></label><button type="submit" class="btn primary btn-wide">${p?'Сохранить изменения':'Опубликовать товар'} ${icon('check',18)}</button></form>`;} else if(ui.modal==='drop'){const dt=new Date(dateIn(4));const local = new Date(dt.getTime()-dt.getTimezoneOffset()*60000).toISOString().slice(0,16);inner=`<div class="modal-head"><span class="eyebrow">ЛИМИТИРОВАННАЯ КОЛЛЕКЦИЯ</span><h2>Создать дроп</h2><p>Анонсируйте коллекцию до старта продаж.</p></div><form data-form="drop" class="form-stack"><label>Название дропа<input name="title" required maxlength="70" placeholder="РЕЧНОЙ ДРОП / 03"/></label><label>Краткое описание<input name="subtitle" required maxlength="100" placeholder="Новая коллекция"/></label><label>Дата и время начала<input type="datetime-local" name="startsAt" required value="${local}"/></label><label>Ограничение в одни руки<input type="number" name="limit" min="1" max="20" value="1" required/></label><fieldset><legend>Товары в коллекции</legend><div class="drop-items">${model.products.filter(p=>p.seller==='archive').map(p=>`<label><input type="checkbox" name="itemIds" value="${p.id}"/><span>${escapeHTML(p.title)}</span></label>`).join('')}</div></fieldset><button type="submit" class="btn primary btn-wide">Анонсировать дроп ${icon('arrow',18)}</button></form>`;} else if(ui.modal==='analytics'){inner=`<div class="modal-head"><span class="eyebrow">О ПОКАЗАТЕЛЯХ</span><h2>Как считаются метрики</h2></div><div class="info-list"><p><b>Просмотры</b> — показы шопсов, если источник предоставляет данные.</p><p><b>Открытия карточек</b> — переходы в товар из публикации с известным идентификатором.</p><p><b>Оформленные заказы</b> — заказы, источник которых удалось связать с публикацией. Просмотр сам по себе не доказывает влияние публикации.</p><p><b>Конверсия</b> = оформленные заказы / открытия карточек из известных шопсов.</p><p><b>Средний чек</b> = сумма оформленных, не отменённых заказов этого магазина / число таких заказов. При выборе категории в сумму входят только товары категории.</p><p><b>Комиссия сервиса (демо)</b> = 5% от стоимости товаров оплаченных и завершённых заказов. Доставка и возвращённые товары исключаются. Строка «Уплачено Маркету» учитывает только отдельно отмеченные тестовые выплаты, не списания денег.</p><p><b>Категории</b> — фильтрация исключительно товаров «Речной Бисквит». Отсутствие статистики по шопсу не равно отсутствию продаж.</p><p><b>Оплаченные</b> отображаются отдельно и только при надёжном доступе к статусу оплаты.</p><div class="notice">Показатели публикаций приведены для примера и не являются реальной отчётностью.</div></div>`;}return `<div class="modal-backdrop" data-action="close-backdrop"><div class="modal-dialog panel" role="dialog" aria-modal="true" aria-label="Окно действия">${close}${inner}</div></div>`;};
  // Guided journey: controls stay clickable; explanatory blocks are highlighted as a whole.
  // 'spotlight' dims only surrounding UI, 'outline' keeps the page fully visible.
  const buyerTour = [
    {route:'market',selector:'.sidebar [data-route="search"], .mobile-bottom [data-route="search"]',title:'Найдите нужный товар',text:'Откройте каталог. Здесь можно искать по товарам и магазинам, выбирать категории и фильтровать результаты.',mode:'click'},
    {route:'search',selector:'.product-card .product-picture[data-route="product/p1"]',title:'Откройте карточку товара',text:'Нажмите на торт «Речной закат», чтобы увидеть цену, описание, условия изготовления и доставки.',mode:'click'},
    {route:'product/p1',selector:'.detail-content .detail-price',spotlight:'block',title:'Цена и покупка',text:'В карточке видно стоимость товара, наличие и кнопку добавления в корзину.',mode:'next'},
    {route:'product/p1',selector:'.detail-content .detail-description',spotlight:'block',title:'Описание товара',text:'Продавец рассказывает о составе, особенностях и оформлении товара. Ниже указаны характеристики.',mode:'next'},
    {route:'product/p1',selector:'.detail-content p.spec-row:nth-last-of-type(2)',spotlight:'block',title:'Изготовление и доставка',text:'Для товаров на заказ указано время изготовления. Рядом — сроки и условия доставки до выбранного города.',mode:'next'},
    {route:'product/p1',selector:'.reviews-section',mobileSelector:'.reviews-section .section-header',spotlight:'block',title:'Отзывы и рейтинг',text:'Оценки покупателей помогают выбрать товар. После получения заказа можно оставить собственный отзыв.',mode:'next'},
    {route:'product/p1',selector:'.seller-summary [data-route="community/archive"]',title:'Сообщество продавца',text:'Откройте магазин, чтобы увидеть его товары и публикации VK.',mode:'click'},
    {route:'community/archive',selector:'.shop-post .shop-actions [data-action="shop-open"][data-id="p1"]',title:'Шопсы в публикациях',text:'Нажмите на прикреплённый товар в посте. Покупатель попадёт в карточку, а переход отразится в аналитике продавца.',mode:'click'},
    {route:'product/p1',selector:'.sidebar [data-route="market"], .mobile-bottom [data-route="market"]',title:'Вернёмся к Маркету',text:'Теперь посмотрим на дропы — коллекции с заранее назначенным запуском.',mode:'click'},
    {route:'market',selector:'#drops .drop-card',title:'Посмотрите дроп',text:'Откройте ограниченную коллекцию: у неё есть дата старта, товары и собственные условия.',mode:'click'},
    {route:'drop/d1',selector:'.drop-info .countdown-box',mobileSelector:'.drop-info .countdown-box strong',fallback:'.drop-info .live-box',spotlight:'block',title:'Как устроен дроп',text:'У дропа есть дата старта, ограниченная коллекция и условия покупки. Пока запуск не произошёл, можно подписаться на напоминание.',mode:'next'},
    {route:'drop/d1',selector:'.drop-info [data-action="remind"]',fallback:'.drop-info .live-box',title:'Напоминание о запуске',text:'Нажмите, чтобы включить напоминание о дропе. Это демонстрационное уведомление.',mode:'click'},
    {route:'product/p1',selector:'.detail-buy [data-action="add-cart"]',title:'Добавьте товар в корзину',text:'Переходим к покупке. В одном заказе можно оформить товары одного продавца.',mode:'click'},
    {route:'cart',selector:'.order-summary [data-action="checkout"]',fallback:'.empty-state [data-action="open-search"]',title:'Проверьте корзину',text:'Здесь видны состав и сумма. Перейдите к оформлению, чтобы выбрать доставку.',mode:'click'},
    {route:'cart',modal:'checkout',selector:'.modal-dialog',spotlight:'modal',title:'Способы доставки',text:'Всё окно остаётся светлым: сравните СДЭК, Яндекс Маркет, курьера и самовывоз, цену и сроки. Выбор зависит от города и типа товара. Заказ сейчас подтверждать не нужно.',mode:'next'},
    {route:'orders',selector:'.orders-list, .empty-state',mobileSelector:'.page-intro h1',spotlight:'block',title:'История и статусы заказов',text:'После оформления заказ появляется в профиле: там можно отслеживать доставку, открывать детали и связываться с продавцом.',mode:'next'},
    {route:'returns',selector:'.returns-guide',mobileSelector:'.returns-guide h2',spotlight:'block',title:'Возвраты и обращения',text:'Из конкретного заказа можно подать обращение, выбрать причину и способ передачи товара, а затем отслеживать статус решения и денег.',mode:'next'}
  ];
  const sellerTour = [
    {route:'studio/overview',selector:'.seller-context',spotlight:'block',title:'Ваш магазин',text:'Кабинет показывает только товары, заказы и аналитику «Речного Бисквита». Сообщество VK остаётся точкой общения с покупателями.',mode:'next'},
    {route:'studio/overview',selector:'.sidebar [data-route="studio/products"], .mobile-bottom [data-route="studio/products"]',title:'Управление товарами',text:'Откройте каталог своего магазина: здесь можно редактировать ассортимент и остатки.',mode:'click'},
    {route:'studio/products',selector:'[data-action="new-product"]',title:'Добавьте товар',text:'Нажмите «Добавить товар», чтобы посмотреть поля карточки.',mode:'click'},
    {route:'studio/products',modal:'product',selector:'.modal-dialog',spotlight:'modal',title:'Карточка нового товара',text:'Название, цена, остаток, описание и изображение добавляются здесь. Ничего публиковать во время обучения не нужно.',mode:'next'},
    {route:'studio/overview',selector:'.seller-context [data-route="community/archive"]',title:'Перейдите в сообщество',text:'Откройте страницу магазина, где покупатели видят публикации и прикреплённые товары.',mode:'click'},
    {route:'community/archive',selector:'.shop-post .shop-actions [data-action="shop-open"][data-id="p1"]',title:'Товары в шопсах',text:'Кнопка в публикации ведёт в карточку товара. Источник перехода можно учитывать в аналитике.',mode:'click'},
    {route:'studio/drops',selector:'[data-action="new-drop"]',title:'Создание дропа',text:'Продавец может собрать лимитированную коллекцию и назначить дату старта. Откройте форму.',mode:'click'},
    {route:'studio/drops',modal:'drop',selector:'.modal-dialog',spotlight:'modal',title:'Настройки дропа',text:'Выберите товары, срок запуска и лимит на покупателя. Пока просто изучите окно.',mode:'next'},
    {route:'studio/orders',selector:'.orders-list, .empty-state',mobileSelector:'.orders-list .order-card:first-child, .empty-state h3',spotlight:'block',title:'Обработка заказов',text:'Здесь продавец подтверждает заказы, оформляет отправления и обновляет статусы доставки.',mode:'next'},
    {route:'studio/returns',selector:'.seller-returns, .return-list, .block',mobileSelector:'.return-list .return-item:first-child, .block .section-header',spotlight:'block',title:'Возвраты и обращения',text:'Покупательские обращения поступают в кабинет. По каждому сохраняется история решения и возврата средств.',mode:'next'},
    {route:'studio/analytics',selector:'.analytics-toolbar',mobileSelector:'.analytics-toolbar label, .analytics-toolbar .segmented',spotlight:'block',title:'Аналитика магазина',text:'Выбирайте период, товар или категорию. Сравнивайте переходы из шопсов, заказы и отзывы.',mode:'next'},
    {route:'studio/analytics',selector:'.commission-section',spotlight:'block',title:'Комиссия Маркета',text:'Здесь видны ставка и расчёт начислений, тестовые выплаты и остаток к оплате за выбранный период.',mode:'next'},
    {route:'studio/settings',selector:'.logistics-settings',spotlight:'block',title:'Условия доставки',text:'Продавец настраивает способы получения, адрес отправки и время подготовки заказов.',mode:'next'}
  ];
  const guidedSteps = () => ui.onboardingRole==='seller' ? sellerTour : buyerTour;
  const currentTourStep = () => guidedSteps()[Math.min(ui.onboardingStep,guidedSteps().length-1)];
  const onboardingMarkup = () => {
    if(!ui.onboarding)return '';
    const step=currentTourStep(),last=ui.onboardingStep===guidedSteps().length-1;
    const click=step.mode==='click';
    const block=step.spotlight==='block'||step.spotlight==='modal';
    return `<div class="guided-tour ${block?'guided-tour-block':'guided-tour-action'} ${step.spotlight==='modal'?'guided-tour-modal':''}" aria-label="Интерактивное знакомство с Маркетом">
      <div class="guided-highlight" aria-hidden="true"></div>
      <svg class="guided-pointer" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><marker id="guided-arrowhead" markerWidth="11" markerHeight="11" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8" fill="none" stroke="#2688eb" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" /></marker></defs><path class="guided-pointer-halo"/><path class="guided-pointer-line" marker-end="url(#guided-arrowhead)"/></svg>
      ${click?'<div class="guided-target-badge" aria-hidden="true">Нажмите сюда</div>':''}
      <section class="guided-tip" role="region" aria-label="Подсказка: ${escapeHTML(step.title)}"><div class="guided-top"><span>Шаг ${ui.onboardingStep+1} из ${guidedSteps().length}</span><button type="button" data-action="onboarding-close" aria-label="Закрыть подсказки">${icon('close',17)}</button></div>
      <h2>${escapeHTML(step.title)}</h2><p>${escapeHTML(step.text)}</p>
      <div class="guided-instruction">${icon(click?'mouse-pointer-click':'eye',17)}<span>${click?'Нажмите на выделенную кнопку или «Далее».':'Изучите выделенную область и нажмите «Далее».'}</span></div>
      <div class="guided-actions"><button type="button" class="guided-skip" data-action="onboarding-close">Пропустить обучение</button><div class="guided-steps-nav">${ui.onboardingStep?`<button type="button" class="guided-back" data-action="onboarding-prev">Назад</button>`:''}<button type="button" class="guided-next" data-action="onboarding-next">${last?'Завершить':'Далее'} ${icon('arrow',15)}</button></div></div>
      </section></div>`;
  };
  const onboardingResumeMarkup = () => ui.onboardingPreview&&!ui.onboarding&&route()!=='welcome'
    ? `<button class="guided-resume" data-action="onboarding-resume">${icon('info',17)} Продолжить знакомство · шаг ${ui.onboardingStep+1}</button>` : '';
  let tourRAF=0;
  const saveOnboardingPreview = () => {
    try {sessionStorage.setItem(ONBOARDING_RESUME_KEY,JSON.stringify({role:ui.onboardingRole,step:ui.onboardingStep}));}catch{}
  };
  const tourTarget = (step=currentTourStep()) => {
    if(!step?.selector)return null;
    const selector=(innerWidth<=780&&step.mobileSelector)||step.selector;
    const visible=(node)=>{
      if(!node)return false;
      const r=node.getBoundingClientRect(),cs=getComputedStyle(node);
      return r.width>8&&r.height>8&&cs.display!=='none'&&cs.visibility!=='hidden'&&node.getClientRects().length>0;
    };
    const choices=[...document.querySelectorAll(selector)].filter(visible);
    const onScreen=el=>{const r=el.getBoundingClientRect();return r.bottom>65&&r.top<innerHeight-65&&r.right>0&&r.left<innerWidth;};
    const fallback=step.fallback&&[...document.querySelectorAll(step.fallback)].find(visible);
    return choices.find(onScreen)||choices[0]||fallback||null;
  };
  const positionTour = () => {
    if(!ui.onboarding)return;
    const shell=document.querySelector('.guided-tour');if(!shell)return;
    const step=currentTourStep(),target=tourTarget(step);
    const highlight=shell.querySelector('.guided-highlight'),tip=shell.querySelector('.guided-tip');
    const arrow=shell.querySelector('.guided-pointer'),badge=shell.querySelector('.guided-target-badge');
    const mobile=innerWidth<=780,modalStep=step.spotlight==='modal';
    if(!target){
      highlight.style.display='none';arrow.style.display='none';if(badge)badge.style.display='none';
      tip.style.left=`${Math.max(12,Math.round((innerWidth-tip.offsetWidth)/2))}px`;
      tip.style.top=`${Math.max(75,Math.round((innerHeight-tip.offsetHeight)/2))}px`;
      return;
    }
    const viewportPad=mobile?10:14;
    // A whole modal must remain usable, including all delivery choices and the price summary.
    // On narrow screens the dialog gets its own scroll area below the compact explanation.
    const selectedRect=()=>target.getBoundingClientRect();
    let r=selectedRect();
    const isSmallTarget=r.height<innerHeight*.68;
    const scrollMargin=mobile?84:88;
    if(!modalStep&&isSmallTarget&&(r.top<scrollMargin||r.bottom>innerHeight-(mobile?85:24))){
      const targetTop=Math.max(scrollMargin, (innerHeight-r.height)/2);
      const delta=r.top-targetTop;
      if(Math.abs(delta)>8){
        window.scrollBy({top:delta,behavior:'instant'});
        r=selectedRect();
      }
    }
    // On a small screen, reserve enough room for both the target and the explanation.
    // This prevents the bubble from sitting on top of a product description or a big drop tile.
    if(mobile&&!modalStep&&r.height<innerHeight*.52){
      const h=tip.offsetHeight||210,gap=22,nav=78,header=68;
      const above=r.top-header,below=innerHeight-nav-r.bottom;
      if(above<h+gap&&below<h+gap){
        const pushUp=Math.max(0,h+gap-below);
        const pushDown=Math.max(0,h+gap-above);
        if(pushUp>0&&r.top-pushUp>header+8){window.scrollBy({top:pushUp+5,behavior:'instant'});r=selectedRect();}
        else if(pushDown>0&&window.scrollY>pushDown+5){window.scrollBy({top:-pushDown-5,behavior:'instant'});r=selectedRect();}
      }
    }
    const a={left:Math.max(0,r.left),top:Math.max(0,r.top),right:Math.min(innerWidth,r.right),bottom:Math.min(innerHeight,r.bottom)};
    a.width=Math.max(0,a.right-a.left);a.height=Math.max(0,a.bottom-a.top);
    const largeBlock=step.spotlight==='block'&&mobile;
    const spotlight=modalStep||step.spotlight==='block'&&!largeBlock;
    shell.classList.toggle('guided-dim',!!spotlight);
    shell.classList.toggle('guided-outline-only',!spotlight);
    // In block mode only the entire block is spotlighted, never a solitary delivery option.
    const pad=modalStep?4:(step.mode==='click'?5:7);
    highlight.style.display='block';
    Object.assign(highlight.style,{
      left:`${Math.max(2,a.left-pad)}px`,top:`${Math.max(2,a.top-pad)}px`,
      width:`${Math.min(innerWidth-Math.max(2,a.left-pad)-2,a.width+2*pad)}px`,
      height:`${Math.min(innerHeight-Math.max(2,a.top-pad)-2,a.height+2*pad)}px`
    });
    const width=tip.offsetWidth||330,height=tip.offsetHeight||180;
    const gap=18;
    let x,y;
    if(modalStep&&mobile){
      // Reserved banner zone: no part of the tooltip overlays the delivery dialog.
      x=(innerWidth-width)/2;
      y=69;
    }else{
      const candidates=[
        {x:a.right+gap,y:a.top+a.height/2-height/2,priority:0},
        {x:a.left-width-gap,y:a.top+a.height/2-height/2,priority:1},
        {x:a.left+a.width/2-width/2,y:a.bottom+gap,priority:2},
        {x:a.left+a.width/2-width/2,y:a.top-height-gap,priority:3},
        {x:innerWidth-width-viewportPad,y:76,priority:4},
        {x:viewportPad,y:76,priority:5},
        {x:viewportPad,y:innerHeight-height-(mobile?81:viewportPad),priority:6}
      ];
      const maxX=Math.max(viewportPad,innerWidth-width-viewportPad),maxY=Math.max(65,innerHeight-height-(mobile?75:viewportPad));
      const areaOverlap=(tx,ty)=>{
        const left=Math.max(tx,a.left-9),right=Math.min(tx+width,a.right+9);
        const top=Math.max(ty,a.top-9),bottom=Math.min(ty+height,a.bottom+9);
        return Math.max(0,right-left)*Math.max(0,bottom-top);
      };
      const ranked=candidates.map(c=>{
        const cx=Math.max(viewportPad,Math.min(maxX,c.x)),cy=Math.max(65,Math.min(maxY,c.y));
        const clipped=Math.abs(c.x-cx)+Math.abs(c.y-cy);
        return {...c,x:cx,y:cy,score:areaOverlap(cx,cy)*100+clipped*4+c.priority*12};
      }).sort((u,v)=>u.score-v.score);
      x=ranked[0].x;y=ranked[0].y;
      // On very narrow screens a large visible block leaves no external room.
      // Switch to a non-darkened outline, and keep the explanation in a compact bottom tray.
      if(areaOverlapFor(a,{left:x,top:y,width,height})>100){
        shell.classList.remove('guided-dim');shell.classList.add('guided-outline-only');
        x=Math.max(viewportPad,(innerWidth-width)/2);
        y=Math.max(68,innerHeight-height-(mobile?80:16));
      }
    }
    tip.style.left=`${Math.round(x)}px`;tip.style.top=`${Math.round(y)}px`;
    const clickStep=step.mode==='click';
    if(!clickStep){arrow.style.display='none';if(badge)badge.style.display='none';return;}
    arrow.style.display='block';if(badge)badge.style.display='flex';
    const tp={left:x,top:y,width,height};
    const center=(rc)=>({x:rc.left+rc.width/2,y:rc.top+rc.height/2});
    const boundary=(rc,dest)=>{
      const c=center(rc),dx=dest.x-c.x,dy=dest.y-c.y;
      const k=Math.min((rc.width/2+2)/Math.max(.01,Math.abs(dx)),(rc.height/2+2)/Math.max(.01,Math.abs(dy)));
      return {x:c.x+dx*k,y:c.y+dy*k};
    };
    const start=boundary(tp,center(a)),end=boundary(a,center(tp));
    const arrowDistance=Math.hypot(end.x-start.x,end.y-start.y);
    const shouldShowArrow=arrowDistance>=150;
    if(shouldShowArrow){
      const d=`M ${start.x.toFixed(1)} ${start.y.toFixed(1)} Q ${((start.x+end.x)/2).toFixed(1)} ${((start.y+end.y)/2-20).toFixed(1)} ${end.x.toFixed(1)} ${end.y.toFixed(1)}`;
      arrow.setAttribute('viewBox',`0 0 ${innerWidth} ${innerHeight}`);
      shell.querySelectorAll('.guided-pointer-halo,.guided-pointer-line').forEach(p=>p.setAttribute('d',d));
      arrow.style.display='block';
    }else{
      arrow.style.display='none';
    }
    // The label never covers the actual button or the explanatory bubble.
    if(badge){
      const labelW=111,labelH=25;
      let bx=Math.max(9,Math.min(innerWidth-labelW-9,a.left+a.width/2-labelW/2));
      let by=a.top-labelH-12;
      if(by<64)by=a.bottom+10;
      if(by>innerHeight-labelH-14)by=Math.max(64,a.top-labelH-12);
      const intersects=(r1,r2)=>r1.left<r2.left+r2.width&&r1.left+r1.width>r2.left&&r1.top<r2.top+r2.height&&r1.top+r1.height>r2.top;
      if(intersects({left:bx,top:by,width:labelW,height:labelH},tp)){
        const proposed=a.right+11;
        if(proposed+labelW<innerWidth-7){bx=proposed;by=Math.max(70,a.top+a.height/2-labelH/2);}
        else if(a.left-labelW-11>7){bx=a.left-labelW-11;by=Math.max(70,a.top+a.height/2-labelH/2);}
        else{badge.style.display='none';}
      }
      badge.style.left=`${Math.round(bx)}px`;badge.style.top=`${Math.round(by)}px`;
    }
  };
  const areaOverlapFor=(a,b)=>Math.max(0,Math.min(a.right,b.left+b.width)-Math.max(a.left,b.left))*Math.max(0,Math.min(a.bottom,b.top+b.height)-Math.max(a.top,b.top));
  const scheduleTourPosition = () => {if(ui.onboarding){cancelAnimationFrame(tourRAF);tourRAF=requestAnimationFrame(positionTour);}};
  const refreshOnboarding = () => {
    const root=document.getElementById('onboarding-root');
    if(!root)return;
    root.innerHTML=onboardingMarkup();
    const resumeRoot=document.getElementById('onboarding-resume-root');
    if(resumeRoot)resumeRoot.innerHTML=onboardingResumeMarkup();
    document.body.classList.toggle('onboarding-active',!!ui.onboarding);
    document.body.classList.toggle('tour-modal-docked',!!ui.onboarding&&currentTourStep()?.spotlight==='modal');
    scheduleTourPosition();
  };
  const closeOnboarding = () => {
    ui.onboarding=false;ui.onboardingPreview=false;ui.modal=null;
    try{localStorage.setItem(`${ONBOARDING_KEY}-${ui.onboardingRole}`,'seen');sessionStorage.removeItem(ONBOARDING_RESUME_KEY);}catch{}
    render();
  };
  const tourGoStep = (index) => {
    if(index>=guidedSteps().length){closeOnboarding();return;}
    ui.onboardingStep=Math.max(0,index);ui.onboarding=true;ui.onboardingPreview=false;ui.toast='';
    const step=currentTourStep();
    saveOnboardingPreview();
    ui.modal=null;
    const targetRoute=step.route;
    const modalStep=step.modal && (step.modal!=='checkout'||model.cart.length);
    if(targetRoute&&route()!==targetRoute){
      go(targetRoute);
      if(modalStep){ui.modal=step.modal;render();}
    }else if(modalStep){ui.modal=step.modal;render();}
    else render();
  };
  const resumeOnboarding = () => {
    ui.onboarding=true;ui.onboardingPreview=false;ui.sidebar=false;
    tourGoStep(ui.onboardingStep);
  };
  const beginTour = (role) => {
    ui.onboardingRole=role;
    if(role==='buyer'){ui.query='';ui.category='Все';ui.inStock=false;ui.minPrice='';ui.maxPrice='';}
    // Explicit role selection always starts that role's guide, even if completed before.
    // Moving between screens inside a role does not restart it.
    ui.onboardingStep=0;
    ui.onboarding=true;
    ui.onboardingPreview=false;
    saveOnboardingPreview();
    tourGoStep(0);
  };

  const render = () => {const isWelcome=route()==='welcome';document.documentElement.dataset.theme=model.theme;document.body.classList.toggle('filters-visible',ui.filtersOpen);document.body.classList.toggle('welcome-mode',isWelcome);document.body.classList.toggle('onboarding-active',!!ui.onboarding);document.body.classList.toggle('tour-modal-docked',!!ui.onboarding&&currentTourStep()?.spotlight==='modal');document.title=studio()?'Речной Бисквит · VK Маркет':'VK Маркет';document.getElementById('app').innerHTML = `${isWelcome?'':head()}<div class="shell ${isWelcome?'welcome-shell':''}">${isWelcome?'':sidebar()}<main id="main" class="main-content"><div class="content-wrap">${content()}</div></main></div>${isWelcome?'':filterDrawer()}${modal()}${ui.toast?`<div class="toast" role="status">${icon('check',19)} ${escapeHTML(ui.toast)}</div>`:''}${isWelcome?'':`<nav class="mobile-bottom">${(studio()?sellerNav.slice(0,5):topNav).map(([r,g,n])=>`<button class="${route()===r?'active':''}" data-action="navigate" data-route="${r}">${icon(g,21)}<span>${n}</span></button>`).join('')}</nav>`}<div id="onboarding-root">${onboardingMarkup()}</div><div id="onboarding-resume-root">${onboardingResumeMarkup()}</div>`;scheduleTourPosition();};
  const notify = (text) => {ui.toast=text;render();clearTimeout(notify.timer);notify.timer=setTimeout(()=>{ui.toast='';const node=document.querySelector('.toast');if(node)node.remove();},3200);};
  const countdown = (date) => {const sec=Math.max(0,Math.floor((new Date(date).getTime()-Date.now())/1000));const days=Math.floor(sec/86400),hours=Math.floor((sec%86400)/3600),mins=Math.floor((sec%3600)/60);return `${String(days).padStart(2,'0')} дн : ${String(hours).padStart(2,'0')} ч : ${String(mins).padStart(2,'0')} мин`;};
  const addToCart = (id) => {const p=product(id);if(!p||p.stock<=0)return notify('Товар закончился');const belongsToDrop=model.drops.find(d=>d.itemIds.includes(id)&&d.seller===p.seller);if(model.cart.length&&product(model.cart[0].id)?.seller!==p.seller)return notify('В одном заказе можно оформить товары только одного продавца');const item=model.cart.find(x=>x.id===id);if(item){if(item.qty>=p.stock)return notify('Больше нет в наличии');if(belongsToDrop?.status==='live'&&item.qty>=belongsToDrop.limit)return notify('Достигнут лимит дропа на покупателя');item.qty++;}else model.cart.push({id,qty:1});if(ui.currentSource?.productId===id){const item=model.cart.find(x=>x.id===id);if(item)item.sourcePostId=ui.currentSource.postId;ui.currentSource=null;}persist();notify('Товар добавлен в корзину');};
  const action = (name, el, originalTarget) => {const id=el.dataset.id;switch(name){
    case 'scroll-reviews':document.getElementById('reviews')?.scrollIntoView({behavior:'smooth'});break;
    case 'shop-open':{
      const post=shopPosts.find(p=>p.id===el.dataset.post);
      if(!post || post.productId!==id)break;
      model.shopEvents.push({postId:post.id,productId:id,kind:'open',at:new Date().toISOString()});
      ui.currentSource={postId:post.id,productId:id};persist();go(`product/${id}`);break;
    }
    case 'shop-buy':{
      const post=shopPosts.find(p=>p.id===el.dataset.post);
      if(!post||post.productId!==id)break;
      model.shopEvents.push({postId:post.id,productId:id,kind:'open',at:new Date().toISOString()});
      ui.currentSource={postId:post.id,productId:id};addToCart(id);break;
    }
    case 'open-review':{
      const o=orderFor(el.dataset.order);if(!canReview(o,id))return notify('Оставить отзыв можно после получения товара');
      ui.currentOrder=o.id;ui.currentProduct=id;ui.modal='review';render();break;
    }
    case 'open-issue':{
      const o=orderFor(id);if(!o)return notify('Заказ не найден');ui.currentOrder=id;ui.modal='issue';render();break;
    }
    case 'open-return':{
      const o=orderFor(id);if(!o)return notify('Заказ не найден');
      ui.currentOrder=id;ui.modal='return';render();break;
    }
    case 'seed-commission-demo':{
      if(model.commissionDemoLoaded || ownOrders().length)break;
      const isoAgo=(days)=>new Date(Date.now()-days*86400000).toISOString();
      const example=[{id:'DEMO-COM-7',pid:'p1',days:2},{id:'DEMO-COM-30',pid:'p5',days:19},{id:'DEMO-COM-90',pid:'p11',days:63}];
      for(const x of example){
        const p=product(x.pid);if(!p)continue;
        model.orders.push({id:x.id,seller:SELLER_ID,items:[{id:p.id,qty:1,unitPrice:p.price}],createdAt:isoAgo(x.days),paidAt:isoAgo(x.days),completedAt:isoAgo(x.days),total:p.price+390,paid:true,status:'Завершён',customer:'Демо-покупатель',delivery:'Курьер',shipping:{method:'courier',price:390,city:'Рыбинск',destination:'Рыбинск (демо)',window:'1–2 дня'},shipment:{status:'delivered',provider:'Демо-перевозчик',trackingId:`COM-${x.id}`,events:[]},events:[{at:isoAgo(x.days),label:'Демо-заказ завершён, тестовая оплата подтверждена'}],commissionDemo:true});
      }
      for(const [orderId,pid,days] of [['DEMO-COM-30','p5',2],['DEMO-COM-90','p11',20]]){
        const p=product(pid);if(!p)continue;
        model.commissionPayments.push({id:`cp-demo-${orderId}`,seller:SELLER_ID,orderId,amount:Math.round(p.price*DEMO_COMMISSION_RATE),at:isoAgo(days),demo:true});
      }
      model.commissionDemoLoaded=true;persist();notify('Добавлены 3 тестовых заказа и 2 выплаты комиссии');break;
    }
    case 'settle-commission':{
      const existing=new Map();
      for (const p of model.commissionPayments.filter(p=>p.seller===SELLER_ID)) existing.set(p.orderId,(existing.get(p.orderId)||0)+p.amount);
      const due=commissionLedger().map(x=>({...x,unpaid:Math.max(0,x.fee-(existing.get(x.orderId)||0))})).filter(x=>x.unpaid>0);
      if (!due.length) return notify('Нет начислений для тестовой выплаты');
      const now=new Date().toISOString();
      for (const x of due) {
        model.commissionPayments.push({id:`cp-${Date.now()}-${x.orderId}`,seller:SELLER_ID,orderId:x.orderId,amount:x.unpaid,at:now,demo:true});
        const o=orderFor(x.orderId);
        if (o) {o.events??=[];o.events.push(event(`Комиссия Маркету: ${money(x.unpaid)} — тестовая выплата, без реального перевода`));}
      }
      persist();notify(`Зафиксирована тестовая выплата комиссии: ${money(due.reduce((n,x)=>n+x.unpaid,0))}`);break;
    }
    case 'simulate-payment':{
      const o=orderFor(id);if(!o||o.seller!==SELLER_ID)break;
      o.paid=true;o.paidAt ||= new Date().toISOString();o.paymentStatus='Тестовая оплата подтверждена';o.events??=[];o.events.push(event('Тестовая оплата подтверждена продавцом · демо'));
      persist();notify('Оплата отмечена как тестовая');break;
    }
    case 'confirm-order':{
      const o=orderFor(id);if(!o||o.seller!==SELLER_ID||o.status==='Отменён')break;
      o.status='В обработке';o.events??=[];o.events.push(event('Продавец подтвердил заказ'));persist();notify('Заказ взят в обработку');break;
    }
    case 'create-shipment':{
      const o=orderFor(id);if(!o||o.seller!==SELLER_ID||o.status==='Отменён')break;
      if(o.shipment?.status&&o.shipment.status!=='not_created')break;
      const self=o.shipping?.method==='self';
      o.shipment={status:self?'preparing':'created',trackingId:self?`PICKUP-DEMO-${id}`:`SHIP-DEMO-${id}`,provider:self?'Самовывоз (демо)':'Демо-перевозчик',events:[event(self?'Самовывоз: товар готовится':'Отправление оформлено, этикетка создана (демо)')]};
      o.status='В обработке';persist();notify('Тестовое отправление создано');break;
    }
    case 'advance-shipment':{
      const o=orderFor(id),sh=o?.shipment;if(!o||!sh||o.seller!==SELLER_ID||sh.exception) {if(sh?.exception)notify('Сначала закройте исключение по отправлению');break;}
      const self=o.shipping?.method==='self';const arr=self?['preparing','ready','received']:allShipStatuses.slice(1);
      const i=arr.indexOf(sh.status);if(i<0||i===arr.length-1)break;
      sh.status=arr[i+1];sh.events.push(event(shipNames[sh.status]+' · демонстрационный статус'));
      if(['delivered','received'].includes(sh.status)){o.status='Завершён';o.completedAt=new Date().toISOString();o.events??=[];o.events.push(event('Получение зафиксировано в демо (не подтверждает качество)'));}
      persist();notify('Статус отправления обновлён');break;
    }
    case 'shipment-exception':{
      const o=orderFor(id);if(!o?.shipment||o.seller!==SELLER_ID)break;
      o.shipment.exception=el.dataset.exception||'Задержано';o.shipment.events.push(event(`Исключение: ${o.shipment.exception} · демо`));persist();notify('Исключение зарегистрировано');break;
    }
    case 'resolve-exception':{
      const o=orderFor(id);if(!o?.shipment||o.seller!==SELLER_ID)break;
      o.shipment.exception=null;o.shipment.events.push(event('Исключение рассмотрено в демо'));persist();notify('Демо-проблема закрыта');break;
    }
    case 'advance-return':{
      const r=requestFor(id);if(!r||orderFor(r.orderId)?.seller!==SELLER_ID)break;
      const states={created:'processing',processing:'awaiting',awaiting:'transit',transit:'received',received:'approved',approved:orderFor(r.orderId)?.paid?'initiated':'closed_unpaid',initiated:'refunded'};
      const next=states[r.status];if(!next)break;
      const old=r.status;r.status=next;
      const labels={processing:'Продавец принял обращение в работу',awaiting:'Способ возврата указан; ожидается отправка',transit:'Возвратная отправка в пути · демо',received:'Товар получен продавцом · демо',approved:'Принято решение о возврате',initiated:'Тестовый возврат средств инициирован',refunded:'Тестовый возврат средств подтверждён',closed_unpaid:'Обращение закрыто без денежного перевода: платёж не проводился'};
      r.events.push(event(labels[next]));
      if(next==='approved')r.refund={status:orderFor(r.orderId)?.paid?'Возврат согласован':'Не требуется: тестовой оплаты нет',amount:0};
      if(next==='initiated'){
        const o=orderFor(r.orderId);const i=o?.items.find(x=>x.id===r.productId);
        const original=(Number(i?.unitPrice??product(i?.id)?.price)||0)*(i?.qty||1);
        const shipping=(/Недостаток|Не тот товар/.test(r.reason)&&o.items.length===1)?Number(o.shipping?.price||0):0;
        r.refund={status:'Возврат средств инициирован · демо',amount:original+shipping,id:`REF-DEMO-${r.id}`};
      }
      if(next==='refunded')r.refund.status='Средства возвращены · тестовые данные';
      if(next==='closed_unpaid')r.refund={status:'Перевод не требуется · оплаты не было',amount:0};
      persist();notify('Статус обращения обновлён');break;
    }
    case 'dispute-return':{
      const r=requestFor(id);if(!r||orderFor(r.orderId)?.seller!==SELLER_ID)break;
      r.status='disputed';r.events.push(event('Обращение передано на разбор '));persist();notify('Обращение передано на разбор');break;
    }
    case 'issue-process':{
      const issue=model.issues.find(x=>x.id===id);if(!issue||orderFor(issue.orderId)?.seller!==SELLER_ID)break;
      issue.status='В работе';issue.events.push(event('Продавец взял обращение в работу'));persist();notify('Обращение принято');break;
    }
    case 'navigate':{const r=el.dataset.route;if(!r.startsWith('product/'))ui.currentSource=null;go(r);break;}
    case 'choose-role':{
      const role=el.dataset.route.startsWith('studio/')?'seller':'buyer';
      beginTour(role);
      break;
    }
    case 'open-onboarding':
      ui.onboardingRole=studio()?'seller':'buyer';
      if(ui.onboardingRole==='buyer'){ui.query='';ui.category='Все';ui.inStock=false;ui.minPrice='';ui.maxPrice='';}
      ui.onboardingStep=0;
      resumeOnboarding();break;
    case 'onboarding-resume':resumeOnboarding();break;
    case 'onboarding-next':{const step=currentTourStep();const before=ui.onboardingStep;if(step?.mode==='click'){const target=tourTarget(step);const control=target?.matches?.('[data-action]')?target:target?.closest?.('[data-action]');if(control && !control.disabled)control.click();}if(ui.onboarding&&ui.onboardingStep===before)tourGoStep(before+1);break;}
    case 'onboarding-prev':tourGoStep(ui.onboardingStep-1);break;
    case 'onboarding-close':closeOnboarding();break;

    case 'open-search':go('search');break;
    case 'switch-buyer':go('market');break;
    case 'scroll-drops':document.getElementById('drops')?.scrollIntoView({behavior:'smooth'});break;
    case 'category':ui.category=el.dataset.name;ui.query='';go('search');break;
    case 'clear-filters':ui.category='Все';ui.minPrice='';ui.maxPrice='';ui.query='';ui.inStock=false;ui.sort='popular';render();break;
    case 'open-filters':ui.filterDraft={category:ui.category,minPrice:ui.minPrice,maxPrice:ui.maxPrice,inStock:ui.inStock};ui.filtersOpen=true;render();requestAnimationFrame(()=>document.querySelector('.filter-drawer-close')?.focus());break;
    case 'close-filters':ui.filtersOpen=false;ui.filterDraft=null;render();requestAnimationFrame(()=>document.querySelector('.filter-open-btn')?.focus());break;
    case 'close-filter-backdrop':if(el===originalTarget){ui.filtersOpen=false;ui.filterDraft=null;render();}break;
    case 'reset-draft-filters':ui.filterDraft={category:'Все',minPrice:'',maxPrice:'',inStock:false};render();break;
    case 'price-preset':ui.filterDraft={...(ui.filterDraft||{}),minPrice:el.dataset.min||'',maxPrice:el.dataset.max||''};render();break;
    case 'apply-filters':{
      const f=ui.filterDraft||{};
      if ((f.minPrice&&Number(f.minPrice)<0)||(f.maxPrice&&Number(f.maxPrice)<0)||(f.minPrice&&f.maxPrice&&Number(f.minPrice)>Number(f.maxPrice)))return notify('Проверьте диапазон цен');
      Object.assign(ui,{category:f.category||'Все',minPrice:f.minPrice||'',maxPrice:f.maxPrice||'',inStock:Boolean(f.inStock),filtersOpen:false,filterDraft:null});
      render();requestAnimationFrame(()=>document.querySelector('.filter-open-btn')?.focus());break;
    }
    case 'remove-filter-chip':{
      const key=el.dataset.key;
      if(key==='query')ui.query='';
      if(key==='category')ui.category='Все';
      if(key==='price'){ui.minPrice='';ui.maxPrice='';}
      if(key==='inStock')ui.inStock=false;
      render();break;
    }
    case 'toggle-sidebar':ui.sidebar=!ui.sidebar;render();break;
    case 'theme':model.theme=model.theme==='dark'?'light':'dark';persist();render();break;
    case 'favorite':model.favorites=isFav(id)?model.favorites.filter(x=>x!==id):[...model.favorites,id];persist();render();break;
    case 'follow':{const wasFollowing=model.following.includes(id);model.following=wasFollowing?model.following.filter(x=>x!==id):[...model.following,id];persist();el.innerHTML=`${icon('heart',18)} ${wasFollowing?'Подписаться':'Вы подписаны'}`;el.classList.toggle('outline',!wasFollowing);el.classList.toggle('primary',wasFollowing);el.setAttribute('aria-pressed',String(!wasFollowing));break;}
    case 'add-cart':addToCart(id);break;
    case 'remove-cart':model.cart=model.cart.filter(x=>x.id!==id);persist();render();break;
    case 'qty-up':case 'qty-down':{const item=model.cart.find(x=>x.id===id);if(item){item.qty+=name==='qty-up'?1:-1;if(item.qty>product(id).stock)item.qty=product(id).stock;const d=model.drops.find(d=>d.status==='live'&&d.itemIds.includes(id));if(d&&item.qty>d.limit)item.qty=d.limit;if(item.qty<1)model.cart=model.cart.filter(x=>x.id!==id);}persist();render();break;}
    case 'checkout':ui.checkoutDraft={city:'Рыбинск',method:'courier',point:'',address:'',recipient:'Покупатель VK',phone:'+7 900 000-00-00',payment:'Тестовая оплата (демо)'};ui.modal='checkout';render();break;
    case 'close-modal':ui.modal=null;render();break;
    case 'close-backdrop':if(el===originalTarget){ui.modal=null;render();}break;
    case 'new-product':ui.editing=null;ui.modal='product';render();break;
    case 'edit-product':ui.editing=id;ui.modal='product';render();break;
    case 'new-drop':ui.modal='drop';render();break;
    case 'stock-up':case 'stock-down':{const p=product(id);if(p)p.stock=Math.max(0,p.stock+(name==='stock-up'?1:-1));persist();render();break;}
    case 'next-order':{const o=model.orders.find(o=>o.id===id);const steps=['Новый','Подтверждён','В сборке','Отправлен','Завершён'];if(o&&steps.includes(o.status)){o.status=steps[Math.min(steps.indexOf(o.status)+1,steps.length-1)];if(o.status==='Завершён')o.completedAt=new Date().toISOString();}persist();notify('Статус заказа обновлён');break;}
    case 'cancel-order':{const o=model.orders.find(o=>o.id===id);if(o&&o.status!=='Отменён'){o.status='Отменён';o.events??=[];o.events.push(event('Заказ отменён продавцом · demo. Статус денег не меняется автоматически.'));o.items.forEach(i=>{const p=product(i.id);if(p)p.stock+=i.qty;});}persist();notify('Заказ отменён, остатки возвращены');break;}
    case 'remind':if(!model.notifications)return notify('Разрешите напоминания в профиле');model.reminders=model.reminders.includes(id)?model.reminders.filter(x=>x!==id):[...model.reminders,id];persist();notify(model.reminders.includes(id)?'Вы подписались на напоминание':'Напоминание отключено');break;
    case 'view-drop':go(`drop/${id}`);break;
    case 'launch-drop':{const d=drop(id);if(d)d.status='live';persist();notify('Дроп открыт для покупки в демо');break;}
    case 'end-drop':{const d=drop(id);if(d)d.status='ended';persist();notify('Дроп завершён');break;}
    case 'period':ui.period=Number(el.dataset.period);render();break;
    case 'metric':ui.metric=el.dataset.metric;render();break;
    case 'analytics-info':ui.modal='analytics';render();break;
    case 'reset-analytics-filter':ui.analyticsCategory='Все';ui.analyticsProduct='all';render();break;
    case 'connect-community':model.connected=!model.connected;persist();notify(model.connected?'Сообщество подключено (демо)':'Сообщество отключено');break;
    case 'reset':if(window.confirm('Удалить сохранённые данные Маркета и начать заново?')){model=defaultState();ui={category:'Все',query:'',sort:'popular',minPrice:'',maxPrice:'',inStock:false,filtersOpen:false,filterDraft:null,period:30,metric:'opens',analyticsCategory:'Все',analyticsProduct:'all',modal:null,editing:null,toast:'',sidebar:false,checkoutDraft:null,currentOrder:null,currentProduct:null,currentReturn:null,currentSource:null};persist();go('welcome');notify('Данные Маркета восстановлены');}break;
  }};
  document.addEventListener('click',(e)=>{
    const target=e.target.closest('[data-action]');
    if(!target||target.disabled)return;
    if(['close-backdrop','close-filter-backdrop'].includes(target.dataset.action)&&target!==e.target)return;
    const step=ui.onboarding?currentTourStep():null;
    const chosen=step?.mode==='click' && [...document.querySelectorAll(step.selector)].some(node=>node===target||node.contains(target));
    e.preventDefault();
    action(target.dataset.action,target,e.target);
    if(chosen && ui.onboarding && currentTourStep()===step)tourGoStep(ui.onboardingStep+1);
  });
  const updateFilterDraft = (el) => {
    if(!ui.filterDraft) return;
    ui.filterDraft[el.dataset.draftFilter] = el.type==='checkbox' ? el.checked : el.value;
    const counter=document.querySelector('[data-filter-result-count]');
    if(counter)counter.textContent=fmt.format(filteredProducts(ui.filterDraft).length);
  };
  document.addEventListener('input',(e)=>{if(e.target.dataset.draftFilter)updateFilterDraft(e.target);});
  // In-place checkout updates: avoid recreating the dialog and replaying its entrance animation.
  document.addEventListener('change',(e)=>{
    if(!e.target.dataset.checkout)return;
    const form=e.target.closest('form[data-form="checkout"]');if(!form)return;
    const data=new FormData(form),old=ui.checkoutDraft||{};
    ui.checkoutDraft={...old,city:'Рыбинск',method:String(data.get('method')||old.method||'courier'),point:String(data.get('point')||''),address:String(data.get('address')||old.address||''),recipient:String(data.get('recipient')||old.recipient||''),phone:String(data.get('phone')||old.phone||''),payment:String(data.get('payment')||old.payment||'Тестовая оплата (демо)')};
    form.querySelectorAll('.delivery-option').forEach(el=>{
      el.classList.toggle('selected',el.querySelector('input[type="radio"]')?.checked||false);
    });
    const template=document.createElement('template');template.innerHTML=checkoutForm();
    const dest=form.querySelector('[data-checkout-destination]'),newDest=template.content.querySelector('[data-checkout-destination]');
    const quote=form.querySelector('[data-checkout-quote]'),newQuote=template.content.querySelector('[data-checkout-quote]');
    if(dest&&newDest)dest.innerHTML=newDest.innerHTML;
    if(quote&&newQuote)quote.innerHTML=newQuote.innerHTML;
    const submit=form.querySelector('button[type="submit"]'),next=template.content.querySelector('button[type="submit"]');
    if(submit&&next)submit.disabled=next.disabled;
  });
  document.addEventListener('change',(e)=>{
    const el=e.target;
    const picker=el.closest?.('.delivery-method-picker');
    if(picker && el.matches('input[type="checkbox"]')){
      const count=picker.querySelectorAll('input[type="checkbox"]:checked').length;
      const label=picker.querySelector('[data-delivery-method-count]');
      if(label)label.textContent=`Выбрано ${count} из ${deliveryMethods.length}`;
    }
    if(el.dataset.draftFilter)updateFilterDraft(el);
    if(el.dataset.filter){let v=el.type==='checkbox'?el.checked:el.value;ui[el.dataset.filter]=v;if(el.dataset.filter==='analyticsCategory')ui.analyticsProduct='all';render();}
    if(el.dataset.setting){model[el.dataset.setting]=el.checked;persist();render();}
  });
  document.addEventListener('submit',(e)=>{
    const form=e.target;if(!form.dataset.form)return;e.preventDefault();
    const data=new FormData(form);const kind=form.dataset.form;
    if(['global-search','catalog-search'].includes(kind)){
      ui.query=String(data.get('q')||'').trim();if(kind==='global-search')ui.category='Все';go('search');return;
    }
    if(kind==='checkout'){
      if(!model.cart.length)return;
      const items=model.cart.map(x=>({...x,unitPrice:product(x.id)?.price||0,title:product(x.id)?.title||''}));
      if(items.some(x=>x.qty>(product(x.id)?.stock||0)))return notify('Не хватает товара в наличии');
      const city=String(data.get('city')||''),method=String(data.get('method')||'');
      const q=quoteDelivery(method,city);if(!q.available)return notify(q.reason||'Способ доставки недоступен');
      const destination=isPickupPoint(method)?String(data.get('point')||''):method==='courier'?String(data.get('address')||''):logisticsFor(product(items[0].id).seller).address;
      if(!destination||destination.length<4)return notify('Укажите точку получения или адрес');
      const now=new Date().toISOString();const id=String(Date.now()).slice(-8);
      const order={id,createdAt:now,seller:product(items[0].id).seller,items,total:cartTotal()+q.price,status:'Новый',paid:false,
        paymentStatus:String(data.get('payment'))==='При получении (демо)'?'При получении · без подтверждения оплаты':'Ожидает тестовой оплаты',
        customer:String(data.get('recipient')).slice(0,80),phone:String(data.get('phone')).slice(0,25),delivery:deliveryTypes[method],address:destination,
        shipping:{method,city,originCity:q.originCity,destination,price:q.price,window:q.window,weightKg:q.kg,provider:q.provider},
        shipment:{status:'not_created',provider:q.provider,trackingId:null,events:[]},events:[event('Выбран способ доставки: '+deliveryTypes[method]+', тариф '+money(q.price)+' · демо')]};
      items.forEach(x=>product(x.id).stock-=x.qty);model.orders.push(order);model.cart=[];ui.checkoutDraft=null;ui.currentSource=null;
      model.drops.filter(d=>d.status==='live').forEach(d=>{if(d.itemIds.every(pid=>(product(pid)?.stock||0)===0))d.status='soldout';});
      persist();go(`order/${id}`);notify(`Демозаказ № ${id} оформлен`);return;
    }
    if(kind==='review'){
      const oid=String(data.get('orderId')),pid=String(data.get('productId'));const o=orderFor(oid);
      if(!canReview(o,pid))return notify('Отзыв доступен после получения товара');
      const value=Number(data.get('rating')),message=String(data.get('text')||'').trim();
      if(value<1||value>5||message.length<10)return notify('Укажите оценку и отзыв от десяти символов');
      const existing=myReview(oid,pid);
      if(existing)Object.assign(existing,{rating:value,text:message,date:new Date().toISOString()});
      else model.reviews.push({id:`review-${Date.now()}`,orderId:oid,productId:pid,rating:value,text:message,author:'Покупатель VK',date:new Date().toISOString(),demo:false});
      ui.modal=null;persist();go(`product/${pid}`);notify('Отзыв опубликован в демо');return;
    }
    if(kind==='issue'){
      const o=orderFor(ui.currentOrder);if(!o)return;
      const issue={id:String(Date.now()).slice(-7),orderId:o.id,kind:String(data.get('kind')),description:String(data.get('description')).trim().slice(0,800),createdAt:new Date().toISOString(),status:'Новое',events:[event('Обращение зарегистрировано')]};
      if(issue.description.length<8)return notify('Опишите проблему подробнее');
      model.issues.push(issue);ui.modal=null;persist();go(`order/${o.id}`);notify(`Обращение № ${issue.id} зарегистрировано`);return;
    }
    if(kind==='return'){
      const o=orderFor(ui.currentOrder),pid=String(data.get('productId')||'');if(!o||!o.items.some(i=>i.id===pid))return notify('Выберите товар из заказа');
      if(model.returns.some(r=>r.orderId===o.id&&r.productId===pid&&r.status!=='disputed'))return notify('Для этого товара уже зарегистрировано обращение');
      const notes=String(data.get('comment')||'').trim();if(notes.length<5)return notify('Добавьте описание требования');
      const request={id:String(Date.now()).slice(-8),orderId:o.id,productId:pid,reason:String(data.get('reason')||''),comment:notes.slice(0,900),method:String(data.get('method')||'cdek'),evidence:data.get('evidence')?.name||'',status:'created',createdAt:new Date().toISOString(),refund:{status:'Не инициирован',amount:0},events:[event('Требование зарегистрировано без ожидания одобрения продавца')]};
      model.returns.push(request);ui.modal=null;persist();go(`return/${request.id}`);notify(`Обращение № ${request.id} зарегистрировано`);return;
    }
    if(kind==='logistics'){
      const methods={cdek:data.has('method_cdek'),yandex:data.has('method_yandex'),courier:data.has('method_courier'),self:data.has('method_self')};
      if(!Object.values(methods).some(Boolean))return notify('Включите хотя бы один способ получения');
      const regions=demoCities.slice(0,3).filter(c=>data.has(`region_${c}`));
      model.logistics={...model.logistics,address:String(data.get('address')||'').trim().slice(0,150),handlingDays:Math.max(1,Math.min(14,Number(data.get('handlingDays'))||2)),methods,regions};
      persist();notify('Настройки демонстрационной доставки сохранены');return;
    }
    if(kind==='product'){
      const p=ui.editing?product(ui.editing):null;
      const d={title:String(data.get('title')).trim(),price:Number(data.get('price')),stock:Number(data.get('stock')),category:String(data.get('category')),description:String(data.get('description')).trim(),photo:String(data.get('photo')||'').trim()};
      if(!d.title||!d.description||d.price<=0||d.stock<0)return notify('Проверьте данные товара');
      if(d.photo&&!/^https:\/\//i.test(d.photo))return notify('Для фото нужна HTTPS-ссылка');
      if(p)Object.assign(p,d,{photo:d.photo||p.photo});
      else model.products.unshift({id:`p${Date.now()}`,seller:SELLER_ID,color:'#e9ecf2',...d,photo:d.photo||photos.jacket});
      persist();ui.modal=null;go('studio/products');notify(p?'Товар обновлён':'Товар добавлен в каталог');return;
    }
    if(kind==='drop'){
      const ids=data.getAll('itemIds').map(String);if(!ids.length)return notify('Выберите хотя бы один товар');
      const when=new Date(String(data.get('startsAt')));if(!Number.isFinite(when.getTime()))return notify('Укажите дату запуска');
      const d={id:`d${Date.now()}`,seller:SELLER_ID,title:String(data.get('title')).trim(),subtitle:String(data.get('subtitle')).trim(),description:'Лимитированная коллекция сообщества «Речной Бисквит».',cover:product(ids[0])?.photo||photos.jacket,startsAt:when.toISOString(),status:'announced',itemIds:ids,limit:Number(data.get('limit'))||1};
      model.drops.unshift(d);persist();ui.modal=null;go('studio/drops');notify('Дроп анонсирован');return;
    }
  });
  window.addEventListener('hashchange',()=>{ui.sidebar=false;render();});
  window.addEventListener('keydown',(e)=>{
    if(ui.onboarding){
      if(e.key==='Escape'){e.preventDefault();closeOnboarding();return;}
      if((e.key==='ArrowRight'||e.key==='ArrowLeft')&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName)){
        e.preventDefault();tourGoStep(ui.onboardingStep+(e.key==='ArrowRight'?1:-1));return;
      }
    }
    if(e.key==='Escape'&&ui.filtersOpen){ui.filtersOpen=false;ui.filterDraft=null;render();requestAnimationFrame(()=>document.querySelector('.filter-open-btn')?.focus());return;}
    if(e.key==='Escape'&&ui.modal){ui.modal=null;render();}
    if(e.key==='Tab'&&ui.filtersOpen){
      const focusables=[...document.querySelectorAll('.filter-drawer button:not([disabled]),.filter-drawer input:not([disabled])')];
      if(!focusables.length)return;
      if(e.shiftKey&&document.activeElement===focusables[0]){e.preventDefault();focusables.at(-1).focus();}
      else if(!e.shiftKey&&document.activeElement===focusables.at(-1)){e.preventDefault();focusables[0].focus();}
    }
  });
  window.addEventListener('resize',scheduleTourPosition);
  window.addEventListener('scroll',scheduleTourPosition,true);
  setInterval(()=>document.querySelectorAll('[data-countdown]').forEach(el=>{const d=drop(el.dataset.countdown);if(d)el.textContent=countdown(d.startsAt);}),1000);
  render();
})();
