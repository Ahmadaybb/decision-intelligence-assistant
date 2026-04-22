import joblib
import pandas as pd
import time

# Load model and config
print("Loading ML model...")
model = joblib.load('data/priority_model.joblib')
config = joblib.load('data/model_config.joblib')
feature_cols = config['feature_cols']

from backend.app.utils.features import extract_features

def predict_priority_ml(text: str) -> dict:
    start_time = time.time()
    
    # Extract features
    features = extract_features(text)
    features_df = pd.DataFrame([features])[feature_cols]
    
    # Predict
    prediction = model.predict(features_df)[0]
    confidence = model.predict_proba(features_df)[0][prediction]
    
    latency = time.time() - start_time
    
    return {
        'prediction': 'URGENT' if prediction == 1 else 'NORMAL',
        'confidence': round(float(confidence), 3),
        'latency': round(latency * 1000, 2)  # in milliseconds
    }