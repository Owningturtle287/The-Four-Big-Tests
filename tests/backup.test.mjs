import test from 'node:test';
import assert from 'node:assert/strict';
import {validateBackup,makeBackup} from '../app/backup.js';
import {DEFINITIONS} from '../app/scoring.js';
import {generateForm} from '../app/iq.js';
import {generateForm as generateLegacyForm} from '../app/iq-v1.js';
import {LEGACY_DARK_VERSION,scoreTraits} from '../app/scoring.js';
import {DARK_ITEMS as LEGACY_DARK_ITEMS} from '../app/data/dark-v1.js';
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
 const result=validateBackup(makeBackup([a]),()=> 'new')[0];assert.equal(result.items.length,50);assert.equal(result.items[0].correct,expected);assert.ok(!result.items[0].prompt.includes('<script>'));
});

test('Original 40-item and published SD4 backups retain their version and scoring',()=>{
 const oldForm=generateLegacyForm(42),a={...draft(),type:'iq',version:'reasoning-1.0',mode:'timed',items:oldForm,answers:{[oldForm[0].id]:oldForm[0].correct},order:[],index:1,section:0,betweenSections:false,deadline:421000};
 const [old]=validateBackup(makeBackup([a]),()=> 'old-copy');assert.equal(old.items.length,40);assert.equal(old.items[0].correct,oldForm[0].correct);assert.equal(old.version,'reasoning-1.0');
 const dark={...draft(),version:LEGACY_DARK_VERSION,answers:Object.fromEntries(LEGACY_DARK_ITEMS.map(q=>[q.id,4])),order:LEGACY_DARK_ITEMS.map(q=>q.id),status:'complete',finishedAt:'2026-09-22T00:02:00.000Z'};
 const [restored]=validateBackup(makeBackup([dark]));assert.equal(restored.version,LEGACY_DARK_VERSION);assert.equal(scoreTraits('dark',restored.answers,restored.version).domains[0].mean,4);
 assert.throws(()=>validateBackup(makeBackup([{...a,version:'reasoning-unknown'}])));
});
