import rasterio
from rasterio.warp import calculate_default_transform, reproject, Resampling
import os
from pyproj import Transformer
import pandas as pd
import numpy as np
from shutil import copy2



def convert_crs(input_tiff, output_tiff, target_crs='EPSG:5070'):
    with rasterio.open(input_tiff) as src:
        # If the TIFF does not have a CRS, assume it to be EPSG:4326
        if src.crs:
            pass
            # copy2(input_tiff, out_folder)
        else:
            src_crs = target_crs
            # Calculate the transform and new dimensions for the target CRS
            transform, width, height = calculate_default_transform(
                src_crs, target_crs, src.width, src.height, *src.bounds)
            
            # Update the metadata with the new CRS and dimensions
            kwargs = src.meta.copy()
            kwargs.update({
                'crs': target_crs,
                'transform': transform,
                'width': width,
                'height': height
            })
            
            with rasterio.open(output_tiff, 'w', **kwargs) as dst:
                for i in range(1, src.count + 1):
                    reproject(
                        source=rasterio.band(src, i),
                        destination=rasterio.band(dst, i),
                        src_transform=src.transform,
                        src_crs=src_crs,
                        dst_transform=transform,
                        dst_crs=target_crs,
                        resampling=Resampling.nearest)


def process_addCRS_Tiff(geotiff_folder, out_folder, target_crs='EPSG:5070'):
    tiff_list = os.listdir(geotiff_folder)
    for tif in tiff_list:
        if tif.endswith(".tif") and not tif.startswith("."):
            tif_path = os.path.join(geotiff_folder,tif)
            out_path = os.path.join(out_folder,tif)
            print(f'add {target_crs} to {tif_path}, save to {out_path}')
            convert_crs(tif_path, out_path)


def extract_value_from_tiff(tiff_path, lon, lat):
    # Define the transformer to convert from EPSG:4326 to EPSG:5070
    transformer = Transformer.from_crs("EPSG:4326", "EPSG:5070", always_xy=True)
    
    # Transform the coordinates
    x, y = transformer.transform(lon, lat)
    
    # Open the TIFF file
    with rasterio.open(tiff_path) as src:
        # Transform the coordinates to the raster space
        row, col = src.index(x, y)
        
        # Extract the value
        value = src.read(1)[row, col]  # Assumes band 1, adjust if necessary
    
    return value

# Function to process all geotiff files and update CSV file
def process_geotiff_files_point(geotiff_folder, csv_file, out_name):
    # Read CSV file into a DataFrame
    df = pd.read_csv(csv_file)

    # Iterate over each geotiff file in the folder
    for filename in os.listdir(geotiff_folder):
        if filename.endswith(".tif") and not filename.startswith("."):
            geotiff_path = os.path.join(geotiff_folder, filename)
            # Open the TIFF file
            new_col = []
            print(f'now extract points from tiff {filename}')
            # Define the transformer to convert from EPSG:4326 to EPSG:5070
            transformer = Transformer.from_crs("EPSG:4326", "EPSG:5070", always_xy=True)
            with rasterio.open(geotiff_path) as src:
                for i in range(len(df)):
                    lon = df.loc[i,'Longitude']
                    lat = df.loc[i, 'Latitude']
                    print(f'now extract points: lon_{lon}_lat_{lat} from tiff {filename}')
                    x, y = transformer.transform(lon, lat)
                    row, col = src.index(x, y)
                    # Extract the value
                    value = src.read(1)[row, col]
                    new_col.append(value) 

            # Extract values for each GPS coordinate and add to DataFrame
            column_name = os.path.splitext(filename)[0]  # Use filename as column name
            df[column_name] = new_col

    # Save updated DataFrame to CSV
    out_file = os.path.join(geotiff_folder, f"{out_name}.csv")
    df.to_csv(out_file, index=False)



if __name__ == "__main__":
    # Example usage
    # tiff_path = "./SOLUS100_test/CRS5070_caco3_r_0_ptdensity_per_cell.tif"
    # longitude = -80.67329676  # Example longitude
    # latitude = 26.48961823   # Example latitude

    # value = extract_value_from_tiff(tiff_path, longitude, latitude)
    # print(f"Extracted value: {value}")

    # # Example usage
    # input_tiff = './SOLUS100_test2/caco3_r_0_ptdensity_per_cell.tif'
    # output_tiff = './SOLUS100_process/CRS5070_caco3_r_0_ptdensity_per_cell.tif'
    # convert_crs(input_tiff, output_tiff)
    # geotiff_folder = './envtiff_summary/SOLUS100'
    # out_folder = './envtiff_summary/SOLUS100_process'
    # process_addCRS_Tiff(geotiff_folder=geotiff_folder, out_folder=out_folder)

    geotiff_folder = './envtiff_summary/SOLUS100/SOLUS100_tran'
    # csv_file = './Planet/data_tables/SOC_2008_2009.csv'
    # csv_file = './SOC_harmonization/CattleFarm/SOC_top-layer_modeling.csv'
    csv_file = './3_Pooling/pooling_all.csv'
    out_name = "pooling_all_solus"
    process_geotiff_files_point(geotiff_folder=geotiff_folder, csv_file=csv_file, out_name=out_name)




