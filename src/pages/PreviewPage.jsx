import React, { useState } from 'react';
import { ApiPreview } from '../components/ApiPreview';
import '../styles/ApiPreview.css';

export const PreviewPage = ({ apiData, onNavigate }) => {
  const [selectedApiId, setSelectedApiId] = useState(null);

  const groupedApis = apiData.reduce((acc, api) => {
    const method = api.method || 'GET';
    if (!acc[method]) {
      acc[method] = [];
    }
    acc[method].push(api);
    return acc;
  }, {});

  const methodColors = {
    GET: '#61affe',
    POST: '#49cc90',
    PUT: '#fca130',
    DELETE: '#f93e3e',
    PATCH: '#50e3c2',
    HEAD: '#9012fe',
    OPTIONS: '#0d5aa7'
  };

  return (
    <div className="preview-page">
      <header className="preview-header">
        <div className="header-left">
          <button 
            className="btn btn-ghost"
            onClick={() => onNavigate('editor')}
          >
            ← 편집으로 돌아가기
          </button>
          <h1>API 문서</h1>
        </div>
        <div className="header-right">
          <span className="api-count">총 {apiData.length}개 API</span>
        </div>
      </header>

      <div className="preview-content">
        {apiData.length === 0 ? (
          <div className="empty-state">
            <h3>생성된 API가 없습니다</h3>
            <p>편집 페이지에서 API를 추가해주세요.</p>
            <button 
              className="btn btn-primary"
              onClick={() => onNavigate('editor')}
            >
              API 추가하기
            </button>
          </div>
        ) : (
          <div className="api-documentation">
            <div className="api-overview">
              <h2>API 개요</h2>
              <div className="method-summary">
                {Object.entries(groupedApis).map(([method, apis]) => (
                  <span 
                    key={method}
                    className="method-badge"
                    style={{ backgroundColor: methodColors[method] }}
                  >
                    {method} ({apis.length})
                  </span>
                ))}
              </div>
            </div>

            <div className="api-list-container">
              {Object.entries(groupedApis).map(([method, apis]) => (
                <div key={method} className="method-group">
                  <h3 className="method-group-title">
                    <span 
                      className="method-indicator"
                      style={{ backgroundColor: methodColors[method] }}
                    >
                      {method}
                    </span>
                    메서드
                  </h3>
                  
                  {apis.map((api) => (
                    <div key={api.id} className="api-item">
                      <div 
                        className="api-summary"
                        onClick={() => setSelectedApiId(
                          selectedApiId === api.id ? null : api.id
                        )}
                      >
                        <div className="api-summary-left">
                          <span 
                            className="method-badge small"
                            style={{ backgroundColor: methodColors[api.method] }}
                          >
                            {api.method}
                          </span>
                          <span className="endpoint">{api.endpoint}</span>
                        </div>
                        <div className="api-summary-right">
                          <span className="description">{api.description}</span>
                          <span className="expand-icon">
                            {selectedApiId === api.id ? '▼' : '▶'}
                          </span>
                        </div>
                      </div>
                      
                      {selectedApiId === api.id && (
                        <div className="api-details">
                          <ApiPreview api={api} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};