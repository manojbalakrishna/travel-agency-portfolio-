/* =====================================================================
   HOLY PARADISE - site.js  (shared by index.html and every other page)
   1) YOUR BUSINESS SETTINGS: edit the values below
   2) sendEnquiry(): email + Firebase
   3) header menu / WhatsApp / social links for the extra pages
   ===================================================================== */
/* ---- 1 YOUR BUSINESS SETTINGS - edit these first ---- */
const SITE={
  whatsapp:'916382569647',            /* WhatsApp number: country code + number, no + or spaces */
  emailKey:'',                        /* free key from web3forms.com (sent to the owner email you register). Empty = email off */
  instagram:'',                       /* e.g. https://instagram.com/yourpage  (empty = icon shows but does nothing yet) */
  facebook:'',                        /* e.g. https://facebook.com/yourpage   (empty = icon shows but does nothing yet) */
  analyticsId:''                      /* Google Analytics ID like G-XXXXXXXXXX (empty = off) */
};
/* sends every enquiry to the owner email (Web3Forms) AND saves it in Firebase when set up */
function sendEnquiry(d){
  const jobs=[];
  if(window.saveEnquiry)jobs.push(Promise.resolve(saveEnquiry(d)).catch(()=>{}));
  if(SITE.emailKey)jobs.push(fetch('https://api.web3forms.com/submit',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({access_key:SITE.emailKey,subject:'New enquiry: '+d.svc+' - '+d.name,from_name:'Holy Paradise website',Service:d.svc,Name:d.name,Phone:d.phone,Package:d.pkg||'-',Travelers:d.pax||'-',Date:d.date||'-',Notes:d.notes||'-'})}).catch(()=>{}));
  return Promise.all(jobs);
}
if(SITE.analyticsId){const s=document.createElement('script');s.async=1;s.src='https://www.googletagmanager.com/gtag/js?id='+SITE.analyticsId;document.head.appendChild(s);window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config',SITE.analyticsId)}

/* ---- 2 THEME: light by default; the page you are on decides the next page ---- */
window.hpSetTheme=function(t){
  t=t==='dark'?'dark':'light';
  document.documentElement.dataset.theme=t;
  try{localStorage.setItem('hp-theme',t)}catch(e){}
  try{window.name=(window.name||'').replace(/hp-theme=\w+;?/g,'')+'hp-theme='+t+';'}catch(e){}
};
hpSetTheme(document.documentElement.dataset.theme);            /* remember what this page shows */
try{if(/[?&]theme=/.test(location.search))history.replaceState(null,'',location.pathname+location.hash)}catch(e){}   /* keep the address bar clean */
/* when a link to another page is used, pass the current theme along (works even if browser storage is blocked) */
['click','auxclick'].forEach(function(ev){document.addEventListener(ev,function(e){
  var a=e.target.closest&&e.target.closest('a[href]');if(!a)return;
  var h=a.getAttribute('href');
  if(!h||h.charAt(0)==='#'||/^(https?:|mailto:|tel:|javascript:)/i.test(h)||!/\.html?(\?|#|$)/i.test(h))return;
  var hs=h.split('#'),pq=hs[0].split('?'),p=new URLSearchParams(pq[1]||'');
  p.set('theme',document.documentElement.dataset.theme==='dark'?'dark':'light');
  a.setAttribute('href',pq[0]+'?'+p.toString()+(hs[1]!==undefined?'#'+hs[1]:''));
},true)});

/* ---- 3 SHARED PAGE BEHAVIOUR (extra pages only; index.html uses app.js) ---- */
(function(){
  const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
  const WA=SITE.whatsapp;
  window.waLink=t=>'https://wa.me/'+WA+(t?'?text='+encodeURIComponent(t):'');
  if(!document.body.hasAttribute('data-sub'))return;
  document.addEventListener('DOMContentLoaded',()=>{
    const hd=$('#hd');hd&&hd.classList.add('s');
    const bg=$('#bg'),mn=$('#mn');
    if(bg)bg.onclick=()=>{const o=mn.classList.toggle('o');bg.setAttribute('aria-expanded',o)};
    const th=()=>hpSetTheme(document.documentElement.dataset.theme=='dark'?'light':'dark');
    $$('#theme,#theme2').forEach(b=>b.onclick=th);
    $$('.sl-ig').forEach(e=>{if(SITE.instagram)e.href=SITE.instagram;else{e.href='#';e.classList.add('soon');e.title='Link coming soon';e.addEventListener('click',ev=>ev.preventDefault())}});
    $$('.sl-fb').forEach(e=>{if(SITE.facebook)e.href=SITE.facebook;else{e.href='#';e.classList.add('soon');e.title='Link coming soon';e.addEventListener('click',ev=>ev.preventDefault())}});
    $$('[data-wa]').forEach(e=>e.href=waLink(e.dataset.wa));
    $$('.mns[data-mnt]').forEach(b=>b.onclick=()=>{const o=b.nextElementSibling.classList.toggle('o');b.setAttribute('aria-expanded',o)});
    $$('[data-scroll]').forEach(e=>e.onclick=ev=>{ev.preventDefault();if(mn){mn.classList.remove('o');bg&&bg.setAttribute('aria-expanded',false)}const t=$(e.dataset.scroll);t&&t.scrollIntoView({behavior:'smooth',block:'start'})});
    const f=$('#enq');
    if(f)f.onsubmit=ev=>{
      ev.preventDefault();
      const n=$('#q_n'),p=$('#q_p'),er=$('#q_e');
      const okN=!!n.value.trim(),okP=p.value.replace(/\D/g,'').length>=10;
      n.classList.toggle('bad',!okN);p.classList.toggle('bad',!okP);
      if(!okN||!okP){er.textContent=!okN?'Enter your name.':'Enter a phone number with at least 10 digits.';return}
      const svc=f.dataset.svc,trip=$('#q_t').value,msg=$('#q_m').value.trim().slice(0,800),pax=+($('#q_x').value||1),when=$('#q_d').value.trim();
      const notes=((when?'Travel: '+when+'. ':'')+($('#q_em').value.trim()?'Email: '+$('#q_em').value.trim()+'. ':'')+msg).slice(0,900);
      sendEnquiry({svc,name:n.value.trim(),phone:p.value.trim(),pkg:trip,pax,date:'',amount:0,notes});
      const t='Hi Holy Paradise, I am '+n.value.trim()+' ('+p.value.trim()+'). Enquiry: '+svc+' - '+trip+'. '+(when?'Travel: '+when+'. ':'')+msg;
      f.innerHTML='<h3>Thank you, '+n.value.trim().replace(/</g,'')+'!</h3><p class="sub">We will call you on '+p.value.replace(/</g,'')+'. For a faster reply, send the same details on WhatsApp.</p><a class="btn" target="_blank" rel="noopener" href="'+waLink(t)+'" style="justify-content:center;padding:14px">Continue on WhatsApp</a>';
    };
  });
})();

/* ---- MOTION (framer-style scroll reveals, hero parallax, auto-swipe timeline) ---- */
(function(){
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!document.body.hasAttribute('data-sub'))return; /* motion is for the inner pages only; the home page has its own */
  var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
  /* 1. reveal on scroll, staggered inside each group */
  if(!reduce&&'IntersectionObserver' in window){
    document.documentElement.classList.add('hp-anim');
    var groups=['.grid3','.days','.gal','.chips','.fq','.enq','.head','.lux>div','.life','.life-grid','.note'];
    var seen=[];
    var extra=['main .pgsec>.head .pill','main .enq .sub','main .tick li','main .cf>*','main .pgsec>.sub','footer .wrap>*','main .life figcaption'];
    groups.forEach(function(g){$$('main '+g).forEach(function(box){
      var kids=(g==='.grid3'||g==='.days'||g==='.gal'||g==='.chips'||g==='.fq'||g==='.life-grid')?Array.prototype.slice.call(box.children):(g==='.enq'?Array.prototype.slice.call(box.children):[box]);
      kids.forEach(function(k,i){
        if(k.classList.contains('rv')||k.closest('.pghero'))return;
        k.classList.add('rv');
        if(g==='.enq')k.classList.add(i===0?'rv-l':'rv-r');
        k.style.setProperty('--d',Math.min(i,8)*90+'ms');seen.push(k);
      });
    })});
    extra.forEach(function(g){$$(g).forEach(function(k,i){
      if(k.classList.contains('rv')||k.closest('.pghero'))return;
      var nested=(g==='main .tick li'||g==='main .cf>*');
      if(!nested&&k.parentNode.closest('.rv'))return;
      if(g==='footer .wrap>*'&&!k.children.length&&!k.textContent.trim())return;
      k.classList.add('rv');k.style.setProperty('--d',(i%7)*70+'ms');seen.push(k);
    })});
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('rv-on');io.unobserve(e.target)}})},{threshold:.12,rootMargin:'0px 0px -6% 0px'});
    seen.forEach(function(k){io.observe(k)});
    /* safety: never leave anything hidden */
    setTimeout(function(){seen.forEach(function(k){var r=k.getBoundingClientRect();if(r.top<innerHeight&&r.bottom>0)k.classList.add('rv-on')})},1800);
    function bottom(){if(innerHeight+scrollY>=document.documentElement.scrollHeight-6)seen.forEach(function(k){if(k.closest('footer'))k.classList.add('rv-on')})}
    addEventListener('scroll',bottom,{passive:true});
    window.addEventListener('beforeprint',function(){seen.forEach(function(k){k.classList.add('rv-on')})});
  }
  /* 3. Jesus timeline: auto-swipe (ping-pong), pauses on touch, resumes after a moment */
  var sc=document.querySelector('.life-scroll');
  if(sc&&!reduce){
    var fig=sc.parentNode,dots=document.createElement('div');dots.className='life-dots';
    for(var i=0;i<8;i++)dots.appendChild(document.createElement('i'));
    fig.insertBefore(dots,fig.querySelector('figcaption'));
    var dd=$$('i',dots);
    var pos=0,dir=1,paused=false,vis=false,hold=0,last=0,idle;
    var maxS=function(){return sc.scrollWidth-sc.clientWidth};
    function mark(){var m=maxS();if(m<=0)return;var k=Math.min(7,Math.round(sc.scrollLeft/m*7));dd.forEach(function(d,j){d.classList.toggle('on',j===k)})}
    new IntersectionObserver(function(e){vis=e[0].isIntersecting;if(vis){pos=sc.scrollLeft;if(!running){running=true;requestAnimationFrame(function(t){last=t;tick(t)})}}},{threshold:.3}).observe(sc);
    function pause(ms){paused=true;clearTimeout(idle);idle=setTimeout(function(){pos=sc.scrollLeft;paused=false},ms||3500)}
    ['touchstart','pointerdown','wheel','mousedown'].forEach(function(ev){sc.addEventListener(ev,function(){pause(4000)},{passive:true})});
    sc.addEventListener('scroll',function(){if(paused)pos=sc.scrollLeft;mark()},{passive:true});
    sc.addEventListener('mouseenter',function(){pause(1500)});
    function tick(t){
      var dt=Math.min(t-last,50);last=t;
      if(vis&&!paused&&maxS()>4){
        if(hold>0){hold-=dt}
        else{
          pos+=dir*dt*.045; /* about 45px per second */
          var m=maxS();
          if(pos>=m){pos=m;dir=-1;hold=1600}else if(pos<=0){pos=0;dir=1;hold=1600}
          sc.scrollLeft=pos;
        }
      }
      if(vis)requestAnimationFrame(tick);else running=false;
    }
    var running=true;
    mark();requestAnimationFrame(function(t){last=t;tick(t)});
  }
})();

/* ---- MOTION 2: hero orbs, 3D tilt + glare on cards, magnetic buttons (mouse only) ---- */
(function(){
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!document.body.hasAttribute('data-sub'))return; /* motion is for the inner pages only; the home page has its own */
  if(reduce)return;
  var hero=document.querySelector('.pghero');
  if(hero){['a','b'].forEach(function(c){var o=document.createElement('span');o.className='orb '+c;hero.insertBefore(o,hero.firstChild)})}
})();

/* ---- SOLO CARD SLIDESHOW: a lone package card gets a crossfading photo panel beside it ---- */
(function(){
  if(!document.body.hasAttribute('data-sub'))return;
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  Array.prototype.forEach.call(document.querySelectorAll('main .grid3'),function(g){
    var card=g.children.length===1&&g.children[0].classList.contains('ph')?g.children[0]:null;
    if(!card)return;
    var srcs=[];
    Array.prototype.forEach.call(document.querySelectorAll('main .gal img'),function(i){var u=i.getAttribute('src');if(u&&srcs.indexOf(u)<0)srcs.push(u)});
    var bg=card.querySelector('.pimg');var m=bg&&/url\(["']?([^"')]+)/.exec(bg.getAttribute('style')||'');
    if(m&&srcs.indexOf(m[1])<0)srcs.unshift(m[1]);
    srcs=srcs.slice(0,6);if(srcs.length<2)return;
    g.classList.add('solo');
    var fig=document.createElement('figure');fig.className='solo-side';fig.style.margin='0';
    srcs.forEach(function(u,i){var im=document.createElement('img');im.src=u;im.alt='';im.loading='lazy';if(i===0)im.className='on';fig.appendChild(im)});
    var cap=document.createElement('figcaption');cap.textContent='Moments from the journey';fig.appendChild(cap);
    var dots=document.createElement('div');dots.className='sd';srcs.forEach(function(u,i){var d=document.createElement('i');if(i===0)d.className='on';dots.appendChild(d)});fig.appendChild(dots);
    g.appendChild(fig);
    if(reduce)return;
    var imgs=fig.querySelectorAll('img'),ds=dots.children,k=0,vis=false,t;
    new IntersectionObserver(function(e){vis=e[0].isIntersecting}).observe(fig);
    t=setInterval(function(){if(!vis||document.hidden)return;imgs[k].classList.remove('on');ds[k].classList.remove('on');k=(k+1)%imgs.length;imgs[k].classList.add('on');ds[k].classList.add('on')},3800);
  });
})();

/* ---- FOOTER drop-downs (phones/tablets; always open on desktop via CSS) ---- */
(function(){
  Array.prototype.forEach.call(document.querySelectorAll('.ftdd .fth'),function(b){
    b.addEventListener('click',function(){
      if(window.innerWidth>900)return;
      var c=b.parentNode,o=!c.classList.contains('o');
      c.classList.toggle('o',o);b.setAttribute('aria-expanded',o);
    });
  });
})();
