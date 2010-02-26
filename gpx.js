$(document).ready(function() {
	var current_gpx = {};
	
	$('#options a').click(function() {
		$.get('data/' + $(this).text(), null, function(data) {
			var xml = $(data);
			current_gpx.name = xml.find('name').text();
			current_gpx.points = [];
			xml.find('trk trkseg trkpt').each(function() {
				var $t = $(this);
				current_gpx.points.push({
					lat: $t.attr('lat'),
					lon: $t.attr('lon'),
					time: $t.find('time').text(),
					elevation: $t.find('ele').text()
				});
			});
			
			window.console.log(current_gpx);
		}, 'text');
	});
	
	// $.get('data', null, function(data) { // get index of data directory
	// 	var r = new RegExp("href=\"(\\w+\\.gpx)\"", "g");
	// 	while (result = r.exec(data)) {
	// 		$("#options").append(
	// 			$('<li>').html($('<a>').html(result[1]).click())
	// 		);
	// 	}
	// }, 'text');
});
