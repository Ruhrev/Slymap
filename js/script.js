window.onload = function () {
    var map = L.map('map', {
        maxBounds: imageBounds,
        zoomDelta: 0.4,
        zoomSnap: 0.01,
        minZoom: 1,
        maxZoom: 10
    }).setView([0, 0], 0);
    map.fitBounds([
        [86.28966557796582, 179.68664615432297],
        [-85.6308812772077, -502.3858087753562]
    ]);

    const maplink = document.querySelectorAll('.maplink');
    const colorbuttons = document.querySelectorAll('.color-button');
    const resetbuttons = document.querySelectorAll('#reset-button');

    var imageUrl = '/media/maps/customs.webp';
    var imageBounds = [[-400, -500], [90, 180]];

    var imageOverlay = L.imageOverlay(imageUrl, imageBounds).addTo(map);

    var socket = io();
    var color = '#000000';

    socket.on('marker placed', function (data) {
        dataCoords = data.coords.coords
        dataColor = data.coords.color
        if (!dataCoords || !dataColor) {
            console.log('Received invalid data:', data);
            return;
        }

        var customIcon = L.divIcon({
            className: 'marker-icon z-index-9999',
            html: `<div class="user-marker" style="background-color: ${dataColor};"></div>`
        });
        var marker = L.marker(dataCoords, {
            draggable: false,
            icon: customIcon
        });
        marker.addTo(map);
        if (marker && dataColor) {
            marker._icon.style.backgroundColor = dataColor;
            marker._icon.style.zIndex = '9999';
        }
    });

    socket.on('clear markers', function () {
        clearMarkers();
    });

    map.on('click', function (event) {
        var coords = [event.latlng.lat, event.latlng.lng];
        socket.emit('marker placed', {
            coords: coords,
            color: color
        });
    });

    function clearMarkers() {
        map.eachLayer(function (layer) {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });
    };

    map.on('contextmenu', function () {
        return;
    });

    maplink.forEach(function (link) {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            clearMarkers();
            const imgUrl = event.target.dataset.bg;
            /*const mapName = imgUrl.split('/').pop().split('.')[0];*/
            /*document.getElementById('map-title').innerHTML = mapName;*/
            if (map.hasLayer(imageOverlay)) {
                map.removeLayer(imageOverlay);
            }
            imageOverlay = L.imageOverlay(imgUrl, imageBounds).addTo(map);
            map.fitBounds([
                [86.28966557796582, 179.68664615432297],
                [-85.6308812772077, -502.3858087753562]]);
        });
    });

    colorbuttons.forEach(function (button) {
        button.addEventListener('click', function (event) {
            event.preventDefault();
            color = button.dataset.color;
        });
    });

    resetbuttons.forEach(function (button) {
        button.addEventListener('click', function (event) {
            event.preventDefault();
            clearMarkers();
            socket.emit('clear markers');
            map.fitBounds([
                [86.28966557796582, 179.68664615432297],
                [-85.6308812772077, -502.3858087753562]]);
        });
    });

    let menuIcon = document.querySelector('.menuIcon');
    let nav = document.querySelector('.overlay-menu');
    let toggleIcon = document.querySelector('.menuIcon');

    menuIcon.addEventListener('click', function () {
        if (nav.style.transform != 'translateX(0%)') {
            nav.style.transform = 'translateX(0%)';
            nav.style.transition = 'transform 0.5s ease-out';
        } else {
            nav.style.transform = 'translateX(-100%)';
            nav.style.transition = 'transform 0.5s ease-out';
        }
    });

    toggleIcon.addEventListener('click', function () {
        if (toggleIcon.className != 'menuIcon toggle') {
            toggleIcon.className += ' toggle';
        } else {
            toggleIcon.className = 'menuIcon';
        }
    });
};