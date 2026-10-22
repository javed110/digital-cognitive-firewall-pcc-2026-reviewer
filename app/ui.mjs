import {analyze} from './analyzer.mjs';
import {samples} from './samples.mjs';
const el=id=>document.getElementById(id);
let last=null;
function reset(){last=null;el('results').hidden=true;el('checklist').hidden=true;el('category').textContent='Your review appears here';el('explanation').textContent='Visible cues help you ask better questions. They cannot establish whether a message is authentic.';el('error').textContent='';}
function list(id,items){el(id).replaceChildren(...items.map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));}
for(const id of ['message','sender','domain'])el(id).addEventListener('input',reset);
el('sample').addEventListener('change',()=>{reset();const s=samples[el('sample').value];if(s){el('message').value=s.message;el('sender').value=s.sender;el('domain').value=s.expectedDomain;}});
el('clear').addEventListener('click',()=>{for(const id of ['message','sender','domain','sample'])el(id).value='';reset();el('message').focus();});
el('review').addEventListener('click',()=>{reset();try{last=analyze({message:el('message').value,sender:el('sender').value,expectedDomain:el('domain').value});el('category').textContent=last.category;el('explanation').textContent=last.explanation;list('cues',last.cues.length?last.cues.map(c=>c.label+': “'+c.excerpt+'”'):['No listed language cues found.']);list('technical',last.technical.length?last.technical.map(c=>c.detail):['No listed technical observations. This is not a safety verdict.']);list('checklist',last.nextSteps);el('results').hidden=false;}catch(e){el('error').textContent=e.message;}});
el('pause').addEventListener('click',()=>{el('checklist').hidden=!el('checklist').hidden;});
el('download').addEventListener('click',()=>{if(!last)return;const blob=new Blob([JSON.stringify(last,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='cognitive-firewall-review.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);});
