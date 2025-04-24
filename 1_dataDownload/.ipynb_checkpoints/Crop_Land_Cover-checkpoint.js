//USDA NASS Cropland Data Layers
//https://developers.google.com/earth-engine/datasets/catalog/USDA_NASS_CDL#bands
// Load in state boundaries and filter for the FL state
var FL = ee.FeatureCollection('TIGER/2018/States').filter(
    ee.Filter.inList("NAME", ['Florida']))

var dataset = ee.ImageCollection('USDA/NASS/CDL')
                  .filter(ee.Filter.date('2023-01-01', '2023-12-31'))
                  .first();
var cropLandcover = dataset.select('cropland');
var clippedLandcover = cropLandcover.clip(FL);



// Set the map center
Map.setCenter(-81.06, 27.284, 6);
Map.addLayer(clippedLandcover, {}, 'Crop Landcover');



Export.image.toDrive({
  image: clippedLandcover,
  description: 'cropLandcover_2023',
  folder: 'SOC_FL_Rangelands',
  region: FL,
  scale: 30, //image spatial resoluton in meter
  maxPixels: 1e13,
  crs: 'EPSG:4326'
});
