console.log("INTRO LOADED");
const Intro = {

    async start() {

        await this.wait(2000);

        this.led(true);

        await this.type("INITIALIZING...");
        await this.fade();

        await this.type("ACCESSING ARCHIVE...");
        await this.fade();

        document.getElementById("scanner").style.opacity = 1;
        document.getElementById("scanner").style.animation = "scanDown 2s linear";

        await this.type("SCANNING FACIAL RECOGNITION...");
        await this.wait(2200);

        document.getElementById("scanner").style.opacity = 0;

        await this.fade();

        document.getElementById("led").classList.add("green");

        await this.type("IDENTITY VERIFIED");
        await this.wait(900);

        await this.fade();

        await this.type("ACCESS GRANTED");
        await this.wait(1000);

        await this.fade();

        await this.type("WELCOME AGENT H");
        await this.wait(1200);

        await this.fade();

        await this.type("WELCOME AGENT M");
        await this.wait(1400);

        this.openCRT();

    },

    async type(text){

        const status=document.getElementById("status");

        status.innerHTML="";

        for(let i=0;i<text.length;i++){

            status.innerHTML+=text[i];

            const Audio = {
    init(){},
    type(){},
    hum(){},
    beep(){}
};

window.Audio = Audio;

            await this.wait(40);

        }

    },

    fade(){

        return new Promise(resolve=>{

            const s=document.getElementById("status");

            s.animate(
                [
                    {opacity:1},
                    {opacity:0}
                ],
                {
                    duration:450,
                    fill:"forwards"
                }
            );

            setTimeout(()=>{

                s.innerHTML="";
                s.style.opacity=1;

                resolve();

            },450);

        });

    },

    led(on){

        if(on){

            document.getElementById("led").style.animation="ledBlink .8s infinite";

        }

    },

    openCRT(){

        document.getElementById("intro").style.display="none";

        const t=document.getElementById("transform");

        t.style.display="flex";

        document.getElementById("monitor").style.animation="crtBoot .9s forwards";

        // Chief starts here later

    },

    wait(ms){

        return new Promise(r=>setTimeout(r,ms));

    }

};

window.Intro = Intro;