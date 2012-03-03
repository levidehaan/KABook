/**
 * @author th3m4d4l13n
 */
( function() {

	var arequest = window.arequest = {}

	arequest.playlists = function(dfd) {

		amplify.request({
			resourceId : "playlists",
			success : function(data) {
				data = { playlists : data };
				dfd.resolve(data);
			},
			error : function(data) {
				console.log('error: ');
				console.log(data);
			}
		});
	}
	
	arequest.playlist = function(playlist, dfd) {

		amplify.request({
			resourceId : "playlist", 
			data: {"playlist": playlist},
			success : function(data) {
				data = { playlist : data };
				dfd.resolve(data);
			},
			error : function(data) {
				console.log('error: ');
				console.log(data);
			}
		});
	}
	
	arequest.lesson = function(id, ytd, dfd){
		console.log("amplify request youtubeid: " + ytd);
		amplify.request({
			resourceId : "exercises", 
			data: {"youtubeid": ytd },
			success : function(data) {
				data = { lesson : data, "lessonid" : id };
				dfd.resolve(data);
			},
			error : function(data) {
				console.log('error: ');
				console.log(data);
			}
		});
	}
	
	arequest.ddgQuery = function(query, dfd){
		console.log("query: "+query);
		amplify.request({
			resourceId : "ddgQuery", 
			data: {"query": query },
			success : function(data) {
				data = { query : data };
				dfd.resolve(data);
			},
			error : function(data) {
				console.log('error: ');
				console.log(data);
			}
		});
	}
}(amplify, jQuery))