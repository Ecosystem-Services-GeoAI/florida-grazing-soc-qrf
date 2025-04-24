//PRISM Long-Term Average Climate Dataset Norm91m
//https://developers.google.com/earth-engine/datasets/catalog/OREGONSTATE_PRISM_Norm91m#description

//ppt – Monthly total precipitation (mm), including rain and melted snow
//tmean – Monthly average of daily mean temperature (°C), calculated as (tmin + tmax) / 2
//tmin – Monthly minimum temperature (°C)
//tmax – Monthly average of daily maximum temperature (°C)
//tdmean – Monthly average of daily mean dew point temperature (°C)
//vpdmin – Monthly average of daily minimum vapor pressure deficit (hPa)
//vpdmax – Monthly average of daily maximum vapor pressure deficit (hPa)

// Import the PRISM Long-Term Average Climate Dataset
var dataset = ee.ImageCollection('OREGONSTATE/PRISM/Norm91m');

// Select precipitation data
var ppt = dataset.select('ppt');
var tmean = dataset.select('tmean');
var tmin = dataset.select('tmin');
var tmax = dataset.select('tmax');
var tdmean = dataset.select('tdmean');
var vpdmin = dataset.select('vpdmin');
var vpdmax = dataset.select('vpdmax');
var solclear = dataset.select('solclear');
var solslope = dataset.select('solslope');
var soltotal = dataset.select('soltotal');
var soltrans = dataset.select('soltrans');

// Clip the precipitation collection to the Florida boundary
var pptCollection = ppt.map(function(image) {
  return image.clip(FL);
});
var tmeanCollection = tmean.map(function(image) {
  return image.clip(FL);
});
var tminCollection = tmin.map(function(image) {
  return image.clip(FL);
});
var tmaxCollection = tmax.map(function(image) {
  return image.clip(FL);
});
var tdmeanCollection = tdmean.map(function(image) {
  return image.clip(FL);
});
var vpdminCollection = vpdmin.map(function(image) {
  return image.clip(FL);
});
var vpdmaxCollection = vpdmax.map(function(image) {
  return image.clip(FL);
});
var solclearCollection = solclear.map(function(image) {
  return image.clip(FL);
});
var solslopeCollection = solslope.map(function(image) {
  return image.clip(FL);
});
var soltotalCollection = soltotal.map(function(image) {
  return image.clip(FL);
});
var soltransCollection = soltrans.map(function(image) {
  return image.clip(FL);
});

// Visualization parameters
var pptVis = {
  min: 0.0,
  max: 1050.0,
  palette: ['red', 'yellow', 'green', 'cyan', 'purple'],
};

// Center the map on the calculated centroid of Florida
Map.setCenter(-81.06, 27.284, 6);

// Add the first precipitation layer to the map for visualization
Map.addLayer(pptCollection.first(), pptVis, 'Precipitation');

// Function to export each image in the collection
var exportMonthlyImages = function(collection, region, folder, prefix) {
  var count = collection.size().getInfo(); // Get the number of images in the collection

  // Iterate through each image in the collection
  for (var i = 0; i < count; i++) {
    var image = ee.Image(collection.toList(count).get(i));
    var month = image.date().format('MM').getInfo(); // Get the month of the image

    // Export the image to Google Drive
    Export.image.toDrive({
      image: image,
      description: prefix + '_' + month,
      folder: folder,
      region: region.geometry().bounds(),
      scale: 928, // Image spatial resolution in meters: 928 meters
      maxPixels: 1e13,
      crs: 'EPSG:4326'
    });
  }
};

// Export each monthly precipitation image
exportMonthlyImages(pptCollection, FL, 'SOC_FL_Rangelands/Jiayi_Song/20240514','ppt');
print('pptCollection:', pptCollection);
exportMonthlyImages(tmeanCollection, FL, 'SOC_FL_Rangelands/Jiayi_Song/20240514','tmean');
print('tmeanCollection:', tmeanCollection);
exportMonthlyImages(tminCollection, FL, 'SOC_FL_Rangelands/Jiayi_Song/20240514','tmin');
print('tminCollection:', tminCollection);
exportMonthlyImages(tmaxCollection, FL, 'SOC_FL_Rangelands/Jiayi_Song/20240514','tmax');
print('tmaxCollection:', tmaxCollection);
exportMonthlyImages(tdmeanCollection, FL, 'SOC_FL_Rangelands/Jiayi_Song/20240514','tdmean');
print('tdmeanCollection:', tdmeanCollection);
exportMonthlyImages(vpdminCollection, FL, 'SOC_FL_Rangelands/Jiayi_Song/20240514','vpdmin');
print('vpdminCollection:', vpdminCollection);
exportMonthlyImages(vpdmaxCollection, FL, 'SOC_FL_Rangelands/Jiayi_Song/20240514','vpdmax');
print('vpdmaxCollection:', vpdmaxCollection);
exportMonthlyImages(solclearCollection, FL, 'SOC_FL_Rangelands/Jiayi_Song/20240514','solclear');
print('solclearCollection:', solclearCollection);
exportMonthlyImages(solslopeCollection, FL, 'SOC_FL_Rangelands/Jiayi_Song/20240514','solslope');
print('solslopeCollection:', solslopeCollection);
exportMonthlyImages(soltotalCollection, FL, 'SOC_FL_Rangelands/Jiayi_Song/20240514','soltotal');
print('soltotalCollection:', soltotalCollection);
exportMonthlyImages(soltransCollection, FL, 'SOC_FL_Rangelands/Jiayi_Song/20240514','soltrans');
print('soltransCollection:', soltransCollection);
