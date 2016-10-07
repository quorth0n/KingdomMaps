////    INITS
/*  Firebase  */
var config = {
  apiKey: "AIzaSyAHZ9Uo4CdEEjI_L3LUKRmnn5y8BwhccNM",
  authDomain: "kingdommaps-d5aa3.firebaseapp.com",
  databaseURL: "https://kingdommaps-d5aa3.firebaseio.com",
  storageBucket: "kingdommaps-d5aa3.appspot.com",
  messagingSenderId: "803904209546"
};
firebase.initializeApp(config);

////    TIMELINE
var year = 2016;
var _map = {
    year: function(y) {
        year = y;
        console.log("year: " + y);
        firebase.database().ref('map').on('value', function (snapshot) {
            //map
            snapshot.forEach(function (snap) {
                //map/france
                firebase.database().ref('map/' + snap.key + '/points').orderByKey().endAt(""+y).limitToLast(1).on('value', function (s) {
                    //map/france/points/2016
                    if (s.exists()) {
                        var plo = [];
                        s.forEach(function (c) {
                            //map/france/points/0
                            $.each(c.exportVal(), function(k, v) {
                                var ar = $.map(v, function(value, index) {
                                    return [value];
                                });
                                plo.push(ar);
                            });
                        });
                        _map.plot(snap.key, plo);
                    }
                });
            });
        });
    },
    plot: function(id, p) {
        console.log(p);
        var temp = {
            'type': 'geojson',
            'data': {
                'type': 'Feature',
                'properties': {
                    'name': id
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': [p]
                }
            }
        };
        console.log(temp);
        mapbox.addSource(id, temp);
        mapbox.addLayer({
            'id': 'route',
            'type': 'fill',
            'source': id,
            'layout': {},
            'paint': {
                'fill-color': '#088',
                'fill-opacity': 0.8
            }
        });
    }
};

$("#timeline").on("change", function () {
  $("#t_year").text($("#timeline").val());
  _map.year($("#t_year").text());
});

////    MAP
mapboxgl.accessToken = 'pk.eyJ1Ijoia213aGlyaXNoIiwiYSI6ImNpdGo4ZGdwOTA3YTkyeW8zamtiaGRnbHcifQ.ELINMPSpstSkXYvVX_cF7w';
var mapbox = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/outdoors-v9'
});

//HACK remove this
mapbox.on('load', function () {
    mapbox.addSource('maine', {
        'type': 'geojson',
        'data': {
            'type': 'Feature',
            'properties': {
                'name': 'Maine'
            },
            'geometry': {
                'type': 'Polygon',
                'coordinates': [[[-67.13734351262877, 45.137451890638886],
                    [-66.96466, 44.8097],
                    [-68.03252, 44.3252],
                    [-69.06, 43.98],
                    [-70.11617, 43.68405],
                    [-70.64573401557249, 43.090083319667144],
                    [-70.75102474636725, 43.08003225358635],
                    [-70.79761105007827, 43.21973948828747],
                    [-70.98176001655037, 43.36789581966826],
                    [-70.94416541205806, 43.46633942318431],
                    [-71.08482, 45.3052400000002],
                    [-70.6600225491012, 45.46022288673396],
                    [-70.30495378282376, 45.914794623389355],
                    [-70.00014034695016, 46.69317088478567],
                    [-69.23708614772835, 47.44777598732787],
                    [-68.90478084987546, 47.184794623394396],
                    [-68.23430497910454, 47.35462921812177],
                    [-67.79035274928509, 47.066248887716995],
                    [-67.79141211614706, 45.702585354182816],
                    [-67.13734351262877, 45.137451890638886]]]
            }
        }
    });
    mapbox.addLayer({
        'id': 'route',
        'type': 'fill',
        'source': 'maine',
        'layout': {},
        'paint': {
            'fill-color': '#088',
            'fill-opacity': 0.8
        }
    });
});

////    SITE
if (sessionStorage.uid != undefined) {
    $("#in").attr('style', '');
    $("#in_uname").text('[' + sessionStorage.uname + ']');
    $("#in_uname").attr('href', './u/?uid='+sessionStorage.uid);
} else {
    $("#out").attr('style', '');
}

////    EDITING
var pointIds = [];
var ptI = -1;
var pt_geojson = {};
var coords = {};

var errs = false;
var uid;

var _creator = {
    makeId: function() {
        //CAUTION: only run once per point
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for( var i=0; i < 5; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        ptI++;
        pointIds.push("point"+text);
        pt_geojson["point"+text] = {
            "type": "FeatureCollection",
            "features": [{
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [0, 0]
                }
            }]
        };
    },
    editView: function(create) {
        if (sessionStorage.uid != undefined) {
            if (!create) {
                //TODO:50 wipe map and display points for country
                //NOTE Keep revisions in root fb
            }
            $("#_tools").attr('style', '');
        } else {
            alert('Please sign in');
        }
    },
    addPt: function() {
        if (ptI > -1) {
            coords[Object.keys(coords).length] = Object.assign(pt_geojson[pointIds[ptI]].features[0].geometry.coordinates, {order: ptI});
        } else {
            $("#ptadd").text('Next point');
        }
        _creator.makeId();
        mapbox.addSource(pointIds[ptI], {
            "type": "geojson",
            "data": pt_geojson[pointIds[ptI]]
        });
        mapbox.addLayer({
            "id": pointIds[ptI],
            "type": "circle",
            "source": pointIds[ptI],
            "paint": {
                "circle-radius": 10,
                "circle-color": "#fff"
            }
        });
        mapbox.on('mousemove', function(e) {
            var features = mapbox.queryRenderedFeatures(e.point, { layers: [pointIds[ptI]] });

            // Change point and cursor style as a UI indicator
            // and set a flag to enable other mouse events.
            if (features.length) {
                mapbox.setPaintProperty(pointIds[ptI], 'circle-color', '#3bb2d0');
                canvas.style.cursor = 'move';
                isCursorOverPoint = true;
                mapbox.dragPan.disable();
            } else {
                mapbox.setPaintProperty(pointIds[ptI], 'circle-color', '#3887be');
                canvas.style.cursor = '';
                isCursorOverPoint = false;
                mapbox.dragPan.enable();
            }
        });
        mapbox.on('mousedown', mouseDown, true);
    }
};

/*  Mouse events for points */
var isDragging;

// Is the cursor over a point? if this flag is active, we listen for a mousedown event.
var isCursorOverPoint;

var canvas = mapbox.getCanvasContainer();
var coordinates = document.getElementById('coordinates');
function mouseDown() {
    if (!isCursorOverPoint) return;

    isDragging = true;

    // Set a cursor indicator
    canvas.style.cursor = 'grab';

    // Mouse events
    mapbox.on('mousemove', onMove);
    mapbox.on('mouseup', onUp);
}

function onMove(e) {
    if (!isDragging) return;
    var coords = e.lngLat;

    // Set a UI indicator for dragging.
    canvas.style.cursor = 'grabbing';

    // Update the Point feature in `geojson` coordinates
    // and call setData to the source layer `point` on it.
    pt_geojson[pointIds[ptI]].features[0].geometry.coordinates = [coords.lng, coords.lat];
    mapbox.getSource(pointIds[ptI]).setData(pt_geojson[pointIds[ptI]]);
}

function onUp(e) {
    if (!isDragging) return;
    var coords = e.lngLat;

    // Print the coordinates of where the point had
    // finished being dragged to on the mapbox.
    coordinates.style.display = 'block';
    coordinates.innerHTML = 'Longitude: ' + coords.lng + '<br />Latitude: ' + coords.lat;
    canvas.style.cursor = '';
    isDragging = false;
}

/*  Event Handlers  */
$('#create').click(function () {
    _creator.editView(true);
});
$('#edit').click(function () {
    _creator.editView(false);
});
$("#ptadd").click(function () {
    if ((ptI == -1) ? true : confirm("You will not be able to edit this point. Continue?"))  {
        _creator.addPt();
    }
    if (ptI > 1) {
        $("#ptdone").prop('disabled', false);
    }
});
$("#ptdone").click(function () {
    if (!errs) {
        var dat = {
            name: $("#tname").val(),
            local_name: $("#tlname").val(),
            ruler: $("#truler").val(),
            gov: $("#tgov option:selected").text(),
            u: sessionStorage.uid,
            date: new Date().toString(),
        };
        if (confirm('Does this data look correct?\n' + JSON.stringify(dat))) {
            coords[Object.keys(coords).length] = Object.assign(pt_geojson[pointIds[ptI]].features[0].geometry.coordinates, {order: ptI});
            firebase.database().ref('map/'+uid).set(dat);
            firebase.database().ref('map/'+uid).child('points').child(year).set(coords);
            alert('Country created!');
        }
    }
});

//TODO:0 add more checks
$("#tname").change(function () {
    if ($("#tname").val().toLowerCase().indexOf(" of ") >= 0 || $("#tname").val().toLowerCase().indexOf("king") >= 0 || $("#tname").val() == "") {
        errs = true;
        $('#tname').prop('class', 'hasErr');
    } else {
        $('#tname').prop('class', '');
        errs = false;
    }
    $("#tname").val($("#tname").val().replace(/([^a-zA-Z '])/g, ''));
    uid = $("#tname").val().toLowerCase().replace(/ /g, '-');
    $("#tid").val(uid);
});

$("#truler").change(function () {
    if ($("#truler").val().toLowerCase().indexOf(" of ") >= 0 || $("#truler").val().toLowerCase().indexOf("king") >= 0 ) {
        errs = true;
        $('#truler').prop('class', 'hasErr');
    } else {
        $('#truler').prop('class', '');
    }
});
