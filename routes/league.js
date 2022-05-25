const express = require('express');
const router = express.Router();

// Variables
var name;
var api = "RGAPI-8b2fc7a5-a718-465a-a90b-3844d8bd0033";
var requestURL;
var text;

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

//League Rank and Elo Function
function getELo(){  
    var request = new XMLHttpRequest();
    var request2 = new XMLHttpRequest();
    var id;
    var text1;
    var text2;

    request.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200){
            var daten = JSON.parse(this.responseText);
            id = daten.id;
            // console.log(id);

            request2.onreadystatechange = function(){
                if (this.readyState == 4 && this.status == 200){
                    var daten2 = JSON.parse(this.responseText);
                    for(var i= 0; i<daten2.length; i++){
                        if(daten2[i].queueType == "RANKED_SOLO_5x5"){
                            text1 = "SOLO/DUO: " + daten2[i].tier + " " + daten2[i].rank + " " + daten2[i].leaguePoints + "LP";
                            if(daten2[i].hasOwnProperty('miniSeries')){
                                var promo = daten2[i].miniSeries.progress;
                                for(var j = 0; j<promo.length; j++){
                                    promo = promo.replace("N", "-");
                                    promo = promo.replace("W", "✔");
                                    promo = promo.replace("L", "X");
                                }
                                text1 += " (Promo: " + promo + (")");
                            }
                        }
                        if(daten2[i].queueType == "RANKED_FLEX_SR"){
                            text2 = " | Flex: " + daten2[i].tier + " " + daten2[i].rank + " " + daten2[i].leaguePoints + "LP";  
                            if(daten2[i].hasOwnProperty('miniSeries')){
                                var promo = daten2[i].miniSeries.progress;
                                for(var j = 0; j<promo.length; j++){
                                  promo = promo.replace("N", "-");
                                  promo = promo.replace("W", "✔");
                                  promo = promo.replace("L", "X");
                                }
                                text2 += " (Promo: " + promo + (")");
                            }
                        }
                    }
                    // console.log("TEXT1: " + text1);
                    // console.log("TEXT2: " + text2);
                    if(text1 === undefined){
                        text1 = 'SOLO/DUO: unranked';
                    }
                    if(text2 === undefined){
                        text2 = ' | Flex: unranked';
                    }
                    text = text1 + text2;
                }
            };
            var requestURL2 = 'https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/'+id+'?api_key='+api;
            request2.open("GET", requestURL2, true);
            request2.send();
        }
    };
    request.open("GET", requestURL, true);
    request.send();
}

// API Routes

//Handle get requests for elo
router.get('/', (req, res, next) => {
  res.status(200).json({
      message: 'The Summoner Name is missing.'
  });
});

router.get('/:SummonerName', (req, res, next) => {
    let SName = req.params.SummonerName;
    name = SName;
    requestURL = 'https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/'+name+'?api_key='+api;
    getELo();
    setTimeout(function(){
        if (SName === 'omniprimus' || SName === 'Fl4mezzZ' || SName === 'BeaterZack'){
            res.status(200).json({
                message: text
            });
        } else {
            res.status(200).json({
                message: 'This streamer/player is not supported'
            })
        }
    }, 1200);
});

module.exports = router
