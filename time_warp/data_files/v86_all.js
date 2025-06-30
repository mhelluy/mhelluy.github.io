'use strict';
var n;
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

function aa() {}
function ba() {}
;function da(a, b) {
    return (a || 0 === a ? a + "" : "").padEnd(b, " ")
}
function ea(a, b) {
    return (a || 0 === a ? a + "" : "").padStart(b, "0")
}
function t(a, b, c, d) {
    return new Proxy({},{
        get: function(e, f) {
            e = new a(b.buffer,c,d);
            f = e[f];
            return "function" === typeof f ? f.bind(e) : f
        },
        set: function(e, f, h) {
            (new a(b.buffer,c,d))[f] = h;
            return !0
        }
    })
}
function fa(a, b) {
    return "0x" + ea((a ? a.toString(16) : "").toUpperCase(), b || 1)
}
var ha;
if ("undefined" !== typeof crypto && crypto.getRandomValues) {
    const a = new Int32Array(1);
    ha = function() {
        crypto.getRandomValues(a);
        return a[0]
    }
} else if ("undefined" !== typeof require) {
    const a = require("crypto");
    ha = function() {
        return a.mm(4).readInt32LE(0)
    }
} else
    "undefined" !== typeof process && import("node:crypto").then(a => {
        ha = function() {
            return a.randomBytes(4).readInt32LE(0)
        }
    }
    );
var ja;
if ("function" === typeof Math.clz32)
    ja = function(a) {
        return 31 - Math.clz32(a)
    }
    ;
else {
    for (var ka = new Int8Array(256), pa = 0, qa = -2; 256 > pa; pa++)
        pa & pa - 1 || qa++,
        ka[pa] = qa;
    ja = function(a) {
        a >>>= 0;
        var b = a >>> 16;
        if (b) {
            var c = b >>> 8;
            return c ? 24 + ka[c] : 16 + ka[b]
        }
        return (c = a >>> 8) ? 8 + ka[c] : ka[a]
    }
}
function sa(a) {
    return 1 >= a ? 1 : 1 << 1 + ja(a - 1)
}
function ta(a) {
    var b = new Uint8Array(a), c, d;
    this.length = 0;
    this.push = function(e) {
        this.length !== a && this.length++;
        b[d] = e;
        d = d + 1 & a - 1
    }
    ;
    this.shift = function() {
        if (this.length) {
            var e = b[c];
            c = c + 1 & a - 1;
            this.length--;
            return e
        }
        return -1
    }
    ;
    this.clear = function() {
        this.length = d = c = 0
    }
    ;
    this.clear()
}
function ua() {
    this.size = 65536;
    this.data = new Float32Array(65536);
    this.length = this.end = this.start = 0
}
ua.prototype.push = function(a) {
    this.length === this.size ? this.start = this.start + 1 & this.size - 1 : this.length++;
    this.data[this.end] = a;
    this.end = this.end + 1 & this.size - 1
}
;
ua.prototype.shift = function() {
    if (this.length) {
        var a = this.data[this.start];
        this.start = this.start + 1 & this.size - 1;
        this.length--;
        return a
    }
}
;
function va(a, b) {
    var c = new Float32Array(b);
    b > a.length && (b = a.length);
    var d = a.start + b
      , e = a.data.subarray(a.start, d);
    c.set(e);
    d >= a.size && (d -= a.size,
    c.set(a.data.subarray(0, d), e.length));
    a.start = d;
    a.length -= b;
    return c
}
ua.prototype.clear = function() {
    this.length = this.end = this.start = 0
}
;
function xa(a, b) {
    Array.isArray(a) || (a = [a]);
    ya(new Blob(a), b)
}
function ya(a, b) {
    var c = document.createElement("a");
    c.download = b;
    c.href = window.URL.createObjectURL(a);
    c.dataset.downloadurl = ["application/octet-stream", c.download, c.href].join(":");
    document.createEvent ? (a = document.createEvent("MouseEvent"),
    a.initMouseEvent("click", !0, !0, window, 0, 0, 0, 0, 0, !1, !1, !1, !1, 0, null),
    c.dispatchEvent(a)) : c.click();
    window.URL.revokeObjectURL(c.href)
}
function za(a) {
    "number" === typeof a ? this.view = new Uint8Array(a + 7 >> 3) : a instanceof ArrayBuffer && (this.view = new Uint8Array(a))
}
za.prototype.set = function(a, b) {
    const c = a >> 3;
    a = 1 << (a & 7);
    this.view[c] = b ? this.view[c] | a : this.view[c] & ~a
}
;
za.prototype.get = function(a) {
    return this.view[a >> 3] >> (a & 7) & 1
}
;
za.prototype.bc = function() {
    return this.view.buffer
}
;
var Aa, Ba;
if ("undefined" === typeof XMLHttpRequest || "undefined" !== typeof process && process.El && process.El.node) {
    let a;
    Aa = async function(b, c) {
        a || (a = await import("node:fs/promises"));
        if (c.Ae) {
            b = await a.open(b, "r");
            const d = Buffer.allocUnsafe(c.Ae.length);
            try {
                await b.read({
                    buffer: d,
                    position: c.Ae.start
                })
            } finally {
                await b.close()
            }
            c.done && c.done(new Uint8Array(d))
        } else
            b = await a.readFile(b, {
                encoding: c.Qe ? "utf-8" : null
            }),
            b = c.Qe ? JSON.parse(b) : (new Uint8Array(b)).buffer,
            c.done(b)
    }
    ;
    Ba = async function(b) {
        a || (a = await import("node:fs/promises"));
        return (await a.stat(b)).size
    }
} else
    Aa = async function(a, b, c) {
        function d() {
            const k = c || 0;
            setTimeout( () => {
                Aa(a, b, k + 1)
            }
            , 1E3 * ([1, 1, 2, 3, 5, 8, 13, 21][k] || 34))
        }
        var e = new XMLHttpRequest;
        e.open(b.method || "get", a, !0);
        e.responseType = b.Qe ? "json" : "arraybuffer";
        if (b.headers)
            for (var f = Object.keys(b.headers), h = 0; h < f.length; h++) {
                var g = f[h];
                e.setRequestHeader(g, b.headers[g])
            }
        b.Ae && (f = b.Ae.start,
        e.setRequestHeader("Range", "bytes=" + f + "-" + (f + b.Ae.length - 1)),
        e.setRequestHeader("X-Accept-Encoding", "identity"),
        e.onreadystatechange = function() {
            200 === e.status && (console.error("Server sent full file in response to ranged request, aborting", {
                filename: a
            }),
            e.abort())
        }
        );
        e.onload = function() {
            if (4 === e.readyState)
                if (200 !== e.status && 206 !== e.status)
                    console.error("Loading the image " + a + " failed (status %d)", e.status),
                    500 <= e.status && 600 > e.status && d();
                else if (e.response) {
                    if (b.Ae) {
                        const k = e.getResponseHeader("Content-Encoding");
                        k && "identity" !== k && console.error("Server sent Content-Encoding in response to ranged request", {
                            filename: a,
                            Zl: k
                        })
                    }
                    b.done && b.done(e.response, e)
                }
        }
        ;
        e.onerror = function(k) {
            console.error("Loading the image " + a + " failed", k);
            d()
        }
        ;
        b.progress && (e.onprogress = function(k) {
            b.progress(k)
        }
        );
        e.send(null)
    }
    ,
    Ba = async function(a) {
        return new Promise( (b, c) => {
            Aa(a, {
                done: (d, e) => {
                    d = e.getResponseHeader("Content-Range") || "";
                    (e = d.match(/\/(\d+)\s*$/)) ? b(+e[1]) : c(Error("`Range: bytes=...` header not supported (Got `" + d + "`)"))
                }
                ,
                headers: {
                    Range: "bytes=0-0",
                    "X-Accept-Encoding": "identity"
                }
            })
        }
        )
    }
    ;
function Ca(a) {
    this.buffer = a;
    this.byteLength = a.byteLength;
    this.onload = void 0
}
n = Ca.prototype;
n.load = function() {
    this.onload && this.onload({
        buffer: this.buffer
    })
}
;
n.get = function(a, b, c) {
    c(new Uint8Array(this.buffer,a,b))
}
;
n.set = function(a, b, c) {
    (new Uint8Array(this.buffer,a,b.byteLength)).set(b);
    c()
}
;
n.bc = function(a) {
    a(this.buffer)
}
;
n.ia = function() {
    const a = [];
    a[0] = this.byteLength;
    a[1] = new Uint8Array(this.buffer);
    return a
}
;
n.J = function(a) {
    this.byteLength = a[0];
    this.buffer = a[1].slice().buffer
}
;
function Ea(a, b, c) {
    this.filename = a;
    this.byteLength = b;
    this.g = new Map;
    this.h = new Set;
    this.M = c;
    this.l = !!c;
    this.onload = void 0
}
n = Ea.prototype;
n.load = async function() {
    void 0 === this.byteLength && (this.byteLength = await Ba(this.filename));
    this.onload && this.onload(Object.create(null))
}
;
n.Gg = function(a, b) {
    var c = b / 256;
    a /= 256;
    for (var d = 0; d < c; d++)
        if (!this.g.get(a + d))
            return;
    if (1 === c)
        return this.g.get(a);
    b = new Uint8Array(b);
    for (d = 0; d < c; d++)
        b.set(this.g.get(a + d), 256 * d);
    return b
}
;
n.get = function(a, b, c) {
    var d = this.Gg(a, b);
    if (d)
        c(d);
    else {
        var e = a
          , f = b;
        this.M && (e = a - a % this.M,
        f = Math.ceil((a - e + b) / this.M) * this.M);
        Aa(this.filename, {
            done: function(h) {
                h = new Uint8Array(h);
                this.Hg(e, f, h);
                e === a && f === b ? c(h) : c(h.subarray(a - e, a - e + b))
            }
            .bind(this),
            Ae: {
                start: e,
                length: f
            }
        })
    }
}
;
n.set = function(a, b, c) {
    a /= 256;
    for (var d = b.length / 256, e = 0; e < d; e++) {
        var f = this.g.get(a + e);
        void 0 === f ? this.g.set(a + e, b.slice(256 * e, 256 * (e + 1))) : f.set(b.subarray(256 * e, 256 * (e + 1)));
        this.h.add(a + e)
    }
    c()
}
;
n.Hg = function(a, b, c) {
    a /= 256;
    b /= 256;
    for (var d = 0; d < b; d++) {
        const e = this.g.get(a + d);
        e ? c.set(e, 256 * d) : this.l && this.g.set(a + d, c.slice(256 * d, 256 * (d + 1)))
    }
}
;
n.bc = function(a) {
    a()
}
;
n.ia = function() {
    const a = []
      , b = [];
    for (const [c,d] of this.g)
        this.h.has(c) && b.push([c, d]);
    a[0] = b;
    return a
}
;
n.J = function(a) {
    a = a[0];
    this.g.clear();
    this.h.clear();
    for (const [b,c] of a)
        this.g.set(b, c),
        this.h.add(b)
}
;
function Fa(a, b, c, d) {
    const e = a.match(/\.[^\.]+(\.zst)?$/);
    this.j = e ? e[0] : "";
    this.i = a.substring(0, a.length - this.j.length);
    this.A = this.j.endsWith(".zst");
    this.i.endsWith("/") || (this.i += "-");
    this.g = new Map;
    this.h = new Set;
    this.byteLength = b;
    this.M = c;
    this.o = d;
    this.l = !!c;
    this.onload = void 0
}
n = Fa.prototype;
n.load = function() {
    this.onload && this.onload(Object.create(null))
}
;
n.get = function(a, b, c) {
    var d = this.uh(a, b);
    if (d)
        c(d);
    else if (this.M) {
        const f = Math.floor(a / this.M)
          , h = a - f * this.M
          , g = Math.ceil((h + b) / this.M)
          , k = new Uint8Array(g * this.M);
        let l = 0;
        for (let m = 0; m < g; m++) {
            var e = (f + m) * this.M;
            d = this.i + e + "-" + (e + this.M) + this.j;
            (e = this.uh(e, this.M)) ? (k.set(e, m * this.M),
            l++,
            l === g && c(k.subarray(h, h + b))) : Aa(d, {
                done: async function(p) {
                    p = new Uint8Array(p);
                    this.A && (p = await this.o(this.M, p),
                    p = new Uint8Array(p));
                    k.set(p, m * this.M);
                    this.vh((f + m) * this.M, this.M | 0, p);
                    l++;
                    l === g && c(k.subarray(h, h + b))
                }
                .bind(this)
            })
        }
    } else
        Aa(this.i + a + "-" + (a + b) + this.j, {
            done: function(f) {
                f = new Uint8Array(f);
                this.vh(a, b, f);
                c(f)
            }
            .bind(this)
        })
}
;
n.uh = Ea.prototype.Gg;
n.set = Ea.prototype.set;
n.vh = Ea.prototype.Hg;
n.ia = Ea.prototype.ia;
n.J = Ea.prototype.J;
function Ga(a) {
    this.file = a;
    this.byteLength = a.size;
    1073741824 < a.size && console.warn("SyncFileBuffer: Allocating buffer of " + (a.size >> 20) + " MB ...");
    this.buffer = new ArrayBuffer(a.size);
    this.onload = void 0
}
n = Ga.prototype;
n.load = function() {
    Ha(this, 0)
}
;
function Ha(a, b) {
    var c = new FileReader;
    c.onload = function(d) {
        d = new Uint8Array(d.target.result);
        (new Uint8Array(this.buffer,b)).set(d);
        Ha(this, b + 4194304)
    }
    .bind(a);
    b < a.byteLength ? c.readAsArrayBuffer(a.file.slice(b, Math.min(b + 4194304, a.byteLength))) : (a.file = void 0,
    a.onload && a.onload({
        buffer: a.buffer
    }))
}
n.get = Ca.prototype.get;
n.set = Ca.prototype.set;
n.bc = Ca.prototype.bc;
n.ia = Ca.prototype.ia;
n.J = Ca.prototype.J;
function Ma(a) {
    this.file = a;
    this.byteLength = a.size;
    this.g = new Map;
    this.h = new Set;
    this.onload = void 0
}
n = Ma.prototype;
n.load = function() {
    this.onload && this.onload(Object.create(null))
}
;
n.get = function(a, b, c) {
    var d = this.Si(a, b);
    d ? c(d) : (d = new FileReader,
    d.onload = function(e) {
        e = new Uint8Array(e.target.result);
        this.Ti(a, b, e);
        c(e)
    }
    .bind(this),
    d.readAsArrayBuffer(this.file.slice(a, a + b)))
}
;
n.Si = Ea.prototype.Gg;
n.set = Ea.prototype.set;
n.Ti = Ea.prototype.Hg;
n.ia = Ea.prototype.ia;
n.J = Ea.prototype.J;
n.bc = function(a) {
    a()
}
;
n.Qh = function(a) {
    for (var b = [], c = Array.from(this.g.keys()).sort(function(g, k) {
        return g - k
    }), d = 0, e = 0; e < c.length; e++) {
        var f = c[e]
          , h = this.g.get(f);
        f *= 256;
        f !== d && (b.push(this.file.slice(d, f)),
        d = f);
        b.push(h);
        d += h.length
    }
    d !== this.file.size && b.push(this.file.slice(d));
    return new File(b,a)
}
;
function Na(a, b) {
    if (a.buffer instanceof ArrayBuffer)
        return new Ca(a.buffer);
    if ("undefined" !== typeof File && a.buffer instanceof File)
        return b = a.async,
        void 0 === b && (b = 268435456 <= a.buffer.size),
        b ? new Ma(a.buffer) : new Ga(a.buffer);
    if (a.url)
        return a.da ? new Fa(a.url,a.size,a.M,b) : new Ea(a.url,a.size,a.M)
}
;function Oa(a) {
    this.s = a;
    this.o = new Uint8Array(8);
    this.A = new Uint8Array(8);
    this.g = new Uint16Array(8);
    this.j = new Uint16Array(8);
    this.h = new Uint16Array(8);
    this.l = new Uint16Array(8);
    this.Mc = new Uint8Array(8);
    this.B = new Uint8Array(8);
    this.Dg = [];
    this.i = 0;
    a = a.C;
    u(a, 0, this, this.Ad.bind(this, 0));
    u(a, 2, this, this.Ad.bind(this, 1));
    u(a, 4, this, this.Ad.bind(this, 2));
    u(a, 6, this, this.Ad.bind(this, 3));
    u(a, 1, this, this.Cd.bind(this, 0));
    u(a, 3, this, this.Cd.bind(this, 1));
    u(a, 5, this, this.Cd.bind(this, 2));
    u(a, 7, this, this.Cd.bind(this, 3));
    x(a, 0, this, this.zd.bind(this, 0));
    x(a, 2, this, this.zd.bind(this, 1));
    x(a, 4, this, this.zd.bind(this, 2));
    x(a, 6, this, this.zd.bind(this, 3));
    x(a, 1, this, this.Bd.bind(this, 0));
    x(a, 3, this, this.Bd.bind(this, 1));
    x(a, 5, this, this.Bd.bind(this, 2));
    x(a, 7, this, this.Bd.bind(this, 3));
    u(a, 192, this, this.Ad.bind(this, 4));
    u(a, 196, this, this.Ad.bind(this, 5));
    u(a, 200, this, this.Ad.bind(this, 6));
    u(a, 204, this, this.Ad.bind(this, 7));
    u(a, 194, this, this.Cd.bind(this, 4));
    u(a, 198, this, this.Cd.bind(this, 5));
    u(a, 202, this, this.Cd.bind(this, 6));
    u(a, 206, this, this.Cd.bind(this, 7));
    x(a, 192, this, this.zd.bind(this, 4));
    x(a, 196, this, this.zd.bind(this, 5));
    x(a, 200, this, this.zd.bind(this, 6));
    x(a, 204, this, this.zd.bind(this, 7));
    x(a, 194, this, this.Bd.bind(this, 4));
    x(a, 198, this, this.Bd.bind(this, 5));
    x(a, 202, this, this.Bd.bind(this, 6));
    x(a, 206, this, this.Bd.bind(this, 7));
    u(a, 135, this, this.Ed.bind(this, 0));
    u(a, 131, this, this.Ed.bind(this, 1));
    u(a, 129, this, this.Ed.bind(this, 2));
    u(a, 130, this, this.Ed.bind(this, 3));
    u(a, 143, this, this.Ed.bind(this, 4));
    u(a, 139, this, this.Ed.bind(this, 5));
    u(a, 137, this, this.Ed.bind(this, 6));
    u(a, 138, this, this.Ed.bind(this, 7));
    x(a, 135, this, this.Dd.bind(this, 0));
    x(a, 131, this, this.Dd.bind(this, 1));
    x(a, 129, this, this.Dd.bind(this, 2));
    x(a, 130, this, this.Dd.bind(this, 3));
    x(a, 143, this, this.Dd.bind(this, 4));
    x(a, 139, this, this.Dd.bind(this, 5));
    x(a, 137, this, this.Dd.bind(this, 6));
    x(a, 138, this, this.Dd.bind(this, 7));
    u(a, 1159, this, this.ye.bind(this, 0));
    u(a, 1155, this, this.ye.bind(this, 1));
    u(a, 1153, this, this.ye.bind(this, 2));
    u(a, 1154, this, this.ye.bind(this, 3));
    u(a, 1163, this, this.ye.bind(this, 5));
    u(a, 1161, this, this.ye.bind(this, 6));
    u(a, 1162, this, this.ye.bind(this, 7));
    x(a, 1159, this, this.xe.bind(this, 0));
    x(a, 1155, this, this.xe.bind(this, 1));
    x(a, 1153, this, this.xe.bind(this, 2));
    x(a, 1154, this, this.xe.bind(this, 3));
    x(a, 1163, this, this.xe.bind(this, 5));
    x(a, 1161, this, this.xe.bind(this, 6));
    x(a, 1162, this, this.xe.bind(this, 7));
    u(a, 10, this, this.yi.bind(this, 0));
    u(a, 212, this, this.yi.bind(this, 4));
    u(a, 15, this, this.xi.bind(this, 0));
    u(a, 222, this, this.xi.bind(this, 4));
    x(a, 15, this, this.wi.bind(this, 0));
    x(a, 222, this, this.wi.bind(this, 4));
    u(a, 11, this, this.vi.bind(this, 0));
    u(a, 214, this, this.vi.bind(this, 4));
    u(a, 12, this, this.ui);
    u(a, 216, this, this.ui)
}
n = Oa.prototype;
n.ia = function() {
    return [this.o, this.A, this.g, this.j, this.h, this.l, this.Mc, this.B, this.i]
}
;
n.J = function(a) {
    this.o = a[0];
    this.A = a[1];
    this.g = a[2];
    this.j = a[3];
    this.h = a[4];
    this.l = a[5];
    this.Mc = a[6];
    this.B = a[7];
    this.i = a[8]
}
;
n.Cd = function(a, b) {
    this.h[a] = Pa(this, this.h[a], b, !1);
    this.l[a] = Pa(this, this.l[a], b, !0)
}
;
n.Bd = function(a) {
    return Qa(this, this.h[a])
}
;
n.Ad = function(a, b) {
    this.g[a] = Pa(this, this.g[a], b, !1);
    this.j[a] = Pa(this, this.j[a], b, !0)
}
;
n.zd = function(a) {
    return Qa(this, this.g[a])
}
;
n.ye = function(a, b) {
    this.A[a] = b
}
;
n.xe = function(a) {
    return this.A[a]
}
;
n.Ed = function(a, b) {
    this.o[a] = b
}
;
n.Dd = function(a) {
    return this.o[a]
}
;
n.yi = function(a, b) {
    Ra(this, (b & 3) + a, b & 4 ? 1 : 0)
}
;
n.xi = function(a, b) {
    for (var c = 0; 4 > c; c++)
        Ra(this, a + c, b & 1 << c)
}
;
n.wi = function(a) {
    var b = 0 | this.Mc[a + 0];
    b |= this.Mc[a + 1] << 1;
    b |= this.Mc[a + 2] << 2;
    return b |= this.Mc[a + 3] << 3
}
;
n.vi = function(a, b) {
    this.B[(b & 3) + a] = b
}
;
n.ui = function() {
    this.i = 0
}
;
function Ra(a, b, c) {
    if (a.Mc[b] !== c && (a.Mc[b] = c,
    !c))
        for (c = 0; c < a.Dg.length; c++)
            a.Dg[c].gg.call(a.Dg[c].kh, b)
}
function Sa(a, b, c, d) {
    var e = a.h[2] + 1
      , f = Ta(a, 2);
    if (c + e > b.byteLength)
        d(!0);
    else {
        var h = a.s;
        a.g[2] += e;
        b.get(c, e, function(g) {
            Ua(h, g, f);
            d(!1)
        })
    }
}
n.rf = function(a, b, c, d, e) {
    var f = this.h[d] + 1 & 65535
      , h = 5 <= d ? 2 : 1
      , g = f * h
      , k = Ta(this, d)
      , l = !1
      , m = !1
      , p = this.B[d] & 16;
    c < g ? (f = Math.floor(c / h),
    g = f * h,
    l = !0) : c > g && (m = !0);
    b + g > a.byteLength ? e(!0) : (this.g[d] += f,
    this.h[d] -= f,
    !l && p && (this.g[d] = this.j[d],
    this.h[d] = this.l[d]),
    a.set(b, this.s.lb.subarray(k, k + g), () => {
        m && p ? this.rf(a, b + g, c - g, d, e) : e(!1)
    }
    ))
}
;
function Ta(a, b) {
    var c = a.g[b];
    5 <= b && (c <<= 1);
    c = c & 65535 | a.o[b] << 16;
    return c |= a.A[b] << 24
}
function Pa(a, b, c, d) {
    d || (a.i ^= 1);
    return a.i ? b & -256 | c : b & -65281 | c << 8
}
function Qa(a, b) {
    a.i ^= 1;
    return a.i ? b & 255 : b >> 8 & 255
}
;function Ya(a) {
    this.ports = [];
    this.s = a;
    for (var b = 0; 65536 > b; b++)
        this.ports[b] = Za(this);
    var c = a.G[0];
    for (b = 0; b << 17 < c; b++)
        a.g[b] = a.j[b] = void 0,
        a.ga[b] = a.i[b] = void 0;
    $a(this, c, 4294967296 - c, function() {
        return 255
    }, function() {}, function() {
        return -1
    }, function() {})
}
function Za(a) {
    return {
        Be: a.Fj,
        gb: a.Dj,
        Jf: a.Ej,
        Fg: a.Ng,
        Tf: a.Ng,
        Ca: a.Ng,
        rd: void 0
    }
}
n = Ya.prototype;
n.Fj = function() {
    return 255
}
;
n.Dj = function() {
    return 65535
}
;
n.Ej = function() {
    return -1
}
;
n.Ng = function() {}
;
function x(a, b, c, d, e, f) {
    d && (a.ports[b].Be = d);
    e && (a.ports[b].gb = e);
    f && (a.ports[b].Jf = f);
    a.ports[b].rd = c
}
function u(a, b, c, d, e, f) {
    d && (a.ports[b].Fg = d);
    e && (a.ports[b].Tf = e);
    f && (a.ports[b].Ca = f);
    a.ports[b].rd = c
}
n.Ce = function(a, b, c, d, e, f) {
    function h() {
        return c.call(this) | d.call(this) << 8
    }
    function g() {
        return e.call(this) | f.call(this) << 8
    }
    function k() {
        return c.call(this) | d.call(this) << 8 | e.call(this) << 16 | f.call(this) << 24
    }
    e && f ? (x(this, a, b, c, h, k),
    x(this, a + 1, b, d),
    x(this, a + 2, b, e, g),
    x(this, a + 3, b, f)) : (x(this, a, b, c, h),
    x(this, a + 1, b, d))
}
;
n.kd = function(a, b, c, d, e, f) {
    function h(l) {
        c.call(this, l & 255);
        d.call(this, l >> 8 & 255)
    }
    function g(l) {
        e.call(this, l & 255);
        f.call(this, l >> 8 & 255)
    }
    function k(l) {
        c.call(this, l & 255);
        d.call(this, l >> 8 & 255);
        e.call(this, l >> 16 & 255);
        f.call(this, l >>> 24)
    }
    e && f ? (u(this, a, b, c, h, k),
    u(this, a + 1, b, d),
    u(this, a + 2, b, e, g),
    u(this, a + 3, b, f)) : (u(this, a, b, c, h),
    u(this, a + 1, b, d))
}
;
n.Sj = function(a) {
    var b = this.s.g[a >>> 17];
    return b(a) | b(a + 1) << 8 | b(a + 2) << 16 | b(a + 3) << 24
}
;
n.Tj = function(a, b) {
    var c = this.s.j[a >>> 17];
    c(a, b & 255);
    c(a + 1, b >> 8 & 255);
    c(a + 2, b >> 16 & 255);
    c(a + 3, b >>> 24)
}
;
function $a(a, b, c, d, e, f, h) {
    f || (f = a.Sj.bind(a));
    h || (h = a.Tj.bind(a));
    for (b >>>= 17; 0 < c; b++)
        a.s.g[b] = d,
        a.s.j[b] = e,
        a.s.ga[b] = f,
        a.s.i[b] = h,
        c -= 131072
}
function ab(a, b) {
    a = a.ports[b];
    return a.Jf.call(a.rd, b)
}
;function bb() {
    this.Cf = {};
    this.g = void 0
}
bb.prototype.register = function(a, b, c) {
    var d = this.Cf[a];
    void 0 === d && (d = this.Cf[a] = []);
    d.push({
        gg: b,
        kh: c
    })
}
;
bb.prototype.unregister = function(a, b) {
    var c = this.Cf[a];
    void 0 !== c && (this.Cf[a] = c.filter(function(d) {
        return d.gg !== b
    }))
}
;
bb.prototype.send = function(a, b) {
    if (this.g && (a = this.g.Cf[a],
    void 0 !== a))
        for (var c = 0; c < a.length; c++) {
            var d = a[c];
            d.gg.call(d.kh, b)
        }
}
;
function cb() {
    var a = new bb
      , b = new bb;
    a.g = b;
    b.g = a;
    return [a, b]
}
;var eb = new Uint8Array(256)
  , fb = []
  , gb = []
  , hb = []
  , ib = new Uint8Array(256)
  , jb = [];
function kb(a, b) {
    this.s = a;
    this.v = b;
    this.Ta = new ta(64);
    this.ra = new ta(64);
    this.i = this.o = this.Yb = this.K = 0;
    this.W = new Uint8Array(256);
    lb(this);
    this.Ue = !1;
    this.Pf = 0;
    this.ac = this.$b = this.me = this.Qc = !1;
    this.nc = [new ua, new ua];
    this.Fb = a.u.Fb;
    this.Gb = this.Pc = this.j = this.qc = this.l = this.D = 0;
    this.rc = 1;
    this.le = 5;
    this.pc = !1;
    this.g = new ArrayBuffer(65536);
    this.ba = new Int8Array(this.g);
    this.B = new Uint8Array(this.g);
    this.aa = new Int16Array(this.g);
    this.ga = new Uint16Array(this.g);
    this.ua = new Ca(this.g);
    this.sc = this.A = !1;
    this.wb = 22050;
    b.send("dac-tell-sampling-rate", this.wb);
    this.h = 1;
    this.T = 170;
    this.N = 0;
    this.ee = new Uint8Array(256);
    this.F = new ta(64);
    this.X = this.U = this.Pa = 0;
    this.Ij = !1;
    this.qa = 5;
    this.pe = new Uint8Array(16);
    a.C.Ce(544, this, this.ii, this.ki, this.$j, this.bk);
    a.C.Ce(904, this, this.ii, this.ki);
    a.C.Ce(548, this, this.dk, this.fk);
    x(a.C, 550, this, this.hk);
    x(a.C, 551, this, this.jk);
    x(a.C, 552, this, this.lk);
    x(a.C, 553, this, this.nk);
    x(a.C, 554, this, this.qk);
    x(a.C, 555, this, this.sk);
    x(a.C, 556, this, this.uk);
    x(a.C, 557, this, this.wk);
    a.C.Ce(558, this, this.yk, this.Ak);
    a.C.kd(544, this, this.ji, this.li, this.ak, this.ck);
    a.C.kd(904, this, this.ji, this.li);
    a.C.kd(548, this, this.ek, this.gk);
    u(a.C, 550, this, this.ik);
    u(a.C, 551, this, this.kk);
    a.C.kd(552, this, this.mk, this.pk);
    u(a.C, 554, this, this.rk);
    u(a.C, 555, this, this.tk);
    u(a.C, 556, this, this.vk);
    u(a.C, 557, this, this.xk);
    u(a.C, 558, this, this.zk);
    u(a.C, 559, this, this.Bk);
    a.C.Ce(816, this, this.dl, this.fl);
    a.C.kd(816, this, this.el, this.gl);
    this.Fb.Dg.push({
        gg: this.na,
        kh: this
    });
    b.register("dac-request-data", function() {
        !this.qc || this.sc ? mb(this) : nb(this)
    }, this);
    b.register("speaker-has-initialized", function() {
        lb(this)
    }, this);
    b.send("speaker-confirm-initialized");
    ob(this)
}
function ob(a) {
    a.Ta.clear();
    a.ra.clear();
    a.Yb = 0;
    a.o = 0;
    a.Ue = !1;
    a.Pf = 0;
    a.Qc = !1;
    a.me = !1;
    a.$b = !1;
    a.ac = !1;
    a.nc[0].clear();
    a.nc[1].clear();
    a.D = 0;
    a.l = 0;
    a.qc = 0;
    a.j = 0;
    a.Pc = 0;
    a.Gb = 0;
    a.pc = !1;
    a.B.fill(0);
    a.A = !1;
    a.sc = !1;
    a.T = 170;
    a.N = 0;
    a.wb = 22050;
    a.h = 1;
    pb(a, 1);
    a.pe.fill(0);
    a.ee.fill(0);
    a.ee[5] = 1;
    a.ee[9] = 248
}
n = kb.prototype;
n.ia = function() {
    var a = [];
    a[2] = this.K;
    a[3] = this.Yb;
    a[4] = this.o;
    a[5] = this.i;
    a[6] = this.W;
    a[7] = this.Ue;
    a[8] = this.Pf;
    a[9] = this.Qc;
    a[10] = this.me;
    a[11] = this.$b;
    a[12] = this.ac;
    a[15] = this.D;
    a[16] = this.l;
    a[17] = this.qc;
    a[18] = this.j;
    a[19] = this.Pc;
    a[20] = this.Gb;
    a[21] = this.rc;
    a[22] = this.le;
    a[23] = this.pc;
    a[24] = this.B;
    a[25] = this.A;
    a[26] = this.sc;
    a[27] = this.wb;
    a[28] = this.h;
    a[29] = this.T;
    a[30] = this.N;
    a[31] = this.ee;
    a[33] = this.ab;
    a[34] = this.qa;
    a[35] = this.pe;
    return a
}
;
n.J = function(a) {
    this.K = a[2];
    this.Yb = a[3];
    this.o = a[4];
    this.i = a[5];
    this.W = a[6];
    qb(this);
    this.Ue = a[7];
    this.Pf = a[8];
    this.Qc = a[9];
    this.me = a[10];
    this.$b = a[11];
    this.ac = a[12];
    this.D = a[15];
    this.l = a[16];
    this.qc = a[17];
    this.j = a[18];
    this.Pc = a[19];
    this.Gb = a[20];
    this.rc = a[21];
    this.le = a[22];
    this.pc = a[23];
    this.B = a[24];
    this.A = a[25];
    this.sc = a[26];
    this.wb = a[27];
    this.h = a[28];
    this.T = a[29];
    this.N = a[30];
    this.ee = a[31];
    this.ab = a[33];
    this.qa = a[34];
    this.pe = a[35];
    this.g = this.B.buffer;
    this.ba = new Int8Array(this.g);
    this.aa = new Int16Array(this.g);
    this.ga = new Uint16Array(this.g);
    this.ua = new Ca(this.g);
    this.sc ? this.v.send("dac-disable") : this.v.send("dac-enable")
}
;
n.ii = function() {
    return 255
}
;
n.ki = function() {
    return 255
}
;
n.$j = function() {
    return 255
}
;
n.bk = function() {
    return 255
}
;
n.dk = function() {
    return this.i
}
;
n.fk = function() {
    var a = this.i
      , b = gb[a];
    return b ? b.call(this) : this.W[a]
}
;
n.hk = function() {
    return 255
}
;
n.jk = function() {
    return 255
}
;
n.lk = function() {
    return 255
}
;
n.nk = function() {
    return 255
}
;
n.qk = function() {
    this.ra.length && (this.K = this.ra.shift());
    return this.K
}
;
n.sk = function() {
    return 255
}
;
n.uk = function() {
    return 127
}
;
n.wk = function() {
    return 255
}
;
n.yk = function() {
    this.pe[1] && pb(this, 1);
    return (this.ra.length && !this.Qc) << 7 | 127
}
;
n.Ak = function() {
    pb(this, 2);
    return 0
}
;
n.ji = function() {
    this.U = 0
}
;
n.li = function(a) {
    var b = jb[this.U];
    b || (b = this.Z);
    b.call(this, a, 0, this.U)
}
;
n.ak = function() {
    this.X = 0
}
;
n.ck = function(a) {
    var b = jb[this.X];
    b || (b = this.Z);
    b.call(this, a, 1, this.X)
}
;
n.ek = function(a) {
    this.i = a
}
;
n.gk = function(a) {
    rb(this, this.i, a)
}
;
n.ik = function(a) {
    this.Qc ? this.Qc = !1 : a && ob(this);
    this.ra.clear();
    this.ra.push(170)
}
;
n.kk = function() {}
;
n.mk = function() {}
;
n.pk = function() {}
;
n.rk = function() {}
;
n.tk = function() {}
;
n.vk = function(a) {
    0 === this.Yb ? (this.Yb = a,
    this.Ta.clear(),
    this.o = eb[a]) : this.Ta.push(a);
    this.Ta.length >= this.o && (a = fb[this.Yb],
    a || (a = this.Gh),
    a.call(this),
    this.o = this.Yb = 0,
    this.Ta.clear())
}
;
n.xk = function() {}
;
n.zk = function() {}
;
n.Bk = function() {}
;
n.dl = function() {
    this.F.length && (this.Pa = this.F.shift());
    return this.Pa
}
;
n.el = function() {}
;
n.fl = function() {
    return 0 | 128 * !this.F.length
}
;
n.gl = function(a) {
    255 === a && (this.F.clear(),
    this.F.push(254))
}
;
n.Gh = function() {}
;
function F(a, b, c) {
    c || (c = kb.prototype.Gh);
    for (var d = 0; d < a.length; d++)
        eb[a[d]] = b,
        fb[a[d]] = c
}
function sb(a) {
    for (var b = [], c = 0; 16 > c; c++)
        b.push(a + c);
    return b
}
F([14], 2, function() {
    this.ee[this.Ta.shift()] = this.Ta.shift()
});
F([15], 1, function() {
    this.ra.clear();
    this.ra.push(this.ee[this.Ta.shift()])
});
F([16], 1, function() {
    var a = this.Ta.shift();
    a = tb(a / 127.5 + -1);
    this.nc[0].push(a);
    this.nc[1].push(a);
    this.v.send("dac-enable")
});
F([20, 21], 2, function() {
    this.Pc = 1;
    this.Gb = this.rc;
    this.Qc = this.$b = this.ac = this.pc = !1;
    ub(this);
    vb(this)
});
F([22], 2);
F([23], 2);
F([28], 0, function() {
    this.Pc = 1;
    this.Gb = this.rc;
    this.pc = !0;
    this.Qc = this.$b = this.ac = !1;
    vb(this)
});
F([31], 0);
F([32], 0, function() {
    this.ra.clear();
    this.ra.push(127)
});
F([36], 2);
F([44], 0);
F([48], 0);
F([49], 0);
F([52], 0);
F([53], 0);
F([54], 0);
F([55], 0);
F([56], 0);
F([64], 1, function() {
    wb(this, 1E6 / (256 - this.Ta.shift()) / (this.me ? 2 : 1))
});
F([65, 66], 2, function() {
    wb(this, this.Ta.shift() << 8 | this.Ta.shift())
});
F([72], 2, function() {
    ub(this)
});
F([116], 2);
F([117], 2);
F([118], 2);
F([119], 2);
F([125], 0);
F([127], 0);
F([128], 2);
F([144], 0, function() {
    this.Pc = 1;
    this.Gb = this.rc;
    this.pc = !0;
    this.ac = !1;
    this.Qc = !0;
    this.$b = !1;
    vb(this)
});
F([145], 0);
F([152], 0);
F([153], 0);
F([160], 0);
F([168], 0);
F(sb(176), 3, function() {
    if (!(this.Yb & 8)) {
        var a = this.Ta.shift();
        this.Pc = 2;
        this.Gb = this.le;
        this.pc = !!(this.Yb & 4);
        this.ac = !!(a & 16);
        this.me = !!(a & 32);
        this.$b = !0;
        ub(this);
        vb(this)
    }
});
F(sb(192), 3, function() {
    if (!(this.Yb & 8)) {
        var a = this.Ta.shift();
        this.Pc = 1;
        this.Gb = this.rc;
        this.pc = !!(this.Yb & 4);
        this.ac = !!(a & 16);
        this.me = !!(a & 32);
        this.$b = !1;
        ub(this);
        vb(this)
    }
});
F([208], 0, function() {
    this.sc = !0;
    this.v.send("dac-disable")
});
F([209], 0, function() {
    this.Ue = !0
});
F([211], 0, function() {
    this.Ue = !1
});
F([212], 0, function() {
    this.sc = !1;
    this.v.send("dac-enable")
});
F([213], 0, function() {
    this.sc = !0;
    this.v.send("dac-disable")
});
F([214], 0, function() {
    this.sc = !1;
    this.v.send("dac-enable")
});
F([216], 0, function() {
    this.ra.clear();
    this.ra.push(255 * this.Ue)
});
F([217, 218], 0, function() {
    this.pc = !1
});
F([224], 1, function() {
    this.ra.clear();
    this.ra.push(~this.Ta.shift())
});
F([225], 0, function() {
    this.ra.clear();
    this.ra.push(4);
    this.ra.push(5)
});
F([226], 1);
F([227], 0, function() {
    this.ra.clear();
    for (var a = 0; 44 > a; a++)
        this.ra.push("COPYRIGHT (C) CREATIVE TECHNOLOGY LTD, 1992.".charCodeAt(a));
    this.ra.push(0)
});
F([228], 1, function() {
    this.Pf = this.Ta.shift()
});
F([232], 0, function() {
    this.ra.clear();
    this.ra.push(this.Pf)
});
F([242, 243], 0, function() {
    this.Sa()
});
var xb = new Uint8Array(256);
xb[14] = 255;
xb[15] = 7;
xb[55] = 56;
F([249], 1, function() {
    var a = this.Ta.shift();
    this.ra.clear();
    this.ra.push(xb[a])
});
function rb(a, b, c) {
    (b = hb[b]) && b.call(a, c)
}
kb.prototype.Na = function() {
    return this.W[this.i]
}
;
kb.prototype.Ua = function(a) {
    this.W[this.i] = a
}
;
function lb(a) {
    a.W[4] = 204;
    a.W[34] = 204;
    a.W[38] = 204;
    a.W[40] = 0;
    a.W[46] = 0;
    a.W[10] = 0;
    a.W[48] = 192;
    a.W[49] = 192;
    a.W[50] = 192;
    a.W[51] = 192;
    a.W[52] = 192;
    a.W[53] = 192;
    a.W[54] = 0;
    a.W[55] = 0;
    a.W[56] = 0;
    a.W[57] = 0;
    a.W[59] = 0;
    a.W[60] = 31;
    a.W[61] = 21;
    a.W[62] = 11;
    a.W[63] = 0;
    a.W[64] = 0;
    a.W[65] = 0;
    a.W[66] = 0;
    a.W[67] = 0;
    a.W[68] = 128;
    a.W[69] = 128;
    a.W[70] = 128;
    a.W[71] = 128;
    qb(a)
}
function qb(a) {
    for (var b = 1; b < a.W.length; b++)
        ib[b] || rb(a, b, a.W[b])
}
function yb(a, b) {
    b || (b = kb.prototype.Na);
    gb[a] = b
}
function zb(a, b) {
    b || (b = kb.prototype.Ua);
    hb[a] = b
}
function Ab(a, b, c) {
    ib[a] = 1;
    gb[a] = function() {
        return this.W[b] & 240 | this.W[c] >>> 4
    }
    ;
    hb[a] = function(d) {
        this.W[a] = d;
        var e = d << 4 & 240 | this.W[c] & 15;
        rb(this, b, d & 240 | this.W[b] & 15);
        rb(this, c, e)
    }
}
function Bb(a, b, c) {
    gb[a] = kb.prototype.Na;
    hb[a] = function(d) {
        this.W[a] = d;
        this.v.send("mixer-volume", [b, c, (d >>> 2) - 62])
    }
}
yb(0, function() {
    lb(this);
    return 0
});
zb(0);
Ab(4, 50, 51);
Ab(34, 48, 49);
Ab(38, 52, 53);
Ab(40, 54, 55);
Ab(46, 56, 57);
Bb(48, 0, 0);
Bb(49, 0, 1);
Bb(50, 2, 0);
Bb(51, 2, 1);
yb(59);
zb(59, function(a) {
    this.W[59] = a;
    this.v.send("mixer-volume", [1, 2, 6 * (a >>> 6) - 18])
});
yb(65);
zb(65, function(a) {
    this.W[65] = a;
    this.v.send("mixer-gain-left", 6 * (a >>> 6))
});
yb(66);
zb(66, function(a) {
    this.W[66] = a;
    this.v.send("mixer-gain-right", 6 * (a >>> 6))
});
yb(68);
zb(68, function(a) {
    this.W[68] = a;
    a >>>= 3;
    this.v.send("mixer-treble-left", a - (16 > a ? 14 : 16))
});
yb(69);
zb(69, function(a) {
    this.W[69] = a;
    a >>>= 3;
    this.v.send("mixer-treble-right", a - (16 > a ? 14 : 16))
});
yb(70);
zb(70, function(a) {
    this.W[70] = a;
    a >>>= 3;
    this.v.send("mixer-bass-right", a - (16 > a ? 14 : 16))
});
yb(71);
zb(71, function(a) {
    this.W[71] = a;
    a >>>= 3;
    this.v.send("mixer-bass-right", a - (16 > a ? 14 : 16))
});
yb(128, function() {
    switch (this.qa) {
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
zb(128, function(a) {
    a & 1 && (this.qa = 2);
    a & 2 && (this.qa = 5);
    a & 4 && (this.qa = 7);
    a & 8 && (this.qa = 10)
});
yb(129, function() {
    var a = 0;
    switch (this.rc) {
    case 0:
        a |= 1;
        break;
    case 1:
        a |= 2;
        break;
    case 3:
        a |= 8
    }
    switch (this.le) {
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
zb(129, function(a) {
    a & 1 && (this.rc = 0);
    a & 2 && (this.rc = 1);
    a & 8 && (this.rc = 3);
    a & 32 && (this.le = 5);
    a & 64 && (this.le = 6);
    a & 128 && (this.le = 7)
});
yb(130, function() {
    for (var a = 32, b = 0; 16 > b; b++)
        a |= b * this.pe[b];
    return a
});
kb.prototype.Z = function() {}
;
function Cb(a, b) {
    b || (b = kb.prototype.Z);
    for (var c = 0; c < a.length; c++)
        jb[a[c]] = b
}
function Db(a, b) {
    for (var c = []; a <= b; a++)
        c.push(a);
    return c
}
const Eb = new Uint8Array(32);
Eb[0] = 0;
Eb[1] = 1;
Eb[2] = 2;
Eb[3] = 3;
Eb[4] = 4;
Eb[5] = 5;
Eb[8] = 6;
Eb[9] = 7;
Eb[10] = 8;
Eb[11] = 9;
Eb[12] = 10;
Eb[13] = 11;
Eb[16] = 12;
Eb[17] = 13;
Eb[18] = 14;
Eb[19] = 15;
Eb[20] = 16;
Eb[21] = 17;
Cb([1], function(a, b) {
    this.Ij[b] = a & 1
});
Cb([2]);
Cb([3]);
Cb([4], function() {});
Cb([5], function() {});
Cb([8], function() {});
Cb(Db(32, 53), function() {});
Cb(Db(64, 85), function() {});
Cb(Db(96, 117), function() {});
Cb(Db(128, 149), function() {});
Cb(Db(160, 168), function() {});
Cb(Db(176, 184), function() {});
Cb([189], function() {});
Cb(Db(192, 200), function() {});
Cb(Db(224, 245), function() {});
function wb(a, b) {
    a.wb = b;
    a.v.send("dac-tell-sampling-rate", b)
}
function ub(a) {
    a.D = 1 + (a.Ta.shift() << 0) + (a.Ta.shift() << 8)
}
function vb(a) {
    a.h = 1;
    a.$b && (a.h *= 2);
    a.l = a.D * a.h;
    a.j = 1024 * a.h;
    a.j = Math.min(Math.max(a.l >> 2 & -4, 32), a.j);
    a.A = !0;
    a.Fb.Mc[a.Gb] || a.na(a.Gb)
}
kb.prototype.na = function(a) {
    a === this.Gb && this.A && (this.A = !1,
    this.qc = this.l,
    this.sc = !1,
    this.v.send("dac-enable"))
}
;
function nb(a) {
    var b = Math.min(a.qc, a.j)
      , c = Math.floor(b / a.h);
    a.Fb.rf(a.ua, 0, b, a.Gb, d => {
        if (!d) {
            d = a.$b ? 32767.5 : 127.5;
            var e = a.ac ? 0 : -1, f = a.me ? 1 : 2, h;
            a.$b ? h = a.ac ? a.aa : a.ga : h = a.ac ? a.ba : a.B;
            for (var g = 0, k = 0; k < c; k++)
                for (var l = tb(h[k] / d + e), m = 0; m < f; m++)
                    a.nc[g].push(l),
                    g ^= 1;
            mb(a);
            a.qc -= b;
            a.qc || (a.Sa(a.Pc),
            a.pc && (a.qc = a.l))
        }
    }
    )
}
function mb(a) {
    if (a.nc[0].length) {
        var b = va(a.nc[0], a.nc[0].length)
          , c = va(a.nc[1], a.nc[1].length);
        a.v.send("dac-send-data", [b, c], [b.buffer, c.buffer])
    }
}
kb.prototype.Sa = function(a) {
    this.pe[a] = 1;
    this.s.Wa(this.qa)
}
;
function pb(a, b) {
    a.pe[b] = 0;
    Fb(a.s, a.qa)
}
function tb(a) {
    return -1 * (-1 > a) + 1 * (1 < a) + (-1 <= a && 1 >= a) * a
}
;function Gb(a) {
    this.message = a
}
Gb.prototype = Error();
const Hb = {
    Uint8Array,
    Int8Array,
    Uint16Array,
    Int16Array,
    Uint32Array,
    Int32Array,
    Float32Array,
    Float64Array
};
function Ib(a, b) {
    if ("object" !== typeof a || null === a)
        return a;
    if (Array.isArray(a))
        return a.map(e => Ib(e, b));
    a.constructor === Object && console.log(a);
    if (a.BYTES_PER_ELEMENT) {
        var c = new Uint8Array(a.buffer,a.byteOffset,a.length * a.BYTES_PER_ELEMENT);
        return {
            __state_type__: a.constructor.name.replace("bound ", ""),
            buffer_id: b.push(c) - 1
        }
    }
    a = a.ia();
    c = [];
    for (var d = 0; d < a.length; d++)
        c[d] = Ib(a[d], b);
    return c
}
function Jb(a, b) {
    if ("object" !== typeof a || null === a)
        return a;
    if (Array.isArray(a)) {
        for (let c = 0; c < a.length; c++)
            a[c] = Jb(a[c], b);
        return a
    }
    return new Hb[a.__state_type__](b[a.buffer_id])
}
function Kb(a, b) {
    function c(r, v) {
        const B = r.length;
        if (16 > B)
            throw new Gb("Invalid length: " + B);
        r = new Int32Array(r.buffer,r.byteOffset,4);
        if (-2039052682 !== r[0])
            throw new Gb("Invalid header: " + fa(r[0] >>> 0));
        if (6 !== r[1])
            throw new Gb("Version mismatch: dump=" + r[1] + " we=6");
        if (v && r[2] !== B)
            throw new Gb("Length doesn't match header: real=" + B + " header=" + r[2]);
        return r[3]
    }
    function d(r) {
        r = (new TextDecoder).decode(r);
        return JSON.parse(r)
    }
    b = new Uint8Array(b);
    if (4247762216 === (new Uint32Array(b.buffer,0,1))[0]) {
        var e = a.Oi(b.length);
        (new Uint8Array(a.La.buffer,a.Qi(e),b.length)).set(b);
        var f = a.gf(e, 16)
          , h = new Uint8Array(a.La.buffer,f,16)
          , g = c(h, !1);
        a.hf(f, 16);
        f = a.gf(e, g);
        h = new Uint8Array(a.La.buffer,f,g);
        h = d(h);
        a.hf(f, g);
        f = h.state;
        var k = h.buffer_infos;
        h = [];
        g = 16 + g;
        for (var l of k) {
            k = (g + 3 & -4) - g;
            if (1048576 < l.length) {
                var m = a.gf(e, k);
                a.hf(m, k);
                m = new Uint8Array(l.length);
                h.push(m.buffer);
                for (var p = 0; p < l.length; ) {
                    const r = Math.min(l.length - p, 1048576)
                      , v = a.gf(e, r);
                    m.set(new Uint8Array(a.La.buffer,v,r), p);
                    a.hf(v, r);
                    p += r
                }
            } else
                m = a.gf(e, k + l.length),
                p = m + k,
                h.push(a.La.buffer.slice(p, p + l.length)),
                a.hf(m, k + l.length);
            g += k + l.length
        }
        f = Jb(f, h);
        a.J(f);
        a.Pi(e)
    } else {
        l = c(b, !0);
        if (0 > l || l + 12 >= b.length)
            throw new Gb("Invalid info block length: " + l);
        f = d(b.subarray(16, 16 + l));
        e = f.state;
        f = f.buffer_infos;
        let r = 16 + l;
        r = r + 3 & -4;
        l = f.map(v => {
            const B = r + v.offset;
            return b.buffer.slice(B, B + v.length)
        }
        );
        e = Jb(e, l);
        a.J(e)
    }
}
;function Lb(a, b, c, d, e) {
    let f = "";
    var h = []
      , g = b ? "compiled" : c ? "jit exit" : d ? "unguarded register" : e ? "wasm size" : "executed";
    for (let m = 0; 256 > m; m++)
        for (let p = 0; 8 > p; p++)
            for (const r of [!1, !0]) {
                var k = a.Ma.exports.get_opstats_buffer(b, c, d, e, m, !1, r, p);
                h.push({
                    qg: m,
                    count: k,
                    Vh: r,
                    Lh: p
                });
                k = a.Ma.exports.get_opstats_buffer(b, c, d, e, m, !0, r, p);
                h.push({
                    qg: 3840 | m,
                    count: k,
                    Vh: r,
                    Lh: p
                })
            }
    a = 0;
    b = new Set([38, 46, 54, 62, 100, 101, 102, 103, 240, 242, 243]);
    for (const {count: m, qg: p} of h)
        b.has(p) || (a += m);
    if (0 === a)
        return "";
    c = new Uint32Array(256);
    b = new Uint32Array(256);
    for (const {qg: m, count: p} of h)
        3840 === (m & 65280) ? b[m & 255] += p : c[m & 255] += p;
    f = f + "------------------\nTotal: " + (a + "\n");
    const l = 1E7 < a ? 1E3 : 1;
    d = Math.max.apply(Math, h.map( ({count: m}) => Math.round(m / l)));
    d = String(d).length;
    f += `Instruction counts ${g} (in ${l}):\n`;
    for (e = 0; 256 > e; e++)
        f += e.toString(16).padStart(2, "0") + ":" + da(Math.round(c[e] / l), d),
        f = 15 === e % 16 ? f + "\n" : f + " ";
    f = f + "\n" + `Instruction counts ${g} (0f, in ${l}):\n`;
    for (g = 0; 256 > g; g++)
        f += (g & 255).toString(16).padStart(2, "0") + ":" + da(Math.round(b[g] / l), d),
        f = 15 === g % 16 ? f + "\n" : f + " ";
    f += "\n";
    h = h.filter( ({count: m}) => m).sort( ({count: m}, {count: p}) => p - m);
    for (const {qg: m, Vh: p, Lh: r, count: v} of h.slice(0, 200))
        f += m.toString(16) + "_" + r + (p ? "_m" : "_r") + ":" + (v / a * 100).toFixed(2) + " ";
    return f + "\n"
}
;function Mb(a) {
    this.s = a;
    this.he = 0;
    this.ha = new Uint8Array(128);
    this.K = this.h = Date.now();
    this.o = this.j = 0;
    this.B = !1;
    this.D = .9765625;
    this.l = 38;
    this.g = 2;
    this.Ug = this.i = 0;
    this.F = !1;
    this.A = 0;
    u(a.C, 112, this, function(b) {
        this.he = b & 127;
        this.Ug = b >> 7
    });
    u(a.C, 113, this, this.kj);
    x(a.C, 113, this, this.jj)
}
n = Mb.prototype;
n.ia = function() {
    var a = [];
    a[0] = this.he;
    a[1] = this.ha;
    a[2] = this.h;
    a[3] = this.K;
    a[4] = this.j;
    a[5] = this.o;
    a[6] = this.B;
    a[7] = this.D;
    a[8] = this.l;
    a[9] = this.g;
    a[10] = this.i;
    a[11] = this.Ug;
    a[12] = this.F;
    a[13] = this.A;
    return a
}
;
n.J = function(a) {
    this.he = a[0];
    this.ha = a[1];
    this.h = a[2];
    this.K = a[3];
    this.j = a[4];
    this.o = a[5];
    this.B = a[6];
    this.D = a[7];
    this.l = a[8];
    this.g = a[9];
    this.i = a[10];
    this.Ug = a[11];
    this.F = a[12] || !1;
    this.A = a[13] || 0
}
;
n.Kc = function(a) {
    a = Date.now();
    this.h += a - this.K;
    this.K = a;
    this.B && this.j < a ? (this.s.Wa(8),
    this.i |= 192,
    this.j += this.D * Math.ceil((a - this.j) / this.D)) : this.o && this.o < a ? (this.s.Wa(8),
    this.i |= 160,
    this.o = 0) : this.F && this.A < a && (this.s.Wa(8),
    this.i |= 144,
    this.A = a + 1E3);
    let b = 100;
    this.B && this.j && (b = Math.min(b, Math.max(0, this.j - a)));
    this.o && (b = Math.min(b, Math.max(0, this.o - a)));
    this.F && (b = Math.min(b, Math.max(0, this.A - a)));
    return b
}
;
function Nb(a, b) {
    if (a.g & 4)
        a = b;
    else {
        a = b;
        for (var c = b = 0, d; a; )
            d = a % 10,
            c |= d << 4 * b,
            b++,
            a = (a - d) / 10;
        a = c
    }
    return a
}
function Ob(a, b) {
    var c;
    a.g & 4 ? c = b : c = (b & 15) + 10 * (b >> 4 & 15);
    return c
}
n.jj = function() {
    switch (this.he) {
    case 0:
        return Nb(this, (new Date(this.h)).getUTCSeconds());
    case 2:
        return Nb(this, (new Date(this.h)).getUTCMinutes());
    case 4:
        return Nb(this, (new Date(this.h)).getUTCHours());
    case 6:
        return Nb(this, (new Date(this.h)).getUTCDay() + 1);
    case 7:
        return Nb(this, (new Date(this.h)).getUTCDate());
    case 8:
        return Nb(this, (new Date(this.h)).getUTCMonth() + 1);
    case 9:
        return Nb(this, (new Date(this.h)).getUTCFullYear() % 100);
    case 10:
        return 999 <= Pb() % 1E3 ? this.l | 128 : this.l;
    case 11:
        return this.g;
    case 12:
        Fb(this.s, 8);
        var a = this.i;
        this.i &= -241;
        return a;
    case 13:
        return 0;
    case 50:
    case 55:
        return Nb(this, (new Date(this.h)).getUTCFullYear() / 100 | 0);
    default:
        return this.ha[this.he]
    }
}
;
n.kj = function(a) {
    switch (this.he) {
    case 10:
        this.l = a & 127;
        this.D = 1E3 / (32768 >> (this.l & 15) - 1);
        break;
    case 11:
        this.g = a;
        this.g & 128 && (this.g &= 239);
        this.g & 64 && (this.j = Date.now());
        if (this.g & 32) {
            a = new Date;
            const b = Ob(this, this.ha[1])
              , c = Ob(this, this.ha[3])
              , d = Ob(this, this.ha[5]);
            this.o = +new Date(Date.UTC(a.getUTCFullYear(), a.getUTCMonth(), a.getUTCDate(), d, c, b))
        }
        this.g & 16 && (this.A = Date.now());
        break;
    case 1:
    case 3:
    case 5:
        this.ha[this.he] = a
    }
    this.F = 16 === (this.g & 16) && 0 < (this.l & 15);
    this.B = 64 === (this.g & 64) && 0 < (this.l & 15)
}
;
function Qb(a, b) {
    this.s = a;
    this.v = b;
    this.i = new Float64Array(3);
    this.j = new Uint16Array(3);
    this.g = new Uint8Array(4);
    this.h = new Uint8Array(4);
    this.je = new Uint8Array(4);
    this.A = new Uint8Array(4);
    this.l = new Uint8Array(4);
    this.o = new Uint16Array(3);
    this.Zb = new Uint16Array(3);
    x(a.C, 97, this, function() {
        var c = Pb()
          , d = 66.66666666666667 * c & 1;
        c = Rb(this, 2, c);
        return d << 4 | c << 5
    });
    u(a.C, 97, this, function(c) {
        c & 1 ? this.v.send("pcspeaker-enable") : this.v.send("pcspeaker-disable")
    });
    x(a.C, 64, this, function() {
        return Sb(this, 0)
    });
    x(a.C, 65, this, function() {
        return Sb(this, 1)
    });
    x(a.C, 66, this, function() {
        return Sb(this, 2)
    });
    u(a.C, 64, this, function(c) {
        Tb(this, 0, c)
    });
    u(a.C, 65, this, function(c) {
        Tb(this, 1, c)
    });
    u(a.C, 66, this, function(c) {
        Tb(this, 2, c);
        this.v.send("pcspeaker-update", [this.je[2], this.Zb[2]])
    });
    u(a.C, 67, this, this.B)
}
Qb.prototype.ia = function() {
    var a = [];
    a[0] = this.g;
    a[1] = this.h;
    a[2] = this.je;
    a[3] = this.A;
    a[4] = this.l;
    a[5] = this.o;
    a[6] = this.Zb;
    a[7] = this.i;
    a[8] = this.j;
    return a
}
;
Qb.prototype.J = function(a) {
    this.g = a[0];
    this.h = a[1];
    this.je = a[2];
    this.A = a[3];
    this.l = a[4];
    this.o = a[5];
    this.Zb = a[6];
    this.i = a[7];
    this.j = a[8]
}
;
Qb.prototype.Kc = function(a, b) {
    var c = 100;
    b || (this.h[0] && Rb(this, 0, a) ? (this.j[0] = Ub(this, 0, a),
    this.i[0] = a,
    Fb(this.s, 0),
    this.s.Wa(0),
    0 === this.je[0] && (this.h[0] = 0)) : Fb(this.s, 0),
    this.h[0] && (c = (this.j[0] - Math.floor(1193.1816666 * (a - this.i[0]))) / 1193.1816666));
    return c
}
;
function Ub(a, b, c) {
    if (!a.h[b])
        return 0;
    c = a.j[b] - Math.floor(1193.1816666 * (c - a.i[b]));
    a = a.Zb[b];
    c >= a ? c %= a : 0 > c && (c = c % a + a);
    return c
}
function Rb(a, b, c) {
    c -= a.i[b];
    return 0 > c ? !0 : a.j[b] < Math.floor(1193.1816666 * c)
}
function Sb(a, b) {
    var c = a.l[b];
    if (c)
        return a.l[b]--,
        2 === c ? a.o[b] & 255 : a.o[b] >> 8;
    c = a.g[b];
    3 === a.je[b] && (a.g[b] ^= 1);
    a = Ub(a, b, Pb());
    return c ? a & 255 : a >> 8
}
function Tb(a, b, c) {
    a.Zb[b] = a.g[b] ? a.Zb[b] & -256 | c : a.Zb[b] & 255 | c << 8;
    3 === a.A[b] && a.g[b] || (a.Zb[b] || (a.Zb[b] = 65535),
    a.j[b] = a.Zb[b],
    a.h[b] = !0,
    a.i[b] = Pb());
    3 === a.A[b] && (a.g[b] ^= 1)
}
Qb.prototype.B = function(a) {
    var b = a >> 1 & 7
      , c = a >> 6 & 3;
    a = a >> 4 & 3;
    3 !== c && (0 === a ? (this.l[c] = 2,
    b = Ub(this, c, Pb()),
    this.o[c] = b ? b - 1 : 0) : (6 <= b && (b &= -5),
    this.g[c] = 1 === a ? 0 : 1,
    0 === c && Fb(this.s, 0),
    this.je[c] = b,
    this.A[c] = a,
    2 === c && this.v.send("pcspeaker-update", [this.je[2], this.Zb[2]])))
}
;
function Vb(a) {
    if ("undefined" !== typeof window)
        if (window.AudioContext || window.webkitAudioContext) {
            var b = window.AudioWorklet ? Wb : Xb;
            this.v = a;
            this.ca = window.AudioContext ? new AudioContext : new webkitAudioContext;
            this.ng = new Yb(a,this.ca);
            this.h = new Zb(a,this.ca,this.ng);
            this.g = new b(a,this.ca,this.ng);
            this.h.start();
            a.register("emulator-stopped", function() {
                this.ca.suspend()
            }, this);
            a.register("emulator-started", function() {
                this.ca.resume()
            }, this);
            a.register("speaker-confirm-initialized", function() {
                a.send("speaker-has-initialized")
            }, this);
            a.send("speaker-has-initialized")
        } else
            console.warn("Web browser doesn't support Web Audio API")
}
Vb.prototype.wa = function() {
    this.ca && this.ca.close();
    this.ca = null;
    this.g && this.g.Ec && this.g.Ec.port.close();
    this.g = null
}
;
function Yb(a, b) {
    function c(d) {
        return function(e) {
            d.gain.setValueAtTime(e, this.ca.currentTime)
        }
    }
    this.ca = b;
    this.sources = new Map;
    this.Ph = this.Oh = this.F = this.D = this.A = 1;
    this.i = this.ca.createBiquadFilter();
    this.j = this.ca.createBiquadFilter();
    this.i.type = "highshelf";
    this.j.type = "highshelf";
    this.i.frequency.setValueAtTime(2E3, this.ca.currentTime);
    this.j.frequency.setValueAtTime(2E3, this.ca.currentTime);
    this.g = this.ca.createBiquadFilter();
    this.h = this.ca.createBiquadFilter();
    this.g.type = "lowshelf";
    this.h.type = "lowshelf";
    this.g.frequency.setValueAtTime(200, this.ca.currentTime);
    this.h.frequency.setValueAtTime(200, this.ca.currentTime);
    this.l = this.ca.createGain();
    this.o = this.ca.createGain();
    this.B = this.ca.createChannelMerger(2);
    this.K = this.i;
    this.N = this.j;
    this.i.connect(this.g);
    this.g.connect(this.l);
    this.l.connect(this.B, 0, 0);
    this.j.connect(this.h);
    this.h.connect(this.o);
    this.o.connect(this.B, 0, 1);
    this.B.connect(this.ca.destination);
    a.register("mixer-connect", function(d) {
        var e = d[1];
        d = this.sources.get(d[0]);
        void 0 === d || d.connect(e)
    }, this);
    a.register("mixer-disconnect", function(d) {
        var e = d[1];
        d = this.sources.get(d[0]);
        void 0 === d || d.disconnect(e)
    }, this);
    a.register("mixer-volume", function(d) {
        var e = d[0]
          , f = d[1];
        d = Math.pow(10, d[2] / 20);
        e = 0 === e ? this : this.sources.get(e);
        void 0 === e || e.xg(d, f)
    }, this);
    a.register("mixer-gain-left", function(d) {
        this.Oh = Math.pow(10, d / 20);
        this.update()
    }, this);
    a.register("mixer-gain-right", function(d) {
        this.Ph = Math.pow(10, d / 20);
        this.update()
    }, this);
    a.register("mixer-treble-left", c(this.i), this);
    a.register("mixer-treble-right", c(this.j), this);
    a.register("mixer-bass-left", c(this.g), this);
    a.register("mixer-bass-right", c(this.h), this)
}
function $b(a, b, c) {
    b = new ac(a.ca,b,a.K,a.N);
    a.sources.has(c);
    a.sources.set(c, b);
    return b
}
Yb.prototype.xg = function(a, b) {
    void 0 === b && (b = 2);
    switch (b) {
    case 0:
        this.D = a;
        break;
    case 1:
        this.F = a;
        break;
    case 2:
        this.A = a;
        break;
    default:
        return
    }
    this.update()
}
;
Yb.prototype.update = function() {
    var a = this.A * this.F * this.Ph;
    this.l.gain.setValueAtTime(this.A * this.D * this.Oh, this.ca.currentTime);
    this.o.gain.setValueAtTime(a, this.ca.currentTime)
}
;
function ac(a, b, c, d) {
    this.ca = a;
    this.o = this.l = !0;
    this.D = this.B = this.j = this.g = 1;
    this.A = a.createChannelSplitter(2);
    this.h = a.createGain();
    this.i = a.createGain();
    b.connect(this.A);
    this.A.connect(this.h, 0);
    this.h.connect(c);
    this.A.connect(this.i, 1);
    this.i.connect(d)
}
ac.prototype.update = function() {
    var a = this.o * this.g * this.j * this.D;
    this.h.gain.setValueAtTime(this.l * this.g * this.j * this.B, this.ca.currentTime);
    this.i.gain.setValueAtTime(a, this.ca.currentTime)
}
;
ac.prototype.connect = function(a) {
    var b = !a || 2 === a;
    if (b || 0 === a)
        this.l = !0;
    if (b || 1 === a)
        this.o = !0;
    this.update()
}
;
ac.prototype.disconnect = function(a) {
    var b = !a || 2 === a;
    if (b || 0 === a)
        this.l = !1;
    if (b || 1 === a)
        this.o = !1;
    this.update()
}
;
ac.prototype.xg = function(a, b) {
    void 0 === b && (b = 2);
    switch (b) {
    case 0:
        this.B = a;
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
}
;
function Zb(a, b, c) {
    this.Ye = b.createOscillator();
    this.Ye.type = "square";
    this.Ye.frequency.setValueAtTime(440, b.currentTime);
    this.g = $b(c, this.Ye, 1);
    this.g.disconnect();
    a.register("pcspeaker-enable", function() {
        var d = c.sources.get(1);
        void 0 === d || d.connect(void 0)
    }, this);
    a.register("pcspeaker-disable", function() {
        var d = c.sources.get(1);
        void 0 === d || d.disconnect(void 0)
    }, this);
    a.register("pcspeaker-update", function(d) {
        var e = d[1]
          , f = 0;
        3 === d[0] && (f = Math.min(1193181.6665999999 / e, this.Ye.frequency.maxValue),
        f = Math.max(f, 0));
        this.Ye.frequency.setValueAtTime(f, b.currentTime)
    }, this)
}
Zb.prototype.start = function() {
    this.Ye.start()
}
;
function Wb(a, b, c) {
    this.v = a;
    this.ca = b;
    this.enabled = !1;
    this.wb = 48E3;
    b = function() {
        function e(g) {
            if (0 === g)
                return 1;
            g *= Math.PI;
            return Math.sin(g) / g
        }
        function f() {
            var g = Reflect.construct(AudioWorkletProcessor, [], f);
            g.D = 3;
            g.l = Array(1024);
            g.A = 0;
            g.K = 0;
            g.o = 0;
            g.F = g.l.length;
            g.B = 0;
            g.N = h;
            g.g = h;
            g.T = 1;
            g.j = 0;
            g.i = 0;
            g.h = 0;
            g.port.onmessage = k => {
                switch (k.data.type) {
                case "queue":
                    g.ga(k.data.value);
                    break;
                case "sampling-rate":
                    g.T = k.data.value / sampleRate
                }
            }
            ;
            return g
        }
        var h = [new Float32Array(256), new Float32Array(256)];
        Reflect.setPrototypeOf(f.prototype, AudioWorkletProcessor.prototype);
        Reflect.setPrototypeOf(f, AudioWorkletProcessor);
        f.prototype.process = f.prototype.process = function(g, k) {
            for (g = 0; g < k[0][0].length; g++) {
                for (var l = 0, m = 0, p = this.h + this.D, r = this.h - this.D + 1; r <= p; r++) {
                    var v = this.j + r;
                    l += this.U(v, 0) * this.X(this.i - r);
                    m += this.U(v, 1) * this.X(this.i - r)
                }
                if (isNaN(l) || isNaN(m))
                    l = m = 0;
                k[0][0][g] = l;
                k[0][1][g] = m;
                this.i += this.T;
                this.h = Math.floor(this.i)
            }
            k = this.h;
            k += this.D + 2;
            this.i -= this.h;
            this.j += this.h;
            this.h = 0;
            this.aa(k);
            return !0
        }
        ;
        f.prototype.X = function(g) {
            return e(g) * e(g / this.D)
        }
        ;
        f.prototype.U = function(g, k) {
            return 0 > g ? (g += this.N[0].length,
            this.N[k][g]) : this.g[k][g]
        }
        ;
        f.prototype.aa = function(g) {
            var k = this.g[0].length;
            k - this.j < g && (this.ba(),
            this.j -= k)
        }
        ;
        f.prototype.ba = function() {
            this.N = this.g;
            this.g = this.Z();
            var g = this.g[0].length;
            if (256 > g) {
                for (var k = this.A, l = 0; 256 > g && l < this.o; )
                    g += this.l[k][0].length,
                    k = k + 1 & this.F - 1,
                    l++;
                g = Math.max(g, 256);
                g = [new Float32Array(g), new Float32Array(g)];
                g[0].set(this.g[0]);
                g[1].set(this.g[1]);
                k = this.g[0].length;
                for (var m = 0; m < l; m++) {
                    var p = this.Z();
                    g[0].set(p[0], k);
                    g[1].set(p[1], k);
                    k += p[0].length
                }
                this.g = g
            }
            this.sb()
        }
        ;
        f.prototype.sb = function() {
            1024 > this.B / this.T && this.port.postMessage({
                type: "pump"
            })
        }
        ;
        f.prototype.ga = function(g) {
            this.o < this.F && (this.l[this.K] = g,
            this.K = this.K + 1 & this.F - 1,
            this.o++,
            this.B += g[0].length,
            this.sb())
        }
        ;
        f.prototype.Z = function() {
            if (!this.o)
                return h;
            var g = this.l[this.A];
            this.l[this.A] = null;
            this.A = this.A + 1 & this.F - 1;
            this.o--;
            this.B -= g[0].length;
            return g
        }
        ;
        registerProcessor("dac-processor", f)
    }
    .toString();
    var d = URL.createObjectURL(new Blob([b.substring(b.indexOf("{") + 1, b.lastIndexOf("}"))],{
        type: "application/javascript"
    }));
    this.Ec = null;
    this.g = this.ca.createGain();
    this.ca.audioWorklet.addModule(d).then( () => {
        URL.revokeObjectURL(d);
        this.Ec = new AudioWorkletNode(this.ca,"dac-processor",{
            numberOfInputs: 0,
            numberOfOutputs: 1,
            outputChannelCount: [2],
            parameterData: {},
            processorOptions: {}
        });
        this.Ec.port.postMessage({
            type: "sampling-rate",
            value: this.wb
        });
        this.Ec.port.onmessage = e => {
            switch (e.data.type) {
            case "pump":
                this.sb()
            }
        }
        ;
        this.Ec.connect(this.g)
    }
    );
    this.h = $b(c, this.g, 2);
    this.h.g = 3;
    a.register("dac-send-data", function(e) {
        this.ah(e)
    }, this);
    a.register("dac-enable", function() {
        this.enabled = !0
    }, this);
    a.register("dac-disable", function() {
        this.enabled = !1
    }, this);
    a.register("dac-tell-sampling-rate", function(e) {
        this.wb = e;
        this.Ec && this.Ec.port.postMessage({
            type: "sampling-rate",
            value: e
        })
    }, this)
}
Wb.prototype.ah = function(a) {
    this.Ec && this.Ec.port.postMessage({
        type: "queue",
        value: a
    }, [a[0].buffer, a[1].buffer])
}
;
Wb.prototype.sb = function() {
    this.enabled && this.v.send("dac-request-data")
}
;
function Xb(a, b, c) {
    this.v = a;
    this.ca = b;
    this.enabled = !1;
    this.wb = 22050;
    this.g = 0;
    this.If = 1;
    this.pg = this.ca.createBiquadFilter();
    this.pg.type = "lowpass";
    this.i = this.pg;
    this.h = $b(c, this.i, 2);
    this.h.g = 3;
    a.register("dac-send-data", function(d) {
        this.ah(d)
    }, this);
    a.register("dac-enable", function() {
        this.enabled = !0;
        this.sb()
    }, this);
    a.register("dac-disable", function() {
        this.enabled = !1
    }, this);
    a.register("dac-tell-sampling-rate", function(d) {
        this.wb = d;
        this.If = Math.ceil(8E3 / d);
        this.pg.frequency.setValueAtTime(d / 2, this.ca.currentTime)
    }, this)
}
Xb.prototype.ah = function(a) {
    var b = a[0].length
      , c = b / this.wb;
    if (1 < this.If) {
        var d = this.ca.createBuffer(2, b * this.If, this.wb * this.If);
        for (var e = d.getChannelData(0), f = d.getChannelData(1), h = 0, g = 0; g < b; g++)
            for (var k = 0; k < this.If; k++,
            h++)
                e[h] = a[0][g],
                f[h] = a[1][g]
    } else
        d = this.ca.createBuffer(2, b, this.wb),
        d.copyToChannel ? (d.copyToChannel(a[0], 0),
        d.copyToChannel(a[1], 1)) : (d.getChannelData(0).set(a[0]),
        d.getChannelData(1).set(a[1]));
    a = this.ca.createBufferSource();
    a.buffer = d;
    a.connect(this.pg);
    a.addEventListener("ended", this.sb.bind(this));
    d = this.ca.currentTime;
    if (this.g < d)
        for (this.g = d,
        d = .2 - c,
        b = 0; b <= d; )
            b += c,
            this.g += c,
            setTimeout( () => this.sb(), 1E3 * b);
    a.start(this.g);
    this.g += c;
    setTimeout( () => this.sb(), 0)
}
;
Xb.prototype.sb = function() {
    this.enabled && (.2 < this.g - this.ca.currentTime || this.v.send("dac-request-data"))
}
;
function bc(a, b) {
    this.v = b;
    this.g = void 0;
    this.id = 0;
    this.h = [];
    this.url = a;
    this.j = Date.now() - 1E4;
    this.i = !1;
    this.v.register("net" + this.id + "-send", function(c) {
        this.send(c)
    }, this)
}
n = bc.prototype;
n.Lj = function(a) {
    this.v && this.v.send("net" + this.id + "-receive", new Uint8Array(a.data))
}
;
n.Jj = function() {
    this.i || (this.connect(),
    setTimeout(this.connect.bind(this), 1E4))
}
;
n.Mj = function() {
    for (var a = 0; a < this.h.length; a++)
        this.send(this.h[a]);
    this.h = []
}
;
n.Kj = function() {}
;
n.wa = function() {
    this.i = !0;
    this.g && this.g.close()
}
;
n.connect = function() {
    if ("undefined" !== typeof WebSocket) {
        if (this.g) {
            var a = this.g.readyState;
            if (0 === a || 1 === a)
                return
        }
        if (!(this.j + 1E4 > Date.now())) {
            this.j = Date.now();
            try {
                this.g = new WebSocket(this.url)
            } catch (b) {
                console.error(b);
                return
            }
            this.g.binaryType = "arraybuffer";
            this.g.onopen = this.Mj.bind(this);
            this.g.onmessage = this.Lj.bind(this);
            this.g.onclose = this.Jj.bind(this);
            this.g.onerror = this.Kj.bind(this)
        }
    }
}
;
n.send = function(a) {
    this.g && 1 === this.g.readyState ? this.g.send(a) : (this.h.push(a),
    128 < this.h.length && (this.h = this.h.slice(-64)),
    this.connect())
}
;
const cc = (new Date("1970-01-01T00:00:00Z")).getTime() - (new Date("1900-01-01T00:00:00Z")).getTime()
  , dc = Math.pow(2, 32)
  , ec = [118, 56, 54];
function fc(a) {
    return [0, 1, 2, 3, 4, 5].map(b => a[b].toString(16)).map(b => 1 === b.length ? "0" + b : b).join(":")
}
function gc(a) {
    return a[0] << 24 | a[1] << 16 | a[2] << 8 | a[3]
}
function hc(a, b) {
    const c = Math.min(a.length, b.length);
    if (c) {
        const f = a.buffer;
        var d = f.length
          , e = a.g + c;
        e > d ? (e %= d,
        d -= a.g,
        b.set(f.subarray(a.g)),
        b.set(f.subarray(0, e), d)) : b.set(f.subarray(a.g, e))
    }
    return c
}
class ic {
    constructor() {
        var a = Math.min(2048, 16);
        this.length = this.head = this.g = 0;
        this.buffer = new Uint8Array(a)
    }
    write(a) {
        const b = a.length;
        var c = this.length + b;
        let d = this.buffer.length;
        if (d < c) {
            for (; d < c; )
                d *= 2;
            c = new Uint8Array(d);
            hc(this, c);
            this.g = 0;
            this.head = this.length;
            this.buffer = c
        }
        c = this.buffer;
        const e = this.head + b;
        if (e > d) {
            const f = d - this.head;
            c.set(a.subarray(0, f), this.head);
            c.set(a.subarray(f))
        } else
            c.set(a, this.head);
        this.head = e % d;
        this.length += b
    }
    remove(a) {
        a > this.length && (a = this.length);
        a && (this.g = (this.g + a) % this.buffer.length,
        this.length -= a);
        return a
    }
}
function jc() {
    const a = new Uint8Array(1518)
      , b = a.buffer
      , c = a.byteOffset;
    return {
        Ve: a,
        Gj: new DataView(b),
        Ih: new DataView(b,c + 14,1500),
        Pg: new DataView(b,c + 34,1480),
        Cg: new DataView(b,c + 42,1472),
        Ji: new TextEncoder
    }
}
function kc(a, b, c, d) {
    d.Ve.set(b, c.byteOffset + a);
    return b.length
}
function lc(a, b, c, d) {
    const e = c.byteOffset + (a & -2);
    d = d.Ve;
    for (c = c.byteOffset; c < e; c += 2)
        b += d[c] << 8 | d[c + 1];
    for (a & 1 && (b += d[e] << 8); b >>> 16; )
        b = (b & 65535) + (b >>> 16);
    return ~b & 65535
}
function mc(a, b) {
    a.Ve.fill(0);
    var c = a.Ve
      , d = c.subarray
      , e = a.Gj;
    kc(0, b.Ga.ja, e, a);
    kc(6, b.Ga.src, e, a);
    e.setUint16(12, b.Ga.uc);
    e = 14;
    if (b.Va) {
        var f = a.Ih;
        f.setUint16(0, b.Va.Af);
        f.setUint16(2, b.Va.$g);
        f.setUint8(4, b.Va.jh.length);
        f.setUint8(5, b.Va.zg.length);
        f.setUint16(6, b.Va.Wg);
        kc(8, b.Va.jh, f, a);
        kc(14, b.Va.zg, f, a);
        kc(18, b.Va.Ki, f, a);
        kc(24, b.Va.Qf, f, a);
        e += 28
    } else if (b.Y) {
        f = a.Ih;
        var h = 20;
        if (b.Uc) {
            var g = a.Pg;
            g.setUint8(0, b.Uc.type);
            g.setUint8(1, b.Uc.code);
            g.setUint16(2, 0);
            var k = 4 + kc(4, b.Uc.data, g, a);
            g.setUint16(2, lc(k, 0, g, a));
            h += k
        } else if (b.$a) {
            g = a.Pg;
            var l = 8;
            if (b.za) {
                k = l;
                var m = a.Cg;
                m.setUint8(0, b.za.Ze);
                m.setUint8(1, b.za.Af);
                m.setUint8(2, b.za.Th);
                m.setUint8(3, b.za.Uh);
                m.setUint32(4, b.za.sh);
                m.setUint16(8, b.za.Ei);
                m.setUint16(10, b.za.flags);
                m.setUint32(12, b.za.Ah);
                m.setUint32(16, b.za.Ni);
                m.setUint32(20, b.za.Hi);
                m.setUint32(24, b.za.Rh);
                kc(28, b.za.Kg, m, a);
                m.setUint32(236, 1669485411);
                l = 240;
                for (var p of b.za.options)
                    l += kc(l, p, m, a);
                k += l
            } else if (b.jb) {
                p = l;
                l = a.Cg;
                l.setUint16(0, b.jb.id);
                l.setUint16(2, b.jb.flags);
                l.setUint16(4, b.jb.Fd.length);
                l.setUint16(6, b.jb.kf.length);
                let B = 12;
                for (var r = 0; r < b.jb.Fd.length; ++r) {
                    var v = b.jb.Fd[r];
                    for (m of v.name) {
                        const C = a.Ji.encodeInto(m, a.Ve.subarray(l.byteOffset + (B + 1))).written;
                        l.setUint8(B, C);
                        B += 1 + C
                    }
                    l.setUint16(B, v.type);
                    B += 2;
                    l.setUint16(B, v.ge);
                    B += 2
                }
                for (r = 0; r < b.jb.kf.length; ++r) {
                    m = b.jb.kf[r];
                    for (k of m.name)
                        v = a.Ji.encodeInto(k, a.Ve.subarray(l.byteOffset + (B + 1))).written,
                        l.setUint8(B, v),
                        B += 1 + v;
                    l.setUint16(B, m.type);
                    B += 2;
                    l.setUint16(B, m.ge);
                    B += 2;
                    l.setUint32(B, m.Bg);
                    B += 4;
                    l.setUint16(B, m.data.length);
                    B += 2;
                    B += kc(B, m.data, l, a)
                }
                k = p + B
            } else
                b.oa ? (k = l,
                m = a.Cg,
                m.setUint8(0, b.oa.flags),
                m.setUint8(1, b.oa.Ii),
                m.setUint8(2, b.oa.hi),
                m.setUint8(3, b.oa.precision),
                m.setUint32(4, b.oa.pl),
                m.setUint32(8, b.oa.ql),
                m.setUint32(12, b.oa.ml),
                m.setUint32(16, b.oa.ol),
                m.setUint32(20, b.oa.nl),
                m.setUint32(24, b.oa.ai),
                m.setUint32(28, b.oa.$h),
                m.setUint32(32, b.oa.Ci),
                m.setUint32(36, b.oa.Bi),
                m.setUint32(40, b.oa.mh),
                m.setUint32(44, b.oa.lh),
                k += 48) : k = l + kc(0, b.$a.data, a.Cg, a);
            l = k;
            g.setUint16(0, b.$a.ta);
            g.setUint16(2, b.$a.pa);
            g.setUint16(4, l);
            g.setUint16(6, 0);
            g.setUint16(6, lc(l, (b.Y.src[0] << 8 | b.Y.src[1]) + (b.Y.src[2] << 8 | b.Y.src[3]) + (b.Y.ja[0] << 8 | b.Y.ja[1]) + (b.Y.ja[2] << 8 | b.Y.ja[3]) + 17 + l, g, a));
            h += l
        } else
            b.S && (g = a.Pg,
            k = 0,
            m = b.S,
            m.Xe && (k |= 1),
            m.Jd && (k |= 2),
            m.De && (k |= 4),
            m.zi && (k |= 8),
            m.Da && (k |= 16),
            m.yl && (k |= 32),
            m.Bj && (k |= 64),
            m.nj && (k |= 128),
            g.setUint16(0, m.ta),
            g.setUint16(2, m.pa),
            g.setUint32(4, m.hb),
            g.setUint32(8, m.Xb),
            g.setUint8(12, 80),
            g.setUint8(13, k),
            g.setUint16(14, m.xb),
            g.setUint16(16, 0),
            g.setUint16(18, m.zl || 0),
            k = 20,
            b.bf && (k += kc(20, b.bf, g, a)),
            g.setUint16(16, lc(k, (b.Y.src[0] << 8 | b.Y.src[1]) + (b.Y.src[2] << 8 | b.Y.src[3]) + (b.Y.ja[0] << 8 | b.Y.ja[1]) + (b.Y.ja[2] << 8 | b.Y.ja[3]) + 6 + k, g, a)),
            h += k);
        f.setUint8(0, 69);
        f.setUint8(1, b.Y.xl || 0);
        f.setUint16(2, h);
        f.setUint16(4, b.Y.id || 0);
        f.setUint8(6, 64);
        f.setUint8(8, b.Y.Bg || 32);
        f.setUint8(9, b.Y.gd);
        f.setUint16(10, 0);
        kc(12, b.Y.src, f, a);
        kc(16, b.Y.ja, f, a);
        f.setUint16(10, lc(20, 0, f, a));
        e += h
    }
    return d.call(c, 0, e)
}
function nc(a, b) {
    fetch(`https://${b.dg || "cloudflare-dns.com"}/dns-query`, {
        method: "POST",
        headers: [["content-type", "application/dns-message"]],
        body: a.$a.data
    }).then(async c => {
        c = {
            Ga: {
                uc: 2048,
                src: b.tb,
                ja: a.Ga.src
            },
            Y: {
                gd: 17,
                src: b.mb,
                ja: a.Y.src
            },
            $a: {
                ta: 53,
                pa: a.$a.ta,
                data: new Uint8Array(await c.arrayBuffer())
            }
        };
        b.Fa(mc(b.Ja, c))
    }
    )
}
function oc(a, b) {
    let c = {};
    c.Ga = {
        uc: 2048,
        src: b.tb,
        ja: a.Ga.src
    };
    c.Y = {
        gd: 17,
        src: b.mb,
        ja: b.Je
    };
    c.$a = {
        ta: 67,
        pa: 68
    };
    c.za = {
        Af: 1,
        Th: 6,
        Uh: 0,
        sh: a.za.sh,
        Ei: 0,
        flags: 0,
        Ah: 0,
        Ni: gc(b.Je),
        Hi: gc(b.mb),
        Rh: gc(b.mb),
        Kg: a.za.Kg
    };
    let d = []
      , e = a.za.options.find(function(f) {
        return 53 === f[0]
    });
    e && 3 === e[2] && (a.za.Ze = 3);
    1 === a.za.Ze && (c.za.Ze = 2,
    d.push(new Uint8Array([53, 1, 2])));
    3 === a.za.Ze && (c.za.Ze = 2,
    d.push(new Uint8Array([53, 1, 5])),
    d.push(new Uint8Array([51, 4, 8, 0, 0, 0])));
    a = [b.mb[0], b.mb[1], b.mb[2], b.mb[3]];
    d.push(new Uint8Array([1, 4, 255, 255, 255, 0]));
    b.re && (d.push(new Uint8Array([3, 4].concat(a))),
    d.push(new Uint8Array([6, 4].concat(a))));
    d.push(new Uint8Array([54, 4].concat(a)));
    d.push(new Uint8Array([60, 3].concat(ec)));
    d.push(new Uint8Array([255, 0]));
    c.za.options = d;
    b.Fa(mc(b.Ja, c))
}
function pc(a, b) {
    let c = {};
    var d = (new DataView(a.buffer,a.byteOffset,a.byteLength)).getUint16(12)
      , e = {
        uc: d,
        ja: a.subarray(0, 6),
        Nl: fc(a.subarray(0, 6)),
        src: a.subarray(6, 12),
        pm: fc(a.subarray(6, 12))
    };
    c.Ga = e;
    a = a.subarray(14, a.length);
    if (2048 === d) {
        var f = new DataView(a.buffer,a.byteOffset,a.byteLength);
        e = a[0] >> 4 & 15;
        var h = a[0] & 15
          , g = f.getUint8(1)
          , k = f.getUint16(2);
        let l = f.getUint8(8);
        d = f.getUint8(9);
        f = f.getUint16(10);
        c.Y = {
            version: e,
            dm: h,
            xl: g,
            $c: k,
            Bg: l,
            gd: d,
            fm: f,
            src: a.subarray(12, 16),
            ja: a.subarray(16, 20)
        };
        e = a.subarray(4 * h, k);
        if (1 === d)
            a = new DataView(e.buffer,e.byteOffset,e.byteLength),
            a = {
                type: a.getUint8(0),
                code: a.getUint8(1),
                zh: a.getUint16(2),
                data: e.subarray(4)
            },
            c.Uc = a;
        else if (6 === d)
            d = new DataView(e.buffer,e.byteOffset,e.byteLength),
            a = {
                ta: d.getUint16(0),
                pa: d.getUint16(2),
                hb: d.getUint32(4),
                Xb: d.getUint32(8),
                Aj: d.getUint8(12) >> 4,
                xb: d.getUint16(14),
                zh: d.getUint16(16),
                zl: d.getUint16(18)
            },
            d = d.getUint8(13),
            a.Xe = !!(d & 1),
            a.Jd = !!(d & 2),
            a.De = !!(d & 4),
            a.zi = !!(d & 8),
            a.Da = !!(d & 16),
            a.yl = !!(d & 32),
            a.Bj = !!(d & 64),
            a.nj = !!(d & 128),
            c.S = a,
            c.bf = e.subarray(4 * a.Aj);
        else if (17 === d) {
            a = new DataView(e.buffer,e.byteOffset,e.byteLength);
            a = {
                ta: a.getUint16(0),
                pa: a.getUint16(2),
                $c: a.getUint16(4),
                zh: a.getUint16(6),
                data: e.subarray(8),
                rj: (new TextDecoder).decode(e.subarray(8))
            };
            if (67 === a.pa || 67 === a.ta) {
                e = e.subarray(8);
                d = new DataView(e.buffer,e.byteOffset,e.byteLength);
                d = {
                    Ze: d.getUint8(0),
                    Af: d.getUint8(1),
                    Th: d.getUint8(2),
                    Uh: d.getUint8(3),
                    sh: d.getUint32(4),
                    Ei: d.getUint16(8),
                    flags: d.getUint16(10),
                    Ah: d.getUint32(12),
                    Ni: d.getUint32(16),
                    Hi: d.getUint32(20),
                    Rh: d.getUint32(24),
                    Kg: e.subarray(28, 44),
                    Xh: d.getUint32(236),
                    options: []
                };
                e = e.subarray(240);
                for (h = 0; h < e.length; ++h)
                    g = h,
                    0 !== e[h] && (++h,
                    k = e[h],
                    h += k,
                    d.options.push(e.subarray(g, g + k + 2)));
                c.za = d;
                c.Ol = d.options
            } else
                53 === a.pa || 53 === a.ta ? sc(e.subarray(8), c) : 123 === a.pa && (d = e.subarray(8),
                d = new DataView(d.buffer,d.byteOffset,d.byteLength),
                c.oa = {
                    flags: d.getUint8(0),
                    Ii: d.getUint8(1),
                    hi: d.getUint8(2),
                    precision: d.getUint8(3),
                    pl: d.getUint32(4),
                    ql: d.getUint32(8),
                    ml: d.getUint32(12),
                    ol: d.getUint32(16),
                    nl: d.getUint32(20),
                    ai: d.getUint32(24),
                    $h: d.getUint32(28),
                    Ci: d.getUint32(32),
                    Bi: d.getUint32(36),
                    mh: d.getUint32(40),
                    lh: d.getUint32(44)
                });
            c.$a = a
        }
    } else
        2054 === d && (d = new DataView(a.buffer,a.byteOffset,a.byteLength),
        a = {
            Af: d.getUint16(0),
            $g: d.getUint16(2),
            Wg: d.getUint16(6),
            jh: a.subarray(8, 14),
            zg: a.subarray(14, 18),
            Ki: a.subarray(18, 24),
            Qf: a.subarray(24, 28)
        },
        c.Va = a);
    if (c.Y)
        if (c.S) {
            if (a = `${c.Y.src.join(".")}:${c.S.ta}:${c.Y.ja.join(".")}:${c.S.pa}`,
            !c.S.Jd || !b.Zh(c, a))
                if (b.Jc[a])
                    b.Jc[a].process(c);
                else {
                    a = c.S.Xb;
                    if (c.S.Xe || c.S.Jd)
                        a += 1;
                    d = {};
                    d.Ga = {
                        uc: 2048,
                        src: b.tb,
                        ja: c.Ga.src
                    };
                    d.Y = {
                        gd: 6,
                        src: c.Y.ja,
                        ja: c.Y.src
                    };
                    d.S = {
                        ta: c.S.pa,
                        pa: c.S.ta,
                        hb: a,
                        Xb: c.S.hb + (c.S.Jd ? 1 : 0),
                        xb: c.S.xb,
                        De: !0,
                        Da: c.S.Jd
                    };
                    b.Fa(mc(b.Ja, d))
                }
        } else if (c.$a)
            if (c.jb)
                if ("static" === b.cg) {
                    a = {};
                    a.Ga = {
                        uc: 2048,
                        src: b.tb,
                        ja: c.Ga.src
                    };
                    a.Y = {
                        gd: 17,
                        src: b.mb,
                        ja: c.Y.src
                    };
                    a.$a = {
                        ta: 53,
                        pa: c.$a.ta
                    };
                    d = [];
                    for (e = 0; e < c.jb.Fd.length; ++e)
                        switch (h = c.jb.Fd[e],
                        h.type) {
                        case 1:
                            d.push({
                                name: h.name,
                                type: h.type,
                                ge: h.ge,
                                Bg: 600,
                                data: [192, 168, 87, 1]
                            })
                        }
                    a.jb = {
                        id: c.jb.id,
                        flags: 33152,
                        Fd: c.jb.Fd,
                        kf: d
                    };
                    b.Fa(mc(b.Ja, a))
                } else
                    nc(c, b);
            else
                c.za ? oc(c, b) : c.oa ? (a = Date.now() + cc,
                d = a % 1E3 / 1E3 * dc,
                e = {},
                e.Ga = {
                    uc: 2048,
                    src: b.tb,
                    ja: c.Ga.src
                },
                e.Y = {
                    gd: 17,
                    src: c.Y.ja,
                    ja: c.Y.src
                },
                e.$a = {
                    ta: 123,
                    pa: c.$a.ta
                },
                e.oa = Object.assign({}, c.oa),
                e.oa.flags = 36,
                e.oa.hi = 10,
                e.oa.ai = c.oa.mh,
                e.oa.$h = c.oa.lh,
                e.oa.Ci = a / 1E3,
                e.oa.Bi = d,
                e.oa.mh = a / 1E3,
                e.oa.lh = d,
                e.oa.Ii = 2,
                b.Fa(mc(b.Ja, e))) : 8 === c.$a.pa && (a = {},
                a.Ga = {
                    uc: 2048,
                    src: b.tb,
                    ja: c.Ga.src
                },
                a.Y = {
                    gd: 17,
                    src: c.Y.ja,
                    ja: c.Y.src
                },
                a.$a = {
                    ta: c.$a.pa,
                    pa: c.$a.ta,
                    data: (new TextEncoder).encode(c.$a.rj)
                },
                b.Fa(mc(b.Ja, a)));
        else
            c.Uc && 8 === c.Uc.type && (a = {},
            a.Ga = {
                uc: 2048,
                src: b.tb,
                ja: c.Ga.src
            },
            a.Y = {
                gd: 1,
                src: c.Y.ja,
                ja: c.Y.src
            },
            a.Uc = {
                type: 0,
                code: c.Uc.code,
                data: c.Uc.data
            },
            b.Fa(mc(b.Ja, a)));
    else
        c.Va && 1 === c.Va.Wg && 2048 === c.Va.$g && (a = gc(c.Va.Qf) & 4294967040,
        d = gc(b.mb) & 4294967040,
        !b.re && a !== d || a === d && 99 < c.Va.Qf[3] || (a = {},
        a.Ga = {
            uc: 2054,
            src: b.tb,
            ja: c.Ga.src
        },
        a.Va = {
            Af: 1,
            $g: 2048,
            Wg: 2,
            jh: b.tb,
            zg: c.Va.Qf,
            Ki: c.Ga.src,
            Qf: c.Va.zg
        },
        b.Fa(mc(b.Ja, a))))
}
function sc(a, b) {
    function c() {
        let l = [], m;
        do
            m = d.getUint8(g),
            l.push((new TextDecoder).decode(a.subarray(g + 1, g + 1 + m))),
            g += m + 1;
        while (0 < m);
        return l
    }
    let d = new DataView(a.buffer,a.byteOffset,a.byteLength)
      , e = {
        id: d.getUint16(0),
        flags: d.getUint16(2),
        Fd: [],
        kf: []
    };
    var f = d.getUint16(4);
    let h = d.getUint16(6);
    d.getUint16(8);
    d.getUint16(10);
    let g = 12;
    for (var k = 0; k < f; k++)
        e.Fd.push({
            name: c(),
            type: d.getInt16(g),
            ge: d.getInt16(g + 2)
        }),
        g += 4;
    for (f = 0; f < h; f++) {
        k = {
            name: c(),
            type: d.getInt16(g),
            ge: d.getUint16(g + 2),
            Bg: d.getUint32(g + 4)
        };
        g += 8;
        let l = d.getUint16(g);
        g += 2;
        k.data = a.subarray(g, g + l);
        g += l;
        e.kf.push(k)
    }
    b.jb = e
}
function tc() {
    this.state = "closed";
    this.fa = null;
    this.Ee = new ic;
    this.F = new Uint8Array(1460);
    this.i = this.jg = !1;
    this.l = void 0;
    this.j = {}
}
function uc(a, b) {
    a.j.data = b
}
function vc(a, b, ...c) {
    a.j[b] && a.j[b].apply(a, c)
}
function wc(a) {
    let b = {};
    b.Ga = {
        uc: 2048,
        src: a.A,
        ja: a.o
    };
    b.Y = {
        gd: 6,
        src: a.D,
        ja: a.B
    };
    b.S = {
        ta: a.ta,
        pa: a.pa,
        xb: a.xb,
        Xb: a.Da,
        hb: a.hb,
        Da: !0
    };
    return b
}
function xc(a, b, c) {
    b = {
        ta: b.S.pa,
        pa: b.S.ta,
        xb: b.S.xb,
        Xb: a.Da,
        hb: a.hb
    };
    if (c)
        for (const d in c)
            b[d] = c[d];
    a = wc(a);
    a.S = b;
    return a
}
n = tc.prototype;
n.connect = function() {
    this.hb = 1338;
    this.Da = 1;
    this.xb = 64240;
    this.state = "syn-sent";
    let a = wc(this);
    a.Y.id = 2345;
    a.S = {
        ta: this.ta,
        pa: this.pa,
        hb: 1337,
        Xb: 0,
        xb: 0,
        Jd: !0
    };
    this.fa.Fa(mc(this.fa.Ja, a))
}
;
n.accept = function(a) {
    this.hb = 1338;
    this.Da = a.S.hb + 1;
    this.A = this.fa.tb;
    this.D = a.Y.ja;
    this.ta = a.S.pa;
    this.o = a.Ga.src;
    this.pa = a.S.ta;
    this.B = a.Y.src;
    this.xb = a.S.xb;
    let b = wc(this);
    b.S = {
        ta: this.ta,
        pa: this.pa,
        hb: 1337,
        Xb: this.Da,
        xb: a.S.xb,
        Jd: !0,
        Da: !0
    };
    this.state = "established";
    this.fa.Fa(mc(this.fa.Ja, b))
}
;
n.process = function(a) {
    if ("closed" === this.state)
        a = xc(this, a, {
            De: !0
        }),
        this.fa.Fa(mc(this.fa.Ja, a));
    else if (a.S.De)
        "syn-probe" === this.state ? vc(this, "probe", !1) : this.Ff(),
        yc(this);
    else if (a.S.Jd)
        "syn-sent" === this.state && a.S.Da ? (this.Da = a.S.hb + 1,
        this.g = a.S.Xb,
        this.fa.Fa(mc(this.fa.Ja, wc(this))),
        this.state = "established",
        vc(this, "connect")) : "syn-probe" === this.state && a.S.Da && (vc(this, "probe", !0),
        a = xc(this, a, {
            De: !0
        }),
        this.fa.Fa(mc(this.fa.Ja, a)),
        yc(this));
    else {
        if (a.S.Da)
            if ("syn-received" === this.state)
                this.state = "established";
            else if ("fin-wait-1" === this.state)
                a.S.Xe || (this.state = "fin-wait-2");
            else if ("closing" === this.state || "last-ack" === this.state) {
                yc(this);
                return
            }
        if (void 0 === this.g)
            this.g = a.S.Xb;
        else {
            var b = a.S.Xb - this.g;
            if (0 < b) {
                if (this.g = a.S.Xb,
                this.Ee.remove(b),
                this.hb += b,
                this.pending = !1,
                this.i && !this.Ee.length) {
                    this.i = !1;
                    this.state = this.l;
                    a = wc(this);
                    a.S.Xe = !0;
                    this.fa.Fa(mc(this.fa.Ja, a));
                    return
                }
            } else if (0 > b) {
                a = xc(this, a, {
                    De: !0
                });
                this.fa.Fa(mc(this.fa.Ja, a));
                this.Ff();
                yc(this);
                return
            }
        }
        a.S.Xe ? (++this.Da,
        b = xc(this, a, {}),
        "established" === this.state ? (b.S.Da = !0,
        this.state = "close-wait",
        this.Yh()) : "fin-wait-1" === this.state ? (a.S.Da ? yc(this) : this.state = "closing",
        b.S.Da = !0) : "fin-wait-2" === this.state ? (yc(this),
        b.S.Da = !0) : (yc(this),
        this.Ff(),
        b.S.De = !0),
        this.fa.Fa(mc(this.fa.Ja, b))) : this.Da !== a.S.hb ? (a = xc(this, a, {
            Da: !0
        }),
        this.fa.Fa(mc(this.fa.Ja, a))) : a.S.Da && 0 < a.bf.length && (this.Da += a.bf.length,
        this.fa.Fa(mc(this.fa.Ja, wc(this))),
        vc(this, "data", a.bf));
        this.sb()
    }
}
;
n.write = function(a) {
    this.jg || this.Ee.write(a);
    this.sb()
}
;
n.close = function() {
    if (!this.jg) {
        this.jg = !0;
        if ("established" === this.state || "syn-received" === this.state)
            var a = "fin-wait-1";
        else if ("close-wait" === this.state)
            a = "last-ack";
        else {
            yc(this);
            return
        }
        this.Ee.length || this.pending ? (this.i = !0,
        this.l = a) : (this.state = a,
        a = wc(this),
        a.S.Xe = !0,
        this.fa.Fa(mc(this.fa.Ja, a)))
    }
    this.sb()
}
;
n.Yh = function() {
    vc(this, "shutdown")
}
;
n.Ff = function() {
    vc(this, "close")
}
;
function yc(a) {
    a.fa.Jc[a.h] && (a.state = "closed",
    delete a.fa.Jc[a.h])
}
n.sb = function() {
    if (this.Ee.length && !this.pending) {
        const a = this.F
          , b = hc(this.Ee, a)
          , c = wc(this);
        c.S.zi = !0;
        c.bf = a.subarray(0, b);
        this.fa.Fa(mc(this.fa.Ja, c));
        this.pending = !0
    }
}
;
function zc(a, b) {
    b = b || {};
    this.v = a;
    this.id = b.id || 0;
    this.tb = new Uint8Array((b.tb || "52:54:0:1:2:3").split(":").map(function(c) {
        return parseInt(c, 16)
    }));
    this.mb = new Uint8Array((b.mb || "192.168.86.1").split(".").map(function(c) {
        return parseInt(c, 10)
    }));
    this.Je = new Uint8Array((b.Je || "192.168.86.100").split(".").map(function(c) {
        return parseInt(c, 10)
    }));
    this.re = void 0 === b.re || !!b.re;
    this.Eg = new Uint8Array(6);
    this.cg = b.cg || "static";
    this.dg = b.dg;
    this.Jc = {};
    this.Ja = jc();
    this.wh = (...c) => fetch(...c);
    this.Nc = b.Nc;
    this.v.register("net" + this.id + "-mac", function(c) {
        this.Eg = new Uint8Array(c.split(":").map(function(d) {
            return parseInt(d, 16)
        }))
    }, this);
    this.v.register("net" + this.id + "-send", function(c) {
        this.send(c)
    }, this)
}
n = zc.prototype;
n.wa = function() {}
;
n.Zh = function(a, b) {
    if (80 === a.S.pa) {
        let c = new tc;
        c.state = "syn-received";
        c.fa = this;
        uc(c, Ac);
        c.h = b;
        c.accept(a);
        this.Jc[b] = c;
        return !0
    }
    return !1
}
;
n.connect = function(a) {
    var b = this.Je.join(".");
    const c = this.mb.join(".")
      , d = 16383 * Math.random() | 0;
    let e, f, h = 0;
    do
        e = 49152 + (d + h) % 16383,
        f = `${b}:${a}:${c}:${e}`;
    while (16383 > ++h && this.Jc[f]);
    if (this.Jc[f])
        throw Error("pool of dynamic TCP port numbers exhausted, connection aborted");
    b = new tc;
    b.h = f;
    b.A = this.tb;
    b.D = this.mb;
    b.ta = e;
    b.o = this.Eg;
    b.pa = a;
    b.B = this.Je;
    b.fa = this;
    this.Jc[f] = b;
    b.connect();
    return b
}
;
async function Ac(a) {
    this.read = this.read || "";
    if ((this.read += (new TextDecoder).decode(a)) && -1 !== this.read.indexOf("\r\n\r\n")) {
        a = this.read.indexOf("\r\n\r\n");
        var b = this.read.substring(0, a).split(/\r\n/);
        a = this.read.substring(a + 4);
        this.read = "";
        let c = b[0].split(" "), d;
        d = /^https?:/.test(c[1]) ? new URL(c[1]) : new URL("http://host" + c[1]);
        "undefined" !== typeof window && "http:" === d.protocol && "https:" === window.location.protocol && (d.protocol = "https:");
        let e = new Headers;
        for (let g = 1; g < b.length; ++g) {
            const k = Bc(b[g]);
            if (!k) {
                console.warn('The request contains an invalid header: "%s"', b[g]);
                Cc(this, 400, "Bad Request", `Invalid header in request: ${b[g]}`);
                return
            }
            "host" === k.key.toLowerCase() ? d.host = k.value : e.append(k.key, k.value)
        }
        if (!this.fa.Nc && /^\d+\.external$/.test(d.hostname))
            if (b = parseInt(d.hostname.split(".")[0], 10),
            !isNaN(b) && 0 < b && 65536 > b)
                d.protocol = "http:",
                d.hostname = "localhost",
                d.port = b.toString(10);
            else {
                console.warn('Unknown port for localhost: "%s"', d.href);
                Cc(this, 400, "Bad Request", `Unknown port for localhost: ${d.href}`);
                return
            }
        this.name = d.href;
        b = {
            method: c[0],
            headers: e
        };
        -1 !== ["put", "post"].indexOf(b.method.toLowerCase()) && (b.body = a);
        const f = this.fa.Nc ? this.fa.Nc + encodeURIComponent(d.href) : d.href;
        new TextEncoder;
        let h = !1;
        this.fa.wh(f, b).then(g => {
            let k = new Headers(g.headers);
            k.delete("content-encoding");
            k.delete("keep-alive");
            k.delete("content-length");
            k.delete("transfer-encoding");
            k.set("x-was-fetch-redirected", `${!!g.redirected}`);
            k.set("x-fetch-resp-url", g.url);
            k.set("connection", "close");
            this.write(Dc(g.status, g.statusText, k));
            h = !0;
            if (g.body && g.body.getReader) {
                const l = g.body.getReader()
                  , m = ({value: p, done: r}) => {
                    p && this.write(p);
                    if (r)
                        this.close();
                    else
                        return l.read().then(m)
                }
                ;
                l.read().then(m)
            } else
                g.arrayBuffer().then(l => {
                    this.write(new Uint8Array(l));
                    this.close()
                }
                )
        }
        ).catch(g => {
            console.warn("Fetch Failed: " + f + "\n" + g);
            h || Cc(this, 502, "Fetch Error", `Fetch ${f} failed:\n\n${g.stack || g.message}`);
            this.close()
        }
        )
    }
}
n.wh = async function(a, b) {
    this.Nc && (a = this.Nc + encodeURIComponent(a));
    try {
        const c = await fetch(a, b)
          , d = await c.arrayBuffer();
        return [c, d]
    } catch (c) {
        return console.warn("Fetch Failed: " + a + "\n" + c),
        [{
            status: 502,
            statusText: "Fetch Error",
            headers: new Headers({
                "Content-Type": "text/plain"
            })
        }, (new TextEncoder).encode(`Fetch ${a} failed:\n\n${c.stack}`).buffer]
    }
}
;
function Dc(a, b, c) {
    a = [`HTTP/1.1 ${a} ${b}`];
    for (const [d,e] of c.entries())
        a.push(`${d}: ${e}`);
    return (new TextEncoder).encode(a.join("\r\n") + "\r\n\r\n")
}
function Cc(a, b, c, d) {
    const e = new Headers({
        "content-type": "text/plain",
        "content-length": d.length.toString(10),
        connection: "close"
    });
    b = [Dc(b, c, e), (new TextEncoder).encode(d)];
    if (!a.jg)
        for (const f of b)
            a.Ee.write(f);
    a.sb();
    a.close()
}
function Bc(a) {
    var b = a.match(/^([^:]*):(.*)$/);
    if (b && (a = b[1],
    b = b[2].trim(),
    0 !== a.length && 0 !== b.length && /^[\w-]+$/.test(a) && /^[\x20-\x7E]+$/.test(b)))
        return {
            key: a,
            value: b
        }
}
n.send = function(a) {
    pc(a, this)
}
;
n.Fa = function(a) {
    this.v.send("net" + this.id + "-receive", new Uint8Array(a))
}
;
function Ec(a, b, c) {
    Fc(this, a);
    this.j = 1;
    this.g = {
        0: {
            mf: 0
        }
    };
    this.i = [];
    c = c || {};
    this.v = b;
    this.id = c.id || 0;
    this.tb = new Uint8Array((c.tb || "52:54:0:1:2:3").split(":").map(function(d) {
        return parseInt(d, 16)
    }));
    this.mb = new Uint8Array((c.mb || "192.168.86.1").split(".").map(function(d) {
        return parseInt(d, 10)
    }));
    this.Je = new Uint8Array((c.Je || "192.168.86.100").split(".").map(function(d) {
        return parseInt(d, 10)
    }));
    this.re = void 0 === c.re || !!c.re;
    this.Eg = new Uint8Array(6);
    this.cg = c.cg || "doh";
    this.dg = c.dg;
    this.Jc = {};
    this.Ja = jc();
    this.v.register("net" + this.id + "-mac", function(d) {
        this.Eg = new Uint8Array(d.split(":").map(function(e) {
            return parseInt(e, 16)
        }))
    }, this);
    this.v.register("net" + this.id + "-send", function(d) {
        this.send(d)
    }, this)
}
function Fc(a, b) {
    a.h = new WebSocket(b.replace("wisp://", "ws://").replace("wisps://", "wss://"));
    a.h.binaryType = "arraybuffer";
    a.h.onmessage = c => {
        c = new Uint8Array(c.data);
        const d = new DataView(c.buffer)
          , e = d.getUint32(1, !0);
        switch (c[0]) {
        case 2:
            if (a.g[e])
                a.g[e].Mg(c.slice(5));
            else
                throw Error("Got a DATA packet but stream not registered. ID: " + e);
            break;
        case 3:
            a.g[e] && (a.g[e].mf = d.getUint32(5, !0));
            if (a.g[e].Bh) {
                for (const f of a.i)
                    Gc(a, f.data, f.type, e);
                a.g[e].Bh = !1
            }
            break;
        case 4:
            a.g[e] && a.g[e].Lg(d.getUint8(5)),
            delete a.g[e]
        }
    }
    ;
    a.h.onclose = () => {
        setTimeout( () => {
            Fc(a, b)
        }
        , 1E4)
    }
}
function Gc(a, b, c, d) {
    a.g[d] && (0 < a.g[d].mf ? ("DATA" === c && a.g[d].mf--,
    a.h.send(b)) : (a.g[d].Bh = !0,
    a.i.push({
        data: b,
        type: c
    })))
}
function Hc(a, b) {
    let c, d;
    switch (b.type) {
    case "CONNECT":
        const e = (new TextEncoder).encode(b.hostname);
        c = new Uint8Array(8 + e.length);
        d = new DataView(c.buffer);
        d.setUint8(0, 1);
        d.setUint32(1, b.hc, !0);
        d.setUint8(5, 1);
        d.setUint16(6, b.port, !0);
        c.set(e, 8);
        a.g[b.hc] = {
            Mg: b.Mg,
            Lg: b.Lg,
            mf: a.g[0].mf
        };
        break;
    case "DATA":
        c = new Uint8Array(5 + b.data.length);
        d = new DataView(c.buffer);
        d.setUint8(0, 2);
        d.setUint32(1, b.hc, !0);
        c.set(b.data, 5);
        break;
    case "CLOSE":
        c = new Uint8Array(6),
        d = new DataView(c.buffer),
        d.setUint8(0, 4),
        d.setUint32(1, b.hc, !0),
        d.setUint8(5, b.reason)
    }
    Gc(a, c, b.type, b.hc)
}
Ec.prototype.wa = function() {
    this.h && (this.h.onmessage = null,
    this.h.onclose = null,
    this.h.close(),
    this.h = null)
}
;
Ec.prototype.Zh = function(a, b) {
    let c = new tc;
    c.state = "syn-received";
    c.fa = this;
    c.h = b;
    c.hc = this.j++;
    this.Jc[b] = c;
    uc(c, d => {
        0 !== d.length && Hc(this, {
            type: "DATA",
            hc: c.hc,
            data: d
        })
    }
    );
    c.Ff = () => {
        Hc(this, {
            type: "CLOSE",
            hc: c.hc,
            reason: 2
        })
    }
    ;
    c.Yh = c.Ff;
    Hc(this, {
        type: "CONNECT",
        hc: c.hc,
        hostname: a.Y.ja.join("."),
        port: a.S.pa,
        Mg: d => {
            c.write(d)
        }
        ,
        Lg: () => {
            c.close()
        }
    });
    c.accept(a);
    return !0
}
;
Ec.prototype.send = function(a) {
    pc(a, this)
}
;
Ec.prototype.Fa = function(a) {
    this.v.send("net" + this.id + "-receive", new Uint8Array(a))
}
;
const Ic = "undefined" !== typeof window && 0 <= window.navigator.platform.toString().toLowerCase().search("win");
function Jc(a) {
    function b(q) {
        !q.altKey && k[56] && h(56, !1);
        return e(q, !1)
    }
    function c(q) {
        !q.altKey && k[56] && h(56, !1);
        return e(q, !0)
    }
    function d() {
        for (var q = Object.keys(k), w, D = 0; D < q.length; D++)
            w = +q[D],
            k[w] && h(w, !1);
        k = {}
    }
    function e(q, w) {
        if (r.v && (q.shiftKey && q.ctrlKey && (73 === q.keyCode || 74 === q.keyCode || 75 === q.keyCode) || !r.fg ? 0 : q.target ? q.target.classList.contains("phone_keyboard") || "INPUT" !== q.target.nodeName && "TEXTAREA" !== q.target.nodeName : 1)) {
            q.preventDefault && q.preventDefault();
            if (Ic && (l && (clearTimeout(p),
            q.getModifierState && q.getModifierState("AltGraph") && m === w && "ControlLeft" === l.code && "AltRight" === q.code || f(l, m),
            l = null),
            "ControlLeft" === q.code))
                return l = q,
                m = w,
                p = setTimeout( () => {
                    f(l, m);
                    l = null
                }
                , 10),
                !1;
            f(q, w);
            return !1
        }
    }
    function f(q, w) {
        a: {
            if (void 0 !== q.code) {
                var D = y[q.code];
                if (void 0 !== D)
                    break a
            }
            D = v[q.keyCode]
        }
        D ? h(D, w, q.repeat) : console.log("Missing char in map: keyCode=" + (q.keyCode || -1).toString(16) + " code=" + q.code)
    }
    function h(q, w, D) {
        if (w)
            k[q] && !D && h(q, !1);
        else if (!k[q])
            return;
        (k[q] = w) || (q |= 128);
        255 < q ? (g(q >> 8),
        g(q & 255)) : g(q)
    }
    function g(q) {
        r.v.send("keyboard-code", q)
    }
    var k = {}
      , l = null
      , m = !1
      , p = 0
      , r = this;
    this.fg = !0;
    const v = new Uint16Array([0, 0, 0, 0, 0, 0, 0, 0, 14, 15, 0, 0, 0, 28, 0, 0, 42, 29, 56, 0, 58, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 57, 57417, 57425, 57423, 57415, 57419, 57416, 57421, 80, 0, 0, 0, 0, 82, 83, 0, 11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 0, 39, 0, 13, 0, 0, 0, 30, 48, 46, 32, 18, 33, 34, 35, 23, 36, 37, 38, 50, 49, 24, 25, 16, 19, 31, 20, 22, 47, 17, 45, 21, 44, 57435, 57436, 57437, 0, 0, 82, 79, 80, 81, 75, 76, 77, 71, 72, 73, 0, 0, 0, 0, 0, 0, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 87, 88, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 69, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 39, 13, 51, 12, 52, 53, 41, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 26, 43, 27, 40, 0, 57435, 57400, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
      , B = {
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
    }
      , C = {
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
    };
    var y = {
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
    this.wa = function() {
        "undefined" !== typeof window && (window.removeEventListener("keyup", b, !1),
        window.removeEventListener("keydown", c, !1),
        window.removeEventListener("blur", d, !1))
    }
    ;
    this.Jb = function() {
        "undefined" !== typeof window && (this.wa(),
        window.addEventListener("keyup", b, !1),
        window.addEventListener("keydown", c, !1),
        window.addEventListener("blur", d, !1))
    }
    ;
    this.Jb();
    this.g = function(q) {
        q = {
            keyCode: q
        };
        e(q, !0);
        e(q, !1)
    }
    ;
    this.wl = function(q) {
        var w = q.charCodeAt(0);
        w in B ? this.g(B[w]) : w in C ? (g(42),
        this.g(C[w]),
        g(170)) : console.log("ascii -> keyCode not found: ", w, q)
    }
}
;function Kc(a, b) {
    function c(y) {
        if (!C.enabled || !C.fg)
            return !1;
        var q = b || document.body, w;
        if (!(w = document.pointerLockElement))
            a: {
                for (y = y.target; y.parentNode; ) {
                    if (y === q) {
                        w = !0;
                        break a
                    }
                    y = y.parentNode
                }
                w = !1
            }
        return w
    }
    function d(y) {
        c(y) && (y = y.changedTouches) && y.length && (y = y[y.length - 1],
        v = y.clientX,
        B = y.clientY)
    }
    function e() {
        if (m || r || p)
            C.v.send("mouse-click", [!1, !1, !1]),
            m = r = p = !1
    }
    function f(y) {
        if (C.v && c(y) && C.vd) {
            var q = 0
              , w = 0
              , D = y.changedTouches;
            D ? D.length && (D = D[D.length - 1],
            q = D.clientX - v,
            w = D.clientY - B,
            v = D.clientX,
            B = D.clientY,
            y.preventDefault()) : "number" === typeof y.movementX ? (q = y.movementX,
            w = y.movementY) : "number" === typeof y.webkitMovementX ? (q = y.webkitMovementX,
            w = y.webkitMovementY) : "number" === typeof y.mozMovementX ? (q = y.mozMovementX,
            w = y.mozMovementY) : (q = y.clientX - v,
            w = y.clientY - B,
            v = y.clientX,
            B = y.clientY);
            C.v.send("mouse-delta", [.15 * q, -(.15 * w)]);
            b && C.v.send("mouse-absolute", [y.pageX - b.offsetLeft, y.pageY - b.offsetTop, b.offsetWidth, b.offsetHeight])
        }
    }
    function h(y) {
        c(y) && k(y, !0)
    }
    function g(y) {
        c(y) && k(y, !1)
    }
    function k(y, q) {
        C.v && (1 === y.which ? m = q : 2 === y.which ? r = q : 3 === y.which && (p = q),
        C.v.send("mouse-click", [m, r, p]),
        y.preventDefault())
    }
    function l(y) {
        if (c(y)) {
            var q = y.wheelDelta || -y.detail;
            0 > q ? q = -1 : 0 < q && (q = 1);
            C.v.send("mouse-wheel", [q, 0]);
            y.preventDefault()
        }
    }
    var m = !1
      , p = !1
      , r = !1
      , v = 0
      , B = 0
      , C = this;
    this.enabled = !1;
    this.fg = !0;
    this.v = a;
    this.v.register("mouse-enable", function(y) {
        this.enabled = y
    }, this);
    this.vd = !1;
    this.v.register("emulator-stopped", function() {
        this.vd = !1
    }, this);
    this.v.register("emulator-started", function() {
        this.vd = !0
    }, this);
    this.wa = function() {
        "undefined" !== typeof window && (window.removeEventListener("touchstart", d, !1),
        window.removeEventListener("touchend", e, !1),
        window.removeEventListener("touchmove", f, !1),
        window.removeEventListener("mousemove", f, !1),
        window.removeEventListener("mousedown", h, !1),
        window.removeEventListener("mouseup", g, !1),
        window.removeEventListener("wheel", l, {
            passive: !1
        }))
    }
    ;
    this.Jb = function() {
        "undefined" !== typeof window && (this.wa(),
        window.addEventListener("touchstart", d, !1),
        window.addEventListener("touchend", e, !1),
        window.addEventListener("touchmove", f, !1),
        window.addEventListener("mousemove", f, !1),
        window.addEventListener("mousedown", h, !1),
        window.addEventListener("mouseup", g, !1),
        window.addEventListener("wheel", l, {
            passive: !1
        }))
    }
    ;
    this.Jb()
}
;function Lc(a, b) {
    function c(E) {
        E = E.toString(16);
        return "#" + "0".repeat(6 - E.length) + E
    }
    function d(E) {
        var A = 256 * M
          , H = 8 * I
          , J = P ? P.canvas : null;
        J && J.width === A && J.height === H || (J ? (J.width = A,
        J.height = H) : (J = new OffscreenCanvas(A,H),
        P = J.getContext("2d")),
        z = P.createImageData(A, H));
        const S = z.data;
        let Q = 0, V;
        H = Ia ? function(Z) {
            V = V || Z;
            S[Q + 3] = Z;
            S[Q + 7] = Z;
            Q += 8
        }
        : function(Z) {
            V = V || Z;
            S[Q + 3] = Z;
            Q += 4
        }
        ;
        J = 32 - I;
        const la = A * (I - 1) * 4;
        A = 4 * (M - A * I);
        const ia = 1020 * M;
        for (let Z = 0, Ja = 0; 2048 > Z; ++Z,
        Ja += J,
        Q += A) {
            const Ka = Z % 256;
            Z && !Ka && (Q += la);
            V = !1;
            for (let Va = 0; Va < I; ++Va,
            ++Ja,
            Q += ia) {
                const Wa = E[Ja];
                for (let Da = 128; 0 < Da; Da >>= 1)
                    H(Wa & Da ? 255 : 0);
                ma && H(Xa && 192 <= Ka && 223 >= Ka && Wa & 1 ? 255 : 0)
            }
            L[Z] = V ? 1 : 0
        }
        P.putImageData(z, 0, 0)
    }
    function e(E, A, H, J) {
        if (A && H) {
            E.style.width = "";
            E.style.height = "";
            J && (E.style.transform = "");
            var S = E.getBoundingClientRect();
            J ? E.style.transform = (1 === A ? "" : " scaleX(" + A + ")") + (1 === H ? "" : " scaleY(" + H + ")") : (0 === A % 1 && 0 === H % 1 ? (h.style.imageRendering = "crisp-edges",
            h.style.imageRendering = "pixelated",
            h.style["-ms-interpolation-mode"] = "nearest-neighbor") : (h.style.imageRendering = "",
            h.style["-ms-interpolation-mode"] = ""),
            J = window.devicePixelRatio || 1,
            0 !== J % 1 && (A /= J,
            H /= J));
            1 !== A && (E.style.width = S.width * A + "px");
            1 !== H && (E.style.height = S.height * H + "px")
        }
    }
    const f = a.Zf;
    this.fh = b;
    console.assert(f, "options.container must be provided");
    this.o = 1;
    this.A = 2;
    var h = f.getElementsByTagName("canvas")[0], g = h.getContext("2d", {
        alpha: !1
    }), k = f.getElementsByTagName("div")[0], l = document.createElement("div"), m, p, r = void 0 !== a.scale ? a.scale : 1, v = void 0 !== a.scale ? a.scale : 1, B = 1, C, y, q, w, D, T, ca, P, z, L = new Int8Array(2048), I, M, ma, Ia, Xa, db = 0, na = 0, oa, wa = 0, ra, La, qc, ed = [], rc = 0, fd = !1;
    this.Jb = function() {
        const E = new Uint16Array([32, 9786, 9787, 9829, 9830, 9827, 9824, 8226, 9688, 9675, 9689, 9794, 9792, 9834, 9835, 9788, 9658, 9668, 8597, 8252, 182, 167, 9644, 8616, 8593, 8595, 8594, 8592, 8735, 8596, 9650, 9660])
          , A = new Uint16Array([8962, 199, 252, 233, 226, 228, 224, 229, 231, 234, 235, 232, 239, 238, 236, 196, 197, 201, 230, 198, 244, 246, 242, 251, 249, 255, 214, 220, 162, 163, 165, 8359, 402, 225, 237, 243, 250, 241, 209, 170, 186, 191, 8976, 172, 189, 188, 161, 171, 187, 9617, 9618, 9619, 9474, 9508, 9569, 9570, 9558, 9557, 9571, 9553, 9559, 9565, 9564, 9563, 9488, 9492, 9524, 9516, 9500, 9472, 9532, 9566, 9567, 9562, 9556, 9577, 9574, 9568, 9552, 9580, 9575, 9576, 9572, 9573, 9561, 9560, 9554, 9555, 9579, 9578, 9496, 9484, 9608, 9604, 9612, 9616, 9600, 945, 223, 915, 960, 931, 963, 181, 964, 934, 920, 937, 948, 8734, 966, 949, 8745, 8801, 177, 8805, 8804, 8992, 8993, 247, 8776, 176, 8729, 183, 8730, 8319, 178, 9632, 160]);
        for (var H = 0, J; 256 > H; H++)
            J = 126 < H ? A[H - 127] : 32 > H ? E[H] : H,
            ed.push(String.fromCharCode(J));
        l.classList.add("cursor");
        l.style.position = "absolute";
        l.style.backgroundColor = "#ccc";
        l.style.width = "7px";
        l.style.display = "inline-block";
        this.g(!1);
        this.i(80, 25);
        2 === y && this.h(720, 400);
        this.ih(r, v);
        this.Kc()
    }
    ;
    this.Rj = function() {
        const E = new Image;
        if (1 === y || 2 === y)
            E.src = h.toDataURL("image/png");
        else {
            const A = [9, 16]
              , H = document.createElement("canvas");
            H.width = w * A[0];
            H.height = D * A[1];
            const J = H.getContext("2d");
            J.imageSmoothingEnabled = !1;
            J.font = window.getComputedStyle(k).font;
            J.textBaseline = "top";
            for (let S = 0; S < D; S++)
                for (let Q = 0; Q < w; Q++) {
                    const V = 4 * (S * w + Q)
                      , la = q[V]
                      , ia = q[V + 3];
                    J.fillStyle = c(q[V + 2]);
                    J.fillRect(Q * A[0], S * A[1], A[0], A[1]);
                    J.fillStyle = c(ia);
                    J.fillText(ed[la], Q * A[0], S * A[1])
                }
            "none" !== l.style.display && m < D && p < w && (J.fillStyle = l.style.backgroundColor,
            J.fillRect(p * A[0], m * A[1] + parseInt(l.style.marginTop, 10), parseInt(l.style.width, 10), parseInt(l.style.height, 10)));
            E.src = H.toDataURL("image/png")
        }
        return E
    }
    ;
    this.j = function(E, A, H, J, S, Q) {
        A = 4 * (E * w + A);
        q[A] = H;
        q[A + 1] = J;
        q[A + 2] = S;
        q[A + 3] = Q;
        C[E] = 1
    }
    ;
    this.Kc = function() {
        rc = requestAnimationFrame( () => this.aa())
    }
    ;
    this.aa = function() {
        fd || (0 === y ? this.ba() : 1 === y ? this.X() : this.Z());
        this.Kc()
    }
    ;
    this.ba = function() {
        for (var E = 0; E < D; E++)
            C[E] && (this.U(E),
            C[E] = 0)
    }
    ;
    this.X = function() {
        this.fh()
    }
    ;
    this.Z = function() {
        if (T) {
            var E = performance.now();
            if (266 < E - wa) {
                oa = !oa;
                qc && (C[m] = 1);
                var A = 4 * w;
                for (let la = 0, ia = 0; la < D; ++la)
                    if (C[la])
                        ia += A;
                    else
                        for (var H = 0; H < w; ++H,
                        ia += 4)
                            if (q[ia + 1] & 1) {
                                C[la] = 1;
                                ia += A - 4 * H;
                                break
                            }
                wa = E
            }
            E = P.canvas;
            A = ca.canvas;
            H = 4 * w;
            const S = w * M
              , Q = I;
            let V = 0;
            for (let la = 0, ia = 0, Z = 0; la < D; ++la,
            ia += I) {
                if (!C[la]) {
                    Z += H;
                    continue
                }
                ++V;
                ca.clearRect(0, Q, S, I);
                let Ja, Ka, Va, Wa;
                for (let Da = 0; Da < S; Da += M,
                Z += 4) {
                    const Ge = q[Z];
                    var J = q[Z + 1];
                    const He = q[Z + 2]
                      , Ie = q[Z + 3]
                      , Je = J & 2 ? na : db;
                    J = (!(J & 1) || oa) && L[(Je << 8) + Ge];
                    Va !== He && (void 0 !== Va && (T.fillStyle = c(Va),
                    T.fillRect(Wa, ia, Da - Wa, I)),
                    Va = He,
                    Wa = Da);
                    Ja !== Ie && (void 0 !== Ja && (ca.fillStyle = c(Ja),
                    ca.fillRect(Ka, 0, Da - Ka, I)),
                    Ja = Ie,
                    Ka = Da);
                    J && ca.drawImage(E, Ge * M, Je * I, M, I, Da, Q, M, I)
                }
                ca.fillStyle = c(Ja);
                ca.fillRect(Ka, 0, S - Ka, I);
                ca.globalCompositeOperation = "destination-in";
                ca.drawImage(A, 0, Q, S, I, 0, 0, S, I);
                ca.globalCompositeOperation = "source-over";
                T.fillStyle = c(Va);
                T.fillRect(Wa, ia, S - Wa, I);
                T.drawImage(A, 0, 0, S, I, 0, ia, S, I)
            }
            V && (oa && qc && C[m] && (T.fillStyle = c(q[4 * (m * w + p) + 3]),
            T.fillRect(p * M, m * I + ra, M, La - ra + 1)),
            C.fill(0));
            V && g.drawImage(T.canvas, 0, 0)
        }
    }
    ;
    this.wa = function() {
        rc && (cancelAnimationFrame(rc),
        rc = 0)
    }
    ;
    this.pause = function() {
        fd = !0;
        l.classList.remove("blinking-cursor")
    }
    ;
    this.continue = function() {
        fd = !1;
        l.classList.add("blinking-cursor")
    }
    ;
    this.g = function(E) {
        y = E ? 1 : a.Bl ? 2 : 0;
        0 === y ? (k.style.display = "block",
        h.style.display = "none") : (k.style.display = "none",
        h.style.display = "block",
        2 === y && C && C.fill(1))
    }
    ;
    this.B = function(E, A, H, J, S, Q) {
        const V = H ? 16 : A ? 9 : 8;
        if (I !== E || M !== V || ma !== A || Ia !== H || Xa !== J || Q)
            Q = M !== V || I !== E,
            I = E,
            M = V,
            ma = A,
            Ia = H,
            Xa = J,
            2 === y && (d(S),
            C.fill(1),
            Q && this.T())
    }
    ;
    this.D = function(E, A) {
        if (db !== E || na !== A)
            db = E,
            na = A,
            C.fill(1)
    }
    ;
    this.N = function() {
        g.fillStyle = "#000";
        g.fillRect(0, 0, h.width, h.height)
    }
    ;
    this.T = function() {
        if (P) {
            var E = M * w
              , A = I * D
              , H = 2 * I;
            T && T.canvas.width === E && T.canvas.height === A && ca.canvas.height === H || (T ? (T.canvas.width = E,
            T.canvas.height = A,
            ca.canvas.width = E,
            ca.canvas.height = H) : (T = (new OffscreenCanvas(E,A)).getContext("2d", {
                alpha: !1
            }),
            ca = (new OffscreenCanvas(E,H)).getContext("2d")),
            this.h(E, A),
            C.fill(1))
        }
    }
    ;
    this.i = function(E, A) {
        if (E !== w || A !== D)
            if (C = new Int8Array(A),
            q = new Int32Array(E * A * 4),
            w = E,
            D = A,
            0 === y) {
                for (; k.childNodes.length > A; )
                    k.removeChild(k.firstChild);
                for (; k.childNodes.length < A; )
                    k.appendChild(document.createElement("div"));
                for (E = 0; E < A; E++)
                    this.U(E);
                e(k, r, v, !0)
            } else
                2 === y && this.T()
    }
    ;
    this.h = function(E, A) {
        h.style.display = "block";
        h.width = E;
        h.height = A;
        g.imageSmoothingEnabled = !1;
        B = 640 >= E && 2 * E < window.innerWidth * window.devicePixelRatio && 2 * A < window.innerHeight * window.devicePixelRatio ? 2 : 1;
        e(h, r * B, v * B, !1)
    }
    ;
    this.ih = function(E, A) {
        r = E;
        v = A;
        e(k, r, v, !0);
        e(h, r * B, v * B, !1)
    }
    ;
    this.K = function(E, A, H) {
        if (E !== ra || A !== La || H !== qc)
            0 === y ? H ? (l.style.display = "inline",
            l.style.height = A - E + "px",
            l.style.marginTop = E + "px") : l.style.display = "none" : 2 === y && m < D && (C[m] = 1),
            ra = E,
            La = A,
            qc = H
    }
    ;
    this.F = function(E, A) {
        if (E !== m || A !== p)
            E < D && (C[E] = 1),
            m < D && (C[m] = 1),
            m = E,
            p = A
    }
    ;
    this.U = function(E) {
        var A = 4 * E * w, H;
        var J = k.childNodes[E];
        var S = document.createElement("div");
        for (var Q = 0; Q < w; ) {
            var V = document.createElement("span");
            var la = q[A + 1] & 1;
            var ia = q[A + 2];
            var Z = q[A + 3];
            la && V.classList.add("blink");
            V.style.backgroundColor = c(ia);
            V.style.color = c(Z);
            for (H = ""; Q < w && (q[A + 1] & 1) === la && q[A + 2] === ia && q[A + 3] === Z; )
                if (H += ed[q[A]],
                Q++,
                A += 4,
                E === m)
                    if (Q === p)
                        break;
                    else if (Q === p + 1) {
                        l.style.backgroundColor = V.style.color;
                        S.appendChild(l);
                        break
                    }
            V.textContent = H;
            S.appendChild(V)
        }
        J.parentNode.replaceChild(S, J)
    }
    ;
    this.l = function(E) {
        for (const A of E)
            g.putImageData(A.zc, A.gh - A.Xf, A.hh - A.Yf, A.Xf, A.Yf, A.Jg, A.Ig)
    }
    ;
    this.Jb()
}
;function Mc() {
    var a, b = 0, c = 0;
    this.j = function(d, e, f) {
        a[d * b + e] = f
    }
    ;
    this.wa = function() {}
    ;
    this.pause = function() {}
    ;
    this.continue = function() {}
    ;
    this.g = function() {}
    ;
    this.B = function() {}
    ;
    this.D = function() {}
    ;
    this.N = function() {}
    ;
    this.i = function(d, e) {
        if (d !== b || e !== c)
            a = new Uint8Array(d * e),
            b = d,
            c = e
    }
    ;
    this.h = function() {}
    ;
    this.ih = function() {}
    ;
    this.K = function() {}
    ;
    this.F = function() {}
    ;
    this.l = function() {}
    ;
    this.i(80, 25)
}
;function Nc(a, b) {
    function c(g) {
        h.v && h.enabled && (h.h(g.which),
        g.preventDefault())
    }
    function d(g) {
        var k = g.which;
        8 === k ? (h.h(127),
        g.preventDefault()) : 9 === k && (h.h(9),
        g.preventDefault())
    }
    function e(g) {
        if (h.enabled) {
            for (var k = g.clipboardData.getData("text/plain"), l = 0; l < k.length; l++)
                h.h(k.charCodeAt(l));
            g.preventDefault()
        }
    }
    function f(g) {
        g.target !== a && a.blur()
    }
    var h = this;
    this.enabled = !0;
    this.v = b;
    this.text = "";
    this.j = !1;
    this.i = 0;
    this.v.register("serial0-output-byte", function(g) {
        this.vl(String.fromCharCode(g))
    }, this);
    this.wa = function() {
        a.removeEventListener("keypress", c, !1);
        a.removeEventListener("keydown", d, !1);
        a.removeEventListener("paste", e, !1);
        window.removeEventListener("mousedown", f, !1)
    }
    ;
    this.Jb = function() {
        this.wa();
        a.style.display = "block";
        a.addEventListener("keypress", c, !1);
        a.addEventListener("keydown", d, !1);
        a.addEventListener("paste", e, !1);
        window.addEventListener("mousedown", f, !1)
    }
    ;
    this.Jb();
    this.vl = function(g) {
        "\b" === g ? (this.text = this.text.slice(0, -1),
        this.update()) : "\r" !== g && (this.text += g,
        "\n" === g && (this.j = !0),
        this.update())
    }
    ;
    this.update = function() {
        var g = Date.now()
          , k = g - this.i;
        16 > k ? void 0 === this.g && (this.g = setTimeout( () => {
            this.g = void 0;
            this.i = Date.now();
            this.l()
        }
        , 16 - k)) : (void 0 !== this.g && (clearTimeout(this.g),
        this.g = void 0),
        this.i = g,
        this.l())
    }
    ;
    this.l = function() {
        a.value = this.text;
        this.j && (this.j = !1,
        a.scrollTop = 1E9)
    }
    ;
    this.h = function(g) {
        h.v && h.v.send("serial0-input", g)
    }
}
function Oc(a, b) {
    this.element = a;
    if (window.Terminal) {
        var c = this.g = new window.Terminal({
            logLevel: "off",
            convertEol: "true"
        });
        c.write("This is the serial console. Whatever you type or paste here will be sent to COM1");
        var d = c.onData(function(e) {
            for (let f = 0; f < e.length; f++)
                b.send("serial0-input", e.charCodeAt(f))
        });
        b.register("serial0-output-byte", function(e) {
            c.write(Uint8Array.of(e))
        }, this);
        this.wa = function() {
            d.dispose();
            c.dispose()
        }
    }
}
Oc.prototype.show = function() {
    this.g && this.g.open(this.element)
}
;
function Pc(a, b) {
    b = b.id || 0;
    this.v = a;
    this.h = `net${b}-send`;
    this.o = `net${b}-receive`;
    this.g = new BroadcastChannel(`v86-inbrowser-${b}`);
    this.j = !0;
    this.l = c => {
        this.g.postMessage(c)
    }
    ;
    this.v.register(this.h, this.l, this);
    this.i = c => {
        this.v.send(this.o, c.data)
    }
    ;
    this.g.addEventListener("message", this.i)
}
Pc.prototype.wa = function() {
    this.j && (this.v.unregister(this.h, this.l),
    this.g.removeEventListener("message", this.i),
    this.g.close(),
    this.j = !1)
}
;
function Qc() {
    this.h = new Map
}
Qc.prototype.read = async function(a, b, c) {
    return (a = this.h.get(a)) ? a.subarray(b, b + c) : null
}
;
Qc.prototype.cache = async function(a, b) {
    this.h.set(a, b)
}
;
Qc.prototype.g = function(a) {
    this.h.delete(a)
}
;
function Rc(a, b) {
    b.endsWith("/") || (b += "/");
    this.h = a;
    this.Wf = b
}
function Sc(a, b) {
    return new Promise(c => {
        Aa(a.Wf + b, {
            done: async d => {
                d = new Uint8Array(d);
                await a.cache(b, d);
                c(d)
            }
        })
    }
    )
}
Rc.prototype.read = async function(a, b, c) {
    const d = await this.h.read(a, b, c);
    return d ? d : (await Sc(this, a)).subarray(b, b + c)
}
;
Rc.prototype.cache = async function(a, b) {
    return await this.h.cache(a, b)
}
;
Rc.prototype.g = function(a) {
    this.h.g(a)
}
;
const Tc = new TextDecoder
  , Uc = new TextEncoder;
function G(a, b, c, d) {
    for (var e, f = 0, h = 0; h < a.length; h++)
        switch (e = b[h],
        a[h]) {
        case "w":
            c[d++] = e & 255;
            c[d++] = e >> 8 & 255;
            c[d++] = e >> 16 & 255;
            c[d++] = e >> 24 & 255;
            f += 4;
            break;
        case "d":
            c[d++] = e & 255;
            c[d++] = e >> 8 & 255;
            c[d++] = e >> 16 & 255;
            c[d++] = e >> 24 & 255;
            c[d++] = 0;
            c[d++] = 0;
            c[d++] = 0;
            c[d++] = 0;
            f += 8;
            break;
        case "h":
            c[d++] = e & 255;
            c[d++] = e >> 8;
            f += 2;
            break;
        case "b":
            c[d++] = e;
            f += 1;
            break;
        case "s":
            var g = d
              , k = 0;
            c[d++] = 0;
            c[d++] = 0;
            f += 2;
            e = Uc.encode(e);
            f += e.byteLength;
            k += e.byteLength;
            c.set(e, d);
            d += e.byteLength;
            c[g + 0] = k & 255;
            c[g + 1] = k >> 8 & 255;
            break;
        case "Q":
            G(["b", "w", "d"], [e.type, e.version, e.path], c, d),
            d += 13,
            f += 13
        }
    return f
}
function K(a, b, c) {
    let d = c.offset;
    for (var e = [], f = 0; f < a.length; f++)
        switch (a[f]) {
        case "w":
            var h = b[d++];
            h += b[d++] << 8;
            h += b[d++] << 16;
            h += b[d++] << 24 >>> 0;
            e.push(h);
            break;
        case "d":
            h = b[d++];
            h += b[d++] << 8;
            h += b[d++] << 16;
            h += b[d++] << 24 >>> 0;
            d += 4;
            e.push(h);
            break;
        case "h":
            h = b[d++];
            e.push(h + (b[d++] << 8));
            break;
        case "b":
            e.push(b[d++]);
            break;
        case "s":
            h = b[d++];
            h += b[d++] << 8;
            var g = b.slice(d, d + h);
            d += h;
            e.push(Tc.decode(g));
            break;
        case "Q":
            c.offset = d,
            h = K(["b", "w", "d"], b, c),
            d = c.offset,
            e.push({
                type: h[0],
                version: h[1],
                path: h[2]
            })
        }
    c.offset = d;
    return e
}
;const Vc = new TextEncoder;
function Wc(a) {
    this.g = [];
    this.B = [];
    this.j = a;
    this.A = {
        Qg: 0
    };
    this.h = {};
    this.l = 274877906944;
    this.o = 0;
    this.i = [];
    Xc(this, "", -1)
}
Wc.prototype.ia = function() {
    let a = [];
    a[0] = this.g;
    a[1] = this.A.Qg;
    a[2] = [];
    for (const [b,c] of Object.entries(this.h))
        0 === (this.g[b].mode & 16384) && a[2].push([b, c]);
    a[3] = this.l;
    a[4] = this.o;
    return a = a.concat(this.i)
}
;
Wc.prototype.J = function(a) {
    this.g = a[0].map(b => {
        const c = new Yc(0);
        c.J(b);
        return c
    }
    );
    this.A.Qg = a[1];
    this.h = {};
    for (let[b,c] of a[2])
        c.buffer.byteLength !== c.byteLength && (c = c.slice()),
        this.h[b] = c;
    this.l = a[3];
    this.o = a[4];
    this.i = a.slice(5)
}
;
function Zc(a, b, c) {
    var d = a.g[b];
    0 === d.status || 2 === d.status ? c() : 5 === d.status ? Zc(N(a, d), d.g, c) : a.B.push({
        id: b,
        Gl: c
    })
}
function $c(a, b, c) {
    var d = ad(a);
    const e = b[0];
    d.size = b[1];
    d.bd = b[2];
    d.Se = d.bd;
    d.fe = d.bd;
    d.mode = b[3];
    d.uid = b[4];
    d.bb = b[5];
    var f = d.mode & 61440;
    if (16384 === f)
        for (bd(a, d, c, e),
        c = a.g.length - 1,
        b = b[6],
        d = 0; d < b.length; d++)
            $c(a, b[d], c);
    else
        32768 === f ? (d.status = 2,
        d.Fe = b[6],
        bd(a, d, c, e)) : 40960 === f && (d.Of = b[6],
        bd(a, d, c, e))
}
function cd(a, b, c, d) {
    const e = a.g[c]
      , f = a.g[b];
    dd(a, b);
    f.xa.has(d);
    f.xa.set(d, c);
    e.qb++;
    dd(a, c) && (e.xa.has(".."),
    e.xa.has(".") || e.qb++,
    e.xa.set(".", c),
    e.xa.set("..", b),
    f.qb++)
}
function gd(a, b, c) {
    const d = hd(a, b, c)
      , e = a.g[d]
      , f = a.g[b];
    dd(a, b);
    f.xa.delete(c) && (e.qb--,
    dd(a, d) && (e.xa.get(".."),
    e.xa.delete(".."),
    f.qb--))
}
function bd(a, b, c, d) {
    -1 !== c ? (a.g.push(b),
    b.Rc = a.g.length - 1,
    cd(a, c, b.Rc, d)) : 0 === a.g.length && (a.g.push(b),
    b.xa.set(".", 0),
    b.xa.set("..", 0),
    b.qb = 2)
}
function Yc(a) {
    this.xa = new Map;
    this.mg = this.lg = this.bd = this.fe = this.Se = this.Rc = this.bb = this.uid = this.size = this.status = 0;
    this.Of = "";
    this.mode = 493;
    this.Ra = {
        type: 0,
        version: 0,
        path: a
    };
    this.qb = 0;
    this.Fe = "";
    this.h = [];
    this.g = this.i = -1
}
Yc.prototype.ia = function() {
    const a = [];
    a[0] = this.mode;
    a[1] = 16384 === (this.mode & 61440) ? [...this.xa] : 32768 === (this.mode & 61440) ? this.Fe : 40960 === (this.mode & 61440) ? this.Of : 49152 === (this.mode & 61440) ? [this.mg, this.lg] : null;
    a[2] = this.h;
    a[3] = this.status;
    a[4] = this.size;
    a[5] = this.uid;
    a[6] = this.bb;
    a[7] = this.Rc;
    a[8] = this.Se;
    a[9] = this.fe;
    a[10] = this.bd;
    a[11] = this.Ra.version;
    a[12] = this.Ra.path;
    a[13] = this.qb;
    return a
}
;
Yc.prototype.J = function(a) {
    this.mode = a[0];
    if (16384 === (this.mode & 61440)) {
        this.xa = new Map;
        for (const [b,c] of a[1])
            this.xa.set(b, c)
    } else
        32768 === (this.mode & 61440) ? this.Fe = a[1] : 40960 === (this.mode & 61440) ? this.Of = a[1] : 49152 === (this.mode & 61440) && ([this.mg,this.lg] = a[1]);
    this.h = [];
    for (const b of a[2]) {
        const c = new id;
        c.J(b);
        this.h.push(c)
    }
    this.status = a[3];
    this.size = a[4];
    this.uid = a[5];
    this.bb = a[6];
    this.Rc = a[7];
    this.Se = a[8];
    this.fe = a[9];
    this.bd = a[10];
    this.Ra.type = (this.mode & 61440) >> 8;
    this.Ra.version = a[11];
    this.Ra.path = a[12];
    this.qb = a[13]
}
;
function jd(a, b) {
    Object.assign(b, a, {
        Rc: b.Rc,
        xa: b.xa,
        qb: b.qb
    })
}
function ad(a) {
    const b = Math.round(Date.now() / 1E3);
    a = new Yc(++a.A.Qg);
    a.fe = a.Se = a.bd = b;
    return a
}
function Xc(a, b, c) {
    var d = a.g[c];
    if (0 <= c && 5 === d.status)
        return c = d.g,
        b = Xc(N(a, d), b, c),
        kd(a, d.i, b);
    d = ad(a);
    d.mode = 16895;
    0 <= c && (d.uid = a.g[c].uid,
    d.bb = a.g[c].bb,
    d.mode = a.g[c].mode & 511 | 16384);
    d.Ra.type = 64;
    bd(a, d, c, b);
    return a.g.length - 1
}
function ld(a, b, c) {
    var d = a.g[c];
    if (5 === d.status)
        return c = d.g,
        b = ld(N(a, d), b, c),
        kd(a, d.i, b);
    d = ad(a);
    d.uid = a.g[c].uid;
    d.bb = a.g[c].bb;
    d.Ra.type = 128;
    d.mode = a.g[c].mode & 438 | 32768;
    bd(a, d, c, b);
    return a.g.length - 1
}
function md(a, b, c, d, e) {
    var f = a.g[c];
    if (5 === f.status)
        return c = f.g,
        b = md(N(a, f), b, c, d, e),
        kd(a, f.i, b);
    f = ad(a);
    f.lg = d;
    f.mg = e;
    f.uid = a.g[c].uid;
    f.bb = a.g[c].bb;
    f.Ra.type = 192;
    f.mode = a.g[c].mode & 438;
    bd(a, f, c, b);
    return a.g.length - 1
}
function nd(a, b, c, d) {
    var e = a.g[c];
    if (5 === e.status)
        return c = e.g,
        b = nd(N(a, e), b, c, d),
        kd(a, e.i, b);
    e = ad(a);
    e.uid = a.g[c].uid;
    e.bb = a.g[c].bb;
    e.Ra.type = 160;
    e.Of = d;
    e.mode = 40960;
    bd(a, e, c, b);
    return a.g.length - 1
}
async function od(a, b, c, d) {
    var e = a.g[c];
    if (5 === e.status)
        return c = e.g,
        d = await od(N(a, e), b, c, d),
        kd(a, e.i, d);
    e = ld(a, b, c);
    b = a.g[e];
    c = new Uint8Array(d.length);
    c.set(d);
    await pd(a, e, c);
    b.size = d.length;
    return e
}
function qd(a, b, c) {
    var d = a.g[b];
    if (5 === d.status)
        return qd(N(a, d), d.g, c);
    16384 === (d.mode & 61440) && rd(a, b);
    return !0
}
async function sd(a, b) {
    var c = a.g[b];
    if (5 === c.status)
        return await sd(N(a, c), c.g);
    2 === c.status && a.j.g(c.Fe);
    4 === c.status && (c.status = -1,
    await td(a, b))
}
async function ud(a, b, c, d, e) {
    if (b === d && c === e)
        return 0;
    var f = hd(a, b, c);
    if (-1 === f)
        return -2;
    var h = b;
    dd(a, h);
    for (var g = ""; 0 !== h; )
        g = "/" + vd(a, h) + g,
        h = wd(a, h);
    if (-1 !== hd(a, d, e) && (h = xd(a, d, e),
    0 > h))
        return h;
    g = a.g[f];
    var k = a.g[b];
    h = a.g[d];
    if (5 === k.status || 5 === h.status)
        if (5 === k.status && k.i === h.i) {
            if (a = await ud(N(a, k), k.g, c, h.g, e),
            0 > a)
                return a
        } else {
            if (0 === yd(a, f).Rc || !dd(a, f) && 1 < yd(a, f).qb)
                return -1;
            k = hd(a, b, c);
            var l = a.g[k]
              , m = new Yc(-1);
            dd(a, k);
            Object.assign(m, l);
            const p = a.g.length;
            a.g.push(m);
            m.Rc = p;
            5 === l.status && a.i[l.i].g.set(l.g, p);
            if (5 !== l.status || 0 === l.g)
                gd(a, b, c),
                cd(a, b, p, c);
            if (dd(a, k) && 5 !== l.status)
                for (const [r,v] of m.xa)
                    "." !== r && ".." !== r && dd(a, v) && a.g[v].xa.set("..", p);
            a.h[p] = a.h[k];
            delete a.h[k];
            l.xa = new Map;
            l.qb = 0;
            k = p;
            l = yd(a, f);
            m = await zd(a, k, 0, l.size);
            5 === h.status ? (d = N(a, h),
            e = dd(a, k) ? Xc(d, e, h.g) : ld(d, e, h.g),
            d = yd(d, e),
            jd(l, d),
            Ad(a, f, h.i, e)) : (g.status = -1,
            a.i[g.i].g.delete(g.g),
            jd(l, g),
            cd(a, d, f, e));
            await Bd(a, f, l.size);
            m && m.length && await Cd(a, f, 0, m.length, m);
            if (dd(a, f))
                for (const r of Dd(a, k))
                    if (e = await ud(a, k, r, f, r),
                    0 > e)
                        return e;
            await td(a, k);
            a = xd(a, b, c);
            if (0 > a)
                return a
        }
    else
        gd(a, b, c),
        cd(a, d, f, e),
        g.Ra.version++;
    return 0
}
async function Cd(a, b, c, d, e) {
    var f = a.g[b];
    if (5 === f.status)
        b = f.g,
        await Cd(N(a, f), b, c, d, e);
    else {
        var h = await a.bc(b);
        !h || h.length < c + d ? (await Bd(a, b, Math.floor(3 * (c + d) / 2)),
        f.size = c + d,
        h = await a.bc(b)) : f.size < c + d && (f.size = c + d);
        e && h.set(e.subarray(0, d), c);
        await pd(a, b, h)
    }
}
async function zd(a, b, c, d) {
    const e = a.g[b];
    return 5 === e.status ? (b = e.g,
    await zd(N(a, e), b, c, d)) : await Ed(a, b, c, d)
}
function hd(a, b, c) {
    b = a.g[b];
    if (5 === b.status) {
        const d = b.g;
        c = hd(N(a, b), d, c);
        return -1 === c ? -1 : Fd(a, b.i, c)
    }
    a = b.xa.get(c);
    return void 0 === a ? -1 : a
}
function Gd(a) {
    let b = a.g.length;
    for (const {h: c, g: d} of a.i)
        b += Gd(c),
        b -= d.size;
    return b
}
function Hd(a) {
    let b = 1048576;
    for (const {h: c} of a.i)
        b += Hd(c);
    return b
}
function Id(a) {
    let b = a.o;
    for (const {h: c} of a.i)
        b += Id(c);
    return b
}
function Jd(a) {
    let b = a.l;
    for (const {h: c} of a.i)
        b += Jd(c);
    return a.l
}
function vd(a, b) {
    const c = a.g[wd(a, b)];
    if (5 === c.status)
        return vd(N(a, c), a.g[b].g);
    if (!c)
        return "";
    for (const [d,e] of c.xa)
        if (e === b)
            return d;
    return ""
}
function Kd(a, b, c, d) {
    if (dd(a, c))
        return -1;
    const e = a.g[b]
      , f = a.g[c];
    if (5 === e.status)
        return 5 !== f.status || f.i !== e.i ? -1 : Kd(N(a, e), e.g, f.g, d);
    if (5 === f.status)
        return -1;
    cd(a, b, c, d);
    return 0
}
function xd(a, b, c) {
    if ("." === c || ".." === c)
        return -1;
    var d = hd(a, b, c);
    const e = a.g[d];
    var f = a.g[b];
    if (5 === f.status)
        return b = f.g,
        xd(N(a, f), b, c);
    if (f = dd(a, d)) {
        a: if (d = a.g[d],
        5 === d.status)
            var h = dd(N(a, d), d.g);
        else {
            for (h of d.xa.keys())
                if ("." !== h && ".." !== h) {
                    h = !1;
                    break a
                }
            h = !0
        }
        f = !h
    }
    if (f)
        return -39;
    gd(a, b, c);
    0 === e.qb && (e.status = 4);
    return 0
}
async function td(a, b) {
    const c = a.g[b];
    5 === c.status ? await td(N(a, c), c.g) : (c.size = 0,
    delete a.h[b])
}
Wc.prototype.bc = async function(a) {
    const b = this.g[a];
    return this.h[a] ? this.h[a] : 2 === b.status ? await this.j.read(b.Fe, 0, b.size) : null
}
;
async function Ed(a, b, c, d) {
    const e = a.g[b];
    return a.h[b] ? a.h[b].subarray(c, c + d) : 2 === e.status ? await a.j.read(e.Fe, c, d) : null
}
async function pd(a, b, c) {
    a.h[b] = c;
    2 === a.g[b].status && (a.g[b].status = 0,
    a.j.g(a.g[b].Fe))
}
function yd(a, b) {
    b = a.g[b];
    return 5 === b.status ? yd(N(a, b), b.g) : b
}
async function Bd(a, b, c) {
    var d = yd(a, b)
      , e = await Ed(a, b, 0, d.size);
    if (c !== d.size) {
        var f = new Uint8Array(c);
        d.size = c;
        e && f.set(e.subarray(0, Math.min(e.length, d.size)), 0);
        await pd(a, b, f)
    }
}
function Ld(a, b) {
    b = b.replace("//", "/");
    b = b.split("/");
    0 < b.length && 0 === b[b.length - 1].length && b.pop();
    0 < b.length && 0 === b[0].length && b.shift();
    const c = b.length;
    var d = -1
      , e = 0;
    let f = null;
    for (var h = 0; h < c; h++)
        if (d = e,
        e = hd(a, d, b[h]),
        !f && 5 === a.g[d].status && (f = "/" + b.slice(h).join("/")),
        -1 === e)
            return h < c - 1 ? {
                id: -1,
                Xg: -1,
                name: b[h],
                Mh: f
            } : {
                id: -1,
                Xg: d,
                name: b[h],
                Mh: f
            };
    return {
        id: e,
        Xg: d,
        name: b[h],
        Mh: f
    }
}
function rd(a, b) {
    var c = a.g[b];
    if (5 === c.status)
        rd(N(a, c), c.g);
    else {
        var d = 0;
        for (const e of c.xa.keys())
            d += 24 + Vc.encode(e).length;
        b = a.h[b] = new Uint8Array(d);
        c.size = d;
        d = 0;
        for (const [e,f] of c.xa)
            c = yd(a, f),
            d += G(["Q", "d", "b", "s"], [c.Ra, d + 13 + 8 + 1 + 2 + Vc.encode(e).length, c.mode >> 12, e], b, d)
    }
}
function Md(a, b, c) {
    a = a.h[b];
    if (c >= a.length)
        return a.length;
    for (b = 0; ; ) {
        const d = K(["Q", "d"], a, {
            offset: b
        })[1];
        if (d > c)
            break;
        b = d
    }
    return b
}
function dd(a, b) {
    b = a.g[b];
    return 5 === b.status ? dd(N(a, b), b.g) : 16384 === (b.mode & 61440)
}
function Dd(a, b) {
    dd(a, b);
    b = a.g[b];
    if (5 === b.status)
        return Dd(N(a, b), b.g);
    a = [];
    for (const c of b.xa.keys())
        "." !== c && ".." !== c && a.push(c);
    return a
}
function wd(a, b) {
    dd(a, b);
    b = a.g[b];
    if (5 !== b.status || 0 === b.g)
        return b.xa.get("..");
    const c = wd(N(a, b), b.g);
    return Fd(a, b.i, c)
}
function Ad(a, b, c, d) {
    const e = a.g[b];
    5 === e.status && a.i[e.i].g.delete(e.g);
    e.status = 5;
    e.i = c;
    e.g = d;
    a.i[c].g.set(d, b)
}
function kd(a, b, c) {
    const d = ad(a)
      , e = a.g.length;
    a.g.push(d);
    d.Rc = e;
    Ad(a, e, b, c);
    return e
}
function Fd(a, b, c) {
    const d = a.i[b].g.get(c);
    return void 0 === d ? kd(a, b, c) : d
}
function N(a, b) {
    return a.i[b.i].h
}
function id() {
    this.type = 2;
    this.start = 0;
    this.length = Infinity;
    this.h = -1;
    this.g = ""
}
id.prototype.ia = function() {
    const a = [];
    a[0] = this.type;
    a[1] = this.start;
    a[2] = Infinity === this.length ? 0 : this.length;
    a[3] = this.h;
    a[4] = this.g;
    return a
}
;
id.prototype.J = function(a) {
    this.type = a[0];
    this.start = a[1];
    this.length = 0 === a[2] ? Infinity : a[2];
    this.h = a[3];
    this.g = a[4]
}
;
function Nd(a) {
    const b = new id;
    b.J(a.ia());
    return b
}
function Od(a, b) {
    return b.h === a.h && b.g === a.g && b.type === a.type
}
function Pd(a, b) {
    return Od(a, b) && b.start + b.length === a.start
}
function Qd(a, b, c, d, e) {
    const f = new id;
    f.type = a;
    f.start = b;
    f.length = c;
    f.h = d;
    f.g = e;
    return f
}
function Rd(a, b, c) {
    b = a.g[b];
    if (5 === b.status) {
        var d = b.g;
        return Rd(N(a, b), d, c)
    }
    for (d of b.h)
        if (!(c.h === d.h && c.g === d.g || 2 === c.type || 2 === d.type || 1 !== c.type && 1 !== d.type || c.start + c.length <= d.start || d.start + d.length <= c.start))
            return Nd(d);
    return null
}
function Sd(a, b, c, d) {
    const e = a.g[b];
    if (5 === e.status)
        return b = e.g,
        Sd(N(a, e), b, c, d);
    c = Nd(c);
    if (2 !== c.type && Rd(a, b, c))
        return 1;
    for (a = 0; a < e.h.length; a++) {
        d = e.h[a];
        if (d.start + d.length <= c.start)
            continue;
        if (c.start + c.length <= d.start)
            break;
        if (d.h !== c.h || d.g !== c.g)
            continue;
        b = c.start + c.length;
        const f = c.start - d.start
          , h = d.start + d.length - b;
        if (0 < f && 0 < h && d.type === c.type)
            return 0;
        0 < f && (d.length = f);
        if (0 >= f && 0 < h)
            d.start = b,
            d.length = h;
        else if (0 < h) {
            for (; a < e.h.length && e.h[a].start < b; )
                a++;
            e.h.splice(a, 0, Qd(d.type, b, h, d.h, d.g))
        } else
            0 >= f && (e.h.splice(a, 1),
            a--)
    }
    if (2 !== c.type) {
        a = c;
        d = !1;
        for (b = 0; b < e.h.length && !(Pd(a, e.h[b]) && (e.h[b].length += c.length,
        a = e.h[b],
        d = !0),
        c.start <= e.h[b].start); b++)
            ;
        d || (e.h.splice(b, 0, a),
        b++);
        for (; b < e.h.length; b++)
            if (Od(e.h[b], a)) {
                Pd(e.h[b], a) && (a.length += e.h[b].length,
                e.h.splice(b, 1));
                break
            }
    }
    return 0
}
function Td(a, b) {
    b = Ld(a, b);
    if (-1 !== b.id)
        return a = yd(a, b.id),
        Array.from(a.xa.keys()).filter(c => "." !== c && ".." !== c)
}
Wc.prototype.Kf = function(a) {
    a = Ld(this, a);
    if (-1 === a.id)
        return Promise.resolve(null);
    const b = yd(this, a.id);
    return zd(this, a.id, 0, b.size)
}
;
function Ud(a) {
    this.ag = !1;
    this.B = function() {}
    ;
    var b = cb();
    this.v = b[0];
    this.ne = b[1];
    var c, d;
    const e = new WebAssembly.Table({
        element: "anyfunc",
        initial: 1924
    });
    b = {
        cpu_exception_hook: () => this.B(),
        run_hardware_timers: function(h, g) {
            var k = c;
            const l = k.u.sg.Kc(g, !1)
              , m = k.u.Gd.Kc(g, !1);
            let p = 100
              , r = 100;
            h && (p = k.u.va.Kc(g),
            r = k.u.Pe.Kc(g));
            return Math.min(l, m, p, r)
        },
        cpu_event_halt: () => {
            this.ne.send("cpu-event-halt")
        }
        ,
        abort: function() {},
        microtick: Pb,
        get_rand_int: function() {
            return ha()
        },
        apic_acknowledge_irq: function() {
            var h = c.u.Pe;
            var g = Vd(h.i);
            -1 === g || Vd(h.cb) >= g || (g & 240) <= (h.A & 240) ? h = -1 : (Wd(h.i, g),
            Xd(h.cb, g),
            Yd(h),
            h = g);
            return h
        },
        stop_idling: function() {
            return c.Xi()
        },
        io_port_read8: function(h) {
            var g = c.C.ports[h];
            return g.Be.call(g.rd, h)
        },
        io_port_read16: function(h) {
            var g = c.C.ports[h];
            return g.gb.call(g.rd, h)
        },
        io_port_read32: function(h) {
            return ab(c.C, h)
        },
        io_port_write8: function(h, g) {
            h = c.C.ports[h];
            h.Fg.call(h.rd, g)
        },
        io_port_write16: function(h, g) {
            h = c.C.ports[h];
            h.Tf.call(h.rd, g)
        },
        io_port_write32: function(h, g) {
            h = c.C.ports[h];
            h.Ca.call(h.rd, g)
        },
        mmap_read8: function(h) {
            return c.g[h >>> 17](h)
        },
        mmap_read16: function(h) {
            var g = c.g[h >>> 17];
            return g(h) | g(h + 1 | 0) << 8
        },
        mmap_read32: function(h) {
            return c.ga[h >>> 17](h)
        },
        mmap_write8: function(h, g) {
            c.j[h >>> 17](h, g)
        },
        mmap_write16: function(h, g) {
            var k = c.j[h >>> 17];
            k(h, g & 255);
            k(h + 1 | 0, g >> 8)
        },
        mmap_write32: function(h, g) {
            c.i[h >>> 17](h, g)
        },
        mmap_write64: function(h, g, k) {
            var l = c.i[h >>> 17];
            l(h, g);
            l(h + 4, k)
        },
        mmap_write128: function(h, g, k, l, m) {
            var p = c.i[h >>> 17];
            p(h, g);
            p(h + 4, k);
            p(h + 8, l);
            p(h + 12, m)
        },
        log_from_wasm: function(h, g) {
            [...(new Uint8Array(d.buffer,h >>> 0,g >>> 0))]
        },
        console_log_from_wasm: function(h, g) {
            h = String.fromCharCode(...(new Uint8Array(d.buffer,h >>> 0,g >>> 0)));
            console.error(h)
        },
        dbg_trace_from_wasm: function() {},
        codegen_finalize: (h, g, k, l, m) => {
            Zd(c, h, g, k, l, m)
        }
        ,
        jit_clear_func: h => {
            c.Ma.rh.set(h + 1024, null)
        }
        ,
        jit_clear_all_funcs: () => {
            const h = c.Ma.rh;
            for (let g = 0; 900 > g; g++)
                h.set(1024 + g, null)
        }
        ,
        __indirect_function_table: e
    };
    let f = a.rm;
    f || (f = h => new Promise(g => {
        let k = "v86.wasm"
          , l = "v86-fallback.wasm";
        a.Mi ? (k = a.Mi,
        l = k.replace("v86.wasm", "v86-fallback.wasm")) : "undefined" === typeof window && "string" === typeof __dirname ? (k = __dirname + "/" + k,
        l = __dirname + "/" + l) : (k = "build/" + k,
        l = "build/" + l);
        Aa(k, {
            done: async m => {
                try {
                    const {instance: p} = await WebAssembly.instantiate(m, h);
                    this.A = m;
                    g(p.exports)
                } catch (p) {
                    Aa(l, {
                        done: async r => {
                            const {instance: v} = await WebAssembly.instantiate(r, h);
                            this.A = r;
                            g(v.exports)
                        }
                    })
                }
            }
            ,
            progress: m => {
                this.ne.send("download-progress", {
                    xf: 0,
                    wf: 1,
                    yf: k,
                    lengthComputable: m.lengthComputable,
                    total: m.total,
                    loaded: m.loaded
                })
            }
        })
    }
    ));
    f({
        env: b
    }).then(h => {
        d = h.memory;
        h.rust_init();
        h = this.Aa = new $d(this.ne,{
            exports: h,
            rh: e
        });
        c = h.s;
        ae(this, h, a)
    }
    );
    this.h = null;
    this.D = 0
}
async function ae(a, b, c) {
    function d(r, v) {
        switch (r) {
        case "hda":
            f.L = this.ob.L = v;
            break;
        case "hdb":
            f.pb = this.ob.pb = v;
            break;
        case "cdrom":
            f.O = this.ob.O = v;
            break;
        case "fda":
            f.V = this.ob.V = v;
            break;
        case "fdb":
            f.We = this.ob.We = v;
            break;
        case "multiboot":
            f.Ob = this.ob.Ob = v.buffer;
            break;
        case "bzimage":
            f.ub = this.ob.ub = v.buffer;
            break;
        case "initrd":
            f.Kb = this.ob.Kb = v.buffer;
            break;
        case "bios":
            f.nb = v.buffer;
            break;
        case "vga_bios":
            f.Nd = v.buffer;
            break;
        case "initial_state":
            f.Ac = v.buffer;
            break;
        case "fs9p_json":
            f.Nh = v
        }
    }
    async function e() {
        if (f.wc && f.Nh && !f.Ac) {
            var r = f.wc
              , v = f.Nh;
            if (3 !== v.version)
                throw "The filesystem JSON format has changed. Please update your fs2json (https://github.com/copy/fs2json) and recreate the filesystem JSON.";
            var B = v.fsroot;
            r.o = v.size;
            for (v = 0; v < B.length; v++)
                $c(r, B[v], 0);
            if (c.lf) {
                const {fj: C, Oj: y} = be(f.wc)
                  , [q,w] = await Promise.all([f.wc.Kf(y), f.wc.Kf(C)]);
                d.call(this, "initrd", new Ca(q.buffer));
                d.call(this, "bzimage", new Ca(w.buffer))
            }
        }
        this.fc && this.fc.show && this.fc.show();
        this.Aa.Jb(f);
        f.Ac && (b.ug(f.Ac),
        f.Ac = void 0);
        c.bj && this.Aa.Lf();
        this.ne.send("emulator-loaded")
    }
    a.v.register("emulator-stopped", function() {
        this.ag = !1;
        this.ec.pause()
    }, a);
    a.v.register("emulator-started", function() {
        this.ag = !0;
        this.ec.continue()
    }, a);
    var f = {};
    a.ob = {
        V: void 0,
        We: void 0,
        L: void 0,
        pb: void 0,
        O: void 0
    };
    var h = c.Db ? c.Db : c.V ? 801 : c.L ? 786 : 291;
    f.va = c.va;
    f.qf = c.qf;
    f.Qj = !0;
    f.G = c.G || 67108864;
    f.ma = c.ma || 8388608;
    f.Db = h;
    f.Jh = c.Jh || !1;
    f.V = void 0;
    f.We = void 0;
    f.cf = c.cf;
    f.df = c.df;
    f.ef = c.ef;
    f.Eb = c.Eb;
    f.ze = c.ze;
    f.Nb = c.Nb;
    f.qd = c.qd;
    f.ff = c.ff;
    f.Od = c.Od;
    f.Ie = c.Ie;
    f.Di = c.Di;
    if (h = c.jm || c.dd && c.dd.Gc)
        "fetch" === h ? a.i = new zc(a.v,c.dd) : "inbrowser" === h ? a.i = new Pc(a.v,c.dd) : h.startsWith("wisp://") || h.startsWith("wisps://") ? a.i = new Ec(h,a.v,c.dd) : a.i = new bc(h,a.v);
    f.dd = c.dd || {
        type: "ne2k"
    };
    h = c.screen || {};
    c.rl && (h.Zf = c.rl);
    c.Pl || (a.o = new Jc(a.v));
    c.Ql || (a.j = new Kc(a.v,h.Zf));
    h.Zf ? a.ec = new Lc(h, () => a.Aa.s.u.Md && a.Aa.s.u.Md.fh()) : a.ec = new Mc;
    f.screen = a.ec;
    f.Di = h;
    c.sl && (a.fc = new Nc(c.sl,a.v));
    c.tl && (a.fc = new Oc(c.tl,a.v));
    c.tj || (a.g = new Vb(a.v));
    var g = [];
    h = (r, v) => {
        if (v)
            if (v.get && v.set && v.load)
                g.push({
                    name: r,
                    Df: v
                });
            else {
                if ("bios" === r || "vga_bios" === r || "initial_state" === r || "multiboot" === r || "bzimage" === r || "initrd" === r)
                    v.async = !1;
                if ("fda" === r || "fdb" === r)
                    v.async = !1;
                v.url && !v.async ? g.push({
                    name: r,
                    url: v.url,
                    size: v.size
                }) : g.push({
                    name: r,
                    Df: Na(v, a.th.bind(a))
                })
            }
    }
    ;
    c.state && console.warn("Warning: Unknown option 'state'. Did you mean 'initial_state'?");
    h("bios", c.nb);
    h("vga_bios", c.Nd);
    h("cdrom", c.O);
    h("hda", c.L);
    h("hdb", c.pb);
    h("fda", c.V);
    h("fdb", c.We);
    h("initial_state", c.Ac);
    h("multiboot", c.Ob);
    h("bzimage", c.ub);
    h("initrd", c.Kb);
    if (c.filesystem) {
        h = c.filesystem.cj;
        var k = c.filesystem.Wf;
        let r = new Qc;
        k && (r = new Rc(r,k));
        f.wc = a.wc = new Wc(r);
        if (h) {
            if ("object" === typeof h) {
                var l = h.size;
                h = h.url
            }
            g.push({
                name: "fs9p_json",
                url: h,
                size: l,
                Qe: !0
            })
        }
    }
    var m = g.length
      , p = function(r) {
        if (r === m)
            setTimeout(e.bind(this), 0);
        else {
            var v = g[r];
            v.Df ? (v.Df.onload = function() {
                d.call(this, v.name, v.Df);
                p(r + 1)
            }
            .bind(this),
            v.Df.load()) : Aa(v.url, {
                done: function(B) {
                    if (v.url.endsWith(".zst") && "initial_state" !== v.name) {
                        var C = v.size
                          , y = new Uint8Array(B);
                        B = this.Aa.s;
                        this.l = B.Oi(y.length);
                        (new Uint8Array(B.La.buffer)).set(y, B.Qi(this.l));
                        y = B.gf(this.l, C);
                        const q = B.La.buffer.slice(y, y + C);
                        B.hf(y, C);
                        B.Pi(this.l);
                        this.l = null;
                        B = q
                    }
                    d.call(this, v.name, v.Qe ? B : new Ca(B));
                    p(r + 1)
                }
                .bind(this),
                progress: function(B) {
                    200 === B.target.status ? a.ne.send("download-progress", {
                        xf: r,
                        wf: m,
                        yf: v.url,
                        lengthComputable: B.lengthComputable,
                        total: B.total || v.size,
                        loaded: B.loaded
                    }) : a.ne.send("download-error", {
                        xf: r,
                        wf: m,
                        yf: v.url,
                        request: B.target
                    })
                },
                Qe: v.Qe
            })
        }
    }
    .bind(a);
    p(0)
}
n = Ud.prototype;
n.th = async function(a, b) {
    if (!this.h) {
        const c = URL.createObjectURL(new Blob(["(" + function() {
            let d;
            globalThis.onmessage = function(e) {
                if (d) {
                    var f = e.data.src
                      , h = e.data.sj;
                    e = e.data.id;
                    var g = d.exports
                      , k = g.zstd_create_ctx(f.length);
                    (new Uint8Array(g.memory.buffer)).set(f, g.zstd_get_src_ptr(k));
                    f = g.zstd_read(k, h);
                    var l = g.memory.buffer.slice(f, f + h);
                    g.zstd_read_free(f, h);
                    g.zstd_free_ctx(k);
                    postMessage({
                        result: l,
                        id: e
                    }, [l])
                } else
                    h = Object.fromEntries("cpu_exception_hook run_hardware_timers cpu_event_halt microtick get_rand_int apic_acknowledge_irq stop_idling io_port_read8 io_port_read16 io_port_read32 io_port_write8 io_port_write16 io_port_write32 mmap_read8 mmap_read16 mmap_read32 mmap_write8 mmap_write16 mmap_write32 mmap_write64 mmap_write128 codegen_finalize jit_clear_func jit_clear_all_funcs".split(" ").map(m => [m, () => console.error("zstd worker unexpectedly called " + m)])),
                    h.__indirect_function_table = new WebAssembly.Table({
                        element: "anyfunc",
                        initial: 1024
                    }),
                    h.abort = () => {
                        throw Error("zstd worker aborted");
                    }
                    ,
                    h.log_from_wasm = h.console_log_from_wasm = (m, p) => {
                        console.log(String.fromCharCode(...(new Uint8Array(d.exports.memory.buffer,m,p))))
                    }
                    ,
                    h.dbg_trace_from_wasm = () => console.trace(),
                    d = new WebAssembly.Instance(new WebAssembly.Module(e.data),{
                        env: h
                    })
            }
        }
        .toString() + ")()"],{
            type: "text/javascript"
        }));
        this.h = new Worker(c);
        URL.revokeObjectURL(c);
        this.h.postMessage(this.A, [this.A])
    }
    return new Promise(c => {
        const d = this.D++
          , e = async f => {
            f.data.id === d && (this.h.removeEventListener("message", e),
            c(f.data.result))
        }
        ;
        this.h.addEventListener("message", e);
        this.h.postMessage({
            src: b,
            sj: a,
            id: d
        }, [b.buffer])
    }
    )
}
;
function be(a) {
    const b = (Td(a, "/") || []).map(e => "/" + e);
    a = (Td(a, "/boot/") || []).map(e => "/boot/" + e);
    let c, d;
    for (const e of [].concat(b, a)) {
        const f = /old/i.test(e) || /fallback/i.test(e)
          , h = /initrd/i.test(e) || /initramfs/i.test(e);
        !/vmlinuz/i.test(e) && !/bzimage/i.test(e) || d && f || (d = e);
        !h || c && f || (c = e)
    }
    c && d || (console.log("Failed to find bzimage or initrd in filesystem. Files:"),
    console.log(b.join(" ")),
    console.log(a.join(" ")));
    return {
        Oj: c,
        fj: d
    }
}
n.Lf = async function() {
    this.Aa.Lf()
}
;
n.stop = async function() {
    this.ag && await new Promise(a => {
        const b = () => {
            this.v.unregister("emulator-stopped", b);
            a()
        }
        ;
        ce(this, "emulator-stopped", b);
        this.Aa.stop()
    }
    )
}
;
n.wa = async function() {
    await this.stop();
    this.Aa.wa();
    this.o && this.o.wa();
    this.i && this.i.wa();
    this.j && this.j.wa();
    this.ec && this.ec.wa();
    this.fc && this.fc.wa();
    this.g && this.g.wa()
}
;
n.bh = function() {
    this.Aa.bh()
}
;
function ce(a, b, c) {
    a.v.register(b, c, a)
}
n.ug = async function(a) {
    this.Aa.ug(a)
}
;
n.dh = async function() {
    return this.Aa.dh()
}
;
n.vd = function() {
    return this.ag
}
;
n.Mf = async function(a) {
    if (a.url && !a.async)
        Aa(a.url, {
            done: b => {
                this.Aa.s.u.oe.Mf(new Ca(b))
            }
        });
    else {
        const b = Na(a, this.th.bind(this));
        b.onload = () => {
            this.Aa.s.u.oe.Mf(b)
        }
        ;
        await b.load()
    }
}
;
n.eg = function() {
    this.Aa.s.u.oe.eg()
}
;
n.wg = async function(a) {
    if (a.url && !a.async)
        Aa(a.url, {
            done: b => {
                this.Aa.s.u.O.wg(new Ca(b))
            }
        });
    else {
        const b = Na(a, this.th.bind(this));
        b.onload = () => {
            this.Aa.s.u.O.wg(b)
        }
        ;
        await b.load()
    }
}
;
function de(a, b) {
    for (var c = 0; c < b.length; c++)
        a.v.send("keyboard-code", b[c])
}
function ee(a, b) {
    for (var c = 0; c < b.length; c++)
        a.o.wl(b[c])
}
function fe() {
    var a = document.body
      , b = a.requestPointerLock || a.mozRequestPointerLock || a.webkitRequestPointerLock;
    b && b.call(a)
}
n.mj = async function(a, b) {
    var c = this.wc;
    if (c) {
        var d = a.split("/");
        d = d[d.length - 1];
        a = Ld(c, a).Xg;
        if ("" !== d && -1 !== a)
            await od(c, d, a, b);
        else
            return Promise.reject(new ge)
    }
}
;
n.Kf = async function(a) {
    var b = this.wc;
    if (b)
        return (a = await b.Kf(a)) ? a : Promise.reject(new ge)
}
;
function ge() {
    this.message = "File not found"
}
ge.prototype = Error.prototype;
"undefined" !== typeof module && "undefined" !== typeof module.exports ? module.exports.V86 = Ud : "undefined" !== typeof window ? window.V86 = Ud : "function" === typeof importScripts && (self.V86 = Ud);
function $d(a, b) {
    this.i = this.h = !1;
    this.l = !0;
    this.j = 0;
    this.g = null;
    this.s = new he(a,b, () => {
        this.l && ie(this, 0)
    }
    );
    this.v = a;
    this.o()
}
n = $d.prototype;
n.Lf = function() {
    this.i = !1;
    this.h || (this.h = !0,
    this.v.send("emulator-started"));
    ie(this, 0)
}
;
function je(a) {
    if (a.i || !a.h)
        a.i = a.h = !1,
        a.v.send("emulator-stopped");
    else {
        a.l = !1;
        var b = a.s.Yd();
        ie(a, b)
    }
}
function ie(a, b) {
    const c = ++a.j;
    a.l = !0;
    a.B(b, c)
}
n.stop = function() {
    this.h && (this.i = !0)
}
;
n.wa = function() {
    this.A()
}
;
n.bh = function() {
    this.s.ua();
    ke(this.s)
}
;
n.Jb = function(a) {
    this.s.Jb(a, this.v);
    this.v.send("emulator-ready")
}
;
if ("undefined" !== typeof process)
    $d.prototype.B = function(a, b) {
        1 > a ? global.setImmediate(c => {
            c === this.j && je(this)
        }
        , b) : setTimeout(c => {
            c === this.j && je(this)
        }
        , a, b)
    }
    ,
    $d.prototype.o = function() {}
    ,
    $d.prototype.A = function() {}
    ;
else if ("undefined" !== typeof Worker) {
    function a() {
        let b;
        globalThis.onmessage = function(c) {
            const d = c.data.t;
            b = b && clearTimeout(b);
            1 > d ? postMessage(c.data.Li) : b = setTimeout( () => postMessage(c.data.Li), d)
        }
    }
    $d.prototype.o = function() {
        const b = URL.createObjectURL(new Blob(["(" + a.toString() + ")()"],{
            type: "text/javascript"
        }));
        this.g = new Worker(b);
        this.g.onmessage = c => {
            c.data === this.j && je(this)
        }
        ;
        URL.revokeObjectURL(b)
    }
    ;
    $d.prototype.B = function(b, c) {
        this.g.postMessage({
            t: b,
            Li: c
        })
    }
    ;
    $d.prototype.A = function() {
        this.g && this.g.terminate();
        this.g = null
    }
} else
    $d.prototype.B = function(a) {
        setTimeout( () => {
            je(this)
        }
        , a)
    }
    ,
    $d.prototype.o = function() {}
    ,
    $d.prototype.A = function() {}
    ;
$d.prototype.dh = function() {
    for (var a = [], b = Ib(this.s, a), c = [], d = 0, e = 0; e < a.length; e++) {
        var f = a[e].byteLength;
        c[e] = {
            offset: d,
            length: f
        };
        d += f;
        d = d + 3 & -4
    }
    e = JSON.stringify({
        buffer_infos: c,
        state: b
    });
    e = (new TextEncoder).encode(e);
    b = 16 + e.length;
    b = b + 3 & -4;
    f = b + d;
    d = new ArrayBuffer(f);
    var h = new Int32Array(d,0,4);
    (new Uint8Array(d,16,e.length)).set(e);
    b = new Uint8Array(d,b);
    h[0] = -2039052682;
    h[1] = 6;
    h[2] = f;
    h[3] = e.length;
    for (e = 0; e < a.length; e++)
        b.set(a[e], c[e].offset);
    return d
}
;
$d.prototype.ug = function(a) {
    return Kb(this.s, a)
}
;
if ("object" === typeof performance && performance.now)
    var Pb = performance.now.bind(performance);
else if ("function" === typeof require) {
    const {performance: a} = require("perf_hooks");
    Pb = a.now.bind(a)
} else
    "object" === typeof process && process.hrtime ? Pb = function() {
        var a = process.hrtime();
        return 1E3 * a[0] + a[1] / 1E6
    }
    : Pb = Date.now;
function le(a) {
    this.s = a;
    this.na = this.B = 0;
    this.ua = 1;
    this.g = this.l = 0;
    this.j = Pb();
    this.T = this.X = this.U = this.Z = this.aa = this.h = 65536;
    this.K = this.F = this.A = 0;
    this.i = new Int32Array(8);
    this.cb = new Int32Array(8);
    this.o = new Int32Array(8);
    this.ga = 254;
    this.D = -1;
    this.ba = this.error = this.N = 0;
    $a(a.C, 4276092928, 1048576, b => {
        var c = b & 3;
        return this.Jf(b & -4) >> 8 * c & 255
    }
    , () => {}
    , b => this.Jf(b), (b, c) => this.Ca(b, c))
}
n = le.prototype;
n.Jf = function(a) {
    a = a - 4276092928 | 0;
    switch (a) {
    case 32:
        return this.B;
    case 48:
        return 327700;
    case 128:
        return this.A;
    case 208:
        return this.N;
    case 224:
        return this.D;
    case 240:
        return this.ga;
    case 256:
    case 272:
    case 288:
    case 304:
    case 320:
    case 336:
    case 352:
    case 368:
        return this.cb[a - 256 >> 4];
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
        return this.ba;
    case 768:
        return this.F;
    case 784:
        return this.K;
    case 800:
        return this.h;
    case 816:
        return this.aa;
    case 832:
        return this.Z;
    case 848:
        return this.U;
    case 864:
        return this.X;
    case 880:
        return this.T;
    case 992:
        return this.na;
    case 896:
        return this.l;
    case 912:
        return this.g;
    default:
        return 0
    }
}
;
n.Ca = function(a, b) {
    switch (a - 4276092928 | 0) {
    case 32:
        this.B = b;
        break;
    case 128:
        this.A = b & 255;
        Yd(this);
        break;
    case 176:
        b = Vd(this.cb);
        if (-1 !== b) {
            Wd(this.cb, b);
            if (this.o[b >> 5] >> (b & 31) & 1) {
                a = this.s.u.ud;
                for (var c = 0; 24 > c; c++) {
                    var d = a.g[c];
                    (d & 255) === b && d & 16384 && (a.g[c] &= -16385,
                    me(a, c))
                }
            }
            Yd(this)
        }
        break;
    case 208:
        this.N = b & 4278190080;
        break;
    case 224:
        this.D = b | 16777215;
        break;
    case 240:
        this.ga = b;
        break;
    case 640:
        this.ba = this.error;
        this.error = 0;
        break;
    case 768:
        a = b & 255;
        c = b >> 8 & 7;
        d = b >> 15 & 1;
        var e = b >> 18 & 3;
        this.F = b & -4097;
        0 === e ? ne(this, a, c, d) : 1 === e ? ne(this, a, 0, d) : 2 === e && ne(this, a, c, d);
        break;
    case 784:
        this.K = b;
        break;
    case 800:
        this.h = b;
        break;
    case 816:
        this.aa = b;
        break;
    case 832:
        this.Z = b;
        break;
    case 848:
        this.U = b;
        break;
    case 864:
        this.X = b;
        break;
    case 880:
        this.T = b;
        break;
    case 992:
        this.na = b;
        b = b & 3 | (b & 8) >> 1;
        this.ua = 7 === b ? 0 : b + 1;
        break;
    case 896:
        this.l = b >>> 0,
        this.g = b >>> 0,
        this.j = Pb()
    }
}
;
n.Kc = function(a) {
    if (0 === this.g)
        return 100;
    const b = 1E6 / (1 << this.ua);
    a = (a - this.j) * b >>> 0;
    this.j += a / b;
    this.g -= a;
    0 >= this.g && (a = this.h & 393216,
    131072 === a ? (this.g %= this.l,
    0 >= this.g && (this.g += this.l),
    0 === (this.h & 65536) && ne(this, this.h & 255, 0, !1)) : 0 === a && (this.g = 0,
    0 === (this.h & 65536) && ne(this, this.h & 255, 0, !1)));
    return Math.max(0, this.g / b)
}
;
function ne(a, b, c, d) {
    5 === c || 4 === c || a.i[b >> 5] >> (b & 31) & 1 || (Xd(a.i, b),
    d ? Xd(a.o, b) : Wd(a.o, b),
    Yd(a))
}
function Yd(a) {
    var b = Vd(a.i);
    -1 !== b && (Vd(a.cb) >= b || (b & 240) <= (a.A & 240) || a.s.Td())
}
n.ia = function() {
    var a = [];
    a[0] = this.B;
    a[1] = this.na;
    a[2] = this.ua;
    a[3] = this.l;
    a[4] = this.g;
    a[5] = this.j;
    a[6] = this.h;
    a[7] = this.Z;
    a[8] = this.U;
    a[9] = this.X;
    a[10] = this.T;
    a[11] = this.A;
    a[12] = this.F;
    a[13] = this.K;
    a[14] = this.i;
    a[15] = this.cb;
    a[16] = this.o;
    a[17] = this.ga;
    a[18] = this.D;
    a[19] = this.N;
    a[20] = this.error;
    a[21] = this.ba;
    a[22] = this.aa;
    return a
}
;
n.J = function(a) {
    this.B = a[0];
    this.na = a[1];
    this.ua = a[2];
    this.l = a[3];
    this.g = a[4];
    this.j = a[5];
    this.h = a[6];
    this.Z = a[7];
    this.U = a[8];
    this.X = a[9];
    this.T = a[10];
    this.A = a[11];
    this.F = a[12];
    this.K = a[13];
    this.i = a[14];
    this.cb = a[15];
    this.o = a[16];
    this.ga = a[17];
    this.D = a[18];
    this.N = a[19];
    this.error = a[20];
    this.ba = a[21];
    this.aa = a[22] || 65536
}
;
function Xd(a, b) {
    a[b >> 5] |= 1 << (b & 31)
}
function Wd(a, b) {
    a[b >> 5] &= ~(1 << (b & 31))
}
function Vd(a) {
    for (var b = 7; 0 <= b; b--) {
        var c = a[b];
        if (c)
            return ja(c >>> 0) | b << 5
    }
    return -1
}
;function oe(a) {
    this.s = a;
    this.g = new Int32Array(24);
    this.o = new Int32Array(24);
    for (var b = 0; b < this.g.length; b++)
        this.g[b] = 65536;
    this.i = this.h = this.l = this.j = 0;
    $a(a.C, 4273995776, 131072, c => {
        c = c - 4273995776 | 0;
        return 16 <= c && 20 > c ? (c -= 16,
        this.read(this.j) >> 8 * c & 255) : 0
    }
    , () => {}
    , c => {
        c = c - 4273995776 | 0;
        return 0 === c ? this.j : 16 === c ? this.read(this.j) : 0
    }
    , (c, d) => {
        c = c - 4273995776 | 0;
        0 === c ? this.j = d : 16 === c && this.write(this.j, d)
    }
    )
}
function me(a, b) {
    var c = 1 << b;
    if (0 !== (a.h & c)) {
        var d = a.g[b];
        if (0 === (d & 65536)) {
            var e = d >> 8 & 7;
            if (0 === (d & 32768))
                a.h &= ~c;
            else if (a.g[b] |= 16384,
            d & 16384)
                return;
            0 !== e && 1 !== e || ne(a.s.u.Pe, d & 255, e, 32768 === (d & 32768));
            a.g[b] &= -4097
        }
    }
}
oe.prototype.read = function(a) {
    if (0 === a)
        return this.l << 24;
    if (1 === a)
        return 1507345;
    if (2 === a)
        return this.l << 24;
    if (16 <= a && 64 > a) {
        var b = a - 16 >> 1;
        return a & 1 ? this.o[b] : this.g[b]
    }
    return 0
}
;
oe.prototype.write = function(a, b) {
    if (0 === a)
        this.l = b >>> 24 & 15;
    else if (1 !== a && 2 !== a && 16 <= a && 64 > a) {
        var c = a - 16 >> 1;
        a & 1 ? this.o[c] = b & 4278190080 : (this.g[c] = b & 110591 | this.g[c] & -110592,
        me(this, c))
    }
}
;
oe.prototype.ia = function() {
    var a = [];
    a[0] = this.g;
    a[1] = this.o;
    a[2] = this.j;
    a[3] = this.l;
    a[4] = this.h;
    a[5] = this.i;
    return a
}
;
oe.prototype.J = function(a) {
    this.g = a[0];
    this.o = a[1];
    this.j = a[2];
    this.l = a[3];
    this.h = a[4];
    this.i = a[5]
}
;
function pe(a) {
    this.s = a;
    var b = a.C;
    qe(a.u.eb, {
        fb: 56,
        R: [134, 128, 19, 113, 7, 0, 128, 2, 8, 0, 128, 6, 0, 0, 128, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 1, 0, 0],
        Pb: [],
        name: "acpi"
    });
    this.g = this.h = 0;
    this.status = 1;
    this.Gf = this.we = 0;
    this.i = re(this, Pb());
    this.yc = new Uint8Array(4);
    x(b, 45056, this, void 0, function() {
        return this.we
    });
    u(b, 45056, this, void 0, function(c) {
        this.we &= ~c
    });
    x(b, 45058, this, void 0, function() {
        return this.Gf
    });
    u(b, 45058, this, void 0, function(c) {
        this.Gf = c
    });
    x(b, 45060, this, void 0, function() {
        return this.status
    });
    u(b, 45060, this, void 0, function(c) {
        this.status = c
    });
    x(b, 45064, this, void 0, void 0, function() {
        return re(this, Pb()) & 16777215
    });
    x(b, 45024, this, function() {
        return this.yc[0]
    });
    x(b, 45025, this, function() {
        return this.yc[1]
    });
    x(b, 45026, this, function() {
        return this.yc[2]
    });
    x(b, 45027, this, function() {
        return this.yc[3]
    });
    u(b, 45024, this, function(c) {
        this.yc[0] = c
    });
    u(b, 45025, this, function(c) {
        this.yc[1] = c
    });
    u(b, 45026, this, function(c) {
        this.yc[2] = c
    });
    u(b, 45027, this, function(c) {
        this.yc[3] = c
    })
}
pe.prototype.Kc = function(a) {
    a = re(this, a);
    var b = 0 !== ((a ^ this.i) & 8388608);
    this.Gf & 1 && b ? (this.we |= 1,
    this.s.Wa(9)) : Fb(this.s, 9);
    this.i = a;
    return 100
}
;
function re(a, b) {
    b = Math.round(3579.545 * b);
    b === a.h ? 3579.545 > a.g && a.g++ : a.h + a.g <= b && (a.g = 0,
    a.h = b);
    return a.h + a.g
}
pe.prototype.ia = function() {
    var a = [];
    a[0] = this.status;
    a[1] = this.we;
    a[2] = this.Gf;
    a[3] = this.yc;
    return a
}
;
pe.prototype.J = function(a) {
    this.status = a[0];
    this.we = a[1];
    this.Gf = a[2];
    this.yc = a[3]
}
;
function se(a, b, c) {
    this.v = c;
    this.s = a;
    this.h = 4;
    this.wd = this.od = 0;
    this.qe = 96;
    this.Vc = this.vf = 0;
    this.Wc = 1;
    this.qa = this.vg = this.Ya = this.og = 0;
    this.input = [];
    switch (b) {
    case 1016:
        this.g = 0;
        this.qa = 4;
        break;
    case 760:
        this.g = 1;
        this.qa = 3;
        break;
    case 1E3:
        this.g = 2;
        this.qa = 4;
        break;
    case 744:
        this.qa = this.g = 3;
        break;
    default:
        this.g = 0,
        this.qa = 4
    }
    this.v.register("serial" + this.g + "-input", function(d) {
        this.input.push(d);
        this.qe |= 1;
        this.vf & 1 ? te(this, 12) : te(this, 4)
    }, this);
    this.v.register("serial" + this.g + "-modem-status-input", function(d) {
        ue(this, d)
    }, this);
    this.v.register("serial" + this.g + "-carrier-detect-input", function(d) {
        ue(this, d ? this.Ya | 136 : this.Ya & -137)
    }, this);
    this.v.register("serial" + this.g + "-ring-indicator-input", function(d) {
        ue(this, d ? this.Ya | 68 : this.Ya & -69)
    }, this);
    this.v.register("serial" + this.g + "-data-set-ready-input", function(d) {
        ue(this, d ? this.Ya | 34 : this.Ya & -35)
    }, this);
    this.v.register("serial" + this.g + "-clear-to-send-input", function(d) {
        ue(this, d ? this.Ya | 17 : this.Ya & -18)
    }, this);
    a = a.C;
    u(a, b, this, function(d) {
        ve(this, d)
    }, function(d) {
        ve(this, d & 255);
        ve(this, d >> 8)
    });
    u(a, b | 1, this, function(d) {
        this.wd & 128 ? this.od = this.od & 255 | d << 8 : (0 === (this.Vc & 2) && d & 2 && te(this, 2),
        this.Vc = d & 15,
        we(this))
    });
    x(a, b, this, function() {
        if (this.wd & 128)
            return this.od & 255;
        let d = 0;
        0 !== this.input.length && (d = this.input.shift());
        0 === this.input.length && (this.qe &= -2,
        xe(this, 12),
        xe(this, 4));
        return d
    });
    x(a, b | 1, this, function() {
        return this.wd & 128 ? this.od >> 8 : this.Vc & 15
    });
    x(a, b | 2, this, function() {
        var d = this.Wc & 15;
        2 === this.Wc && xe(this, 2);
        this.vf & 1 && (d |= 192);
        return d
    });
    u(a, b | 2, this, function(d) {
        this.vf = d
    });
    x(a, b | 3, this, function() {
        return this.wd
    });
    u(a, b | 3, this, function(d) {
        this.wd = d
    });
    x(a, b | 4, this, function() {
        return this.og
    });
    u(a, b | 4, this, function(d) {
        this.og = d
    });
    x(a, b | 5, this, function() {
        return this.qe
    });
    u(a, b | 5, this, function() {});
    x(a, b | 6, this, function() {
        return this.Ya &= 240
    });
    u(a, b | 6, this, function(d) {
        ue(this, d)
    });
    x(a, b | 7, this, function() {
        return this.vg
    });
    u(a, b | 7, this, function(d) {
        this.vg = d
    })
}
se.prototype.ia = function() {
    var a = [];
    a[0] = this.h;
    a[1] = this.od;
    a[2] = this.wd;
    a[3] = this.qe;
    a[4] = this.vf;
    a[5] = this.Vc;
    a[6] = this.Wc;
    a[7] = this.og;
    a[8] = this.Ya;
    a[9] = this.vg;
    a[10] = this.qa;
    return a
}
;
se.prototype.J = function(a) {
    this.h = a[0];
    this.od = a[1];
    this.wd = a[2];
    this.qe = a[3];
    this.vf = a[4];
    this.Vc = a[5];
    this.Wc = a[6];
    this.og = a[7];
    this.Ya = a[8];
    this.vg = a[9];
    this.qa = a[10]
}
;
function we(a) {
    a.h & 4096 && a.Vc & 1 ? (a.Wc = 12,
    a.s.Wa(a.qa)) : a.h & 16 && a.Vc & 1 ? (a.Wc = 4,
    a.s.Wa(a.qa)) : a.h & 4 && a.Vc & 2 ? (a.Wc = 2,
    a.s.Wa(a.qa)) : a.h & 1 && a.Vc & 8 ? (a.Wc = 0,
    a.s.Wa(a.qa)) : (a.Wc = 1,
    Fb(a.s, a.qa))
}
function te(a, b) {
    a.h |= 1 << b;
    we(a)
}
function xe(a, b) {
    a.h &= ~(1 << b);
    we(a)
}
function ve(a, b) {
    a.wd & 128 ? a.od = a.od & -256 | b : (te(a, 2),
    a.v.send("serial" + a.g + "-output-byte", b))
}
function ue(a, b) {
    let c = (a.Ya ^ b) >> 4;
    c |= a.Ya & 15;
    a.Ya = b;
    a.Ya |= c
}
;function ye(a) {
    this.cc = new Uint8Array(4);
    this.g = new Uint8Array(4);
    this.ue = new Uint8Array(4);
    this.ve = new Uint8Array(4);
    this.te = new Int32Array(this.cc.buffer);
    new Int32Array(this.g.buffer);
    this.ci = new Int32Array(this.ue.buffer);
    this.ei = new Int32Array(this.ve.buffer);
    this.oc = [];
    this.u = [];
    this.s = a;
    for (var b = 0; 256 > b; b++)
        this.oc[b] = void 0,
        this.u[b] = void 0;
    this.C = a.C;
    u(a.C, 3324, this, function(c) {
        ze(this, this.te[0], c)
    }, function(c) {
        Ae(this, this.te[0], c)
    }, function(c) {
        var d = this.te[0]
          , e = d >> 8 & 65535
          , f = d & 255;
        d = this.oc[e];
        e = this.u[e];
        if (d)
            if (16 <= f && 40 > f)
                if (e = e.Pb[f - 16 >> 2]) {
                    f >>= 2;
                    var h = d[f] & 1;
                    -1 === (c | 3 | e.size - 1) ? (c = ~(e.size - 1) | h,
                    0 === h && (d[f] = c)) : 0 === h && (d[f] = e.bi);
                    1 === h && (Be(this, e, d[f] & 65534, c & 65534),
                    d[f] = c | 1)
                } else
                    d[f >> 2] = 0;
            else
                48 === f ? d[f >> 2] = e.di ? -1 === (c | 2047) ? -e.di | 0 : e.Vj | 0 : 0 : 4 !== f && (d[f >>> 2] = c)
    });
    u(a.C, 3325, this, function(c) {
        ze(this, this.te[0] + 1 | 0, c)
    });
    u(a.C, 3326, this, function(c) {
        ze(this, this.te[0] + 2 | 0, c)
    }, function(c) {
        Ae(this, this.te[0] + 2 | 0, c)
    });
    u(a.C, 3327, this, function(c) {
        ze(this, this.te[0] + 3 | 0, c)
    });
    a.C.Ce(3324, this, function() {
        return this.ue[0]
    }, function() {
        return this.ue[1]
    }, function() {
        return this.ue[2]
    }, function() {
        return this.ue[3]
    });
    a.C.Ce(3320, this, function() {
        return this.ve[0]
    }, function() {
        return this.ve[1]
    }, function() {
        return this.ve[2]
    }, function() {
        return this.ve[3]
    });
    a.C.kd(3320, this, function(c) {
        this.cc[0] = c & 252
    }, function(c) {
        2 === (this.cc[1] & 6) && 6 === (c & 6) ? Ce(a) : this.cc[1] = c
    }, function(c) {
        this.cc[2] = c
    }, function(c) {
        this.cc[3] = c;
        c = this.cc[0] & 252;
        var d = this.oc[this.cc[2] << 8 | this.cc[1]];
        void 0 !== d ? (this.ei[0] = -2147483648,
        this.ci[0] = c < d.byteLength ? d[c >> 2] : 0) : (this.ci[0] = -1,
        this.ei[0] = 0)
    });
    qe(this, {
        fb: 0,
        R: [134, 128, 55, 18, 0, 0, 0, 0, 2, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16, 0, 0, 0, 0, 0, 0],
        Pb: [],
        name: "82441FX PMC"
    });
    this.i = {
        fb: 8,
        R: [134, 128, 0, 112, 7, 0, 0, 2, 0, 0, 1, 6, 0, 0, 128, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        Pb: [],
        name: "82371SB PIIX3 ISA"
    };
    this.j = qe(this, this.i);
    this.h = new Uint8Array(this.j.buffer)
}
ye.prototype.ia = function() {
    for (var a = [], b = 0; 256 > b; b++)
        a[b] = this.oc[b];
    a[256] = this.cc;
    a[257] = this.g;
    a[258] = this.ue;
    a[259] = this.ve;
    return a
}
;
ye.prototype.J = function(a) {
    for (var b = 0; 256 > b; b++) {
        var c = this.u[b]
          , d = a[b];
        if (c && d) {
            for (var e = 0; e < c.Pb.length; e++) {
                var f = d[4 + e];
                if (f & 1) {
                    var h = c.Pb[e];
                    Be(this, h, h.bi & 65534, f & 65534)
                }
            }
            this.oc[b].set(d)
        }
    }
    this.cc.set(a[256]);
    this.g.set(a[257]);
    this.ue.set(a[258]);
    this.ve.set(a[259])
}
;
function ze(a, b, c) {
    var d = b & 255;
    (new Uint8Array(a.oc[b >> 8 & 65535].buffer))[d] = c
}
function Ae(a, b, c) {
    var d = b & 255;
    a = new Uint16Array(a.oc[b >> 8 & 65535].buffer);
    !a || 16 <= d && 44 > d || (a[d >>> 1] = c)
}
function qe(a, b) {
    var c = b.fb
      , d = new Int32Array(64);
    d.set(new Int32Array((new Uint8Array(b.R)).buffer));
    a.oc[c] = d;
    a.u[c] = b;
    c = d.slice(4, 10);
    for (var e = 0; e < b.Pb.length; e++) {
        var f = b.Pb[e];
        if (f) {
            var h = c[e]
              , g = h & 1;
            f.bi = h;
            f.entries = [];
            if (0 !== g)
                for (h &= -2,
                g = 0; g < f.size; g++)
                    f.entries[g] = a.C.ports[h + g]
        }
    }
    return d
}
function Be(a, b, c, d) {
    for (var e = b.size, f = a.C.ports, h = 0; h < e; h++) {
        4096 <= c + h && (f[c + h] = Za(a.C));
        var g = b.entries[h];
        4096 <= d + h && (f[d + h] = g)
    }
}
ye.prototype.Sa = function(a) {
    this.s.Wa(this.h[96 + ((this.oc[a][15] >> 8 & 255) - 1 + ((a >> 3) - 1 & 255) & 3)])
}
;
function De(a, b) {
    Fb(a.s, a.h[96 + ((a.oc[b][15] >> 8 & 255) + (b >> 3 & 255) - 2 & 3)])
}
;function Ee(a, b, c) {
    a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5] && (a[0] = c[0],
    a[1] = c[1],
    a[2] = c[2],
    a[3] = c[3],
    a[4] = c[4],
    a[5] = c[5]);
    a[6] === b[0] && a[7] === b[1] && a[8] === b[2] && a[9] === b[3] && a[10] === b[4] && a[11] === b[5] && (a[6] = c[0],
    a[7] = c[1],
    a[8] = c[2],
    a[9] = c[3],
    a[10] = c[4],
    a[11] = c[5]);
    var d = a[12] << 8 | a[13];
    if (2048 === d) {
        if (a = a.subarray(14),
        4 === a[0] >> 4 && 17 === a[9] && (a = a.subarray(20),
        d = a[2] << 8 | a[3],
        67 === (a[0] << 8 | a[1]) || 67 === d)) {
            const e = a.subarray(8);
            if (1669485411 === (e[236] << 24 | e[237] << 16 | e[238] << 8 | e[239]))
                for (e[28] === b[0] && e[29] === b[1] && e[30] === b[2] && e[31] === b[3] && e[32] === b[4] && e[33] === b[5] && (e[28] = c[0],
                e[29] = c[1],
                e[30] = c[2],
                e[31] = c[3],
                e[32] = c[4],
                e[33] = c[5],
                a[6] = a[7] = 0),
                d = 240; d < e.length; ) {
                    const f = e[d++];
                    if (255 === f)
                        break;
                    const h = e[d++];
                    61 === f && 1 === e[d + 0] && e[d + 1] === b[0] && e[d + 2] === b[1] && e[d + 3] === b[2] && e[d + 4] === b[3] && e[d + 5] === b[4] && e[d + 6] === b[5] && (e[d + 1] = c[0],
                    e[d + 2] = c[1],
                    e[d + 3] = c[2],
                    e[d + 4] = c[3],
                    e[d + 5] = c[4],
                    e[d + 6] = c[5],
                    a[6] = a[7] = 0);
                    d += h
                }
        }
    } else
        2054 === d && (a = a.subarray(14),
        a[8] === b[0] && a[9] === b[1] && a[10] === b[2] && a[11] === b[3] && a[12] === b[4] && a[13] === b[5] && (a[8] = c[0],
        a[9] = c[1],
        a[10] = c[2],
        a[11] = c[3],
        a[12] = c[4],
        a[13] = c[5]))
}
function Fe(a) {
    return [a[0].toString(16).padStart(2, "0"), a[1].toString(16).padStart(2, "0"), a[2].toString(16).padStart(2, "0"), a[3].toString(16).padStart(2, "0"), a[4].toString(16).padStart(2, "0"), a[5].toString(16).padStart(2, "0")].join(":")
}
function Ke(a, b, c, d) {
    this.s = a;
    this.eb = a.u.eb;
    this.id = 0;
    this.ze = c;
    this.Nb = d;
    this.v = b;
    this.v.register("net" + this.id + "-receive", function(e) {
        this.Fa(e)
    }, this);
    this.port = 768 + 256 * this.id;
    this.name = "ne2k";
    this.R = [236, 16, 41, 128, 3, 1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, this.port & 255 | 1, this.port >> 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 244, 26, 0, 17, 0, 0, 184, 254, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0];
    this.fb = (0 === this.id ? 5 : 7 + this.id) << 3;
    this.Pb = [{
        size: 32
    }];
    this.ig = this.cb = 0;
    this.ib = 1;
    this.Ag = this.Ge = this.dc = this.nf = 0;
    this.memory = new Uint8Array(32768);
    this.oh = this.af = 0;
    this.nh = 1;
    this.la = new Uint8Array([0, 34, 21, 255 * Math.random() | 0, 255 * Math.random() | 0, 255 * Math.random() | 0]);
    this.v.send("net" + this.id + "-mac", Fe(this.la));
    this.xd = Uint8Array.of(255, 255, 255, 255, 255, 255, 255, 255);
    this.Ef = null;
    for (b = 0; 6 > b; b++)
        this.memory[b << 1] = this.memory[b << 1 | 1] = this.la[b];
    this.memory[28] = this.memory[29] = 87;
    this.memory[30] = this.memory[31] = 87;
    this.Ia = 0;
    this.Fc = 64;
    this.rb = 128;
    this.pd = this.lc = 76;
    b = a.C;
    x(b, this.port | 0, this, function() {
        return this.ib
    });
    u(b, this.port | 0, this, function(e) {
        this.ib = e;
        this.ib & 1 || (e & 24 && 0 === this.dc && Le(this, 64),
        e & 4 && (e = this.Ag << 8,
        e = this.memory.subarray(e, e + this.Ge),
        this.Ef && (e = new Uint8Array(e),
        Ee(e, this.Ef, this.la)),
        this.v.send("net" + this.id + "-send", e),
        this.v.send("eth-transmit-end", [e.length]),
        this.ib &= -5,
        Le(this, 2)))
    });
    x(b, this.port | 13, this, function() {
        return 1 === O(this) ? this.xd[5] : 0
    });
    x(b, this.port | 14, this, function() {
        return 1 === O(this) ? this.xd[6] : 0
    }, function() {
        return 0
    });
    x(b, this.port | 15, this, function() {
        return 1 === O(this) ? this.xd[7] : 0
    });
    x(b, this.port | 31, this, function() {
        Le(this, 128);
        return 0
    });
    u(b, this.port | 31, this, function() {});
    x(b, this.port | 1, this, function() {
        var e = O(this);
        return 0 === e ? this.Fc : 1 === e ? this.la[0] : 2 === e ? this.Fc : 0
    });
    u(b, this.port | 1, this, function(e) {
        var f = O(this);
        0 === f ? this.Fc = e : 1 === f && (this.la[0] = e)
    });
    x(b, this.port | 2, this, function() {
        var e = O(this);
        return 0 === e ? this.rb : 1 === e ? this.la[1] : 2 === e ? this.rb : 0
    });
    u(b, this.port | 2, this, function(e) {
        var f = O(this);
        0 === f ? (e > this.memory.length >> 8 && (e = this.memory.length >> 8),
        this.rb = e) : 1 === f && (this.la[1] = e)
    });
    x(b, this.port | 7, this, function() {
        var e = O(this);
        return 0 === e ? this.cb : 1 === e ? this.lc : 0
    });
    u(b, this.port | 7, this, function(e) {
        var f = O(this);
        0 === f ? (this.cb &= ~e,
        Me(this)) : 1 === f && (this.lc = e)
    });
    u(b, this.port | 13, this, function(e) {
        0 === O(this) && (this.oh = e)
    });
    u(b, this.port | 14, this, function(e) {
        0 === O(this) && (this.nf = e)
    });
    x(b, this.port | 10, this, function() {
        var e = O(this);
        return 0 === e ? 80 : 1 === e ? this.xd[2] : 0
    });
    u(b, this.port | 10, this, function(e) {
        0 === O(this) && (this.dc = this.dc & 65280 | e & 255)
    });
    x(b, this.port | 11, this, function() {
        var e = O(this);
        return 0 === e ? 67 : 1 === e ? this.xd[3] : 0
    });
    u(b, this.port | 11, this, function(e) {
        0 === O(this) && (this.dc = this.dc & 255 | e << 8 & 65280)
    });
    x(b, this.port | 8, this, function() {
        var e = O(this);
        return 0 === e ? this.Ia & 255 : 1 === e ? this.xd[0] : 0
    });
    u(b, this.port | 8, this, function(e) {
        0 === O(this) && (this.Ia = this.Ia & 65280 | e & 255)
    });
    x(b, this.port | 9, this, function() {
        var e = O(this);
        return 0 === e ? this.Ia >> 8 & 255 : 1 === e ? this.xd[1] : 0
    });
    u(b, this.port | 9, this, function(e) {
        0 === O(this) && (this.Ia = this.Ia & 255 | e << 8 & 65280)
    });
    u(b, this.port | 15, this, function(e) {
        0 === O(this) && (this.ig = e,
        Me(this))
    });
    x(b, this.port | 3, this, function() {
        var e = O(this);
        return 0 === e ? this.pd : 1 === e ? this.la[2] : 0
    });
    u(b, this.port | 3, this, function(e) {
        var f = O(this);
        0 === f ? this.pd = e : 1 === f && (this.la[2] = e)
    });
    x(b, this.port | 4, this, function() {
        var e = O(this);
        return 0 === e ? this.nh : 1 === e ? this.la[3] : 0
    });
    u(b, this.port | 4, this, function(e) {
        var f = O(this);
        0 === f ? this.Ag = e : 1 === f && (this.la[3] = e)
    });
    x(b, this.port | 5, this, function() {
        var e = O(this);
        return 0 === e ? 0 : 1 === e ? this.la[4] : 0
    });
    u(b, this.port | 5, this, function(e) {
        var f = O(this);
        0 === f ? this.Ge = this.Ge & -256 | e : 1 === f && (this.la[4] = e)
    });
    x(b, this.port | 6, this, function() {
        var e = O(this);
        return 0 === e ? 0 : 1 === e ? this.la[5] : 0
    });
    u(b, this.port | 6, this, function(e) {
        var f = O(this);
        0 === f ? this.Ge = this.Ge & 255 | e << 8 : 1 === f && (this.la[5] = e)
    });
    x(b, this.port | 12, this, function() {
        var e = O(this);
        return 0 === e ? 9 : 1 === e ? this.xd[4] : 0
    });
    u(b, this.port | 12, this, function(e) {
        0 === O(this) && (this.af = e)
    });
    x(b, this.port | 16, this, this.pj, this.Ch, this.oj);
    u(b, this.port | 16, this, this.Dh, this.Dh, this.qj);
    qe(a.u.eb, this)
}
n = Ke.prototype;
n.ia = function() {
    var a = [];
    a[0] = this.cb;
    a[1] = this.ig;
    a[2] = this.ib;
    a[3] = this.nf;
    a[4] = this.dc;
    a[5] = this.Ge;
    a[6] = this.Ag;
    a[7] = this.Ia;
    a[8] = this.Fc;
    a[9] = this.lc;
    a[10] = this.pd;
    a[11] = this.rb;
    a[12] = this.af;
    a[13] = this.oh;
    a[14] = this.nh;
    a[15] = this.la;
    a[16] = this.memory;
    return a
}
;
n.J = function(a) {
    this.cb = a[0];
    this.ig = a[1];
    this.ib = a[2];
    this.nf = a[3];
    this.dc = a[4];
    this.Ge = a[5];
    this.Ag = a[6];
    this.Ia = a[7];
    this.Fc = a[8];
    this.lc = a[9];
    this.pd = a[10];
    this.rb = a[11];
    this.af = a[12];
    this.oh = a[13];
    this.nh = a[14];
    this.ze ? (this.la = a[15],
    this.memory = a[16]) : this.Nb && (this.Ef = a[15],
    this.memory = a[16]);
    this.v.send("net" + this.id + "-mac", Fe(this.la))
}
;
function Le(a, b) {
    a.cb |= b;
    Me(a)
}
function Me(a) {
    a.ig & a.cb ? a.eb.Sa(a.fb) : De(a.eb, a.fb)
}
function Ne(a, b) {
    if (16 >= a.Ia || 16384 <= a.Ia && 32768 > a.Ia)
        a.memory[a.Ia] = b;
    a.Ia++;
    a.dc--;
    a.Ia >= a.rb << 8 && (a.Ia += a.Fc - a.rb << 8);
    0 === a.dc && Le(a, 64)
}
n.Dh = function(a) {
    Ne(this, a);
    this.nf & 1 && Ne(this, a >> 8)
}
;
n.qj = function(a) {
    Ne(this, a);
    Ne(this, a >> 8);
    Ne(this, a >> 16);
    Ne(this, a >> 24)
}
;
function Oe(a) {
    let b = 0;
    32768 > a.Ia && (b = a.memory[a.Ia]);
    a.Ia++;
    a.dc--;
    a.Ia >= a.rb << 8 && (a.Ia += a.Fc - a.rb << 8);
    0 === a.dc && Le(a, 64);
    return b
}
n.pj = function() {
    return this.Ch() & 255
}
;
n.Ch = function() {
    return this.nf & 1 ? Oe(this) | Oe(this) << 8 : Oe(this)
}
;
n.oj = function() {
    return Oe(this) | Oe(this) << 8 | Oe(this) << 16 | Oe(this) << 24
}
;
n.Fa = function(a) {
    if (!(this.ib & 1) && (this.v.send("eth-receive-end", [a.length]),
    this.af & 16 || this.af & 4 && 255 === a[0] && 255 === a[1] && 255 === a[2] && 255 === a[3] && 255 === a[4] && 255 === a[5] || !(this.af & 8 && 1 === (a[0] & 1) || a[0] !== this.la[0] || a[1] !== this.la[1] || a[2] !== this.la[2] || a[3] !== this.la[3] || a[4] !== this.la[4] || a[5] !== this.la[5]))) {
        this.Ef && (a = new Uint8Array(a),
        Ee(a, this.la, this.Ef));
        var b = this.lc << 8
          , c = Math.max(60, a.length) + 4
          , d = b + 4
          , e = this.lc + 1 + (c >> 8);
        if (!((this.pd > this.lc ? this.pd - this.lc : this.rb - this.lc + this.pd - this.Fc) < 1 + (c >> 8) && 0 !== this.pd)) {
            if (b + c > this.rb << 8) {
                var f = (this.rb << 8) - d;
                this.memory.set(a.subarray(0, f), d);
                this.memory.set(a.subarray(f), this.Fc << 8)
            } else
                this.memory.set(a, d),
                60 > a.length && this.memory.fill(0, d + a.length, d + 60);
            e >= this.rb && (e += this.Fc - this.rb);
            this.memory[b] = 1;
            this.memory[b + 1] = e;
            this.memory[b + 2] = c;
            this.memory[b + 3] = c >> 8;
            this.lc = e;
            Le(this, 1)
        }
    }
}
;
function O(a) {
    return a.ib >> 6 & 3
}
;function Pe(a, b) {
    this.v = b;
    this.rows = 25;
    this.cols = 80;
    this.ports = 4;
    b = [{
        Ka: 16,
        Za: 0
    }, {
        Ka: 16,
        Za: 1
    }, {
        Ka: 16,
        Za: 2
    }, {
        Ka: 16,
        Za: 3
    }];
    for (let c = 1; c < this.ports; ++c)
        b.push({
            Ka: 16,
            Za: 0
        }),
        b.push({
            Ka: 8,
            Za: 1
        });
    this.P = new Qe(a,{
        name: "virtio-console",
        fb: 96,
        ke: 4163,
        Nf: 3,
        ie: {
            Qa: 47104,
            $: b,
            features: [0, 1, 32],
            Vg: () => {}
        },
        notification: {
            Qa: 47360,
            yg: !1,
            hg: [ () => {}
            , c => {
                const d = this.P.$[c]
                  , e = 3 < c ? c - 3 >> 1 : 0;
                for (; Re(d); ) {
                    const f = Se(d)
                      , h = new Uint8Array(f.Mb);
                    Te(f, h);
                    this.v.send("virtio-console" + e + "-output-bytes", h);
                    Ue(this, c, f)
                }
            }
            , c => {
                if (2 === c)
                    for (c = this.P.$[c]; Ve(c) > c.size - 2; )
                        Se(c)
            }
            , c => {
                if (3 === c)
                    for (var d = this.P.$[c]; Re(d); ) {
                        var e = Se(d)
                          , f = new Uint8Array(e.Mb);
                        Te(e, f);
                        var h = K(["w", "h", "h"], f, {
                            offset: 0
                        });
                        f = h[0];
                        h = h[1];
                        Ue(this, c, e);
                        switch (h) {
                        case 0:
                            for (f = 0; f < this.ports; ++f)
                                We(this, f, 1, 0);
                            break;
                        case 3:
                            Ue(this, c, e);
                            We(this, f, 4, 1);
                            h = f;
                            var g = "virtio-" + f;
                            e = Se(this.P.$[2]);
                            g = (new TextEncoder).encode(g);
                            const k = new Uint8Array(g.length + 9);
                            G(["w", "h", "h"], [h, 7, 1], k, 0);
                            for (h = 0; h < g.length; ++h)
                                k[h + 8] = g[h];
                            k[8 + g.length] = 0;
                            this.nd(2, e, k);
                            We(this, f, 6, 1);
                            break;
                        case 6:
                            Ue(this, c, e);
                            0 === f && Xe(this, f);
                            break;
                        default:
                            return
                        }
                    }
            }
            ]
        },
        Lb: {
            Qa: 46848
        },
        pf: {
            Qa: 46592,
            Ic: [{
                bytes: 2,
                name: "cols",
                read: () => this.cols,
                write: () => {}
            }, {
                bytes: 2,
                name: "rows",
                read: () => this.rows,
                write: () => {}
            }, {
                bytes: 4,
                name: "max_nr_ports",
                read: () => this.ports,
                write: () => {}
            }, {
                bytes: 4,
                name: "emerg_wr",
                read: () => 0,
                write: () => {}
            }]
        }
    });
    for (let c = 0; c < this.ports; ++c) {
        const d = 0 === c ? 0 : 2 * c + 2;
        this.v.register("virtio-console" + c + "-input-bytes", function(e) {
            var f = this.P.$[d];
            Re(f) && (f = Se(f),
            this.nd(d, f, new Uint8Array(e)))
        }, this);
        this.v.register("virtio-console" + c + "-resize", function(e) {
            0 === c && (this.cols = e[0],
            this.rows = e[1]);
            Ye(this.P.$[2]) && Re(this.P.$[2]) && Xe(this, c, e[0], e[1])
        }, this)
    }
}
function Xe(a, b, c, d) {
    d = d || a.rows;
    c = c || a.cols;
    const e = Se(a.P.$[2])
      , f = new Uint8Array(12);
    G(["w", "h", "h", "h", "h"], [b, 5, 0, d, c], f, 0);
    a.nd(2, e, f)
}
Pe.prototype.ia = function() {
    const a = [];
    a[0] = this.P;
    a[1] = this.rows;
    a[2] = this.cols;
    a[3] = this.ports;
    return a
}
;
Pe.prototype.J = function(a) {
    this.P.J(a[0]);
    this.rows = a[1];
    this.cols = a[2];
    this.ports = a[3]
}
;
Pe.prototype.reset = function() {
    this.P.reset()
}
;
function We(a, b, c, d) {
    const e = Se(a.P.$[2])
      , f = new Uint8Array(8);
    G(["w", "h", "h"], [b, c, d], f, 0);
    a.nd(2, e, f)
}
Pe.prototype.nd = function(a, b, c) {
    Ze(b, c);
    $e(this.P.$[a], b);
    af(this.P.$[a])
}
;
function Ue(a, b, c) {
    Ze(c, new Uint8Array(0));
    $e(a.P.$[b], c);
    af(a.P.$[b])
}
;function bf(a, b) {
    this.s = a;
    this.v = b;
    this.reset();
    this.v.register("keyboard-code", function(c) {
        this.sf && (this.ya.push(c),
        this.Sa())
    }, this);
    this.v.register("mouse-click", function(c) {
        this.zf && this.He && (this.se = c[0] | c[2] << 1 | c[1] << 2,
        this.sd && cf(this, 0, 0))
    }, this);
    this.v.register("mouse-delta", function(c) {
        var d = c[1];
        if (this.zf && this.He) {
            var e = this.$e * this.Hd / 80;
            this.Bc += c[0] * e;
            this.Cc += d * e;
            this.sd && (c = this.Bc | 0,
            d = this.Cc | 0,
            c || d) && (this.Bc -= c,
            this.Cc -= d,
            cf(this, c, d))
        }
    }, this);
    this.v.register("mouse-wheel", function(c) {
        this.Lc -= c[0];
        this.Lc -= 2 * c[1];
        this.Lc = Math.min(7, Math.max(-8, this.Lc));
        cf(this, 0, 0)
    }, this);
    x(a.C, 96, this, this.hl);
    x(a.C, 100, this, this.jl);
    u(a.C, 96, this, this.il);
    u(a.C, 100, this, this.kl)
}
n = bf.prototype;
n.reset = function() {
    this.He = this.sd = !1;
    this.zf = !0;
    this.se = this.Cc = this.Bc = 0;
    this.na = !0;
    this.U = this.T = this.F = this.N = this.X = this.K = this.sf = !1;
    this.ya = new ta(1024);
    this.l = 0;
    this.Hd = 100;
    this.j = this.i = 0;
    this.B = !1;
    this.Lc = 0;
    this.$e = 4;
    this.A = !1;
    this.g = new ta(1024);
    this.D = this.o = !1;
    this.h = 5;
    this.ga = 0;
    this.aa = this.Z = this.ba = !1
}
;
n.ia = function() {
    var a = [];
    a[0] = this.sd;
    a[1] = this.He;
    a[2] = this.zf;
    a[3] = this.Bc;
    a[4] = this.Cc;
    a[5] = this.se;
    a[6] = this.na;
    a[7] = this.sf;
    a[8] = this.K;
    a[9] = this.X;
    a[10] = this.N;
    a[11] = this.F;
    a[12] = this.T;
    a[13] = this.U;
    a[15] = this.l;
    a[16] = this.Hd;
    a[17] = this.$e;
    a[18] = this.A;
    a[20] = this.h;
    a[21] = this.ba;
    a[22] = this.Z;
    a[23] = this.ga;
    a[24] = this.aa;
    a[25] = this.j;
    a[26] = this.i;
    a[27] = this.B;
    return a
}
;
n.J = function(a) {
    this.sd = a[0];
    this.He = a[1];
    this.zf = a[2];
    this.Bc = a[3];
    this.Cc = a[4];
    this.se = a[5];
    this.na = a[6];
    this.sf = a[7];
    this.K = a[8];
    this.X = a[9];
    this.N = a[10];
    this.F = a[11];
    this.T = a[12];
    this.U = a[13];
    this.l = a[15];
    this.Hd = a[16];
    this.$e = a[17];
    this.A = a[18];
    this.h = a[20];
    this.ba = a[21];
    this.Z = a[22];
    this.ga = a[23];
    this.aa = a[24];
    this.j = a[25] || 0;
    this.i = a[26] || 0;
    this.B = a[27] || !1;
    this.D = this.o = !1;
    this.ya.clear();
    this.g.clear();
    this.v.send("mouse-enable", this.He)
}
;
n.Sa = function() {
    this.o || (this.ya.length ? df(this) : this.g.length && ef(this))
}
;
function ef(a) {
    a.o = !0;
    a.D = !0;
    a.h & 2 && (Fb(a.s, 12),
    a.s.Wa(12))
}
function df(a) {
    a.o = !0;
    a.D = !1;
    a.h & 1 && (Fb(a.s, 1),
    a.s.Wa(1))
}
function cf(a, b, c) {
    a.g.push((0 > c) << 5 | (0 > b) << 4 | 8 | a.se);
    a.g.push(b);
    a.g.push(c);
    4 === a.j ? (a.g.push(0 | a.Lc & 15),
    a.Lc = 0) : 3 === a.j && (a.g.push(a.Lc & 255),
    a.Lc = 0);
    a.Sa()
}
n.hl = function() {
    this.o = !1;
    if (!this.ya.length && !this.g.length)
        return this.l;
    this.D ? (Fb(this.s, 12),
    this.l = this.g.shift()) : (Fb(this.s, 1),
    this.l = this.ya.shift());
    (this.ya.length || this.g.length) && this.Sa();
    return this.l
}
;
n.jl = function() {
    var a = 16;
    this.o && (a |= 1);
    this.D && (a |= 32);
    return a
}
;
n.il = function(a) {
    if (this.Z)
        this.h = a,
        this.Z = !1;
    else if (this.ba)
        this.ba = !1,
        this.g.clear(),
        this.g.push(a),
        ef(this);
    else if (this.X) {
        this.X = !1;
        this.g.clear();
        this.g.push(250);
        this.Hd = a;
        switch (this.i) {
        case -1:
            60 === a ? (this.B = !0,
            this.i = 0) : (this.B = !1,
            this.i = 200 === a ? 1 : 0);
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
            80 === a && (this.j = 4),
            this.i = -1
        }
        this.Hd || (this.Hd = 100);
        ef(this)
    } else if (this.U)
        this.U = !1,
        this.g.clear(),
        this.g.push(250),
        this.$e = 3 < a ? 4 : 1 << a,
        ef(this);
    else if (this.N)
        this.N = !1,
        this.ya.push(250),
        df(this);
    else if (this.F)
        this.F = !1,
        this.ya.push(250),
        df(this),
        a || this.ya.push(1);
    else if (this.T)
        this.T = !1,
        this.ya.push(250),
        df(this);
    else if (this.K) {
        if (this.K = !1,
        this.zf) {
            this.ya.clear();
            this.g.clear();
            this.g.push(250);
            switch (a) {
            case 230:
                this.A = !1;
                break;
            case 231:
                this.A = !0;
                break;
            case 232:
                this.U = !0;
                break;
            case 233:
                cf(this, 0, 0);
                break;
            case 235:
                cf(this, 0, 0);
                break;
            case 242:
                this.g.push(this.j);
                this.se = this.Bc = this.Cc = 0;
                this.Sa();
                break;
            case 243:
                this.X = !0;
                break;
            case 244:
                this.He = this.sd = !0;
                this.v.send("mouse-enable", !0);
                this.se = this.Bc = this.Cc = 0;
                break;
            case 245:
                this.sd = !1;
                break;
            case 246:
                this.sd = !1;
                this.Hd = 100;
                this.A = !1;
                this.$e = 4;
                break;
            case 255:
                this.g.push(170),
                this.g.push(0),
                this.He = !0,
                this.v.send("mouse-enable", !0),
                this.sd = !1,
                this.Hd = 100,
                this.A = !1,
                this.$e = 4,
                this.B || (this.j = 0),
                this.se = this.Bc = this.Cc = 0
            }
            ef(this)
        }
    } else if (this.aa)
        this.aa = !1,
        this.ga = a;
    else {
        this.g.clear();
        this.ya.clear();
        this.ya.push(250);
        switch (a) {
        case 237:
            this.N = !0;
            break;
        case 240:
            this.F = !0;
            break;
        case 242:
            this.ya.push(171);
            this.ya.push(131);
            break;
        case 243:
            this.T = !0;
            break;
        case 244:
            this.sf = !0;
            break;
        case 245:
            this.sf = !1;
            break;
        case 255:
            this.ya.clear(),
            this.ya.push(250),
            this.ya.push(170),
            this.ya.push(0)
        }
        df(this)
    }
}
;
n.kl = function(a) {
    switch (a) {
    case 32:
        this.ya.clear();
        this.g.clear();
        this.ya.push(this.h);
        df(this);
        break;
    case 96:
        this.Z = !0;
        break;
    case 209:
        this.aa = !0;
        break;
    case 211:
        this.ba = !0;
        break;
    case 212:
        this.K = !0;
        break;
    case 167:
        this.h |= 32;
        break;
    case 168:
        this.h &= -33;
        break;
    case 169:
        this.ya.clear();
        this.g.clear();
        this.ya.push(0);
        df(this);
        break;
    case 170:
        this.ya.clear();
        this.g.clear();
        this.ya.push(85);
        df(this);
        break;
    case 171:
        this.ya.clear();
        this.g.clear();
        this.ya.push(0);
        df(this);
        break;
    case 173:
        this.h |= 16;
        break;
    case 174:
        this.h &= -17;
        break;
    case 254:
        Ce(this.s)
    }
}
;
const ff = DataView.prototype
  , gf = {
    size: 1,
    get: ff.getUint8,
    set: ff.setUint8
}
  , hf = {
    size: 2,
    get: ff.getUint16,
    set: ff.setUint16
}
  , R = {
    size: 4,
    get: ff.getUint32,
    set: ff.setUint32
}
  , kf = jf([{
    Xh: R
}, {
    ge: gf
}, {
    data: gf
}, {
    Cl: gf
}, {
    km: gf
}, {
    Hl: gf
}, {
    lm: function(a) {
        return {
            size: a,
            get: () => -1
        }
    }(7)
}, {
    type: hf
}, {
    hm: hf
}, {
    Dl: R
}, {
    Hh: R
}, {
    Wj: R
}, {
    ul: R
}, {
    flags: R
}, {
    Cj: hf
}, {
    fi: hf
}, {
    gi: hf
}, {
    Fi: hf
}, {
    Gi: hf
}, {
    om: hf
}]);
console.assert(52 === kf.reduce( (a, b) => a + b.size, 0));
const lf = jf([{
    type: R
}, {
    offset: R
}, {
    qh: R
}, {
    rg: R
}, {
    Kh: R
}, {
    Tg: R
}, {
    flags: R
}, {
    align: R
}]);
console.assert(32 === lf.reduce( (a, b) => a + b.size, 0));
const mf = jf([{
    name: R
}, {
    type: R
}, {
    flags: R
}, {
    Il: R
}, {
    offset: R
}, {
    size: R
}, {
    link: R
}, {
    info: R
}, {
    Kl: R
}, {
    $l: R
}]);
console.assert(40 === mf.reduce( (a, b) => a + b.size, 0));
function jf(a) {
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
function nf(a, b) {
    const c = {};
    let d = 0;
    for (const e of b)
        b = e.get.call(a, d, !0),
        console.assert(void 0 === c[e.name]),
        c[e.name] = b,
        d += e.size;
    return [c, d]
}
function of(a, b, c) {
    const d = [];
    let e = 0;
    for (var f = 0; f < c; f++) {
        const [h,g] = nf(new DataView(a.buffer,a.byteOffset + e,void 0), b);
        d.push(h);
        e += g
    }
    return [d, e]
}
;function pf(a, b) {
    this.C = a.C;
    this.s = a;
    this.Fb = a.u.Fb;
    this.h = 0;
    this.U = new Uint8Array(10);
    this.X = 0;
    this.i = null;
    this.g = new Uint8Array(10);
    this.T = this.D = this.ba = this.ga = this.F = this.o = this.l = this.j = 0;
    this.Z = 1;
    this.K = this.B = 0;
    this.td = null;
    b ? this.Mf(b) : (this.eg(),
    this.s.u.Gd.ha[16] = 64);
    x(this.C, 1008, this, this.Wk);
    x(this.C, 1010, this, this.Xk);
    x(this.C, 1012, this, this.Zk);
    x(this.C, 1013, this, this.al);
    x(this.C, 1015, this, this.cl);
    u(this.C, 1010, this, this.Yk);
    u(this.C, 1012, this, this.$k);
    u(this.C, 1013, this, this.bl)
}
n = pf.prototype;
n.eg = function() {
    this.td = null;
    this.aa = this.N = this.A = 0;
    this.K = 128
}
;
n.Mf = function(a) {
    var b = {
        [163840]: {
            type: 1,
            Sb: 40,
            Rb: 8,
            Hb: 1
        },
        [184320]: {
            type: 1,
            Sb: 40,
            Rb: 9,
            Hb: 1
        },
        [204800]: {
            type: 1,
            Sb: 40,
            Rb: 10,
            Hb: 1
        },
        [327680]: {
            type: 1,
            Sb: 40,
            Rb: 8,
            Hb: 2
        },
        [368640]: {
            type: 1,
            Sb: 40,
            Rb: 9,
            Hb: 2
        },
        [409600]: {
            type: 1,
            Sb: 40,
            Rb: 10,
            Hb: 2
        },
        [737280]: {
            type: 3,
            Sb: 80,
            Rb: 9,
            Hb: 2
        },
        [1228800]: {
            type: 2,
            Sb: 80,
            Rb: 15,
            Hb: 2
        },
        [1474560]: {
            type: 4,
            Sb: 80,
            Rb: 18,
            Hb: 2
        },
        [1763328]: {
            type: 5,
            Sb: 82,
            Rb: 21,
            Hb: 2
        },
        [2949120]: {
            type: 5,
            Sb: 80,
            Rb: 36,
            Hb: 2
        },
        512: {
            type: 1,
            Sb: 1,
            Rb: 1,
            Hb: 1
        }
    };
    let c = a.byteLength
      , d = b[c];
    d || (c = 1474560 < a.byteLength ? 2949120 : 1474560,
    d = b[c],
    b = new Uint8Array(c),
    b.set(new Uint8Array(a.buffer)),
    a = new Ca(b.buffer));
    this.A = d.Rb;
    this.N = d.Hb;
    this.aa = d.Sb;
    this.td = a;
    this.K = 128;
    this.s.u.Gd.ha[16] = d.type << 4
}
;
n.ia = function() {
    var a = [];
    a[0] = this.h;
    a[1] = this.U;
    a[2] = this.X;
    a[4] = this.g;
    a[5] = this.j;
    a[6] = this.l;
    a[8] = this.o;
    a[9] = this.F;
    a[10] = this.ga;
    a[11] = this.ba;
    a[12] = this.D;
    a[13] = this.T;
    a[14] = this.Z;
    a[15] = this.B;
    a[16] = this.A;
    a[17] = this.N;
    a[18] = this.aa;
    return a
}
;
n.J = function(a) {
    this.h = a[0];
    this.U = a[1];
    this.X = a[2];
    this.i = a[3];
    this.g = a[4];
    this.j = a[5];
    this.l = a[6];
    this.o = a[8];
    this.F = a[9];
    this.ga = a[10];
    this.ba = a[11];
    this.D = a[12];
    this.T = a[13];
    this.Z = a[14];
    this.B = a[15];
    this.A = a[16];
    this.N = a[17];
    this.aa = a[18]
}
;
n.Wk = function() {
    return 0
}
;
n.Zk = function() {
    var a = 128;
    this.j < this.l && (a |= 80);
    0 === (this.B & 8) && (a |= 32);
    return a
}
;
n.cl = function() {
    return this.K
}
;
n.al = function() {
    return this.j < this.l ? (Fb(this.s, 6),
    this.g[this.j++]) : 255
}
;
n.$k = function(a) {
    a & 128 && (this.o = 192,
    this.s.Wa(6))
}
;
n.bl = function(a) {
    if (0 < this.h)
        this.U[this.X++] = a,
        this.h--,
        0 === this.h && this.i.call(this, this.U);
    else {
        switch (a) {
        case 3:
            this.i = this.Hj;
            this.h = 2;
            break;
        case 19:
            this.i = this.lj;
            this.h = 3;
            break;
        case 4:
        case 20:
            this.i = this.ij;
            this.h = 1;
            break;
        case 5:
        case 69:
        case 197:
            this.i = function(b) {
                qf(this, !0, b)
            }
            ;
            this.h = 8;
            break;
        case 6:
        case 70:
        case 198:
        case 230:
            this.i = function(b) {
                qf(this, !1, b)
            }
            ;
            this.h = 8;
            break;
        case 7:
            this.i = this.gj;
            this.h = 1;
            break;
        case 8:
            this.j = 0;
            this.l = 2;
            this.g[0] = this.o;
            this.g[1] = this.D;
            break;
        case 74:
            this.i = this.ll;
            this.h = 1;
            break;
        case 15:
            this.h = 2;
            this.i = this.xh;
            break;
        case 14:
        case 16:
            this.o = 128,
            this.g[0] = this.o,
            this.j = 0,
            this.l = 1,
            this.h = 0
        }
        this.X = 0
    }
}
;
n.Xk = function() {
    return this.B
}
;
n.Yk = function(a) {
    !(this.B & 4) && a & 4 && (this.o = 192,
    a & 8 && this.s.Wa(6));
    this.B = a
}
;
n.ij = function() {
    this.F = this.td ? 0 : 5;
    this.j = 0;
    this.l = 1;
    this.g[0] = 0
}
;
n.xh = function(a) {
    if (0 === (a[0] & 3)) {
        var b = a[1];
        a = a[0] >> 2 & 1;
        b !== this.D && (this.K = 0);
        this.F = this.td ? 0 : 5;
        this.o = 32;
        this.D = b;
        this.T = a
    }
    this.Sa()
}
;
n.gj = function(a) {
    this.xh([a[0], 0])
}
;
function qf(a, b, c) {
    var d = c[2]
      , e = c[1]
      , f = c[3]
      , h = 128 << c[4]
      , g = c[5] - c[3] + 1
      , k = ((d + a.N * e) * a.A + f - 1) * h;
    a.td ? (a.F = 0,
    b ? a.Fb.rf(a.td, k, g * h, 2, a.done.bind(a, c, e, d, f)) : Sa(a.Fb, a.td, k, a.done.bind(a, c, e, d, f))) : a.F = 5
}
n.done = function(a, b, c, d, e) {
    e || (d++,
    d > this.A && (d = 1,
    c++,
    c >= this.N && (c = 0,
    b++)),
    b !== this.D && (this.K = 0),
    this.o = 32,
    this.D = b,
    this.T = c,
    this.Z = d,
    this.j = 0,
    this.l = 7,
    this.g[0] = c << 2 | 32,
    this.g[1] = 0,
    this.g[2] = 0,
    this.g[3] = b,
    this.g[4] = c,
    this.g[5] = d,
    this.g[6] = a[4],
    this.Sa())
}
;
n.Hj = function() {}
;
n.lj = function() {}
;
n.ll = function() {
    this.j = 0;
    this.l = 7;
    this.g[0] = 0;
    this.g[1] = 0;
    this.g[2] = 0;
    this.g[3] = 0;
    this.g[4] = 0;
    this.g[5] = 0;
    this.g[6] = 0;
    this.Sa()
}
;
n.Sa = function() {
    this.B & 8 && this.s.Wa(6)
}
;
const rf = {
    [70]: {
        name: "GET CONFIGURATION",
        flags: 0
    },
    [74]: {
        name: "GET EVENT STATUS NOTIFICATION",
        flags: 0
    },
    [18]: {
        name: "INQUIRY",
        flags: 0
    },
    [189]: {
        name: "MECHANISM STATUS",
        flags: 0
    },
    [26]: {
        name: "MODE SENSE (6)",
        flags: 0
    },
    [90]: {
        name: "MODE SENSE (10)",
        flags: 0
    },
    [69]: {
        name: "PAUSE",
        flags: 1
    },
    [30]: {
        name: "PREVENT ALLOW MEDIUM REMOVAL",
        flags: 0
    },
    [40]: {
        name: "READ",
        flags: 1
    },
    [37]: {
        name: "READ CAPACITY",
        flags: 1
    },
    [190]: {
        name: "READ CD",
        flags: 1
    },
    [81]: {
        name: "READ DISK INFORMATION",
        flags: 1
    },
    [66]: {
        name: "READ SUBCHANNEL",
        flags: 1
    },
    [67]: {
        name: "READ TOC PMA ATIP",
        flags: 1
    },
    [82]: {
        name: "READ TRACK INFORMATION",
        flags: 1
    },
    [3]: {
        name: "REQUEST SENSE",
        flags: 0
    },
    [27]: {
        name: "START STOP UNIT",
        flags: 0
    },
    [0]: {
        name: "TEST UNIT READY",
        flags: 1
    }
};
function sf(a, b, c) {
    this.s = a;
    this.v = b;
    this.Id = this.Qb = void 0;
    b = c && c[0][0];
    const d = c && c[1][0];
    if (b || d) {
        b && (this.Qb = new tf(this,0,c[0],496,1014,14));
        d && (this.Id = new tf(this,1,c[1],368,886,15));
        c = b ? this.Qb.h : 0;
        const e = b ? this.Qb.j : 0
          , f = d ? this.Id.h : 0
          , h = d ? this.Id.j : 0;
        this.name = "ide";
        this.fb = 240;
        this.R = [134, 128, 16, 112, 5, 0, 160, 2, 0, 128, 1, 1, 0, 0, 0, 0, c & 255 | 1, c >> 8, 0, 0, e & 255 | 1, e >> 8, 0, 0, f & 255 | 1, f >> 8, 0, 0, h & 255 | 1, h >> 8, 0, 0, 1, 180, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 67, 16, 212, 130, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.Pb = [b ? {
            size: 8
        } : void 0, b ? {
            size: 1
        } : void 0, d ? {
            size: 8
        } : void 0, d ? {
            size: 1
        } : void 0, {
            size: 16
        }];
        qe(a.u.eb, this)
    }
    Object.seal(this)
}
sf.prototype.ia = function() {
    const a = [];
    a[0] = this.Qb;
    a[1] = this.Id;
    return a
}
;
sf.prototype.J = function(a) {
    this.Qb && this.Qb.J(a[0]);
    this.Id && this.Id.J(a[1])
}
;
function tf(a, b, c, d, e, f) {
    this.N = b;
    this.s = a.s;
    this.v = a.v;
    this.h = d;
    this.j = e;
    this.qa = f;
    this.name = "ide" + b;
    d = c ? c[0] : void 0;
    c = c ? c[1] : void 0;
    this.kb = new uf(this,0,d?.buffer,d?.kg);
    this.Hc = new uf(this,1,c?.buffer,c?.kg);
    this.ea = this.kb;
    this.o = 2;
    this.l = this.g = this.i = 0;
    a = a.s;
    x(a.C, this.h | 0, this, function() {
        return vf(this.ea, 1)
    }, function() {
        return vf(this.ea, 2)
    }, function() {
        return vf(this.ea, 4)
    });
    x(a.C, this.h | 1, this, function() {
        return this.ea.Oa & 255
    });
    x(a.C, this.h | 2, this, function() {
        return this.ea.sa & 255
    });
    x(a.C, this.h | 3, this, function() {
        return this.ea.Xa & 255
    });
    x(a.C, this.h | 4, this, function() {
        return this.ea.Ea & 255
    });
    x(a.C, this.h | 5, this, function() {
        return this.ea.Ha & 255
    });
    x(a.C, this.h | 6, this, function() {
        return this.ea.Te & 255
    });
    x(a.C, this.h | 7, this, function() {
        const h = this.Ai();
        Fb(this.s, this.qa);
        return h
    });
    u(a.C, this.h | 0, this, function(h) {
        wf(this.ea, h, 1)
    }, function(h) {
        wf(this.ea, h, 2)
    }, function(h) {
        wf(this.ea, h, 4)
    });
    u(a.C, this.h | 1, this, function(h) {
        this.ea.uf = (this.ea.uf << 8 | h) & 65535
    });
    u(a.C, this.h | 2, this, function(h) {
        this.ea.sa = (this.ea.sa << 8 | h) & 65535
    });
    u(a.C, this.h | 3, this, function(h) {
        this.ea.Xa = (this.ea.Xa << 8 | h) & 65535
    });
    u(a.C, this.h | 4, this, function(h) {
        this.ea.Ea = (this.ea.Ea << 8 | h) & 65535
    });
    u(a.C, this.h | 5, this, function(h) {
        this.ea.Ha = (this.ea.Ha << 8 | h) & 65535
    });
    u(a.C, this.h | 6, this, function(h) {
        const g = h & 16;
        if (g && this.ea === this.kb || !g && this.ea === this.Hc)
            this.ea = g ? this.Hc : this.kb;
        this.ea.Te = h;
        this.ea.Bf = h >> 6 & 1;
        this.ea.head = h & 15
    });
    u(a.C, this.h | 7, this, function(h) {
        this.ea.H &= -34;
        var g = this.ea;
        if (g.na || 144 === h)
            switch (g.D = h,
            g.Oa = 0,
            h) {
            case 8:
                g.i = 0;
                g.g = 0;
                g.h = 0;
                xf(g);
                U(g);
                break;
            case 16:
                g.Ea = 0;
                g.H = 80;
                U(g);
                break;
            case 248:
                var k = g.j - 1;
                g.Xa = k & 255;
                g.Ea = k >> 8 & 255;
                g.Ha = k >> 16 & 255;
                g.Te = g.Te & 240 | k >> 24 & 15;
                g.H = 80;
                U(g);
                break;
            case 39:
                k = g.j - 1;
                g.Xa = k & 255;
                g.Ea = k >> 8 & 255;
                g.Ha = k >> 16 & 255;
                g.Xa |= k >> 24 << 8 & 65280;
                g.H = 80;
                U(g);
                break;
            case 32:
                g.B ? (g.Ea = 20,
                g.Ha = 235,
                yf(g)) : zf(g, h);
                break;
            case 36:
            case 41:
            case 196:
                g.B ? yf(g) : zf(g, h);
                break;
            case 48:
            case 52:
            case 57:
            case 197:
                if (g.B)
                    yf(g);
                else {
                    var l = 52 === h || 57 === h;
                    k = Af(g, l);
                    l = Bf(g, l);
                    h = 48 === h || 52 === h;
                    k *= g.o;
                    l *= g.o;
                    l + k > g.buffer.byteLength ? (g.H = 255,
                    U(g)) : (g.H = 88,
                    Cf(g, k),
                    g.g = h ? 512 : Math.min(k, 512 * g.U),
                    g.ua = l)
                }
                break;
            case 144:
                g.l.kb.H = 80;
                g.l.kb.Oa = 1;
                U(g.l.kb);
                g.l.Hc.na && (g.l.Hc.H = 80,
                g.l.Hc.Oa = 1,
                U(g.l.Hc));
                break;
            case 145:
                g.H = 80;
                U(g);
                break;
            case 160:
                g.B ? (Df(g, 12),
                g.g = 12,
                g.sa = 1,
                g.H = 88,
                U(g)) : yf(g);
                break;
            case 161:
                g.B ? (Ef(g),
                g.H = 88,
                U(g)) : yf(g);
                break;
            case 198:
                g.U = g.sa & 255;
                g.H = 80;
                U(g);
                break;
            case 200:
            case 37:
                k = 37 === h;
                l = Af(g, k);
                Bf(g, k) * g.o + l * g.o > g.buffer.byteLength ? (g.H = 255,
                U(g)) : (g.H = 88,
                g.l.g |= 1);
                break;
            case 202:
            case 53:
                k = 53 === h;
                l = Af(g, k);
                Bf(g, k) * g.o + l * g.o > g.buffer.byteLength ? (g.H = 255,
                U(g)) : (g.H = 88,
                g.l.g |= 1);
                break;
            case 64:
                g.H = 80;
                U(g);
                break;
            case 218:
                g.B && (g.buffer || (g.Oa |= 2),
                g.T && (g.Oa |= 32,
                g.T = !1),
                g.Oa |= 64);
                g.H = 80;
                U(g);
                break;
            case 224:
                g.H = 80;
                U(g);
                break;
            case 225:
                g.H = 80;
                U(g);
                break;
            case 231:
                g.H = 80;
                U(g);
                break;
            case 234:
                g.H = 80;
                U(g);
                break;
            case 236:
                g.B ? (g.Ea = 20,
                g.Ha = 235,
                yf(g)) : (Ef(g),
                g.H = 88,
                U(g));
                break;
            case 239:
                g.H = 80;
                U(g);
                break;
            case 222:
                g.H = 64;
                U(g);
                break;
            case 245:
                g.H = 80;
                U(g);
                break;
            case 249:
                yf(g);
                break;
            case 0:
                yf(g);
                break;
            default:
                yf(g)
            }
        Fb(this.s, this.qa)
    });
    x(a.C, this.j | 0, this, this.Ai);
    u(a.C, this.j | 0, this, this.Fl);
    b = 46080 + 8 * b;
    x(a.C, b | 0, this, this.wj, void 0, this.vj);
    u(a.C, b | 0, this, this.Eh, void 0, this.zj);
    x(a.C, b | 2, this, this.xj);
    u(a.C, b | 2, this, this.Fh);
    x(a.C, b | 4, this, void 0, void 0, this.uj);
    u(a.C, b | 4, this, void 0, void 0, this.yj)
}
n = tf.prototype;
n.Ai = function() {
    return this.ea.na ? this.ea.H : 0
}
;
n.Fl = function(a) {
    a & 4 && (Fb(this.s, this.qa),
    xf(this.kb),
    xf(this.Hc));
    this.o = a
}
;
n.uj = function() {
    return this.i
}
;
n.yj = function(a) {
    this.i = a
}
;
n.xj = function() {
    return this.g
}
;
n.Fh = function(a) {
    this.g &= ~(a & 6)
}
;
n.vj = function() {
    return this.l | this.g << 16
}
;
n.wj = function() {
    return this.l
}
;
n.zj = function(a) {
    this.Eh(a & 255);
    this.Fh(a >> 16 & 255)
}
;
n.Eh = function(a) {
    const b = this.l;
    this.l = a & 9;
    if ((b & 1) !== (a & 1))
        if (0 === (a & 1))
            this.g &= -2;
        else
            switch (this.g |= 1,
            this.ea.D) {
            case 200:
            case 37:
                Ff(this.ea);
                break;
            case 202:
            case 53:
                Gf(this.ea);
                break;
            case 160:
                Hf(this.ea);
                break;
            default:
                this.g &= -2,
                this.g |= 2,
                If(this)
            }
}
;
function If(a) {
    0 === (a.o & 2) && (a.g |= 4,
    a.s.Wa(a.qa))
}
n.ia = function() {
    var a = [];
    a[0] = this.kb;
    a[1] = this.Hc;
    a[2] = this.h;
    a[3] = this.qa;
    a[5] = this.j;
    a[7] = this.name;
    a[8] = this.o;
    a[9] = this.i;
    a[10] = this.g;
    a[11] = this.ea === this.kb;
    a[12] = this.l;
    return a
}
;
n.J = function(a) {
    this.kb.J(a[0]);
    this.Hc.J(a[1]);
    this.h = a[2];
    this.qa = a[3];
    this.j = a[5];
    this.name = a[7];
    this.o = a[8];
    this.i = a[9];
    this.g = a[10];
    this.ea = a[11] ? this.kb : this.Hc;
    this.l = a[12]
}
;
function uf(a, b, c, d) {
    this.l = a;
    this.name = a.name + "." + b;
    this.v = a.v;
    this.N = a.N;
    this.Ua = b;
    this.s = a.s;
    this.buffer = null;
    this.na = d || !!c;
    this.o = d ? 2048 : 512;
    this.B = d;
    this.j = 0;
    this.F = this.B ? 1 : 0;
    this.Te = this.head = this.Ha = this.Ea = this.uf = this.Xa = this.sa = this.Bf = this.K = this.A = 0;
    this.H = 80;
    this.U = 128;
    this.i = this.Oa = 0;
    this.data = new Uint8Array(65536);
    this.ga = new Uint16Array(this.data.buffer);
    this.X = new Int32Array(this.data.buffer);
    this.g = this.h = 0;
    this.D = -1;
    this.ab = this.ua = 0;
    this.Z = new Set;
    this.Pa = new Set;
    this.Na = -1;
    this.aa = this.ba = 0;
    this.T = !1;
    Jf(this, c);
    Object.seal(this)
}
function Kf(a) {
    a.B && a.buffer && (a.T = !0,
    a.buffer = null,
    a.H = 89,
    a.Oa = 96,
    U(a))
}
n = uf.prototype;
n.wg = function(a) {
    this.B && a && (Jf(this, a),
    this.T = !0)
}
;
function Jf(a, b) {
    if (b) {
        a.buffer = b;
        a.B && (a.H = 89,
        a.Oa = 96);
        a.j = a.buffer.byteLength / a.o;
        a.j !== (a.j | 0) && (a.j = Math.ceil(a.j));
        a.B ? (a.F = 1,
        a.A = 2048) : (a.F = 16,
        a.A = 63);
        a.K = a.j / a.F / a.A;
        a.K !== (a.K | 0) && (a.K = Math.floor(a.K));
        if (0 === a.Ua) {
            b = a.s.u.Gd;
            b.ha[57] |= 1 << 4 * a.N;
            b.ha[18] = b.ha[18] & 15 | 240;
            const c = 0 === a.N ? 27 : 36;
            b.ha[c] = a.K & 255;
            b.ha[c + 1] = a.K >> 8 & 255;
            b.ha[c + 2] = a.F & 255;
            b.ha[c + 3] = 255;
            b.ha[c + 4] = 255;
            b.ha[c + 5] = 200;
            b.ha[c + 6] = a.K & 255;
            b.ha[c + 7] = a.K >> 8 & 255;
            b.ha[c + 8] = a.A & 255
        }
        a.l.s && U(a)
    }
}
function xf(a) {
    a.B ? (a.H = 0,
    a.sa = 1,
    a.Oa = 1,
    a.Xa = 1,
    a.Ea = 20,
    a.Ha = 235) : (a.H = 81,
    a.sa = 1,
    a.Oa = 1,
    a.Xa = 1,
    a.Ea = 0,
    a.Ha = 0);
    for (const b of a.Z)
        a.Pa.add(b);
    a.Z.clear()
}
function U(a) {
    If(a.l)
}
function yf(a) {
    a.Oa = 4;
    a.H = 65;
    U(a)
}
function Lf(a, b, c) {
    Df(a, 0);
    a.g = a.h;
    a.H = 65;
    a.Oa = b << 4;
    a.sa = a.sa & -8 | 3;
    a.ba = b;
    a.aa = c
}
n.rf = function() {
    this.H = 80;
    var a = this.data.subarray(0, this.h);
    Mf(this, this.D, this.h / 512);
    U(this);
    this.buffer.set(this.ua, a, function() {});
    Nf(this, this.h)
}
;
function Of(a, b) {
    var c = (b[7] << 8 | b[8]) * a.o;
    b = (b[2] << 24 | b[3] << 16 | b[4] << 8 | b[5]) * a.o;
    a.h = 0;
    var d = a.Ha << 8 & 65280 | a.Ea & 255;
    a.Ea = a.Ha = 0;
    65535 === d && d--;
    d > c && (d = c);
    a.buffer ? b >= a.buffer.byteLength ? (a.H = 255,
    U(a)) : 0 === c ? (a.H = 80,
    a.i = 0) : (c = Math.min(c, a.buffer.byteLength - b),
    a.H = 208,
    Pf(a),
    a.ra(b, c, e => {
        Qf(a, e);
        a.H = 88;
        a.sa = a.sa & -8 | 2;
        U(a);
        d &= -4;
        a.g = d;
        a.g > a.h && (a.g = a.h);
        a.Ea = a.g & 255;
        a.Ha = a.g >> 8 & 255;
        Rf(a, c)
    }
    )) : (a.H = 255,
    a.Oa = 65,
    U(a))
}
function Sf(a, b) {
    var c = (b[7] << 8 | b[8]) * a.o;
    b = (b[2] << 24 | b[3] << 16 | b[4] << 8 | b[5]) * a.o;
    b >= a.buffer.byteLength ? (a.H = 255,
    U(a)) : (a.H = 208,
    Pf(a),
    a.ra(b, c, d => {
        Rf(a, c);
        a.H = 88;
        a.sa = a.sa & -8 | 2;
        Qf(a, d);
        Hf(a)
    }
    ))
}
function Hf(a) {
    if (0 !== (a.l.g & 1) && 0 !== (a.H & 8)) {
        var b = a.l.i
          , c = 0
          , d = a.data;
        do {
            var e = a.s.h(b)
              , f = a.s.gb(b + 4)
              , h = a.s.Be(b + 7) & 128;
            f || (f = 65536);
            Ua(a.s, d.subarray(c, Math.min(c + f, a.h)), e);
            c += f;
            b += 8;
            if (c >= a.h && !h)
                break
        } while (!h);
        a.H = 80;
        a.l.g &= -2;
        a.sa = a.sa & -8 | 3;
        U(a)
    }
}
function vf(a, b) {
    if (a.i < a.g) {
        var c = 1 === b ? a.data[a.i] : 2 === b ? a.ga[a.i >>> 1] : a.X[a.i >>> 2];
        a.i += b;
        a.i >= a.g && (160 === a.D ? a.g === a.h ? (a.H = 80,
        a.sa = a.sa & -8 | 3,
        U(a)) : (a.H = 88,
        a.sa = a.sa & -8 | 2,
        U(a),
        b = a.Ha << 8 & 65280 | a.Ea & 255,
        a.g + b > a.h ? (a.Ea = a.h - a.g & 255,
        a.Ha = a.h - a.g >> 8 & 255,
        a.g = a.h) : a.g += b) : (a.Oa = 0,
        a.i >= a.h ? a.H = 80 : (b = 41 === a.D || 196 === a.D ? Math.min(a.U, (a.h - a.g) / 512) : 1,
        Mf(a, a.D, b),
        a.g += 512 * b,
        a.H = 88,
        U(a))));
        return c
    }
    a.i += b;
    return 0
}
function wf(a, b, c) {
    if (!(a.i >= a.g) && (1 === c ? a.data[a.i++] = b : 2 === c ? (a.ga[a.i >>> 1] = b,
    a.i += 2) : (a.X[a.i >>> 2] = b,
    a.i += 4),
    a.i === a.g))
        if (160 === a.D)
            if (b = a.data[0],
            c = rf[b] ? rf[b].flags : 0,
            a.i = 0,
            a.Na = b,
            3 !== b && (a.ba = 0,
            a.aa = 0),
            !a.buffer && c & 1)
                Lf(a, 2, 58),
                U(a);
            else {
                switch (b) {
                case 0:
                    a.buffer ? (Df(a, 0),
                    a.g = a.h,
                    a.H = 80) : Lf(a, 2, 58);
                    break;
                case 3:
                    Df(a, a.data[4]);
                    a.g = a.h;
                    a.H = 88;
                    a.data[0] = 240;
                    a.data[2] = a.ba;
                    a.data[7] = 8;
                    a.data[12] = a.aa;
                    a.ba = 0;
                    a.aa = 0;
                    break;
                case 18:
                    b = a.data[4];
                    a.H = 88;
                    a.data.set([5, 128, 1, 49, 31, 0, 0, 0, 83, 79, 78, 89, 32, 32, 32, 32, 67, 68, 45, 82, 79, 77, 32, 67, 68, 85, 45, 49, 48, 48, 48, 32, 49, 46, 49, 97]);
                    a.g = a.h = Math.min(36, b);
                    break;
                case 26:
                    Df(a, a.data[4]);
                    a.g = a.h;
                    a.H = 88;
                    break;
                case 30:
                    Df(a, 0);
                    a.g = a.h;
                    a.H = 80;
                    break;
                case 37:
                    b = a.j - 1;
                    Qf(a, new Uint8Array([b >> 24 & 255, b >> 16 & 255, b >> 8 & 255, b & 255, 0, 0, a.o >> 8 & 255, a.o & 255]));
                    a.g = a.h;
                    a.H = 88;
                    break;
                case 40:
                    a.uf & 1 ? Sf(a, a.data) : Of(a, a.data);
                    break;
                case 66:
                    b = a.data[8];
                    Df(a, Math.min(8, b));
                    a.g = a.h;
                    a.H = 88;
                    break;
                case 67:
                    b = a.data[8] | a.data[7] << 8;
                    c = a.data[9] >> 6;
                    Df(a, b);
                    a.g = a.h;
                    0 === c ? (b = a.j,
                    a.data.set(new Uint8Array([0, 18, 1, 1, 0, 20, 1, 0, 0, 0, 0, 0, 0, 22, 170, 0, b >> 24, b >> 16 & 255, b >> 8 & 255, b & 255]))) : 1 === c && a.data.set(new Uint8Array([0, 10, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0]));
                    a.H = 88;
                    break;
                case 70:
                    b = Math.min(a.data[8] | a.data[7] << 8, 32);
                    Df(a, b);
                    a.g = a.h;
                    a.data[0] = b - 4 >> 24 & 255;
                    a.data[1] = b - 4 >> 16 & 255;
                    a.data[2] = b - 4 >> 8 & 255;
                    a.data[3] = b - 4 & 255;
                    a.data[6] = 8;
                    a.data[10] = 3;
                    a.H = 88;
                    break;
                case 81:
                    Df(a, 0);
                    a.g = a.h;
                    a.H = 80;
                    break;
                case 82:
                    Lf(a, 5, 36);
                    break;
                case 90:
                    b = a.data[8] | a.data[7] << 8;
                    42 === a.data[2] && Df(a, Math.min(30, b));
                    a.g = a.h;
                    a.H = 88;
                    break;
                case 189:
                    Df(a, a.data[9] | a.data[8] << 8);
                    a.g = a.h;
                    a.data[5] = 1;
                    a.H = 88;
                    break;
                case 27:
                    b = a.data[4] & 3;
                    a.buffer && 2 === b && (a.T = !0,
                    a.buffer = null);
                    a.H = 80;
                    Df(a, 0);
                    a.g = a.h;
                    break;
                case 69:
                case 74:
                    Lf(a, 5, 36);
                    break;
                case 190:
                    Df(a, 0);
                    a.g = a.h;
                    a.H = 80;
                    break;
                default:
                    Lf(a, 5, 36)
                }
                a.sa = a.sa & -8 | 2;
                0 === (a.H & 128) && U(a);
                0 === (a.H & 128) && 0 === a.h && (a.sa |= 1,
                a.H &= -9)
            }
        else
            a.i >= a.h ? a.rf() : (a.H = 88,
            a.g += 512,
            U(a))
}
function Mf(a, b, c) {
    a.sa -= c;
    36 === b || 41 === b || 37 === b || 52 === b || 57 === b || 53 === b ? (b = c + Tf(a),
    a.Xa = b & 255 | b >> 16 & 65280,
    a.Ea = b >> 8 & 255,
    a.Ha = b >> 16 & 255) : a.Bf ? (b = c + Uf(a),
    a.Xa = b & 255,
    a.Ea = b >> 8 & 255,
    a.Ha = b >> 16 & 255,
    a.head = a.head & -16 | b & 15) : (b = c + Vf(a),
    c = b / (a.F * a.A) | 0,
    a.Ea = c & 255,
    a.Ha = c >> 8 & 255,
    a.head = (b / a.A | 0) % a.F & 15,
    a.Xa = b % a.A + 1 & 255,
    Vf(a))
}
function zf(a, b) {
    var c = 36 === b || 41 === b
      , d = Af(a, c);
    c = Bf(a, c);
    var e = 32 === b || 36 === b
      , f = d * a.o;
    c *= a.o;
    c + f > a.buffer.byteLength ? (a.H = 255,
    U(a)) : (a.H = 192,
    Pf(a),
    a.ra(c, f, h => {
        Qf(a, h);
        a.H = 88;
        a.g = e ? 512 : Math.min(f, 512 * a.U);
        Mf(a, b, e ? 1 : Math.min(d, a.A));
        U(a);
        Rf(a, f)
    }
    ))
}
function Ff(a) {
    var b = 37 === a.D
      , c = Af(a, b);
    b = Bf(a, b);
    var d = c * a.o;
    b *= a.o;
    Pf(a);
    a.ra(b, d, e => {
        var f = a.l.i
          , h = 0;
        do {
            var g = a.s.h(f)
              , k = a.s.gb(f + 4)
              , l = a.s.Be(f + 7) & 128;
            k || (k = 65536);
            Ua(a.s, e.subarray(h, h + k), g);
            h += k;
            f += 8
        } while (!l);
        Mf(a, a.D, c);
        a.H = 80;
        a.l.g &= -2;
        a.D = -1;
        Rf(a, d);
        U(a)
    }
    )
}
function Gf(a) {
    var b = 53 === a.D
      , c = Af(a, b)
      , d = Bf(a, b);
    b = c * a.o;
    d *= a.o;
    var e = a.l.i
      , f = 0;
    const h = new Uint8Array(b);
    do {
        var g = a.s.h(e)
          , k = a.s.gb(e + 4)
          , l = a.s.Be(e + 7) & 128;
        k || (k = 65536);
        h.set(a.s.lb.subarray(g, g + k), f);
        f += k;
        e += 8
    } while (!l);
    a.buffer.set(d, h, () => {
        Mf(a, a.D, c);
        a.H = 80;
        U(a);
        a.l.g &= -2;
        a.D = -1
    }
    );
    Nf(a, b)
}
function Vf(a) {
    return ((a.Ea & 255 | a.Ha << 8 & 65280) * a.F + a.head) * a.A + (a.Xa & 255) - 1
}
function Uf(a) {
    return a.Xa & 255 | a.Ea << 8 & 65280 | a.Ha << 16 & 16711680 | (a.head & 15) << 24
}
function Tf(a) {
    return (a.Xa & 255 | a.Ea << 8 & 65280 | a.Ha << 16 & 16711680 | a.Xa >> 8 << 24 & 4278190080) >>> 0
}
function Bf(a, b) {
    return b ? Tf(a) : a.Bf ? Uf(a) : Vf(a)
}
function Af(a, b) {
    b ? (a = a.sa,
    0 === a && (a = 65536)) : (a = a.sa & 255,
    0 === a && (a = 256));
    return a
}
function Ef(a) {
    const b = Math.min(16383, a.K)
      , c = (g, k, l, m) => {
        k <<= 1;
        var p = l << 1;
        l = k + p;
        g.fill(32, k, p);
        for (p = 0; p < m.length && k < l; p++)
            p & 1 ? (g[k] = m.charCodeAt(p),
            k += 2) : g[k + 1] = m.charCodeAt(p)
    }
      , d = a.B ? 34112 : 64
      , e = 160 === a.D ? 0 : 1031
      , f = a.B ? 16928 : 16384
      , h = a.B ? 20480 : 29696;
    a.data.fill(0, 0, 512);
    Qf(a, [d & 255, d >> 8 & 255, b & 255, b >> 8 & 255, 0, 0, a.F & 255, a.F >> 8 & 255, a.A / 512 & 255, a.A / 512 >> 8 & 255, 0, 2, a.A & 255, a.A >> 8 & 255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 2, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 128, 0, 1, 0, 0, 2, 0, 0, 0, 2, 0, 2, 7, 0, b & 255, b >> 8 & 255, a.F & 255, a.F >> 8 & 255, a.A, 0, a.j & 255, a.j >> 8 & 255, a.j >> 16 & 255, a.j >> 24 & 255, 0, 0, a.j & 255, a.j >> 8 & 255, a.j >> 16 & 255, a.j >> 24 & 255, 0, 0, e & 255, e >> 8 & 255, 0, 0, 30, 0, 30, 0, 30, 0, 30, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, f & 255, f >> 8 & 255, h & 255, h >> 8 & 255, 0, 64, f & 255, f >> 8 & 255, h & 255, h >> 8 & 255, 0, 64, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 96, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, a.j & 255, a.j >> 8 & 255, a.j >> 16 & 255, a.j >> 24 & 255]);
    c(a.data, 10, 10, `8086-86${a.N}${a.Ua}`);
    c(a.data, 23, 4, "1.00");
    c(a.data, 27, 20, a.B ? "v86 ATAPI CD-ROM" : "v86 ATA HD");
    a.h = 512;
    a.g = 512
}
function Df(a, b) {
    Cf(a, b);
    a.X.fill(0, 0, b + 3 >> 2)
}
function Cf(a, b) {
    a.data.length < b && (a.data = new Uint8Array(b + 3 & -4),
    a.ga = new Uint16Array(a.data.buffer),
    a.X = new Int32Array(a.data.buffer));
    a.h = b;
    a.i = 0
}
function Qf(a, b) {
    Cf(a, b.length);
    a.data.set(b)
}
function Pf(a) {
    a.v.send("ide-read-start")
}
function Rf(a, b) {
    a.v.send("ide-read-end", [a.N, b, b / a.o | 0])
}
function Nf(a, b) {
    a.v.send("ide-write-end", [a.N, b, b / a.o | 0])
}
n.ra = function(a, b, c) {
    const d = this.ab++;
    this.Z.add(d);
    this.buffer.get(a, b, e => {
        this.Pa.delete(d) ? this.Z.has(d) : (this.Z.delete(d),
        c(e))
    }
    )
}
;
n.ia = function() {
    var a = [];
    a[0] = this.sa;
    a[1] = this.K;
    a[2] = this.Ha;
    a[3] = this.Ea;
    a[4] = this.i;
    a[5] = 0;
    a[6] = 0;
    a[7] = 0;
    a[8] = 0;
    a[9] = this.Te;
    a[10] = this.Oa;
    a[11] = this.head;
    a[12] = this.F;
    a[13] = this.B;
    a[14] = this.Bf;
    a[15] = this.uf;
    a[16] = this.data;
    a[17] = this.h;
    a[18] = this.Xa;
    a[19] = this.j;
    a[20] = this.o;
    a[21] = this.U;
    a[22] = this.A;
    a[23] = this.H;
    a[24] = this.ua;
    a[25] = this.D;
    a[26] = this.g;
    a[27] = this.Na;
    a[28] = this.buffer;
    return a
}
;
n.J = function(a) {
    this.sa = a[0];
    this.K = a[1];
    this.Ha = a[2];
    this.Ea = a[3];
    this.i = a[4];
    this.Te = a[9];
    this.Oa = a[10];
    this.head = a[11];
    this.F = a[12];
    this.B = a[13];
    this.Bf = a[14];
    this.uf = a[15];
    this.data = a[16];
    this.h = a[17];
    this.Xa = a[18];
    this.j = a[19];
    this.o = a[20];
    this.U = a[21];
    this.A = a[22];
    this.H = a[23];
    this.ua = a[24];
    this.D = a[25];
    this.g = a[26];
    this.Na = a[27];
    this.ga = new Uint16Array(this.data.buffer);
    this.X = new Int32Array(this.data.buffer);
    this.buffer && this.buffer.J(a[28]);
    this.na = this.B || this.buffer;
    this.T = !1
}
;
function Wf(a, b, c) {
    this.v = b;
    this.id = a.u.fa ? 1 : 0;
    this.status = 1;
    this.ze = c;
    this.la = new Uint8Array([0, 34, 21, 255 * Math.random() | 0, 255 * Math.random() | 0, 255 * Math.random() | 0]);
    this.v.send("net" + this.id + "-mac", Fe(this.la));
    b = [];
    for (c = 0; 1 > c; ++c)
        b.push({
            Ka: 1024,
            Za: 0
        }),
        b.push({
            Ka: 1024,
            Za: 1
        });
    b.push({
        Ka: 16,
        Za: 2
    });
    this.P = new Qe(a,{
        name: "virtio-net",
        fb: 80,
        ke: 4161,
        Nf: 1,
        ie: {
            Qa: 51200,
            $: b,
            features: [5, 16, 22, 3, 17, 23, 32],
            Vg: () => {}
        },
        notification: {
            Qa: 51456,
            yg: !1,
            hg: [ () => {}
            , d => {
                const e = this.P.$[d];
                for (; Re(e); ) {
                    const f = Se(e)
                      , h = new Uint8Array(f.Mb);
                    Te(f, h);
                    this.v.send("net" + this.id + "-send", h.subarray(12));
                    this.v.send("eth-transmit-end", [h.length - 12]);
                    $e(this.P.$[d], f)
                }
                af(this.P.$[d])
            }
            , d => {
                if (2 === d)
                    for (var e = this.P.$[d]; Re(e); ) {
                        const f = Se(e)
                          , h = new Uint8Array(f.Mb);
                        Te(f, h);
                        const g = K(["b", "b"], h, {
                            offset: 0
                        });
                        switch (g[0] << 8 | g[1]) {
                        case 1024:
                            K(["h"], h, {
                                offset: 2
                            });
                            this.nd(d, f, new Uint8Array([0]));
                            break;
                        case 257:
                            this.la = h.subarray(2, 8);
                            this.nd(d, f, new Uint8Array([0]));
                            this.v.send("net" + this.id + "-mac", Fe(this.la));
                            break;
                        default:
                            this.nd(d, f, new Uint8Array([1]));
                            return
                        }
                    }
            }
            ]
        },
        Lb: {
            Qa: 50944
        },
        pf: {
            Qa: 50688,
            Ic: [0, 1, 2, 3, 4, 5].map( (d, e) => ({
                bytes: 1,
                name: "mac_" + e,
                read: () => this.la[e],
                write: () => {}
            })).concat([{
                bytes: 2,
                name: "status",
                read: () => this.status,
                write: () => {}
            }, {
                bytes: 2,
                name: "max_pairs",
                read: () => 1,
                write: () => {}
            }, {
                bytes: 2,
                name: "mtu",
                read: () => 1500,
                write: () => {}
            }])
        }
    });
    this.v.register("net" + this.id + "-receive", d => {
        this.v.send("eth-receive-end", [d.length]);
        const e = new Uint8Array(12 + d.byteLength);
        (new DataView(e.buffer,e.byteOffset,e.byteLength)).setInt16(10, 1);
        e.set(d, 12);
        d = this.P.$[0];
        Re(d) ? (d = Se(d),
        Ze(d, e),
        $e(this.P.$[0], d),
        af(this.P.$[0])) : console.log("No buffer to write into!")
    }
    , this)
}
Wf.prototype.ia = function() {
    const a = [];
    a[0] = this.P;
    a[1] = this.id;
    a[2] = this.la;
    return a
}
;
Wf.prototype.J = function(a) {
    this.P.J(a[0]);
    this.id = a[1];
    this.ze && (this.la = a[2],
    this.v.send("net" + this.id + "-mac", Fe(this.la)))
}
;
Wf.prototype.reset = function() {
    this.P.reset()
}
;
Wf.prototype.nd = function(a, b, c) {
    Ze(b, c);
    $e(this.P.$[a], b);
    af(this.P.$[a])
}
;
const Xf = Uint32Array.from([655360, 655360, 720896, 753664])
  , Yf = Uint32Array.from([131072, 65536, 32768, 32768]);
function Zf(a, b, c, d) {
    this.s = a;
    this.v = b;
    this.screen = c;
    this.ma = d;
    this.U = 0;
    this.Xc = 14;
    this.Td = 15;
    this.yb = 80;
    this.hd = 25;
    this.de = this.l = this.Ld = this.Bb = 0;
    this.fd = [];
    this.ce = this.g = 0;
    this.Tc = new Uint8Array(25);
    this.K = this.ba = this.be = this.Cb = this.B = this.F = this.ad = this.cd = this.o = 0;
    this.h = !1;
    this.Z = new Int32Array(256);
    this.D = 0;
    this.Uf = 45253;
    this.X = this.A = 0;
    this.j = !1;
    this.ua = 32;
    this.Sd = this.Rd = this.Tb = this.xc = 0;
    void 0 === this.ma || 262144 > this.ma ? this.ma = 262144 : 268435456 < this.ma ? this.ma = 268435456 : this.ma = sa(this.ma);
    this.R = [52, 18, 17, 17, 3, 1, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 8, 14680064, 57344, 224, 0, 0, 0, 0, 0, 0, 191, 254, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 244, 26, 0, 17, 0, 0, 190, 254, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.fb = 144;
    this.Pb = [{
        size: this.ma
    }];
    this.di = 65536;
    this.Vj = 4272947200;
    this.name = "vga";
    this.kc = this.Yc = this.jc = this.na = 0;
    this.Ua = 255;
    this.Pa = new Uint8Array(16);
    this.T = -1;
    this.jd = 32;
    this.ic = this.ed = this.Sc = this.i = 0;
    this.Pd = -1;
    this.Ab = 15;
    this.Ub = this.Qd = 0;
    this.Zc = -1;
    this.vc = this.zb = this.ae = this.Na = 0;
    this.Zd = 255;
    this.aa = this.Wb = this.Vb = this.tc = this.$d = this.md = 0;
    this.N = this.Ke = 255;
    this.mc = !1;
    b = a.C;
    u(b, 960, this, this.Dk);
    x(b, 960, this, this.mi, this.Ck);
    x(b, 961, this, this.ni);
    u(b, 962, this, this.Ek);
    b.kd(964, this, this.Gk, this.Ik);
    x(b, 964, this, this.Fk);
    x(b, 965, this, this.Hk);
    b.kd(974, this, this.Tk, this.Vk);
    x(b, 974, this, this.Sk);
    x(b, 975, this, this.Uk);
    x(b, 966, this, this.Jk);
    u(b, 966, this, this.Kk);
    u(b, 967, this, this.Mk);
    x(b, 967, this, this.Lk);
    u(b, 968, this, this.Ok);
    x(b, 968, this, this.Nk);
    u(b, 969, this, this.Qk);
    x(b, 969, this, this.Pk);
    x(b, 972, this, this.Rk);
    u(b, 980, this, this.Yg, this.pi);
    u(b, 981, this, this.tg, this.si);
    x(b, 980, this, this.oi);
    x(b, 981, this, this.Zg, this.ri);
    u(b, 948, this, this.Yg, this.pi);
    u(b, 949, this, this.tg, this.si);
    x(b, 948, this, this.oi);
    x(b, 949, this, this.Zg, this.ri);
    x(b, 970, this, function() {
        return 0
    });
    x(b, 986, this, this.ti);
    x(b, 954, this, this.ti);
    this.Yd = -1;
    this.ab = 0;
    u(b, 462, this, void 0, this.Xj);
    u(b, 463, this, void 0, this.Zj);
    x(b, 463, this, void 0, this.Yj);
    c = a.$i(this.ma) >>> 0;
    this.Oe = t(Uint8Array, a.La, c, this.ma);
    this.Vd = this.ma;
    this.Ud = 0;
    this.Xd = this.ma;
    this.Wd = 0;
    this.zc = null;
    this.ga = new Uint8Array(262144);
    this.Le = new Uint8Array(this.ga.buffer,0,65536);
    this.Me = new Uint8Array(this.ga.buffer,65536,65536);
    this.Kd = new Uint8Array(this.ga.buffer,131072,65536);
    this.Ne = new Uint8Array(this.ga.buffer,196608,65536);
    this.ld = new Uint8Array(524288);
    $a(b, 655360, 131072, e => $f(this, e), (e, f) => {
        if (this.j)
            this.s.Fg((e - 655360 | this.xc) + 3758096384 | 0, f);
        else {
            var h = this.tc >> 2 & 3;
            e -= Xf[h];
            if (!(0 > e || e >= Yf[h]))
                if (this.h) {
                    var g = f;
                    f = ag(this.Zd);
                    var k = bg(this.md);
                    h = bg(this.$d);
                    switch (this.zb & 3) {
                    case 0:
                        g = (g | g << 8) >>> (this.vc & 7) & 255;
                        var l = ag(g);
                        g = bg(this.md);
                        l = cg(this, (l | h & g) & (~h | g), this.D);
                        l = f & l | ~f & this.D;
                        break;
                    case 1:
                        l = this.D;
                        break;
                    case 2:
                        l = bg(g);
                        l = cg(this, l, this.D);
                        l = f & l | ~f & this.D;
                        break;
                    case 3:
                        g = (g | g << 8) >>> (this.vc & 7) & 255,
                        f &= ag(g),
                        l = f & k | ~f & this.D
                    }
                    f = 15;
                    switch (this.Qd & 12) {
                    case 0:
                        f = 5 << (e & 1);
                        e &= -2;
                        break;
                    case 8:
                    case 12:
                        f = 1 << (e & 3),
                        e &= -4
                    }
                    f &= this.Ab;
                    f & 1 && (this.Le[e] = l >> 0 & 255);
                    f & 2 && (this.Me[e] = l >> 8 & 255);
                    f & 4 && (this.Kd[e] = l >> 16 & 255);
                    f & 8 && (this.Ne[e] = l >> 24 & 255);
                    l = dg(this, e);
                    f = l + 7;
                    l < this.Xd && (this.Xd = l);
                    f > this.Wd && (this.Wd = f);
                    l < this.Vd && (this.Vd = l);
                    f > this.Ud && (this.Ud = f)
                } else if (this.Ab & 3) {
                    if (h = e,
                    this.ga[h] = f,
                    e = Math.max(this.yb, 2 * this.ba),
                    h >> 1 >= this.g ? (g = (h >> 1) - this.g,
                    l = g / e | 0,
                    e = g % e) : (g = h >> 1,
                    l = (g / e | 0) + eg(this, this.K),
                    e = g % e),
                    !(e >= this.yb || l >= this.hd)) {
                        h & 1 ? (g = f,
                        f = this.ga[h & -2]) : g = this.ga[h | 1];
                        var m = this.i & 8;
                        h = (m && g & 128 ? this.screen.o : 0) | (!this.mc || g & 8 ? 0 : this.screen.A);
                        k = this.mc ? 7 : 15;
                        m = m ? 7 : 15;
                        this.v.send("screen-put-char", [l, e, f]);
                        this.screen.j(l, e, f, h, this.Z[this.Ua & this.Pa[g >> 4 & m]], this.Z[this.Ua & this.Pa[g & k]])
                    }
                } else
                    this.Ab & 4 && (this.Kd[e] = f)
        }
    }
    );
    qe(a.u.eb, this)
}
n = Zf.prototype;
n.ia = function() {
    var a = [];
    a[0] = this.ma;
    a[1] = this.U;
    a[2] = this.Xc;
    a[3] = this.Td;
    a[4] = this.yb;
    a[5] = this.hd;
    a[6] = this.ga;
    a[7] = this.kc;
    a[8] = this.g;
    a[9] = this.h;
    a[10] = this.Z;
    a[11] = this.D;
    a[12] = this.Vb;
    a[13] = this.Wb;
    a[14] = this.tc;
    a[15] = this.A;
    a[16] = this.X;
    a[17] = this.o;
    a[18] = this.j;
    a[19] = this.ua;
    a[20] = this.xc;
    a[21] = this.Tb;
    a[22] = this.na;
    a[23] = this.jc;
    a[24] = this.Yc;
    a[25] = this.Pa;
    a[26] = this.Pd;
    a[27] = this.Ab;
    a[28] = this.Qd;
    a[29] = this.Zc;
    a[30] = this.ae;
    a[31] = this.zb;
    a[32] = this.vc;
    a[33] = this.Zd;
    a[34] = this.aa;
    a[35] = this.Ke;
    a[36] = this.N;
    a[37] = this.Yd;
    a[38] = this.ab;
    a[39] = this.Oe;
    a[41] = this.T;
    a[42] = this.ba;
    a[43] = this.md;
    a[44] = this.$d;
    a[45] = this.ce;
    a[46] = this.Tc;
    a[47] = this.cd;
    a[48] = this.ad;
    a[49] = this.F;
    a[50] = this.B;
    a[51] = this.Cb;
    a[52] = this.be;
    a[53] = this.ba;
    a[54] = this.jd;
    a[55] = this.i;
    a[56] = this.Sc;
    a[57] = this.ed;
    a[58] = this.ic;
    a[59] = this.Ub;
    a[60] = this.K;
    a[61] = this.ld;
    a[62] = this.Ua;
    a[63] = this.Na;
    a[64] = this.mc;
    return a
}
;
n.J = function(a) {
    this.ma = a[0];
    this.U = a[1];
    this.Xc = a[2];
    this.Td = a[3];
    this.yb = a[4];
    this.hd = a[5];
    a[6] && this.ga.set(a[6]);
    this.kc = a[7];
    this.g = a[8];
    this.h = a[9];
    this.Z = a[10];
    this.D = a[11];
    this.Vb = a[12];
    this.Wb = a[13];
    this.tc = a[14];
    this.A = a[15];
    this.X = a[16];
    this.o = a[17];
    this.j = a[18];
    this.ua = a[19];
    this.xc = a[20];
    this.Tb = a[21];
    this.na = a[22];
    this.jc = a[23];
    this.Yc = a[24];
    this.Pa = a[25];
    this.Pd = a[26];
    this.Ab = a[27];
    this.Qd = a[28];
    this.Zc = a[29];
    this.ae = a[30];
    this.zb = a[31];
    this.vc = a[32];
    this.Zd = a[33];
    this.aa = a[34];
    this.Ke = a[35];
    this.N = a[36];
    this.Yd = a[37];
    this.ab = a[38];
    this.Oe.set(a[39]);
    this.T = a[41];
    this.ba = a[42];
    this.md = a[43];
    this.$d = a[44];
    this.ce = a[45];
    this.Tc.set(a[46]);
    this.cd = a[47];
    this.ad = a[48];
    this.F = a[49];
    this.B = a[50];
    this.Cb = a[51];
    this.be = a[52];
    this.ba = a[53];
    this.jd = a[54];
    this.i = a[55];
    this.Sc = a[56];
    this.ed = a[57];
    this.ic = a[58];
    this.Ub = a[59];
    this.K = a[60];
    a[61] && this.ld.set(a[61]);
    this.Ua = void 0 === a[62] ? 255 : a[62];
    this.Na = void 0 === a[63] ? 0 : a[63];
    this.mc = void 0 === a[64] ? 0 : a[64];
    this.screen.g(this.h);
    this.h ? (this.Ld = this.Bb = 0,
    this.j ? (fg(this, this.A, this.X, this.A, this.X, this.ua),
    gg(this)) : (hg(this),
    gg(this),
    ig(this))) : (jg(this, !0),
    kg(this, this.yb, this.hd),
    lg(this),
    mg(this),
    ng(this));
    og(this)
}
;
function $f(a, b) {
    if (a.j)
        return a.s.Be((b - 655360 | a.xc) + 3758096384 | 0);
    var c = a.tc >> 2 & 3;
    b -= Xf[c];
    if (0 > b || b >= Yf[c])
        return 0;
    a.D = a.Le[b];
    a.D |= a.Me[b] << 8;
    a.D |= a.Kd[b] << 16;
    a.D |= a.Ne[b] << 24;
    if (a.zb & 8)
        return c = 255,
        a.Wb & 1 && (c &= a.Le[b] ^ ~(a.Vb & 1 ? 255 : 0)),
        a.Wb & 2 && (c &= a.Me[b] ^ ~(a.Vb & 2 ? 255 : 0)),
        a.Wb & 4 && (c &= a.Kd[b] ^ ~(a.Vb & 4 ? 255 : 0)),
        a.Wb & 8 && (c &= a.Ne[b] ^ ~(a.Vb & 8 ? 255 : 0)),
        c;
    c = a.ae;
    a.h ? a.Qd & 8 ? (c = b & 3,
    b &= -4) : a.zb & 16 && (c = b & 1,
    b &= -2) : c &= 3;
    return a.ga[c << 16 | b]
}
function ag(a) {
    return a | a << 8 | a << 16 | a << 24
}
function bg(a) {
    return (a & 1 ? 255 : 0) | (a & 2 ? 255 : 0) << 8 | (a & 4 ? 255 : 0) << 16 | (a & 8 ? 255 : 0) << 24
}
function cg(a, b, c) {
    switch (a.vc & 24) {
    case 8:
        return b & c;
    case 16:
        return b | c;
    case 24:
        return b ^ c
    }
    return b
}
function pg(a) {
    const b = eg(a, a.K)
      , c = Math.max(0, 2 * (2 * a.ba - a.yb))
      , d = a.i & 8
      , e = a.mc ? 7 : 15
      , f = d ? 7 : 15
      , h = a.screen.o
      , g = a.screen.A;
    let k = a.g << 1;
    for (let l = 0; l < a.hd; l++) {
        l === b && (k = 0);
        for (let m = 0; m < a.yb; m++) {
            const p = a.ga[k]
              , r = a.ga[k | 1]
              , v = (d && r & 128 ? h : 0) | (!a.mc || r & 8 ? 0 : g);
            a.v.send("screen-put-char", [l, m, p]);
            a.screen.j(l, m, p, v, a.Z[a.Ua & a.Pa[r >> 4 & f]], a.Z[a.Ua & a.Pa[r & e]]);
            k += 2
        }
        k += c
    }
}
function ng(a) {
    var b = Math.max(a.yb, 2 * a.ba);
    let c;
    a.U >= a.g ? (c = (a.U - a.g) / b | 0,
    b = (a.U - a.g) % b) : (c = (a.U / b | 0) + eg(a, a.K),
    b = a.U % b);
    a.screen.F(c, b)
}
function og(a) {
    a.h ? a.j ? a.s.cd() : (a.Vd = 0,
    a.Ud = 524288) : pg(a)
}
function ig(a) {
    a.h && !a.j && (a.Xd = 0,
    a.Wd = 524288,
    og(a))
}
n.wa = function() {}
;
function qg(a) {
    var b = 128 + (~a.Cb & a.o & 64);
    b -= a.Cb & 64;
    b -= a.i & 64;
    return b >>> 6
}
function dg(a, b) {
    var c = qg(a);
    if (~a.o & 3) {
        var d = b - a.g;
        d &= a.o << 13 | -24577;
        d <<= c;
        var e = d / a.l | 0;
        d %= a.l;
        switch (a.o & 3) {
        case 2:
            e = e << 1 | b >> 13 & 1;
            break;
        case 1:
            e = e << 1 | b >> 14 & 1;
            break;
        case 0:
            e = e << 2 | b >> 13 & 3
        }
        return e * a.l + d + (a.g << c)
    }
    return b << c
}
function eg(a, b) {
    a.aa & 128 && (b >>>= 1);
    b = Math.ceil(b / (1 + (a.aa & 31)));
    a.o & 1 || (b <<= 1);
    a.o & 2 || (b <<= 1);
    return b
}
function kg(a, b, c) {
    a.yb = b;
    a.hd = c;
    a.screen.i(b, c);
    a.v.send("screen-set-size", [b, c, 0])
}
function fg(a, b, c, d, e, f) {
    d = Math.max(d, 1);
    e = Math.max(e, 1);
    if (a.Bb !== b || a.Ld !== c || a.l !== d || a.de !== e) {
        a.Bb = b;
        a.Ld = c;
        a.l = d;
        a.de = e;
        if ("undefined" !== typeof ImageData) {
            const h = d * e
              , g = a.s.Zi(h) >>> 0;
            a.jf = g;
            a.zc = new ImageData(new Uint8ClampedArray(a.s.La.buffer,g,4 * h),d,e);
            a.s.cd()
        }
        a.screen.h(b, c);
        a.v.send("screen-set-size", [b, c, f])
    }
}
function hg(a) {
    if (!a.j) {
        var b = Math.min(1 + a.cd, a.ad)
          , c = Math.min(1 + a.F, a.B);
        if (b && c)
            if (a.h) {
                b <<= 3;
                var d = a.ba << 4
                  , e = 4;
                a.i & 64 ? (b >>>= 1,
                d >>>= 1,
                e = 8) : a.i & 2 && (e = 1);
                c = eg(a, c);
                var f = Yf[0];
                var h = a.ba << 2;
                a.Cb & 64 ? h <<= 1 : a.o & 64 && (h >>>= 1);
                fg(a, b, c, d, h ? Math.ceil(f / h) : c, e);
                rg(a);
                gg(a)
            } else
                a.aa & 128 && (c >>>= 1),
                d = c / (1 + (a.aa & 31)) | 0,
                b && d && kg(a, b, d)
    }
}
function gg(a) {
    a.h || pg(a);
    if (a.j)
        a.fd = [];
    else if (a.l && a.Bb)
        if (!a.jd || a.Ub & 32)
            a.fd = [],
            a.screen.N();
        else {
            var b = a.ce
              , c = a.ed;
            a.i & 64 && (c >>>= 1);
            var d = a.be >> 5 & 3
              , e = dg(a, b + d);
            b = e / a.l | 0;
            var f = e % a.l + c;
            e = eg(a, 1 + a.K);
            e = Math.min(e, a.Ld);
            var h = a.Ld - e;
            a.fd = [];
            f = -f;
            for (var g = 0; f < a.Bb; f += a.l,
            g++)
                a.fd.push({
                    zc: a.zc,
                    gh: f,
                    hh: 0,
                    Xf: 0,
                    Yf: b + g,
                    Jg: a.l,
                    Ig: e
                });
            b = 0;
            a.i & 32 || (b = dg(a, d) + c);
            f = -b;
            for (g = 0; f < a.Bb; f += a.l,
            g++)
                a.fd.push({
                    zc: a.zc,
                    gh: f,
                    hh: e,
                    Xf: 0,
                    Yf: g,
                    Jg: a.l,
                    Ig: h
                })
        }
}
function rg(a) {
    a.N |= 8;
    a.ce !== a.g && (a.ce = a.g,
    gg(a))
}
function mg(a) {
    var b = a.aa & 31;
    const c = Math.min(b, a.Xc & 31);
    b = Math.min(b, a.Td & 31);
    a.screen.K(c, b, !(a.Xc & 32) && c < b)
}
n.Dk = function(a) {
    if (-1 === this.T)
        this.T = a & 31,
        this.jd !== (a & 32) && (this.jd = a & 32,
        gg(this));
    else {
        if (16 > this.T)
            this.Pa[this.T] = a,
            this.i & 64 || og(this);
        else
            switch (this.T) {
            case 16:
                if (this.i !== a) {
                    var b = this.i;
                    this.i = a;
                    const c = 0 !== (a & 1);
                    this.j || this.h === c || (this.h = c,
                    this.screen.g(this.h));
                    (b ^ a) & 64 && ig(this);
                    hg(this);
                    og(this);
                    jg(this, !1)
                }
                break;
            case 18:
                this.Sc !== a && (this.Sc = a,
                og(this));
                break;
            case 19:
                this.ed !== a && (this.ed = a & 15,
                gg(this));
                break;
            case 20:
                this.ic !== a && (this.ic = a,
                og(this))
            }
        this.T = -1
    }
}
;
n.mi = function() {
    return (this.T | this.jd) & 255
}
;
n.Ck = function() {
    return this.mi() | this.ni() << 8 & 65280
}
;
n.ni = function() {
    if (16 > this.T)
        return this.Pa[this.T] & 255;
    switch (this.T) {
    case 16:
        return this.i;
    case 18:
        return this.Sc;
    case 19:
        return this.ed;
    case 20:
        return this.ic
    }
    return 255
}
;
n.Ek = function(a) {
    this.Ke = a
}
;
n.Gk = function(a) {
    this.Pd = a
}
;
n.Fk = function() {
    return this.Pd
}
;
n.Ik = function(a) {
    switch (this.Pd) {
    case 1:
        var b = this.Ub;
        this.Ub = a;
        (b ^ a) & 32 && gg(this);
        jg(this, !1);
        break;
    case 2:
        b = this.Ab;
        this.Ab = a;
        this.h || !(b & 4) || this.Ab & 4 || jg(this, !0);
        break;
    case 3:
        b = this.Na;
        this.Na = a;
        this.h || b === a || lg(this);
        break;
    case 4:
        this.Qd = a
    }
}
;
n.Hk = function() {
    switch (this.Pd) {
    case 1:
        return this.Ub;
    case 2:
        return this.Ab;
    case 3:
        return this.Na;
    case 4:
        return this.Qd;
    case 6:
        return 18
    }
    return 0
}
;
n.Kk = function(a) {
    this.Ua !== a && (this.Ua = a,
    og(this))
}
;
n.Jk = function() {
    return this.Ua
}
;
n.Mk = function(a) {
    this.Yc = 3 * a;
    this.kc &= 0
}
;
n.Lk = function() {
    return this.kc
}
;
n.Ok = function(a) {
    this.jc = 3 * a;
    this.kc |= 3
}
;
n.Nk = function() {
    return this.jc / 3 & 255
}
;
n.Qk = function(a) {
    var b = this.jc / 3 | 0
      , c = this.jc % 3
      , d = this.Z[b];
    if (0 === (this.ab & 32)) {
        a &= 63;
        const e = a & 1;
        a = a << 2 | e << 1 | e
    }
    d = 0 === c ? d & -16711681 | a << 16 : 1 === c ? d & -65281 | a << 8 : d & -256 | a;
    this.Z[b] !== d && (this.Z[b] = d,
    og(this));
    this.jc++
}
;
n.Pk = function() {
    var a = this.Z[this.Yc / 3 | 0] >> 8 * (2 - this.Yc % 3) & 255;
    this.Yc++;
    return this.ab & 32 ? a : a >> 2
}
;
n.Rk = function() {
    return this.Ke
}
;
n.Tk = function(a) {
    this.Zc = a
}
;
n.Sk = function() {
    return this.Zc
}
;
n.Vk = function(a) {
    switch (this.Zc) {
    case 0:
        this.md = a;
        break;
    case 1:
        this.$d = a;
        break;
    case 2:
        this.Vb = a;
        break;
    case 3:
        this.vc = a;
        break;
    case 4:
        this.ae = a;
        break;
    case 5:
        var b = this.zb;
        this.zb = a;
        (b ^ a) & 96 && ig(this);
        break;
    case 6:
        this.tc !== a && (this.tc = a,
        hg(this));
        break;
    case 7:
        this.Wb = a;
        break;
    case 8:
        this.Zd = a
    }
}
;
n.Uk = function() {
    switch (this.Zc) {
    case 0:
        return this.md;
    case 1:
        return this.$d;
    case 2:
        return this.Vb;
    case 3:
        return this.vc;
    case 4:
        return this.ae;
    case 5:
        return this.zb;
    case 6:
        return this.tc;
    case 7:
        return this.Wb;
    case 8:
        return this.Zd
    }
    return 0
}
;
n.Yg = function(a) {
    this.na = a
}
;
n.pi = function(a) {
    this.Yg(a & 255);
    this.tg(a >> 8 & 255)
}
;
n.oi = function() {
    return this.na
}
;
n.tg = function(a) {
    switch (this.na) {
    case 1:
        this.cd !== a && (this.cd = a,
        hg(this));
        break;
    case 2:
        this.ad !== a && (this.ad = a,
        hg(this));
        break;
    case 7:
        var b = this.F;
        this.F &= 255;
        this.F = this.F | a << 3 & 512 | a << 7 & 256;
        b !== this.F && hg(this);
        this.K = this.K & 767 | a << 4 & 256;
        b = this.B;
        this.B = this.B & 767 | a << 5 & 256;
        b !== this.B && hg(this);
        gg(this);
        break;
    case 8:
        this.be = a;
        gg(this);
        break;
    case 9:
        var c = this.aa;
        this.aa = a;
        this.K = this.K & 511 | a << 3 & 512;
        b = this.B;
        this.B = this.B & 511 | a << 4 & 512;
        ((c ^ this.aa) & 159 || b !== this.B) && hg(this);
        mg(this);
        gg(this);
        jg(this, !1);
        break;
    case 10:
        this.Xc = a;
        mg(this);
        break;
    case 11:
        this.Td = a;
        mg(this);
        break;
    case 12:
        (this.g >> 8 & 255) !== a && (this.g = this.g & 255 | a << 8,
        gg(this),
        ~this.o & 3 && ig(this));
        break;
    case 13:
        (this.g & 255) !== a && (this.g = this.g & 65280 | a,
        gg(this),
        ~this.o & 3 && ig(this));
        break;
    case 14:
        this.U = this.U & 255 | a << 8;
        ng(this);
        break;
    case 15:
        this.U = this.U & 65280 | a;
        ng(this);
        break;
    case 18:
        (this.F & 255) !== a && (this.F = this.F & 768 | a,
        hg(this));
        break;
    case 19:
        this.ba !== a && (this.ba = a,
        hg(this),
        ~this.o & 3 && ig(this));
        break;
    case 20:
        this.Cb !== a && (b = this.Cb,
        this.Cb = a,
        hg(this),
        (b ^ a) & 64 && ig(this));
        break;
    case 21:
        (this.B & 255) !== a && (this.B = this.B & 768 | a,
        hg(this));
        break;
    case 23:
        this.o !== a && (b = this.o,
        this.o = a,
        hg(this),
        (b ^ a) & 67 && ig(this));
        break;
    case 24:
        this.K = this.K & 768 | a;
        gg(this);
        break;
    default:
        this.na < this.Tc.length && (this.Tc[this.na] = a)
    }
}
;
n.si = function(a) {
    this.tg(a & 255)
}
;
n.Zg = function() {
    switch (this.na) {
    case 1:
        return this.cd;
    case 2:
        return this.ad;
    case 7:
        return this.F >> 7 & 2 | this.B >> 5 & 8 | this.K >> 4 & 16 | this.F >> 3 & 64;
    case 8:
        return this.be;
    case 9:
        return this.aa;
    case 10:
        return this.Xc;
    case 11:
        return this.Td;
    case 12:
        return this.g & 255;
    case 13:
        return this.g >> 8;
    case 14:
        return this.U >> 8;
    case 15:
        return this.U & 255;
    case 18:
        return this.F & 255;
    case 19:
        return this.ba;
    case 20:
        return this.Cb;
    case 21:
        return this.B & 255;
    case 23:
        return this.o;
    case 24:
        return this.K & 255
    }
    return this.na < this.Tc.length ? this.Tc[this.na] : 0
}
;
n.ri = function() {
    return this.Zg()
}
;
n.ti = function() {
    var a = this.N;
    this.h ? (this.N ^= 1,
    this.N &= 1) : (this.N & 1 && (this.N ^= 8),
    this.N ^= 1);
    this.T = -1;
    return a
}
;
n.Xj = function(a) {
    this.Yd = a
}
;
n.Zj = function(a) {
    const b = this.j;
    switch (this.Yd) {
    case 0:
        45248 <= a && 45253 >= a && (this.Uf = a);
        break;
    case 1:
        this.A = a;
        2560 < this.A && (this.A = 2560);
        break;
    case 2:
        this.X = a;
        1600 < this.X && (this.X = 1600);
        break;
    case 3:
        this.ua = a;
        break;
    case 4:
        (this.j = 1 === (a & 1)) && 0 === (a & 128) && this.Oe.fill(0);
        this.ab = a;
        break;
    case 5:
        this.xc = a << 16;
        break;
    case 8:
        this.Rd !== a && (this.Rd = a,
        this.Tb = this.Sd * this.A + this.Rd,
        og(this));
        break;
    case 9:
        this.Sd !== a && (this.Sd = a,
        this.Tb = this.Sd * this.A + this.Rd,
        og(this))
    }
    !this.j || this.A && this.X || (this.j = !1);
    this.j && !b && (this.Sd = this.Rd = this.Tb = 0,
    this.h = !0,
    this.screen.g(this.h),
    fg(this, this.A, this.X, this.A, this.X, this.ua));
    this.j || (this.xc = 0);
    gg(this)
}
;
n.Yj = function() {
    return sg(this, this.Yd)
}
;
function sg(a, b) {
    switch (b) {
    case 0:
        return a.Uf;
    case 1:
        return a.ab & 2 ? 2560 : a.A;
    case 2:
        return a.ab & 2 ? 1600 : a.X;
    case 3:
        return a.ab & 2 ? 32 : a.ua;
    case 4:
        return a.ab;
    case 5:
        return a.xc >>> 16;
    case 6:
        return a.Bb ? a.Bb : 1;
    case 8:
        return a.Rd;
    case 9:
        return a.Sd;
    case 10:
        return a.ma / 65536 | 0
    }
    return 255
}
n.fh = function() {
    if (this.h) {
        if (0 === this.zc.data.byteLength) {
            var a = new Uint8ClampedArray(this.s.La.buffer,this.jf,4 * this.l * this.de);
            this.zc = new ImageData(a,this.l,this.de);
            gg(this)
        }
        if (this.j) {
            a = 0;
            var b = this.X;
            if (8 === this.ua)
                for (var c = new Int32Array(this.s.La.buffer,this.jf,this.Bb * this.Ld), d = new Uint8Array(this.s.La.buffer,this.Oe.byteOffset,this.ma), e = 0; e < c.length; e++) {
                    var f = this.Z[d[e]];
                    c[e] = f & 65280 | f << 16 | f >> 16 | 4278190080
                }
            else
                this.s.dj(this.ua, this.Tb),
                e = 15 === this.ua ? 2 : this.ua / 8,
                a = ((this.s.aj[0] / e | 0) - this.Tb) / this.A | 0,
                b = (((this.s.Ri[0] / e | 0) - this.Tb) / this.A | 0) + 1;
            a < b && (a = Math.max(a, 0),
            b = Math.min(b, this.X),
            this.screen.l([{
                zc: this.zc,
                gh: 0,
                hh: a,
                Xf: 0,
                Yf: a,
                Jg: this.A,
                Ig: b - a
            }]))
        } else {
            a = Math.min(this.Wd | 15, 524287);
            e = qg(this);
            f = ~this.o & 3;
            b = this.zb & 96;
            c = this.i & 64;
            for (d = this.Xd & -16; d <= a; ) {
                var h = d >>> e;
                if (f) {
                    var g = d / this.l | 0
                      , k = d - this.l * g;
                    switch (f) {
                    case 1:
                        h = (g & 1) << 13;
                        g >>>= 1;
                        break;
                    case 2:
                        h = (g & 1) << 14;
                        g >>>= 1;
                        break;
                    case 3:
                        h = (g & 3) << 13,
                        g >>>= 2
                    }
                    h |= (g * this.l + k >>> e) + this.g
                }
                g = this.Le[h];
                k = this.Me[h];
                var l = this.Kd[h]
                  , m = this.Ne[h];
                h = new Uint8Array(8);
                switch (b) {
                case 0:
                    g <<= 0;
                    k <<= 1;
                    l <<= 2;
                    m <<= 3;
                    for (var p = 7; 0 <= p; p--)
                        h[7 - p] = g >> p & 1 | k >> p & 2 | l >> p & 4 | m >> p & 8;
                    break;
                case 32:
                    h[0] = g >> 6 & 3 | l >> 4 & 12;
                    h[1] = g >> 4 & 3 | l >> 2 & 12;
                    h[2] = g >> 2 & 3 | l >> 0 & 12;
                    h[3] = g >> 0 & 3 | l << 2 & 12;
                    h[4] = k >> 6 & 3 | m >> 4 & 12;
                    h[5] = k >> 4 & 3 | m >> 2 & 12;
                    h[6] = k >> 2 & 3 | m >> 0 & 12;
                    h[7] = k >> 0 & 3 | m << 2 & 12;
                    break;
                case 64:
                case 96:
                    h[0] = g >> 4 & 15,
                    h[1] = g >> 0 & 15,
                    h[2] = k >> 4 & 15,
                    h[3] = k >> 0 & 15,
                    h[4] = l >> 4 & 15,
                    h[5] = l >> 0 & 15,
                    h[6] = m >> 4 & 15,
                    h[7] = m >> 0 & 15
                }
                if (c)
                    for (g = p = 0; 4 > p; p++,
                    d++,
                    g += 2)
                        this.ld[d] = h[g] << 4 | h[g + 1];
                else
                    for (p = 0; 8 > p; p++,
                    d++)
                        this.ld[d] = h[p]
            }
            c = this.Vd;
            a = Math.min(this.Ud, 524287);
            b = new Int32Array(this.s.La.buffer,this.jf,this.l * this.de);
            e = 255;
            f = 0;
            this.i & 128 && (e &= 207,
            f |= this.ic << 4 & 48);
            if (this.i & 64)
                for (; c <= a; c++)
                    d = this.ld[c] & e | f,
                    d = this.Z[d],
                    b[c] = d & 65280 | d << 16 | d >> 16 | 4278190080;
            else
                for (e &= 63,
                f |= this.ic << 4 & 192; c <= a; c++)
                    d = this.Pa[this.ld[c] & this.Sc] & e | f,
                    d = this.Z[d],
                    b[c] = d & 65280 | d << 16 | d >> 16 | 4278190080;
            this.screen.l(this.fd)
        }
        this.Vd = this.ma;
        this.Ud = 0;
        this.Xd = this.ma;
        this.Wd = 0
    }
    rg(this)
}
;
function jg(a, b) {
    const c = a.aa & 31;
    if (c && !a.h) {
        const d = !!(a.Ub & 8);
        a.screen.B(c + 1, !d && !(a.Ub & 1), d, !!(a.i & 4), a.Kd, b)
    }
}
function lg(a) {
    const b = [0, 2, 4, 6, 1, 3, 5, 7]
      , c = (a.Na & 12) >> 2 | (a.Na & 32) >> 3
      , d = a.Na & 3 | (a.Na & 16) >> 2;
    a.mc = c !== d;
    a.screen.D(b[c], b[d]);
    og(a)
}
;const tg = "SWAP_IN SWAP_OUT MAJFLT MINFLT MEMFREE MEMTOT AVAIL CACHES HTLB_PGALLOC HTLB_PGFAIL".split(" ");
function ug(a, b) {
    this.v = b;
    this.j = this.h = this.g = this.i = 0;
    this.P = new Qe(a,{
        name: "virtio-balloon",
        fb: 88,
        ke: 4165,
        Nf: 5,
        ie: {
            Qa: 55296,
            $: [{
                Ka: 32,
                Za: 0
            }, {
                Ka: 32,
                Za: 0
            }, {
                Ka: 2,
                Za: 1
            }, {
                Ka: 64,
                Za: 2
            }],
            features: [1, 3, 32],
            Vg: () => {}
        },
        notification: {
            Qa: 55552,
            yg: !1,
            hg: [c => {
                const d = this.P.$[c];
                for (; Re(d); ) {
                    var e = Se(d);
                    const f = new Uint8Array(e.Mb);
                    Te(e, f);
                    $e(this.P.$[c], e);
                    e = f.byteLength / 4;
                    this.g += 0 === c ? e : -e
                }
                af(this.P.$[c])
            }
            , c => {
                var d = this.P.$[c];
                if (Re(d)) {
                    d = Se(d);
                    const e = new Uint8Array(d.Mb);
                    Te(d, e);
                    let f = {};
                    for (let h = 0; h < d.Mb; h += 10) {
                        let[g,k] = K(["h", "d"], e, {
                            offset: h
                        });
                        f[tg[g]] = k
                    }
                    $e(this.P.$[c], d);
                    this.o && this.o(f)
                }
            }
            , c => {
                const d = this.P.$[c];
                for (; Re(d); ) {
                    const f = Se(d);
                    if (0 < f.Mb) {
                        var e = new Uint8Array(f.Mb);
                        Te(f, e);
                        [e] = K(["w"], e, {
                            offset: 0
                        });
                        0 === e && (this.l && this.l(this.j),
                        1 < this.h && (this.h = 1),
                        e = this.P,
                        e.D = !0,
                        e.i & 4 && e.Sa(2))
                    }
                    if (0 < f.j)
                        for (new Uint8Array(0),
                        e = 0; e < f.i.length; ++e) {
                            let h = f.i[e];
                            this.j += h.$c;
                            this.P.s.md(h.Vf, h.$c)
                        }
                    $e(this.P.$[c], f)
                }
                af(this.P.$[c])
            }
            ]
        },
        Lb: {
            Qa: 55040
        },
        pf: {
            Qa: 54784,
            Ic: [{
                bytes: 4,
                name: "num_pages",
                read: () => this.i,
                write: () => {}
            }, {
                bytes: 4,
                name: "actual",
                read: () => this.g,
                write: () => {}
            }, {
                bytes: 4,
                name: "free_page_hint_cmd_id",
                read: () => this.h,
                write: () => {}
            }]
        }
    })
}
ug.prototype.ia = function() {
    const a = [];
    a[0] = this.P;
    a[1] = this.i;
    a[2] = this.g;
    return a
}
;
ug.prototype.J = function(a) {
    this.P.J(a[0]);
    this.i = a[1];
    this.g = a[2]
}
;
function vg(a, b, c, d) {
    var e = new Uint8Array(b);
    const f = new Uint16Array(b);
    var h = new Uint32Array(b)
      , g = e[497] || 4;
    if (43605 === f[255] && 1400005704 === (f[257] | f[258] << 16)) {
        var k = e[529];
        e[528] = 255;
        e[529] = k & -97 | 128;
        f[274] = 56832;
        f[253] = 65535;
        d += "\x00";
        h[138] = 581632;
        for (e = 0; e < d.length; e++)
            a[581632 + e] = d.charCodeAt(e);
        g = 512 * (g + 1);
        d = new Uint8Array(b,0,g);
        b = new Uint8Array(b,g);
        e = g = 0;
        c && (g = 67108864,
        e = c.byteLength,
        a.set(new Uint8Array(c), g));
        h[134] = g;
        h[135] = e;
        a.set(d, 524288);
        a.set(b, 1048576);
        a = new Uint8Array(512);
        (new Uint16Array(a.buffer))[0] = 43605;
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
        h = a[c] = 0;
        for (b = 0; b < a.length; b++)
            h += a[b];
        a[c] = -h;
        return {
            name: "genroms/kernel.bin",
            data: a
        }
    }
}
;function he(a, b, c) {
    this.Xi = c;
    this.Ma = b;
    wg(this);
    b = Object.create(null);
    b.m = this.Ma.exports.memory;
    for (var d of Object.keys(this.Ma.exports))
        d.startsWith("_") || d.startsWith("zstd") || d.endsWith("_js") || (b[d] = this.Ma.exports[d]);
    this.Xd = b;
    this.La = d = this.Ma.exports.memory;
    this.G = t(Uint32Array, d, 812, 1);
    this.lb = new Uint8Array(0);
    new Int32Array(this.lb.buffer);
    this.B = t(Uint8Array, d, 724, 8);
    this.Pa = t(Int32Array, d, 736, 8);
    this.Na = t(Uint32Array, d, 768, 8);
    this.A = t(Uint8Array, d, 512, 8);
    this.na = t(Int32Array, d, 800, 1);
    this.kc = t(Int32Array, d, 564, 1);
    this.jc = t(Int32Array, d, 568, 1);
    this.Wb = t(Int32Array, d, 572, 1);
    this.Vb = t(Int32Array, d, 576, 1);
    this.jd = t(Int32Array, d, 1128, 1);
    this.Sc = t(Uint32Array, d, 540, 8);
    this.ib = t(Int32Array, d, 580, 8);
    this.zb = t(Uint8Array, d, 612, 1);
    this.ba = t(Int32Array, d, 804, 1);
    this.ab = t(Int32Array, d, 808, 1);
    this.mc = t(Uint8Array, d, 616, 1);
    this.xc = t(Int32Array, d, 620, 1);
    this.Bb = t(Int32Array, d, 624, 1);
    this.ed = t(Int32Array, d, 636, 1);
    this.hd = t(Int32Array, d, 640, 1);
    this.fd = t(Int32Array, d, 644, 1);
    this.Tc = t(Int32Array, d, 648, 1);
    this.flags = t(Int32Array, d, 120, 1);
    this.Cb = t(Int32Array, d, 100, 1);
    this.vc = t(Int32Array, d, 96, 1);
    this.tc = t(Int32Array, d, 104, 1);
    t(Int32Array, d, 112, 1);
    this.Pd = t(Uint32Array, d, 960, 2);
    this.u = {};
    this.aa = t(Int32Array, d, 556, 1);
    this.Xc = t(Int32Array, d, 560, 1);
    t(Uint8Array, d, 548, 1);
    this.yb = t(Uint8Array, d, 552, 1);
    this.g = [];
    this.j = [];
    this.ga = [];
    this.i = [];
    this.nb = {
        Rg: null,
        Md: null
    };
    this.Pj = t(Uint32Array, d, 664, 1);
    this.o = t(Int32Array, d, 64, 8);
    this.Ub = t(Int32Array, d, 1152, 32);
    this.X = t(Uint8Array, d, 816, 1);
    this.X[0] = 255;
    this.Z = t(Uint8Array, d, 1032, 1);
    this.Z[0] = 0;
    this.D = t(Uint16Array, d, 1036, 1);
    this.D[0] = 895;
    this.Qd = t(Uint16Array, d, 1040, 1);
    this.Qd[0] = 0;
    this.N = t(Int32Array, d, 1048, 1);
    this.N[0] = 0;
    this.T = t(Int32Array, d, 1052, 1);
    this.T[0] = 0;
    this.U = t(Int32Array, d, 1044, 1);
    this.U[0] = 0;
    this.F = t(Int32Array, d, 1056, 1);
    this.F[0] = 0;
    this.K = t(Int32Array, d, 1060, 1);
    this.K[0] = 0;
    this.Zc = t(Int32Array, d, 832, 32);
    t(Int32Array, d, 824, 1);
    this.Ua = t(Uint16Array, d, 668, 8);
    this.Ab = t(Int32Array, d, 684, 8);
    this.Yc = t(Int32Array, d, 968, 8);
    this.aj = t(Uint32Array, d, 716, 1);
    this.Ri = t(Uint32Array, d, 720, 1);
    this.vb = [];
    this.Og = 0;
    this.yd = [];
    this.C = void 0;
    this.v = a;
    this.ad(0, 0);
    xg(this)
}
function Ua(a, b, c) {
    b.length && (a.l(c),
    a.l(c + b.length - 1),
    a.Wd(c, c + b.length),
    a.lb.set(b, c))
}
function wg(a) {
    const b = c => {
        const d = a.Ma.exports[c];
        console.assert(d, "Missing import: " + c);
        return d
    }
    ;
    a.ua = b("reset_cpu");
    b("getiopl");
    b("get_eflags");
    a.Td = b("handle_irqs");
    a.Yd = b("main_loop");
    a.Wi = b("set_jit_config");
    a.Be = b("read8");
    a.gb = b("read16");
    a.h = b("read32s");
    a.Fg = b("write8");
    a.Tf = b("write16");
    a.Ca = b("write32");
    a.l = b("in_mapped_range");
    b("fpu_load_tag_word");
    b("fpu_load_status_word");
    b("fpu_get_sti_f64");
    b("translate_address_system_read_js");
    a.Sd = b("get_seg_cs");
    b("get_real_eip");
    b("clear_tlb");
    a.Rd = b("full_clear_tlb");
    a.ld = b("update_state_flags");
    a.ad = b("set_tsc");
    a.Yi = b("store_current_tsc");
    a.Vi = b("set_cpuid_level");
    a.$d = b("pic_set_irq");
    a.Zd = b("pic_clear_irq");
    a.Vd = b("jit_clear_cache_js");
    a.Wd = b("jit_dirty_cache");
    a.Ld = b("codegen_finalize_finished");
    a.Kd = b("allocate_memory");
    a.md = b("zero_memory");
    a.Ud = b("is_memory_zeroed");
    a.$i = b("svga_allocate_memory");
    a.Zi = b("svga_allocate_dest_buffer");
    a.dj = b("svga_fill_pixel_buffer");
    a.cd = b("svga_mark_dirty");
    a.Tb = b("get_pic_addr_master");
    a.ic = b("get_pic_addr_slave");
    a.Oi = b("zstd_create_ctx");
    a.Qi = b("zstd_get_src_ptr");
    a.Pi = b("zstd_free_ctx");
    a.gf = b("zstd_read");
    a.hf = b("zstd_read_free");
    a.ae = b("port20_read");
    a.ce = b("port21_read");
    a.Oe = b("portA0_read");
    a.Uf = b("portA1_read");
    a.be = b("port20_write");
    a.de = b("port21_write");
    a.jf = b("portA0_write");
    a.Ui = b("portA1_write");
    a.Ke = b("port4D0_read");
    a.Me = b("port4D1_read");
    a.Le = b("port4D0_write");
    a.Ne = b("port4D1_write")
}
he.prototype.ia = function() {
    var a = [];
    a[0] = this.G[0];
    a[1] = new Uint8Array([...this.B, ...this.A]);
    a[2] = this.Pa;
    a[3] = this.Na;
    a[4] = this.na[0];
    a[5] = this.jc[0];
    a[6] = this.kc[0];
    a[7] = this.Vb[0];
    a[8] = this.Wb[0];
    a[9] = this.Sc[0];
    a[10] = this.ib;
    a[11] = this.zb[0];
    a[13] = this.ba[0];
    a[16] = this.ab[0];
    a[17] = this.mc[0];
    a[18] = this.xc[0];
    a[19] = this.Bb[0];
    a[22] = this.ed[0];
    a[23] = this.fd[0];
    a[24] = this.hd[0];
    a[25] = this.Tc[0];
    a[26] = this.flags[0];
    a[27] = this.Cb[0];
    a[28] = this.tc[0];
    a[30] = this.vc[0];
    a[37] = this.aa[0];
    a[38] = this.Xc[0];
    a[39] = this.o;
    a[40] = this.Ua;
    a[41] = this.Ab;
    a[42] = this.Yc;
    this.Yi();
    a[43] = this.Pd;
    a[45] = this.u.Sf;
    a[46] = this.u.Pe;
    a[47] = this.u.Gd;
    a[48] = this.u.eb;
    a[49] = this.u.Fb;
    a[50] = this.u.va;
    a[52] = this.u.Md;
    a[53] = this.u.Hf;
    a[54] = this.u.ph;
    a[55] = this.u.oe;
    this.u.Ib.Id ? a[85] = this.u.Ib : this.u.Ib.Qb?.kb.gm ? a[56] = this.u.Ib.Qb : a[57] = this.u.Ib.Qb;
    a[58] = this.u.sg;
    a[59] = this.u.fa;
    var b = new Uint8Array(this.La.buffer,this.Tb(),13)
      , c = new Uint8Array(this.La.buffer,this.ic(),13)
      , d = [];
    const e = [];
    d[0] = b[0];
    d[1] = b[1];
    d[2] = b[2];
    d[3] = b[3];
    d[4] = b[4];
    d[5] = e;
    d[6] = b[6];
    d[7] = b[7];
    d[8] = b[8];
    d[9] = b[9];
    d[10] = b[10];
    d[11] = b[11];
    d[12] = b[12];
    e[0] = c[0];
    e[1] = c[1];
    e[2] = c[2];
    e[3] = c[3];
    e[4] = c[4];
    e[5] = null;
    e[6] = c[6];
    e[7] = c[7];
    e[8] = c[8];
    e[9] = c[9];
    e[10] = c[10];
    e[11] = c[11];
    e[12] = c[12];
    a[60] = d;
    a[61] = this.u.eh;
    a[62] = this.vb;
    a[63] = this.u.ud;
    a[64] = this.jd[0];
    a[66] = this.Zc;
    a[67] = this.Ub;
    a[68] = this.X[0];
    a[69] = this.Z[0];
    a[70] = this.D[0];
    a[71] = this.N[0];
    a[72] = this.T[0];
    a[73] = this.F[0];
    a[74] = this.K[0];
    a[75] = this.U[0];
    c = this.lb.length >> 12;
    b = [];
    for (d = 0; d < c; d++)
        this.Ud(d << 12, 4096) || b.push(d);
    c = new za(c);
    d = new Uint8Array(b.length << 12);
    for (const [g,k] of b.entries())
        c.set(k, 1),
        b = k << 12,
        d.set(this.lb.subarray(b, b + 4096), g << 12);
    const {Uj: f, ej: h} = {
        ej: c,
        Uj: d
    };
    a[77] = f;
    a[78] = new Uint8Array(h.bc());
    a[79] = this.u.cf;
    a[80] = this.u.df;
    a[81] = this.u.ef;
    a[82] = this.u.Od;
    a[83] = this.u.Ie;
    a[84] = this.u.ff;
    return a
}
;
he.prototype.J = function(a) {
    this.G[0] = a[0];
    this.lb.length !== this.G[0] && console.warn("Note: Memory size mismatch. we=" + this.lb.length + " state=" + this.G[0]);
    8 === a[1].length ? (this.B.set(a[1]),
    this.A.fill(242),
    this.A[1] = 250) : 16 === a[1].length && (this.B.set(a[1].subarray(0, 8)),
    this.A.set(a[1].subarray(8, 16)));
    this.Pa.set(a[2]);
    this.Na.set(a[3]);
    this.na[0] = a[4];
    this.jc[0] = a[5];
    this.kc[0] = a[6];
    this.Vb[0] = a[7];
    this.Wb[0] = a[8];
    this.Sc[0] = a[9];
    this.ib.set(a[10]);
    this.zb[0] = a[11];
    this.ba[0] = a[13];
    this.ab[0] = a[16];
    this.mc[0] = a[17];
    this.xc[0] = a[18];
    this.Bb[0] = a[19];
    this.ed[0] = a[22];
    this.fd[0] = a[23];
    this.hd[0] = a[24];
    this.Tc[0] = a[25];
    this.flags[0] = a[26];
    this.Cb[0] = a[27];
    this.tc[0] = a[28];
    this.vc[0] = a[30];
    this.aa[0] = a[37];
    this.Xc[0] = a[38];
    this.o.set(a[39]);
    this.Ua.set(a[40]);
    this.Ab.set(a[41]);
    a[42] && this.Yc.set(a[42]);
    this.ad(a[43][0], a[43][1]);
    this.u.Sf && this.u.Sf.J(a[45]);
    this.u.Pe && this.u.Pe.J(a[46]);
    this.u.Gd && this.u.Gd.J(a[47]);
    this.u.Fb && this.u.Fb.J(a[49]);
    this.u.va && this.u.va.J(a[50]);
    this.u.Md && this.u.Md.J(a[52]);
    this.u.Hf && this.u.Hf.J(a[53]);
    this.u.ph && this.u.ph.J(a[54]);
    this.u.oe && this.u.oe.J(a[55]);
    if (a[56] || a[57]) {
        var b = [[void 0, void 0], [void 0, void 0]];
        b[0][0] = a[56] ? {
            kg: !0,
            buffer: this.u.O.buffer
        } : {
            kg: !1,
            buffer: this.u.Ib.Qb.kb.buffer
        };
        this.u.Ib = new sf(this,this.u.Ib.v,b);
        this.u.O = a[56] ? this.u.Ib.Qb.kb : void 0;
        this.u.Ib.Qb.J(a[56] || a[57])
    } else
        a[85] && this.u.Ib.J(a[85]);
    this.u.eb && this.u.eb.J(a[48]);
    this.u.sg && this.u.sg.J(a[58]);
    this.u.fa && this.u.fa.J(a[59]);
    b = a[60];
    var c = new Uint8Array(this.La.buffer,this.Tb(),13)
      , d = new Uint8Array(this.La.buffer,this.ic(),13);
    c[0] = b[0];
    c[1] = b[1];
    c[2] = b[2];
    c[3] = b[3];
    c[4] = b[4];
    var e = b[5];
    c[6] = b[6];
    c[7] = b[7];
    c[8] = b[8];
    c[9] = b[9];
    c[10] = b[10];
    c[11] = b[11];
    c[12] = b[12];
    d[0] = e[0];
    d[1] = e[1];
    d[2] = e[2];
    d[3] = e[3];
    d[4] = e[4];
    d[6] = e[6];
    d[7] = e[7];
    d[8] = e[8];
    d[9] = e[9];
    d[10] = e[10];
    d[11] = e[11];
    d[12] = e[12];
    this.u.eh && this.u.eh.J(a[61]);
    this.u.cf && this.u.cf.J(a[79]);
    this.u.df && this.u.df.J(a[80]);
    this.u.ef && this.u.ef.J(a[81]);
    this.u.Od && this.u.Od.J(a[82]);
    this.u.Ie && this.u.Ie.J(a[83]);
    this.u.ff && this.u.ff.J(a[84]);
    this.vb = a[62];
    this.u.ud && this.u.ud.J(a[63]);
    this.jd[0] = a[64];
    this.Zc.set(a[66]);
    this.Ub.set(a[67]);
    this.X[0] = a[68];
    this.Z[0] = a[69];
    this.D[0] = a[70];
    this.N[0] = a[71];
    this.T[0] = a[72];
    this.F[0] = a[73];
    this.K[0] = a[74];
    this.U[0] = a[75];
    b = new za(a[78].buffer);
    a = a[77];
    this.md(0, this.G[0]);
    c = this.G[0] >> 12;
    d = 0;
    for (e = 0; e < c; e++)
        if (b.get(e)) {
            const f = d << 12;
            this.lb.set(a.subarray(f, f + 4096), e << 12);
            d++
        }
    this.ld();
    this.Rd();
    this.Vd()
}
;
function Ce(a) {
    a.ua();
    a.vb = [];
    a.u.Sf && a.u.Sf.reset();
    a.u.Od && a.u.Od.reset();
    a.u.Ie && a.u.Ie.reset();
    a.u.Hf && a.u.Hf.reset();
    ke(a)
}
function yg(a, b, c) {
    b < c ? b = c : 0 > (b | 0) && (b = Math.pow(2, 31) - 131072);
    b = (b - 1 | 131071) + 1 | 0;
    console.assert(0 === a.G[0], "Expected uninitialised memory");
    a.G[0] = b;
    c = a.Kd(b);
    a.lb = t(Uint8Array, a.La, c, b);
    t(Uint32Array, a.La, c, b >> 2)
}
he.prototype.Jb = function(a, b) {
    yg(this, a.G || 67108864, a.Kb ? 67108864 : 1048576);
    a.qf && this.Wi(0, 1);
    a.qd && this.Vi(a.qd);
    this.yb[0] = +a.va;
    this.ua();
    var c = new Ya(this);
    this.C = c;
    this.nb.Rg = a.nb;
    this.nb.Md = a.Nd;
    ke(this);
    if (a.ub) {
        const e = vg(this.lb, a.ub, a.Kb, a.Eb || "");
        e && this.yd.push(e)
    }
    x(c, 179, this, function() {
        return 0
    });
    var d = 0;
    x(c, 146, this, function() {
        return d
    });
    u(c, 146, this, function(e) {
        d = e
    });
    x(c, 1297, this, function() {
        return this.Og < this.vb.length ? this.vb[this.Og++] : 0
    });
    u(c, 1296, this, void 0, function(e) {
        function f(k) {
            return new Uint8Array(Int32Array.of(k).buffer)
        }
        function h(k) {
            return k >> 8 | k << 8 & 65280
        }
        function g(k) {
            return k << 24 | k << 8 & 16711680 | k >> 8 & 65280 | k >>> 24
        }
        this.Og = 0;
        if (0 === e)
            this.vb = f(1431127377);
        else if (1 === e)
            this.vb = f(0);
        else if (3 === e)
            this.vb = f(this.G[0]);
        else if (5 === e)
            this.vb = f(1);
        else if (15 === e)
            this.vb = f(1);
        else if (13 === e)
            this.vb = new Uint8Array(16);
        else if (25 === e) {
            e = new Int32Array(4 + 64 * this.yd.length);
            const k = new Uint8Array(e.buffer);
            e[0] = g(this.yd.length);
            for (let l = 0; l < this.yd.length; l++) {
                const {name: m, data: p} = this.yd[l]
                  , r = 4 + 64 * l;
                e[r >> 2] = g(p.length);
                e[r + 4 >> 2] = h(49152 + l);
                for (let v = 0; v < m.length; v++)
                    k[r + 8 + v] = m.charCodeAt(v)
            }
            this.vb = k
        } else
            this.vb = 32768 <= e && 49152 > e ? f(0) : 49152 <= e && e - 49152 < this.yd.length ? this.yd[e - 49152].data : f(0)
    });
    x(c, 32, this, this.ae);
    x(c, 33, this, this.ce);
    x(c, 160, this, this.Oe);
    x(c, 161, this, this.Uf);
    u(c, 32, this, this.be);
    u(c, 33, this, this.de);
    u(c, 160, this, this.jf);
    u(c, 161, this, this.Ui);
    x(c, 1232, this, this.Ke);
    x(c, 1233, this, this.Me);
    u(c, 1232, this, this.Le);
    u(c, 1233, this, this.Ne);
    this.u = {};
    a.Qj && (this.u.eb = new ye(this),
    this.yb[0] && (this.u.ud = new oe(this),
    this.u.Pe = new le(this),
    this.u.va = new pe(this)),
    this.u.Gd = new Mb(this),
    zg(this, this.u.Gd, a),
    this.u.Fb = new Oa(this),
    this.u.Md = new Zf(this,b,a.screen,a.ma || 8388608),
    this.u.Hf = new bf(this,b),
    this.u.ph = new se(this,1016,b),
    a.cf && (this.u.cf = new se(this,760,b)),
    a.df && (this.u.df = new se(this,1E3,b)),
    a.ef && (this.u.ef = new se(this,744,b)),
    this.u.oe = new pf(this,a.V),
    c = [[void 0, void 0], [void 0, void 0]],
    a.L && (c[0][0] = {
        buffer: a.L
    },
    c[0][1] = {
        buffer: a.pb
    }),
    c[1][0] = {
        kg: !0,
        buffer: a.O
    },
    this.u.Ib = new sf(this,b,c),
    this.u.O = this.u.Ib.Id.kb,
    this.u.sg = new Qb(this,b),
    "ne2k" === a.dd.type ? this.u.fa = new Ke(this,b,a.ze,a.Nb) : "virtio" === a.dd.type && (this.u.Ie = new Wf(this,b,a.ze)),
    a.wc && (this.u.Sf = new Ag(a.wc,this,b)),
    a.Od && (this.u.Od = new Pe(this,b)),
    a.ff && (this.u.ff = new ug(this,b)),
    this.u.eh = new kb(this,b));
    a.Ob && (a = Bg(this, a.Ob, a.Kb, a.Eb)) && (this.nb.Rg ? this.yd.push(a) : this.o[0] = ab(this.C, 244))
}
;
function Bg(a, b, c, d) {
    if (8192 > b.byteLength) {
        var e = new Int32Array(2048);
        (new Uint8Array(e.buffer)).set(new Uint8Array(b))
    } else
        e = new Int32Array(b,0,2048);
    for (var f = 0; 8192 > f; f += 4) {
        if (464367618 === e[f >> 2]) {
            var h = e[f + 4 >> 2];
            if (464367618 + h + e[f + 8 >> 2] | 0)
                continue
        } else
            continue;
        var g = a;
        x(a.C, 244, a, function() {
            return 0
        }, function() {
            return 0
        }, function() {
            var m = 31860
              , p = 0;
            if (d) {
                p |= 4;
                g.Ca(31760, m);
                d += "\x00";
                var r = (new TextEncoder).encode(d);
                Ua(g, r, m);
                m += r.length
            }
            if (h & 2) {
                p |= 64;
                r = 0;
                g.Ca(31788, 0);
                g.Ca(31792, m);
                var v = 0;
                var B = !1;
                for (let y = 0; 4294967296 > y; y += 131072)
                    B && void 0 !== g.g[y >>> 17] ? (g.Ca(m, 20),
                    g.Ca(m + 4, v),
                    g.Ca(m + 8, 0),
                    g.Ca(m + 12, y - v),
                    g.Ca(m + 16, 0),
                    g.Ca(m + 20, 1),
                    m += 24,
                    r += 24,
                    B = !1) : B || void 0 !== g.g[y >>> 17] || (v = y,
                    B = !0);
                g.Ca(31788, r)
            }
            g.Ca(31744, p);
            r = p = 0;
            if (h & 65536) {
                p = e[f + 16 >> 2];
                var C = e[f + 20 >> 2];
                r = e[f + 24 >> 2];
                v = e[f + 28 >> 2];
                B = new Uint8Array(b,f - (e[f + 12 >> 2] - p),0 === C ? void 0 : C - p);
                Ua(g, B, p);
                p = v | 0;
                r = Math.max(C, r)
            } else if (1179403647 === e[0]) {
                v = new DataView(b);
                const [y,q] = nf(v, kf);
                console.assert(52 === q);
                console.assert(1179403647 === y.Xh, "Bad magic");
                console.assert(1 === y.ge, "Unimplemented: 64 bit elf");
                console.assert(1 === y.data, "Unimplemented: big endian");
                console.assert(1 === y.Cl, "Bad version0");
                console.assert(2 === y.type, "Unimplemented type");
                console.assert(1 === y.Dl, "Bad version1");
                console.assert(52 === y.Cj, "Bad header size");
                console.assert(32 === y.fi, "Bad program header size");
                console.assert(40 === y.Fi, "Bad section header size");
                [p] = of(new DataView(v.buffer,v.byteOffset + y.Wj,y.fi * y.gi), lf, y.gi);
                of(new DataView(v.buffer,v.byteOffset + y.ul,y.Fi * y.Gi), mf, y.Gi);
                v = y;
                B = p;
                p = v.Hh;
                for (C of B)
                    0 !== C.type && 1 === C.type && C.rg + C.Tg < g.G[0] && (C.Kh && (B = new Uint8Array(b,C.offset,C.Kh),
                    Ua(g, B, C.rg)),
                    r = Math.max(r, C.rg + C.Tg),
                    p === v.Hh && C.qh <= p && C.qh + C.Tg > p && (p = p - C.qh + C.rg))
            }
            c && (g.Ca(31764, 1),
            g.Ca(31768, m),
            C = r,
            0 !== (C & 4095) && (C = (C & -4096) + 4096),
            r = C + c.byteLength,
            g.Ca(m, C),
            g.Ca(m + 4, r),
            g.Ca(m + 8, 0),
            g.Ca(m + 12, 0),
            Ua(g, new Uint8Array(c), C));
            g.o[3] = 31744;
            g.ib[0] = 1;
            g.na[0] = 1;
            g.flags[0] = 2;
            g.ba[0] = 1;
            g.ab[0] = 1;
            for (m = 0; 6 > m; m++)
                g.B[m] = 0,
                g.Pa[m] = 0,
                g.Na[m] = 4294967295,
                g.Ua[m] = 45058;
            g.aa[0] = g.Sd() + p | 0;
            g.ld();
            return 732803074
        });
        a.C.kd(244, a, function(m) {
            console.log("Test exited with code " + fa(m, 2));
            throw "HALT";
        }, function() {}, function() {}, function() {});
        for (let m = 0; 15 >= m; m++) {
            function p(r) {
                r ? this.Wa(m) : Fb(this, m)
            }
            u(a.C, 8192 + m, a, p, p, p)
        }
        a = new Uint8Array(512);
        (new Uint16Array(a.buffer))[0] = 43605;
        a[2] = 1;
        var k = 3;
        a[k++] = 102;
        a[k++] = 229;
        a[k++] = 244;
        let l = a[k] = 0;
        for (let m = 0; m < a.length; m++)
            l += a[m];
        a[k] = -l;
        return {
            name: "genroms/multiboot.bin",
            data: a
        }
    }
}
function zg(a, b, c) {
    var d = c.Db || 291;
    b.ha[56] = 1 | d >> 4 & 240;
    b.ha[61] = d & 255;
    b.ha[21] = 128;
    b.ha[22] = 2;
    d = 0;
    1048576 <= a.G[0] && (d = a.G[0] - 1048576 >> 10,
    d = Math.min(d, 65535));
    b.ha[23] = d & 255;
    b.ha[24] = d >> 8 & 255;
    b.ha[48] = d & 255;
    b.ha[49] = d >> 8 & 255;
    d = 0;
    16777216 <= a.G[0] && (d = a.G[0] - 16777216 >> 16,
    d = Math.min(d, 65535));
    b.ha[52] = d & 255;
    b.ha[53] = d >> 8 & 255;
    b.ha[91] = 0;
    b.ha[92] = 0;
    b.ha[93] = 0;
    b.ha[20] = 47;
    b.ha[95] = 0;
    c.Jh && (b.ha[63] = 1)
}
function ke(a) {
    var b = a.nb.Rg
      , c = a.nb.Md;
    if (b) {
        var d = new Uint8Array(b);
        Ua(a, d, 1048576 - b.byteLength);
        if (c) {
            var e = new Uint8Array(c);
            Ua(a, e, 786432);
            $a(a.C, 4272947200, 1048576, function(f) {
                f = f - 4272947200 | 0;
                return f < e.length ? e[f] : 0
            }, function() {})
        }
        $a(a.C, 4293918720, 1048576, function(f) {
            return this.lb[f & 1048575]
        }
        .bind(a), function(f, h) {
            this.lb[f & 1048575] = h
        }
        .bind(a))
    }
}
function Zd(a, b, c, d, e, f) {
    const h = new Uint8Array(a.La.buffer,e >>> 0,f >>> 0);
    WebAssembly.instantiate(h, {
        e: a.Xd
    }).then(g => {
        a.Ma.rh.set(b + 1024, g.instance.exports.f);
        a.Ld(b, c, d);
        a.hj && a.hj(h)
    }
    )
}
he.prototype.Wa = function(a) {
    this.$d(a);
    if (this.u.ud) {
        var b = this.u.ud;
        if (!(24 <= a)) {
            var c = 1 << a;
            0 === (b.i & c) && (b.i |= c,
            65536 !== (b.g[a] & 98304) && (b.h |= c,
            me(b, a)))
        }
    }
}
;
function Fb(a, b) {
    a.Zd(b);
    if (a.u.ud && (a = a.u.ud,
    !(24 <= b))) {
        var c = 1 << b;
        (a.i & c) === c && (a.i &= ~c,
        a.g[b] & 32768 && (a.h &= ~c))
    }
}
function xg(a) {
    var b = {};
    a.debug = b;
    b.Jb = function() {}
    ;
    b.cm = function() {}
    ;
    b.Vl = function() {}
    ;
    b.ia = function() {}
    ;
    b.Xl = function() {}
    ;
    b.Wl = function() {}
    ;
    b.Ul = function() {
        if (a.ib[4] & 32)
            for (var f = 0; 4 > f; f++)
                a.h(a.ib[3] + 8 * f)
    }
    ;
    b.Sl = function() {}
    ;
    b.Tl = function() {}
    ;
    b.bm = function() {}
    ;
    b.im = function() {}
    ;
    b.qm = function() {}
    ;
    b.Ml = function() {}
    ;
    let c, d;
    b.Rl = function(f, h, g) {
        if (!d) {
            if (void 0 === c && (c = "function" === typeof require ? require("./capstone-x86.min.js") : window.cs,
            void 0 === c))
                return;
            d = [new c.Capstone(c.ARCH_X86,c.MODE_16), new c.Capstone(c.ARCH_X86,c.MODE_32)]
        }
        try {
            d[f].disasm(h, g).forEach(function(k) {
                aa(fa(k.Ll >>> 0) + ": " + da(k.bytes.map(l => fa(l, 2).slice(-2)).join(" "), 20) + " " + k.mnemonic + " " + k.op_str)
            })
        } catch (k) {
            aa("Could not disassemble: " + Array.from(h).map(l => fa(l, 2)).join(" "))
        }
    }
    ;
    let e;
    b.Yl = function(f) {
        if (void 0 === e && (e = "function" === typeof require ? require("./libwabt.cjs") : new window.WabtModule,
        void 0 === e))
            return;
        f = f.slice();
        try {
            var h = e.readWasm(f, {
                nm: !1
            });
            h.generateNames();
            h.applyNames();
            h.toText({
                am: !0,
                em: !0
            })
        } catch (l) {
            var g = new Blob([f])
              , k = document.createElement("a");
            k.download = "failed.wasm";
            k.href = window.URL.createObjectURL(g);
            k.dataset.downloadurl = ["application/octet-stream", k.download, k.href].join(":");
            k.click();
            window.URL.revokeObjectURL(k.src);
            console.log(l.toString())
        } finally {
            h && h.wa()
        }
    }
}
;function Qe(a, b) {
    this.s = a;
    this.eb = a.u.eb;
    this.ke = b.ke;
    this.R = [244, 26, b.ke & 255, b.ke >> 8, 7, 5, 16, 0, 1, 0, 2, 0, 0, 0, 0, 0, 1, 168, 0, 0, 0, 16, 191, 254, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 244, 26, b.Nf & 255, b.Nf >> 8, 0, 0, 0, 0, 64, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0];
    this.R = this.R.concat(Array(256 - this.R.length).fill(0));
    this.fb = b.fb;
    this.Pb = [];
    this.name = b.name;
    this.j = this.A = 0;
    this.o = new Uint32Array(4);
    this.h = new Uint32Array(4);
    for (var c of b.ie.features)
        this.o[c >>> 5] |= 1 << (c & 31),
        this.h[c >>> 5] |= 1 << (c & 31);
    b.ie.features.includes(32);
    this.B = !0;
    this.i = 0;
    this.D = !1;
    this.F = 0;
    this.$ = [];
    for (var d of b.ie.$)
        this.$.push(new Cg(a,this,d));
    this.l = 0;
    this.g = this.$[0];
    this.Lb = 0;
    c = [];
    c.push(Dg(this, b.ie));
    c.push(Eg(b.notification));
    c.push(Fg(this, b.Lb));
    b.pf && (d = c.push,
    b = b.pf,
    b = {
        type: 4,
        Re: 3,
        port: b.Qa,
        Rf: !1,
        offset: 0,
        tf: new Uint8Array(0),
        Ic: b.Ic
    },
    d.call(c, b));
    Gg(this, c);
    qe(a.u.eb, this);
    this.reset()
}
function Dg(a, b) {
    return {
        type: 1,
        Re: 0,
        port: b.Qa,
        Rf: !1,
        offset: 0,
        tf: new Uint8Array(0),
        Ic: [{
            bytes: 4,
            name: "device_feature_select",
            read: () => a.A,
            write: c => {
                a.A = c
            }
        }, {
            bytes: 4,
            name: "device_feature",
            read: () => a.o[a.A] || 0,
            write: () => {}
        }, {
            bytes: 4,
            name: "driver_feature_select",
            read: () => a.j,
            write: c => {
                a.j = c
            }
        }, {
            bytes: 4,
            name: "driver_feature",
            read: () => a.h[a.j] || 0,
            write: c => {
                const d = a.o[a.j];
                a.j < a.h.length && (a.h[a.j] = c & d);
                a.B = a.B && !(c & ~d)
            }
        }, {
            bytes: 2,
            name: "msix_config",
            read: () => 65535,
            write: () => {}
        }, {
            bytes: 2,
            name: "num_queues",
            read: () => a.$.length,
            write: () => {}
        }, {
            bytes: 1,
            name: "device_status",
            read: () => a.i,
            write: c => {
                0 === c && a.reset();
                c & ~a.i & 4 && a.i & 64 && (a.D = !0,
                a.i & 4 && a.Sa(2));
                a.B || (c &= -9);
                a.i = c
            }
        }, {
            bytes: 1,
            name: "config_generation",
            read: () => a.F,
            write: () => {}
        }, {
            bytes: 2,
            name: "queue_select",
            read: () => a.l,
            write: c => {
                a.l = c;
                a.l < a.$.length ? a.g = a.$[a.l] : a.g = null
            }
        }, {
            bytes: 2,
            name: "queue_size",
            read: () => a.g ? a.g.size : 0,
            write: c => {
                if (a.g) {
                    c & c - 1 && (c = 1 << ja(c - 1) + 1);
                    c > a.g.Ka && (c = a.g.Ka);
                    var d = a.g;
                    d.size = c;
                    d.o = c - 1
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
                a.g && 1 === c && Ye(a.g) && (a.g.enabled = !0)
            }
        }, {
            bytes: 2,
            name: "queue_notify_off",
            read: () => a.g ? a.g.Za : 0,
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
            read: () => a.g ? a.g.g : 0,
            write: c => {
                a.g && (a.g.g = c)
            }
        }, {
            bytes: 4,
            name: "queue_avail (high dword)",
            read: () => 0,
            write: () => {}
        }, {
            bytes: 4,
            name: "queue_used (low dword)",
            read: () => a.g ? a.g.h : 0,
            write: c => {
                a.g && (a.g.h = c)
            }
        }, {
            bytes: 4,
            name: "queue_used (high dword)",
            read: () => 0,
            write: () => {}
        }]
    }
}
function Eg(a) {
    const b = [];
    let c;
    c = a.yg ? 0 : 2;
    for (const [d,e] of a.hg.entries())
        b.push({
            bytes: 2,
            name: "notify" + d,
            read: () => 65535,
            write: e || ( () => {}
            )
        });
    return {
        type: 2,
        Re: 1,
        port: a.Qa,
        Rf: !1,
        offset: 0,
        tf: new Uint8Array([c & 255, c >> 8 & 255, c >> 16 & 255, c >> 24]),
        Ic: b
    }
}
function Fg(a, b) {
    return {
        type: 3,
        Re: 2,
        port: b.Qa,
        Rf: !1,
        offset: 0,
        tf: new Uint8Array(0),
        Ic: [{
            bytes: 1,
            name: "isr_status",
            read: () => {
                const c = a.Lb;
                a.Lb = 0;
                De(a.eb, a.fb);
                return c
            }
            ,
            write: () => {}
        }]
    }
}
function Gg(a, b) {
    let c = a.R[52] = 64;
    var d = c;
    for (const f of b) {
        b = 16 + f.tf.length;
        d = c;
        c = d + b;
        var e = f.Ic.reduce( (h, g) => h + g.bytes, 0);
        e += f.offset;
        e = 16 > e ? 16 : 1 << ja(e - 1) + 1;
        a.Pb[f.Re] = {
            size: e
        };
        a.R[d] = 9;
        a.R[d + 1] = c;
        a.R[d + 2] = b;
        a.R[d + 3] = f.type;
        a.R[d + 4] = f.Re;
        a.R[d + 5] = 0;
        a.R[d + 6] = 0;
        a.R[d + 7] = 0;
        a.R[d + 8] = f.offset & 255;
        a.R[d + 9] = f.offset >>> 8 & 255;
        a.R[d + 10] = f.offset >>> 16 & 255;
        a.R[d + 11] = f.offset >>> 24;
        a.R[d + 12] = e & 255;
        a.R[d + 13] = e >>> 8 & 255;
        a.R[d + 14] = e >>> 16 & 255;
        a.R[d + 15] = e >>> 24;
        for (const [h,g] of f.tf.entries())
            a.R[d + 16 + h] = g;
        d = 16 + 4 * f.Re;
        a.R[d] = f.port & 254 | !f.Rf;
        a.R[d + 1] = f.port >>> 8 & 255;
        a.R[d + 2] = f.port >>> 16 & 255;
        a.R[d + 3] = f.port >>> 24 & 255;
        d = f.port + f.offset;
        for (const h of f.Ic) {
            let g = h.read;
            b = h.write;
            if (!f.Rf) {
                e = function(l) {
                    return g(l & -2) >> ((l & 1) << 3) & 255
                }
                ;
                const k = function(l) {
                    return g(l & -4) >> ((l & 3) << 3) & 255
                };
                switch (h.bytes) {
                case 4:
                    x(a.s.C, d, a, k, void 0, g);
                    x(a.s.C, d + 1, a, k);
                    x(a.s.C, d + 2, a, k);
                    x(a.s.C, d + 3, a, k);
                    u(a.s.C, d, a, void 0, void 0, b);
                    break;
                case 2:
                    x(a.s.C, d, a, e, g);
                    x(a.s.C, d + 1, a, e);
                    u(a.s.C, d, a, void 0, b);
                    break;
                case 1:
                    x(a.s.C, d, a, g),
                    u(a.s.C, d, a, b)
                }
            }
            d += h.bytes
        }
    }
    a.R[c] = 9;
    a.R[c + 1] = 0;
    a.R[c + 2] = 20;
    a.R[c + 3] = 5;
    a.R[c + 4] = 0;
    a.R[c + 5] = 0;
    a.R[c + 6] = 0;
    a.R[c + 7] = 0;
    a.R[c + 8] = 0;
    a.R[c + 9] = 0;
    a.R[c + 10] = 0;
    a.R[c + 11] = 0;
    a.R[c + 12] = 0;
    a.R[c + 13] = 0;
    a.R[c + 14] = 0;
    a.R[c + 15] = 0;
    a.R[c + 16] = 0;
    a.R[c + 17] = 0;
    a.R[c + 18] = 0;
    a.R[c + 19] = 0
}
Qe.prototype.ia = function() {
    let a = [];
    a[0] = this.A;
    a[1] = this.j;
    a[2] = this.o;
    a[3] = this.h;
    a[4] = this.B;
    a[5] = this.i;
    a[6] = this.D;
    a[7] = this.F;
    a[8] = this.Lb;
    a[9] = this.l;
    return a = a.concat(this.$)
}
;
Qe.prototype.J = function(a) {
    this.A = a[0];
    this.j = a[1];
    this.o = a[2];
    this.h = a[3];
    this.B = a[4];
    this.i = a[5];
    this.D = a[6];
    this.F = a[7];
    this.Lb = a[8];
    this.l = a[9];
    let b = 0;
    for (const c of a.slice(10))
        this.$[b].J(c),
        b++;
    this.g = this.$[this.l] || null
}
;
Qe.prototype.reset = function() {
    this.j = this.A = 0;
    this.h.set(this.o);
    this.B = !0;
    this.l = this.i = 0;
    this.g = this.$[0];
    for (const a of this.$)
        a.reset();
    this.D = !1;
    this.Lb = this.F = 0;
    De(this.eb, this.fb)
}
;
Qe.prototype.Sa = function(a) {
    this.Lb |= a;
    this.eb.Sa(this.fb)
}
;
function Cg(a, b, c) {
    this.s = a;
    this.P = b;
    this.Ka = this.size = c.Ka;
    this.o = this.size - 1;
    this.enabled = !1;
    this.Za = c.Za;
    this.j = this.h = this.i = this.g = this.l = 0;
    this.reset()
}
Cg.prototype.ia = function() {
    const a = [];
    a[0] = this.size;
    a[1] = this.Ka;
    a[2] = this.enabled;
    a[3] = this.Za;
    a[4] = this.l;
    a[5] = this.g;
    a[6] = this.i;
    a[7] = this.h;
    a[8] = this.j;
    a[9] = 1;
    return a
}
;
Cg.prototype.J = function(a) {
    this.size = a[0];
    this.Ka = a[1];
    this.enabled = a[2];
    this.Za = a[3];
    this.l = a[4];
    this.g = a[5];
    this.i = a[6];
    this.h = a[7];
    this.j = a[8];
    this.o = this.size - 1;
    this.A = 1 !== a[9]
}
;
Cg.prototype.reset = function() {
    this.enabled = !1;
    this.j = this.h = this.i = this.g = this.l = 0;
    var a = this.Ka;
    this.size = a;
    this.o = a - 1
}
;
function Ye(a) {
    return a.l && a.g && a.h
}
function Ve(a) {
    a.A && (a.A = !1,
    a.i = (a.s.gb(a.g + 2) & ~a.o) + (a.i & a.o));
    return a.s.gb(a.g + 2) - a.i & 65535
}
function Re(a) {
    return 0 !== Ve(a)
}
function Se(a) {
    Re(a);
    var b = a.s.gb(a.g + 4 + 2 * (a.i & a.o));
    b = new Hg(a,b);
    a.i = a.i + 1 & 65535;
    return b
}
function $e(a, b) {
    const c = a.s.gb(a.h + 2) + a.j & a.o;
    var d = b.l;
    a.s.Ca(a.h + 4 + 8 * c, b.D);
    a.s.Ca(a.h + 8 + 8 * c, d);
    a.j++
}
function af(a) {
    if (0 !== a.j) {
        var b = a.s.gb(a.h + 2) + a.j & 65535;
        a.s.Tf(a.h + 2, b);
        a.j = 0;
        0 < (a.P.h[0] & 536870912) ? (a.s.gb(a.g + 4 + 2 * a.size),
        a.P.Sa(1)) : ~a.s.gb(a.g) & 1 && a.P.Sa(1)
    }
}
function Hg(a, b) {
    this.s = a.s;
    this.P = a.P;
    this.D = b;
    this.A = [];
    this.Mb = this.g = this.o = 0;
    this.i = [];
    this.j = this.l = this.h = this.B = 0;
    let c = a.l;
    var d = b;
    b = 0;
    let e = a.size
      , f = !1;
    const h = 0 < (this.P.h[0] & 268435456);
    do {
        var g = a
          , k = c;
        g = {
            Vf: g.s.h(k + 16 * d),
            Jl: g.s.h(k + 16 * d + 4),
            $c: g.s.h(k + 16 * d + 8),
            flags: g.s.gb(k + 16 * d + 12),
            next: g.s.gb(k + 16 * d + 14)
        };
        if (h && g.flags & 4)
            c = g.Vf,
            b = d = 0,
            e = g.$c / 16;
        else {
            if (g.flags & 2)
                f = !0,
                this.i.push(g),
                this.j += g.$c;
            else {
                if (f)
                    break;
                this.A.push(g);
                this.Mb += g.$c
            }
            b++;
            if (b > e)
                break;
            if (g.flags & 1)
                d = g.next;
            else
                break
        }
    } while (1)
}
function Te(a, b) {
    let c = 0
      , d = b.length;
    for (; d && a.o !== a.A.length; ) {
        var e = a.A[a.o]
          , f = e.Vf + a.g;
        let l = e.$c - a.g;
        l > d ? (l = d,
        a.g += d) : (a.o++,
        a.g = 0);
        e = b;
        var h = e.set
          , g = a.s
          , k = l;
        k && (g.l(f),
        g.l(f + k - 1));
        h.call(e, g.lb.subarray(f, f + k), c);
        c += l;
        d -= l
    }
}
function Ze(a, b) {
    let c = 0
      , d = b.length;
    for (; d && a.B !== a.i.length; ) {
        var e = a.i[a.B];
        const f = e.Vf + a.h;
        e = e.$c - a.h;
        e > d ? (e = d,
        a.h += d) : (a.B++,
        a.h = 0);
        Ua(a.s, b.subarray(c, c + e), f);
        c += e;
        d -= e
    }
    a.l += c
}
;function Ag(a, b, c) {
    this.h = a;
    this.v = c;
    this.A = [104, 111, 115, 116, 57, 112];
    this.F = this.A.length;
    this.D = "9P2000.L";
    this.j = this.o = 8192;
    this.i = new Uint8Array(2 * this.j);
    this.B = 0;
    this.g = [];
    this.P = new Qe(b,{
        name: "virtio-9p",
        fb: 48,
        ke: 4169,
        Nf: 9,
        ie: {
            Qa: 43008,
            $: [{
                Ka: 32,
                Za: 0
            }],
            features: [0, 32, 29, 28],
            Vg: () => {}
        },
        notification: {
            Qa: 43264,
            yg: !1,
            hg: [d => {
                if (0 === d) {
                    for (; Re(this.l); )
                        d = Se(this.l),
                        Ig(this, d);
                    d = this.l;
                    const e = d.s.gb(d.g + 2) + 0 & 65535;
                    d.s.Tf(d.h + 4 + 8 * d.size, e)
                }
            }
            ]
        },
        Lb: {
            Qa: 42752
        },
        pf: {
            Qa: 42496,
            Ic: [{
                bytes: 2,
                name: "mount tag length",
                read: () => this.F,
                write: () => {}
            }].concat(Array.from(Array(254).keys()).map(d => ({
                bytes: 1,
                name: "mount tag name " + d,
                read: () => this.A[d] || 0,
                write: () => {}
            })))
        }
    });
    this.l = this.P.$[0]
}
Ag.prototype.ia = function() {
    var a = [];
    a[0] = this.A;
    a[1] = this.F;
    a[2] = this.P;
    a[3] = this.D;
    a[4] = this.o;
    a[5] = this.j;
    a[6] = this.i;
    a[7] = this.B;
    a[8] = this.g.map(function(b) {
        return [b.ka, b.type, b.uid, b.Oc]
    });
    a[9] = this.h;
    return a
}
;
Ag.prototype.J = function(a) {
    this.A = a[0];
    this.F = a[1];
    this.P.J(a[2]);
    this.l = this.P.$[0];
    this.D = a[3];
    this.o = a[4];
    this.j = a[5];
    this.i = a[6];
    this.B = a[7];
    this.g = a[8].map(function(b) {
        return {
            ka: b[0],
            type: b[1],
            uid: b[2],
            Oc: b[3]
        }
    });
    this.h.J(a[9])
}
;
Ag.prototype.reset = function() {
    this.g = [];
    this.P.reset()
}
;
function W(a, b, c, d) {
    G(["w", "b", "h"], [d + 7, b + 1, c], a.i, 0);
    a.B = d + 7
}
function Jg(a, b, c) {
    c = G(["w"], [c], a.i, 7);
    W(a, 6, b, c)
}
function X(a, b) {
    Ze(b, a.i.subarray(0, a.B));
    $e(a.l, b);
    af(a.l)
}
async function Ig(a, b) {
    var c = new Uint8Array(b.Mb);
    Te(b, c);
    var d = {
        offset: 0
    }
      , e = K(["w", "b", "h"], c, d)
      , f = e[0]
      , h = e[1]
      , g = e[2];
    switch (h) {
    case 8:
        f = Id(a.h);
        var k = Jd(a.h);
        e = [16914839];
        e[1] = a.o;
        e[2] = Math.floor(k / e[1]);
        e[3] = e[2] - Math.floor(f / e[1]);
        e[4] = e[2] - Math.floor(f / e[1]);
        e[5] = Gd(a.h);
        e[6] = Hd(a.h);
        e[7] = 0;
        e[8] = 256;
        f = G("wwddddddw".split(""), e, a.i, 7);
        W(a, h, g, f);
        X(a, b);
        break;
    case 112:
    case 12:
        e = K(["w", "w"], c, d);
        f = e[0];
        d = e[1];
        c = a.g[f].ka;
        var l = yd(a.h, c);
        k = qd(a.h, c, d);
        Zc(a.h, a.g[f].ka, function() {
            var v = [];
            v[0] = l.Ra;
            v[1] = this.j - 24;
            G(["Q", "w"], v, this.i, 7);
            W(this, h, g, 17);
            X(this, b)
        }
        .bind(a));
        break;
    case 70:
        e = K(["w", "w", "s"], c, d);
        c = e[0];
        f = e[1];
        k = e[2];
        k = Kd(a.h, a.g[c].ka, a.g[f].ka, k);
        if (0 > k) {
            Jg(a, g, -k);
            X(a, b);
            break
        }
        W(a, h, g, 0);
        X(a, b);
        break;
    case 16:
        e = K(["w", "s", "s", "w"], c, d);
        f = e[0];
        k = e[1];
        var m = e[3];
        c = nd(a.h, k, a.g[f].ka, e[2]);
        l = yd(a.h, c);
        l.uid = a.g[f].uid;
        l.bb = m;
        G(["Q"], [l.Ra], a.i, 7);
        W(a, h, g, 13);
        X(a, b);
        break;
    case 18:
        e = K("wswwww".split(""), c, d);
        f = e[0];
        k = e[1];
        d = e[2];
        c = e[3];
        var p = e[4];
        m = e[5];
        c = md(a.h, k, a.g[f].ka, c, p);
        l = yd(a.h, c);
        l.mode = d;
        l.uid = a.g[f].uid;
        l.bb = m;
        G(["Q"], [l.Ra], a.i, 7);
        W(a, h, g, 13);
        X(a, b);
        break;
    case 22:
        e = K(["w"], c, d);
        f = e[0];
        l = yd(a.h, a.g[f].ka);
        f = G(["s"], [l.Of], a.i, 7);
        W(a, h, g, f);
        X(a, b);
        break;
    case 72:
        e = K(["w", "s", "w", "w"], c, d);
        f = e[0];
        k = e[1];
        d = e[2];
        m = e[3];
        c = Xc(a.h, k, a.g[f].ka);
        l = yd(a.h, c);
        l.mode = d | 16384;
        l.uid = a.g[f].uid;
        l.bb = m;
        G(["Q"], [l.Ra], a.i, 7);
        W(a, h, g, 13);
        X(a, b);
        break;
    case 14:
        e = K(["w", "s", "w", "w", "w"], c, d);
        f = e[0];
        k = e[1];
        c = e[2];
        d = e[3];
        m = e[4];
        a.v.send("9p-create", [k, a.g[f].ka]);
        c = ld(a.h, k, a.g[f].ka);
        a.g[f].ka = c;
        a.g[f].type = 1;
        a.g[f].Oc = k;
        l = yd(a.h, c);
        l.uid = a.g[f].uid;
        l.bb = m;
        l.mode = d | 32768;
        G(["Q", "w"], [l.Ra, a.j - 24], a.i, 7);
        W(a, h, g, 17);
        X(a, b);
        break;
    case 52:
        e = K("wbwddws".split(""), c, d);
        f = e[0];
        c = e[2];
        k = 0 === e[4] ? Infinity : e[4];
        e = Qd(e[1], e[3], k, e[5], e[6]);
        k = Sd(a.h, a.g[f].ka, e, c);
        G(["b"], [k], a.i, 7);
        W(a, h, g, 1);
        X(a, b);
        break;
    case 54:
        e = K("wbddws".split(""), c, d);
        f = e[0];
        k = 0 === e[3] ? Infinity : e[3];
        e = Qd(e[1], e[2], k, e[4], e[5]);
        k = Rd(a.h, a.g[f].ka, e);
        k || (k = e,
        k.type = 2);
        f = G(["b", "d", "d", "w", "s"], [k.type, k.start, Infinity === k.length ? 0 : k.length, k.h, k.g], a.i, 7);
        W(a, h, g, f);
        X(a, b);
        break;
    case 24:
        e = K(["w", "d"], c, d);
        f = e[0];
        l = yd(a.h, a.g[f].ka);
        if (!l || 4 === l.status) {
            Jg(a, g, 2);
            X(a, b);
            break
        }
        e[0] = e[1];
        e[1] = l.Ra;
        e[2] = l.mode;
        e[3] = l.uid;
        e[4] = l.bb;
        e[5] = l.qb;
        e[6] = l.lg << 8 | l.mg;
        e[7] = l.size;
        e[8] = a.o;
        e[9] = Math.floor(l.size / 512 + 1);
        e[10] = l.fe;
        e[11] = 0;
        e[12] = l.bd;
        e[13] = 0;
        e[14] = l.Se;
        e[15] = 0;
        e[16] = 0;
        e[17] = 0;
        e[18] = 0;
        e[19] = 0;
        G("dQwwwddddddddddddddd".split(""), e, a.i, 7);
        W(a, h, g, 153);
        X(a, b);
        break;
    case 26:
        e = K("wwwwwddddd".split(""), c, d);
        f = e[0];
        l = yd(a.h, a.g[f].ka);
        e[1] & 1 && (l.mode = e[2]);
        e[1] & 2 && (l.uid = e[3]);
        e[1] & 4 && (l.bb = e[4]);
        e[1] & 16 && (l.fe = Math.floor((new Date).getTime() / 1E3));
        e[1] & 32 && (l.bd = Math.floor((new Date).getTime() / 1E3));
        e[1] & 64 && (l.Se = Math.floor((new Date).getTime() / 1E3));
        e[1] & 128 && (l.fe = e[6]);
        e[1] & 256 && (l.bd = e[8]);
        e[1] & 8 && await Bd(a.h, a.g[f].ka, e[5]);
        W(a, h, g, 0);
        X(a, b);
        break;
    case 50:
        e = K(["w", "d"], c, d);
        f = e[0];
        W(a, h, g, 0);
        X(a, b);
        break;
    case 40:
    case 116:
        e = K(["w", "d", "w"], c, d);
        f = e[0];
        k = e[1];
        m = e[2];
        l = yd(a.h, a.g[f].ka);
        if (!l || 4 === l.status) {
            Jg(a, g, 2);
            X(a, b);
            break
        }
        if (2 === a.g[f].type) {
            (void 0).length < k + m && (m = (void 0).length - k);
            for (e = 0; e < m; e++)
                a.i[11 + e] = (void 0)[k + e];
            G(["w"], [m], a.i, 7);
            W(a, h, g, 4 + m)
        } else
            qd(a.h, a.g[f].ka, void 0),
            e = a.g[f].ka,
            m = Math.min(m, a.i.length - 11),
            l.size < k + m ? m = l.size - k : 40 === h && (m = Md(a.h, e, k + m) - k),
            k > l.size && (m = 0),
            a.v.send("9p-read-start", [a.g[f].Oc]),
            e = await zd(a.h, e, k, m),
            a.v.send("9p-read-end", [a.g[f].Oc, m]),
            e && a.i.set(e, 11),
            G(["w"], [m], a.i, 7),
            W(a, h, g, 4 + m);
        X(a, b);
        break;
    case 118:
        e = K(["w", "d", "w"], c, d);
        f = e[0];
        k = e[1];
        m = e[2];
        e = a.g[f].Oc;
        if (2 === a.g[f].type) {
            Jg(a, g, 95);
            X(a, b);
            break
        } else
            await Cd(a.h, a.g[f].ka, k, m, c.subarray(d.offset));
        a.v.send("9p-write-end", [e, m]);
        G(["w"], [m], a.i, 7);
        W(a, h, g, 4);
        X(a, b);
        break;
    case 74:
        e = K(["w", "s", "w", "s"], c, d);
        k = await ud(a.h, a.g[e[0]].ka, e[1], a.g[e[2]].ka, e[3]);
        if (0 > k) {
            Jg(a, g, -k);
            X(a, b);
            break
        }
        W(a, h, g, 0);
        X(a, b);
        break;
    case 76:
        e = K(["w", "s", "w"], c, d);
        d = e[0];
        k = e[1];
        c = e[2];
        f = hd(a.h, a.g[d].ka, k);
        if (-1 === f) {
            Jg(a, g, 2);
            X(a, b);
            break
        }
        k = xd(a.h, a.g[d].ka, k);
        if (0 > k) {
            Jg(a, g, -k);
            X(a, b);
            break
        }
        W(a, h, g, 0);
        X(a, b);
        break;
    case 100:
        f = K(["w", "s"], c, d);
        a.j !== f[0] && (a.j = f[0],
        a.i = new Uint8Array(Math.min(16777216, 2 * a.j)));
        f = G(["w", "s"], [a.j, a.D], a.i, 7);
        W(a, h, g, f);
        X(a, b);
        break;
    case 104:
        e = K(["w", "w", "s", "s", "w"], c, d);
        f = e[0];
        a.g[f] = {
            ka: 0,
            type: 1,
            uid: e[4],
            Oc: ""
        };
        l = yd(a.h, a.g[f].ka);
        G(["Q"], [l.Ra], a.i, 7);
        W(a, h, g, 13);
        X(a, b);
        a.v.send("9p-attach");
        break;
    case 108:
        e = K(["h"], c, d);
        W(a, h, g, 0);
        X(a, b);
        break;
    case 110:
        e = K(["w", "w", "h"], c, d);
        f = e[0];
        m = e[1];
        p = e[2];
        if (0 === p) {
            a.g[m] = {
                ka: a.g[f].ka,
                type: 1,
                uid: a.g[f].uid,
                Oc: a.g[f].Oc
            };
            G(["h"], [0], a.i, 7);
            W(a, h, g, 2);
            X(a, b);
            break
        }
        k = [];
        for (e = 0; e < p; e++)
            k.push("s");
        d = K(k, c, d);
        c = a.g[f].ka;
        k = 9;
        var r = 0;
        for (e = 0; e < p; e++) {
            c = hd(a.h, c, d[e]);
            if (-1 === c)
                break;
            k += G(["Q"], [yd(a.h, c).Ra], a.i, k);
            r++;
            a.g[m] = {
                ka: c,
                type: 1,
                uid: a.g[f].uid,
                Oc: d[e]
            }
        }
        G(["h"], [r], a.i, 7);
        W(a, h, g, k - 7);
        X(a, b);
        break;
    case 120:
        e = K(["w"], c, d);
        a.g[e[0]] && 0 <= a.g[e[0]].ka && (await sd(a.h, a.g[e[0]].ka),
        a.g[e[0]].ka = -1,
        a.g[e[0]].type = -1);
        W(a, h, g, 0);
        X(a, b);
        break;
    case 32:
        e = K(["w", "s", "d", "w"], c, d);
        f = e[0];
        k = e[1];
        c = e[3];
        a.g[f].type = 2;
        W(a, h, g, 0);
        X(a, b);
        break;
    case 30:
        e = K(["w", "w", "s"], c, d),
        f = e[0],
        k = e[2],
        Jg(a, g, 95),
        X(a, b)
    }
}
;function Kg(a) {
    function b(w) {
        return 1 + Math.floor((w - 1) / 2048)
    }
    function c(w) {
        const D = w.lastIndexOf(".");
        return -1 === D ? w.substr(0, 8) : w.substr(0, Math.min(8, D)) + "." + w.substr(D + 1, 3)
    }
    const d = new TextEncoder
      , e = new Date
      , f = (w, D) => {
        w.buffer[w.offset++] = D;
        w.buffer[w.offset++] = D >> 8
    }
      , h = (w, D) => {
        w.buffer[w.offset++] = D;
        w.buffer[w.offset++] = D >> 8;
        w.buffer[w.offset++] = D >> 16;
        w.buffer[w.offset++] = D >> 24
    }
      , g = (w, D) => {
        w.buffer[w.offset++] = D >> 8;
        w.buffer[w.offset++] = D
    }
      , k = (w, D) => {
        w.buffer[w.offset++] = D >> 24;
        w.buffer[w.offset++] = D >> 16;
        w.buffer[w.offset++] = D >> 8;
        w.buffer[w.offset++] = D
    }
      , l = (w, D) => {
        f(w, D);
        g(w, D)
    }
      , m = (w, D) => {
        h(w, D);
        k(w, D)
    }
      , p = (w, D, T) => {
        w.buffer.fill(T, w.offset, w.offset += D)
    }
      , r = (w, D) => {
        w.offset += d.encodeInto(D, w.buffer.subarray(w.offset)).written
    }
      , v = w => {
        p(w, 16, 32);
        w.buffer[w.offset++] = 0
    }
      , B = (w, D, T, ca, P, z) => {
        ca || (D = c(D.toUpperCase().replace(/[^A-Z0-9_.]/g, "")) + ";1");
        w = d.encodeInto(D, w.buffer.subarray(w.offset + 33)).written;
        D = w & 1 ? 0 : 1;
        q.buffer[q.offset++] = 33 + w + D;
        q.buffer[q.offset++] = 0;
        m(q, P);
        m(q, z);
        P = q;
        z = e.getUTCFullYear() - 1900;
        P.buffer[P.offset++] = z;
        z = 1 + e.getUTCMonth();
        P.buffer[P.offset++] = z;
        z = e.getUTCDate();
        P.buffer[P.offset++] = z;
        z = e.getUTCHours();
        P.buffer[P.offset++] = z;
        z = e.getUTCMinutes();
        P.buffer[P.offset++] = z;
        z = e.getUTCSeconds();
        P.buffer[P.offset++] = z;
        P.buffer[P.offset++] = 0;
        q.buffer[q.offset++] = T;
        q.buffer[q.offset++] = 0;
        q.buffer[q.offset++] = 0;
        l(q, 1);
        q.buffer[q.offset++] = w;
        q.offset += w + D
    }
    ;
    ba(0 === b(0));
    ba(1 === b(1));
    ba(1 === b(2047));
    ba(1 === b(2048));
    ba(2 === b(2049));
    ba(2 === b(4096));
    ba(3 === b(4097));
    ba(11 === b(20481));
    ba("abcdefgh.qwe" === c("abcdefghijkl.qwerty"));
    ba("abcdefgh" === c("abcdefghijkl"));
    let C = 24;
    a = a.map( ({name: w, $f: D}) => {
        const T = C;
        C += b(D.length);
        w = c(w);
        return {
            name: w,
            $f: D,
            Wh: T
        }
    }
    );
    const y = C
      , q = {
        buffer: new Uint8Array(2048 * y),
        offset: 32768
    };
    q.buffer[q.offset++] = 1;
    r(q, "CD001");
    q.buffer[q.offset++] = 1;
    q.buffer[q.offset++] = 0;
    q.offset += d.encodeInto("V86".padEnd(32), q.buffer.subarray(q.offset)).written;
    q.offset += d.encodeInto("CDROM".padEnd(32), q.buffer.subarray(q.offset)).written;
    q.offset += 8;
    m(q, y);
    q.offset += 32;
    l(q, 1);
    l(q, 1);
    l(q, 2048);
    m(q, 10);
    h(q, 19);
    h(q, 0);
    k(q, 21);
    k(q, 0);
    B(q, "\x00", 2, !0, 23, 2048);
    p(q, 128, 32);
    p(q, 128, 32);
    p(q, 128, 32);
    p(q, 128, 32);
    p(q, 37, 32);
    p(q, 37, 32);
    p(q, 37, 32);
    v(q);
    v(q);
    v(q);
    v(q);
    q.buffer[q.offset++] = 1;
    q.buffer[q.offset++] = 0;
    q.offset += 512;
    q.offset += 653;
    q.buffer[q.offset++] = 255;
    r(q, "CD001");
    q.buffer[q.offset++] = 1;
    q.offset = 38912;
    q.buffer[q.offset++] = 1;
    q.buffer[q.offset++] = 0;
    h(q, 23);
    f(q, 1);
    r(q, "\x00");
    q.offset = 43008;
    q.buffer[q.offset++] = 1;
    q.buffer[q.offset++] = 0;
    k(q, 23);
    g(q, 1);
    r(q, "\x00");
    q.offset = 47104;
    B(q, "\x00", 2, !0, 23, 2048);
    B(q, "\u0001", 2, !0, 23, 2048);
    for (const {name: w, $f: D, Wh: T} of a)
        B(q, w, 0, !1, T, D.length);
    for (let {$f: w, Wh: D} of a)
        q.buffer.set(w, 2048 * D);
    return q.buffer
}
;const Lg = !location.hostname.endsWith("copy.sh")
  , Mg = ["wss://relay.widgetry.org/", "ws://localhost:8080/"];
function Ng() {
    const a = Y("version");
    return a ? "?" + a.textContent : ""
}
function Og(a) {
    document.title = a + " - v86";
    const b = document.querySelector("meta[name=description]");
    b && (b.content = "Running " + a)
}
function Pg(a) {
    return !!a && "0" !== a
}
function Qg(a) {
    return new Promise( (b, c) => {
        const d = new FileReader;
        d.onload = () => b(d.result);
        d.onerror = e => c(e);
        d.readAsArrayBuffer(a)
    }
    )
}
let Rg = 0;
function Y(a) {
    return document.getElementById(a)
}
const Sg = "memory_size video_memory_size networking_proxy disable_audio enable_acpi boot_order".split(" ");
for (const a of Sg)
    try {
        window.localStorage.removeItem(a)
    } catch (b) {}
function Tg() {
    function a() {
        const k = [];
        for (const l of g) {
            const m = l.filter(p => p.element.checked);
            m.length && k.push(m)
        }
        for (const l of h)
            l.element.style.display = k.every(m => m.some(p => p.Ba(l))) ? "" : "none"
    }
    function b(k, l) {
        if (k = Y(k))
            k.onclick = () => Y("relay_url").value = l
    }
    if (window.WebAssembly) {
        Y("start_emulation").onclick = function(k) {
            Ug(null, null);
            Y("start_emulation").blur();
            k.preventDefault()
        }
        ;
        var c = new URLSearchParams(location.search)
          , d = c.get("cdn") || (Lg ? "images/" : "//i.copy.sh/");
        let antelink = "https://palgania.ovh:8081/",
                postlink = "",
                antelink2 = "https://palgania.ovh:8081/",
                postlink2 = "";
            d = [
                {
                    id: "zombinis2",
                    G: 33554432,
                    state: {
                        url: antelink2 + "zombinis2.bin.zst" + postlink2
                    },
                    O: {
                        url: antelink + "zombinis2/.img.zst" + postlink,
                        size: 2147483648,
                        async: use_async,
                        M: 262144,
                        da: !0
                    },
                    name: "Zoombinis 2 : Mission au sommet"
                },
                {
                    id: "monsieur_heureux_et_le_monde_a_lenvers",
                    G: 33554432,
                    state: {
                        url: antelink2 + "monsieur_heureux_et_le_monde_a_lenvers.bin.zst" + postlink2
                    },
                    O: {
                        url: antelink + "monsieur_heureux_et_le_monde_a_lenvers/.img.zst" + postlink,
                        size: 2147483648,
                        async: use_async,
                        M: 262144,
                        da: !0
                    },
                    name: "Monsieur Heureux et le monde à l'envers"
                },
                {
                    id: "spy_fox_dry_cereals",
                    G: 33554432,
                    state: {
                        url: antelink2 + "spy_fox_dry_cereals.bin.zst" + postlink2
                    },
                    O: {
                        url: antelink + "spy_fox_dry_cereals/.img.zst" + postlink,
                        size: 2147483648,
                        async: use_async,
                        M: 262144,
                        da: !0
                    },
                    name: "Spy Fox : Opération Milkshake"
                },
                {
                    id: "sampyjam",
                    G: 33554432,
                    state: {
                        url: antelink2 + "sampyjam.bin.zst" + postlink2
                    },
                    O: {
                        url: antelink + "sampyjam/.img.zst" + postlink,
                        size: 2147483648,
                        async: use_async,
                        M: 262144,
                        da: !0
                    },
                    name: "Sam Pyjam : Le héros de la nuit"
                },
                {
                    id: "sampyjam2",
                    G: 33554432,
                    state: {
                        url: antelink2 + "sampyjam2.bin.zst" + postlink2
                    },
                    O: {
                        url: antelink + "sampyjam2/.img.zst" + postlink,
                        size: 2147483648,
                        async: use_async,
                        M: 262144,
                        da: !0
                    },
                    name: "Sam Pyjam : Héros météo"
                },
                {
                    id: "pouce_zoo",
                    G: 1073741824,
                    state: {
                        url: antelink2 + "pouce_zoo.bin.zst" + postlink2
                    },
                    O: {
                        url: antelink + "pouce_zoo/.img.zst" + postlink,
                        size: 2147483648,
                        async: use_async,
                        M: 262144,
                        da: !0
                    },
                    name: "Pouce-Pouce sauve le zoo"
                },
                {
                    id: "pouce_temps",
                    G: 33554432,
                    state: {
                        url: antelink2 + "pouce_temps.bin.zst" + postlink2
                    },
                    O: {
                        url: antelink + "pouce_temps/.img.zst" + postlink,
                        size: 2147483648,
                        async: use_async,
                        M: 262144,
                        da: !0
                    },
                    name: "Pouce-Pouce voyage dans le temps"
                },
                {
                    id: "pouce_course",
                    G: 33554432,
                    state: {
                        url: antelink2 + "pouce_course.bin.zst" + postlink2
                    },
                    O: {
                        url: antelink + "pouce_course/.img.zst" + postlink,
                        size: 2147483648,
                        async: use_async,
                        M: 262144,
                        da: !0
                    },
                    name: "Pouce-Pouce entre dans la course"
                },
                {
                    id: "pouce_cirque",
                    G: 33554432,
                    state: {
                        url: antelink2 + "pouce_cirque.bin.zst" + postlink2
                    },
                    O: {
                        url: antelink + "pouce_cirque/.img.zst" + postlink,
                        size: 2147483648,
                        async: use_async,
                        M: 262144,
                        da: !0
                    },
                    name: "Pouce-Pouce découvre le cirque"
                },
                {
                    id: "marine1_algues",
                    G: 33554432,
                    state: {
                        url: antelink2 + "marine1_algues.bin.zst" + postlink2
                    },
                    O: {
                        url: antelink + "marine1_algues/.img.zst" + postlink,
                        size: 2147483648,
                        async: use_async,
                        M: 262144,
                        da: !0
                    },
                    name: "Marine Malice et le mystère des graines d'algues"
                },
                {
                    id: "marine2_hantee",
                    G: 33554432,
                    state: {
                        url: antelink2 + "marine2_hantee.bin.zst" + postlink2
                    },
                    O: {
                        url: antelink + "marine2_hantee/.img.zst" + postlink,
                        size: 2147483648,
                        async: use_async,
                        M: 262144,
                        da: !0
                    },
                    name: "Marine Malice et le mystère de l'école hantée"
                },
                {
                    id: "marine3_coquillage",
                    G: 33554432,
                    state: {
                        url: antelink2 + "marine3_coquillage.bin.zst" + postlink2
                    },
                    O: {
                        url: antelink + "marine3_coquillage/.img.zst" + postlink,
                        size: 2147483648,
                        async: use_async,
                        M: 262144,
                        da: !0
                    },
                    name: "Marine Malice et le mystère du coquillage volé"
                },
                {
                    id: "marine4_ranch",
                    G: 33554432,
                    state: {
                        url: antelink2 + "marine4_ranch.bin.zst" + postlink2
                    },
                    O: {
                        url: antelink + "marine4_ranch/.img.zst" + postlink,
                        size: 2147483648,
                        async: use_async,
                        M: 262144,
                        da: !0
                    },
                    name: "Marine Malice et le mystère du ranch aux cochons"
                },
                {
                    id: "marine5_lagon",
                    G: 33554432,
                    state: {
                        url: antelink2 + "marine5_lagon.bin.zst" + postlink2
                    },
                    O: {
                        url: antelink + "marine5_lagon/.img.zst" + postlink,
                        size: 2147483648,
                        async: use_async,
                        M: 262144,
                        da: !0
                    },
                    name: "Marine Malice et le mystère du monstre du lagon bleu"
                },
                {
                    id: "transforme",
                    G: 33554432,
                    state: {
                        url: antelink2 + "transforme.bin.zst" + postlink2
                    },
                    O: {
                        url: antelink + "transforme/.img.zst" + postlink,
                        size: 2147483648,
                        async: use_async,
                        M: 262144,
                        da: !0
                    },
                    name: "Ca se transforme"
                },
                {
                    id: "qqchdedans",
                    G: 33554432,
                    state: {
                        url: antelink2 + "qqchdedans.bin.zst" + postlink2
                    },
                    O: {
                        url: antelink + "qqchdedans/.img.zst" + postlink,
                        size: 2147483648,
                        async: use_async,
                        M: 262144,
                        da: !0
                    },
                    name: "Il y a quelque chose dedans"
                },
                {
                    id: "cafaitpeur",
                    G: 33554432,
                    state: {
                        url: antelink2 + "cafaitpeur.bin.zst" + postlink2
                    },
                    O: {
                        url: antelink + "cafaitpeur/.img.zst" + postlink,
                        size: 2147483648,
                        async: use_async,
                        M: 262144,
                        da: !0
                    },
                    name: "Ca fait peur"
                },
            {
            id: "archlinux",
            name: "Arch Linux",
            G: 536870912,
            ma: 8388608,
            state: {
                url: d + "arch_state-v3.bin.zst"
            },
            filesystem: {
                Wf: d + "arch/"
            },
            Dc: "virtio"
        }, {
            id: "archlinux-boot",
            name: "Arch Linux",
            G: 536870912,
            ma: 8388608,
            filesystem: {
                Wf: d + "arch/",
                cj: {
                    url: d + "fs.json"
                }
            },
            Eb: "rw apm=off vga=0x344 video=vesafb:ypan,vremap:8 root=host9p rootfstype=9p rootflags=trans=virtio,cache=loose mitigations=off audit=0 init_on_free=on tsc=reliable random.trust_cpu=on nowatchdog init=/usr/bin/init-openrc net.ifnames=0 biosdevname=0",
            lf: !0,
            Dc: "virtio"
        }, {
            id: "copy/skiffos",
            name: "SkiffOS",
            O: {
                url: d + "skiffos/.iso",
                size: 124672E3,
                async: !0,
                M: 1048576,
                da: !0
            },
            G: 536870912
        }, {
            id: "serenity",
            name: "SerenityOS",
            L: {
                url: d + "serenity-v3/.img.zst",
                size: 734003200,
                async: !0,
                M: 1048576,
                da: !0
            },
            G: 536870912,
            state: {
                url: d + "serenity_state-v4.bin.zst"
            },
            I: "https://serenityos.org/",
            Nb: !0
        }, {
            id: "serenity-boot",
            name: "SerenityOS",
            L: {
                url: d + "serenity-v3/.img.zst",
                size: 734003200,
                async: !0,
                M: 1048576,
                da: !0
            },
            G: 536870912,
            I: "https://serenityos.org/"
        }, {
            id: "redox",
            name: "Redox",
            L: {
                url: d + "redox_demo_i686_2024-09-07_1225_harddrive/.img",
                size: 671088640,
                async: !0,
                M: 1048576,
                da: !0
            },
            G: 1073741824,
            state: {
                url: d + "redox_state-v2.bin.zst"
            },
            I: "https://www.redox-os.org/",
            va: !0
        }, {
            id: "redox-boot",
            name: "Redox",
            L: {
                url: d + "redox_demo_i686_2024-09-07_1225_harddrive/.img",
                size: 671088640,
                async: !0,
                M: 1048576,
                da: !0
            },
            G: 1073741824,
            I: "https://www.redox-os.org/",
            va: !0
        }, {
            id: "helenos",
            G: 268435456,
            O: {
                url: d + "HelenOS-0.14.1-ia32.iso",
                size: 25792512,
                async: !1
            },
            name: "HelenOS",
            I: "http://www.helenos.org/"
        }, {
            id: "fiwix",
            G: 268435456,
            L: {
                url: d + "FiwixOS-3.4-i386/.img",
                size: 1073741824,
                async: !0,
                M: 1048576,
                da: !0
            },
            name: "FiwixOS",
            I: "https://www.fiwix.org/"
        }, {
            id: "haiku",
            G: 536870912,
            L: {
                url: d + "haiku-v4/.img",
                size: 1073741824,
                async: !0,
                M: 1048576,
                da: !0
            },
            state: {
                url: d + "haiku_state-v4.bin.zst"
            },
            name: "Haiku",
            I: "https://www.haiku-os.org/"
        }, {
            id: "haiku-boot",
            G: 536870912,
            L: {
                url: d + "haiku-v4/.img",
                size: 1073741824,
                async: !0,
                M: 1048576,
                da: !0
            },
            name: "Haiku",
            I: "https://www.haiku-os.org/"
        }, {
            id: "beos",
            G: 536870912,
            L: {
                url: d + "beos5/.img",
                size: 536870912,
                async: !0,
                M: 1048576,
                da: !0
            },
            name: "BeOS 5"
        }, {
            id: "msdos",
            L: {
                url: d + "msdos622/.img",
                size: 67108864,
                async: !0,
                M: 262144,
                da: !0
            },
            name: "MS-DOS 6.22"
        }, {
            id: "msdos4",
            V: {
                url: d + "msdos4.img",
                size: 1474560
            },
            name: "MS-DOS 4"
        }, {
            id: "freedos",
            V: {
                url: d + "freedos722.img",
                size: 737280
            },
            name: "FreeDOS"
        }, {
            id: "freegem",
            L: {
                url: d + "freegem/.bin",
                size: 209715200,
                async: !0,
                M: 262144,
                da: !0
            },
            name: "Freedos with FreeGEM"
        }, {
            id: "xcom",
            V: {
                url: d + "xcom144.img",
                size: 1474560
            },
            name: "Freedos with Xcom",
            I: "http://xcom.infora.hu/index.html"
        }, {
            id: "psychdos",
            L: {
                url: d + "psychdos/.img",
                size: 549453824,
                async: !0,
                M: 262144,
                da: !0
            },
            name: "PsychDOS",
            I: "https://psychoslinux.gitlab.io/DOS/INDEX.HTM"
        }, {
            id: "86dos",
            V: {
                url: d + "pc86dos.img",
                size: 163840
            },
            name: "86-DOS",
            I: "https://www.os2museum.com/wp/pc-86-dos/"
        }, {
            id: "oberon",
            L: {
                url: d + "oberon.img",
                size: 25165824,
                async: !1
            },
            name: "Oberon"
        }, {
            id: "windows1",
            V: {
                url: d + "windows101.img",
                size: 1474560
            },
            name: "Windows 1.01"
        }, {
            id: "windows2",
            L: {
                url: d + "windows2.img",
                size: 4177920,
                async: !1
            },
            name: "Windows 2.03"
        }, {
            id: "linux26",
            O: {
                url: d + "linux.iso",
                size: 6547456,
                async: !1
            },
            name: "Linux"
        }, {
            id: "linux3",
            O: {
                url: d + "linux3.iso",
                size: 8638464,
                async: !1
            },
            name: "Linux"
        }, {
            id: "linux4",
            O: {
                url: d + "linux4.iso",
                size: 7731200,
                async: !1
            },
            name: "Linux",
            filesystem: {}
        }, {
            id: "buildroot",
            ub: {
                url: d + "buildroot-bzimage.bin",
                size: 5166352,
                async: !1
            },
            name: "Buildroot Linux",
            filesystem: {},
            Eb: "tsc=reliable mitigations=off random.trust_cpu=on"
        }, {
            id: "buildroot6",
            ub: {
                url: d + "buildroot-bzimage68.bin",
                size: 10068480,
                async: !1
            },
            name: "Buildroot Linux 6.8",
            filesystem: {},
            Eb: "tsc=reliable mitigations=off random.trust_cpu=on"
        }, {
            id: "basiclinux",
            L: {
                url: d + "bl3-5.img",
                size: 104857600,
                async: !1
            },
            name: "BasicLinux"
        }, {
            id: "xpud",
            O: {
                url: d + "xpud-0.9.2.iso",
                size: 67108864,
                async: !1
            },
            name: "xPUD",
            G: 268435456
        }, {
            id: "elks",
            L: {
                url: d + "elks-hd32-fat.img",
                size: 32514048,
                async: !1
            },
            name: "ELKS",
            I: "https://github.com/ghaerr/elks"
        }, {
            id: "nodeos",
            ub: {
                url: d + "nodeos-kernel.bin",
                size: 14452E3,
                async: !1
            },
            name: "NodeOS",
            Eb: "tsc=reliable mitigations=off random.trust_cpu=on"
        }, {
            id: "dsl",
            G: 268435456,
            O: {
                url: d + "dsl-4.11.rc2.iso",
                size: 52824064,
                async: !1
            },
            name: "Damn Small Linux",
            I: "http://www.damnsmalllinux.org/"
        }, {
            id: "xwoaf",
            G: 268435456,
            O: {
                url: d + "xwoaf_rebuild4.iso",
                size: 2205696,
                async: !1
            },
            name: "xwoaf",
            I: "https://pupngo.dk/xwinflpy/xwoaf_rebuild.html"
        }, {
            id: "minix",
            name: "Minix",
            G: 268435456,
            O: {
                url: d + "minix-3.3.0/.iso",
                size: 605581312,
                async: !0,
                M: 1048576,
                da: !0
            },
            I: "https://www.minix3.org/"
        }, {
            id: "unix-v7",
            name: "Unix V7",
            L: {
                url: d + "unix-v7x86-0.8a/.img",
                size: 152764416,
                async: !0,
                M: 262144,
                da: !0
            }
        }, {
            id: "kolibrios",
            V: {
                url: Lg ? d + "kolibri.img" : "//builds.kolibrios.org/en_US/data/data/kolibri.img",
                size: 1474560
            },
            name: "KolibriOS",
            Dc: "none",
            I: "https://kolibrios.org/en/"
        }, {
            id: "kolibrios-fallback",
            V: {
                url: d + "kolibri.img",
                size: 1474560
            },
            name: "KolibriOS"
        }, {
            id: "kolibrios-cdrom",
            O: {
                url: d + "kolibri.iso"
            },
            name: "KolibriOS",
            G: 268435456,
            Dc: "none",
            I: "https://kolibrios.org/en/",
            va: !0
        }, {
            id: "mu",
            L: {
                url: d + "mu-shell.img",
                size: 10321920,
                async: !1
            },
            G: 268435456,
            name: "Mu",
            I: "https://github.com/akkartik/mu"
        }, {
            id: "openbsd",
            L: {
                url: d + "openbsd/.img",
                size: 1073741824,
                async: !0,
                M: 1048576,
                da: !0
            },
            state: {
                url: d + "openbsd_state-v2.bin.zst"
            },
            G: 268435456,
            name: "OpenBSD"
        }, {
            id: "sortix",
            O: {
                url: d + "sortix-1.0-i686.iso",
                size: 71075840,
                async: !1
            },
            G: 536870912,
            name: "Sortix"
        }, {
            id: "openbsd-boot",
            L: {
                url: d + "openbsd/.img",
                size: 1073741824,
                async: !0,
                M: 1048576,
                da: !0
            },
            G: 268435456,
            name: "OpenBSD"
        }, {
            id: "netbsd",
            L: {
                url: d + "netbsd/.img",
                size: 511000064,
                async: !0,
                M: 1048576,
                da: !0
            },
            G: 268435456,
            name: "NetBSD"
        }, {
            id: "crazierl",
            Ob: {
                url: d + "crazierl-elf.img",
                size: 896592,
                async: !1
            },
            Kb: {
                url: d + "crazierl-initrd.img",
                size: 18448316,
                async: !1
            },
            va: !0,
            Eb: "kernel /libexec/ld-elf32.so.1",
            G: 134217728,
            name: "Crazierl"
        }, {
            id: "solos",
            V: {
                url: d + "os8.img",
                size: 1474560
            },
            name: "Sol OS",
            I: "http://oby.ro/os/"
        }, {
            id: "bootchess",
            V: {
                url: d + "bootchess.img",
                size: 1474560
            },
            name: "BootChess",
            I: "http://www.pouet.net/prod.php?which=64962"
        }, {
            id: "bootbasic",
            V: {
                url: d + "bootbasic.img",
                size: 512
            },
            name: "bootBASIC",
            I: "https://github.com/nanochess/bootBASIC"
        }, {
            id: "bootlogo",
            V: {
                url: d + "bootlogo.img",
                size: 512
            },
            name: "bootLogo",
            I: "https://github.com/nanochess/bootLogo"
        }, {
            id: "pillman",
            V: {
                url: d + "pillman.img",
                size: 512
            },
            name: "Pillman",
            I: "https://github.com/nanochess/Pillman"
        }, {
            id: "invaders",
            V: {
                url: d + "invaders.img",
                size: 512
            },
            name: "Invaders",
            I: "https://github.com/nanochess/Invaders"
        }, {
            id: "sectorlisp",
            V: {
                url: d + "sectorlisp-friendly.bin",
                size: 512
            },
            name: "SectorLISP",
            I: "https://justine.lol/sectorlisp2/"
        }, {
            id: "sectorforth",
            V: {
                url: d + "sectorforth.img",
                size: 512
            },
            name: "sectorforth",
            I: "https://github.com/cesarblum/sectorforth"
        }, {
            id: "floppybird",
            V: {
                url: d + "floppybird.img",
                size: 1474560
            },
            name: "Floppy Bird",
            I: "http://mihail.co/floppybird"
        }, {
            id: "stillalive",
            V: {
                url: d + "stillalive-os.img",
                size: 368640
            },
            name: "Still Alive",
            I: "https://github.com/maniekx86/stillalive-os"
        }, {
            id: "hello-v86",
            V: {
                url: d + "hello-v86.img",
                size: 512
            },
            name: "Hello v86"
        }, {
            id: "tetros",
            V: {
                url: d + "tetros.img",
                size: 512
            },
            name: "TetrOS",
            I: "https://github.com/daniel-e/tetros"
        }, {
            id: "dino",
            V: {
                url: d + "bootdino.img",
                size: 512
            },
            name: "dino",
            I: "https://github.com/franeklubi/dino"
        }, {
            id: "bootrogue",
            V: {
                url: d + "bootrogue.img",
                size: 512
            },
            name: "bootRogue",
            I: "https://github.com/nanochess/bootRogue"
        }, {
            id: "duskos",
            L: {
                url: d + "duskos.img",
                async: !1,
                size: 8388608
            },
            name: "Dusk OS",
            I: "http://duskos.org/"
        }, {
            id: "windows2000",
            G: 536870912,
            L: {
                url: d + "windows2k-v2/.img",
                size: 2147483648,
                async: !0,
                M: 262144,
                da: !0
            },
            name: "Windows 2000",
            state: {
                url: d + "windows2k_state-v4.bin.zst"
            },
            Nb: !0
        }, {
            id: "windows2000-boot",
            G: 536870912,
            L: {
                url: d + "windows2k-v2/.img",
                size: 2147483648,
                async: !0,
                M: 262144,
                da: !0
            },
            name: "Windows 2000"
        }, {
            id: "windows-me",
            G: 268435456,
            L: {
                url: d + "windowsme-v2/.img",
                size: 834666496,
                async: !0,
                M: 262144,
                da: !0
            },
            state: {
                url: d + "windows-me_state-v2.bin.zst"
            },
            name: "Windows ME"
        }, {
            id: "windowsnt4",
            G: 536870912,
            L: {
                url: d + "winnt4_noacpi/.img",
                size: 523837440,
                async: !0,
                M: 262144,
                da: !0
            },
            name: "Windows NT 4.0",
            qd: 2
        }, {
            id: "windowsnt35",
            G: 268435456,
            L: {
                url: d + "windowsnt351/.img",
                size: 163577856,
                async: !0,
                M: 262144,
                da: !0
            },
            name: "Windows NT 3.51"
        }, {
            id: "windowsnt3",
            G: 268435456,
            L: {
                url: d + "winnt31/.img",
                size: 91226112,
                async: !0,
                M: 262144,
                da: !0
            },
            name: "Windows NT 3.1"
        }, {
            id: "windows98",
            G: 134217728,
            L: {
                url: d + "windows98/.img",
                size: 314572800,
                async: !0,
                M: 262144,
                da: !0
            },
            name: "Windows 98",
            state: {
                url: d + "windows98_state-v2.bin.zst"
            },
            Nb: !0
        }, {
            id: "windows98-boot",
            G: 134217728,
            L: {
                url: d + "windows98/.img",
                size: 314572800,
                async: !0,
                M: 262144,
                da: !0
            },
            name: "Windows 98"
        }, {
            id: "windows95",
            G: 67108864,
            L: {
                url: d + "windows95-v2/.img",
                size: 471859200,
                async: !0,
                M: 262144,
                da: !0
            },
            name: "Windows 95"
        }, {
            id: "windows95-boot",
            G: 67108864,
            L: {
                url: d + "windows95-v2/.img",
                size: 471859200,
                async: !0,
                M: 262144,
                da: !0
            },
            name: "Windows 95"
        }, {
            id: "windows30",
            G: 67108864,
            O: {
                url: d + "Win30.iso",
                size: 7774208,
                async: !1
            },
            name: "Windows 3.0"
        }, {
            id: "windows31",
            G: 67108864,
            L: {
                url: d + "win31.img",
                async: !1,
                size: 34463744
            },
            name: "Windows 3.1"
        }, {
            id: "tilck",
            G: 134217728,
            L: {
                url: d + "tilck.img",
                async: !1,
                size: 37748736
            },
            name: "Tilck",
            I: "https://github.com/vvaltchev/tilck"
        }, {
            id: "littlekernel",
            Ob: {
                url: d + "littlekernel-multiboot.img",
                async: !1,
                size: 969580
            },
            name: "Little Kernel",
            I: "https://github.com/littlekernel/lk"
        }, {
            id: "sanos",
            G: 134217728,
            L: {
                url: d + "sanos-flp.img",
                async: !1,
                size: 1474560
            },
            name: "Sanos",
            I: "http://www.jbox.dk/sanos/"
        }, {
            id: "freebsd",
            G: 268435456,
            L: {
                url: d + "freebsd/.img",
                size: 2147483648,
                async: !0,
                M: 1048576,
                da: !0
            },
            state: {
                url: d + "freebsd_state-v2.bin.zst"
            },
            name: "FreeBSD"
        }, {
            id: "freebsd-boot",
            G: 268435456,
            L: {
                url: d + "freebsd/.img",
                size: 2147483648,
                async: !0,
                M: 1048576,
                da: !0
            },
            name: "FreeBSD"
        }, {
            id: "reactos",
            G: 536870912,
            L: {
                url: d + "reactos-v3/.img",
                size: 734003200,
                async: !0,
                M: 1048576,
                da: !0
            },
            state: {
                url: d + "reactos_state-v3.bin.zst"
            },
            Nb: !0,
            name: "ReactOS",
            va: !0,
            Dc: "virtio",
            I: "https://reactos.org/"
        }, {
            id: "reactos-boot",
            G: 536870912,
            L: {
                url: d + "reactos-v2/.img",
                size: 681574400,
                async: !0,
                M: 1048576,
                da: !0
            },
            name: "ReactOS",
            va: !0,
            I: "https://reactos.org/"
        }, {
            id: "skift",
            O: {
                url: d + "skift-20200910.iso",
                size: 64452608,
                async: !1
            },
            name: "Skift",
            I: "https://skiftos.org/"
        }, {
            id: "snowdrop",
            V: {
                url: d + "snowdrop.img",
                size: 1474560
            },
            name: "Snowdrop",
            I: "http://www.sebastianmihai.com/snowdrop/"
        }, {
            id: "openwrt",
            L: {
                url: d + "openwrt-18.06.1-x86-legacy-combined-squashfs.img",
                size: 19846474,
                async: !1
            },
            name: "OpenWrt"
        }, {
            id: "qnx",
            V: {
                url: d + "qnx-demo-network-4.05.img",
                size: 1474560
            },
            name: "QNX 4.05"
        }, {
            id: "9front",
            G: 134217728,
            L: {
                url: d + "9front-10931.386/.iso",
                size: 489453568,
                async: !0,
                M: 1048576,
                da: !0
            },
            state: {
                url: d + "9front_state-v3.bin.zst"
            },
            va: !0,
            name: "9front",
            I: "https://9front.org/"
        }, {
            id: "9front-boot",
            G: 134217728,
            L: {
                url: d + "9front-10931.386/.iso",
                size: 489453568,
                async: !0,
                M: 1048576,
                da: !0
            },
            va: !0,
            name: "9front",
            I: "https://9front.org/"
        }, {
            id: "9legacy",
            G: 536870912,
            L: {
                url: d + "9legacy.img",
                async: !1,
                size: 16E6
            },
            name: "9legacy",
            I: "http://www.9legacy.org/"
        }, {
            id: "mobius",
            V: {
                url: d + "mobius-fd-release5.img",
                size: 1474560
            },
            name: "Mobius"
        }, {
            id: "android",
            G: 536870912,
            O: {
                url: d + "android-x86-1.6-r2/.iso",
                size: 54661120,
                async: !0,
                M: 1048576,
                da: !0
            },
            name: "Android"
        }, {
            id: "android4",
            G: 536870912,
            O: {
                url: d + "android_x86_nonsse3_4.4r1_20140904/.iso",
                size: 247463936,
                async: !0,
                M: 1048576,
                da: !0
            },
            name: "Android 4"
        }, {
            id: "tinycore",
            G: 268435456,
            L: {
                url: d + "TinyCore-11.0.iso",
                size: 19922944,
                async: !1
            },
            name: "Tinycore",
            I: "http://www.tinycorelinux.net/"
        }, {
            id: "slitaz",
            G: 536870912,
            L: {
                url: d + "slitaz-rolling-2024.iso",
                size: 56573952,
                async: !1
            },
            name: "SliTaz",
            I: "https://slitaz.org/"
        }, {
            id: "freenos",
            G: 268435456,
            O: {
                url: d + "FreeNOS-1.0.3.iso",
                async: !1,
                size: 11014144
            },
            name: "FreeNOS",
            va: !0,
            I: "http://www.freenos.org/"
        }, {
            id: "syllable",
            G: 536870912,
            L: {
                url: d + "syllable-destop-0.6.7/.img",
                async: !0,
                size: 524288E3,
                M: 524288,
                da: !0
            },
            name: "Syllable",
            I: "http://syllable.metaproject.frl/"
        }, {
            id: "toaruos",
            G: 536870912,
            O: {
                url: d + "toaruos-1.6.1-core.iso",
                size: 67567616,
                async: !1
            },
            name: "ToaruOS",
            va: !0,
            I: "https://toaruos.org/"
        }, {
            id: "nopeos",
            O: {
                url: d + "nopeos-0.1.iso",
                size: 532480,
                async: !1
            },
            name: "Nope OS",
            I: "https://github.com/d99kris/nopeos"
        }, {
            id: "soso",
            O: {
                url: d + "soso.iso",
                size: 22546432,
                async: !1
            },
            name: "Soso",
            I: "https://github.com/ozkl/soso"
        }, {
            id: "pcmos",
            V: {
                url: d + "PCMOS386-9-user-patched.img",
                size: 1474560
            },
            name: "PC-MOS/386",
            I: "https://github.com/roelandjansen/pcmos386v501"
        }, {
            id: "jx",
            V: {
                url: d + "jx-demo.img",
                size: 1474560
            },
            name: "JX",
            I: "https://www4.cs.fau.de/Projects/JX/index.html"
        }, {
            id: "house",
            V: {
                url: d + "hOp-0.8.img",
                size: 1474560
            },
            name: "House",
            I: "https://programatica.cs.pdx.edu/House/"
        }, {
            id: "bleskos",
            name: "BleskOS",
            O: {
                url: d + "bleskos_2024u32.iso",
                size: 1835008,
                async: !1
            },
            I: "https://github.com/VendelinSlezak/BleskOS"
        }, {
            id: "boneos",
            name: "BoneOS",
            O: {
                url: d + "BoneOS.iso",
                size: 11429888,
                async: !1
            },
            I: "https://amanuel.io/projects/BoneOS/"
        }, {
            id: "mikeos",
            name: "MikeOS",
            O: {
                url: d + "mikeos.iso",
                size: 3311616,
                async: !1
            },
            I: "https://mikeos.sourceforge.net/"
        }, {
            id: "bluejay",
            name: "Blue Jay",
            V: {
                url: d + "bj050.img",
                size: 1474560
            },
            I: "https://archiveos.org/blue-jay/"
        }, {
            id: "t3xforth",
            name: "T3XFORTH",
            V: {
                url: d + "t3xforth.img",
                size: 1474560
            },
            I: "https://t3x.org/t3xforth/"
        }, {
            id: "nanoshell",
            name: "NanoShell",
            O: {
                url: d + "nanoshell.iso",
                size: 6785024,
                async: !1
            },
            I: "https://github.com/iProgramMC/NanoShellOS"
        }, {
            id: "catk",
            name: "CatK",
            O: {
                url: d + "catkernel.iso",
                size: 11968512,
                async: !1
            },
            I: "https://catk.neocities.org/"
        }, {
            id: "mcp",
            name: "M/CP",
            V: {
                url: d + "mcp2.img",
                size: 512
            },
            I: "https://github.com/ybuzoku/MCP"
        }, {
            id: "ibm-exploring",
            name: "Exploring The IBM Personal Computer",
            V: {
                url: d + "ibm-exploring.img",
                size: 368640
            }
        }, {
            id: "leetos",
            name: "lEEt/OS",
            V: {
                url: d + "leetos.img",
                size: 1474560
            },
            I: "http://sininenankka.dy.fi/leetos/index.php"
        }, {
            id: "newos",
            name: "NewOS",
            V: {
                url: d + "newos-flp.img",
                size: 1474560,
                async: !1
            },
            I: "https://newos.org/"
        }, {
            id: "aros-broadway",
            name: "AROS Broadway",
            G: 536870912,
            O: {
                url: d + "broadway10/.iso",
                size: 742051840,
                async: !0,
                M: 524288,
                da: !0
            },
            I: "https://web.archive.org/web/20231109224346/http://www.aros-broadway.de/"
        }, {
            id: "icaros",
            name: "Icaros Desktop",
            G: 536870912,
            O: {
                url: d + "icaros-pc-i386-2.3/.iso",
                size: 726511616,
                async: !0,
                M: 524288,
                da: !0
            },
            I: "http://vmwaros.blogspot.com/"
        }, {
            id: "tinyaros",
            name: "Tiny Aros",
            G: 536870912,
            O: {
                url: d + "tinyaros-pc-i386/.iso",
                size: 111175680,
                async: !0,
                M: 524288,
                da: !0
            },
            I: "https://www.tinyaros.it/"
        }, {
            id: "dancy",
            name: "Dancy",
            O: {
                url: d + "dancy.iso",
                size: 10485760,
                async: !1
            },
            I: "https://github.com/Tiihala/Dancy"
        }, {
            id: "curios",
            name: "CuriOS",
            L: {
                url: d + "curios.img",
                size: 83886080,
                async: !1
            },
            I: "https://github.com/h5n1xp/CuriOS"
        }, {
            id: "os64",
            name: "OS64",
            O: {
                url: d + "os64boot.iso",
                size: 5580800,
                async: !1
            },
            I: "https://os64.blogspot.com/"
        }, {
            id: "ipxe",
            name: "iPXE",
            O: {
                url: d + "ipxe.iso",
                size: 4194304,
                async: !1
            },
            I: "https://ipxe.org/"
        }, {
            id: "netboot.xyz",
            name: "netboot.xyz",
            O: {
                url: d + "netboot.xyz.iso",
                size: 2398208,
                async: !1
            },
            I: "https://netboot.xyz/",
            Dc: "virtio"
        }, {
            id: "squeaknos",
            name: "SqueakNOS",
            O: {
                url: d + "SqueakNOS.iso",
                size: 61171712,
                async: !1
            },
            G: 536870912,
            I: "https://squeaknos.blogspot.com/"
        }, {
            id: "chokanji4",
            name: "Chokanji 4",
            L: {
                url: d + "chokanji4/.img.zst",
                size: 10737418240,
                async: !0,
                M: 262144,
                da: !0
            },
            G: 536870912,
            I: "https://archive.org/details/brightv4000"
        }];
        var e = c.get("profile");
        if (!e) {
            var f = document.createElement("link");
            f.rel = "prefetch";
            f.href = "build/v86.wasm" + Ng();
            document.head.appendChild(f)
        }
        f = document.createElement("link");
        f.rel = "prefetch";
        f.href = "build/xterm.js";
        document.head.appendChild(f);
        for (const k of d) {
            if (e === k.id) {
                Ug(k, c);
                return
            }
            const l = Y("start_" + k.id);
            l && (l.onclick = m => {
                m.ctrlKey || (m.preventDefault(),
                l.blur(),
                Ug(k, null))
            }
            )
        }
        if ("custom" === e) {
            if (c.has("hda.url") || c.has("cdrom.url") || c.has("fda.url")) {
                Ug(null, c);
                return
            }
        } else if (/^[a-zA-Z0-9\-_]+\/[a-zA-Z0-9\-_]+$/g.test(e)) {
            const k = "https://v86-user-images.b-cdn.net/" + e;
            fetch(k + "/profile.json").catch( () => alert("Profile not found: " + e)).then(l => l.json()).then(l => {
                function m(p) {
                    return p && {
                        url: k + "/" + p.url,
                        async: p.async,
                        size: p.size
                    }
                }
                l = {
                    id: l.id,
                    name: l.name,
                    G: l.memory_size,
                    ma: l.vga_memory_size,
                    va: l.acpi,
                    Db: l.boot_order,
                    L: m(l.hda),
                    O: m(l.cdrom),
                    V: m(l.fda),
                    Ob: m(l.multiboot),
                    ub: m(l.bzimage),
                    Kb: m(l.initrd)
                };
                Ug(l, c)
            }
            )
        }
        c.has("m") && (Y("memory_size").value = c.get("m"));
        c.has("vram") && (Y("vga_memory_size").value = c.get("vram"));
        c.has("relay_url") && (Y("relay_url").value = c.get("relay_url"));
        c.has("mute") && (Y("disable_audio").checked = Pg(c.get("mute")));
        c.has("acpi") && (Y("acpi").checked = Pg(c.get("acpi")));
        c.has("boot_order") && (Y("boot_order").value = c.get("boot_order"));
        for (const k of ["hda", "hdb"]) {
            const l = Y(k + "_toggle_empty_disk");
            l && (l.onclick = function(m) {
                m.preventDefault();
                m = document.createElement("input");
                m.id = k + "_empty_size";
                m.type = "number";
                m.min = "1";
                m.value = "100";
                const p = l.parentNode;
                p.innerHTML = "";
                p.append("Empty disk of ", m, " MB")
            }
            )
        }
        var h = Array.from(document.querySelectorAll("#oses tbody tr")).map(k => {
            const [,l,m] = k.children[1].textContent.match(/([\d\.]+)\+? (\w+)/);
            let p = +l;
            "MB" === m ? p *= 1048576 : "KB" === m && (p *= 1024);
            return {
                element: k,
                size: p,
                Sh: "gui_icon" === k.children[2].firstChild.className,
                family: k.children[3].textContent.replace(/-like/, ""),
                yh: k.children[4].textContent,
                status: k.children[5].textContent,
                source: k.children[6].textContent,
                languages: new Set(k.children[7].textContent.split(", ")),
                Sg: k.children[8].textContent
            }
        }
        );
        d = [[{
            id: "linux",
            Ba: k => "Linux" === k.family
        }, {
            id: "bsd",
            Ba: k => "BSD" === k.family
        }, {
            id: "windows",
            Ba: k => "Windows" === k.family
        }, {
            id: "unix",
            Ba: k => "Unix" === k.family
        }, {
            id: "dos",
            Ba: k => "DOS" === k.family
        }, {
            id: "custom",
            Ba: k => "Custom" === k.family
        }], [{
            id: "graphical",
            Ba: k => k.Sh
        }, {
            id: "text",
            Ba: k => !k.Sh
        }], [{
            id: "floppy",
            Ba: k => "Floppy" === k.Sg
        }, {
            id: "cd",
            Ba: k => "CD" === k.Sg
        }, {
            id: "hd",
            Ba: k => "HD" === k.Sg
        }], [{
            id: "bootsector",
            Ba: k => 512 >= k.size
        }, {
            id: "lt5mb",
            Ba: k => 5242880 >= k.size
        }, {
            id: "gt5mb",
            Ba: k => 5242880 < k.size
        }], [{
            id: "modern",
            Ba: k => "Modern" === k.status
        }, {
            id: "historic",
            Ba: k => "Historic" === k.status
        }], [{
            id: "opensource",
            Ba: k => "Open-source" === k.source
        }, {
            id: "proprietary",
            Ba: k => "Proprietary" === k.source
        }], [{
            id: "16bit",
            Ba: k => "16-bit" === k.yh
        }, {
            id: "32bit",
            Ba: k => "32-bit" === k.yh
        }], [{
            id: "asm",
            Ba: k => k.languages.has("ASM")
        }, {
            id: "c",
            Ba: k => k.languages.has("C")
        }, {
            id: "cpp",
            Ba: k => k.languages.has("C++")
        }, {
            id: "other_lang",
            Ba: k => ["ASM", "C", "C++"].every(l => !k.languages.has(l))
        }]];
        var g = [];
        for (const k of d)
            d = k.filter(l => {
                const m = document.getElementById(`filter_${l.id}`);
                m && (m.onchange = a,
                l.element = m);
                return m
            }
            ),
            d.length && g.push(d);
        b("network_none", "");
        b("network_inbrowser", "inbrowser");
        b("network_fetch", "fetch");
        b("network_relay", "wss://relay.widgetry.org/");
        b("network_wisp", "wisps://wisp.mercurywork.shop/v86/")
    } else
        alert("Your browser is not supported because it doesn't support WebAssembly")
}
window.addEventListener("load", Tg, !1);
window.addEventListener("load", function() {
    setTimeout(function() {
        window.addEventListener("popstate", Vg)
    }, 0)
});
"complete" === document.readyState && Tg();
function Ug(a, b) {
    Y("boot_options").style.display = "none";
    const c = new Map;
    c.set("profile", a?.id || "custom");
    const d = {};
    if (a && (a.state && (Y("reset").style.display = "none"),
    Og(a.name),
    d.Ac = a.state,
    d.filesystem = a.filesystem,
    d.V = a.V,
    d.O = a.O,
    d.L = a.L,
    d.pb = a.pb,
    d.Ob = a.Ob,
    d.ub = a.ub,
    d.Kb = a.Kb,
    d.Eb = a.Eb,
    d.lf = a.lf,
    d.Nb = a.Nb,
    d.qd = a.qd,
    d.va = a.va,
    d.G = a.G,
    d.ma = a.ma,
    d.Db = a.Db,
    d.Dc = a.Dc,
    a.I)) {
        Y("description").style.display = "block";
        var e = document.createElement("a");
        e.href = a.I;
        e.textContent = a.name;
        e.target = "_blank";
        Y("description").append(document.createTextNode("Running "), e)
    }
    if (b) {
        if (!d.Ac) {
            e = parseInt(b.get("chunk_size"), 10);
            0 <= e ? (e = Math.min(4194304, Math.max(512, e)),
            e = sa(e)) : e = 262144;
            if (b.has("hda.url"))
                d.L = {
                    size: parseInt(b.get("hda.size"), 10) || void 0,
                    url: b.get("hda.url"),
                    M: e,
                    async: !0
                };
            else if (b.has("hda.empty")) {
                var f = parseInt(b.get("hda.empty"), 10);
                0 < f && (d.L = {
                    buffer: new ArrayBuffer(f)
                })
            }
            b.has("hdb.url") ? d.pb = {
                size: parseInt(b.get("hdb.size"), 10) || void 0,
                url: b.get("hdb.url"),
                M: e,
                async: !0
            } : b.has("hdb.empty") && (f = parseInt(b.get("hdb.empty"), 10),
            0 < f && (d.pb = {
                buffer: new ArrayBuffer(f)
            }));
            b.has("cdrom.url") && (d.O = {
                size: parseInt(b.get("cdrom.size"), 10) || void 0,
                url: b.get("cdrom.url"),
                M: e,
                async: !0
            });
            b.has("fda.url") && (d.V = {
                size: parseInt(b.get("fda.size"), 10) || void 0,
                url: b.get("fda.url"),
                async: !1
            });
            e = parseInt(b.get("m"), 10);
            0 < e && (d.G = 1048576 * Math.max(16, e));
            e = parseInt(b.get("vram"), 10);
            0 < e && (d.ma = 1048576 * e);
            d.va = b.has("acpi") ? Pg(b.get("acpi")) : d.va;
            d.Al = "bochs" === b.get("bios");
            d.Dc = b.get("net_device_type") || d.Dc
        }
        d.Gc = b.get("relay_url");
        d.qf = Pg(b.get("disable_jit"));
        d.bg = Pg(b.get("mute"))
    }
    d.Gc || (d.Gc = Y("relay_url").value,
    Mg.includes(d.Gc) || c.set("relay_url", d.Gc));
    d.Gc.startsWith("fetch:") && (d.Nc = d.Gc.slice(6),
    d.Gc = "fetch");
    d.bg = Y("disable_audio").checked || d.bg;
    d.bg && c.set("mute", "1");
    if (!d.Ac) {
        if (e = Y("bios").files[0])
            d.nb = {
                buffer: e
            };
        if (f = Y("vga_bios").files[0])
            d.Nd = {
                buffer: f
            };
        if (f = Y("floppy_image").files[0])
            d.V = {
                buffer: f
            };
        const m = Y("cdrom_image").files[0];
        m && (d.O = {
            buffer: m
        });
        const p = Y("hda_image")?.files[0];
        p && (d.L = {
            buffer: p
        });
        var h = +Y("hda_empty_size")?.value;
        h && (h *= 1048576,
        d.L = {
            buffer: new ArrayBuffer(h)
        },
        c.set("hda.empty", String(h)));
        if (h = Y("hdb_image")?.files[0])
            d.pb = {
                buffer: h
            };
        var g = +Y("hdb_empty_size")?.value;
        if (g) {
            var k = 1048576 * g;
            d.pb = {
                buffer: new ArrayBuffer(1048576 * g)
            };
            c.set("hdb.empty", String(k))
        }
        if (g = Y("multiboot_image")?.files[0])
            d.Ob = {
                buffer: g
            };
        if (k = Y("bzimage").files[0])
            d.ub = {
                buffer: k
            };
        if (k = Y("initrd").files[0])
            d.Kb = {
                buffer: k
            };
        (e = g?.name || p?.name || m?.name || h?.name || f?.name || e?.name) && Og(e);
        e = parseInt(Y("memory_size").value, 10) || 128;
        d.G && 128 === e || (d.G = 1048576 * e);
        128 !== e && c.set("m", String(e));
        e = parseInt(Y("vga_memory_size").value, 10) || 8;
        d.ma && 8 === e || (d.ma = 1048576 * e);
        8 !== e && c.set("vram", String(e));
        e = parseInt(Y("boot_order").value, 16) || 0;
        d.Db && 0 === e || (d.Db = e);
        0 !== d.Db && c.set("boot_order", d.Db.toString(16));
        void 0 === d.va && (d.va = Y("acpi").checked,
        d.va && c.set("acpi", "1"));
        d.nb || (d.nb = {
            url: "bios/seabios.bin"
        });
        d.Nd || (d.Nd = {
            url: "bios/vgabios.bin"
        });
        d.Al && (d.nb = {
            url: "bios/bochs-bios.bin"
        },
        d.Nd = {
            url: "bios/bochs-vgabios.bin"
        })
    }
    b || Wg(c);
    const l = new Ud({
        Mi: "build/v86.wasm" + Ng(),
        screen: {
            Zf: Y("screen_container"),
            Bl: !1
        },
        dd: {
            type: d.Dc || "ne2k",
            Gc: d.Gc,
            Nc: d.Nc
        },
        bj: !0,
        G: d.G,
        ma: d.ma,
        Db: d.Db,
        nb: d.nb,
        Nd: d.Nd,
        V: d.V,
        L: d.L,
        pb: d.pb,
        O: d.O,
        Ob: d.Ob,
        ub: d.ub,
        Kb: d.Kb,
        Eb: d.Eb,
        lf: d.lf,
        va: d.va,
        qf: d.qf,
        Ac: d.Ac,
        filesystem: d.filesystem || {},
        tj: d.bg,
        Nb: d.Nb,
        qd: d.qd
    });
    ce(l, "emulator-ready", function() {
        if (l.Aa.s.Ma.exports.profiler_is_enabled()) {
            const m = document.createElement("pre");
            document.body.appendChild(m);
            setInterval(function() {
                if (l.vd()) {
                    var p = l.Aa.s
                      , r = ""
                      , v = "COMPILE COMPILE_SKIPPED_NO_NEW_ENTRY_POINTS COMPILE_WRONG_ADDRESS_SPACE COMPILE_CUT_OFF_AT_END_OF_PAGE COMPILE_WITH_LOOP_SAFETY COMPILE_PAGE COMPILE_PAGE/COMPILE COMPILE_BASIC_BLOCK COMPILE_DUPLICATED_BASIC_BLOCK COMPILE_WASM_BLOCK COMPILE_WASM_LOOP COMPILE_DISPATCHER COMPILE_ENTRY_POINT COMPILE_WASM_TOTAL_BYTES COMPILE_WASM_TOTAL_BYTES/COMPILE_PAGE RUN_INTERPRETED RUN_INTERPRETED_NEW_PAGE RUN_INTERPRETED_PAGE_HAS_CODE RUN_INTERPRETED_PAGE_HAS_ENTRY_AFTER_PAGE_WALK RUN_INTERPRETED_NEAR_END_OF_PAGE RUN_INTERPRETED_DIFFERENT_STATE RUN_INTERPRETED_DIFFERENT_STATE_CPL3 RUN_INTERPRETED_DIFFERENT_STATE_FLAT RUN_INTERPRETED_DIFFERENT_STATE_IS32 RUN_INTERPRETED_DIFFERENT_STATE_SS32 RUN_INTERPRETED_MISSED_COMPILED_ENTRY_RUN_INTERPRETED RUN_INTERPRETED_STEPS RUN_FROM_CACHE RUN_FROM_CACHE_STEPS RUN_FROM_CACHE_STEPS/RUN_FROM_CACHE RUN_FROM_CACHE_STEPS/RUN_INTERPRETED_STEPS DIRECT_EXIT INDIRECT_JUMP INDIRECT_JUMP_NO_ENTRY NORMAL_PAGE_CHANGE NORMAL_FALLTHRU NORMAL_FALLTHRU_WITH_TARGET_BLOCK NORMAL_BRANCH NORMAL_BRANCH_WITH_TARGET_BLOCK CONDITIONAL_JUMP CONDITIONAL_JUMP_PAGE_CHANGE CONDITIONAL_JUMP_EXIT CONDITIONAL_JUMP_FALLTHRU CONDITIONAL_JUMP_FALLTHRU_WITH_TARGET_BLOCK CONDITIONAL_JUMP_BRANCH CONDITIONAL_JUMP_BRANCH_WITH_TARGET_BLOCK DISPATCHER_SMALL DISPATCHER_LARGE LOOP LOOP_SAFETY CONDITION_OPTIMISED CONDITION_UNOPTIMISED CONDITION_UNOPTIMISED_PF CONDITION_UNOPTIMISED_UNHANDLED_L CONDITION_UNOPTIMISED_UNHANDLED_LE FAILED_PAGE_CHANGE SAFE_READ_FAST SAFE_READ_SLOW_PAGE_CROSSED SAFE_READ_SLOW_NOT_VALID SAFE_READ_SLOW_NOT_USER SAFE_READ_SLOW_IN_MAPPED_RANGE SAFE_WRITE_FAST SAFE_WRITE_SLOW_PAGE_CROSSED SAFE_WRITE_SLOW_NOT_VALID SAFE_WRITE_SLOW_NOT_USER SAFE_WRITE_SLOW_IN_MAPPED_RANGE SAFE_WRITE_SLOW_READ_ONLY SAFE_WRITE_SLOW_HAS_CODE SAFE_READ_WRITE_FAST SAFE_READ_WRITE_SLOW_PAGE_CROSSED SAFE_READ_WRITE_SLOW_NOT_VALID SAFE_READ_WRITE_SLOW_NOT_USER SAFE_READ_WRITE_SLOW_IN_MAPPED_RANGE SAFE_READ_WRITE_SLOW_READ_ONLY SAFE_READ_WRITE_SLOW_HAS_CODE PAGE_FAULT TLB_MISS MAIN_LOOP MAIN_LOOP_IDLE DO_MANY_CYCLES CYCLE_INTERNAL INVALIDATE_ALL_MODULES_NO_FREE_WASM_INDICES INVALIDATE_MODULE_WRITTEN_WHILE_COMPILED INVALIDATE_MODULE_UNUSED_AFTER_OVERWRITE INVALIDATE_MODULE_DIRTY_PAGE INVALIDATE_PAGE_HAD_CODE INVALIDATE_PAGE_HAD_ENTRY_POINTS DIRTY_PAGE_DID_NOT_HAVE_CODE RUN_FROM_CACHE_EXIT_SAME_PAGE RUN_FROM_CACHE_EXIT_NEAR_END_OF_PAGE RUN_FROM_CACHE_EXIT_DIFFERENT_PAGE CLEAR_TLB FULL_CLEAR_TLB TLB_FULL TLB_GLOBAL_FULL MODRM_SIMPLE_REG MODRM_SIMPLE_REG_WITH_OFFSET MODRM_SIMPLE_CONST_OFFSET MODRM_COMPLEX SEG_OFFSET_OPTIMISED SEG_OFFSET_NOT_OPTIMISED SEG_OFFSET_NOT_OPTIMISED_ES SEG_OFFSET_NOT_OPTIMISED_FS SEG_OFFSET_NOT_OPTIMISED_GS SEG_OFFSET_NOT_OPTIMISED_NOT_FLAT".split(" ")
                      , B = 0;
                    const y = {};
                    for (let q = 0; q < v.length; q++) {
                        const w = v[q];
                        var C = void 0;
                        if (w.includes("/")) {
                            B++;
                            const [D,T] = w.split("/");
                            C = y[D] / y[T]
                        } else
                            C = y[w] = p.Ma.exports.profiler_stat_get(q - B),
                            C = 1E8 <= C ? Math.round(C / 1E6) + "m" : 1E5 <= C ? Math.round(C / 1E3) + "k" : C;
                        r += w + "=" + C + "\n"
                    }
                    r += "\n";
                    v = p.Ma.exports.get_valid_tlb_entries_count();
                    B = p.Ma.exports.get_valid_global_tlb_entries_count();
                    r = r + ("TLB_ENTRIES=" + v + " (" + B + " global, " + (v - B) + " non-global)\nWASM_TABLE_FREE=") + (p.Ma.exports.jit_get_wasm_table_index_free_list_count() + "\n");
                    r += "JIT_CACHE_SIZE=" + p.Ma.exports.jit_get_cache_size() + "\n";
                    r += "FLAT_SEGMENTS=" + p.Ma.exports.has_flat_segmentation() + "\n";
                    r += "wasm memory size: " + (p.La.buffer.byteLength >> 20) + "m\n";
                    r += "Config:\n";
                    r += "JIT_DISABLED=" + p.Ma.exports.get_jit_config(0) + "\n";
                    r += "MAX_PAGES=" + p.Ma.exports.get_jit_config(1) + "\n";
                    r += "JIT_USE_LOOP_SAFETY=" + !!p.Ma.exports.get_jit_config(2) + "\n";
                    r += "MAX_EXTRA_BASIC_BLOCKS=" + p.Ma.exports.get_jit_config(3) + "\n";
                    p = [Lb(p, !1, !1, !1, !1), Lb(p, !0, !1, !1, !1), Lb(p, !1, !0, !1, !1), Lb(p, !1, !1, !0, !1), Lb(p, !1, !1, !1, !0)].join("\n\n");
                    m.textContent = r + p
                }
            }, 1E3)
        }
        "dsl helenos android android4 redox beos 9legacy".split(" ").includes(a?.id) && setTimeout( () => {
            ee(l, "9legacy" === a.id ? "1\n" : "\n")
        }
        , 3E3);
        Xg(a, d, l);
        b?.has("c") && setTimeout(function() {
            ee(l, b.get("c") + "\n")
        }, 25);
        b?.has("s") && setTimeout(function() {
            for (var m = b.get("s") + "\n", p = 0; p < m.length; p++)
                l.v.send("serial0-input", m.charCodeAt(p))
        }, 25)
    });
    ce(l, "emulator-loaded", function() {
        l.Aa.s.u.O || (Y("change_cdrom_image").style.display = "none")
    });
    ce(l, "download-progress", function(m) {
        const p = Y("loading");
        p.style.display = "block";
        if (m.yf.endsWith(".wasm")) {
            var r = m.yf.split("/");
            p.textContent = "Fetching " + r[r.length - 1] + " ..."
        } else if (m.xf === m.wf - 1 && m.loaded >= m.total - 2048)
            p.textContent = "Done downloading. Starting now ...";
        else {
            r = "Downloading images ";
            "number" === typeof m.xf && m.wf && (r += "[" + (m.xf + 1) + "/" + m.wf + "] ");
            if (m.total && "number" === typeof m.loaded) {
                m = Math.floor(m.loaded / m.total * 100);
                m = Math.min(100, Math.max(0, m));
                var v = Math.floor(m / 2);
                r = r + (m + "% [") + "#".repeat(v);
                r += " ".repeat(50 - v) + "]"
            } else
                r += ".".repeat(Rg++ % 50);
            p.textContent = r
        }
    });
    ce(l, "download-error", function(m) {
        const p = Y("loading");
        p.style.display = "block";
        p.textContent = `Loading ${m.yf} failed. Check your connection and reload the page to try again.`
    })
}
function Xg(a, b, c) {
    function d() {
        var z = Date.now()
          , L = c.Aa ? c.Aa.s.Pj[0] >>> 0 : 0;
        L < l && (l -= 4294967296);
        var I = L - l;
        l = L;
        r += I;
        if (L = z - g)
            k += L,
            g = z,
            Y("speed").textContent = (I / 1E3 / L).toFixed(1),
            Y("avg_speed").textContent = (r / 1E3 / k).toFixed(1),
            z = k / 1E3 | 0,
            Y("running_time").textContent = 60 > z ? z + "s" : 3600 > z ? (z / 60 | 0) + "m " + ea(z % 60, 2) + "s" : (z / 3600 | 0) + "h " + ea((z / 60 | 0) % 60, 2) + "m " + ea(z % 60, 2) + "s"
    }
    function e(z, L, I) {
        var M = Y("get_" + I + "_image");
        !z || z.async ? M.style.display = "none" : M.onclick = function() {
            const ma = L.file && L.file.name || (a?.id || "v86") + ("cdrom" === I ? ".iso" : ".img");
            if (L.Qh) {
                var Ia = L.Qh(ma);
                ya(Ia, ma)
            } else
                L.bc(function(Xa) {
                    Xa ? xa(Xa, ma) : alert("The file could not be loaded. Maybe it's too big?")
                });
            M.blur()
        }
    }
    function f(z) {
        z.ctrlKey ? window.onbeforeunload = function() {
            window.onbeforeunload = null;
            return "CTRL-W cannot be sent to the emulator."
        }
        : window.onbeforeunload = null
    }
    Y("loading").style.display = "none";
    Y("runtime_options").style.display = "block";
    Y("runtime_infos").style.display = "block";
    Y("screen_container").style.display = "block";
    b.filesystem ? Yg(c) : ce(c, "9p-attach", function() {
        Yg(c)
    });
    Y("run").onclick = function() {
        c.vd() ? (Y("run").value = "Run",
        c.stop()) : (Y("run").value = "Pause",
        c.Lf());
        Y("run").blur()
    }
    ;
    Y("exit").onclick = function() {
        c.wa();
        const z = new URL(location.href);
        z.searchParams.delete("profile");
        location.href = z.pathname + z.search
    }
    ;
    Y("lock_mouse").onclick = function() {
        if (!h)
            Y("toggle_mouse").onclick();
        fe();
        Y("lock_mouse").blur()
    }
    ;
    var h = !0;
    Y("toggle_mouse").onclick = function() {
        h = !h;
        c.j && (c.j.fg = h);
        Y("toggle_mouse").value = (h ? "Dis" : "En") + "able mouse";
        Y("toggle_mouse").blur()
    }
    ;
    var g = 0
      , k = 0
      , l = 0
      , m = null
      , p = !1
      , r = 0;
    ce(c, "emulator-started", function() {
        g = Date.now();
        m = setInterval(d, 1E3)
    });
    ce(c, "emulator-stopped", function() {
        d();
        null !== m && clearInterval(m)
    });
    var v = 0
      , B = 0
      , C = [];
    ce(c, "9p-read-start", function(z) {
        z = z[0];
        C.push(z);
        Y("info_filesystem").style.display = "block";
        Y("info_filesystem_status").textContent = "Loading ...";
        Y("info_filesystem_last_file").textContent = z
    });
    ce(c, "9p-read-end", function(z) {
        v += z[1];
        Y("info_filesystem_bytes_read").textContent = v;
        const L = z[0];
        C = C.filter(I => I !== L);
        C[0] ? Y("info_filesystem_last_file").textContent = C[0] : Y("info_filesystem_status").textContent = "Idle"
    });
    ce(c, "9p-write-end", function(z) {
        B += z[1];
        Y("info_filesystem_bytes_written").textContent = B;
        C[0] || (Y("info_filesystem_last_file").textContent = z[0])
    });
    var y = 0
      , q = 0
      , w = 0
      , D = 0;
    Y("ide_type").textContent = c.ob.O ? " (CD-ROM)" : " (hard disk)";
    ce(c, "ide-read-start", function() {
        Y("info_storage").style.display = "block";
        Y("info_storage_status").textContent = "Loading ..."
    });
    ce(c, "ide-read-end", function(z) {
        y += z[1];
        q += z[2];
        Y("info_storage_status").textContent = "Idle";
        Y("info_storage_bytes_read").textContent = y;
        Y("info_storage_sectors_read").textContent = q
    });
    ce(c, "ide-write-end", function(z) {
        w += z[1];
        D += z[2];
        Y("info_storage_bytes_written").textContent = w;
        Y("info_storage_sectors_written").textContent = D
    });
    var T = 0
      , ca = 0;
    ce(c, "eth-receive-end", function(z) {
        ca += z[0];
        Y("info_network").style.display = "block";
        Y("info_network_bytes_received").textContent = ca
    });
    ce(c, "eth-transmit-end", function(z) {
        T += z[0];
        Y("info_network").style.display = "block";
        Y("info_network_bytes_transmitted").textContent = T
    });
    ce(c, "mouse-enable", function(z) {
        p = z;
        Y("info_mouse_enabled").textContent = z ? "Yes" : "No"
    });
    ce(c, "screen-set-size", function(z) {
        const [L,I,M] = z;
        Y("info_res").textContent = L + "x" + I + (M ? "x" + M : "");
        Y("info_vga_mode").textContent = M ? "Graphical" : "Text"
    });
    Y("reset").onclick = function() {
        c.bh();
        Y("reset").blur()
    }
    ;
    e(b.L, c.ob.L, "hda");
    e(b.pb, c.ob.pb, "hdb");
    e(b.V, c.ob.V, "fda");
    e(b.We, c.ob.We, "fdb");
    e(b.O, c.ob.O, "cdrom");
    Y("change_fda_image").value = b.V ? "Eject floppy image" : "Insert floppy image";
    Y("change_fda_image").onclick = function() {
        if (c.Aa.s.u.oe.td)
            c.eg(),
            Y("change_fda_image").value = "Insert floppy image";
        else {
            const z = document.createElement("input");
            z.type = "file";
            z.onchange = async function() {
                const L = z.files[0];
                L && (await c.Mf({
                    buffer: L
                }),
                Y("change_fda_image").value = "Eject floppy image")
            }
            ;
            z.click()
        }
        Y("change_fda_image").blur()
    }
    ;
    Y("change_cdrom_image").value = b.O ? "Eject CD image" : "Insert CD image";
    Y("change_cdrom_image").onclick = function() {
        if (c.Aa.s.u.O.buffer)
            Kf(c.Aa.s.u.O),
            Y("change_cdrom_image").value = "Insert CD image";
        else {
            const z = document.createElement("input");
            z.type = "file";
            z.multiple = "multiple";
            z.onchange = async function() {
                const L = z.files;
                if (1 === L.length && L[0].name.endsWith(".iso"))
                    var I = L[0];
                else if (L.length) {
                    I = [];
                    for (const M of L)
                        I.push({
                            name: M.name,
                            $f: new Uint8Array(await Qg(M))
                        });
                    I = Kg(I).buffer
                }
                I && (await c.wg({
                    buffer: I
                }),
                Y("change_cdrom_image").value = "Eject CD image")
            }
            ;
            z.click()
        }
        Y("change_cdrom_image").blur()
    }
    ;
    Y("memory_dump").onclick = function() {
        const z = c.Aa.s.lb;
        xa(new Uint8Array(z.buffer,z.byteOffset,z.length), "v86memory.bin");
        Y("memory_dump").blur()
    }
    ;
    Y("capture_network_traffic").onclick = function() {
        function z(I, M) {
            var ma = L
              , Ia = ma.push
              , Xa = performance.now() / 1E3;
            const db = [];
            let na = 0;
            for (; na + 15 < M.length; na += 16) {
                var oa = ea(na.toString(16).toUpperCase(), 5) + "   ";
                for (var wa = 0; 16 > wa; wa++)
                    oa += ea(M[na + wa].toString(16).toUpperCase(), 2) + " ";
                oa += "  ";
                for (wa = 0; 16 > wa; wa++) {
                    var ra = M[na + wa];
                    oa += 33 <= ra && 34 !== ra && 92 !== ra && 126 >= ra ? String.fromCharCode(ra) : "."
                }
                db.push(oa)
            }
            for (oa = ea(na.toString(16).toUpperCase(), 5) + "   "; na < M.length; na++)
                oa += ea(M[na].toString(16).toUpperCase(), 2) + " ";
            wa = na & 15;
            oa += "   ".repeat(16 - wa);
            oa += "  ";
            for (ra = 0; ra < wa; ra++) {
                const La = M[na + ra];
                oa += 33 <= La && 34 !== La && 92 !== La && 126 >= La ? String.fromCharCode(La) : "."
            }
            db.push(oa);
            Ia.call(ma, {
                direction: I,
                time: Xa,
                Nj: "\n" + db.join("\n") + "\n"
            });
            Y("capture_network_traffic").value = L.length + " packets"
        }
        this.value = "0 packets";
        let L = [];
        c.ne.register("net0-receive", z.bind(this, "I"));
        ce(c, "net0-send", z.bind(this, "O"));
        this.onclick = function() {
            const I = L.map( ({direction: M, time: ma, Nj: Ia}) => M + " " + ma.toFixed(6) + Ia + "\n").join("");
            xa(I, "traffic.hex");
            L = [];
            this.value = "0 packets"
        }
    }
    ;
    Y("save_state").onclick = async function() {
        const z = await c.dh();
        xa(z, "v86state.bin");
        Y("save_state").blur()
    }
    ;
    Y("save_state_d").onclick = async function() {
        const z =
            await c.dh();
        let blob = Za_ret(z);
        let profile = new URLSearchParams(window.location.search).get("profile");
        saveGame(profile, blob);
        alert("Sauvegarde effectuée");
        Y("save_state_d").blur()
    };
    Y("load_state").onclick = function() {
        Y("load_state_input").click();
        Y("load_state").blur()
    }
    ;
    Y("load_state_input").onchange = async function() {
        var z = this.files[0];
        if (z) {
            var L = c.vd();
            L && await c.stop();
            var I = new FileReader;
            I.onload = async function(M) {
                try {
                    await c.ug(M.target.result)
                } catch (ma) {
                    throw alert("Something bad happened while restoring the state:\n" + ma + "\n\nNote that the current configuration must be the same as the original"),
                    ma;
                }
                L && c.Lf()
            }
            ;
            I.readAsArrayBuffer(z);
            this.value = ""
        }
    }
    ;
    Y("load_state_d").onclick = function() {
            let profile = new URLSearchParams(window.location.search).get("profile");
            let lsi = Y("load_state_input");
            loadGame(profile, async function(blob){
                let z = blob.data;
                var L = c.vd();
                L && await c.stop();
                var I = new FileReader;
                I.onload = async function(M) {
                    try {
                        await c.ug(M.target.result)
                    } catch (ma) {
                        throw alert("Something bad happened while restoring the state:\n" + ma + "\n\nNote that the current configuration must be the same as the original"), ma;
                    }
                    L && c.Lf()
                };
                I.readAsArrayBuffer(z);

            });
            Y("load_state_d").blur()
        };
    Y("ctrlaltdel").onclick = function() {
        de(c, [29, 56, 83, 157, 184, 211]);
        Y("ctrlaltdel").blur()
    }
    ;
    Y("alttab").onclick = function() {
        de(c, [56, 15]);
        setTimeout(function() {
            de(c, [184, 143])
        }, 100);
        Y("alttab").blur()
    }
    ;
    let escapeEvent = function() {
            de(c, [1]);
            Y("escape").blur()
        };
    Y("escape").onclick = escapeEvent;
    Y("escape2").onclick = escapeEvent;
    Y("scale").onchange = function() {
        var z = parseFloat(this.value);
        (z || 0 < z) && c.ec && c.ec.ih(z, z)
    }
    ;
    Y("fullscreen").onclick = function() {
        if (c.ec) {
            var z = document.getElementById("screen_container");
            if (z) {
                var L = z.requestFullScreen || z.webkitRequestFullscreen || z.mozRequestFullScreen || z.msRequestFullScreen;
                L && (L.call(z),
                (z = document.getElementsByClassName("screen_container")[0]) && z.focus());
                try {
                    navigator.keyboard.lock()
                } catch (I) {}
                fe()
            }
        }
    }
    ;
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
    Y("screen_container").onclick = function(e) {
        e.preventDefault();
        c.vd() && c.g && "suspended" === c.g.ca.state && c.g.ca.resume();
        if (h && p)
            fe();
        else if (window.getSelection().isCollapsed) {
            // const z = document.getElementsByClassName("phone_keyboard")[0];
            // z.style.top = document.body.scrollTop + 100 + "px";
            // z.style.left = document.body.scrollLeft + 100 + "px";
            // z.focus()
        }
    }
    ;
    const P = document.getElementsByClassName("phone_keyboard")[0];
    P.setAttribute("autocorrect", "off");
    P.setAttribute("autocapitalize", "off");
    P.setAttribute("spellcheck", "false");
    P.tabIndex = 0;
    Y("screen_container").addEventListener("mousedown", (e) => {
        e.preventDefault();
        // P.focus()
    }
    , !1);
    Y("show_keyboard").addEventListener("mousedown", (e) => {
            e.preventDefault();
            if (document.activeElement === P){
                P.blur();
                e.currentTarget.src = "data_files/keyboard_off.png";
            } else {
                P.focus();
                e.currentTarget.src = "data_files/keyboard_on.png";
            }
        }, !1);
    Y("take_screenshot").onclick = function() {
        const z = c.ec ? c.ec.Rj() : null;
        try {
            window.open("").document.write(z.outerHTML)
        } catch (L) {}
        Y("take_screenshot").blur()
    }
    ;
    if (c.g) {
        let z = !1;
        Y("mute").onclick = function() {
            z ? (c.g.ng.xg(1, void 0),
            z = !1,
            Y("mute").value = "Mute") : (c.g.ng.xg(0, void 0),
            z = !0,
            Y("mute").value = "Unmute");
            Y("mute").blur()
        }
    } else
        Y("mute").remove();
    window.addEventListener("keydown", f, !1);
    window.addEventListener("keyup", f, !1);
    window.addEventListener("blur", f, !1);
    b = document.createElement("script");
    b.src = "build/xterm.js";
    b.async = !0;
    b.onload = function() {
        var z = Y("terminal");
        c.fc && c.fc.wa && c.fc.wa();
        c.fc = new Oc(z,c.v);
        c.fc.show()
    }
    ;
    document.body.appendChild(b)
}
function Yg(a) {
    Y("filesystem_panel").style.display = "block";
    Y("filesystem_send_file").onchange = function() {
        Array.prototype.forEach.call(this.files, function(b) {
            var c = new Ga(b);
            c.onload = function() {
                c.bc(async function(d) {
                    await a.mj("/" + b.name, new Uint8Array(d))
                })
            }
            ;
            c.load()
        }, this);
        this.value = "";
        this.blur()
    }
    ;
    Y("filesystem_get_file").onkeypress = async function(b) {
        if (13 === b.which) {
            this.disabled = !0;
            try {
                var c = await a.Kf(this.value)
            } catch (d) {
                console.log(d)
            }
            this.disabled = !1;
            c ? (b = this.value.replace(/\/$/, "").split("/"),
            b = b[b.length - 1] || "root",
            xa(c, b),
            this.value = "") : alert("Can't read file")
        }
    }
}
function Vg() {
    location.reload()
}
function Wg(a) {
    window.history.pushState && (a = "?" + Array.from(a.entries()).map( ([b,c]) => b + "=" + c.replace(/[?&=#+]/g, encodeURIComponent)).join("&"),
    window.history.pushState({
        search: a
    }, "", a))
}
;