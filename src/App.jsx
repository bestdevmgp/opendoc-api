import React, { useState } from 'react';
import { HomePage } from './pages/HomePage';
import { EditorPage } from './pages/EditorPage';
import { PreviewPage } from './pages/PreviewPage';
import './styles/App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [apiData, setApiData] = useState([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const navigateTo = (page) => {
    if (hasUnsavedChanges && page === 'home') {
      const confirmed = window.confirm('저장하지 않은 변경사항이 있습니다. 저장하시겠습니까?');
      if (confirmed) {
        // 자동 저장 로직
        downloadData();
      }
    }
    setCurrentPage(page);
    if (page === 'home') {
      setHasUnsavedChanges(false);
    }
  };

  const downloadData = () => {
    if (apiData.length === 0) return;
    
    const dataStr = JSON.stringify(apiData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFile = document.createElement('a');
    exportFile.setAttribute('href', dataUri);
    exportFile.setAttribute('download', 'api-documentation.json');
    document.body.appendChild(exportFile);
    exportFile.click();
    document.body.removeChild(exportFile);
    setHasUnsavedChanges(false);
  };

  const uploadData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target.result);
          setApiData(jsonData);
          setCurrentPage('editor');
        } catch (error) {
          alert('올바른 JSON 파일이 아닙니다.');
        }
      };
      reader.readAsText(file);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage 
            onNewProject={() => navigateTo('editor')}
            onUploadFile={uploadData}
          />
        );
      case 'editor':
        return (
          <EditorPage 
            apiData={apiData}
            setApiData={setApiData}
            onNavigate={navigateTo}
            onSave={downloadData}
            setHasUnsavedChanges={setHasUnsavedChanges}
          />
        );
      case 'preview':
        return (
          <PreviewPage 
            apiData={apiData}
            onNavigate={navigateTo}
          />
        );
      default:
        return <HomePage onNewProject={() => navigateTo('editor')} />;
    }
  };

  return (
    <div className="app">
      {renderPage()}
    </div>
  );
}

export default App;