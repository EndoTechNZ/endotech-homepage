document.addEventListener('click',e=>{document.querySelectorAll('.clean-explore[open]').forEach(d=>{if(!d.contains(e.target))d.open=false})});
document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('.clean-explore[open]').forEach(d=>{d.open=false;d.querySelector('summary').focus()})});
