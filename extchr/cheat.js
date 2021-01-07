$(function(){
    if ($(".oeftitle").get().length > 0){
        var extitle = $(".oeftitle").html().trim();
    } else {
        var extitle = "NONE";
    }
    var mpgcd = function(a,b) { // a>0, b>0  
            do var r=a; while ((b=r%(a=b))>0);  
            return a;  
        },
        arr = function(nb,arro=100000){
            return Math.round(parseFloat(nb)*arro)/arro;
        },
        cei = function(nb,arro=100000){
            nb = Math.round(parseFloat(nb)*arro*10)/(arro*10)
            return Math.ceil(parseFloat(nb)*arro)/arro;
        },
        fracIr = function(a,b){
            var pgcd = mpgcd(a,b);
            return a/pgcd + "/" + b/pgcd;
        }
        knownExs = {
            "Pourcentage": function(e){
                e.preventDefault();
                var consigne = $(".oefstatement").html(),
                    result;
                if (/augmente/g.test(consigne)){
                    /([0-9]+)\s%/g.test(consigne)
                    result = 1 + parseFloat(RegExp.$1)/100;
                } else if (/diminue/g.test(consigne)){
                    /([0-9]+)\s%/g.test(consigne)
                    result = 1 - parseFloat(RegExp.$1)/100;
                }
                $("#reply1").val(result);
                $("input[type=submit]").trigger("click");
            },
            "Pourcentage II": function(e){
                e.preventDefault();
                var consigne = $(".oefstatement").html();
                /([0-9]+(?:\.[0-9]+)?)/.test(consigne);
                var nb = parseFloat(RegExp.$1);
                if (nb > 1){
                    $("#reply1_1").prop("checked",true);
                } else {
                    $("#reply1_2").prop("checked",true);
                }
                $("#reply2").val(""+(Math.round(Math.abs((nb-1)*100))));
                $("input[type=submit]").trigger("click");
            },
            "Taux d'évolution 1": function(e){
                e.preventDefault();
                var consigne = $(".oefstatement").text();
                /([0-9]+)[\S\s]*?([0-9]+)\s+%/g.test(consigne);
                var nb1 = parseFloat(RegExp.$1),
                    nb2 = parseFloat(RegExp.$2),
                    result;
                if (/augmente/.test(consigne)){
                    result = nb1 * (1+nb2/100)
                } else {
                    result = nb1 * (1-nb2/100)
                }
                $("#reply1").val(result.toString());
                $("input[type=submit]").trigger("click");
            },
            "Taux d'évolution 2": function(e){
                e.preventDefault();
                var consigne = $(".oefstatement").text();
                /([0-9]+)[\S\s]*?([0-9]+(?:\.[0-9]+)?)/g.test(consigne);
                var nb1 = parseFloat(RegExp.$1),
                    nb2 = parseFloat(RegExp.$2);
                if (nb1 > nb2){
                    $("#reply1 option[value=baisse]").prop("selected",true);
                } else {
                    $("#reply1 option[value=hausse]").prop("selected",true);
                }
                $("#reply2").val(Math.abs(Math.round((nb2/nb1-1)*100)).toString());
                $("input[type=submit]").trigger("click");
            },
            "Taux d'évolution 3": function(e){
                e.preventDefault();
                var consigne = $(".oefstatement").text();
                /([0-9]+(?:\.[0-9]+)?)[\S\s]*?([0-9]+)/g.test(consigne);
                var nb1 = parseFloat(RegExp.$1),
                    nb2 = parseFloat(RegExp.$2),
                    result;
                if (/baisse/.test(consigne)){
                    result = nb1/(1-nb2/100)
                } else {
                    result = nb1/(1+nb2/100)
                }
                $("#reply1").val(Math.round(result).toString());
                $("input[type=submit]").trigger("click");
            },
            "Opération sur les pourcentages 1": function(e){
                e.preventDefault();
                var consigne = $(".oefstatement").text().replace(/<m[\S\s]*?>/g,"").replace(/<\/m[\S\s]*?>/g,"").replace(/([0-9]+(?:\.[0-9]+)?%){3}/g,"$1");
                /([0-9]+)[\S\s]*?([0-9]+)[\S\s]*?([0-9]+(?:\.[0-9]+)?)[\S\s]*?([0-9]+(?:\.[0-9]+)?)[\S\s]*?([0-9]+(?:\.[0-9]+)?)[\S\s]*?([0-9]+(?:\.[0-9]+)?)[\S\s]*?([0-9]+(?:\.[0-9]+)?)/g.test(consigne);
                var nbs = [parseFloat(RegExp.$1),parseFloat(RegExp.$2),parseFloat(RegExp.$3),
                    parseFloat(RegExp.$4),parseFloat(RegExp.$5),parseFloat(RegExp.$6),parseFloat(RegExp.$7)],
                    result = Math.round(parseFloat((1-(1-nbs[0]/100)*(1-nbs[1]/100))*100)*10)/10,
                    equiv = "XXABCDE";
                var correct_value = "6";
                if (~nbs.indexOf(result)||~nbs.indexOf((result*10+1)/10)||~nbs.indexOf((result*10-1)/10)){
                    if (~nbs.indexOf(result)){
                        var answer = "XXABCDE".charAt(nbs.indexOf(result));
                    } else if (~nbs.indexOf((result*10+1)/10)){
                        var answer = "XXABCDE".charAt(nbs.indexOf((result*10+1)/10));
                    } else {
                        var answer = "XXABCDE".charAt(nbs.indexOf((result*10-1)/10));
                    }
                    $("#choice1 option").each(function(i,v){
                        if ($(v).html() == answer){
                            correct_value = $(v).val();
                        }
                    });
                }
                $("#choice1 option[value="+correct_value+"]").prop("selected",true);
                $("input[type=submit]").trigger("click");
            },
            "Evolutions successives 1": function(e){
                e.preventDefault();
                var consigne = $(".oefstatement").text();
                /([0-9]+)[\S\s]*?([0-9]+)[\S\s]*?([0-9]+)/g.test(consigne);
                var nbs = [parseFloat(RegExp.$1),parseFloat(RegExp.$2),parseFloat(RegExp.$3)],
                    result = nbs[0];
                if (/hausse[\S\s]*?puis/g.test(consigne)){
                    result *= (1+nbs[1]/100)
                } else {
                    result *= (1-nbs[1]/100)
                }
                if (/puis[\S\s]*?hausse/g.test(consigne)){
                    result *= (1+nbs[2]/100)
                } else {
                    result *= (1-nbs[2]/100)
                }
                $("#reply1").val((Math.round(result*100)/100).toString());
                $("input[type=submit]").trigger("click");
            },
            "Evolutions successives 2": function(e){
                e.preventDefault();
                var consigne = $(".oefstatement").text();
                /([0-9]+)\s+%[\S\s]*?([0-9]+)\s+%/g.test(consigne);
                var nbs = [parseFloat(RegExp.$1),parseFloat(RegExp.$2)],
                    result = 1;
                console.log(nbs);
                if (/hausse[\S\s]*?puis/g.test(consigne)){
                    console.log("hausse")
                    result *= (1+nbs[0]/100)
                } else {
                    result *= (1-nbs[0]/100)
                }
                if (/puis\s+une\s+hausse/g.test(consigne)){
                    console.log("hausse")
                    result *= (1+nbs[1]/100)
                } else {
                    result *= (1-nbs[1]/100)
                }
                result -= 1;
                if (result < 0){
                    $("#reply1 option[value=baisse]").prop("selected",true);
                } else {
                    $("#reply1 option[value=hausse]").prop("selected",true);
                }
                $("#reply2").val((Math.round(Math.abs(result*100)*10000)/10000).toString());
                $("input[type=submit]").trigger("click");
            },
            "Evolutions successives 3": function(e){
                e.preventDefault();
                var consigne = $(".oefstatement").text();
                /([0-9]+)/g.test(consigne);
                var nb = parseFloat(RegExp.$1),
                    result;
                if (/augmente\s+/g.test(consigne)){
                    result = Math.round((1-(1/(1+(nb/100))))*10000)/100;
                } else {
                    result = Math.round(((1/(1-(nb/100)))-1)*10000)/100;
                }
                $("#reply1").val(result);
                $("input[type=submit]").trigger("click");
            },
            "Facture et TVA": function(e){
                e.preventDefault();
                var consigne = $(".oefstatement").text();
                /([0-9]+(?:\.[0-9]+)?)[\S\s]*?([0-9]+(?:\.[0-9]+)?)[\S\s]*?([0-9]+(?:\.[0-9]+)?)[\S\s]*?([0-9]+(?:\.[0-9]+)?)[\S\s]*?([0-9]+(?:\.[0-9]+)?)[\S\s]*?([0-9]+(?:\.[0-9]+)?)/g.test(consigne.replace(/type\s+[1-2]/g,""));
                var nbs = [parseFloat(RegExp.$1),parseFloat(RegExp.$2),parseFloat(RegExp.$3),
                    parseFloat(RegExp.$4),parseFloat(RegExp.$5),parseFloat(RegExp.$6)],
                    result, HT;
                    console.log(nbs);
                    //Colonne 1
                    result = arr(nbs[0]*nbs[1]/100,100);
                    $("#reply2").val(result);
                    result = HT = arr(nbs[0]-result,100);
                    $("#reply3").val(result);
                    result = arr(nbs[4]*result/100,100);
                    $("#reply5").val(result);
                    result = arr(HT + result,100);
                    $("#reply7").val(result);

                    //Colonne2
                    result = arr(nbs[3]/(nbs[2]/100),100);
                    $("#reply1").val(result);
                    result = HT = arr(result - nbs[3],100);
                    $("#reply4").val(result);
                    result = arr(HT*nbs[5]/100,100);
                    $("#reply6").val(result);
                    result = arr(HT + result,100);
                    $("#reply8").val(result);
                    
                    $("input[type=submit]").trigger("click");
            },
            "Proportion 1": function(e){
                e.preventDefault();
                var consigne = $(".oefstatement").text();
                /([0-9]+)[\S\s]*?([0-9]+)[\S\s]*?([0-9]+)/.test(consigne);
                var nbs = [parseFloat(RegExp.$2),parseFloat(RegExp.$2)-parseFloat(RegExp.$3)];
                $("#reply1").val(fracIr(nbs[1],nbs[0]));
                $("#reply2").val(arr((nbs[1]/nbs[0])*100,10));
                $("input[type=submit]").trigger("click");
            },
            "Proportion 2": function(e){
                e.preventDefault();
                var consigne = $(".oefstatement").text();
                /de\s+([0-9]+)\./g.test(consigne);
                var nbs = [parseFloat($(".mjx-char.MJXc-TeX-main-R").first().text()),
                parseFloat(RegExp.$1)];
                if (/non chômeurs/.test(consigne)){
                    $("#reply1").val(arr(nbs[1]*(1-nbs[0]/100),1));
                } else {
                    $("#reply1").val(arr(nbs[1]*nbs[0]/100,1));
                }
                $("input[type=submit]").trigger("click");
            },
            "Comparaison 2": function(e){
                e.preventDefault();
                var consigne = $(".oefstatement").html();
                /<td>([0-9]+)<\/td>[\s\S]*<td>([0-9]+)<\/td>[\s\S]*<td>([0-9]+)<\/td>[\s\S]*<td>([0-9]+)<\/td>[\s\S]*<td>([0-9]+)<\/td>[\s\S]*<td>([0-9]+)<\/td>[\s\S]*<td>([0-9]+)<\/td>[\s\S]*<td>([0-9]+)<\/td>[\s\S]*/g.test(consigne);
                var nbs = [
                    [parseFloat(RegExp.$1),parseFloat(RegExp.$5)],
                    [parseFloat(RegExp.$2),parseFloat(RegExp.$6)],
                    [parseFloat(RegExp.$3),parseFloat(RegExp.$7)],
                    [parseFloat(RegExp.$4),parseFloat(RegExp.$8)]
                ],
                    proportions = [];
                for (var i = 0; i<4 ; i++){
                    proportions.push(nbs[i][1]/(nbs[i][0] + nbs[i][1]));
                }
                var max = Math.max.apply(null,proportions);
                $("#reply1_"+(proportions.indexOf(max)+1)).prop("checked",true);
                $("#reply2").val(arr(max*100,10));
                $("input[type=submit]").trigger("click");
            },
            "Proportion 3": function(e){
                e.preventDefault();
                var consigne = $(".oefstatement").text().replace(/Dans un groupe/g,"")
                                                        .replace(/\s+un\s+/," 1 ")
                                                        .replace(/\s+deux\s+/," 2 ")
                                                        .replace(/\s+trois\s+/," 3 ")
                                                        .replace(/\s+quatre\s+/," 4 ")
                                                        .replace(/\s+cinq\s+/," 5 ")
                                                        .replace(/\s+six\s+/," 6 ")
                                                        .replace(/\s+sept\s+/," 7 ")
                                                        .replace(/\s+huit\s+/," 8 ")
                                                        .replace(/\s+neuf\s+/," 9 ")
                                                        .replace(/\s+dix\s+/," 11 ")
                                                        .replace(/\s+demis?\s+/,"/2 ")
                                                        .replace(/\s+tiers\s+/,"/3 ")
                                                        .replace(/\s+quarts?\s+/,"/4 ")
                                                        .replace(/\s+cinquièmes?\s+/,"/5 ")
                                                        .replace(/\s+sixièmes?\s+/,"/6 ")
                                                        .replace(/\s+septièmes?\s+/,"/7 ")
                                                        .replace(/\s+huitièmes?\s+/,"/8 ")
                                                        .replace(/\s+neuvièmes?\s+/,"/9 ")
                                                        .replace(/\s+dixièmes?\s+/,"/10 ");
                    /([0-9]+)\/([0-9]+)[\s\S]*?([0-9]+)/g.test(consigne);
                    var nbs = [parseFloat(RegExp.$1),parseFloat(RegExp.$2),parseFloat(RegExp.$3)];
                    console.log(consigne);
                    console.log(nbs);
                    $("#reply1").val(arr((nbs[2]/(1-(nbs[0]/nbs[1])))-nbs[2],1));
                    $("input[type=submit]").trigger("click");
            },
            "Proportion 4": function(e){
                e.preventDefault();
                var consigne = $(".oefstatement").text();
                /([0-9]+)[\s\S]*?([0-9]+)[\s\S]*?([0-9]+)/g.test(consigne);
                var nbs = [parseFloat(RegExp.$1),parseFloat(RegExp.$2),parseFloat(RegExp.$3)];
                $("#reply1").val(arr(nbs[0]/(nbs[1]/nbs[2]),1));
                $("input[type=submit]").trigger("click");
            }
    }
    $(".wims_exo_item").each(function(i,v){
        if (~Object.keys(knownExs).indexOf($("#"+$(v).attr("id")+" a").html().trim())){
            $(v).append("<p style='color: green;'>cheat : oui</p>");
        } else {
            $(v).append("<p style='color: red;'>cheat : non</p>");
        }
    });
    
    if (~Object.keys(knownExs).indexOf(extitle)){
        $(".send_answer").after("<button id='cheat_auto'>Automatique</button>");
        $("#cheat_auto").click(knownExs[extitle]);
    } else {
        $(".send_answer").after("<p><b>WIMS CHEAT : </b>Il n'y a pas encore de cheat disponible pour cet exercice :-(</p>");
    }
});