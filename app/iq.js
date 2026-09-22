// Original, parameterized reasoning tasks. No copyrighted commercial IQ items.
// Difficulty levels are authored design levels, NOT calibrated item difficulty.
export const IQ_VERSION = 'reasoning-2.0';
export const IQ_SECTION_SIZE = 10;
export const IQ_SECTION_MINUTES = 12;
export const IQ_OPTIONS = 6;
export const IQ_DOMAINS = {
  matrix: {name:'Visual patterns', minutes:12, description:'Find transformations and relationships in grids.'},
  sequence: {name:'Number sequences', minutes:12, description:'Discover the rule that generates a sequence.'},
  spatial: {name:'Spatial reasoning', minutes:12, description:'Rotate, reflect, and mentally fold shapes.'},
  logic: {name:'Deductive logic', minutes:12, description:'Work out what must follow from the information given.'},
  quantity: {name:'Quantitative reasoning', minutes:12, description:'Compare quantities and solve numerical relationships.'},
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
  let guard=0;while(unique.length<IQ_OPTIONS&&guard++<200){const d=fallback();if(!unique.some(x=>same(x,d)))unique.push(d);}
  if(unique.length<IQ_OPTIONS)throw new Error('Could not construct distinct alternatives');
  const options=shuffle(unique.slice(0,IQ_OPTIONS),rng);return {options,correct:options.findIndex(v=>same(v,answer))};
}
export const FAMILIES = {
  matrix:['xor','overlay','turns','counts','rotateXor','subtractTurn'],
  sequence:['steps','multiply','differences','interleave','quadratic','alternateOps'],
  spatial:['rotation','reflection','fold','cube','doubleFold','compose'],
  logic:['ordering','sets','mapping','balance','conditional','ranking'],
  quantity:['table','ratio','machine','equation','twoEquations','compoundTable'],
};
export const ADVANCED_FAMILIES=Object.fromEntries(Object.entries(FAMILIES).map(([k,v])=>[k,v.slice(4)]));
export function makeQuestion(domain,family,seed,level=1) {
  const rng=rngFrom(seed),int=(lo,hi)=>lo+Math.floor(rng()*(hi-lo+1)),pick=(xs)=>xs[int(0,xs.length-1)];
  let prompt='',stimulus=null,answer,distractors=[],explanation='',visualOptions=false;
  const numOptions=(a)=>[a+1,a-1,a+int(2,7),a-int(2,7),a*2];
  const grid=(m,n=3)=>({kind:'tiles',mask:m,n});
  let nonSym=()=>{let m;do{m=int(1,65534);}while(new Set([m,rotate(m),rotate(rotate(m)),rotate(rotate(rotate(m)))]).size<4);return m;};
  if(domain==='matrix') {
    visualOptions=true;prompt='Which tile completes the pattern? The same rule applies across each row.';
    if(family==='xor'||family==='overlay'||family==='rotateXor'||family==='subtractTurn') {
      if(family==='rotateXor'||family==='subtractTurn'){
        const op=family==='rotateXor'?(a,b)=>a^rotate(b,3):(a,b)=>rotate(a&~b,3);
        const [a,b,c,d,e,f]=range(6).map(()=>int(24,487));
        stimulus={kind:'matrix',cells:[a,b,op(a,b),c,d,op(c,d),e,f,null].map(m=>m===null?null:grid(m))};
        answer=grid(op(e,f));
        distractors=[grid(e^f),grid(e|f),grid(rotate(e,3)^f),grid(rotate(f,3)),grid(mirror(answer.mask,3)),grid(511^answer.mask)];
        explanation=family==='rotateXor'?'In every row, rotate the middle tile one quarter turn clockwise, then retain filled squares that occur in exactly one of it and the first tile.':'In every row, remove the middle tile’s filled squares from the first tile, then rotate the remaining pattern one quarter turn clockwise.';
      }else{
      const op=family==='xor'?(a,b)=>a^b:(a,b)=>a|b;
      const a=int(1,510),b=int(1,510),c=int(1,510),d=int(1,510),e=int(1,510),f=int(1,510);
      stimulus={kind:'matrix',cells:[a,b,op(a,b),c,d,op(c,d),e,f,null].map(m=>m===null?null:grid(m))};
      answer=grid(op(e,f));distractors=[grid(family==='xor'?e|f:e^f),grid(e&f),grid(511^op(e,f)),grid(e)];
      explanation=family==='xor'?'In each row, a square is filled in the third tile only when it is filled in exactly one of the first two tiles (exclusive OR).':'In each row, the third tile contains every square filled in either of the first two tiles (union).';
      }
    } else if(family==='turns') {
      let a=int(1,510),b=int(1,510),c=int(1,510);while(rotate(c,3)===c)c=int(1,510);
      const turn=(m)=>level===1?rotate(m,3):rotate(rotate(rotate(m,3),3),3);
      stimulus={kind:'matrix',cells:[a,turn(a),turn(turn(a)),b,turn(b),turn(turn(b)),c,turn(c),null].map(m=>m===null?null:grid(m))};
      answer=grid(turn(turn(c)));distractors=[grid(c),grid(turn(c)),grid(511^answer.mask),grid(mirror(answer.mask,3))];
      explanation=`Each step to the right rotates the pattern 90° ${level===1?'clockwise':'counterclockwise'}. Apply that rotation to the middle tile of the last row.`;
    } else if(family==='counts') {
      visualOptions=false;const a=int(2,18),b=int(2,18),c=int(2,18),d=int(2,18),e=int(2,18),f=int(2,18),k=level===1?1:2;
      const op=(x,y)=>level===1?2*x+y:x*y+x;
      stimulus={kind:'numberMatrix',cells:[a,b,op(a,b),c,d,op(c,d),e,f,null]};answer=op(e,f);distractors=[e+f,e*f,Math.abs(e-f),answer+2,2*e+f,e*f+f];
      explanation=level===1?`In each row, double the first number and add the second: 2 × ${e} + ${f} = ${answer}.`:`In each row, multiply the first and second numbers, then add the first: ${e} × ${f} + ${e} = ${answer}.`;
    }
  } else if(domain==='sequence') {
    prompt='Which number comes next? Use the simplest consistent rule.';let seq=[];
    if(family==='steps'){const a=int(2,90),d=int(3,12),e=int(2,9),k=level===1?0:int(2,5);seq=[a];for(let i=0;i<5;i++)seq.push(seq.at(-1)+(i%2===0?d+Math.floor(i/2)*k:-e));answer=seq.at(-1)-e;explanation=`The operations alternate: add ${k?`a step that rises by ${k} each time`:`${d}`}, then subtract ${e}. The next step is ${seq.at(-1)} − ${e} = ${answer}.`;}
    if(family==='multiply'){const a=int(2,25),m=int(2,4),b=level===1?0:int(1,9);seq=[a];for(let i=0;i<4;i++)seq.push(seq.at(-1)*m+b);answer=seq.at(-1)*m+b;explanation=`Multiply by ${m}${b?' and add '+b:''} at each step. The next value is ${answer}.`;}
    if(family==='differences'){const a=int(2,100),d=int(2,9),step=int(1,level===1?4:9);seq=[a];for(let i=0;i<4;i++)seq.push(seq.at(-1)+d+i*step);answer=seq.at(-1)+d+4*step;explanation=`Successive increases are ${range(5).map(i=>d+i*step).join(', ')}. The increase itself rises by ${step} each time.`;}
    if(family==='interleave'){const a=int(2,80),b=int(90,180),d=int(2,15),e=int(2,15);seq=[a,b,a+d,b-e,a+2*d,b-2*e];answer=a+3*d;explanation=`Alternate positions form two sequences. Positions 1, 3, 5, 7 increase by ${d}; positions 2, 4, 6 decrease by ${e}. The next value is ${answer}.`;}
    if(family==='quadratic'){const a=int(3,60),d=int(2,12),k=int(2,7);seq=range(6).map(i=>a+i*d+i*i*k);answer=a+6*d+36*k;explanation=`The successive increases grow by ${2*k} each step; equivalently, term ${7} is ${a} + 6 × ${d} + 36 × ${k} = ${answer}.`;}
    if(family==='alternateOps'){const a=int(2,15),m=int(2,3),b=int(3,11);seq=[a];for(let i=0;i<5;i++)seq.push(i%2===0?seq.at(-1)*m:seq.at(-1)+b);answer=seq.at(-1)*m;explanation=`Alternate multiplying by ${m} and adding ${b}. The last move was + ${b}, so next is ${seq.at(-1)} × ${m} = ${answer}.`;}
    stimulus={kind:'sequence',values:seq};distractors=numOptions(answer);
  } else if(domain==='spatial') {
    if(family==='rotation'||family==='reflection'||family==='compose') {
      visualOptions=true;const mask=nonSym();let turns=level===1?1:3;
      if(family==='compose'){answer=grid(rotate(mask^0x9009),4);prompt='Toggle the four corner squares (filled becomes empty and empty becomes filled). Then rotate the tile 90° clockwise. Which tile results?';explanation='Invert only the four corners first, then rotate the whole tile one quarter turn clockwise.';}
      else if(family==='reflection'){answer=grid(mirror(mask),4);prompt='Which option is the reflection of this tile in a vertical mirror?';explanation='A vertical mirror reverses left and right in each row. It does not reverse top and bottom.';}
      else {let m=mask;for(let i=0;i<turns;i++)m=rotate(m);answer=grid(m,4);prompt=`Which option shows this tile rotated ${turns===1?'90° clockwise':'90° counterclockwise'}?`;explanation=`Rotate the whole tile ${turns===1?'clockwise':'counterclockwise'} by one quarter turn; filled squares keep their relative positions.`;}
      stimulus={kind:'single',tile:grid(mask,4)};distractors=[grid(mask,4),grid(rotate(rotate(mask)),4),grid(rotate(mask),4),grid(rotate(rotate(rotate(mask))),4),grid(mirror(mask),4),grid(rotate(mirror(mask)),4)];
    } else if(family==='fold'||family==='doubleFold') {
      visualOptions=true;let mask=int(1,255)&0x3333; if(!mask)mask=1; // punches in left half
      if(family==='doubleFold'){mask=[0,1,4,5].reduce((m,p)=>m|(int(0,1)<<p),0)||1;}
      else mask |= (int(0,3)<<8)|(int(0,3)<<12);
      prompt=family==='doubleFold'?'A sheet is folded first along its vertical center, then along its horizontal center. The shaded squares mark holes punched in the folded top-left quarter. Which pattern appears after it is fully opened?':'A square sheet is folded once along its vertical center. Holes are punched at the filled positions in the folded left half. Which pattern appears when it is opened?';
      const expanded=mask|mirror(mask),opened=family==='doubleFold'?expanded|rotate(rotate(expanded),4):expanded;
      stimulus={kind:'fold',tile:grid(mask,4),double:family==='doubleFold'};answer=grid(opened,4);distractors=[grid(mask,4),grid(expanded,4),grid(rotate(opened),4),grid(65535^opened,4),grid(mirror(mask),4),grid(rotate(mask),4)];
      explanation=family==='doubleFold'?'Each punched square is reflected across the vertical fold and again across the horizontal fold, creating four matching positions.':'Each hole appears at its original location and at its mirror location across the vertical fold. The opened pattern is left–right symmetric.';
    } else if(family==='cube') {
      const faces=shuffle(range(9).map(i=>i+1),rng).slice(0,6),which=int(0,5),opposites=[4,3,5,1,0,2];
      prompt=`Fold this net into a cube. Which number is on the face opposite ${faces[which]}?`;stimulus={kind:'cube',faces};answer=faces[opposites[which]];distractors=shuffle(faces.filter(x=>x!==answer),rng);
      explanation=`The opposite face pairs in this net are ${faces[0]}–${faces[4]}, ${faces[1]}–${faces[3]}, and ${faces[2]}–${faces[5]}. So ${answer} is opposite ${faces[which]}.`;
    } else {
      visualOptions=true;const mask=nonSym(),mirrored=mirror(mask),transformed=rotate(mirrored);prompt='First reflect the tile in a vertical mirror. Then rotate the result 90° clockwise. Which tile do you get?';stimulus={kind:'single',tile:grid(mask,4)};answer=grid(transformed,4);distractors=[grid(mask,4),grid(mirrored,4),grid(rotate(mask),4),grid(rotate(rotate(mask)),4),grid(rotate(rotate(mirrored)),4),grid(rotate(rotate(rotate(mask))),4)];explanation='Reflect left to right first; then rotate that reflected tile one quarter turn clockwise. Reversing the order can give a different tile.';
    }
  } else if(domain==='logic') {
    if(family==='ordering') {
      const labels=shuffle(['A','B','C','D','E','F','G','H','J'],rng).slice(0,6),order=shuffle(labels,rng),pos=int(1,4);
      prompt=`Six tiles are arranged in one row. Which tile must be in position ${pos+1}, counting from the left?`;
      stimulus={kind:'facts',lines:shuffle(range(5).map(i=>`${order[i]} is immediately to the left of ${order[i+1]}.`),rng)};answer=order[pos];distractors=labels.filter(x=>x!==answer);
      explanation=`The only possible left-to-right order is ${order.join(' → ')}. Position ${pos+1} is ${answer}.`;
    } else if(family==='sets') {
      const [a,b,c]=shuffle(['A','B','C','D','E','F','G','H','J','K','L','M'],rng).slice(0,3);
      prompt='Which statement must be true? Treat the labels as abstract groups.';
      if(level===1){stimulus={kind:'facts',lines:[`Every ${a} is a ${b}.`,`No ${b} is a ${c}.`]};answer=`No ${a} is a ${c}.`;distractors=[`Every ${c} is an ${a}.`,`Every ${b} is an ${a}.`,`Some ${a} are ${c}.`,`Some ${a} are ${b}.`,`Every ${b} is a ${c}.`];explanation=`Because all ${a} are inside group ${b}, and ${b} has no overlap with ${c}, no ${a} can be a ${c}. This does not require any ${a} to exist.`;}
      else {stimulus={kind:'facts',lines:[`Every ${a} is a ${b}.`,`At least one ${c} is an ${a}.`]};answer=`At least one ${c} is a ${b}.`;distractors=[`Every ${b} is a ${c}.`,`No ${c} is a ${b}.`,`Every ${c} is an ${a}.`,`No ${b} is a ${c}.`,`Every ${b} is an ${a}.`];explanation=`The ${c} that belongs to ${a} must also belong to ${b}. The premises guarantee this one overlap, not a universal relationship.`;}
    } else if(family==='mapping') {
      const [a,b,c]=shuffle(['●','▲','■','◆','★','⬟'],rng).slice(0,3),v=int(2,15),w=int(2,15),u=int(2,15);
      prompt='Each symbol always represents the same positive number. What is the missing value?';stimulus={kind:'facts',lines:[`${a} + ${a} = ${2*v}`,`${a} + ${b} = ${v+w}`,`${b} + ${c} = ${w+u}`,`${a} + ${c} = ?`]};answer=v+u;distractors=numOptions(answer);explanation=`${a} = ${v}, ${b} = ${w}, and ${c} = ${u}. Therefore ${a} + ${c} = ${answer}.`;
    } else if(family==='balance') {
      const a=int(2,8),b=int(2,8),c=int(2,8);
      prompt='The balances are exact. How many circles balance one square?';stimulus={kind:'facts',lines:[`1 square = ${a} triangles`,`1 triangle = ${b} diamonds`,`1 diamond = ${c} circles`]};answer=a*b*c;distractors=[a+b+c,a*b,a*c,answer+1];explanation=`Substitute through the three balances: ${a} × ${b} × ${c} = ${answer} circles.`;
    } else if(family==='conditional'){
      const [a,b,c,d]=shuffle(['A','B','C','D','E','F','G','H'],rng).slice(0,4);prompt='Which statement must be true? You may assume at least one item is in the first group.';stimulus={kind:'facts',lines:[`Every ${a} is a ${b}.`,`Every ${b} is a ${c}.`,`No ${c} is a ${d}.`,`At least one ${a} exists.`]};answer=`Some ${a} are not ${d}.`;distractors=[`Every ${b} is an ${a}.`,`Every ${c} is a ${b}.`,`Every ${d} is a ${c}.`,`Some ${d} are ${a}.`,`No ${b} is an ${a}.`];explanation=`At least one ${a} exists. Every ${a} belongs to ${b}, then ${c}; no ${c} belongs to ${d}. That ${a} therefore is not ${d}.`;
    } else if(family==='ranking'){
      const labels=shuffle(['A','B','C','D','E','F','G','H'],rng).slice(0,6),order=shuffle(labels,rng),pos=int(2,3);prompt=`Six objects have distinct weights. Which is the ${pos+1}${pos===2?'rd':'th'} heaviest?`;stimulus={kind:'facts',lines:shuffle(range(5).map(i=>`${order[i]} is heavier than ${order[i+1]}.`),rng)};answer=order[pos];distractors=labels.filter(x=>x!==answer);explanation=`The only descending weight order is ${order.join(' > ')}. The ${pos+1}${pos===2?'rd':'th'} object is ${answer}.`;
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
    } else if(family==='equation') {
      const a=int(2,12),b=int(2,20),x=int(2,18);prompt='What number makes this equation true? Follow the order of operations.';stimulus={kind:'equation',text:`${a} × ? + ${b} = ${a*x+b}`};answer=x;distractors=numOptions(answer);explanation=`Subtract ${b} from both sides, then divide by ${a}: (${a*x+b} − ${b}) ÷ ${a} = ${x}.`;
    } else if(family==='twoEquations'){
      const x=int(3,19),y=int(2,15),m=int(2,4),n=m+int(1,3);prompt='The same two positive numbers replace A and B in both equations. What is A?';stimulus={kind:'facts',lines:[`A + B = ${x+y}`,`${m} × A + ${n} × B = ${m*x+n*y}`]};answer=x;distractors=[y,x+y,m*x+n*y,Math.abs(x-y),x+1,x-1];explanation=`From the first equation, B = ${x+y} − A. Substitute into the second: ${m}A + ${n}(${x+y} − A) = ${m*x+n*y}, yielding A = ${x}.`;
    } else if(family==='compoundTable'){
      const k=int(2,5),v=range(6).map(()=>int(2,12)),[a,b,c,d,e,f]=v,op=(x,y)=>x*x+k*y;
      prompt='The same two-step rule links each row. What replaces the question mark?';stimulus={kind:'numberMatrix',cells:[a,b,op(a,b),c,d,op(c,d),e,f,null]};answer=op(e,f);distractors=[e*f+k,e*e+f,e*e+k+f,e*f*f+k,e*e-k*f,answer+1];explanation=`Square the first number, then add ${k} times the second: ${e}² + ${k} × ${f} = ${answer}.`;
    }
  }
  if(answer===undefined)throw new Error(`Unknown task family ${domain}/${family}`);
  const fallback=()=>visualOptions?grid(int(0,answer.n===4?65535:511),answer.n):typeof answer==='number'?answer+int(-30,30):pick(['A','B','C','D','E','F','G','H']);
  const options=choiceSet(answer,distractors,rng,fallback);
  return {id:`${domain}-${family}-${seed}-${level}`,domain,family,level,seed,prompt,stimulus,...options,explanation,visualOptions};
}
export function generateForm(seed,seen=new Set()) {
  const rng=rngFrom(seed),items=[],reserved=new Set(seen),inForm=new Set();
  for(const [domain,families] of Object.entries(FAMILIES)) {
    for(const level of [1,2,3])for(const family of shuffle(level===3?families.slice(4):families.slice(0,4),rng)) {
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
export function sectionIndex(index){return Math.floor(index/IQ_SECTION_SIZE);}
export function sectionDeadline(now,mode='timed',minutes=IQ_SECTION_MINUTES){return mode==='practice'?null:now+minutes*60*1000;}
export function expired(deadline,now=Date.now()){return deadline!==null&&Number.isFinite(deadline)&&now>=deadline;}
export function provisionalIq(correct,total){
  if(total!==50)return null;
  // An explicitly assumed, uncalibrated anchor, rounded to five-point steps.
  // This number is a design estimate and cannot be interpreted as a normed IQ.
  return Math.round((100+15*(correct-25)/8)/5)*5;
}
export function scoreReasoning(items,answers,mode='timed'){
  const domains=Object.fromEntries(Object.entries(IQ_DOMAINS).map(([k,v])=>[k,{name:v.name,correct:0,answered:0,total:0}]));
  for(const q of items){const d=domains[q.domain];d.total++;if(Number.isInteger(answers[q.id])&&answers[q.id]>=0){d.answered++;if(answers[q.id]===q.correct)d.correct++;}}
  const correct=Object.values(domains).reduce((s,d)=>s+d.correct,0),answered=Object.values(domains).reduce((s,d)=>s+d.answered,0);
  return {correct,answered,total:items.length,percent:Math.round(100*correct/items.length),domains,iq:mode==='timed'?provisionalIq(correct,items.length):null};
}
