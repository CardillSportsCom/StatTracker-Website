function Initialize(){
    $.ajax({
        url: 'https://api-cardillsports-st.herokuapp.com/league',
        type: 'GET',
        dataType: 'json',
        success: function(data){
            var HTMLString = "";
            for(var i = 0; i< data.leagues.length; i ++){
                HTMLString += "<tr><td><span class='leagueName'>" + data.leagues[i].name +"</span><input type='hidden' class='leagueId' value='" + data.leagues[i]._id +"'/></td></tr>";
            }
            $("#leagueTable").find('tbody').html(HTMLString);
            $(".leagueName").on("click", function(){
                GetLeagueScores($(this).siblings('.leagueId').val());
            });
        },
        error: function(xhr, status, error) {
            alert(error);
        }

    });
}
function GetLeagueScores(leagueId){
        $.ajax({
        url: 'https://api-cardillsports-st.herokuapp.com/stat/score/' + leagueId,
        type: 'GET',
        dataType: 'json',
        success: function(data){
            var HTMLString = "";
            var GameDateDropdownString = "";
            HTMLString += "<div class='row' style='margin-top:10px; margin-bottom:10px'><div class=col-md-12'><label for='selectGameDate'>Pick a Game Date: </label><select class='selectGameDate' style='margin-left:10px;'><option disabled selected>-- Select Ball Run Date -- </option>{0}</select></div></div>";
            for(var i = 0; i< data.gameDays.length;i++){
                HTMLString += "<div class='row gameDate' id='"+ data.gameDays[i].gameDate +"' style='display:none'><div class='col-md-12'>";
                GameDateDropdownString += "<option value="+ data.gameDays[i].gameDate + ">" + data.gameDays[i].gameDate + "</option>";
                HTMLString +="<h3>Player Total Stats for: " + data.gameDays[i].gameDate + "</h3>"
                var count = 1;
                HTMLString +="<table class='table-striped table-bordered table-hover gameDateTotalStats' style='background:white'>";
                HTMLString +="<thead><tr><th data-sortable='true'>Player</th><th data-sortable='true'>Wins</th><th data-sortable='true'>GP</th><th data-sortable='true'>Points</th><th data-sortable='true'>FG%</th><th data-sortable='true'>Assists</th><th data-sortable='true'>Rebounds</th><th data-sortable='true'>Steals</th><th data-sortable='true'>Blocks</th><th data-sortable='true'>Turnovers</th></tr></thead><tbody>"
                for(var m = 0; m<data.gameDays[i].gameDayStatTotals.length; m++){
                    var player = data.gameDays[i].gameDayStatTotals[m];
                    HTMLString +="<tr>" + "<td>" + player.player.firstName +  "</td>" +"<td>" + player.playerTotalStats.gamesWon +  "</td>" +"<td>" + player.playerTotalStats.gamesPlayed +  "</td>" +"<td>" + player.playerTotalStats.FGM +  "</td>" +"<td>" +player.playerTotalStats.FGM + "/" +player.playerTotalStats.FGA +" ("+ (100*player.playerTotalStats.FGM/player.playerTotalStats.FGA).toFixed(0) + "%)" +  "</td>" +"<td>" + player.playerTotalStats.assists +  "</td>" +"<td>" + player.playerTotalStats.rebounds +  "</td>" +"<td>" + player.playerTotalStats.steals +  "</td>" +"<td>" + player.playerTotalStats.blocks +  "</td>" +"<td>" + player.playerTotalStats.turnovers +  "</td>" +"</tr>";
                }
                HTMLString += "</tbody></table>"

                HTMLString += "<h3>See the box score for each game here. Select the Game you want to see.</h3>"
                HTMLString += "<select class='selectGameDay'>";
                for(var j = 0; j< data.gameDays[i].games.length; j++){
                    HTMLString += "<option class='gameDay' value='"+ data.gameDays[i].games[j]._id +"'>Game " + count + ": " + data.gameDays[i].games[j].teamAScore + "-" + data.gameDays[i].games[j].teamBScore  +"</option>";
                    count ++;
                }
                HTMLString += "</select><button class='btn-u btn-primary btn boxScoreButton'>Get Box Score</button>";
                HTMLString += "<div class='gameDateBoxScore'></div></div></div>";
            }
            HTMLString = HTMLString.replace("{0}", GameDateDropdownString);
            $("#scores").html(HTMLString);
            $("#scores").show();
            $(".boxScoreButton").on('click', function(){
                GetBoxScore(this);

            });
            $(".selectGameDate").on('change', function(){
                var GameDate = $(".selectGameDate").val();
                $(".gameDate").hide();
                $("#" + GameDate).show();
                $("#"+GameDate).find(".gameDateTotalStats").bootstrapTable();
            });
        },
        error: function(xhr, status, error) {
            alert(error);
        }

    });
}

function GetBoxScore(boxScoreButton){
    var gameId = $(boxScoreButton).siblings('.selectGameDay').val();
        $.ajax({
        url: 'https://api-cardillsports-st.herokuapp.com/stat/game/' + gameId,
        type: 'GET',
        dataType: 'json',
        success: function(data){
            var HTMLString = "";
            for(var i=0; i< data.gameStats.length; i++){
                HTMLString += "<table class='table-striped table-bordered table-hover gameDateTotalStats' style='background:white'>";
                HTMLString +="<thead><tr><th data-sortable='true'>"+ data.gameStats[i].teamName +" Player</th><th data-sortable='true'>Points</th><th data-sortable='true'>FG%</th><th data-sortable='true'>Assists</th><th data-sortable='true'>Rebounds</th><th data-sortable='true'>Steals</th><th data-sortable='true'>Blocks</th><th data-sortable='true'>Turnovers</th></tr></thead><tbody>"
                for(var m = 0; m<data.gameStats[i].playerStats.length; m++){
                    var player = data.gameStats[i].playerStats[m];
                    HTMLString +="<tr>" + "<td>" + player.player.firstName +  "</td>" +"<td>" + player.FGM +  "</td>" +"<td>" +player.FGM + "/" +player.FGA +" ("+ (100*player.FGM/player.FGA).toFixed(0) + "%)" +  "</td>" +"<td>" + player.assists +  "</td>" +"<td>" + player.rebounds +  "</td>" +"<td>" + player.steals +  "</td>" +"<td>" + player.blocks +  "</td>" +"<td>" + player.turnovers +  "</td>" +"</tr>";
                }
                HTMLString += "</table>";

            }
            $(boxScoreButton).siblings(".gameDateBoxScore").html(HTMLString);
            $(boxScoreButton).siblings(".gameDateBoxScore").find(".gameDateTotalStats").bootstrapTable();
        },
        error: function(xhr, status, error) {
            alert(error);
        }
    });
}