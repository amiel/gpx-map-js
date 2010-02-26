GMap2.prototype.fit = function(bounds){
	this.setCenter(bounds.getCenter(), this.getBoundsZoomLevel(bounds));
};


$(document).ready(function() {
	var current_gpx = {},
		map = new GMap2(document.getElementById("map_canvas"));
	
	function render_map() {
		var sw = new GLatLng(current_gpx.min_lat, current_gpx.min_lon),
			ne = new GLatLng(current_gpx.max_lat, current_gpx.max_lon),
			bounds = new GLatLngBounds(sw, ne),
			weight = 3,
			opa = 0.8,
			color = '#ff0000',
			poly = new GPolyline(current_gpx.points, color, weight, opa);
			
		map.fit(bounds);
		map.setUIToDefault();

		map.addOverlay(poly);
	}
	
	
	$('#options a').click(function() {
		$('#options li').removeClass('current');
		$(this).parent().addClass('current');
		
		$.get('data/' + $(this).text(), null, function(data) {
			var xml = $(data);
			current_gpx.name = xml.find('name').html();
			current_gpx.points = [];
			current_gpx.point_attributes = {};
			xml.find('trk trkseg trkpt').each(function() {
				var $t = $(this), p = new GLatLng(parseFloat($t.attr('lat'), 10), parseFloat($t.attr('lon'), 10));
				current_gpx.points.push(p);
				current_gpx.point_attributes[p] = {
					time: $t.find('time').text(),
					elevation: parseFloat($t.find('ele').text(), 10)
				};
				current_gpx.max_lat = current_gpx.max_lat > p.lat() ? current_gpx.max_lat : p.lat();
				current_gpx.max_lon = current_gpx.max_lon > p.lng() ? current_gpx.max_lon : p.lng();
				current_gpx.min_lat = current_gpx.min_lat < p.lat() ? current_gpx.min_lat : p.lat();
				current_gpx.min_lon = current_gpx.min_lon < p.lng() ? current_gpx.min_lon : p.lng();
			});
			
			
			
			window.console.log(current_gpx);
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
	$('#options a:first').click();
	
});
