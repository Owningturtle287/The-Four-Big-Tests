import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {JSDOM} from 'jsdom';
import {indexedDB} from 'fake-indexeddb';
import {allAttempts,putAttempt} from '../app/storage.js';
const tick=()=>new Promise(r=>setTimeout(r,5));
async function until(predicate){for(let i=0;i<200;i++){if(await predicate())return;await tick();}throw new Error('UI did not reach the expected state');}
test('App flow: autosave, resume, named results, history filters, and expired IQ sections',async()=>{
 const html=await readFile(new URL('../app/index.html',import.meta.url),'utf8');
 const dom=new JSDOM(html,{url:'https://example.test/The-Four-Big-Tests/',pretendToBeVisual:true});
 const {window}=dom;window.scrollTo=()=>{};window.HTMLElement.prototype.scrollIntoView=()=>{};
 window.HTMLDialogElement.prototype.showModal=function(){this.open=true;};window.HTMLDialogElement.prototype.close=function(){this.open=false;};
 for(const [key,value] of Object.entries({window,document:window.document,navigator:window.navigator,location:window.location,indexedDB}))Object.defineProperty(globalThis,key,{value,configurable:true});
 const nativeInterval=globalThis.setInterval;globalThis.setInterval=(fn,ms)=>{const t=nativeInterval(fn,ms);t.unref();return t;};
 try{
  await import('../app/app.js');
  const d=window.document,click=(selector)=>{const el=d.querySelector(selector);assert.ok(el,selector);assert.ok(!el.disabled,selector+' must be enabled');el.click();};
  assert.match(d.querySelector('main').textContent,/Personality/);
  click('[data-action=new]');d.querySelector('#session-name').value='Personality smoke';click('[data-action=create]');
  await until(()=>d.querySelector('[data-answer]'));
  click('[data-answer="4"]');await until(()=>d.querySelector('[data-action=next]').disabled===false);click('[data-action=next]');
  await until(()=>d.querySelector('.question-number')?.textContent.includes('Question 2'));
  click('[data-action=exit]');await until(()=>d.querySelector('.continue-card'));
  const saved=(await allAttempts()).find(a=>a.name==='Personality smoke');assert.equal(Object.keys(saved.answers).length,1);assert.equal(saved.index,1);
  click('[data-action=open]');await until(()=>d.querySelector('.question-number')?.textContent.includes('Question 2'));
  click('[data-tab=dark]');click('[data-action=new]');d.querySelector('#session-name').value='Dark profile';click('[data-action=create]');await until(()=>d.querySelector('[data-answer]'));
  for(let i=0;i<28;i++){
   await until(()=>d.querySelector('.question-number')?.textContent.startsWith('Question '+(i+1)+' '));
   click('[data-answer="4"]');await until(()=>!d.querySelector('[data-action=next]').disabled);click('[data-action=next]');
  }
  await until(()=>d.querySelector('[data-action=finish]'));click('[data-action=finish]');await until(()=>d.querySelector('.dark-score'));
  assert.equal(d.querySelectorAll('.dark-score').length,4);assert.match(d.querySelector('.dark-score').textContent,/4.00/);
  click('[data-action=rename]');d.querySelector('#rename-value').value='Named <result>';click('[data-action=confirm-rename]');await until(()=>d.querySelector('.result-header h1')?.textContent==='Named <result>');
  assert.equal(d.querySelector('.result-header h1').children.length,0);
  const result=(await allAttempts()).find(a=>a.name==='Named <result>');assert.equal(result.status,'complete');assert.equal(Object.keys(result.answers).length,28);assert.ok(result.finishedAt);
  click('[data-action=history]');assert.equal(d.querySelectorAll('.save-card').length,2);
  d.querySelector('#filter-type').value='dark';d.querySelector('#filter-type').dispatchEvent(new window.Event('change',{bubbles:true}));assert.equal(d.querySelectorAll('.save-card').length,1);
  click('[data-tab=iq]');click('[data-action=new]');click('[data-action=create]');await until(()=>d.querySelector('[data-action=begin-section]'));click('[data-action=begin-section]');await until(()=>d.querySelector('#timer'));
  let iq=(await allAttempts()).find(a=>a.type==='iq');assert.equal(iq.deadline!==null,true);assert.equal(iq.items.length,40);
  // Move wall time beyond the persisted deadline, then invoke the real visibility handler.
  const oldNow=Date.now;Date.now=()=>iq.deadline+1;try{d.dispatchEvent(new window.Event('visibilitychange'));await until(()=>d.querySelector('.break-screen .eyebrow')?.textContent.includes('Section 2'));}finally{Date.now=oldNow;}
  iq=(await allAttempts()).find(a=>a.type==='iq');assert.equal(iq.section,1);assert.equal(iq.betweenSections,true);assert.equal(iq.deadline,null);assert.equal(Object.keys(iq.answers).length,8);assert.ok(Object.values(iq.answers).every(a=>a===-1));
 }finally{globalThis.setInterval=nativeInterval;window.close();}
});
