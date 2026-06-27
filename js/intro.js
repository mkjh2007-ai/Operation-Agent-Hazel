/* ======================================
   CASE FILES
   INTRO CONTROLLER
====================================== */

const Intro = {

    async start(){

        await this.wait(2000);

        this.blinkLED();

        await this.typeStatus("INITIALIZING...");

        await this.fadeStatus();

        await this.typeStatus("ACCESSING ARCHIVE...");

        await this.fadeStatus();

        await this.scan();

        await this.typeStatus("SCANNING FACIAL RECOGNITION...");

        await this.wait(2300);

        await this.fadeStatus();

        document
            .getElementById("led")
            .classList
            .add("green");

        await this.typeStatus("IDENTITY VERIFIED");

        await this.wait(1200);

        await this.fadeStatus();

        await this.typeStatus("WELCOME AGENT H");

        await this.wait(1200);

        await this.fadeStatus();

        await this.typeStatus("WELCOME AGENT M");

        await this.wait(1700);

        this.openCRT();

    },



    async typeStatus(text){

        const box=document.getElementById("status");

        box.innerHTML="";

        for(let i=0;i<text.length;i++){

            box.innerHTML+=text[i];

            Audio.type();

            await this.wait(42);

        }

    },



    fadeStatus(){

        return new Promise(resolve=>{

            const box=document.getElementById("status");

            box.animate([

                {opacity:1},

                {opacity:0}

            ],{

                duration:500,

                fill:"forwards"

            });

            setTimeout(()=>{

                box.innerHTML="";

                box.style.opacity=1;

                resolve();

            },500);

        });

    },



    blinkLED(){

        document

            .getElementById("led")

            .style

            .animation="ledBlink .8s infinite";

    },



    scan(){

        return new Promise(resolve=>{

            const scanner=document.getElementById("scanner");

            scanner.style.opacity=1;

            scanner.style.animation="scanDown 1.8s linear";

            setTimeout(()=>{

                scanner.style.opacity=0;

                resolve();

            },1800);

        });

    },
    