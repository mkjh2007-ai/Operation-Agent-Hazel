const Intro={
 async start(){
  await this.wait(2000);
  document.getElementById("led").classList.add("on");

  await this.line("INITIALIZING...");
  await this.fade();

  await this.line("ACCESSING ARCHIVE...");
  await this.fade();

  const scanner=document.getElementById("scanner");
  scanner.style.opacity=1;
  scanner.style.animation="scanDown 3.2s ease-in-out";
  await this.line("SCANNING FACIAL RECOGNITION...");
  await this.wait(2600);
  scanner.style.opacity=0;
  await this.fade();

  document.getElementById("led").classList.add("green");

  await this.line("IDENTITY VERIFIED");
  await this.wait(900);
  await this.fade();

  await this.line("ACCESS GRANTED");
  await this.wait(900);
  await this.fade();

  await this.line("WELCOME AGENT H");
  await this.wait(900);
  await this.fade();

  await this.line("WELCOME AGENT M");
  await this.wait(1200);
  await this.openCRT();
 },
 async line(text){
  const s=document.getElementById("status");
  s.innerHTML="";
  for(let i=0;i<text.length;i++){
   s.innerHTML+=text[i];
   if(window.Audio&&Audio.type) Audio.type();
   await this.wait(45);
  }
 },
 fade(){
  return new Promise(resolve=>{
   const s=document.getElementById("status");
   s.animate([{opacity:1},{opacity:0}],{duration:520,fill:"forwards"});
   setTimeout(()=>{s.innerHTML="";s.style.opacity=1;resolve();},520);
  });
 },
 openCRT(){
  return new Promise(resolve=>{
   document.getElementById("intro").style.display="none";
   const t=document.getElementById("transform");
   const m=document.getElementById("monitor");
   t.style.display="flex";
   m.style.animation="crtBoot 1.3s cubic-bezier(.2,.8,.2,1) forwards";
   setTimeout(()=>this.chiefIntro(),1500);
   resolve();
  });
 },
 async chiefIntro(){
  const sub=document.getElementById("subtitle");
  sub.innerHTML="";
  await this.wait(600);
  await this.typeSubtitle("*Ahem.*");
  await this.wait(700);
  await this.clearSubtitle();
  await this.typeSubtitle("Good evening, Agents.");
 },
 async typeSubtitle(text){
  const s=document.getElementById("subtitle");
  s.innerHTML="";
  for(let i=0;i<text.length;i++){
   s.innerHTML+=text[i];
   if(window.Audio&&Audio.type) Audio.type();
   await this.wait(38);
  }
 },
 clearSubtitle(){
  return new Promise(resolve=>{
   const s=document.getElementById("subtitle");
   s.animate([{opacity:1},{opacity:0}],{duration:450,fill:"forwards"});
   setTimeout(()=>{s.innerHTML="";s.style.opacity=1;resolve();},450);
  });
 },
 wait(ms){return new Promise(r=>setTimeout(r,ms))}
};