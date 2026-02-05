/**
 * Initializes the application by performing the following tasks:
 * - Displays the loading screen.
 * - Fetches all Pokémon data and stores it in the `currentPokemon` array.
 * - Fetches Pokémon types and generations from the API.
 * - Renders the category UI.
 * - Hides the loading screen.
 * - Sets up event listeners for the search bar and music controls.
 * - Prepares all Pokémon data for the search functionality.
 * 
 * @async
 * @function init
 * @returns {Promise<void>} A promise that resolves when the initialization is complete.
 */
async function init() {
  toggleLoadingScreen(true);
  await fetchAllPokemons();
  currentPokemon = [...allPokemon];
  pokemonTypes = await fetchTypesFromAPI();
  pokemonGenerations = await fetchGenerationsFromAPI();
  renderCategory();
  toggleLoadingScreen(false);
  document.getElementById("search-bar").addEventListener("blur", resetSearch);
  fetchALLPokemonToSearch();
};

/**
 * Fetches data from the specified URL and parses it as JSON.
 *
 * @async
 * @function fetchToJson
 * @param {string} url - The URL to fetch data from.
 * @returns {Promise<Object>} A promise that resolves to the parsed JSON object.
 * @throws {TypeError} If the response is not valid JSON or the fetch fails.
 */
async function fetchToJson(url) {
  const response = await fetch(url);
  return response.json();
};

/**
 * Fetches all Pokémon data in batches from the PokéAPI and stores it in the global `allPokemon` array.
 * 
 * This function retrieves a list of Pokémon from the PokéAPI with a limit of 1010 Pokémon.
 * It then processes the data in batches of 50, starting from the 21st Pokémon (index 20),
 * and fetches detailed information for each Pokémon in the batch.
 * 
 * @async
 * @function fetchALLPokemonToSearch
 * @throws {Error} Logs an error message to the console if there is an issue with fetching Pokémon data.
 */
async function fetchALLPokemonToSearch() {
  try {
    const pokemonListData = await fetchToJson("https://pokeapi.co/api/v2/pokemon?limit=1010");
    const batchSize = 50;
    for (let i = 20; i < pokemonListData.results.length; i += batchSize) {
      const batch = pokemonListData.results.slice(i, i + batchSize);
      const batchPokemon = await Promise.all(batch.map(pokemon => fetchToJson(pokemon.url)));
      allPokemon = [...allPokemon, ...batchPokemon];
    }
  } catch (error) {
    console.error("Fehler beim Laden aller Pokémon:", error);
  }
};

/**
 * Fetches a batch of Pokémon data from the PokéAPI and updates the application state.
 * 
 * This function retrieves a list of Pokémon from the PokéAPI, fetches detailed data
 * for each Pokémon, and appends the new Pokémon to the existing list. It also renders
 * the new Pokémon cards in the UI and handles loading states and errors.
 * 
 * @async
 * @function
 * @throws {Error} If there is an issue with fetching Pokémon data.
 */
async function fetchAllPokemons() {
  const display = document.getElementById("pokemon-display");
  try {
    const pokemonListData = await fetchToJson(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`);
    const newPokemons = await Promise.all(pokemonListData.results.map(pokemon => fetchToJson(pokemon.url)));
    allPokemon = [...allPokemon, ...newPokemons];
    renderAllPokemonCards(newPokemons);
    offset += 20;
  } catch (error) {
    display.innerHTML = `<p>Fehler beim Laden der Pokémon: ${error.message}</p>`;
  } finally {
    toggleLoadingScreen(false);
  }
};

/**
 * Fetches detailed information for a specified number of Pokémon from the PokéAPI.
 *
 * @async
 * @function fetchAllPokemonDetails
 * @param {number} [limit=15] - The maximum number of Pokémon details to fetch.
 * @returns {Promise<Object[]>} A promise that resolves to an array of Pokémon detail objects.
 * @throws Will log an error to the console if fetching Pokémon details fails.
 */
async function fetchAllPokemonDetails(limit = 15) {
  try {
    const pokemonListData = await fetchToJson("https://pokeapi.co/api/v2/pokemon?limit=1010");
    const allPokemonDetails = [];
    for (let i = 0; i < pokemonListData.results.length; i++) {
      const pokemonInfo = await fetchToJson(pokemonListData.results[i].url);
      allPokemonDetails.push(pokemonInfo);
      if (allPokemonDetails.length >= limit) {
        return allPokemonDetails;
      }
    }
  } catch (error) {
    console.error("Fehler beim Abrufen der Pokémon-Details:", error);
  }
};

/**
 * Fetches a list of Pokémon types from the PokéAPI.
 * This function retrieves a list of Pokémon types from the PokéAPI and returns them as an array of objects.
 * Each object contains information about a Pokémon type.
 * If the request fails, it logs an error to the console and returns an empty array.
 *
 * @async
 * @function fetchTypesFromAPI
 * @returns {Promise<Object[]>} A promise that resolves to an array of Pokémon type objects.
 * @throws Will log an error to the console if the fetch operation fails and return an empty array.
 */
async function fetchTypesFromAPI() {
  try {
    return (await fetchToJson("https://pokeapi.co/api/v2/type/")).results;
  } catch (error) {
    console.error("Fehler beim Abrufen der Typen:", error);
    return [];
  }
};

/**
 * Fetches Pokémon generations from the PokéAPI.
 *
 * This function sends a request to the PokéAPI to retrieve a list of Pokémon generations.
 * If the request is successful, it returns an array of generation results.
 * In case of an error, it logs the error to the console and returns an empty array.
 *
 * @async
 * @function
 * @returns {Promise<Object[]>} A promise that resolves to an array of generation objects.
 * Each object contains information about a Pokémon generation.
 * @throws {Error} Logs an error message to the console if the fetch operation fails.
 */
async function fetchGenerationsFromAPI() {
  try {
    return (await fetchToJson("https://pokeapi.co/api/v2/generation/")).results;
  } catch (error) {
    console.error("Fehler beim Abrufen der Generationen:", error);
    return [];
  }
};

/**
 * Fetches additional Pokémon data and updates the application state.
 * Displays a loading screen while the data is being fetched.
 * Handles errors that may occur during the fetch process.
 * 
 * @async
 * @function fetchMorePokemons
 * @returns {Promise<void>} A promise that resolves when the fetching process is complete.
 */
async function fetchMorePokemons() {
  toggleLoadingScreen(true);
  try {
    await fetchAllPokemons();
  } catch (error) {
    console.error("Fehler beim Laden weiterer Pokémon:", error);
  } finally {
    toggleLoadingScreen(false);
  }
};

/**
 * Fetches the evolution chain of a Pokémon by its ID.
 *
 * This function retrieves the species data and evolution chain data for a given Pokémon ID
 * from the PokéAPI. It processes the evolution chain to extract the IDs and names of all
 * Pokémon in the chain and stores them in a global array.
 *
 * @async
 * @function
 * @param {number|string} pokemonId - The ID of the Pokémon whose evolution chain is to be fetched.
 * @returns {Promise<Array<{id: string, name: string}>>} A promise that resolves to an array of objects,
 * each containing the ID and name of a Pokémon in the evolution chain. Returns an empty array if an error occurs.
 * @throws Will log an error to the console if the fetch operation fails.
 */
async function fetchEvolutions(pokemonId) {
  try {
    const speciesData = await fetchToJson(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);
    const evolutionData = await fetchToJson(speciesData.evolution_chain.url);
    let current = evolutionData.chain;
    globalEvolutions = [];
    while (current) {
      const id = current.species.url.split("/").slice(-2, -1)[0];
      globalEvolutions.push({ id, name: current.species.name });
      current = current.evolves_to[0];}
    return globalEvolutions;
  } catch (error) { console.error("Fehler beim Abrufen der Evolutionsdaten:", error);
    return [];
  }
};

/**
 * Toggles the visibility of the loading screen and adjusts the body's overflow style.
 *
 * @param {boolean} show - A boolean value indicating whether to show or hide the loading screen.
 *                          If `true`, the loading screen is displayed and body scrolling is disabled.
 *                          If `false`, the loading screen is hidden and body scrolling is restored.
 */
function toggleLoadingScreen(show) {
  const loadingScreen = document.getElementById("loading-screen");
  const body = document.body;
  if (show) {
    loadingScreen.classList.remove("d-none");
    body.style.overflow = "hidden";
  } else {
    loadingScreen.classList.add("d-none");
    body.style.overflow = "";
  }
};

/**
 * Navigates through the list of Pokémon in the specified direction and updates the overlay with the selected Pokémon's details and evolutions.
 *
 * @async
 * @function
 * @param {number} direction - The direction to navigate. Use 1 to move forward and -1 to move backward.
 * @returns {Promise<void>} Resolves when the overlay is updated with the new Pokémon's details.
 */
async function navigatePokemon(direction) {
  if (!currentPokemon || currentPokemon.length === 0) {
    return;
  }
  currentPokemonIndex += direction;
  if (currentPokemonIndex < 0) {
    currentPokemonIndex = allPokemon.length - 1;
  } else if (currentPokemonIndex >= allPokemon.length) {
    currentPokemonIndex = 0;
  }
  const pokemon = currentPokemon[currentPokemonIndex];
  const evolutions = await fetchEvolutions(pokemon.id);
  renderOverlay(currentPokemonIndex, evolutions);
};

/**
 * Capitalizes the first letter of a given string.
 *
 * @param {string} string - The string to be capitalized.
 * @returns {string} The input string with its first letter converted to uppercase.
 */
function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
