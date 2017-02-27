var $ = require('jquery');
var Mustache = require('mustache');

(function($, window, document) {
	var events = require('./pubsub.js');

	var wikiPageJsonFormatter = (function(){
		function pagesFromWikiJson(json) {
			var pages = json.query.pages;
			var formattedPages = [];
			for(var prop in pages) {
				var newPage = {
					title: pages[prop].title,
					description: pages[prop].extract,
					url: "http://en.wikipedia.org/?curid=" + pages[prop].pageid,
				};
				formattedPages.push(newPage);
			}
			return formattedPages;
		}

		return {
			pagesFromWikiJson: pagesFromWikiJson,
		};
	})();

	var wikiSearcher = (function(wikiJsonFormatter){
		var offset = 0;
		var limit = 10;
		var search = "";
		var apiBase = "https://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&prop=extracts&exintro&explaintext&exsentences=1&exlimit=max"
		var limitParam = "&gsrlimit=";
		var offsetParam = "&gsroffset=";
		var searchParam = "&gsrsearch=";

		//Cache DOM
		var $search = $("#search-text");

		//bind events
		$search.on('search', searchFired);
		events.subscribe('bottomOfPage', bottomOfPage);

		function searchFired() {
			offset = 0;
			search = $search.val();
			clearSearch();
			getNextWikipediaQuery();
		}

		function clearSearch() {
			events.emit("clearSearch", []);
		}

		function getNextWikipediaQuery() {
			if (!search) {
				return;
			}

			var queryStr = apiBase + limitParam + limit + offsetParam + offset + searchParam + search;
			var query = $.getJSON(queryStr);
			events.emit('queriedPages', null);
			// TODO handle error
			query.done(handleWikipediaData);
		}

		function handleWikipediaData(data) {
			var pages = wikiJsonFormatter.pagesFromWikiJson(data);
			offset += pages.length;
			events.emit("updateQueryResults", pages);
		}

		function bottomOfPage(){
			getNextWikipediaQuery();
		}
	})(wikiPageJsonFormatter);


	var pageViewer = (function(){
		var pages = [];

		//cache DOM
		var $ul = $("#result-list");
		var template = $ul.find("#page-template").html();

		//bind events
		events.subscribe('updateQueryResults', addPages);
		events.subscribe('clearSearch', clearPages);
		_render();

		function _render() {
			$ul.html(Mustache.render(template, {pages: pages}));
		}

		function addPages(value) {
			pages = pages.concat(value);
			events.emit('addedPages', null);
			_render();
		}

		function clearPages() {
			pages = [];
			_render();
		}

		return {
			addPages: addPages,
			clearPages: clearPages,
		};
	})();
}($, window, document));