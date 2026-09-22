import test from 'node:test';
import assert from 'node:assert/strict';
import {validateBackup,makeBackup} from '../app/backup.js';
import {DEFINITIONS} from '../app/scoring.js';
import {generateForm} from '../app/iq.js';
const draft=()=>({id:'old',type:'dark',name:'My <save>',status:'draft',version:DEFINITIONS.dark.version,startedAt:'2026-09-22T00:00:00.000Z',updatedAt:'2026-09-22T00:01:00.000Z',answers:{D01:5},index:1,order:DEFINITIONS.dark.items.map(q=>q.id),notes:{D01:'Context'},flags:{}});
test('Backup round-trip preserves responses while creating a distinct save',()=>{const r=validateBackup(makeBackup([draft()]),()=> 'new');assert.equal(r[0].id,'new');assert.equal(r[0].answers.D01,5);assert.equal(r[0].notes.D01,'Context');assert.equal(r[0].name,'My <save>');});
test('Malformed, foreign, and incomplete completed sessions fail atomically',()=>{
 assert.throws(()=>validateBackup({}));const a=draft();a.answers.D01=8;assert.throws(()=>validateBackup(makeBackup([a])));
 a.answers.D01=5;a.status='complete';assert.throws(()=>validateBackup(makeBackup([a])));
 a.status='draft';a.type='__proto__';assert.throws(()=>validateBackup(makeBackup([a])));
});
test('Imported IQ content is rebuilt from trusted parameters, including answer keys',()=>{
 const a={...draft(),type:'iq',version:DEFINITIONS.iq.version,mode:'timed',items:generateForm(42),answers:{},order:[],index:0,section:0,betweenSections:false,deadline:421000};
 const expected=a.items[0].correct;a.items[0].prompt='<script>malicious()</script>';a.items[0].correct=(expected+1)%4;
 const result=validateBackup(makeBackup([a]),()=> 'new')[0];assert.equal(result.items[0].correct,expected);assert.ok(!result.items[0].prompt.includes('<script>'));
});
