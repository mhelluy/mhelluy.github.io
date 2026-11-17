import React, { useEffect, useMemo, useRef, useState } from "react";

// ---------------------------------------------------------------
// Répéteur d'exposé : apprentissage d'une trame par rappel actif
// avec indices évanescents (texte complet -> mots-clés -> titre seul)
// puis fil rouge enchaîné. Le script est une trame : on ne récite
// pas, on restitue avec ses propres mots.
// ---------------------------------------------------------------

const STOPWORDS = new Set([
  "alors","aucun","aussi","autre","autres","avaient","avais","avait","avant","avec","avoir","bien","car","ce","cela","celle","celui","ces","cet","cette","ceux","chaque","comme","comment","dans","depuis","des","donc","dont","déjà","elle","elles","encore","est","et","était","étaient","être","fait","font","hors","ici","ils","je","juste","la","le","les","leur","leurs","lors","mais","même","mêmes","moins","mon","nos","notre","nous","ok","où","par","parce","pas","peut","peu","plus","pour","pourquoi","puis","quand","que","quel","quelle","quelles","quels","qui","quoi","sans","ses","seulement","si","son","sont","sous","sur","tes","ton","tous","tout","toute","toutes","très","trop","un","une","vos","votre","vous","ça","était","comme","ainsi","alors","toujours","ensuite","d'abord","c'est","qu'il","qu'on","n'est","j'ai","s'il"
]);

function keywordsOf(text, max = 8) {
  const tokens = text.replace(/[«»"')(,.;:!?]/g, " ").split(/\s+/);
  const out = [];
  const seen = new Set();
  for (const rawToken of tokens) {
    const w = rawToken.trim();
    if (!w) continue;
    const lower = w.toLowerCase();
    const isNum = /\d/.test(w);
    const isLong = lower.length >= 4 && !STOPWORDS.has(lower);
    const isProper = /^[A-ZÀ-Þ]/.test(w) && lower.length >= 3 && !STOPWORDS.has(lower);
    if (isLong || isNum || isProper) {
      if (!seen.has(lower)) {
        seen.add(lower);
        out.push(w);
      }
    }
    if (out.length >= max) break;
  }
  return out;
}

function parseScript(input) {
  const blocks = input
    .split(/\n\s*\n+/)
    .map((b) => b.trim())
    .filter(Boolean);
  return blocks.map((block, index) => {
    const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
    let title = null;
    let bodyLines = lines;
    if (lines[0].startsWith("##")) {
      title = lines[0].replace(/^#+\s*/, "");
      bodyLines = lines.slice(1);
    } else if (lines.length > 1 && lines[0].length <= 70 && /:$/.test(lines[0])) {
      title = lines[0].replace(/:$/, "");
      bodyLines = lines.slice(1);
    }
    const text = bodyLines.join("\n").trim();
    const plain = text.replace(/\*([^*]+)\*/g, "$1");
    const chosen = [];
    const marker = /\*([^*]+)\*/g;
    let match;
    while ((match = marker.exec(text)) !== null) chosen.push(match[1].trim());
    if (!title) {
      const firstSentence = plain.split(/[.!?]\s/)[0];
      title =
        firstSentence.length <= 60
          ? firstSentence
          : firstSentence.slice(0, 57) + "…";
    }
    return {
      id: index,
      title,
      text,
      plain,
      keywords: keywordsOf(plain),
      chosen,
      hasChosen: chosen.length > 0,
    };
  });
}

function fmt(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

const EXAMPLE = `## Introduction : la ville pour qui ?
Regardez cette photo : une rue de nos années 2020. Large voie rapide, trottoirs minuscules, une vieille dame qui attend au feu pour traverser cinq voies. La ville du vingtième siècle a été *dessinée pour la voiture*. Je vais vous montrer pourquoi ce modèle est *remis en question*, et ce que gagnent concrètement les villes qui rendent leurs rues aux piétons.

## Le constat : la voiture a pris la place
En 1950, une ville européenne typique donnait plus de *la moitié de son espace public* à la circulation et au stationnement. Aujourd'hui encore, à Paris, les voitures occupent environ la moitié de l'espace public alors qu'elles ne représentent qu'une petite minorité des déplacements. Le paradoxe : plus on élargit les voies, plus le trafic augmente, c'est la *circulation induite*.

## Ce que dit la science : les cobénéfices
Rendre la rue aux piétons n'est pas qu'une question de confort. Les études sur les *zones à trafic limité* montrent trois gains massifs : la *pollution locale* chute, les accidents graves sont *divisés par trois*, et le *commerce de proximité* augmente, car les piétons dépensent plus souvent que les automobilistes qui traversent sans s'arrêter.

## Les objections et leurs réponses
On entend souvent que ce sont des mesures contre les habitants. En réalité, à Gand comme à Paris, les oppositions sont les plus fortes *avant la mise en place*, puis s'estompent après. Autre objection : les *livraisons*. Elles sont résolues par des *créneaux horaires* et des points de livraison. La question clé est donc *politique, pas technique*.

## Conclusion : la rue comme bien commun
L'espace public est le seul bien que tous les habitants partagent *à égalité*, quels que soient leurs revenus. Rendre les rues aux piétons, ce n'est pas enlever la ville aux automobilistes, c'est la *redonner à tout le monde*. La prochaine fois que vous verrez un aménagement de ce type, demandez-vous : *pour qui cette rue est-elle dessinée ?*`;

const MASTERED_STAGE = 4;
const STAGE_LABELS = ["Lecture", "Mots-clés", "Mots-clés choisis", "Titre seul", "Au point"];
const STAGE_COLORS = [
  "bg-slate-300",
  "bg-sky-400",
  "bg-violet-400",
  "bg-amber-400",
  "bg-emerald-500",
];

// Affiche le texte en gras pour les segments marqués *comme ceci*
function renderText(text) {
  return text.split(/(\*[^*]+\*)/g).map((part, i) => {
    if (/^\*[^*]+\*$/.test(part)) {
      return (
        <strong key={i} className="font-semibold text-indigo-700">
          {part.slice(1, -1)}
        </strong>
      );
    }
    return part;
  });
}

export default function App() {
  const [screen, setScreen] = useState("setup");
  const [raw, setRaw] = useState("");
  const [sections, setSections] = useState([]);
  const [phase, setPhase] = useState("drill");
  const [revealed, setRevealed] = useState(false);
  const [filIdx, setFilIdx] = useState(0);
  const [notice, setNotice] = useState("");
  const [recalls, setRecalls] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(0);
  const tickRef = useRef(0);

  const preview = useMemo(() => {
    const trimmed = raw.trim();
    return trimmed ? parseScript(trimmed) : [];
  }, [raw]);

  const current = useMemo(() => {
    if (phase !== "drill" || screen !== "session") return null;
    const todo = sections.filter((s) => s.stage < MASTERED_STAGE);
    if (!todo.length) return null;
    const minStage = Math.min(...todo.map((s) => s.stage));
    const candidates = todo
      .filter((s) => s.stage === minStage)
      .sort((a, b) => a.seen - b.seen);
    return candidates[0];
  }, [sections, phase, screen]);

  const filCurrent = phase === "fil" && filIdx < sections.length ? sections[filIdx] : null;

  // Passage automatique au fil rouge quand toutes les diapos sont au point
  useEffect(() => {
    if (screen === "session" && phase === "drill" && !current) {
      setPhase("fil");
      setFilIdx(0);
      setRevealed(false);
      setNotice("Toutes les diapos sont au point. Dernière ligne droite : le fil rouge, enchaîné de bout en bout.");
    }
  }, [screen, phase, current]);

  // Fin de passage du fil rouge
  useEffect(() => {
    if (screen === "session" && phase === "fil" && filIdx >= sections.length && sections.length > 0) {
      if (sections.some((s) => s.stage < MASTERED_STAGE)) {
        setPhase("drill");
        setNotice("Certaines diapos ont été fragiles au fil rouge : petit retour dessus, puis on refera une passe complète.");
      } else {
        setScreen("done");
      }
    }
  }, [screen, phase, filIdx, sections]);

  useEffect(() => {
    setRevealed(false);
  }, [current ? current.id : null, filIdx, phase]);

  useEffect(() => {
    if (screen !== "session") return;
    if (!startRef.current) startRef.current = Date.now();
    const iv = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startRef.current) / 1000));
    }, 500);
    return () => clearInterval(iv);
  }, [screen]);

  function start() {
    if (!preview.length) return;
    setSections(preview.map((s) => ({ ...s, stage: 0, seen: 0 })));
    setPhase("drill");
    setFilIdx(0);
    setRevealed(false);
    setNotice("");
    setRecalls(0);
    setElapsed(0);
    startRef.current = Date.now();
    setScreen("session");
  }

  function markRead() {
    tickRef.current += 1;
    setSections((prev) =>
      prev.map((s) => (s.id === current.id ? { ...s, stage: 1, seen: tickRef.current } : s))
    );
  }

  function drillRate(kind) {
    tickRef.current += 1;
    setRecalls((r) => r + 1);
    setSections((prev) =>
      prev.map((s) => {
        if (s.id !== current.id) return s;
        let stage = s.stage;
        if (kind === "reussi") {
          // si la diapo n'a pas de mots-clés marqués, on saute le niveau 2
          stage = s.stage === 1 && !s.hasChosen ? 3 : Math.min(MASTERED_STAGE, s.stage + 1);
        } else if (kind === "rate") {
          stage = s.stage === 3 && s.hasChosen ? 2 : 1;
        }
        return { ...s, stage, seen: tickRef.current };
      })
    );
  }

  function filRate(kind) {
    tickRef.current += 1;
    setRecalls((r) => r + 1);
    if (kind !== "reussi") {
      setSections((prev) =>
        prev.map((s) => (s.id === filCurrent.id ? { ...s, stage: s.hasChosen ? 2 : 1, seen: tickRef.current } : s))
      );
    }
    setFilIdx((i) => i + 1);
  }

  // Raccourcis clavier : Espace = révéler, 1/2/3 = raté / moyen / réussi
  useEffect(() => {
    if (screen !== "session") return;
    function onKey(e) {
      const target = e.target;
      if (target && /INPUT|TEXTAREA/.test(target.tagName)) return;
      const sec = phase === "drill" ? current : filCurrent;
      if (!sec) return;
      if (e.code === "Space" || e.key === "Enter") {
        e.preventDefault();
        if (phase === "drill" && sec.stage === 0) markRead();
        else setRevealed(true);
        return;
      }
      if (!revealed) return;
      if (e.key === "1") { phase === "drill" && sec.stage > 0 ? drillRate("rate") : filRate("rate"); }
      if (e.key === "2") { phase === "drill" && sec.stage > 0 ? drillRate("moyen") : filRate("moyen"); }
      if (e.key === "3") { phase === "drill" && sec.stage > 0 ? drillRate("reussi") : filRate("reussi"); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const mastered = sections.filter((s) => s.stage >= MASTERED_STAGE).length;
  const progressPct = sections.length ? Math.round((mastered / sections.length) * 100) : 0;

  // ----------------------------- Écran 1 : préparation -----------------------------
  if (screen === "setup") {
    return (
      <div className="max-w-3xl mx-auto p-6 text-slate-800">
        <h1 className="text-3xl font-bold text-slate-900">Répéteur d'exposé</h1>
        <p className="mt-2 text-slate-500">
          Colle ton script, l'outil te fait le répéter par rappel actif avec des indices de plus en
          plus pauvres : lecture complète, puis mots-clés, puis seulement les mots-clés que tu as
          marqués <code className="rounded bg-slate-100 px-1">*comme ceci*</code>, puis titre seul,
          puis fil rouge enchaîné. Tu restitues la trame avec tes mots, pas mot à mot.
        </p>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-5 gap-3">
          {["1. Lecture", "2. Mots-clés", "3. Mots-clés choisis", "4. Titre seul", "5. Fil rouge"].map((s, i) => (
            <div key={i} className="rounded-xl border border-slate-200 bg-white p-3 text-sm shadow-sm">
              <div className={`mb-1 inline-block h-2 w-8 rounded-full ${STAGE_COLORS[i]}`} />
              <div className="font-medium">{s}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <textarea
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            rows={12}
            placeholder={"Colle ici ton script.\n\nUne diapo = un paragraphe (séparés par une ligne vide).\n## Titre de la diapo  en début de paragraphe (recommandé).\n*Marque* entre étoiles les *mots clés* à retenir absolument."}
            className="w-full rounded-lg border border-slate-200 p-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button
              onClick={start}
              disabled={!preview.length}
              className="rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white shadow disabled:opacity-40 hover:bg-indigo-700"
            >
              Commencer l'entraînement
            </button>
            <button
              onClick={() => setRaw(EXAMPLE)}
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Charger l'exemple
            </button>
            {preview.length > 0 && (
              <span className="text-sm text-slate-500">
                {preview.length} diapo{preview.length > 1 ? "s" : ""} détectée{preview.length > 1 ? "s" : ""}
              </span>
            )}
          </div>
          {preview.length > 0 && (
            <ul className="mt-4 space-y-1">
              {preview.map((s) => (
                <li key={s.id} className="text-sm text-slate-600">
                  <span className="mr-2 inline-block rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-500">
                    {s.id + 1}
                  </span>
                  {s.title}{" "}
                  <span className="text-slate-400">
                    ({s.plain.split(/\s+/).length} mots
                    {s.chosen.length ? ` · ★ ${s.chosen.length} marqué${s.chosen.length > 1 ? "s" : ""}` : ""})
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="mt-4 text-sm text-slate-400">
          Astuce : pendant l'entraînement, restitue à voix haute, comme si tu présentais. Le cerveau
          retient ce qu'il produit, pas ce qu'il relit.
        </p>
      </div>
    );
  }

  // ----------------------------- Écran 3 : terminé -----------------------------
  if (screen === "done") {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center text-slate-800">
        <div className="text-5xl">🎉</div>
        <h1 className="mt-3 text-2xl font-bold">Ta trame est en place !</h1>
        <p className="mt-2 text-slate-500">
          {recalls} rappels en {fmt(elapsed)}. Refais une passe demain pour consolider : le sommeil
          fait le gros du travail de mémorisation.
        </p>
        <ul className="mt-5 space-y-1 text-left inline-block">
          {sections.map((s) => (
            <li key={s.id} className="text-sm">
              <span className="mr-2 text-emerald-500">✓</span>
              {s.title}
            </li>
          ))}
        </ul>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={() => {
              setPhase("fil");
              setFilIdx(0);
              setRevealed(false);
              setNotice("");
              startRef.current = Date.now();
              setElapsed(0);
              setScreen("session");
            }}
            className="rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white hover:bg-indigo-700"
          >
            Rejouer le fil rouge
          </button>
          <button
            onClick={() => {
              setScreen("setup");
              setSections([]);
            }}
            className="rounded-lg border border-slate-300 px-5 py-2.5 font-medium text-slate-600 hover:bg-slate-50"
          >
            Nouvel exposé
          </button>
        </div>
      </div>
    );
  }

  // ----------------------------- Écran 2 : entraînement -----------------------------
  const activeSection = phase === "drill" ? current : filCurrent;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-wrap gap-1.5">
          {sections.map((s) => (
            <div
              key={s.id}
              title={s.title}
              className={`h-3.5 w-3.5 rounded-full ${STAGE_COLORS[s.stage]} ${
                activeSection && s.id === activeSection.id ? "ring-2 ring-indigo-500 ring-offset-2" : ""
              }`}
            />
          ))}
        </div>
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <span>{progressPct}% au point</span>
          <span className="font-mono">{fmt(elapsed)}</span>
          <button
            onClick={() => {
              setScreen("setup");
              setSections([]);
            }}
            className="rounded-lg border border-slate-300 px-2.5 py-1 text-xs text-slate-500 hover:bg-slate-50"
          >
            Quitter
          </button>
        </div>
      </div>

      {notice && (
        <div className="mt-4 rounded-xl border border-indigo-200 bg-indigo-50 p-3 text-sm text-indigo-800">
          {notice}
        </div>
      )}

      {activeSection && (
        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {phase === "fil" && (
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-indigo-600">
              Fil rouge · diapo {filIdx + 1}/{sections.length}
            </div>
          )}
          {phase === "drill" && (
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Diapo {activeSection.id + 1} · {STAGE_LABELS[activeSection.stage]}
            </div>
          )}

          <h2 className="text-xl font-bold text-slate-900">{activeSection.title}</h2>

          {phase === "drill" && activeSection.stage === 0 && (
            <div className="mt-4">
              <p className="whitespace-pre-line text-slate-700">{renderText(activeSection.text)}</p>
              <button
                onClick={markRead}
                className="mt-5 rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white hover:bg-indigo-700"
              >
                C'est lu, cache-le moi → (Espace)
              </button>
            </div>
          )}

          {phase === "drill" && activeSection.stage === 1 && !revealed && (
            <div className="mt-4">
              <p className="text-sm italic text-slate-400">
                Raconte cette diapo à voix haute, avec tes mots. Pas besoin de réciter.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {activeSection.keywords.map((k, i) => (
                  <span
                    key={i}
                    className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-sm font-medium text-sky-700"
                  >
                    {k}
                  </span>
                ))}
              </div>
              <button
                onClick={() => setRevealed(true)}
                className="mt-5 rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white hover:bg-indigo-700"
              >
                J'ai dit mon truc, montre le texte (Espace)
              </button>
            </div>
          )}

          {phase === "drill" && activeSection.stage === 2 && !revealed && (
            <div className="mt-4">
              <p className="text-sm italic text-slate-400">
                Seuls les mots-clés que tu as marqués restent. Raconte la diapo autour d'eux.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {activeSection.chosen.map((k, i) => (
                  <span
                    key={i}
                    className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-sm font-medium text-violet-700"
                  >
                    {k}
                  </span>
                ))}
              </div>
              <button
                onClick={() => setRevealed(true)}
                className="mt-5 rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white hover:bg-indigo-700"
              >
                J'ai dit mon truc, montre le texte (Espace)
              </button>
            </div>
          )}

          {phase === "drill" && activeSection.stage === 3 && !revealed && (
            <div className="mt-4">
              <p className="text-sm italic text-slate-400">
                Rien que le titre. Raconte toute la diapo à voix haute.
              </p>
              <button
                onClick={() => setRevealed(true)}
                className="mt-5 rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white hover:bg-indigo-700"
              >
                Vérifier (Espace)
              </button>
            </div>
          )}

          {phase === "fil" && !revealed && (
            <div className="mt-4">
              <p className="text-sm italic text-slate-400">
                Fil rouge : déroule tout ton exposé en enchaînant, diapo après diapo. Celui-ci d'abord.
              </p>
              <button
                onClick={() => setRevealed(true)}
                className="mt-5 rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white hover:bg-indigo-700"
              >
                Vérifier (Espace)
              </button>
            </div>
          )}

          {revealed && (
            <div className="mt-4">
              <p className="whitespace-pre-line rounded-xl bg-slate-50 p-4 text-slate-700">
                {renderText(activeSection.text)}
              </p>
              <p className="mt-3 text-xs text-slate-400">
                Sois honnête avec toi-même : c'est le moteur de l'outil.
              </p>
              <div className="mt-3 grid grid-cols-3 gap-3">
                <button
                  onClick={() => (phase === "drill" ? drillRate("rate") : filRate("rate"))}
                  className="rounded-lg border border-rose-300 bg-rose-50 py-2.5 font-medium text-rose-700 hover:bg-rose-100"
                >
                  Raté (1)
                </button>
                <button
                  onClick={() => (phase === "drill" ? drillRate("moyen") : filRate("moyen"))}
                  className="rounded-lg border border-amber-300 bg-amber-50 py-2.5 font-medium text-amber-700 hover:bg-amber-100"
                >
                  Moyen (2)
                </button>
                <button
                  onClick={() => (phase === "drill" ? drillRate("reussi") : filRate("reussi"))}
                  className="rounded-lg border border-emerald-300 bg-emerald-50 py-2.5 font-medium text-emerald-700 hover:bg-emerald-100"
                >
                  Réussi (3)
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <p className="mt-4 text-center text-xs text-slate-400">
        Espace = révéler · 1 = raté · 2 = moyen · 3 = réussi
      </p>
    </div>
  );
}
