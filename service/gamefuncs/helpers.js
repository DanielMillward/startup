function findGameFromArray(gameArray, gameName) {
    for (let i = 0; i < gameArray.length; i++) {
        if (gameArray[i].gameName === gameName) {
          return gameArray[i];
        }
      }
      return undefined;
}

module.exports = {
    findGameFromArray
}