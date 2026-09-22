import {DEFINITIONS} from './scoring.js';
import {makeQuestion,FAMILIES,IQ_VERSION} from './iq.js';
const plain=(v)=>v!==null&&typeof v==='object'&&!Array.isArray(v);
const date=(v)=>typeof v==='string'&&Number.isFinite(Date.parse(v));
// Rebuild imported reasoning questions from trusted generators, never imported HTML.
export function validateBackup(data,idFactory=()=>crypto.randomUUID()) {
  if(!plain(data)||data.format!=='four-big-tests-backup'||data.schema!==1||!Array.isArray(data.attempts))throw new Error('This is not a supported Four Big Tests backup.');
  return data.attempts.map(raw=>{
    if(!plain(raw)||!Object.hasOwn(DEFINITIONS,raw.type)||typeof raw.name!=='string'||!date(raw.startedAt)||!date(raw.updatedAt)||!['draft','complete'].includes(raw.status))throw new Error('A saved session has invalid metadata.');
    if(raw.version!==DEFINITIONS[raw.type].version)throw new Error('A session uses a different question version. Keep the original backup; this version cannot safely rescore it.');
    const iq=raw.type==='iq';let items;
    if(iq){
      if(!Array.isArray(raw.items)||raw.items.length!==40)throw new Error('A reasoning session must contain 40 questions.');
      const familyCounts={};
      items=raw.items.map((q,i)=>{
        if(!plain(q)||q.domain!==Object.keys(FAMILIES)[Math.floor(i/8)]||!FAMILIES[q.domain].includes(q.family)||!Number.isInteger(q.seed)||q.seed<0||q.seed>0xFFFFFFFF||![1,2].includes(q.level))throw new Error('Invalid reasoning question parameters.');
        const k=`${q.domain}/${q.family}/${q.level}`;familyCounts[k]=(familyCounts[k]||0)+1;
        return makeQuestion(q.domain,q.family,q.seed,q.level);
      });
      if(Object.keys(familyCounts).length!==40||Object.values(familyCounts).some(n=>n!==1))throw new Error('Unbalanced reasoning form.');
    } else items=DEFINITIONS[raw.type].items;
    const ids=new Set(items.map(q=>q.id));
    if(!plain(raw.answers)||!Number.isInteger(raw.index)||raw.index<0||raw.index>=items.length)throw new Error('Invalid saved progress.');
    const answers={},notes={},flags={};
    for(const [k,v] of Object.entries(raw.answers)){
      if(!ids.has(k)||!(iq?Number.isInteger(v)&&v>=-1&&v<=3:raw.type==='politics'&&v===null||Number.isInteger(v)&&v>=1&&v<=5))throw new Error('Invalid saved response.');
      answers[k]=v;
    }
    for(const [k,v] of Object.entries(plain(raw.notes)?raw.notes:{}))if(ids.has(k)&&typeof v==='string')notes[k]=v.slice(0,1000);
    for(const [k,v] of Object.entries(plain(raw.flags)?raw.flags:{}))if(ids.has(k)&&v===true)flags[k]=true;
    let order=items.map(q=>q.id);
    if(!iq){if(!Array.isArray(raw.order)||raw.order.length!==items.length||new Set(raw.order).size!==items.length||raw.order.some(id=>!ids.has(id)))throw new Error('Invalid question order.');order=raw.order;}
    if(raw.status==='complete'&&(!date(raw.finishedAt)||Object.keys(answers).length!==items.length))throw new Error('A completed session has missing responses.');
    if(iq&&(!Number.isInteger(raw.section)||raw.section<0||raw.section>4||!['timed','practice'].includes(raw.mode)||typeof raw.betweenSections!=='boolean'||!(raw.deadline===null||Number.isFinite(raw.deadline))))throw new Error('Invalid section timer.');
    if(iq&&raw.mode==='timed'&&raw.status==='draft'&&!raw.betweenSections&&raw.deadline===null)throw new Error('A timed session is missing its deadline.');
    if(iq&&raw.status==='draft'&&Math.floor(raw.index/8)!==raw.section)throw new Error('Question and section do not match.');
    return {id:idFactory(),type:raw.type,name:raw.name.trim().slice(0,100)||'Imported session',startedAt:raw.startedAt,updatedAt:raw.updatedAt,finishedAt:raw.finishedAt||null,status:raw.status,version:raw.version,answers,notes,flags,order,index:raw.index,mode:iq?raw.mode:null,section:iq?raw.section:null,deadline:iq?raw.deadline:null,betweenSections:iq?raw.betweenSections:false,items:iq?items:null,imported:true};
  });
}
export function makeBackup(attempts){return {format:'four-big-tests-backup',schema:1,exportedAt:new Date().toISOString(),attempts};}
