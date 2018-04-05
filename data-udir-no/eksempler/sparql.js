//Denne javascriptfilen gjør SparQL spørringer mot læreplanene.
//Den ble laget på inspirasjon fra lenkene nedenfor.

//http://grepwiki.udir.no/index.php?title=SPARQL-sp%C3%B8rringer#Teksts.C3.B8k_i_kompetansem.C3.A5l_for_.C3.A5_finne_l.C3.A6replan
//https://www.openlinksw.com/blog/~kidehen/index.vspx?page=&id=1653
//https://stackoverflow.com/questions/7163639/how-to-use-json-output-from-external-sparql-request-directly-from-browser
//http://biohackathon.org/d3sparql/
//https://stackoverflow.com/questions/15298091/d3-sparql-how-to-query-sparql-endpoints-directly-from-d3js

$(document).ready(function(){
	$("#sok").click(function() {
	  var sokeOrd = $("#sokeOrd").val();
	  sparqlQuery(sokeOrd);
	});
});

function updateResultDiv(html)
{
	$("#resultat").html(html);	
}
function sparqlQuery(sokeOrd)
{
	if(sokeOrd == "")
	{
		updateResultDiv("<b>Vær vennlig å skrive inn et ord eller en setning du vil søke etter.</b>");
		return;
	}
	var baseURL="https://data.udir.no/kl06/sparql";
	var	format="application/json";
	var debug="on";
	var timeout="0"

	var query='prefix u: <http://psi.udir.no/ontologi/kl06/> \
	prefix r: <http://psi.udir.no/ontologi/kl06/reversert/> \
	prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \
	SELECT ?kmkode ?kmtekst ?laereplantittel ?laereplan WHERE { \
	?kompetansemaal rdf:type u:kompetansemaal ;\
	u:tittel ?kmtekst ;\
	u:kode ?kmkode ;\
	r:har-kompetansemaal ?kms .\
	?kms r:har-kompetansemaalsett ?laereplan .\
	?laereplan u:tittel ?laereplantittel .';
	
	//i betyr at man ikke bryr seg om det er store eller små bokstaver.
	query += 'FILTER regex(?kmtekst, "' + sokeOrd + '", "i")';
	
	query += 'FILTER (lang(?kmtekst) = "")\
	FILTER (lang(?laereplantittel) = "") .\
	} ORDER BY ?laereplan ?kmkode';

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

	updateResultDiv('<img src="loading.gif"/>');

	$.getJSON(queryURL,{}, function(data) {
	 present(data);
	});
}

function presentLaereplan(binding)
{
  var s = "<h2><a href='" + binding.laereplan.value + "'>" + binding.kmkode.value + ":" + binding.laereplantittel.value + "</a></h2>";
  console.log(s);
  return s;
}
function presentLaereplanmaal(binding)
{
  var s ="<p>" + binding.kmtekst.value + "</p>";
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
	var html = "";
	var previousLaereplan = "";
	var laereplan = "";

	for(var i = 0; i< bindings.length; i++)
	{
		laereplan = bindings[i].kmkode.value;
		console.log(laereplan);
		if(previousLaereplan != laereplan)
		{
			console.log(laereplan + "!=" + previousLaereplan);
		    html += presentLaereplan(bindings[i]);
			previousLaereplan = laereplan;
		}
		html += presentLaereplanmaal(bindings[i]);
	}
	updateResultDiv(html);	
}
