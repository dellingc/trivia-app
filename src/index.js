import trivia from './apis/trivia';

let gamesList = document.getElementById('games-list');
let playerSelect = document.getElementById('player-select');

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

function displayGames(game) {
  let li = document.createElement("li");
  li.innerHTML = game.game_date.substring(0, 10) + " - " + game.location_name + " - " + game.place + " - " + game.points;
  gamesList.appendChild(li)
}

function displayPlayers(player) {
  let opt = document.createElement("option");
  opt.innerHTML = player.first_name + " " + player.last_name;
  playerSelect.appendChild(opt);
}

getGames(displayGames);
getPlayers(displayPlayers);

