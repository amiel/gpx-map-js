GMap2.prototype.fit = function(bounds){
	this.setCenter(bounds.getCenter(), this.getBoundsZoomLevel(bounds));
};

function decimalToHex(d, padding) {
    var hex = Number(d).toString(16);
    padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;

    while (hex.length < padding) {
        hex = "0" + hex;
    }

    return hex;
}

$(document).ready(function() {
	var current_gpx = {},
		map = new GMap2(document.getElementById("map_canvas")),
		weight = 3,
		opa = 0.8,
		color = '#ff0000';
	
	function render_map() {
		var sw = new GLatLng(current_gpx.min_lat, current_gpx.min_lon),
			ne = new GLatLng(current_gpx.max_lat, current_gpx.max_lon),
			bounds = new GLatLngBounds(sw, ne);
			// poly = new GPolyline(current_gpx.points, color, weight, opa);
			
		map.fit(bounds);
		map.setUIToDefault();

		for (var i in current_gpx.lines) {
			// window.console.log(i, current_gpx.lines[i]);
			map.addOverlay(current_gpx.lines[i]);
		}
	}
	
	
	$('#options a').click(function() {
		$('#options li').removeClass('current');
		$(this).parent().addClass('current');
		
		$.get('data/' + $(this).text(), null, function(data) {
			var xml = $(data);
			current_gpx.name = xml.find('name').html();
			current_gpx.points = [];
			current_gpx.point_attributes = {};
			current_gpx.lines = [];
			xml.find('trk trkseg trkpt').each(function() {
				var $t = $(this),
					p = new GLatLng(parseFloat($t.attr('lat'), 10), parseFloat($t.attr('lon'), 10)),
					point_attributes = {
						time: $t.find('time').text(),
						elevation: parseFloat($t.find('ele').text(), 10)
					},
					last_point_index = current_gpx.points.length - 1,
					last_p = current_gpx.points[last_point_index],
					last_pa = current_gpx.point_attributes[last_p],
					line, distance, time_difference;
					
				current_gpx.points.push(p);
				current_gpx.point_attributes[p] = point_attributes;
				
				// window.console.log($t.find('time').text());
				
				if (last_point_index >= 0) {
					distance = last_p.distanceFrom(p);
					time_difference = (Date.parseISO8601(point_attributes.time) - Date.parseISO8601(last_pa.time)) / 1000;
					// window.console.log("meters per sec", distance, time_difference, distance / time_difference);
					color = "#" + Math.round(distance / time_difference * 15).toString(16) + "0000";
					// color = "#" + decimalToHex(Math.round(distance / time_difference * 1500), 6);
					// window.console.log(color);
					line = new GPolyline([last_p, p], color, weight, opa);
					current_gpx.lines.push(line);
				}
				
				current_gpx.max_lat = current_gpx.max_lat > p.lat() ? current_gpx.max_lat : p.lat();
				current_gpx.max_lon = current_gpx.max_lon > p.lng() ? current_gpx.max_lon : p.lng();
				current_gpx.min_lat = current_gpx.min_lat < p.lat() ? current_gpx.min_lat : p.lat();
				current_gpx.min_lon = current_gpx.min_lon < p.lng() ? current_gpx.min_lon : p.lng();
			});
			
			
			
			// window.console.log(current_gpx);
			render_map();
		}, 'text');
		return false;
	}).filter(':first').click();
	
	// $.get('data', null, function(data) { // get index of data directory
	// 	var r = new RegExp("href=\"(\\w+\\.gpx)\"", "g");
	// 	while (result = r.exec(data)) {
	// 		$("#options").append(
	// 			$('<li>').html($('<a>').html(result[1]).click())
	// 		);
	// 	}
	// }, 'text');
	
});
