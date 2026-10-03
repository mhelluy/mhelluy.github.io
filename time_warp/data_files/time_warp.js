/*
 * Time Warp — front-end v86
 *
 * Ce fichier remplace l'ancien bundle obfusqué (v86_all.js). Il est écrit
 * proprement à partir de la documentation officielle de v86 et de la
 * dernière release (commit 2d6f9aaa). Il ne fait que piloter la bibliothèque
 * v86 (build/libv86.js) : il ne contient plus aucun code d'émulation.
 *
 * Ce qui est conservé par rapport à l'ancienne version :
 *   - l'interface (index.html, over.css, icônes),
 *   - les 17 jeux Windows 98 (disques + états sauvegardés sur palgania.ovh),
 *   - les sauvegardes de partie dans IndexedDB,
 *   - le comportement visible pour l'utilisateur (boutons, infos, plein écran,
 *     clavier mobile, console série, etc.).
 *
 * Ce qui a été retiré (inutile ou obsolète) :
 *   - la liste des systèmes d'exploitation officiels (non hébergés ici),
 *   - la case « mode asynchrone » (toujours asynchrone),
 *   - le BIOS Bochs, le branchement « custom » par URL, les préfetch dynamiques,
 *   - les options vides (ae/ib/wc) et le code mort.
 */
"use strict";

(function () {
    // ==========================================================
    // Fonctions utilitaires
    // ==========================================================

    // Raccourci : document.getElementById
    function $(id) {
        return document.getElementById(id);
    }

    // Remplit à gauche avec des zéros (ex. pad0(5, 2) -> "05")
    function pad0(value, length) {
        return (value || value === 0 ? value + "" : "").padStart(length, "0");
    }

    // Formate une durée en secondes : "42s", "3m 05s", "1h 02m 03s"
    function format_duration(s) {
        if (s < 60) return s + "s";
        if (s < 3600) return (s / 60 | 0) + "m " + pad0(s % 60, 2) + "s";
        return (s / 3600 | 0) + "h " + pad0(((s / 60) | 0) % 60, 2) + "m " + pad0(s % 60, 2) + "s";
    }

    // Déclenche le téléchargement d'un Blob/fichier (issue de la lib officielle)
    function download(file_or_blob, name) {
        const a = document.createElement("a");
        a["download"] = name;
        a.href = window.URL.createObjectURL(file_or_blob);
        a.dataset["downloadurl"] = ["application/octet-stream", a["download"], a.href].join(":");
        if (document.createEvent) {
            const ev = document.createEvent("MouseEvent");
            ev.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            a.dispatchEvent(ev);
        } else {
            a.click();
        }
        window.URL.revokeObjectURL(a.href);
    }

    // Télécharge un buffer (ou une liste de buffers) sous un nom de fichier
    function dump_file(ab, name) {
        if (!Array.isArray(ab)) {
            ab = [ab];
        }
        const blob = new Blob(ab);
        download(blob, name);
    }

    // Construit un Blob à partir d'un buffer (ou d'une liste de buffers)
    function make_blob(ab) {
        if (!Array.isArray(ab)) {
            ab = [ab];
        }
        return new Blob(ab);
    }

    // Représentation hexadécodée lisible (offset, octets, caractères imprimables)
    function hex_dump(buffer) {
        function hex(n, len) {
            return pad0(n.toString(16).toUpperCase(), len);
        }
        const result = [];
        let offset = 0;
        for (; offset + 15 < buffer.length; offset += 16) {
            let line = hex(offset, 5) + "   ";
            for (let j = 0; j < 0x10; j++) line += hex(buffer[offset + j], 2) + " ";
            line += "  ";
            for (let j = 0; j < 0x10; j++) {
                const x = buffer[offset + j];
                line += (x >= 33 && x !== 34 && x !== 92 && x <= 126) ? String.fromCharCode(x) : ".";
            }
            result.push(line);
        }
        const line_start = offset;
        let line = hex(line_start, 5) + "   ";
        for (; offset < buffer.length; offset++) line += hex(buffer[offset], 2) + " ";
        const remainder = buffer.length - line_start;
        line += "   ".repeat(0x10 - remainder);
        line += "  ";
        for (let j = 0; j < remainder; j++) {
            const x = buffer[line_start + j];
            line += (x >= 33 && x !== 34 && x !== 92 && x <= 126) ? String.fromCharCode(x) : ".";
        }
        result.push(line);
        return "\n" + result.join("\n") + "\n";
    }

    // ==========================================================
    // Détection mobile / tablette (conservée telle quelle)
    // ==========================================================

window.mobileAndTabletCheck = function() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
  };

    // ==========================================================
    // Sauvegarde des parties dans IndexedDB
    // ==========================================================

    const SAVE_DB_NAME = "v86_data";
    let save_db = null;
    (function () {
        const request = indexedDB.open(SAVE_DB_NAME, 1);
        request.onerror = function () {
            alert("Le stockage local n'est pas autorisé, vous devrez utiliser la sauvegarde manuelle pour enregistrer vos données.");
        };
        request.onupgradeneeded = function (event) {
            save_db = event.target.result;
            // Magasin des sauvegardes de partie, indexé par « game » (identifiant du jeu)
            save_db.createObjectStore("saves", { keyPath: "game" });
        };
        request.onsuccess = function (event) {
            save_db = event.target.result;
        };
    })();

    // Enregistre la sauvegarde « data » (Blob) pour le jeu « game »
    function saveGame(game, data) {
        if (!save_db) {
            alert("Le stockage local n'est pas autorisé, vous devrez utiliser la sauvegarde manuelle pour enregistrer vos données.");
            return;
        }
        const transaction = save_db.transaction(["saves"], "readwrite");
        transaction.onerror = function (event) {
            console.log("Erreur lors de la sauvegarde: ", event);
        };
        transaction.oncomplete = function () {
            console.log("Transaction accomplie");
        };
        const objectStore = transaction.objectStore("saves");
        const request = objectStore.put({ "game": game, "data": data });
        request.onsuccess = function () {
            console.log("Sauvegarde réussie");
        };
        request.onerror = function (event) {
            console.log("Erreur lors de la sauvegarde: ", event);
        };
    }

    // Charge la sauvegarde du jeu « game » et l'envoie à « callback » (null si absente)
    function loadGame(game, callback) {
        if (!save_db) {
            alert("Le stockage local n'est pas autorisé, vous ne pouvez pas charger de sauvegarde.");
            callback(null);
            return;
        }
        const transaction = save_db.transaction(["saves"], "readonly");
        const objectStore = transaction.objectStore("saves");
        const request = objectStore.get(game);
        request.onerror = function (event) {
            console.log("Erreur lors de la lecture: ", event);
        };
        request.onsuccess = function (event) {
            callback(event.target.result);
        };
    }

    // ==========================================================
    // Liste des jeux
    // ==========================================================

    // Emplacement des disques et états sauvegardés des jeux
    const GAME_SERVER = "https://palgania.ovh:8081/games/";

    // Fabrique la définition d'un jeu : un disque dur (chargé par morceaux)
    // et un état sauvegardé depuis lequel la machine démarre.
    function make_game(id, name, memory_size) {
        return {
            id: id,
            name: name,
            memory_size: memory_size,
            state: { url: GAME_SERVER + id + ".bin.zst" },
            hda: {
                url: GAME_SERVER + id + "/.img.zst",
                size: 2147483648,
                async: true,
                fixed_chunk_size: 262144,
                use_parts: true
            }
        };
    }

    const GAMES = [
        make_game("zombinis2", "Zoombinis 2 : Mission au sommet", 33554432),
        make_game("monsieur_heureux_et_le_monde_a_lenvers", "Monsieur Heureux et le monde à l'envers", 33554432),
        make_game("spy_fox_dry_cereals", "Spy Fox : Opération Milkshake", 33554432),
        make_game("sampyjam", "Sam Pyjam : Le héros de la nuit", 33554432),
        make_game("sampyjam2", "Sam Pyjam : Héros météo", 33554432),
        make_game("pouce_zoo", "Pouce-Pouce sauve le zoo", 1073741824),
        make_game("pouce_temps", "Pouce-Pouce voyage dans le temps", 33554432),
        make_game("pouce_course", "Pouce-Pouce entre dans la course", 33554432),
        make_game("pouce_cirque", "Pouce-Pouce découvre le cirque", 33554432),
        make_game("marine1_algues", "Marine Malice et le mystère des graines d'algues", 33554432),
        make_game("marine2_hantee", "Marine Malice et le mystère de l'école hantée", 33554432),
        make_game("marine3_coquillage", "Marine Malice et le mystère du coquillage volé", 33554432),
        make_game("marine4_ranch", "Marine Malice et le mystère du ranch aux cochons", 33554432),
        make_game("marine5_lagon", "Marine Malice et le mystère du monstre du lagon bleu", 33554432),
        make_game("transforme", "Ca se transforme", 33554432),
        make_game("qqchdedans", "Il y a quelque chose dedans", 33554432),
        make_game("cafaitpeur", "Ca fait peur", 33554432)
    ];

    // ==========================================================
    // État global
    // ==========================================================

    // Champs du formulaire « Setup » mémorisés dans localStorage
    const FORM_FIELDS = "memory_size video_memory_size networking_proxy disable_audio enable_acpi boot_order".split(" ");

    // Options passées au constructeur V86 (remplies par main() / apply_profile)
    const settings = {};

    // Compteur pour les points d'animation de la barre de téléchargement
    let progress_ticks = 0;

    // Paramètres de l'URL
    const query = new URLSearchParams(window.location.search);
    // Renvoie la valeur d'un paramètre, ou undefined s'il est absent
    function qparam(name) {
        const v = query.get(name);
        return v === null ? undefined : v;
    }

    // Sur copy.sh le relais réseau passe par le site ; ailleurs, relais local
    const is_copy_sh = location.hostname.endsWith("copy.sh");

    // Met à jour le titre de la page et la description
    function set_title(name) {
        document.title = name + " - Virtual x86";
        const meta = document.querySelector("meta[name=description]");
        if (meta) meta.content = "Running " + name;
    }

    // Ajoute ?profile=<id> à l'historique (sans recharger la page)
    function push_profile(id) {
        window.history.pushState && window.history.pushState({ profile: id }, "", "?profile=" + id);
    }

    // Si ?c=... est présent, tape ce texte dans la machine après démarrage
    function auto_type_callback(emulator) {
        const c = qparam("c");
        if (c) setTimeout(function () {
            emulator.keyboard_send_text(c + "\n");
        }, 25);
    }

    // ==========================================================
    // Démarrage de l'émulateur
    // ==========================================================

    function start_emulation(auto_type_callback) {
        // Taille de la mémoire (octets) : profil, formulaire, sinon 128 Mo
        let memory_size = settings.memory_size;
        if (!memory_size) {
            memory_size = 1048576 * parseInt($("memory_size").value, 10);
            if (!memory_size) {
                alert("Invalid memory size - reset to 128MB");
                memory_size = 134217728;
            }
        }

        // Taille de la mémoire vidéo (octets) : profil, formulaire, sinon 8 Mo
        let vga_memory_size = settings.vga_memory_size;
        if (!vga_memory_size) {
            vga_memory_size = 1048576 * parseInt($("video_memory_size").value, 10);
            if (!vga_memory_size) {
                alert("Invalid video memory size - reset to 8MB");
                vga_memory_size = 8388608;
            }
        }

        // Disquette, noyau et initrd fournis par le formulaire (si non déjà définis)
        if (!settings.fda) {
            const floppy = $("floppy_image").files[0];
            if (floppy) settings.fda = { buffer: floppy };
        }
        if (!settings.bzimage) {
            const bzimage = $("bzimage").files[0];
            if (bzimage) settings.bzimage = { buffer: bzimage };
        }
        if (!settings.initrd) {
            const initrd = $("initrd").files[0];
            if (initrd) settings.initrd = { buffer: initrd };
        }

        // Relais réseau : proxy du formulaire/URL sur copy.sh, sinon relais local
        const network_relay_url = settings.networking_proxy === undefined
            ? $("networking_proxy").value
            : settings.networking_proxy;

        // Audio et ACPI
        const disable_speaker = $("disable_audio").checked || !settings.audio;
        const acpi = (settings.initial_state || settings.acpi !== undefined)
            ? settings.acpi
            : $("enable_acpi").checked;

        // BIOS (inutile si on démarre depuis un état sauvegardé)
        let bios, vga_bios;
        if (!settings.initial_state) {
            bios = { url: "bios/seabios.bin" };
            vga_bios = { url: "bios/vgabios.bin" };
        }

        const emulator = new V86({
            memory_size: memory_size,
            vga_memory_size: vga_memory_size,
            screen_container: $("screen_container"),
            boot_order: settings.boot_order || parseInt($("boot_order").value, 16) || 0,
            network_relay_url: is_copy_sh ? network_relay_url : "ws://localhost:8080/",
            bios: bios,
            vga_bios: vga_bios,
            fda: settings.fda,
            hda: settings.hda,
            hdb: settings.hdb,
            cdrom: settings.cdrom,
            multiboot: settings.multiboot,
            bzimage: settings.bzimage,
            initrd: settings.initrd,
            cmdline: settings.cmdline,
            acpi: acpi,
            initial_state: settings.initial_state,
            filesystem: settings.filesystem || {},
            disable_speaker: disable_speaker,
            disable_jit: settings.disable_jit,
            autostart: true
        });

        // Quand l'émulateur est prêt
        emulator.add_listener("emulator-ready", function () {
            // Panneau du profilage, uniquement si le wasm l'expose
            if (emulator.v86?.cpu?.wm?.exports?.["profiler_is_enabled"]?.()) {
                const pre = document.createElement("pre");
                document.body.appendChild(pre);
                setInterval(function () {
                    if (emulator.is_running()) {
                        pre.textContent = emulator.get_instruction_stats();
                    }
                }, 1000);
            }
            init_ui(emulator);
            if (auto_type_callback) auto_type_callback(emulator);
        });

        // Progression du téléchargement des images
        emulator.add_listener("download-progress", function (progress) {
            const loading = $("loading");
            loading.style.display = "block";
            if (progress.file_name.endsWith(".wasm")) {
                const parts = progress.file_name.split("/");
                loading.textContent = "Fetching " + parts[parts.length - 1] + " ...";
            } else if (progress.file_index === progress.file_count - 1 && progress.loaded >= progress.total - 2048) {
                loading.textContent = "Done downloading. Starting now ...";
            } else {
                let text = "Downloading images ";
                if (typeof progress.file_index === "number" && progress.file_count) {
                    text += "[" + (progress.file_index + 1) + "/" + progress.file_count + "] ";
                }
                if (progress.total && typeof progress.loaded === "number") {
                    let percent = Math.floor(progress.loaded / progress.total * 100);
                    percent = Math.min(100, Math.max(0, percent));
                    const filled = Math.floor(percent / 2);
                    text += percent + "% [" + "#".repeat(filled) + " ".repeat(50 - filled) + "]";
                } else {
                    text += ".".repeat(progress_ticks++ % 50);
                }
                loading.textContent = text;
            }
        });

        // Échec du téléchargement d'une image
        emulator.add_listener("download-error", function (error) {
            const loading = $("loading");
            loading.style.display = "block";
            loading.textContent = "Loading " + error.file_name + " failed. Check your connection and reload the page to try again.";
        });
    }

    // ==========================================================
    // Boutons de récupération d'image disque
    // ==========================================================

    // Associe un bouton « Get ... image » au buffer d'un disque.
    // Le bouton est masqué si le disque n'existe pas ou fait plus de 100 Mo.
    function add_image_download_button(profile_disk, get_buffer, type) {
        const elem = $("get_" + type + "_image");
        if (!profile_disk || profile_disk.size > 104857600) {
            elem.style.display = "none";
            return;
        }
        elem.onclick = function () {
            const buffer = get_buffer();
            if (!buffer) {
                alert("The file could not be loaded. Maybe it's too big?");
                elem.blur();
                return;
            }
            const filename = (buffer.file && buffer.file.name) || (settings.id + (type === "cdrom" ? ".iso" : ".img"));
            if (buffer.get_as_file) {
                download(buffer.get_as_file(filename), filename);
            } else {
                buffer.get_buffer(function (b) {
                    if (b) dump_file(b, filename);
                    else alert("The file could not be loaded. Maybe it's too big?");
                });
            }
            elem.blur();
        };
    }

    // ==========================================================
    // Panneau système de fichiers 9p
    // ==========================================================

    function init_filesystem_panel(emulator) {
        $("filesystem_panel").style.display = "block";

        // Envoi de fichiers vers la machine
        $("filesystem_send_file").onchange = function () {
            Array.prototype.forEach.call(this.files, function (file) {
                const reader = new FileReader();
                reader.onload = async function () {
                    await emulator.create_file("/" + file.name, new Uint8Array(reader.result));
                };
                reader.readAsArrayBuffer(file);
            }, this);
            this.value = "";
            this.blur();
        };

        // Récupération d'un fichier de la machine (Entrée)
        $("filesystem_get_file").onkeypress = async function (e) {
            if (e.which === 13) {
                this.disabled = true;
                let result;
                try {
                    result = await emulator.read_file(this.value);
                } catch (err) {
                    console.log(err);
                }
                this.disabled = false;
                if (result) {
                    const parts = this.value.replace(/\/$/, "").split("/");
                    const filename = parts[parts.length - 1] || "root";
                    dump_file(result, filename);
                    this.value = "";
                } else {
                    alert("Can't read file");
                }
            }
        };
    }

    // ==========================================================
    // Initialisation de l'interface
    // ==========================================================

    function init_ui(emulator) {
        // ---- Mesure de la vitesse ----
        let last_tick = 0;
        let running_time = 0;
        let last_instr_counter = 0;
        let interval = null;
        let total_instructions = 0;

        function update_speed() {
            const now = Date.now();
            const instruction_counter = emulator.get_instruction_counter();
            if (instruction_counter < last_instr_counter) {
                // retour à zéro du compteur 32 bits
                last_instr_counter -= 0x100000000;
            }
            const last_ips = instruction_counter - last_instr_counter;
            last_instr_counter = instruction_counter;
            total_instructions += last_ips;
            const delta_time = now - last_tick;
            if (delta_time) {
                running_time += delta_time;
                last_tick = now;
                $("speed").textContent = (last_ips / 1000 / delta_time).toFixed(1);
                $("avg_speed").textContent = (total_instructions / 1000 / running_time).toFixed(1);
                $("running_time").textContent = format_duration(running_time / 1000 | 0);
            }
        }

        emulator.add_listener("emulator-started", function () {
            last_tick = Date.now();
            interval = setInterval(update_speed, 1000);
        });
        emulator.add_listener("emulator-stopped", function () {
            update_speed();
            if (interval !== null) clearInterval(interval);
        });

        // ---- Affichage ----
        $("boot_options").style.display = "none";
        $("loading").style.display = "none";
        $("exit").style.display = "block";
        $("showmore").style.display = "block";
        $("screen_container_container").style.display = "block";
        $("screen_container").style.display = "block";

        // Panneau 9p : immédiat si système de fichiers, sinon à l'attachement
        if (settings.filesystem) {
            init_filesystem_panel(emulator);
        } else {
            emulator.add_listener("9p-attach", function () {
                init_filesystem_panel(emulator);
            });
        }

        // Bouton « Fonctionnalités avancées »
        $("showmore").onclick = function () {
            if ($("runtime_options").style.display === "none") {
                $("runtime_options").style.display = "block";
                $("runtime_infos").style.display = "block";
                $("terminal").style.display = "block";
            } else {
                $("runtime_options").style.display = "none";
                $("runtime_infos").style.display = "none";
                $("terminal").style.display = "none";
            }
        };

        // ---- Système de fichiers 9p ----
        let fs_bytes_read = 0;
        let fs_bytes_written = 0;
        let fs_open_files = [];
        emulator.add_listener("9p-read-start", function (args) {
            const filename = args[0];
            fs_open_files.push(filename);
            $("info_filesystem").style.display = "block";
            $("info_filesystem_status").textContent = "Loading ...";
            $("info_filesystem_last_file").textContent = filename;
        });
        emulator.add_listener("9p-read-end", function (args) {
            fs_bytes_read += args[1];
            $("info_filesystem_bytes_read").textContent = fs_bytes_read;
            const filename = args[0];
            fs_open_files = fs_open_files.filter(f => f !== filename);
            if (fs_open_files[0]) $("info_filesystem_last_file").textContent = fs_open_files[0];
            else $("info_filesystem_status").textContent = "Idle";
        });
        emulator.add_listener("9p-write-end", function (args) {
            fs_bytes_written += args[1];
            $("info_filesystem_bytes_written").textContent = fs_bytes_written;
            if (!fs_open_files[0]) $("info_filesystem_last_file").textContent = args[0];
        });

        // ---- Stockage IDE ----
        let ide_bytes_read = 0;
        let ide_sectors_read = 0;
        let ide_bytes_written = 0;
        let ide_sectors_written = 0;
        $("ide_type").textContent = settings.cdrom ? " (CD-ROM)" : " (hard disk)";
        emulator.add_listener("ide-read-start", function () {
            $("info_storage").style.display = "block";
            $("info_storage_status").textContent = "Loading ...";
        });
        emulator.add_listener("ide-read-end", function (args) {
            ide_bytes_read += args[1];
            ide_sectors_read += args[2];
            $("info_storage_status").textContent = "Idle";
            $("info_storage_bytes_read").textContent = ide_bytes_read;
            $("info_storage_sectors_read").textContent = ide_sectors_read;
        });
        emulator.add_listener("ide-write-end", function (args) {
            ide_bytes_written += args[1];
            ide_sectors_written += args[2];
            $("info_storage_bytes_written").textContent = ide_bytes_written;
            $("info_storage_sectors_written").textContent = ide_sectors_written;
        });

        // ---- Réseau ----
        let net_bytes_received = 0;
        let net_bytes_transmitted = 0;
        emulator.add_listener("eth-receive-end", function (args) {
            net_bytes_received += args[0];
            $("info_network").style.display = "block";
            $("info_network_bytes_received").textContent = net_bytes_received;
        });
        emulator.add_listener("eth-transmit-end", function (args) {
            net_bytes_transmitted += args[0];
            $("info_network").style.display = "block";
            $("info_network_bytes_transmitted").textContent = net_bytes_transmitted;
        });

        // ---- Souris ----
        let mouse_enabled = true;   // état du bouton « Disable mouse »
        let mouse_active = false;   // événement mouse-enable (souris utilisée par le système)
        emulator.add_listener("mouse-enable", function (enabled) {
            mouse_active = enabled;
            $("info_mouse_enabled").textContent = enabled ? "Yes" : "No";
        });

        // ---- Mode VGA ----
        emulator.add_listener("screen-set-size", function (args) {
            const [width, height, bpp] = args;
            if (bpp) {
                $("info_vga_mode").textContent = "Graphical";
                $("info_res").textContent = width + "x" + height;
                $("info_bpp").textContent = bpp;
            } else {
                $("info_vga_mode").textContent = "Text";
                $("info_res").textContent = "-";
                $("info_bpp").textContent = "-";
            }
        });

        // ---- Boutons ----
        $("reset").onclick = function () {
            emulator.restart();
            $("reset").blur();
        };

        add_image_download_button(settings.hda, () => emulator.v86.cpu.devices.ide.primary.master.buffer, "hda");
        add_image_download_button(settings.hdb, () => emulator.v86.cpu.devices.ide.primary.slave.buffer, "hdb");
        add_image_download_button(settings.fda, () => emulator.v86.cpu.devices.fdc.drives[0].buffer, "fda");
        add_image_download_button(settings.fdb, () => emulator.v86.cpu.devices.fdc.drives[1].buffer, "fdb");
        add_image_download_button(settings.cdrom, () => emulator.v86.cpu.devices.cdrom.buffer, "cdrom");

        // Pause / reprise
        $("run").onclick = function () {
            if (emulator.is_running()) {
                $("run").src = "data_files/play.png";
                emulator.stop();
            } else {
                $("run").src = "data_files/pause.png";
                emulator.run();
            }
            $("run").blur();
        };

        // Quitter (arrête la machine et revient à la liste)
        $("exit").onclick = function () {
            emulator.stop();
            location.href = location.pathname;
        };

        // Verrouiller la souris (pointer lock)
        $("lock_mouse").onclick = function () {
            if (!mouse_enabled) $("toggle_mouse").onclick();
            emulator.lock_mouse();
            $("lock_mouse").blur();
        };

        // Activer / désactiver l'émulation de la souris
        $("toggle_mouse").onclick = function () {
            mouse_enabled = !mouse_enabled;
            emulator.mouse_set_enabled(mouse_enabled);
            $("toggle_mouse").value = (mouse_enabled ? "Dis" : "En") + "able mouse";
            $("toggle_mouse").blur();
        };

        // Insérer / éjecter une disquette
        $("change_fda_image").value = settings.fda ? "Eject floppy image" : "Insert floppy image";
        $("change_fda_image").onclick = function () {
            if (emulator.get_disk_fda()) {
                emulator.eject_fda();
                $("change_fda_image").value = "Insert floppy image";
            } else {
                const input = document.createElement("input");
                input.type = "file";
                input.onchange = async function () {
                    const file = input.files[0];
                    if (file) {
                        await emulator.set_fda({ buffer: file });
                        $("change_fda_image").value = "Eject floppy image";
                    }
                };
                input.click();
            }
            $("change_fda_image").blur();
        };

        // Dump de la mémoire
        $("memory_dump").onclick = function () {
            const mem8 = emulator.v86.cpu.mem8;
            dump_file(new Uint8Array(mem8.buffer, mem8.byteOffset, mem8.length), "v86memory.bin");
            $("memory_dump").blur();
        };

        // Capture du trafic réseau (un clic : démarrer, un second clic : télécharger)
        $("capture_network_traffic").onclick = function () {
            const packets = [];
            function do_capture(direction, data) {
                packets.push({
                    direction: direction,
                    time: performance.now() / 1000,
                    hex_dump: hex_dump(data)
                });
                $("capture_network_traffic").value = packets.length + " packets";
            }
            this.value = "0 packets";
            emulator.add_listener("net0-receive", do_capture.bind(this, "I"));
            emulator.add_listener("net0-send", do_capture.bind(this, "O"));
            this.onclick = function () {
                const content = packets.map(p => p.direction + " " + p.time.toFixed(6) + p.hex_dump + "\n").join("");
                dump_file(content, "traffic.hex");
                packets.length = 0;
                this.value = "0 packets";
            };
        };

        // Sauvegarde de l'état dans un fichier
        $("save_state").onclick = async function () {
            const state = await emulator.save_state();
            dump_file(state, "v86state.bin");
            $("save_state").blur();
        };

        // Sauvegarde de l'état dans IndexedDB (bouton « save » de l'interface)
        $("save_state_d").onclick = async function () {
            const state = await emulator.save_state();
            const blob = make_blob(state);
            const profile = new URLSearchParams(window.location.search).get("profile");
            saveGame(profile, blob);
            alert("Sauvegarde effectuée");
            $("save_state_d").blur();
        };

        // Chargement d'un état depuis un fichier
        $("load_state").onclick = function () {
            $("load_state_input").click();
            $("load_state").blur();
        };
        $("load_state_input").onchange = async function () {
            const file = this.files[0];
            if (file) {
                const was_running = emulator.is_running();
                if (was_running) await emulator.stop();
                const reader = new FileReader();
                reader.onload = async function (e) {
                    try {
                        await emulator.restore_state(e.target.result);
                    } catch (err) {
                        throw alert("Something bad happened while restoring the state:\n" + err + "\n\nNote that the current configuration must be the same as the original"), err;
                    }
                    if (was_running) emulator.run();
                };
                reader.readAsArrayBuffer(file);
                this.value = "";
            }
        };

        // Chargement d'un état depuis IndexedDB (bouton « load » de l'interface)
        $("load_state_d").onclick = function () {
            const profile = new URLSearchParams(window.location.search).get("profile");
            loadGame(profile, async function (record) {
                if (!record) {
                    alert("Aucune sauvegarde trouvée pour ce jeu.");
                    return;
                }
                const data = record.data;
                const was_running = emulator.is_running();
                if (was_running) await emulator.stop();
                const reader = new FileReader();
                reader.onload = async function (e) {
                    try {
                        await emulator.restore_state(e.target.result);
                    } catch (err) {
                        throw alert("Something bad happened while restoring the state:\n" + err + "\n\nNote that the current configuration must be the same as the original"), err;
                    }
                    if (was_running) emulator.run();
                };
                reader.readAsArrayBuffer(data);
            });
            $("load_state_d").blur();
        };

        // Raccourcis clavier
        $("ctrlaltdel").onclick = function () {
            emulator.keyboard_send_scancodes([29, 56, 83, 157, 184, 211]);
            $("ctrlaltdel").blur();
        };
        $("alttab").onclick = function () {
            emulator.keyboard_send_scancodes([56, 15]);
            setTimeout(function () {
                emulator.keyboard_send_scancodes([184, 143]);
            }, 100);
            $("alttab").blur();
        };
        function send_escape() {
            emulator.keyboard_send_scancodes([1]);
            $("escape").blur();
        }
        $("escape").onclick = send_escape;
        $("escape2").onclick = send_escape;

        // Mise à l'échelle de l'écran
        $("scale").onchange = function () {
            const scale = parseFloat(this.value);
            if (scale) emulator.screen_set_scale(scale, scale);
        };

        // Plein écran
        $("fullscreen").onclick = function () {
            emulator.screen_go_fullscreen();
        };

        // Sur mobile : déplace les boutons vers le conteneur d'écran en plein écran
        function fullscreen_change_call() {
            if (mobileAndTabletCheck()) {
                const shinfs = document.querySelectorAll(".shinfs");
                const screen_container = $("screen_container");
                const opt_container = $("opt_container");
                if (document.fullscreenElement) {
                    for (let i = 0; i < shinfs.length; i++) {
                        screen_container.appendChild(shinfs[i].parentNode.removeChild(shinfs[i]));
                    }
                } else {
                    for (let i = 0; i < shinfs.length; i++) {
                        opt_container.appendChild(shinfs[i].parentNode.removeChild(shinfs[i]));
                    }
                }
            }
        }
        $("screen_container").addEventListener("webkitfullscreenchange", fullscreen_change_call);
        $("screen_container").addEventListener("fullscreenchange", fullscreen_change_call);
        $("screen_container").addEventListener("mozfullscreenchange", fullscreen_change_call);
        $("screen_container").addEventListener("MSFullscreenChange", fullscreen_change_call);

        // Bouton plein écran de l'interface (entre/sort)
        $("fullscreen2").onclick = function () {
            if (document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement) {
                document.exitFullscreen();
            } else {
                $("fullscreen").onclick();
            }
        };

        // Clic sur l'écran : verrouille la souris si elle est active
        $("screen_container").onclick = function (e) {
            e.preventDefault();
            if (mouse_enabled && mouse_active) emulator.lock_mouse();
        };

        // Clavier virtuel (mobile)
        const phone_keyboard = document.getElementsByClassName("phone_keyboard")[0];
        phone_keyboard.setAttribute("autocorrect", "off");
        phone_keyboard.setAttribute("autocapitalize", "off");
        phone_keyboard.setAttribute("spellcheck", "false");
        phone_keyboard.tabIndex = 0;

        $("screen_container").addEventListener("mousedown", function (e) {
            e.preventDefault();
        }, false);

        $("show_keyboard").addEventListener("mousedown", function (e) {
            e.preventDefault();
            if (document.activeElement === phone_keyboard) {
                phone_keyboard.blur();
                e.currentTarget.src = "data_files/keyboard_off.png";
            } else {
                phone_keyboard.focus();
                e.currentTarget.src = "data_files/keyboard_on.png";
            }
        }, false);

        // Capture d'écran (ouvre l'image dans un nouvel onglet)
        $("take_screenshot").onclick = function () {
            try {
                const img = emulator.screen_make_screenshot();
                window.open("").document.write(img.outerHTML);
            } catch (e) {}
            $("take_screenshot").blur();
        };

        // Coupure du son
        if (emulator.speaker_adapter) {
            let muted = false;
            $("mute").onclick = function () {
                if (muted) {
                    emulator.speaker_adapter.mixer.set_volume(1);
                    muted = false;
                    $("mute").value = "Mute";
                } else {
                    emulator.speaker_adapter.mixer.set_volume(0);
                    muted = true;
                    $("mute").value = "Unmute";
                }
                $("mute").blur();
            };
        } else {
            $("mute").remove();
        }

        // Garde contre CTRL-W (ne pas le renvoyer à l'émulateur)
        function ctrl_w_guard(e) {
            if (e.ctrlKey) {
                window.onbeforeunload = function () {
                    window.onbeforeunload = null;
                    return "CTRL-W cannot be sent to the emulator.";
                };
            } else {
                window.onbeforeunload = null;
            }
        }
        window.addEventListener("keydown", ctrl_w_guard, false);
        window.addEventListener("keyup", ctrl_w_guard, false);
        window.addEventListener("blur", ctrl_w_guard, false);

        // Console série (xterm.js)
        const xterm_script = document.createElement("script");
        xterm_script.src = "build/xterm.js";
        xterm_script.async = true;
        xterm_script.onload = function () {
            emulator.set_serial_container_xtermjs($("terminal"));
            emulator.serial_adapter.term.write("This is the serial console. Whatever you type or paste here will be sent to COM1");
        };
        document.body.appendChild(xterm_script);
    }

    // ==========================================================
    // Application d'un profil (jeu ou profil communautaire)
    // ==========================================================

    function apply_profile(profile) {
        $("boot_options").style.display = "none";
        set_title(profile.name);

        settings.filesystem = profile.filesystem;

        // Démarrage depuis un état sauvegardé : on masque le bouton « Reset »
        if (profile.state) {
            $("reset").style.display = "none";
            settings.initial_state = profile.state;
        }

        // Disques et fichiers de boot (copiés tels quels, même s'ils sont absents)
        settings.fda = profile.fda;
        settings.fdb = profile.fdb;
        settings.cdrom = profile.cdrom;
        settings.hda = profile.hda;
        settings.hdb = profile.hdb;
        settings.multiboot = profile.multiboot;
        settings.bzimage = profile.bzimage;
        settings.initrd = profile.initrd;
        settings.cmdline = profile.cmdline;

        // ACPI, mémoire et vidéo : le profil l'emporte, sauf depuis un état
        settings.acpi = (profile.state || settings.acpi === undefined) ? profile.acpi : settings.acpi;
        settings.memory_size = (!profile.state && settings.memory_size) ? settings.memory_size : profile.memory_size;
        settings.vga_memory_size = (!profile.state && settings.vga_memory_size) ? settings.vga_memory_size : profile.vga_memory_size;

        settings.id = profile.id;
        if (profile.boot_order !== undefined) settings.boot_order = profile.boot_order;

        // Paramètre ?chunk_size= (puissance de 2 entre 512 et 4 Mo)
        let chunk_size = parseInt(qparam("chunk_size"), 10);
        if (chunk_size >= 0) {
            if (chunk_size) {
                chunk_size = Math.min(4194304, Math.max(512, chunk_size));
                chunk_size = 1 << Math.ceil(Math.log2(chunk_size));
            } else {
                chunk_size = undefined;
            }
            if (settings.hda) settings.hda.fixed_chunk_size = chunk_size;
            if (settings.cdrom) settings.cdrom.fixed_chunk_size = chunk_size;
        }

        // Description (lien vers la page du jeu, si présente)
        if (profile.da) {
            $("description").style.display = "block";
            const a = document.createElement("a");
            a.href = profile.da;
            a.textContent = profile.name;
            a.target = "_blank";
            $("description").appendChild(document.createTextNode("Running "));
            $("description").appendChild(a);
        }

        start_emulation(auto_type_callback);
    }

    // ==========================================================
    // Point d'entrée
    // ==========================================================

    function main() {
        if (!window.WebAssembly) {
            alert("Your browser is not supported because it doesn't support WebAssembly");
            return;
        }

        // Bouton « Start Emulation » (configuration personnalisée)
        $("start_emulation").onclick = function () {
            // Mémorise les valeurs du formulaire
            for (const field of FORM_FIELDS) {
                const elem = $(field);
                if (elem) {
                    if (elem.tagName === "SELECT" || elem.type !== "checkbox") {
                        window.localStorage.setItem(field, elem.value);
                    } else {
                        window.localStorage.setItem(field, elem.checked);
                    }
                }
            }
            $("boot_options").style.display = "none";
            push_profile("custom");

            // Images de disque fournies par le formulaire
            let last_file = null;
            const floppy = $("floppy_image").files[0];
            if (floppy) { last_file = floppy; settings.fda = { buffer: floppy }; }
            const cd = $("cd_image").files[0];
            if (cd) { last_file = cd; settings.cdrom = { buffer: cd }; }
            const hda = $("hda_image").files[0];
            if (hda) { last_file = hda; settings.hda = { buffer: hda }; }
            if (last_file) set_title(last_file.name);

            start_emulation();
        };

        // Paramètres de l'URL
        if (qparam("disable_jit")) settings.disable_jit = true;
        const m_mb = parseInt(qparam("m"), 10);
        if (0 < m_mb) settings.memory_size = 1048576 * Math.max(16, m_mb);
        const vram_mb = parseInt(qparam("vram"), 10);
        if (0 < vram_mb) settings.vga_memory_size = 1048576 * vram_mb;
        settings.networking_proxy = qparam("networking_proxy");
        settings.audio = "0" !== qparam("audio");
        settings.acpi = qparam("acpi");

        const profile = qparam("profile");
        if (profile && !navigator.userActivation.hasBeenActive) {
            // L'utilisateur n'a pas encore interagi : on retire le profil et on recharge
            location.search = "";
            return;
        }

        // Jeux : démarre le jeu correspondant à ?profile= et lie les lignes du tableau
        for (const game of GAMES) {
            if (profile === game.id) {
                apply_profile(game);
                return;
            }
            const row = $("start_" + game.id);
            if (row) {
                row.onclick = function (e) {
                    e.preventDefault();
                    push_profile(game.id);
                    row.blur();
                    apply_profile(game);
                };
            }
        }

        // Profil communautaire (CDN) : ?profile=auteur/nom
        if (profile && /^[a-zA-Z0-9\-_]+\/[a-zA-Z0-9\-_]+$/.test(profile)) {
            const base_url = "https://v86-user-images.b-cdn.net/" + profile;
            fetch(base_url + "/profile.json")
                .catch(() => alert("Profile not found: " + profile))
                .then(r => r.json())
                .then(p => {
                    function disk(d) {
                        return d && { url: base_url + "/" + d.url, async: d.async, size: d.size };
                    }
                    apply_profile({
                        id: p.id,
                        name: p.name,
                        memory_size: p.memory_size,
                        vga_memory_size: p.vga_memory_size,
                        acpi: p.acpi,
                        boot_order: p.boot_order,
                        hda: disk(p.hda),
                        cdrom: disk(p.cdrom),
                        fda: disk(p.fda),
                        multiboot: disk(p.multiboot),
                        bzimage: disk(p.bzimage),
                        initrd: disk(p.initrd)
                    });
                });
            return;
        }

        // Restaure les valeurs du formulaire depuis localStorage
        for (const field of FORM_FIELDS) {
            const saved = window.localStorage.getItem(field);
            if (saved) {
                const elem = $(field);
                if (elem) {
                    if (elem.type === "checkbox") {
                        elem.checked = "true" === saved;
                    } else {
                        elem.value = saved;
                    }
                }
            }
        }
    }

    // ==========================================================
    // Amorçage
    // ==========================================================

    window.addEventListener("load", main, false);
    window.addEventListener("load", function () {
        setTimeout(function () {
            window.addEventListener("popstate", function () {
                location.reload();
            });
        }, 0);
    });
    if ("complete" === document.readyState) main();
})();
