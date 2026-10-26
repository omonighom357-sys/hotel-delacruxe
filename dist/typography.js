/* One finite typography controller. No dependency, persistent hidden state, or
   scroll handler. Existing section geometry and semantic text remain intact. */
(()=>{
  'use strict';
  window.DelaCruxeTypography?.destroy();
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  const mobile=matchMedia('(max-width:700px)');
  const easing='cubic-bezier(.16,1,.3,1)';
  const records=new Map(), running=new Map(), timers=new Map(), observers=new Map(), cleanups=[];
  let destroyed=false, heroStarted=false;
  const disabled=()=>destroyed||reduce.matches||document.body.classList.contains('motion-paused');
  const q=s=>document.querySelector(s);
  function listen(target,type,fn){target.addEventListener(type,fn);cleanups.push(()=>target.removeEventListener(type,fn))}
  function settle(el){clearTimeout(timers.get(el));timers.delete(el);const a=running.get(el);if(a){running.delete(el);a.cancel()}el.classList.remove('is-sweeping')}
  function animate(el,kind,options={}){
    if(!el)return;
    settle(el);
    if(disabled()||!el.animate)return;
    let frames,duration;
    if(kind==='rise'){
      frames=[{opacity:0,transform:'translateY(44px)'},{opacity:1,transform:'translateY(0)'}];duration=1080;
    }else if(kind==='bloom'){
      frames=[{opacity:0,filter:`blur(${mobile.matches?3:6}px)`,transform:`translateY(${mobile.matches?12:18}px)`},{opacity:1,filter:'blur(0px)',transform:'translateY(0)'}];duration=920;
    }else if(kind==='curtain'){
      // Negative block inset leaves room for italic overhangs and descenders.
      frames=[{clipPath:'inset(-.2em 100% -.2em -.12em)',opacity:.15},{clipPath:'inset(-.2em -.12em -.2em -.12em)',opacity:1}];duration=1120;
    }else if(kind==='gold'){
      if(!CSS.supports('background-clip','text')&&!CSS.supports('-webkit-background-clip','text'))return;
      el.classList.add('is-sweeping');
      frames=[{backgroundPosition:'100% 0'},{backgroundPosition:'0% 0'}];duration=2100;
    }else{
      frames=[{opacity:.2,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}];duration=650;
    }
    const animation=el.animate(frames,{duration:options.duration??duration,delay:options.delay??0,easing:options.easing??easing,fill:'backwards'});
    running.set(el,animation);
    const complete=()=>{if(running.get(el)===animation)settle(el)};
    // A throttled/off-screen animation timeline must never leave text hidden.
    timers.set(el,setTimeout(complete,(options.duration??duration)+(options.delay??0)+150));
    animation.finished.then(complete,complete);
  }
  function register(selector,kind,options={}){
    document.querySelectorAll(selector).forEach((el,index)=>{
      if(records.has(el))return;
      const r={kind,options:{...options,delay:(options.delay||0)+index*(options.stagger||0)},seen:false};records.set(el,r);
      if(kind==='gold')el.classList.add('typography-gold');
      const threshold=options.threshold??.2;
      if(!('IntersectionObserver' in window)||disabled()){r.seen=true;return}
      if(!observers.has(threshold))observers.set(threshold,new IntersectionObserver(entries=>entries.forEach(e=>{
        const item=records.get(e.target);if(!item)return;
        if(e.isIntersecting&&!item.seen){item.seen=true;animate(e.target,item.kind,item.options);if(!item.options.replay)observers.get(threshold).unobserve(e.target)}
        else if(!e.isIntersecting&&item.options.replay)item.seen=false;
      }),{threshold,rootMargin:'0px 0px -4% 0px'}));
      observers.get(threshold).observe(el);
    });
  }
  // These wrappers previously moved the same text a second time. Image/card
  // reveal wrappers keep their existing behavior.
  const parents=['.intro-content','.rooms .section-heading','.experience-copy','.gallery .section-heading','.booking>div'];
  parents.forEach(s=>q(s)?.classList.add('typography-parent'));
  register('.intro-content h2','bloom');
  register('.intro-content>div>p','bloom',{delay:120});
  register('.stay-designer>h2,.fresh h2,.visit h2','bloom');
  register('.experience-copy>p:not(.eyebrow)','bloom',{delay:180});
  register('.slow-copy h2','curtain');
  register('.slow-copy>p','bloom',{delay:180});
  register('.rooms .section-heading h2,.experience-copy h2,.gallery h2,.booking h2','curtain');
  register('.experience-copy h2 em,.slow-copy h2 em','gold',{delay:1050,threshold:.4});
  function hero(){
    if(heroStarted||q('.arrival:not(.departing)'))return;
    heroStarted=true;
    animate(q('.hero-copy>.eyebrow'),'fade',{duration:650});
    document.querySelectorAll('.title-mask>span').forEach((el,i)=>animate(el,'rise',{delay:100+i*170}));
    animate(q('.hero-copy>p:not(.eyebrow)'),'bloom',{delay:340,duration:900});
    // Controls stay clickable throughout; no pointer-events or focus changes.
    animate(q('.hero-copy>.button'),'fade',{delay:440,duration:600});
    arrivalObserver.disconnect();
  }
  const arrivalObserver=new MutationObserver(hero);
  const arrival=q('.arrival');
  if(arrival)arrivalObserver.observe(arrival,{attributes:true,attributeFilter:['class']});
  hero();
  listen(document,'delacruxe:scene',()=>{animate(q('#scene-title'),'bloom',{duration:900});animate(q('#scene-copy'),'fade',{delay:100})});
  listen(document,'delacruxe:stay',()=>{animate(q('#stay-headline'),'bloom');animate(q('#stay-description'),'fade',{delay:110})});
  function stop(){if(!disabled())return;for(const el of [...running.keys()])settle(el);observers.forEach(o=>o.disconnect());records.forEach(r=>r.seen=true)}
  const preferenceObserver=new MutationObserver(stop);preferenceObserver.observe(document.body,{attributes:true,attributeFilter:['class']});
  listen(reduce,'change',stop);
  listen(window,'resize',()=>{for(const el of [...running.keys()])settle(el)});
  listen(document,'visibilitychange',()=>{if(document.hidden)for(const el of [...running.keys()])settle(el)});
  function destroy(){if(destroyed)return;destroyed=true;arrivalObserver.disconnect();preferenceObserver.disconnect();observers.forEach(o=>o.disconnect());for(const el of [...running.keys()])settle(el);cleanups.splice(0).forEach(fn=>fn());records.clear()}
  listen(window,'pagehide',event=>{if(!event.persisted)destroy();else for(const el of [...running.keys()])settle(el)});
  window.DelaCruxeTypography={register,animate,destroy};
})();
