import React, { useState } from 'react';
import { Button, Intent, TextArea } from '@blueprintjs/core';
import './JsonEditor.scss';

const JsonEditor = ({onSubmit}) => {

  const [json, setJson] = useState('');

  const changeHandler = (evt) => {setJson(evt.target.value)}
  const submitJson = () => {
    try {
      JSON.parse(json);
      onSubmit(json);
    } catch {
      alert('Invalid JSON')
    }
  }

  return (
    <div className="container flex fd-col ai-center">
      <TextArea
        className="main-input"
        large={true}
        intent={Intent.PRIMARY}
        onChange={changeHandler}
        value={json}
      />
      <Button intent={Intent.PRIMARY} onClick={submitJson}>Save</Button>
    </div>
  );
};

export default JsonEditor;
