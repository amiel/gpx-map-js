$(document).ready(function() {
	var current_gpx = {},
		map = new GMap2(document.getElementById("map_canvas"));
	
	function render_map() {
		map.setCenter(new GLatLng(current_gpx.max_lat, current_gpx.min_lon), 13);
		map.setUIToDefault();
	}
	
	
	$('#options a').click(function() {
		$.get('data/' + $(this).text(), null, function(data) {
			var xml = $(data);
			current_gpx.name = xml.find('name').text();
			current_gpx.points = [];
			xml.find('trk trkseg trkpt').each(function() {
				var $t = $(this), p = {
					lat: $t.attr('lat'),
					lon: $t.attr('lon'),
					time: $t.find('time').text(),
					elevation: $t.find('ele').text()
				};
				current_gpx.points.push(p);
				current_gpx.max_lat = current_gpx.max_lat < p.lat ? p.lat : current_gpx.max_lat;
				current_gpx.max_lon = current_gpx.max_lon < p.lon ? p.lon : current_gpx.max_lon;
				current_gpx.min_lat = current_gpx.min_lat < p.lat ? current_gpx.min_lat : p.lat;
				current_gpx.min_lon = current_gpx.min_lon < p.lon ? current_gpx.min_lon : p.lon;
			});
			
			
			
			// window.console.log(current_gpx);
			render_map();
		}, 'text');
		return false;
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
