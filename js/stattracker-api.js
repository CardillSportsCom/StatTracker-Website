function Initialize(){
    $.ajax({
        url: 'http://api-cardillsports-st.herokuapp.com/league',
        type: 'GET',
        dataType: 'json',
        success: function(data){
            var HTMLString = "";
            for(var i = 0; i< data.leagues.length; i ++){
                HTMLString += "<tr><td>" + data.leagues[i].name +"</td></tr>";
            }
            $("#leagueTable").find('tbody').html(HTMLString);

        },
        error: function(data){
            alert("couldn't get leagues");
        }

    })
}