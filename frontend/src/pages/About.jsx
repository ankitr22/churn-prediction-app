import React from 'react';

const About = () => {
  return (
    <div className="page-container">
      <div className="glass-panel" style={{padding: '4rem 2rem', maxWidth: '600px', margin: '0 auto', textAlign: 'center'}}>
        
        <div style={{
          width: '120px', 
          height: '120px', 
          borderRadius: '50%', 
          background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))', 
          margin: '0 auto 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '3rem',
          color: 'white',
          boxShadow: '0 10px 25px rgba(59, 130, 246, 0.4)'
        }}>
          💡
        </div>

        <h1 style={{marginBottom: '0.5rem'}}>Ankit</h1>
        <a href="mailto:your_email@example.com" style={{color: 'var(--primary-color)', textDecoration: 'none', fontSize: '1.1rem'}}>
          your_email@example.com
        </a>

        <div style={{marginTop: '2.5rem', textAlign: 'left', background: 'rgba(0,0,0,0.2)', padding: '2rem', borderRadius: '12px'}}>
          <h3 style={{marginBottom: '1rem'}}>Hello! 👋</h3>
          <p style={{color: 'var(--text-muted)', lineHeight: '1.7'}}>
            I am passionate about leveraging artificial intelligence models and scalable software architectures to solve real-world problems. 
            This application demonstrates end-to-end Machine Learning deployment, utilizing an Artificial Neural Network trained carefully with SMOTE to mitigate dataset imbalances, integrated seamlessly into a robust fullstack web application using FastAPI and React.
          </p>
        </div>
        
      </div>
    </div>
  );
};

export default About;
