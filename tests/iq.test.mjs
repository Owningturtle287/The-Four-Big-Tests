import test from 'node:test';
import assert from 'node:assert/strict';
import {FAMILIES,generateForm,makeQuestion,fingerprint,rotate,mirror,scoreReasoning,provisionalIq,expired,sectionDeadline,IQ_VERSION,IQ_SECTION_SIZE} from '../app/iq.js';

test('Spatial primitives have reversible geometry',()=>{
 assert.equal(rotate(1),8);assert.equal(rotate(8),32768);assert.equal(mirror(1),8);
 for(const m of [1,305,1729,32769,65535]){assert.equal(rotate(rotate(rotate(rotate(m)))),m);assert.equal(mirror(mirror(m)),m);}
});
test('50-item forms balance five domains and new advanced families',()=>{
 const seen=new Set();for(let seed=1;seed<=50;seed++){
  const form=generateForm(seed,seen);assert.equal(form.length,50);
  assert.equal(new Set(form.map(fingerprint)).size,50);
  for(const domain of Object.keys(FAMILIES)){
   const items=form.filter(q=>q.domain===domain);assert.equal(items.length,10);
   assert.equal(items.filter(q=>q.level===1).length,4);assert.equal(items.filter(q=>q.level===2).length,4);assert.equal(items.filter(q=>q.level===3).length,2);
   assert.equal(new Set(items.map(q=>q.family)).size,6);
  }
  for(const q of form){assert.equal(q.previouslySeen,seen.has(fingerprint(q)));seen.add(fingerprint(q));}
 }
 assert.ok(seen.size>2300);
});
test('30,000 variants have six distinct alternatives, a keyed answer and an explanation',()=>{
 let count=0;for(const [domain,families] of Object.entries(FAMILIES))for(const [index,family] of families.entries())for(let seed=1;seed<=1000;seed++){
  const q=makeQuestion(domain,family,seed,index>3?3:seed%2+1);
  assert.equal(q.options.length,6,`${domain}/${family}/${seed}`);
  assert.equal(new Set(q.options.map(x=>JSON.stringify(x))).size,6);
  assert.ok(q.correct>=0&&q.correct<6);assert.ok(q.explanation.length>25);count++;
 }
 assert.equal(count,30000);
});
test('Advanced numeric and spatial answers follow independently checked operations',()=>{
 for(let seed=1;seed<=150;seed++){
  const step=makeQuestion('sequence','steps',seed,2),s=step.stimulus.values;
  assert.equal(step.options[step.correct],s.at(-1)+(s[2]-s[1]));
  const quadratic=makeQuestion('sequence','quadratic',seed,3),q=quadratic.stimulus.values;
  const last=q[5]-q[4],change=(q[5]-q[4])-(q[4]-q[3]);assert.equal(quadratic.options[quadratic.correct],q[5]+last+change);
  const alt=makeQuestion('sequence','alternateOps',seed,3),a=alt.stimulus.values;assert.equal(alt.options[alt.correct],a[5]*(a[1]/a[0]));
  const fold=makeQuestion('spatial','doubleFold',seed,3),opened=fold.options[fold.correct].mask;
  assert.equal(mirror(opened),opened);assert.equal(rotate(rotate(opened)),opened);
  const compose=makeQuestion('spatial','compose',seed,3);assert.equal(compose.options[compose.correct].mask,rotate(compose.stimulus.tile.mask^0x9009));
  const eq=makeQuestion('quantity','twoEquations',seed,3),[first,second]=eq.stimulus.lines;
  const sum=Number(first.split(' = ')[1]);const [m,n,result]=[...second.matchAll(/\d+/g)].map(v=>Number(v[0]));
  const x=eq.options[eq.correct],y=sum-x;assert.equal(m*x+n*y,result);
 }
});
test('Numeric scoring is explicitly provisional and separated from practice and legacy',()=>{
 assert.equal(IQ_VERSION,'reasoning-2.0');assert.equal(IQ_SECTION_SIZE,10);
 const form=generateForm(77),answers=Object.fromEntries(form.map(q=>[q.id,q.correct]));
 assert.equal(scoreReasoning(form,answers).correct,50);assert.equal(scoreReasoning(form,answers).iq,145);
 assert.equal(scoreReasoning(form,answers,'practice').iq,null);
 for(const q of form.slice(0,25))answers[q.id]=-1;
 assert.equal(scoreReasoning(form,answers).iq,100);
 delete answers[form[25].id];const r=scoreReasoning(form,answers);assert.equal(r.correct,24);assert.equal(r.answered,24);assert.equal(r.total,50);
 assert.equal(provisionalIq(0,50),55);assert.equal(provisionalIq(10,40),null);
});
test('New deadlines are twelve minutes and old sessions can retain seven minutes',()=>{
 const d=sectionDeadline(1000);assert.equal(d,721000);assert.equal(expired(d,720999),false);assert.equal(expired(JSON.parse(JSON.stringify(d)),721000),true);
 assert.equal(sectionDeadline(1000,'timed',7),421000);assert.equal(sectionDeadline(1000,'practice'),null);
});
