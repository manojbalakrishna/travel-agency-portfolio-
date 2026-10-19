/* =====================================================================
   SKYWINGS - app.js   (all the site behaviour)
   Search for the section number, e.g.  "05 HERO SLIDESHOW"

   CONTENTS
   01  HELPERS ($, $$, toast, go)
   02  HERO HEADLINE (animated words)
   03  DRAWN PICTURES (shown when a photo file is missing)
   04  PACKAGE DATA - edit packages here
   05  PACKAGES RAIL + FILTER CHIPS
   06  SERVICES CAROUSEL (cards, chips, drag)
   07  SERVICES CAROUSEL - cursor effects (mouse only)
   08  HERO SLIDESHOW
   09  HOW IT WORKS (steps)
   10  DARK / LIGHT TOGGLE
   11  SEARCH BAR (filters packages)
   12  POPUPS: package details + booking form
   13  HEADER SERVICES DROPDOWN
   14  MOBILE MENU + SMOOTH SCROLL LINKS
   15  CONTACT FORM
   16  LIVE DATA FROM FIREBASE (called by the module script in index.html)
   17  DATE FIELDS (.dw wrapper, fixes blank date inputs on phones)
   18  VISA + TICKET REQUEST POPUPS
   19  FAQ (two independent columns)
   20  OFFER CARDS (Dubai, Oman visa, Bali)
   21  20% OFF BOX (auto-changing posters)
   22  CUSTOM DROPDOWNS (enhance() replaces native selects)
   23  NEWSLETTER
   24  OFFER COUNTDOWN
   25  SCROLL REVEAL (.rv) + STAT COUNTERS
   26  SCROLL EFFECTS (header, progress bar, parallax)
   ===================================================================== */


/* ---- 01 HELPERS ($, $$, toast, go) ---- */
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const toast=t=>{const e=$('#toast');e.textContent=t;e.classList.add('o');clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove('o'),2600)};
const go=el=>{const y=Math.max(0,el.getBoundingClientRect().top+scrollY-84);scrollTo({top:y,behavior:'smooth'});setTimeout(()=>{if(Math.abs(scrollY-y)>60)scrollTo(0,y)},800)};
let WA=SITE.whatsapp;

/* ---- 02 HERO HEADLINE (animated words) ---- */
$('#h1').innerHTML=$('#h1').textContent.split(' ').map((w,i)=>`<span class="w"><span style="animation-delay:${.15+i*.09}s">${w=='Crafted'?'<em>'+w+'</em>':w}</span></span>`).join(' ');

/* ---- 03 DRAWN PICTURES (shown when a photo file is missing) ---- */
const sc={beach:['#8fd3ff','#e8f6ff','#1fb5d4','#f6e3b4'],city:['#ffb48a','#ffe2c7','#4a5a86','#2b3558'],mountain:['#a9c4ff','#eef3ff','#5b6f9a','#fff']};
function scene(t,i){const c=sc[t];const x=20+i*13%40;return `<svg viewBox="0 0 300 220" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="g${i}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c[0]}"/><stop offset="1" stop-color="${c[1]}"/></linearGradient></defs><rect width="300" height="220" fill="url(#g${i})"/><circle cx="${230-x}" cy="55" r="22" fill="#fff8d6" opacity=".9"/>`+
(t=='beach'?`<rect y="130" width="300" height="90" fill="${c[2]}"/><path d="M0 170 Q70 150 140 172 T300 165 V220 H0Z" fill="${c[3]}"/><path d="M${60+x} 135 q40-50 90 0z" fill="#2c7a5b"/><path d="M${100+x} 135 l4 -30" stroke="#6b4a2f" stroke-width="4"/>`:
t=='city'?`<g fill="${c[3]}">${[0,1,2,3,4,5,6,7].map(k=>`<rect x="${k*40}" y="${70+(k*37+i*23)%70}" width="32" height="160"/>`).join('')}</g><g fill="${c[2]}" opacity=".6"><rect x="10" y="140" width="40" height="90"/><rect x="170" y="120" width="40" height="110"/></g>`:
`<path d="M-20 220 L90 60 L160 150 L210 90 L330 220Z" fill="${c[2]}"/><path d="M70 90 L90 60 L110 92 L92 84Z M195 112 L210 90 L228 116 L212 108Z" fill="#fff"/><path d="M0 200 Q100 170 300 205 V220 H0Z" fill="#dfe9ff"/>`)+`</svg>`}

/* ---- 04 PACKAGE DATA - edit packages here ---- */
/* Row format: [name, place, type(beach/city/mountain), days, price, tagline, "itin1|itin2|...", "include1|include2|...", category(couple/student/christian, or leave out)] */
const D=[
['Bali','Indonesia','beach',5,48000,'Temples, rice terraces and beach days','Ubud rice terraces and monkey forest|Mount Batur sunrise trek|Uluwatu temple and sunset|Nusa Penida island day','4-star resort|Breakfast daily|Airport transfers|English-speaking guide'],
['Dubai','UAE','city',4,42000,'Skyline, fountains and beach days','Dubai Fountain and an abra boat ride|Museum of the Future|Dubai Marina beach walk|Camel ride at JBR beach','Hotel near Marina|Breakfast daily|Desert safari|Metro pass'],
['Kyoto','Japan','city',6,78000,'Temples, old lanes and autumn colour','Kiyomizu-dera pagoda and temple grounds|The wooden stage of Kiyomizu-dera|Yasaka Pagoda and the Higashiyama lanes|Ninenzaka at sunset','Ryokan stay|Breakfast daily|Rail pass|Local guide'],
['Maldives','Indian Ocean','beach',5,85000,'Overwater villa escape','Speedboat transfer to the resort|Snorkel the house reef|Sunset dolphin cruise|Spa morning, free afternoon','Overwater villa|Breakfast & dinner|Speedboat transfers|Snorkel gear','couple'],
['Tokyo','Japan','city',7,92000,'Neon nights and city skylines','Shibuya crossing and the neon streets|Tokyo Tower and the skyline|Akihabara and anime culture|Kabukicho after dark','City hotel|Breakfast daily|Suica card|Fuji day tour'],
['Santorini','Greece','beach',7,99000,'Whitewashed cliffs and caldera sunsets','Oia sunset viewpoint|Caldera boat cruise|Wine tasting in Pyrgos|Red Beach and Akrotiri','Cliffside suite|Breakfast daily|Boat cruise|Wine tasting','couple'],
['Zermatt','Switzerland','mountain',6,105000,'Matterhorn views and alpine trains','The Gornergrat railway and the Matterhorn|Lauterbrunnen and the Staubbach Falls|Alpine meadows and glacier rivers|Flower gardens on Lake Lugano','Alpine chalet|Breakfast daily|Swiss travel pass|Cable car tickets'],
['Banff','Canada','mountain',7,112000,'Rocky Mountain towns and northern lights','Banff Avenue and Cascade Mountain|The Banff town sign and snowy pines|Northern lights and wildlife nights','Lodge stay|Breakfast daily|SUV rental|Park pass'],
['Udaipur','India','city',4,32000,'Lake palaces and candlelit evenings for two','City Palace and Lake Pichola|Sunset boat ride|Candlelight dinner by the lake|Old city and bazaars','Lake-view hotel|Breakfast daily|Candlelight dinner|Private cab','couple'],
['Goa','India','beach',4,14500,'Beaches, water sports and a group bonfire night','Fort Aguada and Baga beach|Water sports day|Old Goa churches and Panjim walk|Group bonfire evening','Shared stay|Breakfast daily|AC bus transfers|Trip coordinator','student'],
['Manali','India','mountain',5,18500,'Mountain-view stays, snow days and campfire nights','Mountain-view stay in Manali|A snow day with the group|Himalayan village and snow peaks','Camps and hotels, sharing|Breakfast & dinner|Volvo bus|Trip coordinator','student'],
['Kashmir','Jammu and Kashmir','mountain',6,52000,'Shikaras, meadows and snow peaks','Shikara ride on Dal Lake|Alpine meadows and glaciers|River valley below the snow peaks','Houseboat and hotel stay|Breakfast & dinner|Private cab|Local guide'],
['Singapore','Singapore','city',6,58000,'Skyline views, gardens and the Merlion','Marina Bay skyline at sunset|Gardens by the Bay and the Supertree walk|Merlion Park by night|Merlion and the Fullerton waterfront','Shared hotel rooms|Breakfast daily|MRT pass|Guide','student'],
['Holy Land','Israel & Jordan','city',8,145000,'Walk where Jesus walked, from Jerusalem to the Jordan','Jerusalem and the Mount of Olives|The Jordan River baptism site|Holy Mass at a sacred church|Stained glass and sacred art','Hotels, breakfast & dinner|Christian pilgrim guide|Entry tickets|Airport transfers','christian'],
['Italy','Rome, Florence, Milan, Venice','city',9,165000,'Great cathedrals from Florence to Venice','Florence Duomo and the Baptistery|The Vatican and St. Peter\'s Basilica|Milan Duomo and its marble spires|St. Mark\'s Basilica in Venice','Hotel stay|Breakfast daily|Entry tickets|Pilgrim guide','christian'],
['Gothic Europe','Paris and Cologne','city',8,155000,'Notre-Dame, Cologne and the great Gothic cathedrals','Notre-Dame Cathedral, Paris|The Last Judgment portal|Gardens behind Notre-Dame|Cologne Cathedral and its nave','Hotel stay|Breakfast daily|Entry tickets|Pilgrim guide','christian'],
['Velankanni','Tamil Nadu','city',3,9500,'A short pilgrimage to Our Lady of Good Health','Basilica of Our Lady of Good Health|Holy mass and evening procession|Our Lady\'s tank and the beach','Hotel stay|Breakfast daily|AC coach transfers|Pilgrim guide','christian']];
/* PHOTOS: add real photos per package as data: URIs, e.g. PH.Bali=['data:image/jpeg;base64,...','...'] (first one is the cover) */
const PH={};
const slug=n=>n.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
/* Photos load from the images/ folder. If a file is missing, the drawn scene stays. */
const IMG=(f,k,alt)=>`<img src="images/${f}/${k}.jpg" alt="${alt}" loading="lazy" onerror="this.remove()">`;
const pic=i=>scene(D[i][2],i)+IMG('packages/'+slug(D[i][0]),1,D[i][0]+', '+D[i][1]);

/* ---- 05 PACKAGES RAIL + FILTER CHIPS ---- */
let F={type:'all',dur:'any',bud:'any',cat:'all'},favs=new Set(),P=2;
const fmt=n=>'₹'+n.toLocaleString('en-IN');
const ok=d=>(F.cat=='all'||(d[8]||'all')==F.cat)&&(F.type=='all'||d[2]==F.type)&&(F.dur=='any'||(F.dur=='s'?d[3]<=4:F.dur=='m'?d[3]>=5&&d[3]<=6:d[3]>=7))&&(F.bud=='any'||(F.bud=='lo'?d[4]<50000:F.bud=='mid'?d[4]>=50000&&d[4]<=90000:d[4]>90000));
function renderRail(){const l=D.map((d,i)=>[d,i]).filter(([d])=>ok(d));
$('#rail').innerHTML=l.length?l.map(([d,i])=>`<article class="dc" data-i="${i}" tabindex="0" role="button" aria-label="${d[0]} package details"><div class="im">${pic(i)}${d[8]&&d[8]!='all'?`<span class="bdg">${{couple:'Couple',student:'Student',christian:'Christian'}[d[8]]}</span>`:''}<button class="heart ${favs.has(i)?'on':''}" data-h="${i}" aria-label="Save ${d[0]}">${favs.has(i)?'♥':'♡'}</button></div><div class="row"><div><b>${d[0]}, ${d[3]}D/${d[3]-1}N</b><small>${d[1]}</small></div><span class="price">${fmt(d[4])}</span></div></article>`).join(''):`<div class="empty"><b>No packages match these filters.</b><br>Try a wider budget or duration.<br><button class="btn" id="rs">Show all packages</button></div>`;
$$('.chip[data-f]').forEach(c=>c.classList.toggle('on',c.dataset.f=='all'?F.type=='all'&&F.cat=='all':c.dataset.f==F.type||c.dataset.f==F.cat));$('#rail').scrollLeft=0}
$('#chips').innerHTML=['all','couple','student','christian','beach','city','mountain'].map(c=>`<button class="chip" data-f="${c}">${c[0].toUpperCase()+c.slice(1)}</button>`).join('');
renderRail();
$('#chips').onclick=e=>{const f=e.target.dataset.f;if(!f)return;const cs=f=='couple'||f=='student'||f=='christian';F={type:cs||f=='all'?'all':f,dur:F.dur,bud:F.bud,cat:cs?f:'all'};$('#s_t').value=F.type;$('#s_c').value=F.cat;renderRail()};
$('#rail').onclick=e=>{if(e.target.id=='rs'){F={type:'all',dur:'any',bud:'any',cat:'all'};['#s_t','#s_d','#s_b','#s_c'].forEach((q,k)=>$(q).value=['all','any','any','all'][k]);renderRail();return}
const h=e.target.closest('[data-h]');if(h){const i=+h.dataset.h;favs.has(i)?favs.delete(i):favs.add(i);h.classList.toggle('on');h.textContent=favs.has(i)?'♥':'♡';toast(favs.has(i)?'Saved to favorites':'Removed from favorites');return}
const c=e.target.closest('[data-i]');if(c)openDetail(+c.dataset.i)};
$('#rail').onkeydown=e=>{if(e.key=='Enter'&&e.target.dataset.i)openDetail(+e.target.dataset.i)};
$('#nx').onclick=()=>$('#rail').scrollBy({left:320,behavior:'smooth'});$('#pv').onclick=()=>$('#rail').scrollBy({left:-320,behavior:'smooth'});

/* ---- 06 SERVICES CAROUSEL (cards, chips, drag) ---- */
const SV=[['couple','couple','Couple packages','Romantic stays, private transfers and candlelight dinners for two.','beach','Explore',['Private stays','Candlelight dinners']],
['student','student','Student tours','Safe, budget-friendly group trips with a trip coordinator.','mountain','Explore',['Group rates','Trip coordinator']],
['christian','christian','Christian trips','Pilgrimages to the Holy Land, Rome and local shrines with a pilgrim guide.','city','Explore',['Pilgrim guide','Group rates']],
['visa','visa','Visa assistance','We check your documents, fill the forms and book your appointment.','city','Enquire now',['Document check','Appointments']],
['ticket','tickets','Ticket booking','Flights, trains and buses at the best available fares.','beach','Enquire now',['Flights','Trains & buses']]];
let act=0,st;
function renderSV(){$('#cv').innerHTML=SV.map((s,i)=>{const l=D.filter(d=>d[8]==s[0]),tag=l.length?'From '+fmt(Math.min(...l.map(d=>d[4]))):s[0]=='visa'?'All countries':'Best fares',ch=l.length?[l.length+' package'+(l.length>1?'s':''),s[6][0]]:s[6];
 return `<article class="cc" data-i="${i}"><div class="cim">${scene(s[4],60+i*7)}<img src="images/services/${s[1]}.jpg" alt="${s[2]}" loading="lazy" onerror="this.remove()"></div><i class="glr"></i><span class="cct-tag">${tag}</span><div class="cct"><h3>${s[2]}</h3><p>${s[3]}</p><div class="cch">${ch.map(c=>`<span>${c}</span>`).join('')}</div><button class="ccb" data-svc="${s[0]}">${s[5]}</button></div></article>`}).join('');layoutSV()}
function layoutSV(){$$('#svch .chip').forEach((c,i)=>c.classList.toggle('on',i==act));const cs=$$('.cc'),n=cs.length;if(!n)return;const w=cs[0].offsetWidth,nr=innerWidth<700,step=w*(nr?.78:.8);
 cs.forEach((c,i)=>{let d=((i-act)%n+n)%n;if(d>n/2)d-=n;const a=Math.abs(d),hide=a>(nr?1:2);c.classList.toggle('on',!d);c.style.zIndex=10-a;c.style.opacity=hide?0:1;c.style.pointerEvents=hide?'none':'';c.style.transform=`perspective(1000px) translateX(calc(-50% + ${d*step}px)) scale(${1-a*.12}) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg))`;c.style.filter=d?'brightness(.65)':'';c.querySelectorAll('button').forEach(b=>b.tabIndex=d?-1:0)})}
function runSV(){clearInterval(st);if(!matchMedia('(prefers-reduced-motion:reduce)').matches)st=setInterval(()=>{act=(act+1)%SV.length;layoutSV()},5500)}
const mvSV=k=>{act=(act+k+SV.length)%SV.length;layoutSV();runSV()};
$('#cvp').onclick=()=>mvSV(-1);$('#cvn').onclick=()=>mvSV(1);
{const cf=$('#cf3');let px=null,mv=false;cf.onmouseenter=()=>clearInterval(st);cf.onmouseleave=runSV;
cf.onpointerdown=e=>{px=e.clientX;mv=false};cf.onpointerup=e=>{if(px==null)return;const dx=e.clientX-px;px=null;if(Math.abs(dx)>45){mv=true;mvSV(dx<0?1:-1)}};
cf.addEventListener('click',e=>{const c=e.target.closest('.cc');if(!c)return;if(mv){e.stopPropagation();e.preventDefault();mv=false;return}if(+c.dataset.i!=act){e.stopPropagation();e.preventDefault();act=+c.dataset.i;layoutSV();runSV()}},true)}
$('#svch').innerHTML=['Couple','Student','Christian','Visa','Tickets'].map((t,i)=>`<button class="chip" data-sv="${i}">${t}</button>`).join('');
$('#svch').onclick=e=>{const b=e.target.closest('[data-sv]');if(!b)return;act=+b.dataset.sv;layoutSV();runSV()};
addEventListener('resize',layoutSV);renderSV();runSV();

/* ---- 07 SERVICES CAROUSEL - cursor effects (mouse only) ---- */
if(matchMedia('(hover:hover) and (pointer:fine)').matches&&!matchMedia('(prefers-reduced-motion:reduce)').matches){
 const cf=$('#cf3'),cur=document.createElement('div');cur.className='cur';cur.innerHTML='<span></span>';document.body.appendChild(cur);cf.classList.add('cur-on');
 let tx=0,ty=0,cx=0,cy=0,on=false;
 (function loop(){cx+=(tx-cx)*.2;cy+=(ty-cy)*.2;cur.style.transform=`translate(${cx}px,${cy}px) translate(-50%,-50%) scale(${on?1:.4})`;requestAnimationFrame(loop)})();
 const rst=k=>{k.style.setProperty('--rx','0deg');k.style.setProperty('--ry','0deg');k.classList.remove('tilt')};
 cf.addEventListener('pointermove',e=>{tx=e.clientX;ty=e.clientY;
  const c=e.target.closest('.cc'),over=e.target.closest('.cct,.ccb'),act=c&&c.classList.contains('on');
  on=!!c&&!over;cur.firstChild.textContent=c&&!act?'View':'Drag';cur.classList.toggle('show',on);
  $$('.cc',cf).forEach(k=>{if(k!==c)rst(k)});
  if(act){const r=c.getBoundingClientRect(),cl=v=>Math.max(0,Math.min(1,v)),x=cl((e.clientX-r.left)/(r.width||1)),y=cl((e.clientY-r.top)/(r.height||1));
   c.style.setProperty('--mx',x*100+'%');c.style.setProperty('--my',y*100+'%');c.style.setProperty('--ry',(x-.5)*12+'deg');c.style.setProperty('--rx',(.5-y)*10+'deg');c.classList.add('tilt')}
  const b=e.target.closest('.ccb');if(b){const r=b.getBoundingClientRect();b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.12}px,${(e.clientY-r.top-r.height/2)*.25}px)`}});
 cf.addEventListener('pointerout',e=>{const b=e.target.closest('.ccb');if(b)b.style.transform=''});
 cf.addEventListener('pointerleave',()=>{on=false;cur.classList.remove('show');$$('.cc',cf).forEach(rst)});
 addEventListener('scroll',()=>{on=false;cur.classList.remove('show')},{passive:true});
}

/* ---- 08 HERO SLIDESHOW ---- */
const HERO=[];/* optional: HERO[k]='data:image/jpeg;base64,...' replaces slide k's drawing */
const HS=[3,0,5];const HD=HS.map(n=>D[n]);let hi=0,ht;
$('#hs').innerHTML=HS.map((n,k)=>`<div class="hsl ${k?'':'on'}">${scene(D[n][2],n+40+k)}${IMG('hero',k+1,D[n][0])}</div>`).join('');
$('#hd2').innerHTML=HS.map((_,k)=>`<i data-k="${k}" class="${k?'':'on'}"></i>`).join('');
function hshow(k){hi=k;$$('.hsl').forEach((e,j)=>e.classList.toggle('on',j==k));$$('#hd2 i').forEach((e,j)=>e.classList.toggle('on',j==k));const d=HD[k];$('#hcap').textContent=d[0]+', '+d[1]}
function hrun(){clearInterval(ht);if(!matchMedia('(prefers-reduced-motion:reduce)').matches)ht=setInterval(()=>hshow((hi+1)%HS.length),4500)}
$('#hd2').onclick=e=>{const k=e.target.dataset.k;if(k!=null){hshow(+k);hrun()}};
document.addEventListener('visibilitychange',()=>document.hidden?clearInterval(ht):hrun());
hshow(0);hrun();

/* ---- 09 HOW IT WORKS (steps) ---- */
$$('.step').forEach(s=>{s.onmouseenter=s.onclick=()=>$$('.step').forEach(x=>x.classList.toggle('on',x==s))});

/* ---- 10 DARK / LIGHT TOGGLE ---- */
$('#theme').onclick=$('#theme2').onclick=()=>hpSetTheme(document.documentElement.dataset.theme=='dark'?'light':'dark');


/* ---- 11 SEARCH BAR (filters packages) ---- */
$('#sf').onsubmit=e=>{e.preventDefault();F={type:$('#s_t').value,dur:$('#s_d').value,bud:$('#s_b').value,cat:$('#s_c').value};P=+$('#s_p').value;renderRail();
toast(D.filter(ok).length+' package'+(D.filter(ok).length==1?'':'s')+' found');go($('#destinations'))};

/* ---- 12 POPUPS: package details + booking form ---- */
const M=$('#modal'),MB=$('#mb');
const close=()=>M.classList.remove('o');M.onclick=e=>{if(e.target==M)close()};addEventListener('keydown',e=>{if(e.key=='Escape')close()});
$$('[data-book]').forEach(b=>b.onclick=()=>openBook(0));
function openDetail(i){const d=D[i];const tx=[...d[6].split('|'),...d[7].split('|').slice(0,2)];MB.innerHTML=`<div class="sw" id="sw" aria-label="${d[0]} photos">${tx.map((t,k)=>`<div class="sl">${scene(d[2],i+k*5+20)}${IMG('packages/'+slug(d[0]),k+1,t)}<span>${t}</span></div>`).join('')}</div><div class="dots" id="dots">${tx.map((_,k)=>`<i class="${k?'':'on'}"></i>`).join('')}</div><h3 id="mt">${d[0]} · ${d[3]} days</h3><p class="sub">${d[5]}</p><ol class="it">${d[6].split('|').map(x=>`<li>${x}</li>`).join('')}</ol><div class="chips">${d[7].split('|').map(x=>`<span class="chip">${x}</span>`).join('')}</div><p style="margin:18px 0"><b style="font-size:24px">${fmt(d[4])}</b> <small class="sub">${d[8]=='student'?'per student':'per person'}</small></p><div style="display:flex;gap:8px;align-items:center"><button class="btn" id="bk">Book this package</button><button class="chip" id="cx">Close</button></div>`;M.classList.add('o');$('#cx').onclick=close;$('#bk').onclick=()=>openBook(i);
const sw=$('#sw'),dt=$$('#dots i');sw.onscroll=()=>{const k=Math.round(sw.scrollLeft/Math.max(1,sw.scrollWidth-sw.clientWidth)*(dt.length-1));dt.forEach((x,j)=>x.classList.toggle('on',j==k))};
let dn=0,sx=0,sl=0;sw.onmousedown=e=>{dn=1;sx=e.pageX;sl=sw.scrollLeft;sw.style.scrollSnapType='none';sw.style.cursor='grabbing'};
addEventListener('mousemove',e=>{if(dn)sw.scrollLeft=sl-(e.pageX-sx)});
addEventListener('mouseup',()=>{if(!dn)return;dn=0;sw.style.scrollSnapType='';sw.style.cursor=''})}
function openBook(i){const t=new Date().toISOString().slice(0,10);
MB.innerHTML=`<h3 id="mt">Book your tour</h3><p class="sub">No payment now. We confirm hotels and dates by email.</p><form class="f" id="bf" novalidate><select id="bf_k" aria-label="Package">${D.map((d,k)=>`<option value="${k}" ${k==i?'selected':''}>${d[0]} · ${d[3]} days</option>`).join('')}</select>${DW('bf_d','Travel date',t)}<select id="bf_x" aria-label="Travelers">${[1,2,3,4,5,6].map(n=>`<option value="${n}" ${n==P?'selected':''}>${n} traveler${n>1?'s':''}</option>`).join('')}</select><div class="tot" id="tot"></div><input id="bf_n" placeholder="Full name" autocomplete="name"><input id="bf_e" type="email" placeholder="Email" autocomplete="email"><input id="bf_p" type="tel" placeholder="Phone" autocomplete="tel"><div class="err" id="er"></div><button class="btn" type="submit" style="justify-content:center;padding:14px">Confirm booking</button></form><button class="chip" id="cx">Cancel</button>`;
const tot=()=>$('#tot').textContent='Estimated total: '+fmt(D[+$('#bf_k').value][4]*$('#bf_x').value);tot();$('#bf_k').onchange=$('#bf_x').onchange=tot;
M.classList.add('o');$('#cx').onclick=close;initDW();enhance(MB);
$('#bf').onsubmit=e=>{e.preventDefault();const msg={d:'Pick a travel date.',n:'Enter your full name.',e:'Enter a valid email.',p:'Enter a phone number with at least 10 digits.'};let bad=null;
Object.keys(msg).forEach(k=>{const el=$('#bf_'+k),v=el.value.trim();const g=k=='e'?/^\S+@\S+\.\S+$/.test(v):k=='p'?v.replace(/\D/g,'').length>=10:!!v;el.classList.toggle('bad',!g);if(!g&&!bad)bad=k});
if(bad){$('#er').textContent=msg[bad];$('#bf_'+bad).focus();return}
const d=D[+$('#bf_k').value],n=$('#bf_x').value,ref='SW'+Math.random().toString(36).slice(2,7).toUpperCase();
sendEnquiry({svc:'Package',name:$('#bf_n').value.trim(),phone:$('#bf_p').value.trim(),pkg:d[0],pax:+n,date:$('#bf_d').value,amount:d[4]*n,notes:'Email: '+$('#bf_e').value.trim()}).catch(()=>{});
MB.innerHTML=`<h3 id="mt">You're booked! 🌴</h3><p class="sub">We'll email the day-wise itinerary to ${$('#bf_e').value.replace(/</g,'')}.</p><div class="tk">Booking reference<br><b>${ref}</b><br><br>${d[0]} · ${d[3]} days · ${n} traveler${n>1?'s':''}<br>Starting ${new Date($('#bf_d').value).toDateString()}<br>Total ${fmt(d[4]*n)}</div><button class="btn" id="ok" style="width:100%;justify-content:center">Done</button>`;$('#ok').onclick=close}}

/* ---- 13 HEADER SERVICES DROPDOWN ---- */
$('#mns').onclick=()=>{const o=$('#mnsub').classList.toggle('o');$('#mns').setAttribute('aria-expanded',o)};
$('#mnt').onclick=()=>{const o=$('#mntsub').classList.toggle('o');$('#mnt').setAttribute('aria-expanded',o)};
$('#mn').addEventListener('click',e=>{if(e.target.closest('[data-svc]'))$('#mn').classList.remove('o')});
$('.ddm').addEventListener('click',e=>{if(e.target.closest('[data-svc]')&&document.activeElement)document.activeElement.blur()});

/* ---- 14 MOBILE MENU + SMOOTH SCROLL LINKS ---- */
$('#bg').onclick=()=>{const o=$('#mn').classList.toggle('o');$('#bg').setAttribute('aria-expanded',o)};
document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(!a)return;const h=a.getAttribute('href');$('#mn').classList.remove('o');if(h.length>1&&$(h)){e.preventDefault();go($(h))}});

/* ---- 15 CONTACT FORM ---- */
$('#c_k').innerHTML='<option value="">Package: not sure yet</option><option>Visa assistance</option><option>Ticket booking</option>'+D.map(d=>`<option>${d[0]} · ${d[3]} days</option>`).join('');
$('#cf').onsubmit=e=>{e.preventDefault();const n=$('#c_n'),p=$('#c_p');const gn=!!n.value.trim(),gp=p.value.replace(/\D/g,'').length>=10;n.classList.toggle('bad',!gn);p.classList.toggle('bad',!gp);
if(!gn||!gp){$('#c_e').textContent=!gn?'Enter your name.':'Enter a phone number with at least 10 digits.';return}
const t=`Hi Holy Paradise, I'm ${n.value.trim()} (${p.value.trim()}). Package: ${$('#c_k').value||'not sure yet'}. ${$('#c_m').value.trim()}`;
sendEnquiry({svc:'Contact',name:n.value.trim(),phone:p.value.trim(),pkg:($('#c_k').value||'').split(' · ')[0],pax:1,date:'',amount:0,notes:$('#c_m').value.trim()}).catch(()=>{});
$('#cf').innerHTML=`<h3>Thanks, ${n.value.trim().replace(/</g,'')}!</h3><p class="sub">We'll call you on ${p.value.replace(/</g,'')}. For a faster reply, send the same details on WhatsApp.</p><a class="btn" target="_blank" rel="noopener" href="https://wa.me/${WA}?text=${encodeURIComponent(t)}" style="justify-content:center;padding:14px">Continue on WhatsApp</a>`};

/* ---- 16 LIVE DATA FROM FIREBASE (called by the module script in index.html) ---- */
window.applyPackages=l=>{if(!l.length)return;const old=Object.fromEntries(D.map(d=>[d[0],d]));D.length=0;
 l.forEach(p=>{const o=old[p.name];D.push([p.name,p.place||'',p.type||'beach',+p.days||5,+p.price||0,o?o[5]:(p.place||'Tour package'),o?o[6]:'Day-wise plan shared when you enquire|Guided experiences by our team',o?o[7]:'Hotel stay|Breakfast|Local transfers|Support',p.cat||'all'])});
 renderRail();renderSV();renderOF();setTimeout(()=>$('#c_k').dispatchEvent(new Event('change')));$('#c_k').innerHTML='<option value="">Package: not sure yet</option><option>Visa assistance</option><option>Ticket booking</option>'+D.map(d=>`<option>${d[0]} · ${d[3]} days</option>`).join('')};
window.applySettings=st=>{if(st.wa){WA=st.wa;$$('a[href^="https://wa.me/"]').forEach(a=>a.href='https://wa.me/'+st.wa)}
 if(st.phone){$$('a[href^="tel:"]').forEach(a=>{a.href='tel:'+st.phone.replace(/[^\d+]/g,'');a.textContent=st.phone})}
 if(st.offer!=null){$('.off').firstChild.textContent=st.offer+'% OFF';$('#offp').textContent=st.offer+'%'}
 if(st.offerEnd){const t=new Date(st.offerEnd+'T23:59:59');if(!isNaN(t)){end.setTime(t.getTime());tick();$('.off small').textContent='Till '+t.toLocaleDateString('en-IN',{day:'numeric',month:'long'})}}};

/* ---- 17 DATE FIELDS (.dw wrapper, fixes blank date inputs on phones) ---- */
const DW=(id,ph,min)=>`<div class="dw empty"><span class="dph">${ph}</span><svg class="dic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M8 3v4M16 3v4M3.5 10h17"/></svg><input id="${id}" type="date" min="${min}" aria-label="${ph}" data-ph="${ph}"></div>`;
const initDW=()=>$$('.dw input').forEach(i=>{const f=()=>{const p=i.parentNode,v=i.value;p.classList.toggle('empty',!v);p.firstChild.textContent=v?new Date(v+'T00:00').toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short',year:'numeric'}):i.dataset.ph};['input','change','blur'].forEach(ev=>i.addEventListener(ev,f));i.addEventListener('click',()=>{try{i.showPicker&&i.showPicker()}catch(e){}});f()});

/* ---- 18 VISA + TICKET REQUEST POPUPS ---- */
const CTRY=['Dubai (UAE)','Oman','Israel','Jordan','Singapore','Thailand','Malaysia','Indonesia (Bali)','Maldives','Sri Lanka','Japan','Schengen (Europe)','United Kingdom','USA','Canada','Australia','Other'];
const sel=(id,a,l)=>`<select id="${id}" aria-label="${l}">${a.map(x=>`<option>${x}</option>`).join('')}</select>`;
function openService(k){const v=k=='visa',t=new Date().toISOString().slice(0,10);
 MB.innerHTML=`<h3 id="mt">${v?'Visa assistance':'Ticket booking'}</h3><p class="sub">${v?'Tell us where you are going. We check your documents and handle the application.':'Flights, trains and buses. We send you the best options and fares.'}</p><form class="f" id="sv2" novalidate>${v?sel('v_c',CTRY,'Country')+sel('v_t',['Tourist visa','Student visa','Business visa','Transit visa'],'Visa type'):sel('t_m',['Flight','Train','Bus'],'Travel mode')+'<input id="t_f" placeholder="From (city)"><input id="t_t" placeholder="To (city)">'+DW('t_d','Travel date',t)+DW('t_r','Return date (optional)',t)+''}<select id="v_x" aria-label="Travelers">${[1,2,3,4,5,6,7,8].map(n=>`<option value="${n}">${n} ${v?'traveler':'passenger'}${n>1?'s':''}</option>`).join('')}</select><input id="v_n" placeholder="Full name" autocomplete="name"><input id="v_p" type="tel" placeholder="Phone" autocomplete="tel"><textarea id="v_m" rows="2" placeholder="Anything we should know (optional)"></textarea><div class="err" id="er2"></div><button class="btn" type="submit" style="justify-content:center;padding:14px">Send request</button></form><button class="chip" id="cx">Cancel</button>`;
 M.classList.add('o');$('#cx').onclick=close;initDW();enhance(MB);
 $('#sv2').onsubmit=e=>{e.preventDefault();const n=$('#v_n'),p=$('#v_p'),tk=v?[]:[$('#t_f'),$('#t_t'),$('#t_d')],all=[...tk,n,p];
  const bad=all.filter(x=>x==p?p.value.replace(/\D/g,'').length<10:!x.value.trim());all.forEach(x=>x.classList.toggle('bad',bad.includes(x)));
  if(bad.length){const b=bad[0];$('#er2').textContent=b==n?'Enter your name.':b==p?'Enter a phone number with at least 10 digits.':'Fill in from, to and travel date.';b.focus();return}
  const x=+$('#v_x').value,pkg=v?`Visa: ${$('#v_c').value} (${$('#v_t').value})`:`${$('#t_m').value}: ${$('#t_f').value.trim()} to ${$('#t_t').value.trim()}`;
  const notes=((v?'':`Depart ${$('#t_d').value}${$('#t_r').value?', return '+$('#t_r').value:''}. `)+$('#v_m').value.trim()).slice(0,900);
  sendEnquiry({svc:v?'Visa':'Ticket',name:n.value.trim(),phone:p.value.trim(),pkg,pax:x,date:v?'':$('#t_d').value,amount:0,notes}).catch(()=>{});
  const ref='SW'+Math.random().toString(36).slice(2,7).toUpperCase(),tx=`Hi Holy Paradise, I'm ${n.value.trim()} (${p.value.trim()}). ${pkg}, ${x} ${v?'traveler':'passenger'}${x>1?'s':''}. ${notes} Ref ${ref}`;
  MB.innerHTML=`<h3 id="mt">Request received ✓</h3><p class="sub">We'll call you on ${p.value.replace(/</g,'')} with the details.</p><div class="tk">Reference<br><b>${ref}</b><br><br>${pkg.replace(/</g,'')}<br>${x} ${v?'traveler':'passenger'}${x>1?'s':''}</div><a class="btn" target="_blank" rel="noopener" href="https://wa.me/${WA}?text=${encodeURIComponent(tx)}" style="justify-content:center;width:100%;padding:14px">Send on WhatsApp for a faster reply</a><button class="chip" id="ok" style="margin-top:10px">Done</button>`;$('#ok').onclick=close}}
document.addEventListener('click',e=>{const b=e.target.closest('[data-svc]');if(!b)return;const k=b.dataset.svc;
 if(k=='visa'||k=='ticket')openService(k);
 else{F={type:'all',dur:'any',bud:'any',cat:k};['#s_t','#s_d','#s_b'].forEach((q,i)=>$(q).value=['all','any','any'][i]);$('#s_c').value=k;renderRail();go($('#destinations'))}});

/* ---- 19 FAQ (two independent columns) ---- */
const FQ=[...$$('.fq details')];let fqw=null;
function layFQ(){const w=innerWidth>=861;if(fqw===w)return;fqw=w;const c=$('.fq');c.innerHTML='';
 if(w){const a=document.createElement('div'),b=document.createElement('div');a.className=b.className='fqc';FQ.forEach((d,i)=>(i%2?b:a).appendChild(d));c.append(a,b)}else FQ.forEach(d=>c.appendChild(d))}
layFQ();addEventListener('resize',layFQ);

/* ---- 20 OFFER CARDS (Dubai, Oman visa, Bali) ---- */
const OMAN=`<svg viewBox="0 0 300 375" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="gom" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2f7fd8"/><stop offset=".55" stop-color="#f4cf9f"/></linearGradient><linearGradient id="gfr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a87a52"/><stop offset="1" stop-color="#6d4a2f"/></linearGradient></defs><rect width="300" height="375" fill="url(#gom)"/><path d="M45 240 L88 192 L130 228 L180 172 L226 222 L255 198 V310 H45Z" fill="#a3806a" opacity=".9"/><g fill="#d9b88a"><rect x="58" y="236" width="112" height="70"/><rect x="148" y="205" width="34" height="101"/><rect x="182" y="252" width="73" height="54"/></g><g fill="#c49c6a"><rect x="58" y="227" width="12" height="9"/><rect x="82" y="227" width="12" height="9"/><rect x="106" y="227" width="12" height="9"/><rect x="130" y="227" width="12" height="9"/><rect x="148" y="196" width="12" height="9"/><rect x="170" y="196" width="12" height="9"/><rect x="190" y="243" width="12" height="9"/><rect x="216" y="243" width="12" height="9"/></g><rect x="45" y="296" width="210" height="79" fill="#c49c6a"/><path fill-rule="evenodd" fill="url(#gfr)" d="M0 0H300V375H0Z M45 375V160A105 105 0 0 1 255 160V375Z"/><g fill="#5a3b25" opacity=".18"><circle cx="22" cy="60" r="9"/><circle cx="270" cy="90" r="11"/><circle cx="30" cy="250" r="12"/><circle cx="276" cy="300" r="10"/><circle cx="150" cy="30" r="10"/></g></svg>`;
function renderOF(){const pk=n=>D.find(d=>d[0]==n),card=(n,intro,key,sc,ph)=>{const d=pk(n);return `<article class="of"><div class="bg">${scene(sc,ph)}${IMG(key=='dubai'?'offers':'packages/bali',key=='dubai'?'dubai':1,n)}</div><small>${intro}</small><h3>${n}</h3><p>${d?d[5]:''}</p>${d?`<span class="ofp">From ${fmt(d[4])} · ${d[3]} days</span>`:''}<div class="ofa"><button class="ccb" data-offer="${key}">View package</button></div></article>`};
 $('#offs').innerHTML=card('Dubai','Travel to','dubai','city',90)+
 `<article class="of"><div class="bg">${OMAN}${IMG('offers','oman','Oman')}</div><small>Visa assistance</small><h3>Oman</h3><span class="ofp">→ Tourist visa</span><div class="cch ofc"><span>Document check</span><span>Form filling</span><span>Appointment booking</span></div><div class="ofa"><button class="ccb" data-offer="oman">Ask about this visa</button><a class="ofl" href="tel:+916382569647">Call +91 63825 69647</a></div></article>`+
 card('Bali','Escape to','bali','beach',92)}
document.addEventListener('click',e=>{const b=e.target.closest('[data-offer]');if(!b)return;const k=b.dataset.offer;
 if(k=='oman'){openService('visa');$('#v_c').value='Oman'}else{const i=D.findIndex(d=>d[0]==(k=='bali'?'Bali':'Dubai'));if(i>-1)openDetail(i)}});
renderOF();

/* ---- 21 20% OFF BOX (auto-changing posters) ---- */
{const box=$('#pss'),dts=$('#pdt'),N=4;let pi=0,pt;
 const sl=k=>IMG('offers','promo-'+k,'Travel offer '+k);
 box.innerHTML=Array.from({length:N},(_,k)=>`<div class="ps${k?'':' on'}">${sl(k+1).replace('<img ','<img class="fg" style="object-position:'+['50% 16%','50% 50%','50% 40%','50% 45%'][k]+'" ')}</div>`).join('');
 dts.innerHTML=Array.from({length:N},(_,k)=>`<i data-k="${k}" class="${k?'':'on'}"></i>`).join('');
 const show=k=>{pi=k;$$('.ps').forEach((e,j)=>e.classList.toggle('on',j==k));$$('#pdt i').forEach((e,j)=>e.classList.toggle('on',j==k))};
 const run=()=>{clearInterval(pt);if(!matchMedia('(prefers-reduced-motion:reduce)').matches)pt=setInterval(()=>show((pi+1)%N),4500)};
 dts.onclick=e=>{const k=e.target.dataset.k;if(k!=null){show(+k);run()}};
 const ph=box.parentNode;ph.onmouseenter=()=>clearInterval(pt);ph.onmouseleave=run;
 document.addEventListener('visibilitychange',()=>document.hidden?clearInterval(pt):run());run()}

/* ---- 22 CUSTOM DROPDOWNS (enhance() replaces native selects) ---- */
const csP=document.createElement('div');csP.className='csl';csP.setAttribute('role','listbox');document.body.appendChild(csP);let csO=null;
const CHEV='<svg viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1.5 3.5L5 7l3.5-3.5"/></svg>';
function closeCS(){csP.classList.remove('o');if(csO)csO.b.setAttribute('aria-expanded','false');csO=null}
function openCS(sel,b){closeCS();const r=b.getBoundingClientRect(),i0=sel.selectedIndex;
 csP.innerHTML=[...sel.options].map((o,i)=>`<button type="button" role="option" class="cso${i==i0?' on':''}" data-i="${i}" aria-selected="${i==i0}">${o.textContent}</button>`).join('');
 csP.style.minWidth=Math.max(r.width,210)+'px';csP.style.maxHeight='300px';csP.classList.add('o');
 const h=csP.offsetHeight,below=innerHeight-r.bottom,up=below<h+16&&r.top>below;
 csP.style.left=Math.max(8,Math.min(r.left,innerWidth-csP.offsetWidth-8))+'px';csP.style.top=(up?Math.max(8,r.top-h-8):r.bottom+8)+'px';
 b.setAttribute('aria-expanded','true');csO={sel,b};(csP.querySelector('.on')||csP.firstChild).focus({preventScroll:true});}
function enhance(root=document){$$('select',root).forEach(sel=>{if(sel.dataset.cs)return;sel.dataset.cs=1;
 const b=document.createElement('button');b.type='button';b.className='csb';b.setAttribute('aria-haspopup','listbox');b.setAttribute('aria-expanded','false');b.setAttribute('aria-label',sel.getAttribute('aria-label')||'Choose');b.innerHTML='<span class="csv"></span>'+CHEV;
 sel.classList.add('cs-native');sel.tabIndex=-1;sel.setAttribute('aria-hidden','true');sel.after(b);
 const sync=()=>{const o=sel.options[sel.selectedIndex];b.firstChild.textContent=o?o.textContent:''},d=Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,'value');
 Object.defineProperty(sel,'value',{get(){return d.get.call(this)},set(v){d.set.call(this,v);sync()},configurable:true});sel.addEventListener('change',sync);sync();
 b.onclick=e=>{e.preventDefault();e.stopPropagation();csO&&csO.b===b?closeCS():openCS(sel,b)};
 b.onkeydown=e=>{if(e.key=='ArrowDown'||e.key=='ArrowUp'){e.preventDefault();openCS(sel,b)}}})}
csP.addEventListener('click',e=>{const o=e.target.closest('.cso');if(!o||!csO)return;const{sel,b}=csO;sel.selectedIndex=+o.dataset.i;sel.dispatchEvent(new Event('change',{bubbles:true}));closeCS();b.focus()});
csP.addEventListener('keydown',e=>{const k=e.key,os=[...csP.querySelectorAll('.cso')],i=os.indexOf(document.activeElement);
 if(k=='ArrowDown'){e.preventDefault();(os[i+1]||os[0]).focus()}else if(k=='ArrowUp'){e.preventDefault();(os[i-1]||os[os.length-1]).focus()}else if(k=='Home'){e.preventDefault();os[0].focus()}else if(k=='End'){e.preventDefault();os[os.length-1].focus()}else if(k=='Escape'||k=='Tab'){const b=csO&&csO.b;closeCS();b&&b.focus()}});
document.addEventListener('pointerdown',e=>{if(csO&&!e.target.closest('.csl,.csb'))closeCS()});
addEventListener('scroll',e=>{if(csO&&!csP.contains(e.target))closeCS()},true);addEventListener('resize',closeCS);
enhance();

/* ---- 23 NEWSLETTER ---- */
$('#nf').onsubmit=e=>{e.preventDefault();toast('Subscribed. Watch your inbox for tour deals.');$('#ne').value=''};

/* ---- 24 OFFER COUNTDOWN ---- */
const end=new Date();end.setDate(end.getDate()+9);
function tick(){let s=Math.max(0,(end-new Date())/1000|0);const u=[['Days',86400],['Hours',3600],['Mins',60],['Secs',1]];$('#cd').innerHTML=u.map(([n,k])=>{const v=Math.floor(s/k);s-=v*k;return `<div><b>${String(v).padStart(2,'0')}</b><small>${n}</small></div>`}).join('')}tick();setInterval(tick,1000);

/* ---- 25 SCROLL REVEAL (.rv) + STAT COUNTERS ---- */
const io=new IntersectionObserver(es=>es.forEach(en=>{if(!en.isIntersecting)return;en.target.classList.add('vis');
const n=en.target.querySelector('[data-n]');if(n){const T=+n.dataset.n,t0=performance.now();(function f(t){const p=Math.min(1,(t-t0)/1600),e=1-Math.pow(1-p,3);n.textContent=Math.round(T*e).toLocaleString('en-IN')+(p==1&&T>=1000?'+':'');if(p<1)requestAnimationFrame(f)})(t0)}
io.unobserve(en.target)}),{threshold:.15});
$$('.rv,.big').forEach((e,i)=>{e.style.transitionDelay=e.classList.contains('stat')||e.classList.contains('t')?(i%4)*.1+'s':'';io.observe(e)});

/* ---- 26 SCROLL EFFECTS (header, progress bar, parallax) ---- */
const plane=$('#plane'),pimg=$('#pimg'),hd=$('#hd'),bar=$('#bar'),hero=$('#hero');
let tk=false;function upd(){const y=scrollY;bar.style.width=(y/(document.documentElement.scrollHeight-innerHeight)*100)+'%';hd.classList.toggle('s',y>30);
if(y<900){plane.style.transform=`translate(${y*.18}px,${-y*.22}px) rotate(${-y*.012}deg) scale(${1+y*.0004})`}
const r=pimg.getBoundingClientRect();pimg.style.transform=`translateY(${(r.top-innerHeight/2)*-.05}px)`;tk=false}
addEventListener('scroll',()=>{if(!tk){tk=true;requestAnimationFrame(upd)}},{passive:true});upd();

/* ---- SOCIAL LINKS + WHATSAPP BUTTON (uses SITE settings at the top) ---- */
$$('.sl-ig').forEach(e=>{if(SITE.instagram)e.href=SITE.instagram;else{e.href='#';e.classList.add('soon');e.title='Link coming soon';e.addEventListener('click',ev=>ev.preventDefault())}});
$$('.sl-fb').forEach(e=>{if(SITE.facebook)e.href=SITE.facebook;else{e.href='#';e.classList.add('soon');e.title='Link coming soon';e.addEventListener('click',ev=>ev.preventDefault())}});
$$('a[href^="https://wa.me/"]').forEach(e=>{if(!/wa\.me\/\d/.test(e.href))e.href='https://wa.me/'+WA});
