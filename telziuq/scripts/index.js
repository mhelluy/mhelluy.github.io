$(function () {

    let lists = localStorage['telziuq-lists'] ? JSON.parse(localStorage['telziuq-lists']) : [];

    if (lists.length == 0) {
        $("#lists").html("<p>Aucun élément à afficher.</p>");
    } else {
        $("#lists").html("<ul id='ull'></ul>");
        for (let i = 0; i < lists.length; i++) {
            $("#ull").append("<li id='list"+ i + "'><a href=\"learn.html?listId=" + i + "\">" + lists[i]["name"] + "</a></li>");
            $("#list" + i).append(`<ul><li><button class='delete' id='delete` + i + `'>Supprimer</button></li><li>
            <button class='export' id='export` + i + `'>Exporter</button></li></ul>`);
        }
    }

    $(".delete").click(function(e){
        e.preventDefault();
        let id = e.target.id.replace("delete", "");
        if (confirm("Voulez-vous vraiment supprimer la liste \"" + lists[id]["name"] + "\" ?")) {
            let id = e.target.id.replace("delete", "");
            lists.splice(id, 1);
            if (lists.length == 0) {
                delete localStorage["telziuq-lists"];
            } else {
                localStorage['telziuq-lists'] = JSON.stringify(lists);$
            }
            location.reload();
        }
    });

    $(".export").click(function(e){
        e.preventDefault();
        let id = e.target.id.replace("export", "");
        let list = lists[id];
        //exporter la liste
        let data = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(list));
        let a = document.createElement('a');
        a.href = data;
        a.download = list["name"] + ".json";
        a.click();
        
    });

    $("#file").change(function (e) {
        // on récupère le fichier
        let file = $(this)[0].files[0];
        // on vérifie qu'il existe
        if (file) {
            // on lit le fichier
            let reader = new FileReader();
            reader.readAsText(file);
            reader.onload = function () {
                // on récupère le contenu du fichier
                let content = reader.result;
                // on le parse
                let json = JSON.parse(content);
                // on vérifie le format de la liste
                if (json["format"] === "telziuq" && json["name"] && json["terms"]) {
                    // on ajoute la liste
                    lists.push(json);
                    // on sauvegarde les listes
                    localStorage['telziuq-lists'] = JSON.stringify(lists);
                    // on recharge la page
                    location.reload();
                } else {
                    $("#error").html("Le format du fichier est incorrect.");
                }
            }
        }
    });

});