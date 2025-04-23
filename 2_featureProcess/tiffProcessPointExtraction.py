import os
import csv
import rasterio
from rasterio.merge import merge
from collections import defaultdict
import pandas as pd
import numpy as np

# Function to extract pixel value from geotiff based on GPS coordinates
def extract_value_from_geotiff(geotiff_path, lon, lat):
    with rasterio.open(geotiff_path) as src:
        row, col = src.index(lon, lat)
        # print(f"row is {row}, col is {col} in lon {lon}, lat {lat}")
        value = src.read(1, window=((row, row+1), (col, col+1)))
        if len(value[0]) < 1:
            print("empty")
            return None
        else:
            return value[0][0]

# Function to process all geotiff files and update CSV file
def process_geotiff_files_point(geotiff_folder, csv_file, out_name):
    # Read CSV file into a DataFrame
    df = pd.read_csv(csv_file)

    # Iterate over each geotiff file in the folder
    for filename in os.listdir(geotiff_folder):
        if filename.endswith(".tif"):
            print(f"start tiff {filename}")
            geotiff_path = os.path.join(geotiff_folder, filename)
            # Extract values for each GPS coordinate and add to DataFrame
            column_name = os.path.splitext(filename)[0]  # Use filename as column name
            df[column_name] = df.apply(lambda row: extract_value_from_geotiff(geotiff_path, row['Longitude'], row['Latitude']), axis=1)

    # Save updated DataFrame to CSV
    
    out_file = f"{out_name}.csv"
    df.to_csv(out_file, index=False)



if __name__ == "__main__":
    print("11111")
    # geotiff_folder = './Planet/tif_surgo/allFL'
    # geotiff_folder = './Planet/tif_LULC'
    # csv_file = './Planet/data_tables/SOC_2008_2009.csv'
    # out_name = "LULC_FFWCC"

    # geotiff_folder = './1978-2008_30_year_PRISM Long-Term Average Climate/all'
    # csv_file = './Planet/data_tables/SOC_2008_2009.csv'
    # out_name = "prism_1978-2008"

    # geotiff_folder = './soilMoisture'
    # csv_file = './Planet/data_tables/SOC_2008_2009.csv'
    # out_name = "soil_moisture"

    # geotiff_folder = './envtiff_summary/ssurgo'
    # geotiff_folder = './envtiff_summary/soilMoisture'
    # geotiff_folder = './envtiff_summary/annual Gross and Net Primary Productivity'
    # geotiff_folder = './envtiff_summary/1978-2008_30_year_PRISM Long-Term Average Climate'
    # geotiff_folder = './envtiff_summary/cropland_landcover'
    # geotiff_folder = './envtiff_summary/VIs'
    # geotiff_folder = './envtiff_summary/worldClim'
    # geotiff_folder = './envtiff_summary/mix'
    # csv_file = './Planet/data_tables/SOC_2008_2009.csv'
    # csv_file = './SOC_harmonization/CattleFarm/SOC_top-layer_modeling.csv'
    # geotiff_folder = './envtiff_summary/soilMoisture/average'
    # geotiff_folder = './envtiff_summary/new_20241118/'
    geotiff_folder = './envtiff_summary/new_20241125/'

    # csv_file = './modeling/featureProcess/20241021_ReOrganize/20241022_20cmSOC_LULCCheck_planet_reduceFeature.csv'
    csv_file = './modeling/featureProcess/20241021_ReOrganize/20241022_20cmSOC_LULCCheck_planet_reduceFeature.csv'
    
    out_name = "./modeling/featureProcess/20241021_ReOrganize/20241125_newfeatures"

    process_geotiff_files_point(geotiff_folder, csv_file, out_name=out_name)

    