import{initializeApp,cert}from"firebase-admin/app";
import{getFirestore}from"firebase-admin/firestore";
import{getMessaging}from"firebase-admin/messaging";
initializeApp({credential:cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))});
const db=getFirestore(),fcm=getMessaging();
const API="https://site.api.espn.com/apis/site/v2/sports/soccer/";
const LG={"La Liga":"esp.1","Premier League":"eng.1"};
const fd=d=>d.toISOString().slice(0,10).replace(/-/g,"");
const now=Date.now(),rng=`${fd(new Date(now-864e5))}-${fd(new Date(now+864e5))}`;
const ref=db.doc("state/matches"),old=(await ref.get()).data()||{},next={},msgs=[];
for(const[lg,code]of Object.entries(LG)){
  let j;
  try{const r=await fetch(`${API}${code}/scoreboard?dates=${rng}&limit=100`);if(!r.ok)throw new Error(r.status);j=await r.json()}
  catch(e){console.log("ESPN no respondió:",lg,e.message);continue}
  for(const e of j.events||[]){
    const c=e.competitions[0].competitors,h=c.find(x=>x.homeAway==="home")||c[0],a=c.find(x=>x.homeAway==="away")||c[1];
    const st=e.status.type.state,hs=+h.score||0,as=+a.score||0,t=Date.parse(e.date),p=old[e.id];
    const cur={st,hs,as,t,s:p?.s||0,f:p?.f||0};
    const name=`${h.team.displayName} ${hs}–${as} ${a.team.displayName}`;
    if(st==="in"&&p&&hs+as>p.hs+p.as)msgs.push({k:"goals",title:`Gol · ${name}`,body:`${lg} · ${e.status.type.shortDetail}`,tag:`g${e.id}-${hs+as}`});
    if(st==="post"){if(p&&!p.f)msgs.push({k:"final",title:`Final · ${name}`,body:lg,tag:`f${e.id}`});cur.f=1}
    const mins=(t-now)/6e4;
    if(st==="pre"&&mins>0&&mins<=20&&!cur.s){msgs.push({k:"start",title:`Empieza pronto · ${h.team.displayName} vs ${a.team.displayName}`,body:`${lg} · en unos ${Math.round(mins)} min`,tag:`s${e.id}`});cur.s=1}
    next[e.id]=cur;
  }
}
for(const[id,v]of Object.entries(old))if(!next[id]&&v.t>now-3*864e5)next[id]=v;
if(msgs.length){
  const devs=(await db.collection("devices").get()).docs.map(d=>({id:d.id,prefs:d.data().prefs||{}}));
  for(const m of msgs){
    const toks=devs.filter(d=>d.prefs[m.k]).map(d=>d.id);
    for(let i=0;i<toks.length;i+=500){
      const chunk=toks.slice(i,i+500);
      const res=await fcm.sendEachForMulticast({tokens:chunk,data:{title:m.title,body:m.body,tag:m.tag},webpush:{headers:{Urgency:"high"}}});
      await Promise.all(res.responses.map((r,n)=>!r.success&&/not-registered|invalid-registration/.test(r.error?.code||"")?db.doc(`devices/${chunk[n]}`).delete():0));
    }
    console.log("Aviso enviado:",m.title,"→",toks.length,"dispositivos");
  }
}
await ref.set(next);
console.log("Revisión lista. Partidos:",Object.keys(next).length,"Avisos:",msgs.length);
