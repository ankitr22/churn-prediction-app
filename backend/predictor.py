import joblib
import pandas as pd
import io
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, 'model_training', 'model.pkl')
PREPROCESSOR_PATH = os.path.join(BASE_DIR, 'model_training', 'preprocessor.pkl')

def predict_churn(file_content: bytes, filename: str) -> bytes:
    try:
        # Load models from model_training folder
        model = joblib.load(MODEL_PATH)
        preprocessor = joblib.load(PREPROCESSOR_PATH)
    except Exception as e:
        raise Exception(f"Failed to load model artifacts: {e}")

    if filename.endswith('.csv'):
        df = pd.read_csv(io.BytesIO(file_content))
    elif filename.endswith(('.xls', '.xlsx')):
        df = pd.read_excel(io.BytesIO(file_content))
    else:
        raise Exception("Unsupported file format for prediction")

    
    # Store original data structure to append results later
    original_df = df.copy()

    # Preprocessing
    if 'TotalCharges' in df.columns:
        df['TotalCharges'] = pd.to_numeric(df['TotalCharges'], errors='coerce')
        # Fill missing with median or 0 to not drop rows for user upload
        df['TotalCharges'] = df['TotalCharges'].fillna(df['TotalCharges'].median() if not df['TotalCharges'].isnull().all() else 0)

    if 'customerID' in df.columns:
        df_mod = df.drop(columns=['customerID'])
    else:
        df_mod = df

    if 'Churn' in df_mod.columns:
        df_mod = df_mod.drop(columns=['Churn'])

    try:
        X_preprocessed = preprocessor.transform(df_mod)
        predictions = model.predict(X_preprocessed)
    except Exception as e:
        raise Exception(f"Prediction failed, ensure CSV format matches training data: {e}")

    # Map predictions back to Yes/No
    pred_labels = ['Yes' if p == 1 else 'No' for p in predictions]
    original_df['Churn_Prediction'] = pred_labels

    output = io.StringIO()
    original_df.to_csv(output, index=False)
    return output.getvalue().encode('utf-8')
