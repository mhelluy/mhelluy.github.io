$(function () {
    var questions = [],
        questionsDiv = document.getElementById("questions"),
        currentImgInsertField = "#compl0",
        idFieldsCorr = {
            "complimg": "#compl",
            "expliimg": "#expli",
            "modactimg": "#modact"
        },
        quizname = "questions";

    function redefineIds() {
        questions.forEach(function (v, i, a) {
            v.id = i;
        });
    }
    function Question() {
        var OBJQ = this;
        this.id = questions.length
        questions.push(this);
        this.el = {};
        this.el.div = document.createElement("div");
        this.el.div.id = "divquest" + this.id;
        this.object = {};
        this.choiceQuestion = function () {
            $(this.el.div).html("<h1>Question n°" + this.id + "</h1>\
        <label for='choicebt" + this.id + "'>Question à choix</label><input checked value='choice' type='radio' name='typequest" + this.id + "' id='choicebt" + this.id + "'/>\
        <label for='cashbt" + this.id + "'>Question 'cash'</label><input type='radio' value='cash' name='typequest" + this.id + "' id='cashbt" + this.id + "'/><br/>\
        <label for='question" + this.id + "'>Question : </label><input type='text' placeholder='?' id='question" + this.id + "'/><br/>\
        <label for='compl" + this.id + "'>Informations complémentaires (facultatif) : </label><button class='btimg' id='complimg" + this.id + "'>Image</button><textarea id='compl" + this.id + "'/><br/>\
        <label for='choice0_" + this.id + "'>Choix 0 : </label><input class='choices" + this.id + "' type='text' id='choice0_" + this.id + "'/><label for='correct0_" + this.id + "'>Correct?</label><input class='corrects_check" + this.id + "' value='0' type='checkbox' id='correct0_" + this.id + "' disabled/><br/>\
        <label for='choice1_" + this.id + "'>Choix 1 : </label><input class='choices" + this.id + "' type='text' id='choice1_" + this.id + "'/><label for='correct1_" + this.id + "'>Correct?</label><input class='corrects_check" + this.id + "' value='1' type='checkbox' id='correct1_" + this.id + "' disabled/><br/>\
        <label for='choice2_" + this.id + "'>Choix 2 : </label><input class='choices" + this.id + "' type='text' id='choice2_" + this.id + "'/><label for='correct2_" + this.id + "'>Correct?</label><input class='corrects_check" + this.id + "' value='2' type='checkbox' id='correct2_" + this.id + "' disabled/><br/>\
        <label for='choice3_" + this.id + "'>Choix 3 : </label><input class='choices" + this.id + "' type='text' id='choice3_" + this.id + "'/><label for='correct3_" + this.id + "'>Correct?</label><input class='corrects_check" + this.id + "' value='3' type='checkbox' id='correct3_" + this.id + "' disabled/><br/>\
        <label for='expli" + this.id + "'>Explications après réponse (facultatif) : </label><button class='btimg' id='expliimg" + this.id + "'>Image</button><textarea id='expli" + this.id + "'/><br/>\
        <label for='modact" + this.id + "'>Contenu accessible par le modérateur (facultatif) : </label><button class='btimg' id='modactimg" + this.id + "'>Image</button><textarea id='modact" + this.id + "'/><br/>\
        <label for='time" + this.id + "'>Temps de réponse : </label><input type='number' value='30' min='5' id='time" + this.id + "'/><br/>\
        <label for='score" + this.id + "'>Score (sans bonus) : </label><input type='number' value='100' min='0' id='score" + this.id + "'/><br/>\
        ");
        };
        this.cashQuestion = function () {
            $(this.el.div).html("<h1>Question n°" + this.id + "</h1>\
            <label for='choicebt" + this.id + "'>Question à choix</label><input value='choice' type='radio' name='typequest" + this.id + "' id='choicebt" + this.id + "'/>\
            <label for='cashbt" + this.id + "'>Question 'cash'</label><input checked value='cash' type='radio' name='typequest" + this.id + "' id='cashbt" + this.id + "'/><br/>\
        <label for='question" + this.id + "'>Question : </label><input type='text' placeholder='?' id='question" + this.id + "'/><br/>\
        <label for='compl" + this.id + "'>Informations complémentaires (facultatif) : </label><button class='btimg' id='complimg" + this.id + "'>Image</button><textarea id='compl" + this.id + "'/><br/>\
        <label for='exact_answer" + this.id + "'>Réponse exacte : </label><input type='text' id='exact_answer" + this.id + "'/><br/>\
        <label for='answer" + this.id + "'>Réponse acceptée (regex) : </label><input type='text' id='answer" + this.id + "'/><br/>\
        <label for='expli" + this.id + "'>Explications après réponse (facultatif) : </label><button class='btimg' id='expliimg" + this.id + "'>Image</button><textarea id='expli" + this.id + "'/><br/>\
        <label for='modact" + this.id + "'>Contenu accessible par le modérateur (facultatif) : </label><button class='btimg' id='modactimg" + this.id + "'>Image</button><textarea id='modact" + this.id + "'/><br/>\
        <label for='time" + this.id + "'>Temps de réponse : </label><input type='number' value='30' min='5' id='time" + this.id + "'/><br/>\
        <label for='score" + this.id + "'>Score (sans bonus) : </label><input type='number' value='100' min='0' id='score" + this.id + "'/><br/>\
        ");
        };
        this.choiceQuestion();
        this.defEvents = function () {
            $("#choicebt" + this.id).click(function () {
                OBJQ.choiceQuestion();
                delete OBJQ.object.exact_answer;
                OBJQ.defEvents();
            });
            $("#cashbt" + this.id).click(function () {
                OBJQ.cashQuestion();
                delete OBJQ.object.choices;
                delete OBJQ.object.answer;
                OBJQ.defEvents();
            });
            $("#question" + this.id).change(function (e) {
                OBJQ.object.question = e.currentTarget.value;
            });
            $("#compl" + this.id).change(function (e) {
                if (e.currentTarget.value == "") {
                    delete OBJQ.object.compl;
                } else {
                    OBJQ.object.compl = e.currentTarget.value;
                }
            });
            $("#expli" + this.id).change(function (e) {
                if (e.currentTarget.value == "") {
                    delete OBJQ.object.expli;
                } else {
                    OBJQ.object.expli = e.currentTarget.value;
                }
            });
            $("#modact" + this.id).change(function (e) {
                if (e.currentTarget.value == "") {
                    delete OBJQ.object.modact;
                } else {
                    OBJQ.object.modact = e.currentTarget.value;
                }
            });
            $("#time" + this.id).change(function (e) {
                OBJQ.object.time = parseInt(e.currentTarget.value);
            });
            $("#score" + this.id).change(function (e) {
                OBJQ.object.score = parseInt(e.currentTarget.value);
            });
            this.el.choicesansw = $(".choices" + this.id + ", .corrects_check" + this.id);
            var count1 = 0;

            this.el.choicesansw.each(function (i, v) {
                (function (count1) {
                    $(v).change(function (e) {
                        if (e.currentTarget.value == "") {
                            $("#correct" + count1 + "_" + OBJQ.id).get()[0].checked = false;
                            $("#correct" + count1 + "_" + OBJQ.id).get()[0].disabled = true;
                        } else if (v.className == "choices" + OBJQ.id) {
                            $("#correct" + count1 + "_" + OBJQ.id).get()[0].disabled = false;
                        }
                        OBJQ.object.choices = [];
                        OBJQ.object.answer = [];
                        var count2 = 0;
                        $(".choices" + OBJQ.id).each(function (j, w) {
                            if (w.value != "") {
                                OBJQ.object.choices.push(w.value);
                                if ($("#correct" + j + "_" + OBJQ.id).get()[0].checked) {
                                    OBJQ.object.answer.push(count2);
                                }
                                count2++
                            }
                        });
                    });
                })(count1);

                if (v.className == "choices" + OBJQ.id) {
                    count1++
                }
            });
            this.regex_answer = $("#answer" + OBJQ.id).get()[0];
            $("#exact_answer" + this.id).change(function (e) {
                OBJQ.object.exact_answer = e.currentTarget.value;
                if (OBJQ.regex_answer.value == "") {
                    OBJQ.regex_answer.value = "(?i)^\\\\s*" + e.currentTarget.value.replace(/\s+/ig, "\\\\s*")
                        .replace(/[éèëê]/ig, "[eéèëê]")
                        .replace(/[àáâä]/ig, "[aàáâä]") + "\\\\s*$";
                    OBJQ.object.answer = OBJQ.regex_answer.value;
                }
            });
            $("#answer" + this.id).change(function (e) {
                OBJQ.object.answer = OBJQ.regex_answer.value;
            });
            $(".btimg").click(function (e) {
                currentImgInsertField = idFieldsCorr[e.currentTarget.id.replace(/[0-9]/g,"")] + OBJQ.id;
                $("#overlay").show();
            });

        };
        $("#select_url").click(function () {
            $("#entry_file").get()[0].disabled = true;
            $("#entry_file").get()[0].value = "";
            $("#entry_url").get()[0].disabled = false;
            $("#okbutton").get()[0].disabled = true
        });
        $("#select_file").click(function () {
            $("#entry_file").get()[0].disabled = false;
            $("#entry_url").get()[0].disabled = true;
            $("#entry_url").get()[0].value = "";
            $("#okbutton").get()[0].disabled = true
        });
        $("#entry_file").change(function (e) {
            if ($("#select_file").get()[0].checked) {
                if (e.currentTarget.value == "") {
                    $("#okbutton").get()[0].disabled = true;
                } else {
                    $("#okbutton").get()[0].disabled = false;
                }
            }
        });
        $("#entry_url").change(function (e) {
            if ($("#select_url").get()[0].checked) {
                if (e.currentTarget.value == "") {
                    $("#okbutton").get()[0].disabled = true;
                } else {
                    $("#okbutton").get()[0].disabled = false;
                }
            }
        });
        $("#okbutton").click(function (e) {
            var ancval = $(currentImgInsertField).get()[0].value;
            $(currentImgInsertField).get()[0].value = ancval + (ancval == "" ? "" : "\n<br/>\n") + "<img src=\"" +
                ($("#select_url").get()[0].checked ? $("#entry_url").val() : $("#entry_file").val()) +
                "\"/>";
            $("#overlay").hide();
        });
        $("#cancelbutton").click(function (e) {
            $("#overlay").hide();
        });



        questionsDiv.appendChild(this.el.div);
        this.defEvents();
        this.object.time = 30;
        this.object.score = 100;
        // $(document).keydown(function (e) {
        //     if (e.key == "$") {
        //         console.log(OBJQ.object);
        //     }
        // });
    }
    $("#nomquiz").change(function(){
        $("#startbutton").show();
    });
    $("#startbutton").click(function(){
        quizname = $("#nomquiz").val().replace(/\s+/ig,"_");
        new Question();
        $("#expimport").html($("#expimport").html().replace(/\[nomQuiz\]/,quizname));
        $("#content_generated p").html($("#content_generated p").html().replace(/\[nomQuiz\]/,quizname));
        $("#addquestion").show();
        $("#generate").show();
        $("#start").hide();
    });
    $("#addquestion").click(function(){
        new Question();
    });
    $("#generate").click(function(){
        $("#content_generated").show();
        var finalObj = [];
        questions.forEach(function(v,i,a){
            finalObj.push(v.object);
        });
        $("#filecontent").val(JSON.stringify(finalObj,null,6));
    });

});