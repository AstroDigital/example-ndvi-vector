/* global L adNdviData */
'use strict'

// Function used to initialize a Leaflet map component containing a polygon layer
const setupMap = (fieldPolys, mbAccessToken) => {
  /* Initialize a map with a satellite image base layer, and place it within
  the div called "map". It is necessary to define a temporary viewing lat/long,
  which we will later overwrite using the boundaries of the field polygons. */
  const basemapUrl = 'http://api.tiles.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.png';
  const map = L.map('map').setView([0, 0], 0);
  L.tileLayer(`${basemapUrl}?access_token=${mbAccessToken}`).addTo(map);
  // Add the field polygons to the map.
  fieldPolys.addTo(map);
  // Force the map view to zoom to the field polygon boundaries.
  map.fitBounds(fieldPolys.getBounds());
}

/ !!! PROGRAM BEGINS HERE !!! /

/* The NDVI values response includes a "results" attribute, which is an array
of json related to each input polygon. Each feature in this array represents
an input polygon and contains two attributes that we will most likely need to
create a map: a numerical "id" and a "value," which consists of GeoJSON
representing the geometry and NDVI value properties for that field.

To create a FeatureCollection from this data, map over its results attribute
and extract the id and values for each field. Insert the output array into
simple GeoJSON FeatureCollection boilerplate, and convert the entire GeoJSON
object to a Leaflet layer, as shown below. */
let fieldPolys = L.geoJson({
  'type': 'FeatureCollection',
  'features': adNdviData.results.map((field) => {
    const id = field.id;
    field = field.value;
    field.properties.id = id;
    return field;
  })
});

/* Once a FeatureCollection has been created, it can be mapped using the
Leaflet.js plugin, as demonstrated in the setupMap function.

Set the Mapbox access token to your personal Mapbox token, as generated at the
Mapbox website (https://www.mapbox.com/studio/account/tokens/). */
const mbAccessToken = 'pk.eyJ1IjoiYXN0cm9kaWdpdGFsIiwiYSI6ImNVb1B0ZkEifQ.IrJoULY2VMSBNFqHLrFYew';
// Run the setupMap function.
setupMap(fieldPolys, mbAccessToken);
