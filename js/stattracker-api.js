function Initialize(){
    $.ajax({
        url: 'https://api-cardillsports-st.herokuapp.com/league',
        type: 'GET',
        dataType: 'json',
        success: function(data){
            var HTMLString = "";
            for(var i = 0; i< data.leagues.length; i ++){
                HTMLString += "<tr><td>" + data.leagues[i].name +" <input type='hidden' class='leagueId' value='" + data.leagues[i]._id +"'/></td></tr>";
            }
            $("#leagueTable").find('tbody').html(HTMLString);

        },
        error: function(xhr, status, error) {
            alert(error);
        }

    })
}