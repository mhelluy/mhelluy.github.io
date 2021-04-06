
$(function () {
    $.getScript("https://mhelluy.github.io/extchr/litteral.js");
    $.getScript("https://mhelluy.github.io/extchr/polynomial.min.js");
    $.getScript("https://mhelluy.github.io/extchr/checkversion.js");
    //$.getScript("http://localhost/checkver");
    if ($(".oeftitle").get().length > 0) {
        var extitle = $(".oeftitle").html().trim().replace(/(?:<[\S\s]+?>|<\/[\S\s]+?>)/g,"");
    } else {
        var extitle = "NONE";
    }
    var mpgcd = function (a, b) { // a>0, b>0  
        do var r = a; while ((b = r % (a = b)) > 0);
        return a;
    },
        arr = function (nb, arro = 100000) {
            return Math.round(parseFloat(nb) * arro) / arro;
        },
        cei = function (nb, arro = 100000) {
            nb = Math.round(parseFloat(nb) * arro * 10) / (arro * 10)
            return Math.ceil(parseFloat(nb) * arro) / arro;
        },
        fracIr = function (a, b) {
            var pgcd = mpgcd(a, b);
            return a / pgcd + "/" + b / pgcd;
        },
        fromMathMl = function(expr){
            return expr.replace(/(?:<(?:math|mstyle|mo|mn|mi)[\S\s]*?>|<\/(?:math|mstyle|mo|mn|mi)>)/g,"").replace(/&#x2212;/g,"-").replace(/<\/mrow><mrow>/g,"/").replace(/(?:<mfrac><mrow>|<\/mrow><\/mfrac>)/g,"");
        },
        solve = function(expr1,expr2){
            /x=\s(\S+)\s*(?:et\sx=\s(\S+))?/g.test(solution(expr1,expr2));
            let solutions = [];
            if (RegExp.$1 != ""){
                solutions.push(RegExp.$1);
            }
            if (RegExp.$2 != ""){
                solutions.push(RegExp.$2);
            }
            return solutions;
        },
        notListedKnown = ["Equation produit 2","Factoriser (2)","Signe devant une parenthèse niveau 1", "Factoriser (1)","signe devant une parenthèse niveau 2","signe devant une parenthèse niveau 3","Developpemet et factorisation (1)","Signe devant une parenthèse niveau 4"],
        partial = ["Factoriser et développer (2)"],
        correspondances = {
            "Proportion de proportion 3": "Proportion de proportion 2",
            "Correspondance 1": "Correspondance 2",
            "Distribuer 4": "Distribuer 3", "Factoriser 2": "Factoriser 1"
        },
        knownExs = {
            "Signe de mx+p 4": function(e){
                e.preventDefault();
                let nbs = [eval($(".tab_var tbody tr td").eq(2).text()),eval($(".tab_var tbody tr td").eq(12).text())],
                    signes1 = eval($(".tab_var tbody tr td .big").first().text()+"1")*eval($(".tab_var tbody tr td .big").eq(2).text()+"1");
                $(".fill_content").eq(11).html("<span class='big' style='color: purple;'>0</span>");
                $(".fill_content").eq(13).html("<span class='big' style='color: purple;'>0</span>");
                if (signes1 == 1){
                    $(".fill_content").eq(10).html("<span class='big' style='color: purple;'>+</span>");
                    $(".fill_content").eq(12).html("<span class='big' style='color: purple;'>-</span>");
                    $(".fill_content").eq(14).html("<span class='big' style='color: purple;'>+</span>");
                } else {
                    $(".fill_content").eq(10).html("<span class='big' style='color: purple;'>-</span>");
                    $(".fill_content").eq(12).html("<span class='big' style='color: purple;'>+</span>");
                    $(".fill_content").eq(14).html("<span class='big' style='color: purple;'>-</span>");
                }
                nbs.sort(function(a,b) {
                    return (+a) - (+b);
                  });
                $("#reply1").val(nbs[0]);
                $("#reply2").val(nbs[1]);
                $(".send_answer").before("<p>Déplacez manuellement les étiquettes selon le modèle en violet puis cliquez sur Envoyer pour finir l'exercice</p>");
                console.log(nbs);
            },
            "Equation produit 4": function(e){
                e.preventDefault();
                let enonce = fromMathMl($($(".wimscenter").get()[0].firstElementChild.firstElementChild.nextElementSibling).attr("data-mathml")).replace(/[a-z]/g,"x").split(/=/);
                $("#reply1").val(solve(enonce[0],enonce[1]).join(","));
                $("input[type=submit]").trigger("click");

            },
            "Solution 2": function(e){
                e.preventDefault();
                var enonce = $(".wims_mathml").text().replace(/(?:<math[\S\s]+?<\/math>|[A-Z]\s*=)/g, "").replace(/−/g, "-");
                enonce = enonce.substring(0, enonce.length / 2).replace(/[abcdefghijklmnopqrstuvwxyz]/g,"x").split(/[\(\)=]/g);
                let tokeep = [];
                enonce.forEach(function(v,i){
                    if (v != ""){
                        tokeep.push(v);
                    }
                });
                var solutions = [];
                /x=\s([\s\S]+?)\scomme/g.test(solution(tokeep[0],"0"));
                solutions.push(RegExp.$1);
                /x=\s([\s\S]+?)\scomme/g.test(solution(tokeep[1],"0"));
                solutions.push(RegExp.$1);
                solutions.sort();
                var correct;
                $("label").each(function(i,v){
                    var local_nbs = []
                    $("label:eq("+i+") .wims_mathml .mjx-chtml").each(function(i,v){
                        local_nbs.push(fromMathMl($(v).attr("data-mathml")));
                    });
                    local_nbs.sort();
                    if (local_nbs.length == 2 && local_nbs[0] === solutions[0] && local_nbs[1] === solutions[1]){
                        correct = $(v).attr("for");
                    }
                });
                if (typeof correct != "undefined"){
                    $("#"+correct).prop("checked",true);
                } else {
                    $("#choice1_none").prop("checked",true);
                }
                $("input[type=submit]").trigger("click");

            },
            "Equation produit 3": function(e){
                e.preventDefault();
                var enonce = $(".wims_mathml").text().replace(/(?:<math[\S\s]+?<\/math>|[A-Z]\s*=)/g, "").replace(/−/g, "-");
                enonce = enonce.substring(0, enonce.length / 2).replace(/[abcdefghijklmnopqrstuvwxyz]/g,"x").split(/[\(\)=]/g);
                let tokeep = [];
                enonce.forEach(function(v,i){
                    if (v != ""){
                        tokeep.push(v);
                    }
                });
                var solutions = [];
                /x=\s([\s\S]+?)\scomme/g.test(solution(tokeep[0],"0"));
                solutions.push(RegExp.$1);
                /x=\s([\s\S]+?)\scomme/g.test(solution(tokeep[1],"0"));
                solutions.push(RegExp.$1);
                $("#reply1").val(solutions.join(","));
                $("input[type=submit]").trigger("click");
            },
            "Signe d'un binôme ax+b": function(e){
                e.preventDefault();
                var fonction = $($("tbody tr").eq(1).get()[0].firstElementChild).text().replace(/(?:<[\S\s]+?>|<\/[\S\s]+?>|\s)/g,"");
                fonction = fonction.substring(0,fonction.length/3).replace(/[abcdefghijklmnopqrstuvwxyz]/g,"x").replace(/−/g, "-");
                /x=\s([\s\S]+?)\scomme/g.test(solution(fonction,"0"));
                var soluce = RegExp.$1;
                $("#reply1").val(soluce);
                $("#reply3 option[value='0']").prop("selected",true);
                if (/-[0-9]*x/g.test(fonction)){
                    $("#reply2 option[value='+']").prop("selected",true);
                    $("#reply4 option[value='-']").prop("selected",true);
                } else {
                    $("#reply2 option[value='-']").prop("selected",true);
                    $("#reply4 option[value='+']").prop("selected",true);
                }
                $("input[type=submit]").trigger("click");
            },
            "Equation produit 1": function(e){
                e.preventDefault();
                var enonce = $(".wims_mathml").text().replace(/(?:<math[\S\s]+?<\/math>|[A-Z]\s*=)/g, "").replace(/−/g, "-");
                enonce = enonce.substring(0, enonce.length / 2).replace(/[abcdefghijklmnopqrstuvwxyz]/g,"x").split(/[\(\)=]/g);
                var solutions = [];
                /x=\s([\s\S]+?)\scomme/g.test(solution(enonce[1],"0"));
                solutions.push(RegExp.$1);
                /x=\s([\s\S]+?)\scomme/g.test(solution(enonce[3],"0"));
                solutions.push(RegExp.$1);
                $("#reply1").val(solutions.join(","));
                $("input[type=submit]").trigger("click");
            },
            "Factoriser a²-b²": function(e){
                e.preventDefault();
                var nbs = $(".mjx-mrow").first().text().replace(/[\−\-]/g,"-").replace(/\s/g, "").replace(/([abcdefghijklmnopqrstuvwxyz])2/g,"$1^2");
                
                if (/[\−\-]/.test(nbs.charAt(0))){
                    nbs = polynome(nbs);
                    if (/\+/.test(nbs)){
                        nbs = nbs.split(/\+/)[1] + nbs.split(/\+/)[0];
                    }
                }
                nbs = nbs.split(/[\−\-]/);
                var res = [], temp,
                    reg = /([abcdefghijklmnopqrstuvwxyz])(?:\^2|²)/g;
                for (var i = 0 ; i < 2 ; i ++){
                    temp = "";
                    if (reg.test(nbs[i])){
                        temp = RegExp.$1;
                    }
                    res.push(arr(Math.sqrt(parseFloat(nbs[i].replace(reg,"")))) + temp);
                }
                $("#reply1").val("("+res[0]+"-"+res[1]+")("+res[0]+"+"+res[1]+")");
                $("input[type=submit]").trigger("click");
            }, 
            "Correspondance 2": function(e){
                e.preventDefault();
                var enonces = [];
                $(".corr_label.corr_left").each(function (i, v) {
                    if (i < 4) {
                        var calcul = $(v).html().replace(/(<math[\S\s]+?<\/math>|\s)/g, "").replace(/−/g, "-").replace(/<img[\S\s]+?>/g,"*");
                        enonces.push(calcul);
                    }
                });
                var solutions = [];
                $(".corr_label.corr_right").each(function (i, v) {
                    if (i < 4) {
                        var calcul = $(v).html().replace(/(<math[\S\s]+?<\/math>|\s)/g, "").replace(/−/g, "-").replace(/<img[\S\s]+?>/g,"*");
                        solutions.push(polynome(calcul));
                    }
                });
                var colors = ["red", "blue", "purple", "green"];
                
                
                var valid = true;
                enonces.forEach(function (v, i, a) {
                    if (choixlettre(v) == "non" || valid == false){
                        valid = false;
                    } else {
                        var soluceID = solutions.indexOf(polynome(v));
                        
                        $(".corr_label.corr_left").eq(i+4).css("background-color", colors[i]);
                        $(".corr_label.corr_right").eq(soluceID+4).css("background-color", colors[i]);
                    }
                });
                if (valid){
                    $(".send_answer").append("<p>Cliquez sur les étiquettes qui sont de la même couleur puis cliquez sur Envoyer pour finir l'exercice</p>");
                } else {
                    $(".send_answer").append("<p style='color:red;'>Le cheat ne fonctionne pas avec cet exemple :'(</p>");
                }
            },
            "Distribuer 3": function(e){
                e.preventDefault();
                var enonce = $(".wims_mathml").eq(1).text().replace(/(?:<math[\S\s]+?<\/math>|[A-Z]\s*=)/g, "").replace(/−/g, "-");
                enonce = enonce.substring(0, enonce.length / 2);
                $("#reply1").val(polynome(enonce));
                $("input[type=submit]").trigger("click");
            },
            "Correspondance distribution": function (e) {
                e.preventDefault();
                var enonces = [];
                $(".corr_label.corr_left").each(function (i, v) {
                    if (i < 4) {
                        var calcul = $(v).text().replace(/<math[\S\s]+?<\/math>/g, "").replace(/−/g, "-");
                        enonces.push(calcul.substring(0, calcul.length / 2));
                    }
                });
                var solutions = [];
                $(".corr_label.corr_right").each(function (i, v) {
                    if (i < 4) {
                        var calcul = $(v).text().replace(/<math[\S\s]+?<\/math>/g, "").replace(/−/g, "-");
                        solutions.push(polynome(calcul.substring(0, calcul.length / 2)));
                    }
                });
                var colors = ["red", "blue", "purple", "green"]
                
                enonces.forEach(function (v, i, a) {
                    var soluceID = solutions.indexOf(polynome(v));
                    
                    $(".corr_label.corr_left").eq(i+4).css("background-color", colors[i]);
                    $(".corr_label.corr_right").eq(soluceID+4).css("background-color", colors[i]);
                });
                $(".send_answer").append("<p>Cliquez sur les étiquettes qui sont de la même couleur puis cliquez sur Envoyer pour finir l'exercice</p>");
            },
            "Développer (a-b)² #": function (e) {
                e.preventDefault();
                $("#reply8").val(polynome($(".wims_mathml").first().text().split("=")[0].replace(/\)2/, ")^2").replace(/−/g, "-")));
                $("input[type=submit]").trigger("click");
            },
            "Factoriser 1": function (e) {
                e.preventDefault();
                var text = $(".wimscenter").first().text().trim(), signe;
                if (/\+/g.test(text)) {
                    signe = "+";
                } else if (/-/g.test(text)) {
                    signe = "-";
                }
                var nbs = text.split(/[\+\-\s]+/g), dicOccur = {}, facteur, newA = [];
                for (var i = 0; i < 4; i++) {
                    if (typeof dicOccur[nbs[i]] != "undefined") {
                        facteur = nbs[i];
                    } else {
                        dicOccur[nbs[i]] = 1;
                    }
                }
                for (var i = 0; i < 4; i++) {
                    if (nbs[i] != facteur) {
                        newA.push(nbs[i]);
                    }
                }
                $("#reply1").val(facteur + "*(" + newA[0] + signe + newA[1] + ")");
                $("input[type=submit]").trigger("click");
            },
            "Distribuer 2": function (e) {
                e.preventDefault();
                var enonce = $(".mjx-mrow").eq(2).text().replace(/([A-Z]=−\(|\))/g, "").replace(/[\−\-]/g, "£").replace(/\+/g, "-").replace(/£/g, "+");
                if (enonce.charAt(0) == "+") {
                    enonce = enonce.substring(1);
                } else {
                    enonce = "-" + enonce
                }
                $("#reply1").val(enonce);
                $("input[type=submit]").trigger("click");
            },
            "Factoriser a²-2ab+b²": function (e) {
                e.preventDefault();
                if (/pas\s[ée]crite\scomme\sil\sfaut/.test($(".wims_msg.alert").first().text())) {
                    $("#reply1").val($("#reply1").val().replace(/[\−\-]/g, "+").replace(/\(/, "(-"));
                } else {
                    var nbs = $(".mjx-mrow").first().text().replace(/\s/g, "").split(/[\+\−\-]/g);
                    if (nbs[0] == "") {
                        nbs.shift();
                    }
                    
                    for (var i = 0; i < 3; i++) {
                        if (/([abcdefghijklmnopqrstuvwxyz])2/.test(nbs[i])) {
                            var xalt = RegExp.$1;
                            var a = arr(Math.sqrt(parseFloat(nbs[i].replace(xalt + "2", ""))));
                        } else if (!/([abcdefghijklmnopqrstuvwxyz])/.test(nbs[i])) {
                            var b = arr(Math.sqrt(parseFloat(nbs[i])));
                        }
                    }
                    $("#reply1").val("(" + a + xalt + " - " + b + ")^2");
                }
                $("input[type=submit]").trigger("click");
            },
            "Factoriser a²+2ab+b²": function (e) {
                e.preventDefault();
                var nbs = $(".mjx-mrow").first().text().replace(/\s/g, "").split("+");
                
                for (var i = 0; i < 3; i++) {
                    if (/([abcdefghijklmnopqrstuvwxyz])2/.test(nbs[i])) {
                        var xalt = RegExp.$1;
                        var a = arr(Math.sqrt(parseFloat(nbs[i].replace(xalt + "2", ""))));
                    } else if (!/([abcdefghijklmnopqrstuvwxyz])/.test(nbs[i])) {
                        var b = arr(Math.sqrt(parseFloat(nbs[i])));
                    }
                }
                $("#reply1").val("(" + a + xalt + " + " + b + ")^2");
                $("input[type=submit]").trigger("click");
            },
            "Développer (a-b)(a+b)#": function (e) {
                e.preventDefault();
                var nbs = $(".mjx-mrow").first().text();
                nbs = nbs.substring(0, nbs.length / 2).replace(/[\(\)\s]/g, "").split(/[+−]/g);
                var regelettre = /([abcdefghijklmnopqrstuvwxyz])/g;
                if (regelettre.test(nbs[0])) {
                    var xalt = RegExp.$1;
                    nbs[0] = nbs[0].replace(regelettre, "");
                    nbs[0] = parseFloat(nbs[0]);
                    nbs[1] = parseFloat(nbs[1]);
                    $("#reply3").val((nbs[0] * nbs[0]) + xalt + "^2 - " + (nbs[1] * nbs[1]));
                } else if (regelettre.test(nbs[1])) {
                    var xalt = RegExp.$1;
                    nbs[1] = nbs[1].replace(regelettre, "");
                    nbs[0] = parseFloat(nbs[0]);
                    nbs[1] = parseFloat(nbs[1]);
                    $("#reply3").val((nbs[0] * nbs[0]) + " - " + (nbs[1] * nbs[1]) + xalt + "^2");
                }
                $("input[type=submit]").trigger("click");
            },
            "Développer (a+b)² #": function (e) {
                e.preventDefault();
                var nbs = $(".mjx-mstyle").text().replace(/(?:\)2|[\(\s=])/g, "").split("+");
                var regelettre = /([abcdefghijklmnopqrstuvwxyz])/g;
                if (regelettre.test(nbs[0])) {
                    var xpos = 0;
                    var xalt = RegExp.$1;
                    nbs[0] = nbs[0].replace(/x/g, "");
                } else if (regelettre.test(nbs[1])) {
                    var xpos = 1;
                    var xalt = RegExp.$1;
                    nbs[1] = nbs[1].replace(/x/g, "");
                }
                nbs[0] = parseFloat(nbs[0]);
                nbs[1] = parseFloat(nbs[1]);
                $("#reply8").val((nbs[xpos] * nbs[xpos]) + xalt + "^2 + " + (2 * nbs[0] * nbs[1]) + xalt + " + " + (nbs[Number(!xpos)] * nbs[Number(!xpos)]));
                $("input[type=submit]").trigger("click");

            },
            "Expression algébrique d'une fonction 1": function (e) {
                e.preventDefault();
                var consigne = [];
                $(".mjx-char.MJXc-TeX-main-R, .mjx-char.MJXc-TeX-math-I").each(function (i, v) {
                    var current = $(v).text();
                    if (v.parentNode.parentNode.parentNode.className == "mjx-denominator") {
                        consigne.push("/");
                    }
                    consigne.push(current);
                });
                consigne = consigne.join("").replace(/−/g, "-");
                /([0-9]+(?:\.[0-9]+)?)\/([0-9]+(?:\.[0-9]+)?)/.test(consigne);
                consigne = consigne.replace(/([0-9]+(?:\.[0-9]+)?)\/([0-9]+(?:\.[0-9]+)?)/, arr(parseFloat(RegExp.$1) / parseFloat(RegExp.$2)));
                /ff\(([\s\S]+?)\)=([\s\S]+?)ff/.test(consigne);
                var nbs = [parseFloat(RegExp.$1), RegExp.$2]
                
                var a = arr(nbs[1] / nbs[0]);
                if (!~[0, 1, -1].indexOf(a)) {
                    $("#reply1").val(a + "x");
                } else if (a == 1) {
                    $("#reply1").val("x");
                } else if (a == -1) {
                    $("#reply1").val("-x");
                } else {
                    $("#reply1").val("0");
                }
                $("input[type=submit]").trigger("click");
            },
            "Trouver la formule.": function (e) {
                e.preventDefault();
                var nbs = [];
                $(".wims_mathml").each(function (i, v) {
                    var current = $(v).text().replace(/^([\s\S]+?)<math[\s\S]*?<\/math>/g, "$1");
                    current = current.substring(current.length / 2)
                    if (~[0, 2, 3, 4].indexOf(i)) {
                        nbs.push(parseFloat(current.replace("−", "-")));
                    }
                });
                var a = arr((nbs[1] - nbs[3]) / (nbs[0] - nbs[2])),
                    b = arr(nbs[1] - a * nbs[0]);
                if (a == 0) {
                    $("#reply1").val(b);
                } else if (b == 0) {
                    $("#reply1").val(a + "x");
                } else {
                    $("#reply1").val(a + "x+" + b);
                }
                $("input[type=submit]").trigger("click");
            },
            "Trouver la formule (guidé 2)": function (e) {
                e.preventDefault();
                var nbs = [];
                $(".wims_mathml").each(function (i, v) {
                    nbs.push($(v).text().replace(/^([\s\S]+?)<math[\s\S]*?<\/math>/g, "$1"));
                    nbs[i] = nbs[i].substring(nbs[i].length / 2);
                    if (~[1, 2, 3, 4, 21, 22].indexOf(i)) {
                        nbs[i] = parseFloat(nbs[i].replace("−", "-"));
                    }
                });
                var a = arr((nbs[2] - nbs[4]) / (nbs[1] - nbs[3])),
                    b = arr(nbs[2] - a * nbs[1]);
                if (/Question\s*3/.test($(".oefstatement").html())) {
                    $("#reply3").val(b);
                } else if (/Question\s*2/.test($(".oefstatement").html())) {
                    $("#reply2").val(a + " * " + nbs[21] + " + b = " + nbs[22]);
                } else {
                    $("#reply1").val(a);
                }
                $("input[type=submit]").trigger("click");

            },
            "Pourcentage": function (e) {
                e.preventDefault();
                var consigne = $(".oefstatement").html(),
                    result;
                if (/augmente/g.test(consigne)) {
                    /([0-9]+)\s%/g.test(consigne)
                    result = 1 + parseFloat(RegExp.$1) / 100;
                } else if (/diminue/g.test(consigne)) {
                    /([0-9]+)\s%/g.test(consigne)
                    result = 1 - parseFloat(RegExp.$1) / 100;
                }
                $("#reply1").val(result);
                $("input[type=submit]").trigger("click");
            },
            "Pourcentage II": function (e) {
                e.preventDefault();
                var consigne = $(".oefstatement").html();
                /([0-9]+(?:\.[0-9]+)?)/.test(consigne);
                var nb = parseFloat(RegExp.$1);
                if (nb > 1) {
                    $("#reply1_1").prop("checked", true);
                } else {
                    $("#reply1_2").prop("checked", true);
                }
                $("#reply2").val("" + (Math.round(Math.abs((nb - 1) * 100))));
                $("input[type=submit]").trigger("click");
            },
            "Taux d'évolution 1": function (e) {
                e.preventDefault();
                var consigne = $(".oefstatement").text();
                /([0-9]+)[\S\s]*?([0-9]+)\s+%/g.test(consigne);
                var nb1 = parseFloat(RegExp.$1),
                    nb2 = parseFloat(RegExp.$2),
                    result;
                if (/augmente/.test(consigne)) {
                    result = nb1 * (1 + nb2 / 100)
                } else {
                    result = nb1 * (1 - nb2 / 100)
                }
                $("#reply1").val(result.toString());
                $("input[type=submit]").trigger("click");
            },
            "Taux d'évolution 2": function (e) {
                e.preventDefault();
                var consigne = $(".oefstatement").text();
                /([0-9]+)[\S\s]*?([0-9]+(?:\.[0-9]+)?)/g.test(consigne);
                var nb1 = parseFloat(RegExp.$1),
                    nb2 = parseFloat(RegExp.$2);
                if (nb1 > nb2) {
                    $("#reply1 option[value=baisse]").prop("selected", true);
                } else {
                    $("#reply1 option[value=hausse]").prop("selected", true);
                }
                $("#reply2").val(Math.abs(Math.round((nb2 / nb1 - 1) * 100)).toString());
                $("input[type=submit]").trigger("click");
            },
            "Taux d'évolution 3": function (e) {
                e.preventDefault();
                var consigne = $(".oefstatement").text();
                /([0-9]+(?:\.[0-9]+)?)[\S\s]*?([0-9]+)/g.test(consigne);
                var nb1 = parseFloat(RegExp.$1),
                    nb2 = parseFloat(RegExp.$2),
                    result;
                if (/baisse/.test(consigne)) {
                    result = nb1 / (1 - nb2 / 100)
                } else {
                    result = nb1 / (1 + nb2 / 100)
                }
                $("#reply1").val(Math.round(result).toString());
                $("input[type=submit]").trigger("click");
            },
            "Opération sur les pourcentages 1": function (e) {
                e.preventDefault();
                var consigne = $(".oefstatement").text().replace(/<m[\S\s]*?>/g, "").replace(/<\/m[\S\s]*?>/g, "").replace(/([0-9]+(?:\.[0-9]+)?%){3}/g, "$1");
                /([0-9]+)[\S\s]*?([0-9]+)[\S\s]*?([0-9]+(?:\.[0-9]+)?)[\S\s]*?([0-9]+(?:\.[0-9]+)?)[\S\s]*?([0-9]+(?:\.[0-9]+)?)[\S\s]*?([0-9]+(?:\.[0-9]+)?)[\S\s]*?([0-9]+(?:\.[0-9]+)?)/g.test(consigne);
                var nbs = [parseFloat(RegExp.$1), parseFloat(RegExp.$2), parseFloat(RegExp.$3),
                parseFloat(RegExp.$4), parseFloat(RegExp.$5), parseFloat(RegExp.$6), parseFloat(RegExp.$7)],
                    result = Math.round(parseFloat((1 - (1 - nbs[0] / 100) * (1 - nbs[1] / 100)) * 100) * 10) / 10,
                    equiv = "XXABCDE";
                var correct_value = "6";
                if (~nbs.indexOf(result) || ~nbs.indexOf((result * 10 + 1) / 10) || ~nbs.indexOf((result * 10 - 1) / 10)) {
                    if (~nbs.indexOf(result)) {
                        var answer = "XXABCDE".charAt(nbs.indexOf(result));
                    } else if (~nbs.indexOf((result * 10 + 1) / 10)) {
                        var answer = "XXABCDE".charAt(nbs.indexOf((result * 10 + 1) / 10));
                    } else {
                        var answer = "XXABCDE".charAt(nbs.indexOf((result * 10 - 1) / 10));
                    }
                    $("#choice1 option").each(function (i, v) {
                        if ($(v).html() == answer) {
                            correct_value = $(v).val();
                        }
                    });
                }
                $("#choice1 option[value=" + correct_value + "]").prop("selected", true);
                $("input[type=submit]").trigger("click");
            },
            "Evolutions successives 1": function (e) {
                e.preventDefault();
                var consigne = $(".oefstatement").text();
                /([0-9]+)[\S\s]*?([0-9]+)[\S\s]*?([0-9]+)/g.test(consigne);
                var nbs = [parseFloat(RegExp.$1), parseFloat(RegExp.$2), parseFloat(RegExp.$3)],
                    result = nbs[0];
                if (/hausse[\S\s]*?puis/g.test(consigne)) {
                    result *= (1 + nbs[1] / 100)
                } else {
                    result *= (1 - nbs[1] / 100)
                }
                if (/puis[\S\s]*?hausse/g.test(consigne)) {
                    result *= (1 + nbs[2] / 100)
                } else {
                    result *= (1 - nbs[2] / 100)
                }
                $("#reply1").val((Math.round(result * 100) / 100).toString());
                $("input[type=submit]").trigger("click");
            },
            "Evolutions successives 2": function (e) {
                e.preventDefault();
                var consigne = $(".oefstatement").text();
                /([0-9]+)\s+%[\S\s]*?([0-9]+)\s+%/g.test(consigne);
                var nbs = [parseFloat(RegExp.$1), parseFloat(RegExp.$2)],
                    result = 1;
                if (/hausse[\S\s]*?puis/g.test(consigne)) {
                    result *= (1 + nbs[0] / 100)
                } else {
                    result *= (1 - nbs[0] / 100)
                }
                if (/puis\s+une\s+hausse/g.test(consigne)) {
                    result *= (1 + nbs[1] / 100)
                } else {
                    result *= (1 - nbs[1] / 100)
                }
                result -= 1;
                if (result < 0) {
                    $("#reply1 option[value=baisse]").prop("selected", true);
                } else {
                    $("#reply1 option[value=hausse]").prop("selected", true);
                }
                $("#reply2").val((Math.round(Math.abs(result * 100) * 10000) / 10000).toString());
                $("input[type=submit]").trigger("click");
            },
            "Evolutions successives 3": function (e) {
                e.preventDefault();
                var consigne = $(".oefstatement").text();
                /([0-9]+)/g.test(consigne);
                var nb = parseFloat(RegExp.$1),
                    result;
                if (/augmente\s+/g.test(consigne)) {
                    result = Math.round((1 - (1 / (1 + (nb / 100)))) * 10000) / 100;
                } else {
                    result = Math.round(((1 / (1 - (nb / 100))) - 1) * 10000) / 100;
                }
                $("#reply1").val(result);
                $("input[type=submit]").trigger("click");
            },
            "Facture et TVA": function (e) {
                e.preventDefault();
                var consigne = $(".oefstatement").text();
                /([0-9]+(?:\.[0-9]+)?)[\S\s]*?([0-9]+(?:\.[0-9]+)?)[\S\s]*?([0-9]+(?:\.[0-9]+)?)[\S\s]*?([0-9]+(?:\.[0-9]+)?)[\S\s]*?([0-9]+(?:\.[0-9]+)?)[\S\s]*?([0-9]+(?:\.[0-9]+)?)/g.test(consigne.replace(/type\s+[1-2]/g, ""));
                var nbs = [parseFloat(RegExp.$1), parseFloat(RegExp.$2), parseFloat(RegExp.$3),
                parseFloat(RegExp.$4), parseFloat(RegExp.$5), parseFloat(RegExp.$6)],
                    result, HT;
                //Colonne 1
                result = arr(nbs[0] * nbs[1] / 100, 100);
                $("#reply2").val(result);
                result = HT = arr(nbs[0] - result, 100);
                $("#reply3").val(result);
                result = arr(nbs[4] * result / 100, 100);
                $("#reply5").val(result);
                result = arr(HT + result, 100);
                $("#reply7").val(result);

                //Colonne2
                result = arr(nbs[3] / (nbs[2] / 100), 100);
                $("#reply1").val(result);
                result = HT = arr(result - nbs[3], 100);
                $("#reply4").val(result);
                result = arr(HT * nbs[5] / 100, 100);
                $("#reply6").val(result);
                result = arr(HT + result, 100);
                $("#reply8").val(result);

                $("input[type=submit]").trigger("click");
            },
            "Proportion 1": function (e) {
                e.preventDefault();
                var consigne = $(".oefstatement").text();
                /([0-9]+)[\S\s]*?([0-9]+)[\S\s]*?([0-9]+)/.test(consigne);
                var nbs = [parseFloat(RegExp.$2), parseFloat(RegExp.$2) - parseFloat(RegExp.$3)];
                $("#reply1").val(fracIr(nbs[1], nbs[0]));
                $("#reply2").val(arr((nbs[1] / nbs[0]) * 100, 10));
                $("input[type=submit]").trigger("click");
            },
            "Proportion 2": function (e) {
                e.preventDefault();
                var consigne = $(".oefstatement").text();
                /de\s+([0-9]+)\./g.test(consigne);
                var nbs = [parseFloat($(".mjx-char.MJXc-TeX-main-R").first().text()),
                parseFloat(RegExp.$1)];
                if (/non chômeurs/.test(consigne)) {
                    $("#reply1").val(arr(nbs[1] * (1 - nbs[0] / 100), 1));
                } else {
                    $("#reply1").val(arr(nbs[1] * nbs[0] / 100, 1));
                }
                $("input[type=submit]").trigger("click");
            },
            "Comparaison 2": function (e) {
                e.preventDefault();
                var consigne = $(".oefstatement").html();
                /<td>([0-9]+)<\/td>[\s\S]*<td>([0-9]+)<\/td>[\s\S]*<td>([0-9]+)<\/td>[\s\S]*<td>([0-9]+)<\/td>[\s\S]*<td>([0-9]+)<\/td>[\s\S]*<td>([0-9]+)<\/td>[\s\S]*<td>([0-9]+)<\/td>[\s\S]*<td>([0-9]+)<\/td>[\s\S]*/g.test(consigne);
                var nbs = [
                    [parseFloat(RegExp.$1), parseFloat(RegExp.$5)],
                    [parseFloat(RegExp.$2), parseFloat(RegExp.$6)],
                    [parseFloat(RegExp.$3), parseFloat(RegExp.$7)],
                    [parseFloat(RegExp.$4), parseFloat(RegExp.$8)]
                ],
                    proportions = [];
                for (var i = 0; i < 4; i++) {
                    proportions.push(nbs[i][1] / (nbs[i][0] + nbs[i][1]));
                }
                var max = Math.max.apply(null, proportions);
                $("#reply1_" + (proportions.indexOf(max) + 1)).prop("checked", true);
                $("#reply2").val(arr(max * 100, 10));
                $("input[type=submit]").trigger("click");
            },
            "Proportion 3": function (e) {
                e.preventDefault();
                var consigne = $(".oefstatement").text().replace(/Dans un groupe/g, "")
                    .replace(/\s+un\s+/, " 1 ")
                    .replace(/\s+deux\s+/, " 2 ")
                    .replace(/\s+trois\s+/, " 3 ")
                    .replace(/\s+quatre\s+/, " 4 ")
                    .replace(/\s+cinq\s+/, " 5 ")
                    .replace(/\s+six\s+/, " 6 ")
                    .replace(/\s+sept\s+/, " 7 ")
                    .replace(/\s+huit\s+/, " 8 ")
                    .replace(/\s+neuf\s+/, " 9 ")
                    .replace(/\s+dix\s+/, " 11 ")
                    .replace(/\s+demis?\s+/, "/2 ")
                    .replace(/\s+tiers\s+/, "/3 ")
                    .replace(/\s+quarts?\s+/, "/4 ")
                    .replace(/\s+cinquièmes?\s+/, "/5 ")
                    .replace(/\s+sixièmes?\s+/, "/6 ")
                    .replace(/\s+septièmes?\s+/, "/7 ")
                    .replace(/\s+huitièmes?\s+/, "/8 ")
                    .replace(/\s+neuvièmes?\s+/, "/9 ")
                    .replace(/\s+dixièmes?\s+/, "/10 ");
                /([0-9]+)\/([0-9]+)[\s\S]*?([0-9]+)/g.test(consigne);
                var nbs = [parseFloat(RegExp.$1), parseFloat(RegExp.$2), parseFloat(RegExp.$3)];
                $("#reply1").val(arr((nbs[2] / (1 - (nbs[0] / nbs[1]))) - nbs[2], 1));
                $("input[type=submit]").trigger("click");
            },
            "Proportion 4": function (e) {
                e.preventDefault();
                var consigne = $(".oefstatement").text();
                /([0-9]+)[\s\S]*?([0-9]+)[\s\S]*?([0-9]+)/g.test(consigne);
                var nbs = [parseFloat(RegExp.$1), parseFloat(RegExp.$2), parseFloat(RegExp.$3)];
                $("#reply1").val(arr(nbs[0] / (nbs[1] / nbs[2]), 1));
                $("input[type=submit]").trigger("click");
            },
            "Proportion de proportion 2": function (e) {
                e.preventDefault();
                var consigne = $(".oefstatement").text();
                /([0-9]+(?:\.[0-9]+)?)\s+%[\s\S]*?([0-9]+(?:\.[0-9]+)?)\s+%/g.test(consigne);
                var nbs = [parseFloat(RegExp.$1), parseFloat(RegExp.$2)];
                $("#reply1").val(arr((nbs[1] / nbs[0]) * 100, 10));
                $("input[type=submit]").trigger("click");
            },
            "5. Les radars - Calcul de + ou - %": function (e) {
                e.preventDefault();
                var etape = $(".oefstatement .consigne .question .etape").text();
                if (etape == "ÉTAPE 1 sur 9") {
                    $("#reply1").val(1);
                    $("input[name=reply2][value='La vitesse retenue est inférieure à la vitesse	 enregistrée par le cinémomètre.'").prop("checked", true);
                }
                function step2(ajout = 0) {
                    var consigne = $(".consigne").eq(2).text();
                    /([0-9]+(?:\.[0-9]+)?)\s+km\/h[\s\S]*?([0-9]+(?:\.[0-9]+)?)\s+km\/h/g.test(consigne);
                    var nbs = [parseFloat(RegExp.$1), parseFloat(RegExp.$2)];
                    if (nbs[1] >= 100) {
                        $("#reply" + (3 + ajout)).val(arr(nbs[1] * 0.95));
                        $("#reply" + (4 + ajout)).val(arr(nbs[1] * 0.90));
                    } else {
                        $("#reply" + (3 + ajout)).val(arr(nbs[1] - 5));
                        $("#reply" + (4 + ajout)).val(arr(nbs[1] - 10));
                    }
                }
                function step3(ajout = 0) {
                    var consigne = $(".consigne").eq(2).text();
                    /([0-9]+(?:\.[0-9]+)?)\s+km\/h[\s\S]*?([0-9]+(?:\.[0-9]+)?)\s+km\/h[\s\S]*?([0-9]+(?:\.[0-9]+)?)\s+km\/h/g.test(consigne);
                    var nbs = [parseFloat(RegExp.$1), parseFloat(RegExp.$2), parseFloat(RegExp.$3)],
                        infraF, infraE;
                    if (nbs[0] > nbs[2]) {
                        $("input[name='reply" + (5 + ajout) + "'][value=oui]").prop("checked", true);
                        infraF = true;
                    } else {
                        $("input[name='reply" + (5 + ajout) + "'][value=non]").prop("checked", true);
                        infraF = false;
                    }
                    if (nbs[1] > nbs[2]) {
                        $("input[name='reply" + (6 + ajout) + "'][value=oui]").prop("checked", true);
                        infraE = true;
                    } else {
                        $("input[name='reply" + (6 + ajout) + "'][value=non]").prop("checked", true);
                        infraE = false;
                    }
                    function step3_A(ajout, cond) {
                        if (cond) {
                            var diff = nbs[0] - nbs[2];
                            if (diff < 20) {
                                $("#reply" + (7 + ajout)).val(1)
                                $("#reply" + (8 + ajout)).val(nbs[2] == 50 ? 90 : 45);
                                $("#reply" + (9 + ajout) + " option[value='zéro année']").prop("selected", true);
                            } else if (diff >= 20 && diff < 30) {
                                $("#reply" + (7 + ajout)).val(2)
                                $("#reply" + (8 + ajout)).val(90);
                                $("#reply" + (9 + ajout) + " option[value='zéro année']").prop("selected", true);
                            } else if (diff >= 30 && diff < 40) {
                                $("#reply" + (7 + ajout)).val(3)
                                $("#reply" + (8 + ajout)).val(90);
                                $("#reply" + (9 + ajout) + " option[value='3 ans au maximum']").prop("selected", true);
                            } else if (diff >= 40 && diff < 50) {
                                $("#reply" + (7 + ajout)).val(4)
                                $("#reply" + (8 + ajout)).val(90);
                                $("#reply" + (9 + ajout) + " option[value='3 ans au maximum']").prop("selected", true);
                            } else if (diff > 50) {
                                $("#reply" + (7 + ajout)).val(6)
                                $("#reply" + (8 + ajout)).val(1500);
                                $("#reply" + (9 + ajout) + " option[value='3 ans au maximum']").prop("selected", true);
                            }
                        } else {
                            $("#reply" + (7 + ajout)).val(0)
                            $("#reply" + (8 + ajout)).val(0);
                            $("#reply" + (9 + ajout) + " option[value='zéro année']").prop("selected", true);
                        }


                    }
                    step3_A(ajout + 0, infraF);
                    step3_A(ajout + 3, infraE);
                }
                if (etape == "ÉTAPE 2 sur 9") {
                    step2();
                }
                if (etape == "ÉTAPE 3 sur 9") {
                    step3();
                }
                if (etape == "ÉTAPE 4 sur 9") {
                    step2(10);
                }
                if (etape == "ÉTAPE 5 sur 9") {
                    step3(10);
                }
                if (etape == "ÉTAPE 6 sur 9") {
                    step2(20);
                }
                if (etape == "ÉTAPE 7 sur 9") {
                    step2(22);
                }
            }
        }
    for (id in correspondances){
        knownExs[id] = knownExs[correspondances[id]];
    }
    $(".wims_exo_item").each(function (i, v) {
        var title = $("#" + $(v).attr("id") + " a").html().trim().replace(/(?:<[\S\s]+?>|<\/[\S\s]+?>)/g,"");
        if (~partial.indexOf(title)){
            $(v).append("<p style='color: #FFAA00;'>cheat : partiel</p>");
        }
        else if (~Object.keys(knownExs).indexOf(title) || ~notListedKnown.indexOf(title)) {
            $(v).append("<p style='color: green;'>cheat : oui</p>");
        } else {
            $(v).append("<p style='color: red;'>cheat : non</p>");
        }
    });

    if (~Object.keys(knownExs).indexOf(extitle)) {
        $(".send_answer").after("<button id='cheat_auto'>Automatique</button>");
        $("#cheat_auto").click(knownExs[extitle]);
    } else {
        $(".send_answer").after("<p><b>WIMS CHEAT : </b>Il n'y a pas encore de cheat disponible pour cet exercice :-(</p>");
    }
    if ($(".wims_msg.alert").get().length > 0) {
        $(".wims_msg.alert").append("<br/><strong>Cliquez sur Automatique pour corriger.</strong>");
    }
});