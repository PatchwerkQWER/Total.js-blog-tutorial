F.helpers.nl2br = function(value) {
	return value.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1<br>$2');
};