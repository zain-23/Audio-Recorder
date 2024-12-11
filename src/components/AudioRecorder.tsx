'use client';
import { Button } from '@/components/ui';
import { Pause, Play } from 'lucide-react';
import { useRef, useState } from 'react';

const AudioRecorder = () => {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioUrl, setAudioUrl] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement[]>([]);
  const [playingStates, setPlayingStates] = useState<boolean[]>([]);

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
      };

      setMediaRecorder(recorder);
      setIsRecording(true);
      recorder.start(); // Start recording
    } catch (error) {
      alert(error);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const handleAudioPlayPause = (index: number) => {
    // pick current audio
    // if audio not fount return
    // toggle the currentAudio state
    // pause all audio
    // play current audio
    const currentAudio = audioRef.current[index];
    if (!currentAudio) return;

    setPlayingStates((prev) => {
      const updatedStates = [...prev];
      updatedStates[index] = !updatedStates[index];

      // pause all audios
      updatedStates.forEach((_, i) => {
        if (i !== index && audioRef.current[i]) {
          audioRef.current[i].pause();
          updatedStates[i] = false;
        }
      });

      if (updatedStates[index]) {
        currentAudio.play();
      } else {
        currentAudio.pause();
      }

      return updatedStates;
    });
  };
  return (
    <div className='h-screen flex flex-col gap-y-3 justify-center items-center'>
      <div className='space-x-2'>
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
      </div>
      <div className='w-96 space-y-2'>
        {audioUrl.length > 0 &&
          audioUrl.map((audio, index) => (
            <div
              key={audio}
              className='w-full h-11 bg-gray-700 rounded-full flex justify-center items-center'
            >
              <button
                onClick={() => handleAudioPlayPause(index)}
                className='p-1.5 bg-white/20 rounded-full'
              >
                {playingStates[index] ? <Pause size={18} /> : <Play size={18} />}
              </button>
              <audio
                src={audio}
                ref={(el) => {
                  if (el) {
                    audioRef.current[index] = el;
                  }
                }}
              >
                Hello
              </audio>
            </div>
          ))}
      </div>
    </div>
  );
};

export { AudioRecorder };
