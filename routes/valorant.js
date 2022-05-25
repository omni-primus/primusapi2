//Router Handler
const express = require('express');
const router = express.Router();
const fetch = require("node-fetch");

//Request URL -> Extern Data for testing (Riot API link goes here when access is granted)
let api = "";
let requestURL = 'https://eu.api.riotgames.com/val/content/v1/contents?locale=de-DE&api_key='+api;
let requestURL2;

//Name of Player you want to know the rank
let PlayerName;

//get the Act ID from Content API
function getActId(callback){
    fetch(requestURL).then (function(response) {

        //Check for response error
        if (response.status !== 200){
            console.log('Looks like there was a problem. Status Code: '+ response.status);
            return;
        }
        let actId;

        //return the Act ID
        response.json().then(function(data){
            actId = data.acts[data.acts.length-2].id;
            return callback(actId);
        });
    });
}

//get the rank of a player via the Act ID
function getRank(callback){

    //get Act ID
    getActId(function(actData){
        requestURL2 = 'https://eu.api.riotgames.com/val/ranked/v1/leaderboards/by-act/'+actData+'?size=200&startIndex=0&api_key='+api;

        //execute API request
        fetch(requestURL2).then (function(response) {

            //check for response error
            if (response.status !== 200){
                console.log('Can´t access VALORANT Ranked API. Error Code: '+ response.status);
                return;
            }

            //filter rank and the rating out of the response json and return the result async
            response.json().then(function(data){
                var rank = [];
                for (var i = 0; i < data.players.length; i++) {
                    if (data.players[i].gameName == PlayerName){
                        rank.push(data.players[i].leaderboardRank);
                        rank.push(data.players[i].rankedRating);
                    }
                }
                return callback(rank);
            });
        });
    });
}

//Handle get requests
router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Forgot the player name.'
    });
  });

//Handle username requests
router.get('/:UserN', (req, res, next) => {
    PlayerName = req.params.UserN;

    //Execute rank function to get rank of requested user
    getRank(function(rankedData){
        
        //check for playernames that I allow people to search for
        if (PlayerName === 'omniprimus' || PlayerName === 'Fl4mezzZ' || PlayerName === 'BUTCHERKnqdewL') {

            //check if response array is empty
            if (rankedData.length !== 0) {

                //rank output
                res.status(200).json({
                    Player: PlayerName,
                    Rank: rankedData[0],
                    RankedRating: rankedData[1]
                });
            }
            //Player is not in Top 200
            else {
                res.status(200).json({
                    message: 'Player is not listed'
                });
            }
        }
        //Player is not in my list
        else {
            res.status(200).json({
                message: 'This streamer/player is not supported'
            })
        }
    });
});

module.exports = router