var query    = (function(){ /*
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
FILTER regex(?kmtekst, "brøk", "i")
FILTER (lang(?kmtekst) = "")
FILTER (lang(?laereplantittel) = "") .
?lareplan u:status ?status .
FILTER regex(?status, "publisert", "i")
} ORDER BY ?laereplan ?kmkode
*/}).toString().split('\n').slice(1, -1).join('\n');    
console.log(query);

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
    var html = "";
    var bindings = data.results.bindings;
    for(var i = 0; i< bindings.length; i++)
    {
        html += presentLaereplanmaal(bindings[i]);
    }
    #("body").html(html);
});

