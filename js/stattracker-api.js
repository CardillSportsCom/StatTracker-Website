function Initialize(){
    // Initialize the default app
    var config = {
        apiKey: "AIzaSyAAUgiXi7aKEgdxFG1JzxAC6z5lQU0GoN4",
        authDomain: "stat-tracker-1537117819639.firebaseapp.com",
        databaseURL: "https://stat-tracker-1537117819639.firebaseio.com",
        projectId: "stat-tracker-1537117819639",
        storageBucket: "stat-tracker-1537117819639.appspot.com",
        messagingSenderId: "41770019498"
      };
      firebase.initializeApp(config);
      var ui = new firebaseui.auth.AuthUI(firebase.auth())
ui.start('#firebaseui-auth-container', {
    signInOptions: [
      // List of OAuth providers supported.
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      firebase.auth.TwitterAuthProvider.PROVIDER_ID,
      firebase.auth.GithubAuthProvider.PROVIDER_ID
    ],
    // Other config options...
  });
  var uiConfig = {
    callbacks: {
      signInSuccessWithAuthResult: function(authResult, redirectUrl) {
        // User successfully signed in.
        // Return type determines whether we continue the redirect automatically
        // or whether we leave that to developer to handle.
        Login(authResult.user._lat);
        return false;
      },
      uiShown: function() {
        // The widget is rendered.
        // Hide the loader.
        document.getElementById('loader').style.display = 'none';
      }
    },
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: 'popup',
    signInSuccessUrl: '<url-to-redirect-to-on-success>',
    signInOptions: [
      // Leave the lines as is for the providers you want to offer your users.
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    //   firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    //   firebase.auth.EmailAuthProvider.PROVIDER_ID,

    ],
    // Terms of service url.
    tosUrl: '<your-tos-url>',
    // Privacy policy url.
    privacyPolicyUrl: '<your-privacy-policy-url>'
  };
  ui.start('#firebaseui-auth-container', uiConfig);

    // $.ajax({
    //     url: 'https://api-cardillsports-st.herokuapp.com/league',
    //     type: 'GET',
    //     dataType: 'json',
    //     success: function(data){
    //         var HTMLString = "";
    //         for(var i = 0; i< data.leagues.length; i ++){
    //             HTMLString += "<tr><td><span class='leagueName'>" + data.leagues[i].name +"</span><input type='hidden' class='leagueId' value='" + data.leagues[i]._id +"'/></td></tr>";
    //         }
    //         $("#leagueTable").find('tbody').html(HTMLString);
    //         $(".leagueName").on("click", function(){
    //             GetLeagueScores($(this).siblings('.leagueId').val());
    //             GetLeagueStats($(this).siblings('.leagueId').val());
    //         });
    //     },
    //     error: function(xhr, status, error) {
    //         alert(error);
    //     }

    // });
}
function Login(firebase_token){
    var sendData = {
        token: firebase_token
    }
    $.ajax({
        url: 'https://api-cardillsports-st.herokuapp.com/auth',
        type: 'POST',
        data: sendData,
        dataType: 'json',
        success: function(data){
            Cookies.set('token', data.id_token, {expires: 1});
            Cookies.set('playerId', data.player._id, {expires: 1});
            GetPlayerData();

        },
        error: function(xhr, status, error) {
            alert(error);
        }

    });
}
function GetPlayerData(){
    var token = Cookies.get('token');
    $.ajax({
        url: 'https://api-cardillsports-st.herokuapp.com/player/leagues/' + Cookies.get('playerId'),
        type: 'GET',
        dataType: 'json',
        beforeSend: function (xhr) {   //Include the bearer token in header
            xhr.setRequestHeader("Authorization", token);
        },
        success: function(data){
            Cookies.set('leagueId', data.leagues[0].league._id, {expires: 1});
            GetLeagueStats();
            GetLeagueScores();
        },
        error: function(xhr, status, error) {
            alert(error);
        }
    });
}
function GetLeagueStats(){
    var token = Cookies.get('token');
    var leagueId = Cookies.get('leagueId');
        $.ajax({
        url: 'https://api-cardillsports-st.herokuapp.com/stat/league/' + leagueId,
        type: 'GET',
        beforeSend: function (xhr) {   //Include the bearer token in header
            xhr.setRequestHeader("Authorization", token);
        },
        dataType: 'json',
        success: function(data){
            var HTMLString = "";
            HTMLString += "<h2>Total Stats</h2>"
            HTMLString +="<table class='table-striped table-bordered table-hover playerTotalStats' data-search style='background:white'>";
            HTMLString +="<thead><tr><th data-sortable='true'>Player</th><th data-sortable='true'>Wins</th><th data-sortable='true'>GP</th><th data-sortable='true'>Points</th><th data-sortable='true'>FG%</th><th data-sortable='true'>Assists</th><th data-sortable='true'>Rebounds</th><th data-sortable='true'>Steals</th><th data-sortable='true'>Blocks</th><th data-sortable='true'>Turnovers</th></tr></thead><tbody>"
              
            for(var i =0; i< data.leagueStats.length; i++){
                var player = data.leagueStats[i];
                var fg = (100*player.playerTotalStats.FGM/player.playerTotalStats.FGA).toFixed(0);
                if(player.playerTotalStats.FGA == 0){
                    fg = 0;
                }
                HTMLString +="<tr>" + "<td>" + player.player.firstName +  "</td>" +"<td>" + player.playerTotalStats.gamesWon +  "</td>" +"<td>" + player.playerTotalStats.gamesPlayed +  "</td>" +"<td>" + player.playerTotalStats.FGM +  "</td>" +"<td>"+ fg + "% ("  +player.playerTotalStats.FGM + "/" +player.playerTotalStats.FGA +")" +  "</td>" +"<td>" + player.playerTotalStats.assists +  "</td>" +"<td>" + player.playerTotalStats.rebounds +  "</td>" +"<td>" + player.playerTotalStats.steals +  "</td>" +"<td>" + player.playerTotalStats.blocks +  "</td>" +"<td>" + player.playerTotalStats.turnovers +  "</td>" +"</tr>";
                
            }
            HTMLString += "</tbody></table>"            
            $("#stats").html(HTMLString);
            $("#stats").find(".playerTotalStats").bootstrapTable({search: true});
        },
        error: function(xhr, status, error) {
            alert(error);
        }

    });
}

function GetLeagueScores(){
    var token = Cookies.get('token');
    var leagueId = Cookies.get('leagueId');
        $.ajax({
        url: 'https://api-cardillsports-st.herokuapp.com/stat/score/' + leagueId,
        type: 'GET',
        beforeSend: function (xhr) {   //Include the bearer token in header
            xhr.setRequestHeader("Authorization", token);
        },
        dataType: 'json',
        success: function(data){
            var HTMLString = "";
            var GameDateDropdownString = "";
            HTMLString += "<div class='row' style='margin-top:10px; margin-bottom:10px'><div class=col-md-12'><label for='selectGameDate'>Pick a Game Date: </label><select class='selectGameDate' style='margin-left:10px;'><option disabled selected>-- Select Ball Run Date -- </option>{0}</select></div></div>";
            for(var i = 0; i< data.gameDays.length;i++){
                HTMLString += "<div class='row gameDate' id='"+ data.gameDays[i].gameDate.replace(/\//g,'') +"' style='display:none'><div class='col-md-12'>";
                GameDateDropdownString += "<option value="+ data.gameDays[i].gameDate.replace(/\//g,'')  + ">" + data.gameDays[i].gameDate.replace(/\//g,'')  + "</option>";
                HTMLString +="<h3>Player Total Stats for: " + data.gameDays[i].gameDate.replace(/\//g,'')  + "</h3>"
                var count = 1;
                HTMLString +="<table class='table-striped table-bordered table-hover gameDateTotalStats' style='background:white'>";
                HTMLString +="<thead><tr><th data-sortable='true'>Player</th><th data-sortable='true'>Wins</th><th data-sortable='true'>GP</th><th data-sortable='true'>Points</th><th data-sortable='true'>FG%</th><th data-sortable='true'>Assists</th><th data-sortable='true'>Rebounds</th><th data-sortable='true'>Steals</th><th data-sortable='true'>Blocks</th><th data-sortable='true'>Turnovers</th></tr></thead><tbody>"
                for(var m = 0; m<data.gameDays[i].gameDayStatTotals.length; m++){
                    var player = data.gameDays[i].gameDayStatTotals[m];
                    var fg = (100*player.playerTotalStats.FGM/player.playerTotalStats.FGA).toFixed(0);
                    if(player.playerTotalStats.FGA == 0){
                        fg = 0;
                    }
                    HTMLString +="<tr>" + "<td>" + player.player.firstName +  "</td>" +"<td>" + player.playerTotalStats.gamesWon +  "</td>" +"<td>" + player.playerTotalStats.gamesPlayed +  "</td>" +"<td>" + player.playerTotalStats.FGM +  "</td>" +"<td>"+ fg + "% ("  +player.playerTotalStats.FGM + "/" +player.playerTotalStats.FGA +")" +  "</td>" +"<td>" + player.playerTotalStats.assists +  "</td>" +"<td>" + player.playerTotalStats.rebounds +  "</td>" +"<td>" + player.playerTotalStats.steals +  "</td>" +"<td>" + player.playerTotalStats.blocks +  "</td>" +"<td>" + player.playerTotalStats.turnovers +  "</td>" +"</tr>";
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
            $(".leagueStats").show();
            $("#scores").show();
            $("#stats").hide();
            $("#scoresTab").addClass('active');
            $("#statsTab").removeClass('active');
            $(".boxScoreButton").on('click', function(){
                GetBoxScore(this);

            });
            $(".selectGameDate").on('change', function(){
                var GameDate = $(".selectGameDate").val();
                $(".gameDate").hide();
                $("#" + GameDate).show();
                $("#"+GameDate).find(".gameDateTotalStats").bootstrapTable({search: true});
            });
            $("#statsTab").on("click", function(){
                $("#scores").hide();
                $("#stats").show();
                $("#statsTab").addClass('active');
                $("#scoresTab").removeClass('active');
                
                
            });
            $("#scoresTab").on("click", function(){
                $("#stats").hide();
                $("#scores").show();
                $("#scoresTab").addClass('active');
                $("#statsTab").removeClass('active');
            });
        },
        error: function(xhr, status, error) {
            alert(error);
        }

    });
}

function GetBoxScore(boxScoreButton){
    var token = Cookies.get('token');

    var gameId = $(boxScoreButton).siblings('.selectGameDay').val();
        $.ajax({
        url: 'https://api-cardillsports-st.herokuapp.com/stat/game/' + gameId,
        type: 'GET',
        beforeSend: function (xhr) {   //Include the bearer token in header
            xhr.setRequestHeader("Authorization", token);
        },
        dataType: 'json',
        success: function(data){
            var HTMLString = "";
            for(var i=0; i< data.gameStats.length; i++){
                HTMLString += "<table class='table-striped table-bordered table-hover gameDateTotalStats' style='background:white'>";
                HTMLString +="<thead><tr><th data-sortable='true'>"+ data.gameStats[i].teamName +" Player</th><th data-sortable='true'>Points</th><th data-sortable='true'>FG%</th><th data-sortable='true'>Assists</th><th data-sortable='true'>Rebounds</th><th data-sortable='true'>Steals</th><th data-sortable='true'>Blocks</th><th data-sortable='true'>Turnovers</th></tr></thead><tbody>"
                for(var m = 0; m<data.gameStats[i].playerStats.length; m++){
                    var player = data.gameStats[i].playerStats[m];
                    var fg=(100*player.FGM/player.FGA).toFixed(0);
                    if(player.FGA == 0){
                        fg = 0;
                    }
                    HTMLString +="<tr>" + "<td>" + player.player.firstName +  "</td>" +"<td>" + player.FGM +  "</td>" +"<td>" + fg  + "% ("+player.FGM + "/" +player.FGA+ ")" +  "</td>" +"<td>" + player.assists +  "</td>" +"<td>" + player.rebounds +  "</td>" +"<td>" + player.steals +  "</td>" +"<td>" + player.blocks +  "</td>" +"<td>" + player.turnovers +  "</td>" +"</tr>";
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