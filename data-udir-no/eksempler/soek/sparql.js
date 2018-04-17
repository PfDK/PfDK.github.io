//Denne javascriptfilen gjør SparQL spørringer mot læreplanene.
//Den ble laget på inspirasjon fra lenkene nedenfor.

//Gjør endringer i SpqrQL queriet nedenfor
//Bruk f.ex. {{sokeOrd}} og bruk replace i Javascript til å bytte ut med variabler.
function getSparQLquery(sokeOrd)
{
    var queryTemplate	= (function(){ /*
prefix u: <http://psi.udir.no/ontologi/kl06/> 
prefix r: <http://psi.udir.no/ontologi/kl06/reversert/>
prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
SELECT ?kmkode ?kmtekst ?laereplantittel ?lareplan ?laereplan WHERE {
?kompetansemaal rdf:type u:kompetansemaal ;
u:tittel ?kmtekst ;
u:kode ?kmkode ;
r:har-kompetansemaal ?kms .
?kms r:har-kompetansemaalsett ?lareplan .
?lareplan u:tittel ?laereplantittel ;
u:kode ?laereplan .
FILTER regex(?kmtekst, "{{sokeOrd}}", "i")
FILTER (lang(?kmtekst) = "")
FILTER (lang(?laereplantittel) = "") .
?lareplan u:status ?status .
FILTER regex(?status, "publisert", "i")
} ORDER BY ?laereplan ?kmkode
*/}).toString().split('\n').slice(1, -1).join('\n');	
	
	query = queryTemplate.replace("{{sokeOrd}}", sokeOrd);
	return query;
}

// Denne funksjonen knytter "Søk" knappen til sparqlQuery funksjonen
$(document).ready(function(){
	$("#sok").click(function() {
	  sparqlQuery();
	});
  $('#sokeOrd').keypress(function(event){
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode == '13'){
            sparqlQuery();
        }
    });
});

function sparqlQuery()
{
  var sokeOrd = $("#sokeOrd").val();
	if(sokeOrd == "")
	{
		updateResultDiv("<b>Vær vennlig å skrive inn et ord eller en setning du vil søke etter.</b>");
		return;
	}
	var baseURL="https://data.udir.no/kl06/sparql";
	var	format="application/json";
	var debug="on";
	var timeout="0"
	//i den originale spørringen hentet ?laereplan psi-adressen til læreplanen
	//den har jeg byttet navn til ?lareplan
	//så har jeg skutt inn en ny linje som henter læreplankoden, og
	//kalt den ?laereplan. Slik blir det lettere å trikse med URL-en i href nedenfor
	var query = getSparQLquery(sokeOrd);

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

	updateResultDiv('<img src="https://pfdk.github.io/data-udir-no/eksempler/loading.gif"/>');

	$.getJSON(queryURL,{}, function(data) {
	 present(data);
	});
}
function updateResultDiv(html)
{
	$("#resultat").html(html);	
}
function presentLaereplan(binding)
{
	//Her har jeg satt inn http://www.udir.no/kl06/ foran læreplankoden som jeg har har kalt ?laereplan i spørringen.
  var s = "<tr><td><a target=top href='http://www.udir.no/kl06/" + binding.laereplan.value + "'>" + binding.kmkode.value + ":" + binding.laereplantittel.value + "</a></td>";
  console.log(s);
  return s;
}
function presentLaereplanmaal(binding)
{
  var s ="<td>" + binding.kmtekst.value + "</td></tr>";
  console.log(s);
  return s;
}

function present(data)
{
	var bindings = data.results.bindings;
	bindings.sort(function(item1, item2){
		var value1 = item1.kmkode.value;
		var value2 = item2.kmkode.value;
		if (value1 < value2)
		  return -1;
		if ( value1 > value2)
		  return 1;
		return 0;
	});
	var html = "<table><tr><th>Læreplan</th><th>Kompetansemål</th></tr>";
	var previousLaereplan = "";
	var laereplan = "";

	for(var i = 0; i< bindings.length; i++)
	{
		laereplan = bindings[i].kmkode.value;
		console.log(laereplan);
		html += "<tr>";
		if(previousLaereplan != laereplan)
		{
			console.log(laereplan + "!=" + previousLaereplan);
		    html += presentLaereplan(bindings[i]);
			previousLaereplan = laereplan;
		}
		else
		{
			html += "<td></td>";
		}
		html += presentLaereplanmaal(bindings[i]);
	}
	html += "</table>";
	updateResultDiv(html);	
}

//Finn mer inspirasjon her
//http://grepwiki.udir.no/index.php?title=SPARQL-sp%C3%B8rringer#Teksts.C3.B8k_i_kompetansem.C3.A5l_for_.C3.A5_finne_l.C3.A6replan
//https://www.openlinksw.com/blog/~kidehen/index.vspx?page=&id=1653
//https://stackoverflow.com/questions/7163639/how-to-use-json-output-from-external-sparql-request-directly-from-browser
//http://biohackathon.org/d3sparql/
//https://stackoverflow.com/questions/15298091/d3-sparql-how-to-query-sparql-endpoints-directly-from-d3js
