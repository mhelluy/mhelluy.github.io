$(function() {
    let list = JSON.parse(localStorage['telziuq-lists'])[parseInt(location.search.replace(/\?listId=([0-9]+)\S*/g, "$1"))];

    $("h1").append(list["name"]);

    let cashN = 1;
    let okN = 4;

    let scores = {};

    let repondu = false;

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

    $("#progress").attr("max", terms.length*okN);

    function preparerTerme(i){
        repondu = false;
        $("#retour").html("");
        currentI = i;
        $("#suivant").hide();
        let term = terms[i];
        $("#def").html(term);
        if (scores[term] >= cashN) {
            $("#choices").hide();
            $("#cash").show();
            $("#cash_ans").val("");
            $("#answer").focus();   
        } else {
            $("#choices").show();
            $("#cash").hide();
            let copy = allterms.slice();
            if (copy.length < 4){
                while (copy.length < 4) {
                    copy.push(copy[0]);
                }
            } else {
                do {
                    copy.sort((a,b)=>Math.random()-0.5);
                } while (~[0,1,2].indexOf(copy.indexOf(term)));
            }
            let okI = Math.floor(Math.random() * 4);
            copy = copy.slice(0, 3);
            for (let i = 0; i < 4; i++) {
                if (i === okI) {
                    $("#choice"+i).val(list["terms"][term]);
                    okI = -1;
                } else {
                    $("#choice"+i).val(list["terms"][copy[i-(okI === -1 ? 1 : 0)]]);
                }
            }
        }
        currentCorrect = list["terms"][term];
    }

    function correction(sol){
        repondu = true;
        suiv = (currentI + 1) % terms.length;
        let term = terms[currentI];
        if (suiv >= terms.length) {
            suiv = 0;
        }
        if (sol == currentCorrect) {
            scores[term]++;
            $("#progress").val(parseInt($("#progress").val()) + 1);
            if (scores[term] >= okN) {
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
            $("#progress").val(parseInt($("#progress").val()) - 1);
            if (scores[term] < 0){
                scores[term] = 0;
            }
            $("#retour").html("Mauvaise réponse, la bonne réponse était : " + currentCorrect);
        }
        $("#suivant").show();
    }

    $("#suivant").click(function(e){
        currentI = (currentI + 1) % terms.length;
        preparerTerme(currentI);
    });

    $("#choices input[type=button]").click(function(e){
        e.preventDefault();
        if (!repondu) correction($(this).val().trim());
    });

    $("#cash").submit(function(e){
        e.preventDefault();
        if (repondu) $("#suivant").trigger("click");
        else correction($("#cash_ans").val().trim());
    });

    preparerTerme(0);

    
});