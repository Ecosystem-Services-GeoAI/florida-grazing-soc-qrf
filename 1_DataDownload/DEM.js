//USGS 3DEP 10m National Map Seamless (1/3 Arc-Second) 
//https://developers.google.com/earth-engine/datasets/catalog/USGS_3DEP_10m

// Load in state boundaries and filter for the FL state
var FL = ee.FeatureCollection('TIGER/2018/States').filter(
    ee.Filter.inList("NAME", ['Florida']))

// Load the elevation dataset
var dataset = ee.Image('USGS/3DEP/10m');
var elevation = dataset.select('elevation');
var aspect = ee.Terrain.aspect(elevation);

print(aspect)

var clippedAspect = aspect.clip(FL);

// Set the map center
Map.setCenter(-81.06, 27.284, 6);

// Add the clipped elevation and slope layers to the map
Map.addLayer(clippedAspect, {
    min: 0,
    max: 3000,
    palette: [
        '3ae237', 'b5e22e', 'd6e21f', 'fff705', 'ffd611', 'ffb613', 'ff8b13',
        'ff6e08', 'ff500d', 'ff0000', 'de0101', 'c21301', '0602ff', '235cb1',
        '307ef3', '269db1', '30c8e2', '32d3ef', '3be285', '3ff38f', '86e26f'
    ]
}, 'Aspect');


Map.addLayer(clippedAspect, {
    min: 0,
    max: 360
}, 'Aspect');


Export.image.toDrive({
  image:  clippedAspect,
  description: 'aspect',
  folder: '1118/SOC_FL_Rangelands',
  region: FL,
  scale: 10, //image spatial resoluton in meter
  maxPixels: 1e13,
  crs: 'EPSG:4326'
});