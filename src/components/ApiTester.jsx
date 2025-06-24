
import React, { useState } from 'react';
import '../styles/ApiTester.css';

export const ApiTester = ({ api }) => {
  const [baseUrl, setBaseUrl] = useState('https://jsonplaceholder.typicode.com');
  const [queryParams, setQueryParams] = useState('');
  const [headers, setHeaders] = useState('');
  const [requestBody, setRequestBody] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getMethodColor = (method) => {
    const colors = {
      GET: '#61affe',
      POST: '#49cc90',
      PUT: '#fca130',
      DELETE: '#f93e3e',
      PATCH: '#50e3c2',
      HEAD: '#9012fe',
      OPTIONS: '#0d5aa7'
    };
    return colors[method] || '#6c757d';
  };

  const parseHeaders = (headerString) => {
    if (!headerString.trim()) return {};
    try {
      return JSON.parse(headerString);
    } catch {
      const headers = {};
      headerString.split('\n').forEach(line => {
        const [key, value] = line.split(':');
        if (key && value) {
          headers[key.trim()] = value.trim();
        }
      });
      return headers;
    }
  };

  const buildUrl = () => {
    const cleanBaseUrl = baseUrl.replace(/\/$/, '');
    const cleanEndpoint = api.endpoint.startsWith('/') ? api.endpoint : `/${api.endpoint}`;
    let url = `${cleanBaseUrl}${cleanEndpoint}`;

    if (queryParams.trim()) {
      const separator = url.includes('?') ? '&' : '?';
      url += `${separator}${queryParams}`;
    }

    return url;
  };

  const handleTest = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    const startTime = Date.now();

    try {
      const url = buildUrl();
      const requestHeaders = parseHeaders(headers);

      // Content-Type 자동 설정
      if (requestBody.trim() && !requestHeaders['Content-Type']) {
        try {
          JSON.parse(requestBody);
          requestHeaders['Content-Type'] = 'application/json';
        } catch {
          requestHeaders['Content-Type'] = 'text/plain';
        }
      }

      const config = {
        method: api.method,
        headers: requestHeaders,
      };

      if (['POST', 'PUT', 'PATCH'].includes(api.method) && requestBody.trim()) {
        config.body = requestBody;
      }

      const response = await fetch(url, config);
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      let responseData;
      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      setResponse({
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        data: responseData,
        responseTime,
        url: url
      });

    } catch (err) {
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      setError({
        message: err.message,
        type: getErrorType(err),
        responseTime,
        url: buildUrl()
      });
    } finally {
      setLoading(false);
    }
  };

  const getErrorType = (error) => {
    if (error.message.includes('Failed to fetch')) {
      return 'NETWORK_ERROR';
    } else if (error.message.includes('CORS')) {
      return 'CORS_ERROR';
    } else if (error.message.includes('timeout')) {
      return 'TIMEOUT_ERROR';
    } else {
      return 'UNKNOWN_ERROR';
    }
  };

  // 개선된 에러 해결 방법 정보
  const getErrorSolutions = (errorType) => {
    const solutions = {
      NETWORK_ERROR: {
        icon: '🌐',
        title: '네트워크 연결 오류',
        description: '서버에 연결할 수 없습니다',
        solutions: [
          { icon: '🔍', text: 'Base URL이 올바른지 확인해주세요' },
          { icon: '🖥️', text: '서버가 실행 중인지 확인해주세요' },
          { icon: '🔒', text: 'HTTPS/HTTP 프로토콜이 올바른지 확인해주세요' },
          { icon: '📡', text: '인터넷 연결 상태를 확인해주세요' }
        ]
      },
      CORS_ERROR: {
        icon: '🚫',
        title: 'CORS 정책 오류',
        description: '브라우저에서 요청이 차단되었습니다',
        solutions: [
          { icon: '⚙️', text: '서버에서 CORS 설정을 확인해주세요' },
          { icon: '🔧', text: 'Access-Control-Allow-Origin 헤더를 추가해주세요' },
          { icon: '🛠️', text: '프록시 서버를 사용해보세요' },
          { icon: '💻', text: 'API 서버의 CORS 미들웨어를 설정해주세요' }
        ]
      },
      TIMEOUT_ERROR: {
        icon: '⏰',
        title: '요청 시간 초과',
        description: '서버 응답이 너무 오래 걸립니다',
        solutions: [
          { icon: '🔄', text: '잠시 후 다시 시도해주세요' },
          { icon: '📊', text: '서버 상태를 확인해주세요' },
          { icon: '⚡', text: '네트워크 속도를 확인해주세요' },
          { icon: '🎯', text: '요청 데이터 크기를 줄여보세요' }
        ]
      },
      UNKNOWN_ERROR: {
        icon: '❓',
        title: '알 수 없는 오류',
        description: '예상치 못한 오류가 발생했습니다',
        solutions: [
          { icon: '🔍', text: '콘솔에서 자세한 오류를 확인해주세요' },
          { icon: '📝', text: '요청 형식이 올바른지 확인해주세요' },
          { icon: '🔄', text: '페이지를 새로고침 후 다시 시도해주세요' },
          { icon: '💬', text: '개발자에게 문의해주세요' }
        ]
      }
    };

    return solutions[errorType] || solutions.UNKNOWN_ERROR;
  };

  const exampleServers = [
    { name: 'JSONPlaceholder', url: 'https://jsonplaceholder.typicode.com', desc: '테스트용 REST API' },
    { name: 'HTTPBin', url: 'https://httpbin.org', desc: 'HTTP 테스트 서비스' },
    { name: 'ReqRes', url: 'https://reqres.in/api', desc: '사용자 데이터 API' }
  ];

  return (
      <div className="api-tester">
        <div className="tester-header">
          <div className="api-info">
          <span className="method-badge" style={{ backgroundColor: getMethodColor(api.method) }}>
            {api.method}
          </span>
            <span className="endpoint">{api.endpoint}</span>
          </div>
          <p className="api-description">{api.description}</p>
        </div>

        <div className="test-form">
          <div className="form-section">
            <label className="form-label">Base URL</label>
            <div className="url-input-group">
              <input
                  type="text"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  className="form-control"
                  placeholder="https://api.example.com"
              />
              <div className="example-servers">
                <span className="example-label">예시:</span>
                {exampleServers.map((server) => (
                    <button
                        key={server.name}
                        className="example-btn"
                        onClick={() => setBaseUrl(server.url)}
                        title={server.desc}
                    >
                      {server.name}
                    </button>
                ))}
              </div>
            </div>
          </div>

          <div className="form-section">
            <label className="form-label">Query Parameters</label>
            <input
                type="text"
                value={queryParams}
                onChange={(e) => setQueryParams(e.target.value)}
                className="form-control"
                placeholder="page=1&limit=10"
            />
          </div>

          <div className="form-section">
            <label className="form-label">Headers (JSON 형식 또는 한 줄씩)</label>
            <textarea
                value={headers}
                onChange={(e) => setHeaders(e.target.value)}
                className="form-control"
                rows="3"
                placeholder='{"Authorization": "Bearer token123"} 또는
Authorization: Bearer token123
Content-Type: application/json'
            />
          </div>

          {['POST', 'PUT', 'PATCH'].includes(api.method) && (
              <div className="form-section">
                <label className="form-label">Request Body</label>
                <textarea
                    value={requestBody}
                    onChange={(e) => setRequestBody(e.target.value)}
                    className="form-control"
                    rows="4"
                    placeholder='{"title": "foo", "body": "bar", "userId": 1}'
                />
              </div>
          )}

          <button
              className="test-btn"
              onClick={handleTest}
              disabled={loading}
          >
            {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  테스트 중...
                </>
            ) : (
                <>
                  🚀 API 테스트
                </>
            )}
          </button>
        </div>

        {/* 개선된 에러 표시 */}
        {error && (
            <div className="error-container">
              <div className="error-header">
                <span className="error-icon">⚠️</span>
                <div className="error-info">
                  <h4 className="error-title">요청 실패</h4>
                  <p className="error-message">{error.message}</p>
                  <div className="error-meta">
                    <span className="error-time">⏱️ {error.responseTime}ms</span>
                    <span className="error-url">🔗 {error.url}</span>
                  </div>
                </div>
              </div>

              <div className="error-solutions">
                {(() => {
                  const errorSolution = getErrorSolutions(error.type);
                  return (
                      <div className="solution-card">
                        <div className="solution-header">
                          <span className="solution-icon">{errorSolution.icon}</span>
                          <div>
                            <h5 className="solution-title">{errorSolution.title}</h5>
                            <p className="solution-description">{errorSolution.description}</p>
                          </div>
                        </div>
                        <div className="solution-list">
                          {errorSolution.solutions.map((solution, index) => (
                              <div key={index} className="solution-item">
                                <span className="solution-item-icon">{solution.icon}</span>
                                <span className="solution-item-text">{solution.text}</span>
                              </div>
                          ))}
                        </div>
                      </div>
                  );
                })()}
              </div>
            </div>
        )}

        {response && (
            <div className="response-container">
              <div className="response-header">
                <h4>응답 결과</h4>
                <div className="response-meta">
              <span className={`status-badge ${response.status < 300 ? 'success' : response.status < 400 ? 'warning' : 'error'}`}>
                {response.status} {response.statusText}
              </span>
                  <span className="response-time">⏱️ {response.responseTime}ms</span>
                </div>
              </div>

              <div className="response-tabs">
                <div className="tab-section">
                  <h5>Response Headers</h5>
                  <pre className="code-block">
                {JSON.stringify(response.headers, null, 2)}
              </pre>
                </div>

                <div className="tab-section">
                  <h5>Response Body</h5>
                  <pre className="code-block">
                {typeof response.data === 'string'
                    ? response.data
                    : JSON.stringify(response.data, null, 2)
                }
              </pre>
                </div>
              </div>
            </div>
        )}
      </div>
  );
};