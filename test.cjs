const assert=require('node:assert/strict'),P=require('./core.js');
let pixels=Array.from({length:100},(_,i)=>[i*2,100,i]);let a=P.palette(pixels,6),b=P.palette(pixels,6);assert.deepEqual(a,b);
for(let i=1;i<a.losses.length;i++)assert(a.losses[i]<=a.losses[i-1]+1e-10);
for(let d of [false,true]){let q=P.quantize(pixels,10,a.colors,d);assert.equal(q.pixels.length,100);assert.equal(q.usage.reduce((a,b)=>a+b),100);assert(q.pixels.every(p=>a.colors.some(c=>JSON.stringify(p)===JSON.stringify(c))));assert(Number.isFinite(q.error))}
assert(P.lab([0,0,0]).every(v=>Math.abs(v)<1e-8));assert(Math.abs(P.lab([255,255,255])[0]-1)<1e-6);console.log('PASS: reproducibility, clustering descent, palette membership, dimensions, usage and colour anchors');
