/**
 * This function renders the pokemon card template with the given pokemon data from fetching the API.
 * 
 * @param {string} pokemonList 
 * @param {boolean} loadMore 
 */
function renderAllPokemonCards(pokemonList, loadMore) {
    currentPokemon = pokemonList;
    const display = document.getElementById("pokemon-display");

    if(loadMore === false){
        display.innerHTML = "";
    }

    pokemonList.forEach((pokemon) => {
        display.innerHTML += pokemonCardTemplate(pokemon);
    });
};

/**
 * Renders the category controls for filtering Pokémon.
 * If no Pokémon data is available, displays a loading message.
 * Otherwise, populates the controls container with filter options.
 */
function renderCategory() {
    const controlsContainer = document.getElementById("controls");
    if (!currentPokemon || currentPokemon.length === 0) {
      controlsContainer.innerHTML = `
        <p>Filter werden geladen...</p>
      `;
      return;
    }
    controlsContainer.innerHTML = filterTemplate(pokemonTypes, currentPokemon);
  };



/**
 * Renders an overlay displaying detailed information about a Pokémon, including its stats and evolutions.
 *
 * @async
 * @function
 * @param {number} index - The index of the Pokémon in the `currentPokemon` array.
 * @param {Array|undefined} evolutions - An optional array of evolution data for the Pokémon. If not provided, it will be fetched.
 * @returns {Promise<void>} - A promise that resolves when the overlay is rendered.
 *
 * @throws {Error} If the Pokémon at the given index is not found in the `currentPokemon` array.
 */
async function renderOverlay(index, evolutions) {
    const overlay = document.getElementById("overlay");
    const pokemon = currentPokemon[index];
        if (!pokemon) {
            overlay.innerHTML = "<p>Fehler: Pokémon nicht gefunden.</p>";
            overlay.style.display = "flex";
        return;}
        currentPokemonIndex = index;
    if (!evolutions) {
        evolutions = await fetchEvolutions(pokemon.id);}
    overlay.innerHTML = overlayTemplate(pokemon, evolutions);
    overlay.style.display = "flex";
        document.body.style.overflow = "hidden";
    renderStatsBars(pokemon, currentPokemon);
};

/**
 * Renders the HTML for a list of Pokémon evolutions.
 *
 * @param {Array<Object>} evolutions - An array of evolution objects. Each object represents a Pokémon evolution.
 * @returns {string} The HTML string representing the evolution cards. If no evolutions are provided, 
 *                   returns a message indicating no evolutions are available.
 */
function renderEvolutionCard(evolutions) {
    if (!evolutions || evolutions.length === 0) {
        return "<p>Keine Evolution verfügbar</p>";
    }
    let evolutionHtml = "";
    for (let i = 0; i < evolutions.length; i++) {
        const evo = evolutions[i];
        evolutionHtml += evolutionTemplate(evo);
    }
    return evolutionHtml;
};

/**
 * Opens the Pokémon overlay for the specified Pokémon ID.
 * Plays an audio effect, applies a blur effect to the content wrapper,
 * and renders the overlay for the selected Pokémon.
 *
 * @param {number} pokemonId - The ID of the Pokémon to display in the overlay.
 */
function openPokemonOverlay(pokemonId) {
    
    const contentWrapper = document.getElementById("content-wrapper");
    let pokemon = null;
    let index = -1;

    for (let i = 0; i < currentPokemon.length; i++) {
        if (currentPokemon[i].id === pokemonId) {
            pokemon = currentPokemon[i];
            index = i;
            break;}}
    if (!pokemon) return;
    contentWrapper.classList.add("blur"); 
    renderOverlay(index);
};

/**
 * Closes the Pokémon overlay by hiding it, stopping the blur effect on the content,
 * and restoring the page's scroll functionality. Also plays a sound effect when the overlay is closed.
 *
 * @function closePokemonOverlay
 * @returns {void}
 */
function closePokemonOverlay() {
    const overlay = document.getElementById("overlay");
    const contentWrapper = document.getElementById("content-wrapper");

    overlay.style.display = "none";
    
    contentWrapper.classList.remove("blur");
    document.body.style.overflow = "auto";
};