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

    })
}
function GetLeagueScores(leagueId){
    alert(leagueId);
}