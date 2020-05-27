// Code à copier coller dans la console : var screl=document.createElement("script");screl.src="http://mhelluy.github.io/lol.js";document.body.appendChild(screl);

//////////////////////////////////////////////////////////


var maininterval = 0,
    vid = document.querySelector("video[autoplay]"),
    rotate = 0,
    rotateToLeft = false,
    currentScale = 1,
    randomScale = false,
    turn = true,

    //elements 
    overlay = document.createElement("div"),
    startStopped = document.createElement("div"),
    volumeCursor = document.createElement("input"),
    labelVolumecursor = document.createElement("label"),
    policeChooser = document.createElement("input"),
    labelpoliceChooser = document.createElement("label");

//overlay
overlay.style.position = "absolute";
overlay.style.margin = "0";
overlay.style.padding = "10px";
overlay.style.minHeight = overlay.style.minWidth = "100px";
overlay.style.top = "0";
overlay.style.left = "80%";
overlay.style.background = "rgba(231, 229, 78, 0.534)";
document.body.appendChild(overlay);


//voyant
startStopped.style.textAlign = "center";
startStopped.style.fontFamily = "Arial";
startStopped.style.padding = "3px";
startStopped.style.borderRadius = "4px";
function setStartStop(a){
    startStopped.style.background = a ? "rgba(158, 241, 120, 0.918)" : "red";
    startStopped.innerHTML = a ? "Started" : "Stopped";
}
setStartStop(false);

overlay.appendChild(startStopped);


//cursorvolume
volumeCursor.type = "number";
volumeCursor.id = "volumetarget";
volumeCursor.value = 20;
volumeCursor.addEventListener("change",function(e){
    if (e.currentTarget.value < 0){
        e.currentTarget.value = 0;
    } else if(e.currentTarget.value > 20){
        e.currentTarget.value = 20;
    }
    vid.volume = e.currentTarget.value/20;
});

labelVolumecursor.textContent = "Volume :";
labelVolumecursor.htmlFor = "volumetarget";

overlay.appendChild(document.createElement("div").appendChild(labelVolumecursor).parentNode.appendChild(volumeCursor).parentNode);


//policechooser
policeChooser.type = "text";
policeChooser.id = "policetarget";
policeChooser.addEventListener("change",function(e){
    var els = document.querySelectorAll("*");
    for (var i = 0, c = els.length ; i < c ; i++){
        els[i].style.fontFamily = "'" + e.currentTarget.value + "',Arial,sans-serif";
    }
});

labelpoliceChooser.textContent = "Police :";
labelpoliceChooser.htmlFor = "policetarget";

overlay.appendChild(document.createElement("div").appendChild(labelpoliceChooser).parentNode.appendChild(policeChooser).parentNode);



//events
document.addEventListener("keydown",function(e){
    vid = document.querySelector("video[autoplay]")
    if (policeChooser != document.activeElement){
        if (e.key == "s"){
            setStartStop(true);
            clearInterval(maininterval);
            maininterval = setInterval(function(){
                vid.style.transform = (turn ? "rotate(" + rotate + "deg)" : "rotate(0deg)") + (randomScale ? "scale(" + Math.floor((Math.random()*0.6 + 0.5)*10)/10 : "scale(" + currentScale) + ")";
                rotate += rotateToLeft ? -1 : 1; // enlève 1 degrès si tourner left, ajoute sinon
            },100)
        } else if (e.keyCode == 37){
            rotateToLeft = false;
            e.preventDefault();
        } else if (e.keyCode == 39){
            rotateToLeft = true;
            e.preventDefault();
        } else if (e.key == "c"){
            setStartStop(false);
            rotate = 0;
            clearInterval(maininterval);
            vid.style.transform = "rotate(0deg) scale(1)";
        } else if (e.key == "r"){
            randomScale = !randomScale;
        } else if (e.keyCode == 38){
            currentScale += 0.1;
        } else if (e.keyCode == 40){
            currentScale -= 0.1;
        } else if (e.key == "t"){
            turn = !turn;
            rotate = 0;
        }
    }
});