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
            for(var i = 0; i< data.gameDays.length;i++){
                HTMLString += "<h1>" + data.gameDays[i].gameDate + "</h1>";
                    var count = 1;                
                for(var j = 0; j< data.gameDays[i].games.length; j++){
                    HTMLString += "<button class='btn-u btn btn-primary gameDay'id='"+ data.gameDays[i].games[j]._id +"'>Game " + count + ": " + data.gameDays[i].games[j].teamAScore + "-" + data.gameDays[i].games[j].teamBScore  +"</button>";
                    count ++;
                }
            }
            $("#scores").html(HTMLString);
            $("#scores").show();
            $(".gameDay").on('click', function(){

            });
        },
        error: function(xhr, status, error) {
            alert(error);
        }

    });
}