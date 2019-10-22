import trivia from './apis/trivia';

let gamesList = document.getElementById('games-list');
let playerSelect = document.getElementById('player-select');
let locationSelect = document.getElementById('location-select');

let gamesArr = [];

async function getGames(callback) {
  const response = await trivia.get('/games');
  console.log(response.data)
  response.data.forEach((game) => {
    gamesArr.push(game);
    callback(game)
  })
 };

async function getPlayers(callback) {
  const response = await trivia.get('/players');
  console.log(response)
  response.data.forEach((player) => {
    callback(player);
  })
}

async function getLocations(callback) {
  const response = await trivia.get('/locations');
  console.log(response)
  response.data.forEach((location) => {
    callback(location);
  })
}

function displayGames(game) {
  let li = document.createElement("li");
  li.innerHTML = game.game_date.substring(0, 10) + " - " + game.location_name + " - " + game.place + " - " + game.points;
  gamesList.appendChild(li)
}

function displayPlayers(player) {
  let opt = document.createElement("option");
  opt.setAttribute("value", `${player.player_id}`);
  opt.innerHTML = player.first_name + " " + player.last_name;
  playerSelect.appendChild(opt);
}

function displayLocations(location) {
  let opt = document.createElement("option");
  opt.setAttribute("value", `${location.location_id}`);
  opt.innerHTML = location.location_name;
  locationSelect.appendChild(opt);
}

getGames(displayGames);
getPlayers(displayPlayers);
getLocations(displayLocations);

