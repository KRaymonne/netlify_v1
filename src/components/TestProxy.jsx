import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TestProxy = () => {
  const [status, setStatus] = useState('Testing...');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Test direct backend connection
        const directResponse = await axios.get('http://127.0.0.1:5000/api/health');
        console.log('Direct connection success:', directResponse.data);
        
        // Test proxy connection
        const proxyResponse = await axios.get('/api/health');
        console.log('Proxy connection success:', proxyResponse.data);
        
        setStatus('✅ Both connections working!');
        setData({
          direct: directResponse.data,
          proxy: proxyResponse.data
        });
      } catch (err) {
        console.error('Connection test failed:', err);
        setError(err.message);
        setStatus('❌ Connection test failed');
      }
    };

    testConnection();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Proxy Connection Test</h2>
      <p>Status: {status}</p>
      {error && (
        <div style={{ color: 'red', backgroundColor: '#ffe6e6', padding: '10px', borderRadius: '4px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      {data && (
        <div style={{ marginTop: '20px' }}>
          <h3>Test Results:</h3>
          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ flex: 1 }}>
              <h4>Direct Connection:</h4>
              <pre>{JSON.stringify(data.direct, null, 2)}</pre>
            </div>
            <div style={{ flex: 1 }}>
              <h4>Proxy Connection:</h4>
              <pre>{JSON.stringify(data.proxy, null, 2)}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestProxy;