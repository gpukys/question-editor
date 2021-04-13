import { Button, Intent } from '@blueprintjs/core';
import React, { useEffect, useState } from 'react';
import './App.scss';
import Editor from './components/Editor';
import JsonEditor from './components/JsonEditor';

function App() {
  const [selectedMode, setSelectedMode] = useState(1);
  const [questionJson, setQuestionJson] = useState(null);

  function onJsonSubmit(json) {
    setSelectedMode(1);
    setQuestionJson(json);
  }

  function handleNavClick(mode) {
    if (!!questionJson) {
      if (!window.confirm('You have unsaved changes. Leave?')) {
        return;
      }
    }
    setQuestionJson(null);
    setSelectedMode(mode);
  }

  return (
    <React.Fragment>
    <header className="flex fd-col ai-center">
      <h1>RS School Question editor</h1>
      <div className="control-container flex ai-center">
        <Button intent={Intent.PRIMARY} onClick={() => handleNavClick(1)}>Create new question set</Button>
        <span>OR</span>
        <Button onClick={() => handleNavClick(2)}>Import JSON</Button>
      </div>
    </header>
    <section className="flex fd-col ai-center fg-2">
    {selectedMode === 1 && <Editor selectedMode={selectedMode} json={questionJson}></Editor>}
    {selectedMode === 2 && <JsonEditor onSubmit={onJsonSubmit}></JsonEditor>}
  </section>
  </React.Fragment>
  );
}

export default App;
