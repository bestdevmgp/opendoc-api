import React, { useState, useEffect } from 'react';
import { ApiForm } from '../components/ApiForm';
import { ApiList } from '../components/ApiList';
import { ApiPreview } from '../components/ApiPreview';
import '../styles/EditorPage.css';
import {Save} from "lucide-react";
import {List} from "lucide-react";

export const EditorPage = ({ 
  apiData, 
  setApiData, 
  onNavigate, 
  onSave, 
  setHasUnsavedChanges 
}) => {
  const [selectedApi, setSelectedApi] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    if (apiData.length > 0) {
      setHasUnsavedChanges(true);
    }
  }, [apiData, setHasUnsavedChanges]);

  const addApi = (newApi) => {
    const updatedData = [...apiData, { ...newApi, id: Date.now() }];
    setApiData(updatedData);
    setSelectedApi(newApi);
  };

  const updateApi = (index, updatedApi) => {
    const updatedData = [...apiData];
    updatedData[index] = { ...updatedApi, id: apiData[index].id };
    setApiData(updatedData);
    setSelectedApi(updatedApi);
    setEditingIndex(null);
  };

  const deleteApi = (index) => {
    const updatedData = apiData.filter((_, i) => i !== index);
    setApiData(updatedData);
    if (selectedApi && apiData[index].id === selectedApi.id) {
      setSelectedApi(null);
    }
  };

  const selectApi = (api) => {
    setSelectedApi(api);
    setEditingIndex(null);
  };

  const editApi = (index) => {
    setEditingIndex(index);
    setSelectedApi(apiData[index]);
  };

  return (
    <div className="editor-page">
      <header className="editor-header">
        <div className="header-left">
          <button 
            className="btn btn-ghost"
            onClick={() => onNavigate('home')}
          >
            ← 홈으로
          </button>
          <h1>OpenDoc API Editor</h1>
        </div>
        <div className="header-right">
          <button 
            className="btn btn-secondary"
            onClick={() => onNavigate('preview')}
            disabled={apiData.length === 0}
          >
            <List size={15}/>
            <span>목록 보기</span>
          </button>
          <button 
            className="btn btn-primary"
            onClick={onSave}
            disabled={apiData.length === 0}
          >
            <Save size={15}/>
            <span>저장</span>
          </button>
        </div>
      </header>

      <div className="editor-content">
        <div className="sidebar">
          <div className="api-form-section">
            <h3>{editingIndex !== null ? 'API 수정' : 'API 추가'}</h3>
            <ApiForm 
              onSubmit={editingIndex !== null ? 
                (api) => updateApi(editingIndex, api) : 
                addApi
              }
              initialData={editingIndex !== null ? apiData[editingIndex] : null}
              onCancel={() => {
                setEditingIndex(null);
                setSelectedApi(null);
              }}
            />
          </div>

          <div className="api-list-section">
            <h3>API 목록 ({apiData.length})</h3>
            <ApiList 
              apiData={apiData}
              onSelect={selectApi}
              onEdit={editApi}
              onDelete={deleteApi}
              selectedApi={selectedApi}
            />
          </div>
        </div>

        <div className="main-content">
          <div className="preview-section">
            <h3>미리보기</h3>
            {selectedApi ? (
              <ApiPreview api={selectedApi} />
            ) : (
              <div className="no-selection">
                <p>API를 선택하거나 새로 추가해주세요.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};