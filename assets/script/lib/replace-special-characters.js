var replaceSpecialCharacters = (function(values, opts){
	
	var field, newField, i,
	opts = opts || {},
	raw = [], 
	clean = [],
	returnValue = undefined;

	var defaults = {
		format: 'array',	// possible values: 'param', 'array', 'object' or 'json',
		characterMap: {
			'à': 'a',
			'â': 'a',
			'ä': 'ae',
			'æ': 'ae',
			'ç': 'c',
			'é': 'e',
			'è': 'e',
			'ê': 'e',
			'ë': 'e',
			'î': 'i',
			'ï': 'i',
			'ô': 'o',
			'ö': 'oe',
			'œ': 'oe',
			'ù': 'u',
			'û': 'u',
			'ü': 'ue',
			'ß': 'ss',
			'ÿ': 'y'
		}
	};

	function jsonToObject(array){
		var obj = {};
		for(var i = 0; i < array.length; i++){
			obj[array[i].name] = array[i].value
		}
		return obj;
	}

	function jsonToArray(array){
		var arr = [];
		for(var i = 0; i < array.length; i++){
			arr.push(array[i].value);
		}
		return arr;
	}
	
	function replaceChars(value, map){
		// Break field value into separate words, then run each word through the replace function, swapping out special chars while keeping original capitalization
		// Returns a string
		return $.map(value.split(' '), function(arrayPart, arrayIndex){

			// Begin regex replace
			return arrayPart.replace(/./g, function (character, index, word){

				var cleanChar = character; // if character is not a special char, we will return it unmodified
				var isLowerCase = character === character.toLowerCase();
				var adjacent = word.charAt(index + 1);

				// Replace character and figure out correct capitalization
				if ( map[character.toLowerCase()] ) {
					cleanChar = map[character.toLowerCase()]; // Find replacement character
					cleanChar = isLowerCase ? cleanChar : function(char, adj){ // Set proper capitalization
						return (char.length === 2 && adj !== '' && adj === adj.toLowerCase() ) ? // Check if this is a two-letter replacement that needs mixed case
							char.charAt(0).toUpperCase() + char.charAt(1) : // If yes, capitalize only the first letter
							char.toUpperCase();								// Otherwise, capitalize both letters
					}(cleanChar, adjacent);
				}

				return cleanChar;
			}); // End regex replace

		}).join(' '); // End $.map
	}

	// Extend user options with defaults
	opts = $.extend({}, defaults, opts);

	// Verify that we have a form DOM element as values
	if ( !values || !( $(values).prop('tagName').toLowerCase() === 'form' && $(values).length ) ) { 
		return false;
	}
	// Serialize the form data
	raw = $(values).serializeArray();

	// Generate clean data by swapping out special characters
	for (var i = 0; i < raw.length; i++) {
		field = raw[i]; 

		if (field.value !== '') {
			clean.push({ name: field.name,  value: replaceChars(field.value, opts.characterMap) });				
		}
	}

	// Prepare the return value in the requested format
	switch (opts.format){

		case 'param':
			returnValue = $.param(clean);
			break;

		case 'object':
			returnValue = jsonToObject(clean);
			break;

		case 'json':
			returnValue = JSON.stringify(clean);
			break;

		case 'array':
			returnValue = jsonToArray(clean);
			break;

		default:
			returnValue = clean;
	}

	return returnValue;
});