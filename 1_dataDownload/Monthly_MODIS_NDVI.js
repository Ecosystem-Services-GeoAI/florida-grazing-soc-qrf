// Load the NDVI dataset and filter by date
var dataset07 = ee.ImageCollection('LANDSAT/COMPOSITES/C02/T1_L2_32DAY_NDVI')
                  .filterDate('2007-05-01', '2007-05-30');
var dataset07 = dataset07.select('NDVI');

var dataset06 = ee.ImageCollection('LANDSAT/COMPOSITES/C02/T1_L2_32DAY_NDVI')
                  .filterDate('2006-05-01', '2006-05-30');
var dataset06 = dataset06.select('NDVI');

var dataset05 = ee.ImageCollection('LANDSAT/COMPOSITES/C02/T1_L2_32DAY_NDVI')
                  .filterDate('2005-05-01', '2005-05-30');
var dataset05 = dataset05.select('NDVI');

// Visualization parameters
var colorizedVis = {
  min: 0,
  max: 1,
  palette: [
    'ffffff', 'ce7e45', 'df923d', 'f1b555', 'fcd163', '99b718', '74a901',
    '66a000', '529400', '3e8601', '207401', '056201', '004c00', '023b01',
    '012e01', '011d01', '011301'
  ],
};

// Load the feature collection for Florida
var FL = ee.FeatureCollection('TIGER/2018/States')
            .filter(ee.Filter.inList("NAME", ['Florida']));
            
// Clip the dataset to the region of interest
var clippedDataset07 = dataset07.map(function(image) {
  return image.clip(FL);
});

var clippedDataset06 = dataset06.map(function(image) {
  return image.clip(FL);
});

var clippedDataset05 = dataset05.map(function(image) {
  return image.clip(FL);
});

var compositeImage07 = clippedDataset07.mosaic();
var compositeImage06 = clippedDataset06.mosaic();
var compositeImage05 = clippedDataset05.mosaic();

var combinedImageCollection = ee.ImageCollection([compositeImage07, compositeImage06, compositeImage05]);

var finalCompositeImage = combinedImageCollection.mosaic();

// Add the composite image to the map
Map.addLayer(finalCompositeImage, colorizedVis, 'Composite NDVI');

// Function to export the composite image
var exportCompositeImage = function(image, region, folder, prefix) {
  // Export the image to Google Drive
  Export.image.toDrive({
    image: image,
    description: prefix + '_composite',
    folder: folder,
    region: region.geometry().bounds(),
    scale: 30, // Image spatial resolution in meters 30 meters
    maxPixels: 1e13,
    crs: 'EPSG:4326'
  });
};

// Export the composite NDVI image
exportCompositeImage(finalCompositeImage, FL, 'SOC_FL_Rangelands/Jiayi_Song/20240717', '2007_05');
print('Composite NDVI Image:', finalCompositeImage);
