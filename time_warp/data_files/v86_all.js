'use strict';
var p;
Object.freeze(["shared", "exclusive", "unlock"]);
let use_async = true;
// get use_async from local storage or set it if not set
if (localStorage.getItem("use_async") === null) {
    localStorage.setItem("use_async", use_async);
} else {
    use_async = localStorage.getItem("use_async") === "true";
}
window.addEventListener("load",function(){
    
        //add event to set use_async according to checkbox (id async)
        document.getElementById("async").onchange =  function() {
            use_async = this.checked;
            localStorage.setItem("use_async", use_async);
        };
});

const dbName = "v86_data";
window.mobileAndTabletCheck = function() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
  };
let db;
(function(){
    
    var request = indexedDB.open(dbName, 1);

    request.onerror = function (event) {
      alert("Le stockage local n'est pas autorisé, vous devrez utiliser la sauvegarde manuelle pour enregistrer vos données.");
    };
    request.onupgradeneeded = function (event) {
      db = event.target.result;
    
      // Créer un objet de stockage qui contient les informations des sauvegardes.
      // Nous allons utiliser "game" en tant que clé parce qu'il est garanti d'être
      // unique - du moins, c'est ce qu'on en disait au lancement.
      db.createObjectStore("saves", { keyPath: "game" });
    };
    request.onsuccess = function (event) {
        db = event.target.result;
      };
})();

function saveGame(game, data) {

    var transaction = db.transaction(["saves"], "readwrite");
    transaction.onerror = function (event) {
        console.log("Erreur lors de la sauvegarde: ", event);
    };
    transaction.oncomplete = function (event) {
        console.log("Transaction accomplie");
    };
    var objectStore = transaction.objectStore("saves");
    var request = objectStore.put({"game": game, "data": data});
    request.onsuccess = function (event) {
        console.log("Sauvegarde réussie");
    };
    request.onerror = function (event) {
        console.log("Erreur lors de la sauvegarde: ", event);
    };
}

function loadGame(game, callback){
    var transaction = db.transaction(["saves"], "readonly");
    var objectStore = transaction.objectStore("saves");
    var request = objectStore.get(game);
    request.onerror = function (event) {
        console.log("Erreur lors de la lecture: ", event);
    };
    request.onsuccess = function (event) {
        callback(request.result);
    };
}

function aa(a, b, c) {
    this.h = a;
    this.v = c;
    this.u = [104, 111, 115, 116, 57, 112];
    this.F = this.u.length;
    this.D = "9P2000.L";
    this.j = this.o = 8192;
    this.i = new Uint8Array(2 * this.j);
    this.C = 0;
    this.g = [];
    this.cb = new ba(b, {
        name: "virtio-9p",
        Ka: 48,
        Ne: 4169,
        Xg: 9,
        Le: {
            dd: 43008,
            Wa: [{
                Tc: 32,
                ue: 0
            }],
            features: [0, 32, 29, 28],
            Sk: () => {}
        },
        notification: {
            dd: 43264,
            ek: !1,
            ki: [e => {
                if (0 === e) {
                    for (; ca(this.l);) {
                        e = this.l;
                        ca(e);
                        var d = e.s.Oa(e.h + 4 + 2 * e.j);
                        d = new ia(e, d);
                        e.j = e.j + 1 & e.o;
                        ja(this, d)
                    }
                    e = this.l;
                    d = e.s.Oa(e.h + 2) + 0 & 65535;
                    e.s.Ge(e.g + 4 + 8 * e.size, d)
                }
            }]
        },
        oc: {
            dd: 42752
        },
        bg: {
            dd: 42496,
            zd: [{
                bytes: 2,
                name: "mount tag length",
                read: () => this.F,
                write: () => {}
            }].concat(Array.from(Array(254).keys()).map(e => ({
                bytes: 1,
                name: "mount tag name " + e,
                read: () => this.u[e] || 0,
                write: () => {}
            })))
        }
    });
    this.l = this.cb.Wa[0]
}
aa.prototype.aa = function() {
    var a = [];
    a[0] = this.u;
    a[1] = this.F;
    a[2] = this.cb;
    a[3] = this.D;
    a[4] = this.o;
    a[5] = this.j;
    a[6] = this.i;
    a[7] = this.C;
    a[8] = this.g.map(function(b) {
        return [b.Z, b.type, b.uid, b.hc]
    });
    a[9] = this.h;
    return a
};
aa.prototype.I = function(a) {
    this.u = a[0];
    this.F = a[1];
    this.cb.I(a[2]);
    this.l = this.cb.Wa[0];
    this.D = a[3];
    this.o = a[4];
    this.j = a[5];
    this.i = a[6];
    this.C = a[7];
    this.g = a[8].map(function(b) {
        return {
            Z: b[0],
            type: b[1],
            uid: b[2],
            hc: b[3]
        }
    });
    this.h.I(a[9])
};

function u(a, b, c, e) {
    v(["w", "b", "h"], [e + 7, b + 1, c], a.i, 0);
    a.C = e + 7
}

function ka(a, b, c) {
    c = v(["w"], [c], a.i, 7);
    u(a, 6, b, c)
}

function D(a, b) {
    for (var c = a.i.subarray(0, a.C), e = 0, d = c.length; d && b.Tf !== b.Uf.length;) {
        var g = b.Uf[b.Tf];
        const f = g.mf + b.He;
        g = g.Te - b.He;
        g > d ? (g = d, b.He += d) : (b.Tf++, b.He = 0);
        la(b.s, c.subarray(e, e + g), f);
        e += g;
        d -= g
    }
    b.vf += e;
    c = a.l;
    e = c.s.Oa(c.g + 2) + c.i & c.o;
    d = b.vf;
    c.s.Uc(c.g + 4 + 8 * e, b.li);
    c.s.Uc(c.g + 8 + 8 * e, d);
    c.i++;
    a = a.l;
    0 !== a.i && (b = a.s.Oa(a.g + 2) + a.i & 65535, a.s.Ge(a.g + 2, b), a.i = 0, 0 < (a.cb.h[0] & 536870912) ? (a.s.Oa(a.h + 4 + 2 * a.size), a.cb.Ca(1)) : ~a.s.Oa(a.h) & 1 && a.cb.Ca(1))
}
async function ja(a, b) {
    var c = new Uint8Array(b.uf);
    ma(b, c);
    var e = {
            offset: 0
        },
        d = E(["w", "b", "h"], c, e),
        g = d[0],
        f = d[1],
        h = d[2];
    switch (f) {
        case 8:
            g = qa(a.h);
            var k = ra(a.h);
            d = [16914839];
            d[1] = a.o;
            d[2] = Math.floor(k / d[1]);
            d[3] = d[2] - Math.floor(g / d[1]);
            d[4] = d[2] - Math.floor(g / d[1]);
            d[5] = ua(a.h);
            d[6] = va(a.h);
            d[7] = 0;
            d[8] = 256;
            g = v("wwddddddw".split(""), d, a.i, 7);
            u(a, f, h, g);
            D(a, b);
            break;
        case 112:
        case 12:
            d = E(["w", "w"], c, e);
            g = d[0];
            e = d[1];
            c = a.g[g].Z;
            var l = J(a.h, c);
            k = wa(a.h, c, e);
            xa(a.h, a.g[g].Z, function() {
                var m = [];
                m[0] = l.ya;
                m[1] = this.j - 24;
                v(["Q", "w"], m, this.i, 7);
                u(this, f, h, 17);
                D(this, b)
            }.bind(a));
            break;
        case 70:
            d = E(["w", "w", "s"], c, e);
            c = d[0];
            g = d[1];
            k = d[2];
            k = za(a.h, a.g[c].Z, a.g[g].Z, k);
            if (0 > k) {
                ka(a, h, -k);
                D(a, b);
                break
            }
            u(a, f, h, 0);
            D(a, b);
            break;
        case 16:
            d = E(["w", "s", "s", "w"], c, e);
            g = d[0];
            k = d[1];
            var n = d[3];
            c = Aa(a.h, k, a.g[g].Z, d[2]);
            l = J(a.h, c);
            l.uid = a.g[g].uid;
            l.Ha = n;
            v(["Q"], [l.ya], a.i, 7);
            u(a, f, h, 13);
            D(a, b);
            break;
        case 18:
            d = E("wswwww".split(""), c, e);
            g = d[0];
            k = d[1];
            e = d[2];
            c = d[3];
            var t = d[4];
            n = d[5];
            c = Ba(a.h, k, a.g[g].Z, c, t);
            l = J(a.h,
                c);
            l.mode = e;
            l.uid = a.g[g].uid;
            l.Ha = n;
            v(["Q"], [l.ya], a.i, 7);
            u(a, f, h, 13);
            D(a, b);
            break;
        case 22:
            d = E(["w"], c, e);
            g = d[0];
            l = J(a.h, a.g[g].Z);
            g = v(["s"], [l.Ce], a.i, 7);
            u(a, f, h, g);
            D(a, b);
            break;
        case 72:
            d = E(["w", "s", "w", "w"], c, e);
            g = d[0];
            k = d[1];
            e = d[2];
            n = d[3];
            c = Ca(a.h, k, a.g[g].Z);
            l = J(a.h, c);
            l.mode = e | Da;
            l.uid = a.g[g].uid;
            l.Ha = n;
            v(["Q"], [l.ya], a.i, 7);
            u(a, f, h, 13);
            D(a, b);
            break;
        case 14:
            d = E(["w", "s", "w", "w", "w"], c, e);
            g = d[0];
            k = d[1];
            c = d[2];
            e = d[3];
            n = d[4];
            a.v.send("9p-create", [k, a.g[g].Z]);
            c = Fa(a.h, k, a.g[g].Z);
            a.g[g].Z = c;
            a.g[g].type =
                1;
            a.g[g].hc = k;
            l = J(a.h, c);
            l.uid = a.g[g].uid;
            l.Ha = n;
            l.mode = e;
            v(["Q", "w"], [l.ya, a.j - 24], a.i, 7);
            u(a, f, h, 17);
            D(a, b);
            break;
        case 52:
            d = E("wbwddws".split(""), c, e);
            g = d[0];
            c = d[2];
            k = 0 === d[4] ? Infinity : d[4];
            d = Ga(d[1], d[3], k, d[5], d[6]);
            k = Ha(a.h, a.g[g].Z, d, c);
            v(["b"], [k], a.i, 7);
            u(a, f, h, 1);
            D(a, b);
            break;
        case 54:
            d = E("wbddws".split(""), c, e);
            g = d[0];
            k = 0 === d[3] ? Infinity : d[3];
            d = Ga(d[1], d[2], k, d[4], d[5]);
            k = Ia(a.h, a.g[g].Z, d);
            k || (k = d, k.type = 2);
            g = v(["b", "d", "d", "w", "s"], [k.type, k.start, Infinity === k.length ? 0 : k.length, k.h, k.g],
                a.i, 7);
            u(a, f, h, g);
            D(a, b);
            break;
        case 24:
            d = E(["w", "d"], c, e);
            g = d[0];
            l = J(a.h, a.g[g].Z);
            if (!l || l.status === Ja) {
                ka(a, h, 2);
                D(a, b);
                break
            }
            d[0] |= 4096;
            d[0] = d[1];
            d[1] = l.ya;
            d[2] = l.mode;
            d[3] = l.uid;
            d[4] = l.Ha;
            d[5] = l.Ua;
            d[6] = l.Ue << 8 | l.Ve;
            d[7] = l.size;
            d[8] = a.o;
            d[9] = Math.floor(l.size / 512 + 1);
            d[10] = l.Wc;
            d[11] = 0;
            d[12] = l.pc;
            d[13] = 0;
            d[14] = l.Id;
            d[15] = 0;
            d[16] = 0;
            d[17] = 0;
            d[18] = 0;
            d[19] = 0;
            v("dQwwwddddddddddddddd".split(""), d, a.i, 7);
            u(a, f, h, 153);
            D(a, b);
            break;
        case 26:
            d = E("wwwwwddddd".split(""), c, e);
            g = d[0];
            l = J(a.h, a.g[g].Z);
            d[1] & 1 &&
                (l.mode = d[2]);
            d[1] & 2 && (l.uid = d[3]);
            d[1] & 4 && (l.Ha = d[4]);
            d[1] & 16 && (l.Wc = Math.floor((new Date).getTime() / 1E3));
            d[1] & 32 && (l.pc = Math.floor((new Date).getTime() / 1E3));
            d[1] & 64 && (l.Id = Math.floor((new Date).getTime() / 1E3));
            d[1] & 128 && (l.Wc = d[6]);
            d[1] & 256 && (l.pc = d[8]);
            d[1] & 8 && await Ka(a.h, a.g[g].Z, d[5]);
            u(a, f, h, 0);
            D(a, b);
            break;
        case 50:
            d = E(["w", "d"], c, e);
            g = d[0];
            u(a, f, h, 0);
            D(a, b);
            break;
        case 40:
        case 116:
            d = E(["w", "d", "w"], c, e);
            g = d[0];
            k = d[1];
            n = d[2];
            l = J(a.h, a.g[g].Z);
            if (!l || l.status === Ja) {
                ka(a, h, 2);
                D(a, b);
                break
            }
            if (2 ==
                a.g[g].type) {
                (void 0).length < k + n && (n = (void 0).length - k);
                for (d = 0; d < n; d++) a.i[11 + d] = (void 0)[k + d];
                v(["w"], [n], a.i, 7);
                u(a, f, h, 4 + n)
            } else wa(a.h, a.g[g].Z, void 0), d = a.g[g].Z, n = Math.min(n, a.i.length - 11), l.size < k + n ? n = l.size - k : 40 == f && (n = Ma(a.h, d, k + n) - k), k > l.size && (n = 0), a.v.send("9p-read-start", [a.g[g].hc]), d = await Na(a.h, d, k, n), a.v.send("9p-read-end", [a.g[g].hc, n]), d && a.i.set(d, 11), v(["w"], [n], a.i, 7), u(a, f, h, 4 + n);
            D(a, b);
            break;
        case 118:
            d = E(["w", "d", "w"], c, e);
            g = d[0];
            k = d[1];
            n = d[2];
            d = a.g[g].hc;
            if (2 === a.g[g].type) {
                ka(a,
                    h, 95);
                D(a, b);
                break
            } else await Oa(a.h, a.g[g].Z, k, n, c.subarray(e.offset));
            a.v.send("9p-write-end", [d, n]);
            v(["w"], [n], a.i, 7);
            u(a, f, h, 4);
            D(a, b);
            break;
        case 74:
            d = E(["w", "s", "w", "s"], c, e);
            k = await Pa(a.h, a.g[d[0]].Z, d[1], a.g[d[2]].Z, d[3]);
            if (0 > k) {
                ka(a, h, -k);
                D(a, b);
                break
            }
            u(a, f, h, 0);
            D(a, b);
            break;
        case 76:
            d = E(["w", "s", "w"], c, e);
            e = d[0];
            k = d[1];
            c = d[2];
            g = Qa(a.h, a.g[e].Z, k);
            if (-1 == g) {
                ka(a, h, 2);
                D(a, b);
                break
            }
            k = Ra(a.h, a.g[e].Z, k);
            if (0 > k) {
                ka(a, h, -k);
                D(a, b);
                break
            }
            u(a, f, h, 0);
            D(a, b);
            break;
        case 100:
            g = E(["w", "s"], c, e);
            a.j =
                g[0];
            g = v(["w", "s"], [a.j, a.D], a.i, 7);
            u(a, f, h, g);
            D(a, b);
            break;
        case 104:
            d = E(["w", "w", "s", "s", "w"], c, e);
            g = d[0];
            a.g[g] = {
                Z: 0,
                type: 1,
                uid: d[4],
                hc: ""
            };
            l = J(a.h, a.g[g].Z);
            v(["Q"], [l.ya], a.i, 7);
            u(a, f, h, 13);
            D(a, b);
            a.v.send("9p-attach");
            break;
        case 108:
            d = E(["h"], c, e);
            u(a, f, h, 0);
            D(a, b);
            break;
        case 110:
            d = E(["w", "w", "h"], c, e);
            g = d[0];
            n = d[1];
            t = d[2];
            if (0 == t) {
                a.g[n] = {
                    Z: a.g[g].Z,
                    type: 1,
                    uid: a.g[g].uid,
                    hc: a.g[g].hc
                };
                v(["h"], [0], a.i, 7);
                u(a, f, h, 2);
                D(a, b);
                break
            }
            k = [];
            for (d = 0; d < t; d++) k.push("s");
            e = E(k, c, e);
            c = a.g[g].Z;
            k = 9;
            var r =
                0;
            for (d = 0; d < t; d++) {
                c = Qa(a.h, c, e[d]);
                if (-1 == c) break;
                k += v(["Q"], [J(a.h, c).ya], a.i, k);
                r++;
                a.g[n] = {
                    Z: c,
                    type: 1,
                    uid: a.g[g].uid,
                    hc: e[d]
                }
            }
            v(["h"], [r], a.i, 7);
            u(a, f, h, k - 7);
            D(a, b);
            break;
        case 120:
            d = E(["w"], c, e);
            a.g[d[0]] && 0 <= a.g[d[0]].Z && (await Sa(a.h, a.g[d[0]].Z), a.g[d[0]].Z = -1, a.g[d[0]].type = -1);
            u(a, f, h, 0);
            D(a, b);
            break;
        case 32:
            d = E(["w", "s", "d", "w"], c, e);
            g = d[0];
            k = d[1];
            c = d[3];
            a.g[g].type = 2;
            u(a, f, h, 0);
            D(a, b);
            break;
        case 30:
            d = E(["w", "w", "s"], c, e), g = d[0], k = d[2], ka(a, h, 95), D(a, b)
    }
};

function Ta(a, b) {
    function c(x) {
        x = x.toString(16);
        return "#" + "0".repeat(6 - x.length) + x
    }

    function e(x, B, V, P) {
        x.style.width = "";
        x.style.height = "";
        P && (x.style.transform = "");
        var Y = x.getBoundingClientRect();
        P ? x.style.transform = (1 === B ? "" : " scaleX(" + B + ")") + (1 === V ? "" : " scaleY(" + V + ")") : (0 === B % 1 && 0 === V % 1 ? (d.style.imageRendering = "crisp-edges", d.style.imageRendering = "pixelated", d.style["-ms-interpolation-mode"] = "nearest-neighbor") : (d.style.imageRendering = "", d.style["-ms-interpolation-mode"] = ""), P = window.devicePixelRatio ||
            1, 0 !== P % 1 && (B /= P, V /= P));
        1 !== B && (x.style.width = Y.width * B + "px");
        1 !== V && (x.style.height = Y.height * V + "px")
    }
    console.assert(a, "1st argument must be a DOM container");
    var d = a.getElementsByTagName("canvas")[0],
        g = d.getContext("2d", {
            alpha: !1
        }),
        f = a.getElementsByTagName("div")[0],
        h = document.createElement("div"),
        k, l, n = 1,
        t = 1,
        r = 1,
        m, w = !1,
        y, q, C, G = !1,
        S = this;
    a = new Uint16Array([8962, 199, 252, 233, 226, 228, 224, 229, 231, 234, 235, 232, 239, 238, 236, 196, 197, 201, 230, 198, 244, 246, 242, 251, 249, 255, 214, 220, 162, 163, 165, 8359, 402, 225, 237,
        243, 250, 241, 209, 170, 186, 191, 8976, 172, 189, 188, 161, 171, 187, 9617, 9618, 9619, 9474, 9508, 9569, 9570, 9558, 9557, 9571, 9553, 9559, 9565, 9564, 9563, 9488, 9492, 9524, 9516, 9500, 9472, 9532, 9566, 9567, 9562, 9556, 9577, 9574, 9568, 9552, 9580, 9575, 9576, 9572, 9573, 9561, 9560, 9554, 9555, 9579, 9578, 9496, 9484, 9608, 9604, 9612, 9616, 9600, 945, 223, 915, 960, 931, 963, 181, 964, 934, 920, 937, 948, 8734, 966, 949, 8745, 8801, 177, 8805, 8804, 8992, 8993, 247, 8776, 176, 8729, 183, 8730, 8319, 178, 9632, 160
    ]);
    for (var ha = new Uint16Array([32, 9786, 9787, 9829, 9830, 9827, 9824, 8226,
            9688, 9675, 9689, 9794, 9792, 9834, 9835, 9788, 9658, 9668, 8597, 8252, 182, 167, 9644, 8616, 8593, 8595, 8594, 8592, 8735, 8596, 9650, 9660
        ]), A = [], F, H = 0; 256 > H; H++) F = 126 < H ? a[H - 127] : 32 > H ? ha[H] : H, A[H] = String.fromCharCode(F);
    g.imageSmoothingEnabled = !1;
    h.style.position = "absolute";
    h.style.backgroundColor = "#ccc";
    h.style.width = "7px";
    h.style.display = "inline-block";
    f.style.display = "block";
    d.style.display = "none";
    this.v = b;
    b.register("screen-set-mode", function(x) {
        this.If(x)
    }, this);
    b.register("screen-fill-buffer-end", function(x) {
            this.Pf(x)
        },
        this);
    b.register("screen-put-char", function(x) {
        this.Bf(x[0], x[1], x[2], x[3], x[4])
    }, this);
    b.register("screen-update-cursor", function(x) {
        this.Bd(x[0], x[1])
    }, this);
    b.register("screen-update-cursor-scanline", function(x) {
        this.Cd(x[0], x[1])
    }, this);
    b.register("screen-clear", function() {
        this.Zf()
    }, this);
    b.register("screen-set-size-text", function(x) {
        this.xd(x[0], x[1])
    }, this);
    b.register("screen-set-size-graphical", function(x) {
        this.wd(x[0], x[1], x[2], x[3])
    }, this);
    this.hb = function() {
        this.xd(80, 25);
        this.wb()
    };
    this.vi =
        function() {
            const x = new Image;
            if (w) x.src = d.toDataURL("image/png");
            else {
                const B = [9, 16],
                    V = document.createElement("canvas");
                V.width = q * B[0];
                V.height = C * B[1];
                const P = V.getContext("2d");
                P.imageSmoothingEnabled = !1;
                P.font = window.getComputedStyle(f).font;
                P.textBaseline = "top";
                for (let Y = 0; Y < q; Y++)
                    for (let da = 0; da < C; da++) {
                        const na = 3 * (da * q + Y);
                        P.fillStyle = c(y[na + 1]);
                        P.fillRect(Y * B[0], da * B[1], B[0], B[1]);
                        P.fillStyle = c(y[na + 2]);
                        P.fillText(A[y[na]], Y * B[0], da * B[1])
                    }
                "none" !== h.style.display && (P.fillStyle = h.style.backgroundColor,
                    P.fillRect(l * B[0], k * B[1] + parseInt(h.style.marginTop, 10) - 1, parseInt(h.style.width, 10), parseInt(h.style.height, 10)));
                x.src = V.toDataURL("image/png")
            }
            return x
        };
    this.Bf = function(x, B, V, P, Y) {
        x < C && B < q && (B = 3 * (x * q + B), y[B] = V, y[B + 1] = P, y[B + 2] = Y, m[x] = 1)
    };
    this.wb = function() {
        G || requestAnimationFrame(w ? ea : I)
    };
    var I = function() {
            for (var x = 0; x < C; x++) m[x] && (S.g(x), m[x] = 0);
            this.wb()
        }.bind(this),
        ea = function() {
            this.v.send("screen-fill-buffer");
            this.wb()
        }.bind(this);
    this.oa = function() {
        G = !0
    };
    this.If = function(x) {
        (w = x) ? (f.style.display =
            "none", d.style.display = "block") : (f.style.display = "block", d.style.display = "none")
    };
    this.Zf = function() {
        g.fillStyle = "#000";
        g.fillRect(0, 0, d.width, d.height)
    };
    this.xd = function(x, B) {
        if (x !== q || B !== C) {
            m = new Int8Array(B);
            y = new Int32Array(x * B * 3);
            q = x;
            for (C = B; f.childNodes.length > B;) f.removeChild(f.firstChild);
            for (; f.childNodes.length < B;) f.appendChild(document.createElement("div"));
            for (x = 0; x < B; x++) this.g(x);
            e(f, n, t, !0)
        }
    };
    this.wd = function(x, B) {
        d.style.display = "block";
        d.width = x;
        d.height = B;
        r = 640 >= x && 2 * x < window.innerWidth *
            window.devicePixelRatio && 2 * B < window.innerHeight * window.devicePixelRatio ? 2 : 1;
        e(d, n * r, t * r, !1)
    };
    this.Jf = function(x, B) {
        n = x;
        t = B;
        e(f, n, t, !0);
        e(d, n * r, t * r, !1)
    };
    this.Jf(n, t);
    this.Cd = function(x, B) {
        x & 32 ? h.style.display = "none" : (h.style.display = "inline", h.style.height = Math.min(15, B - x) + "px", h.style.marginTop = Math.min(15, x) + "px")
    };
    this.Bd = function(x, B) {
        if (x !== k || B !== l) m[x] = 1, m[k] = 1, k = x, l = B
    };
    this.g = function(x) {
        var B = 3 * x * q,
            V;
        var P = f.childNodes[x];
        var Y = document.createElement("div");
        for (var da = 0; da < q;) {
            var na = document.createElement("span");
            var Ea = y[B + 1];
            var La = y[B + 2];
            na.style.backgroundColor = c(Ea);
            na.style.color = c(La);
            for (V = ""; da < q && y[B + 1] === Ea && y[B + 2] === La;)
                if (V += A[y[B]], da++, B += 3, x === k)
                    if (da === l) break;
                    else if (da === l + 1) {
                Y.appendChild(h);
                break
            }
            na.textContent = V;
            Y.appendChild(na)
        }
        P.parentNode.replaceChild(Y, P)
    };
    this.Pf = function(x) {
        x.forEach(B => {
            g.putImageData(B.Gb, B.Gf - B.Je, B.Hf - B.Ke, B.Je, B.Ke, B.pf, B.nf)
        })
    };
    this.hb()
};
(function() {
    function a() {
        for (var r = location.search.substr(1).split("&"), m = {}, w = 0; w < r.length; w++) {
            var y = r[w].split("=");
            m[y[0]] = decodeURIComponent(y.slice(1).join("="))
        }
        return m
    }

    function b(r) {
        document.title = r + " - Virtual x86";
        const m = document.querySelector("meta[name=description]");
        m && (m.content = "Running " + r)
    }

    function c(r) {
        return document.getElementById(r)
    }

    function e() {
        function r(A) {
            c("boot_options").style.display = "none";
            c("basic_options").style.display = "none";
            b(A.name);
            w.filesystem = A.filesystem;
            A.state && (c("reset").style.display = "none",
                w.Hb = A.state);
            w.$ = A.$;
            w.X = A.X;
            w.H = A.H;
            w.Lb = A.Lb;
            w.Ya = A.Ya;
            w.Ib = A.Ib;
            w.ec = A.ec;
            w.ae = A.ae;
            w.ib = A.ib;
            w.wc = A.wc;
            w.ta = A.state || void 0 === w.ta ? A.ta : w.ta;
            w.G = !A.state && w.G ? w.G : A.G;
            w.ba = !A.state && w.ba ? w.ba : A.ba;
            w.id = A.id;
            void 0 !== A.bc && (w.bc = A.bc);
            var F = parseInt(y.chunk_size, 10);
            0 <= F && (F ? (F = Math.min(4194304, Math.max(512, F)), F = 1 << Math.ceil(Math.log2(F))) : F = void 0, w.H && (w.H.J = F), w.X && (w.X.J = F));
            A.da && (c("description").style.display = "block", F = document.createElement("a"), F.href = A.da, F.textContent = A.name, F.target =
                "_blank", c("description").appendChild(document.createTextNode("Running ")), c("description").appendChild(F));
            d(w, m)
        }

        function m(A) {
            y.c && setTimeout(function() {
                Ua(A, y.c + "\n")
            }, 25)
        }
        if (window.WebAssembly) {
            var w = {};
            c("start_emulation").onclick = function() {
                for (var A of t) {
                    const H = c(A);
                    H && ("SELECT" === H.tagName || "checkbox" !== H.type ? window.localStorage.setItem(A, H.value) : window.localStorage.setItem(A, H.checked))
                }
                c("boot_options").style.display = "none";
                k("custom");
                if (A = c("floppy_image").files[0]) {
                    var F = A;
                    w.$ = {
                        buffer: A
                    }
                }
                if (A =
                    c("cd_image").files[0]) F = A, w.X = {
                    buffer: A
                };
                if (A = c("hda_image").files[0]) F = A, w.H = {
                    buffer: A
                };
                if (A = c("hdb_image") && c("hdb_image").files[0]) F = A, w.lc = {
                    buffer: A
                };
                c("multiboot_image") && (A = c("multiboot_image").files[0]) && (F = A, w.Lb = {
                    buffer: A
                });
                F && b(F.name);
                d(w)
            };
            var y = a(),
                q = y.cdn || (l ? "images/" : "//k.copy.sh/");
            let antelink = "https://palgania.ovh:8081/games/",
                postlink = "",
                antelink2 = "https://palgania.ovh:8081/games/",
                postlink2 = "";
            q = [
                {
                    id: "zombinis2",
                    G: 33554432,
                    state: {
                        url: antelink2 + "zombinis2.bin.zst" + postlink2
                    },
                    H: {
                        url: antelink + "zombinis2/.img.zst" + postlink,
                        size: 2147483648,
                        async: use_async,
                        J: 262144,
                        fa: !0
                    },
                    name: "Zoombinis 2 : Mission au sommet"
                },
                {
                    id: "monsieur_heureux_et_le_monde_a_lenvers",
                    G: 33554432,
                    state: {
                        url: antelink2 + "monsieur_heureux_et_le_monde_a_lenvers.bin.zst" + postlink2
                    },
                    H: {
                        url: antelink + "monsieur_heureux_et_le_monde_a_lenvers/.img.zst" + postlink,
                        size: 2147483648,
                        async: use_async,
                        J: 262144,
                        fa: !0
                    },
                    name: "Monsieur Heureux et le monde à l'envers"
                },
                {
                    id: "spy_fox_dry_cereals",
                    G: 33554432,
                    state: {
                        url: antelink2 + "spy_fox_dry_cereals.bin.zst" + postlink2
                    },
                    H: {
                        url: antelink + "spy_fox_dry_cereals/.img.zst" + postlink,
                        size: 2147483648,
                        async: use_async,
                        J: 262144,
                        fa: !0
                    },
                    name: "Spy Fox : Opération Milkshake"
                },
                {
                    id: "sampyjam",
                    G: 33554432,
                    state: {
                        url: antelink2 + "sampyjam.bin.zst" + postlink2
                    },
                    H: {
                        url: antelink + "sampyjam/.img.zst" + postlink,
                        size: 2147483648,
                        async: use_async,
                        J: 262144,
                        fa: !0
                    },
                    name: "Sam Pyjam : Le héros de la nuit"
                },
                {
                    id: "sampyjam2",
                    G: 33554432,
                    state: {
                        url: antelink2 + "sampyjam2.bin.zst" + postlink2
                    },
                    H: {
                        url: antelink + "sampyjam2/.img.zst" + postlink,
                        size: 2147483648,
                        async: use_async,
                        J: 262144,
                        fa: !0
                    },
                    name: "Sam Pyjam : Héros météo"
                },
                {
                    id: "pouce_zoo",
                    G: 1073741824,
                    state: {
                        url: antelink2 + "pouce_zoo.bin.zst" + postlink2
                    },
                    H: {
                        url: antelink + "pouce_zoo/.img.zst" + postlink,
                        size: 2147483648,
                        async: use_async,
                        J: 262144,
                        fa: !0
                    },
                    name: "Pouce-Pouce sauve le zoo"
                },
                {
                    id: "pouce_temps",
                    G: 33554432,
                    state: {
                        url: antelink2 + "pouce_temps.bin.zst" + postlink2
                    },
                    H: {
                        url: antelink + "pouce_temps/.img.zst" + postlink,
                        size: 2147483648,
                        async: use_async,
                        J: 262144,
                        fa: !0
                    },
                    name: "Pouce-Pouce voyage dans le temps"
                },
                {
                    id: "pouce_course",
                    G: 33554432,
                    state: {
                        url: antelink2 + "pouce_course.bin.zst" + postlink2
                    },
                    H: {
                        url: antelink + "pouce_course/.img.zst" + postlink,
                        size: 2147483648,
                        async: use_async,
                        J: 262144,
                        fa: !0
                    },
                    name: "Pouce-Pouce entre dans la course"
                },
                {
                    id: "pouce_cirque",
                    G: 33554432,
                    state: {
                        url: antelink2 + "pouce_cirque.bin.zst" + postlink2
                    },
                    H: {
                        url: antelink + "pouce_cirque/.img.zst" + postlink,
                        size: 2147483648,
                        async: use_async,
                        J: 262144,
                        fa: !0
                    },
                    name: "Pouce-Pouce découvre le cirque"
                },
                {
                    id: "marine1_algues",
                    G: 33554432,
                    state: {
                        url: antelink2 + "marine1_algues.bin.zst" + postlink2
                    },
                    H: {
                        url: antelink + "marine1_algues/.img.zst" + postlink,
                        size: 2147483648,
                        async: use_async,
                        J: 262144,
                        fa: !0
                    },
                    name: "Marine Malice et le mystère des graines d'algues"
                },
                {
                    id: "marine2_hantee",
                    G: 33554432,
                    state: {
                        url: antelink2 + "marine2_hantee.bin.zst" + postlink2
                    },
                    H: {
                        url: antelink + "marine2_hantee/.img.zst" + postlink,
                        size: 2147483648,
                        async: use_async,
                        J: 262144,
                        fa: !0
                    },
                    name: "Marine Malice et le mystère de l'école hantée"
                },
                {
                    id: "marine3_coquillage",
                    G: 33554432,
                    state: {
                        url: antelink2 + "marine3_coquillage.bin.zst" + postlink2
                    },
                    H: {
                        url: antelink + "marine3_coquillage/.img.zst" + postlink,
                        size: 2147483648,
                        async: use_async,
                        J: 262144,
                        fa: !0
                    },
                    name: "Marine Malice et le mystère du coquillage volé"
                },
                {
                    id: "marine4_ranch",
                    G: 33554432,
                    state: {
                        url: antelink2 + "marine4_ranch.bin.zst" + postlink2
                    },
                    H: {
                        url: antelink + "marine4_ranch/.img.zst" + postlink,
                        size: 2147483648,
                        async: use_async,
                        J: 262144,
                        fa: !0
                    },
                    name: "Marine Malice et le mystère du ranch aux cochons"
                },
                {
                    id: "marine5_lagon",
                    G: 33554432,
                    state: {
                        url: antelink2 + "marine5_lagon.bin.zst" + postlink2
                    },
                    H: {
                        url: antelink + "marine5_lagon/.img.zst" + postlink,
                        size: 2147483648,
                        async: use_async,
                        J: 262144,
                        fa: !0
                    },
                    name: "Marine Malice et le mystère du monstre du lagon bleu"
                },
                {
                    id: "transforme",
                    G: 33554432,
                    state: {
                        url: antelink2 + "transforme.bin.zst" + postlink2
                    },
                    H: {
                        url: antelink + "transforme/.img.zst" + postlink,
                        size: 2147483648,
                        async: use_async,
                        J: 262144,
                        fa: !0
                    },
                    name: "Ca se transforme"
                },
                {
                    id: "qqchdedans",
                    G: 33554432,
                    state: {
                        url: antelink2 + "qqchdedans.bin.zst" + postlink2
                    },
                    H: {
                        url: antelink + "qqchdedans/.img.zst" + postlink,
                        size: 2147483648,
                        async: use_async,
                        J: 262144,
                        fa: !0
                    },
                    name: "Il y a quelque chose dedans"
                },
                {
                    id: "cafaitpeur",
                    G: 33554432,
                    state: {
                        url: antelink2 + "cafaitpeur.bin.zst" + postlink2
                    },
                    H: {
                        url: antelink + "cafaitpeur/.img.zst" + postlink,
                        size: 2147483648,
                        async: use_async,
                        J: 262144,
                        fa: !0
                    },
                    name: "Ca fait peur"
                },


                {
                    id: "archlinux",
                    name: "Arch Linux",
                    G: 536870912,
                    ba: 8388608,
                    state: {
                        url: q + "arch_state.bin.zst"
                    },
                    filesystem: {
                        Ie: q + "arch/"
                    }
                }, {
                    id: "archlinux-boot",
                    name: "Arch Linux",
                    G: 536870912,
                    ba: 8388608,
                    filesystem: {
                        Ie: q +
                            "arch/",
                        Eh: {
                            url: q + "fs.json"
                        }
                    },
                    ec: "rw apm=off vga=0x344 video=vesafb:ypan,vremap:8 root=host9p rootfstype=9p rootflags=trans=virtio,cache=loose mitigations=off audit=0 init_on_free=on tsc=reliable random.trust_cpu=on nowatchdog init=/usr/bin/init-openrc net.ifnames=0 biosdevname=0",
                    ae: !0
                }, {
                    id: "copy/skiffos",
                    name: "SkiffOS",
                    X: {
                        url: q + "skiffos.iso",
                        size: 124672E3,
                        async: use_async,
                        J: 1048576,
                        fa: !l
                    },
                    G: 536870912
                }, {
                    id: "serenity",
                    name: "SerenityOS",
                    H: {
                        url: q + "serenity-v3/.img.zst",
                        size: 734003200,
                        async: use_async,
                        J: 1048576,
                        fa: !0
                    },
                    G: 536870912,
                    state: {
                        url: q + "serenity_state-v4.bin.zst"
                    },
                    da: "https://serenityos.org/",
                    ib: !0
                }, {
                    id: "serenity-boot",
                    name: "SerenityOS",
                    H: {
                        url: q + "serenity-v3/.img.zst",
                        size: 734003200,
                        async: use_async,
                        J: 1048576,
                        fa: !0
                    },
                    G: 536870912,
                    da: "https://serenityos.org/"
                }, {
                    id: "redox",
                    name: "Redox",
                    H: {
                        url: q + "redox_demo_i686_2022-11-26_643_harddrive.img",
                        size: 536870912,
                        async: use_async,
                        J: 1048576,
                        fa: !l
                    },
                    G: 536870912,
                    state: {
                        url: q + "redox_state.bin.zst"
                    },
                    da: "https://www.redox-os.org/",
                    ta: !0
                }, {
                    id: "redox-boot",
                    name: "Redox",
                    H: {
                        url: q + "redox_demo_i686_2022-11-26_643_harddrive.img",
                        size: 536870912,
                        async: use_async,
                        J: 1048576,
                        fa: !l
                    },
                    G: 536870912,
                    da: "https://www.redox-os.org/",
                    ta: !0
                }, {
                    id: "helenos",
                    G: 268435456,
                    X: {
                        url: q + "HelenOS-0.11.2-ia32.iso",
                        size: 25765888,
                        async: !1
                    },
                    name: "HelenOS",
                    da: "http://www.helenos.org/"
                }, {
                    id: "fiwix",
                    G: 268435456,
                    H: {
                        url: q + "FiwixOS-3.3-i386.img",
                        size: 1073741824,
                        async: use_async,
                        J: 1048576,
                        fa: !l
                    },
                    name: "FiwixOS",
                    da: "https://www.fiwix.org/"
                }, {
                    id: "haiku",
                    G: 536870912,
                    H: {
                        url: q + "haiku-v3.img",
                        size: 1073741824,
                        async: use_async,
                        J: 1048576,
                        fa: !l
                    },
                    state: {
                        url: q + "haiku_state-v3.bin.zst"
                    },
                    name: "Haiku",
                    da: "https://www.haiku-os.org/"
                }, {
                    id: "haiku-boot",
                    G: 536870912,
                    H: {
                        url: q + "haiku-v3.img",
                        size: 1073741824,
                        async: use_async,
                        J: 1048576,
                        fa: !l
                    },
                    name: "Haiku",
                    da: "https://www.haiku-os.org/"
                }, {
                    id: "msdos",
                    H: {
                        url: q + "msdos.img",
                        size: 8388608,
                        async: !1
                    },
                    name: "MS-DOS"
                }, {
                    id: "freedos",
                    $: {
                        url: q + "freedos722.img",
                        size: 737280,
                        async: !1
                    },
                    name: "FreeDOS"
                }, {
                    id: "freegem",
                    H: {
                        url: q + "freegem.bin",
                        size: 209715200,
                        async: use_async
                    },
                    name: "Freedos with FreeGEM"
                }, {
                    id: "psychdos",
                    H: {
                        url: q + "psychdos.img",
                        size: 549453824,
                        async: use_async,
                        J: 262144,
                        fa: !l
                    },
                    name: "PsychDOS",
                    da: "https://psychoslinux.gitlab.io/DOS/INDEX.HTM"
                }, {
                    id: "oberon",
                    H: {
                        url: q + "oberon.img",
                        size: 25165824,
                        async: !1
                    },
                    name: "Oberon"
                }, {
                    id: "windows1",
                    $: {
                        url: q + "windows101.img",
                        size: 1474560,
                        async: !1
                    },
                    name: "Windows"
                }, {
                    id: "linux26",
                    X: {
                        url: q + "linux.iso",
                        size: 6547456,
                        async: !1
                    },
                    name: "Linux"
                }, {
                    id: "linux3",
                    X: {
                        url: q + "linux3.iso",
                        size: 8624128,
                        async: !1
                    },
                    name: "Linux"
                }, {
                    id: "linux4",
                    X: {
                        url: q + "linux4.iso",
                        size: 7731200,
                        async: !1
                    },
                    name: "Linux",
                    filesystem: {}
                }, {
                    id: "buildroot",
                    Ya: {
                        url: q + "buildroot-bzimage.bin",
                        size: 5166352,
                        async: !1
                    },
                    name: "Buildroot Linux",
                    filesystem: {},
                    ec: "tsc=reliable mitigations=off random.trust_cpu=on"
                }, {
                    id: "basiclinux",
                    H: {
                        url: q + "bl3-5.img",
                        size: 104857600,
                        async: !1
                    },
                    name: "BasicLinux"
                }, {
                    id: "xpud",
                    X: {
                        url: q + "xpud-0.9.2.iso",
                        size: 67108864,
                        async: !1
                    },
                    name: "xPUD",
                    G: 268435456
                }, {
                    id: "elks",
                    H: {
                        url: q + "elks-hd32-fat.img",
                        size: 32514048,
                        async: !1
                    },
                    name: "ELKS"
                }, {
                    id: "nodeos",
                    Ya: {
                        url: q + "nodeos-kernel.bin",
                        size: 14452E3,
                        async: !1
                    },
                    name: "NodeOS",
                    ec: "tsc=reliable mitigations=off random.trust_cpu=on"
                }, {
                    id: "dsl",
                    G: 268435456,
                    X: {
                        url: q +
                            "dsl-4.11.rc2.iso",
                        size: 52824064,
                        async: !1
                    },
                    name: "Damn Small Linux",
                    da: "http://www.damnsmalllinux.org/"
                }, {
                    id: "minix",
                    name: "Minix",
                    G: 268435456,
                    X: {
                        url: q + "minix-3.3.0.iso",
                        size: 605581312,
                        async: use_async,
                        J: 1048576,
                        fa: !l
                    },
                    da: "https://www.minix3.org/"
                }, {
                    id: "kolibrios",
                    $: {
                        url: l ? q + "kolibri.img" : "//builds.kolibrios.org/eng/data/data/kolibri.img",
                        size: 1474560,
                        async: !1
                    },
                    name: "KolibriOS",
                    da: "https://kolibrios.org/en/"
                }, {
                    id: "kolibrios-fallback",
                    $: {
                        url: q + "kolibri.img",
                        size: 1474560,
                        async: !1
                    },
                    name: "KolibriOS"
                }, {
                    id: "mu",
                    H: {
                        url: q + "mu-shell.img"
                    },
                    G: 268435456,
                    name: "Mu",
                    da: "https://github.com/akkartik/mu"
                }, {
                    id: "openbsd",
                    H: {
                        url: q + "openbsd.img",
                        size: 1073741824,
                        async: use_async,
                        J: 1048576,
                        fa: !l
                    },
                    state: {
                        url: q + "openbsd_state.bin.zst"
                    },
                    G: 268435456,
                    name: "OpenBSD"
                }, {
                    id: "openbsd-boot",
                    H: {
                        url: q + "openbsd.img",
                        size: 1073741824,
                        async: use_async,
                        J: 1048576,
                        fa: !l
                    },
                    G: 268435456,
                    name: "OpenBSD"
                }, {
                    id: "netbsd",
                    H: {
                        url: q + "netbsd.img",
                        size: 511000064,
                        async: use_async,
                        J: 1048576,
                        fa: !l
                    },
                    G: 268435456,
                    name: "NetBSD"
                }, {
                    id: "solos",
                    $: {
                        url: q + "os8.img",
                        async: !1,
                        size: 1474560
                    },
                    name: "Sol OS",
                    da: "http://oby.ro/os/"
                }, {
                    id: "bootchess",
                    $: {
                        url: q + "bootchess.img",
                        async: !1,
                        size: 1474560
                    },
                    name: "BootChess",
                    da: "http://www.pouet.net/prod.php?which=64962"
                }, {
                    id: "bootbasic",
                    $: {
                        url: q + "bootbasic.img",
                        async: !1,
                        size: 1474560
                    },
                    name: "bootBASIC",
                    da: "https://github.com/nanochess/bootBASIC"
                }, {
                    id: "sectorlisp",
                    $: {
                        url: q + "sectorlisp-friendly.bin",
                        async: !1,
                        size: 512
                    },
                    name: "SectorLISP",
                    da: "https://justine.lol/sectorlisp2/"
                }, {
                    id: "sectorforth",
                    $: {
                        url: q + "sectorforth.img",
                        async: !1,
                        size: 512
                    },
                    name: "sectorforth",
                    da: "https://github.com/cesarblum/sectorforth"
                },
                {
                    id: "floppybird",
                    $: {
                        url: q + "floppybird.img",
                        async: !1,
                        size: 1474560
                    },
                    name: "Floppy Bird",
                    da: "http://mihail.co/floppybird"
                }, {
                    id: "duskos",
                    H: {
                        url: q + "duskos.img",
                        async: !1,
                        size: 8388608
                    },
                    name: "Dusk OS",
                    da: "http://duskos.org/"
                }, {
                    id: "windows2000",
                    G: 536870912,
                    H: {
                        url: q + "windows2k.img",
                        size: 2147483648,
                        async: use_async,
                        J: 262144,
                        fa: !l
                    },
                    name: "Windows 2000",
                    state: {
                        url: q + "windows2k_state-v2.bin.zst"
                    },
                    ib: !0
                }, {
                    id: "windows2000-boot",
                    G: 536870912,
                    H: {
                        url: q + "windows2k.img",
                        size: 2147483648,
                        async: use_async,
                        J: 262144,
                        fa: !l
                    },
                    name: "Windows 2000"
                },
                {
                    id: "windowsnt4",
                    G: 536870912,
                    H: {
                        url: q + "winnt4_noacpi.img",
                        size: 523837440,
                        async: use_async,
                        J: 262144,
                        fa: !l
                    },
                    name: "Windows NT 4.0",
                    wc: 2
                }, {
                    id: "windowsnt3",
                    G: 268435456,
                    H: {
                        url: q + "winnt31.img",
                        size: 91226112,
                        async: use_async,
                        J: 262144,
                        fa: !l
                    },
                    name: "Windows NT 3.1"
                }, {
                    id: "windows98",
                    G: 134217728,
                    H: {
                        url: q + "windows98.img",
                        size: 314572800,
                        async: use_async,
                        J: 262144,
                        fa: !l
                    },
                    name: "Windows 98",
                    state: {
                        url: q + "windows98_state.bin.zst"
                    },
                    ib: !0
                }, {
                    id: "windows98-boot",
                    G: 134217728,
                    H: {
                        url: q + "windows98.img",
                        size: 314572800,
                        async: use_async,
                        J: 262144,
                        fa: !l
                    },
                    name: "Windows 98"
                },
                {
                    id: "windows95",
                    G: 33554432,
                    H: {
                        url: q + "w95.img",
                        size: 242049024,
                        async: use_async,
                        J: 262144,
                        fa: !l
                    },
                    name: "Windows 95",
                    state: {
                        url: q + "windows95_state.bin.zst"
                    }
                }, {
                    id: "windows95-boot",
                    G: 33554432,
                    H: {
                        url: q + "w95.img",
                        size: 242049024,
                        async: use_async,
                        J: 262144,
                        fa: !l
                    },
                    name: "Windows 95"
                }, {
                    id: "windows30",
                    G: 67108864,
                    X: {
                        url: q + "Win30.iso",
                        async: !1
                    },
                    name: "Windows 3.0"
                }, {
                    id: "windows31",
                    G: 67108864,
                    H: {
                        url: q + "win31.img",
                        async: !1,
                        size: 34463744
                    },
                    name: "Windows 3.1"
                }, {
                    id: "freebsd",
                    G: 268435456,
                    H: {
                        url: q + "freebsd.img",
                        size: 2147483648,
                        async: use_async,
                        J: 1048576,
                        fa: !l
                    },
                    state: {
                        url: q + "freebsd_state.bin.zst"
                    },
                    name: "FreeBSD"
                }, {
                    id: "freebsd-boot",
                    G: 268435456,
                    H: {
                        url: q + "freebsd.img",
                        size: 2147483648,
                        async: use_async,
                        J: 1048576,
                        fa: !l
                    },
                    name: "FreeBSD"
                }, {
                    id: "reactos-livecd",
                    G: 268435456,
                    H: {
                        url: q + "reactos-livecd-0.4.15-dev-73-g03c09c9-x86-gcc-lin-dbg.iso",
                        size: 250609664,
                        async: use_async,
                        J: 1048576,
                        fa: !l
                    },
                    name: "ReactOS",
                    da: "https://reactos.org/"
                }, {
                    id: "reactos",
                    G: 536870912,
                    H: {
                        url: q + "reactos.img",
                        size: 524288E3,
                        async: use_async,
                        J: 1048576,
                        fa: !l
                    },
                    state: {
                        url: q + "reactos_state.bin.zst"
                    },
                    ib: !0,
                    name: "ReactOS",
                    da: "https://reactos.org/"
                }, {
                    id: "reactos-boot",
                    G: 536870912,
                    H: {
                        url: q + "reactos.img",
                        size: 524288E3,
                        async: use_async,
                        J: 1048576,
                        fa: !l
                    },
                    name: "ReactOS",
                    da: "https://reactos.org/"
                }, {
                    id: "skift",
                    X: {
                        url: q + "skift-20200910.iso",
                        size: 64452608,
                        async: !1
                    },
                    name: "Skift",
                    da: "https://skiftos.org/"
                }, {
                    id: "snowdrop",
                    $: {
                        url: q + "snowdrop.img",
                        size: 1474560,
                        async: !1
                    },
                    name: "Snowdrop",
                    da: "http://www.sebastianmihai.com/snowdrop/"
                }, {
                    id: "openwrt",
                    H: {
                        url: q + "openwrt-18.06.1-x86-legacy-combined-squashfs.img",
                        size: 19846474,
                        async: !1
                    },
                    name: "OpenWrt"
                },
                {
                    id: "qnx",
                    $: {
                        url: q + "qnx-demo-network-4.05.img",
                        size: 1474560,
                        async: !1
                    },
                    name: "QNX 4.05"
                }, {
                    id: "9front",
                    G: 134217728,
                    H: {
                        url: q + "9front-8963.f84cf1e60427675514fb056cc1723e45da01e043.386.iso",
                        size: 477452288,
                        async: use_async,
                        J: 1048576,
                        fa: !l
                    },
                    state: {
                        url: q + "9front_state-v2.bin.zst"
                    },
                    ta: !0,
                    name: "9front",
                    da: "https://9front.org/"
                }, {
                    id: "9front-boot",
                    G: 134217728,
                    H: {
                        url: q + "9front-8963.f84cf1e60427675514fb056cc1723e45da01e043.386.iso",
                        size: 477452288,
                        async: use_async,
                        J: 1048576,
                        fa: !l
                    },
                    ta: !0,
                    name: "9front",
                    da: "https://9front.org/"
                }, {
                    id: "mobius",
                    $: {
                        url: q + "mobius-fd-release5.img",
                        size: 1474560,
                        async: !1
                    },
                    name: "Mobius"
                }, {
                    id: "android",
                    G: 536870912,
                    X: {
                        url: q + "android-x86-1.6-r2.iso",
                        size: 54661120,
                        async: use_async,
                        J: 1048576,
                        fa: !l
                    },
                    name: "Android"
                }, {
                    id: "android4",
                    G: 536870912,
                    X: {
                        url: q + "android_x86_nonsse3_4.4r1_20140904.iso",
                        size: 247463936,
                        async: use_async,
                        J: 1048576,
                        fa: !l
                    },
                    name: "Android"
                }, {
                    id: "tinycore",
                    G: 268435456,
                    H: {
                        url: q + "TinyCore-11.0.iso",
                        async: !1
                    },
                    name: "Tinycore",
                    da: "http://www.tinycorelinux.net/"
                }, {
                    id: "freenos",
                    G: 268435456,
                    X: {
                        url: q + "FreeNOS-1.0.3.iso",
                        async: !1,
                        size: 11014144
                    },
                    name: "FreeNOS",
                    ta: !0,
                    da: "http://www.freenos.org/"
                }, {
                    id: "syllable",
                    G: 536870912,
                    H: {
                        url: q + "syllable-destop-0.6.7/.img",
                        async: use_async,
                        size: 524288E3,
                        J: 524288,
                        fa: !0
                    },
                    name: "Syllable",
                    da: "http://syllable.metaproject.frl/"
                }
            ];
            var C = y.profile;
            if (!C) {
                var G = document.createElement("link");
                G.rel = "prefetch";
                G.href = "./build/v86.wasm";
                document.head.appendChild(G)
            } else if (!navigator.userActivation.hasBeenActive){
                location.search = "";
            }
            G = document.createElement("link");
            G.rel = "prefetch";
            G.href = "./build/xterm.js";
            document.head.appendChild(G);
            y.disable_jit && (w.ge = !0);
            y.use_bochs_bios &&
                (w.ik = !0);
            G = parseInt(y.m, 10);
            0 < G && (w.G = 1048576 * Math.max(16, G));
            G = parseInt(y.vram, 10);
            0 < G && (w.ba = 1048576 * G);
            w.sg = y.networking_proxy;
            w.audio = "0" !== y.audio;
            w.ta = y.acpi;
            for (G = 0; G < q.length; G++) {
                var S = q[G];
                if (C === S.id) {
                    r(S);
                    return
                }
                var ha = c("start_" + S.id);
                ha && (ha.onclick = function(A, F, H) {
                    H.preventDefault();
                    k(A.id);
                    F.blur();
                    r(A)
                }.bind(this, S, ha))
            }
            if ("custom" === C) {
                if (y["hda.url"] && (w.H = {
                        size: parseInt(y["hda.size"], 10) || void 0,
                        url: y["hda.url"],
                        async: use_async
                    }), y["cdrom.url"] && (w.X = {
                        size: parseInt(y["cdrom.size"], 10) ||
                            void 0,
                        url: y["cdrom.url"],
                        async: use_async
                    }), y["fda.url"] && (w.$ = {
                        size: parseInt(y["fda.size"], 10) || void 0,
                        url: y["fda.url"],
                        async: !1
                    }), w.$ || w.X || w.H) {
                    c("boot_options").style.display = "none";
                    d(w, m);
                    return
                }
            } else if (/^[a-zA-Z0-9\-_]+\/[a-zA-Z0-9\-_]+$/g.test(C)) {
                const A = "https://v86-user-images.b-cdn.net/" + C;
                fetch(A + "/profile.json").catch(() => alert("Profile not found: " + C)).then(F => F.json()).then(F => {
                    function H(I) {
                        return I && {
                            url: A + "/" + I.url,
                            async: I.async,
                            size: I.size
                        }
                    }
                    r({
                        id: F.id,
                        name: F.name,
                        G: F.memory_size,
                        ba: F.vga_memory_size,
                        ta: F.acpi,
                        bc: F.boot_order,
                        H: H(F.hda),
                        X: H(F.cdrom),
                        $: H(F.fda),
                        Lb: H(F.multiboot),
                        Ya: H(F.bzimage),
                        Ib: H(F.initrd)
                    })
                });
                return
            }
            for (const A of t)
                if (q = window.localStorage.getItem(A))
                    if (G = c(A)) "checkbox" === G.type ? G.checked = "true" === q ? !0 : !1 : G.value = q
        } else alert("Your browser is not supported because it doesn't support WebAssembly")
    }

    function d(r, m) {
        var w = r.G;
        w || (w = 1048576 * parseInt(c("memory_size").value, 10), w || (alert("Invalid memory size - reset to 128MB"), w = 134217728));
        var y = r.ba;
        y || (y = 1048576 * parseInt(c("video_memory_size").value,
            10), y || (alert("Invalid video memory size - reset to 8MB"), y = 8388608));
        if (!r.$) {
            var q = c("floppy_image").files[0];
            q && (r.$ = {
                buffer: q
            })
        }!r.Ya && (q = c("bzimage").files[0]) && (r.Ya = {
            buffer: q
        });
        !r.Ib && (q = c("initrd").files[0]) && (r.Ib = {
            buffer: q
        });
        q = void 0 === r.sg ? c("networking_proxy").value : r.sg;
        const C = c("disable_audio").checked || !r.audio,
            G = r.Hb || void 0 !== r.ta ? r.ta : c("enable_acpi").checked;
        if (r.ik) var S = "bochs-bios.bin",
            ha = "bochs-vgabios.bin";
        else S = "seabios.bin", ha = "vgabios.bin";
        if (!r.Hb) {
            var A = {
                url: "bios/" +
                    S
            };
            var F = {
                url: "bios/" + ha
            }
        }
        var H = new Va({
            G: w,
            ba: y,
            Ff: c("screen_container"),
            bc: r.bc || parseInt(c("boot_order").value, 16) || 0,
            rg: l ? "ws://localhost:8080/" : q,
            uc: A,
            Qf: F,
            $: r.$,
            H: r.H,
            lc: r.lc,
            X: r.X,
            Lb: r.Lb,
            Ya: r.Ya,
            Ib: r.Ib,
            ec: r.ec,
            ae: r.ae,
            ta: G,
            ge: r.ge,
            Hb: r.Hb,
            filesystem: r.filesystem || {},
            Sh: C,
            ib: r.ib,
            wc: r.wc,
            Dh: !0
        });
        K(H, "emulator-ready", function() {
            if (H.g.s.va.exports.profiler_is_enabled()) {
                var I = document.createElement("pre");
                document.body.appendChild(I);
                setInterval(function() {
                    if (H.fd()) {
                        var ea = Wa.fk(H.g.s);
                        I.textContent =
                            ea
                    }
                }, 1E3)
            }
            "dsl" !== r.id && "helenos" !== r.id || setTimeout(() => {
                Ua(H, "\n")
            }, 3E3);
            g(r, H);
            m && m(H)
        });
        K(H, "download-progress", function(I) {
            var ea = c("loading");
            ea.style.display = "block";
            if (I.ne.endsWith(".wasm")) {
                var x = I.ne.split("/");
                ea.textContent = "Fetching " + x[x.length - 1] + " ..."
            } else if (I.me === I.le - 1 && I.loaded >= I.total - 2048) ea.textContent = "Done downloading. Starting now ...";
            else {
                x = "Downloading images ";
                "number" === typeof I.me && I.le && (x += "[" + (I.me + 1) + "/" + I.le + "] ");
                if (I.total && "number" === typeof I.loaded) {
                    I =
                        Math.floor(I.loaded / I.total * 100);
                    I = Math.min(100, Math.max(0, I));
                    var B = Math.floor(I / 2);
                    x = x + (I + "% [") + "#".repeat(B);
                    x += " ".repeat(50 - B) + "]"
                } else x += ".".repeat(n++ % 50);
                ea.textContent = x
            }
        });
        K(H, "download-error", function(I) {
            var ea = c("loading");
            ea.style.display = "block";
            ea.textContent = "Loading " + I.ne + " failed. Check your connection and reload the page to try again."
        })
    }

    function g(r, m) {
        function w() {
            var z = Date.now(),
                L = m.g ? m.g.s.pi[0] >>> 0 : 0;
            L < ha && (ha -= 4294967296);
            var Q = L - ha;
            ha = L;
            H += Q;
            if (L = z - G) S += L, G = z, c("speed").textContent =
                (Q / 1E3 / L).toFixed(1), c("avg_speed").textContent = (H / 1E3 / S).toFixed(1), z = c("running_time"), Q = S / 1E3 | 0, z.textContent = 60 > Q ? Q + "s" : 3600 > Q ? (Q / 60 | 0) + "m " + Xa(Q % 60, 2) + "s" : (Q / 3600 | 0) + "h " + Xa((Q / 60 | 0) % 60, 2) + "m " + Xa(Q % 60, 2) + "s"
        }

        function y(z, L, Q) {
            var fa = c("get_" + Q + "_image");
            !z || 104857600 < z.size ? fa.style.display = "none" : fa.onclick = function() {
                let oa = L.file && L.file.name || r.id + ("cdrom" === Q ? ".iso" : ".img");
                if (L.mg) {
                    var db = L.mg(oa);
                    Ya(db, oa)
                } else L.sb(function(Gb) {
                    Gb ? Za(Gb, oa) : alert("The file could not be loaded. Maybe it's too big?")
                });
                fa.blur()
            }
        }

        function q(z) {
            z.ctrlKey ? window.onbeforeunload = function() {
                window.onbeforeunload = null;
                return "CTRL-W cannot be sent to the emulator."
            } : window.onbeforeunload = null
        }
        c("boot_options").style.display = "none";
        c("basic_options").style.display = "none";
        c("loading").style.display = "none";
        c("exit").style.display = "block";
        c("showmore").style.display = "block";
        //c("runtime_options").style.display = "block";
        //c("runtime_infos").style.display = "block";
        c("screen_container_container").style.display = "block";
        c("screen_container").style.display = "block";
        r.filesystem ? f(m) : K(m, "9p-attach", function() {
            f(m)
        });
        
        c("showmore").onclick = function() {
            if (c("runtime_options").style.display === "none") {
                c("runtime_options").style.display = "block";
                c("runtime_infos").style.display = "block";
                c("terminal").style.display = "block";
            } else {
                c("runtime_options").style.display = "none";
                c("runtime_infos").style.display = "none";
                c("terminal").style.display = "none";

            }
        }
        c("run").onclick = function() {
            m.fd() ? (c("run").src = "data_files/play.png", m.stop()) : (c("run").src ="data_files/pause.png", m.ff());
            c("run").blur()
        };
        c("exit").onclick = function() {
            m.stop();
            location.href = location.pathname
        };
        c("lock_mouse").onclick = function() {
            if (!C) c("toggle_mouse").onclick();
            $a();
            c("lock_mouse").blur()
        };
        var C = !0;
        c("toggle_mouse").onclick = function() {
            C = !C;
            m.l && (m.l.Pe = C);
            c("toggle_mouse").value = (C ? "Dis" : "En") + "able mouse";
            c("toggle_mouse").blur()
        };
        var G = 0,
            S = 0,
            ha = 0,
            A = null,
            F = !1,
            H = 0;
        K(m, "emulator-started", function() {
            G = Date.now();
            A = setInterval(w, 1E3)
        });
        K(m, "emulator-stopped", function() {
            w();
            null !== A && clearInterval(A)
        });
        var I = 0,
            ea = 0,
            x = [];
        K(m, "9p-read-start", function(z) {
            z = z[0];
            x.push(z);
            c("info_filesystem").style.display = "block";
            c("info_filesystem_status").textContent = "Loading ...";
            c("info_filesystem_last_file").textContent = z
        });
        K(m, "9p-read-end", function(z) {
            I += z[1];
            c("info_filesystem_bytes_read").textContent = I;
            const L = z[0];
            x = x.filter(Q => Q !== L);
            x[0] ? c("info_filesystem_last_file").textContent = x[0] : c("info_filesystem_status").textContent = "Idle"
        });
        K(m, "9p-write-end", function(z) {
            ea += z[1];
            c("info_filesystem_bytes_written").textContent =
                ea;
            x[0] || (c("info_filesystem_last_file").textContent = z[0])
        });
        var B = 0,
            V = 0,
            P = 0,
            Y = 0;
        c("ide_type").textContent = m.Ta.X ? " (CD-ROM)" : " (hard disk)";
        K(m, "ide-read-start", function() {
            c("info_storage").style.display = "block";
            c("info_storage_status").textContent = "Loading ..."
        });
        K(m, "ide-read-end", function(z) {
            B += z[1];
            V += z[2];
            c("info_storage_status").textContent = "Idle";
            c("info_storage_bytes_read").textContent = B;
            c("info_storage_sectors_read").textContent = V
        });
        K(m, "ide-write-end", function(z) {
            P += z[1];
            Y += z[2];
            c("info_storage_bytes_written").textContent =
                P;
            c("info_storage_sectors_written").textContent = Y
        });
        var da = 0,
            na = 0;
        K(m, "eth-receive-end", function(z) {
            na += z[0];
            c("info_network").style.display = "block";
            c("info_network_bytes_received").textContent = na
        });
        K(m, "eth-transmit-end", function(z) {
            da += z[0];
            c("info_network").style.display = "block";
            c("info_network_bytes_transmitted").textContent = da
        });
        K(m, "mouse-enable", function(z) {
            F = z;
            c("info_mouse_enabled").textContent = z ? "Yes" : "No"
        });
        K(m, "screen-set-mode", function(z) {
            z ? c("info_vga_mode").textContent = "Graphical" :
                (c("info_vga_mode").textContent = "Text", c("info_res").textContent = "-", c("info_bpp").textContent = "-")
        });
        K(m, "screen-set-size-graphical", function(z) {
            c("info_res").textContent = z[0] + "x" + z[1];
            c("info_bpp").textContent = z[4]
        });
        c("reset").onclick = function() {
            m.Df();
            c("reset").blur()
        };
        y(r.H, m.Ta.H, "hda");
        y(r.lc, m.Ta.lc, "hdb");
        y(r.$, m.Ta.$, "fda");
        y(r.Kd, m.Ta.Kd, "fdb");
        y(r.X, m.Ta.X, "cdrom");
        c("change_fda_image").value = r.$ ? "Eject floppy image" : "Insert floppy image";
        c("change_fda_image").onclick = function() {
            if (m.g.s.B.cd.Cc) m.Oe(),
                c("change_fda_image").value = "Insert floppy image";
            else {
                const z = document.createElement("input");
                z.type = "file";
                z.onchange = async function() {
                    const L = z.files[0];
                    L && (await m.Be({
                        buffer: L
                    }), c("change_fda_image").value = "Eject floppy image")
                };
                z.click()
            }
            c("change_fda_image").blur()
        };
        c("memory_dump").onclick = function() {
            const z = m.g.s.Na;
            Za(new Uint8Array(z.buffer, z.byteOffset, z.length), "v86memory.bin");
            c("memory_dump").blur()
        };
        c("capture_network_traffic").onclick = function() {
            function z(Q, fa) {
                var oa = L,
                    db = oa.push,
                    Gb = performance.now() / 1E3;
                const fc = [];
                let pa = 0;
                for (; pa + 15 < fa.length; pa += 16) {
                    var sa = Xa(pa.toString(16).toUpperCase(), 5) + "   ";
                    for (var ta = 0; 16 > ta; ta++) sa += Xa(fa[pa + ta].toString(16).toUpperCase(), 2) + " ";
                    sa += "  ";
                    for (ta = 0; 16 > ta; ta++) {
                        var ya = fa[pa + ta];
                        sa += 33 <= ya && 34 !== ya && 92 !== ya && 126 >= ya ? String.fromCharCode(ya) : "."
                    }
                    fc.push(sa)
                }
                for (sa = Xa(pa.toString(16).toUpperCase(), 5) + "   "; pa < fa.length; pa++) sa += Xa(fa[pa].toString(16).toUpperCase(), 2) + " ";
                ta = pa & 15;
                sa += "   ".repeat(16 - ta);
                sa += "  ";
                for (ya = 0; ya < ta; ya++) {
                    const fb =
                        fa[pa + ya];
                    sa += 33 <= fb && 34 !== fb && 92 !== fb && 126 >= fb ? String.fromCharCode(fb) : "."
                }
                fc.push(sa);
                db.call(oa, {
                    direction: Q,
                    time: Gb,
                    ni: "\n" + fc.join("\n") + "\n"
                });
                c("capture_network_traffic").value = L.length + " packets"
            }
            this.value = "0 packets";
            let L = [];
            m.bd.register("net0-receive", z.bind(this, "I"));
            K(m, "net0-send", z.bind(this, "O"));
            this.onclick = function() {
                const Q = L.map(({
                    direction: fa,
                    time: oa,
                    ni: db
                }) => fa + " " + oa.toFixed(6) + db + "\n").join("");
                Za(Q, "traffic.hex");
                L = [];
                this.value = "0 packets"
            }
        };
        c("save_state").onclick = async function() {
            const z =
                await m.Ae();
            Za(z, "v86state.bin");
            c("save_state").blur()
        };
        c("save_state_d").onclick = async function() {
            const z =
                await m.Ae();
            let blob = Za_ret(z);
            let profile = new URLSearchParams(window.location.search).get("profile");
            saveGame(profile, blob);
            alert("Sauvegarde effectuée");
            c("save_state_d").blur()
        };
        c("load_state").onclick = function() {
            c("load_state_input").click();
            c("load_state").blur()
        };
        c("load_state_input").onchange = async function() {
            var z = this.files[0];
            if (z) {
                var L = m.fd();
                L && await m.stop();
                var Q = new FileReader;
                Q.onload = async function(fa) {
                    try {
                        await m.Rd(fa.target.result)
                    } catch (oa) {
                        throw alert("Something bad happened while restoring the state:\n" + oa + "\n\nNote that the current configuration must be the same as the original"), oa;
                    }
                    L && m.ff()
                };
                Q.readAsArrayBuffer(z);
                this.value = ""
            }
        };
        c("load_state_d").onclick = function() {
            let profile = new URLSearchParams(window.location.search).get("profile");
            let lsi = c("load_state_input");
            loadGame(profile, async function(blob){
                let z = blob.data;
                var L = m.fd();
                L && await m.stop();
                var Q = new FileReader;
                Q.onload = async function(fa) {
                    try {
                        await m.Rd(fa.target.result)
                    } catch (oa) {
                        throw alert("Something bad happened while restoring the state:\n" + oa + "\n\nNote that the current configuration must be the same as the original"), oa;
                    }
                    L && m.ff()
                };
                Q.readAsArrayBuffer(z);

            });
            c("load_state_d").blur()
        };
        c("ctrlaltdel").onclick = function() {
            ab(m, [29, 56, 83, 157, 184, 211]);
            c("ctrlaltdel").blur()
        };
        c("alttab").onclick = function() {
            ab(m, [56, 15]);
            setTimeout(function() {
                ab(m, [184, 143])
            }, 100);
            c("alttab").blur()
        };
        let escapeEvent = function() {
            ab(m, [1]);
            c("escape").blur()
        };
        c("escape").onclick = escapeEvent;
        c("escape2").onclick = escapeEvent;
        c("scale").onchange = function() {
            var z = parseFloat(this.value);
            (z || 0 < z) && m.h && m.h.Jf(z, z)
        };
        c("fullscreen").onclick = function() {
            if (m.h) {
                var z = document.getElementById("screen_container");
                // let els = document.querySelectorAll(".shinfs");
                // for (let i = 0; i < els.length; i++) {
                //     els[i].style.display = "block";
                // }
                if (z) {
                    var L = z.requestFullScreen || z.webkitRequestFullscreen || z.mozRequestFullScreen ||
                        z.msRequestFullScreen;
                    //L && (L.call(z), (z = document.getElementsByClassName("phone_keyboard")[0]) && z.focus());
                    L && (L.call(z), (z = document.getElementsByClassName("screen_container")[0]) && z.focus());
                    try {
                        navigator.keyboard.lock()
                    } catch (Q) {}
                    $a()
                }
            }
        };
        let fsc_exit_call = function(e) {
            if (mobileAndTabletCheck()){

                let shinfs = document.querySelectorAll(".shinfs");
                let scontain = document.getElementById("screen_container");
                let ocontain = document.getElementById("opt_container");
                if (document.fullscreenElement){
                    for (let i = 0; i < shinfs.length; i++) {
                        scontain.appendChild(shinfs[i].parentNode.removeChild(shinfs[i]));
                    }
                } else {
    
                    for (let i = 0; i < shinfs.length; i++) {
                        ocontain.appendChild(shinfs[i].parentNode.removeChild(shinfs[i]));
                    }
                }  
            }
        };
        c("screen_container").addEventListener("webkitfullscreenchange", fsc_exit_call);
        c("screen_container").addEventListener("fullscreenchange", fsc_exit_call);
        c("screen_container").addEventListener("mozfullscreenchange", fsc_exit_call);
        c("screen_container").addEventListener("MSFullscreenChange", fsc_exit_call);
        c("fullscreen2").onclick = function() {
            if (document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement){
                
                document.exitFullscreen();
            } else {
                c("fullscreen").onclick();
            }
        }
        c("screen_container").onclick = function(e) {
            e.preventDefault();
            if (C && F) $a();
            else if (window.getSelection().isCollapsed) {
                // let z = document.getElementsByClassName("phone_keyboard")[0];
                // z.style.top = document.body.scrollTop + 100 + "px";
                // z.style.left = document.body.scrollLeft + 100 + "px";
                // z.focus()
            }
        };
        const Ea = document.getElementsByClassName("phone_keyboard")[0];
        Ea.setAttribute("autocorrect",
            "off");
        Ea.setAttribute("autocapitalize", "off");
        Ea.setAttribute("spellcheck", "false");
        Ea.tabIndex = 0;
        c("screen_container").addEventListener("mousedown", (e) => {
            e.preventDefault();
            //Ea.focus()
        }, !1);
        c("show_keyboard").addEventListener("mousedown", (e) => {
            e.preventDefault();
            if (document.activeElement === Ea){
                Ea.blur();
                e.currentTarget.src = "data_files/keyboard_off.png";
            } else {
                Ea.focus();
                e.currentTarget.src = "data_files/keyboard_on.png";
            }
        }, !1);
        c("take_screenshot").onclick = function() {
            const z = m.h ? m.h.vi() : null;
            try {
                window.open("").document.write(z.outerHTML)
            } catch (L) {}
            c("take_screenshot").blur()
        };
        if (m.j) {
            let z = !1;
            c("mute").onclick = function() {
                z ? (m.j.We.hf(1, void 0), z = !1, c("mute").value = "Mute") : (m.j.We.hf(0, void 0), z = !0, c("mute").value = "Unmute");
                c("mute").blur()
            }
        } else c("mute").remove();
        window.addEventListener("keydown", q, !1);
        window.addEventListener("keyup", q, !1);
        window.addEventListener("blur", q, !1);
        const La = document.createElement("script");
        La.src = "build/xterm.js";
        La.async = !0;
        La.onload = function() {
            var z = c("terminal");
            m.vb && m.vb.oa && m.vb.oa();
            m.vb = new bb(z, m.v);
            m.vb.show()
        };
        document.body.appendChild(La)
    }

    function f(r) {
        c("filesystem_panel").style.display = "block";
        c("filesystem_send_file").onchange = function() {
            Array.prototype.forEach.call(this.files, function(m) {
                var w = new cb(m);
                w.onload =
                    function() {
                        w.sb(async function(y) {
                            await r.Nh("/" + m.name, new Uint8Array(y))
                        })
                    };
                w.load()
            }, this);
            this.value = "";
            this.blur()
        };
        c("filesystem_get_file").onkeypress = async function(m) {
            if (13 === m.which) {
                this.disabled = !0;
                try {
                    var w = await r.ze(this.value)
                } catch (y) {
                    console.log(y)
                }
                this.disabled = !1;
                w ? (m = this.value.replace(/\/$/, "").split("/"), m = m[m.length - 1] || "root", Za(w, m), this.value = "") : alert("Can't read file")
            }
        }
    }

    function h() {
        location.reload()
    }

    function k(r) {
        window.history.pushState && window.history.pushState({
                profile: r
            },
            "", "?profile=" + r)
    }
    var l = !location.hostname.endsWith("copy.sh"),
        n = 0;
    const t = "memory_size video_memory_size networking_proxy disable_audio enable_acpi boot_order".split(" ");
    window.addEventListener("load", e, !1);
    window.addEventListener("load", function() {
        setTimeout(function() {
            window.addEventListener("popstate", h)
        }, 0)
    });
    "complete" === document.readyState && e()
})();

function eb(a) {
    this.ports = [];
    this.s = a;
    for (var b = 0; 65536 > b; b++) this.ports[b] = gb(this);
    var c = a.G[0];
    for (b = 0; b << 17 < c; b++) a.h[b] = a.j[b] = void 0, a.U[b] = a.i[b] = void 0;
    hb(this, c, 4294967296 - c, function() {
        return 255
    }, function() {}, function() {
        return -1
    }, function() {})
}

function gb(a) {
    return {
        ud: a.bi,
        Oa: a.$h,
        ye: a.ai,
        lf: a.rf,
        Ge: a.rf,
        Uc: a.rf,
        la: void 0
    }
}
p = eb.prototype;
p.bi = function() {
    return 255
};
p.$h = function() {
    return 65535
};
p.ai = function() {
    return -1
};
p.rf = function() {};

function M(a, b, c, e, d, g) {
    e && (a.ports[b].ud = e);
    d && (a.ports[b].Oa = d);
    g && (a.ports[b].ye = g);
    a.ports[b].la = c
}

function N(a, b, c, e, d, g) {
    e && (a.ports[b].lf = e);
    d && (a.ports[b].Ge = d);
    g && (a.ports[b].Uc = g);
    a.ports[b].la = c
}
p.vd = function(a, b, c, e, d, g) {
    function f() {
        return c.call(this) | e.call(this) << 8
    }

    function h() {
        return d.call(this) | g.call(this) << 8
    }

    function k() {
        return c.call(this) | e.call(this) << 8 | d.call(this) << 16 | g.call(this) << 24
    }
    d && g ? (M(this, a, b, c, f, k), M(this, a + 1, b, e), M(this, a + 2, b, d, h), M(this, a + 3, b, g)) : (M(this, a, b, c, f), M(this, a + 1, b, e))
};
p.Ob = function(a, b, c, e, d, g) {
    function f(l) {
        c.call(this, l & 255);
        e.call(this, l >> 8 & 255)
    }

    function h(l) {
        d.call(this, l & 255);
        g.call(this, l >> 8 & 255)
    }

    function k(l) {
        c.call(this, l & 255);
        e.call(this, l >> 8 & 255);
        d.call(this, l >> 16 & 255);
        g.call(this, l >>> 24)
    }
    d && g ? (N(this, a, b, c, f, k), N(this, a + 1, b, e), N(this, a + 2, b, d, h), N(this, a + 3, b, g)) : (N(this, a, b, c, f), N(this, a + 1, b, e))
};
p.xi = function(a) {
    var b = this.s.h[a >>> 17];
    return b(a) | b(a + 1) << 8 | b(a + 2) << 16 | b(a + 3) << 24
};
p.yi = function(a, b) {
    var c = this.s.j[a >>> 17];
    c(a, b & 255);
    c(a + 1, b >> 8 & 255);
    c(a + 2, b >> 16 & 255);
    c(a + 3, b >>> 24)
};

function hb(a, b, c, e, d, g, f) {
    g || (g = a.xi.bind(a));
    f || (f = a.yi.bind(a));
    for (b >>>= 17; 0 < c; b++) a.s.h[b] = e, a.s.j[b] = d, a.s.U[b] = g, a.s.i[b] = f, c -= 131072
};

function ib(a, b) {
    this.i = this.h = !1;
    this.j = 0;
    this.g = null;
    this.s = new jb(a, b, () => {
        this.C && kb(this, 0)
    });
    this.v = a;
    a.register("cpu-init", this.hb, this);
    a.register("cpu-run", this.ff, this);
    a.register("cpu-stop", this.stop, this);
    a.register("cpu-restart", this.Df, this);
    this.l()
}
p = ib.prototype;
p.ff = function() {
    this.i = !1;
    this.h || (this.h = !0, this.v.send("emulator-started"));
    kb(this, 0)
};

function lb(a) {
    if (a.i || !a.h) a.i = a.h = !1, a.v.send("emulator-stopped");
    else {
        a.C = !1;
        var b = a.s.eh();
        kb(a, b)
    }
}

function kb(a, b) {
    const c = ++a.j;
    a.C = !0;
    a.u(b, c)
}
p.stop = function() {
    this.h && (this.i = !0)
};
p.oa = function() {
    this.o()
};
p.Df = function() {
    this.s.Y();
    mb(this.s)
};
p.hb = function(a) {
    this.s.hb(a, this.v);
    this.v.send("emulator-ready")
};
if ("undefined" !== typeof process) ib.prototype.u = function(a, b) {
    1 > a ? global.setImmediate(c => {
        c === this.j && lb(this)
    }, b) : setTimeout(c => {
        c === this.j && lb(this)
    }, a, b)
}, ib.prototype.l = function() {}, ib.prototype.o = function() {};
else if ("undefined" !== typeof Worker) {
    function a() {
        globalThis.onmessage = function(b) {
            const c = b.data.t;
            1 > c ? postMessage(b.data.Yg) : setTimeout(() => postMessage(b.data.Yg), c)
        }
    }
    ib.prototype.l = function() {
        const b = URL.createObjectURL(new Blob(["(" + a.toString() + ")()"], {
            type: "text/javascript"
        }));
        this.g =
            new Worker(b);
        this.g.onmessage = c => {
            c.data === this.j && lb(this)
        };
        URL.revokeObjectURL(b)
    };
    ib.prototype.u = function(b, c) {
        this.g.postMessage({
            t: b,
            Yg: c
        })
    };
    ib.prototype.o = function() {
        this.g && this.g.terminate();
        this.g = null
    }
} else ib.prototype.u = function(a) {
    setTimeout(() => {
        lb(this)
    }, a)
}, ib.prototype.l = function() {}, ib.prototype.o = function() {};
ib.prototype.Ae = function() {
    return this.s.Ae()
};
ib.prototype.Rd = function(a) {
    return this.s.Rd(a)
};
if ("object" === typeof performance && performance.now) var nb = performance.now.bind(performance);
else if ("function" === typeof require) {
    const {
        performance: a
    } = require("perf_hooks");
    nb = a.now.bind(a)
} else "object" === typeof process && process.hrtime ? nb = function() {
    var a = process.hrtime();
    return 1E3 * a[0] + a[1] / 1E6
} : nb = Date.now;
var cb, ob, pb, qb, rb, sb, tb;

function ub(a, b) {
    return (a || 0 === a ? a + "" : "").padEnd(b, " ")
}

function Xa(a, b) {
    return (a || 0 === a ? a + "" : "").padStart(b, "0")
}

function O(a, b, c, e) {
    return new Proxy({}, {
        get: function(d, g) {
            d = new a(b.buffer, c, e);
            g = d[g];
            return "function" === typeof g ? g.bind(d) : g
        },
        set: function(d, g, f) {
            (new a(b.buffer, c, e))[g] = f;
            return !0
        }
    })
}

function vb(a, b) {
    return "0x" + Xa((a ? a.toString(16) : "").toUpperCase(), b || 1)
}
if ("undefined" !== typeof crypto && crypto.getRandomValues) {
    let a = new Int32Array(1);
    var wb = function() {
        crypto.getRandomValues(a);
        return a[0]
    }
} else if ("undefined" !== typeof require) {
    const a = require("crypto");
    wb = function() {
        return a.Vk(4).readInt32LE(0)
    }
}
(function() {
    if ("function" === typeof Math.clz32) ob = function(e) {
        return 31 - Math.clz32(e)
    };
    else {
        for (var a = new Int8Array(256), b = 0, c = -2; 256 > b; b++) b & b - 1 || c++, a[b] = c;
        ob = function(e) {
            e >>>= 0;
            var d = e >>> 16;
            if (d) {
                var g = d >>> 8;
                return g ? 24 + a[g] : 16 + a[d]
            }
            return (g = e >>> 8) ? 8 + a[g] : a[e]
        }
    }
})();

function xb(a) {
    var b = new Uint8Array(a),
        c, e;
    this.length = 0;
    this.push = function(d) {
        this.length !== a && this.length++;
        b[e] = d;
        e = e + 1 & a - 1
    };
    this.shift = function() {
        if (this.length) {
            var d = b[c];
            c = c + 1 & a - 1;
            this.length--;
            return d
        }
        return -1
    };
    this.clear = function() {
        this.length = e = c = 0
    };
    this.clear()
}

function yb() {
    this.size = 65536;
    this.data = new Float32Array(65536);
    this.length = this.end = this.start = 0
}
yb.prototype.push = function(a) {
    this.length === this.size ? this.start = this.start + 1 & this.size - 1 : this.length++;
    this.data[this.end] = a;
    this.end = this.end + 1 & this.size - 1
};
yb.prototype.shift = function() {
    if (this.length) {
        var a = this.data[this.start];
        this.start = this.start + 1 & this.size - 1;
        this.length--;
        return a
    }
};

function zb(a, b) {
    var c = new Float32Array(b);
    b > a.length && (b = a.length);
    var e = a.start + b,
        d = a.data.subarray(a.start, e);
    c.set(d);
    e >= a.size && (e -= a.size, c.set(a.data.subarray(0, e), d.length));
    a.start = e;
    a.length -= b;
    return c
}
yb.prototype.clear = function() {
    this.length = this.end = this.start = 0
};

function Za(a, b) {
    a instanceof Array || (a = [a]);
    Ya(new Blob(a), b)
}

function Za_ret(a) {
    a instanceof Array || (a = [a]);
    return new Blob(a);
}

function dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to an ArrayBuffer
    var arrayBuffer = new ArrayBuffer(byteString.length);
    var _ia = new Uint8Array(arrayBuffer);
    for (var i = 0; i < byteString.length; i++) {
        _ia[i] = byteString.charCodeAt(i);
    }

    var dataView = new DataView(arrayBuffer);
    var blob = new Blob([dataView], { type: mimeString });
    return blob;
}

function Ya(a, b) {
    var c = document.createElement("a");
    c.download = b;
    c.href = window.URL.createObjectURL(a);
    c.dataset.downloadurl = ["application/octet-stream", c.download, c.href].join(":");
    document.createEvent ? (a = document.createEvent("MouseEvent"), a.initMouseEvent("click", !0, !0, window, 0, 0, 0, 0, 0, !1, !1, !1, !1, 0, null), c.dispatchEvent(a)) : c.click();
    window.URL.revokeObjectURL(c.href)
}

function Ab(a) {
    "number" === typeof a ? this.view = new Uint8Array(a + 7 >> 3) : a instanceof ArrayBuffer && (this.view = new Uint8Array(a))
}
Ab.prototype.set = function(a, b) {
    const c = a >> 3;
    a = 1 << (a & 7);
    this.view[c] = b ? this.view[c] | a : this.view[c] & ~a
};
Ab.prototype.get = function(a) {
    return this.view[a >> 3] >> (a & 7) & 1
};
Ab.prototype.sb = function() {
    return this.view.buffer
};
var Db = "undefined" === typeof XMLHttpRequest ? Bb : Cb;

function Cb(a, b, c) {
    function e() {
        const k = c || 0;
        setTimeout(() => {
            Cb(a, b, k + 1)
        }, 1E3 * ([1, 1, 2, 3, 5, 8, 13, 21][k] || 34))
    }
    var d = new XMLHttpRequest;
    d.open(b.method || "get", a, !0);
    d.responseType = b.Fd ? "json" : "arraybuffer";
    if (b.headers)
        for (var g = Object.keys(b.headers), f = 0; f < g.length; f++) {
            var h = g[f];
            d.setRequestHeader(h, b.headers[h])
        }
    b.td && (g = b.td.start, d.setRequestHeader("Range", "bytes=" + g + "-" + (g + b.td.length - 1)), d.setRequestHeader("X-Accept-Encoding", "identity"), d.onreadystatechange = function() {
        200 === d.status && d.abort()
    });
    d.onload = function() {
        if (4 === d.readyState)
            if (200 !== d.status && 206 !== d.status) console.error("Loading the image " + a + " failed (status %d)", d.status), 500 <= d.status && 600 > d.status && e();
            else if (d.response) {
            if (b.td) {
                let k = d.getResponseHeader("Content-Encoding");
                k && "identity" !== k && console.error("Server sent Content-Encoding in response to ranged request", {
                    filename: a,
                    Kk: k
                })
            }
            b.done && b.done(d.response, d)
        }
    };
    d.onerror = function(k) {
        console.error("Loading the image " + a + " failed", k);
        e()
    };
    b.progress && (d.onprogress = function(k) {
        b.progress(k)
    });
    d.send(null)
}

function Bb(a, b) {
    let c = require("fs");
    b.td ? c.open(a, "r", (e, d) => {
        if (e) throw e;
        e = b.td.length;
        var g = Buffer.allocUnsafe(e);
        c.read(d, g, 0, e, b.td.start, f => {
            if (f) throw f;
            b.done && b.done(new Uint8Array(g));
            c.close(d, h => {
                if (h) throw h;
            })
        })
    }) : c.readFile(a, {
        encoding: b.Fd ? "utf-8" : null
    }, function(e, d) {
        e ? console.log("Could not read file:", a, e) : (e = d, b.Fd ? e = JSON.parse(e) : e = (new Uint8Array(e)).buffer, b.done(e))
    })
};
(function() {
    function a(f) {
        this.buffer = f;
        this.byteLength = f.byteLength;
        this.onload = void 0
    }

    function b(f, h, k) {
        this.filename = f;
        this.byteLength = h;
        this.g = new Map;
        this.i = new Set;
        this.J = k;
        this.u = !!k;
        this.onload = void 0
    }

    function c(f, h, k, l, n) {
        const t = f.match(/\.[^\.]+(\.zst)?$/);
        this.j = t ? t[0] : "";
        this.h = f.substring(0, f.length - this.j.length);
        this.D = this.j.endsWith(".zst");
        this.h.endsWith("/") || (this.h += "-");
        this.g = new Map;
        this.i = new Set;
        this.byteLength = h;
        this.J = k;
        this.F = !!l;
        this.C = n;
        this.u = !!k;
        this.onload = void 0
    }

    function e(f) {
        this.file = f;
        this.byteLength = f.size;
        1073741824 < f.size && console.warn("SyncFileBuffer: Allocating buffer of " + (f.size >> 20) + " MB ...");
        this.buffer = new ArrayBuffer(f.size);
        this.onload = void 0
    }

    function d(f) {
        this.file = f;
        this.byteLength = f.size;
        this.g = new Map;
        this.i = new Set;
        this.onload = void 0
    }
    pb = a;
    sb = b;
    rb = c;
    qb = d;
    cb = e;
    tb = function(f, h) {
        if (f.buffer instanceof ArrayBuffer) return new pb(f.buffer);
        if ("undefined" !== typeof File && f.buffer instanceof File) return h = f.async, void 0 === h && (h = 268435456 <= f.buffer.size),
            h ? new qb(f.buffer) : new cb(f.buffer);
        if (f.url) return f.fa ? new rb(f.url, f.size, f.J, !1, h) : new sb(f.url, f.size, f.J)
    };
    a.prototype.load = function() {
        this.onload && this.onload({
            buffer: this.buffer
        })
    };
    a.prototype.get = function(f, h, k) {
        k(new Uint8Array(this.buffer, f, h))
    };
    a.prototype.set = function(f, h, k) {
        (new Uint8Array(this.buffer, f, h.byteLength)).set(h);
        k()
    };
    a.prototype.sb = function(f) {
        f(this.buffer)
    };
    a.prototype.aa = function() {
        const f = [];
        f[0] = this.byteLength;
        f[1] = new Uint8Array(this.buffer);
        return f
    };
    a.prototype.I =
        function(f) {
            this.byteLength = f[0];
            this.buffer = f[1].slice().buffer
        };
    b.prototype.load = function() {
        void 0 !== this.byteLength ? this.onload && this.onload(Object.create(null)) : g(this.filename, (f, h) => {
            if (f) throw Error("Cannot use: " + this.filename + ". " + f);
            this.byteLength = h;
            this.onload && this.onload(Object.create(null))
        })
    };
    b.prototype.h = function(f, h) {
        var k = h / 256;
        f /= 256;
        for (var l = 0; l < k; l++)
            if (!this.g.get(f + l)) return;
        if (1 === k) return this.g.get(f);
        h = new Uint8Array(h);
        for (l = 0; l < k; l++) h.set(this.g.get(f + l), 256 * l);
        return h
    };
    b.prototype.get = function(f, h, k) {
        var l = this.h(f, h);
        if (l) k(l);
        else {
            var n = f,
                t = h;
            this.J && (n = f - f % this.J, t = Math.ceil((f - n + h) / this.J) * this.J);
            Db(this.filename, {
                done: function(r) {
                    r = new Uint8Array(r);
                    this.j(n, t, r);
                    n === f && t === h ? k(r) : k(r.subarray(f - n, f - n + h))
                }.bind(this),
                td: {
                    start: n,
                    length: t
                }
            })
        }
    };
    b.prototype.set = function(f, h, k) {
        f /= 256;
        for (var l = h.length / 256, n = 0; n < l; n++) {
            var t = this.g.get(f + n);
            void 0 === t ? this.g.set(f + n, h.slice(256 * n, 256 * (n + 1))) : t.set(h.subarray(256 * n, 256 * (n + 1)));
            this.i.add(f + n)
        }
        k()
    };
    b.prototype.j =
        function(f, h, k) {
            f /= 256;
            h /= 256;
            for (var l = 0; l < h; l++) {
                const n = this.g.get(f + l);
                n ? k.set(n, 256 * l) : this.u && this.g.set(f + l, k.slice(256 * l, 256 * (l + 1)))
            }
        };
    b.prototype.sb = function(f) {
        f()
    };
    b.prototype.aa = function() {
        const f = [],
            h = [];
        for (let [k, l] of this.g) this.i.has(k) && h.push([k, l]);
        f[0] = h;
        return f
    };
    b.prototype.I = function(f) {
        f = f[0];
        this.g.clear();
        this.i.clear();
        for (let [h, k] of f) this.g.set(h, k), this.i.add(h)
    };
    c.prototype.load = function() {
        this.onload && this.onload(Object.create(null))
    };
    c.prototype.get = function(f, h,
        k) {
        var l = this.l(f, h);
        if (l) k(l);
        else if (this.J) {
            const t = Math.floor(f / this.J),
                r = f - t * this.J,
                m = Math.ceil((r + h) / this.J),
                w = new Uint8Array(m * this.J);
            let y = 0;
            for (let q = 0; q < m; q++) {
                var n = (t + q) * this.J;
                l = this.F ? this.h + (t + q + "").padStart(8, "0") + this.j : this.h + n + "-" + (n + this.J) + this.j;
                (n = this.l(n, this.J)) ? (w.set(n, q * this.J), y++, y === m && k(w.subarray(r, r + h))) : Db(l, {
                    done: async function(C) {
                        C = new Uint8Array(C);
                        this.D && (C = await this.C(this.J, C), C = new Uint8Array(C));
                        w.set(C, q * this.J);
                        this.o((t + q) * this.J, this.J | 0, C);
                        y++;
                        y ===
                            m && k(w.subarray(r, r + h))
                    }.bind(this)
                })
            }
        } else Db(this.h + f + "-" + (f + h) + this.j, {
            done: function(t) {
                t = new Uint8Array(t);
                this.o(f, h, t);
                k(t)
            }.bind(this)
        })
    };
    c.prototype.l = b.prototype.h;
    c.prototype.set = b.prototype.set;
    c.prototype.o = b.prototype.j;
    c.prototype.aa = b.prototype.aa;
    c.prototype.I = b.prototype.I;
    e.prototype.load = function() {
        this.g(0)
    };
    e.prototype.g = function(f) {
        var h = new FileReader;
        h.onload = function(k) {
            k = new Uint8Array(k.target.result);
            (new Uint8Array(this.buffer, f)).set(k);
            this.g(f + 4194304)
        }.bind(this);
        f < this.byteLength ? h.readAsArrayBuffer(this.file.slice(f, Math.min(f + 4194304, this.byteLength))) : (this.file = void 0, this.onload && this.onload({
            buffer: this.buffer
        }))
    };
    e.prototype.get = a.prototype.get;
    e.prototype.set = a.prototype.set;
    e.prototype.sb = a.prototype.sb;
    e.prototype.aa = a.prototype.aa;
    e.prototype.I = a.prototype.I;
    d.prototype.load = function() {
        this.onload && this.onload(Object.create(null))
    };
    d.prototype.get = function(f, h, k) {
        var l = this.h(f, h);
        l ? k(l) : (l = new FileReader, l.onload = function(n) {
            n = new Uint8Array(n.target.result);
            this.j(f, h, n);
            k(n)
        }.bind(this), l.readAsArrayBuffer(this.file.slice(f, f + h)))
    };
    d.prototype.h = b.prototype.h;
    d.prototype.set = b.prototype.set;
    d.prototype.j = b.prototype.j;
    d.prototype.aa = b.prototype.aa;
    d.prototype.I = b.prototype.I;
    d.prototype.sb = function(f) {
        f()
    };
    d.prototype.mg = function(f) {
        for (var h = [], k = Array.from(this.g.keys()).sort(function(m, w) {
                return m - w
            }), l = 0, n = 0; n < k.length; n++) {
            var t = k[n],
                r = this.g.get(t);
            t *= 256;
            t !== l && (h.push(this.file.slice(l, t)), l = t);
            h.push(r);
            l += r.length
        }
        l !== this.file.size && h.push(this.file.slice(l));
        return new File(h, f)
    };
    var g = "undefined" === typeof XMLHttpRequest ? function(f, h) {
        require("fs").stat(f, (k, l) => {
            k ? h(k) : h(null, l.size)
        })
    } : function(f, h) {
        Db(f, {
            done: (k, l) => {
                k = l.getResponseHeader("Content-Range") || "";
                (l = k.match(/\/(\d+)\s*$/)) ? h(null, +l[1]): h("`Range: bytes=...` header not supported (Got `" + k + "`)")
            },
            headers: {
                Range: "bytes=0-0",
                "X-Accept-Encoding": "identity"
            }
        })
    }
})();

function Eb(a, b, c, e, d, g) {
    this.wa = new Fb(this, a, b, e, d, g);
    this.Da = new Fb(this, a, c, !1, d, g);
    this.ra = this.wa;
    this.s = a;
    0 === d ? (this.g = 496, this.ea = 14, this.Ka = 240) : 1 === d && (this.g = 368, this.ea = 15, this.Ka = 248);
    this.i = this.g | 516;
    this.h = 46080;
    this.K = [134, 128, 16, 112, 5, 0, 160, 2, 0, 128, 1, 1, 0, 0, 0, 0, this.g & 255 | 1, this.g >> 8, 0, 0, this.i & 255 | 1, this.i >> 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, this.h & 255 | 1, this.h >> 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 67, 16, 212, 130, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, this.ea, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ];
    this.jb = [{
        size: 8
    }, {
        size: 4
    }, void 0, void 0, {
        size: 16
    }];
    this.name = "ide" + d;
    this.l = 2;
    M(a.A, this.g | 7, this, function() {
        R(this.s, this.ea);
        return this.Rg()
    });
    M(a.A, this.i | 2, this, this.Rg);
    N(a.A, this.i | 2, this, this.pk);
    M(a.A, this.g | 0, this, function() {
        return Hb(this.ra, 1)
    }, function() {
        return Hb(this.ra, 2)
    }, function() {
        return Hb(this.ra, 4)
    });
    M(a.A, this.g | 1, this, function() {
        return this.ra.error &
            255
    });
    M(a.A, this.g | 2, this, function() {
        return this.ra.ga & 255
    });
    M(a.A, this.g | 3, this, function() {
        return this.ra.xa & 255
    });
    M(a.A, this.g | 4, this, function() {
        return this.ra.ka & 255
    });
    M(a.A, this.g | 5, this, function() {
        return this.ra.na & 255
    });
    M(a.A, this.g | 6, this, function() {
        return this.ra.yc & 255
    });
    N(a.A, this.g | 0, this, function(f) {
        Ib(this.ra, f, 1)
    }, function(f) {
        Ib(this.ra, f, 2)
    }, function(f) {
        Ib(this.ra, f, 4)
    });
    N(a.A, this.g | 1, this, function(f) {
        this.wa.hd = (this.wa.hd << 8 | f) & 65535;
        this.Da.hd = (this.Da.hd << 8 | f) & 65535
    });
    N(a.A, this.g |
        2, this,
        function(f) {
            this.wa.ga = (this.wa.ga << 8 | f) & 65535;
            this.Da.ga = (this.Da.ga << 8 | f) & 65535
        });
    N(a.A, this.g | 3, this, function(f) {
        this.wa.xa = (this.wa.xa << 8 | f) & 65535;
        this.Da.xa = (this.Da.xa << 8 | f) & 65535
    });
    N(a.A, this.g | 4, this, function(f) {
        this.wa.ka = (this.wa.ka << 8 | f) & 65535;
        this.Da.ka = (this.Da.ka << 8 | f) & 65535
    });
    N(a.A, this.g | 5, this, function(f) {
        this.wa.na = (this.wa.na << 8 | f) & 65535;
        this.Da.na = (this.Da.na << 8 | f) & 65535
    });
    N(a.A, this.g | 6, this, function(f) {
        this.ra = f & 16 ? this.Da : this.wa;
        this.wa.yc = f;
        this.Da.yc = f;
        this.wa.Ld =
            this.Da.Ld = f >> 6 & 1;
        this.wa.head = this.Da.head = f & 15
    });
    this.j = this.pa = this.sd = 0;
    N(a.A, this.g | 7, this, function(f) {
        R(this.s, this.ea);
        var h = this.ra;
        if (h.buffer) switch (h.u = f, h.error = 0, f) {
            case 8:
                h.i = 0;
                h.g = 0;
                h.h = 0;
                Jb(h);
                h.T();
                break;
            case 16:
                h.status = 80;
                h.ka = 0;
                h.T();
                break;
            case 248:
                h.status = 80;
                var k = h.j - 1;
                h.xa = k & 255;
                h.ka = k >> 8 & 255;
                h.na = k >> 16 & 255;
                h.yc = h.yc & 240 | k >> 24 & 15;
                h.T();
                break;
            case 39:
                h.status = 80;
                k = h.j - 1;
                h.xa = k & 255;
                h.ka = k >> 8 & 255;
                h.na = k >> 16 & 255;
                h.xa |= k >> 24 << 8 & 65280;
                h.T();
                break;
            case 32:
            case 36:
            case 41:
            case 196:
                Kb(h,
                    f);
                break;
            case 48:
            case 52:
            case 57:
            case 197:
                var l = 52 === f || 57 === f;
                k = Lb(h, l);
                l = Mb(h, l);
                f = 48 === f || 52 === f;
                k *= h.l;
                l *= h.l;
                l + k > h.buffer.byteLength ? (h.status = 255, h.T()) : (h.status = 88, Nb(h, k), h.g = f ? 512 : Math.min(k, 512 * h.N), h.W = l);
                break;
            case 144:
                h.T();
                h.error = 257;
                h.status = 80;
                break;
            case 145:
                h.status = 80;
                h.T();
                break;
            case 160:
                h.L && (h.status = 88, Ob(h, 12), h.g = 12, h.ga = 1, h.T());
                break;
            case 161:
                h.L ? (Pb(h), h.status = 88, h.ka = 20, h.na = 235) : h.status = 65;
                h.T();
                break;
            case 198:
                h.N = h.ga & 255;
                h.status = 80;
                h.T();
                break;
            case 37:
            case 200:
                k =
                    37 === f;
                l = Lb(h, k);
                Mb(h, k) * h.l + l * h.l > h.buffer.byteLength ? (h.status = 255, h.T()) : (h.status = 88, h.la.pa |= 1);
                break;
            case 53:
            case 202:
                k = 53 === f;
                l = Lb(h, k);
                Mb(h, k) * h.l + l * h.l > h.buffer.byteLength ? (h.status = 255, h.T()) : (h.status = 88, h.la.pa |= 1);
                break;
            case 64:
                h.status = 80;
                h.T();
                break;
            case 218:
                h.status = 65;
                h.error = 4;
                h.T();
                break;
            case 224:
                h.status = 80;
                h.T();
                break;
            case 225:
                h.status = 80;
                h.T();
                break;
            case 231:
                h.status = 80;
                h.T();
                break;
            case 236:
                if (h.L) {
                    h.status = 65;
                    h.error = 4;
                    h.T();
                    break
                }
                Pb(h);
                h.status = 88;
                h.T();
                break;
            case 234:
                h.status =
                    80;
                h.T();
                break;
            case 239:
                h.status = 80;
                h.T();
                break;
            case 222:
                h.status = 80;
                h.T();
                break;
            case 245:
                h.status = 80;
                h.T();
                break;
            case 249:
                h.status = 65;
                h.error = 4;
                break;
            default:
                h.status = 65, h.error = 4
        } else h.error = 4, h.status = 65, h.T()
    });
    M(a.A, this.h | 4, this, void 0, void 0, this.Th);
    N(a.A, this.h | 4, this, void 0, void 0, this.Xh);
    M(a.A, this.h, this, this.Vh, void 0, this.Uh);
    N(a.A, this.h, this, this.cg, void 0, this.Yh);
    M(a.A, this.h | 2, this, this.Wh);
    N(a.A, this.h | 2, this, this.dg);
    M(a.A, this.h | 8, this, function() {
        return 0
    });
    M(a.A, this.h | 10,
        this,
        function() {
            return 0
        });
    Qb(a.B.Ja, this)
}
p = Eb.prototype;
p.Rg = function() {
    return this.ra.buffer ? this.ra.status : 0
};
p.pk = function(a) {
    a & 4 && (R(this.s, this.ea), Jb(this.wa), Jb(this.Da));
    this.l = a
};
p.Th = function() {
    return this.sd
};
p.Xh = function(a) {
    this.sd = a
};
p.Wh = function() {
    return this.pa
};
p.dg = function(a) {
    this.pa &= ~(a & 6)
};
p.Uh = function() {
    return this.j | this.pa << 16
};
p.Vh = function() {
    return this.j
};
p.Yh = function(a) {
    this.cg(a & 255);
    this.dg(a >> 16 & 255)
};
p.cg = function(a) {
    let b = this.j;
    this.j = a & 9;
    if ((b & 1) !== (a & 1))
        if (0 === (a & 1)) this.pa &= -2;
        else switch (this.pa |= 1, this.ra.u) {
            case 37:
            case 200:
                Rb(this.ra);
                break;
            case 202:
            case 53:
                Sb(this.ra);
                break;
            case 160:
                Tb(this.ra)
        }
};
p.T = function() {
    0 === (this.l & 2) && (this.pa |= 4, this.s.Ga(this.ea))
};
p.aa = function() {
    var a = [];
    a[0] = this.wa;
    a[1] = this.Da;
    a[2] = this.g;
    a[3] = this.ea;
    a[4] = this.Ka;
    a[5] = this.i;
    a[6] = this.h;
    a[7] = this.name;
    a[8] = this.l;
    a[9] = this.sd;
    a[10] = this.pa;
    a[11] = this.ra === this.wa;
    a[12] = this.j;
    return a
};
p.I = function(a) {
    this.wa.I(a[0]);
    this.Da.I(a[1]);
    this.g = a[2];
    this.ea = a[3];
    this.Ka = a[4];
    this.i = a[5];
    this.h = a[6];
    this.name = a[7];
    this.l = a[8];
    this.sd = a[9];
    this.pa = a[10];
    this.ra = a[11] ? this.wa : this.Da;
    this.j = a[12]
};

function Fb(a, b, c, e, d, g) {
    this.la = a;
    this.v = g;
    this.Y = d;
    this.s = b;
    this.buffer = c;
    this.l = e ? 2048 : 512;
    this.L = e;
    this.D = this.o = this.C = this.j = 0;
    this.buffer && (this.j = this.buffer.byteLength / this.l, this.j !== (this.j | 0) && (this.j = Math.ceil(this.j)), e ? (this.C = 1, this.o = 0) : (this.C = 16, this.o = 63), this.D = this.j / this.C / this.o, this.D !== (this.D | 0) && (this.D = Math.floor(this.D)), a = b.B.Rc, a.V[57] |= 1 << 4 * this.Y, a.V[18] = a.V[18] & 15 | 240, a.V[27] = this.D & 255, a.V[28] = this.D >> 8 & 255, a.V[29] = this.C & 255, a.V[30] = 255, a.V[31] = 255, a.V[32] = 200,
        a.V[33] = this.D & 255, a.V[34] = this.D >> 8 & 255, a.V[35] = this.o & 255);
    this.F = {
        Tg: 0,
        Ug: 0,
        Xf: 0,
        Yf: 0,
        pg: !1
    };
    this.buffer = c;
    this.yc = this.head = this.na = this.ka = this.hd = this.xa = this.ga = this.Ld = 0;
    this.status = 80;
    this.N = 128;
    this.i = this.error = 0;
    this.data = new Uint8Array(65536);
    this.U = new Uint16Array(this.data.buffer);
    this.O = new Int32Array(this.data.buffer);
    this.g = this.h = 0;
    this.R = this.u = -1;
    this.ma = this.W = 0;
    this.P = new Set;
    this.ca = new Set;
    Object.seal(this)
}

function Jb(a) {
    a.L ? (a.status = 0, a.ga = 1, a.error = 1, a.xa = 1, a.ka = 20, a.na = 235) : (a.status = 81, a.ga = 1, a.error = 1, a.xa = 1, a.ka = 0, a.na = 0);
    for (const b of a.P) a.ca.add(b);
    a.P.clear()
}
p = Fb.prototype;
p.T = function() {
    this.la.T()
};
p.he = function() {
    this.status = 80;
    var a = this.data.subarray(0, this.h);
    Ub(this, this.u, this.h / 512);
    this.T();
    this.buffer.set(this.W, a, function() {});
    Vb(this, this.h)
};

function Wb(a, b) {
    var c = (b[7] << 8 | b[8]) * a.l;
    b = (b[2] << 24 | b[3] << 16 | b[4] << 8 | b[5]) * a.l;
    a.h = 0;
    var e = a.na << 8 & 65280 | a.ka & 255;
    a.ka = a.na = 0;
    65535 === e && e--;
    e > c && (e = c);
    b >= a.buffer.byteLength ? (a.status = 255, a.T()) : 0 === c ? (a.status = 80, a.i = 0) : (c = Math.min(c, a.buffer.byteLength - b), a.status = 208, Xb(a), a.ha(b, c, d => {
        Yb(a, d);
        a.status = 88;
        a.ga = a.ga & -8 | 2;
        a.T();
        e &= -4;
        a.g = e;
        a.g > a.h && (a.g = a.h);
        a.ka = a.g & 255;
        a.na = a.g >> 8 & 255;
        Zb(a, c)
    }))
}

function $b(a, b) {
    var c = (b[7] << 8 | b[8]) * a.l;
    b = (b[2] << 24 | b[3] << 16 | b[4] << 8 | b[5]) * a.l;
    b >= a.buffer.byteLength ? (a.status = 255, a.T()) : (a.status = 208, Xb(a), a.ha(b, c, e => {
        Zb(a, c);
        a.status = 88;
        a.ga = a.ga & -8 | 2;
        Yb(a, e);
        Tb(a)
    }))
}

function Tb(a) {
    if (0 !== (a.la.pa & 1) && 0 !== (a.status & 8)) {
        var b = a.la.sd,
            c = 0,
            e = a.data;
        do {
            var d = a.s.g(b),
                g = a.s.Oa(b + 4),
                f = a.s.ud(b + 7) & 128;
            g || (g = 65536);
            la(a.s, e.subarray(c, Math.min(c + g, a.h)), d);
            c += g;
            b += 8;
            if (c >= a.h && !f) break
        } while (!f);
        a.status = 80;
        a.la.pa &= -2;
        a.ga = a.ga & -8 | 3;
        a.T()
    }
}

function Hb(a, b) {
    if (a.i < a.g) {
        var c = 1 === b ? a.data[a.i] : 2 === b ? a.U[a.i >>> 1] : a.O[a.i >>> 2];
        a.i += b;
        a.i >= a.g && (160 === a.u ? a.g === a.h ? (a.status = 80, a.ga = a.ga & -8 | 3, a.T()) : (a.status = 88, a.ga = a.ga & -8 | 2, a.T(), b = a.na << 8 & 65280 | a.ka & 255, a.g + b > a.h ? (a.ka = a.h - a.g & 255, a.na = a.h - a.g >> 8 & 255, a.g = a.h) : a.g += b) : (a.error = 0, a.i >= a.h ? a.status = 80 : (b = 196 === a.u || 41 === a.u ? Math.min(a.N, (a.h - a.g) / 512) : 1, Ub(a, a.u, b), a.g += 512 * b, a.status = 88, a.T())));
        return c
    }
    a.i += b;
    return 0
}

function Ib(a, b, c) {
    if (!(a.i >= a.g) && (1 === c ? a.data[a.i++] = b : 2 === c ? (a.U[a.i >>> 1] = b, a.i += 2) : (a.O[a.i >>> 2] = b, a.i += 4), a.i === a.g))
        if (160 === a.u) {
            a.i = 0;
            a.R = a.data[0];
            switch (a.R) {
                case 0:
                    Ob(a, 0);
                    a.g = a.h;
                    a.status = 80;
                    break;
                case 3:
                    Ob(a, a.data[4]);
                    a.g = a.h;
                    a.status = 88;
                    a.data[0] = 240;
                    a.data[2] = 5;
                    a.data[7] = 8;
                    break;
                case 18:
                    b = a.data[4];
                    a.status = 88;
                    a.data.set([5, 128, 1, 49, 31, 0, 0, 0, 83, 79, 78, 89, 32, 32, 32, 32, 67, 68, 45, 82, 79, 77, 32, 67, 68, 85, 45, 49, 48, 48, 48, 32, 49, 46, 49, 97]);
                    a.g = a.h = Math.min(36, b);
                    break;
                case 26:
                    Ob(a, a.data[4]);
                    a.g =
                        a.h;
                    a.status = 88;
                    break;
                case 30:
                    Ob(a, 0);
                    a.g = a.h;
                    a.status = 80;
                    break;
                case 37:
                    b = a.j - 1;
                    Yb(a, new Uint8Array([b >> 24 & 255, b >> 16 & 255, b >> 8 & 255, b & 255, 0, 0, a.l >> 8 & 255, a.l & 255]));
                    a.g = a.h;
                    a.status = 88;
                    break;
                case 40:
                    a.hd & 1 ? $b(a, a.data) : Wb(a, a.data);
                    break;
                case 66:
                    b = a.data[8];
                    Ob(a, Math.min(8, b));
                    a.g = a.h;
                    a.status = 88;
                    break;
                case 67:
                    b = a.data[8] | a.data[7] << 8;
                    c = a.data[9] >> 6;
                    Ob(a, b);
                    a.g = a.h;
                    0 === c ? (b = a.j, a.data.set(new Uint8Array([0, 18, 1, 1, 0, 20, 1, 0, 0, 0, 0, 0, 0, 22, 170, 0, b >> 24, b >> 16 & 255, b >> 8 & 255, b & 255]))) : 1 === c && a.data.set(new Uint8Array([0,
                        10, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0
                    ]));
                    a.status = 88;
                    break;
                case 70:
                    b = a.data[8] | a.data[7] << 8;
                    b = Math.min(b, 32);
                    Ob(a, b);
                    a.g = a.h;
                    a.data[0] = b - 4 >> 24 & 255;
                    a.data[1] = b - 4 >> 16 & 255;
                    a.data[2] = b - 4 >> 8 & 255;
                    a.data[3] = b - 4 & 255;
                    a.data[6] = 8;
                    a.data[10] = 3;
                    a.status = 88;
                    break;
                case 81:
                    Ob(a, 0);
                    a.g = a.h;
                    a.status = 80;
                    break;
                case 82:
                    a.status = 81;
                    a.h = 0;
                    a.error = 80;
                    break;
                case 90:
                    b = a.data[8] | a.data[7] << 8;
                    42 === a.data[2] && Ob(a, Math.min(30, b));
                    a.g = a.h;
                    a.status = 88;
                    break;
                case 189:
                    Ob(a, a.data[9] | a.data[8] << 8);
                    a.g = a.h;
                    a.data[5] = 1;
                    a.status = 88;
                    break;
                case 74:
                    a.status =
                        81;
                    a.h = 0;
                    a.error = 80;
                    break;
                case 190:
                    Ob(a, 0);
                    a.g = a.h;
                    a.status = 80;
                    break;
                default:
                    a.status = 81, a.h = 0, a.error = 80
            }
            a.ga = a.ga & -8 | 2;
            0 === (a.status & 128) && a.T();
            0 === (a.status & 128) && 0 === a.h && (a.ga |= 1, a.status &= -9)
        } else a.i >= a.h ? a.he() : (a.status = 88, a.g += 512, a.T())
}

function Ub(a, b, c) {
    a.ga -= c;
    36 === b || 41 === b || 52 === b || 57 === b || 37 === b || 53 === b ? (b = c + ac(a), a.xa = b & 255 | b >> 16 & 65280, a.ka = b >> 8 & 255, a.na = b >> 16 & 255) : a.Ld ? (b = c + bc(a), a.xa = b & 255, a.ka = b >> 8 & 255, a.na = b >> 16 & 255, a.head = a.head & -16 | b & 15) : (b = c + cc(a), c = b / (a.C * a.o) | 0, a.ka = c & 255, a.na = c >> 8 & 255, a.head = (b / a.o | 0) % a.C & 15, a.xa = b % a.o + 1 & 255, cc(a))
}

function Kb(a, b) {
    var c = 36 === b || 41 === b,
        e = Lb(a, c);
    c = Mb(a, c);
    var d = 32 === b || 36 === b,
        g = e * a.l;
    c *= a.l;
    c + g > a.buffer.byteLength ? (a.status = 255, a.T()) : (a.status = 192, Xb(a), a.ha(c, g, f => {
        Yb(a, f);
        a.status = 88;
        a.g = d ? 512 : Math.min(g, 512 * a.N);
        Ub(a, b, d ? 1 : Math.min(e, a.o));
        a.T();
        Zb(a, g)
    }))
}

function Rb(a) {
    var b = 37 === a.u,
        c = Lb(a, b);
    b = Mb(a, b);
    var e = c * a.l;
    b *= a.l;
    Xb(a);
    a.ha(b, e, d => {
        var g = a.la.sd,
            f = 0;
        do {
            var h = a.s.g(g),
                k = a.s.Oa(g + 4),
                l = a.s.ud(g + 7) & 128;
            k || (k = 65536);
            la(a.s, d.subarray(f, f + k), h);
            f += k;
            g += 8
        } while (!l);
        Ub(a, a.u, c);
        a.status = 80;
        a.la.pa &= -2;
        a.u = -1;
        a.T();
        Zb(a, e)
    })
}

function Sb(a) {
    var b = 53 === a.u,
        c = Lb(a, b),
        e = Mb(a, b);
    b = c * a.l;
    e *= a.l;
    var d = a.la.sd,
        g = 0;
    const f = new Uint8Array(b);
    do {
        var h = a.s.g(d),
            k = a.s.Oa(d + 4),
            l = a.s.ud(d + 7) & 128;
        k || (k = 65536);
        f.set(a.s.Na.subarray(h, h + k), g);
        g += k;
        d += 8
    } while (!l);
    a.buffer.set(e, f, () => {
        Ub(a, a.u, c);
        a.status = 80;
        a.T();
        a.la.pa &= -2;
        a.u = -1
    });
    Vb(a, b)
}

function cc(a) {
    return ((a.ka & 255 | a.na << 8 & 65280) * a.C + a.head) * a.o + (a.xa & 255) - 1
}

function bc(a) {
    return a.xa & 255 | a.ka << 8 & 65280 | a.na << 16 & 16711680 | (a.head & 15) << 24
}

function ac(a) {
    return (a.xa & 255 | a.ka << 8 & 65280 | a.na << 16 & 16711680 | a.xa >> 8 << 24 & 4278190080) >>> 0
}

function Mb(a, b) {
    return b ? ac(a) : a.Ld ? bc(a) : cc(a)
}

function Lb(a, b) {
    b ? (a = a.ga, 0 === a && (a = 65536)) : (a = a.ga & 255, 0 === a && (a = 256));
    return a
}

function Pb(a) {
    if (a.yc & 16) Ob(a, 0);
    else {
        for (var b = 0; 512 > b; b++) a.data[b] = 0;
        b = Math.min(16383, a.D);
        Yb(a, [64, a.L ? 133 : 0, b, b >> 8, 0, 0, a.C, a.C >> 8, a.o / 512, a.o / 512 >> 8, 0, 2, a.o, a.o >> 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 2, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 56, 118, 32, 54, 68, 72, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 128, 0, 1, 0, 0, 2, 0, 0, 0, 2, 0, 2, 7, 0, b, b >> 8, a.C, a.C >> 8, a.o, 0, a.j & 255, a.j >> 8 & 255, a.j >> 16 & 255, a.j >> 24 & 255, 0, 0, a.j & 255, a.j >> 8 & 255, a.j >> 16 & 255,
            a.j >> 24 & 255, 0, 0, 160 === a.u ? 0 : 7, 160 === a.u ? 0 : 4, 0, 0, 30, 0, 30, 0, 30, 0, 30, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 126, 0, 0, 0, 0, 0, 0, 116, 0, 64, 0, 64, 0, 116, 0, 64, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 96, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, a.j & 255, a.j >> 8 & 255, a.j >> 16 & 255, a.j >> 24 & 255
        ]);
        a.h = 512;
        a.g = 512
    }
}

function Ob(a, b) {
    Nb(a, b);
    for (var c = 0; c < b + 3 >> 2; c++) a.O[c] = 0
}

function Nb(a, b) {
    a.data.length < b && (a.data = new Uint8Array(b + 3 & -4), a.U = new Uint16Array(a.data.buffer), a.O = new Int32Array(a.data.buffer));
    a.h = b;
    a.i = 0
}

function Yb(a, b) {
    Nb(a, b.length);
    a.data.set(b)
}

function Xb(a) {
    a.F.pg = !0;
    a.v.send("ide-read-start")
}

function Zb(a, b) {
    a.F.pg = !1;
    var c = b / a.l | 0;
    a.F.Tg += c;
    a.F.Xf += b;
    a.v.send("ide-read-end", [a.Y, b, c])
}

function Vb(a, b) {
    var c = b / a.l | 0;
    a.F.Ug += c;
    a.F.Yf += b;
    a.v.send("ide-write-end", [a.Y, b, c])
}
p.ha = function(a, b, c) {
    const e = this.ma++;
    this.P.add(e);
    this.buffer.get(a, b, d => {
        this.ca.delete(e) ? this.P.has(e) : (this.P.delete(e), c(d))
    })
};
p.aa = function() {
    var a = [];
    a[0] = this.ga;
    a[1] = this.D;
    a[2] = this.na;
    a[3] = this.ka;
    a[4] = this.i;
    a[5] = 0;
    a[6] = 0;
    a[7] = 0;
    a[8] = 0;
    a[9] = this.yc;
    a[10] = this.error;
    a[11] = this.head;
    a[12] = this.C;
    a[13] = this.L;
    a[14] = this.Ld;
    a[15] = this.hd;
    a[16] = this.data;
    a[17] = this.h;
    a[18] = this.xa;
    a[19] = this.j;
    a[20] = this.l;
    a[21] = this.N;
    a[22] = this.o;
    a[23] = this.status;
    a[24] = this.W;
    a[25] = this.u;
    a[26] = this.g;
    a[27] = this.R;
    a[28] = this.buffer;
    return a
};
p.I = function(a) {
    this.ga = a[0];
    this.D = a[1];
    this.na = a[2];
    this.ka = a[3];
    this.i = a[4];
    this.yc = a[9];
    this.error = a[10];
    this.head = a[11];
    this.C = a[12];
    this.L = a[13];
    this.Ld = a[14];
    this.hd = a[15];
    this.data = a[16];
    this.h = a[17];
    this.xa = a[18];
    this.j = a[19];
    this.l = a[20];
    this.N = a[21];
    this.o = a[22];
    this.status = a[23];
    this.W = a[24];
    this.u = a[25];
    this.g = a[26];
    this.R = a[27];
    this.U = new Uint16Array(this.data.buffer);
    this.O = new Int32Array(this.data.buffer);
    this.buffer && this.buffer.I(a[28])
};

function dc(a) {
    this.tb = new Uint8Array(4);
    this.g = new Uint8Array(4);
    this.nd = new Uint8Array(4);
    this.od = new Uint8Array(4);
    this.md = new Int32Array(this.tb.buffer);
    new Int32Array(this.g.buffer);
    this.xg = new Int32Array(this.nd.buffer);
    this.zg = new Int32Array(this.od.buffer);
    this.zb = [];
    this.B = [];
    this.s = a;
    for (var b = 0; 256 > b; b++) this.zb[b] = void 0, this.B[b] = void 0;
    this.A = a.A;
    N(a.A, 3324, this, function(c) {
        ec(this, this.md[0], c)
    }, function(c) {
        gc(this, this.md[0], c)
    }, function(c) {
        var e = this.md[0],
            d = e >> 8 & 65535,
            g = e & 255;
        e =
            this.zb[d];
        d = this.B[d];
        if (e)
            if (16 <= g && 40 > g)
                if (d = d.jb[g - 16 >> 2]) {
                    g >>= 2;
                    var f = e[g] & 1; - 1 === (c | 3 | d.size - 1) ? (c = ~(d.size - 1) | f, 0 === f && (e[g] = c)) : 0 === f && (e[g] = d.ug);
                    1 === f && (hc(this, d, e[g] & 65534, c & 65534), e[g] = c | 1)
                } else e[g >> 2] = 0;
        else 48 === g ? e[g >> 2] = d.yg ? -1 === (c | 2047) ? -d.yg | 0 : d.Bi | 0 : 0 : 4 !== g && (e[g >>> 2] = c)
    });
    N(a.A, 3325, this, function(c) {
        ec(this, this.md[0] + 1 | 0, c)
    });
    N(a.A, 3326, this, function(c) {
        ec(this, this.md[0] + 2 | 0, c)
    }, function(c) {
        gc(this, this.md[0] + 2 | 0, c)
    });
    N(a.A, 3327, this, function(c) {
        ec(this, this.md[0] + 3 | 0, c)
    });
    a.A.vd(3324, this, function() {
        return this.nd[0]
    }, function() {
        return this.nd[1]
    }, function() {
        return this.nd[2]
    }, function() {
        return this.nd[3]
    });
    a.A.vd(3320, this, function() {
        return this.od[0]
    }, function() {
        return this.od[1]
    }, function() {
        return this.od[2]
    }, function() {
        return this.od[3]
    });
    a.A.Ob(3320, this, function(c) {
        this.tb[0] = c & 252
    }, function(c) {
        2 === (this.tb[1] & 6) && 6 === (c & 6) ? ic(a) : this.tb[1] = c
    }, function(c) {
        this.tb[2] = c
    }, function(c) {
        this.tb[3] = c;
        c = this.tb[0] & 252;
        var e = this.zb[this.tb[2] << 8 | this.tb[1]];
        void 0 !==
            e ? (this.zg[0] = -2147483648, this.xg[0] = c < e.byteLength ? e[c >> 2] : 0) : (this.xg[0] = -1, this.zg[0] = 0)
    });
    Qb(this, {
        Ka: 0,
        K: [134, 128, 55, 18, 0, 0, 0, 0, 2, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16, 0, 0, 0, 0, 0, 0],
        jb: [],
        name: "82441FX PMC"
    });
    this.i = {
        Ka: 8,
        K: [134, 128, 0, 112, 7, 0, 0, 2, 0, 0, 1, 6, 0, 0, 128, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        jb: [],
        name: "82371SB PIIX3 ISA"
    };
    this.j = Qb(this, this.i);
    this.h = new Uint8Array(this.j.buffer)
}
dc.prototype.aa = function() {
    for (var a = [], b = 0; 256 > b; b++) a[b] = this.zb[b];
    a[256] = this.tb;
    a[257] = this.g;
    a[258] = this.nd;
    a[259] = this.od;
    return a
};
dc.prototype.I = function(a) {
    for (var b = 0; 256 > b; b++) {
        var c = this.B[b],
            e = a[b];
        if (c && e) {
            for (var d = 0; d < c.jb.length; d++) {
                var g = e[4 + d];
                if (g & 1) {
                    var f = c.jb[d];
                    hc(this, f, f.ug & 65534, g & 65534)
                }
            }
            this.zb[b].set(e)
        }
    }
    this.tb.set(a[256]);
    this.g.set(a[257]);
    this.nd.set(a[258]);
    this.od.set(a[259])
};

function ec(a, b, c) {
    var e = b & 255;
    (new Uint8Array(a.zb[b >> 8 & 65535].buffer))[e] = c
}

function gc(a, b, c) {
    var e = b & 255;
    a = new Uint16Array(a.zb[b >> 8 & 65535].buffer);
    !a || 16 <= e && 44 > e || (a[e >>> 1] = c)
}

function Qb(a, b) {
    var c = b.Ka,
        e = new Int32Array(64);
    e.set(new Int32Array((new Uint8Array(b.K)).buffer));
    a.zb[c] = e;
    a.B[c] = b;
    c = e.slice(4, 10);
    for (var d = 0; d < b.jb.length; d++) {
        var g = b.jb[d];
        if (g) {
            var f = c[d],
                h = f & 1;
            g.ug = f;
            g.entries = [];
            if (0 !== h)
                for (f &= -2, h = 0; h < g.size; h++) g.entries[h] = a.A.ports[f + h]
        }
    }
    return e
}

function hc(a, b, c, e) {
    for (var d = b.size, g = a.A.ports, f = 0; f < d; f++) {
        4096 <= c + f && (g[c + f] = gb(a.A));
        var h = b.entries[f];
        4096 <= e + f && (g[e + f] = h)
    }
}
dc.prototype.Ca = function(a) {
    this.s.Ga(this.h[96 + ((this.zb[a][15] >> 8 & 255) - 1 + ((a >> 3) - 1 & 255) & 3)])
};

function jc(a, b) {
    R(a.s, a.h[96 + ((a.zb[b][15] >> 8 & 255) + (b >> 3 & 255) - 2 & 3)])
};

function kc(a, b) {
    this.A = a.A;
    this.s = a;
    this.eb = a.B.eb;
    this.h = 0;
    this.P = new Uint8Array(10);
    this.R = 0;
    this.i = null;
    this.g = new Uint8Array(10);
    this.O = this.D = this.Y = this.ca = this.F = this.u = this.l = this.j = 0;
    this.U = 1;
    this.L = this.C = 0;
    this.Cc = null;
    b ? this.Be(b) : (this.Oe(), this.s.B.Rc.V[16] = 64);
    M(this.A, 1008, this, this.Ej);
    M(this.A, 1010, this, this.Fj);
    M(this.A, 1012, this, this.Hj);
    M(this.A, 1013, this, this.Jj);
    M(this.A, 1015, this, this.Lj);
    N(this.A, 1010, this, this.Gj);
    N(this.A, 1012, this, this.Ij);
    N(this.A, 1013, this, this.Kj)
}
p = kc.prototype;
p.Oe = function() {
    this.Cc = null;
    this.W = this.N = this.o = 0;
    this.L = 128
};
p.Be = function(a) {
    var b = {
        [163840]: {
            type: 1,
            lb: 40,
            kb: 8,
            gb: 1
        },
        [184320]: {
            type: 1,
            lb: 40,
            kb: 9,
            gb: 1
        },
        [204800]: {
            type: 1,
            lb: 40,
            kb: 10,
            gb: 1
        },
        [327680]: {
            type: 1,
            lb: 40,
            kb: 8,
            gb: 2
        },
        [368640]: {
            type: 1,
            lb: 40,
            kb: 9,
            gb: 2
        },
        [409600]: {
            type: 1,
            lb: 40,
            kb: 10,
            gb: 2
        },
        [737280]: {
            type: 3,
            lb: 80,
            kb: 9,
            gb: 2
        },
        [1228800]: {
            type: 2,
            lb: 80,
            kb: 15,
            gb: 2
        },
        [1474560]: {
            type: 4,
            lb: 80,
            kb: 18,
            gb: 2
        },
        [1763328]: {
            type: 5,
            lb: 82,
            kb: 21,
            gb: 2
        },
        [2949120]: {
            type: 5,
            lb: 80,
            kb: 36,
            gb: 2
        },
        512: {
            type: 1,
            lb: 1,
            kb: 1,
            gb: 1
        }
    };
    let c = a.byteLength,
        e = b[c];
    e || (c = 1474560 < a.byteLength ? 2949120 : 1474560,
        e = b[c], b = new Uint8Array(c), b.set(new Uint8Array(a.buffer)), a = new pb(b.buffer));
    this.o = e.kb;
    this.N = e.gb;
    this.W = e.lb;
    this.Cc = a;
    this.L = 128;
    this.s.B.Rc.V[16] = e.type << 4
};
p.aa = function() {
    var a = [];
    a[0] = this.h;
    a[1] = this.P;
    a[2] = this.R;
    a[4] = this.g;
    a[5] = this.j;
    a[6] = this.l;
    a[8] = this.u;
    a[9] = this.F;
    a[10] = this.ca;
    a[11] = this.Y;
    a[12] = this.D;
    a[13] = this.O;
    a[14] = this.U;
    a[15] = this.C;
    a[16] = this.o;
    a[17] = this.N;
    a[18] = this.W;
    return a
};
p.I = function(a) {
    this.h = a[0];
    this.P = a[1];
    this.R = a[2];
    this.i = a[3];
    this.g = a[4];
    this.j = a[5];
    this.l = a[6];
    this.u = a[8];
    this.F = a[9];
    this.ca = a[10];
    this.Y = a[11];
    this.D = a[12];
    this.O = a[13];
    this.U = a[14];
    this.C = a[15];
    this.o = a[16];
    this.N = a[17];
    this.W = a[18]
};
p.Ej = function() {
    return 0
};
p.Hj = function() {
    var a = 128;
    this.j < this.l && (a |= 80);
    0 === (this.C & 8) && (a |= 32);
    return a
};
p.Lj = function() {
    return this.L
};
p.Jj = function() {
    return this.j < this.l ? (R(this.s, 6), this.g[this.j++]) : 255
};
p.Ij = function(a) {
    a & 128 && (this.u = 192, this.s.Ga(6))
};
p.Kj = function(a) {
    if (0 < this.h) this.P[this.R++] = a, this.h--, 0 === this.h && this.i.call(this, this.P);
    else {
        switch (a) {
            case 3:
                this.i = this.ei;
                this.h = 2;
                break;
            case 19:
                this.i = this.Mh;
                this.h = 3;
                break;
            case 4:
                this.i = this.Ih;
                this.h = 1;
                break;
            case 5:
            case 69:
            case 197:
                this.i = function(b) {
                    lc(this, !0, b)
                };
                this.h = 8;
                break;
            case 6:
            case 70:
            case 230:
                this.i = function(b) {
                    lc(this, !1, b)
                };
                this.h = 8;
                break;
            case 7:
                this.i = this.Hh;
                this.h = 1;
                break;
            case 8:
                this.j = 0;
                this.l = 2;
                this.g[0] = this.u;
                this.g[1] = this.D;
                break;
            case 74:
                this.i = this.Xj;
                this.h = 1;
                break;
            case 15:
                this.h = 2;
                this.i = this.Vf;
                break;
            case 14:
            case 16:
                this.u = 128, this.g[0] = this.u, this.j = 0, this.l = 1, this.h = 0
        }
        this.R = 0
    }
};
p.Fj = function() {
    return this.C
};
p.Gj = function(a) {
    4 === (a & 4) && 0 === (this.C & 4) && (this.u = 192, this.s.Ga(6));
    this.C = a
};
p.Ih = function() {
    this.F = this.Cc ? 0 : 5;
    this.j = 0;
    this.l = 1;
    this.g[0] = 0
};
p.Vf = function(a) {
    if (0 === (a[0] & 3)) {
        var b = a[1];
        a = a[0] >> 2 & 1;
        b !== this.D && (this.L = 0);
        this.F = this.Cc ? 0 : 5;
        this.u = 32;
        this.D = b;
        this.O = a
    }
    this.Ca()
};
p.Hh = function(a) {
    this.Vf([a[0], 0])
};

function lc(a, b, c) {
    var e = c[2],
        d = c[1],
        g = c[3],
        f = 128 << c[4],
        h = c[5] - c[3] + 1,
        k = ((e + a.N * d) * a.o + g - 1) * f;
    a.Cc ? (a.F = 0, b ? a.eb.he(a.Cc, k, h * f, 2, a.done.bind(a, c, d, e, g)) : mc(a.eb, a.Cc, k, a.done.bind(a, c, d, e, g))) : a.F = 5
}
p.done = function(a, b, c, e, d) {
    d || (e++, e > this.o && (e = 1, c++, c >= this.N && (c = 0, b++)), b !== this.D && (this.L = 0), this.u = 32, this.D = b, this.O = c, this.U = e, this.j = 0, this.l = 7, this.g[0] = c << 2 | 32, this.g[1] = 0, this.g[2] = 0, this.g[3] = b, this.g[4] = c, this.g[5] = e, this.g[6] = a[4], this.Ca())
};
p.ei = function() {};
p.Mh = function() {};
p.Xj = function() {
    this.j = 0;
    this.l = 7;
    this.g[0] = 0;
    this.g[1] = 0;
    this.g[2] = 0;
    this.g[3] = 0;
    this.g[4] = 0;
    this.g[5] = 0;
    this.g[6] = 0;
    this.Ca()
};
p.Ca = function() {
    this.C & 8 && this.s.Ga(6)
};

function la(a, b, c) {
    b.length && (a.Se(c), a.Se(c + b.length - 1), a.ri(c, c + b.length), a.Na.set(b, c))
};

function nc(a) {
    this.s = a;
    this.o = new Uint8Array(8);
    this.u = new Uint8Array(8);
    this.g = new Uint16Array(8);
    this.j = new Uint16Array(8);
    this.h = new Uint16Array(8);
    this.l = new Uint16Array(8);
    this.dc = new Uint8Array(8);
    this.C = new Uint8Array(8);
    this.kf = [];
    this.i = 0;
    a = a.A;
    N(a, 0, this, this.Mc.bind(this, 0));
    N(a, 2, this, this.Mc.bind(this, 1));
    N(a, 4, this, this.Mc.bind(this, 2));
    N(a, 6, this, this.Mc.bind(this, 3));
    N(a, 1, this, this.Oc.bind(this, 0));
    N(a, 3, this, this.Oc.bind(this, 1));
    N(a, 5, this, this.Oc.bind(this, 2));
    N(a, 7, this, this.Oc.bind(this,
        3));
    M(a, 0, this, this.Lc.bind(this, 0));
    M(a, 2, this, this.Lc.bind(this, 1));
    M(a, 4, this, this.Lc.bind(this, 2));
    M(a, 6, this, this.Lc.bind(this, 3));
    M(a, 1, this, this.Nc.bind(this, 0));
    M(a, 3, this, this.Nc.bind(this, 1));
    M(a, 5, this, this.Nc.bind(this, 2));
    M(a, 7, this, this.Nc.bind(this, 3));
    N(a, 192, this, this.Mc.bind(this, 4));
    N(a, 196, this, this.Mc.bind(this, 5));
    N(a, 200, this, this.Mc.bind(this, 6));
    N(a, 204, this, this.Mc.bind(this, 7));
    N(a, 194, this, this.Oc.bind(this, 4));
    N(a, 198, this, this.Oc.bind(this, 5));
    N(a, 202, this, this.Oc.bind(this,
        6));
    N(a, 206, this, this.Oc.bind(this, 7));
    M(a, 192, this, this.Lc.bind(this, 4));
    M(a, 196, this, this.Lc.bind(this, 5));
    M(a, 200, this, this.Lc.bind(this, 6));
    M(a, 204, this, this.Lc.bind(this, 7));
    M(a, 194, this, this.Nc.bind(this, 4));
    M(a, 198, this, this.Nc.bind(this, 5));
    M(a, 202, this, this.Nc.bind(this, 6));
    M(a, 206, this, this.Nc.bind(this, 7));
    N(a, 135, this, this.Qc.bind(this, 0));
    N(a, 131, this, this.Qc.bind(this, 1));
    N(a, 129, this, this.Qc.bind(this, 2));
    N(a, 130, this, this.Qc.bind(this, 3));
    N(a, 143, this, this.Qc.bind(this, 4));
    N(a, 139,
        this, this.Qc.bind(this, 5));
    N(a, 137, this, this.Qc.bind(this, 6));
    N(a, 138, this, this.Qc.bind(this, 7));
    M(a, 135, this, this.Pc.bind(this, 0));
    M(a, 131, this, this.Pc.bind(this, 1));
    M(a, 129, this, this.Pc.bind(this, 2));
    M(a, 130, this, this.Pc.bind(this, 3));
    M(a, 143, this, this.Pc.bind(this, 4));
    M(a, 139, this, this.Pc.bind(this, 5));
    M(a, 137, this, this.Pc.bind(this, 6));
    M(a, 138, this, this.Pc.bind(this, 7));
    N(a, 1159, this, this.rd.bind(this, 0));
    N(a, 1155, this, this.rd.bind(this, 1));
    N(a, 1153, this, this.rd.bind(this, 2));
    N(a, 1154, this, this.rd.bind(this,
        3));
    N(a, 1163, this, this.rd.bind(this, 5));
    N(a, 1161, this, this.rd.bind(this, 6));
    N(a, 1162, this, this.rd.bind(this, 7));
    M(a, 1159, this, this.qd.bind(this, 0));
    M(a, 1155, this, this.qd.bind(this, 1));
    M(a, 1153, this, this.qd.bind(this, 2));
    M(a, 1154, this, this.qd.bind(this, 3));
    M(a, 1163, this, this.qd.bind(this, 5));
    M(a, 1161, this, this.qd.bind(this, 6));
    M(a, 1162, this, this.qd.bind(this, 7));
    N(a, 10, this, this.Og.bind(this, 0));
    N(a, 212, this, this.Og.bind(this, 4));
    N(a, 15, this, this.Ng.bind(this, 0));
    N(a, 222, this, this.Ng.bind(this, 4));
    M(a, 15, this, this.Mg.bind(this, 0));
    M(a, 222, this, this.Mg.bind(this, 4));
    N(a, 11, this, this.Lg.bind(this, 0));
    N(a, 214, this, this.Lg.bind(this, 4));
    N(a, 12, this, this.Kg);
    N(a, 216, this, this.Kg)
}
p = nc.prototype;
p.aa = function() {
    return [this.o, this.u, this.g, this.j, this.h, this.l, this.dc, this.C, this.i]
};
p.I = function(a) {
    this.o = a[0];
    this.u = a[1];
    this.g = a[2];
    this.j = a[3];
    this.h = a[4];
    this.l = a[5];
    this.dc = a[6];
    this.C = a[7];
    this.i = a[8]
};
p.Oc = function(a, b) {
    this.h[a] = oc(this, this.h[a], b, !1);
    this.l[a] = oc(this, this.l[a], b, !0)
};
p.Nc = function(a) {
    return pc(this, this.h[a])
};
p.Mc = function(a, b) {
    this.g[a] = oc(this, this.g[a], b, !1);
    this.j[a] = oc(this, this.j[a], b, !0)
};
p.Lc = function(a) {
    return pc(this, this.g[a])
};
p.rd = function(a, b) {
    this.u[a] = b
};
p.qd = function(a) {
    return this.u[a]
};
p.Qc = function(a, b) {
    this.o[a] = b
};
p.Pc = function(a) {
    return this.o[a]
};
p.Og = function(a, b) {
    qc(this, (b & 3) + a, b & 4 ? 1 : 0)
};
p.Ng = function(a, b) {
    for (var c = 0; 4 > c; c++) qc(this, a + c, b & 1 << c)
};
p.Mg = function(a) {
    var b = 0 | this.dc[a + 0];
    b |= this.dc[a + 1] << 1;
    b |= this.dc[a + 2] << 2;
    return b |= this.dc[a + 3] << 3
};
p.Lg = function(a, b) {
    this.C[(b & 3) + a] = b
};
p.Kg = function() {
    this.i = 0
};

function qc(a, b, c) {
    if (a.dc[b] !== c && (a.dc[b] = c, !c))
        for (c = 0; c < a.kf.length; c++) a.kf[c].Qe.call(a.kf[c].Lf, b)
}

function mc(a, b, c, e) {
    var d = a.h[2] + 1,
        g = rc(a, 2);
    if (c + d > b.byteLength) e(!0);
    else {
        var f = a.s;
        a.g[2] += d;
        b.get(c, d, function(h) {
            la(f, h, g);
            e(!1)
        })
    }
}
p.he = function(a, b, c, e, d) {
    var g = this.h[e] + 1 & 65535,
        f = 5 <= e ? 2 : 1,
        h = g * f,
        k = rc(this, e),
        l = !1,
        n = !1,
        t = this.C[e] & 16;
    c < h ? (g = Math.floor(c / f), h = g * f, l = !0) : c > h && (n = !0);
    b + h > a.byteLength ? d(!0) : (this.g[e] += g, this.h[e] -= g, !l && t && (this.g[e] = this.j[e], this.h[e] = this.l[e]), a.set(b, this.s.Na.subarray(k, k + h), () => {
        n && t ? this.he(a, b + h, c - h, e, d) : d(!1)
    }))
};

function rc(a, b) {
    var c = a.g[b];
    5 <= b && (c <<= 1);
    c = c & 65535 | a.o[b] << 16;
    return c |= a.u[b] << 24
}

function oc(a, b, c, e) {
    e || (a.i ^= 1);
    return a.i ? b & -256 | c : b & -65281 | c << 8
}

function pc(a, b) {
    a.i ^= 1;
    return a.i ? b & 255 : b >> 8 & 255
};

function sc(a, b) {
    this.s = a;
    this.v = b;
    this.i = new Float64Array(3);
    this.j = new Uint16Array(3);
    this.g = new Uint8Array(4);
    this.h = new Uint8Array(4);
    this.Zc = new Uint8Array(4);
    this.u = new Uint8Array(4);
    this.l = new Uint8Array(4);
    this.o = new Uint16Array(3);
    this.pb = new Uint16Array(3);
    M(a.A, 97, this, function() {
        var c = nb(),
            e = 66.66666666666667 * c & 1;
        c = tc(this, 2, c);
        return e << 4 | c << 5
    });
    N(a.A, 97, this, function(c) {
        c & 1 ? this.v.send("pcspeaker-enable") : this.v.send("pcspeaker-disable")
    });
    M(a.A, 64, this, function() {
        return uc(this, 0)
    });
    M(a.A, 65, this, function() {
        return uc(this, 1)
    });
    M(a.A, 66, this, function() {
        return uc(this, 2)
    });
    N(a.A, 64, this, function(c) {
        vc(this, 0, c)
    });
    N(a.A, 65, this, function(c) {
        vc(this, 1, c)
    });
    N(a.A, 66, this, function(c) {
        vc(this, 2, c);
        this.v.send("pcspeaker-update", [this.Zc[2], this.pb[2]])
    });
    N(a.A, 67, this, this.C)
}
sc.prototype.aa = function() {
    var a = [];
    a[0] = this.g;
    a[1] = this.h;
    a[2] = this.Zc;
    a[3] = this.u;
    a[4] = this.l;
    a[5] = this.o;
    a[6] = this.pb;
    a[7] = this.i;
    a[8] = this.j;
    return a
};
sc.prototype.I = function(a) {
    this.g = a[0];
    this.h = a[1];
    this.Zc = a[2];
    this.u = a[3];
    this.l = a[4];
    this.o = a[5];
    this.pb = a[6];
    this.i = a[7];
    this.j = a[8]
};
sc.prototype.wb = function(a, b) {
    var c = 100;
    b || (this.h[0] && tc(this, 0, a) ? (this.j[0] = wc(this, 0, a), this.i[0] = a, R(this.s, 0), this.s.Ga(0), 0 === this.Zc[0] && (this.h[0] = 0)) : R(this.s, 0), this.h[0] && (c = (this.j[0] - Math.floor(1193.1816666 * (a - this.i[0]))) / 1193.1816666));
    return c
};

function wc(a, b, c) {
    if (!a.h[b]) return 0;
    c = a.j[b] - Math.floor(1193.1816666 * (c - a.i[b]));
    a = a.pb[b];
    c >= a ? c %= a : 0 > c && (c = c % a + a);
    return c
}

function tc(a, b, c) {
    c -= a.i[b];
    return 0 > c ? !0 : a.j[b] < Math.floor(1193.1816666 * c)
}

function uc(a, b) {
    var c = a.l[b];
    if (c) return a.l[b]--, 2 === c ? a.o[b] & 255 : a.o[b] >> 8;
    c = a.g[b];
    3 === a.Zc[b] && (a.g[b] ^= 1);
    a = wc(a, b, nb());
    return c ? a & 255 : a >> 8
}

function vc(a, b, c) {
    a.pb[b] = a.g[b] ? a.pb[b] & -256 | c : a.pb[b] & 255 | c << 8;
    3 === a.u[b] && a.g[b] || (a.pb[b] || (a.pb[b] = 65535), a.j[b] = a.pb[b], a.h[b] = !0, a.i[b] = nb());
    3 === a.u[b] && (a.g[b] ^= 1)
}
sc.prototype.C = function(a) {
    var b = a >> 1 & 7,
        c = a >> 6 & 3;
    a = a >> 4 & 3;
    3 !== c && (0 === a ? (this.l[c] = 2, b = wc(this, c, nb()), this.o[c] = b ? b - 1 : 0) : (6 <= b && (b &= -5), this.g[c] = 1 === a ? 0 : 1, 0 === c && R(this.s, 0), this.Zc[c] = b, this.u[c] = a, 2 === c && this.v.send("pcspeaker-update", [this.Zc[2], this.pb[2]])))
};
var xc = Uint32Array.from([655360, 655360, 720896, 753664]),
    yc = Uint32Array.from([131072, 65536, 32768, 32768]);

function zc(a, b, c) {
    this.s = a;
    this.v = b;
    this.ba = c;
    this.C = 0;
    this.zc = 14;
    this.xc = 15;
    this.L = 80;
    this.Yb = 25;
    this.Fe = this.Ea = this.Td = this.sc = 0;
    this.Md = [];
    this.Ic = this.za = 0;
    this.nb = new Uint8Array(25);
    this.u = this.N = this.Hc = this.O = this.g = this.i = this.Vb = this.Wb = this.Fa = 0;
    this.Bc = !0;
    this.Ba = !1;
    setTimeout(() => {
        b.send("screen-set-mode", this.Ba)
    }, 0);
    this.bb = new Int32Array(256);
    this.h = 0;
    this.se = 45253;
    this.ab = this.Pa = 0;
    this.La = !1;
    this.Pb = 32;
    this.Nd = this.Ud = this.Ra = 0;
    this.K = [52, 18, 17, 17, 3, 1, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 8, 14680064,
        57344, 224, 0, 0, 0, 0, 0, 0, 191, 254, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 244, 26, 0, 17, 0, 0, 190, 254, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ];
    this.Ka = 144;
    this.jb = [{
        size: c
    }];
    this.yg = 65536;
    this.Bi = 4272947200;
    this.name = "vga";
    this.Xa = {
        ng: !1,
        Yj: 0,
        Zj: 0,
        Wf: 0
    };
    this.ca = this.Sb = this.Y = this.D = 0;
    this.U = 255;
    this.fc = new Uint8Array(16);
    this.l = -1;
    this.Zb = 32;
    this.Yc = this.Xb = this.Hd = this.Sa = 0;
    this.ac = -1;
    this.$b = 15;
    this.mb = this.cc = 0;
    this.Ub = -1;
    this.Qa = this.qc = this.Fc = 0;
    this.Dc = 255;
    this.W = this.R = this.P = this.ma = this.Ec = this.Rb = 0;
    this.j = this.gd = 255;
    c = a.A;
    N(c, 960, this, this.ij);
    M(c, 960, this, this.Gg, this.hj);
    M(c, 961, this, this.Hg);
    N(c, 962, this, this.jj);
    c.Ob(964, this, this.lj, this.nj);
    M(c, 964, this, this.kj);
    M(c, 965, this, this.mj);
    c.Ob(974, this, this.yj, this.Aj);
    M(c, 974, this, this.xj);
    M(c, 975, this, this.zj);
    M(c, 966, this, this.oj);
    N(c, 966, this, this.pj);
    N(c, 967, this, this.rj);
    M(c, 967, this, this.qj);
    N(c, 968, this, this.tj);
    M(c, 968, this, this.sj);
    N(c, 969, this, this.vj);
    M(c, 969, this, this.uj);
    M(c, 972, this, this.wj);
    c.Ob(980, this, this.Cj, this.Dj);
    M(c, 980, this, this.Bj);
    M(c, 981, this, this.Ig, () => this.Ig());
    M(c, 970, this, function() {
        return 0
    });
    M(c, 986, this, this.Jg);
    M(c, 954, this, this.Jg);
    this.Tb = -1;
    this.F = 0;
    N(c, 462, this, void 0, this.Di);
    N(c, 463, this, void 0, this.Fi);
    M(c, 463, this, void 0, this.Ei);
    void 0 === this.ba || 262144 > this.ba ? this.ba = 262144 : 268435456 < this.ba ? this.ba = 268435456 : this.ba & 65535 && (this.ba |= 65535, this.ba++);
    const e = a.xh(this.ba) >>> 0;
    this.Kf = O(Uint8Array, a.ua, e, this.ba);
    this.de = this.ba;
    this.ce = 0;
    this.fe = this.ba;
    this.ee = 0;
    this.Gb = null;
    b.register("screen-fill-buffer",
        function() {
            if (this.Ba) {
                if (0 === this.Gb.data.byteLength) {
                    var g = new Uint8ClampedArray(this.s.ua.buffer, this.qf, 4 * this.Ea * this.Fe);
                    this.Gb = new ImageData(g, this.Ea, this.Fe);
                    Ac(this)
                }
                if (this.La) {
                    g = 0;
                    var f = this.ab;
                    if (8 === this.Pb)
                        for (var h = new Int32Array(this.s.ua.buffer, this.qf, this.sc * this.Td), k = new Uint8Array(this.s.ua.buffer, this.Kf.byteOffset, this.ba), l = 0; l < h.length; l++) {
                            var n = this.bb[k[l]];
                            h[l] = n & 65280 | n << 16 | n >> 16 | 4278190080
                        } else this.s.Ah(this.Pb, this.Ud), l = 15 === this.Pb ? 2 : this.Pb / 8, g = ((this.s.zh[0] /
                            l | 0) - this.Ud) / this.Pa | 0, f = (((this.s.yh[0] / l | 0) - this.Ud) / this.Pa | 0) + 1;
                    g < f && (g = Math.max(g, 0), f = Math.min(f, this.ab), this.v.send("screen-fill-buffer-end", [{
                        Gb: this.Gb,
                        Gf: 0,
                        Hf: g,
                        Je: 0,
                        Ke: g,
                        pf: this.Pa,
                        nf: f - g
                    }]))
                } else {
                    g = Math.min(this.ee | 15, 524287);
                    l = Bc(this);
                    n = ~this.Fa & 3;
                    f = this.qc & 96;
                    h = this.Sa & 64;
                    for (k = this.fe & -16; k <= g;) {
                        var t = k >>> l;
                        if (n) {
                            var r = k / this.Ea | 0,
                                m = k - this.Ea * r;
                            switch (n) {
                                case 1:
                                    t = (r & 1) << 13;
                                    r >>>= 1;
                                    break;
                                case 2:
                                    t = (r & 1) << 14;
                                    r >>>= 1;
                                    break;
                                case 3:
                                    t = (r & 3) << 13, r >>>= 2
                            }
                            t |= (r * this.Ea + m >>> l) + this.za
                        }
                        r = this.af[t];
                        m = this.bf[t];
                        var w = this.cf[t],
                            y = this.df[t];
                        t = new Uint8Array(8);
                        switch (f) {
                            case 0:
                                r <<= 0;
                                m <<= 1;
                                w <<= 2;
                                y <<= 3;
                                for (var q = 7; 0 <= q; q--) t[7 - q] = r >> q & 1 | m >> q & 2 | w >> q & 4 | y >> q & 8;
                                break;
                            case 32:
                                t[0] = r >> 6 & 3 | w >> 4 & 12;
                                t[1] = r >> 4 & 3 | w >> 2 & 12;
                                t[2] = r >> 2 & 3 | w >> 0 & 12;
                                t[3] = r >> 0 & 3 | w << 2 & 12;
                                t[4] = m >> 6 & 3 | y >> 4 & 12;
                                t[5] = m >> 4 & 3 | y >> 2 & 12;
                                t[6] = m >> 2 & 3 | y >> 0 & 12;
                                t[7] = m >> 0 & 3 | y << 2 & 12;
                                break;
                            case 64:
                            case 96:
                                t[0] = r >> 4 & 15, t[1] = r >> 0 & 15, t[2] = m >> 4 & 15, t[3] = m >> 0 & 15, t[4] = w >> 4 & 15, t[5] = w >> 0 & 15, t[6] = y >> 4 & 15, t[7] = y >> 0 & 15
                        }
                        if (h)
                            for (r = q = 0; 4 > q; q++, k++, r += 2) this.Pd[k] =
                                t[r] << 4 | t[r + 1];
                        else
                            for (q = 0; 8 > q; q++, k++) this.Pd[k] = t[q]
                    }
                    h = this.de;
                    g = Math.min(this.ce, 524287);
                    f = new Int32Array(this.s.ua.buffer, this.qf, this.Ea * this.Fe);
                    l = 255;
                    n = 0;
                    this.Sa & 128 && (l &= 207, n |= this.Yc << 4 & 48);
                    if (this.Sa & 64)
                        for (; h <= g; h++) k = this.Pd[h] & l | n, k = this.bb[k], f[h] = k & 65280 | k << 16 | k >> 16 | 4278190080;
                    else
                        for (l &= 63, n |= this.Yc << 4 & 192; h <= g; h++) k = this.fc[this.Pd[h] & this.Hd] & l | n, k = this.bb[k], f[h] = k & 65280 | k << 16 | k >> 16 | 4278190080;
                    this.v.send("screen-fill-buffer-end", this.Md)
                }
                this.de = this.ba;
                this.ce = 0;
                this.fe = this.ba;
                this.ee = 0
            }
            Cc(this)
        }, this);
    this.o = new Uint8Array(262144);
    this.af = new Uint8Array(this.o.buffer, 0, 65536);
    this.bf = new Uint8Array(this.o.buffer, 65536, 65536);
    this.cf = new Uint8Array(this.o.buffer, 131072, 65536);
    this.df = new Uint8Array(this.o.buffer, 196608, 65536);
    this.Pd = new Uint8Array(524288);
    var d = this;
    hb(c, 655360, 131072, function(g) {
        return Dc(d, g)
    }, function(g, f) {
        if (d.La && d.Ba && d.Bc) d.s.lf((g - 655360 | d.Ra) + 3758096384 | 0, f);
        else {
            var h = d.ma >> 2 & 3;
            g -= xc[h];
            if (!(0 > g || g >= yc[h]))
                if (d.Ba) {
                    var k = f;
                    f = Ec(d.Dc);
                    var l = Fc(d.Rb);
                    h = Fc(d.Ec);
                    switch (d.qc & 3) {
                        case 0:
                            k = (k | k << 8) >>> (d.Qa & 7) & 255;
                            var n = Ec(k);
                            k = Fc(d.Rb);
                            n = Gc(d, (n | h & k) & (~h | k), d.h);
                            n = f & n | ~f & d.h;
                            break;
                        case 1:
                            n = d.h;
                            break;
                        case 2:
                            n = Fc(k);
                            n = Gc(d, n, d.h);
                            n = f & n | ~f & d.h;
                            break;
                        case 3:
                            k = (k | k << 8) >>> (d.Qa & 7) & 255, f &= Ec(k), n = f & l | ~f & d.h
                    }
                    f = 15;
                    switch (d.cc & 12) {
                        case 0:
                            f = 5 << (g & 1);
                            g &= -2;
                            break;
                        case 8:
                        case 12:
                            f = 1 << (g & 3), g &= -4
                    }
                    f &= d.$b;
                    f & 1 && (d.af[g] = n >> 0 & 255);
                    f & 2 && (d.bf[g] = n >> 8 & 255);
                    f & 4 && (d.cf[g] = n >> 16 & 255);
                    f & 8 && (d.df[g] = n >> 24 & 255);
                    f = Hc(d, g);
                    n = f + 7;
                    f < d.fe && (d.fe = f);
                    n > d.ee && (d.ee = n);
                    f < d.de && (d.de =
                        f);
                    n > d.ce && (d.ce = n)
                } else d.$b & 3 && (n = g, h = (n >> 1) - d.za, g = h / d.L | 0, h %= d.L, n & 1 ? (l = f, k = d.o[n & -2]) : (k = f, l = d.o[n | 1]), d.v.send("screen-put-char", [g, h, k, d.bb[d.U & d.fc[l >> 4 & 15]], d.bb[d.U & d.fc[l & 15]]]), d.o[n] = f)
        }
    });
    Qb(a.B.Ja, this)
}
p = zc.prototype;
p.aa = function() {
    var a = [];
    a[0] = this.ba;
    a[1] = this.C;
    a[2] = this.zc;
    a[3] = this.xc;
    a[4] = this.L;
    a[5] = this.Yb;
    a[6] = this.o;
    a[7] = this.ca;
    a[8] = this.za;
    a[9] = this.Ba;
    a[10] = this.bb;
    a[11] = this.h;
    a[12] = this.P;
    a[13] = this.R;
    a[14] = this.ma;
    a[15] = this.Pa;
    a[16] = this.ab;
    a[17] = this.Fa;
    a[18] = this.La;
    a[19] = this.Pb;
    a[20] = this.Ra;
    a[21] = this.Ud;
    a[22] = this.D;
    a[23] = this.Y;
    a[24] = this.Sb;
    a[25] = this.fc;
    a[26] = this.ac;
    a[27] = this.$b;
    a[28] = this.cc;
    a[29] = this.Ub;
    a[30] = this.Fc;
    a[31] = this.qc;
    a[32] = this.Qa;
    a[33] = this.Dc;
    a[34] = this.W;
    a[35] =
        this.gd;
    a[36] = this.j;
    a[37] = this.Tb;
    a[38] = this.F;
    a[39] = this.Kf;
    a[40] = this.Bc;
    a[41] = this.l;
    a[42] = this.N;
    a[43] = this.Rb;
    a[44] = this.Ec;
    a[45] = this.Ic;
    a[46] = this.nb;
    a[47] = this.Wb;
    a[48] = this.Vb;
    a[49] = this.i;
    a[50] = this.g;
    a[51] = this.O;
    a[52] = this.Hc;
    a[53] = this.N;
    a[54] = this.Zb;
    a[55] = this.Sa;
    a[56] = this.Hd;
    a[57] = this.Xb;
    a[58] = this.Yc;
    a[59] = this.mb;
    a[60] = this.u;
    a[61] = this.Pd;
    a[62] = this.U;
    return a
};
p.I = function(a) {
    this.ba = a[0];
    this.C = a[1];
    this.zc = a[2];
    this.xc = a[3];
    this.L = a[4];
    this.Yb = a[5];
    a[6] && this.o.set(a[6]);
    this.ca = a[7];
    this.za = a[8];
    this.Ba = a[9];
    this.bb = a[10];
    this.h = a[11];
    this.P = a[12];
    this.R = a[13];
    this.ma = a[14];
    this.Pa = a[15];
    this.ab = a[16];
    this.Fa = a[17];
    this.La = a[18];
    this.Pb = a[19];
    this.Ra = a[20];
    this.Ud = a[21];
    this.D = a[22];
    this.Y = a[23];
    this.Sb = a[24];
    this.fc = a[25];
    this.ac = a[26];
    this.$b = a[27];
    this.cc = a[28];
    this.Ub = a[29];
    this.Fc = a[30];
    this.qc = a[31];
    this.Qa = a[32];
    this.Dc = a[33];
    this.W = a[34];
    this.gd =
        a[35];
    this.j = a[36];
    this.Tb = a[37];
    this.F = a[38];
    this.Kf.set(a[39]);
    this.Bc = a[40];
    this.l = a[41];
    this.N = a[42];
    this.Rb = a[43];
    this.Ec = a[44];
    this.Ic = a[45];
    this.nb.set(a[46]);
    this.Wb = a[47];
    this.Vb = a[48];
    this.i = a[49];
    this.g = a[50];
    this.O = a[51];
    this.Hc = a[52];
    this.N = a[53];
    this.Zb = a[54];
    this.Sa = a[55];
    this.Hd = a[56];
    this.Xb = a[57];
    this.Yc = a[58];
    this.mb = a[59];
    this.u = a[60];
    a[61] && this.Pd.set(a[61]);
    this.U = void 0 === a[62] ? 255 : a[62];
    this.v.send("screen-set-mode", this.Ba);
    this.Ba ? (this.Td = this.sc = 0, this.La ? (this.wd(this.Pa,
        this.ab, this.Pb, this.Pa, this.ab), Ac(this)) : (Ic(this), Ac(this), Jc(this))) : (this.xd(this.L, this.Yb), this.Cd(), this.Bd());
    Kc(this)
};

function Dc(a, b) {
    if (a.La && a.Bc) return a.s.ud((b - 655360 | a.Ra) + 3758096384 | 0);
    var c = a.ma >> 2 & 3;
    b -= xc[c];
    if (0 > b || b >= yc[c]) return 0;
    a.h = a.af[b];
    a.h |= a.bf[b] << 8;
    a.h |= a.cf[b] << 16;
    a.h |= a.df[b] << 24;
    if (a.qc & 8) return c = 255, a.R & 1 && (c &= a.af[b] ^ ~(a.P & 1 ? 255 : 0)), a.R & 2 && (c &= a.bf[b] ^ ~(a.P & 2 ? 255 : 0)), a.R & 4 && (c &= a.cf[b] ^ ~(a.P & 4 ? 255 : 0)), a.R & 8 && (c &= a.df[b] ^ ~(a.P & 8 ? 255 : 0)), c;
    c = a.Fc;
    a.Ba ? a.cc & 8 ? (c = b & 3, b &= -4) : a.qc & 16 && (c = b & 1, b &= -2) : c = 0;
    return a.o[c << 16 | b]
}

function Ec(a) {
    return a | a << 8 | a << 16 | a << 24
}

function Fc(a) {
    return (a & 1 ? 255 : 0) | (a & 2 ? 255 : 0) << 8 | (a & 4 ? 255 : 0) << 16 | (a & 8 ? 255 : 0) << 24
}

function Gc(a, b, c) {
    switch (a.Qa & 24) {
        case 8:
            return b & c;
        case 16:
            return b | c;
        case 24:
            return b ^ c
    }
    return b
}

function Lc(a) {
    for (var b = a.za << 1, c, e, d = 0; d < a.Yb; d++)
        for (var g = 0; g < a.L; g++) c = a.o[b], e = a.o[b | 1], a.v.send("screen-put-char", [d, g, c, a.bb[a.U & a.fc[e >> 4 & 15]], a.bb[a.U & a.fc[e & 15]]]), b += 2
}
p.Bd = function() {
    var a = (this.C - this.za) / this.L | 0,
        b = (this.C - this.za) % this.L;
    a = Math.min(this.Yb - 1, a);
    this.v.send("screen-update-cursor", [a, b])
};

function Kc(a) {
    a.Ba ? a.La ? a.s.se() : (a.de = 0, a.ce = 524288) : Lc(a)
}

function Jc(a) {
    a.Ba && !a.La && (a.fe = 0, a.ee = 524288, Kc(a))
}
p.oa = function() {};

function Bc(a) {
    var b = 128 + (~a.O & a.Fa & 64);
    b -= a.O & 64;
    b -= a.Sa & 64;
    return b >>> 6
}

function Hc(a, b) {
    var c = Bc(a);
    if (~a.Fa & 3) {
        var e = b - a.za;
        e &= a.Fa << 13 | -24577;
        e <<= c;
        var d = e / a.Ea | 0;
        e %= a.Ea;
        switch (a.Fa & 3) {
            case 2:
                d = d << 1 | b >> 13 & 1;
                break;
            case 1:
                d = d << 1 | b >> 14 & 1;
                break;
            case 0:
                d = d << 2 | b >> 13 & 3
        }
        return d * a.Ea + e + (a.za << c)
    }
    return b << c
}

function Mc(a, b) {
    a.W & 128 && (b >>>= 1);
    b = Math.ceil(b / (1 + (a.W & 31)));
    a.Fa & 1 || (b <<= 1);
    a.Fa & 2 || (b <<= 1);
    return b
}
p.xd = function(a, b) {
    this.L = a;
    this.Yb = b;
    this.v.send("screen-set-size-text", [a, b])
};
p.wd = function(a, b, c, e, d) {
    if (!this.Xa.ng || this.Xa.Wf !== c || this.sc !== a || this.Td !== b || this.Ea !== e || this.Fe !== d) {
        this.sc = a;
        this.Td = b;
        this.Ea = e;
        this.Fe = d;
        this.Xa.Wf = c;
        this.Xa.ng = !0;
        this.Xa.Yj = a;
        this.Xa.Zj = b;
        if ("undefined" !== typeof ImageData) {
            const g = e * d,
                f = this.s.wh(g) >>> 0;
            this.qf = f;
            this.Gb = new ImageData(new Uint8ClampedArray(this.s.ua.buffer, f, 4 * g), e, d);
            this.s.se()
        }
        this.v.send("screen-set-size-graphical", [a, b, e, d, c])
    }
};

function Ic(a) {
    if (!a.La) {
        var b = Math.min(1 + a.Wb, a.Vb),
            c = Math.min(1 + a.i, a.g);
        if (b && c)
            if (a.Ba) {
                b <<= 3;
                var e = a.N << 4;
                a.Sa & 64 && (b >>>= 1, e >>>= 1);
                var d = a.N << 2;
                a.O & 64 ? d <<= 1 : a.Fa & 64 && (d >>>= 1);
                a.wd(b, Mc(a, c), 8, e, Math.ceil(yc[0] / d));
                Cc(a);
                Ac(a)
            } else a.W & 128 && (c >>>= 1), c = c / (1 + (a.W & 31)) | 0, b && c && a.xd(b, c)
    }
}

function Ac(a) {
    a.Ba || Lc(a);
    if (a.La) a.Md = [];
    else if (a.Ea && a.sc)
        if (!a.Zb || a.mb & 32) a.Md = [], a.v.send("screen-clear");
        else {
            var b = a.Ic,
                c = a.Xb;
            a.Sa & 64 && (c >>>= 1);
            var e = a.Hc >> 5 & 3,
                d = Hc(a, b + e);
            b = d / a.Ea | 0;
            var g = d % a.Ea + c;
            d = Mc(a, 1 + a.u);
            d = Math.min(d, a.Td);
            var f = a.Td - d;
            a.Md = [];
            g = -g;
            for (var h = 0; g < a.sc; g += a.Ea, h++) a.Md.push({
                Gb: a.Gb,
                Gf: g,
                Hf: 0,
                Je: 0,
                Ke: b + h,
                pf: a.Ea,
                nf: d
            });
            b = 0;
            a.Sa & 32 || (b = Hc(a, e) + c);
            g = -b;
            for (h = 0; g < a.sc; g += a.Ea, h++) a.Md.push({
                Gb: a.Gb,
                Gf: g,
                Hf: d,
                Je: 0,
                Ke: h,
                pf: a.Ea,
                nf: f
            })
        }
}

function Cc(a) {
    a.j |= 8;
    a.Ic !== a.za && (a.Ic = a.za, Ac(a))
}
p.Cd = function() {
    this.v.send("screen-update-cursor-scanline", [this.zc, this.xc])
};
p.ij = function(a) {
    if (-1 === this.l) this.l = a & 31, this.Zb !== (a & 32) && (this.Zb = a & 32, Ac(this));
    else {
        if (16 > this.l) this.fc[this.l] = a, this.Sa & 64 || Kc(this);
        else switch (this.l) {
            case 16:
                if (this.Sa !== a) {
                    var b = this.Sa;
                    this.Sa = a;
                    var c = 0 < (a & 1);
                    this.La || this.Ba === c || (this.Ba = c, this.v.send("screen-set-mode", this.Ba));
                    (b ^ a) & 64 && Jc(this);
                    Ic(this);
                    Kc(this)
                }
                break;
            case 18:
                this.Hd !== a && (this.Hd = a, Kc(this));
                break;
            case 19:
                this.Xb !== a && (this.Xb = a & 15, Ac(this));
                break;
            case 20:
                this.Yc !== a && (this.Yc = a, Kc(this))
        }
        this.l = -1
    }
};
p.Gg = function() {
    return (this.l | this.Zb) & 255
};
p.hj = function() {
    return this.Gg() | this.Hg() << 8 & 65280
};
p.Hg = function() {
    if (16 > this.l) return this.fc[this.l] & 255;
    switch (this.l) {
        case 16:
            return this.Sa;
        case 18:
            return this.Hd;
        case 19:
            return this.Xb;
        case 20:
            return this.Yc
    }
    return 255
};
p.jj = function(a) {
    this.gd = a
};
p.lj = function(a) {
    this.ac = a
};
p.kj = function() {
    return this.ac
};
p.nj = function(a) {
    switch (this.ac) {
        case 1:
            var b = this.mb;
            this.mb = a;
            (b ^ a) & 32 && Ac(this);
            break;
        case 2:
            this.$b = a;
            break;
        case 4:
            this.cc = a
    }
};
p.mj = function() {
    switch (this.ac) {
        case 1:
            return this.mb;
        case 2:
            return this.$b;
        case 4:
            return this.cc;
        case 6:
            return 18
    }
    return 0
};
p.pj = function(a) {
    this.U = a
};
p.oj = function() {
    return this.U
};
p.rj = function(a) {
    this.Sb = 3 * a;
    this.ca &= 0
};
p.qj = function() {
    return this.ca
};
p.tj = function(a) {
    this.Y = 3 * a;
    this.ca |= 3
};
p.sj = function() {
    return this.Y / 3 & 255
};
p.vj = function(a) {
    var b = this.Y / 3 | 0,
        c = this.Y % 3,
        e = this.bb[b];
    if (0 === (this.F & 32)) {
        a &= 63;
        const d = a & 1;
        a = a << 2 | d << 1 | d
    }
    e = 0 === c ? e & -16711681 | a << 16 : 1 === c ? e & -65281 | a << 8 : e & -256 | a;
    this.bb[b] !== e && (this.bb[b] = e, Kc(this));
    this.Y++
};
p.uj = function() {
    var a = this.bb[this.Sb / 3 | 0] >> 8 * (2 - this.Sb % 3) & 255;
    this.Sb++;
    return this.F & 32 ? a : a >> 2
};
p.wj = function() {
    return this.gd
};
p.yj = function(a) {
    this.Ub = a
};
p.xj = function() {
    return this.Ub
};
p.Aj = function(a) {
    switch (this.Ub) {
        case 0:
            this.Rb = a;
            break;
        case 1:
            this.Ec = a;
            break;
        case 2:
            this.P = a;
            break;
        case 3:
            this.Qa = a;
            break;
        case 4:
            this.Fc = a;
            break;
        case 5:
            var b = this.qc;
            this.qc = a;
            (b ^ a) & 96 && Jc(this);
            break;
        case 6:
            this.ma !== a && (this.ma = a, Ic(this));
            break;
        case 7:
            this.R = a;
            break;
        case 8:
            this.Dc = a
    }
};
p.zj = function() {
    switch (this.Ub) {
        case 0:
            return this.Rb;
        case 1:
            return this.Ec;
        case 2:
            return this.P;
        case 3:
            return this.Qa;
        case 4:
            return this.Fc;
        case 5:
            return this.qc;
        case 6:
            return this.ma;
        case 7:
            return this.R;
        case 8:
            return this.Dc
    }
    return 0
};
p.Cj = function(a) {
    this.D = a
};
p.Bj = function() {
    return this.D
};
p.Dj = function(a) {
    switch (this.D) {
        case 1:
            this.Wb !== a && (this.Wb = a, Ic(this));
            break;
        case 2:
            this.Vb !== a && (this.Vb = a, Ic(this));
            break;
        case 7:
            var b = this.i;
            this.i &= 255;
            this.i = this.i | a << 3 & 512 | a << 7 & 256;
            b != this.i && Ic(this);
            this.u = this.u & 767 | a << 4 & 256;
            b = this.g;
            this.g = this.g & 767 | a << 5 & 256;
            b !== this.g && Ic(this);
            Ac(this);
            break;
        case 8:
            this.Hc = a;
            Ac(this);
            break;
        case 9:
            this.W = a;
            this.u = this.u & 511 | a << 3 & 512;
            b = this.g;
            this.g = this.g & 511 | a << 4 & 512;
            b !== this.g && Ic(this);
            Ac(this);
            break;
        case 10:
            this.zc = a;
            this.Cd();
            break;
        case 11:
            this.xc =
                a;
            this.Cd();
            break;
        case 12:
            (this.za >> 8 & 255) !== a && (this.za = this.za & 255 | a << 8, Ac(this), ~this.Fa & 3 && Jc(this));
            break;
        case 13:
            (this.za & 255) !== a && (this.za = this.za & 65280 | a, Ac(this), ~this.Fa & 3 && Jc(this));
            break;
        case 14:
            this.C = this.C & 255 | a << 8;
            this.Bd();
            break;
        case 15:
            this.C = this.C & 65280 | a;
            this.Bd();
            break;
        case 18:
            (this.i & 255) !== a && (this.i = this.i & 768 | a, Ic(this));
            break;
        case 19:
            this.N !== a && (this.N = a, Ic(this), ~this.Fa & 3 && Jc(this));
            break;
        case 20:
            this.O !== a && (b = this.O, this.O = a, Ic(this), (b ^ a) & 64 && Jc(this));
            break;
        case 21:
            (this.g &
                255) !== a && (this.g = this.g & 768 | a, Ic(this));
            break;
        case 23:
            this.Fa !== a && (b = this.Fa, this.Fa = a, Ic(this), (b ^ a) & 67 && Jc(this));
            break;
        case 24:
            this.u = this.u & 768 | a;
            Ac(this);
            break;
        default:
            this.D < this.nb.length && (this.nb[this.D] = a)
    }
};
p.Ig = function() {
    switch (this.D) {
        case 1:
            return this.Wb;
        case 2:
            return this.Vb;
        case 7:
            return this.i >> 7 & 2 | this.g >> 5 & 8 | this.u >> 4 & 16 | this.i >> 3 & 64;
        case 8:
            return this.Hc;
        case 9:
            return this.W;
        case 10:
            return this.zc;
        case 11:
            return this.xc;
        case 12:
            return this.za & 255;
        case 13:
            return this.za >> 8;
        case 14:
            return this.C >> 8;
        case 15:
            return this.C & 255;
        case 18:
            return this.i & 255;
        case 19:
            return this.N;
        case 20:
            return this.O;
        case 21:
            return this.g & 255;
        case 23:
            return this.Fa;
        case 24:
            return this.u & 255
    }
    return this.D < this.nb.length ?
        this.nb[this.D] : 0
};
p.Jg = function() {
    var a = this.j;
    this.Ba ? (this.j ^= 1, this.j &= 1) : (this.j & 1 && (this.j ^= 8), this.j ^= 1);
    this.l = -1;
    return a
};
p.Di = function(a) {
    this.Tb = a
};
p.Fi = function(a) {
    switch (this.Tb) {
        case 0:
            45248 <= a && 45253 >= a && (this.se = a);
            break;
        case 1:
            this.Pa = a;
            2560 < this.Pa && (this.Pa = 2560);
            break;
        case 2:
            this.ab = a;
            1600 < this.ab && (this.ab = 1600);
            break;
        case 3:
            this.Pb = a;
            break;
        case 4:
            this.La = 1 === (a & 1);
            this.F = a;
            break;
        case 5:
            this.Ra = a << 16;
            break;
        case 9:
            const b = a * this.Pa;
            this.Nd !== a && (this.Nd = a, this.Ud = b, Kc(this))
    }!this.La || this.Pa && this.ab || (this.La = !1);
    this.La && 4 === this.Tb && (this.wd(this.Pa, this.ab, this.Pb, this.Pa, this.ab), this.v.send("screen-set-mode", !0), this.Bc = this.Ba = !0);
    this.La || (this.Ra = 0);
    Ac(this)
};
p.Ei = function() {
    return Nc(this, this.Tb)
};

function Nc(a, b) {
    switch (b) {
        case 0:
            return a.se;
        case 1:
            return a.F & 2 ? 2560 : a.Pa;
        case 2:
            return a.F & 2 ? 1600 : a.ab;
        case 3:
            return a.F & 2 ? 32 : a.Pb;
        case 4:
            return a.F;
        case 5:
            return a.Ra >>> 16;
        case 6:
            return a.sc ? a.sc : 1;
        case 8:
            return 0;
        case 9:
            return a.Nd;
        case 10:
            return a.ba / 65536 | 0
    }
    return 255
};

function Oc(a, b) {
    this.s = a;
    this.v = b;
    this.Dd = this.Ac = !1;
    this.oe = !0;
    this.kd = this.Kb = this.Jb = 0;
    this.ma = !0;
    this.P = this.O = this.F = this.N = this.R = this.L = this.ie = !1;
    this.ja = new xb(1024);
    this.l = 0;
    this.Sc = 100;
    this.j = this.i = 0;
    this.C = !1;
    this.Qb = 0;
    this.Qd = 4;
    this.u = !1;
    this.g = new xb(1024);
    this.D = this.o = !1;
    this.v.register("keyboard-code", function(c) {
        this.ie && (this.ja.push(c), this.Ca())
    }, this);
    this.v.register("mouse-click", function(c) {
        this.oe && this.Dd && (this.kd = c[0] | c[2] << 1 | c[1] << 2, this.Ac && Pc(this, 0, 0))
    }, this);
    this.v.register("mouse-delta",
        function(c) {
            var e = c[1];
            if (this.oe && this.Dd) {
                var d = this.Qd * this.Sc / 80;
                this.Jb += c[0] * d;
                this.Kb += e * d;
                this.Ac && (c = this.Jb | 0, e = this.Kb | 0, c || e) && (this.Jb -= c, this.Kb -= e, Pc(this, c, e))
            }
        }, this);
    this.v.register("mouse-wheel", function(c) {
        this.Qb -= c[0];
        this.Qb -= 2 * c[1];
        this.Qb = Math.min(7, Math.max(-8, this.Qb));
        Pc(this, 0, 0)
    }, this);
    this.h = 5;
    this.ca = 0;
    this.W = this.U = this.Y = !1;
    M(a.A, 96, this, this.Qj);
    M(a.A, 100, this, this.Sj);
    N(a.A, 96, this, this.Rj);
    N(a.A, 100, this, this.Tj)
}
p = Oc.prototype;
p.aa = function() {
    var a = [];
    a[0] = this.Ac;
    a[1] = this.Dd;
    a[2] = this.oe;
    a[3] = this.Jb;
    a[4] = this.Kb;
    a[5] = this.kd;
    a[6] = this.ma;
    a[7] = this.ie;
    a[8] = this.L;
    a[9] = this.R;
    a[10] = this.N;
    a[11] = this.F;
    a[12] = this.O;
    a[13] = this.P;
    a[15] = this.l;
    a[16] = this.Sc;
    a[17] = this.Qd;
    a[18] = this.u;
    a[20] = this.h;
    a[21] = this.Y;
    a[22] = this.U;
    a[23] = this.ca;
    a[24] = this.W;
    a[25] = this.j;
    a[26] = this.i;
    a[27] = this.C;
    return a
};
p.I = function(a) {
    this.Ac = a[0];
    this.Dd = a[1];
    this.oe = a[2];
    this.Jb = a[3];
    this.Kb = a[4];
    this.kd = a[5];
    this.ma = a[6];
    this.ie = a[7];
    this.L = a[8];
    this.R = a[9];
    this.N = a[10];
    this.F = a[11];
    this.O = a[12];
    this.P = a[13];
    this.l = a[15];
    this.Sc = a[16];
    this.Qd = a[17];
    this.u = a[18];
    this.h = a[20];
    this.Y = a[21];
    this.U = a[22];
    this.ca = a[23];
    this.W = a[24];
    this.j = a[25] || 0;
    this.i = a[26] || 0;
    this.C = a[27] || !1;
    this.D = this.o = !1;
    this.ja.clear();
    this.g.clear();
    this.v.send("mouse-enable", this.Dd)
};
p.Ca = function() {
    this.o || (this.ja.length ? Qc(this) : this.g.length && Rc(this))
};

function Rc(a) {
    a.o = !0;
    a.D = !0;
    a.h & 2 && (R(a.s, 12), a.s.Ga(12))
}

function Qc(a) {
    a.o = !0;
    a.D = !1;
    a.h & 1 && (R(a.s, 1), a.s.Ga(1))
}

function Pc(a, b, c) {
    a.g.push((0 > c) << 5 | (0 > b) << 4 | 8 | a.kd);
    a.g.push(b);
    a.g.push(c);
    4 === a.j ? (a.g.push(0 | a.Qb & 15), a.Qb = 0) : 3 === a.j && (a.g.push(a.Qb & 255), a.Qb = 0);
    a.Ca()
}
p.Qj = function() {
    this.o = !1;
    if (!this.ja.length && !this.g.length) return this.l;
    this.D ? (R(this.s, 12), this.l = this.g.shift()) : (R(this.s, 1), this.l = this.ja.shift());
    (this.ja.length || this.g.length) && this.Ca();
    return this.l
};
p.Sj = function() {
    var a = 16;
    this.o && (a |= 1);
    this.D && (a |= 32);
    return a
};
p.Rj = function(a) {
    if (this.U) this.h = a, this.U = !1;
    else if (this.Y) this.Y = !1, this.g.clear(), this.g.push(a), Rc(this);
    else if (this.R) {
        this.R = !1;
        this.g.clear();
        this.g.push(250);
        this.Sc = a;
        switch (this.i) {
            case -1:
                60 === a ? (this.C = !0, this.i = 0) : (this.C = !1, this.i = 200 === a ? 1 : 0);
                break;
            case 0:
                200 === a && (this.i = 1);
                break;
            case 1:
                this.i = 100 === a ? 2 : 200 === a ? 3 : 0;
                break;
            case 2:
                80 === a && (this.j = 3);
                this.i = -1;
                break;
            case 3:
                80 === a && (this.j = 4), this.i = -1
        }
        this.Sc || (this.Sc = 100);
        Rc(this)
    } else if (this.P) this.P = !1, this.g.clear(), this.g.push(250),
        this.Qd = 3 < a ? 4 : 1 << a, Rc(this);
    else if (this.N) this.N = !1, this.ja.push(250), Qc(this);
    else if (this.F) this.F = !1, this.ja.push(250), Qc(this), a || this.ja.push(2);
    else if (this.O) this.O = !1, this.ja.push(250), Qc(this);
    else if (this.L) {
        if (this.L = !1, this.oe) {
            this.ja.clear();
            this.g.clear();
            this.g.push(250);
            switch (a) {
                case 230:
                    this.u = !1;
                    break;
                case 231:
                    this.u = !0;
                    break;
                case 232:
                    this.P = !0;
                    break;
                case 233:
                    Pc(this, 0, 0);
                    break;
                case 235:
                    Pc(this, 0, 0);
                    break;
                case 242:
                    this.g.push(this.j);
                    this.kd = this.Jb = this.Kb = 0;
                    this.Ca();
                    break;
                case 243:
                    this.R = !0;
                    break;
                case 244:
                    this.Dd = this.Ac = !0;
                    this.v.send("mouse-enable", !0);
                    this.kd = this.Jb = this.Kb = 0;
                    break;
                case 245:
                    this.Ac = !1;
                    break;
                case 246:
                    this.Ac = !1;
                    this.Sc = 100;
                    this.u = !1;
                    this.Qd = 4;
                    break;
                case 255:
                    this.g.push(170), this.g.push(0), this.Dd = !0, this.v.send("mouse-enable", !0), this.Ac = !1, this.Sc = 100, this.u = !1, this.Qd = 4, this.C || (this.j = 0), this.kd = this.Jb = this.Kb = 0
            }
            Rc(this)
        }
    } else if (this.W) this.W = !1, this.ca = a;
    else {
        this.g.clear();
        this.ja.clear();
        this.ja.push(250);
        switch (a) {
            case 237:
                this.N = !0;
                break;
            case 240:
                this.F = !0;
                break;
            case 242:
                this.ja.push(171);
                this.ja.push(83);
                break;
            case 243:
                this.O = !0;
                break;
            case 244:
                this.ie = !0;
                break;
            case 245:
                this.ie = !1;
                break;
            case 255:
                this.ja.clear(), this.ja.push(250), this.ja.push(170), this.ja.push(0)
        }
        Qc(this)
    }
};
p.Tj = function(a) {
    switch (a) {
        case 32:
            this.ja.clear();
            this.g.clear();
            this.ja.push(this.h);
            Qc(this);
            break;
        case 96:
            this.U = !0;
            break;
        case 209:
            this.W = !0;
            break;
        case 211:
            this.Y = !0;
            break;
        case 212:
            this.L = !0;
            break;
        case 167:
            this.h |= 32;
            break;
        case 168:
            this.h &= -33;
            break;
        case 169:
            this.ja.clear();
            this.g.clear();
            this.ja.push(0);
            Qc(this);
            break;
        case 170:
            this.ja.clear();
            this.g.clear();
            this.ja.push(85);
            Qc(this);
            break;
        case 171:
            this.ja.clear();
            this.g.clear();
            this.ja.push(0);
            Qc(this);
            break;
        case 173:
            this.h |= 16;
            break;
        case 174:
            this.h &=
                -17;
            break;
        case 254:
            ic(this.s)
    }
};

function Sc(a) {
    this.s = a;
    this.Xc = 0;
    this.V = new Uint8Array(128);
    this.D = this.g = Date.now();
    this.l = this.j = 0;
    this.u = !1;
    this.C = .9765625;
    this.o = 38;
    this.h = 2;
    this.yf = this.i = 0;
    N(a.A, 112, this, function(b) {
        this.Xc = b & 127;
        this.yf = b >> 7
    });
    N(a.A, 113, this, this.Lh);
    M(a.A, 113, this, this.Kh)
}
p = Sc.prototype;
p.aa = function() {
    var a = [];
    a[0] = this.Xc;
    a[1] = this.V;
    a[2] = this.g;
    a[3] = this.D;
    a[4] = this.j;
    a[5] = this.l;
    a[6] = this.u;
    a[7] = this.C;
    a[8] = this.o;
    a[9] = this.h;
    a[10] = this.i;
    a[11] = this.yf;
    return a
};
p.I = function(a) {
    this.Xc = a[0];
    this.V = a[1];
    this.g = a[2];
    this.D = a[3];
    this.j = a[4];
    this.l = a[5];
    this.u = a[6];
    this.C = a[7];
    this.o = a[8];
    this.h = a[9];
    this.i = a[10];
    this.yf = a[11]
};
p.wb = function(a) {
    a = Date.now();
    this.g += a - this.D;
    this.D = a;
    this.u && this.j < a ? (this.s.Ga(8), this.i |= 192, this.j += this.C * Math.ceil((a - this.j) / this.C)) : this.l && this.l < a && (this.s.Ga(8), this.i |= 160, this.l = 0);
    let b = 100;
    this.u && this.j && (b = Math.min(b, Math.max(0, this.j - a)));
    this.l && (b = Math.min(b, Math.max(0, this.l - a)));
    return b
};

function Tc(a, b) {
    if (a.h & 4) a = b;
    else {
        a = b;
        for (var c = b = 0, e; a;) e = a % 10, c |= e << 4 * b, b++, a = (a - e) / 10;
        a = c
    }
    return a
}

function Uc(a, b) {
    var c;
    a.h & 4 ? c = b : c = (b & 15) + 10 * (b >> 4 & 15);
    return c
}
p.Kh = function() {
    switch (this.Xc) {
        case 0:
            return Tc(this, (new Date(this.g)).getUTCSeconds());
        case 2:
            return Tc(this, (new Date(this.g)).getUTCMinutes());
        case 4:
            return Tc(this, (new Date(this.g)).getUTCHours());
        case 7:
            return Tc(this, (new Date(this.g)).getUTCDate());
        case 8:
            return Tc(this, (new Date(this.g)).getUTCMonth() + 1);
        case 9:
            return Tc(this, (new Date(this.g)).getUTCFullYear() % 100);
        case 10:
            return 999 <= nb() % 1E3 ? this.o | 128 : this.o;
        case 11:
            return this.h;
        case 12:
            R(this.s, 8);
            var a = this.i;
            this.i &= -241;
            return a;
        case 13:
            return 0;
        case 50:
            return Tc(this, (new Date(this.g)).getUTCFullYear() / 100 | 0);
        default:
            return this.V[this.Xc]
    }
};
p.Lh = function(a) {
    switch (this.Xc) {
        case 10:
            this.o = a & 127;
            this.C = 1E3 / (32768 >> (this.o & 15) - 1);
            break;
        case 11:
            this.h = a;
            this.h & 64 && (this.j = Date.now());
            if (this.h & 32) {
                a = new Date;
                const b = Uc(this, this.V[1]),
                    c = Uc(this, this.V[3]),
                    e = Uc(this, this.V[5]);
                this.l = +new Date(Date.UTC(a.getUTCFullYear(), a.getUTCMonth(), a.getUTCDate(), e, c, b))
            }
            break;
        case 1:
        case 3:
        case 5:
            this.V[this.Xc] = a
    }
    this.u = 64 === (this.h & 64) && 0 < (this.o & 15)
};

function Vc(a, b, c) {
    this.v = c;
    this.s = a;
    this.g = 4;
    this.Jc = this.tc = 0;
    this.jd = 96;
    this.mc = this.ke = 0;
    this.nc = 1;
    this.ea = this.gf = this.wf = this.Xe = 0;
    this.input = [];
    switch (b) {
        case 1016:
            this.h = 0;
            this.ea = 4;
            break;
        case 760:
            this.h = 1;
            this.ea = 3;
            break;
        case 1E3:
            this.h = 2;
            this.ea = 4;
            break;
        case 744:
            this.ea = this.h = 3;
            break;
        default:
            this.h = 0, this.ea = 4
    }
    this.v.register("serial" + this.h + "-input", function(e) {
        this.input.push(e);
        this.jd |= 1;
        this.ke & 1 ? Wc(this, 12) : Wc(this, 4)
    }, this);
    a = a.A;
    N(a, b, this, function(e) {
        Xc(this, e)
    }, function(e) {
        Xc(this,
            e & 255);
        Xc(this, e >> 8)
    });
    N(a, b | 1, this, function(e) {
        this.Jc & 128 ? this.tc = this.tc & 255 | e << 8 : (0 === (this.mc & 2) && e & 2 && Wc(this, 2), this.mc = e & 15, Yc(this))
    });
    M(a, b, this, function() {
        if (this.Jc & 128) return this.tc & 255;
        let e = 0;
        0 !== this.input.length && (e = this.input.shift());
        0 === this.input.length && (this.jd &= -2, Zc(this, 12), Zc(this, 4));
        return e
    });
    M(a, b | 1, this, function() {
        return this.Jc & 128 ? this.tc >> 8 : this.mc & 15
    });
    M(a, b | 2, this, function() {
        var e = this.nc & 15;
        2 == this.nc && Zc(this, 2);
        this.ke & 1 && (e |= 192);
        return e
    });
    N(a, b | 2, this, function(e) {
        this.ke =
            e
    });
    M(a, b | 3, this, function() {
        return this.Jc
    });
    N(a, b | 3, this, function(e) {
        this.Jc = e
    });
    M(a, b | 4, this, function() {
        return this.Xe
    });
    N(a, b | 4, this, function(e) {
        this.Xe = e
    });
    M(a, b | 5, this, function() {
        return this.jd
    });
    N(a, b | 5, this, function() {});
    M(a, b | 6, this, function() {
        return this.wf
    });
    N(a, b | 6, this, function() {});
    M(a, b | 7, this, function() {
        return this.gf
    });
    N(a, b | 7, this, function(e) {
        this.gf = e
    })
}
Vc.prototype.aa = function() {
    var a = [];
    a[0] = this.g;
    a[1] = this.tc;
    a[2] = this.Jc;
    a[3] = this.jd;
    a[4] = this.ke;
    a[5] = this.mc;
    a[6] = this.nc;
    a[7] = this.Xe;
    a[8] = this.wf;
    a[9] = this.gf;
    a[10] = this.ea;
    return a
};
Vc.prototype.I = function(a) {
    this.g = a[0];
    this.tc = a[1];
    this.Jc = a[2];
    this.jd = a[3];
    this.ke = a[4];
    this.mc = a[5];
    this.nc = a[6];
    this.Xe = a[7];
    this.wf = a[8];
    this.gf = a[9];
    this.ea = a[10]
};

function Yc(a) {
    a.g & 4096 && a.mc & 1 ? (a.nc = 12, a.s.Ga(a.ea)) : a.g & 16 && a.mc & 1 ? (a.nc = 4, a.s.Ga(a.ea)) : a.g & 4 && a.mc & 2 ? (a.nc = 2, a.s.Ga(a.ea)) : a.g & 1 && a.mc & 8 ? (a.nc = 0, a.s.Ga(a.ea)) : (a.nc = 1, R(a.s, a.ea))
}

function Wc(a, b) {
    a.g |= 1 << b;
    Yc(a)
}

function Zc(a, b) {
    a.g &= ~(1 << b);
    Yc(a)
}

function Xc(a, b) {
    a.Jc & 128 ? a.tc = a.tc & -256 | b : (Wc(a, 2), a.v.send("serial" + a.h + "-output-byte", b))
};

function $c(a) {
    this.s = a;
    var b = a.A;
    Qb(a.B.Ja, {
        Ka: 56,
        K: [134, 128, 19, 113, 7, 0, 128, 2, 8, 0, 128, 6, 0, 0, 128, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 1, 0, 0],
        jb: [],
        name: "acpi"
    });
    this.g = this.h = 0;
    this.status = 1;
    this.ve = this.pd = 0;
    this.i = ad(this, nb());
    this.Fb = new Uint8Array(4);
    M(b, 45056, this, void 0, function() {
        return this.pd
    });
    N(b, 45056, this, void 0, function(c) {
        this.pd &= ~c
    });
    M(b, 45058, this, void 0, function() {
        return this.ve
    });
    N(b, 45058, this, void 0, function(c) {
        this.ve =
            c
    });
    M(b, 45060, this, void 0, function() {
        return this.status
    });
    N(b, 45060, this, void 0, function(c) {
        this.status = c
    });
    M(b, 45064, this, void 0, void 0, function() {
        return ad(this, nb()) & 16777215
    });
    M(b, 45024, this, function() {
        return this.Fb[0]
    });
    M(b, 45025, this, function() {
        return this.Fb[1]
    });
    M(b, 45026, this, function() {
        return this.Fb[2]
    });
    M(b, 45027, this, function() {
        return this.Fb[3]
    });
    N(b, 45024, this, function(c) {
        this.Fb[0] = c
    });
    N(b, 45025, this, function(c) {
        this.Fb[1] = c
    });
    N(b, 45026, this, function(c) {
        this.Fb[2] = c
    });
    N(b, 45027, this,
        function(c) {
            this.Fb[3] = c
        })
}
$c.prototype.wb = function(a) {
    a = ad(this, a);
    var b = 0 !== ((a ^ this.i) & 8388608);
    this.ve & 1 && b ? (this.pd |= 1, this.s.Ga(9)) : R(this.s, 9);
    this.i = a;
    return 100
};

function ad(a, b) {
    b = Math.round(3579.545 * b);
    b === a.h ? 3579.545 > a.g && a.g++ : a.h + a.g <= b && (a.g = 0, a.h = b);
    return a.h + a.g
}
$c.prototype.aa = function() {
    var a = [];
    a[0] = this.status;
    a[1] = this.pd;
    a[2] = this.ve;
    a[3] = this.Fb;
    return a
};
$c.prototype.I = function(a) {
    this.status = a[0];
    this.pd = a[1];
    this.ve = a[2];
    this.Fb = a[3]
};

function bd(a) {
    this.s = a;
    this.Y = this.ma = 0;
    this.ca = 1;
    this.g = this.l = 0;
    this.j = nb();
    this.N = this.P = this.O = this.R = this.h = 65536;
    this.F = this.D = this.u = 0;
    this.i = new Int32Array(8);
    this.Ia = new Int32Array(8);
    this.o = new Int32Array(8);
    this.W = 254;
    this.C = -1;
    this.U = this.error = this.L = 0;
    hb(a.A, 4276092928, 1048576, b => {
        var c = b & 3;
        return this.ye(b & -4) >> 8 * c & 255
    }, () => {}, b => this.ye(b), (b, c) => this.Uc(b, c))
}
p = bd.prototype;
p.ye = function(a) {
    a = a - 4276092928 | 0;
    switch (a) {
        case 32:
            return this.ma;
        case 48:
            return 327700;
        case 128:
            return this.u;
        case 208:
            return this.L;
        case 224:
            return this.C;
        case 240:
            return this.W;
        case 256:
        case 272:
        case 288:
        case 304:
        case 320:
        case 336:
        case 352:
        case 368:
            return this.Ia[a - 256 >> 4];
        case 384:
        case 400:
        case 416:
        case 432:
        case 448:
        case 464:
        case 480:
        case 496:
            return this.o[a - 384 >> 4];
        case 512:
        case 528:
        case 544:
        case 560:
        case 576:
        case 592:
        case 608:
        case 624:
            return this.i[a - 512 >> 4];
        case 640:
            return this.U;
        case 768:
            return this.D;
        case 784:
            return this.F;
        case 800:
            return this.h;
        case 832:
            return this.R;
        case 848:
            return this.O;
        case 864:
            return this.P;
        case 880:
            return this.N;
        case 992:
            return this.Y;
        case 896:
            return this.l;
        case 912:
            return this.g;
        default:
            return 0
    }
};
p.Uc = function(a, b) {
    switch (a - 4276092928 | 0) {
        case 128:
            this.u = b & 255;
            cd(this);
            break;
        case 176:
            b = dd(this.Ia);
            if (-1 !== b) {
                ed(this.Ia, b);
                if (this.o[b >> 5] >> (b & 31) & 1) {
                    a = this.s.B.Gc;
                    for (var c = 0; 24 > c; c++) {
                        var e = a.g[c];
                        (e & 255) === b && e & 16384 && (a.g[c] &= -16385, fd(a, c))
                    }
                }
                cd(this)
            }
            break;
        case 208:
            this.L = b & 4278190080;
            break;
        case 224:
            this.C = b | 16777215;
            break;
        case 240:
            this.W = b;
            break;
        case 640:
            this.U = this.error;
            this.error = 0;
            break;
        case 768:
            a = b & 255;
            c = b >> 8 & 7;
            e = b >> 15 & 1;
            var d = b >> 18 & 3;
            this.D = b & -4097;
            0 === d ? gd(this, a, c, e) : 1 === d ? gd(this,
                a, 0, e) : 2 === d && gd(this, a, c, e);
            break;
        case 784:
            this.F = b;
            break;
        case 800:
            this.h = b;
            break;
        case 832:
            this.R = b;
            break;
        case 848:
            this.O = b;
            break;
        case 864:
            this.P = b;
            break;
        case 880:
            this.N = b;
            break;
        case 992:
            this.Y = b;
            b = b & 3 | (b & 8) >> 1;
            this.ca = 7 === b ? 0 : b + 1;
            break;
        case 896:
            this.l = b >>> 0, this.g = b >>> 0, this.j = nb()
    }
};
p.wb = function(a) {
    if (0 === this.g) return 100;
    const b = 1E6 / (1 << this.ca);
    a = (a - this.j) * b >>> 0;
    this.j += a / b;
    this.g -= a;
    0 >= this.g && (a = this.h & 393216, 131072 === a ? (this.g %= this.l, 0 >= this.g && (this.g += this.l), 0 === (this.h & 65536) && gd(this, this.h & 255, 0, !1)) : 0 === a && (this.g = 0, 0 === (this.h & 65536) && gd(this, this.h & 255, 0, !1)));
    return Math.max(0, this.g / b)
};

function gd(a, b, c, e) {
    5 === c || 4 === c || a.i[b >> 5] >> (b & 31) & 1 || (hd(a.i, b), e ? hd(a.o, b) : ed(a.o, b), cd(a))
}

function cd(a) {
    var b = dd(a.i); - 1 !== b && (dd(a.Ia) >= b || (b & 240) <= (a.u & 240) || a.s.rk())
}
p.aa = function() {
    var a = [];
    a[0] = this.ma;
    a[1] = this.Y;
    a[2] = this.ca;
    a[3] = this.l;
    a[4] = this.g;
    a[5] = this.j;
    a[6] = this.h;
    a[7] = this.R;
    a[8] = this.O;
    a[9] = this.P;
    a[10] = this.N;
    a[11] = this.u;
    a[12] = this.D;
    a[13] = this.F;
    a[14] = this.i;
    a[15] = this.Ia;
    a[16] = this.o;
    a[17] = this.W;
    a[18] = this.C;
    a[19] = this.L;
    a[20] = this.error;
    a[21] = this.U;
    return a
};
p.I = function(a) {
    this.ma = a[0];
    this.Y = a[1];
    this.ca = a[2];
    this.l = a[3];
    this.g = a[4];
    this.j = a[5];
    this.h = a[6];
    this.R = a[7];
    this.O = a[8];
    this.P = a[9];
    this.N = a[10];
    this.u = a[11];
    this.D = a[12];
    this.F = a[13];
    this.i = a[14];
    this.Ia = a[15];
    this.o = a[16];
    this.W = a[17];
    this.C = a[18];
    this.L = a[19];
    this.error = a[20];
    this.U = a[21]
};

function hd(a, b) {
    a[b >> 5] |= 1 << (b & 31)
}

function ed(a, b) {
    a[b >> 5] &= ~(1 << (b & 31))
}

function dd(a) {
    for (var b = 7; 0 <= b; b--) {
        var c = a[b];
        if (c) return ob(c >>> 0) | b << 5
    }
    return -1
};

function id(a) {
    this.s = a;
    this.g = new Int32Array(24);
    this.o = new Int32Array(24);
    for (var b = 0; b < this.g.length; b++) this.g[b] = 65536;
    this.i = this.h = this.l = this.j = 0;
    hb(a.A, 4273995776, 131072, c => {
        c = c - 4273995776 | 0;
        return 16 <= c && 20 > c ? (c -= 16, this.read(this.j) >> 8 * c & 255) : 0
    }, () => {}, c => {
        c = c - 4273995776 | 0;
        return 0 === c ? this.j : 16 === c ? this.read(this.j) : 0
    }, (c, e) => {
        c = c - 4273995776 | 0;
        0 === c ? this.j = e : 16 === c && this.write(this.j, e)
    })
}

function fd(a, b) {
    var c = 1 << b;
    if (0 !== (a.h & c)) {
        var e = a.g[b];
        if (0 === (e & 65536)) {
            var d = e >> 8 & 7;
            if (0 === (e & 32768)) a.h &= ~c;
            else if (a.g[b] |= 16384, e & 16384) return;
            0 !== d && 1 !== d || gd(a.s.B.Ed, e & 255, d, 32768 === (e & 32768));
            a.g[b] &= -4097
        }
    }
}
id.prototype.read = function(a) {
    if (0 === a) return this.l << 24;
    if (1 === a) return 1507345;
    if (2 === a) return this.l << 24;
    if (16 <= a && 64 > a) {
        var b = a - 16 >> 1;
        return a & 1 ? this.o[b] : this.g[b]
    }
    return 0
};
id.prototype.write = function(a, b) {
    if (0 === a) this.l = b >>> 24 & 15;
    else if (1 !== a && 2 !== a && 16 <= a && 64 > a) {
        var c = a - 16 >> 1;
        a & 1 ? this.o[c] = b & 4278190080 : (this.g[c] = b & 110591 | this.g[c] & -110592, fd(this, c))
    }
};
id.prototype.aa = function() {
    var a = [];
    a[0] = this.g;
    a[1] = this.o;
    a[2] = this.j;
    a[3] = this.l;
    a[4] = this.h;
    a[5] = this.i;
    return a
};
id.prototype.I = function(a) {
    this.g = a[0];
    this.o = a[1];
    this.j = a[2];
    this.l = a[3];
    this.h = a[4];
    this.i = a[5]
};

function jd(a) {
    this.message = a
}
jd.prototype = Error();
const kd = {
    Uint8Array,
    Int8Array,
    Uint16Array,
    Int16Array,
    Uint32Array,
    Int32Array,
    Float32Array,
    Float64Array
};

function ld(a, b) {
    if ("object" !== typeof a || null === a) return a;
    if (a instanceof Array) return a.map(d => ld(d, b));
    a.constructor === Object && console.log(a);
    if (a.BYTES_PER_ELEMENT) {
        var c = new Uint8Array(a.buffer, a.byteOffset, a.length * a.BYTES_PER_ELEMENT);
        return {
            __state_type__: a.constructor.name.replace("bound ", ""),
            buffer_id: b.push(c) - 1
        }
    }
    a = a.aa();
    c = [];
    for (var e = 0; e < a.length; e++) c[e] = ld(a[e], b);
    return c
}

function md(a, b) {
    if ("object" !== typeof a || null === a) return a;
    if (a instanceof Array) {
        for (let c = 0; c < a.length; c++) a[c] = md(a[c], b);
        return a
    }
    return new kd[a.__state_type__](b[a.buffer_id])
}
jb.prototype.Ae = function() {
    for (var a = [], b = ld(this, a), c = [], e = 0, d = 0; d < a.length; d++) {
        var g = a[d].byteLength;
        c[d] = {
            offset: e,
            length: g
        };
        e += g;
        e = e + 3 & -4
    }
    d = JSON.stringify({
        buffer_infos: c,
        state: b
    });
    d = (new TextEncoder).encode(d);
    b = 16 + d.length;
    b = b + 3 & -4;
    g = b + e;
    e = new ArrayBuffer(g);
    var f = new Int32Array(e, 0, 4);
    (new Uint8Array(e, 16, d.length)).set(d);
    b = new Uint8Array(e, b);
    f[0] = -2039052682;
    f[1] = 6;
    f[2] = g;
    f[3] = d.length;
    for (d = 0; d < a.length; d++) b.set(a[d], c[d].offset);
    return e
};
jb.prototype.Rd = function(a) {
    function b(t, r) {
        const m = t.length;
        if (16 > m) throw new jd("Invalid length: " + m);
        t = new Int32Array(t.buffer, t.byteOffset, 4);
        if (-2039052682 !== t[0]) throw new jd("Invalid header: " + vb(t[0] >>> 0));
        if (6 !== t[1]) throw new jd("Version mismatch: dump=" + t[1] + " we=6");
        if (r && t[2] !== m) throw new jd("Length doesn't match header: real=" + m + " header=" + t[2]);
        return t[3]
    }

    function c(t) {
        t = (new TextDecoder).decode(t);
        return JSON.parse(t)
    }
    a = new Uint8Array(a);
    if (4247762216 === (new Uint32Array(a.buffer,
            0, 1))[0]) {
        var e = this.Zg(a.length);
        (new Uint8Array(this.ua.buffer, this.bh(e), a.length)).set(a);
        var d = this.Zd(e, 16),
            g = new Uint8Array(this.ua.buffer, d, 16),
            f = b(g, !1);
        this.$d(d, 16);
        d = this.Zd(e, f);
        g = new Uint8Array(this.ua.buffer, d, f);
        g = c(g);
        this.$d(d, f);
        d = g.state;
        var h = g.buffer_infos;
        g = [];
        f = 16 + f;
        for (var k of h) {
            h = (f + 3 & -4) - f;
            if (1048576 < k.length) {
                var l = this.Zd(e, h);
                this.$d(l, h);
                l = new Uint8Array(k.length);
                g.push(l.buffer);
                for (var n = 0; n < k.length;) {
                    const t = Math.min(k.length - n, 1048576),
                        r = this.Zd(e, t);
                    l.set(new Uint8Array(this.ua.buffer,
                        r, t), n);
                    this.$d(r, t);
                    n += t
                }
            } else l = this.Zd(e, h + k.length), n = l + h, g.push(this.ua.buffer.slice(n, n + k.length)), this.$d(l, h + k.length);
            f += h + k.length
        }
        d = md(d, g);
        this.I(d);
        this.ah(e)
    } else {
        k = b(a, !0);
        if (0 > k || k + 12 >= a.length) throw new jd("Invalid info block length: " + k);
        d = c(a.subarray(16, 16 + k));
        e = d.state;
        d = d.buffer_infos;
        let t = 16 + k;
        t = t + 3 & -4;
        k = d.map(r => {
            const m = t + r.offset;
            return a.buffer.slice(m, m + r.length)
        });
        e = md(e, k);
        this.I(e)
    }
};

function nd(a, b, c) {
    a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5] && (a[0] = c[0], a[1] = c[1], a[2] = c[2], a[3] = c[3], a[4] = c[4], a[5] = c[5]);
    a[6] === b[0] && a[7] === b[1] && a[8] === b[2] && a[9] === b[3] && a[10] === b[4] && a[11] === b[5] && (a[6] = c[0], a[7] = c[1], a[8] = c[2], a[9] = c[3], a[10] = c[4], a[11] = c[5]);
    var e = a[12] << 8 | a[13];
    if (2048 === e) {
        if (a = a.subarray(14), 4 === a[0] >> 4 && 17 === a[9] && (a = a.subarray(20), e = a[2] << 8 | a[3], 67 === (a[0] << 8 | a[1]) || 67 === e)) {
            const d = a.subarray(8);
            if (1669485411 === (d[236] << 24 | d[237] <<
                    16 | d[238] << 8 | d[239]))
                for (d[28] === b[0] && d[29] === b[1] && d[30] === b[2] && d[31] === b[3] && d[32] === b[4] && d[33] === b[5] && (d[28] = c[0], d[29] = c[1], d[30] = c[2], d[31] = c[3], d[32] = c[4], d[33] = c[5], a[6] = a[7] = 0), e = 240; e < d.length;) {
                    const g = d[e++];
                    if (255 === g) break;
                    const f = d[e++];
                    61 === g && 1 === d[e + 0] && d[e + 1] === b[0] && d[e + 2] === b[1] && d[e + 3] === b[2] && d[e + 4] === b[3] && d[e + 5] === b[4] && d[e + 6] === b[5] && (d[e + 1] = c[0], d[e + 2] = c[1], d[e + 3] = c[2], d[e + 4] = c[3], d[e + 5] = c[4], d[e + 6] = c[5], a[6] = a[7] = 0);
                    e += f
                }
        }
    } else 2054 === e && (a = a.subarray(14), a[8] === b[0] &&
        a[9] === b[1] && a[10] === b[2] && a[11] === b[3] && a[12] === b[4] && a[13] === b[5] && (a[8] = c[0], a[9] = c[1], a[10] = c[2], a[11] = c[3], a[12] = c[4], a[13] = c[5]))
}

function od(a, b, c, e) {
    this.s = a;
    this.Ja = a.B.Ja;
    this.ef = c;
    this.ib = e;
    this.v = b;
    this.v.register("net0-receive", function(d) {
        if (!(this.Ma & 1) && (this.v.send("eth-receive-end", [d.length]), this.Sd & 16 || this.Sd & 4 && 255 === d[0] && 255 === d[1] && 255 === d[2] && 255 === d[3] && 255 === d[4] && 255 === d[5] || !(this.Sd & 8 && 1 === (d[0] & 1) || d[0] !== this.qa[0] || d[1] !== this.qa[1] || d[2] !== this.qa[2] || d[3] !== this.qa[3] || d[4] !== this.qa[4] || d[5] !== this.qa[5]))) {
            this.re && (d = new Uint8Array(d), nd(d, this.qa, this.re));
            var g = this.xb << 8,
                f = Math.max(60, d.length) +
                4,
                h = g + 4,
                k = this.xb + 1 + (f >> 8);
            if (!((this.vc > this.xb ? this.vc - this.xb : this.Va - this.xb + this.vc - this.Nb) < 1 + (f >> 8) && 0 !== this.vc)) {
                if (g + f > this.Va << 8) {
                    var l = (this.Va << 8) - h;
                    this.memory.set(d.subarray(0, l), h);
                    this.memory.set(d.subarray(l), this.Nb << 8)
                } else this.memory.set(d, h), 60 > d.length && this.memory.fill(0, h + d.length, h + 60);
                k >= this.Va && (k += this.Nb - this.Va);
                this.memory[g] = 1;
                this.memory[g + 1] = k;
                this.memory[g + 2] = f;
                this.memory[g + 3] = f >> 8;
                this.xb = k;
                pd(this, 1)
            }
        }
    }, this);
    this.port = 768;
    this.name = "ne2k";
    this.K = [236, 16, 41,
        128, 3, 1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, this.port & 255 | 1, this.port >> 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 244, 26, 0, 17, 0, 0, 184, 254, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0
    ];
    this.Ka = 40;
    this.jb = [{
        size: 32
    }];
    this.Re = this.Ia = 0;
    this.Ma = 1;
    this.jf = this.Ad = this.ub = this.be = 0;
    this.memory = new Uint8Array(32768);
    this.Nf = this.Sd = 0;
    this.Mf = 1;
    this.qa = new Uint8Array([0, 34, 21, 255 * Math.random() | 0, 255 * Math.random() | 0, 255 * Math.random() | 0]);
    this.Kc = Uint8Array.of(255, 255, 255, 255, 255, 255, 255, 255);
    this.re = null;
    for (b = 0; 6 > b; b++) this.memory[b <<
        1] = this.memory[b << 1 | 1] = this.qa[b];
    this.memory[28] = this.memory[29] = 87;
    this.memory[30] = this.memory[31] = 87;
    this.sa = 0;
    this.Nb = 64;
    this.Va = 128;
    this.vc = this.xb = 76;
    b = a.A;
    M(b, this.port | 0, this, function() {
        return this.Ma
    });
    N(b, this.port | 0, this, function(d) {
        this.Ma = d;
        this.Ma & 1 || (d & 24 && 0 === this.ub && pd(this, 64), d & 4 && (d = this.jf << 8, d = this.memory.subarray(d, d + this.Ad), this.re && (d = new Uint8Array(d), nd(d, this.re, this.qa)), this.v.send("net0-send", d), this.v.send("eth-transmit-end", [d.length]), this.Ma &= -5, pd(this, 2)))
    });
    M(b, this.port | 13, this, function() {
        return 1 === T(this) ? this.Kc[5] : 0
    });
    M(b, this.port | 14, this, function() {
        return 1 === T(this) ? this.Kc[6] : 0
    }, function() {
        return 0
    });
    M(b, this.port | 15, this, function() {
        return 1 === T(this) ? this.Kc[7] : 0
    });
    M(b, this.port | 31, this, function() {
        pd(this, 128);
        return 0
    });
    N(b, this.port | 31, this, function() {});
    M(b, this.port | 1, this, function() {
        var d = T(this);
        return 0 === d ? this.Nb : 1 === d ? this.qa[0] : 2 === d ? this.Nb : 0
    });
    N(b, this.port | 1, this, function(d) {
        var g = T(this);
        0 === g ? this.Nb = d : 1 === g && (this.qa[0] = d)
    });
    M(b, this.port | 2, this, function() {
        var d = T(this);
        return 0 === d ? this.Va : 1 === d ? this.qa[1] : 2 === d ? this.Va : 0
    });
    N(b, this.port | 2, this, function(d) {
        var g = T(this);
        0 === g ? (d > this.memory.length >> 8 && (d = this.memory.length >> 8), this.Va = d) : 1 === g && (this.qa[1] = d)
    });
    M(b, this.port | 7, this, function() {
        var d = T(this);
        return 0 === d ? this.Ia : 1 === d ? this.xb : 0
    });
    N(b, this.port | 7, this, function(d) {
        var g = T(this);
        0 === g ? (this.Ia &= ~d, qd(this)) : 1 === g && (this.xb = d)
    });
    N(b, this.port | 13, this, function(d) {
        0 === T(this) && (this.Nf = d)
    });
    N(b, this.port | 14,
        this,
        function(d) {
            0 === T(this) && (this.be = d)
        });
    M(b, this.port | 10, this, function() {
        var d = T(this);
        return 0 === d ? 80 : 1 === d ? this.Kc[2] : 0
    });
    N(b, this.port | 10, this, function(d) {
        0 === T(this) && (this.ub = this.ub & 65280 | d & 255)
    });
    M(b, this.port | 11, this, function() {
        var d = T(this);
        return 0 === d ? 67 : 1 === d ? this.Kc[3] : 0
    });
    N(b, this.port | 11, this, function(d) {
        0 === T(this) && (this.ub = this.ub & 255 | d << 8 & 65280)
    });
    M(b, this.port | 8, this, function() {
        var d = T(this);
        return 0 === d ? this.sa & 255 : 1 === d ? this.Kc[0] : 0
    });
    N(b, this.port | 8, this, function(d) {
        0 ===
            T(this) && (this.sa = this.sa & 65280 | d & 255)
    });
    M(b, this.port | 9, this, function() {
        var d = T(this);
        return 0 === d ? this.sa >> 8 & 255 : 1 === d ? this.Kc[1] : 0
    });
    N(b, this.port | 9, this, function(d) {
        0 === T(this) && (this.sa = this.sa & 255 | d << 8 & 65280)
    });
    N(b, this.port | 15, this, function(d) {
        0 === T(this) && (this.Re = d, qd(this))
    });
    M(b, this.port | 3, this, function() {
        var d = T(this);
        return 0 === d ? this.vc : 1 === d ? this.qa[2] : 0
    });
    N(b, this.port | 3, this, function(d) {
        var g = T(this);
        0 === g ? this.vc = d : 1 === g && (this.qa[2] = d)
    });
    M(b, this.port | 4, this, function() {
        var d = T(this);
        return 0 === d ? this.Mf : 1 === d ? this.qa[3] : 0
    });
    N(b, this.port | 4, this, function(d) {
        var g = T(this);
        0 === g ? this.jf = d : 1 === g && (this.qa[3] = d)
    });
    M(b, this.port | 5, this, function() {
        var d = T(this);
        return 0 === d ? 0 : 1 === d ? this.qa[4] : 0
    });
    N(b, this.port | 5, this, function(d) {
        var g = T(this);
        0 === g ? this.Ad = this.Ad & -256 | d : 1 === g && (this.qa[4] = d)
    });
    M(b, this.port | 6, this, function() {
        var d = T(this);
        return 0 === d ? 0 : 1 === d ? this.qa[5] : 0
    });
    N(b, this.port | 6, this, function(d) {
        var g = T(this);
        0 === g ? this.Ad = this.Ad & 255 | d << 8 : 1 === g && (this.qa[5] = d)
    });
    M(b, this.port |
        12, this,
        function() {
            var d = T(this);
            return 0 === d ? 9 : 1 === d ? this.Kc[4] : 0
        });
    N(b, this.port | 12, this, function(d) {
        0 === T(this) && (this.Sd = d)
    });
    M(b, this.port | 16, this, this.Ph, this.$f, this.Oh);
    N(b, this.port | 16, this, this.ag, this.ag, this.Qh);
    Qb(a.B.Ja, this)
}
p = od.prototype;
p.aa = function() {
    var a = [];
    a[0] = this.Ia;
    a[1] = this.Re;
    a[2] = this.Ma;
    a[3] = this.be;
    a[4] = this.ub;
    a[5] = this.Ad;
    a[6] = this.jf;
    a[7] = this.sa;
    a[8] = this.Nb;
    a[9] = this.xb;
    a[10] = this.vc;
    a[11] = this.Va;
    a[12] = this.Sd;
    a[13] = this.Nf;
    a[14] = this.Mf;
    a[15] = this.qa;
    a[16] = this.memory;
    return a
};
p.I = function(a) {
    this.Ia = a[0];
    this.Re = a[1];
    this.Ma = a[2];
    this.be = a[3];
    this.ub = a[4];
    this.Ad = a[5];
    this.jf = a[6];
    this.sa = a[7];
    this.Nb = a[8];
    this.xb = a[9];
    this.vc = a[10];
    this.Va = a[11];
    this.Sd = a[12];
    this.Nf = a[13];
    this.Mf = a[14];
    this.ef ? (this.qa = a[15], this.memory = a[16]) : this.ib && (this.re = a[15], this.memory = a[16])
};

function pd(a, b) {
    a.Ia |= b;
    qd(a)
}

function qd(a) {
    a.Re & a.Ia ? a.Ja.Ca(a.Ka) : jc(a.Ja, a.Ka)
}

function rd(a, b) {
    if (16 >= a.sa || 16384 <= a.sa && 32768 > a.sa) a.memory[a.sa] = b;
    a.sa++;
    a.ub--;
    a.sa >= a.Va << 8 && (a.sa += a.Nb - a.Va << 8);
    0 === a.ub && pd(a, 64)
}
p.ag = function(a) {
    rd(this, a);
    this.be & 1 && rd(this, a >> 8)
};
p.Qh = function(a) {
    rd(this, a);
    rd(this, a >> 8);
    rd(this, a >> 16);
    rd(this, a >> 24)
};

function sd(a) {
    let b = 0;
    32768 > a.sa && (b = a.memory[a.sa]);
    a.sa++;
    a.ub--;
    a.sa >= a.Va << 8 && (a.sa += a.Nb - a.Va << 8);
    0 === a.ub && pd(a, 64);
    return b
}
p.Ph = function() {
    return this.$f() & 255
};
p.$f = function() {
    return this.be & 1 ? sd(this) | sd(this) << 8 : sd(this)
};
p.Oh = function() {
    return sd(this) | sd(this) << 8 | sd(this) << 16 | sd(this) << 24
};

function T(a) {
    return a.Ma >> 6 & 3
};
var td = new Uint8Array(256),
    ud = [],
    vd = [],
    wd = [],
    xd = new Uint8Array(256),
    yd = [];

function zd(a, b) {
    this.s = a;
    this.v = b;
    this.Aa = new xb(64);
    this.ha = new xb(64);
    this.i = this.o = this.ob = this.L = 0;
    this.M = new Uint8Array(256);
    Ad(this);
    this.Jd = !1;
    this.De = 0;
    this.rb = this.qb = this.ad = this.jc = !1;
    this.yb = [new yb, new yb];
    this.eb = a.B.eb;
    this.fb = this.ic = this.j = this.Bb = this.l = this.D = 0;
    this.Cb = 1;
    this.$c = 5;
    this.Ab = !1;
    this.g = new ArrayBuffer(65536);
    this.Y = new Int8Array(this.g);
    this.C = new Uint8Array(this.g);
    this.W = new Int16Array(this.g);
    this.ca = new Uint16Array(this.g);
    this.Qa = new pb(this.g);
    this.Db = this.u = !1;
    this.$a = 22050;
    b.send("dac-tell-sampling-rate", this.$a);
    this.h = 1;
    this.O = 170;
    this.N = 0;
    this.Vc = new Uint8Array(256);
    this.F = new xb(64);
    this.R = this.P = this.Xa = 0;
    this.fi = !1;
    this.ea = 5;
    this.ed = new Uint8Array(16);
    a.A.vd(544, this, this.Cg, this.Eg, this.Gi, this.Ii);
    a.A.vd(904, this, this.Cg, this.Eg);
    a.A.vd(548, this, this.Ki, this.Mi);
    M(a.A, 550, this, this.Oi);
    M(a.A, 551, this, this.Qi);
    M(a.A, 552, this, this.Si);
    M(a.A, 553, this, this.Ui);
    M(a.A, 554, this, this.Wi);
    M(a.A, 555, this, this.Yi);
    M(a.A, 556, this, this.$i);
    M(a.A, 557, this,
        this.bj);
    a.A.vd(558, this, this.dj, this.fj);
    a.A.Ob(544, this, this.Dg, this.Fg, this.Hi, this.Ji);
    a.A.Ob(904, this, this.Dg, this.Fg);
    a.A.Ob(548, this, this.Li, this.Ni);
    N(a.A, 550, this, this.Pi);
    N(a.A, 551, this, this.Ri);
    a.A.Ob(552, this, this.Ti, this.Vi);
    N(a.A, 554, this, this.Xi);
    N(a.A, 555, this, this.Zi);
    N(a.A, 556, this, this.aj);
    N(a.A, 557, this, this.cj);
    N(a.A, 558, this, this.ej);
    N(a.A, 559, this, this.gj);
    a.A.vd(816, this, this.Mj, this.Oj);
    a.A.Ob(816, this, this.Nj, this.Pj);
    this.eb.kf.push({
        Qe: this.ma,
        Lf: this
    });
    b.register("dac-request-data",
        function() {
            !this.Bb || this.Db ? Bd(this) : Cd(this)
        }, this);
    b.register("speaker-has-initialized", function() {
        Ad(this)
    }, this);
    b.send("speaker-confirm-initialized");
    Dd(this)
}

function Dd(a) {
    a.Aa.clear();
    a.ha.clear();
    a.ob = 0;
    a.o = 0;
    a.Jd = !1;
    a.De = 0;
    a.jc = !1;
    a.ad = !1;
    a.qb = !1;
    a.rb = !1;
    a.yb[0].clear();
    a.yb[1].clear();
    a.D = 0;
    a.l = 0;
    a.Bb = 0;
    a.j = 0;
    a.ic = 0;
    a.fb = 0;
    a.Ab = !1;
    a.C.fill(0);
    a.u = !1;
    a.Db = !1;
    a.O = 170;
    a.N = 0;
    a.$a = 22050;
    a.h = 1;
    Ed(a, 1);
    a.ed.fill(0);
    a.Vc.fill(0);
    a.Vc[5] = 1;
    a.Vc[9] = 248
}
p = zd.prototype;
p.aa = function() {
    var a = [];
    a[2] = this.L;
    a[3] = this.ob;
    a[4] = this.o;
    a[5] = this.i;
    a[6] = this.M;
    a[7] = this.Jd;
    a[8] = this.De;
    a[9] = this.jc;
    a[10] = this.ad;
    a[11] = this.qb;
    a[12] = this.rb;
    a[15] = this.D;
    a[16] = this.l;
    a[17] = this.Bb;
    a[18] = this.j;
    a[19] = this.ic;
    a[20] = this.fb;
    a[21] = this.Cb;
    a[22] = this.$c;
    a[23] = this.Ab;
    a[24] = this.C;
    a[25] = this.u;
    a[26] = this.Db;
    a[27] = this.$a;
    a[28] = this.h;
    a[29] = this.O;
    a[30] = this.N;
    a[31] = this.Vc;
    a[33] = this.nb;
    a[34] = this.ea;
    a[35] = this.ed;
    return a
};
p.I = function(a) {
    this.L = a[2];
    this.ob = a[3];
    this.o = a[4];
    this.i = a[5];
    this.M = a[6];
    Fd(this);
    this.Jd = a[7];
    this.De = a[8];
    this.jc = a[9];
    this.ad = a[10];
    this.qb = a[11];
    this.rb = a[12];
    this.D = a[15];
    this.l = a[16];
    this.Bb = a[17];
    this.j = a[18];
    this.ic = a[19];
    this.fb = a[20];
    this.Cb = a[21];
    this.$c = a[22];
    this.Ab = a[23];
    this.C = a[24];
    this.u = a[25];
    this.Db = a[26];
    this.$a = a[27];
    this.h = a[28];
    this.O = a[29];
    this.N = a[30];
    this.Vc = a[31];
    this.nb = a[33];
    this.ea = a[34];
    this.ed = a[35];
    this.g = this.C.buffer;
    this.Y = new Int8Array(this.g);
    this.W = new Int16Array(this.g);
    this.ca = new Uint16Array(this.g);
    this.Qa = new pb(this.g);
    this.Db ? this.v.send("dac-disable") : this.v.send("dac-enable")
};
p.Cg = function() {
    return 255
};
p.Eg = function() {
    return 255
};
p.Gi = function() {
    return 255
};
p.Ii = function() {
    return 255
};
p.Ki = function() {
    return this.i
};
p.Mi = function() {
    var a = this.i,
        b = vd[a];
    return b ? b.call(this) : this.M[a]
};
p.Oi = function() {
    return 255
};
p.Qi = function() {
    return 255
};
p.Si = function() {
    return 255
};
p.Ui = function() {
    return 255
};
p.Wi = function() {
    this.ha.length && (this.L = this.ha.shift());
    return this.L
};
p.Yi = function() {
    return 255
};
p.$i = function() {
    return 127
};
p.bj = function() {
    return 255
};
p.dj = function() {
    this.ed[1] && Ed(this, 1);
    return (this.ha.length && !this.jc) << 7 | 127
};
p.fj = function() {
    Ed(this, 2);
    return 0
};
p.Dg = function() {
    this.P = 0
};
p.Fg = function(a) {
    var b = yd[this.P];
    b || (b = this.U);
    b.call(this, a, 0, this.P)
};
p.Hi = function() {
    this.R = 0
};
p.Ji = function(a) {
    var b = yd[this.R];
    b || (b = this.U);
    b.call(this, a, 1, this.R)
};
p.Li = function(a) {
    this.i = a
};
p.Ni = function(a) {
    Gd(this, this.i, a)
};
p.Pi = function(a) {
    this.jc ? this.jc = !1 : a && Dd(this);
    this.ha.clear();
    this.ha.push(170)
};
p.Ri = function() {};
p.Ti = function() {};
p.Vi = function() {};
p.Xi = function() {};
p.Zi = function() {};
p.aj = function(a) {
    0 === this.ob ? (this.ob = a, this.Aa.clear(), this.o = td[a]) : this.Aa.push(a);
    this.Aa.length >= this.o && (a = ud[this.ob], a || (a = this.eg), a.call(this), this.o = this.ob = 0, this.Aa.clear())
};
p.cj = function() {};
p.ej = function() {};
p.gj = function() {};
p.Mj = function() {
    this.F.length && (this.Xa = this.F.shift());
    return this.Xa
};
p.Nj = function() {};
p.Oj = function() {
    return 0 | 128 * !this.F.length
};
p.Pj = function(a) {
    255 == a && (this.F.clear(), this.F.push(254))
};
p.eg = function() {};

function U(a, b, c) {
    c || (c = zd.prototype.eg);
    for (var e = 0; e < a.length; e++) td[a[e]] = b, ud[a[e]] = c
}

function Hd(a) {
    for (var b = [], c = 0; 16 > c; c++) b.push(a + c);
    return b
}
U([14], 2, function() {
    this.Vc[this.Aa.shift()] = this.Aa.shift()
});
U([15], 1, function() {
    this.ha.clear();
    this.ha.push(this.Vc[this.Aa.shift()])
});
U([16], 1, function() {
    var a = this.Aa.shift();
    a = Id(a / 127.5 + -1);
    this.yb[0].push(a);
    this.yb[1].push(a);
    this.v.send("dac-enable")
});
U([20, 21], 2, function() {
    this.ic = 1;
    this.fb = this.Cb;
    this.jc = this.qb = this.rb = this.Ab = !1;
    Jd(this);
    Kd(this)
});
U([22], 2);
U([23], 2);
U([28], 0, function() {
    this.ic = 1;
    this.fb = this.Cb;
    this.Ab = !0;
    this.jc = this.qb = this.rb = !1;
    Kd(this)
});
U([31], 0);
U([32], 0, function() {
    this.ha.clear();
    this.ha.push(127)
});
U([36], 2);
U([44], 0);
U([48], 0);
U([49], 0);
U([52], 0);
U([53], 0);
U([54], 0);
U([55], 0);
U([56], 0);
U([64], 1, function() {
    Ld(this, 1E6 / (256 - this.Aa.shift()) / (this.ad ? 2 : 1))
});
U([65, 66], 2, function() {
    Ld(this, this.Aa.shift() << 8 | this.Aa.shift())
});
U([72], 2, function() {
    Jd(this)
});
U([116], 2);
U([117], 2);
U([118], 2);
U([119], 2);
U([125], 0);
U([127], 0);
U([128], 2);
U([144], 0, function() {
    this.ic = 1;
    this.fb = this.Cb;
    this.Ab = !0;
    this.rb = !1;
    this.jc = !0;
    this.qb = !1;
    Kd(this)
});
U([145], 0);
U([152], 0);
U([153], 0);
U([160], 0);
U([168], 0);
U(Hd(176), 3, function() {
    if (!(this.ob & 8)) {
        var a = this.Aa.shift();
        this.ic = 2;
        this.fb = this.$c;
        this.Ab = !!(this.ob & 4);
        this.rb = !!(a & 16);
        this.ad = !!(a & 32);
        this.qb = !0;
        Jd(this);
        Kd(this)
    }
});
U(Hd(192), 3, function() {
    if (!(this.ob & 8)) {
        var a = this.Aa.shift();
        this.ic = 1;
        this.fb = this.Cb;
        this.Ab = !!(this.ob & 4);
        this.rb = !!(a & 16);
        this.ad = !!(a & 32);
        this.qb = !1;
        Jd(this);
        Kd(this)
    }
});
U([208], 0, function() {
    this.Db = !0;
    this.v.send("dac-disable")
});
U([209], 0, function() {
    this.Jd = !0
});
U([211], 0, function() {
    this.Jd = !1
});
U([212], 0, function() {
    this.Db = !1;
    this.v.send("dac-enable")
});
U([213], 0, function() {
    this.Db = !0;
    this.v.send("dac-disable")
});
U([214], 0, function() {
    this.Db = !1;
    this.v.send("dac-enable")
});
U([216], 0, function() {
    this.ha.clear();
    this.ha.push(255 * this.Jd)
});
U([217, 218], 0, function() {
    this.Ab = !1
});
U([224], 1, function() {
    this.ha.clear();
    this.ha.push(~this.Aa.shift())
});
U([225], 0, function() {
    this.ha.clear();
    this.ha.push(4);
    this.ha.push(5)
});
U([226], 1);
U([227], 0, function() {
    this.ha.clear();
    for (var a = 0; 44 > a; a++) this.ha.push("COPYRIGHT (C) CREATIVE TECHNOLOGY LTD, 1992.".charCodeAt(a));
    this.ha.push(0)
});
U([228], 1, function() {
    this.De = this.Aa.shift()
});
U([232], 0, function() {
    this.ha.clear();
    this.ha.push(this.De)
});
U([242, 243], 0, function() {
    this.Ca()
});
var Md = new Uint8Array(256);
Md[14] = 255;
Md[15] = 7;
Md[55] = 56;
U([249], 1, function() {
    var a = this.Aa.shift();
    this.ha.clear();
    this.ha.push(Md[a])
});

function Gd(a, b, c) {
    (b = wd[b]) && b.call(a, c)
}
zd.prototype.Ra = function() {
    return this.M[this.i]
};
zd.prototype.mb = function(a) {
    this.M[this.i] = a
};

function Ad(a) {
    a.M[4] = 204;
    a.M[34] = 204;
    a.M[38] = 204;
    a.M[40] = 0;
    a.M[46] = 0;
    a.M[10] = 0;
    a.M[48] = 192;
    a.M[49] = 192;
    a.M[50] = 192;
    a.M[51] = 192;
    a.M[52] = 192;
    a.M[53] = 192;
    a.M[54] = 0;
    a.M[55] = 0;
    a.M[56] = 0;
    a.M[57] = 0;
    a.M[59] = 0;
    a.M[60] = 31;
    a.M[61] = 21;
    a.M[62] = 11;
    a.M[63] = 0;
    a.M[64] = 0;
    a.M[65] = 0;
    a.M[66] = 0;
    a.M[67] = 0;
    a.M[68] = 128;
    a.M[69] = 128;
    a.M[70] = 128;
    a.M[71] = 128;
    Fd(a)
}

function Fd(a) {
    for (var b = 1; b < a.M.length; b++) xd[b] || Gd(a, b, a.M[b])
}

function Nd(a, b) {
    b || (b = zd.prototype.Ra);
    vd[a] = b
}

function Od(a, b) {
    b || (b = zd.prototype.mb);
    wd[a] = b
}

function Pd(a, b, c) {
    xd[a] = 1;
    vd[a] = function() {
        return this.M[b] & 240 | this.M[c] >>> 4
    };
    wd[a] = function(e) {
        this.M[a] = e;
        var d = e << 4 & 240 | this.M[c] & 15;
        Gd(this, b, e & 240 | this.M[b] & 15);
        Gd(this, c, d)
    }
}

function Qd(a, b, c) {
    vd[a] = zd.prototype.Ra;
    wd[a] = function(e) {
        this.M[a] = e;
        this.v.send("mixer-volume", [b, c, (e >>> 2) - 62])
    }
}
Nd(0, function() {
    Ad(this);
    return 0
});
Od(0);
Pd(4, 50, 51);
Pd(34, 48, 49);
Pd(38, 52, 53);
Pd(40, 54, 55);
Pd(46, 56, 57);
Qd(48, 0, 0);
Qd(49, 0, 1);
Qd(50, 2, 0);
Qd(51, 2, 1);
Nd(59);
Od(59, function(a) {
    this.M[59] = a;
    this.v.send("mixer-volume", [1, 2, 6 * (a >>> 6) - 18])
});
Nd(65);
Od(65, function(a) {
    this.M[65] = a;
    this.v.send("mixer-gain-left", 6 * (a >>> 6))
});
Nd(66);
Od(66, function(a) {
    this.M[66] = a;
    this.v.send("mixer-gain-right", 6 * (a >>> 6))
});
Nd(68);
Od(68, function(a) {
    this.M[68] = a;
    a >>>= 3;
    this.v.send("mixer-treble-left", a - (16 > a ? 14 : 16))
});
Nd(69);
Od(69, function(a) {
    this.M[69] = a;
    a >>>= 3;
    this.v.send("mixer-treble-right", a - (16 > a ? 14 : 16))
});
Nd(70);
Od(70, function(a) {
    this.M[70] = a;
    a >>>= 3;
    this.v.send("mixer-bass-right", a - (16 > a ? 14 : 16))
});
Nd(71);
Od(71, function(a) {
    this.M[71] = a;
    a >>>= 3;
    this.v.send("mixer-bass-right", a - (16 > a ? 14 : 16))
});
Nd(128, function() {
    switch (this.ea) {
        case 2:
            return 1;
        case 5:
            return 2;
        case 7:
            return 4;
        case 10:
            return 8;
        default:
            return 0
    }
});
Od(128, function(a) {
    a & 1 && (this.ea = 2);
    a & 2 && (this.ea = 5);
    a & 4 && (this.ea = 7);
    a & 8 && (this.ea = 10)
});
Nd(129, function() {
    var a = 0;
    switch (this.Cb) {
        case 0:
            a |= 1;
            break;
        case 1:
            a |= 2;
            break;
        case 3:
            a |= 8
    }
    switch (this.$c) {
        case 5:
            a |= 32;
            break;
        case 6:
            a |= 64;
            break;
        case 7:
            a |= 128
    }
    return a
});
Od(129, function(a) {
    a & 1 && (this.Cb = 0);
    a & 2 && (this.Cb = 1);
    a & 8 && (this.Cb = 3);
    a & 32 && (this.$c = 5);
    a & 64 && (this.$c = 6);
    a & 128 && (this.$c = 7)
});
Nd(130, function() {
    for (var a = 32, b = 0; 16 > b; b++) a |= b * this.ed[b];
    return a
});
zd.prototype.U = function() {};

function Rd(a, b) {
    b || (b = zd.prototype.U);
    for (var c = 0; c < a.length; c++) yd[a[c]] = b
}

function Sd(a, b) {
    for (var c = []; a <= b; a++) c.push(a);
    return c
}
var W = new Uint8Array(32);
W[0] = 0;
W[1] = 1;
W[2] = 2;
W[3] = 3;
W[4] = 4;
W[5] = 5;
W[8] = 6;
W[9] = 7;
W[10] = 8;
W[11] = 9;
W[12] = 10;
W[13] = 11;
W[16] = 12;
W[17] = 13;
W[18] = 14;
W[19] = 15;
W[20] = 16;
W[21] = 17;
Rd([1], function(a, b) {
    this.fi[b] = a & 1
});
Rd([2]);
Rd([3]);
Rd([4], function() {});
Rd([5], function() {});
Rd([8], function() {});
Rd(Sd(32, 53), function() {});
Rd(Sd(64, 85), function() {});
Rd(Sd(96, 117), function() {});
Rd(Sd(128, 149), function() {});
Rd(Sd(160, 168), function() {});
Rd(Sd(176, 184), function() {});
Rd([189], function() {});
Rd(Sd(192, 200), function() {});
Rd(Sd(224, 245), function() {});

function Ld(a, b) {
    a.$a = b;
    a.v.send("dac-tell-sampling-rate", b)
}

function Jd(a) {
    a.D = 1 + (a.Aa.shift() << 0) + (a.Aa.shift() << 8)
}

function Kd(a) {
    a.h = 1;
    a.qb && (a.h *= 2);
    a.l = a.D * a.h;
    a.j = 1024 * a.h;
    a.j = Math.min(Math.max(a.l >> 2 & -4, 32), a.j);
    a.u = !0;
    a.eb.dc[a.fb] || a.ma(a.fb)
}
zd.prototype.ma = function(a) {
    a === this.fb && this.u && (this.u = !1, this.Bb = this.l, this.Db = !1, this.v.send("dac-enable"))
};

function Cd(a) {
    var b = Math.min(a.Bb, a.j),
        c = Math.floor(b / a.h);
    a.eb.he(a.Qa, 0, b, a.fb, e => {
        if (!e) {
            e = a.qb ? 32767.5 : 127.5;
            var d = a.rb ? 0 : -1,
                g = a.ad ? 1 : 2,
                f;
            a.qb ? f = a.rb ? a.W : a.ca : f = a.rb ? a.Y : a.C;
            for (var h = 0, k = 0; k < c; k++)
                for (var l = Id(f[k] / e + d), n = 0; n < g; n++) a.yb[h].push(l), h ^= 1;
            Bd(a);
            a.Bb -= b;
            a.Bb || (a.Ca(a.ic), a.Ab && (a.Bb = a.l))
        }
    })
}

function Bd(a) {
    if (a.yb[0].length) {
        var b = zb(a.yb[0], a.yb[0].length),
            c = zb(a.yb[1], a.yb[1].length);
        a.v.send("dac-send-data", [b, c], [b.buffer, c.buffer])
    }
}
zd.prototype.Ca = function(a) {
    this.ed[a] = 1;
    this.s.Ga(this.ea)
};

function Ed(a, b) {
    a.ed[b] = 0;
    R(a.s, a.ea)
}

function Id(a) {
    return -1 * (-1 > a) + 1 * (1 < a) + (-1 <= a && 1 >= a) * a
};

function ba(a, b) {
    this.s = a;
    this.Ja = a.B.Ja;
    this.Ne = b.Ne;
    this.K = [244, 26, b.Ne & 255, b.Ne >> 8, 7, 5, 16, 0, 1, 0, 2, 0, 0, 0, 0, 0, 1, 168, 0, 0, 0, 16, 191, 254, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 244, 26, b.Xg & 255, b.Xg >> 8, 0, 0, 0, 0, 64, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0];
    this.K = this.K.concat(Array(256 - this.K.length).fill(0));
    this.Ka = b.Ka;
    this.jb = [];
    this.name = b.name;
    this.i = this.u = 0;
    this.o = new Uint32Array(4);
    this.h = new Uint32Array(4);
    for (var c of b.Le.features) this.o[c >>> 5] |= 1 << (c & 31), this.h[c >>> 5] |= 1 << (c & 31);
    b.Le.features.includes(32);
    this.C = !0;
    this.j = 0;
    this.F = !1;
    this.D = 0;
    this.Wa = [];
    for (var e of b.Le.Wa) this.Wa.push(new Td(a, this, e));
    this.l = 0;
    this.g = this.Wa[0];
    this.oc = 0;
    c = [];
    c.push(Ud(this, b.Le));
    c.push(Vd(b.notification));
    c.push(Wd(this, b.oc));
    b.bg && (e = c.push, b = b.bg, b = {
        type: 4,
        Gd: 3,
        port: b.dd,
        Ee: !1,
        offset: 0,
        je: new Uint8Array(0),
        zd: b.zd
    }, e.call(c, b));
    Xd(this, c);
    Qb(a.B.Ja, this);
    this.reset()
}

function Ud(a, b) {
    return {
        type: 1,
        Gd: 0,
        port: b.dd,
        Ee: !1,
        offset: 0,
        je: new Uint8Array(0),
        zd: [{
            bytes: 4,
            name: "device_feature_select",
            read: () => a.u,
            write: c => {
                a.u = c
            }
        }, {
            bytes: 4,
            name: "device_feature",
            read: () => a.o[a.u] || 0,
            write: () => {}
        }, {
            bytes: 4,
            name: "driver_feature_select",
            read: () => a.i,
            write: c => {
                a.i = c
            }
        }, {
            bytes: 4,
            name: "driver_feature",
            read: () => a.h[a.i] || 0,
            write: c => {
                const e = a.o[a.i];
                a.i < a.h.length && (a.h[a.i] = c & e);
                a.C = a.C && !(c & ~e)
            }
        }, {
            bytes: 2,
            name: "msix_config",
            read: () => 65535,
            write: () => {}
        }, {
            bytes: 2,
            name: "num_queues",
            read: () => a.Wa.length,
            write: () => {}
        }, {
            bytes: 1,
            name: "device_status",
            read: () => a.j,
            write: c => {
                0 === c && a.reset();
                c & ~a.j & 4 && a.j & 64 && (a.F = !0, a.j & 4 && a.Ca(2));
                a.C || (c &= -9);
                a.j = c
            }
        }, {
            bytes: 1,
            name: "config_generation",
            read: () => a.D,
            write: () => {}
        }, {
            bytes: 2,
            name: "queue_select",
            read: () => a.l,
            write: c => {
                a.l = c;
                a.l < a.Wa.length ? a.g = a.Wa[a.l] : a.g = null
            }
        }, {
            bytes: 2,
            name: "queue_size",
            read: () => a.g ? a.g.size : 0,
            write: c => {
                if (a.g) {
                    c & c - 1 && (c = 1 << ob(c - 1) + 1);
                    c > a.g.Tc && (c = a.g.Tc);
                    var e = a.g;
                    e.size = c;
                    e.o = c - 1
                }
            }
        }, {
            bytes: 2,
            name: "queue_msix_vector",
            read: () => 65535,
            write: () => {}
        }, {
            bytes: 2,
            name: "queue_enable",
            read: () => a.g ? a.g.enabled | 0 : 0,
            write: c => {
                a.g && 1 === c && (c = a.g, c.l && c.h && c.g && (a.g.enabled = !0))
            }
        }, {
            bytes: 2,
            name: "queue_notify_off",
            read: () => a.g ? a.g.ue : 0,
            write: () => {}
        }, {
            bytes: 4,
            name: "queue_desc (low dword)",
            read: () => a.g ? a.g.l : 0,
            write: c => {
                a.g && (a.g.l = c)
            }
        }, {
            bytes: 4,
            name: "queue_desc (high dword)",
            read: () => 0,
            write: () => {}
        }, {
            bytes: 4,
            name: "queue_avail (low dword)",
            read: () => a.g ? a.g.h : 0,
            write: c => {
                a.g && (a.g.h = c)
            }
        }, {
            bytes: 4,
            name: "queue_avail (high dword)",
            read: () => 0,
            write: () => {}
        }, {
            bytes: 4,
            name: "queue_used (low dword)",
            read: () => a.g ? a.g.g : 0,
            write: c => {
                a.g && (a.g.g = c)
            }
        }, {
            bytes: 4,
            name: "queue_used (high dword)",
            read: () => 0,
            write: () => {}
        }]
    }
}

function Vd(a) {
    const b = [];
    let c;
    c = a.ek ? 0 : 2;
    for (const [e, d] of a.ki.entries()) b.push({
        bytes: 2,
        name: "notify" + e,
        read: () => 65535,
        write: d || (() => {})
    });
    return {
        type: 2,
        Gd: 1,
        port: a.dd,
        Ee: !1,
        offset: 0,
        je: new Uint8Array([c & 255, c >> 8 & 255, c >> 16 & 255, c >> 24]),
        zd: b
    }
}

function Wd(a, b) {
    return {
        type: 3,
        Gd: 2,
        port: b.dd,
        Ee: !1,
        offset: 0,
        je: new Uint8Array(0),
        zd: [{
            bytes: 1,
            name: "isr_status",
            read: () => {
                const c = a.oc;
                a.oc = 0;
                jc(a.Ja, a.Ka);
                return c
            },
            write: () => {}
        }]
    }
}

function Xd(a, b) {
    let c = a.K[52] = 64;
    var e = c;
    for (const g of b) {
        b = 16 + g.je.length;
        e = c;
        c = e + b;
        var d = g.zd.reduce((f, h) => f + h.bytes, 0);
        d += g.offset;
        d = 16 > d ? 16 : 1 << ob(d - 1) + 1;
        a.jb[g.Gd] = {
            size: d
        };
        a.K[e] = 9;
        a.K[e + 1] = c;
        a.K[e + 2] = b;
        a.K[e + 3] = g.type;
        a.K[e + 4] = g.Gd;
        a.K[e + 5] = 0;
        a.K[e + 6] = 0;
        a.K[e + 7] = 0;
        a.K[e + 8] = g.offset & 255;
        a.K[e + 9] = g.offset >>> 8 & 255;
        a.K[e + 10] = g.offset >>> 16 & 255;
        a.K[e + 11] = g.offset >>> 24;
        a.K[e + 12] = d & 255;
        a.K[e + 13] = d >>> 8 & 255;
        a.K[e + 14] = d >>> 16 & 255;
        a.K[e + 15] = d >>> 24;
        for (const [f, h] of g.je.entries()) a.K[e + 16 + f] = h;
        e = 16 + 4 *
            g.Gd;
        a.K[e] = g.port & 254 | !g.Ee;
        a.K[e + 1] = g.port >>> 8 & 255;
        a.K[e + 2] = g.port >>> 16 & 255;
        a.K[e + 3] = g.port >>> 24 & 255;
        e = g.port + g.offset;
        for (const f of g.zd) {
            let h = f.read;
            b = f.write;
            if (!g.Ee) {
                d = function(l) {
                    return h(l & -2) >> ((l & 1) << 3) & 255
                };
                const k = function(l) {
                    return h(l & -4) >> ((l & 3) << 3) & 255
                };
                switch (f.bytes) {
                    case 4:
                        M(a.s.A, e, a, k, void 0, h);
                        N(a.s.A, e, a, void 0, void 0, b);
                        break;
                    case 2:
                        M(a.s.A, e, a, d, h);
                        N(a.s.A, e, a, void 0, b);
                        break;
                    case 1:
                        M(a.s.A, e, a, h), N(a.s.A, e, a, b)
                }
            }
            e += f.bytes
        }
    }
    a.K[c] = 9;
    a.K[c + 1] = 0;
    a.K[c + 2] = 20;
    a.K[c + 3] = 5;
    a.K[c +
        4] = 0;
    a.K[c + 5] = 0;
    a.K[c + 6] = 0;
    a.K[c + 7] = 0;
    a.K[c + 8] = 0;
    a.K[c + 9] = 0;
    a.K[c + 10] = 0;
    a.K[c + 11] = 0;
    a.K[c + 12] = 0;
    a.K[c + 13] = 0;
    a.K[c + 14] = 0;
    a.K[c + 15] = 0;
    a.K[c + 16] = 0;
    a.K[c + 17] = 0;
    a.K[c + 18] = 0;
    a.K[c + 19] = 0
}
ba.prototype.aa = function() {
    let a = [];
    a[0] = this.u;
    a[1] = this.i;
    a[2] = this.o;
    a[3] = this.h;
    a[4] = this.C;
    a[5] = this.j;
    a[6] = this.F;
    a[7] = this.D;
    a[8] = this.oc;
    a[9] = this.l;
    return a = a.concat(this.Wa)
};
ba.prototype.I = function(a) {
    this.u = a[0];
    this.i = a[1];
    this.o = a[2];
    this.h = a[3];
    this.C = a[4];
    this.j = a[5];
    this.F = a[6];
    this.D = a[7];
    this.oc = a[8];
    this.l = a[9];
    let b = 0;
    for (let c of a.slice(10)) this.Wa[b].I(c), b++;
    this.g = this.Wa[this.l] || null
};
ba.prototype.reset = function() {
    this.i = this.u = 0;
    this.h.set(this.o);
    this.C = !0;
    this.l = this.j = 0;
    this.g = this.Wa[0];
    for (const a of this.Wa) a.reset();
    this.F = !1;
    this.oc = this.D = 0;
    jc(this.Ja, this.Ka)
};
ba.prototype.Ca = function(a) {
    this.oc |= a;
    this.Ja.Ca(this.Ka)
};

function Td(a, b, c) {
    this.s = a;
    this.cb = b;
    this.Tc = this.size = c.Tc;
    this.o = this.size - 1;
    this.enabled = !1;
    this.ue = c.ue;
    this.i = this.g = this.j = this.h = this.l = 0;
    this.reset()
}
Td.prototype.aa = function() {
    const a = [];
    a[0] = this.size;
    a[1] = this.Tc;
    a[2] = this.enabled;
    a[3] = this.ue;
    a[4] = this.l;
    a[5] = this.h;
    a[6] = this.j;
    a[7] = this.g;
    a[8] = this.i;
    return a
};
Td.prototype.I = function(a) {
    this.size = a[0];
    this.Tc = a[1];
    this.enabled = a[2];
    this.ue = a[3];
    this.l = a[4];
    this.h = a[5];
    this.j = a[6];
    this.g = a[7];
    this.i = a[8];
    this.o = this.size - 1
};
Td.prototype.reset = function() {
    this.enabled = !1;
    this.i = this.g = this.j = this.h = this.l = 0;
    var a = this.Tc;
    this.size = a;
    this.o = a - 1
};

function ca(a) {
    return (a.s.Oa(a.h + 2) & a.o) !== a.j
}

function ia(a, b) {
    this.s = a.s;
    this.cb = a.cb;
    this.li = b;
    this.i = [];
    this.uf = this.g = this.h = 0;
    this.Uf = [];
    this.vf = this.He = this.Tf = 0;
    let c = a.l;
    var e = b;
    b = 0;
    let d = a.size,
        g = !1;
    const f = 0 < (this.cb.h[0] & 268435456);
    do {
        var h = a,
            k = c;
        h = {
            mf: h.s.g(k + 16 * e),
            wk: h.s.g(k + 16 * e + 4),
            Te: h.s.g(k + 16 * e + 8),
            flags: h.s.Oa(k + 16 * e + 12),
            next: h.s.Oa(k + 16 * e + 14)
        };
        if (f && h.flags & 4) c = h.mf, b = e = 0, d = h.Te / 16;
        else {
            if (h.flags & 2) g = !0, this.Uf.push(h);
            else {
                if (g) break;
                this.i.push(h);
                this.uf += h.Te
            }
            b++;
            if (b > d) break;
            if (h.flags & 1) e = h.next;
            else break
        }
    } while (1)
}

function ma(a, b) {
    let c = 0,
        e = b.length;
    for (; e && a.h !== a.i.length;) {
        var d = a.i[a.h],
            g = d.mf + a.g;
        let l = d.Te - a.g;
        l > e ? (l = e, a.g += e) : (a.h++, a.g = 0);
        d = b;
        var f = d.set,
            h = a.s,
            k = l;
        k && (h.Se(g), h.Se(g + k - 1));
        f.call(d, h.Na.subarray(g, g + k), c);
        c += l;
        e -= l
    }
};

function Yd() {
    this.pe = {};
    this.g = void 0
}
Yd.prototype.register = function(a, b, c) {
    var e = this.pe[a];
    void 0 === e && (e = this.pe[a] = []);
    e.push({
        Qe: b,
        Lf: c
    })
};
Yd.prototype.unregister = function(a, b) {
    var c = this.pe[a];
    void 0 !== c && (this.pe[a] = c.filter(function(e) {
        return e.Qe !== b
    }))
};
Yd.prototype.send = function(a, b) {
    if (this.g && (a = this.g.pe[a], void 0 !== a))
        for (var c = 0; c < a.length; c++) {
            var e = a[c];
            e.Qe.call(e.Lf, b)
        }
};

function Zd() {
    var a = new Yd,
        b = new Yd;
    a.g = b;
    b.g = a;
    return [a, b]
};

function $d() {};

function jb(a, b) {
    this.va = b;
    ae(this);
    b = Object.create(null);
    b.m = this.va.exports.memory;
    for (var c of Object.keys(this.va.exports)) c.startsWith("_") || c.startsWith("zstd") || c.endsWith("_js") || (b[c] = this.va.exports[c]);
    this.dh = b;
    this.ua = c = this.va.exports.memory;
    this.G = O(Uint32Array, c, 812, 1);
    this.Na = new Uint8Array(0);
    this.Dc = new Int32Array(this.Na.buffer);
    this.ca = O(Uint8Array, c, 724, 8);
    this.Qa = O(Int32Array, c, 736, 8);
    this.ma = O(Uint32Array, c, 768, 8);
    this.W = O(Int32Array, c, 800, 1);
    this.ac = O(Int32Array, c, 564, 1);
    this.$b = O(Int32Array, c, 568, 1);
    this.Xb = O(Int32Array, c, 572, 1);
    this.Wb = O(Int32Array, c, 576, 1);
    this.Qg = O(Int32Array, c, 1128, 1);
    this.Ec = O(Uint32Array, c, 540, 8);
    this.Ma = O(Int32Array, c, 580, 8);
    this.nb = O(Uint8Array, c, 612, 1);
    this.R = O(Int32Array, c, 804, 1);
    this.Xa = O(Int32Array, c, 808, 1);
    this.cc = O(Uint8Array, c, 616, 1);
    this.Bc = O(Int32Array, c, 620, 1);
    this.Tb = O(Int32Array, c, 624, 1);
    this.tg = O(Int32Array, c, 636, 1);
    this.Pg = O(Int32Array, c, 640, 1);
    this.vg = O(Int32Array, c, 644, 1);
    this.Fc = O(Int32Array, c, 648, 1);
    this.flags = O(Int32Array,
        c, 120, 1);
    this.Ub = O(Int32Array, c, 100, 1);
    this.zc = O(Int32Array, c, 96, 1);
    this.xc = O(Int32Array, c, 104, 1);
    O(Int32Array, c, 112, 1);
    this.jk = O(Uint32Array, c, 960, 2);
    this.B = {};
    this.l = O(Int32Array, c, 556, 1);
    this.Hc = O(Int32Array, c, 560, 1);
    O(Uint8Array, c, 548, 1);
    this.mb = O(Uint8Array, c, 552, 1);
    this.h = [];
    this.j = [];
    this.U = [];
    this.i = [];
    this.uc = {
        qg: null,
        Yd: null
    };
    this.pi = O(Uint32Array, c, 664, 1);
    this.o = O(Int32Array, c, 64, 8);
    this.Vb = O(Int32Array, c, 1152, 32);
    this.O = O(Uint8Array, c, 816, 1);
    this.O[0] = 255;
    this.P = O(Uint8Array, c, 1032, 1);
    this.P[0] = 0;
    this.u = O(Uint16Array, c, 1036, 1);
    this.u[0] = 895;
    this.mk = O(Uint16Array, c, 1040, 1);
    this.mk[0] = 0;
    this.F = O(Int32Array, c, 1048, 1);
    this.F[0] = 0;
    this.L = O(Int32Array, c, 1052, 1);
    this.L[0] = 0;
    this.N = O(Int32Array, c, 1044, 1);
    this.N[0] = 0;
    this.C = O(Int32Array, c, 1056, 1);
    this.C[0] = 0;
    this.D = O(Int32Array, c, 1060, 1);
    this.D[0] = 0;
    this.gd = O(Int32Array, c, 832, 32);
    O(Int32Array, c, 824, 1);
    this.Ra = O(Uint16Array, c, 668, 8);
    this.Sb = O(Int32Array, c, 684, 8);
    this.Ic = O(Int32Array, c, 968, 8);
    this.zh = O(Uint32Array, c, 716, 1);
    this.yh = O(Uint32Array,
        c, 720, 1);
    this.Za = [];
    this.sf = 0;
    this.ld = [];
    this.A = void 0;
    this.v = a;
    this.Nd(0, 0);
    be(this)
}

function ae(a) {
    const b = c => {
        const e = a.va.exports[c];
        console.assert(e, "Missing import: " + c);
        return e
    };
    a.Y = b("reset_cpu");
    b("getiopl");
    b("get_eflags");
    a.rk = b("handle_irqs");
    a.eh = b("main_loop");
    a.uh = b("set_jit_config");
    a.ud = b("read8");
    a.Oa = b("read16");
    a.g = b("read32s");
    a.lf = b("write8");
    a.Ge = b("write16");
    a.Uc = b("write32");
    a.Se = b("in_mapped_range");
    b("fpu_load_tag_word");
    b("fpu_load_status_word");
    b("fpu_get_sti_f64");
    b("translate_address_system_read_js");
    a.Rb = b("get_seg_cs");
    b("get_real_eip");
    b("clear_tlb");
    a.qk = b("full_clear_tlb");
    a.Sg = b("update_state_flags");
    a.Nd = b("set_tsc");
    a.vh = b("store_current_tsc");
    a.th = b("set_cpuid_level");
    a.gh = b("pic_set_irq");
    a.fh = b("pic_clear_irq");
    a.sk = b("jit_clear_cache_js");
    a.ri = b("jit_dirty_cache");
    a.hk = b("codegen_finalize_finished");
    a.gk = b("allocate_memory");
    a.Ch = b("zero_memory");
    a.xh = b("svga_allocate_memory");
    a.wh = b("svga_allocate_dest_buffer");
    a.Ah = b("svga_fill_pixel_buffer");
    a.se = b("svga_mark_dirty");
    a.Yb = b("get_pic_addr_master");
    a.Zb = b("get_pic_addr_slave");
    a.Zg =
        b("zstd_create_ctx");
    a.bh = b("zstd_get_src_ptr");
    a.ah = b("zstd_free_ctx");
    a.Zd = b("zstd_read");
    a.$d = b("zstd_read_free");
    a.hh = b("port20_read");
    a.jh = b("port21_read");
    a.ph = b("portA0_read");
    a.rh = b("portA1_read");
    a.ih = b("port20_write");
    a.kh = b("port21_write");
    a.qh = b("portA0_write");
    a.sh = b("portA1_write");
    a.lh = b("port4D0_read");
    a.nh = b("port4D1_read");
    a.mh = b("port4D0_write");
    a.oh = b("port4D1_write")
}
jb.prototype.aa = function() {
    var a = [];
    a[0] = this.G[0];
    a[1] = this.ca;
    a[2] = this.Qa;
    a[3] = this.ma;
    a[4] = this.W[0];
    a[5] = this.$b[0];
    a[6] = this.ac[0];
    a[7] = this.Wb[0];
    a[8] = this.Xb[0];
    a[9] = this.Ec[0];
    a[10] = this.Ma;
    a[11] = this.nb[0];
    a[13] = this.R[0];
    a[16] = this.Xa[0];
    a[17] = this.cc[0];
    a[18] = this.Bc[0];
    a[19] = this.Tb[0];
    a[22] = this.tg[0];
    a[23] = this.vg[0];
    a[24] = this.Pg[0];
    a[25] = this.Fc[0];
    a[26] = this.flags[0];
    a[27] = this.Ub[0];
    a[28] = this.xc[0];
    a[30] = this.zc[0];
    a[37] = this.l[0];
    a[38] = this.Hc[0];
    a[39] = this.o;
    a[40] = this.Ra;
    a[41] =
        this.Sb;
    a[42] = this.Ic;
    this.vh();
    a[43] = this.jk;
    a[45] = this.B.Rf;
    a[46] = this.B.Ed;
    a[47] = this.B.Rc;
    a[48] = this.B.Ja;
    a[49] = this.B.eb;
    a[50] = this.B.ta;
    a[52] = this.B.Yd;
    a[53] = this.B.Af;
    a[54] = this.B.Of;
    a[55] = this.B.cd;
    a[56] = this.B.X;
    a[57] = this.B.H;
    a[58] = this.B.$e;
    a[59] = this.B.xf;
    var b = new Uint8Array(this.ua.buffer, this.Yb(), 13),
        c = new Uint8Array(this.ua.buffer, this.Zb(), 13),
        e = [],
        d = [];
    e[0] = b[0];
    e[1] = b[1];
    e[2] = b[2];
    e[3] = b[3];
    e[4] = b[4];
    e[5] = d;
    e[6] = b[6];
    e[7] = b[7];
    e[8] = b[8];
    e[9] = b[9];
    e[10] = b[10];
    e[11] = b[11];
    e[12] =
        b[12];
    d[0] = c[0];
    d[1] = c[1];
    d[2] = c[2];
    d[3] = c[3];
    d[4] = c[4];
    d[5] = null;
    d[6] = c[6];
    d[7] = c[7];
    d[8] = c[8];
    d[9] = c[9];
    d[10] = c[10];
    d[12] = c[12];
    d[12] = c[12];
    a[60] = e;
    a[61] = this.B.Ef;
    a[62] = this.Za;
    a[63] = this.B.Gc;
    a[64] = this.Qg[0];
    a[66] = this.gd;
    a[67] = this.Vb;
    a[68] = this.O[0];
    a[69] = this.P[0];
    a[70] = this.u[0];
    a[71] = this.F[0];
    a[72] = this.L[0];
    a[73] = this.C[0];
    a[74] = this.D[0];
    a[75] = this.N[0];
    c = this.Na.length >> 12;
    b = [];
    for (e = 0; e < c; e++) {
        d = e << 12;
        d = this.Dc.subarray(d >> 2, d + 4096 >> 2);
        let h = !0;
        for (let k = 0; k < d.length; k++)
            if (0 !== d[k]) {
                h = !1;
                break
            } h || b.push(e)
    }
    c = new Ab(c);
    e = new Uint8Array(b.length << 12);
    for (let [h, k] of b.entries()) c.set(k, 1), b = k << 12, e.set(this.Na.subarray(b, b + 4096), h << 12);
    const {
        Ai: g,
        Fh: f
    } = {
        Fh: c,
        Ai: e
    };
    a[77] = g;
    a[78] = new Uint8Array(f.sb());
    a[79] = this.B.Vd;
    a[80] = this.B.Wd;
    a[81] = this.B.Xd;
    return a
};
jb.prototype.I = function(a) {
    this.G[0] = a[0];
    this.Na.length !== this.G[0] && console.warn("Note: Memory size mismatch. we=" + this.Na.length + " state=" + this.G[0]);
    this.ca.set(a[1]);
    this.Qa.set(a[2]);
    this.ma.set(a[3]);
    this.W[0] = a[4];
    this.$b[0] = a[5];
    this.ac[0] = a[6];
    this.Wb[0] = a[7];
    this.Xb[0] = a[8];
    this.Ec[0] = a[9];
    this.Ma.set(a[10]);
    this.nb[0] = a[11];
    this.R[0] = a[13];
    this.Xa[0] = a[16];
    this.cc[0] = a[17];
    this.Bc[0] = a[18];
    this.Tb[0] = a[19];
    this.tg[0] = a[22];
    this.vg[0] = a[23];
    this.Pg[0] = a[24];
    this.Fc[0] = a[25];
    this.flags[0] =
        a[26];
    this.Ub[0] = a[27];
    this.xc[0] = a[28];
    this.zc[0] = a[30];
    this.l[0] = a[37];
    this.Hc[0] = a[38];
    this.o.set(a[39]);
    this.Ra.set(a[40]);
    this.Sb.set(a[41]);
    a[42] && this.Ic.set(a[42]);
    this.Nd(a[43][0], a[43][1]);
    this.B.Rf && this.B.Rf.I(a[45]);
    this.B.Ed && this.B.Ed.I(a[46]);
    this.B.Rc && this.B.Rc.I(a[47]);
    this.B.Ja && this.B.Ja.I(a[48]);
    this.B.eb && this.B.eb.I(a[49]);
    this.B.ta && this.B.ta.I(a[50]);
    this.B.Yd && this.B.Yd.I(a[52]);
    this.B.Af && this.B.Af.I(a[53]);
    this.B.Of && this.B.Of.I(a[54]);
    this.B.cd && this.B.cd.I(a[55]);
    this.B.X &&
        this.B.X.I(a[56]);
    this.B.H && this.B.H.I(a[57]);
    this.B.$e && this.B.$e.I(a[58]);
    this.B.xf && this.B.xf.I(a[59]);
    var b = a[60],
        c = new Uint8Array(this.ua.buffer, this.Yb(), 13),
        e = new Uint8Array(this.ua.buffer, this.Zb(), 13);
    c[0] = b[0];
    c[1] = b[1];
    c[2] = b[2];
    c[3] = b[3];
    c[4] = b[4];
    var d = b[5];
    c[6] = b[6];
    c[7] = b[7];
    c[8] = b[8];
    c[9] = b[9];
    c[10] = b[10];
    c[11] = b[11];
    c[12] = b[12];
    e[0] = d[0];
    e[1] = d[1];
    e[2] = d[2];
    e[3] = d[3];
    e[4] = d[4];
    e[6] = d[6];
    e[7] = d[7];
    e[8] = d[8];
    e[9] = d[9];
    e[10] = d[10];
    e[12] = d[12];
    e[12] = d[12];
    this.B.Ef && this.B.Ef.I(a[61]);
    this.B.Vd && this.B.Vd.I(a[79]);
    this.B.Wd && this.B.Wd.I(a[80]);
    this.B.Xd && this.B.Xd.I(a[81]);
    this.Za = a[62];
    this.B.Gc && this.B.Gc.I(a[63]);
    this.Qg[0] = a[64];
    this.gd.set(a[66]);
    this.Vb.set(a[67]);
    this.O[0] = a[68];
    this.P[0] = a[69];
    this.u[0] = a[70];
    this.F[0] = a[71];
    this.L[0] = a[72];
    this.C[0] = a[73];
    this.D[0] = a[74];
    this.N[0] = a[75];
    b = new Ab(a[78].buffer);
    a = a[77];
    this.Ch(this.G[0]);
    c = this.G[0] >> 12;
    e = 0;
    for (d = 0; d < c; d++)
        if (b.get(d)) {
            let g = e << 12;
            this.Na.set(a.subarray(g, g + 4096), d << 12);
            e++
        } this.Sg();
    this.qk();
    this.sk()
};

function ic(a) {
    a.Y();
    a.Za = [];
    a.B.cb && a.B.cb.reset();
    mb(a)
}

function ce(a, b) {
    1048576 > b ? b = 1048576 : 0 > (b | 0) && (b = Math.pow(2, 31) - 131072);
    b = (b - 1 | 131071) + 1 | 0;
    console.assert(0 === a.G[0], "Expected uninitialised memory");
    a.G[0] = b;
    const c = a.gk(b);
    a.Na = O(Uint8Array, a.ua, c, b);
    a.Dc = O(Uint32Array, a.ua, c, b >> 2)
}
jb.prototype.hb = function(a, b) {
    ce(this, "number" === typeof a.G ? a.G : 67108864);
    a.ge && this.uh(0, 1);
    a.wc && this.th(a.wc);
    this.mb[0] = +a.ta;
    this.Y();
    var c = new eb(this);
    this.A = c;
    this.uc.qg = a.uc;
    this.uc.Yd = a.Qf;
    mb(this);
    if (a.Ya) {
        const {
            zi: d
        } = de(this.Na, a.Ya, a.Ib, a.ec || "");
        d && this.ld.push(d)
    }
    M(c, 179, this, function() {
        return 0
    });
    var e = 0;
    M(c, 146, this, function() {
        return e
    });
    N(c, 146, this, function(d) {
        e = d
    });
    M(c, 1297, this, function() {
        return this.sf < this.Za.length ? this.Za[this.sf++] : 0
    });
    N(c, 1296, this, void 0, function(d) {
        function g(k) {
            return new Uint8Array(Int32Array.of(k).buffer)
        }

        function f(k) {
            return k >> 8 | k << 8 & 65280
        }

        function h(k) {
            return k << 24 | k << 8 & 16711680 | k >> 8 & 65280 | k >>> 24
        }
        this.sf = 0;
        if (0 === d) this.Za = g(1431127377);
        else if (1 === d) this.Za = g(0);
        else if (3 === d) this.Za = g(this.G[0]);
        else if (5 === d) this.Za = g(1);
        else if (15 === d) this.Za = g(1);
        else if (13 === d) this.Za = new Uint8Array(16);
        else if (25 === d) {
            d = new Int32Array(4 + 64 * this.ld.length);
            const k = new Uint8Array(d.buffer);
            d[0] = h(this.ld.length);
            for (let l = 0; l < this.ld.length; l++) {
                const {
                    name: n,
                    data: t
                } = this.ld[l], r = 4 + 64 * l;
                d[r >> 2] = h(t.length);
                d[r + 4 >> 2] = f(49152 + l);
                for (let m = 0; m < n.length; m++) k[r + 8 + m] = n.charCodeAt(m)
            }
            this.Za = k
        } else this.Za = 32768 <= d && 49152 > d ? g(0) : 49152 <= d && d - 49152 < this.ld.length ? this.ld[d - 49152].data : g(0)
    });
    M(c, 32, this, this.hh);
    M(c, 33, this, this.jh);
    M(c, 160, this, this.ph);
    M(c, 161, this, this.rh);
    N(c, 32, this, this.ih);
    N(c, 33, this, this.kh);
    N(c, 160, this, this.qh);
    N(c, 161, this, this.sh);
    M(c, 1232, this, this.lh);
    M(c, 1233, this, this.nh);
    N(c, 1232, this, this.mh);
    N(c, 1233, this, this.oh);
    this.B = {};
    a.si && (this.B.Ja = new dc(this), this.mb[0] && (this.B.Gc =
        new id(this), this.B.Ed = new bd(this), this.B.ta = new $c(this)), this.B.Rc = new Sc(this), ee(this, this.B.Rc, a), this.B.eb = new nc(this), this.B.Yd = new zc(this, b, a.ba || 8388608), this.B.Af = new Oc(this, b), this.B.Of = new Vc(this, 1016, b), a.Vd && (this.B.Vd = new Vc(this, 760, b)), a.Wd && (this.B.Wd = new Vc(this, 1E3, b)), a.Xd && (this.B.Xd = new Vc(this, 744, b)), this.B.cd = new kc(this, a.$), c = 0, a.H && (this.B.H = new Eb(this, a.H, a.lc, !1, c++, b)), a.X && (this.B.X = new Eb(this, a.X, void 0, !0, c++, b)), this.B.$e = new sc(this, b), a.ci && (this.B.xf =
        new od(this, b, a.ef, a.ib)), a.Eb && (this.B.Rf = new aa(a.Eb, this, b)), this.B.Ef = new zd(this, b));
    a.Lb && fe(this, a.Lb)
};

function fe(a, b) {
    if (8192 > b.byteLength) {
        var c = new Int32Array(2048);
        (new Uint8Array(c.buffer)).set(new Uint8Array(b))
    } else c = new Int32Array(b, 0, 2048);
    for (var e = 0; 8192 > e; e += 4)
        if (464367618 === c[e >> 2]) {
            var d = c[e + 4 >> 2];
            if (!(464367618 + d + c[e + 8 >> 2] | 0)) {
                a.o[0] = 732803074;
                a.o[3] = 31744;
                a.Uc(31744, 0);
                a.Ma[0] = 1;
                a.W[0] = 1;
                a.flags[0] = 2;
                a.R[0] = 1;
                a.Xa[0] = 1;
                for (var g = 0; 6 > g; g++) a.ca[g] = 0, a.Qa[g] = 0, a.ma[g] = 4294967295, a.Ra[g] = 45058;
                if (d & 65536) {
                    var f = c[e + 16 >> 2];
                    g = c[e + 20 >> 2];
                    d = c[e + 28 >> 2];
                    b = new Uint8Array(b, e - (c[e + 12 >> 2] - f),
                        0 === g ? void 0 : g - f);
                    la(a, b, f);
                    a.l[0] = a.Rb() + d | 0
                } else if (1179403647 === c[0]) {
                    c = ge(b);
                    a.l[0] = a.Rb() + c.mi.di | 0;
                    for (f of c.Wj) 0 !== f.type && 1 === f.type && f.wg + f.wi < a.G[0] && f.gg && (c = new Uint8Array(b, f.offset, f.gg), la(a, c, f.wg))
                }
                a.A.Ob(244, a, function(h) {
                    console.log("Test exited with code " + vb(h, 2));
                    throw "HALT";
                }, function() {}, function() {}, function() {});
                for (let h = 0; 15 >= h; h++) {
                    function k(l) {
                        l ? this.Ga(h) : R(this, h)
                    }
                    N(a.A, 8192 + h, a, k, k, k)
                }
                a.Sg();
                break
            }
        }
}

function ee(a, b, c) {
    var e = c.bc || 291;
    b.V[56] = 1 | e >> 4 & 240;
    b.V[61] = e & 255;
    b.V[21] = 128;
    b.V[22] = 2;
    e = 0;
    1048576 <= a.G[0] && (e = a.G[0] - 1048576 >> 10, e = Math.min(e, 65535));
    b.V[23] = e & 255;
    b.V[24] = e >> 8 & 255;
    b.V[48] = e & 255;
    b.V[49] = e >> 8 & 255;
    e = 0;
    16777216 <= a.G[0] && (e = a.G[0] - 16777216 >> 16, e = Math.min(e, 65535));
    b.V[52] = e & 255;
    b.V[53] = e >> 8 & 255;
    b.V[91] = 0;
    b.V[92] = 0;
    b.V[93] = 0;
    b.V[20] = 47;
    b.V[95] = 0;
    c.fg && (b.V[63] = 1)
}

function mb(a) {
    var b = a.uc.qg,
        c = a.uc.Yd;
    if (b) {
        var e = new Uint8Array(b);
        la(a, e, 1048576 - b.byteLength);
        if (c) {
            var d = new Uint8Array(c);
            la(a, d, 786432);
            hb(a.A, 4272947200, 1048576, function(g) {
                g = g - 4272947200 | 0;
                return g < d.length ? d[g] : 0
            }, function() {})
        }
        hb(a.A, 4293918720, 1048576, function(g) {
            return this.Na[g & 1048575]
        }.bind(a), function(g, f) {
            this.Na[g & 1048575] = f
        }.bind(a))
    }
}

function he(a, b, c, e, d, g) {
    const f = new Uint8Array(a.ua.buffer, d >>> 0, g >>> 0);
    WebAssembly.instantiate(f, {
        e: a.dh
    }).then(h => {
        a.va.Sf.set(b + 1024, h.instance.exports.f);
        a.hk(b, c, e);
        a.Bh && a.Bh(f)
    })
}
jb.prototype.Ga = function(a) {
    this.gh(a);
    if (this.B.Gc) {
        var b = this.B.Gc;
        if (!(24 <= a)) {
            var c = 1 << a;
            0 === (b.i & c) && (b.i |= c, 65536 !== (b.g[a] & 98304) && (b.h |= c, fd(b, a)))
        }
    }
};

function R(a, b) {
    a.fh(b);
    if (a.B.Gc && (a = a.B.Gc, !(24 <= b))) {
        var c = 1 << b;
        (a.i & c) === c && (a.i &= ~c, a.g[b] & 32768 && (a.h &= ~c))
    }
}
"undefined" !== typeof window ? window.CPU = jb : "undefined" !== typeof module && "undefined" !== typeof module.exports ? module.exports.CPU = jb : "function" === typeof importScripts && (self.CPU = jb);

function be(a) {
    var b = {};
    a.debug = b;
    b.hb = function() {};
    b.Ok = function() {};
    b.Gk = function() {};
    b.aa = function() {};
    b.Ik = function() {};
    b.Hk = function() {};
    b.Fk = function() {
        if (a.Ma[4] & 32)
            for (var g = 0; 4 > g; g++) a.g(a.Ma[3] + 8 * g)
    };
    b.Dk = function() {};
    b.Ek = function() {};
    b.Nk = function() {};
    b.Rk = function() {};
    b.$k = function() {};
    b.zk = function() {};
    let c, e;
    b.Ck = function(g, f, h) {
        if (!e) {
            if (void 0 === c && (c = "function" === typeof require ? require("./capstone-x86.min.js") : window.cs, void 0 === c)) return;
            e = [new c.Capstone(c.ARCH_X86, c.MODE_16),
                new c.Capstone(c.ARCH_X86, c.MODE_32)
            ]
        }
        try {
            e[g].disasm(f, h).forEach(function(k) {
                $d(vb(k.yk >>> 0) + ": " + ub(k.bytes.map(l => vb(l, 2).slice(-2)).join(" "), 20) + " " + k.mnemonic + " " + k.op_str)
            })
        } catch (k) {
            $d("Could not disassemble: " + Array.from(f).map(l => vb(l, 2)).join(" "))
        }
    };
    let d;
    b.Jk = function(g) {
        if (void 0 === d && (d = "function" === typeof require ? require("./libwabt.js") : new window.WabtModule, void 0 === d)) return;
        g = g.slice();
        try {
            var f = d.readWasm(g, {
                Wk: !1
            });
            f.generateNames();
            f.applyNames();
            f.toText({
                Mk: !0,
                Pk: !0
            })
        } catch (l) {
            var h =
                new Blob([g]),
                k = document.createElement("a");
            k.download = "failed.wasm";
            k.href = window.URL.createObjectURL(h);
            k.dataset.downloadurl = ["application/octet-stream", k.download, k.href].join(":");
            k.click();
            window.URL.revokeObjectURL(k.src);
            console.log(l.toString())
        } finally {
            f && f.oa()
        }
    }
};
let ie = DataView.prototype,
    je = {
        size: 1,
        get: ie.getUint8,
        set: ie.setUint8
    },
    ke = {
        size: 2,
        get: ie.getUint16,
        set: ie.setUint16
    },
    X = {
        size: 4,
        get: ie.getUint32,
        set: ie.setUint32
    },
    me = le([{
        ui: X
    }, {
        Jh: je
    }, {
        data: je
    }, {
        kk: je
    }, {
        Tk: je
    }, {
        uk: je
    }, {
        Uk: function(a) {
            return {
                size: a,
                get: () => -1
            }
        }(7)
    }, {
        type: ke
    }, {
        Qk: ke
    }, {
        lk: X
    }, {
        di: X
    }, {
        Ci: X
    }, {
        bk: X
    }, {
        flags: X
    }, {
        Zh: ke
    }, {
        Ag: ke
    }, {
        Bg: ke
    }, {
        Vg: ke
    }, {
        Wg: ke
    }, {
        Zk: ke
    }]);
console.assert(52 === me.reduce((a, b) => a + b.size, 0));
let ne = le([{
    type: X
}, {
    offset: X
}, {
    al: X
}, {
    wg: X
}, {
    gg: X
}, {
    wi: X
}, {
    flags: X
}, {
    align: X
}]);
console.assert(32 === ne.reduce((a, b) => a + b.size, 0));
let oe = le([{
    name: X
}, {
    type: X
}, {
    flags: X
}, {
    vk: X
}, {
    offset: X
}, {
    size: X
}, {
    link: X
}, {
    info: X
}, {
    xk: X
}, {
    Lk: X
}]);
console.assert(40 === oe.reduce((a, b) => a + b.size, 0));

function le(a) {
    return a.map(function(b) {
        var c = Object.keys(b);
        console.assert(1 === c.length);
        c = c[0];
        b = b[c];
        console.assert(0 < b.size);
        return {
            name: c,
            type: b,
            size: b.size,
            get: b.get,
            set: b.set
        }
    })
}

function ge(a) {
    var b = new DataView(a);
    let [c, e] = pe(b, me);
    console.assert(52 === e);
    console.assert(1179403647 === c.ui, "Bad magic");
    console.assert(1 === c.Jh, "Unimplemented: 64 bit elf");
    console.assert(1 === c.data, "Unimplemented: big endian");
    console.assert(1 === c.kk, "Bad version0");
    console.assert(2 === c.type, "Unimplemented type");
    console.assert(1 === c.lk, "Bad version1");
    console.assert(52 === c.Zh, "Bad header size");
    console.assert(32 === c.Ag, "Bad program header size");
    console.assert(40 === c.Vg, "Bad section header size");
    [a] = qe(new DataView(b.buffer, b.byteOffset + c.Ci, c.Ag * c.Bg), ne, c.Bg);
    [b] = qe(new DataView(b.buffer, b.byteOffset + c.bk, c.Vg * c.Wg), oe, c.Wg);
    return {
        mi: c,
        Wj: a,
        Yk: b
    }
}

function pe(a, b) {
    let c = {},
        e = 0;
    for (let d of b) b = d.get.call(a, e, !0), console.assert(void 0 === c[d.name]), c[d.name] = b, e += d.size;
    return [c, e]
}

function qe(a, b, c) {
    let e = [],
        d = 0;
    for (var g = 0; g < c; g++) {
        let [f, h] = pe(new DataView(a.buffer, a.byteOffset + d, void 0), b);
        e.push(f);
        d += h
    }
    return [e, d]
};

function de(a, b, c, e) {
    var d = new Uint8Array(b);
    const g = new Uint16Array(b);
    var f = new Uint32Array(b),
        h = d[497] || 4;
    if (43605 === g[255] && 1400005704 === (g[257] | g[258] << 16)) {
        var k = d[529];
        d[528] = 255;
        d[529] = k & -97 | 128;
        g[274] = 56832;
        g[253] = 65535;
        e += "\x00";
        f[138] = 581632;
        for (d = 0; d < e.length; d++) a[581632 + d] = e.charCodeAt(d);
        h = 512 * (h + 1);
        e = new Uint8Array(b, 0, h);
        b = new Uint8Array(b, h);
        d = h = 0;
        c && (h = 67108864, d = c.byteLength, a.set(new Uint8Array(c), h));
        f[134] = h;
        f[135] = d;
        a.set(e, 524288);
        a.set(b, 1048576);
        a = new Uint8Array(256);
        (new Uint16Array(a.buffer))[0] =
        43605;
        a[2] = 1;
        c = 3;
        a[c++] = 250;
        a[c++] = 184;
        a[c++] = 32768;
        a[c++] = 128;
        a[c++] = 142;
        a[c++] = 192;
        a[c++] = 142;
        a[c++] = 216;
        a[c++] = 142;
        a[c++] = 224;
        a[c++] = 142;
        a[c++] = 232;
        a[c++] = 142;
        a[c++] = 208;
        a[c++] = 188;
        a[c++] = 57344;
        a[c++] = 224;
        a[c++] = 234;
        a[c++] = 0;
        a[c++] = 0;
        a[c++] = 32800;
        a[c++] = 128;
        f = a[c] = 0;
        for (b = 0; b < a.length; b++) f += a[b];
        a[c] = -f;
        return {
            zi: {
                name: "genroms/kernel.bin",
                data: a
            }
        }
    }
};
var Da = 16384,
    Ja = 4;

function re(a) {
    this.g = [];
    this.C = [];
    this.j = a;
    this.u = {
        tf: 0
    };
    this.h = {};
    this.l = 274877906944;
    this.o = 0;
    this.i = [];
    Ca(this, "", -1)
}
re.prototype.aa = function() {
    let a = [];
    a[0] = this.g;
    a[1] = this.u.tf;
    a[2] = [];
    for (const [b, c] of Object.entries(this.h)) 0 === (this.g[b].mode & Da) && a[2].push([b, c]);
    a[3] = this.l;
    a[4] = this.o;
    return a = a.concat(this.i)
};
re.prototype.I = function(a) {
    this.g = a[0].map(b => {
        const c = new se(0);
        c.I(b);
        return c
    });
    this.u.tf = a[1];
    this.h = {};
    for (let [b, c] of a[2]) c.buffer.byteLength !== c.byteLength && (c = c.slice()), this.h[b] = c;
    this.l = a[3];
    this.o = a[4];
    this.i = a.slice(5)
};

function xa(a, b, c) {
    var e = a.g[b];
    0 == e.status || 2 == e.status ? c() : 5 === e.status ? xa(Z(a, e), e.g, c) : a.C.push({
        id: b,
        tk: c
    })
}

function te(a, b, c) {
    var e = ue(a);
    const d = b[0];
    e.size = b[1];
    e.pc = b[2];
    e.Id = e.pc;
    e.Wc = e.pc;
    e.mode = b[3];
    e.uid = b[4];
    e.Ha = b[5];
    var g = e.mode & 61440;
    if (g === Da)
        for (ve(a, e, c, d), c = a.g.length - 1, b = b[6], e = 0; e < b.length; e++) te(a, b[e], c);
    else 32768 === g ? (e.status = 2, e.yd = b[6], ve(a, e, c, d)) : 40960 === g && (e.Ce = b[6], ve(a, e, c, d))
}

function we(a, b, c, e) {
    const d = a.g[c],
        g = a.g[b];
    xe(a, b);
    g.ia.has(e);
    g.ia.set(e, c);
    d.Ua++;
    xe(a, c) && (d.ia.has(".."), d.ia.has(".") || d.Ua++, d.ia.set(".", c), d.ia.set("..", b), g.Ua++)
}

function ye(a, b, c) {
    const e = Qa(a, b, c),
        d = a.g[e],
        g = a.g[b];
    xe(a, b);
    g.ia.delete(c) && (d.Ua--, xe(a, e) && (d.ia.get(".."), d.ia.delete(".."), g.Ua--))
}

function ve(a, b, c, e) {
    -1 != c ? (a.g.push(b), b.kc = a.g.length - 1, we(a, c, b.kc, e)) : 0 == a.g.length && (a.g.push(b), b.ia.set(".", 0), b.ia.set("..", 0), b.Ua = 2)
}

function se(a) {
    this.ia = new Map;
    this.Ve = this.Ue = this.pc = this.Wc = this.Id = this.kc = this.Ha = this.uid = this.size = this.status = 0;
    this.Ce = "";
    this.mode = 493;
    this.ya = {
        type: 0,
        version: 0,
        path: a
    };
    this.Ua = 0;
    this.yd = "";
    this.h = [];
    this.g = this.i = -1
}
se.prototype.aa = function() {
    const a = [];
    a[0] = this.mode;
    a[1] = (this.mode & 61440) === Da ? [...this.ia] : 32768 === (this.mode & 61440) ? this.yd : 40960 === (this.mode & 61440) ? this.Ce : 49152 === (this.mode & 61440) ? [this.Ve, this.Ue] : null;
    a[2] = this.h;
    a[3] = this.status;
    a[4] = this.size;
    a[5] = this.uid;
    a[6] = this.Ha;
    a[7] = this.kc;
    a[8] = this.Id;
    a[9] = this.Wc;
    a[10] = this.pc;
    a[11] = this.ya.version;
    a[12] = this.ya.path;
    a[13] = this.Ua;
    return a
};
se.prototype.I = function(a) {
    this.mode = a[0];
    if ((this.mode & 61440) === Da) {
        this.ia = new Map;
        for (const [b, c] of a[1]) this.ia.set(b, c)
    } else 32768 === (this.mode & 61440) ? this.yd = a[1] : 40960 === (this.mode & 61440) ? this.Ce = a[1] : 49152 === (this.mode & 61440) && ([this.Ve, this.Ue] = a[1]);
    this.h = [];
    for (const b of a[2]) {
        const c = new ze;
        c.I(b);
        this.h.push(c)
    }
    this.status = a[3];
    this.size = a[4];
    this.uid = a[5];
    this.Ha = a[6];
    this.kc = a[7];
    this.Id = a[8];
    this.Wc = a[9];
    this.pc = a[10];
    this.ya.type = (this.mode & 61440) >> 8;
    this.ya.version = a[11];
    this.ya.path =
        a[12];
    this.Ua = a[13]
};

function Ae(a, b) {
    Object.assign(b, a, {
        kc: b.kc,
        ia: b.ia,
        Ua: b.Ua
    })
}

function ue(a) {
    const b = Math.round(Date.now() / 1E3);
    a = new se(++a.u.tf);
    a.Wc = a.Id = a.pc = b;
    return a
}

function Ca(a, b, c) {
    var e = a.g[c];
    if (0 <= c && 5 === e.status) return c = e.g, b = Ca(Z(a, e), b, c), Be(a, e.i, b);
    e = ue(a);
    e.mode = 511 | Da;
    0 <= c && (e.uid = a.g[c].uid, e.Ha = a.g[c].Ha, e.mode = a.g[c].mode & 511 | Da);
    e.ya.type = Da >> 8;
    ve(a, e, c, b);
    return a.g.length - 1
}

function Fa(a, b, c) {
    var e = a.g[c];
    if (5 === e.status) return c = e.g, b = Fa(Z(a, e), b, c), Be(a, e.i, b);
    e = ue(a);
    e.uid = a.g[c].uid;
    e.Ha = a.g[c].Ha;
    e.ya.type = 128;
    e.mode = a.g[c].mode & 438 | 32768;
    ve(a, e, c, b);
    return a.g.length - 1
}

function Ba(a, b, c, e, d) {
    var g = a.g[c];
    if (5 === g.status) return c = g.g, b = Ba(Z(a, g), b, c, e, d), Be(a, g.i, b);
    g = ue(a);
    g.Ue = e;
    g.Ve = d;
    g.uid = a.g[c].uid;
    g.Ha = a.g[c].Ha;
    g.ya.type = 192;
    g.mode = a.g[c].mode & 438;
    ve(a, g, c, b);
    return a.g.length - 1
}

function Aa(a, b, c, e) {
    var d = a.g[c];
    if (5 === d.status) return c = d.g, b = Aa(Z(a, d), b, c, e), Be(a, d.i, b);
    d = ue(a);
    d.uid = a.g[c].uid;
    d.Ha = a.g[c].Ha;
    d.ya.type = 160;
    d.Ce = e;
    d.mode = 40960;
    ve(a, d, c, b);
    return a.g.length - 1
}
async function Ce(a, b, c, e) {
    var d = a.g[c];
    if (5 === d.status) return c = d.g, e = await Ce(Z(a, d), b, c, e), Be(a, d.i, e);
    d = Fa(a, b, c);
    b = a.g[d];
    c = new Uint8Array(e.length);
    c.set(e);
    await De(a, d, c);
    b.size = e.length;
    return d
}

function wa(a, b, c) {
    var e = a.g[b];
    if (5 === e.status) return wa(Z(a, e), e.g, c);
    (e.mode & 61440) == Da && Ee(a, b);
    return !0
}
async function Sa(a, b) {
    var c = a.g[b];
    if (5 === c.status) return await Sa(Z(a, c), c.g);
    2 === c.status && a.j.g(c.yd);
    c.status == Ja && (c.status = -1, await Fe(a, b))
}
async function Pa(a, b, c, e, d) {
    if (b == e && c == d) return 0;
    var g = Qa(a, b, c);
    if (-1 === g) return -2;
    var f = b;
    xe(a, f);
    for (var h = ""; 0 != f;) h = "/" + Ge(a, f) + h, f = He(a, f);
    if (-1 != Qa(a, e, d) && (f = Ra(a, e, d), 0 > f)) return f;
    h = a.g[g];
    var k = a.g[b];
    f = a.g[e];
    if (5 === k.status || 5 === f.status)
        if (5 === k.status && k.i === f.i) {
            if (a = await Pa(Z(a, k), k.g, c, f.g, d), 0 > a) return a
        } else {
            if (0 === J(a, g).kc || !xe(a, g) && 1 < J(a, g).Ua) return -1;
            k = Qa(a, b, c);
            var l = a.g[k],
                n = new se(-1);
            xe(a, k);
            Object.assign(n, l);
            const t = a.g.length;
            a.g.push(n);
            n.kc = t;
            5 === l.status && a.i[l.i].g.set(l.g,
                t);
            if (5 !== l.status || 0 === l.g) ye(a, b, c), we(a, b, t, c);
            if (xe(a, k) && 5 !== l.status)
                for (const [r, m] of n.ia) "." !== r && ".." !== r && xe(a, m) && a.g[m].ia.set("..", t);
            a.h[t] = a.h[k];
            delete a.h[k];
            l.ia = new Map;
            l.Ua = 0;
            k = t;
            l = J(a, g);
            n = await Na(a, k, 0, l.size);
            5 === f.status ? (e = Z(a, f), d = xe(a, k) ? Ca(e, d, f.g) : Fa(e, d, f.g), e = J(e, d), Ae(l, e), Ie(a, g, f.i, d)) : (h.status = -1, a.i[h.i].g.delete(h.g), Ae(l, h), we(a, e, g, d));
            await Ka(a, g, l.size);
            n && n.length && await Oa(a, g, 0, n.length, n);
            if (xe(a, g))
                for (const r of Je(a, k))
                    if (d = await Pa(a, k, r, g, r), 0 >
                        d) return d;
            await Fe(a, k);
            a = Ra(a, b, c);
            if (0 > a) return a
        }
    else ye(a, b, c), we(a, e, g, d), h.ya.version++;
    return 0
}
async function Oa(a, b, c, e, d) {
    var g = a.g[b];
    if (5 === g.status) b = g.g, await Oa(Z(a, g), b, c, e, d);
    else {
        var f = await a.sb(b);
        !f || f.length < c + e ? (await Ka(a, b, Math.floor(3 * (c + e) / 2)), g.size = c + e, f = await a.sb(b)) : g.size < c + e && (g.size = c + e);
        d && f.set(d.subarray(0, e), c);
        await De(a, b, f)
    }
}
async function Na(a, b, c, e) {
    const d = a.g[b];
    return 5 === d.status ? (b = d.g, await Na(Z(a, d), b, c, e)) : await Ke(a, b, c, e)
}

function Qa(a, b, c) {
    b = a.g[b];
    if (5 === b.status) {
        const e = b.g;
        c = Qa(Z(a, b), e, c);
        return -1 === c ? -1 : Le(a, b.i, c)
    }
    a = b.ia.get(c);
    return void 0 === a ? -1 : a
}

function ua(a) {
    let b = a.g.length;
    for (const {
            h: c,
            g: e
        }
        of a.i) b += ua(c), b -= e.size;
    return b
}

function va(a) {
    let b = 1048576;
    for (const {
            h: c
        }
        of a.i) b += va(c);
    return b
}

function qa(a) {
    let b = a.o;
    for (const {
            h: c
        }
        of a.i) b += qa(c);
    return b
}

function ra(a) {
    let b = a.l;
    for (const {
            h: c
        }
        of a.i) b += ra(c);
    return a.l
}

function Ge(a, b) {
    const c = a.g[He(a, b)];
    if (5 === c.status) return Ge(Z(a, c), a.g[b].g);
    if (!c) return "";
    for (const [e, d] of c.ia)
        if (d === b) return e;
    return ""
}

function za(a, b, c, e) {
    if (xe(a, c)) return -1;
    const d = a.g[b],
        g = a.g[c];
    if (5 === d.status) return 5 !== g.status || g.i !== d.i ? -1 : za(Z(a, d), d.g, g.g, e);
    if (5 === g.status) return -1;
    we(a, b, c, e);
    return 0
}

function Ra(a, b, c) {
    if ("." === c || ".." === c) return -1;
    var e = Qa(a, b, c);
    const d = a.g[e];
    var g = a.g[b];
    if (5 === g.status) return b = g.g, Ra(Z(a, g), b, c);
    if (g = xe(a, e)) {
        a: if (e = a.g[e], 5 === e.status) var f = xe(Z(a, e), e.g);
            else {
                for (f of e.ia.keys())
                    if ("." !== f && ".." !== f) {
                        f = !1;
                        break a
                    } f = !0
            }g = !f
    }
    if (g) return -39;
    ye(a, b, c);
    0 === d.Ua && (d.status = Ja);
    return 0
}
async function Fe(a, b) {
    const c = a.g[b];
    5 === c.status ? await Fe(Z(a, c), c.g) : (c.size = 0, delete a.h[b])
}
re.prototype.sb = async function(a) {
    const b = this.g[a];
    return this.h[a] ? this.h[a] : 2 === b.status ? await this.j.read(b.yd, 0, b.size) : null
};
async function Ke(a, b, c, e) {
    const d = a.g[b];
    return a.h[b] ? a.h[b].subarray(c, c + e) : 2 === d.status ? await a.j.read(d.yd, c, e) : null
}
async function De(a, b, c) {
    a.h[b] = c;
    2 === a.g[b].status && (a.g[b].status = 0, a.j.g(a.g[b].yd))
}

function J(a, b) {
    b = a.g[b];
    return 5 === b.status ? J(Z(a, b), b.g) : b
}
async function Ka(a, b, c) {
    var e = J(a, b),
        d = await Ke(a, b, 0, e.size);
    if (c != e.size) {
        var g = new Uint8Array(c);
        e.size = c;
        d && g.set(d.subarray(0, Math.min(d.length, e.size)), 0);
        await De(a, b, g)
    }
}

function Me(a, b) {
    b = b.replace("//", "/");
    b = b.split("/");
    0 < b.length && 0 === b[b.length - 1].length && b.pop();
    0 < b.length && 0 === b[0].length && b.shift();
    const c = b.length;
    var e = -1,
        d = 0;
    let g = null;
    for (var f = 0; f < c; f++)
        if (e = d, d = Qa(a, e, b[f]), !g && 5 === a.g[e].status && (g = "/" + b.slice(f).join("/")), -1 == d) return f < c - 1 ? {
            id: -1,
            zf: -1,
            name: b[f],
            ig: g
        } : {
            id: -1,
            zf: e,
            name: b[f],
            ig: g
        };
    return {
        id: d,
        zf: e,
        name: b[f],
        ig: g
    }
}

function Ee(a, b) {
    var c = a.g[b];
    if (5 === c.status) Ee(Z(a, c), c.g);
    else {
        var e = 0;
        for (const d of c.ia.keys()) e += 24 + Ne(d);
        b = a.h[b] = new Uint8Array(e);
        c.size = e;
        e = 0;
        for (const [d, g] of c.ia) c = J(a, g), e += v(["Q", "d", "b", "s"], [c.ya, e + 13 + 8 + 1 + 2 + Ne(d), c.mode >> 12, d], b, e)
    }
}

function Ma(a, b, c) {
    a = a.h[b];
    if (c >= a.length) return a.length;
    for (b = 0;;) {
        const e = E(["Q", "d"], a, {
            offset: b
        })[1];
        if (e > c) break;
        b = e
    }
    return b
}

function xe(a, b) {
    b = a.g[b];
    return 5 === b.status ? xe(Z(a, b), b.g) : (b.mode & 61440) === Da
}

function Je(a, b) {
    xe(a, b);
    b = a.g[b];
    if (5 === b.status) return Je(Z(a, b), b.g);
    a = [];
    for (const c of b.ia.keys()) "." !== c && ".." !== c && a.push(c);
    return a
}

function He(a, b) {
    xe(a, b);
    b = a.g[b];
    if (5 !== b.status || 0 === b.g) return b.ia.get("..");
    const c = He(Z(a, b), b.g);
    return Le(a, b.i, c)
}

function Ie(a, b, c, e) {
    const d = a.g[b];
    5 === d.status && a.i[d.i].g.delete(d.g);
    d.status = 5;
    d.i = c;
    d.g = e;
    a.i[c].g.set(e, b)
}

function Be(a, b, c) {
    const e = ue(a),
        d = a.g.length;
    a.g.push(e);
    e.kc = d;
    Ie(a, d, b, c);
    return d
}

function Le(a, b, c) {
    const e = a.i[b].g.get(c);
    return void 0 === e ? Be(a, b, c) : e
}

function Z(a, b) {
    return a.i[b.i].h
}

function ze() {
    this.type = 2;
    this.start = 0;
    this.length = Infinity;
    this.h = -1;
    this.g = ""
}
ze.prototype.aa = function() {
    const a = [];
    a[0] = this.type;
    a[1] = this.start;
    a[2] = Infinity === this.length ? 0 : this.length;
    a[3] = this.h;
    a[4] = this.g;
    return a
};
ze.prototype.I = function(a) {
    this.type = a[0];
    this.start = a[1];
    this.length = 0 === a[2] ? Infinity : a[2];
    this.h = a[3];
    this.g = a[4]
};

function Oe(a) {
    const b = new ze;
    b.I(a.aa());
    return b
}

function Pe(a, b) {
    return b.h === a.h && b.g === a.g && b.type === a.type
}

function Qe(a, b) {
    return Pe(a, b) && b.start + b.length === a.start
}

function Ga(a, b, c, e, d) {
    const g = new ze;
    g.type = a;
    g.start = b;
    g.length = c;
    g.h = e;
    g.g = d;
    return g
}

function Ia(a, b, c) {
    b = a.g[b];
    if (5 === b.status) {
        var e = b.g;
        return Ia(Z(a, b), e, c)
    }
    for (e of b.h)
        if (!(c.h === e.h && c.g === e.g || 2 === c.type || 2 === e.type || 1 !== c.type && 1 !== e.type || c.start + c.length <= e.start || e.start + e.length <= c.start)) return Oe(e);
    return null
}

function Ha(a, b, c, e) {
    const d = a.g[b];
    if (5 === d.status) return b = d.g, Ha(Z(a, d), b, c, e);
    c = Oe(c);
    if (2 !== c.type && Ia(a, b, c)) return 1;
    for (a = 0; a < d.h.length; a++) {
        e = d.h[a];
        if (e.start + e.length <= c.start) continue;
        if (c.start + c.length <= e.start) break;
        if (e.h !== c.h || e.g !== c.g) continue;
        b = c.start + c.length;
        const g = c.start - e.start,
            f = e.start + e.length - b;
        if (0 < g && 0 < f && e.type === c.type) return 0;
        0 < g && (e.length = g);
        if (0 >= g && 0 < f) e.start = b, e.length = f;
        else if (0 < f) {
            for (; a < d.h.length && d.h[a].start < b;) a++;
            d.h.splice(a, 0, Ga(e.type, b, f, e.h,
                e.g))
        } else 0 >= g && (d.h.splice(a, 1), a--)
    }
    if (2 !== c.type) {
        a = c;
        e = !1;
        for (b = 0; b < d.h.length && !(Qe(a, d.h[b]) && (d.h[b].length += c.length, a = d.h[b], e = !0), c.start <= d.h[b].start); b++);
        e || (d.h.splice(b, 0, a), b++);
        for (; b < d.h.length; b++)
            if (Pe(d.h[b], a)) {
                Qe(d.h[b], a) && (a.length += d.h[b].length, d.h.splice(b, 1));
                break
            }
    }
    return 0
}

function Re(a, b) {
    b = Me(a, b);
    if (-1 !== b.id) return a = J(a, b.id), Array.from(a.ia.keys()).filter(c => "." !== c && ".." !== c)
}
re.prototype.ze = function(a) {
    a = Me(this, a);
    if (-1 === a.id) return Promise.resolve(null);
    const b = J(this, a.id);
    return Na(this, a.id, 0, b.size)
};

function v(a, b, c, e) {
    for (var d, g = 0, f = 0; f < a.length; f++) switch (d = b[f], a[f]) {
        case "w":
            c[e++] = d & 255;
            c[e++] = d >> 8 & 255;
            c[e++] = d >> 16 & 255;
            c[e++] = d >> 24 & 255;
            g += 4;
            break;
        case "d":
            c[e++] = d & 255;
            c[e++] = d >> 8 & 255;
            c[e++] = d >> 16 & 255;
            c[e++] = d >> 24 & 255;
            c[e++] = 0;
            c[e++] = 0;
            c[e++] = 0;
            c[e++] = 0;
            g += 8;
            break;
        case "h":
            c[e++] = d & 255;
            c[e++] = d >> 8;
            g += 2;
            break;
        case "b":
            c[e++] = d;
            g += 1;
            break;
        case "s":
            var h = e,
                k = 0;
            c[e++] = 0;
            c[e++] = 0;
            g += 2;
            for (var l of d) Se(l.charCodeAt(0)).forEach(function(n) {
                c[e++] = n;
                g += 1;
                k++
            });
            c[h + 0] = k & 255;
            c[h + 1] = k >> 8 & 255;
            break;
        case "Q":
            v(["b", "w", "d"], [d.type, d.version, d.path], c, e), e += 13, g += 13
    }
    return g
}

function E(a, b, c) {
    let e = c.offset;
    for (var d = [], g = 0; g < a.length; g++) switch (a[g]) {
        case "w":
            var f = b[e++];
            f += b[e++] << 8;
            f += b[e++] << 16;
            f += b[e++] << 24 >>> 0;
            d.push(f);
            break;
        case "d":
            f = b[e++];
            f += b[e++] << 8;
            f += b[e++] << 16;
            f += b[e++] << 24 >>> 0;
            e += 4;
            d.push(f);
            break;
        case "h":
            f = b[e++];
            d.push(f + (b[e++] << 8));
            break;
        case "b":
            d.push(b[e++]);
            break;
        case "s":
            f = b[e++];
            f += b[e++] << 8;
            for (var h = "", k = new Te, l = 0; l < f; l++) {
                var n = k.i(b[e++]); - 1 != n && (h += String.fromCharCode(n))
            }
            d.push(h);
            break;
        case "Q":
            c.offset = e, f = E(["b", "w", "d"], b, c), e =
                c.offset, d.push({
                    type: f[0],
                    version: f[1],
                    path: f[2]
                })
    }
    c.offset = e;
    return d
};

function Te() {
    this.g = new Uint8Array(5);
    this.h = 0;
    this.i = function(a) {
        this.g[this.h] = a;
        this.h++;
        switch (this.h) {
            case 1:
                if (128 > this.g[0]) return this.h = 0, this.g[0];
                break;
            case 2:
                if (192 == (this.g[0] & 224) && 128 == (this.g[1] & 192)) return this.h = 0, (this.g[0] & 31) << 6 | this.g[1] & 63
        }
        return -1
    }
}

function Se(a) {
    if (128 > a) return [a];
    if (2048 > a) return [192 | a >> 6 & 31, 128 | a & 63]
}

function Ne(a) {
    for (var b = 0, c = 0; c < a.length; c++) b += 128 > a.charCodeAt(c) ? 1 : 2;
    return b
};

function Ue(a) {
    function b(m) {
        !m.altKey && h[56] && g(56, !1);
        return d(m, !1)
    }

    function c(m) {
        !m.altKey && h[56] && g(56, !1);
        return d(m, !0)
    }

    function e() {
        for (var m = Object.keys(h), w, y = 0; y < m.length; y++) w = +m[y], h[w] && g(w, !1);
        h = {}
    }

    function d(m, w) {
        if (k.v && (m.shiftKey && m.ctrlKey && (73 === m.keyCode || 74 === m.keyCode || 75 === m.keyCode) || !k.Pe ? 0 : m.target ? m.target.classList.contains("phone_keyboard") || "INPUT" !== m.target.nodeName && "TEXTAREA" !== m.target.nodeName : 1)) {
            a: {
                if (void 0 !== m.code) {
                    var y = r[m.code];
                    if (void 0 !== y) break a
                }
                y =
                l[m.keyCode]
            }
            if (y) return g(y, w, m.repeat),
            m.preventDefault && m.preventDefault(),
            !1;console.log("Missing char in map: keyCode=" + (m.keyCode || -1).toString(16) + " code=" + m.code)
        }
    }

    function g(m, w, y) {
        if (w) h[m] && !y && g(m, !1);
        else if (!h[m]) return;
        (h[m] = w) || (m |= 128);
        255 < m ? (f(m >> 8), f(m & 255)) : f(m)
    }

    function f(m) {
        k.v.send("keyboard-code", m)
    }
    var h = {},
        k = this;
    this.Pe = !0;
    var l = new Uint16Array([0, 0, 0, 0, 0, 0, 0, 0, 14, 15, 0, 0, 0, 28, 0, 0, 42, 29, 56, 0, 58, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 57, 57417, 57425, 57423, 57415, 57419, 57416, 57421, 80, 0, 0, 0, 0,
            82, 83, 0, 11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 0, 39, 0, 13, 0, 0, 0, 30, 48, 46, 32, 18, 33, 34, 35, 23, 36, 37, 38, 50, 49, 24, 25, 16, 19, 31, 20, 22, 47, 17, 45, 21, 44, 57435, 57436, 57437, 0, 0, 82, 79, 80, 81, 75, 76, 77, 71, 72, 73, 0, 0, 0, 0, 0, 0, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 87, 88, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 69, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 39, 13, 51, 12, 52, 53, 41, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 26, 43, 27, 40, 0, 57435, 57400, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        ]),
        n = {
            8: 8,
            10: 13,
            32: 32,
            39: 222,
            44: 188,
            45: 189,
            46: 190,
            47: 191,
            48: 48,
            49: 49,
            50: 50,
            51: 51,
            52: 52,
            53: 53,
            54: 54,
            55: 55,
            56: 56,
            57: 57,
            59: 186,
            61: 187,
            91: 219,
            92: 220,
            93: 221,
            96: 192,
            97: 65,
            98: 66,
            99: 67,
            100: 68,
            101: 69,
            102: 70,
            103: 71,
            104: 72,
            105: 73,
            106: 74,
            107: 75,
            108: 76,
            109: 77,
            110: 78,
            111: 79,
            112: 80,
            113: 81,
            114: 82,
            115: 83,
            116: 84,
            117: 85,
            118: 86,
            119: 87,
            120: 88,
            121: 89,
            122: 90
        },
        t = {
            33: 49,
            34: 222,
            35: 51,
            36: 52,
            37: 53,
            38: 55,
            40: 57,
            41: 48,
            42: 56,
            43: 187,
            58: 186,
            60: 188,
            62: 190,
            63: 191,
            64: 50,
            65: 65,
            66: 66,
            67: 67,
            68: 68,
            69: 69,
            70: 70,
            71: 71,
            72: 72,
            73: 73,
            74: 74,
            75: 75,
            76: 76,
            77: 77,
            78: 78,
            79: 79,
            80: 80,
            81: 81,
            82: 82,
            83: 83,
            84: 84,
            85: 85,
            86: 86,
            87: 87,
            88: 88,
            89: 89,
            90: 90,
            94: 54,
            95: 189,
            123: 219,
            124: 220,
            125: 221,
            126: 192
        },
        r = {
            Escape: 1,
            Digit1: 2,
            Digit2: 3,
            Digit3: 4,
            Digit4: 5,
            Digit5: 6,
            Digit6: 7,
            Digit7: 8,
            Digit8: 9,
            Digit9: 10,
            Digit0: 11,
            Minus: 12,
            Equal: 13,
            Backspace: 14,
            Tab: 15,
            KeyQ: 16,
            KeyW: 17,
            KeyE: 18,
            KeyR: 19,
            KeyT: 20,
            KeyY: 21,
            KeyU: 22,
            KeyI: 23,
            KeyO: 24,
            KeyP: 25,
            BracketLeft: 26,
            BracketRight: 27,
            Enter: 28,
            ControlLeft: 29,
            KeyA: 30,
            KeyS: 31,
            KeyD: 32,
            KeyF: 33,
            KeyG: 34,
            KeyH: 35,
            KeyJ: 36,
            KeyK: 37,
            KeyL: 38,
            Semicolon: 39,
            Quote: 40,
            Backquote: 41,
            ShiftLeft: 42,
            Backslash: 43,
            KeyZ: 44,
            KeyX: 45,
            KeyC: 46,
            KeyV: 47,
            KeyB: 48,
            KeyN: 49,
            KeyM: 50,
            Comma: 51,
            Period: 52,
            Slash: 53,
            IntlRo: 53,
            ShiftRight: 54,
            NumpadMultiply: 55,
            AltLeft: 56,
            Space: 57,
            CapsLock: 58,
            F1: 59,
            F2: 60,
            F3: 61,
            F4: 62,
            F5: 63,
            F6: 64,
            F7: 65,
            F8: 66,
            F9: 67,
            F10: 68,
            NumLock: 69,
            ScrollLock: 70,
            Numpad7: 71,
            Numpad8: 72,
            Numpad9: 73,
            NumpadSubtract: 74,
            Numpad4: 75,
            Numpad5: 76,
            Numpad6: 77,
            NumpadAdd: 78,
            Numpad1: 79,
            Numpad2: 80,
            Numpad3: 81,
            Numpad0: 82,
            NumpadDecimal: 83,
            IntlBackslash: 86,
            F11: 87,
            F12: 88,
            NumpadEnter: 57372,
            ControlRight: 57373,
            NumpadDivide: 57397,
            AltRight: 57400,
            Home: 57415,
            ArrowUp: 57416,
            PageUp: 57417,
            ArrowLeft: 57419,
            ArrowRight: 57421,
            End: 57423,
            ArrowDown: 57424,
            PageDown: 57425,
            Insert: 57426,
            Delete: 57427,
            OSLeft: 57435,
            OSRight: 57436,
            ContextMenu: 57437
        };
    this.v = a;
    this.oa = function() {
        "undefined" !== typeof window && (window.removeEventListener("keyup", b, !1), window.removeEventListener("keydown", c, !1), window.removeEventListener("blur", e, !1))
    };
    this.hb = function() {
        "undefined" !== typeof window && (this.oa(), window.addEventListener("keyup", b, !1), window.addEventListener("keydown",
            c, !1), window.addEventListener("blur", e, !1))
    };
    this.hb();
    this.g = function(m) {
        m = {
            keyCode: m
        };
        d(m, !0);
        d(m, !1)
    };
    this.dk = function(m) {
        var w = m.charCodeAt(0);
        w in n ? this.g(n[w]) : w in t ? (f(42), this.g(t[w]), f(170)) : console.log("ascii -> keyCode not found: ", w, m)
    }
};

function Ve(a, b) {
    function c(q) {
        if (!y.enabled || !y.Pe) return !1;
        var C = b || document.body,
            G;
        if (!(G = document.pointerLockElement)) a: {
            for (q = q.target; q.parentNode;) {
                if (q === C) {
                    G = !0;
                    break a
                }
                q = q.parentNode
            }
            G = !1
        }
        return G
    }

    function e(q) {
        c(q) && (q = q.changedTouches) && q.length && (q = q[q.length - 1], m = q.clientX, w = q.clientY)
    }

    function d() {
        if (n || r || t) y.v.send("mouse-click", [!1, !1, !1]), n = r = t = !1
    }

    function g(q) {
        if (y.v && c(q) && y.fd) {
            var C = 0,
                G = 0,
                S = q.changedTouches;
            S ? S.length && (S = S[S.length - 1], C = S.clientX - m, G = S.clientY - w, m = S.clientX,
                w = S.clientY, q.preventDefault()) : "number" === typeof q.movementX ? (C = q.movementX, G = q.movementY) : "number" === typeof q.webkitMovementX ? (C = q.webkitMovementX, G = q.webkitMovementY) : "number" === typeof q.mozMovementX ? (C = q.mozMovementX, G = q.mozMovementY) : (C = q.clientX - m, G = q.clientY - w, m = q.clientX, w = q.clientY);
            y.v.send("mouse-delta", [.15 * C, -(.15 * G)]);
            b && y.v.send("mouse-absolute", [q.pageX - b.offsetLeft, q.pageY - b.offsetTop, b.offsetWidth, b.offsetHeight])
        }
    }

    function f(q) {
        c(q) && k(q, !0)
    }

    function h(q) {
        c(q) && k(q, !1)
    }

    function k(q,
        C) {
        y.v && (1 === q.which ? n = C : 2 === q.which ? r = C : 3 === q.which && (t = C), y.v.send("mouse-click", [n, r, t]), q.preventDefault())
    }

    function l(q) {
        if (c(q)) {
            var C = q.wheelDelta || -q.detail;
            0 > C ? C = -1 : 0 < C && (C = 1);
            y.v.send("mouse-wheel", [C, 0]);
            q.preventDefault()
        }
    }
    var n = !1,
        t = !1,
        r = !1,
        m = 0,
        w = 0,
        y = this;
    this.enabled = !1;
    this.Pe = !0;
    this.v = a;
    this.v.register("mouse-enable", function(q) {
        this.enabled = q
    }, this);
    this.fd = !1;
    this.v.register("emulator-stopped", function() {
        this.fd = !1
    }, this);
    this.v.register("emulator-started", function() {
            this.fd = !0
        },
        this);
    this.oa = function() {
        "undefined" !== typeof window && (window.removeEventListener("touchstart", e, !1), window.removeEventListener("touchend", d, !1), window.removeEventListener("touchmove", g, !1), window.removeEventListener("mousemove", g, !1), window.removeEventListener("mousedown", f, !1), window.removeEventListener("mouseup", h, !1), window.removeEventListener("wheel", l, {
            passive: !1
        }))
    };
    this.hb = function() {
        "undefined" !== typeof window && (this.oa(), window.addEventListener("touchstart", e, !1), window.addEventListener("touchend",
            d, !1), window.addEventListener("touchmove", g, !1), window.addEventListener("mousemove", g, !1), window.addEventListener("mousedown", f, !1), window.addEventListener("mouseup", h, !1), window.addEventListener("wheel", l, {
            passive: !1
        }))
    };
    this.hb()
};

function We(a) {
    if ("undefined" !== typeof window)
        if (window.AudioContext || window.webkitAudioContext) {
            var b = window.AudioWorklet ? Xe : Ye;
            this.v = a;
            this.S = window.AudioContext ? new AudioContext : new webkitAudioContext;
            this.We = new Ze(a, this.S);
            this.h = new $e(a, this.S, this.We);
            this.g = new b(a, this.S, this.We);
            this.h.start();
            a.register("emulator-stopped", function() {
                this.S.suspend()
            }, this);
            a.register("emulator-started", function() {
                this.S.resume()
            }, this);
            a.register("speaker-confirm-initialized", function() {
                    a.send("speaker-has-initialized")
                },
                this);
            a.send("speaker-has-initialized")
        } else console.warn("Web browser doesn't support Web Audio API")
}
We.prototype.oa = function() {
    this.S && this.S.close();
    this.S = null;
    this.g && this.g.Mb && this.g.Mb.port.close();
    this.g = null
};

function Ze(a, b) {
    function c(e) {
        return function(d) {
            e.gain.setValueAtTime(d, this.S.currentTime)
        }
    }
    this.S = b;
    this.sources = new Map;
    this.lg = this.kg = this.F = this.D = this.u = 1;
    this.i = this.S.createBiquadFilter();
    this.j = this.S.createBiquadFilter();
    this.i.type = "highshelf";
    this.j.type = "highshelf";
    this.i.frequency.setValueAtTime(2E3, this.S.currentTime);
    this.j.frequency.setValueAtTime(2E3, this.S.currentTime);
    this.g = this.S.createBiquadFilter();
    this.h = this.S.createBiquadFilter();
    this.g.type = "lowshelf";
    this.h.type = "lowshelf";
    this.g.frequency.setValueAtTime(200, this.S.currentTime);
    this.h.frequency.setValueAtTime(200, this.S.currentTime);
    this.l = this.S.createGain();
    this.o = this.S.createGain();
    this.C = this.S.createChannelMerger(2);
    this.L = this.i;
    this.N = this.j;
    this.i.connect(this.g);
    this.g.connect(this.l);
    this.l.connect(this.C, 0, 0);
    this.j.connect(this.h);
    this.h.connect(this.o);
    this.o.connect(this.C, 0, 1);
    this.C.connect(this.S.destination);
    a.register("mixer-connect", function(e) {
            var d = e[1];
            e = this.sources.get(e[0]);
            void 0 === e || e.connect(d)
        },
        this);
    a.register("mixer-disconnect", function(e) {
        var d = e[1];
        e = this.sources.get(e[0]);
        void 0 === e || e.disconnect(d)
    }, this);
    a.register("mixer-volume", function(e) {
        var d = e[0],
            g = e[1];
        e = Math.pow(10, e[2] / 20);
        d = 0 === d ? this : this.sources.get(d);
        void 0 === d || d.hf(e, g)
    }, this);
    a.register("mixer-gain-left", function(e) {
        this.kg = Math.pow(10, e / 20);
        this.update()
    }, this);
    a.register("mixer-gain-right", function(e) {
        this.lg = Math.pow(10, e / 20);
        this.update()
    }, this);
    a.register("mixer-treble-left", c(this.i), this);
    a.register("mixer-treble-right",
        c(this.j), this);
    a.register("mixer-bass-left", c(this.g), this);
    a.register("mixer-bass-right", c(this.h), this)
}

function af(a, b, c) {
    b = new bf(a.S, b, a.L, a.N);
    a.sources.has(c);
    a.sources.set(c, b);
    return b
}
Ze.prototype.hf = function(a, b) {
    void 0 === b && (b = 2);
    switch (b) {
        case 0:
            this.D = a;
            break;
        case 1:
            this.F = a;
            break;
        case 2:
            this.u = a;
            break;
        default:
            return
    }
    this.update()
};
Ze.prototype.update = function() {
    var a = this.u * this.F * this.lg;
    this.l.gain.setValueAtTime(this.u * this.D * this.kg, this.S.currentTime);
    this.o.gain.setValueAtTime(a, this.S.currentTime)
};

function bf(a, b, c, e) {
    this.S = a;
    this.o = this.l = !0;
    this.D = this.C = this.j = this.g = 1;
    this.u = a.createChannelSplitter(2);
    this.h = a.createGain();
    this.i = a.createGain();
    b.connect(this.u);
    this.u.connect(this.h, 0);
    this.h.connect(c);
    this.u.connect(this.i, 1);
    this.i.connect(e)
}
bf.prototype.update = function() {
    var a = this.o * this.g * this.j * this.D;
    this.h.gain.setValueAtTime(this.l * this.g * this.j * this.C, this.S.currentTime);
    this.i.gain.setValueAtTime(a, this.S.currentTime)
};
bf.prototype.connect = function(a) {
    var b = !a || 2 === a;
    if (b || 0 === a) this.l = !0;
    if (b || 1 === a) this.o = !0;
    this.update()
};
bf.prototype.disconnect = function(a) {
    var b = !a || 2 === a;
    if (b || 0 === a) this.l = !1;
    if (b || 1 === a) this.o = !1;
    this.update()
};
bf.prototype.hf = function(a, b) {
    void 0 === b && (b = 2);
    switch (b) {
        case 0:
            this.C = a;
            break;
        case 1:
            this.D = a;
            break;
        case 2:
            this.j = a;
            break;
        default:
            return
    }
    this.update()
};

function $e(a, b, c) {
    this.Od = b.createOscillator();
    this.Od.type = "square";
    this.Od.frequency.setValueAtTime(440, b.currentTime);
    this.g = af(c, this.Od, 1);
    this.g.disconnect();
    a.register("pcspeaker-enable", function() {
        var e = c.sources.get(1);
        void 0 === e || e.connect(void 0)
    }, this);
    a.register("pcspeaker-disable", function() {
        var e = c.sources.get(1);
        void 0 === e || e.disconnect(void 0)
    }, this);
    a.register("pcspeaker-update", function(e) {
        var d = e[1],
            g = 0;
        3 === e[0] && (g = Math.min(1193181.6665999999 / d, this.Od.frequency.maxValue), g =
            Math.max(g, 0));
        this.Od.frequency.setValueAtTime(g, b.currentTime)
    }, this)
}
$e.prototype.start = function() {
    this.Od.start()
};

function Xe(a, b, c) {
    this.v = a;
    this.S = b;
    this.enabled = !1;
    this.$a = 48E3;
    b = function() {
        function d(h) {
            if (0 === h) return 1;
            h *= Math.PI;
            return Math.sin(h) / h
        }

        function g() {
            var h = Reflect.construct(AudioWorkletProcessor, [], g);
            h.D = 3;
            h.l = Array(1024);
            h.u = 0;
            h.L = 0;
            h.o = 0;
            h.F = h.l.length;
            h.C = 0;
            h.N = f;
            h.g = f;
            h.O = 1;
            h.j = 0;
            h.i = 0;
            h.h = 0;
            h.port.onmessage = k => {
                switch (k.data.type) {
                    case "queue":
                        h.ca(k.data.value);
                        break;
                    case "sampling-rate":
                        h.O = k.data.value / sampleRate
                }
            };
            return h
        }
        var f = [new Float32Array(256), new Float32Array(256)];
        Reflect.setPrototypeOf(g.prototype,
            AudioWorkletProcessor.prototype);
        Reflect.setPrototypeOf(g, AudioWorkletProcessor);
        g.prototype.process = g.prototype.process = function(h, k) {
            for (h = 0; h < k[0][0].length; h++) {
                for (var l = 0, n = 0, t = this.h + this.D, r = this.h - this.D + 1; r <= t; r++) {
                    var m = this.j + r;
                    l += this.P(m, 0) * this.R(this.i - r);
                    n += this.P(m, 1) * this.R(this.i - r)
                }
                if (isNaN(l) || isNaN(n)) l = n = 0;
                k[0][0][h] = l;
                k[0][1][h] = n;
                this.i += this.O;
                this.h = Math.floor(this.i)
            }
            k = this.h;
            k += this.D + 2;
            this.i -= this.h;
            this.j += this.h;
            this.h = 0;
            this.W(k);
            return !0
        };
        g.prototype.R = function(h) {
            return d(h) *
                d(h / this.D)
        };
        g.prototype.P = function(h, k) {
            return 0 > h ? (h += this.N[0].length, this.N[k][h]) : this.g[k][h]
        };
        g.prototype.W = function(h) {
            var k = this.g[0].length;
            k - this.j < h && (this.Y(), this.j -= k)
        };
        g.prototype.Y = function() {
            this.N = this.g;
            this.g = this.U();
            var h = this.g[0].length;
            if (256 > h) {
                for (var k = this.u, l = 0; 256 > h && l < this.o;) h += this.l[k][0].length, k = k + 1 & this.F - 1, l++;
                h = Math.max(h, 256);
                h = [new Float32Array(h), new Float32Array(h)];
                h[0].set(this.g[0]);
                h[1].set(this.g[1]);
                k = this.g[0].length;
                for (var n = 0; n < l; n++) {
                    var t = this.U();
                    h[0].set(t[0], k);
                    h[1].set(t[1], k);
                    k += t[0].length
                }
                this.g = h
            }
            this.rc()
        };
        g.prototype.rc = function() {
            1024 > this.C / this.O && this.port.postMessage({
                type: "pump"
            })
        };
        g.prototype.ca = function(h) {
            this.o < this.F && (this.l[this.L] = h, this.L = this.L + 1 & this.F - 1, this.o++, this.C += h[0].length, this.rc())
        };
        g.prototype.U = function() {
            if (!this.o) return f;
            var h = this.l[this.u];
            this.l[this.u] = null;
            this.u = this.u + 1 & this.F - 1;
            this.o--;
            this.C -= h[0].length;
            return h
        };
        registerProcessor("dac-processor", g)
    }.toString();
    var e = URL.createObjectURL(new Blob([b.substring(b.indexOf("{") +
        1, b.lastIndexOf("}"))], {
        type: "application/javascript"
    }));
    this.Mb = null;
    this.g = this.S.createGain();
    this.S.audioWorklet.addModule(e).then(() => {
        URL.revokeObjectURL(e);
        this.Mb = new AudioWorkletNode(this.S, "dac-processor", {
            numberOfInputs: 0,
            numberOfOutputs: 1,
            outputChannelCount: [2],
            parameterData: {},
            processorOptions: {}
        });
        this.Mb.port.postMessage({
            type: "sampling-rate",
            value: this.$a
        });
        this.Mb.port.onmessage = d => {
            switch (d.data.type) {
                case "pump":
                    this.rc()
            }
        };
        this.Mb.connect(this.g)
    });
    this.h = af(c, this.g, 2);
    this.h.g =
        3;
    a.register("dac-send-data", function(d) {
        this.Cf(d)
    }, this);
    a.register("dac-enable", function() {
        this.enabled = !0
    }, this);
    a.register("dac-disable", function() {
        this.enabled = !1
    }, this);
    a.register("dac-tell-sampling-rate", function(d) {
        this.$a = d;
        this.Mb && this.Mb.port.postMessage({
            type: "sampling-rate",
            value: d
        })
    }, this)
}
Xe.prototype.Cf = function(a) {
    this.Mb && this.Mb.port.postMessage({
        type: "queue",
        value: a
    }, [a[0].buffer, a[1].buffer])
};
Xe.prototype.rc = function() {
    this.enabled && this.v.send("dac-request-data")
};

function Ye(a, b, c) {
    this.v = a;
    this.S = b;
    this.enabled = !1;
    this.$a = 22050;
    this.g = 0;
    this.xe = 1;
    this.Ye = this.S.createBiquadFilter();
    this.Ye.type = "lowpass";
    this.i = this.Ye;
    this.h = af(c, this.i, 2);
    this.h.g = 3;
    a.register("dac-send-data", function(e) {
        this.Cf(e)
    }, this);
    a.register("dac-enable", function() {
        this.enabled = !0;
        this.rc()
    }, this);
    a.register("dac-disable", function() {
        this.enabled = !1
    }, this);
    a.register("dac-tell-sampling-rate", function(e) {
            this.$a = e;
            this.xe = Math.ceil(8E3 / e);
            this.Ye.frequency.setValueAtTime(e / 2, this.S.currentTime)
        },
        this)
}
Ye.prototype.Cf = function(a) {
    var b = a[0].length,
        c = b / this.$a;
    if (1 < this.xe) {
        var e = this.S.createBuffer(2, b * this.xe, this.$a * this.xe);
        for (var d = e.getChannelData(0), g = e.getChannelData(1), f = 0, h = 0; h < b; h++)
            for (var k = 0; k < this.xe; k++, f++) d[f] = a[0][h], g[f] = a[1][h]
    } else e = this.S.createBuffer(2, b, this.$a), e.copyToChannel ? (e.copyToChannel(a[0], 0), e.copyToChannel(a[1], 1)) : (e.getChannelData(0).set(a[0]), e.getChannelData(1).set(a[1]));
    a = this.S.createBufferSource();
    a.buffer = e;
    a.connect(this.Ye);
    a.addEventListener("ended", this.rc.bind(this));
    e = this.S.currentTime;
    if (this.g < e)
        for (this.g = e, e = .2 - c, b = 0; b <= e;) b += c, this.g += c, setTimeout(() => this.rc(), 1E3 * b);
    a.start(this.g);
    this.g += c;
    setTimeout(() => this.rc(), 0)
};
Ye.prototype.rc = function() {
    this.enabled && (.2 < this.g - this.S.currentTime || this.v.send("dac-request-data"))
};

function cf(a, b) {
    function c(h) {
        f.v && f.enabled && (f.h(h.which), h.preventDefault())
    }

    function e(h) {
        var k = h.which;
        8 === k ? (f.h(127), h.preventDefault()) : 9 === k && (f.h(9), h.preventDefault())
    }

    function d(h) {
        if (f.enabled) {
            for (var k = h.clipboardData.getData("text/plain"), l = 0; l < k.length; l++) f.h(k.charCodeAt(l));
            h.preventDefault()
        }
    }

    function g(h) {
        h.target !== a && a.blur()
    }
    var f = this;
    this.enabled = !0;
    this.v = b;
    this.text = "";
    this.j = !1;
    this.i = 0;
    this.v.register("serial0-output-byte", function(h) {
            this.ck(String.fromCharCode(h))
        },
        this);
    this.oa = function() {
        a.removeEventListener("keypress", c, !1);
        a.removeEventListener("keydown", e, !1);
        a.removeEventListener("paste", d, !1);
        window.removeEventListener("mousedown", g, !1)
    };
    this.hb = function() {
        this.oa();
        a.style.display = "block";
        a.addEventListener("keypress", c, !1);
        a.addEventListener("keydown", e, !1);
        a.addEventListener("paste", d, !1);
        window.addEventListener("mousedown", g, !1)
    };
    this.hb();
    this.ck = function(h) {
        "\b" === h ? (this.text = this.text.slice(0, -1), this.update()) : "\r" !== h && (this.text += h, "\n" ===
            h && (this.j = !0), this.update())
    };
    this.update = function() {
        var h = Date.now(),
            k = h - this.i;
        16 > k ? void 0 === this.g && (this.g = setTimeout(() => {
            this.g = void 0;
            this.i = Date.now();
            this.l()
        }, 16 - k)) : (void 0 !== this.g && (clearTimeout(this.g), this.g = void 0), this.i = h, this.l())
    };
    this.l = function() {
        a.value = this.text;
        this.j && (this.j = !1, a.scrollTop = 1E9)
    };
    this.h = function(h) {
        f.v && f.v.send("serial0-input", h)
    }
}

function bb(a, b) {
    this.element = a;
    if (window.Terminal) {
        var c = this.g = new window.Terminal({
            logLevel: "off"
        });
        c.write("This is the serial console. Whatever you type or paste here will be sent to COM1");
        var e = c.onData(function(d) {
            for (let g = 0; g < d.length; g++) b.send("serial0-input", d.charCodeAt(g))
        });
        b.register("serial0-output-byte", function(d) {
            c.write(Uint8Array.of(d))
        }, this);
        this.oa = function() {
            e.dispose();
            c.dispose()
        }
    }
}
bb.prototype.show = function() {
    this.g && this.g.open(this.element)
};

function df(a, b) {
    this.v = b;
    this.g = void 0;
    this.h = [];
    this.url = a;
    this.i = Date.now() - 1E4;
    this.v.register("net0-send", function(c) {
        this.send(c)
    }, this)
}
p = df.prototype;
p.ii = function(a) {
    this.v && this.v.send("net0-receive", new Uint8Array(a.data))
};
p.gi = function() {
    this.connect();
    setTimeout(this.connect.bind(this), 1E4)
};
p.ji = function() {
    for (var a = 0; a < this.h.length; a++) this.send(this.h[a]);
    this.h = []
};
p.hi = function() {};
p.oa = function() {
    this.g && this.g.close()
};
p.connect = function() {
    if ("undefined" !== typeof WebSocket) {
        if (this.g) {
            var a = this.g.readyState;
            if (0 === a || 1 === a) return
        }
        this.i + 1E4 > Date.now() || (this.i = Date.now(), this.g = new WebSocket(this.url), this.g.binaryType = "arraybuffer", this.g.onopen = this.ji.bind(this), this.g.onmessage = this.ii.bind(this), this.g.onclose = this.gi.bind(this), this.g.onerror = this.hi.bind(this))
    }
};
p.send = function(a) {
    this.g && 1 === this.g.readyState ? this.g.send(a) : (this.h.push(a), 128 < this.h.length && (this.h = this.h.slice(-64)), this.connect())
};

function Va(a) {
    this.Me = !1;
    this.D = function() {};
    var b = Zd();
    this.v = b[0];
    this.bd = b[1];
    var c, e;
    const d = new WebAssembly.Table({
        element: "anyfunc",
        initial: 1924
    });
    b = {
        cpu_exception_hook: () => this.D(),
        run_hardware_timers: function(f, h) {
            var k = c;
            const l = k.B.$e.wb(h, !1),
                n = k.B.Rc.wb(h, !1);
            let t = 100,
                r = 100;
            f && (t = k.B.ta.wb(h), r = k.B.Ed.wb(h));
            return Math.min(l, n, t, r)
        },
        cpu_event_halt: () => {
            this.bd.send("cpu-event-halt")
        },
        abort: function() {},
        microtick: nb,
        get_rand_int: function() {
            return wb()
        },
        apic_acknowledge_irq: function() {
            var f =
                c.B.Ed;
            var h = dd(f.i); - 1 === h || dd(f.Ia) >= h || (h & 240) <= (f.u & 240) ? f = -1 : (ed(f.i, h), hd(f.Ia, h), cd(f), f = h);
            return f
        },
        io_port_read8: function(f) {
            f = c.A.ports[f];
            return f.ud.call(f.la)
        },
        io_port_read16: function(f) {
            f = c.A.ports[f];
            return f.Oa.call(f.la)
        },
        io_port_read32: function(f) {
            f = c.A.ports[f];
            return f.ye.call(f.la)
        },
        io_port_write8: function(f, h) {
            f = c.A.ports[f];
            f.lf.call(f.la, h)
        },
        io_port_write16: function(f, h) {
            f = c.A.ports[f];
            f.Ge.call(f.la, h)
        },
        io_port_write32: function(f, h) {
            f = c.A.ports[f];
            f.Uc.call(f.la, h)
        },
        mmap_read8: function(f) {
            return c.h[f >>>
                17](f)
        },
        mmap_read16: function(f) {
            var h = c.h[f >>> 17];
            return h(f) | h(f + 1 | 0) << 8
        },
        mmap_read32: function(f) {
            return c.U[f >>> 17](f)
        },
        mmap_write8: function(f, h) {
            c.j[f >>> 17](f, h)
        },
        mmap_write16: function(f, h) {
            var k = c.j[f >>> 17];
            k(f, h & 255);
            k(f + 1 | 0, h >> 8)
        },
        mmap_write32: function(f, h) {
            c.i[f >>> 17](f, h)
        },
        mmap_write64: function(f, h, k) {
            var l = c.i[f >>> 17];
            l(f, h);
            l(f + 4, k)
        },
        mmap_write128: function(f, h, k, l, n) {
            var t = c.i[f >>> 17];
            t(f, h);
            t(f + 4, k);
            t(f + 8, l);
            t(f + 12, n)
        },
        log_from_wasm: function(f, h) {
            [...(new Uint8Array(e.buffer, f >>> 0, h >>>
                0))]
        },
        console_log_from_wasm: function(f, h) {
            f = String.fromCharCode(...(new Uint8Array(e.buffer, f >>> 0, h >>> 0)));
            console.error(f)
        },
        dbg_trace_from_wasm: function() {},
        codegen_finalize: (f, h, k, l, n) => {
            he(c, f, h, k, l, n)
        },
        jit_clear_func: f => {
            c.va.Sf.set(f + 1024, null)
        },
        jit_clear_all_funcs: () => {
            const f = c.va.Sf;
            for (let h = 0; 900 > h; h++) f.set(1024 + h, null)
        },
        __indirect_function_table: d
    };
    let g = a.bl;
    g || (g = f => new Promise(h => {
        let k = "v86.wasm",
            l = "v86-fallback.wasm";
        if (a.nk) {
            k = a.nk;
            const n = k.lastIndexOf("/");
            l = (-1 === n ? "" : k.substr(0,
                n)) + "/" + l
        } else "undefined" === typeof window && "string" === typeof __dirname ? (k = __dirname + "/" + k, l = __dirname + "/" + l) : (k = "build/" + k, l = "build/" + l);
        Db(k, {
            done: async n => {
                try {
                    const {
                        instance: t
                    } = await WebAssembly.instantiate(n, f);
                    this.C = n;
                    h(t.exports)
                } catch (t) {
                    Db(l, {
                        done: async r => {
                            const {
                                instance: m
                            } = await WebAssembly.instantiate(r, f);
                            this.C = r;
                            h(m.exports)
                        }
                    })
                }
            },
            progress: n => {
                this.bd.send("download-progress", {
                    me: 0,
                    le: 1,
                    ne: k,
                    lengthComputable: n.lengthComputable,
                    total: n.total,
                    loaded: n.loaded
                })
            }
        })
    }));
    g({
        env: b
    }).then(f => {
        e = f.memory;
        f.rust_init();
        f = this.g = new ib(this.bd, {
            exports: f,
            Sf: d
        });
        c = f.s;
        ef(this, f, a)
    });
    this.i = null;
    this.F = 0
}
async function ef(a, b, c) {
    function e(r, m) {
        switch (r) {
            case "hda":
                g.H = this.Ta.H = m;
                break;
            case "hdb":
                g.lc = this.Ta.lc = m;
                break;
            case "cdrom":
                g.X = this.Ta.X = m;
                break;
            case "fda":
                g.$ = this.Ta.$ = m;
                break;
            case "fdb":
                g.Kd = this.Ta.Kd = m;
                break;
            case "multiboot":
                g.Lb = this.Ta.Lb = m.buffer;
                break;
            case "bzimage":
                g.Ya = this.Ta.Ya = m.buffer;
                break;
            case "initrd":
                g.Ib = this.Ta.Ib = m.buffer;
                break;
            case "bios":
                g.uc = m.buffer;
                break;
            case "vga_bios":
                g.Qf = m.buffer;
                break;
            case "initial_state":
                g.Hb = m.buffer;
                break;
            case "fs9p_json":
                g.jg = m
        }
    }
    async function d() {
        if (g.Eb &&
            g.jg) {
            if (!g.Hb) {
                var r = g.Eb,
                    m = g.jg;
                if (3 !== m.version) throw "The filesystem JSON format has changed. Please update your fs2json (https://github.com/copy/fs2json) and recreate the filesystem JSON.";
                var w = m.fsroot;
                r.o = m.size;
                for (m = 0; m < w.length; m++) te(r, w[m], 0)
            }
            if (c.ae) {
                const {
                    Gh: y,
                    oi: q
                } = ff(g.Eb), [C, G] = await Promise.all([g.Eb.ze(q), g.Eb.ze(y)]);
                e.call(this, "initrd", new pb(C.buffer));
                e.call(this, "bzimage", new pb(G.buffer))
            }
        }
        this.vb && this.vb.show && this.vb.show();
        this.v.send("cpu-init", g);
        g.Hb && (b.Rd(g.Hb),
            g.Hb = void 0);
        c.Dh && this.v.send("cpu-run");
        this.bd.send("emulator-loaded")
    }
    a.v.register("emulator-stopped", function() {
        this.Me = !1
    }, a);
    a.v.register("emulator-started", function() {
        this.Me = !0
    }, a);
    var g = {};
    a.Ta = {
        $: void 0,
        Kd: void 0,
        H: void 0,
        lc: void 0,
        X: void 0
    };
    var f = c.bc ? c.bc : c.$ ? 801 : c.H ? 786 : 291;
    g.ta = c.ta;
    g.ge = c.ge;
    g.si = !0;
    g.ti = c.ti;
    g.G = c.G || 67108864;
    g.ba = c.ba || 8388608;
    g.bc = f;
    g.fg = c.fg || !1;
    g.$ = void 0;
    g.Kd = void 0;
    g.Vd = c.Vd;
    g.Wd = c.Wd;
    g.Xd = c.Xd;
    g.ec = c.ec;
    g.ef = c.ef;
    g.ib = c.ib;
    g.wc = c.wc;
    c.te ? a.te = c.te(a.v) : c.rg &&
        (a.te = new df(c.rg, a.v));
    g.ci = !0;
    c.Ak || (a.u = new Ue(a.v));
    c.Bk || (a.l = new Ve(a.v, c.Ff));
    c.Ff ? a.h = new Ta(c.Ff, a.v) : c.Xk && (a.h = new gf(a.v));
    c.$j && (a.vb = new cf(c.$j, a.v));
    c.ak && (a.vb = new bb(c.ak, a.v));
    c.Sh || (a.j = new We(a.v));
    var h = [];
    f = (r, m) => {
        if (m)
            if (m.get && m.set && m.load) h.push({
                name: r,
                qe: m
            });
            else {
                if ("bios" === r || "vga_bios" === r || "initial_state" === r || "multiboot" === r || "bzimage" === r || "initrd" === r) m.async = !1;
                m.url && !m.async ? h.push({
                    name: r,
                    url: m.url,
                    size: m.size
                }) : h.push({
                    name: r,
                    qe: tb(m, a.$g.bind(a))
                })
            }
    };
    c.state &&
        console.warn("Warning: Unknown option 'state'. Did you mean 'initial_state'?");
    f("bios", c.uc);
    f("vga_bios", c.Qf);
    f("cdrom", c.X);
    f("hda", c.H);
    f("hdb", c.lc);
    f("fda", c.$);
    f("fdb", c.Kd);
    f("initial_state", c.Hb);
    f("multiboot", c.Lb);
    f("bzimage", c.Ya);
    f("initrd", c.Ib);
    if (c.filesystem) {
        f = c.filesystem.Eh;
        var k = c.filesystem.Ie;
        let r = new hf;
        k && (r = new jf(r, k));
        g.Eb = a.Eb = new re(r);
        if (f) {
            if ("object" === typeof f) {
                var l = f.size;
                f = f.url
            }
            h.push({
                name: "fs9p_json",
                url: f,
                size: l,
                Fd: !0
            })
        }
    }
    var n = h.length,
        t = function(r) {
            if (r ===
                n) setTimeout(d.bind(this), 0);
            else {
                var m = h[r];
                m.qe ? (m.qe.onload = function() {
                    e.call(this, m.name, m.qe);
                    t(r + 1)
                }.bind(this), m.qe.load()) : Db(m.url, {
                    done: function(w) {
                        if (m.url.endsWith(".zst") && "initial_state" !== m.name) {
                            var y = m.size,
                                q = new Uint8Array(w);
                            w = this.g.s;
                            this.o = w.Zg(q.length);
                            (new Uint8Array(w.ua.buffer)).set(q, w.bh(this.o));
                            q = w.Zd(this.o, y);
                            const C = w.ua.buffer.slice(q, q + y);
                            w.$d(q, y);
                            w.ah(this.o);
                            this.o = null;
                            w = C
                        }
                        e.call(this, m.name, m.Fd ? w : new pb(w));
                        t(r + 1)
                    }.bind(this),
                    progress: function(w) {
                        200 === w.target.status ?
                            a.bd.send("download-progress", {
                                me: r,
                                le: n,
                                ne: m.url,
                                lengthComputable: w.lengthComputable,
                                total: w.total || m.size,
                                loaded: w.loaded
                            }) : a.bd.send("download-error", {
                                me: r,
                                le: n,
                                ne: m.url,
                                request: w.target
                            })
                    },
                    Fd: m.Fd
                })
            }
        }.bind(a);
    t(0)
}
p = Va.prototype;
p.$g = async function(a, b) {
    if (!this.i) {
        const c = URL.createObjectURL(new Blob(["(" + function() {
            let e;
            globalThis.onmessage = function(d) {
                if (e) {
                    var g = d.data.src,
                        f = d.data.Rh;
                    d = d.data.id;
                    var h = e.exports,
                        k = h.zstd_create_ctx(g.length);
                    (new Uint8Array(h.memory.buffer)).set(g, h.zstd_get_src_ptr(k));
                    g = h.zstd_read(k, f);
                    var l = h.memory.buffer.slice(g, g + f);
                    h.zstd_read_free(g, f);
                    h.zstd_free_ctx(k);
                    postMessage({
                        result: l,
                        id: d
                    }, [l])
                } else f = Object.fromEntries("cpu_exception_hook run_hardware_timers cpu_event_halt microtick get_rand_int apic_acknowledge_irq io_port_read8 io_port_read16 io_port_read32 io_port_write8 io_port_write16 io_port_write32 mmap_read8 mmap_read16 mmap_read32 mmap_write8 mmap_write16 mmap_write32 mmap_write64 mmap_write128 codegen_finalize jit_clear_func jit_clear_all_funcs".split(" ").map(n => [n, () => console.error("zstd worker unexpectedly called " + n)])), f.__indirect_function_table = new WebAssembly.Table({
                    element: "anyfunc",
                    initial: 1024
                }), f.abort = () => {
                    throw Error("zstd worker aborted");
                }, f.log_from_wasm = f.console_log_from_wasm = (n, t) => {
                    console.log(String.fromCharCode(...(new Uint8Array(e.exports.memory.buffer, n, t))))
                }, f.dbg_trace_from_wasm = () => console.trace(), e = new WebAssembly.Instance(new WebAssembly.Module(d.data), {
                    env: f
                })
            }
        }.toString() + ")()"], {
            type: "text/javascript"
        }));
        this.i = new Worker(c);
        URL.revokeObjectURL(c);
        this.i.postMessage(this.C, [this.C])
    }
    return new Promise(c => {
        const e = this.F++,
            d = async g => {
                g.data.id === e && (this.i.removeEventListener("message", d), c(g.data.result))
            };
        this.i.addEventListener("message", d);
        this.i.postMessage({
            src: b,
            Rh: a,
            id: e
        }, [b.buffer])
    })
};

function ff(a) {
    const b = (Re(a, "/") || []).map(d => "/" + d);
    a = (Re(a, "/boot/") || []).map(d => "/boot/" + d);
    let c, e;
    for (let d of [].concat(b, a)) {
        const g = /old/i.test(d) || /fallback/i.test(d),
            f = /initrd/i.test(d) || /initramfs/i.test(d);
        !/vmlinuz/i.test(d) && !/bzimage/i.test(d) || e && g || (e = d);
        !f || c && g || (c = d)
    }
    c && e || (console.log("Failed to find bzimage or initrd in filesystem. Files:"), console.log(b.join(" ")), console.log(a.join(" ")));
    return {
        oi: c,
        Gh: e
    }
}
p.ff = async function() {
    this.v.send("cpu-run")
};
p.stop = async function() {
    this.Me && await new Promise(a => {
        const b = () => {
            this.v.unregister("emulator-stopped", b);
            a()
        };
        K(this, "emulator-stopped", b);
        this.v.send("cpu-stop")
    })
};
p.oa = async function() {
    await this.stop();
    this.g.oa();
    this.u && this.u.oa();
    this.te && this.te.oa();
    this.l && this.l.oa();
    this.h && this.h.oa();
    this.vb && this.vb.oa();
    this.j && this.j.oa()
};
p.Df = function() {
    this.v.send("cpu-restart")
};

function K(a, b, c) {
    a.v.register(b, c, a)
}
p.Rd = async function(a) {
    this.g.Rd(a)
};
p.Ae = async function() {
    return this.g.Ae()
};
p.fd = function() {
    return this.Me
};
p.Be = async function(a) {
    if (a.url && !a.async) Db(a.url, {
        done: b => {
            this.g.s.B.cd.Be(new pb(b))
        }
    });
    else {
        const b = tb(a, this.$g.bind(this));
        b.onload = () => {
            this.g.s.B.cd.Be(b)
        };
        await b.load()
    }
};
p.Oe = function() {
    this.g.s.B.cd.Oe()
};

function ab(a, b) {
    for (var c = 0; c < b.length; c++) a.v.send("keyboard-code", b[c])
}

function Ua(a, b) {
    for (var c = 0; c < b.length; c++) a.u.dk(b[c])
}

function $a() {
    var a = document.body,
        b = a.requestPointerLock || a.mozRequestPointerLock || a.webkitRequestPointerLock;
    b && b.call(a)
}
p.Nh = async function(a, b) {
    var c = this.Eb;
    if (c) {
        var e = a.split("/");
        e = e[e.length - 1];
        a = Me(c, a).zf;
        if ("" !== e && -1 !== a) await Ce(c, e, a, b);
        else return Promise.reject(new kf)
    }
};
p.ze = async function(a) {
    var b = this.Eb;
    if (b) return (a = await b.ze(a)) ? a : Promise.reject(new kf)
};

function kf() {
    this.message = "File not found"
}
kf.prototype = Error.prototype;
"undefined" !== typeof window ? (window.V86Starter = Va, window.V86 = Va) : "undefined" !== typeof module && "undefined" !== typeof module.exports ? (module.exports.V86Starter = Va, module.exports.V86 = Va) : "function" === typeof importScripts && (self.V86Starter = Va, self.V86 = Va);

function gf(a) {
    var b, c, e, d, g;
    this.v = a;
    a.register("screen-set-mode", function(f) {
        this.If(f)
    }, this);
    a.register("screen-fill-buffer-end", function(f) {
        this.Pf(f[0])
    }, this);
    a.register("screen-put-char", function(f) {
        this.Bf(f[0], f[1], f[2], f[3], f[4])
    }, this);
    a.register("screen-text-scroll", function(f) {
        console.log("scroll", f)
    }, this);
    a.register("screen-update-cursor", function(f) {
        this.Bd(f[0], f[1])
    }, this);
    a.register("screen-update-cursor-scanline", function(f) {
        this.Cd(f[0], f[1])
    }, this);
    a.register("screen-set-size-text",
        function(f) {
            this.xd(f[0], f[1])
        }, this);
    a.register("screen-set-size-graphical", function(f) {
        this.wd(f[0], f[1])
    }, this);
    this.Bf = function(f, h, k, l, n) {
        f < g && h < d && (f = 3 * (f * d + h), e[f] = k, e[f + 1] = l, e[f + 2] = n)
    };
    this.oa = function() {};
    this.If = function() {};
    this.Zf = function() {};
    this.xd = function(f, h) {
        if (f !== d || h !== g) e = new Int32Array(f * h * 3), d = f, g = h
    };
    this.wd = function() {};
    this.Jf = function() {};
    this.Cd = function() {};
    this.Bd = function(f, h) {
        if (f !== b || h !== c) b = f, c = h
    };
    this.Pf = function() {}
};
const Wa = {
    fk: function(a) {
        return Wa.Vj(a) + Wa.Uj(a)
    },
    Vj: function(a) {
        let b = "";
        var c = "COMPILE COMPILE_SKIPPED_NO_NEW_ENTRY_POINTS COMPILE_WRONG_ADDRESS_SPACE COMPILE_CUT_OFF_AT_END_OF_PAGE COMPILE_WITH_LOOP_SAFETY COMPILE_PAGE COMPILE_PAGE/COMPILE COMPILE_BASIC_BLOCK COMPILE_DUPLICATED_BASIC_BLOCK COMPILE_WASM_BLOCK COMPILE_WASM_LOOP COMPILE_DISPATCHER COMPILE_ENTRY_POINT COMPILE_WASM_TOTAL_BYTES COMPILE_WASM_TOTAL_BYTES/COMPILE_PAGE RUN_INTERPRETED RUN_INTERPRETED_NEW_PAGE RUN_INTERPRETED_PAGE_HAS_CODE RUN_INTERPRETED_PAGE_HAS_ENTRY_AFTER_PAGE_WALK RUN_INTERPRETED_NEAR_END_OF_PAGE RUN_INTERPRETED_DIFFERENT_STATE RUN_INTERPRETED_DIFFERENT_STATE_CPL3 RUN_INTERPRETED_DIFFERENT_STATE_FLAT RUN_INTERPRETED_DIFFERENT_STATE_IS32 RUN_INTERPRETED_DIFFERENT_STATE_SS32 RUN_INTERPRETED_MISSED_COMPILED_ENTRY_RUN_INTERPRETED RUN_INTERPRETED_STEPS RUN_FROM_CACHE RUN_FROM_CACHE_STEPS RUN_FROM_CACHE_STEPS/RUN_FROM_CACHE RUN_FROM_CACHE_STEPS/RUN_INTERPRETED_STEPS DIRECT_EXIT INDIRECT_JUMP INDIRECT_JUMP_NO_ENTRY NORMAL_PAGE_CHANGE NORMAL_FALLTHRU NORMAL_FALLTHRU_WITH_TARGET_BLOCK NORMAL_BRANCH NORMAL_BRANCH_WITH_TARGET_BLOCK CONDITIONAL_JUMP CONDITIONAL_JUMP_PAGE_CHANGE CONDITIONAL_JUMP_EXIT CONDITIONAL_JUMP_FALLTHRU CONDITIONAL_JUMP_FALLTHRU_WITH_TARGET_BLOCK CONDITIONAL_JUMP_BRANCH CONDITIONAL_JUMP_BRANCH_WITH_TARGET_BLOCK DISPATCHER_SMALL DISPATCHER_LARGE LOOP LOOP_SAFETY CONDITION_OPTIMISED CONDITION_UNOPTIMISED CONDITION_UNOPTIMISED_PF CONDITION_UNOPTIMISED_UNHANDLED_L CONDITION_UNOPTIMISED_UNHANDLED_LE FAILED_PAGE_CHANGE SAFE_READ_FAST SAFE_READ_SLOW_PAGE_CROSSED SAFE_READ_SLOW_NOT_VALID SAFE_READ_SLOW_NOT_USER SAFE_READ_SLOW_IN_MAPPED_RANGE SAFE_WRITE_FAST SAFE_WRITE_SLOW_PAGE_CROSSED SAFE_WRITE_SLOW_NOT_VALID SAFE_WRITE_SLOW_NOT_USER SAFE_WRITE_SLOW_IN_MAPPED_RANGE SAFE_WRITE_SLOW_READ_ONLY SAFE_WRITE_SLOW_HAS_CODE SAFE_READ_WRITE_FAST SAFE_READ_WRITE_SLOW_PAGE_CROSSED SAFE_READ_WRITE_SLOW_NOT_VALID SAFE_READ_WRITE_SLOW_NOT_USER SAFE_READ_WRITE_SLOW_IN_MAPPED_RANGE SAFE_READ_WRITE_SLOW_READ_ONLY SAFE_READ_WRITE_SLOW_HAS_CODE PAGE_FAULT TLB_MISS MAIN_LOOP MAIN_LOOP_IDLE DO_MANY_CYCLES CYCLE_INTERNAL INVALIDATE_ALL_MODULES_NO_FREE_WASM_INDICES INVALIDATE_MODULE_WRITTEN_WHILE_COMPILED INVALIDATE_MODULE_UNUSED_AFTER_OVERWRITE INVALIDATE_MODULE_DIRTY_PAGE INVALIDATE_PAGE_HAD_CODE INVALIDATE_PAGE_HAD_ENTRY_POINTS DIRTY_PAGE_DID_NOT_HAVE_CODE RUN_FROM_CACHE_EXIT_SAME_PAGE RUN_FROM_CACHE_EXIT_NEAR_END_OF_PAGE RUN_FROM_CACHE_EXIT_DIFFERENT_PAGE CLEAR_TLB FULL_CLEAR_TLB TLB_FULL TLB_GLOBAL_FULL MODRM_SIMPLE_REG MODRM_SIMPLE_REG_WITH_OFFSET MODRM_SIMPLE_CONST_OFFSET MODRM_COMPLEX SEG_OFFSET_OPTIMISED SEG_OFFSET_NOT_OPTIMISED SEG_OFFSET_NOT_OPTIMISED_ES SEG_OFFSET_NOT_OPTIMISED_FS SEG_OFFSET_NOT_OPTIMISED_GS SEG_OFFSET_NOT_OPTIMISED_NOT_FLAT".split(" "),
            e = 0;
        const d = {};
        for (let f = 0; f < c.length; f++) {
            const h = c[f];
            var g = void 0;
            if (h.includes("/")) {
                e++;
                const [k, l] = h.split("/");
                g = d[k] / d[l]
            } else g = d[h] = a.va.exports.profiler_stat_get(f - e), g = 1E8 <= g ? Math.round(g / 1E6) + "m" : 1E5 <= g ? Math.round(g / 1E3) + "k" : g;
            b += h + "=" + g + "\n"
        }
        b += "\n";
        c = a.va.exports.get_valid_tlb_entries_count();
        e = a.va.exports.get_valid_global_tlb_entries_count();
        b = b + ("TLB_ENTRIES=" + c + " (" + e + " global, " + (c - e) + " non-global)\nWASM_TABLE_FREE=") + (a.va.exports.jit_get_wasm_table_index_free_list_count() + "\n");
        b += "JIT_CACHE_SIZE=" + a.va.exports.jit_get_cache_size() + "\n";
        b += "FLAT_SEGMENTS=" + a.va.exports.has_flat_segmentation() + "\n";
        b += "wasm memory size: " + (a.ua.buffer.byteLength >> 20) + "m\n";
        b = b + "Config:\nJIT_DISABLED=" + (a.va.exports.get_jit_config(0) + "\n");
        b += "MAX_PAGES=" + a.va.exports.get_jit_config(1) + "\n";
        b += "JIT_USE_LOOP_SAFETY=" + !!a.va.exports.get_jit_config(2) + "\n";
        return b += "MAX_EXTRA_BASIC_BLOCKS=" + a.va.exports.get_jit_config(3) + "\n"
    },
    Uj: function(a) {
        return [Wa.we(a, !1, !1, !1, !1), Wa.we(a, !0, !1, !1, !1),
            Wa.we(a, !1, !0, !1, !1), Wa.we(a, !1, !1, !0, !1), Wa.we(a, !1, !1, !1, !0)
        ].join("\n\n")
    },
    we: function(a, b, c, e, d) {
        let g = "";
        var f = [],
            h = b ? "compiled" : c ? "jit exit" : e ? "unguarded register" : d ? "wasm size" : "executed";
        for (let n = 0; 256 > n; n++)
            for (let t = 0; 8 > t; t++)
                for (let r of [!1, !0]) {
                    var k = a.va.exports.get_opstats_buffer(b, c, e, d, n, !1, r, t);
                    f.push({
                        Ze: n,
                        count: k,
                        og: r,
                        hg: t
                    });
                    k = a.va.exports.get_opstats_buffer(b, c, e, d, n, !0, r, t);
                    f.push({
                        Ze: 3840 | n,
                        count: k,
                        og: r,
                        hg: t
                    })
                }
        a = 0;
        b = new Set([38, 46, 54, 62, 100, 101, 102, 103, 240, 242, 243]);
        for (let {
                count: n,
                Ze: t
            }
            of f) b.has(t) || (a += n);
        if (0 === a) return "";
        c = new Uint32Array(256);
        b = new Uint32Array(256);
        for (let {
                Ze: n,
                count: t
            }
            of f) 3840 == (n & 65280) ? b[n & 255] += t : c[n & 255] += t;
        g = g + "------------------\nTotal: " + (a + "\n");
        const l = 1E7 < a ? 1E3 : 1;
        e = Math.max.apply(Math, f.map(({
            count: n
        }) => Math.round(n / l)));
        e = String(e).length;
        g += `Instruction counts ${h} (in ${l}):\n`;
        for (d = 0; 256 > d; d++) g += d.toString(16).padStart(2, "0") + ":" + ub(Math.round(c[d] / l), e), g = 15 == d % 16 ? g + "\n" : g + " ";
        g = g + "\n" + `Instruction counts ${h} (0f, in ${l}):\n`;
        for (h =
            0; 256 > h; h++) g += (h & 255).toString(16).padStart(2, "0") + ":" + ub(Math.round(b[h] / l), e), g = 15 == h % 16 ? g + "\n" : g + " ";
        g += "\n";
        f = f.filter(({
            count: n
        }) => n).sort(({
            count: n
        }, {
            count: t
        }) => t - n);
        for (let {
                Ze: n,
                og: t,
                hg: r,
                count: m
            }
            of f.slice(0, 200)) g += n.toString(16) + "_" + r + (t ? "_m" : "_r") + ":" + (m / a * 100).toFixed(2) + " ";
        return g + "\n"
    }
};
"undefined" !== typeof module && "undefined" !== typeof module.exports && (module.exports.print_stats = Wa);

function hf() {
    this.h = new Map
}
hf.prototype.read = async function(a, b, c) {
    return (a = this.h.get(a)) ? a.subarray(b, b + c) : null
};
hf.prototype.cache = async function(a, b) {
    this.h.set(a, b)
};
hf.prototype.g = function(a) {
    this.h.delete(a)
};

function jf(a, b) {
    this.h = a;
    this.Ie = b
}

function lf(a, b) {
    return new Promise(c => {
        Db(a.Ie + b, {
            done: async e => {
                e = new Uint8Array(e);
                await a.cache(b, e);
                c(e)
            }
        })
    })
}
jf.prototype.read = async function(a, b, c) {
    const e = await this.h.read(a, b, c);
    return e ? e : (await lf(this, a)).subarray(b, b + c)
};
jf.prototype.cache = async function(a, b) {
    return await this.h.cache(a, b)
};
jf.prototype.g = function(a) {
    this.h.g(a)
};
"undefined" !== typeof window ? (window.MemoryFileStorage = hf, window.ServerFileStorageWrapper = jf) : "undefined" !== typeof module && "undefined" !== typeof module.exports ? (module.exports.MemoryFileStorage = hf, module.exports.ServerFileStorageWrapper = jf) : "function" === typeof importScripts && (self.MemoryFileStorage = hf, self.ServerFileStorageWrapper = jf);