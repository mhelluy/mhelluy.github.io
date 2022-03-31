let matieres = [
    ["HUMANITE LITT. PHILO.", "MAURANNE E.", "", "C1.17", "#FF0000"],
    ["FRANCAIS", "KOENIG M.", "", "C0.9 - TBI", "#DF7FFF"],
    ["VIE DE CLASSE", "BECLIE K.", "", "C2.1 - AMPHI", "#FF00C0"],
    ["HISTOIRE-GEOGRAPHIE", "SCHMITTBIEL C.", "", "F1.2 - BAN", "#00FF00"],
    ["ESPAGNOL LV3", "FUND-RAMIREZ M.", "[1ESP3GR1]", "C1.13", "#408080"],
    ["ALLEMAND LV SECTION", "BRETEL-ANDRE M.", "[1ALL9GR1]", "C1.8", "#4EC2EE"],
    ["ENSEIGNEMENT SCIENTIFIQUE", "GODET F.", "", "C2.9 - AMPHI", "#C0C0C0"],
    ["ENSEIGNEMENT SCIENTIFIQUE", "KLEIN P.", "", "C1.1", "#C0C0C0"],
    ["ANGLAIS LV1", "TROTTER E.", "[1AGL1GR4]", "C0.9 - TBI", "#EFB4D9"],
    ["ENS. MORAL & CIVIQUE", "BECLIE K.", "", "C0.17 - TBI", "#800040"]
    
    
];
setInterval(function () {
    if ($(".ezcantine").get().length === 0) {

        matiere = matieres[Math.floor(Math.random() * matieres.length)];
        if ($(".collection-absencecours").first().get(0) == $(".collection-listecours").get(0).firstElementChild){
            $(".collection-absencecours").first().remove();
        }
        $(".collection-absencecours").first().after(`<li role="listitem" aria-labelledby="id_111" tabindex="0" class="collection-item collection-cours ezcantine">
            <div class="horaire-container"><span>13h00</span><span>13h55</span></div>
            <div class="li-wrapper" style="border-color: ` + matiere[4] + `;">
                <div class="item matiere">` + matiere[0] + `</div>
                <div class="item">` + matiere[1] + `</div>
                <div class="item">` + matiere[2] + `</div>
                <div class="item">` + matiere[3] + `</div>
            </div>
        </li>`);

        $(".ezcantine").click(function(e){
            $("body").append("<ul id='ezcantine_overlay'></ul>");
            $("#ezcantine_overlay").css({
                position: "absolute",
                top: 0,
                left: 0,
                width: '100%',
                height: "100%",
                background: "white",
                "z-index": 1000
            });
            for (let i = 0, c = matieres.length ; i < c ; ++i){
                $("#ezcantine_overlay").append(
                `<li style='border: solid black 1px' role="listitem" aria-labelledby="id_111" tabindex="0" class="collection-item collection-cours ezcantine_choice">
            <div class="horaire-container"><span>13h00</span><span>13h55</span></div>
            <div class="li-wrapper" style="border-color: ` + matieres[i][4] + `;">
                <div class="item matiere">` + matieres[i][0] + `</div>
                <div class="item">` + matieres[i][1] + `</div>
                <div class="item">` + matieres[i][2] + `</div>
                <div class="item">` + matieres[i][3] + `</div>
            </div>
        </li>`);
            }
            $(".ezcantine_choice").each(function(i,v){
                let matiere = matieres[i];
                $(v).click(function(e){
                    $(".ezcantine").html(`<div class="horaire-container"><span>13h00</span><span>13h55</span></div>
                    <div class="li-wrapper" style="border-color: ` + matiere[4] + `;">
                        <div class="item matiere">` + matiere[0] + `</div>
                        <div class="item">` + matiere[1] + `</div>
                        <div class="item">` + matiere[2] + `</div>
                        <div class="item">` + matiere[3] + `</div>
                    </div>`);
                    $("#ezcantine_overlay").remove();
                });
            });

        });

    }
}, 100);
