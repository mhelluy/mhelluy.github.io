$(function(){
    var version = "1.2",
        changelog = 
`Ajout des exercices 2 et 5 feuille 15 équation produit`;

    if (version != localStorage["chwims_namespace::version"]){
        changelog = "<ul><li> - " + changelog.split(/\n/g).join("</li><li> - ") + "</li></ul>";
        $("body").append(
`<div id="chwims_overlay">
            <div>
                <h1>Cheat Wims</h1>
                <h2>Version ` + version + `
                <p>` + changelog + `</p>
                <input type='button' value='OK' id='chwims_ok'/>
            </div>
</div>`
)
        $("#chwims_overlay").css({
            "position": "fixed",
            "top": "0",
            "left": "0",
            "width": "100%",
            "height": "100%",
        });
        $("#chwims_overlay div").css({
            "width": "60%",
            "margin": "auto",
            "margin-top": "100px",
            "text-align": "center",
            "background": "white",
            "border": "solid 2px grey",
            "border-radius": "20px",
            "font-family": "Calibri, sans-serif"
        });
        $("#chwims_overlay h1").css({
            "background": "linear-gradient(rgb(255,255,255),rgb(128,128,128))",
            "margin-top": "0",
            "padding": "10px",
            "border-radius": "20px 20px 0 0"
        });
        $("#chwims_overlay div ul").css({
            "list-style": "none",
            "text-align": "justify",
            "font-weight": "unset"
        });
        $("#chwims_ok").click(function(){
            $("#chwims_overlay").hide();
            localStorage["chwims_namespace::version"] = version;
        })
    }
});

function clearChWimsStorage(){
    delete localStorage["chwims_namespace::version"];
    return "cleared";
};