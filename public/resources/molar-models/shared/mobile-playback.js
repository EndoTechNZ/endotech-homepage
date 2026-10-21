// A mobile transport shares the desktop viewer's preparation state and actions.
// Keep it with the canvas so choosing a canal never scrolls the lesson away.
export function createMobilePlayback({stage,onPlay,onSeek,onFile}){
 const panel=document.createElement('div');panel.id='viewer-panel';
 stage.before(panel);panel.append(stage);
 const transport=document.createElement('div');transport.id='mobile-playback';
 transport.setAttribute('role','region');transport.setAttribute('aria-label','Preparation playback');
 transport.innerHTML='<div class="mobile-transport-row"><button id="mobile-play" type="button" disabled>Play</button><div><strong id="mobile-file-name">Opening model…</strong><span id="mobile-canal-name"></span></div></div><label class="mobile-progress-label" for="mobile-timeline">Preparation sequence <span id="mobile-clock"></span></label><input id="mobile-timeline" aria-label="Preparation sequence" type="range" min="0" max="80" value="0" step="0.05" disabled><nav id="mobile-file-sequence" aria-label="Choose file stage"></nav><p id="mobile-load-status" role="status" aria-live="polite" hidden></p>';
 panel.append(transport);
 const $=s=>transport.querySelector(s),play=$('#mobile-play'),timeline=$('#mobile-timeline'),sequence=$('#mobile-file-sequence');
 function reveal(){
  if(!matchMedia('(max-width:950px)').matches)return;
  const r=panel.getBoundingClientRect();
  if(r.top<0||r.bottom>innerHeight-4)panel.scrollIntoView({block:'start',behavior:'instant'});
 }
 play.onclick=()=>{reveal();onPlay();};timeline.oninput=()=>{reveal();onSeek(Number(timeline.value));};
 return {
  loading(message,playRequested){
   const el=$('#mobile-load-status');el.hidden=!message;el.textContent=message;
   play.textContent=playRequested?'Pause':'Play';
  },
  error(retry){
   const el=$('#mobile-load-status');el.hidden=false;el.textContent='The next part could not load. ';
   const button=document.createElement('button');button.type='button';button.textContent='Retry';button.onclick=retry;
   el.append(button);reveal();
  },
  update(c,st,files,playRequested){
   play.disabled=false;timeline.disabled=false;play.textContent=playRequested?'Pause':'Play';
   $('#mobile-file-name').textContent=st.j===0?'MicroPath 17/.03':'ET '+c.sequence[st.j]+'/.04';
   $('#mobile-canal-name').textContent=c.label;
   $('#mobile-clock').textContent=c.time.toFixed(1)+' / '+c.duration_seconds+' s';
   timeline.max=c.duration_seconds;timeline.value=c.time;
   const key=c.id+':'+c.sequence.join(',');
   if(sequence.dataset.sequence!==key){
    const changed=Boolean(sequence.dataset.sequence);sequence.dataset.sequence=key;sequence.replaceChildren();
    c.sequence.forEach((size,j)=>{
     const b=document.createElement('button');b.type='button';b.dataset.file=j;
     b.style.setProperty('--file-colour','#'+files[size].color.toString(16).padStart(6,'0'));
     b.innerHTML='<i aria-hidden="true"></i><span>'+size+'</span>';
     b.setAttribute('aria-label',(j===0?'MicroPath ':'ET ')+size+(j===0?'/.03':'/.04'));
     b.onclick=()=>{reveal();onFile(j);};sequence.append(b);
    });
    if(changed)reveal();
   }
   [...sequence.children].forEach((b,j)=>{
    const active=j===st.j,done=j<st.j||c.time>=c.duration_seconds-.01;
    b.classList.toggle('active',active);b.classList.toggle('done',done);
    b.setAttribute('aria-current',active?'step':'false');
    b.title=(active?(done?'Complete':'Using now'):done?'Completed':'Next');
   });
  }
 };
}
