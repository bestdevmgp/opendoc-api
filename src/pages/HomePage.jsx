import React, { useRef } from 'react';
import '../styles/HomePage.css';
import {FilePlus2} from "lucide-react";
import {Import} from "lucide-react";

export const HomePage = ({ onNewProject, onUploadFile }) => {
  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="home-page">
      <div className="home-container">
        <header className="home-header">
          <div className="logo">
            <h1>OpenDoc API</h1>
            <p>간편하고 자유로운 API 문서 시각화 도구</p>
          </div>
        </header>

        <main className="home-main">
          <div className="welcome-section">
            <h2>API 문서화를 더 쉽게</h2>
            <p>서버 없이도 API 문서를 작성하고 시각화할 수 있습니다.</p>
          </div>

          <div className="action-buttons">
            <button
              className="btn btn-primary"
              onClick={onNewProject}
            >
              <FilePlus2 size={17}/>
              <span>새 문서 시작하기</span>
            </button>

            <button
              className="btn btn-secondary"
              onClick={handleUploadClick}
            >
              <Import size={17}/>
              <span>기존 문서 불러오기</span>
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={onUploadFile}
            style={{ display: 'none'}}
          />

          <div className="features">
            <div className="feature-card">
              <h3>🚀 빠른 시작</h3>
              <p>복잡한 설정 없이 바로 API 문서를 작성할 수 있습니다.</p>
            </div>
            <div className="feature-card">
              <h3>🔒 안전한 환경</h3>
              <p>서버와 분리되어 API 정보가 외부에 노출되지 않습니다.</p>
            </div>
            <div className="feature-card">
              <h3>💾 저장/불러오기</h3>
              <p>JSON 형식으로 문서를 저장하고 언제든 다시 불러올 수 있습니다.</p>
            </div>
          </div>
        </main>

        <footer className="home-footer">
          <p>© 2025 OpenDoc API - @bestdevmgp</p>
        </footer>
      </div>
    </div>
  );
};