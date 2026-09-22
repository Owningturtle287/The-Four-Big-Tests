import test from 'node:test';
import assert from 'node:assert/strict';
import {FAMILIES,generateForm,makeQuestion,fingerprint,rotate,mirror,scoreReasoning,expired,sectionDeadline} from '../app/iq.js';
test('Rotations and reflections match independent geometric expectations',()=>{
 assert.equal(rotate(1),8);assert.equal(rotate(8),32768);assert.equal(mirror(1),8);
 for(const m of [1,305,1729,32769,65535]){assert.equal(rotate(rotate(rotate(rotate(m)))),m);assert.equal(mirror(mirror(m)),m);}
});
test('Generated forms have 40 distinct items, 8 per domain and both complexity levels',()=>{
 const seen=new Set();for(let seed=1;seed<=50;seed++){
  const form=generateForm(seed,seen);assert.equal(form.length,40);
  for(const domain of Object.keys(FAMILIES)){const items=form.filter(q=>q.domain===domain);assert.equal(items.length,8);assert.equal(items.filter(q=>q.level===1).length,4);}
  for(const q of form){assert.ok(!seen.has(fingerprint(q)));seen.add(fingerprint(q));}
 }
 assert.equal(seen.size,2000);
});
test('20,000 generated variants have one keyed answer, four distinct choices, and an explanation',()=>{
 let count=0;for(const [domain,families] of Object.entries(FAMILIES))for(const family of families)for(let seed=1;seed<=1000;seed++){
  const q=makeQuestion(domain,family,seed,seed%2+1);assert.equal(q.options.length,4);assert.equal(new Set(q.options.map(x=>JSON.stringify(x))).size,4);assert.ok(q.correct>=0&&q.correct<4);assert.ok(q.explanation.length>25);count++;
 }
 assert.equal(count,20000);
});
test('Numeric sequence answers satisfy independent observed rules',()=>{
 for(let seed=1;seed<100;seed++){
  for(const f of ['steps','differences','interleave']){
   const q=makeQuestion('sequence',f,seed,2),s=q.stimulus.values,ans=q.options[q.correct];
   if(f==='steps')assert.equal(ans,s[4]+s[1]-s[0]);
   if(f==='differences')assert.equal(ans,s[4]+(s[4]-s[3])+((s[2]-s[1])-(s[1]-s[0])));
   if(f==='interleave')assert.equal(ans,s[4]+s[2]-s[0]);
  }
 }
});
test('Logic and quantities are consistent with their premises',()=>{
 for(let seed=1;seed<=100;seed++){
  const q=makeQuestion('quantity','ratio',seed,1),v=q.stimulus.values;
  assert.equal(q.options[q.correct]*v[0],v[1]*v[2]);
  const m=makeQuestion('quantity','machine',seed,2),pairs=m.stimulus.lines.map(x=>x.split(' → ').map(Number));const slope=(pairs[1][1]-pairs[0][1])/(pairs[1][0]-pairs[0][0]);
  assert.equal(m.options[m.correct],pairs[3][0]*slope+pairs[0][1]-pairs[0][0]*slope);
 }
});
test('Scoring penalizes omitted answers, never manufactures an IQ score',()=>{
 const form=generateForm(77),answers=Object.fromEntries(form.map(q=>[q.id,q.correct]));
 assert.equal(scoreReasoning(form,answers).correct,40);assert.equal(scoreReasoning(form,answers).iq,null);
 answers[form[0].id]=-1;delete answers[form[1].id];const r=scoreReasoning(form,answers);assert.equal(r.correct,38);assert.equal(r.answered,38);assert.equal(r.total,40);
});
test('Deadline survives serialization and expires based on absolute time',()=>{
 const d=sectionDeadline(1000);assert.equal(d,421000);assert.equal(expired(d,420999),false);assert.equal(expired(JSON.parse(JSON.stringify(d)),421000),true);assert.equal(sectionDeadline(1000,'practice'),null);assert.equal(expired(null,999999999),false);
});
