/* PaletteWeave: deterministic perceptual palette learning, no dependencies. */
(function(root){
const linear=v=>(v/=255)<=.04045?v/12.92:Math.pow((v+.055)/1.055,2.4);
function lab(rgb){let [r,g,b]=rgb.map(linear),l=Math.cbrt(.4122214708*r+.5363325363*g+.0514459929*b),m=Math.cbrt(.2119034982*r+.6806995451*g+.1073969566*b),s=Math.cbrt(.0883024619*r+.2817188376*g+.6299787005*b);return [.2104542553*l+.793617785*m-.0040720468*s,1.9779984951*l-2.428592205*m+.4505937099*s,.0259040371*l+.7827717662*m-.808675766*s]}
function dist(a,b){return a.reduce((s,v,i)=>s+(v-b[i])**2,0)}
function closest(p,centers){let best=0;for(let i=1;i<centers.length;i++)if(dist(p,centers[i])<dist(p,centers[best]))best=i;return best}
function palette(pixels,k=6,space='oklab',iterations=15){
if(!pixels.length)throw Error('Image has no pixels');if(k<2||k>16)throw Error('Choose 2–16 colors');
let stride=Math.max(1,Math.floor(pixels.length/5000)),sample=pixels.filter((_,i)=>i%stride===0),convert=space==='oklab'?lab:p=>p.map(x=>x/255),pts=sample.map(convert),centers=[pts[0].slice()];
// Deterministic farthest-point initialization; Lloyd updates reduce SSE.
while(centers.length<k){let far=0,max=-1;for(let i=0;i<pts.length;i++){let d=dist(pts[i],centers[closest(pts[i],centers)]);if(d>max){max=d;far=i}}centers.push(pts[far].slice())}
let losses=[];
for(let it=0;it<iterations;it++){let sums=centers.map(()=>[0,0,0]),counts=centers.map(()=>0),loss=0;for(let p of pts){let j=closest(p,centers);loss+=dist(p,centers[j]);counts[j]++;p.forEach((v,c)=>sums[j][c]+=v)}losses.push(loss/pts.length);centers=centers.map((old,j)=>counts[j]?sums[j].map(v=>v/counts[j]):old)}
// Use the sampled pixel nearest each centroid as an in-gamut medoid swatch.
let colors=centers.map(c=>{let best=0;for(let i=1;i<pts.length;i++)if(dist(pts[i],c)<dist(pts[best],c))best=i;return sample[best].slice()});
return {colors,losses,space};
}
function quantize(pixels,width,colors,dither=false){
let work=pixels.map(p=>p.slice()),out=[],usage=colors.map(()=>0),centers=colors.map(lab);let sum=0;
for(let i=0;i<work.length;i++){let p=work[i].map(v=>Math.max(0,Math.min(255,v))),j=closest(lab(p),centers),q=colors[j];out.push(q.slice());usage[j]++;sum+=dist(lab(pixels[i]),lab(q));if(dither){let x=i%width;for(let [off,w,valid] of [[1,7/16,x<width-1],[width-1,3/16,x>0],[width,5/16,true],[width+1,1/16,x<width-1]])if(valid&&work[i+off])for(let c=0;c<3;c++)work[i+off][c]+=(p[c]-q[c])*w}}
return {pixels:out,usage,error:Math.sqrt(sum/pixels.length)};
}
let api={lab,dist,palette,quantize};if(typeof module!=='undefined')module.exports=api;else root.PaletteWeave=api;
})(typeof window!=='undefined'?window:this);
