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
let locDiv = document.getElementById('loc-div');
let fnameDiv = document.getElementById('fName-input');
let lnameDiv = document.getElementById('lName-input');
let playerChecks = document.getElementById('player-checkboxes');
let newGameSubmitBtn = document.getElementById('new-game-sbmt');
let newGameDate = document.getElementById('ng-date');
let newGameLocation = document.getElementById('ng-location-select');
let newGameTeamName = document.getElementById('ng-team-name');
let newGamePoints = document.getElementById('ng-points');
let newGamePlace = document.getElementById('ng-place');

let gamesArr = [];

///////// ~~ START OF API CALLS ~~ ///////////

//API call to get a list of ALL games
async function getGames(callback) {
  const response = await trivia.get('/games');
  response.data.forEach((game) => {
    gamesArr.push(game);
    callback(game)
  })
 };

//API call to get a list of ALL players
async function getPlayers(playerDisplay, playerCheckboxes) {
  const response = await trivia.get('/players');
  response.data.forEach((player) => {
    playerDisplay(player);
    playerCheckboxes(player);
  })
}

//API call to get a list of ALL locations
async function getLocations(callback, callback2) {
  const response = await trivia.get('/locations');
  response.data.forEach((location) => {
    callback(location);
    callback2(location);
  })
}

//API call to get a list of games that a single player played in
async function getPlayerGames(playerId, callback, noGamesCallback) {
  const response = await trivia.get(`/players/games/${playerId}`);
  //Remove the current player's list if it is present
  document.getElementById('player-name').innerHTML = "";
  while (playerGameList.lastChild){
    playerGameList.removeChild(playerGameList.lastChild);
  }
  if(response.data.length > 0){
    response.data.forEach((game) => {
      callback(game);
    })
  }else{
    noGamesCallback();
  }
  
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
    if(fName.length === 0){
      fnameDiv.classList.add('error')
    }
    if(lName.length === 0){
      lnameDiv.classList.add('error')
    }
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
    locDiv.classList.add('error')
  }
}

//API call to POST a new game
async function addNewGame(date, location, teamName, place, points) {
  await trivia.post('/games', {
    gameDate: date,
    location: location,
    teamName: teamName,
    place: place,
    points: points
  })
}

//API call to POST a new game_player **used as callback in getNgPlayers function
async function addNewGamePlayer(playerId, gameDate){
  await trivia.post('/gameplayer', {
    playerId: playerId,
    gameDate: gameDate
  })
}

///////// ~~ END OF API CALLS ~~ ///////////


//Callback to display the list of games for all game API call
function displayGames(game) {
  let li = document.createElement("li");
  li.innerHTML = game.game_date.substring(0, 10) + " - " + game.location_name + " - " + game.players + " - " + game.place + " - " + game.points;
  gamesList.appendChild(li)
}

//Callback to display the list of players for all player API call
function displayPlayers(player) {
  let opt = document.createElement("option");
  opt.setAttribute("value", `${player.player_id}`);
  opt.innerHTML = player.first_name + " " + player.last_name;
  playerSelect.appendChild(opt);
}

//Callback to add the list of players to the checkboxes for creating a new game
function addPlayerChecks(player) {
  let checkBox = document.createElement("input");
  checkBox.type = "checkbox";
  checkBox.value = `${player.player_id}`;
  checkBox.id =`${player.player_id}`;
  checkBox.name = "players";
  checkBox.class = "player-checks"

  let checkLabel = document.createElement("label");
  checkLabel.htmlFor = `${checkBox.id}`;
  checkLabel.appendChild(document.createTextNode(`${player.first_name} ${player.last_name}`));

  let checkDiv = document.createElement("div");
  
  checkDiv.appendChild(checkBox);
  checkDiv.appendChild(checkLabel);
  playerChecks.appendChild(checkDiv);
}

//Callback to display the list of locations for all location API call
function displayLocations(location) {
  let opt = document.createElement("option");
  let label = document.createElement("label")
  opt.setAttribute("value", `${location.location_id}`);
  opt.innerHTML = location.location_name;
  locationSelect.appendChild(opt);
}

//Callback to display the list of location in the new game form
function displayNgLocations(location) {
  let opt = document.createElement("option");
  let label = document.createElement("label")
  opt.setAttribute("value", `${location.location_id}`);
  opt.innerHTML = location.location_name;
  newGameLocation.appendChild(opt);
}

//Callback to display the list of games for a single player
function displayPlayerGames(game) {
  document.getElementById('player-name').innerHTML = game.first_name + "'s games";
  let li = document.createElement("li");
  li.innerHTML = game.game_date.substring(0, 10) + " - " + game.location_name + " - " + game.place + " - " + game.points;
  playerGameList.appendChild(li);
}

//Callback to display message if player has no games
function displayNoGameMsg() {
  document.getElementById('player-name').innerHTML = "No Games";
}

//Callback to display the list of games for a single location
function displayLocationGames(location) {
  let li = document.createElement("li");
  li.innerHTML = location.game_date.substring(0, 10) + " - " + location.location_name + " - " + location.place + " - " + location.points;
  locationGameList.appendChild(li);
}

//Function to pull the players that are checked.
//Takes a callback that is the API call to post these players and game date to the game_players table
function getNgPlayers(gameDate, callback){
  for(let i = 0; i < document.getElementsByName("players").length; i++){
    if(document.getElementsByName("players")[i].checked){
      callback(document.getElementsByName("players")[i].value, gameDate)
    }
  }
}

//Event listener to call the API to get a list of a single player's games when a new player is selected
playerSelect.addEventListener("change", function(){getPlayerGames(document.getElementById('player-select').value, displayPlayerGames, displayNoGameMsg)});

//Event Listener to call the API to get a list of a single location's games when a new location is selected
locationSelect.addEventListener("change", function(){getLocationGames(document.getElementById('location-select').value, displayLocationGames)});

//Event listener to call the API to post a new player when the submit button is clicked
newPlayerSubmitBtn.addEventListener("click", function(){addNewPlayer(newPlayFName.value, newPlayLName.value)});

//Event listener to call the API to post a new location when the submit button is clicked
newLocSubmitBtn.addEventListener("click", function(){addNewLocation(newLocName.value)});

//Event listeners to remove the error styling for inputs
newLocName.addEventListener("keydown", function(){locDiv.classList.remove('error')});
newPlayFName.addEventListener("keydown", function(){fnameDiv.classList.remove('error')});
newPlayLName.addEventListener("keydown", function(){lnameDiv.classList.remove('error')});

//Event listener to call the API to post a new game and call the function that pulls in the game players/then calls the API to post each of them to the game_players table when the submit button is clicked
newGameSubmitBtn.addEventListener("click", async function(){ 
  await addNewGame(newGameDate.value, newGameLocation.value, newGameTeamName.value, newGamePlace.value, newGamePoints.value); 
  getNgPlayers(newGameDate.value, addNewGamePlayer); 
  window.location.reload()
});


getGames(displayGames);
getPlayers(displayPlayers, addPlayerChecks);
getLocations(displayLocations, displayNgLocations);

