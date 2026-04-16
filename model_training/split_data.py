import pandas as pd
from sklearn.model_selection import train_test_split
import os

def split_and_save():
    csv_path = '../repo/TelcoCustomerChurn.csv'
    test_path = '../repo/test_data.csv'
    
    print("Reading data...")
    df = pd.read_csv(csv_path)
    
    print("Splitting data (80% train, 20% test)...")
    train_df, test_df = train_test_split(df, test_size=0.2, random_state=42, stratify=df['Churn'])
    
    print("Saving splits...")
    train_df.to_csv(csv_path, index=False) # Overwrite old with 80% train
    test_df.to_csv(test_path, index=False) # Save 20% unseen test data
    
    print(f"Done! Train shape: {train_df.shape}, Test shape: {test_df.shape}")

if __name__ == '__main__':
    split_and_save()
