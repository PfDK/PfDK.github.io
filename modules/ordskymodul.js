$.when(
	$.getScript("https://pfdk.github.io/modules/ordsky/d3.js"),
    $.Deferred(function( deferred ){
        $( deferred.resolve );
    })
).done(function(){
	$.when(
		$.getScript("https://pfdk.github.io/modules/ordsky/d3.layout.cloud.js"),
		$.Deferred(function( deferred ){
			$( deferred.resolve );
		})
	).done(function(){
		$.when(
			$.getScript("https://pfdk.github.io/modules/ordsky/d3.wordcloud.js"),
			$.Deferred(function( deferred ){
				$( deferred.resolve );
			})
		).done(function(){
			$.getScript("https://pfdk.github.io/modules/ordsky/ordsky.js");
		});
	});
});

