'use client';
import React, { useState } from 'react';
import 'regenerator-runtime/runtime';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const Dictaphone = () => {
  const [finalTranscript, setFinalTranscript] = useState('');
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  const handleStart = () => {
    resetTranscript();
    setFinalTranscript(''); // Reset final transcript on start
    SpeechRecognition.startListening({ continuous: true });
  };

  const handleStop = () => {
    SpeechRecognition.stopListening();
    setFinalTranscript(transcript); // Save the final transcript when stopping
  };

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <div>
      <p>Microphone: {listening ? 'on' : 'off'}</p>
      <button onClick={handleStart}>Start</button>
      <button onClick={handleStop}>End</button>
      <button onClick={resetTranscript}>Reset</button>
      <p>Current Transcript: {transcript}</p>
      <p><strong>Final Transcript:</strong> {finalTranscript}</p>
    </div>
  );
};

export default Dictaphone;
