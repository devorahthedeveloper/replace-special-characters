(function(){

	function formatAsObject(obj) {
		var markup = '{' + eol;
		
		for (var item in obj) {
			markup += '\t' + item + ': "' + obj[item] + '", ' + eol;
		}

		// remove trailing slash
		markup = markup.substring(0, markup.length-3) + eol;
		markup += '}';

		return markup;
	}

	function formatAsJSON(obj) {
		var markup = '[' + eol;
		var separator;

		for (var i = 0; i < obj.length; i++) {
			separator = typeof obj[i].value === 'number' ? '' : '"'
			markup += '\t{ "name": "' + obj[i].name + '", "value:" ' + separator + obj[i].value + separator + '},' + eol;
		}

		// remove trailing slash
		markup = markup.substring(0, markup.length-2) + eol;
		markup += ']';

		return markup;
	}
	
	function formatAsArray(obj) {
		var markup = '[';
		var separator;

		for (var i = 0; i < obj.length; i++) {
			separator = typeof obj[i].value === 'number' ? '' : '"'
			markup += separator + obj[i] + separator + ',';
		}

		// remove trailing slash
		markup = markup.substring(0, markup.length-1);
		markup += ']';

		return markup;
	}
	function formatResult(obj, format) {
		var result;

		switch(format) {
			case 'json':
				result = formatAsJSON( JSON.parse(obj) );
				break;

			case 'array':
				result = formatAsArray(obj);
				break;

			case 'object':
				result = formatAsObject(obj);
				break;

			case 'param':
				result = obj;
				break;

			default:
				result = obj;
		}

		return result;

	}

	function doReplace(format, rerender){
		if (rerender) {
			isProcessed = false;
		}
		var languageHighlighting = format !== 'param' ? 'javascript' : 'none';

		// populate the config object to pass to replaceSpecialChars
		var config = {};
		config.format = format;

		// Generate the result
		var result = replaceSpecialCharacters( $('form'), config);
		
		$result.empty().append('<pre class="language-' + languageHighlighting + '"><code>' + formatResult(result, format) + '</code></pre>');

		Prism.highlightAll();

		if (!isProcessed) {
			$result.fadeIn();
		}

		isProcessed = true;
		return result;	
	}

	var eol = (function(){
		// http://stackoverflow.com/questions/10887011/javascript-preformatted-text-with-cross-browser-line-breaks
		var textarea = document.createElement("textarea");
		textarea.value = "\n";
		return textarea.value.replace(/\r\n/, "\r");
		// return '';
	}());

	var format = 'json';
	var characterMap = undefined;
	var $form = $('form');
	var $result = $('.result');
	var isProcessed = false;

	$form.find('input, select, textarea').on('change keyup', function(e){
		// return false if user presses any key but "enter"
		if (e.type === 'keyup' && e.keyCode !== 13) {
			return false;
		}
		doReplace(format);
	});

	$('input[name="returnFormat"').on('click', function(){
		format = $(this).val();
		doReplace(format, true);
	});

	// Render results on page oad
	doReplace(format);

}());