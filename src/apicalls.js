import trivia from './apis/trivia';

let gamesArr = []
//API call to get a list of ALL games
export async function getGames(callback) {
    const response = await trivia.get('/games');
    response.data.forEach((game) => {
      gamesArr.push(game);
      callback(game)
    })
   };
  
  //API call to get a list of ALL players
export  async function getPlayers(playerDisplay, playerCheckboxes) {
    const response = await trivia.get('/players');
    response.data.forEach((player) => {
      playerDisplay(player);
      playerCheckboxes(player);
    })
  }
  
  //API call to get a list of ALL locations
export  async function getLocations(callback, callback2) {
    const response = await trivia.get('/locations');
    response.data.forEach((location) => {
      callback(location);
      callback2(location);
    })
  }
  
  //API call to get a list of games that a single player played in
export  async function getPlayerGames(playerId, callback, noGamesCallback) {
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
export  async function getLocationGames(locationId, callback) {
    const response = await trivia.get(`locations/games/${locationId}`);
    while (locationGameList.lastChild){
      locationGameList.removeChild(locationGameList.lastChild);
    }
    response.data.forEach((location) => {
      callback(location);
    })
  }
  
  //API call to POST a new player
export  async function addNewPlayer(fName, lName){
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
export  async function addNewLocation(locName){
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
export  async function addNewGame(date, location, teamName, place, points) {
    await trivia.post('/games', {
      gameDate: date,
      location: location,
      teamName: teamName,
      place: place,
      points: points
    })
  }
  
  //API call to POST a new game_player **used as callback in getNgPlayers function
export  async function addNewGamePlayer(playerId, gameDate){
    await trivia.post('/gameplayer', {
      playerId: playerId,
      gameDate: gameDate
    })
  }