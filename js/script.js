(function($, window, document) {
	var wikiPageJsonFormatter = (function(){
		function pagesFromWikiJson(json) {
			var length = json[1].length;
			var pages = [];
			for(var i = 0; i < length; i++) {
				var newPage = {
					title: json[1][i],
					description: json[2][i],
					url: json[3][i],
				};
				pages[i] = newPage;
			}
			return pages;
		}

		return {
			pagesFromWikiJson: pagesFromWikiJson,
		};
	})();

	var wikiSearcher = (function(wikiJsonFormatter){
		var api = "https://en.wikipedia.org/w/api.php?action=opensearch&search=";

		//Cache DOM
		var $search = $("#search-text");

		//bind events
		$search.on('search', searchFired);

		function searchFired() {
			var searchStr = $search.val();
			if (!searchStr) {
				clearSearch();
			}
			else {
				queryWikipedia(searchStr);
			}
		}

		function clearSearch() {
			events.emit("clearSearch", []);
		}

		function queryWikipedia(searchStr) {
			var queryStr = api + searchStr;
			var result = $.getJSON(queryStr);
			result.done(function(data){
				var pages = wikiJsonFormatter.pagesFromWikiJson(data);
				events.emit("updateQueryResults", pages);
			});
		}
	})(wikiPageJsonFormatter);


	var pageViewer = (function(){
		var pages = [];

		//cache DOM
		var $ul = $("#result-list");
		var template = $ul.find("#page-template").html();

		//bind events
		events.subscribe('updateQueryResults', setPages);
		events.subscribe('clearSearch', clearPages);
		_render();

		function _render() {
			$ul.html(Mustache.render(template, {pages: pages}));
		}

		function addPages(value) {
			pages.push(value);
			_render();
		}

		function setPages(value) {
			pages = value;
			_render();
		}

		function removePage(event) {
			pages.splice(event, 1);
			_render();
		}

		function clearPages() {
			pages = [];
			_render();
		}

		return {
			setPages: setPages,
			addPages: addPages,
			removePage: removePage,
			clearPages: clearPages,
		};
	})();
}(window.jQuery, window, document));