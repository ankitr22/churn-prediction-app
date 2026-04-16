import React, { useState, useRef } from 'react';
import axios from 'axios';

const Home = () => {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile) => {
    if (selectedFile.name.endsWith('.csv') || selectedFile.name.endsWith('.xlsx')) {
      setFile(selectedFile);
      setError('');
    } else {
      setFile(null);
      setError('Please upload a valid CSV or Excel file.');
    }
  };

  const onUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleProcess = async () => {
    if (!file) return;
    
    setLoading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
        responseType: 'blob' // Important for downloading files
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Always force download as .csv since the backend returns CSV data
      const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      link.setAttribute('download', `predicted_${baseName}.csv`);
      
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      setFile(null);
    } catch (err) {
      if (err.response && err.response.data && err.response.data instanceof Blob) {
        // Parse blob error response
        const text = await err.response.data.text();
        try {
          const json = JSON.parse(text);
          setError(json.detail || 'An error occurred during processing.');
        } catch {
          setError('An unknown error occurred during prediction.');
        }
      } else {
        setError('Failed to process file. Make sure your JWT token is valid.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="hero-section">
        <h1>Predict Customer Churn</h1>
        <p>Harness the power of our Artificial Neural Network to analyze your customer data. Upload your dataset below to instantly identify at-risk customers.</p>
      </div>

      <div className="glass-panel" style={{maxWidth: '800px', margin: '0 auto', overflow: 'hidden'}}>
        <div 
          className={`upload-zone ${dragActive ? 'drag-active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={onUploadClick}
        >
          <input 
            ref={fileInputRef}
            type="file" 
            accept=".csv, .xlsx, .xls"
            onChange={handleChange}
            style={{display: 'none'}}
          />
          
          <div className="upload-icon">☁️</div>
          <h3>{file ? file.name : "Drag & Drop your CSV/Excel file here"}</h3>
          <p style={{color: 'var(--text-muted)', marginTop: '0.5rem'}}>
            or click to browse from your computer
          </p>
        </div>
        
        {file && !loading && (
          <div className="file-status">
            <button className="btn btn-primary" onClick={handleProcess} style={{minWidth: '200px', fontSize: '1.1rem'}}>
              Process and Predict
            </button>
          </div>
        )}
        
        {loading && (
          <div className="file-status">
            <div className="loader"></div>
            <p style={{marginTop: '1rem', color: 'var(--primary-color)', fontWeight: '500'}}>
              Neural Network is analyzing your data...
            </p>
          </div>
        )}
        
        {error && (
          <div style={{color: 'var(--error)', padding: '1rem', textAlign: 'center', background: 'rgba(239, 68, 68, 0.1)'}}>
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
