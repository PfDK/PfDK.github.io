function sparqlQuery(query, callback)
{
	var baseURL="https://data.udir.no/kl06/sparql";
	var	format="application/json";
	var debug="on";
	var timeout="0"

	var params={
		"query": query,
		"debug": debug, 
		"timeout": timeout, 
		"format": format
	};

	var querypart="";
	for(var k in params) {
		querypart+=k+"="+encodeURIComponent(params[k])+"&";
	}
	var queryURL=baseURL + '?' + querypart;

	$.getJSON(queryURL,{}, function(data) {
	 callback(data);
	});
}

function getLaereplanQueryForKodeOgTrinn(kode, trinn)
{
    var queryTemplate	= (function(){ /*
PREFIX u: <http://psi.udir.no/ontologi/kl06/>
PREFIX g: <http://psi.udir.no/kl06/>
PREFIX r: <http://psi.udir.no/ontologi/kl06/reversert/>
PREFIX d: <http://data.udir.no/ontologi/kl06>
 
SELECT DISTINCT ?lp ?lptittel ?trinn ?km ?kmtittel
WHERE {
{
g:{{kode}} u:uri ?lp ;
u:tittel ?lptittel ;
u:har-kompetansemaalsett ?kompetansemaalsett .
FILTER (lang(?lptittel) = '')
}
 
?kompetansemaalsett u:har-etter-aarstrinn ?aarstrinn ;
u:har-kompetansemaal ?km .
 
{
?aarstrinn u:rekkefoelge ?trinnorder ;
u:tittel ?trinn .
FILTER regex(?trinn, "{{trinn}}", "i")
FILTER (lang(?trinn) = '')
}
?km u:tittel ?kmtittel .
FILTER (lang(?kmtittel) = '')
 
?km r:har-kompetansemaal ?kms .
 
}
ORDER BY ?lp ?trinnorder ?kms ?km
*/}).toString().split('\n').slice(1, -1).join('\n');	

    var queryA = queryTemplate.replace("{{kode}}", kode);
    var query = queryA.replace("{{trinn}}", trinn);

    console.log(query);
    return query;
}

function parseKompetanseMaal(data)
{
    var km = [];
	var bindings = data.results.bindings;
	for(var i = 0; i< bindings.length; i++)
	{
		var kmtittel = bindings[i].kmtittel.value;
		km.push(kmtittel);
	}
	return km;
}
function getKompetanseMaalWords(kmArray, ignoreWords)
{
    var kmWordsArray = [];
	for(var i = 0; i< kmArray.length; i++)
	{
	    //Trim fjerner mellomrom i begynnelsen og slutten av setningen. Det ser
	    //nemlig ut til at det er noen ekstra mellomrom her og der i kompetansemålene.
	    var km = kmArray[i].trim(); 
        var kmWords = km.split(" ");
        for(var j = 0; j< kmWords.length; j++)
        {
            var ord = kmWords[j].replace(/[^a-åA-Å0-9]/g,'')
            if(!ignoreWords.includes(ord))
            {
                kmWordsArray.push(ord);
            }
        }
	}
    return kmWordsArray;
}

function findBindingsForWord(allBindings, w)
{
    var bindings = [];

    for(var i = 0; i< allBindings.length; i++)
    {
        var kmWords = allBindings[i].kmtittel.value.trim().split(" ");
        if(kmWords.includes(w))
        {
            bindings.push(allBindings[i]);
        }
    }
    return bindings;
}

function GetUniqueWords(kmWordsArray)
{   
    var words = [];
    if(!kmWordsArray.length)
    {
        return words;
    }
    

    var size = 1;
    var previousWord = "";
    var word = "";

    previousWord = kmWordsArray[0];
    word = previousWord;

    for(var i = 1; i< kmWordsArray.length; i++)
    {
        var word = kmWordsArray[i];
        if(previousWord != word)
        {
            var wordObject = {text: previousWord, size: size};
            words.push(wordObject);
            previousWord = word;
            size = 1;
        }
        else
        {
            size = size + 1;
        }
    }
    var wordObject = {text: word, size: size};
    words.push(wordObject);
    return words;
}

function GetWordsForWordCloud(kmWordsArray)
{
    var words = GetUniqueWords(kmWordsArray);
    
    words.sort(function(item1, item2){
        if (item1.size < item2.size)
          return -1;
        if ( item1.size > item2.size)
          return 1;
        return 0;
    });
    return words;
}

function printWords(elementId,words)
{
	var e = $('#' + elementId);
	if (e ==  null) {
	    return;
	}
    var html = "<table><tr><th>Ord</th><th>Antall</th></tr>";
    for(var i = 1; i< words.length; i++)
    {
        html += "<td>" + words[i].text + "</td><td>" + words[i].size + "</td></tr>";
    }
    html += "</table>";
    e.html(html);
}

//Print ordene words som wordcloud i element med id=elementId
function printWordCloud(elementId, words)
{
	var wordcloud = $('#' + elementId);
	if (wordcloud ==  null) {
	    return;
	}
	$("#wordcloud").html("");
    var startDomain;
    var stopDomain;
    if (words.length) {
  	  startDomain = words[0].size;
	  stopDomain = words[words.length - 1].size;
    }	
    var calculateFontSize = d3.scale.linear()
		.domain([startDomain, stopDomain])
		.range([10, 100]);

	var fill = d3.scale.category20();

	var layout = d3.layout.cloud()
		.size([500, 500])
		.words(words)
		.padding(5)
		.rotate(function() { return 0; })
		.font("Impact")
		.fontSize(function(d) { return calculateFontSize(d.size); })
		.on("end", draw);

	layout.start();

	function draw(words) {

	  d3.select("#wordcloud").append("svg")
		  .attr('viewBox', '0 0 ' + layout.size()[0] + ' ' + layout.size()[1])
		  .attr('class','svg-content')
		  .append("g")
		  .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
		  .selectAll("text")
		  .data(words)
		  .enter().append("text")
		  .style("font-size", function(d) { return d.size + "px"; })
		  .style("font-family", "Impact")
		  .style("fill", function(d, i) { return fill(i); })
		  .attr("text-anchor", "middle")
		  .attr("transform", function(d) {
			return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
		  })
		  .text(function(d) { return d.text; });
	}

}

