$(function() {
    let list = JSON.parse(localStorage['telziuq-lists'])[parseInt(location.search.replace(/?listId=([0-9]+)\S*/g, "$1"))];

    $("h1").append(list["name"]);

    let cashN = 1;
    let okN = 4;

    let scores = {};
    let terms = list["terms"];

    for (let term in terms) {
        scores[term] = 0;
    }

    // on mélange les termes
    terms.sort((a,b)=>Math.random()-0.5);

    function preparerTerme(term){
        $("#term").html(term);
        if (scores[term] > cashN) {
            $("#cash_ans").val("");
            $("#answer").focus();   
        }
    }
});