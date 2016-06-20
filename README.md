# Basic Astro Digital NDVI Vector Map Setup
[Working Example](https://rawgit.com/AstroDigital/example-ndvi-vector/master/example/index.html) | [Primary Code](https://github.com/AstroDigital/example-ndvi-vector/blob/master/example/ad-basic-map.js)

## Overview
This tutorial describes extracting vector data from the return of Astro Digital's NDVI values API, and rendering it as a map using the Leaflet Javascript framework. This basic setup step is a prerequisite for more advanced map treatment, and subsequent tutorials in this series will build on it to cover:
- [Symbolizing the NDVI vector product map](https://github.com/AstroDigital/example-ndvi-vector-symbology)
- [Synthesizing the vector and imagery NDVI products to create masked imagery](https://github.com/AstroDigital/example-field-mask) and
- [Graphing the NDVI values using Chart.js, and including precipitation as a secondary datasource](https://github.com/AstroDigital/example-ndvi-chart-plus).

## Procedure
### HTML
Begin by writing basic boilerplate HTML, containing a div called `#map` styled to fill the window, and including the Leaflet script and css support files in the header and links to the support data in the body, as shown in this [example](https://github.com/AstroDigital/example-ndvi-vector/blob/master/example/index.html).

This tutorial simulates the code modularization provided by production build systems such as [Require.js](http://requirejs.org/), by separating the NDVI data from the functional code using separate script imports in the body. The example program itself is located in the [ad-basic-map.js](https://github.com/AstroDigital/example-ndvi-vector/blob/master/example/ad-basic-map.js) file.

### Javascript
The NDVI values response includes a `results` attribute, which is an array in which each feature represents an input polygon containing two attributes that we will most likely need to create a map: a numerical `id` and a `value`. The value consists of GeoJSON describing the geometry of the feature, and properties describing its NDVI values over time.

To create a FeatureCollection from this data, map over the `results` attribute and extract the `id` and `values` for each feature. Insert the output array into simple GeoJSON `FeatureCollection` boilerplate, then convert the entire GeoJSON object to a Leaflet layer, as shown below:
```js
let fieldPolys = L.geoJson({
  'type': 'FeatureCollection',
  'features': adNdviData.results.map((field) => {
    const id = field.id;
    field = field.value;
    field.properties.id = id;
    return field;
  })
});
```
Once the layer has been created, it can easily be mapped using Leaflet. In order to take advantage of the satellite imagery basemap we will use in this example, you will need to create a free Mapbox account and obtain a public key at [this address](https://www.mapbox.com/studio/account/tokens).

Define the key in the body of the script, and send it and the feature data object to a Leaflet map initialization function that we will create in the next step:
```js
// Define the Mapbox key.
const mbAccessToken = 'pk.eyJ1IjoiYXN0cm9kaWdpdGFsIiwiYSI6ImNVb1B0ZkEifQ.IrJoULY2VMSBNFqHLrFYew';
// Run the setupMap function.
setupMap(fieldPolys, mbAccessToken);
```
The `setupMap` function in this example initializes a Leaflet map inside of the div called `#map`, adds a satellite imagery basemap provided by Mapbox, adds the Astro Digital vector data with default styling, and sets the map view to the footprint of the vector data:
```js
const setupMap = (fieldPolys, mbAccessToken) => {
  // Initialize a map with a satellite image base layer, and place it within
  // the div called "map". It is necessary to define a temporary starting lat/long,
  // which we will later overwrite using the boundaries of the field polygons.
  const basemapUrl = 'http://api.tiles.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.png';
  const map = L.map('map').setView([0, 0], 0);
  L.tileLayer(`${basemapUrl}?access_token=${mbAccessToken}`).addTo(map);
  // Add the field polygons to the map.
  fieldPolys.addTo(map);
  // Set the map view to the field polygon boundaries.
  map.fitBounds(fieldPolys.getBounds());
}
```
## Up Next
This basic map is lacking much of the utility we will want to derive from the Astro Digital NDVI product, but the boilerplate is the foundation from which more advanced examples will be built. Mapbox provides many excellent and inspirational mapping examples on [their site](https://www.mapbox.com/mapbox.js/example/v1.0.0/) using their forked version of Leaflet, and [up next](https://github.com/AstroDigital/example-ndvi-vector-symbology) we will cover adding a legend to this initial map in order to visualize NDVI intensity.
