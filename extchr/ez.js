let matieres = [
    ["HUMANITE LITT. PHILO.", "MAURANNE E.", "", "C1.17", "#FF0000"],
    ["FRANCAIS", "KOENIG M.", "", "C0.9 - TBI", "#DF7FFF"],
    ["VIE DE CLASSE", "BECLIE K.", "", "C2.1 - AMPHI", "#FF00C0"],
    ["HISTOIRE-GEOGRAPHIE", "SCHMITTBIEL C.", "", "F1.2 - BAN", "#00FF00"]
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

    }
}, 100);
