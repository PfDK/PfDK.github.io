//var actionScript = "https://script.google.com/macros/s/AKfycbxW1qHugD1K4adTjGAEt1KqbcbAn1LlaCoWx6GtlNdsNO_E-rTO/exec";
//https://www.sitepoint.com/get-url-parameters-with-javascript/
//http://plnkr.co/edit/AZIi1gFuq1Vdt06VIETn?p=preview
var params = getAllUrlParams(window.location.href);
var actionScript = params.scriptUrl;
var hide = false;
if (params.hide != null)
{
	hide = true;
}

var words = [];

$(document).ready(function(){
	var wordcloudInput = $('#wordcloudInput');
	if (wordcloudInput !=  null) {
		printWordcloudInput(wordcloudInput);
	}
    var sendButton = $("#send");
    if(sendButton != null)
    {
		sendButton.click(handleSend);
    }

	var wordcloud = $('#wordcloud');
	if (wordcloud !=  null) {
		if(hide)
		{
			wordcloud.hide();
		}
		else
		{
			getWordcloudWords();
		}
	}
});

// Send a resize message to the parent.
//https://gist.github.com/pbojinov/8965299
function sendResizeMessageToParent()
{
	var obj = { "Sender":"pfdkautoresize", "Height":document.body.scrollHeight};
 	var myJSON = JSON.stringify(obj);
	window.parent.postMessage(myJSON, '*');
};

$(window).resize(function() {
	sendResizeMessageToParent();
});

function printWordcloud()
{
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


//https://github.com/jasondavies/d3-cloud/pull/128
//http://thenewcode.com/744/Make-SVG-Responsive

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



function getWordcloudWords()
{
	words = [];
    displayLoadingIcon();

	$.ajax({
		url: actionScript,
		dataType: 'json',
		cache: false,

		beforeSend: function () {
			console.log("Loading");
		},

		error: function (jqXHR, textStatus, errorThrown) {
			console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);
		},

		success: function (result) {
			console.log('result.result');
			var data = JSON.parse(result.data);
			console.log(data);

			data.sort(function(item1, item2){
				if (item1.text < item2.text)
				  return -1;
				if ( item1.text > item2.text)
				  return 1;
				return 0;
			});
			var size = 1;
			var previousWord = "";
			var word = "";
			if(data.length)
			{
			  previousWord = data[0]["text"];
			  word = previousWord;
			}
			for(var i = 1; i< data.length; i++)
			{
				var word = data[i]["text"];
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
		
			words.sort(function(item1, item2){
				if (item1.size < item2.size)
				  return -1;
				if ( item1.size > item2.size)
				  return 1;
				return 0;
			});
			printWordcloud();
			sendResizeMessageToParent();
		},

		complete: function () {
			console.log('Finished all tasks');
		}
	});
}


function printWordcloudInput(wordcloudInput)
{
   html = '<input id="name" type="text" size="50" data-role="tagsinput"></input>';
   html +=' <button id="send" class="button-success">Send</button>';

   wordcloudInput.html(html);
}

function getAllUrlParams(url) {

  // get query string from url (optional) or window
  var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

  // we'll store the parameters here
  var obj = {};

  // if query string exists
  if (queryString) {

    // stuff after # is not part of query string, so get rid of it
    queryString = queryString.split('#')[0];

    // split our query string into its component parts
    var arr = queryString.split('&');

    for (var i=0; i<arr.length; i++) {
      // separate the keys and the values
      var a = arr[i].split('=');

      // in case params look like: list[]=thing1&list[]=thing2
      var paramNum = undefined;
      var paramName = a[0].replace(/\[\d*\]/, function(v) {
        paramNum = v.slice(1,-1);
        return '';
      });

      // set parameter value (use 'true' if empty)
      var paramValue = typeof(a[1])==='undefined' ? true : a[1];


      // if parameter name already exists
      if (obj[paramName]) {
        // convert value to array (if still string)
        if (typeof obj[paramName] === 'string') {
          obj[paramName] = [obj[paramName]];
        }
        // if no array index number specified...
        if (typeof paramNum === 'undefined') {
          // put the value on the end of the array
          obj[paramName].push(paramValue);
        }
        // if array index number specified...
        else {
          // put the value at that index number
          obj[paramName][paramNum] = paramValue;
        }
      }
      // if param name doesn't exist yet, set it
      else {
        obj[paramName] = paramValue;
      }
    }
  }

  return obj;
}

function displayLoadingIcon()
{
  $("#wordcloud").html('<img width="30" src="loading.gif"/>');
}

function handleSend(event) { 
  displayLoadingIcon();
  var data = $("#name").val();
  var data2 =   encodeURIComponent( data );
  console.log(data2);
  var postData = "name="+data2;
  console.log(postData);

	request = $.ajax({
		url: actionScript,
		type: "post",
		data: postData,

		beforeSend: function () {
			console.log("Loading");
		},

		error: function (jqXHR, textStatus, errorThrown) {
			console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);
		},

		success: function (result) {
			console.log("success");
			$("#wordcloud").show();
			getWordcloudWords();
		},

		complete: function () {
			console.log('Finished all tasks');
		}
	});
}

