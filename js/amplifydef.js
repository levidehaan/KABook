//define all connections to khan-api
( function(amp, $) {
	ka = "http://www.khanacademy.org";

	amp.request.define("playlists", "ajax", {
		url : ka + "/api/v1/playlists",
		dataType : "json",
		decoder : function(data, status, xhr, success, error) {

			if(xhr.status === 404) {
				console.log("404");
				error('404');
			}
			if(status === "error") {
				console.log("error: ");
				error();
			}
			//console.log("status: " + status);
			success(data);
		},
		cache : true
	});

	amp.request.define("playlist", "ajax", {
		url : ka + "/api/v1/playlists/{playlist}/videos",
		dataType : "json",
		decoder : function(data, status, xhr, success, error) {

			if(xhr.status === 404) {
				//console.log("404");
				error('404');
			}
			if(status === "error") {
				//console.log("error: ");
				error();
			}
			//console.log("status: " + status);
			success(data);
		},
		cache : true
	});

	amp.request.define("exercises", "ajax", {
		url : ka + "/api/v1/videos/{youtubeid}/exercises",
		dataType : "json",
		decoder : function(data, status, xhr, success, error) {

			if(xhr.status === 404) {
				//console.log("404");
				error('404');
			}
			if(status === "error") {
				//console.log("error: ");
				error();
			}
			//console.log("status: " + status);
			success(data);
		},
		cache : true
	});
	
	amp.request.define("ddgQuery", "ajax", {
		url : "http://api.duckduckgo.com/?q={query}&format=json&pretty=1",
		dataType : "json",
		decoder : function(data, status, xhr, success, error) {

			if(xhr.status === 404) {
				//console.log("404");
				error('404');
			}
			if(status === "error") {
				//console.log("error: ");
				error();
			}
			//console.log("status: " + status);
			success(data);
		},
		cache : true
	});

}(amplify, jQuery))