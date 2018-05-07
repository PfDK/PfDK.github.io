/*
Hva har ulike fag til felles? Kan vi finne tverrfaglige tema ved å se hvilke ord som er felles? 
I denne javascriptfilen implementerer jeg følgende algoritme.
1.Hent ut kompetansemålene for de valgte fagene.
2.Splitt ordene i kompetansemålene og legg de i lister per læreplan med pekere til faget og kompetansemålet ordet finnes i.
3. Løp gjennom ordene i en av listene og undersøk om ordene finnes i alle de andre listene også. Dersom det gjør det, legg ordet til i en ny liste med pekere til fagene og kompetansemålene ordet finnes i.
4. Skriv ut alle ordene i den nye listen sammen med fagene og kompetansemålene de finnes i.
*/

/*
Kan bruke kallet nedenfor hvis man skal lage en dropdown liste med fag i stedet for
at man må legge inn fagkodene manuelt.
Hent ut alle læreplaner på norsk bokmål med SparQL:
prefix u: <http://psi.udir.no/ontologi/kl06/> 
prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
SELECT  ?tittel ?kode WHERE {
?uri rdf:type u:laereplan ;
u:tittel ?tittel ;
u:url-data ?kode .
FILTER (lang(?tittel) = "nob")
} ORDER BY ?kode ?tittel


*/

//Når html-filen er åpnet hekter vi oss på sammenlignknappen og fyller inn hvilke ord
//som skal ignoreres.
$(document).ready(function(){
    var sammenlignButton = $("#sammenlign");
    if(sammenlignButton != null)
    {
		sammenlignButton.click(sammenlignLaereplaner);
    }
    var ignorerOrd = GrepAPI.getIgnorerOrd();
    $("#ignorer").val(ignorerOrd);
});


function sammenlignLaereplaner()
{
    $("#ordtabell").html("");
    $("#wordcloud").html("");
    
    //Hent ut hvilke ord som skal ignoreres samt hvilke læreplaner brukeren
    //vil vi skal finne tverrfaglighet for. Vi fjerner alle mellomrom og
    //deler opp i ord/fag der det er komma.
    var regex = new RegExp(" ","g");
    var koder = $("#koder").val().trim().replace(regex,"").split(',');
    var trinn = $('#trinn :selected').text();
    var ignorerOrd = $("#ignorer").val().trim().replace(regex,"").split(','); 

    //Henter ut læreplanene vi ber om.
    //Deretter får vi en liste over ordene i læreplanene uten de ignorerte ordene.
    //Til slutt skriver vi ut tverrfagligheten.
    GrepAPI.getLps(koder, trinn, function(lps){
        var kmWords = GrepAPI.getKompetanseMaalWords(lps, ignorerOrd);
        printTverrfaglighet(lps, kmWords);
    }, updateStatus);
}


function printTverrfaglighet(lps, kmWords)
{
    var words = [];
    
    //Løp gjennom alle ordene. 
    //Dersom ordet har lenker til alle læreplanene så tar vi vare på det.
    Object.keys(kmWords).forEach(function(key) {
        value = kmWords[key];
        var antallLpForOrd = Object.keys(value.lps).length;
        var antallLpSpesifisert = lps.length;
        if(antallLpForOrd == antallLpSpesifisert)
        {
            words.push(value);
        }
    });

    words = GrepAPI.sortWordObjectsBySizeDescending(words);

    //Skriv ut en liste over de tverrfaglige ordene
    var html = printTverrfagligeOrd(words);
    $("#ordtabell").html(html);
    
    //Før vi skriver ut ordene som ordsky, må de være sortert fra minst
    //til mest forekommende ord.
    words = GrepAPI.sortWordObjectsBySize(words);

    //Skriv ordene som ordsky i div med id wordcloud.
    GrepAPI.printWordCloud("wordcloud", words);
}

function myOutput(html)
{
    var e = $("#ordtabell");
    e.append(html);
}
function printBindings(bindings, key, ord)
{
    var html = "";
    for(var i = 0; i< bindings.length; i++)
    {
        html += "<tr><td width='10%'>" + key + "</td>";
        var s = "<b>" + ord + "</b>";
        var find = ord + "\\b";
        var regex = new RegExp(find,"g");
        var merkOrd = bindings[i].kmtittel.value.replace(regex, s);
        html += "<td>" + merkOrd + "</td>";
        html += "</tr>";
    }
    return html;
}

function printTverrfagligeOrd(words)
{
    if(words.length == 0)
    {
        updateStatus("<h1>Fant ingen felles ord</h1>");
        return;
    }
    var html = "";
    for(var i = 0; i < words.length; i++)
    {
        html += "<br/><table class='ord'><tr><th colspan='2'>" + words[i].text + ": " + words[i].size + "</th></tr>";
        //Skriv ut kompetansemålene som inneholder ordet, for hver læreplan.
        Object.keys(words[i].lps).forEach(function(key) {
            value = words[i].lps[key];  
            html += printBindings(value.bindings, key, words[i].text);
        });
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

function updateStatus(s)
{
    $("#status").html(s);
}



