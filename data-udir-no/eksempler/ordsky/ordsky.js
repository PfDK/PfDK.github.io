$(document).ready(function(){
    var visButton = $("#vis");
    if(visButton != null)
    {
		visButton.click(visLaereplan);
    }
    GrepAPI.addIgnorerOrd("om");
    var ignorerOrd = GrepAPI.getIgnorerOrd();
    $("#ignorer").val(ignorerOrd);
});

function visLaereplan()
{
    displayLoadingIcon();

    var regex = new RegExp(" ","g");

    koder = [];
    koder.push($("#koder").val().trim().replace(regex,""));
    var ignorerOrd = $("#ignorer").val().trim().replace(regex,"").split(','); 
    var trinn = $('#trinn :selected').text();

    GrepAPI.getLps(koder, trinn, function(lps)
    {
        var wordMap = GrepAPI.getKompetanseMaalWords(lps, ignorerOrd);
        var words = GrepAPI.getKompetanseMaalWordsInArray(wordMap);
        words = GrepAPI.sortWordObjectsBySize(words);

        if(!words.length)
        {
            updateStatus("Fant ingen ord.");
        }
        else
        {
            GrepAPI.printWords("ordtabell",words);
            GrepAPI.printWordCloud("wordcloud", words);
        }
    }, updateStatus);
}

function updateStatus(s)
{
    $("#status").html(s);
}

function displayLoadingIcon()
{
  updateStatus('<img width="30" src="../loading.gif"/>');
}


