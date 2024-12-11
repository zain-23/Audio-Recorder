'use client';
import { Button } from '@/components/ui';
import { Fragment, useState } from 'react';

const AudioRecorder = () => {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioUrl, setAudioUrl] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState<boolean>(false);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream); // Recorder object
      const aChunks: Blob[] = []; // Saving audio chunks

      recorder.ondataavailable = (event) => {
        aChunks.push(event.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(aChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl((prev) => [...prev, audioUrl]);
        // const audio = new Audio(audioUrl);
        // setAudioBlob(audioBlob);
        // audio.play(); // Play audio
      };

      setMediaRecorder(recorder);
      setIsRecording(true);
      recorder.start(); // Start recording
    } catch (error) {}
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  return (
    <Fragment>
      <Button
        onClick={startRecording}
        disabled={isRecording}
      >
        Start Recording
      </Button>
      <Button
        onClick={stopRecording}
        variant={'destructive'}
      >
        Stop Recording
      </Button>
    </Fragment>
  );
};

export { AudioRecorder };
