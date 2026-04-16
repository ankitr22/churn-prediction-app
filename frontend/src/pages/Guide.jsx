import React from 'react';

const Guide = () => {
  return (
    <div className="page-container">
      <div className="glass-panel" style={{padding: '3rem', maxWidth: '800px', margin: '0 auto'}}>
        <h1 style={{marginBottom: '2rem', color: 'var(--primary-color)'}}>How to Use PreChurn AI</h1>
        
        <div style={{display: 'flex', flexDirection: 'column', gap: '2rem'}}>
          <section>
            <h3 style={{marginBottom: '1rem', color: 'var(--text-main)'}}>1. Data Requirements</h3>
            <p style={{color: 'var(--text-muted)', lineHeight: '1.6'}}>
              The Artificial Neural Network model requires data in the same format as the Telco Customer Churn dataset. 
              The following columns are expected:
            </p>
            <ul style={{color: 'var(--text-muted)', marginLeft: '1.5rem', marginTop: '0.5rem', lineHeight: '1.6'}}>
              <li><code>gender</code>, <code>SeniorCitizen</code>, <code>Partner</code>, <code>Dependents</code></li>
              <li><code>tenure</code> (months)</li>
              <li><code>PhoneService</code>, <code>MultipleLines</code></li>
              <li><code>InternetService</code>, <code>OnlineSecurity</code>, <code>OnlineBackup</code>, <code>DeviceProtection</code>, <code>TechSupport</code>, <code>StreamingTV</code>, <code>StreamingMovies</code></li>
              <li><code>Contract</code>, <code>PaperlessBilling</code>, <code>PaymentMethod</code></li>
              <li><code>MonthlyCharges</code>, <code>TotalCharges</code></li>
            </ul>
            <p style={{color: 'var(--text-muted)', lineHeight: '1.6', marginTop: '1rem'}}>
              Note: <code>customerID</code> and <code>Churn</code> columns are ignored if present.
            </p>
          </section>

          <section>
            <h3 style={{marginBottom: '1rem', color: 'var(--text-main)'}}>2. How the Prediction Works</h3>
            <p style={{color: 'var(--text-muted)', lineHeight: '1.6'}}>
              Once you upload your CSV file, our backend uses a Scikit-Learn Multilayer Perceptron (MLP) trained on historical telecommunications data. 
              The original training process utilized <strong>SMOTE</strong> to handle significant class imbalances in the original data.
            </p>
          </section>

          <section>
            <h3 style={{marginBottom: '1rem', color: 'var(--text-main)'}}>3. Understanding the Results</h3>
            <p style={{color: 'var(--text-muted)', lineHeight: '1.6'}}>
              When the prediction finishes, the system will download a new CSV file automatically. 
              This file will contain all your original data exactly as you provided it, with one crucial addition: a new column called <code>Churn_Prediction</code> containing either <strong>Yes</strong> or <strong>No</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Guide;
