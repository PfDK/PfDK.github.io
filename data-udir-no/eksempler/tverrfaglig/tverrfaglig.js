/*
Hva har ulike fag til felles? Kan vi finne tverrfaglige tema ved å se hvilke ord som er felles? 
I denne javascriptfilen implementerer jeg følgende algoritme.
1.Hent ut kompetansemålene for de valgte fagene.
2.Splitt ordene i kompetansemålene og legg de i lister per læreplan med pekere til faget og kompetansemålet ordet finnes i.
3. Løp gjennom ordene i en av listene og undersøk om ordene finnes i alle de andre listene også. Dersom det gjør det, legg ordet til i en ny liste med pekere til fagene og kompetansemålene ordet finnes i.
4. Skriv ut alle ordene i den nye listen sammen med fagene og kompetansemålene de finnes i.
*/


$(document).ready(function(){
    displayLoadingIcon();
    
    $("#info").html(printIgnoredWords());

    var koder = ["NOR1-05", "ENG1-03"];

    //Hent ut ordene i læreplanene
    getLps(koder, function(lps){
        var kmWords = getKompetanseMaalWords(lps);
        printTverrfaglighet(lps, kmWords);
    });
});


function printTverrfaglighet(lps, kmWords)
{
    var words = [];
    Object.keys(kmWords).forEach(function(key) {
        value = kmWords[key];
        if(Object.keys(value.lps).length == lps.length)
        {
            words.push(value);
        }
    });


    printTverrfagligeOrd(words);
    printWordCloud("wordcloud", words);
    
    $("#status").html("");

}

function myOutput(html)
{
    var e = $("#ordtabell");
    e.append(html);
}
function printBindings(bindings, ord)
{
    var html = "<td>";
    for(var i = 0; i< b.length; i++)
    {
        var s = "<b>" + ord + "</b>";
        var merkOrd = bindings[i].kmtittel.value.replace(ord, s);
        html += merkOrd + "<br/>";
    }
    html += "</td>";
    return html;
}

function printTverrfagligeOrd(words)
{
    if(words.length == 0)
    {
        $("#status").html("<h1>Fant ingen felles ord</h1>");
        return;
    }
    for(var i = 0; i < words.length; i++)
    {
        html = "<table><tr><th>" + words[i].text + "</th></tr><tr>;
        Object.keys(words[i].lps).forEach(function(key) {
            value = words[i].lps[key];  
            html += printBindings(value.bindings, word);
        });
        html += "</tr>";
        html += "</table>";
    }
    return html;

    for(var i = 0; i< words.length; i++)
    {
        var ord =  words[i].text;
        var frekvens = words[i].size;
        var html = printTableForWord(ord, words);
        myOutput(html);
    }
}

function displayLoadingIcon()
{
  $("#status").html('<img width="30" src="../loading.gif"/>');
}


