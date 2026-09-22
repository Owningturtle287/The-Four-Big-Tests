import {PERSONALITY_ITEMS,PERSONALITY_FACETS} from './data/personality.js';
import {DARK_ITEMS} from './data/dark.js';
import {POLITICAL_ITEMS,POLITICAL_FACETS} from './data/politics.js';
export const VERSION = '1.0.0';
export const DOMAINS = {
  O:{name:'Openness',low:'Familiar & practical',high:'Curious & exploratory',description:'Interest in ideas, imagination, aesthetic experiences, feelings, and unconventional perspectives.',lowText:'You tend to prefer familiar approaches and practical information. New ideas may appeal most when their purpose is clear.',highText:'You tend to seek new ideas and experiences, use your imagination, and explore more than one perspective.'},
  C:{name:'Conscientiousness',low:'Flexible & spontaneous',high:'Organized & deliberate',description:'Organization, dependability, persistence, and deliberation.',lowText:'You tend to work more flexibly and may find routines or sustained planning harder to maintain. External reminders and small milestones can be useful.',highText:'You tend to plan ahead, follow through on commitments, and keep your work organized. Your standards may also make it hard to leave work unfinished.'},
  E:{name:'Extraversion',low:'Reserved & reflective',high:'Outgoing & assertive',description:'Social engagement, assertiveness, activity, excitement seeking, and positive emotion.',lowText:'You tend to prefer quieter settings or more selective social contact. This does not imply poor social skills or lack of interest in people.',highText:'You tend to enjoy social interaction, express yourself readily, and seek activity or stimulation.'},
  A:{name:'Agreeableness',low:'Questioning & competitive',high:'Cooperative & considerate',description:'Trust, straightforwardness, concern for others, cooperation, and modesty.',lowText:'You tend to question other people’s motives and may prioritize competition or your own position in disagreements. The facets show where this pattern is strongest.',highText:'You tend to cooperate, consider other people’s needs, and give them the benefit of the doubt. Firm boundaries can coexist with these tendencies.'},
  N:{name:'Emotional sensitivity',low:'Steady under stress',high:'Responsive to stress',description:'The Big Five domain usually called neuroticism: frequency and intensity of negative emotion and stress responses.',lowText:'You report relatively few stress reactions and tend to remain steady during challenges. This is a self-description, not a measure of mental health.',highText:'You report stronger or more frequent worry, frustration, or overwhelm. Supportive routines and recovery time may be especially useful. This score is not a diagnosis.'},
};
export const DARK_DOMAINS = {
  M:{name:'Machiavellianism',short:'Strategic manipulation',description:'The SD4 subscale emphasizes strategic calculation, secrecy, flattery, and using interpersonal influence for advantage. Planning by itself does not establish manipulation.'},
  N:{name:'Narcissism',short:'Self-importance & admiration',description:'This subscale emphasizes grandiose self-perception, leadership, persuasion, and attention seeking. It does not measure every form of narcissism, and confidence alone is not a disorder.'},
  P:{name:'Psychopathy traits',short:'Disinhibition & antagonism',description:'This brief subscale emphasizes impulsivity, defiance, aggression, and risky conduct. It is not a clinical psychopathy assessment and does not comprehensively measure empathy or remorse.'},
  S:{name:'Sadism',short:'Supplementary fourth trait',description:'The additional SD4 subscale concerns enjoyment of others’ suffering and attraction to cruelty. Some items concern entertainment preferences; no single answer establishes a trait or predicts harmful conduct.'},
};
export const DEFINITIONS = {
  personality:{name:'Personality',number:'01',subtitle:'A detailed picture of your everyday tendencies.',questions:120,time:'15–20 min',instrument:'IPIP-NEO-120',color:'#324cba',intro:'Explore five broad personality traits and 30 more specific facets. Answer for how you usually are, across situations—not how you would like to be.',instruction:'Describe yourself as you generally are now, compared with other people you know. Think across situations, not just today.',labels:['Very inaccurate','Moderately inaccurate','Neither inaccurate nor accurate','Moderately accurate','Very accurate'],items:PERSONALITY_ITEMS,version:'ipip-neo-120-johnson-2014',note:'Research-based trait profile. Scores are scale positions, not population percentiles or fixed personality types.'},
  iq:{name:'IQ',number:'02',subtitle:'Reason through unfamiliar problems.',questions:40,time:'35 min',instrument:'Original reasoning battery',color:'#126e71',intro:'Five sections of patterns, numbers, spatial puzzles, logic, and quantitative reasoning. Each section has eight questions and a seven-minute timer.',instruction:'Work independently. Avoid calculators, search, and outside help. Scratch paper is fine.',version:'reasoning-1.0',note:'Culture-reduced reasoning, not culture-free. Reports accuracy and a skill profile; a standardized IQ score requires population norming that this app does not yet have.'},
  politics:{name:'Politics',number:'03',subtitle:'Understand where your policy preferences lead.',questions:101,time:'20–25 min',instrument:'Political Compass 101 · revised',color:'#af552f',intro:'Consider 101 concrete policy choices. See your economic and governance preferences, plus a breakdown across 12 policy areas.',instruction:'Assume the conditions in each hypothetical statement hold. Judge the policy itself, not a particular party. Choose “Need more context” when those conditions do not let you decide.',labels:['Strongly disagree','Disagree','Neither agree nor disagree','Agree','Strongly agree'],items:POLITICAL_ITEMS,version:'political-101-2.0',note:'A policy-preference map, not a prediction of party membership. Its axes and weights are interpretive and have not been empirically validated.'},
  dark:{name:'Dark triad',number:'04',subtitle:'Reflect on the harder edges of personality.',questions:28,time:'4–6 min',instrument:'Short Dark Tetrad · SD4',color:'#795196',intro:'Explore Machiavellianism, narcissism, and psychopathy-related traits using the published SD4. Its fourth scale, sadism, is reported separately.',instruction:'Rate your honest agreement. Some statements are deliberately uncomfortable. Respond for yourself, not on behalf of another person.',labels:['Strongly disagree','Disagree','Neutral','Agree','Strongly agree'],items:DARK_ITEMS,version:'sd4-paulhus-2020',note:'A brief self-report measure, not a diagnosis, risk assessment, or verdict on your character. Intended for adults.'},
};
const mean=(xs)=>xs.length?xs.reduce((a,b)=>a+b,0)/xs.length:null;
const valid=(v)=>Number.isInteger(v)&&v>=1&&v<=5;
export function endorsement(meanScore){if(meanScore===null)return 'Not scored';return meanScore<2.5?'Lower endorsement':meanScore>3.5?'Higher endorsement':'Mixed endorsement';}
export function scalePosition(m){return m===null?null:(m-1)*25;}
export function scoreTraits(type,answers) {
  const items=DEFINITIONS[type].items,domains={},facets={};
  for(const q of items){const v=answers[q.id];if(!valid(v))continue;const score=q.direction===-1?6-v:v;(domains[q.domain]??=[]).push(score);if(q.facet)(facets[q.facet]??=[]).push(score);}
  const summarize=(key,values,total)=>({key,mean:mean(values),position:scalePosition(mean(values)),count:values.length,total});
  const keys=type==='personality'?Object.keys(DOMAINS):Object.keys(DARK_DOMAINS);
  const ds=keys.map(k=>summarize(k,domains[k]||[],type==='personality'?24:7));
  // Withhold incompletely answered short scales rather than impute values.
  for(const d of ds)if(d.count<d.total){d.mean=null;d.position=null;}
  const fs=Object.keys(PERSONALITY_FACETS).map(k=>summarize(k,facets[k]||[],4));
  for(const f of fs)if(f.count<4){f.mean=null;f.position=null;}
  const responses=items.map(q=>answers[q.id]).filter(valid);
  const dominant=responses.length?Math.max(...[1,2,3,4,5].map(v=>responses.filter(r=>r===v).length))/responses.length:0;
  return {domains:ds,facets:type==='personality'?fs:[],answered:responses.length,total:items.length,uniform:dominant>.9};
}
export function scorePolitics(answers) {
  const axis={x:{raw:0,mass:0,total:0},y:{raw:0,mass:0,total:0}},facets={};let contextual=0,answered=0;
  for(const q of POLITICAL_ITEMS){const v=answers[q.id];for(const k of ['x','y'])axis[k].total+=Math.abs(q[k]);
    if(v===null){contextual++;continue;}if(!valid(v))continue;answered++;
    for(const k of ['x','y']){axis[k].raw+=(v-3)*q[k];axis[k].mass+=Math.abs(q[k]);}
    if(q.facet!=='X'){const k=POLITICAL_FACETS[q.facet].axis;const f=facets[q.facet]??={raw:0,mass:0,count:0};f.raw+=(v-3)*q[k];f.mass+=Math.abs(q[k]);f.count++;}
  }
  for(const a of Object.values(axis)){a.coverage=a.mass/a.total;a.score=a.mass?10*a.raw/(2*a.mass):null;}
  const enough=axis.x.coverage>=.7&&axis.y.coverage>=.7;
  const fs=Object.entries(POLITICAL_FACETS).filter(([k])=>k!=='X').map(([key,meta])=>{const f=facets[key];return {key,...meta,count:f?.count||0,total:8,score:f&&f.count>=4?10*f.raw/(2*f.mass):null};});
  return {x:enough?axis.x.score:null,y:enough?axis.y.score:null,axis,facets:fs,answered,contextual,total:101,enough};
}
export function politicalLabel(x,y){
  if(x===null||y===null)return 'More answers needed';
  const econ=Math.abs(x)<1.5?'mixed economic preferences':x<0?'public provision & redistribution':'markets & private ownership';
  const gov=Math.abs(y)<1.5?'mixed governance preferences':y<0?'individual safeguards & pluralism':'collective rules & authority';
  return `${econ[0].toUpperCase()+econ.slice(1)}; ${gov}`;
}
