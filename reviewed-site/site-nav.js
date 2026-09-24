document.addEventListener('click',e=>{document.querySelectorAll('.clean-explore[open]').forEach(d=>{if(!d.contains(e.target))d.open=false})});
document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('.clean-explore[open]').forEach(d=>{d.open=false;d.querySelector('summary').focus()})});

// Shared local-preview product navigation.
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
