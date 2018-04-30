$(document).ready(function(){
    var visButton = $("#vis");
    if(visButton != null)
    {
		visButton.click(visLaereplan);
    }
    addIgnorerOrd("om");
    var ignorerOrd = getIgnorerOrd();
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

    getLps(koder, trinn, updateStatus, function(lps)
    {
        var wordMap = getKompetanseMaalWords(lps, ignorerOrd);
        var words = getKompetanseMaalWordsInArray(wordMap);
        words = sortWordObjectsBySize(words);

        if(!words.length)
        {
            updateStatus("Fant ingen ord.");
        }
        else
        {
            printWords("ordtabell",words);
            printWordCloud("wordcloud", words);
        }
    });
}

function updateStatus(s)
{
    $("#status").html(s);
}

function displayLoadingIcon()
{
  updateStatus('<img width="30" src="../loading.gif"/>');
}


