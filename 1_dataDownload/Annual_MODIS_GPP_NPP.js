//MOD17A3HGF.061: Terra Net Primary Production Gap-Filled Yearly Global 500m
//https://developers.google.com/earth-engine/datasets/catalog/MODIS_061_MOD17A3HGF#description

// Define the time period for the dataset
var startDate = ee.Date('2001-01-01');
var endDate = ee.Date('2023-01-01');

// 'Gpp'，'Npp'，
var dataset = ee.ImageCollection('MODIS/061/MOD17A3HGF')
                .filterDate(startDate, endDate)
                .select('Npp');

print('Dataset Collection:', dataset);

// Import the Florida state boundary from the TIGER dataset
var FL = ee.FeatureCollection('TIGER/2018/States')
            .filter(ee.Filter.inList("NAME", ['Florida']));
            
var dataset = dataset.map(function(image) {
  return image.clip(FL);
});

var visualization = {
  min: 0,
  max: 19000,
  palette: ['bbe029', '0a9501', '074b03']
};

Map.setCenter(6.746, 46.529, 3);

Map.addLayer(dataset, visualization, 'NPP');

// Function to export each image in the collection
var exportMonthlyImages = function(collection, region, folder, prefix) {
  var count = collection.size().getInfo(); // Get the number of images in the collection

  // Iterate through each image in the collection
  for (var i = 0; i < count; i++) {
    var image = ee.Image(collection.toList(count).get(i));
    var year = image.date().format('YYYY').getInfo(); // Get the year of the image

    // Export the image to Google Drive
    Export.image.toDrive({
      image: image,
      description: prefix + '_' + year,
      folder: folder,
      region: region.geometry().bounds(),
      scale: 500, // Image spatial resolution in meters: 928 meters
      maxPixels: 1e13,
      crs: 'EPSG:4326'
    });
  }
};

// Export each annualy image
exportMonthlyImages(dataset, FL, 'SOC_FL_Rangelands/Jiayi_Song/20240625','NPP');
