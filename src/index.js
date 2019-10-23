import trivia from './apis/trivia';

let gamesList = document.getElementById('games-list');
let playerSelect = document.getElementById('player-select'); 
let locationSelect = document.getElementById('location-select');
let playerGameList = document.getElementById('player-games-list');
let locationGameList = document.getElementById('location-games-list');
let newPlayerSubmitBtn = document.getElementById('new-player-sbmt');
let newPlayFName = document.getElementById('fName');
let newPlayLName = document.getElementById('lName');
let newLocSubmitBtn = document.getElementById('new-loc-sbmt');
let newLocName = document.getElementById('locName');


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
  document.getElementById('player-name').innerHTML = "";
  while (playerGameList.lastChild){
    playerGameList.removeChild(playerGameList.lastChild);
  }
  response.data.forEach((game) => {
    callback(game);
  })
}

//API call to get a list of games that were played at a single location
async function getLocationGames(locationId, callback) {
  const response = await trivia.get(`locations/games/${locationId}`);
  while (locationGameList.lastChild){
    locationGameList.removeChild(locationGameList.lastChild);
  }
  response.data.forEach((location) => {
    callback(location);
  })
}

//API call to POST a new player
async function addNewPlayer(fName, lName){
  if(fName.length > 0 && lName.length >0){
      await trivia.post('/players',{
      fName: fName,
      lName: lName
    })
    window.location.reload();
  }else{
    console.log('Must enter a name')
  }
}

//API call to POST a new location
async function addNewLocation(locName){
  if(locName.length > 0){
      await trivia.post('/locations',{
      locationName: locName,
    })
    window.location.reload();
  }else{
    console.log('Must enter a location name')
  }
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
  document.getElementById('player-name').innerHTML = game.first_name + "'s games";
  let li = document.createElement("li");
  li.innerHTML = game.game_date.substring(0, 10) + " - " + game.location_name + " - " + game.place + " - " + game.points;
  playerGameList.appendChild(li);
}

//Callback to display the list of games for a single location
function displayLocationGames(location) {
  let li = document.createElement("li");
  li.innerHTML = location.game_date.substring(0, 10) + " - " + location.location_name + " - " + location.place + " - " + location.points;
  locationGameList.appendChild(li);
}

//Event listener to call the API to get a list of a single player's games when a new player is selected
playerSelect.addEventListener("change", function(){getPlayerGames(document.getElementById('player-select').value, displayPlayerGames)});

//Event Listener to call the API to get a list of a single location's games when a new location is selected
locationSelect.addEventListener("change", function(){getLocationGames(document.getElementById('location-select').value, displayLocationGames)});

//Event listener to call the API to post a new player when the submit button is clicked
newPlayerSubmitBtn.addEventListener("click", function(){addNewPlayer(newPlayFName.value, newPlayLName.value)});

//Event listener to call the API to post a new location when the submit button is clicked
newLocSubmitBtn.addEventListener("click", function(){addNewLocation(newLocName.value)});


getGames(displayGames);
getPlayers(displayPlayers);
getLocations(displayLocations);

