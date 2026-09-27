document.addEventListener('click',e=>{document.querySelectorAll('.clean-explore[open]').forEach(d=>{if(!d.contains(e.target))d.open=false})});
document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('.clean-explore[open]').forEach(d=>{d.open=false;d.querySelector('summary').focus()})});

// Shared local-preview product navigation.
// Shared contact-link treatment; destinations and link semantics stay unchanged.
function connectContactLinks(){
  const links=[...document.querySelectorAll('a[href]')].filter(link=>{
    const url=new URL(link.getAttribute('href'),location.href);
    return (url.pathname.replace(/\/$/,'')==='/about/contact') ||
      (url.protocol==='mailto:' && url.pathname.toLowerCase()==='steveshepherdnz@gmail.com') ||
      (url.hostname==='mail.google.com' && url.searchParams.get('to')?.toLowerCase()==='steveshepherdnz@gmail.com');
  });
  if(!links.length)return;
  const style=document.createElement('link');style.rel='stylesheet';style.href='/contact-links.css?v=20260928a';document.head.append(style);
  links.forEach(link=>{
    if(link.classList.contains('contact-ink-link'))return;
    const label=document.createElement('span');label.className='contact-ink-label';
    label.textContent=link.textContent.replace(/[↗→↘]\s*$/u,'').trim();
    const arrow=document.createElement('span');arrow.className='contact-ink-arrow';arrow.setAttribute('aria-hidden','true');arrow.textContent='→';
    link.classList.remove('cp-contact-signature');
    link.classList.add('contact-ink-link');link.replaceChildren(label,arrow);
  });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',connectContactLinks);else connectContactLinks();

function connectCPlusNavigation(){
  document.querySelectorAll('.clean-dropdown').forEach(menu=>{
    if(!menu.querySelector('a[href="/products/c-plus/"]')){
      const link=document.createElement('a');link.href='/products/c-plus/';link.textContent='Transform S C+';
      menu.insertBefore(link,menu.querySelector('hr'));
    }
  });
  document.querySelectorAll('.clean-footer nav').forEach(menu=>{
    if(!menu.querySelector('a[href="/products/c-plus/"]')){
      const link=document.createElement('a');link.href='/products/c-plus/';link.textContent='C+ hand files';menu.append(link);
    }
  });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',connectCPlusNavigation);else connectCPlusNavigation();
function connectComparisonSwipe(){
  if(!/^\/products\/(transform-s-et|transform-s-pt|transform-s-rg|micro-path)\/$/.test(location.pathname))return;
  const stylesheet=document.createElement('link');
  stylesheet.rel='stylesheet';stylesheet.href='/comparison-swipe.css';
  document.head.append(stylesheet);
  let comparison=document.querySelector('.et-hero-comparison, .pt-hero-comparison, .rg-hero-comparison');
  if(!comparison){
    const hero=document.querySelector('.microPath-hero');
    if(!hero)return;
    comparison=document.createElement('p');
    comparison.className='microPath-hero-comparison';
    comparison.textContent='Compare with other glide path files';
    hero.append(comparison);
  }
  const text=document.createElement('span');
  text.className='comparison-swipe-text';
  text.textContent=comparison.textContent;
  comparison.replaceChildren(text);
  // Play once when the label first becomes visible, including on small screens.
  const observer=new IntersectionObserver(entries=>{
    if(entries.some(entry=>entry.isIntersecting)){
      text.classList.add('is-arriving');observer.disconnect();
    }
  },{threshold:.5});
  stylesheet.addEventListener('load',()=>observer.observe(text),{once:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',connectComparisonSwipe);else connectComparisonSwipe();
window.addEventListener('load',()=>{
  if(location.pathname==='/quote-request/'&&new URLSearchParams(location.search).get('family')==='c-plus'){
    document.querySelector('[data-family-tab="c-plus"]')?.click();
  }
});
