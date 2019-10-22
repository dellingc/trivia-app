import trivia from './apis/trivia';

let gamesList = document.getElementById('games-list');
let playerSelect = document.getElementById('player-select');
let player = playerSelect.value; 
let locationSelect = document.getElementById('location-select');
let playerGameList = document.getElementById('player-games-list');
let playerSubmitBtn = document.getElementById('player-sbmt');

let gamesArr = [];

///////// ~~ START OF API CALLS ~~ ///////////

//API call to get a list of ALL games
async function getGames(callback) {
  const response = await trivia.get('/games');
  console.log(response.data)
  response.data.forEach((game) => {
    gamesArr.push(game);
    callback(game)
  })
 };

//API call to get a list of ALL players
async function getPlayers(callback) {
  const response = await trivia.get('/players');
  console.log(response)
  response.data.forEach((player) => {
    callback(player);
  })
}

//API call to get a list of ALL locations
async function getLocations(callback) {
  const response = await trivia.get('/locations');
  console.log(response)
  response.data.forEach((location) => {
    callback(location);
  })
}

//API call to get a list of games that a single player played in
async function getPlayerGames(playerId, callback) {
  const response = await trivia.get(`/players/games/${playerId}`);
  console.log(response.data)
  //Remove the current player's list if it is present
  while (playerGameList.lastChild){
    playerGameList.removeChild(playerGameList.lastChild);
  }
  response.data.forEach((game) => {
    callback(game);
  })
}

///////// ~~ END OF API CALLS ~~ ///////////


//Callback to display the list of games for all game API call
function displayGames(game) {
  let li = document.createElement("li");
  li.innerHTML = game.game_date.substring(0, 10) + " - " + game.location_name + " - " + game.place + " - " + game.points;
  gamesList.appendChild(li)
}

//Callback to display the list of players for all player API call
function displayPlayers(player) {
  let opt = document.createElement("option");
  opt.setAttribute("value", `${player.player_id}`);
  opt.innerHTML = player.first_name + " " + player.last_name;
  playerSelect.appendChild(opt);
}

//Callback to display the list of locations for all location API call
function displayLocations(location) {
  let opt = document.createElement("option");
  opt.setAttribute("value", `${location.location_id}`);
  opt.innerHTML = location.location_name;
  locationSelect.appendChild(opt);
}

//Callback to display the list of games for a single player
function displayPlayerGames(game) {
  let li = document.createElement("li");
  li.innerHTML = game.game_date.substring(0, 10) + " - " + game.location_name + " - " + game.place + " - " + game.points + " - " + game.first_name;
  playerGameList.appendChild(li);
}

//Event listener to call the API to get a list of a single player's games when a new player is selected
playerSelect.addEventListener("change", function(){getPlayerGames(document.getElementById('player-select').value, displayPlayerGames)});

getGames(displayGames);
getPlayers(displayPlayers);
getLocations(displayLocations);

