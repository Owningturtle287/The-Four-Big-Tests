// Original, parameterized reasoning tasks. No copyrighted commercial IQ items.
// Difficulty levels are authored design levels, NOT calibrated item difficulty.
export const IQ_VERSION = 'reasoning-1.0';
export const IQ_DOMAINS = {
  matrix: {name:'Visual patterns', minutes:7, description:'Find transformations and relationships in grids.'},
  sequence: {name:'Number sequences', minutes:7, description:'Discover the rule that generates a sequence.'},
  spatial: {name:'Spatial reasoning', minutes:7, description:'Rotate, reflect, and mentally fold shapes.'},
  logic: {name:'Deductive logic', minutes:7, description:'Work out what must follow from the information given.'},
  quantity: {name:'Quantitative reasoning', minutes:7, description:'Compare quantities and solve numerical relationships.'},
};
export function rngFrom(seed) {
  let a=seed>>>0;
  return () => { a|=0; a=(a+0x6D2B79F5)|0; let t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; };
}
export function shuffle(xs,rng=Math.random) {const out=[...xs];for(let i=out.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[out[i],out[j]]=[out[j],out[i]];}return out;}
const range=(n)=>Array.from({length:n},(_,i)=>i);
const sig=(v)=>JSON.stringify(v);
export function fingerprint(q) {return sig([q.family,q.prompt,q.stimulus]);}
export function rotate(mask,n=4) {let r=0;for(let y=0;y<n;y++)for(let x=0;x<n;x++)if(mask&(1<<(y*n+x)))r|=1<<(x*n+(n-1-y));return r;}
export function mirror(mask,n=4) {let r=0;for(let y=0;y<n;y++)for(let x=0;x<n;x++)if(mask&(1<<(y*n+x)))r|=1<<(y*n+n-1-x);return r;}
export function bits(mask,n=4){return range(n*n).map(i=>Boolean(mask&(1<<i)));}
const same=(a,b)=>sig(a)===sig(b);
function choiceSet(answer,distractors,rng,fallback) {
  const unique=[answer];for(const d of distractors)if(!unique.some(x=>same(x,d)))unique.push(d);
  let guard=0;while(unique.length<4&&guard++<200){const d=fallback();if(!unique.some(x=>same(x,d)))unique.push(d);}
  if(unique.length<4)throw new Error('Could not construct distinct alternatives');
  const options=shuffle(unique.slice(0,4),rng);return {options,correct:options.findIndex(v=>same(v,answer))};
}
export const FAMILIES = {
  matrix:['xor','overlay','turns','counts'],
  sequence:['steps','multiply','differences','interleave'],
  spatial:['rotation','reflection','fold','cube'],
  logic:['ordering','sets','mapping','balance'],
  quantity:['table','ratio','machine','equation'],
};
export function makeQuestion(domain,family,seed,level=1) {
  const rng=rngFrom(seed),int=(lo,hi)=>lo+Math.floor(rng()*(hi-lo+1)),pick=(xs)=>xs[int(0,xs.length-1)];
  let prompt='',stimulus=null,answer,distractors=[],explanation='',visualOptions=false;
  const numOptions=(a)=>[a+1,a-1,a+int(2,7),a-int(2,7),a*2];
  const grid=(m,n=3)=>({kind:'tiles',mask:m,n});
  let nonSym=()=>{let m;do{m=int(1,65534);}while(new Set([m,rotate(m),rotate(rotate(m)),rotate(rotate(rotate(m)))]).size<4);return m;};
  if(domain==='matrix') {
    visualOptions=true;prompt='Which tile completes the pattern? The same rule applies across each row.';
    if(family==='xor'||family==='overlay') {
      const op=family==='xor'?(a,b)=>a^b:(a,b)=>a|b;
      const a=int(1,510),b=int(1,510),c=int(1,510),d=int(1,510),e=int(1,510),f=int(1,510);
      stimulus={kind:'matrix',cells:[a,b,op(a,b),c,d,op(c,d),e,f,null].map(m=>m===null?null:grid(m))};
      answer=grid(op(e,f));distractors=[grid(family==='xor'?e|f:e^f),grid(e&f),grid(511^op(e,f)),grid(e)];
      explanation=family==='xor'?'In each row, a square is filled in the third tile only when it is filled in exactly one of the first two tiles (exclusive OR).':'In each row, the third tile contains every square filled in either of the first two tiles (union).';
    } else if(family==='turns') {
      let a=int(1,510),b=int(1,510),c=int(1,510);while(rotate(c,3)===c)c=int(1,510);
      const turn=(m)=>level===1?rotate(m,3):rotate(rotate(rotate(m,3),3),3);
      stimulus={kind:'matrix',cells:[a,turn(a),turn(turn(a)),b,turn(b),turn(turn(b)),c,turn(c),null].map(m=>m===null?null:grid(m))};
      answer=grid(turn(turn(c)));distractors=[grid(c),grid(turn(c)),grid(511^answer.mask),grid(mirror(answer.mask,3))];
      explanation=`Each step to the right rotates the pattern 90° ${level===1?'clockwise':'counterclockwise'}. Apply that rotation to the middle tile of the last row.`;
    } else {
      visualOptions=false;const a=int(2,18),b=int(2,18),c=int(2,18),d=int(2,18),e=int(2,18),f=int(2,18),k=level===1?1:2;
      const op=(x,y)=>x+k*y;
      stimulus={kind:'numberMatrix',cells:[a,b,op(a,b),c,d,op(c,d),e,f,null]};answer=op(e,f);distractors=[e+f,e*f,Math.abs(e-f),answer+2];
      explanation=`In each row, the last number is the first number plus ${k===1?'the second number':'twice the second number'}. ${e} + ${k===1?'':k+' × '}${f} = ${answer}.`;
    }
  } else if(domain==='sequence') {
    prompt='Which number comes next? Use the simplest consistent rule.';let seq=[];
    if(family==='steps'){const a=int(2,150),d=int(2,level===1?12:25);seq=range(5).map(i=>a+i*d);answer=a+5*d;explanation=`Add ${d} each time: ${seq[4]} + ${d} = ${answer}.`;}
    if(family==='multiply'){const a=int(2,25),m=int(2,4),b=level===1?0:int(1,9);seq=[a];for(let i=0;i<4;i++)seq.push(seq.at(-1)*m+b);answer=seq.at(-1)*m+b;explanation=`Multiply by ${m}${b?' and add '+b:''} at each step. The next value is ${answer}.`;}
    if(family==='differences'){const a=int(2,100),d=int(2,9),step=int(1,level===1?4:9);seq=[a];for(let i=0;i<4;i++)seq.push(seq.at(-1)+d+i*step);answer=seq.at(-1)+d+4*step;explanation=`Successive increases are ${range(5).map(i=>d+i*step).join(', ')}. The increase itself rises by ${step} each time.`;}
    if(family==='interleave'){const a=int(2,80),b=int(90,180),d=int(2,15),e=int(2,15);seq=[a,b,a+d,b-e,a+2*d,b-2*e];answer=a+3*d;explanation=`Alternate positions form two sequences. Positions 1, 3, 5, 7 increase by ${d}; positions 2, 4, 6 decrease by ${e}. The next value is ${answer}.`;}
    stimulus={kind:'sequence',values:seq};distractors=numOptions(answer);
  } else if(domain==='spatial') {
    if(family==='rotation'||family==='reflection') {
      visualOptions=true;const mask=nonSym();let turns=level===1?1:3;
      if(family==='reflection'){answer=grid(mirror(mask),4);prompt='Which option is the reflection of this tile in a vertical mirror?';explanation='A vertical mirror reverses left and right in each row. It does not reverse top and bottom.';}
      else {let m=mask;for(let i=0;i<turns;i++)m=rotate(m);answer=grid(m,4);prompt=`Which option shows this tile rotated ${turns===1?'90° clockwise':'90° counterclockwise'}?`;explanation=`Rotate the whole tile ${turns===1?'clockwise':'counterclockwise'} by one quarter turn; filled squares keep their relative positions.`;}
      stimulus={kind:'single',tile:grid(mask,4)};distractors=[grid(mask,4),grid(rotate(rotate(mask)),4),grid(rotate(mask),4),grid(rotate(rotate(rotate(mask))),4),grid(mirror(mask),4)];
    } else if(family==='fold') {
      visualOptions=true;let mask=int(1,255)&0x3333; if(!mask)mask=1; // punches in left half
      mask |= (int(0,3)<<8)|(int(0,3)<<12);
      prompt='A square sheet is folded once along its vertical center. Holes are punched at the filled positions in the folded left half. Which pattern appears when it is opened?';
      stimulus={kind:'fold',tile:grid(mask,4)};answer=grid(mask|mirror(mask),4);distractors=[grid(mask,4),grid(rotate(mask|mirror(mask)),4),grid((mask|mirror(mask))^65535,4)];
      explanation='Each hole appears at its original location and at its mirror location across the vertical fold. The opened pattern is left–right symmetric.';
    } else {
      const faces=shuffle(range(9).map(i=>i+1),rng).slice(0,6),which=int(0,5),opposites=[4,3,5,1,0,2];
      prompt=`Fold this net into a cube. Which number is on the face opposite ${faces[which]}?`;stimulus={kind:'cube',faces};answer=faces[opposites[which]];distractors=shuffle(faces.filter(x=>x!==answer),rng);
      explanation=`The opposite face pairs in this net are ${faces[0]}–${faces[4]}, ${faces[1]}–${faces[3]}, and ${faces[2]}–${faces[5]}. So ${answer} is opposite ${faces[which]}.`;
    }
  } else if(domain==='logic') {
    if(family==='ordering') {
      const labels=shuffle(['A','B','C','D','E','F','G','H','J'],rng).slice(0,5),order=shuffle(labels,rng),pos=int(1,3);
      prompt=`Five tiles are arranged in one row. Which tile must be in position ${pos+1}, counting from the left?`;
      stimulus={kind:'facts',lines:shuffle(range(4).map(i=>`${order[i]} is immediately to the left of ${order[i+1]}.`),rng)};answer=order[pos];distractors=labels.filter(x=>x!==answer);
      explanation=`The only possible left-to-right order is ${order.join(' → ')}. Position ${pos+1} is ${answer}.`;
    } else if(family==='sets') {
      const [a,b,c]=shuffle(['A','B','C','D','E','F','G','H','J','K','L','M'],rng).slice(0,3);
      prompt='Which statement must be true? Treat the labels as abstract groups.';
      if(level===1){stimulus={kind:'facts',lines:[`Every ${a} is a ${b}.`,`No ${b} is a ${c}.`]};answer=`No ${a} is a ${c}.`;distractors=[`Every ${c} is an ${a}.`,`Every ${b} is an ${a}.`,`Some ${a} are ${c}.`];explanation=`Because all ${a} are inside group ${b}, and ${b} has no overlap with ${c}, no ${a} can be a ${c}. This does not require any ${a} to exist.`;}
      else {stimulus={kind:'facts',lines:[`Every ${a} is a ${b}.`,`At least one ${c} is an ${a}.`]};answer=`At least one ${c} is a ${b}.`;distractors=[`Every ${b} is a ${c}.`,`No ${c} is a ${b}.`,`Every ${c} is an ${a}.`];explanation=`The ${c} that belongs to ${a} must also belong to ${b}. The premises guarantee this one overlap, not a universal relationship.`;}
    } else if(family==='mapping') {
      const [a,b,c]=shuffle(['●','▲','■','◆','★','⬟'],rng).slice(0,3),v=int(2,15),w=int(2,15),u=int(2,15);
      prompt='Each symbol always represents the same positive number. What is the missing value?';stimulus={kind:'facts',lines:[`${a} + ${a} = ${2*v}`,`${a} + ${b} = ${v+w}`,`${b} + ${c} = ${w+u}`,`${a} + ${c} = ?`]};answer=v+u;distractors=numOptions(answer);explanation=`${a} = ${v}, ${b} = ${w}, and ${c} = ${u}. Therefore ${a} + ${c} = ${answer}.`;
    } else {
      const a=int(2,8),b=int(2,8),c=int(2,8);
      prompt='The balances are exact. How many circles balance one square?';stimulus={kind:'facts',lines:[`1 square = ${a} triangles`,`1 triangle = ${b} diamonds`,`1 diamond = ${c} circles`]};answer=a*b*c;distractors=[a+b+c,a*b,a*c,answer+1];explanation=`Substitute through the three balances: ${a} × ${b} × ${c} = ${answer} circles.`;
    }
  } else if(domain==='quantity') {
    if(family==='table') {
      const a=int(2,15),b=int(2,15),c=int(2,15),d=int(2,15),e=int(2,15),f=int(2,15),k=level===1?0:int(1,8);
      prompt='The same rule links the three numbers in every row. What replaces the question mark?';stimulus={kind:'numberMatrix',cells:[a,b,a*b+k,c,d,c*d+k,e,f,null]};answer=e*f+k;distractors=[e+f+k,e*f-k,e*f+k+1,e*f];explanation=`Multiply the first two numbers${k?' and add '+k:''}: ${e} × ${f}${k?' + '+k:''} = ${answer}.`;
    } else if(family==='ratio') {
      const a=int(2,9),b=int(2,9),k=int(3,14);prompt='The ratio stays the same. What number replaces the question mark?';stimulus={kind:'ratio',values:[a,b,a*k,null]};answer=b*k;distractors=[b+k,a*b,b*k+1,a*k];explanation=`The left quantity is multiplied by ${k}, so the right quantity must also be multiplied by ${k}: ${b} × ${k} = ${answer}.`;
    } else if(family==='machine') {
      const m=int(2,6),b=int(1,15),a=int(2,10),c=a+int(1,5),d=c+int(1,5);
      prompt='The machine uses the same rule each time. Which output is missing?';stimulus={kind:'facts',lines:[`${a} → ${a*m+b}`,`${c} → ${c*m+b}`,`${d} → ${d*m+b}`,`${d+int(1,6)} → ?`]};const x=Number(stimulus.lines[3].split(' ')[0]);answer=x*m+b;distractors=[x+m+b,x*m-b,x*m,answer+1];explanation=`The machine multiplies its input by ${m} and adds ${b}. For ${x}, the output is ${answer}.`;
    } else {
      const a=int(2,12),b=int(2,20),x=int(2,18);prompt='What number makes this equation true? Follow the order of operations.';stimulus={kind:'equation',text:`${a} × ? + ${b} = ${a*x+b}`};answer=x;distractors=numOptions(answer);explanation=`Subtract ${b} from both sides, then divide by ${a}: (${a*x+b} − ${b}) ÷ ${a} = ${x}.`;
    }
  }
  if(answer===undefined)throw new Error(`Unknown task family ${domain}/${family}`);
  const fallback=()=>visualOptions?grid(int(0,answer.n===4?65535:511),answer.n):typeof answer==='number'?answer+int(-20,20):String(int(1,99));
  const options=choiceSet(answer,distractors,rng,fallback);
  return {id:`${domain}-${family}-${seed}-${level}`,domain,family,level,seed,prompt,stimulus,...options,explanation,visualOptions};
}
export function generateForm(seed,seen=new Set()) {
  const rng=rngFrom(seed),items=[],reserved=new Set(seen),inForm=new Set();
  for(const [domain,families] of Object.entries(FAMILIES)) {
    for(const level of [1,2])for(const family of shuffle(families,rng)) {
      let item,fp,tries=0;
      do{item=makeQuestion(domain,family,Math.floor(rng()*0xFFFFFFFF),level);fp=fingerprint(item);tries++;}while((reserved.has(fp)||inForm.has(fp))&&tries<2000);
      // Finite task families can eventually be exhausted. Keep retakes available,
      // mark exposure explicitly, and still prevent repetition within one form.
      while(inForm.has(fp)){item=makeQuestion(domain,family,Math.floor(rng()*0xFFFFFFFF),level);fp=fingerprint(item);}
      item.previouslySeen=seen.has(fp);
      reserved.add(fp);inForm.add(fp);items.push(item);
    }
  }
  return items;
}
export function sectionIndex(index){return Math.floor(index/8);}
export function sectionDeadline(now,mode='timed'){return mode==='practice'?null:now+7*60*1000;}
export function expired(deadline,now=Date.now()){return deadline!==null&&Number.isFinite(deadline)&&now>=deadline;}
export function scoreReasoning(items,answers){
  const domains=Object.fromEntries(Object.entries(IQ_DOMAINS).map(([k,v])=>[k,{name:v.name,correct:0,answered:0,total:0}]));
  for(const q of items){const d=domains[q.domain];d.total++;if(Number.isInteger(answers[q.id])&&answers[q.id]>=0){d.answered++;if(answers[q.id]===q.correct)d.correct++;}}
  const correct=Object.values(domains).reduce((s,d)=>s+d.correct,0),answered=Object.values(domains).reduce((s,d)=>s+d.answered,0);
  return {correct,answered,total:items.length,percent:Math.round(100*correct/items.length),domains,iq:null};
}
