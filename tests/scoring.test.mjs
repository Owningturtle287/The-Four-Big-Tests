import test from 'node:test';
import assert from 'node:assert/strict';
import {PERSONALITY_ITEMS} from '../app/data/personality.js';
import {DARK_ITEMS} from '../app/data/dark.js';
import {POLITICAL_ITEMS} from '../app/data/politics.js';
import {scoreTraits,scorePolitics,endorsement} from '../app/scoring.js';
test('Instrument structure: 120 personality, 28 dark, exactly 101 political questions',()=>{
 assert.equal(PERSONALITY_ITEMS.length,120);assert.equal(DARK_ITEMS.length,28);assert.equal(POLITICAL_ITEMS.length,101);
 for(const items of [PERSONALITY_ITEMS,DARK_ITEMS,POLITICAL_ITEMS])assert.equal(new Set(items.map(q=>q.id)).size,items.length);
 for(const key of ['O','C','E','A','N'])assert.equal(PERSONALITY_ITEMS.filter(q=>q.domain===key).length,24);
 for(const f of new Set(PERSONALITY_ITEMS.map(q=>q.facet)))assert.equal(PERSONALITY_ITEMS.filter(q=>q.facet===f).length,4);
 for(const key of ['M','N','P','S'])assert.equal(DARK_ITEMS.filter(q=>q.domain===key).length,7);
 assert.ok(POLITICAL_ITEMS.every(q=>q.originalText&&q.text!==q.originalText));
});
test('Reverse keyed personality items align; full-scale endpoints and neutral are exact',()=>{
 const high=Object.fromEntries(PERSONALITY_ITEMS.map(q=>[q.id,q.direction===1?5:1]));
 const low=Object.fromEntries(PERSONALITY_ITEMS.map(q=>[q.id,q.direction===1?1:5]));
 const neutral=Object.fromEntries(PERSONALITY_ITEMS.map(q=>[q.id,3]));
 for(const [answers,expected] of [[high,100],[low,0],[neutral,50]]){
  const r=scoreTraits('personality',answers);assert.ok(r.domains.every(d=>d.position===expected));assert.ok(r.facets.every(d=>d.position===expected));
 }
 delete high.P001;assert.equal(scoreTraits('personality',high).domains.find(d=>d.key==='N').position,null);
});
test('SD4 independent means and missing-item handling',()=>{
 const answers=Object.fromEntries(DARK_ITEMS.map(q=>[q.id,{M:5,N:4,P:2,S:1}[q.domain]]));
 assert.deepEqual(scoreTraits('dark',answers).domains.map(d=>d.mean),[5,4,2,1]);
 assert.equal(endorsement(3),'Mixed endorsement');delete answers.D01;
 assert.equal(scoreTraits('dark',answers).domains[0].mean,null);
});
test('Politics treats neutral as scored and context as missing, never equating missing with center',()=>{
 const neutral=Object.fromEntries(POLITICAL_ITEMS.map(q=>[q.id,3]));let r=scorePolitics(neutral);assert.equal(r.x,0);assert.equal(r.y,0);assert.equal(r.axis.x.coverage,1);
 const missing=Object.fromEntries(POLITICAL_ITEMS.map(q=>[q.id,null]));r=scorePolitics(missing);assert.equal(r.x,null);assert.equal(r.y,null);assert.equal(r.contextual,101);
 const right=Object.fromEntries(POLITICAL_ITEMS.filter(q=>q.x).map(q=>[q.id,q.x>0?5:1]));r=scorePolitics(right);assert.equal(r.axis.x.score,10);assert.equal(r.x,null); // insufficient second-axis coverage
 const independent=POLITICAL_ITEMS.filter(q=>q.facet==='E2');const a=Object.fromEntries(independent.map((q,i)=>[q.id,[5,1,4,2,3,5,1,4][i]]));
 const expected=10*independent.reduce((s,q)=>s+(a[q.id]-3)*q.x,0)/(2*independent.reduce((s,q)=>s+Math.abs(q.x),0));
 assert.equal(scorePolitics(a).facets.find(f=>f.key==='E2').score,expected);
});
