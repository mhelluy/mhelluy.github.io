/* Littéral.js est une bibliothèque de fonctions programmées en Java Script
 * Veuillez ne pas la modifier sous peine de provoquer des bugs incontrolables
 *
 * Pour tous renseignements, veuillez me contacter :
 * Jean-Philippe.blaise@ac-amiens.fr
 *
 * Un zip d'exemples d'intégration de ce .js  dans des pages html 
 * peut vous être envoyé.
 *
 * Version avec la gestion de 25 puissance 0 : en cours de test ...
 * Version beta : en test : compareracine(strin1,strin2) : test ok !
 * Version avec des variables différentes pour le comparateur ...
 */
var degredeprecision = 12;
function choixlettre(st) {
  st = ' ' + st;
  var lettre = 'sgdsdg';
  var lettretest = 'sgdgssdg';
  var changement = false;
  var s
  while (st.search('pi') > -1) {
    st = st.replace("pi", "1");
  }
  while (st.search('r') > -1) {
    st = st.replace("r", "1");
  }
  while (st.search('R') > -1) {
    st = st.replace("R", "1");
  }
  var i;
  for (i = 0; i < st.length; i++) {
    s = st.charAt(i);
    if ((s == "=") || (s == "_") || (s == ",") || (s == ".") || (s == " ") || (s == "1") || (s == "2") || (s == "3") || (s == "4") || (s == "5") || (s == "6") || (s == "7") || (s == "8") || (s == "9") || (s == "0") || (s == "^") || (s == "+") || (s == "-") || (s == "*") || (s == "/") || (s == ":") || (s == ")") || (s == "(") || (s == "[") || (s == "]") || (s == "²") || (s == "³") || (s == lettre)) { s = s; }
    else {
      if (changement) {
        //alert('Il y a trop de variables !'+'['+s+'] ['+lettre+']'); 
        return 'non';
      }
      changement = true;
      var sbis = s;
      lettretest = sbis.toLowerCase();
      if ((lettretest == "a") || (lettretest == "b") || (lettretest == "c") || (lettretest == "d") || (lettretest == "e") || (lettretest == "f") || (lettretest == "g") || (lettretest == "h") || (lettretest == "i") || (lettretest == "j") || (lettretest == "k") || (lettretest == "l") || (lettretest == "m") || (lettretest == "n") || (lettretest == "o") || (lettretest == "p") || (lettretest == "q") || (lettretest == "s") || (lettretest == "t") || (lettretest == "u") || (lettretest == "v") || (lettretest == "w") || (lettretest == "x") || (lettretest == "y") || (lettretest == "z")) {
        // alert('On change de variable, on passe à  :  '+s);
        lettre = s;
      }
      else {//alert('Erreur de variable ( '+s+' )'); 
        return 'non';
      }
    }
  }

  //alert( 'La variable est  '+lettre);
  // if (lettre=="x") {} else {alert('La variable utilisée est [ '+lettre+' ]');}
  return lettre;
}



function equivalent(a, b) {
  a = a.replace("^2", "²");
  b = b.replace("^2", "²");
  alert
  while (a.lastIndexOf("*") > 0) a = a.replace("*", "");
  while (b.lastIndexOf("*") > 0) b = b.replace("*", "");

  var retour = false;
  var a_termes = new Array();
  var b_termes = new Array();
  var j = 0;
  var i = 0;
  var s = "";
  var a_longueur = a.length;
  j = 0;
  a_termes[0] = "";
  for (i = 0; i < a_longueur; i++) {
    s = a.charAt(i);
    if ((i == 0) && ((s != "+") && (s != "-"))) a_termes[j] = "+";
    if ((i > 0) && ((s == "+") || (s == "-"))) { j++; a_termes[j] = ""; }
    if (s != " ") a_termes[j] = a_termes[j] + s;
  }
  var nb_termes_a = j + 1;
  var b_longueur = b.length;
  j = 0;
  b_termes[0] = "";
  for (i = 0; i < b_longueur; i++) {
    s = b.charAt(i);
    if ((i == 0) && ((s != "+") && (s != "-"))) b_termes[j] = "+";
    if ((i > 0) && ((s == "+") || (s == "-"))) { j++; b_termes[j] = ""; }
    if (s != " ") b_termes[j] = b_termes[j] + s;
  }
  var nb_termes_b = j + 1;
  var reconus = 0;

  if (nb_termes_a == nb_termes_b) {
    //alert ("même nombre de termes : "+nb_termes_a);
    for (i = 0; i < nb_termes_a; i++) {
      for (j = 0; j < nb_termes_a; j++) {
        if (a_termes[i] == b_termes[j]) {
          //alert (a_termes[i]+ " est reconnu identique");
          reconus++;
          a_termes[i] = "$" + i;
          b_termes[j] = "£" + j;
        } //else alert (a_termes[i]+ " est different de "+ b_termes[j]);

      }
    }
    if (reconus == nb_termes_a) retour = true;
  }
  return retour;
}

function est_factorise(a) {
  //preparation de la chaine
  lettre_util = choixlettre(a);
  if (lettre_util != "x") {
    while (a.search(lettre_util) > -1) {
      a = a.replace(lettre_util, "x");
    }
  }
  retour = analyse(a);
  if (retour == 'ok') {
    a = preparecaract(a);
    a = prepare(a);
    //alert (a);
  }
  else {
    //alert("Il y a une erreur d'écriture");
    return false;
  }
  //découpage en facteurs
  var retour = true;
  var a_fact = new Array();
  var a_longueur = a.length;
  var j = 0;
  var i = 0;
  var s = 0;
  a_fact[0] = "";
  var peut_cont = true;
  for (i = 0; i < a_longueur; i++) {
    s = a.charAt(i);
    // cas ouverture parenthèse)
    if ((((s == "(") || (s == "*") || (s == "×")) && (a_fact[j] != "")) && peut_cont) {

      char_prec = a.charAt(i - 1)
      if ((char_prec == "+") || (char_prec == "-")) {
        alert("la forme n'est pas reduite");
        return false;
      }
      else {
        //alert ("facteur "+j+" : "+a_fact[j]);
        j++;
        a_fact[j] = "";
      }
    }

    if ((s != "(") && (s != "*") && (s != "×") && (s != ")") && (s != " ")) a_fact[j] = a_fact[j] + s;

    if (s == "(") //il faut fermer la parenthèse pour passer au facteur suivant
    {
      peut_cont = false;
      //alert("facteur "+j+" : "+a_fact[j]+" non fini");
    }
    if (s == ")") peut_cont = true; //parenthèse fermée, on peut continuer
  }
  nb_fact_a = j + 1;
  if ((nb_fact_a < 2) && (calcul(a, 0) != 0)) return false;
  //alert ("facteur "+j+" : "+a_fact[j]);
  //alert (nb_fact_a+" facteurs trouvés");

  //verification de l'éxactitude du découpage
  var a_new = "";
  for (i = 0; i < nb_fact_a; i++) {
    a_new += "(" + a_fact[i] + ")"
  }
  if (compare(a, a_new) != "vrai") {
    alert("expression non factorisée");
    return false;
  }

  //verification du nombre de termes de chaque facteur
  for (i = 0; i < nb_fact_a; i++) {
    //alert ("verification du facteur : "+i);
    var b_termes = new Array();
    b = a_fact[i]
    if (b == 1) { alert("Tu as factorisé par 1 ! Ta réponse va être rejetée."); return false; }

    if (factorisable(b) && (b != "x") && (b != "xx") && (b != "xxx") && (b != "xxxx") && (b != "xxxxx") && (b != "xxxxxx")) {//il reste un polynôme factorisable
      b = b.replace("xx", "x²");
      if ("x" != lettre_util) {
        while (b.search("x") > -1) {
          b = b.replace("x", lettre_util);
        }
      }
      alert("Tu n'as pas factorisé (" + b + ") au maximum");
    }
    b_longueur = b.length;
    j = 0;
    b_termes[0] = "";
    for (k = 0; k < b_longueur; k++) {
      s = b.charAt(k);
      if ((s == "*") || (s == "×") || (s == "/")) {
        alert("Il reste un produit ou un quotient dans un des facteurs");
        //return false;
      }
      if ((k == 0) && ((s != "+") && (s != "-"))) b_termes[j] = "+";
      if ((k > 0) && ((s == "+") || (s == "-"))) { j++; b_termes[j] = ""; }
      if (s != " ") b_termes[j] = b_termes[j] + s;
    }
    nb_termes_b = j + 1;
    if (nb_termes_b > 2) {
      alert("le facteur " + b + " comporte " + nb_termes_b + " termes, il faut le simplifier");
      return false;
    }
    //else alert ("le facteur "+b+" comporte "+nb_termes_b+" termes, c'est correct");

  }
  return true;
}




function solpremier(strin1, strin2) {
  if (strin1 == '') return "Erreur";
  if (strin2 == '') return "Erreur";
  if (compare(strin1, strin2) == 'vrai') return 'Erreur';
  if (compare(strin1, strin2) != 'faux') return 'Erreur';
  var st = '(' + strin1 + ')' + '-(' + strin2 + ')';
  return solprem(st);
}

function solprem(strin) {
  var xv = new Array();
  var n;
  var x = new Array();
  var a = new Array(10);
  var xx;
  var li, m, co, joum, k, v, i, j, s;
  for (li = 1; li <= 10; li++) { a[li] = new Array(11) }
  if (analyse(strin) !== 'ok') return "Erreur";
  n = 4;
  for (li = 1; li <= n; li++) {

    trois:
    for (joum = 0; joum < 10; joum++) {
      if (testcalcul(strin, eval(joum * 10 + li))) break trois;
    }
    xx = 10 * joum + li;

    for (co = 1; co <= n + 1; co++) {
      m = "";
      if (co < n + 1) { m = Math.pow(xx, n - co) } else { m = calcul(strin, xx) }
      if (m == null) { return 'Erreur'; } else { a[li][co] = eval(m) }
    }
  }

  for (k = 1; k <= n - 1; k++) {
    v = a[k][k];
    if (v == 0) { v = permu(k, a, n); if (v == 0) { return 'Erreur'; } }
    for (i = k + 1; i <= n; i++) {
      for (j = k + 1; j <= n + 1; j++) {
        a[i][j] = a[i][j] - a[i][k] * a[k][j] / v
      }
    }
  }

  if (a[n][n] == 0) { sing(); return } else { x[n] = a[n][n + 1] / a[n][n] }

  for (i = n - 1; i >= 1; i--) {
    s = 0;
    for (j = i + 1; j <= n; j++) {
      s = s + a[i][j] * x[j]
      x[i] = (a[i][n + 1] - s) / a[i][i]
    }
  }

  for (i = 1; i <= n; i++) {
    if (Math.abs(x[i]) < 0.00000001) x[i] = 0;
    if (Math.abs(x[i] - 1) < 0.00000001) x[i] = 1;
    if (Math.abs(x[i] + 1) < 0.00000001) x[i] = -1;
    xv[i] = x[i];
  }

  var xst, plus, signe;
  var st = "";
  var rien = 0;

  for (i = 1; i <= n; i++) {

    plus = '';
    signe = '+';

    if (x[i] > 0) { if (rien == 0) signe = ''; else signe = '+'; } else { signe = '-'; }
    if (x[i] == 0) plus = ''; else rien++;
    x[i] = Math.abs(x[i]);

    plus = 'x^' + eval(n - i);
    if (i == n) { if (x[i] == 1) plus = '1'; else plus = ''; }
    if (i == n - 1) plus = 'x';
    if (i == n - 2) plus = 'x²';
    if (i == n - 3) plus = 'x³';
    if (x[i] == 1) st = st + signe + plus; else { if (x[i] == 0) st = st; else { xst = frac(x[i], 8); st = st + signe + xst + plus; } }
  }
  if (compare(st, strin) !== 'vrai') return 'Erreur';
  if (xv[1] !== 0) return 'Erreur';
  if (xv[2] == 0) return premiersol(xv[3], xv[4]);

  return "Erreur";


}

function premiersol(b, c) {
  var so;
  if ((b == 0) && (c == 0)) return 'Erreur';
  if (b == 0) return "Erreur";

  so = frac(eval(-c / b), 8);
  return so;
}
function calculfrac(strin, nb, deg) {
  if (testcalcul(deg)) return frac(calcul(strin, nb), deg);
  return "Erreur de degré";
}

status = "Utilisation de Litteral.js (Multivariables), gestion partielle des puissances";
function version() {
  var strin = "Version 11.1 du 14 Mai 2005, contact:Jean-philippe.blaise@ac-amiens.fr";

  return strin;
}

function solution(strin1, strin2) {
  if (strin1 == '') return "Il manque un membre d'équation";
  if (strin2 == '') return "Il manque un membre d'équation";
  if (compare(strin1, strin2) == 'vrai') return 'Tous les nombres sont solutions de cette équation';
  if (compare(strin1, strin2) !== 'faux') return 'Je ne sais pas lire cette équation';
  var st = '(' + strin1 + ')' + '-(' + strin2 + ')';
  return sol(st);
}

function sol(strin) {
  var xv = new Array();
  var n, x = new Array(), a = new Array(10)
  var xx;
  var li, m, co, joum, k, v, i, j, s;
  for (li = 1; li <= 10; li++) { a[li] = new Array(11) }
  if (analyse(strin) !== 'ok') return "Erreur : ecriture";
  n = 4;
  for (li = 1; li <= n; li++) {

    trois:
    for (joum = 0; joum < 10; joum++) {
      if (testcalcul(strin, eval(joum * 10 + li))) break trois;
    }
    xx = 10 * joum + li;

    for (co = 1; co <= n + 1; co++) {
      m = "";
      if (co < n + 1) { m = Math.pow(xx, n - co) } else { m = calcul(strin, xx) }
      if (m == null) { return 'Je ne sais pas'; } else { a[li][co] = eval(m) }
    }
  }

  for (k = 1; k <= n - 1; k++) {
    v = a[k][k];
    if (v == 0) { v = permu(k, a, n); if (v == 0) { return 'je ne sais pas '; } }
    for (i = k + 1; i <= n; i++) {
      for (j = k + 1; j <= n + 1; j++) {
        a[i][j] = a[i][j] - a[i][k] * a[k][j] / v
      }
    }
  }

  if (a[n][n] == 0) { sing(); return } else { x[n] = a[n][n + 1] / a[n][n] }

  for (i = n - 1; i >= 1; i--) {
    s = 0;
    for (j = i + 1; j <= n; j++) {
      s = s + a[i][j] * x[j]
      x[i] = (a[i][n + 1] - s) / a[i][i]
    }
  }

  for (i = 1; i <= n; i++) {
    if (Math.abs(x[i]) < 0.00000001) x[i] = 0;
    if (Math.abs(x[i] - 1) < 0.00000001) x[i] = 1;
    if (Math.abs(x[i] + 1) < 0.00000001) x[i] = -1;
    xv[i] = x[i];
  }

  var xst, plus, signe;
  var st = "";
  var rien = 0;

  for (i = 1; i <= n; i++) {

    plus = '';
    signe = '+';

    if (x[i] > 0) { if (rien == 0) signe = ''; else signe = '+'; } else { signe = '-'; }
    if (x[i] == 0) plus = ''; else rien++;
    x[i] = Math.abs(x[i]);

    plus = 'x^' + eval(n - i);
    if (i == n) { if (x[i] == 1) plus = '1'; else plus = ''; }
    if (i == n - 1) plus = 'x';
    if (i == n - 2) plus = 'x²';
    if (i == n - 3) plus = 'x³';
    if (x[i] == 1) st = st + signe + plus; else { if (x[i] == 0) st = st; else { xst = frac(x[i], 8); st = st + signe + xst + plus; } }
  }
  if (compare(st, strin) !== 'vrai') return 'Je ne sais pas calculer cette équation';
  if (xv[1] !== 0) return 'Je ne sais pas calculer cette équation';
  if (xv[2] == 0) return premier(xv[3], xv[4]);

  return second(xv[2], xv[3], xv[4]);
}

function premier(b, c) {
  var so;
  if ((b == 0) && (c == 0)) return 'Tous les nombres sont solutions';
  if (b == 0) return "Il n'y a pas de solutions";

  so = frac(eval(-c / b), 8);
  return 'Je trouve x= ' + so + ' comme solution';
}

function second(a, b, c) {

  var disc = b * b - (4 * a * c);

  /alert(disc);/
  if (Math.abs(disc) < 0.00000001) disc = 0;

  if (disc < 0) return "Il n'y a pas de solutions";
  if (disc == 0) return 'Je trouve x=' + frac(eval(-b / 2 / a), 8) + ' comme solution';

  if (fracden(Math.sqrt(disc), 8) > 1000) {
    if (b != 0) return "Je ne sais pas le faire au collège (delta=" + disc + ')'; else return "J'ai trouvé deux solutions x= Rac(" + frac(eval(-c / a), 5) + ") et x= -Rac(" + frac(eval(-c / a), 5) + ")";
  }
  var sol1 = eval((-b - Math.sqrt(disc)) / (2 * a));
  var sol2 = eval((-b + Math.sqrt(disc)) / (2 * a));

  /if (Math.round(Math.sqrt(disc))==Math.sqrt(disc)) /
  return "J'ai trouvé deux solutions : x= " + frac(sol1, 8) + ' et x= ' + frac(sol2, 8) + ' .';
}

function factorisable(strin) {
  var xv = new Array();
  var n, x = new Array(), a = new Array(10)
  var xx;
  var li, m, co, joum, k, v, i, j, s;
  for (li = 1; li <= 10; li++) { a[li] = new Array(11) }
  if (analyse(strin) !== 'ok') return false;
  n = 4;
  for (li = 1; li <= n; li++) {

    trois:
    for (joum = 0; joum < 10; joum++) {
      if (testcalcul(strin, eval(joum * 10 + li))) break trois;
    }
    xx = 10 * joum + li;

    for (co = 1; co <= n + 1; co++) {
      m = "";
      if (co < n + 1) { m = Math.pow(xx, n - co) } else { m = calcul(strin, xx) }
      if (m == null) { return false; } else { a[li][co] = eval(m) }
    }
  }

  for (k = 1; k <= n - 1; k++) {
    v = a[k][k];
    if (v == 0) { v = permu(k, a, n); if (v == 0) { return false; } }
    for (i = k + 1; i <= n; i++) {
      for (j = k + 1; j <= n + 1; j++) {
        a[i][j] = a[i][j] - a[i][k] * a[k][j] / v
      }
    }
  }

  if (a[n][n] == 0) { sing(); return } else { x[n] = a[n][n + 1] / a[n][n] }

  for (i = n - 1; i >= 1; i--) {
    s = 0;
    for (j = i + 1; j <= n; j++) {
      s = s + a[i][j] * x[j]
      x[i] = (a[i][n + 1] - s) / a[i][i]
    }
  }

  for (i = 1; i <= n; i++) {
    if (Math.abs(x[i]) < 0.00000001) x[i] = 0;
    if (Math.abs(x[i] - 1) < 0.00000001) x[i] = 1;
    if (Math.abs(x[i] + 1) < 0.00000001) x[i] = -1;
    xv[i] = x[i];
  }

  var xst, plus, signe;
  var st = "";
  var rien = 0;

  for (i = 1; i <= n; i++) {

    plus = '';
    signe = '+';

    if (x[i] > 0) { if (rien == 0) signe = ''; else signe = '+'; } else { signe = '-'; }
    if (x[i] == 0) plus = ''; else rien++;
    x[i] = Math.abs(x[i]);

    plus = 'x^' + eval(n - i);
    if (i == n) { if (x[i] == 1) plus = '1'; else plus = ''; }
    if (i == n - 1) plus = 'x';
    if (i == n - 2) plus = 'x²';
    if (i == n - 3) plus = 'x³';
    if (x[i] == 1) st = st + signe + plus; else { if (x[i] == 0) st = st; else { xst = frac(x[i], 8); st = st + signe + xst + plus; } }
  }
  if (compare(st, strin) !== 'vrai') return false;
  if (xv[1] !== 0) return false;
  if (xv[2] == 0) return fact_premier(xv[3], xv[4]);

  return fact_second(xv[2], xv[3], xv[4]);
}

function fact_premier(b, c) {
  if ((c == 0) || (b == 0)) return false;
  if (pgcd(b, c) > 1) return true;
  else return false;
}

function fact_second(a, b, c) {

  var disc = b * b - (4 * a * c);

  //alert(disc);/
  if (Math.abs(disc) < 0.00000001) disc = 0;

  if (disc < 0) return false;
  if ((disc == 0) && (b != 0)) return true;
  if ((disc == 0) && (b == 0)) return false;

  if (fracden(Math.sqrt(disc), 8) > 1000) {
    if (b != 0) return false; else return true;
  }
  //var sol1=eval((-b-Math.sqrt(disc))/(2*a));
  //var sol2=eval((-b+Math.sqrt(disc))/(2*a));

  //if (Math.round(Math.sqrt(disc))==Math.sqrt(disc)) /
  return true;
}

function testcalcul(strin, nb) {
  var txt = '';
  txt = '' + calcul2(strin, nb);
  if (txt.charAt(0) == 'N') return false;
  if (txt.charAt(0) == 'E') return false; else return true;
}
function pivot(strin) {
  var li, co, m, k, v, i, j, s, plus, signe;
  var n, x = new Array(), a = new Array(10)
  var xx;
  var lettre = choixlettre(strin);
  if (lettre == "x") { lettre = lettre; }
  else {
    while (strin.search(lettre) > -1) {
      strin = strin.replace(lettre, 'x');
    }
  }

  for (li = 1; li <= 10; li++) { a[li] = new Array(11) }
  if (analyse(strin) !== 'ok') return "Erreur : ecriture";
  if (compare(strin, '0') == "vrai") return "0";

  n = 7;
  for (li = 1; li <= n; li++) {
    var joum;
    trois:
    for (joum = 0; joum < 10; joum++) {
      if (testcalcul(strin, eval(joum * 10 + li))) break trois;
    }
    xx = 10 * joum + li;

    for (co = 1; co <= n + 1; co++) {
      m = "";
      if (co < n + 1) { m = Math.pow(xx, n - co) } else { m = calcul(strin, xx) }
      if (m == null) { return 'Je ne sias pas'; } else { a[li][co] = eval(m) }
    }
  }

  for (k = 1; k <= n - 1; k++) {
    v = a[k][k];
    if (v == 0) { v = permu(k, a, n); if (v == 0) { return 'je ne sais pas '; } }
    for (i = k + 1; i <= n; i++) {
      for (j = k + 1; j <= n + 1; j++) {
        a[i][j] = a[i][j] - a[i][k] * a[k][j] / v
      }
    }
  }

  if (a[n][n] == 0) { sing(); return } else { x[n] = a[n][n + 1] / a[n][n] }

  for (i = n - 1; i >= 1; i--) {
    s = 0;
    for (j = i + 1; j <= n; j++) {
      s = s + a[i][j] * x[j]
      x[i] = (a[i][n + 1] - s) / a[i][i]
    }
  }

  for (i = 1; i <= n; i++) {
    if (Math.abs(x[i]) < 0.0001) x[i] = 0;
    if (Math.abs(x[i] - 1) < 0.0001) x[i] = 1;
    if (Math.abs(x[i] + 1) < 0.0001) x[i] = -1;
  }

  var xst;
  var st = "";
  var rien = 0;

  for (i = 1; i <= n; i++) {

    plus = '';
    signe = '+';

    if (x[i] > 0) { if (rien == 0) signe = ''; else signe = '+'; } else { signe = '-'; }
    if (x[i] == 0) plus = ''; else rien++;
    x[i] = Math.abs(x[i]);

    plus = 'x^' + eval(n - i);
    if (i == n) { if (x[i] == 1) plus = '1'; else plus = ''; }
    if (i == n - 1) plus = 'x';
    if (i == n - 2) plus = 'x²';
    if (i == n - 3) plus = 'x³';
    if (x[i] == 1) st = st + signe + plus; else { if (x[i] == 0) st = st; else { xst = frac(x[i], 5); st = st + signe + xst + plus; } }
  }

  if (compare(st, strin) == 'vrai') {
    if (lettre == "x") { }
    else {
      while (st.search('x') > -1) {
        st = st.replace('x', lettre);
      }
    } return st;
  } else return 'Je ne sais pas';


}

function permu(k, a, n) {
  var q, li, i, aux;
  q = 0; li = k;
  while (a[li][k] == 0) {
    q++; li = q + k;
    if (li == n + 1) { return 0 }
  }
  for (i = 1; i <= n + 1; i++) { aux = a[k][i]; a[k][i] = a[li][i]; a[li][i] = aux }
  return a[k][k]
}

function fracnum(strin, degre) {
  var i, a, c;
  if (Math.round(strin) == strin) return strin; else {
    var degr = 1;
    for (i = 0; i < degre; i++) {

      degr = degr / 10;
    }
    var fraction = '';
    var b = 1;
    strin = eval(strin);
    for (b = 1; b < 10000; b++) {
      a = Math.round(strin * b);
      fraction = a + '/' + b;
      c = eval(a / b - strin);
      if (Math.abs(c) < degr) break;
    }
    return a;
  }
}

function fracden(strin, degre) {
  var i, a, c;
  if (Math.round(strin) == strin) return '1'; else {
    var degr = 1;
    for (i = 0; i < degre; i++) {

      degr = degr / 10;
    }
    var fraction = '';
    var b = 1;
    strin = eval(strin);
    for (b = 1; b < 10000; b++) {
      a = Math.round(strin * b);
      fraction = a + '/' + b;
      c = eval(a / b - strin);
      if (Math.abs(c) < degr) break;
    }
    return b;
  }
}
function pgcd(a, b) {
  if (b > a) return pgcd(b, a);
  var d;
  d = Math.abs(etapepgcd(a, b));
  return d
}

function etapepgcd(a, b) {
  if (b == 0) { return a }
  else { return etapepgcd(b, a % b) }
}




function polynome(strin) {
  var n, x = new Array(), a = new Array(10)
  var xx, li, co, m, k, v, i, j, s, plus, signe;
  var lettre = choixlettre(strin);
  if (lettre == "x") { lettre = lettre; }
  else {
    while (strin.search(lettre) > -1) {
      strin = strin.replace(lettre, 'x');
    }
  }

  for (li = 1; li <= 10; li++) { a[li] = new Array(11) }
  if (analyse(strin) !== 'ok') return "Erreur : ecriture";
  if (compare(strin, '0') == "vrai") return "0";
  n = 4;
  for (li = 1; li <= n; li++) {
    var joum;
    trois:
    for (joum = 0; joum < 10; joum++) {
      if (testcalcul(strin, eval(joum * 10 + li))) break trois;
    }
    xx = 10 * joum + li;

    for (co = 1; co <= n + 1; co++) {
      m = "";
      if (co < n + 1) { m = Math.pow(xx, n - co); } else { m = calcul(strin, xx); }
      if (m == null) { return 'Je ne sais pas'; } else { a[li][co] = eval(m); }//bug();
    }
  }

  for (k = 1; k <= n - 1; k++) {
    v = a[k][k];
    if (v == 0) { v = permu(k, a, n); if (v == 0) { return 'je ne sais pas'; } }
    for (i = k + 1; i <= n; i++) {
      for (j = k + 1; j <= n + 1; j++) {
        a[i][j] = a[i][j] - a[i][k] * a[k][j] / v
      }
    }
  }

  if (a[n][n] == 0) { sing(); return } else { x[n] = a[n][n + 1] / a[n][n] }

  for (i = n - 1; i >= 1; i--) {
    s = 0;
    for (j = i + 1; j <= n; j++) {
      s = s + a[i][j] * x[j]
      x[i] = (a[i][n + 1] - s) / a[i][i]
    }
  }

  for (i = 1; i <= n; i++) {
    if (Math.abs(x[i]) < 0.0000001) x[i] = 0;
    if (Math.abs(x[i] - 1) < 0.0000001) x[i] = 1;
    if (Math.abs(x[i] + 1) < 0.0000001) x[i] = -1;
  }

  var xst;
  var st = "";
  var rien = 0;

  for (i = 1; i <= n; i++) {

    plus = '';
    signe = '+';

    if (x[i] > 0) { if (rien == 0) signe = ''; else signe = '+'; } else { signe = '-'; }
    if (x[i] == 0) plus = ''; else rien++;
    x[i] = Math.abs(x[i]);

    plus = 'x^' + eval(n - i);
    if (i == n) { if (x[i] == 1) plus = '1'; else plus = ''; }
    if (i == n - 1) plus = 'x';
    if (i == n - 2) plus = 'x²';
    if (i == n - 3) plus = 'x³';
    if (x[i] == 1) st = st + signe + plus; else { if (x[i] == 0) st = st; else { xst = frac(x[i], 9); st = st + signe + xst + plus; } }
  }

  if (compare(st, strin) == 'vrai') {
    if (lettre == "x") { }
    else {
      while (st.search('x') > -1) {
        st = st.replace('x', lettre);
      }
    }
    return st;
  } else return 'Je ne sais pas';
}




function frac(strin, degre) {
  var iii, a, c, fraction;

  if (Math.round(strin) == strin) return strin; else {
    var degr = 1;
    for (iii = 0; iii < degre; iii++) {

      degr = degr / 10;
    }
    var fraction = '';
    var b = 1;
    strin = eval(strin);
    for (b = 1; b < 10000; b++) {
      a = Math.round(strin * b);
      fraction = a + '/' + b;
      c = eval(a / b - strin);
      if (Math.abs(c) < degr) break;
    }
    if (b == 1) fraction = a + '';
    return fraction;
  }
}



function puissance(strin) {

  var longueur, st_mod, i, s, jj;
  strin = ' ' + strin + ' ';
  longueur = strin.length;
  st_mod = "";
  for (i = 0; i < longueur; i++) {
    s = strin.charAt(i);

    if (s == "^") {
      if (strin.charAt(i - 1) == 'x') {
        st_mod = preparecarre(strin, i - 1) + '(';
        var max = strin.charAt(i + 1);
        if (max == "0") { st_mod = st_mod + '1)'; } else {
          st_mod = st_mod + '';
          for (j = 1; j < max; j++) { st_mod = st_mod + 'x*' }
          st_mod = st_mod + 'x)';
        }
      }

      if (strin.charAt(i - 1) == ')') {
        var j; var np = 0; var st = '';
        deux:
        for (j = i - 1; j > 0; j--) {
          if (strin.charAt(j) == ')') np++;
          if (strin.charAt(j) == '(') np--;
          st = strin.charAt(j) + st;
          if ((strin.charAt(j) == '(') && (np == 0)) break deux;
        }
        st_mod = preparecarre(strin, i - st.length) + '(';
        var max = strin.charAt(i + 1);
        if (max == 0) { st_mod = st_mod + '1)'; } else {
          for (jj = 1; jj < max; jj++) { st_mod = st_mod + st + '*' }
          st_mod = st_mod + st + ')';
        }
      }
      if ((strin.charAt(i - 1) == '0') ^ (strin.charAt(i - 1) == '1') ^ (strin.charAt(i - 1) == '2') ^ (strin.charAt(i - 1) == '3') ^ (strin.charAt(i - 1) == '4') ^ (strin.charAt(i - 1) == '5') ^ (strin.charAt(i - 1) == '6') ^ (strin.charAt(i - 1) == '7') ^ (strin.charAt(i - 1) == '8') ^ (strin.charAt(i - 1) == '9')) {
        var j;
        var st = '';
        deux:
        for (j = i - 1; j > 0; j--) {

          if (strin.charAt(j) == 'x') break deux;
          if (strin.charAt(j) == '+') break deux;
          if (strin.charAt(j) == '-') break deux;
          if (strin.charAt(j) == '*') break deux;
          if (strin.charAt(j) == '/') break deux;
          if (strin.charAt(j) == ')') break deux;
          if (strin.charAt(j) == '(') break deux;
          if (strin.charAt(j) == 'x') break deux;
          st = strin.charAt(j) + st;
        }
        st_mod = preparecarre(strin, i - st.length) + '(';
        var max = strin.charAt(i + 1);
        if (max == 0) { st_mod = st_mod + '1)'; } else {
          for (jj = 1; jj < max; jj++) { st_mod = st_mod + st + '*' }
          st_mod = st_mod + st + ')';
        }
      }
    }
    else if (strin.charAt(i - 1) == '^') st_mod = st_mod; else st_mod = st_mod + s;
  }

  return st_mod;
}

function preparecarre(chaine, nb) {
  var j;
  var chaine_mod = "";
  for (j = 0; j < nb; j++) {
    chaine_mod = chaine_mod + chaine.charAt(j);
  }
  return chaine_mod;
}


function carre(strin) {
  var longueur, i, st_mod, s;
  strin = ' ' + strin + ' ';
  longueur = strin.length;
  st_mod = "";
  for (i = 0; i < longueur; i++) {
    s = strin.charAt(i);

    if (s == "²") {
      if (strin.charAt(i - 1) == 'x') st_mod = preparecarre(strin, i - 1) + '(x*x)';

      if (strin.charAt(i - 1) == ')') {
        var j; var np = 0; var st = '';
        deux:
        for (j = i - 1; j > 0; j--) {
          if (strin.charAt(j) == ')') np++;
          if (strin.charAt(j) == '(') np--;
          st = strin.charAt(j) + st;
          if ((strin.charAt(j) == '(') && (np == 0)) break deux;
        }
        st_mod = preparecarre(strin, i - st.length) + '(' + st + '*' + st + ')';
      }
      if ((strin.charAt(i - 1) == '0') ^ (strin.charAt(i - 1) == '1') ^ (strin.charAt(i - 1) == '2') ^ (strin.charAt(i - 1) == '3') ^ (strin.charAt(i - 1) == '4') ^ (strin.charAt(i - 1) == '5') ^ (strin.charAt(i - 1) == '6') ^ (strin.charAt(i - 1) == '7') ^ (strin.charAt(i - 1) == '8') ^ (strin.charAt(i - 1) == '9')) {
        var j;
        var st = '';
        deux:
        for (j = i - 1; j > 0; j--) {

          if (strin.charAt(j) == 'x') break deux;
          if (strin.charAt(j) == '+') break deux;
          if (strin.charAt(j) == '-') break deux;
          if (strin.charAt(j) == '*') break deux;
          if (strin.charAt(j) == '/') break deux;
          if (strin.charAt(j) == ')') break deux;
          if (strin.charAt(j) == '(') break deux;
          if (strin.charAt(j) == 'x') break deux;
          st = strin.charAt(j) + st;
        }
        st_mod = preparecarre(strin, i - st.length) + '(' + st + '*' + st + ')';
      }
    }
    else st_mod = st_mod + s;
  }

  return st_mod;
}

function preparecaract(strin) {
  var longueur, st_mod, i, s;
  longueur = strin.length;
  st_mod = ""
  for (i = 0; i < longueur; i++) {
    s = strin.charAt(i);
    if (s == 'x') if (strin.charAt(i + 1) == 'x') s = 'x*';
    if (s == ',') s = '.';
    if (s == '×') s = '*';
    if (s == '[') s = '(';
    if (s == ']') s = ')';
    if (s == ':') s = '/';
    if (s == '³') s = '^3';

    if (s == " ") st_mod = st_mod + ""; else st_mod = st_mod + s;
  }
  return st_mod;
}


function prepare(strin) {
  var i, longueur, st_mod, sav, s, sap;


  strin = ' ' + strin + ' ';
  while (strin.search('²') > 0) {
    strin = carre(strin);
  }

  var m = 0;
  do {
    strin = puissance(strin);
    m = 0;
    for (i = 0; i - 1 < strin.length; i++) {
      if (strin.charAt(i) == '^') m = 1;
    }
  }
  while (m > 0);

  longueur = strin.length;
  st_mod = ""

  for (i = 0; i - 1 < longueur; i++) {
    sav = strin.charAt(i);
    s = strin.charAt(i + 1);
    sap = strin.charAt(i + 2);

    if (s == "(") {
      if ((sav == '*') ^ (sav == '+') ^ (sav == '-') ^ (sav == '/') ^ (sav == ' ') ^ (sav == ')') ^ (sav == '(')) st_mod = st_mod; else st_mod = st_mod + '*';
    }

    st_mod = st_mod + s;

    if (s == ")") {
      if ((sap == '*') ^ (sap == '+') ^ (sap == '-') ^ (sap == '/') ^ (sap == ' ') ^ (sap == ')')) st_mod = st_mod; else st_mod = st_mod + '*';
    }
  }


  return st_mod;
}

function calcul(strin2, nb) {
  nb = '' + nb;
  if (testcalcul(nb, 1.23)) return calcul2(strin2, calcul2(nb));
  return 'Je ne sais pas lire le nombre en entrée';
}

function calculracine(strin2, nb) {
  nb = '' + nb;
  if (testcalcul(nb, 1.23)) return calcul2racine(strin2, calcul2(nb));
  return 'Je ne sais pas lire le nombre en entrée';
}

function calcul2racine(strin2, nb) {
  var st_mod, i, longueur, sav, s, sap, st;
  strin2 = strin2.toLowerCase();
  while (strin2.search('pi') > -1) {
    strin2 = strin2.replace('pi', '(3,14159265358979)');
  }
  //var retour = analyseracine(strin2);
  var retour = 'ok';
  if (retour == 'ok') {

    if (nb < 0) nb = '(' + nb + ')';
    strin2 = prepareracine(strin2);
    strin2 = preparecaract(strin2);
    strin = prepare(strin2);
    strin = ' ' + strin + ' ';
    var nbracine = 0;
    for (i = 1; i < strin.length; i++) {
      if (strin.charAt(i) == "t") nbracine++;
    }
    for (i = 0; i < nbracine; i++) {
      strin = strin.replace('sqrt*(', 'sqrt(');
    }
    //alert(strin);

    st_mod = "";
    longueur = strin.length;

    for (i = 1; i < longueur; i++) {

      sav = strin.charAt(i - 1);
      s = strin.charAt(i);
      sap = strin.charAt(i + 1);
      st = '';
      if (s == "x") {
        if ((sav == '+') || (sav == '-')) st_mod = st_mod + nb; else {
          if ((sav == ' ') || (sav == '(') || (sav == '*') || (sav == '/') || (sav == '^')) st_mod = st_mod + nb; else st_mod = st_mod + '*' + nb;
        }
      }
      else st_mod = st_mod + s;
    }

    strin = eval(st_mod);
    if (strin == 'Infinity') strin = 'Erreur: division par zéro';
    if (strin == NaN) strin = "Erreur: inconnue";
    return strin;
  }
  else
    return retour;
}

function prepareracine(strin2) {
  var nbracine = 0;
  var tempo = "";
  for (i = 0; i < strin2.length; i++) {
    if (strin2.charAt(i) == 'r') { nbracine++; tempo = tempo + "z"; } else tempo = tempo + strin2.charAt(i);
  }

  for (i = 0; i < nbracine; i++) {
    tempo = prepare2racine(tempo);
  }

  return tempo;
}

function prepare2racine(strin) {
  var taille = strin.length;
  var i;
  var carac;
  var parent = 0;
  var retour = "";
  var tempo = "";
  var nonracine = true;

  for (i = 0; i < taille; i++) {
    carac = strin.charAt(i);
    if (nonracine) {
      if (carac != "z") retour = retour + carac; else {
        retour = retour + "(Math.sqrt";
        nonracine = false;
      }
    } else {
      if (carac == '(') parent++;
      retour = retour + carac;
      if (carac == ')') parent--;
      if (parent == 0) { nonracine = true; retour = retour + ')'; }
    }
  }

  return retour;
}
function calcul2(strin2, nb) {
  var st_mod, i, longueur, sav, s, sap, st;

  strin2 = strin2.toLowerCase();

  while (strin2.search('pi') > -1) {
    strin2 = strin2.replace('pi', '(3,14159265358979)');
  }


  var retour = analyse(strin2);
  if (retour == 'ok') {
    if (nb < 0) nb = '(' + nb + ')';
    strin2 = preparecaract(strin2);
    strin = prepare(strin2);

    strin = ' ' + strin + ' ';


    st_mod = "";
    longueur = strin.length;


    for (i = 1; i < longueur; i++) {

      sav = strin.charAt(i - 1);
      s = strin.charAt(i);
      sap = strin.charAt(i + 1);
      st = '';
      if (s == "x") {
        if ((sav == '+') || (sav == '-')) st_mod = st_mod + nb; else {
          if ((sav == ' ') || (sav == '(') || (sav == '*') || (sav == '/') || (sav == '^')) st_mod = st_mod + nb; else st_mod = st_mod + '*' + nb;
        }
      }
      else st_mod = st_mod + s;

    }
    /T29.value=st_mod;/
    strin = eval(st_mod);
    if (strin == 'Infinity') strin = 'Erreur: division par zéro';
    if (strin == NaN) strin = "Erreur: inconnue";
    return strin;
  }
  else
    return retour;
}



function compareracine(nb1, nb2) {

  nb1 = '' + nb1;
  nb2 = '' + nb2;
  while (nb1.search('pi') > -1) {
    nb1 = nb1.replace('pi', '(3,14159265358979)');
  }
  while (nb2.search('pi') > -1) {
    nb2 = nb2.replace('pi', '(3,14159265358979)');
  }
  var lettre = choixlettre(nb1 + ' ' + nb2);
  if (lettre == "non") return "faux";
  if (lettre == "x") { } else {
    while (nb1.search(lettre) > -1) {
      nb1 = nb1.replace(lettre, 'x');
    }
    while (nb2.search(lettre) > -1) {
      nb2 = nb2.replace(lettre, 'x');
    }
  }
  var rep, rep1, rep2, rep3, rep4;
  var erreur1 = '';
  var erreur2 = '';
  erreur1 = analyseracine(nb1);
  erreur2 = analyseracine(nb2);
  if ((erreur1 == 'ok') && (erreur2 == 'ok')) {
    rep1 = calculracine(nb1, 2.21);
    rep2 = calculracine(nb2, 2.21);
    rep3 = calculracine(nb1, 3.21);
    rep4 = calculracine(nb2, 3.21);
    if (Math.abs(rep1 - rep2) < 0.000000000001) { if (Math.abs(rep3 - rep4) < 0.000000000001) rep = "vrai"; else rep = "faux"; } else rep = "faux";
  }
  else rep = 'Text1: ' + erreur1 + ' et Text2: ' + erreur2;
  return rep;
}

function compare(nb1, nb2) {
  nb1 = '' + nb1;
  nb2 = '' + nb2;
  while (nb1.search('pi') > -1) {
    nb1 = nb1.replace('pi', '(3,14159265358979)');
  }
  while (nb2.search('pi') > -1) {
    nb2 = nb2.replace('pi', '(3,14159265358979)');
  }
  var lettre = choixlettre(nb1 + ' ' + nb2);
  if (lettre == "non") return "faux";
  if (lettre == "x") { } else {
    while (nb1.search(lettre) > -1) {
      nb1 = nb1.replace(lettre, 'x');
    }
    while (nb2.search(lettre) > -1) {
      nb2 = nb2.replace(lettre, 'x');
    }
  }
  var rep, rep1, rep2, rep3, rep4;
  var erreur1 = '';
  var erreur2 = '';
  erreur1 = analyse(nb1);
  erreur2 = analyse(nb2);
  if ((erreur1 == 'ok') && (erreur2 == 'ok')) {
    rep1 = calcul(nb1, 2.21);
    rep2 = calcul(nb2, 2.21);
    rep3 = calcul(nb1, 3.21);
    rep4 = calcul(nb2, 3.21);
    if (Math.abs(rep1 - rep2) < 0.000000000001) { if (Math.abs(rep3 - rep4) < 0.000000000001) rep = "vrai"; else rep = "faux"; } else rep = "faux";
  }
  else rep = 'Text1: ' + erreur1 + ' et Text2: ' + erreur2;
  return rep;
}

function analyse(strin) {
  strin = preparecaract(strin);
  var erreur = 'Erreur(s):';
  if (parenthese(strin) == 'no') erreur = erreur + '1.';
  if (caract(strin) == 'no') erreur = erreur + '2.';
  if (inconnu(strin) == 'no') erreur = erreur + '3.';
  if (nonmath(strin) == 'no') erreur = erreur + '4.';
  if (nonpuissance(strin) == 'no') erreur = erreur + '5.';

  if (erreur == 'Erreur(s):') erreur = 'ok';
  return erreur;
}

function analyseracine(strin) {
  strin = preparecaract(strin);
  var erreur = 'Erreur(s):';
  if (parenthese(strin) == 'no') erreur = erreur + '1.';
  if (caract(strin) == 'no') erreur = erreur + '2.';
  if (inconnuracine(strin) == 'no') erreur = erreur + '3.';
  if (nonmath(strin) == 'no') erreur = erreur + '4.';
  if (nonpuissance(strin) == 'no') erreur = erreur + '5.';
  if (erreur == 'Erreur(s):') erreur = 'ok';
  return erreur;
}

function parenthese(strin) {
  var longueur, s, nbp, err1, i;
  longueur = strin.length;
  var nbp = 0;
  for (i = 0; i < longueur; i++) {
    s = strin.charAt(i);
    if ((s == ')') && (nbp == 0)) nbp = 10000;
    if (s == '(') nbp++;
    if (s == ")") nbp--
  }
  if (nbp == 0) err1 = 'ok'; else err1 = "no";
  return err1;
}

function caract(strin) {
  var longueur, s, i, err1;
  longueur = strin.length - 1;
  var nbp = 0;
  for (i = 0; i < longueur; i++) {
    s = strin.charAt(i);
    if (s == 'x') if ((strin.charAt(i + 1) == '0') ^ (strin.charAt(i + 1) == '1') ^ (strin.charAt(i + 1) == '2') ^ (strin.charAt(i + 1) == '3') ^ (strin.charAt(i + 1) == '4') ^ (strin.charAt(i + 1) == '5') ^ (strin.charAt(i + 1) == '6') ^ (strin.charAt(i + 1) == '7') ^ (strin.charAt(i + 1) == '8') ^ (strin.charAt(i + 1) == '9') ^ (strin.charAt(i + 1) == '0') ^ (strin.charAt(i + 1) == '.')) nbp++;
    if (s == '+') if ((strin.charAt(i + 1) == '^') ^ (strin.charAt(i + 1) == '-') ^ (strin.charAt(i + 1) == '+') ^ (strin.charAt(i + 1) == '/') ^ (strin.charAt(i + 1) == '*')) nbp++;
    if (s == '-') if ((strin.charAt(i + 1) == '^') ^ (strin.charAt(i + 1) == '-') ^ (strin.charAt(i + 1) == '+') ^ (strin.charAt(i + 1) == '/') ^ (strin.charAt(i + 1) == '*')) nbp++;
    if (s == '/') if ((strin.charAt(i + 1) == '^') ^ (strin.charAt(i + 1) == '-') ^ (strin.charAt(i + 1) == '+') ^ (strin.charAt(i + 1) == '/') ^ (strin.charAt(i + 1) == '*')) nbp++;
    if (s == '*') if ((strin.charAt(i + 1) == '^') ^ (strin.charAt(i + 1) == '-') ^ (strin.charAt(i + 1) == '+') ^ (strin.charAt(i + 1) == '/') ^ (strin.charAt(i + 1) == '*')) nbp++;
    if ((s == '(') && (strin.charAt(i + 1) == ')')) nbp++;
    if ((s == 'x') && (strin.charAt(i + 1) == 'x')) nbp++;
    if ((s == '²') && (strin.charAt(i + 1) == '²')) nbp++;
    if ((s == '^') && (strin.charAt(i + 1) == '^')) nbp++;
  }
  if (nbp == 0) err1 = 'ok'; else err1 = 'no';
  return err1;
}

function inconnu(strin) {
  var longueur, i, s, err1;
  longueur = strin.length;
  var nbp = 0;
  for (i = 0; i < longueur; i++) {
    s = strin.charAt(i);
    if ((s == '1') ^ (s == '2') ^ (s == '3') ^ (s == '4') ^ (s == '5') ^ (s == '6') ^ (s == '7') ^ (s == '8') ^ (s == '9') ^ (s == '0')) nbp++;
    if ((s == '(') ^ (s == ')') ^ (s == '+') ^ (s == '-') ^ (s == '/') ^ (s == '*') ^ (s == '²') ^ (s == 'x') ^ (s == '.') ^ (s == '^') ^ (s == 'R')) nbp++;
  }

  if (nbp == longueur) err1 = 'ok'; else err1 = 'no';
  return err1;
}

function inconnuracine(strin) {
  var longueur, i, s, err1;
  longueur = strin.length;
  var nbp = 0;
  for (i = 0; i < longueur; i++) {
    s = strin.charAt(i);
    if ((s == '1') ^ (s == '2') ^ (s == '3') ^ (s == '4') ^ (s == '5') ^ (s == '6') ^ (s == '7') ^ (s == '8') ^ (s == '9') ^ (s == '0')) nbp++;
    if ((s == '(') ^ (s == ')') ^ (s == '+') ^ (s == '-') ^ (s == '/') ^ (s == '*') ^ (s == '²') ^ (s == 'x') ^ (s == '.') ^ (s == '^') ^ (s == 'R')) nbp++;
  }

  if (nbp == longueur) err1 = 'ok'; else err1 = 'no';
  return err1;
}

function nonmath(strin) {
  var longueur, nbp, i, s, err1;
  longueur = strin.length - 1;
  var nbp = 0;
  if (strin.charAt(0) == '²') nbp++;

  if (strin.charAt(0) == '*') nbp++;
  if (strin.charAt(0) == '/') nbp++;
  if (strin.charAt(0) == ')') nbp++;
  if (strin.charAt(longueur) == '*') nbp++;
  if (strin.charAt(longueur) == '/') nbp++;
  if (strin.charAt(longueur) == '+') nbp++;
  if (strin.charAt(longueur) == '-') nbp++;
  if (strin.charAt(0) == '^') nbp++;
  if (strin.charAt(longueur) == '^') nbp++;


  for (i = 1; i < longueur; i++) {
    s = strin.charAt(i);
  }

  if (nbp == 0) err1 = 'ok'; else err1 = 'no';
  return err1;
}

function nonpuissance(strin) {
  var longueur, i, s, sui, suisui, nbp, err1;
  longueur = strin.length;
  var nbp = 0;
  for (i = 1; i < longueur; i++) {
    s = strin.charAt(i);
    if (s == '^') {
      if (strin.charAt(i + 1) == 'x') nbp++;
      if (strin.charAt(i + 1) == 'x') nbp++;
      sui = strin.charAt(i + 1);
      suisui = strin.charAt(i + 2);
      if ((sui == 'x') ^ (sui == '*') ^ (sui == '+') ^ (sui == '-') ^ (sui == '/') ^ (sui == '.') ^ (sui == '(') ^ (sui == ')') ^ (sui == '²')) nbp++;
      if ((suisui == '0') ^ (suisui == '^') ^ (suisui == '1') ^ (suisui == '2') ^ (suisui == '3') ^ (suisui == '4') ^ (suisui == '5') ^ (suisui == '6') ^ (suisui == '7') ^ (suisui == '8') ^ (suisui == '9') ^ (suisui == '.')) nbp++
    }
  }

  if (nbp == 0) err1 = 'ok'; else err1 = 'no';
  return err1;
}
