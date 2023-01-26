$(function() {
    let list = JSON.parse(localStorage['telziuq-lists'])[parseInt(location.search.replace(/\?listId=([0-9]+)\S*/g, "$1"))];

    $("h1").append(list["name"]);

    let cashN = 1;
    let okN = 4;

    let scores = {};
    let terms = [];
    let allterms = [];

    let currentCorrect = null;
    let currentI = 0;
    let suiv = 1;

    for (let term in list["terms"]) {
        terms.push(term);
        allterms.push(term);
        scores[term] = 0;
    }

    // on mélange les termes
    terms.sort((a,b)=>Math.random()-0.5);

    function preparerTerme(i){
        currentI = i;
        $("#suivant").hide();
        let term = terms[i];
        $("#def").html(term);
        if (scores[term] > cashN) {
            $("#choices").hide();
            $("#cash").show();
            $("#cash_ans").val("");
            $("#answer").focus();   
        } else {
            $("#choices").show();
            $("#cash").hide();
            let copy = allterms.slice();
            copy.sort((a,b)=>Math.random()-0.5);
            let okI = Math.floor(Math.random() * 4);
            copy = copy.slice(0, 3);
            for (let i = 0; i < 4; i++) {
                if (i == okI) {
                    $("#choice"+i).val(terms[term]);
                } else {
                    $("#choice"+i).val(terms[copy[i-1]]);
                }
            }
        }
        currentCorrect = list["terms"][term];
    }

    function correction(sol){
        suiv = currentI + 1;
        let term = terms[currentI];
        if (suiv >= terms.length) {
            suiv = 0;
        }
        if (sol == currentCorrect) {
            scores[term]++;
            if (scores[term] > okN) {
                terms.splice(terms.indexOf(term), 1);
                suiv --;
                if (terms.length == 0) {
                    alert("Bravo, vous avez terminé cette liste !");
                    location.href = "index.html";
                    return;
                }
            }
        } else {
            scores[term] --;
            if (scores[term] < 0){
                scores[term] = 0;
            }
            $("#retour").html("Mauvaise réponse, la bonne réponse était : " + currentCorrect);
        }
        $("#suivant").show();
    }

    $("#suivant").click(function(e){
        preparerTerme(terms[suiv]);
    });

    $("#choices button").click(function(e){
        e.preventDefault();
        correction($(this).val().trim());
    });

    $("#cash").submit(function(e){
        e.preventDefault();
        correction($("#cash_ans").val().trim());
    });

    preparerTerme(0);

    
});