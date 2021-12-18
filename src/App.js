import React, { useEffect, useState } from "react";
import "./App.css";

// "first_name":"Alex","h_in":"77","h_meters":"1.96","last_name":"Acker"}
let playersByHeight = {};

//main function
function App() {
  const [inputSum, setInputValue] = useState();
  const [pairOfPlayers, setPairOfPlayers] = useState([]);

  const handleInputValue = (event) => {
    setInputValue(+event.target.value);
  };

  const getPlayersData = async () => {
    const apiURL = "https://mach-eight.uc.r.appspot.com/";

    try {
      const response = await fetch(apiURL);
      return await response.json();
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const initProcess = async () => {
    const players = await getPlayersData();

    // Check the data
    if (!players || !players.values || players.values.length === 0) return;

    groupPlayers(players.values);
    getPairs(players.values);
  };

  // Get all possible pairs
  const getPairs = (players) => {
    const tmpPairsOfPlayers = [];

    players.forEach((player) => {
      //Calculate the height pair
      const difHeight = inputSum - player.h_in;

      //check if that height was previously processed
      if (playersByHeight[player.h_in].checked) {
        return;
      }

      if (playersByHeight[difHeight]) {
        playersByHeight[difHeight].forEach((playerPair) => {
          debugger;
          // Check not to pair with the same
          if (
            !(
              player.first_name === playerPair.first_name &&
              player.last_name === playerPair.last_name
            )
          ) {
            tmpPairsOfPlayers.push(
              { player, playerPair }
              // `${player.first_name} ${player.last_name} ${player.h_in} - ${playerPair.first_name} ${playerPair.last_name} ${playerpair.h_in}`
            );
          }

          //mark as processed this height
          playersByHeight[difHeight].checked = true;
        });
      }
    });

    setPairOfPlayers(tmpPairsOfPlayers);
  };

  /** use the players and group by height */
  const groupPlayers = (players) => {
    playersByHeight = {};
    players.forEach((player) => {
      const playerHeight = player.h_in;

      // Create an index
      if (!playersByHeight[playerHeight]) {
        playersByHeight[playerHeight] = [player];

        // Create a flag to avoid duplicates
        Object.assign(playersByHeight[playerHeight], { checked: false });
      } else {
        playersByHeight[playerHeight].push(player);
      }
    });
  };

  return (
    <div className="panel">
      <label> Input value: </label> <br />
      <input
        type="number"
        id="inputsum"
        name="inputsum"
        value={inputSum}
        required
        size="15"
        onChange={handleInputValue}
      ></input>{" "}
      <input
        type="button"
        value="Process"
        onClick={() => initProcess()}
      ></input>{" "}
      <ul>
        {" "}
        {pairOfPlayers && pairOfPlayers.length > 0 ? (
          pairOfPlayers.map(({ player, playerPair }) => (
            <li>
              {" "}
              {player.first_name} {player.last_name} {player.h_in} -{" "}
              {playerPair.first_name} {playerPair.last_name} {playerPair.h_in}{" "}
            </li>
          ))
        ) : (
          <p> Not matches Found </p>
        )}{" "}
      </ul>{" "}
    </div>
  );
}

export default App;
