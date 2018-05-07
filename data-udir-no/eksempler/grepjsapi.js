//Vi lager et navnerom for Grep APIet slik at det ikke er så stor sannsynlighet for
//at noen bruker samme variabel- og funksjonsnavn som oss.
var GrepAPI = (function() {

    //For å teste kan dette flagget settes til true. Da brukes et par testlæreplaner definert nederst i javascript filen.
    var offline = false;

    var ignoreWords = "og, fra, for, av, å, på, etter, med, gjennom, noen, til, i, om";

    return {
        getIgnorerOrd : function ()
        {
            return ignoreWords;
        },

        addIgnorerOrd : function (s)
        {
            ignoreWords += ",";
            ignoreWords += s;
        },

        hentLaereplan : function (kode, trinn, callback)
        {
            var query = getLaereplanQueryForKodeOgTrinn(kode, trinn)
    
            sparqlQuery(query, function(data){
                callback(data);
            }); 
        },

        isFunction : function (possibleFunction) {
          return typeof(possibleFunction) === typeof(Function);
        },

        //Hent læreplanene for oppgitte læreplankoder og trinn.
        //Kall callback funksjonen når resultatet er klart.
        //Dersom updateStatusCallback er definert, kaller vi den
        //underveis. Dersom man har mange læreplaner som skal hentes ut
        //er det lurt å bruke updateStatusCallback.
        getLps : function (lpKoder, trinn, callback, updateStatusCallback)
        {
            var updateStatus = 0;
            if(this.isFunction(updateStatusCallback)) { 
                updateStatus = updateStatusCallback;
            }
            else
            {
                updateStatus = function (){return;}
            }
    
            var lps = [];

            //Hvis vi er offline bruker vi læreplanene definert nederst i javascriptet.
            //Foreløpig ligger det bare et part stykker der slik at vi kan teste at det virker.
            if(offline)
            {
                var noOfLp = lpKoder.length;
                for (var i = 0; i < lpKoder.length; i++) 
                {
                    var lpKode = lpKoder[i];
                    var lpObject = {lpKode: lpKode, lp: offlineLp[lpKode]};

                    lps.push(lpObject);
                }
                callback(lps);
            }
            else
            {
                var asyncsDone = 0;
                var noOfLp = lpKoder.length;
                var s = ".";
                updateStatus(s);
                for (var i = 0; i < lpKoder.length; i++) 
                {
                    var lpKode = lpKoder[i];
                    var query = this.getLaereplanQueryForKodeOgTrinn(lpKode, trinn);
                    this.sparqlQuery(
                        query, 
                        (function(i) {
                            return function(data) {
                                var lpObject = {lpKode: lpKoder[i], lp: data};
                                lps.push(lpObject);

                                s += ".";
                                updateStatus(s);
                        
                                asyncsDone ++;

                                if(asyncsDone === noOfLp) {
                                    callback(lps);
                                }
                            };
                        }(i)) // calling the function with the current value
                    ); //
                } //end for lpKoder
            } //endif offline
        },

        //Send SparqlQuery til Grep serveren og kall den spesifiserte
        //callback funksjonen når resultatet er klart.
        sparqlQuery : function (query, callback)
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
        },

        //Lag en sparqlquery for en læreplan for et trinn.
        getLaereplanQueryForKodeOgTrinn : function (kode, trinn)
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
        FILTER (lang(?kmtittel) = 'nob')
 
        ?km r:har-kompetansemaal ?kms .
 
        }
        ORDER BY ?lp ?trinnorder ?kms ?km
        */}).toString().split('\n').slice(1, -1).join('\n');	

            var queryA = queryTemplate.replace("{{kode}}", kode);
            var query = queryA.replace("{{trinn}}", trinn);

            console.log(query);
            return query;
        },

        //Konverter map til array.
        getKompetanseMaalWordsInArray : function (wordMap)
        {
            var words = [];
    
            Object.keys(wordMap).forEach(function(key) {
                value = wordMap[key];
                words.push(value);
            });
            return words;
        },

        //Lag et array over ordene i de tilstendte læreplanene der ordene bare er med en gang
        //og size settes til antall ganger et ord er med i de spesifiserte læreplanene.
        //Ignorer ord som er i ignoreWords listen som sendes inn.
        getKompetanseMaalWords : function (lps, ignoreWords)
        {
            var kmWordsArray = [];
            for(var j = 0; j < lps.length; j++)
            {
                var bindings = lps[j].lp.results.bindings;
                for(var i = 0; i < bindings.length; i++)
                {
                    var ord = [];
                    //Trim fjerner mellomrom i begynnelsen og slutten av setningen. Det ser
                    //nemlig ut til at det er noen ekstra mellomrom her og der i kompetansemålene.
                    var km = bindings[i].kmtittel.value; 
                    var kmt = km.trim(); 
                    var kmWords = kmt.split(" ");
            
                    var cleanWordArray = this.getCleanWordArray(kmWords, ignoreWords);
            
                    var uniqueWordArray = this.getUniqueWords(cleanWordArray);
                    for(var k = 0; k < uniqueWordArray.length; k++)
                    {
                        var w = uniqueWordArray[k].text;
                        var kmWord = kmWordsArray[w];
                        if(!kmWord)
                        {
                            kmWord = kmWordsArray[w] = uniqueWordArray[k];
                            kmWord.lps = [];
                        }
                        else
                        {
                            kmWord.size += uniqueWordArray[k].size;
                        }                
                
                        var kmLp = kmWord.lps[lps[j].lpKode];
                        if(!kmLp)
                        {
                            var lpObject = {lpKode:lps[j].lpKode, bindings: []};
                            kmLp = kmWord.lps[lps[j].lpKode] = lpObject;
                        }

                        if(!kmLp)
                        {
                            console.log("kmLp er ikke definert.");
                        }
                        kmLp.bindings.push(bindings[i]);
                    }
                }
            }
            return kmWordsArray;
        },

        //Returner et array med ord der alle tegn som ikke er 0-9 og a-å er fjernet
        //og returnern bare ord som ikke er med i ignoreWords listen.
        getCleanWordArray : function (kmWords, ignoreWords)
        {
            var kmWordsArray = [];
            for(var j = 0; j< kmWords.length; j++)
            {
                var ord = kmWords[j].toLowerCase().replace(/[^a-zA-Z0-9æøåÆØÅ]/g,'')
                if(!ignoreWords.includes(ord))
                {
                    kmWordsArray.push(ord);
                }
            }
            return kmWordsArray;
        },

        //Returner et array med ord der ordene bare er med en gang og size er 
        //satt til antall ganger ordet finnes i det innsendte arrayet.
        getUniqueWords : function (kmWordsArray)
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
        },

        sortWordObjectsBySize : function (words)
        {
            words.sort(function(item1, item2){
                if (item1.size < item2.size)
                  return -1;
                if ( item1.size > item2.size)
                  return 1;
                return 0;
            });
            return words;
        },
        sortWordObjectsBySizeDescending : function (words)
        {
            words.sort(function(item1, item2){
                if (item1.size > item2.size)
                  return -1;
                if ( item1.size < item2.size)
                  return 1;
                return 0;
            });
            return words;
        },

        GetKmWordsForWordCloud : function (kmWordsArray)
        {
            var words = getUniqueWords(kmWordsArray);
            words = this.sortWordObjectsBySize(words);
            return words;
        },

        //Skriv de angitte ordene i en tabell i elementet med id elementId.
        printWords : function (elementId,words)
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
        },

        //Print ordene words som wordcloud i element med id=elementId
        printWordCloud : function (elementId, words)
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
    }
    
    //Hvis man ikke har nett...
    var offlineLp = [];
    offlineLp["NOR1-05"] =
    { "head": { "link": [], "vars": ["lp", "lptittel", "trinn", "km", "kmtittel"] },
      "results": { "distinct": false, "ordered": true, "bindings": [
        { "lp": { "type": "uri", "value": "http://psi.udir.no/kl06/NOR1-05" }	, "lptittel": { "type": "literal", "value": "L\u00E6replan i norsk" }	, "trinn": { "type": "literal", "value": "Andre \u00E5rstrinn" }	, "km": { "type": "uri", "value": "http://psi.udir.no/kl06/K8361" }	, "kmtittel": { "type": "literal", "value": "fortelle sammenhengende om opplevelser og erfaringer" }},
        { "lp": { "type": "uri", "value": "http://psi.udir.no/kl06/NOR1-05" }	, "lptittel": { "type": "literal", "value": "L\u00E6replan i norsk" }	, "trinn": { "type": "literal", "value": "Andre \u00E5rstrinn" }	, "km": { "type": "uri", "value": "http://psi.udir.no/kl06/K8365" }	, "kmtittel": { "type": "literal", "value": "vise forst\u00E5else for sammenhengen mellom spr\u00E5klyd og bokstav og mellom talespr\u00E5k og skriftspr\u00E5k " }},
        { "lp": { "type": "uri", "value": "http://psi.udir.no/kl06/NOR1-05" }	, "lptittel": { "type": "literal", "value": "L\u00E6replan i norsk" }	, "trinn": { "type": "literal", "value": "Andre \u00E5rstrinn" }	, "km": { "type": "uri", "value": "http://psi.udir.no/kl06/K8367" }	, "kmtittel": { "type": "literal", "value": "lese store og sm\u00E5 trykte bokstaver" }},
        { "lp": { "type": "uri", "value": "http://psi.udir.no/kl06/NOR1-05" }	, "lptittel": { "type": "literal", "value": "L\u00E6replan i norsk" }	, "trinn": { "type": "literal", "value": "Andre \u00E5rstrinn" }	, "km": { "type": "uri", "value": "http://psi.udir.no/kl06/K8370" }	, "kmtittel": { "type": "literal", "value": "bruke egne kunnskaper og erfaringer for \u00E5 forst\u00E5 og kommentere innholdet i leste tekster" }},
        { "lp": { "type": "uri", "value": "http://psi.udir.no/kl06/NOR1-05" }	, "lptittel": { "type": "literal", "value": "L\u00E6replan i norsk" }	, "trinn": { "type": "literal", "value": "Andre \u00E5rstrinn" }	, "km": { "type": "uri", "value": "http://psi.udir.no/kl06/K15391" }	, "kmtittel": { "type": "literal", "value": "lytte, ta ordet etter tur og gi respons til andre i samtaler" }},
        { "lp": { "type": "uri", "value": "http://psi.udir.no/kl06/NOR1-05" }	, "lptittel": { "type": "literal", "value": "L\u00E6replan i norsk" }	, "trinn": { "type": "literal", "value": "Andre \u00E5rstrinn" }	, "km": { "type": "uri", "value": "http://psi.udir.no/kl06/K15392" }	, "kmtittel": { "type": "literal", "value": "lytte til tekster p\u00E5 bokm\u00E5l og nynorsk og samtale om dem" }},
        { "lp": { "type": "uri", "value": "http://psi.udir.no/kl06/NOR1-05" }	, "lptittel": { "type": "literal", "value": "L\u00E6replan i norsk" }	, "trinn": { "type": "literal", "value": "Andre \u00E5rstrinn" }	, "km": { "type": "uri", "value": "http://psi.udir.no/kl06/K15393" }	, "kmtittel": { "type": "literal", "value": "lytte etter, forst\u00E5, gjengi og kombinere informasjon" }},
        { "lp": { "type": "uri", "value": "http://psi.udir.no/kl06/NOR1-05" }	, "lptittel": { "type": "literal", "value": "L\u00E6replan i norsk" }	, "trinn": { "type": "literal", "value": "Andre \u00E5rstrinn" }	, "km": { "type": "uri", "value": "http://psi.udir.no/kl06/K15394" }	, "kmtittel": { "type": "literal", "value": "leke, improvisere og eksperimentere med rim, rytme, spr\u00E5klyder, stavelser, meningsb\u00E6rende elementer og ord" }},
        { "lp": { "type": "uri", "value": "http://psi.udir.no/kl06/NOR1-05" }	, "lptittel": { "type": "literal", "value": "L\u00E6replan i norsk" }	, "trinn": { "type": "literal", "value": "Andre \u00E5rstrinn" }	, "km": { "type": "uri", "value": "http://psi.udir.no/kl06/K15395" }	, "kmtittel": { "type": "literal", "value": "samtale om hvordan valg av ord, stemmebruk og intonasjon skaper mening" }},
        { "lp": { "type": "uri", "value": "http://psi.udir.no/kl06/NOR1-05" }	, "lptittel": { "type": "literal", "value": "L\u00E6replan i norsk" }	, "trinn": { "type": "literal", "value": "Andre \u00E5rstrinn" }	, "km": { "type": "uri", "value": "http://psi.udir.no/kl06/K15396" }	, "kmtittel": { "type": "literal", "value": "sette ord p\u00E5 egne f\u00F8lelser og meninger" }},
        { "lp": { "type": "uri", "value": "http://psi.udir.no/kl06/NOR1-05" }	, "lptittel": { "type": "literal", "value": "L\u00E6replan i norsk" }	, "trinn": { "type": "literal", "value": "Andre \u00E5rstrinn" }	, "km": { "type": "uri", "value": "http://psi.udir.no/kl06/K15397" }	, "kmtittel": { "type": "literal", "value": "uttrykke egne tekstopplevelser gjennom ord, tegning, sang og andre estetiske uttrykk" }},
        { "lp": { "type": "uri", "value": "http://psi.udir.no/kl06/NOR1-05" }	, "lptittel": { "type": "literal", "value": "L\u00E6replan i norsk" }	, "trinn": { "type": "literal", "value": "Andre \u00E5rstrinn" }	, "km": { "type": "uri", "value": "http://psi.udir.no/kl06/K15398" }	, "kmtittel": { "type": "literal", "value": "trekke lyder sammen til ord" }},
        { "lp": { "type": "uri", "value": "http://psi.udir.no/kl06/NOR1-05" }	, "lptittel": { "type": "literal", "value": "L\u00E6replan i norsk" }	, "trinn": { "type": "literal", "value": "Andre \u00E5rstrinn" }	, "km": { "type": "uri", "value": "http://psi.udir.no/kl06/K15399" }	, "kmtittel": { "type": "literal", "value": "lese enkle tekster med sammenheng og forst\u00E5else p\u00E5 papir og skjerm" }},
        { "lp": { "type": "uri", "value": "http://psi.udir.no/kl06/NOR1-05" }	, "lptittel": { "type": "literal", "value": "L\u00E6replan i norsk" }	, "trinn": { "type": "literal", "value": "Andre \u00E5rstrinn" }	, "km": { "type": "uri", "value": "http://psi.udir.no/kl06/K15400" }	, "kmtittel": { "type": "literal", "value": "skrive setninger med store og sm\u00E5 bokstaver og punktum i egen h\u00E5ndskrift og p\u00E5 tastatur" }},
        { "lp": { "type": "uri", "value": "http://psi.udir.no/kl06/NOR1-05" }	, "lptittel": { "type": "literal", "value": "L\u00E6replan i norsk" }	, "trinn": { "type": "literal", "value": "Andre \u00E5rstrinn" }	, "km": { "type": "uri", "value": "http://psi.udir.no/kl06/K15401" }	, "kmtittel": { "type": "literal", "value": "skrive enkle beskrivende og fortellende tekster" }},
        { "lp": { "type": "uri", "value": "http://psi.udir.no/kl06/NOR1-05" }	, "lptittel": { "type": "literal", "value": "L\u00E6replan i norsk" }	, "trinn": { "type": "literal", "value": "Andre \u00E5rstrinn" }	, "km": { "type": "uri", "value": "http://psi.udir.no/kl06/K15402" }	, "kmtittel": { "type": "literal", "value": "arbeide kreativt med tegning og skriving i forbindelse med lesing" }},
        { "lp": { "type": "uri", "value": "http://psi.udir.no/kl06/NOR1-05" }	, "lptittel": { "type": "literal", "value": "L\u00E6replan i norsk" }	, "trinn": { "type": "literal", "value": "Andre \u00E5rstrinn" }	, "km": { "type": "uri", "value": "http://psi.udir.no/kl06/K15403" }	, "kmtittel": { "type": "literal", "value": "skrive etter m\u00F8nster av enkle eksempeltekster og ut fra andre kilder for skriving" }},
        { "lp": { "type": "uri", "value": "http://psi.udir.no/kl06/NOR1-05" }	, "lptittel": { "type": "literal", "value": "L\u00E6replan i norsk" }	, "trinn": { "type": "literal", "value": "Andre \u00E5rstrinn" }	, "km": { "type": "uri", "value": "http://psi.udir.no/kl06/K15404" }	, "kmtittel": { "type": "literal", "value": "samtale om opphavet til og betydningen av noen kjente ordtak, begreper og faste uttrykk" }},
        { "lp": { "type": "uri", "value": "http://psi.udir.no/kl06/NOR1-05" }	, "lptittel": { "type": "literal", "value": "L\u00E6replan i norsk" }	, "trinn": { "type": "literal", "value": "Andre \u00E5rstrinn" }	, "km": { "type": "uri", "value": "http://psi.udir.no/kl06/K15405" }	, "kmtittel": { "type": "literal", "value": "samtale om begrepene dialekt, bokm\u00E5l og nynorsk" }},
        { "lp": { "type": "uri", "value": "http://psi.udir.no/kl06/NOR1-05" }	, "lptittel": { "type": "literal", "value": "L\u00E6replan i norsk" }	, "trinn": { "type": "literal", "value": "Andre \u00E5rstrinn" }	, "km": { "type": "uri", "value": "http://psi.udir.no/kl06/K15406" }	, "kmtittel": { "type": "literal", "value": "samtale om hvordan ord og bilde virker sammen i bildeb\u00F8ker og andre bildemedier" }},
        { "lp": { "type": "uri", "value": "http://psi.udir.no/kl06/NOR1-05" }	, "lptittel": { "type": "literal", "value": "L\u00E6replan i norsk" }	, "trinn": { "type": "literal", "value": "Andre \u00E5rstrinn" }	, "km": { "type": "uri", "value": "http://psi.udir.no/kl06/K15407" }	, "kmtittel": { "type": "literal", "value": "samtale om innhold og form i eldre og nyere sanger, regler og dikt" }},
        { "lp": { "type": "uri", "value": "http://psi.udir.no/kl06/NOR1-05" }	, "lptittel": { "type": "literal", "value": "L\u00E6replan i norsk" }	, "trinn": { "type": "literal", "value": "Andre \u00E5rstrinn" }	, "km": { "type": "uri", "value": "http://psi.udir.no/kl06/K15408" }	, "kmtittel": { "type": "literal", "value": "samtale om personer og handling i eventyr og fortellinger" }},
        { "lp": { "type": "uri", "value": "http://psi.udir.no/kl06/NOR1-05" }	, "lptittel": { "type": "literal", "value": "L\u00E6replan i norsk" }	, "trinn": { "type": "literal", "value": "Andre \u00E5rstrinn" }	, "km": { "type": "uri", "value": "http://psi.udir.no/kl06/K15409" }	, "kmtittel": { "type": "literal", "value": "finne skj\u00F8nnlitteratur og sakprosa p\u00E5 biblioteket til egen lesing" }} ] } }
    ;
    
    offlineLp["ENG1-03"] =
    { "head": { "link": [], "vars": ["lp", "lptittel", "trinn", "km", "kmtittel"] },
      "results": { "distinct": false, "ordered": true, "bindings": [
        { "lp": { "type": "uri", "value": "http://psi.udir.no/kl06/ENG1-03" }	, "lptittel": { "type": "literal", "value": "L\u00E6replan i engelsk" }	, "trinn": { "type": "literal", "value": "Andre \u00E5rstrinn" }	, "km": { "type": "uri", "value": "http://psi.udir.no/kl06/K14783" }	, "kmtittel": { "type": "literal", "value": "gi eksempler p\u00E5 noen situasjoner der det kan v\u00E6re nyttig \u00E5 kunne engelsk" }},
        { "lp": { "type": "uri", "value": "http://psi.udir.no/kl06/ENG1-03" }	, "lptittel": { "type": "literal", "value": "L\u00E6replan i engelsk" }	, "trinn": { "type": "literal", "value": "Andre \u00E5rstrinn" }	, "km": { "type": "uri", "value": "http://psi.udir.no/kl06/K14784" }	, "kmtittel": { "type": "literal", "value": "finne ord og uttrykk som er felles for engelsk og eget morsm\u00E5l" }},
        { "lp": { "type": "uri", "value": "http://psi.udir.no/kl06/ENG1-03" }	, "lptittel": { "type": "literal", "value": "L\u00E6replan i engelsk" }	, "trinn": { "type": "literal", "value": "Andre \u00E5rstrinn" }	, "km": { "type": "uri", "value": "http://psi.udir.no/kl06/K14785" }	, "kmtittel": { "type": "literal", "value": "bruke digitale ressurser i opplevelse av spr\u00E5ket" }},
        { "lp": { "type": "uri", "value": "http://psi.udir.no/kl06/ENG1-03" }	, "lptittel": { "type": "literal", "value": "L\u00E6replan i engelsk" }	, "trinn": { "type": "literal", "value": "Andre \u00E5rstrinn" }	, "km": { "type": "uri", "value": "http://psi.udir.no/kl06/K14786" }	, "kmtittel": { "type": "literal", "value": "lytte etter og bruke engelske spr\u00E5klyder gjennom praktisk-estetiske uttrykksm\u00E5ter" }},
        { "lp": { "type": "uri", "value": "http://psi.udir.no/kl06/ENG1-03" }	, "lptittel": { "type": "literal", "value": "L\u00E6replan i engelsk" }	, "trinn": { "type": "literal", "value": "Andre \u00E5rstrinn" }	, "km": { "type": "uri", "value": "http://psi.udir.no/kl06/K14787" }	, "kmtittel": { "type": "literal", "value": "lytte til og forst\u00E5 enkle instruksjoner p\u00E5 engelsk" }},
        { "lp": { "type": "uri", "value": "http://psi.udir.no/kl06/ENG1-03" }	, "lptittel": { "type": "literal", "value": "L\u00E6replan i engelsk" }	, "trinn": { "type": "literal", "value": "Andre \u00E5rstrinn" }	, "km": { "type": "uri", "value": "http://psi.udir.no/kl06/K14788" }	, "kmtittel": { "type": "literal", "value": "lytte til og forst\u00E5 ord og uttrykk i engelskspr\u00E5klige rim, regler, sanger, eventyr og fortellinger" }},
        { "lp": { "type": "uri", "value": "http://psi.udir.no/kl06/ENG1-03" }	, "lptittel": { "type": "literal", "value": "L\u00E6replan i engelsk" }	, "trinn": { "type": "literal", "value": "Andre \u00E5rstrinn" }	, "km": { "type": "uri", "value": "http://psi.udir.no/kl06/K14789" }	, "kmtittel": { "type": "literal", "value": "forst\u00E5 og bruke noen engelske ord, uttrykk og setningsm\u00F8nstre knyttet til n\u00E6re omgivelser og egne interesser" }},
        { "lp": { "type": "uri", "value": "http://psi.udir.no/kl06/ENG1-03" }	, "lptittel": { "type": "literal", "value": "L\u00E6replan i engelsk" }	, "trinn": { "type": "literal", "value": "Andre \u00E5rstrinn" }	, "km": { "type": "uri", "value": "http://psi.udir.no/kl06/K14790" }	, "kmtittel": { "type": "literal", "value": "hilse, stille og svare p\u00E5 enkle sp\u00F8rsm\u00E5l og bruke noen h\u00F8flighetsuttrykk" }},
        { "lp": { "type": "uri", "value": "http://psi.udir.no/kl06/ENG1-03" }	, "lptittel": { "type": "literal", "value": "L\u00E6replan i engelsk" }	, "trinn": { "type": "literal", "value": "Andre \u00E5rstrinn" }	, "km": { "type": "uri", "value": "http://psi.udir.no/kl06/K14791" }	, "kmtittel": { "type": "literal", "value": "delta i enkle inn\u00F8vde dialoger og spontane samtaler knyttet til n\u00E6re omgivelser og egne opplevelser " }},
        { "lp": { "type": "uri", "value": "http://psi.udir.no/kl06/ENG1-03" }	, "lptittel": { "type": "literal", "value": "L\u00E6replan i engelsk" }	, "trinn": { "type": "literal", "value": "Andre \u00E5rstrinn" }	, "km": { "type": "uri", "value": "http://psi.udir.no/kl06/K14792" }	, "kmtittel": { "type": "literal", "value": "bruke tall i samtale om n\u00E6re omgivelser og egne opplevelser" }},
        { "lp": { "type": "uri", "value": "http://psi.udir.no/kl06/ENG1-03" }	, "lptittel": { "type": "literal", "value": "L\u00E6replan i engelsk" }	, "trinn": { "type": "literal", "value": "Andre \u00E5rstrinn" }	, "km": { "type": "uri", "value": "http://psi.udir.no/kl06/K14793" }	, "kmtittel": { "type": "literal", "value": "kjenne igjen sammenhengen mellom noen engelske spr\u00E5klyder og stavem\u00F8nstre" }},
        { "lp": { "type": "uri", "value": "http://psi.udir.no/kl06/ENG1-03" }	, "lptittel": { "type": "literal", "value": "L\u00E6replan i engelsk" }	, "trinn": { "type": "literal", "value": "Andre \u00E5rstrinn" }	, "km": { "type": "uri", "value": "http://psi.udir.no/kl06/K14794" }	, "kmtittel": { "type": "literal", "value": "eksperimentere med \u00E5 lese og skrive engelske ord, uttrykk og enkle setninger knyttet til n\u00E6re omgivelser og egne interesser" }},
        { "lp": { "type": "uri", "value": "http://psi.udir.no/kl06/ENG1-03" }	, "lptittel": { "type": "literal", "value": "L\u00E6replan i engelsk" }	, "trinn": { "type": "literal", "value": "Andre \u00E5rstrinn" }	, "km": { "type": "uri", "value": "http://psi.udir.no/kl06/K14795" }	, "kmtittel": { "type": "literal", "value": "samtale om sider ved barns dagligliv i engelskspr\u00E5klige land" }},
        { "lp": { "type": "uri", "value": "http://psi.udir.no/kl06/ENG1-03" }	, "lptittel": { "type": "literal", "value": "L\u00E6replan i engelsk" }	, "trinn": { "type": "literal", "value": "Andre \u00E5rstrinn" }	, "km": { "type": "uri", "value": "http://psi.udir.no/kl06/K14796" }	, "kmtittel": { "type": "literal", "value": "ta del i og oppleve barnekultur fra engelskspr\u00E5klige land gjennom \u00E5 bruke ord, bilder, musikk og bevegelse" }},
        { "lp": { "type": "uri", "value": "http://psi.udir.no/kl06/ENG1-03" }	, "lptittel": { "type": "literal", "value": "L\u00E6replan i engelsk" }	, "trinn": { "type": "literal", "value": "Andre \u00E5rstrinn" }	, "km": { "type": "uri", "value": "http://psi.udir.no/kl06/K14797" }	, "kmtittel": { "type": "literal", "value": "gi uttrykk for egne opplevelser av engelskspr\u00E5klige rim, regler, sanger, eventyr og fortellinger" }} ] } };
    
})();    