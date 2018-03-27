//var actionScript = "https://script.google.com/macros/s/AKfycbxW1qHugD1K4adTjGAEt1KqbcbAn1LlaCoWx6GtlNdsNO_E-rTO/exec";
//https://www.sitepoint.com/get-url-parameters-with-javascript/
//http://plnkr.co/edit/AZIi1gFuq1Vdt06VIETn?p=preview
var actionScript = getAllUrlParams(window.location.href).scriptUrl;
var words = [];

$(document).ready(function(){
	var wordcloudInput = document.getElementById('wordcloudInput');
	if (wordcloudInput !=  null) {
		printWordcloudInput(wordcloudInput);
	}
    console.log("Contact form submission handler loaded successfully.");
    // bind to the submit event of our form
    var form = document.getElementById("gform");
    if(form != null)
    {
    	form.addEventListener("submit", handleFormSubmit, false);
    }
	var wordcloud = document.getElementById('wordcloud');
	if (wordcloud !=  null) {
		getWordcloudWords();
	}

	$("#wordcloud").resize(function() {
  		printWordCloud();
	});

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
		  .attr("width", layout.size()[0])
		  .attr("height", layout.size()[1])
		  .attr('viewBox', '0 0 ' + layout.size()[0] + ' ' + layout.size()[1])
		  .style('width', '100%')
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
		},

		complete: function () {
			console.log('Finished all tasks');
		}
	});
}


function printWordcloudInput(wordcloudInput)
{
   html = '<form id="gform" method="POST" ';
   html += actionScript;
   html +=' <fieldset class="pure-group">';
   html +='   <label for="name">Ord: </label>';
   html +='   <input id="name" name="name" placeholder="Hva tenker du på?" />';
   html +=' </fieldset>';

   html +=' <button class="button-success pure-button button-xlarge">';
   html +='   <i class="fa fa-paper-plane"></i>&nbsp;Send</button>';

   html +='</form>';

   html +='<div style="display:none;" id="thankyou_message">';
   html +=' <h2>Takk for ditt bidrag!</h2>';
   html +='</div>';
   
   wordcloudInput.innerHTML=html;
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

// get all data in form and return object
function getFormData() {
  var form = document.getElementById("gform");
  var elements = form.elements; // all form elements
  var fields = Object.keys(elements).filter(function(k) {
        // the filtering logic is simple, only keep fields that are not the honeypot
        return (elements[k].name !== "honeypot");
  }).map(function(k) {
    if(elements[k].name !== undefined) {
      return elements[k].name;
    // special case for Edge's html collection
    }else if(elements[k].length > 0){
      return elements[k].item(0).name;
    }
  }).filter(function(item, pos, self) {
    return self.indexOf(item) == pos && item;
  });
  var data = {};
  fields.forEach(function(k){
    data[k] = elements[k].value;
    var str = ""; // declare empty string outside of loop to allow
                  // it to be appended to for each item in the loop
    if(elements[k].type === "checkbox"){ // special case for Edge's html collection
      str = str + elements[k].checked + ", "; // take the string and append 
                                              // the current checked value to 
                                              // the end of it, along with 
                                              // a comma and a space
      data[k] = str.slice(0, -2); // remove the last comma and space 
                                  // from the  string to make the output 
                                  // prettier in the spreadsheet
    }else if(elements[k].length){
      for(var i = 0; i < elements[k].length; i++){
        if(elements[k].item(i).checked){
          str = str + elements[k].item(i).value + ", "; // same as above
          data[k] = str.slice(0, -2);
        }
      }
    }
  });

  // add form-specific values into the data
  data.formDataNameOrder = JSON.stringify(fields);
  data.formGoogleSheetName = form.dataset.sheet || "responses"; // default sheet name
  data.formGoogleSendEmail = form.dataset.email || ""; // no email by default

  console.log(data);
  return data;
}

function handleFormSubmit(event) {  // handles form submit withtout any jquery
  event.preventDefault();           // we are submitting via xhr below
  var serializedData = $("#gform").serialize();

// fire off the request to /form.php
	request = $.ajax({
		url: "https://script.google.com/macros/s/AKfycbxW1qHugD1K4adTjGAEt1KqbcbAn1LlaCoWx6GtlNdsNO_E-rTO/exec",
		type: "post",
		data: serializedData,

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
			printWordcloud();
		},

		complete: function () {
			console.log('Finished all tasks');
		}
	});
}

