See ytexample.html for an example on how to make interactive youtube transcript work. Basically you need to follow these steps:

1. Make sure you have loaded jquery.
2. Load youtube.js
3. Include youtube.css
4. Embed a youtube video as you normally do, but change the following in the iframe code:
  * a) Add an id that equals the id of the video.
  * b) Add ?enablejsapi=1 at the end of the youtube src.
5. Create a <div> element with 
  * a) an id equal to "videoTranscript" + the video id.
  * b) specify the class "mmoocVideoTranscript".
  * c) add the language of the subitle you want as a "data-language" parameter.
  * d) add, if neccessary the name of the subtitle track as "data-name" parameter. (If you have norwegian subtitles and support 
     both bokmål and nynorsk, you have to specify this parameter).
     
If you follow the steps above, your iframe code should look something like this:

~~~~
<iframe id="Lm0m4VtZ3Us" src="https://www.youtube.com/embed/Lm0m4VtZ3Us?enablejsapi=1" width="560" height="315" allowfullscreen="allowfullscreen"></iframe></p>
<div id="videoTranscriptLm0m4VtZ3Us" class="mmocVideoTranscript" data-language="no" data-name="bokm&aring;l"></div>
~~~~
