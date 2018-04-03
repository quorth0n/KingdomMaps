"use strict";
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
var layerIds = [];
var year = 2016;
var selectC;
var _map = {
  ready: function() {
    $("#timeline").prop('disabled', false);
    _map.year(2016);
  },
  year: function(y) {
    var templ = layerIds.length;
    for (var i = 0; i < templ; i++) {
      mapbox.removeLayer(layerIds[0]);
      mapbox.removeSource(layerIds[0]);
      layerIds.splice(0,1);
    }
    $("#tdat_s").val(y);
    year = y;
    console.log("year: " + y);
    firebase.database().ref('map').on('value', function (snapshot) {
      snapshot.forEach(function (snap) {
        firebase.database().ref('map/' + snap.key + '/points').orderByKey().endAt(""+y).limitToLast(1).once('value').then(function (year_snap) {
          console.log(Object.keys(year_snap.val())[0]);
          firebase.database().ref('map/' + snap.key + '/points/' + Object.keys(year_snap.val())[0]).once('value').then(function (year_content_snap) {
            console.log(year_content_snap.val());
            year_content_snap.forEach(function (island_snap) {
              var toPlot = [];
              $.each(island_snap.child('0').val(), function(k, v) {
                if (v != true) {
                  var ar = $.map(v, function(value, index) {
                    return [value];
                  });
                  toPlot.push(ar);
                }
              });
              _map.plot(snap.key, toPlot, snap.child('hex').val());
            });
          });
        });
        /*firebase.database().ref('map/' + snap.key + '/points').orderByKey().endAt(""+y).limitToLast(1).on('value', function (s) {
          s.forEach(function (xt) {
            xt.forEach(function (x) {
              //xtt.forEach(function (x) {
                alert(snap.key + '\n\n' + JSON.stringify(x.exportVal()));
                if (x.exists() && (x.child('end').val() == undefined || x.child('end').val() == null || x.child('end').val() == false)) {
                  var plo = [];
                  s.forEach(function (c) {
                    $.each(c.exportVal(), function(k, v) {
                      if (v != true) {
                        var ar = $.map(v[0], function(value, index) {
                          return [value];
                        });
                        plo.push(ar);
                      }
                    });
                  });
                  alert(JSON.stringify(plo));
                  _map.plot(snap.key, plo, snap.child('hex').val());
                }
              //});
            });
          });
        });*/
      });
    });
  },
  plot: function(id, p, c) {
    var text = "";
    var possible = "0123456789";
    for( var i=0; i < 10; i++ ) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    p.push(p[0]);
    var temp = {
      'type': 'geojson',
      'data': {
        'type': 'Feature',
        'properties': {
          'name': id + text
        },
        'geometry': {
          'type': 'Polygon',
          'coordinates': [p]
        }
      }
    };
    mapbox.addSource(id + text, temp);
    mapbox.addLayer({
      'id': id + text,
      'type': 'fill',
      'source': id + text,
      'layout': {},
      'paint': {
        'fill-color': '#'+c,
        'fill-opacity': 0.8
      }
    });
    layerIds.push(id + text);
  },
  click: function (e) {
    var features = mapbox.queryRenderedFeatures(e.point, { layers: layerIds });
    if (!features.length) {
      return;
    }

    var feature = features[0];
    selectC = (feature.properties.name).replace(/[0-9]/g, '');
    _map.view((feature.properties.name).replace(/[0-9]/g, ''));
  },
  view: function (c) {
    try {
      mapbox.removeControl(Draw);
    } catch (e) {}
    oUid = c;
    firebase.database().ref('map/' + c).once('value').then(function (s) {
      $("#_tools").prop('style', 'display:none;');
      $("#_view").prop('style', '');
      $("#vcon").text(s.child('name').val());
      $("#vloc").text(s.child('local_name').val());
      $("#vgov").text(s.child('gov').val());
      $("#vrul").text(s.child('ruler').val());
      $('#edit').prop('style', '');
      $('#vcha').text('');
      s.child('points').forEach(function (territory_snap) {
        if (typeof territory_snap.val()['end'] === 'undefined' || territory_snap.val()['end'] == false) {
          $('#vcha').append('<div class="bookmrk" onclick="$(\'#timeline\').val($(this).text());$(\'#t_year\').text($(this).text());_map.year($(\'#t_year\').text());">' + territory_snap.key + '</div>');
        } else {
          $('#vcha').append('<div class="bookmrk" onclick="$(\'#timeline\').val($(this).text());$(\'#t_year\').text($(this).text());_map.year($(\'#t_year\').text());">' + territory_snap.key + ' (end)</div>');
        }
        console.log(territory_snap.val());
      })
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

var Draw = new MapboxDraw({
  controls: {
    'point': false,
    'line_string': false,
    //'polygon': false,
    'combine_features': false,
    'uncombine_features': false
  }
});

mapbox.on('load', _map.ready);

mapbox.on('click', _map.click);

mapbox.on('mousemove', function (e) {
  var features = mapbox.queryRenderedFeatures(e.point, { layers: layerIds });
  mapbox.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
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
var coords = [];
var eCoords;

var errs = false;
var uid;
var oUid;

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
      mapbox.addControl(Draw);
      if (!create) {
        //TODO:50 wipe map and display points for country
        //NOTE Keep revisions in root fb
        firebase.database().ref('map/' + selectC).once('value').then(function (s) {
          $('#tname').val(s.child('name').val());
          $('#tlname').val(s.child('local_name').val());
          $('#truler').val(s.child('ruler').val());
          $("#tgov option").filter(function() {
            return this.text == s.child('gov').val();
          }).prop('selected', true);
          $('#tcol').val(s.child('hex').val());
          $('#tid').val(selectC);
        });
        $('#ptadd').prop('disabled', 'disabled');
        $("#ptdone").prop('disabled', false);
      }
      $("#_tools").attr('style', '');
      $("#_view").attr('style', 'display:none;');
    } else {
      alert('Please sign in');
    }
  },
  addPt: function() {
    if (ptI > -1) {
      coords.push(pt_geojson[pointIds[ptI]].features[0].geometry.coordinates);
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
$('#ptadd_c').click(function () {
  $("#ptdone").prop('disabled', false);
  $("#_tools > center").html('<input type="text">')
  //eCoords = JSON.parse("[" + prompt('Enter coordinate data here [[0, 0], [1,1]]:') + "]");
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
      hex: $("#tcol").val()
    };
    if (confirm('Does this data look correct?\n' + JSON.stringify(dat))) {
      if (typeof pt_geojson[pointIds[ptI]] !== 'undefined') {
        firebase.database().ref('map/'+uid).update(dat);
        coords.push(pt_geojson[pointIds[ptI]].features[0].geometry.coordinates);
        if ($('#tdat_e').val() != 2016) {
          firebase.database().ref('map/'+uid).child('points').child($('#tdat_e').val()).set({end: true});
        }
        if (typeof eCoords == 'undefined') {
          firebase.database().ref('map/'+uid).child('points').child(year).set(coords);
        } else {
          alert('this shouldnt happen');
          console.log(eCoords);
          firebase.database().ref('map/'+uid).child('points').child(year).set(eCoords[0]);
        }
      } else {
        if (typeof eCoords != 'undefined') {
          if (oUid == $('#tid').val()) {
            if ($('#tdat_e').val() != 2016) {
              firebase.database().ref('map/'+uid).child('points').child($('#tdat_e').val()).set({end: true});
            }
            firebase.database().ref('map/'+oUid).update(dat);
            firebase.database().ref('map/'+oUid).child('points').child(year).set(eCoords[0]);
          } else {
            if ($('#tdat_e').val() != 2016) {
              firebase.database().ref('map/'+uid).child('points').child($('#tdat_e').val()).set({end: true});
            }
            firebase.database().ref('map/'+uid).update(dat);
            firebase.database().ref('map/'+uid).child('points').child(year).set(eCoords[0]);
          }
        } else {
          firebase.database().ref('map/'+oUid).update(dat);
        }
      }
      alert('Country created!');
      if (!(document.URL).contains('localhost')) {
        window.location.href = document.URL;
      }
    }
  }
});

//TODO:0 add more checks + don't let user create country
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
