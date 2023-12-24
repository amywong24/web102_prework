/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
*/

// import the JSON data about the crowd funded games from the games.js file
import games from './games.js';
import GAMES_DATA from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA)

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
*/

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {

    // loop over each item in the data
    for (let i = 0; i < games.length; i++) {
        // create a new div element, which will become the game card
        let div = document.createElement('div');

        // add the class game-card to the list
        div.classList.add('game-card');

        // set the inner HTML using a template literal to display some info 
        // about each game
        // TIP: if your images are not displaying, make sure there is space
        // between the end of the src attribute and the end of the tag ("/>")
        let gameInfo = `
            <div class="game-card">
                <h1>${games[i].name}</h1>
                <img src ='${games[i].img}' class = "game-img"/>
                <p>${games[i].description}</p>
                <p>Goal: ${games[i].goal}</p>
            </div>
        `
        div.innerHTML = gameInfo;


        // append the game to the games-container
        gamesContainer.appendChild(div);
    }
}

// call the function we just defined using the correct variable
// later, we'll call this function using a different list of games
addGamesToPage(GAMES_JSON);

/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
*/

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers
const totalContributions = GAMES_JSON.reduce( (totalNum, contribution) => {
    return totalNum + contribution.backers;
  }, 0);
console.log(totalContributions); // 19187

// set the inner HTML using a template literal and toLocaleString to get a number with commas
let backerInfo = ` 
    <p>${totalContributions.toLocaleString()}</p>`
contributionsCard.innerHTML = backerInfo;

// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");
const totalRaised = GAMES_JSON.reduce( (totalPrice, raise) => {
    return totalPrice + raise.pledged;
}, 0);
console.log(totalRaised); // 800268

// set inner HTML using template literal
let raisedInfo = `
<p>$${totalRaised.toLocaleString()}</p>
`
raisedCard.innerHTML = raisedInfo;

// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");
const totalGames = GAMES_JSON.reduce( (totalNumGames, game) => {
    return totalNumGames + 1;
}, 0);
console.log(totalGames); // 11

let totalGamesInfo = `
    <p>${totalGames.toLocaleString()}</p>`
gamesCard.innerHTML = totalGamesInfo;

/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
*/

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have not yet met their goal
    let listUnfunded = GAMES_JSON.filter((game) => {
        return game.pledged < game.goal;
    });

    // use the function we previously created to add the unfunded games to the DOM
    addGamesToPage(listUnfunded);
}


// show only games that are fully funded
function filterFundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have met or exceeded their goal
    let listFunded = GAMES_JSON.filter((game) => {
        return game.pledged >= game.goal;
    });

    // use the function we previously created to add unfunded games to the DOM
    addGamesToPage(listFunded);
}


// show all games
function showAllGames() {
    deleteChildElements(gamesContainer);

    // add all games from the JSON data to the DOM
    addGamesToPage(GAMES_JSON);
}

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// add event listeners with the correct functions to each button
unfundedBtn.addEventListener('click', filterUnfundedOnly);
fundedBtn.addEventListener('click', filterFundedOnly);
allBtn.addEventListener('click', showAllGames);

/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/
// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter or reduce to count the number of unfunded games
const unfundedGames = GAMES_JSON.filter((game) => {
    return game.pledged < game.goal;
});

const numUnfundedGames = unfundedGames.length;
console.log(numUnfundedGames);

// create a string that explains the number of unfunded games using the ternary operator
let text = `A total of $${totalRaised.toLocaleString()} has been raised for ${totalGames.toLocaleString()} ${totalGames === 1 ? "game" : "games"}.
Currently, ${numUnfundedGames.toLocaleString()} ${numUnfundedGames === 1 ? "game remains" : "games remain"} unfunded. 
We need your help to fund these amazing games.`

// create a new DOM element containing the template string and append it to the description container
let textElement = document.createElement("p");
textElement.innerHTML = text;
descriptionContainer.append(textElement);

/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort 
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames = GAMES_JSON.sort((item1, item2) => {
    return item2.pledged - item1.pledged;
});

// use destructuring and the spread operator to grab the first and second games
let [firstGame, secondGame, ...otherGames] = sortedGames;
const {name: fgName, description: fgDesc, pledged: fgPledged, goal: fgGoal, backers: fgBack} = firstGame;
const {name: sgName, description: sgDesc, pledged: sgPledged, goal: sgGoal, backers: sgBack} = secondGame;

// create a new element to hold the name of the top pledge game, then append it to the correct element
let firstGameDisplay = `${fgName}`
let fgDisplay = document.createElement("p");
fgDisplay.innerHTML = firstGameDisplay;
firstGameContainer.append(fgDisplay);

// do the same for the runner up item
let secondGameDisplay = `${sgName}`
let sgDisplay = document.createElement("p");
sgDisplay.innerHTML = secondGameDisplay;
secondGameContainer.append(sgDisplay);