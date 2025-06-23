import React, { useState, useEffect } from 'react';
import '../styles/ApiForm.css';

export const ApiForm = ({ onSubmit, initialData, onCancel }) => {
  const [formData, setFormData] = useState({
    method: 'GET',
    endpoint: '',
    description: '',
    parameters: '',
    requestBody: '',
    responseExample: '',
    responseStatus: '200'
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        method: 'GET',
        endpoint: '',
        description: '',
        parameters: '',
        requestBody: '',
        responseExample: '',
        responseStatus: '200'
      });
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.endpoint.trim()) {
      alert('엔드포인트를 입력해주세요.');
      return;
    }
    onSubmit(formData);
    if (!initialData) {
      setFormData({
        method: 'GET',
        endpoint: '',
        description: '',
        parameters: '',
        requestBody: '',
        responseExample: '',
        responseStatus: '200'
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];

  return (
    <form onSubmit={handleSubmit} className="api-form">
      <div className="form-group">
        <label htmlFor="method">메서드</label>
        <select 
          id="method"
          name="method" 
          value={formData.method} 
          onChange={handleChange}
          className="form-control"
        >
          {methods.map(method => (
            <option key={method} value={method}>{method}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="endpoint">엔드포인트 *</label>
        <input
          type="text"
          id="endpoint"
          name="endpoint"
          value={formData.endpoint}
          onChange={handleChange}
          placeholder="/api/users"
          className="form-control"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">설명</label>
        <input
          type="text"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="API 설명을 입력하세요"
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label htmlFor="parameters">파라미터</label>
        <textarea
          id="parameters"
          name="parameters"
          value={formData.parameters}
          onChange={handleChange}
          placeholder="파라미터 정보를 입력하세요 (JSON 형식 권장)"
          className="form-control"
          rows="3"
        />
      </div>

      <div className="form-group">
        <label htmlFor="requestBody">요청 본문</label>
        <textarea
          id="requestBody"
          name="requestBody"
          value={formData.requestBody}
          onChange={handleChange}
          placeholder="요청 본문 예시를 입력하세요 (JSON 형식)"
          className="form-control"
          rows="4"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="responseStatus">응답 상태 코드</label>
          <select
            id="responseStatus"
            name="responseStatus"
            value={formData.responseStatus}
            onChange={handleChange}
            className="form-control"
          >
            <option value="200">200 OK</option>
            <option value="201">201 Created</option>
            <option value="204">204 No Content</option>
            <option value="400">400 Bad Request</option>
            <option value="401">401 Unauthorized</option>
            <option value="403">403 Forbidden</option>
            <option value="404">404 Not Found</option>
            <option value="500">500 Internal Server Error</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="responseExample">응답 예시</label>
        <textarea
          id="responseExample"
          name="responseExample"
          value={formData.responseExample}
          onChange={handleChange}
          placeholder="응답 예시를 입력하세요 (JSON 형식)"
          className="form-control"
          rows="4"
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {initialData ? '수정' : '추가'}
        </button>
        {initialData && (
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={onCancel}
          >
            취소
          </button>
        )}
      </div>
    </form>
  );
};