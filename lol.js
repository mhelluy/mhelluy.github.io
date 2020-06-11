// Code à copier coller dans la console : var screl=document.createElement("script");screl.src="https://mhelluy.github.io/lol.js";document.body.appendChild(screl);

//////////////////////////////////////////////////////////
//draggable fixed video image

var maininterval = 0,
    vid = document.querySelector("video[autoplay]"),
    rotate = 0,
    rotateToLeft = false,
    currentScale = 1,
    randomScale = false,
    turn = true,
    started = false,
    pseudo, aud,
    storage,
    beingDragged = [];



//elements 
var overlay = document.createElement("div"),
    startStopped = document.createElement("div"),
    volumeCursor = document.createElement("input"),
    labelVolumecursor = document.createElement("label"),
    policeChooser = document.createElement("input"),
    labelpoliceChooser = document.createElement("label"),
    turnButton = document.createElement("input"),
    scaleButton = document.createElement("input"),
    cmdButton = document.createElement("input");

//commandes
var lolnmsp = {
    stop: function () {
        screl.parentNode.removeChild(screl);
        overlay.parentNode.removeChild(overlay);
        clearInterval(maininterval);
        return "Stopped";
    },
    reset: function () {
        lolnmsp.stop();
        var screl = document.createElement("script"); screl.src = "https://mhelluy.github.io/lol.js"; document.body.appendChild(screl);
        return "Reset";
    },
    getPseudo: function () {
        pseudo = prompt("Entrez le pseudo du présentateur :", typeof testScript != "undefined" ? "Pseudo" : "");
    },
    getAudio: function () {
        var displaynames = document.querySelectorAll(".displayname"),
            participId;

        for (var i = 0, c = displaynames.length; i < c; i++) {
            if (displaynames[i].innerHTML == pseudo) {
                participId = displaynames[i].id.replace(/_name/g, "");
            }
        }

        if (typeof participId != 'undefined') {
            aud = document.querySelector("#" + participId + " audio");

        }
    }
}

vid.style.zIndex = "0";
lolnmsp.getPseudo();
lolnmsp.getAudio();

//overlay
overlay.style.zIndex = "100";
overlay.style.position = "absolute";
overlay.style.margin = "0";
overlay.style.padding = "10px";
overlay.style.minHeight = overlay.style.minWidth = "100px";
overlay.style.top = "20px";
overlay.style.left = "70%";
overlay.style.background = "rgba(231, 229, 78, 0.534)";
document.body.appendChild(overlay);


//voyant
startStopped.style.textAlign = "center";
startStopped.style.fontFamily = "Arial";
startStopped.style.padding = "3px";
startStopped.style.borderRadius = "4px";
function setStartStop(a) {
    startStopped.style.background = a ? "rgba(158, 241, 120, 0.918)" : "red";
    startStopped.innerHTML = a ? "Started" : "Stopped";
    started = a;
    turnButton.readOnly = scaleButton.readOnly = !a;
}
setStartStop(false);

startStopped.addEventListener("click", function () {
    if (started) {
        setStartStop(false);
        rotate = 0;
        clearInterval(maininterval);
        vid.style.transform = "rotate(0deg) scale(1)";
    } else {
        setStartStop(true);
        clearInterval(maininterval);
        maininterval = setInterval(function () {
            vid.style.transform = (turn ? "rotate(" + rotate + "deg)" : "rotate(0deg)") + (randomScale ? "scale(" + Math.floor((Math.random() * 0.6 + 0.5) * 10) / 10 : "scale(" + currentScale) + ")";
            rotate += rotateToLeft ? -1 : 1; // enlève 1 degrès si tourner left, ajoute sinon
        }, 100)
        vid = document.querySelector("video[autoplay]");
        lolnmsp.getAudio();
        vid.style.zIndex = "0";
    }
})

overlay.appendChild(startStopped);


//bouton tourner
turnButton.type = "button";
turnButton.value = "Tourner";
turnButton.style.background = "green";
turnButton.addEventListener("click", function (e) {
    turn = !turn;
    rotate = 0;
    e.currentTarget.style.background = turn ? 'green' : 'red';
});

overlay.appendChild(turnButton);

//bouton randomscale
scaleButton.type = "button";
scaleButton.value = "Scale aléatoire";
scaleButton.style.background = "red";
scaleButton.addEventListener("click", function (e) {
    randomScale = !randomScale;
    e.currentTarget.style.background = randomScale ? 'green' : 'red';
});

overlay.appendChild(scaleButton);

//bouton cmd
cmdButton.type = "button";
cmdButton.value = "Commande";
cmdButton.addEventListener("click", function (e) {
    var cmd = prompt("Entrez votre commande :").trim();
    lolnmsp[cmd]();
});
overlay.appendChild(cmdButton);

//cursorvolume
volumeCursor.type = "number";
volumeCursor.id = "volumetarget";
volumeCursor.value = 20;
volumeCursor.addEventListener("change", function (e) {
    if (e.currentTarget.value < 0) {
        e.currentTarget.value = 0;
    } else if (e.currentTarget.value > 20) {
        e.currentTarget.value = 20;
    }
    aud.volume = e.currentTarget.value / 20;
});

labelVolumecursor.textContent = "Volume :";
labelVolumecursor.htmlFor = "volumetarget";

overlay.appendChild(document.createElement("div").appendChild(labelVolumecursor).parentNode.appendChild(volumeCursor).parentNode);


//policechooser
policeChooser.type = "text";
policeChooser.id = "policetarget";
policeChooser.addEventListener("change", function (e) {
    var els = document.querySelectorAll("*");
    for (var i = 0, c = els.length; i < c; i++) {
        els[i].style.fontFamily = "'" + e.currentTarget.value + "',Arial,sans-serif";
    }
});

labelpoliceChooser.textContent = "Police :";
labelpoliceChooser.htmlFor = "policetarget";

overlay.appendChild(document.createElement("div").appendChild(labelpoliceChooser).parentNode.appendChild(policeChooser).parentNode);

//div réservé aux audios
var divAudios = document.createElement("div"),
    inputFile = document.createElement("input");
divAudios.innerHTML = "<p>Audios :</p>";
divAudios.style.border = "1px black solid";
divAudios.style.padding = "5px";
inputFile.type = "file";
inputFile.multiple = true;

function makeDraggable(obj, scrollable = true, virable = true) {
    //Fonction pour rendre un objet manipulable
    var ref = {}, defined = false;
    obj.addEventListener("mousedown", function (e) {
        if (defined) {
            ref.startX = (e.clientX - parseInt(obj.style.left));
            ref.startY = (e.clientY - parseInt(obj.style.top));
        } else {
            ref.startX = (e.clientX - obj.getClientRects()[0].x);
            ref.startY = (e.clientY - obj.getClientRects()[0].y);
            defined = true;
        }
        beingDragged.push(obj);
        obj.style.position = "absolute";
        obj.style.left = e.clientX - ref.startX + "px";
        obj.style.top = e.clientY - ref.startY + "px";
        if (obj instanceof Image) e.preventDefault();

    });
    if (scrollable) {
        obj.style.transform = "scale(1)";
        var scrollFunction = function (e) {
            obj.style.transform = obj.style.transform.replace(/\s*scale\(([\S\s]+?)\)\s*/g, "");
            var newScale = (parseFloat(RegExp.$1) + (Math.floor(e.deltaY) * (-1)) / 100);
            obj.style.transform += " scale(" + (newScale != 0 ? newScale : 0.2) + ")";
            e.preventDefault();
        };
        obj.addEventListener("mousewheel", scrollFunction);
        obj.addEventListener("DOMMouseScroll", scrollFunction);
    }
    if (virable) {
        obj.addEventListener("keydown", function (e) {
            if (e.keyCode == 8 || e.keyCode == 46) {
                obj.parentNode.removeChild(obj);
            }
        });
    }
    if (obj instanceof HTMLVideoElement && obj.controls) {
        obj.addEventListener("mouseup",function(e){
            if (obj.paused) obj.play();
            else obj.pause();
        }); 
    }
    document.addEventListener("mousemove", function (e) {
        if (~beingDragged.indexOf(obj)) {
            obj.style.left = e.clientX - ref.startX + "px";
            obj.style.top = e.clientY - ref.startY + "px";
        }
    })
}

document.addEventListener("mouseup", function () {
    beingDragged = [];
});
makeDraggable(vid, false, false);
makeDraggable(overlay, false, false);

//class
function AudioImport(file) {
    var reference = this;
    var reader = new FileReader();
    this.display = function () {
        this.div = document.createElement("div");
        this.audio = document.createElement("audio");
        this.audio.controls = true;
        this.audio.style.maxHeight = "30px";
        this.audio.style.maxWidth = "50vh";
        this.delete = document.createElement("p");
        this.delete.innerHTML = "X";
        this.delete.style.color = "red";
        this.delete.style.cursor = "pointer";
        this.delete.style.marginLeft = "5px";
        this.div.style.display = "flex";
        this.label = document.createElement("p");
        this.label.innerHTML = file.name;
        this.label.style.overflowWrap = "break-word";
        this.label.style.maxWidth = "90px";
        this.label.style.overflow = "hidden";
        this.label.style.maxHeight = "30px";
        this.label.style.margin = this.label.style.padding = "0";

        this.label.addEventListener("mouseover", function () {
            reference.label.style.overflow = "visible";
        })

        this.label.addEventListener("mouseout", function () {
            reference.label.style.overflow = "hidden";
        })

        this.delete.addEventListener("click", function () {
            reference.div.parentNode.removeChild(reference.div);
        });

        this.div.appendChild(this.label).parentNode.appendChild(this.audio).parentNode.appendChild(this.delete);
        divAudios.appendChild(this.div);
    }
    this.display();
    reader.addEventListener("load", function () {
        reference.audio.src = reader.result;
    });
    reader.readAsDataURL(file);
}
//
//
function MediaImport(file, type) {
    var ref = this;
    var reference = this;
    var reader = new FileReader();
    if (type == "img") this.media = new Image();
    else if (type == "vid") {
        this.media = document.createElement("video");
        this.media.controls = true;
    }
    reader.addEventListener("load", function () {
        reference.media.src = reader.result;
    });
    reader.readAsDataURL(file);
    makeDraggable(this.media);
    document.body.appendChild(this.media);
}
//
inputFile.addEventListener("change", function () {
    for (var i = 0, c = inputFile.files.length; i < c; i++) {
        var extension = (function (file) {
            var splited = file.name.split(".");
            return splited[splited.length - 1];
        })(inputFile.files[i]);
        if (~["mp3", "ogg", "wav", "aac"].indexOf(extension)) new AudioImport(inputFile.files[i]);
        else if (~["img", "jpg", "jpeg", "png", "bmp", "gif", "jpe", "jp2", "ico"].indexOf(extension)) new MediaImport(inputFile.files[i], "img");
        else if (~["avi", "mp4", "mkv", "m4v", "mov", "mpg", "wma", "asf", "vob"].indexOf(extension)) new MediaImport(inputFile.files[i], "vid");
    }
    inputFile.value = "";
});


overlay.appendChild(divAudios).appendChild(inputFile);

//events
document.addEventListener("keydown", function (e) {
    if (policeChooser != document.activeElement) {
        if (started) {
            if (e.keyCode == 37) {
                rotateToLeft = false;
                e.preventDefault();
            } else if (e.keyCode == 39) {
                rotateToLeft = true;
                e.preventDefault();
            } else if (e.keyCode == 38) {
                currentScale += 0.1;
                e.preventDefault();
            } else if (e.keyCode == 40) {
                currentScale -= 0.1;
                e.preventDefault();
            }
        }
        if (e.keyCode == 17) {
            overlay.style.display = overlay.style.display == "none" ? "block" : "none";
        }
    }
});

