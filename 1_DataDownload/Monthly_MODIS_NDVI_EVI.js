//MOD13A3.061 Vegetation Indices Monthly L3 Global 1 km SIN Grid
//https://developers.google.com/earth-engine/datasets/catalog/MODIS_061_MOD13A3#description

// Import the Florida state boundary from the TIGER dataset
var FL = ee.FeatureCollection('TIGER/2018/States')
            .filter(ee.Filter.inList("NAME", ['Florida']));
            
// Import the Vegetation Indices Dataset
var dataset = ee.ImageCollection('MODIS/061/MOD13A3')
                  .filter(ee.Filter.date('2020-01-01', '2024-03-01'));

// Select Vegetation Indices data
var ndvi = dataset.select('NDVI');
var evi = dataset.select('EVI');

// Clip the precipitation collection to the Florida boundary
var ndviCollection = ndvi.map(function(image) {
  return image.clip(FL);
});
var eviCollection = evi.map(function(image) {
  return image.clip(FL);
});


var ndviVis = {
  min: 0,
  max: 9000,
  palette: [
    'ffffff', 'ce7e45', 'df923d', 'f1b555', 'fcd163', '99b718', '74a901',
    '66a000', '529400', '3e8601', '207401', '056201', '004c00', '023b01',
    '012e01', '011d01', '011301'
  ],
};
Map.setCenter(-81.06, 27.284, 6);
Map.addLayer(ndviCollection, ndviVis, 'NDVI');

// Function to export each image in the collection
var exportMonthlyImages = function(collection, region, folder, prefix) {
  var count = collection.size().getInfo(); // Get the number of images in the collection

  // Iterate through each image in the collection
  for (var i = 0; i < count; i++) {
    var image = ee.Image(collection.toList(count).get(i));
    var date = image.date(); // Retrieve the full date of the image
    var yearMonth = date.format('YYYY-MM').getInfo(); // Format to include both year and month

    // Export the image to Google Drive
    Export.image.toDrive({
      image: image,
      description: prefix + '_' + yearMonth,
      folder: folder,
      region: region.geometry().bounds(),
      scale: 1000, // Image spatial resolution in meters 1000 meters
      maxPixels: 1e13,
      crs: 'EPSG:4326'
    });
  }
};

// Export each monthly precipitation image
exportMonthlyImages(ndviCollection, FL, 'SOC_FL_Rangelands/Jiayi_Song/20240514','ndvi');
print('ndviCollection:', ndviCollection);
exportMonthlyImages(eviCollection, FL, 'SOC_FL_Rangelands/Jiayi_Song/20240514','evi');
print('eviCollection:', eviCollection);