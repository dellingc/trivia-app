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
let removePlayerList = document.getElementById('rmv-player-list');
let removePlayerBtn = document.getElementById('rmv-player-sbmt');


///////// ~~ START OF API CALLS ~~ ///////////

//API call to get a list of ALL games
async function getGames(callback) {
  const response = await trivia.get('/games');
  response.data.forEach((game) => {
    callback(game)
  })
 };

//API call to get a list of ALL players
async function getPlayers(playerDisplay, playerCheckboxes, playerDropdown) {
  const response = await trivia.get('/players');
  response.data.forEach((player) => {
    playerDisplay(player);
    playerCheckboxes(player);
    playerDropdown(player);
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

//API call to DELETE a player
async function removePlayer(playerId){
  trivia.delete(`/players/${playerId}`)
}

///////// ~~ END OF API CALLS ~~ ///////////


//Callback to display the list of games for all game API call
// function displayGames(game) {
//   let li = document.createElement("li");
//   li.innerHTML = game.game_date.substring(0, 10) + " - " + game.location_name + " - " + game.players + " - " + game.place + " - " + game.points;
//   gamesList.appendChild(li)
// }

function displayGames(game) {
  let tr = document.createElement('tr');
  let td1 = document.createElement('td');
  td1.innerHTML = game.game_date.substring(0, 10);
  let td2 = document.createElement('td');
  td2.innerHTML = game.location_name;
  let td3 = document.createElement('td');
  td3.innerHTML = game.players;
  let td4 = document.createElement('td');
  td4.innerHTML = game.place;
  let td5 = document.createElement('td');
  td5.innerHTML = game.points;
  tr.appendChild(td1);
  tr.appendChild(td2);
  tr.appendChild(td3);
  tr.appendChild(td4);
  tr.appendChild(td5);
  gamesList.appendChild(tr)
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

//Callback to add the list of players to the remove player dropdown
function addPlayersToDropdown(player) {
  let option = document.createElement("option");
  option.value = `${player.player_id}`;
  option.id = `${player.player_id}`;
  option.innerHTML = `${player.first_name} ${player.last_name}`;
  removePlayerList.appendChild(option)
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
// function displayPlayerGames(game) {
//   document.getElementById('player-name').innerHTML = game.first_name + "'s games";
//   let li = document.createElement("li");
//   li.innerHTML = game.game_date.substring(0, 10) + " - " + game.location_name + " - " + game.place + " - " + game.points;
//   playerGameList.appendChild(li);
// }

function displayPlayerGames(game) {
  let tr1 = document.createElement('tr');
  let th1 = document.createElement('th');
  th1.innerHTML = "Date";
  let th2 = document.createElement('th');
  th2.innerHTML = "Location";
  let th3 = document.createElement('th');
  th3.innerHTML = "Place";
  let th4 = document.createElement('th');
  th4.innerHTML = "Points";
  tr1.appendChild(th1);
  tr1.appendChild(th2);
  tr1.appendChild(th3);
  tr1.appendChild(th4);

  let tr2 = document.createElement('tr');
  let td1 = document.createElement('td');
  td1.innerHTML = game.game_date.substring(0, 10);
  let td2 = document.createElement('td');
  td2.innerHTML = game.location_name;
  let td3 = document.createElement('td');
  td3.innerHTML = game.place;
  let td4 = document.createElement('td');
  td4.innerHTML = game.points;
  tr2.appendChild(td1);
  tr2.appendChild(td2);
  tr2.appendChild(td3);
  tr2.appendChild(td4);

  if(!playerGameList.hasChildNodes()){
    playerGameList.appendChild(tr1);
  }
  playerGameList.appendChild(tr2);
}

//Callback to display message if player has no games
function displayNoGameMsg() {
  let td = document.createElement('td');
  td.innerHTML = "No Games"
  playerGameList.appendChild(td)
  //document.getElementById('player-name').innerHTML = "No Games";
}

//Callback to display the list of games for a single location
// function displayLocationGames(location) {
//   let li = document.createElement("li");
//   li.innerHTML = location.game_date.substring(0, 10) + " - " + location.location_name + " - " + location.place + " - " + location.points;
//   locationGameList.appendChild(li);
// }

function displayLocationGames(location) {
  let tr1 = document.createElement('tr');
  let th1 = document.createElement('th');
  th1.innerHTML = "Date";
  let th2 = document.createElement('th');
  th2.innerHTML = "Location";
  let th3 = document.createElement('th');
  th3.innerHTML = "Place";
  let th4 = document.createElement('th');
  th4.innerHTML = "Points";
  tr1.appendChild(th1);
  tr1.appendChild(th2);
  tr1.appendChild(th3);
  tr1.appendChild(th4);

  let tr = document.createElement('tr');
  let td1 = document.createElement('td');
  td1.innerHTML = location.game_date.substring(0, 10);
  let td2 = document.createElement('td');
  td2.innerHTML = location.location_name;
  let td3 = document.createElement('td');
  td3.innerHTML = location.place;
  let td4 = document.createElement('td');
  td4.innerHTML = location.points;
  tr.appendChild(td1);
  tr.appendChild(td2);
  tr.appendChild(td3);
  tr.appendChild(td4);

  if(!locationGameList.hasChildNodes()){
    locationGameList.appendChild(tr1);
  }
  locationGameList.appendChild(tr)
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
newPlayerSubmitBtn.addEventListener("click", function(){addNewPlayer(newPlayFName.value, newPlayLName.value); this.classList.add('active', 'inverted', 'inline', 'loader'), this.innerHTML = ""});

//Event listener to call the API to post a new location when the submit button is clicked
newLocSubmitBtn.addEventListener("click", function(){addNewLocation(newLocName.value); this.classList.add('active', 'inverted', 'inline', 'loader'), this.innerHTML = ""});

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

//Event listener to submit a new game
newGameSubmitBtn.addEventListener("click", function(){this.classList.add('active', 'inverted', 'inline', 'loader'), this.innerHTML = ""});

//Event listener to call the API to delete a player
removePlayerBtn.addEventListener("click", async function(){
  if(confirm(`Are you sure you want to delete ${removePlayerList.options[removePlayerList.selectedIndex].text}?`)){
    await removePlayer(removePlayerList.value); 
    window.location.reload();
  }
  
})

getGames(displayGames);
getPlayers(displayPlayers, addPlayerChecks, addPlayersToDropdown);
getLocations(displayLocations, displayNgLocations);

