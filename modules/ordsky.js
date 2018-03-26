$(document).ready(function(){
	var ordskySkjema = document.getElementById('wordcloudInput');
	if (ordskySkjema !=  null) {
		printOrdskySkjema(ordskySkjema);
	}
  console.log("Contact form submission handler loaded successfully.");
  // bind to the submit event of our form
  var form = document.getElementById("gform");
  form.addEventListener("submit", handleFormSubmit, false);

	var ordsky = document.getElementById('wordcloud');
	if (ordsky !=  null) {
		printOrdsky();
	}
});

function printOrdsky()
{
	$("#wordcloud").html("");
	$.ajax({
		url: "https://script.google.com/macros/s/AKfycbxW1qHugD1K4adTjGAEt1KqbcbAn1LlaCoWx6GtlNdsNO_E-rTO/exec",
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

			data.sort(function(a, b){
				return a.text > b.text;
			});
			var words = [];
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
		
			words.sort(function(a, b){
				return a.size < b.size;
			});

			var layout = cloud()
				.size([500, 500])
				.words(words)
				.padding(5)
				.rotate(function() { return ~~(Math.random() * 2) * 90; })
				.font("Impact")
				.fontSize(function(d) { return d.size; })

			layout.start();

		},

		complete: function () {
			console.log('Finished all tasks');
		}
	});
}

function printOrdskySkjema(ordskySkjema)
{
   html = '<form id="gform" method="POST" ';
   html +='  action="https://script.google.com/macros/s/AKfycbxW1qHugD1K4adTjGAEt1KqbcbAn1LlaCoWx6GtlNdsNO_E-rTO/exec">';
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
   
   ordskySkjema.innerHTML=html;
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
			printOrdsky();
		},

		complete: function () {
			console.log('Finished all tasks');
		}
	});
}

