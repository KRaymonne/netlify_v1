import axios from 'axios';

// Test direct connection to backend
const testDirectConnection = async () => {
  try {
    console.log('Testing direct connection to backend...');
    const response = await axios.get('http://localhost:5000/api/health');
    console.log('Direct connection successful:', response.data);
  } catch (error) {
    console.error('Direct connection failed:', error.message);
  }
};

// Test proxy connection
const testProxyConnection = async () => {
  try {
    console.log('Testing proxy connection...');
    const response = await axios.get('/api/health');
    console.log('Proxy connection successful:', response.data);
  } catch (error) {
    console.error('Proxy connection failed:', error.message);
  }
};

// Run tests
testDirectConnection();
testProxyConnection();