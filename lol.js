// Code à copier coller dans la console : var screl=document.createElement("script");screl.src="http://mhelluy.github.io/lol.js";document.body.appendChild(screl);

//////////////////////////////////////////////////////////


var maininterval = 0,
    rotate = 0,
    rotateToLeft = false,
    currentScale = 1,
    randomScale = false,
    turn = true;

document.addEventListener("keydown",function(e){
    vid = document.querySelector("video[autoplay]")
    if (e.key == "s"){
        console.log("ptdr");
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
});