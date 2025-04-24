//SPL3SMP_E.005 SMAP L3 Radiometer Global Daily 9 km Soil Moisture
//https://developers.google.com/earth-engine/datasets/catalog/NASA_SMAP_SPL3SMP_E_005#description\
//Average on 16 to 23

var dataset16 = ee.ImageCollection('NASA/SMAP/SPL3SMP_E/005')
                  .filter(ee.Filter.date('2016-12-01', '2016-12-30'));

var dataset17 = ee.ImageCollection('NASA/SMAP/SPL3SMP_E/005')
                  .filter(ee.Filter.date('2017-12-01', '2017-12-30'));
                  
var dataset18 = ee.ImageCollection('NASA/SMAP/SPL3SMP_E/005')
                  .filter(ee.Filter.date('2018-12-01', '2018-12-30'));
                  
var dataset19 = ee.ImageCollection('NASA/SMAP/SPL3SMP_E/005')
                  .filter(ee.Filter.date('2019-12-01', '2019-12-30'));
                  
var dataset20 = ee.ImageCollection('NASA/SMAP/SPL3SMP_E/005')
                  .filter(ee.Filter.date('2020-12-01', '2020-12-30'));
                  
var dataset21 = ee.ImageCollection('NASA/SMAP/SPL3SMP_E/005')
                  .filter(ee.Filter.date('2021-12-01', '2021-12-30'));

var dataset22 = ee.ImageCollection('NASA/SMAP/SPL3SMP_E/005')
                  .filter(ee.Filter.date('2022-12-01', '2022-12-30'));

var dataset23 = ee.ImageCollection('NASA/SMAP/SPL3SMP_E/005')
                  .filter(ee.Filter.date('2023-12-01', '2023-12-30'));

var FL = ee.FeatureCollection('TIGER/2018/States')
            .filter(ee.Filter.inList("NAME", ['Florida']));

var clippeddataset16 = dataset16.map(function(image) {
  return image.clip(FL);
});

var clippeddataset17 = dataset17.map(function(image) {
  return image.clip(FL);
});

var clippeddataset18 = dataset18.map(function(image) {
  return image.clip(FL);
});

var clippeddataset19 = dataset19.map(function(image) {
  return image.clip(FL);
});

var clippeddataset20 = dataset20.map(function(image) {
  return image.clip(FL);
});

var clippeddataset21 = dataset21.map(function(image) {
  return image.clip(FL);
});

var clippeddataset22 = dataset22.map(function(image) {
  return image.clip(FL);
});

var clippeddataset23 = dataset23.map(function(image) {
  return image.clip(FL);
});

var soilMositureSurface16 = clippeddataset16.select('soil_moisture_am');

var soilMoistureSurfaceMean16 = soilMositureSurface16.mosaic();

var soilMositureSurface17 = clippeddataset17.select('soil_moisture_am');

var soilMoistureSurfaceMean17 = soilMositureSurface17.mosaic();

var soilMositureSurface18 = clippeddataset18.select('soil_moisture_am');

var soilMoistureSurfaceMean18 = soilMositureSurface18.mosaic();

var soilMositureSurface19 = clippeddataset19.select('soil_moisture_am');

var soilMoistureSurfaceMean19 = soilMositureSurface19.mosaic();

var soilMositureSurface20 = clippeddataset20.select('soil_moisture_am');

var soilMoistureSurfaceMean20 = soilMositureSurface20.mosaic();

var soilMositureSurface21 = clippeddataset21.select('soil_moisture_am');

var soilMoistureSurfaceMean21 = soilMositureSurface21.mosaic();

var soilMositureSurface22 = clippeddataset22.select('soil_moisture_am');

var soilMoistureSurfaceMean22 = soilMositureSurface22.mosaic();

var soilMositureSurface23 = clippeddataset23.select('soil_moisture_am');

var soilMoistureSurfaceMean23 = soilMositureSurface23.mosaic();

var combinedImageCollection = ee.ImageCollection([soilMoistureSurfaceMean16, soilMoistureSurfaceMean17, soilMoistureSurfaceMean18, soilMoistureSurfaceMean19, soilMoistureSurfaceMean20, soilMoistureSurfaceMean21, soilMoistureSurfaceMean22, soilMoistureSurfaceMean23]);

var finalCompositeImage = combinedImageCollection.mosaic();

var soilMositureSurfaceVis = {
  min: 0.0,
  max: 0.5,
  palette: ['0300ff', '418504', 'efff07', 'efff07', 'ff0303'],
};
Map.setCenter(-6.746, 46.529, 2);
Map.addLayer(finalCompositeImage, soilMositureSurfaceVis, 'Soil Mositure');

print(finalCompositeImage,"finalCompositeImage")

Export.image.toDrive({
  image: finalCompositeImage,
  description: 'finalCompositeImage_12',
  folder: 'SOC_FL_Rangelands',
  fileNamePrefix: 'finalCompositeImage_12', 
  region: FL.geometry(), 
  scale: 9000, 
  crs: 'EPSG:4326'
});
