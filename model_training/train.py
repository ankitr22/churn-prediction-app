import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from imblearn.over_sampling import SMOTE
from sklearn.neural_network import MLPClassifier
from sklearn.metrics import accuracy_score
import joblib
import os

def main():
    print("Loading data...")
    # Load Data (Relative path assuming script runs from model_training dir)
    df = pd.read_csv('../repo/TelcoCustomerChurn.csv')

    print("Preprocessing...")
    # Preprocessing TotalCharges
    df['TotalCharges'] = pd.to_numeric(df['TotalCharges'], errors='coerce')
    df.dropna(subset=['TotalCharges'], inplace=True) # Drops 11 rows

    # Drop ID
    df.drop(columns=['customerID'], inplace=True)

    X = df.drop(columns=['Churn'])
    y = df['Churn'].map({'Yes': 1, 'No': 0})

    # Columns distinction
    categorical_cols = X.select_dtypes(include=['object']).columns.tolist()
    numeric_cols = X.select_dtypes(include=['int64', 'float64']).columns.tolist()

    # Create Preprocessor pipeline
    # Use sparse_output=False for scikit-learn >= 1.2, or sparse=False for < 1.2
    try:
        cat_encoder = OneHotEncoder(handle_unknown='ignore', sparse_output=False)
    except TypeError:
        cat_encoder = OneHotEncoder(handle_unknown='ignore', sparse=False)
        
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numeric_cols),
            ('cat', cat_encoder, categorical_cols)
        ],
        sparse_threshold=0
    )

    print("Fitting preprocessor...")
    X_preprocessed = preprocessor.fit_transform(X)

    # Train Test Split
    print("Splitting data...")
    X_train, X_test, y_train, y_test = train_test_split(X_preprocessed, y, test_size=0.2, random_state=42)

    # SMOTE
    print("Applying SMOTE...")
    smote = SMOTE(random_state=42)
    X_train_res, y_train_res = smote.fit_resample(X_train, y_train)

    print("Building ANN Model (MLPClassifier)...")
    # ANN via scikit-learn
    model = MLPClassifier(
        hidden_layer_sizes=(64, 32), 
        activation='relu', 
        solver='adam', 
        max_iter=500,
        random_state=42,
        early_stopping=True,
        validation_fraction=0.2
    )

    print("Training Model...")
    model.fit(X_train_res, y_train_res)

    print("Evaluating Model...")
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Test Accuracy: {accuracy:.4f}")

    # Save artifacts
    print("Saving model and preprocessor...")
    joblib.dump(preprocessor, 'preprocessor.pkl')
    joblib.dump(model, 'model.pkl')
    
    print("Done! Artifacts saved in model_training/")

if __name__ == "__main__":
    main()
