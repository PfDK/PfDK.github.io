$(document).ready(function(){
    displayLoadingIcon();

    hentLaereplan("MAT1-04", "Andre", function(data) {
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


