/**
 * @author th3m4d4l13n
 */

$('#github').live("click", function(e) {
	e.preventDefault();
	var args = new blackberry.invoke.BrowserArguments('https://github.com/levidehaan/KABook');
	blackberry.invoke.invoke(blackberry.invoke.APP_BROWSER, args);
});

$('#ka').live("click", function(e) {
	e.preventDefault();
	var args = new blackberry.invoke.BrowserArguments('https://github.com/Khan/khan-api/wiki/Khan-Academy-API');
	blackberry.invoke.invoke(blackberry.invoke.APP_BROWSER, args);
});

$('#ddg').live("click", function(e) {
	e.preventDefault();
	var args = new blackberry.invoke.BrowserArguments('http://duckduckgo.com/api.html');
	blackberry.invoke.invoke(blackberry.invoke.APP_BROWSER, args);
});

$('#aboutpagedone').live('click', function(e) {
	setTimeout(function() {
		$('#contentmain').show();
		$('#contentleft').show();
	}, 500);
})