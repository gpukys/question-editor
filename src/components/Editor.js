import { Button, FormGroup, InputGroup, Intent, Switch } from '@blueprintjs/core';
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
      <Question
        key={e.question}
        data={e}
        correctAnswers={data.answers[i]}
        onSaveChanges={onSaveChanges(i)}
      ></Question>
    );
  });

  const exportJson = () => {
    const res = {public: {...data, answers: undefined}, answers: data.answers}
    res.public.numberOfQuestions = data.questions.length;
    console.log(JSON.stringify(res));
  }

  return (
    <div className='flex fd-col ai-center gap-16'>
      <div className='flex fd-row gap-16'>
        <FormGroup label={'Treshold Percentage'} labelFor='treshold'>
          <InputGroup
            id='treshold'
            value={data.tresholdPercentage}
            type='number'
          />
        </FormGroup>
        <FormGroup label={'No. of Questions'} labelFor='questions'>
          <InputGroup
            id='questions'
            disabled={true}
            value={data.questions.length}
            type='number'
          />
        </FormGroup>
        <FormGroup label={'Max No. of Attempts'} labelFor='attempts'>
          <InputGroup
            id='attempts'
            value={data.maxAttemptsNumber}
            type='number'
          />
        </FormGroup>
        <FormGroup label={'Strict Mode'} labelFor='strict'>
          <Switch id='strict' checked={data.strictAttemptsMode} />
        </FormGroup>
      </div>
      <div className='questions'>{renderedQuestions}</div>
      <Button intent={Intent.PRIMARY} onClick={exportJson}>
        Export JSON
      </Button>
    </div>
  );
};

export default Editor;
