import {
  Button,
  Checkbox,
  Classes,
  Dialog,
  EditableText,
  FormGroup,
  Icon,
  Intent,
  Radio,
  RadioGroup,
  Switch,
  Tooltip,
} from '@blueprintjs/core';
import React, { useEffect, useState } from 'react';
import './Question.scss';

const Question = (props) => {
  const [data, setData] = useState(props.data || {});
  const [correctAnswers, setCorrectAnswers] = useState(
    props.correctAnswers || []
  );
  const [tempQuestion, setTempQuestion] = useState(data.question || '');
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    console.log(props);
    setData(props.data);
    setCorrectAnswers(props.correctAnswers);
  }, []);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const saveChanges = () => {
    setCorrectAnswers(correctAnswers.sort());
    data.question = tempQuestion;
    props.onSaveChanges(data, correctAnswers);
    handleClose();
  };

  const handleRadioChange = (evt) => {
    console.log(evt);
    setCorrectAnswers([parseInt(evt.target.value)]);
  };

  const handleIsMultipleChange = (evt) => {
    setData({ ...data, multiple: !data.multiple });
    setCorrectAnswers([0]);
  };

  const renderedAnswers = () => {
    if (!data.multiple) {
      return (
        <div
          onChange={handleRadioChange}
          selectedValue={correctAnswers && correctAnswers[0]}
          className='flex fd-col'
        >
          <label className="bp3-label">Answers</label>
          {data.answers.map((e, i) => (
            <div className='flex fd-row jc-sb ai-base gap-16'>
              <Radio label={e} value={i} name="smth" checked={isChecked(i)} onChange={handleRadioChange}/>
              <Tooltip content={<span>Delete answer</span>}>
                <Button intent={Intent.DANGER} onClick={() => deleteAnswer(i)}>
                  <Icon icon='trash' />
                </Button>
              </Tooltip>
            </div>
          ))}
        </div>
      );
    } else {
      return (
        <div className='m-0'>
          <label className="bp3-label">Answers</label>
          {data.answers.map((e, i) => (
            <div className='flex fd-row jc-sb ai-base gap-16'>
              <Checkbox
                label={e}
                value={i}
                checked={isChecked(i)}
                onChange={toggleAnswer}
              />
              <Tooltip content={<span>Delete answer</span>}>
                <Button intent={Intent.DANGER} onClick={() => deleteAnswer(i)}>
                  <Icon icon='trash' />
                </Button>
              </Tooltip>
            </div>
          ))}
        </div>
      );
    }
  };

  const onQuestionEdit = (evt) => {
    setTempQuestion(evt);
  };

  const toggleAnswer = (evt) => {
    const val = parseInt(evt.target.value);
    const idx = correctAnswers.findIndex((e) => e === val);
    if (idx > -1) {
      setCorrectAnswers(correctAnswers.filter((e) => e !== val));
    } else {
      setCorrectAnswers([...correctAnswers, val]);
    }
  };

  const isChecked = (idx) => correctAnswers.includes(idx);
  const newAnswerListener = (evt) => {
    if (evt.which === 13 && evt.target.value) {
      const copy = { ...data };
      const idx = copy.answers.push(evt.target.value);
      setData(copy);
      setCorrectAnswers(
        data.multiple ? [...correctAnswers, idx - 1] : [idx - 1]
      );
    }
  };

  const deleteAnswer = (idx) => {
    const copy = { ...data };
    const currAns = copy.answers[correctAnswers[0]];
    copy.answers.splice(idx, 1);
    setData(copy);
    if (data.multiple) {
      setCorrectAnswers(correctAnswers.filter((e) => e !== idx))
    } else {
      const idx = copy.answers.findIndex(e => e === currAns)
      if (idx > -1) {
        setCorrectAnswers([idx])
      } else {
        setCorrectAnswers([0])
      }
    }
  };

  return (
    <React.Fragment>
      <div className='item' onClick={() => handleOpen()}>
        {data.question}
      </div>
      <Dialog
        icon='info-sign'
        onClose={handleClose}
        title='Edit question'
        isOpen={isOpen}
      >
        <div className={Classes.DIALOG_BODY}>
          <h2>
            <EditableText
              alwaysRenderInput={true}
              placeholder='Edit question'
              value={tempQuestion}
              onChange={onQuestionEdit}
              className='full-width'
            />
          </h2>
          {renderedAnswers()}
          <input
            className={`${Classes.INPUT} m-b-16 m-t-16`}
            placeholder='New answer'
            onKeyPress={newAnswerListener}
          ></input>
          <FormGroup label='Multiple?' labelFor='multiple'>
            <Switch
              id='multiple'
              checked={data.multiple}
              onChange={handleIsMultipleChange}
            />
          </FormGroup>
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button intent={Intent.PRIMARY} onClick={saveChanges}>
              Save
            </Button>
            <Button onClick={handleClose}>Close</Button>
          </div>
        </div>
      </Dialog>
    </React.Fragment>
  );
};

export default Question;
