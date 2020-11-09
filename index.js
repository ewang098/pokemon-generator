/**
 * Eric Wang
 * This code was created as part of assignment for CSE 154: Webprogramming
 *
 * This javascript file incorporates event listeners onto the site through
 * the 'add' and 'clear' button. Once the user clicks 'add' a pokemon card is randomly
 * generated and displayed. Each pokemon card contains the pokemon's name, image, and its type(s).
 */
"use strict";
let uniqueIDs;
const numberCeiling = 893;

(function() {
  window.addEventListener("load", init);

  /**
   * Identifies 'add' and 'clear' buttons
   * Add event listeners to 'add' and 'clear' buttons.
   * Creates empty array of uniqueIDs which we will append upon 'add' and reset upon 'clear'
   */
  function init() {
    let add = id("add-btn");
    let clear = id("clear-btn");
    uniqueIDs = [];

    add.addEventListener("click", addPokemon);
    clear.addEventListener("click", clearDisplay);
  }

  /**
   * Upon user clicking 'clear' button, resets board removing all pokecards that
   * are children to the display
   */
  function clearDisplay() {
    let display = id("display");
    display.innerHTML = "";
    uniqueIDs = [];
  }

  /**
   * Upon user clicking 'add' button, randomly generates an ID and adds to array
   * to prevent future duplicates. Then hits the api to retrieve that
   * pokemon's information. If no error, moves on to displayPokemon() to generate
   * elements.
   */
  function addPokemon() {
    let pokemon = getRandomInt(numberCeiling);
    if (uniqueIDs.includes(pokemon)) {
      while (uniqueIDs.includes(pokemon)) {
        pokemon = getRandomInt(numberCeiling);
      }
    }
    uniqueIDs.push(pokemon);
    let url = "https://pokeapi.co/api/v2/pokemon/" + pokemon;

    fetch(url)
      .then(checkStatus)
      .then(resp => resp.text())
      .then(displayPokemon)
      .catch(console.error);
  }

  /**
   * Reads the JSON data from the API
   * Generates the PokeCard with name, image, and Pokemon's types.
   * Adds as child to display element
   * @param {JSON} response - JSON data fetched from API via defined url
   */
  function displayPokemon(response) {
    let dataJSON = JSON.parse(response);

    let types = dataJSON.types;

    let pokeCard = gen("div");
    pokeCard.classList.add("pokemonCard");

    let name = gen("p");
    let pokemonName = JSON.stringify(dataJSON.forms[0].name);
    pokemonName = pokemonName.substring(1, pokemonName.length - 1);
    pokemonName = capitalizeFirstLetter(pokemonName);
    name.innerText = pokemonName;

    let pokeIMG = gen("img");
    pokeIMG.src = dataJSON.sprites.front_default;

    pokeCard.appendChild(name);
    pokeCard.appendChild(pokeIMG);

    let typeList = gen("ul");
    typeList.innerText = "Type(s):";

    for (let i = 0; i < types.length; i++) {
      let tempType = gen("li");
      tempType.innerText = capitalizeFirstLetter(types[i].type.name);
      typeList.appendChild(tempType);
    }

    pokeCard.appendChild(typeList);

    let display = id("display");
    display.appendChild(pokeCard);
  }

  /**
   * https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript
   * @param {string} string - the string we want to capitalize the first letter
   * @return {object} - returns string with first letter capitalized
   */
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  /**
   * Helper function to return the response's result text if successful, otherwise
   * returns the rejected Promise result with an error status and corresponding text
   * @param {object} res - response to check for success/error
   * @return {object} - valid response if response was successful, otherwise rejected
   *                    Promise result
   */
  async function checkStatus(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
  }

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} idName - element ID.
   * @returns {object} - DOM object associated with id.
   */
  function id(idName) {
    return document.getElementById(idName);
  }

  /**
   * Returns random int based on max input
   * Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
   * @param {int} max the max ceiling number, this number is exclusive
   * @return {float} returns unique card
   */
  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  /**
   * Creates element with received tagName
   * @param {string} tagName - desired tag.
   * @returns {element} - returns element created.
   */
  function gen(tagName) {
    return document.createElement(tagName);
  }
})();