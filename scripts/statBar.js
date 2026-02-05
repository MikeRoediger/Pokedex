/**
 * Rendert die Statistik-Balken für ein Pokémon basierend auf dessen Werten und den maximalen Werten aller Pokémon.
 *
 * @function renderStatsBars
 * @param {Object} pokemon - Das Pokémon, dessen Statistiken angezeigt werden sollen.
 * @param {Array} allPokemonStats - Eine Liste aller Pokémon-Statistiken, um maximale Werte zu berechnen.
 * @returns {void}
 */
function renderStatsBars(pokemon, allPokemonStats) {
  const chartContainer = document.querySelector('.stats-bar-chart');
  chartContainer.innerHTML = '';
  const labels = ['HP', 'Angriff', 'Verteidigung', 'Spez. Angriff', 'Spez. Verteidigung', 'Speed'];
  const colors = ['#ff6384', '#36a2eb', '#ffcd56', '#4bc0c0', '#9966ff', '#ff9f40'];
  const maxStats = calculateMaxStats(allPokemonStats);
  let maxScale = 0;

  for (let i = 0; i < maxStats.length; i++) {
    if (maxStats[i] > maxScale) {
      maxScale = maxStats[i];
    }
  }

  let chartHTML = '';
  for (let i = 0; i < labels.length; i++) {
    chartHTML += renderStatGroup(
      labels[i], pokemon.stats[i]?.base_stat || 0, maxStats[i], maxScale, colors[i]
    );
  }
  chartContainer.innerHTML = chartHTML;
}

/**
 * Erstellt eine einzelne Statistik-Gruppe (einen Balken) für ein bestimmtes Attribut eines Pokémon.
 *
 * @function renderStatGroup
 * @param {string} labelText - Der Name des Attributs (z. B. "HP").
 * @param {number} statValue - Der Wert des Attributs für das Pokémon.
 * @param {number} maxValue - Der maximale Wert dieses Attributs unter allen Pokémon.
 * @param {number} maxScale - Der höchste Wert aller Attribute (für die Skalierung).
 * @param {string} color - Die Farbe des Balkens.
 * @returns {string} - HTML für die Statistik-Gruppe.
 */
function renderStatGroup(labelText, statValue, maxValue, maxScale, color) {
  const pokemonBarWidth = (statValue / maxScale) * 100;
  return statBarTemplate(labelText, statValue, maxValue, pokemonBarWidth, color);
}

/**
 * Erstellt leere Statistik-Balken für die angegebenen Labels.
 *
 * @function renderEmptyStatsBars
 * @param {Array} labels - Eine Liste von Attributnamen (z. B. ["HP", "Angriff"]).
 * @returns {string} - HTML für die leeren Statistik-Balken.
 */
function renderEmptyStatsBars(labels) {
  let emptyStatsHTML = '';
  for (let i = 0; i < labels.length; i++) {
    emptyStatsHTML += emptyStatBarTemplate;
  }
  return emptyStatsHTML;
}

/**
 * Berechnet die durchschnittlichen Werte für jedes Attribut basierend auf den Statistiken aller Pokémon.
 *
 * @function calculateAverageStats
 * @param {Array} allPokemonStats - Eine Liste aller Pokémon-Statistiken.
 * @returns {Array} - Durchschnittswerte für jedes Attribut.
 */
function calculateAverageStats(allPokemonStats) {
  const totalStats = [0, 0, 0, 0, 0, 0];
  for (let i = 0; i < allPokemonStats.length; i++) {
    for (let j = 0; j < totalStats.length; j++) {
      totalStats[j] += allPokemonStats[i].stats[j].base_stat;
    }
  }
  const averages = [];
  for (let i = 0; i < totalStats.length; i++) {
    averages.push(Math.floor(totalStats[i] / allPokemonStats.length));
  }
  return averages;
}

/**
 * Berechnet die maximalen Werte für jedes Attribut basierend auf den Statistiken aller Pokémon.
 *
 * @function calculateMaxStats
 * @param {Array} allPokemonStats - Eine Liste aller Pokémon-Statistiken.
 * @returns {Array} - Maximalwerte für jedes Attribut.
 */
function calculateMaxStats(allPokemonStats) {
  const maxStats = [0, 0, 0, 0, 0, 0];
  for (let i = 0; i < allPokemonStats.length; i++) {
    for (let j = 0; j < maxStats.length; j++) {
      if (allPokemonStats[i].stats[j].base_stat > maxStats[j]) {
        maxStats[j] = allPokemonStats[i].stats[j].base_stat;
      }
    }
  }
  return maxStats;
}


