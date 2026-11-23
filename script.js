const cv=document.getElementById('cv'),$=id=>document.getElementById(id);
const R=new THREE.WebGLRenderer({canvas:cv,antialias:true});
const S=new THREE.Scene();S.background=new THREE.Color(0x1b2433);
const cam=new THREE.PerspectiveCamera(50,1,.1,100);
let th=.7,ph=.95,rad=11;
function setCam(){cam.position.set(rad*Math.sin(ph)*Math.sin(th),rad*Math.cos(ph)+1,rad*Math.sin(ph)*Math.cos(th));cam.lookAt(0,1.2,0)}
function rs(){const w=cv.clientWidth,h=cv.clientHeight;R.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix();rad=w<500?14:11;setCam()}
addEventListener('resize',rs);
let drag=false,lx=0,ly=0;
cv.addEventListener('pointerdown',e=>{drag=true;lx=e.clientX;ly=e.clientY;cv.setPointerCapture(e.pointerId)});
cv.addEventListener('pointerup',()=>drag=false);
cv.addEventListener('pointermove',e=>{if(!drag)return;th-=(e.clientX-lx)*.01;ph=Math.min(1.5,Math.max(.4,ph-(e.clientY-ly)*.008));lx=e.clientX;ly=e.clientY;setCam()});
const amb=new THREE.AmbientLight(0xffffff,.6);S.add(amb);
const pl=[new THREE.PointLight(0xfff2cc,0,14),new THREE.PointLight(0xfff2cc,0,14)];
pl[0].position.set(-2.5,2.8,0);pl[1].position.set(2.5,2.8,0);pl.forEach(p=>S.add(p));
const rm=[];
function box(w,h,d,c,x,y,z,list){const m=new THREE.MeshLambertMaterial({color:c});const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);b.position.set(x,y,z);S.add(b);if(list)rm.push([m,c]);return b}
box(10,.1,7,0x8a7a64,0,-.05,0,1);box(10,3.2,.1,0xcfd6df,0,1.6,-3.5,1);box(.1,3.2,7,0xcfd6df,-5,1.6,0,1);
const win=new THREE.Mesh(new THREE.PlaneGeometry(4,1.6),new THREE.MeshBasicMaterial({color:0x9fd3ff}));win.position.set(-4.93,1.8,0);win.rotation.y=Math.PI/2;S.add(win);
const slots=[];[-1.2,1.6].forEach(z=>[-3,-1.5,0,1.5,3].forEach(x=>slots.push([x,z])));
slots.forEach(s=>{box(1,.07,.6,0x6b4f33,s[0],.75,s[1],1);box(.06,.75,.06,0x444,s[0]-.4,.37,s[1]);box(.06,.75,.06,0x444,s[0]+.4,.37,s[1])});
const panels=[[-2.5,0],[2.5,0],[-2.5,2],[2.5,2]].map(p=>{const m=new THREE.MeshBasicMaterial({color:0x444444});const b=new THREE.Mesh(new THREE.BoxGeometry(1.6,.06,.5),m);b.position.set(p[0],3,p[1]-1);S.add(b);return m});
const fans=[-2.5,2.5].map(x=>{const g=new THREE.Group();g.position.set(x,2.7,.5);for(let i=0;i<3;i++){const b=new THREE.Mesh(new THREE.BoxGeometry(1.5,.03,.2),new THREE.MeshLambertMaterial({color:0xdddddd}));b.rotation.y=i*Math.PI*2/3;b.position.set(0,0,0);const w=new THREE.Group();w.rotation.y=i*Math.PI*2/3;b.rotation.y=0;b.position.x=.7;w.add(b);g.add(w)}
const hub=new THREE.Mesh(new THREE.CylinderGeometry(.15,.15,.15,12),new THREE.MeshLambertMaterial({color:0x333333}));g.add(hub);S.add(g);return g});
const sens=new THREE.Mesh(new THREE.BoxGeometry(.3,.15,.3),new THREE.MeshLambertMaterial({color:0x222222}));sens.position.set(0,3.1,-3.3);S.add(sens);
const cone=new THREE.Mesh(new THREE.ConeGeometry(3.2,3,24,1,true),new THREE.MeshBasicMaterial({color:0x888888,transparent:true,opacity:.08,side:THREE.DoubleSide}));cone.position.set(0,1.6,-3.3+0);cone.position.z=-.2;cone.position.y=1.6;S.add(cone);
const led=new THREE.Mesh(new THREE.SphereGeometry(.06,8,8),new THREE.MeshBasicMaterial({color:0xff3333}));led.position.set(0,3.1,-3.1);S.add(led);
let thermal=false;const people=[];
function mkPerson(i){const g=new THREE.Group();const m=new THREE.MeshLambertMaterial({color:0x3b82f6});
const b=new THREE.Mesh(new THREE.CylinderGeometry(.2,.26,.8,12),m);b.position.y=.95;const h=new THREE.Mesh(new THREE.SphereGeometry(.18,12,12),m);h.position.y=1.55;g.add(b,h);g.position.set(slots[i][0],0,slots[i][1]+.6);g.userData.m=m;S.add(g);return g}
function paintP(){people.forEach(p=>{p.userData.m.color.set(thermal?0xff8a1f:0x3b82f6);p.userData.m.emissive.set(thermal?0xff3300:0x000000)})}
function setThermal(v){thermal=v;S.background.set(v?0x120a2a:0x1b2433);rm.forEach(r=>r[0].color.set(v?0x2a1d5c:r[1]));paintP();$('th').classList.toggle('p',v)}
function add(){if(people.length<10){const i=people.length;people.push(mkPerson(i));paintP()}}
function rem(){const p=people.pop();if(p)S.remove(p)}
$('add').onclick=add;$('rem').onclick=rem;$('clr').onclick=()=>{while(people.length)rem()};$('th').onclick=()=>setThermal(!thermal);
$('day').oninput=e=>$('dl').textContent=e.target.value;
let dtm=null;$('demo').onclick=()=>{if(dtm){clearInterval(dtm);dtm=null;$('demo').classList.remove('p');return}$('demo').classList.add('p');let up=true;dtm=setInterval(()=>{if(up){add();if(people.length>=8)up=false}else{rem();if(!people.length)up=true}},900)};
for(let i=0;i<4;i++)add();
let empty=0,eB=0,eO=0,on=true,last=performance.now();
function setC(id,t,s){const c=$(id);c.className='chip '+(s?'on':'off');c.querySelector('b').textContent=t}
function tick(now){const dt=Math.min((now-last)/1000,.2);last=now;
const day=+$('day').value,occ=people.length>0;
if(occ){empty=0;on=true}else{empty+=dt;if(empty>=5)on=false}
const lv=on?(day>70?0:day>35?.5:1):0,fv=on?1:0;
const P=72*lv+120*fv;eB+=192*dt/60;eO+=P*dt/60;
panels.forEach(m=>m.color.set(lv?new THREE.Color(0xfff2b0).multiplyScalar(.4+.6*lv):0x444444));
pl.forEach(p=>p.intensity=lv*1.1);amb.intensity=.25+day/100*.55;win.material.color.set(new THREE.Color(0x9fd3ff).multiplyScalar(.25+day/100*.75));
fans.forEach(f=>f.rotation.y+=fv*dt*9);
cone.material.color.set(occ?0xff7a1a:0x888888);cone.material.opacity=occ?.16:.06;led.material.color.set(occ?0x33ff66:0xff3333);
setC('cOcc',occ?'Occupied':(on?'Empty ('+Math.ceil(5-empty)+'s)':'Empty'),occ);
setC('cLt',lv===0?'OFF':lv<1?'DIM 50%':'ON',lv>0);setC('cFan',fv?'ON':'OFF',fv);
$('vN').textContent=people.length;$('eB').textContent=eB.toFixed(1)+' Wh';$('eO').textContent=eO.toFixed(1)+' Wh';
$('sv').textContent=(eB>0?Math.max(0,(1-eO/eB)*100):0).toFixed(0)+'%';
R.render(S,cam);requestAnimationFrame(tick)}
rs();requestAnimationFrame(tick);