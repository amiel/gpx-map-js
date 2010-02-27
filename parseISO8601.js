// from http://dansnetwork.com/2008/11/01/javascript-iso8601rfc3339-date-parser/
Date.parseISO8601 = function(dString){
	
	var regexp = /(\d\d\d\d)(-)?(\d\d)(-)?(\d\d)(T)?(\d\d)(:)?(\d\d)(:)?(\d\d)(\.\d+)?(Z|([+-])(\d\d)(:)?(\d\d))/,
		date = new Date();

	if (dString.toString().match(new RegExp(regexp))) {
		var d = dString.match(new RegExp(regexp));
		var offset = 0;

		date.setUTCDate(1);
		date.setUTCFullYear(parseInt(d[1],10));
		date.setUTCMonth(parseInt(d[3],10) - 1);
		date.setUTCDate(parseInt(d[5],10));
		date.setUTCHours(parseInt(d[7],10));
		date.setUTCMinutes(parseInt(d[9],10));
		date.setUTCSeconds(parseInt(d[11],10));
		if (d[12])
			date.setUTCMilliseconds(parseFloat(d[12]) * 1000);
		else
			date.setUTCMilliseconds(0);
		if (d[13] != 'Z') {
			offset = (d[15] * 60) + parseInt(d[17],10);
			offset *= ((d[14] == '-') ? -1 : 1);
			date.setTime(date.getTime() - offset * 60 * 1000);
		}
	} else {
		date.setTime(Date.parse(dString));
	}
	return date;
};