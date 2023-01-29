$(function() {
    let list = JSON.parse(localStorage['telziuq-lists'])[parseInt(location.search.replace(/\?listId=([0-9]+)\S*/g, "$1"))];

    $("h1").append(list["name"]);

    if (typeof localStorage['telziuq-cashN'] === "undefined") localStorage['telziuq-cashN'] = "1";
    if (typeof localStorage['telziuq-okN'] === "undefined") localStorage['telziuq-okN'] = "4";

    let cashN = parseInt(localStorage['telziuq-cashN']);
    let okN = parseInt(localStorage['telziuq-okN']);

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
        $("#force_correct").hide();
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
                    $("#choice"+i).val(list["terms"][term][0]);
                    okI = -1;
                } else {
                    $("#choice"+i).val(list["terms"][copy[i-(okI === -1 ? 1 : 0)]][0]);
                }
            }
        }
        currentCorrect = list["terms"][term];
    }

    function correction(sol,force){
        repondu = true;
        suiv = (currentI + 1) % terms.length;
        let term = terms[currentI];
        if (suiv >= terms.length) {
            suiv = 0;
        }
        if (force || RegExp(currentCorrect[1],currentCorrect[2]).test(sol) || sol === currentCorrect[0]) {
            scores[term]++;
            $("#progress").val(parseInt($("#progress").val()) + 1);
            if (force && scores[term] > 1){
                scores[term]++;
                $("#progress").val(parseInt($("#progress").val()) + 1);
            }
            if (scores[term] >= okN) {
                terms.splice(terms.indexOf(term), 1);
                suiv --;
            }
            $("#retour").html("Bonne réponse : " + currentCorrect[0]);
            $("#retour").css("color", "green");
        } else {
            scores[term] --;
            if (scores[term] < 0){
                scores[term] = 0;
            } else {
                $("#progress").val(parseInt($("#progress").val()) - 1);
            }
            $("#retour").html("Mauvaise réponse, la bonne réponse était : " + currentCorrect[0]);
            $("#retour").css("color", "red");
            $("#force_correct").show();
        }
        
        if (terms.length == 0) {
            setTimeout(function(){
            alert("Bravo, vous avez terminé cette liste !");
            location.href = "index.html";},100);
            return;
        } else $("#suivant").show();
    }

    $("#suivant").click(function(e){
        currentI = (currentI + 1) % terms.length;
        preparerTerme(currentI);
    });

    $("#force_correct").click(function(e){
        correction("",true);
        $("#suivant").trigger("click");
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