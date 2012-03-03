( function($, amplify) {
	render = function(template, context) {

		var chez, divm = template.replace(/-.*$/, "");

		if( typeof context === "function") {
			switch(true) {
				case (context.toString().indexOf("playlists") > 0):
					$.when(context()).then(function(data) {
						$(divm).link(data, template).listview();
						$(template).template();
						$(divm).render();
						$(divm).trigger('create');

						$('#main').show();
						$('#loader').hide();
					});
					break;
			}
		} else {
			////console.log("context: ");
			////console.log(context);

			////console.log("rendering: " + template + " onto: " + divm);
			$(divm).link(context, template);
			$(template).template("ref");
			$(divm).trigger('create');

		}
		$.mobile.silentScroll(0);
		$.mobile.hidePageLoadingMsg();
	};
	//init the app, load all the basics first, then on to specialized things
	$(document).live('pagebeforecreate', function(event) {
		////console.log("pagebeforecreate loading page: ");
		////console.log(event.target.id);

		////console.log("Setting jQuery Mobile config...");
		$.mobile.loadingMessage = "Loading Khan Academy Content";
		if(event.target.id === "about") {
			////console.log("about loading");
			$('#main').page();
			$('#contentmain').hide();
			$('#contentleft').hide();
		}
		if(event.target.id === "main") {
			//console.log("rendering templates...");

			render('#header-template', {
				title : ""
			});

			render('#leftbar-template', {
				list : "list"
			});

			render('#contentmain-template', {
				content : ""
			});

			render('#contentleft-template', function() {
				var dfd = new $.Deferred();
				arequest.playlists(dfd);
				return dfd.promise();
			});
			render('#footer-template', {
				footer : "KABook"
			});
		}
	});
	//handle calls to ampRequests
	$(document).bind("pagebeforechange", function(e, data) {
		if( typeof data.toPage === "string") {
			$.mobile.showPageLoadingMsg();
			//console.log("intercepting pagebeforechange");
			var u = $.mobile.path.parseUrl(data.toPage);
			console.log("blackberry network:");
			console.log(blackberry.network);

			switch(true) {
				case /^#individual-playlist/.test(u.hash):
					//e.preventDefault();
					var ref = u.hash.match(/\=(.*$)/);
					$.when( function(playlist) {
						var dfd = new $.Deferred();
						arequest.playlist(playlist, dfd);
						return dfd.promise();
					}(ref[1])).then(function(data) {
						processPlaylist(data);
					});
					break;

				case /^#watchVideo/.test(u.hash):
					//console.log("intercepting watchVideo");
					var ref = u.hash.match(/\=(.*$)/), ref2 = ref[1].split("^");
					$.when( function(id, ytid) {
						var dfd = new $.Deferred();
						arequest.lesson(id, ytid, dfd);
						return dfd.promise();
					}(ref2[0], ref2[1])).then(function(data) {
						showLesson(data);
					});
					break;

				default:
					$('#main').page();
					break;
			}
		}
	});
	function processPlaylist(data) {
		////console.log(data)
		if(data.playlist.length === 0) {
			////console.log("playlist empty render sorry");
			render('#contentmain-template', {
				content : "Unfortunately there is no content available for this subject yet."
			});
		} else {
			////console.log("playlist is not empty");
			$('#contentmain').html("");
			var playList = $("<ul/>", {
				id : "playList",
				"data-role" : "listview",
				"data-inset" : "true"
			});
			$.each(data.playlist, function(index, value) {
				////console.log(value);
				var li = $("<li/>", {
					id : value.readable_id
				}), a = $("<a />", {
					href : "#watchVideo?video=" + value.readable_id + "^" + value.youtube_id
				}), h3 = $("<h3/>"), p = $("<p/>"), p2 = $("<p/>", {
					"class" : "ul-li-aside"
				});
				$(li).data("data", value);
				h3.html(value.title);
				p.html(value.description);
				p2.html("Views: " + value.views + " | Date Added: " + value.date_added + " | Keywords: " + value.keywords);
				li.append(a.append(h3.after(p.after(p2))));
				playList.append(li);

			});

			playList.appendTo('#contentmain');
			$('#contentmain').trigger('create');
			$.mobile.silentScroll(0);
			$.mobile.hidePageLoadingMsg();
		}
	}

	

	function showLesson(data) {
		////console.log(data);
		$parentData = $('#' + data.lessonid).data("data");
		////console.log("parent data: ");
		////console.log($parentData);
		////console.log("data.lesson: ");
		////console.log(data);
		if(data.lesson.length === 0) {
			$.when( function($parentData) {
				var dfd = new $.Deferred();
				getDefinition($parentData.readable_id.split('-').join(" "), dfd);
				return dfd.promise();
			}($parentData)).then(function(ddg2) {
				if(ddg2 !== "empty") {
					$.extend($parentData, ddg2.query);
				} else {
					$parentData.Definition = "No Definition Found";
					$parentData.DefinitionSource = "";
				}
				render('#contentmain-lesson-template', $parentData);

			});
		} else {

			var nprereq;
			$.each(data.lesson[0].prerequisites, function(index, value) {
				var nvalue = value.replace(/_/g, "-"), name = value.replace(/_/g, " ");
				nprereq = {
					prerequisiteList : {
						"prereq" : nvalue,
						"prereqName" : name
					}
				};
			});
			$.extend(data.lesson[0], nprereq);
			if( typeof data.lesson[0].display_name !== "undefined") {
				$.when( function($parentData) {
					var dfd = new $.Deferred();
					getDefinition(data.lesson[0].display_name, dfd);
					return dfd.promise();
				}($parentData)).then(function(ddg2) {
					if(ddg2 !== "empty") {
						$.extend($parentData, ddg2.query);
						$.extend($parentData, data.lesson[0]);
					} else {
						$.when( function($parentData) {
							var dfd = new $.Deferred();
							getDefinition($parentData.readable_id.split('-').join(" "), dfd);
							return dfd.promise();
						}($parentData)).then(function(ddg2) {
							if(ddg2 !== "empty") {
								$.extend($parentData, ddg2.query);
								$.extend($parentData, data.lesson[0]);
							} else {
								$parentData.Definition = "No Definition Found";
								$parentData.DefinitionSource = "";
							}

						});
					}
					render('#contentmain-lesson-template', $parentData);

				});
			} else {
				$.when( function($parentData) {
					var dfd = new $.Deferred();
					getDefinition($parentData.readable_id.split('-').join(" "), dfd);
					return dfd.promise();
				}($parentData)).then(function(ddg2) {
					if(ddg2 !== "empty") {
						$.extend($parentData, ddg2.query);
						$.extend($parentData, data.lesson[0]);
					} else {
						$parentData.Definition = "No Definition Found";
						$parentData.DefinitionSource = "";
					}
					render('#contentmain-lesson-template', $parentData);

				});
			}

		}

	}

	function getDefinition(query, defer) {
		$.when( function(query) {
			var dfd = new $.Deferred();
			arequest.ddgQuery(query, dfd);
			return dfd.promise();
		}(query)).then(function(ddg) {
			if(ddg.query !== null) {
				////console.log("the ddg: ");
				////console.log(ddg);
				if(ddg.query.Definition !== "" && ddg.query.Definition !== null) {
					defer.resolve(ddg);
				} else {
					defer.resolve("empty");
				}
			} else {
				return false;
			}
		});
	}

}(jQuery, amplify) );
