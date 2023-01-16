let matieres = [
    ["HUMANITE LITT. PHILO.", "MAURANNE E.", "", "C1.17", "#FF0000"],
    ["FRANCAIS", "KOENIG M.", "", "C0.9 - TBI", "#DF7FFF"],
    ["VIE DE CLASSE", "BECLIE K.", "", "C2.1 - AMPHI", "#FF00C0"],
    ["VIE DE CLASSE", "ABRAM J.", "", "C1.19 VIDEO", "#C0C0C0"],
    ["HISTOIRE-GEOGRAPHIE", "SCHMITTBIEL C.", "", "F1.2 - BAN", "#00FF00"],
    ["ESPAGNOL LV3", "FUND-RAMIREZ M.", "[1ESP3GR1]", "C1.13", "#408080"],
    ["ESPAGNOL LV3", "GASMAN R.", "[1TG ESP3 GAS]", "C0.08 - VIDEO", "#408080"],
    ["ALLEMAND LV SECTION", "BRETEL-ANDRE M.", "[1ALL9GR1]", "C1.8", "#4EC2EE"],
    ["ENSEIGNEMENT SCIENTIFIQUE", "GODET F.", "", "C2.9 - AMPHI", "#C0C0C0"],
    ["ENSEIGNEMENT SCIENTIFIQUE", "KLEIN P.", "", "C1.1", "#C0C0C0"],
    ["ANGLAIS LV1", "TROTTER E.", "[1AGL1GR4]", "C0.9 - TBI", "#EFB4D9"],
    ["ENS. MORAL & CIVIQUE", "BECLIE K.", "", "C0.17 - TBI", "#800040"]
    
    
];

const lockTime = 3000;
let i,
    locked,
    lastDate,
    mouseUp;
if (typeof localStorage["ezcantine_i"] === "undefined") {
    i = Math.floor(Math.random() * matieres.length);
} else {
    i = parseInt(localStorage["ezcantine_i"]);
}

if (typeof localStorage["ezcantine_locked"] === "undefined") {
    locked = false;
} else {
    locked = (localStorage["ezcantine_locked"] === "true");
}

if (i >= matieres.length) {
    i = 0;
}
localStorage["ezcantine_i"] = ""+i;
let matiere = matieres[i];
setInterval(function () {
    if (!mouseUp && new Date().getTime() - lastDate > lockTime){
        $(".ezcantine").css("background-color", (locked ? "#00FF00" : "#FF0000"));
    }
    if ($(".ezcantine").get().length === 0) {
        // if ($(".collection-absencecours").first().get(0) == $(".collection-listecours").get(0).firstElementChild){
        //     $(".collection-absencecours").first().remove();
        // }

        let putAll = function(setclass){
            $('.flex-contain[aria-description="de 12h00 à 12h55"] .container-cours').html(`<div class="libelle-cours flex-contain">Pas de cours</div>`)
            $('.flex-contain[aria-description="de 12h00 à 12h55"] .container-cours').addClass("pas-de-cours");
            $('.flex-contain[aria-description="de 12h00 à 12h55"]').removeClass("cours-annule");
            $('.flex-contain[aria-description="de 12h00 à 12h55"]').addClass("Gris");
            $('.flex-contain[aria-description="de 12h00 à 12h55"] .trait-matiere').css("background-color", "#e2e2e2");

            if (setclass) $('.flex-contain[aria-description="de 13h05 à 14h00"]').addClass("ezcantine");
            $('.ezcantine .container-cours').removeClass("pas-de-cours");
            $('.ezcantine').removeClass("Gris");
            $('.ezcantine .container-cours').html(`
            <div class="libelle-cours flex-contain">`+matiere[0]+`</div>
            <div>`+matiere[1]+`</div><div></div><div></div><div>`+matiere[2]+`</div>
            <div>`+matiere[3]+`</div><div></div>
            <div class="flex-contain row-reverse"></div>`);
            $('.ezcantine .trait-matiere').css("background-color", matiere[4]);
            let up = function(){
                mouseUp = true;
                if (new Date().getTime() - lastDate > lockTime){
                    locked = !locked;
                    localStorage["ezcantine_locked"] = ""+locked;
                    setTimeout(function(){
                        $('.ezcantine').css("background-color", "#FFFFFF");
                    }, 500);
                }

                else if (!locked){
                    i += 1;
                    if (i >= matieres.length){
                        i = 0;
                    }
                    localStorage["ezcantine_i"] = ""+i;
                    matiere = matieres[i];
                    putAll(false);
                }
            }
            if (setclass){
                //$('.ezcantine').mouseup(up);
                $('.ezcantine').on("touchend",up);

            }

            $('.ezcantine').mousedown(function(){
                lastDate = new Date().getTime();
                mouseUp = false;
            });
            $('.ezcantine').on("touchstart",function(){
                lastDate = new Date().getTime();
                mouseUp = false;
            });

            

        }
        putAll(true);
        

        

        // $(".ezcantine").click(function(e){
        //     $("body").append("<ul id='ezcantine_overlay'></ul>");
        //     $("#ezcantine_overlay").css({
        //         position: "absolute",
        //         top: 0,
        //         left: 0,
        //         width: '100%',
        //         height: "100%",
        //         background: "white",
        //         "z-index": 1000
        //     });
        //     for (let i = 0, c = matieres.length ; i < c ; ++i){
        //         $("#ezcantine_overlay").append(
        //         `<li style='border: solid black 1px' role="listitem" aria-labelledby="id_111" tabindex="0" class="collection-item collection-cours ezcantine_choice">
        //     <div class="horaire-container"><span>13h00</span><span>13h55</span></div>
        //     <div class="li-wrapper" style="border-color: ` + matieres[i][4] + `;">
        //         <div class="item matiere">` + matieres[i][0] + `</div>
        //         <div class="item">` + matieres[i][1] + `</div>
        //         <div class="item">` + matieres[i][2] + `</div>
        //         <div class="item">` + matieres[i][3] + `</div>
        //     </div>
        // </li>`);
        //     }
        //     $(".ezcantine_choice").each(function(i,v){
        //         let matiere = matieres[i];
        //         $(v).click(function(e){
        //             $(".ezcantine").html(`<div class="horaire-container"><span>13h00</span><span>13h55</span></div>
        //             <div class="li-wrapper" style="border-color: ` + matiere[4] + `;">
        //                 <div class="item matiere">` + matiere[0] + `</div>
        //                 <div class="item">` + matiere[1] + `</div>
        //                 <div class="item">` + matiere[2] + `</div>
        //                 <div class="item">` + matiere[3] + `</div>
        //             </div>`);
        //             $("#ezcantine_overlay").remove();
        //         });
        //     });

        // });

    }
}, 100);
