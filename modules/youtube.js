this.mmooc=this.mmooc||{};

//https://medium.com/@pointbmusic/youtube-api-checklist-c195e9abaff1
this.mmooc.youtube = function() {
	var hrefPrefix = "https://video.google.com/timedtext?v=";
	var transcriptIdPrefix = "videoTranscript";
	var transcriptArr = [];
	var initialized = false;

	function transcript(transcriptId, language, name)
	{
		var transcriptId = transcriptId;
		var videoId = transcriptId.split(transcriptIdPrefix)[1];

		var href = hrefPrefix + videoId;
		if(language != "")
		{
		   href = href + "&lang=" + language;
		}
		if(name != "")
		{
		  href = href + "&name=" + name;
		}

			//Array of captions in video
		var captionsLoaded = false;

		//Timeout for next caption
		var captionTimeout = null;
		
		var captions = null;

		//Keep track of which captions we are showing
		var currentCaptionIndex = 0;
		var nextCaptionIndex = 0;

		this.player = new YT.Player(videoId, {
		  videoId: videoId,
		  events: {
			'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange
		  }
  	    });	
		
		var findCaptionIndexFromTimestamp = function(timeStamp)
		{
			var start = 0;
			var duration = 0;
			for (var i = 0, il = captions.length; i < il; i++) {
				start = Number(getStartTimeFromCaption(i));
				duration = Number(getDurationFromCaption(i));
	
				//Return the first caption if the timeStamp is smaller than the first caption start time.
				if(timeStamp < start)
				{
					break;
				}
	
				//Check if the timestamp is in the interval of this caption.
				if((timeStamp >= start) && (timeStamp < (start + duration)))
				{
					break;
				}        
			}
			return i;
		}


		var clearCurrentHighlighting = function()
		{
			var timeStampId = getTimeIdFromTimestampIndex(currentCaptionIndex);
			$("#"+timeStampId).css('background-color', '');
		}

		var highlightNextCaption = function ()
		{
			var timestampId = getTimeIdFromTimestampIndex(nextCaptionIndex);
			$("#"+timestampId).css('background-color', 'yellow');
		}

		var calculateTimeout = function (currentTime)
		{
			var startTime = Number(getStartTimeFromCaption(currentCaptionIndex));
			var duration = Number(getDurationFromCaption(currentCaptionIndex));
			var timeoutValue = startTime - currentTime + duration;
			return timeoutValue;
		}

		this.setCaptionTimeout = function (timeoutValue)
		{
			if(timeoutValue < 0)
			{
				return;
			}
			
			clearTimeout(captionTimeout);
			
			var transcript = this;
			
			captionTimeout = setTimeout(function() {
				transcript.highlightCaptionAndPrepareForNext();
			}, timeoutValue*1000)
		}

		var getStartTimeFromCaption = function(i)
		{
			if(i >= captions.length)
			{
				return -1;
			}
			return captions[i].getAttribute('start');
		}
		var getDurationFromCaption = function(i) 
		{
			if(i >= captions.length)
			{
				return -1;
			}
			return captions[i].getAttribute('dur');
		}
		var getTimeIdFromTimestampIndex = function(i)
		{
			var strTimestamp = "" + i;
			return "t" + strTimestamp;
		}


		//////////////////
		//Public functions
		/////////////////

		//This function highlights the next caption in the list and
		//sets a timeout for the next one after that.
		//It must be public as it is called from a timer.
		this.highlightCaptionAndPrepareForNext = function ()
		{
			clearCurrentHighlighting();
			highlightNextCaption();
			currentCaptionIndex = nextCaptionIndex;
			nextCaptionIndex++;

			var currentTime = this.player.getCurrentTime();
			var timeoutValue = calculateTimeout(currentTime);
		
			if(nextCaptionIndex <= captions.length)			
			{
				this.setCaptionTimeout(timeoutValue);
			}
		}
		
		//Called if the user has dragged the slider to somewhere in the video.
		this.highlightCaptionFromTimestamp = function(timeStamp)
		{
			clearCurrentHighlighting();
			nextCaptionIndex = findCaptionIndexFromTimestamp(timeStamp);
			currentCaptionIndex = nextCaptionIndex;

			var startTime = Number(getStartTimeFromCaption(currentCaptionIndex));

			var timeoutValue = -1;		
			if(timeStamp < startTime)
			{
				timeoutValue = startTime - currentTime;
			}
			else
			{
				highlightNextCaption();
				timeoutValue = calculateTimeout(currentTime);
			}
			this.setCaptionTimeout(timeoutValue);
		}   

		this.transcriptLoaded = function(transcript) {
			var start = 0;
			captions = transcript.getElementsByTagName('text');
			var srt_output = "<div class='btnSeek' id='btnSeek' data-seek='0'>0:00</div>";

			for (var i = 0, il = captions.length; i < il; i++) {
				start =+ getStartTimeFromCaption(i);

				captionText = captions[i].textContent.replace(/</g, '&lt;').replace(/>/g, '&gt;');
				var timestampId = getTimeIdFromTimestampIndex(i);
				srt_output += "<span class='btnSeek' data-seek='" + start + "' id='" + timestampId + "'>" + captionText + "</span> ";
			};

			$("#videoTranscript" + videoId).append(srt_output);
			captionsLoaded = true;
		}
		
		this.getTranscriptId = function()
		{
			return transcriptId;
		}
		this.getVideoId = function()
		{
			return videoId;
		}
		
		this.getTranscript = function()
		{
			var oTranscript = this;
			$.ajax({
				url: href,
				type: 'GET',
				data: {},
				success: function(response) {
					oTranscript.transcriptLoaded(response);
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					console.log("Error during GET");
				}
			});           
		}
		
		this.playerPlaying = function()
		{
			if(!captionsLoaded)
			{
				return;
			}	
			
		    currentTime = this.player.getCurrentTime();
		    this.highlightCaptionFromTimestamp(currentTime);
		}
		this.playerNotPlaying = function (transcript)
		{
			if(!captionsLoaded)
			{
				return;
			}	
			clearTimeout(captionTimeout);
		}
	}

	//Called when user clicks somewhere in the transcript.
	$(function() {
		$(document).on('click', '.btnSeek', function() {
			var seekToTime = $(this).data('seek');
			var transcript = mmooc.youtube.getTranscriptFromTranscriptId($(this).parent().attr("id"));
			transcript.player.seekTo(seekToTime, true);
			transcript.player.playVideo();
		});
	});

	//These functions must be global as YouTube API will call them. 
	var previousOnYouTubePlayerAPIReady = window.onYouTubePlayerAPIReady; 
	window.onYouTubePlayerAPIReady = function() {
		if(previousOnYouTubePlayerAPIReady)
		{
			previousOnYouTubePlayerAPIReady();
		}
		mmooc.youtube.APIReady();
	};

	// The API will call this function when the video player is ready.
	// It can be used to auto start the video f.ex.
	window.onPlayerReady = function(event) {
	}

	// The API calls this function when the player's state changes.
	//    The function indicates that when playing a video (state=1),
	//    the player should play for six seconds and then stop.
	window.onPlayerStateChange = function(event) {
		console.log("onPlayerStateChange " + event.data);
		var transcript = this.mmooc.youtube.getTranscriptFromVideoId(event.target.getIframe().id);
		if (event.data == YT.PlayerState.PLAYING) {
			transcript.playerPlaying();
		}
		else
		{
			transcript.playerNotPlaying();
		}
	}

	return {
		getTranscriptFromTranscriptId(transcriptId)
		{
			for (index = 0; index < transcriptArr.length; ++index) {
				if(transcriptArr[index].getTranscriptId() == transcriptId)
				{
					return transcriptArr[index];
				}
			}
			return null;
		},
	    getTranscriptFromVideoId(videoId)
	    {
			for (index = 0; index < transcriptArr.length; ++index) {
				if(transcriptArr[index].getVideoId() == videoId)
				{
					return transcriptArr[index];
				}
			}
			return null;
	    },
	    
		APIReady : function ()
		{
			if(!initialized)
			{
				$(".mmocVideoTranscript" ).each(function( i ) {
					var language = $(this).data('language');
					var name = $(this).data('name');
					var oTranscript = new transcript(this.id, language, name);
					oTranscript.getTranscript();
					transcriptArr.push(oTranscript);
				});
				initialized = true;
			}
		},
		init : function ()
		{
			this.APIReady();
		}		
	}

}();
//Everything is ready, load the youtube iframe_api
$.getScript("https://www.youtube.com/iframe_api");


