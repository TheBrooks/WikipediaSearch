(function($, window, document) {	
	var events = require('./pubsub.js');

	var scroll = (function(){
		var win = $(window);

		//cache DOM
		var $loading = $('#loading');

		//Bind events
		win.scroll(checkBottomOfPage);
		events.subscribe('addedPages', hideLoading);
		events.subscribe('queriedPages', showLoading);

		function checkBottomOfPage() {
			if ($(document).height() - win.height() == win.scrollTop()) {
				events.emit("bottomOfPage", null);
			}
		}

		function showLoading() {
			$loading.show();
		}

		function hideLoading() {
			$loading.hide();
		}
	})();
}(window.jQuery, window, document));