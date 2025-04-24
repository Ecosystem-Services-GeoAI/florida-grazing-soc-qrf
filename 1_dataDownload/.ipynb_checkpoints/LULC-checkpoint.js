//NLCD 2019: USGS National Land Cover Database, 2019 release
//https://developers.google.com/earth-engine/datasets/catalog/USGS_NLCD_RELEASES_2019_REL_NLCD

var FL = ee.FeatureCollection('TIGER/2018/States').filter(
    ee.Filter.inList("NAME", ['Florida']));

// Import the NLCD collection.
var dataset = ee.ImageCollection('USGS/NLCD_RELEASES/2019_REL/NLCD');

// The collection contains images for multiple years and regions in the USA.
print('Products:', dataset.aggregate_array('system:index'));

// Filter the collection to the 2016 product.
var nlcd2016 = dataset.filter(ee.Filter.eq('system:index', '2016')).first();

// Each product has multiple bands for describing aspects of land cover.
print('Bands:', nlcd2016.bandNames());

// // Select the land cover band.
var landcover = nlcd2016.select('landcover');


var cliplandcover = landcover.clip(FL);

// Display land cover on the map.
Map.setCenter(-81.06, 27.284, 6);
Map.addLayer(cliplandcover, null, 'Landcover');


Export.image.toDrive({
  image: cliplandcover, 
  description: 'landcover_2016',
  folder: 'SOC_FL_Rangelands',
  region: FL,
  scale: 30, // Image spatial resolution in meters
  maxPixels: 1e13,
  crs: 'EPSG:4326'
});