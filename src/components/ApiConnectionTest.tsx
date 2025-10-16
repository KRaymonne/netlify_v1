import { useState, useEffect } from 'react';
import { checkApiHealth } from '../services/api';

interface HealthStatus {
  success: boolean;
  message?: string;
  error?: string;
  timestamp?: string;
  environment?: string;
  database?: string;
  version?: string;
}

const ApiConnectionTest = () => {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    try {
      const result = await checkApiHealth();
      setHealth(result);
    } catch (error) {
      setHealth({
        success: false,
        error: 'Failed to connect to API server'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-bold text-gray-900">API Connection Status</h2>
      
      <button
        onClick={testConnection}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test Connection'}
      </button>

      {health && (
        <div className={`p-4 rounded ${
          health.success ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500'
        } border`}>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              health.success ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            <span className="font-semibold">
              {health.success ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          
          {health.message && (
            <p className="mt-2 text-sm text-gray-700">{health.message}</p>
          )}
          
          {health.error && (
            <p className="mt-2 text-sm text-red-600">{health.error}</p>
          )}
          
          {health.success && (
            <div className="mt-3 text-xs text-gray-600 space-y-1">
              {health.timestamp && <p>Last check: {new Date(health.timestamp).toLocaleString()}</p>}
              {health.environment && <p>Environment: {health.environment}</p>}
              {health.database && <p>Database: {health.database}</p>}
              {health.version && <p>Version: {health.version}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ApiConnectionTest;