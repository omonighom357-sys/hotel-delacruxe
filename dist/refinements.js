(()=>{
const closeMenu=()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open menu');menu.textContent='☰'};
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){closeMenu();menu.focus()}});document.addEventListener('click',e=>{if(!header.contains(e.target))closeMenu()});
// Keep both booking forms in sync without saving guest details on the device.
const ids=['guest-name','arrival','room-count','checkin','checkout','guests','preference','requests'];
function sync(from,to){ids.forEach(id=>{const a=from.querySelector('[id$="'+id+'"]'),b=to.querySelector('[id$="'+id+'"]');if(a&&b){b.value=a.value;b.min=a.min||'';b.setCustomValidity('')}})}
sourceForm.addEventListener('input',()=>sync(sourceForm,overlayForm));overlayForm.addEventListener('input',()=>sync(overlayForm,sourceForm));reservation.addEventListener('close',()=>{sync(overlayForm,sourceForm);updateSummary()});
[sourceForm,overlayForm].forEach(form=>{const name=form.querySelector('[autocomplete="name"]');name.addEventListener('input',()=>name.setCustomValidity(name.value.trim()?'':'Please enter your name.'));form.addEventListener('submit',()=>{name.setCustomValidity(name.value.trim()?'':'Please enter your name.')});});
const startTomorrow=new Date();startTomorrow.setDate(startTomorrow.getDate()+1);checkout.min=dateString(startTomorrow);field('checkout').min=checkout.min;
// Restore background scrolling after every modal, including Escape dismissal.
for(const d of document.querySelectorAll('dialog')){d.addEventListener('close',()=>{document.body.style.overflow=document.querySelector('dialog[open]')?'hidden':''})}
const guide=document.querySelector('#concierge');document.querySelector('.concierge-launch').addEventListener('click',()=>document.body.style.overflow='hidden');
// Give guests a nearby route to the guide without an overlapping mobile bubble.
const guideLink=document.createElement('button');guideLink.className='text-link guide-inline';guideLink.textContent='Questions? Ask the stay guide ↗';guideLink.addEventListener('click',()=>{guide.showModal();document.body.style.overflow='hidden'});document.querySelector('.visit-details:last-child').append(guideLink);
})();
