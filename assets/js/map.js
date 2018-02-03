mapboxgl.accessToken = 'pk.eyJ1IjoibG9nYW5yYWthaSIsImEiOiJjamQyN3g1MWEzYTkyMnFvNTQ4bTBiNmM5In0._rOGIXy3ShPY8239enazAw';

var onTimeArrivalMap = new mapboxgl.Map({
    container: 'on-time-arrival-map',
    style: 'mapbox://styles/loganrakai/cjd28m04f36vn2srs7ru8549r'
});

onTimeArrivalMap.on('load', function () {
    onTimeArrivalMap.addSource('on time', {
        type: 'geojson',
        data: '/us-flight-delays/data/data_by_state.json'
    });

    var layers = ['73.8%', '88.4%'];
    var colors = ['#FF0000', '#00FF00'];
    for (i = 0; i < layers.length; i++) {
        var layer = layers[i];
        var color = colors[i];
        var item = document.createElement('div');
        var key = document.createElement('span');
        key.className = 'legend-key';
        key.style.backgroundColor = color;

        var value = document.createElement('span');
        value.innerHTML = layer;
        item.appendChild(key);
        item.appendChild(value);
        legend.appendChild(item);
    }
});

onTimeArrivalMap.on('mousemove', function (e) {
    var states = onTimeArrivalMap.queryRenderedFeatures(e.point, {
        layers: ['statedata']
    });

    if (states.length > 0) {
        document.getElementById('pd').innerHTML = '<h3><strong>' + states[0].properties.name + '</strong></h3><p><strong><em>' + states[0].properties.density + '</strong> people per square mile</em></p>';
    } else {
        document.getElementById('pd').innerHTML = '<p>Hover over a state!</p>';
    }
});