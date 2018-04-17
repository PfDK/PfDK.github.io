$(document).ready(function(){
    displayLoadingIcon();

    var query = getLaereplanQueryForKodeOgTrinn("MAT1-04", "Andre")
	
    sparqlQuery(query, function(data){
    	var words = [];
        var km = parseKompetanseMaal(data);
        var kmWordsArray = getKompetanseMaalWords(km);
        kmWordsArray.sort();
        words = GetWordsForWordCloud(kmWordsArray)
        printWords("ordtabell",words);
        printWordCloud("wordcloud", words);
    });
});

function displayLoadingIcon()
{
  $("#wordcloud").html('<img width="30" src="loading.gif"/>');
}


