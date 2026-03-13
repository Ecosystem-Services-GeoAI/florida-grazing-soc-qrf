# Feature Engineering

This directory contains scripts for preparing environmental predictor variables used in the SOC prediction models. The workflow includes **time-series feature preprocessing** and **statistical feature selection** to generate the final set of environmental predictors used for model training.

The feature engineering process consists of two main steps:

1. **Time-series feature preprocessing**  
2. **Environmental variable selection using correlation clustering and VIF analysis**

---

## Files

### FeaturePreprocessing.ipynb

This notebook processes the **raw time-series raster features (GeoTIFF)** and derives the final **time-series indicators** used in the model.

The raw inputs consist of multi-temporal environmental variables (e.g., hydroclimate, soil moisture, vegetation indices). These rasters are transformed into temporally meaningful indicators that represent environmental dynamics relevant to soil organic carbon (SOC) processes.

The output of this step is a set of **processed time-series indicator rasters** used as candidate predictors.

---

### FeatureEngineering.ipynb

This notebook performs **statistical feature selection** on the full set of environmental variables to reduce redundancy and multicollinearity before model training.

The workflow includes:

1. **Pearson correlation-based clustering**


2. **Variance Inflation Factor (VIF) analysis**


This ensures the final predictor set:

- reduces redundancy  
- improves model stability  
- enhances interpretability of variable importance analyses (e.g., SHAP)

---

## Notes

All scripts are implemented as **Jupyter notebooks** to facilitate transparency and reproducibility.
