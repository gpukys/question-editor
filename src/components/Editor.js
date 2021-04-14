import { Button, Classes, FormGroup, Icon, InputGroup, Intent, Switch, Tooltip } from '@blueprintjs/core';
import React, { useEffect, useState } from 'react';
import './Editor.scss';
import Question from './Question';

const Editor = ({ selectedMode, json }) => {
  const [data, setData] = useState({
    tresholdPercentage: 75,
    numberOfQuestions: 0,
    maxAttemptsNumber: 3,
    strictAttemptsMode: false,
    questions: [],
    answers: [],
  });

  const onSaveChanges = (idx) => {
    const fn = (res, correctAnswers) => {
      const copy = { ...data };
      copy.questions[idx] = res;
      copy.answers[idx] = correctAnswers.map((e) => parseInt(e));
      setData(copy);
    };
    return fn;
  };

  useEffect(() => {
    if (json) {
      const parsed = JSON.parse(json);
      setData({ ...parsed.public, answers: parsed.answers });
    }
  }, [json]);

  const renderedQuestions = data.questions.map((e, i) => {
    return (
      <div className='flex fd-row jc-sb ai-base'>
        <Question
          key={e.question}
          data={e}
          correctAnswers={data.answers[i]}
          onSaveChanges={onSaveChanges(i)}
        ></Question>
        <Tooltip content={<span>Delete question</span>}>
                <Button intent={Intent.DANGER} onClick={() => deleteQuestion(i)}>
                  <Icon icon='trash' />
                </Button>
              </Tooltip>
      </div>
    );
  });

  const deleteQuestion = (idx) => {
    const copy = { ...data };
    copy.questions.splice(idx, 1);
    copy.answers.splice(idx, 1);
    setData(copy);
  };

  const exportJson = () => {
    const res = {public: {...data, answers: undefined}, answers: data.answers}
    res.public.numberOfQuestions = data.questions.length;
    console.log(JSON.stringify(res));
  }

  const newQuestionListener = (evt) => {
    if (evt.which === 13 && evt.target.value) {
      const copy = { ...data };
      copy.questions.push({question: evt.target.value, answers: [], multiple: false});
      copy.answers.push([])
      setData(copy);
    }
  };

  const handleFormChange = (e, key) => {
    if (key !== 'strictAttemptsMode') {
      setData({...data, [key]: parseInt(e.target.value)})
    } else {
      setData({...data, strictAttemptsMode: !data.strictAttemptsMode})
    }
  };

  return (
    <div className='flex fd-col ai-center gap-16'>
      <div className='flex fd-row gap-16'>
        <FormGroup label={'Treshold Percentage'} labelFor='treshold'>
          <InputGroup
            id='treshold'
            value={data.tresholdPercentage}
            onChange={(e) => handleFormChange(e, 'tresholdPercentage')}
            type='number'
          />
        </FormGroup>
        <FormGroup label={'No. of Questions'} labelFor='questions'>
          <InputGroup
            id='questions'
            disabled
            value={data.questions.length}
            type='number'
          />
        </FormGroup>
        <FormGroup label={'Max No. of Attempts'} labelFor='attempts'>
          <InputGroup
            id='attempts'
            onChange={(e) => handleFormChange(e, 'maxAttemptsNumber')}
            value={data.maxAttemptsNumber}
            type='number'
          />
        </FormGroup>
        <Tooltip content={data.strictAttemptsMode ? `Must get atleast ${data.tresholdPercentage}% for the score to register` : 'No restriction'}>
        <FormGroup label={'Strict Mode'} labelFor='strict'>
          <Switch id='strict' checked={data.strictAttemptsMode}  onChange={(e) => handleFormChange(e, 'strictAttemptsMode')}/>
        </FormGroup>
        </Tooltip>
      </div>
      <div className='questions'>{renderedQuestions}</div>
      <input
            className={`${Classes.INPUT} m-b-16 m-t-16`}
            placeholder='New question'
            onKeyPress={newQuestionListener}
          ></input>
      <Button intent={Intent.PRIMARY} onClick={exportJson}>
        Export JSON
      </Button>
    </div>
  );
};

export default Editor;
