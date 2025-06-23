import React from 'react';
import '../styles/ApiPreview.css';

export const ApiPreview = ({ api }) => {
  const methodColors = {
    GET: '#61affe',
    POST: '#49cc90',
    PUT: '#fca130',
    DELETE: '#f93e3e',
    PATCH: '#50e3c2',
    HEAD: '#9012fe',
    OPTIONS: '#0d5aa7'
  };

  const formatJson = (jsonString) => {
    if (!jsonString) return '';
    try {
      const parsed = JSON.parse(jsonString);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return jsonString;
    }
  };

  const getStatusColor = (status) => {
    const statusCode = parseInt(status);
    if (statusCode >= 200 && statusCode < 300) return '#49cc90';
    if (statusCode >= 300 && statusCode < 400) return '#fca130';
    if (statusCode >= 400 && statusCode < 500) return '#f93e3e';
    if (statusCode >= 500) return '#f93e3e';
    return '#666';
  };

  return (
    <div className="api-preview">
      <div className="api-header">
        <div className="api-title">
          <span 
            className="method-badge"
            style={{ backgroundColor: methodColors[api.method] }}
          >
            {api.method}
          </span>
          <span className="endpoint">{api.endpoint}</span>
        </div>
        {api.description && (
          <p className="api-description">{api.description}</p>
        )}
      </div>

      <div className="api-sections">
        {api.parameters && (
          <div className="api-section">
            <h4>Parameters</h4>
            <div className="code-block">
              <pre>{formatJson(api.parameters) || api.parameters}</pre>
            </div>
          </div>
        )}

        {api.requestBody && (
          <div className="api-section">
            <h4>Request Body</h4>
            <div className="code-block">
              <pre>{formatJson(api.requestBody)}</pre>
            </div>
          </div>
        )}

        <div className="api-section">
          <h4>Response</h4>
          <div className="response-header">
            <span 
              className="status-badge"
              style={{ backgroundColor: getStatusColor(api.responseStatus) }}
            >
              {api.responseStatus}
            </span>
          </div>
          {api.responseExample && (
            <div className="code-block">
              <pre>{formatJson(api.responseExample)}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};