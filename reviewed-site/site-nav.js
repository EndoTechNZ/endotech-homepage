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
window.addEventListener('load',()=>{
  if(location.pathname==='/quote-request/'&&new URLSearchParams(location.search).get('family')==='c-plus'){
    document.querySelector('[data-family-tab="c-plus"]')?.click();
  }
});
