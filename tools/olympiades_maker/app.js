/* ── DOM refs ── */
const inputActivities  = document.getElementById("activities");
const inputDuels       = document.getElementById("duels");
const inputParticipants = document.getElementById("participants");
const btnGenerate      = document.getElementById("generate-btn");
const elMessage        = document.getElementById("message");
const elRotationsInfo  = document.getElementById("rotations-info");
const elPerActivityInfo = document.getElementById("per-activity-info");
const elResults        = document.getElementById("results");
const elTable          = document.getElementById("schedule-table");

/* ── Input wiring ── */
function syncParticipants() {
  const a = parseInt(inputActivities.value) || 0;
  const d = parseInt(inputDuels.value) || 0;
  const expected = a * 2 * d;
  if (expected > 0 && parseInt(inputParticipants.value) !== expected) {
    inputParticipants.value = expected;
  }
  updateInfo();
}

function updateInfo() {
  const a = parseInt(inputActivities.value) || 0;
  const d = parseInt(inputDuels.value) || 0;
  const p = parseInt(inputParticipants.value) || 0;
  elRotationsInfo.textContent = `Rotations : ${a}`;
  elPerActivityInfo.textContent = `Participants par activité : ${2 * d}`;
}

inputActivities.addEventListener("input", syncParticipants);
inputDuels.addEventListener("input", syncParticipants);
inputParticipants.addEventListener("input", updateInfo);

updateInfo();

/* ── Solver ── */
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function solve(numTeams, numActivities, numDuelsPerCase, maxAttempts) {
  const teamsPerActivity = 2 * numDuelsPerCase;
  const numRotations = numActivities;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const schedule = {};   // "rot,act" -> [[t1,t2], [t3,t4], ...]
    const teamActivity = {}; // "team,rot" -> act
    const teamActsDone = {}; // team -> Set<act>
    const teamOpponents = {}; // team -> Set<team>

    for (let t = 0; t < numTeams; t++) {
      teamActsDone[t] = new Set();
      teamOpponents[t] = new Set();
    }

    let ok = true;

    for (let rot = 0; rot < numRotations; rot++) {
      // Remaining activities for each team
      const remaining = [];
      for (let t = 0; t < numTeams; t++) {
        const rem = [];
        for (let a = 0; a < numActivities; a++) {
          if (!teamActsDone[t].has(a)) rem.push(a);
        }
        remaining[t] = rem;
      }

      // Backtrack assignment
      const assigned = []; // act -> [teams]
      for (let a = 0; a < numActivities; a++) assigned.push([]);
      const teamToAct = new Array(numTeams);
      const order = shuffle(Array.from({length: numTeams}, (_, i) => i));

      function backtrack(idx) {
        if (idx === numTeams) return true;
        const t = order[idx];
        for (const act of remaining[t]) {
          if (assigned[act].length >= teamsPerActivity) continue;
          assigned[act].push(t);
          teamToAct[t] = act;
          if (backtrack(idx + 1)) return true;
          assigned[act].pop();
          teamToAct[t] = undefined;
        }
        return false;
      }

      if (!backtrack(0)) { ok = false; break; }

      // Pair teams within each activity
      const paired = {};
      let canPair = true;

      for (let act = 0; act < numActivities; act++) {
        const actTeams = assigned[act].slice();
        const n = actTeams.length; // should be teamsPerActivity

        // Generate all ways to partition into pairs
        const pairings = generatePairings(actTeams);
        shuffle(pairings);

        let found = false;
        for (const pairing of pairings) {
          let valid = true;
          for (const [t1, t2] of pairing) {
            if (teamOpponents[t1].has(t2)) { valid = false; break; }
          }
          if (valid) {
            paired[act] = pairing;
            for (const [t1, t2] of pairing) {
              teamOpponents[t1].add(t2);
              teamOpponents[t2].add(t1);
            }
            found = true;
            break;
          }
        }
        if (!found) { canPair = false; break; }
      }

      if (!canPair) { ok = false; break; }

      for (let act = 0; act < numActivities; act++) {
        schedule[`${rot},${act}`] = paired[act];
      }
      for (let t = 0; t < numTeams; t++) {
        teamActivity[`${t},${rot}`] = teamToAct[t];
        teamActsDone[t].add(teamToAct[t]);
      }
    }

    if (!ok) continue;

    // Final verification
    const errors = verifySchedule(schedule, teamActivity, numTeams, numActivities, numRotations, teamsPerActivity);
    if (errors.length === 0) {
      return { schedule, teamActivity };
    }
  }
  return null;
}

function generatePairings(teams) {
  // Generate all ways to partition an even-sized list into pairs
  if (teams.length === 2) return [[teams]];
  if (teams.length === 4) {
    const [a, b, c, d] = teams;
    return [
      [[a, b], [c, d]],
      [[a, c], [b, d]],
      [[a, d], [b, c]]
    ];
  }
  if (teams.length === 6) {
    const [a, b, c, d, e, f] = teams;
    return [
      [[a,b],[c,d],[e,f]], [[a,b],[c,e],[d,f]], [[a,b],[c,f],[d,e]],
      [[a,c],[b,d],[e,f]], [[a,c],[b,e],[d,f]], [[a,c],[b,f],[d,e]],
      [[a,d],[b,c],[e,f]], [[a,d],[b,e],[c,f]], [[a,d],[b,f],[c,e]],
      [[a,e],[b,c],[d,f]], [[a,e],[b,d],[c,f]], [[a,e],[b,f],[c,d]],
      [[a,f],[b,c],[d,e]], [[a,f],[b,d],[c,e]], [[a,f],[b,e],[c,d]]
    ];
  }
  // For larger groups, generate a subset of pairings randomly
  const results = [];
  const rest = teams.slice(1);
  // Pick partner for teams[0] from rest
  shuffle(rest);
  for (let i = 0; i < Math.min(rest.length, 10); i++) {
    const partner = rest[i];
    const remaining = rest.filter((_, idx) => idx !== i);
    const subPairings = generatePairings(remaining);
    for (const sp of subPairings) {
      results.push([[teams[0], partner], ...sp]);
    }
    if (results.length > 50) break;
  }
  return results;
}

function verifySchedule(schedule, teamActivity, numTeams, numActivities, numRotations, teamsPerActivity) {
  const errors = [];

  // 1. Each team does each activity exactly once
  for (let t = 0; t < numTeams; t++) {
    const actCounts = {};
    for (let a = 0; a < numActivities; a++) actCounts[a] = 0;
    for (let rot = 0; rot < numRotations; rot++) {
      const a = teamActivity[`${t},${rot}`];
      if (a === undefined) {
        errors.push(`Participant ${t + 1} sans activit\u00e9 en rotation ${rot + 1}`);
      } else {
        actCounts[a]++;
      }
    }
    for (let a = 0; a < numActivities; a++) {
      if (actCounts[a] === 0) errors.push(`Participant ${t + 1} ne fait jamais l'activit\u00e9 ${a + 1}`);
      else if (actCounts[a] > 1) errors.push(`Participant ${t + 1} fait l'activit\u00e9 ${a + 1} ${actCounts[a]}x`);
    }
  }

  // 2. Each activity has exactly teamsPerActivity teams per rotation
  for (let rot = 0; rot < numRotations; rot++) {
    for (let act = 0; act < numActivities; act++) {
      const key = `${rot},${act}`;
      const duels = schedule[key];
      if (!duels || duels.length !== teamsPerActivity / 2) {
        // count teams
        let count = 0;
        for (let t = 0; t < numTeams; t++) {
          if (teamActivity[`${t},${rot}`] === act) count++;
        }
        if (count !== teamsPerActivity) {
          errors.push(`Rotation ${rot + 1}, Activit\u00e9 ${act + 1}: ${count} participants au lieu de ${teamsPerActivity}`);
        }
      }
    }
  }

  // 3. No repeated opponents
  const oppMap = {};
  for (let rot = 0; rot < numRotations; rot++) {
    for (let act = 0; act < numActivities; act++) {
      const duels = schedule[`${rot},${act}`];
      if (!duels) continue;
      for (const [t1, t2] of duels) {
        const key = t1 < t2 ? `${t1}-${t2}` : `${t2}-${t1}`;
        if (oppMap[key]) {
          errors.push(`P${t1 + 1}-P${t2 + 1} s'affrontent en R${oppMap[key] + 1} ET R${rot + 1}`);
        }
        oppMap[key] = rot;
      }
    }
  }

  return errors;
}

/* ── Rendering ── */
function renderTable(result, numActivities, numRotations, numDuelsPerCase) {
  elTable.innerHTML = "";

  // Header
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  const thCorner = document.createElement("th");
  thCorner.textContent = "";
  headerRow.appendChild(thCorner);
  for (let a = 0; a < numActivities; a++) {
    const th = document.createElement("th");
    th.textContent = `Activit\u00e9 ${a + 1}`;
    headerRow.appendChild(th);
  }
  thead.appendChild(headerRow);
  elTable.appendChild(thead);

  // Body
  const tbody = document.createElement("tbody");
  for (let rot = 0; rot < numRotations; rot++) {
    const tr = document.createElement("tr");
    const tdRot = document.createElement("td");
    tdRot.textContent = `R${rot + 1}`;
    tr.appendChild(tdRot);

    for (let act = 0; act < numActivities; act++) {
      const td = document.createElement("td");
      const duels = result.schedule[`${rot},${act}`];
      if (duels) {
        for (const [t1, t2] of duels) {
          const span = document.createElement("span");
          span.className = "duel";
          span.textContent = `P${t1 + 1} vs P${t2 + 1}`;
          td.appendChild(span);
        }
      }
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
  elTable.appendChild(tbody);
}

/* ── Generate handler ── */
btnGenerate.addEventListener("click", () => {
  const numActivities = parseInt(inputActivities.value);
  const numDuels = parseInt(inputDuels.value);
  const numTeams = parseInt(inputParticipants.value);
  const teamsPerActivity = 2 * numDuels;
  const numRotations = numActivities;

  // Validate
  if (numTeams !== numActivities * teamsPerActivity) {
    showMsg(`Incoh\u00e9rence : ${numActivities} activit\u00e9s \u00d7 ${teamsPerActivity} participants = ${numActivities * teamsPerActivity}, pas ${numTeams}. Correction appliqu\u00e9e.`, "error");
    inputParticipants.value = numActivities * teamsPerActivity;
    updateInfo();
    return;
  }

  if (numTeams < 4 || numActivities < 2 || numDuels < 1) {
    showMsg("Valeurs trop petites. Minimum : 2 activit\u00e9s, 1 duel, 4 participants.", "error");
    return;
  }

  showMsg("Calcul en cours...", "info");
  btnGenerate.disabled = true;
  elResults.hidden = true;

  // Run solver asynchronously
  setTimeout(() => {
    const maxAttempts = 500000;
    const result = solve(numTeams, numActivities, numDuels, maxAttempts);

    if (!result) {
      showMsg(`Aucune solution trouv\u00e9e apr\u00e8s ${maxAttempts} tentatives. Essayez d'autres param\u00e8tres.`, "error");
      btnGenerate.disabled = false;
      return;
    }

    // Verify one last time
    const errors = verifySchedule(result.schedule, result.teamActivity, numTeams, numActivities, numRotations, teamsPerActivity);
    if (errors.length > 0) {
      showMsg(`Solution trouv\u00e9e mais ${errors.length} erreur(s) de v\u00e9rification.`, "error");
      btnGenerate.disabled = false;
      return;
    }

    renderTable(result, numActivities, numRotations, numDuels);
    elResults.hidden = false;
    showMsg(`Planning g\u00e9n\u00e9r\u00e9 : ${numTeams} participants, ${numActivities} activit\u00e9s, ${numRotations} rotations. Toutes contraintes v\u00e9rifi\u00e9es.`, "success");
    btnGenerate.disabled = false;
  }, 50);
});

function showMsg(text, type) {
  elMessage.textContent = text;
  elMessage.className = type;
}
