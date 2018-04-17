/*
Hva har ulike fag til felles? Kan vi finne tverrfaglige tema ved å se hvilke ord som er felles? 
I denne javascriptfilen implementerer jeg følgende algoritme.
1.Hent ut kompetansemålene for de valgte fagene.
2.Splitt ordene i kompetansemålene og legg de i lister per læreplan med pekere til faget og kompetansemålet ordet finnes i.
3. Løp gjennom ordene i en av listene og undersøk om ordene finnes i alle de andre listene også. Dersom det gjør det, legg ordet til i en ny liste med pekere til fagene og kompetansemålene ordet finnes i.
4. Skriv ut alle ordene i den nye listen sammen med fagene og kompetansemålene de finnes i.
*/



var engelskBindings = [];
var norskBindings = [];


var wordsEngelsk = [];
var wordsNorsk = [];

$(document).ready(function(){
    displayLoadingIcon();

    var queryEngelsk = getLaereplanQueryForKodeOgTrinn("ENG1-03", "Andre")
    var queryNorsk = getLaereplanQueryForKodeOgTrinn("NOR1-05", "Andre")

    var ignoreWords=["og", "fra", "for", "av", "å", "på", "etter", "med"];
	
    //Hent ut ordene i den engelske læreplanen
    sparqlQuery(queryEngelsk, function(data){
        engelskBindings = data;
        var km = parseKompetanseMaal(engelskBindings);
        wordsEngelsk = getKompetanseMaalWords(km, ignoreWords);
        wordsEngelsk.sort();

        //Hent ut ordene i den "norske" læreplanen
        sparqlQuery(queryNorsk, function(data){
            norskBindings = data;
            var km = parseKompetanseMaal(norskBindings);
            wordsNorsk = getKompetanseMaalWords(km,ignoreWords);
            wordsNorsk.sort();
            
            finnTverrfaglighet()
        });
    });
});

function finnTverrfaglighet()
{
    var words = [];
    for(var i = 0; i< wordsEngelsk.length; i++)
    {
        var w = wordsEngelsk[i];
        if(wordsNorsk.includes(w))
        {
            words.push(w);
        }
    }
    wordsForOrdsky = GetWordsForWordCloud(words);
    printTverrfagligeOrd(wordsForOrdsky);
    printWordCloud("wordcloud", wordsForOrdsky);
    
    $("#status").html("");

}

function myOutput(html)
{
    var e = $("#ordtabell");
    e.append(html);
}
function printBindings(b, ord)
{
    var e = $("#ordtabell");
    var html = "<td>";
    for(var i = 0; i< b.length; i++)
    {
        var s = "<b>" + ord + "</b>";
        var merkOrd = b[i].kmtittel.value.replace(ord, s);
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

    for(var i = 0; i< words.length; i++)
    {
        var html = "";
        var ord =  words[i].text;
        var frekvens = words[i].size;
        var eE = findBindingsForWord(engelskBindings.results.bindings, ord);
        var eN = findBindingsForWord(norskBindings.results.bindings, ord);
        html += ("<h2>" + words[i].text + "</h2>");
        html +=("<table><tr><th>Engelsk</th><th>Norsk</th></tr><tr>");
        html += printBindings(eE, ord);
        html += printBindings(eN, ord);
        html += "</tr>";
        html += "</table>";
        myOutput(html);
    }
}

function displayLoadingIcon()
{
  $("#status").html('<img width="30" src="../loading.gif"/>');
}


