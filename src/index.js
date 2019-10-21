import games from './apis/games';

games.get('/games')
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });

//   getGames = async () => {
//     const response = await games.get('/games') 
//          console.log(response);
//   };

//   getGames();