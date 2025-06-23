import React from 'react';
import '../styles/ApiList.css';

export const ApiList = ({ apiData, onSelect, onEdit, onDelete, selectedApi }) => {
  const methodColors = {
    GET: '#61affe',
    POST: '#49cc90',
    PUT: '#fca130',
    DELETE: '#f93e3e',
    PATCH: '#50e3c2',
    HEAD: '#9012fe',
    OPTIONS: '#0d5aa7'
  };

  if (apiData.length === 0) {
    return (
      <div className="api-list-empty">
        <p>생성된 API가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="api-list">
      {apiData.map((api, index) => (
        <div 
          key={api.id}
          className={`api-item ${selectedApi?.id === api.id ? 'selected' : ''}`}
        >
          <div 
            className="api-item-content"
            onClick={() => onSelect(api)}
          >
            <div className="api-item-header">
              <span 
                className="method-badge"
                style={{ backgroundColor: methodColors[api.method] }}
              >
                {api.method}
              </span>
              <span className="endpoint">{api.endpoint}</span>
            </div>
            {api.description && (
              <div className="api-description">
                {api.description}
              </div>
            )}
          </div>
          
          <div className="api-item-actions">
            <button 
              className="btn btn-small btn-ghost"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(index);
              }}
              title="수정"
            >
              ✏️
            </button>
            <button 
              className="btn btn-small btn-ghost btn-danger"
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm('이 API를 삭제하시겠습니까?')) {
                  onDelete(index);
                }
              }}
              title="삭제"
            >
              🗑️
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};