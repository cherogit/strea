var map = document.getElementById('map');

function initMap() {
	var myLatlng = new google.maps.LatLng(59.853394, 30.303571),
		zoomCustom = 14

	map = new google.maps.Map(document.getElementById('map'), {
		center: myLatlng,
		zoom: zoomCustom,
		mapTypeControl: false,
		disableDefaultUI: true,
		scrollwheel: false
	});
	
	var marker = new google.maps.Marker({
		position: {lat: 59.853394, lng: 30.303571},
		map: map,
		optimized: false
	});
}

if (map) {
	initMap();
	
	$(window).resize(function() {
		initMap();
	});
}

