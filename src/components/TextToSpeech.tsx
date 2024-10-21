import React, { useState, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface TextToSpeechProps {
  voiceId: string;
}

const TextToSpeech: React.FC<TextToSpeechProps> = ({ voiceId }) => {
  const [text, setText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, voiceId }),
      });

      if (!response.ok) throw new Error('Text-to-speech generation failed');

      const audioBlob = await response.blob();
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
    } catch (error) {
      console.error('Error generating speech:', error);
      alert('Failed to generate speech. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const resetAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-semibold text-indigo-800 mb-6">Generate Speech</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-1">
            Enter Text
          </label>
          <textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            required
            placeholder="Type the text you want to convert to speech..."
          />
        </div>
        <button
          type="submit"
          disabled={isGenerating || !text}
          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating Speech...
            </>
          ) : (
            'Generate Speech'
          )}
        </button>
      </form>
      {audioUrl && (
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Generated Speech:</h3>
          <div className="bg-gray-100 rounded-lg p-4 flex items-center space-x-4">
            <button
              onClick={togglePlayPause}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
            <div className="flex-grow">
              <div className="h-2 bg-indigo-200 rounded-full">
                <div className="h-2 bg-indigo-600 rounded-full" style={{ width: '0%' }}></div>
              </div>
            </div>
            <button
              onClick={resetAudio}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all"
            >
              <RotateCcw size={20} />
            </button>
            <audio
              ref={audioRef}
              src={audioUrl}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TextToSpeech;