import React, { useState, useRef } from 'react';
import { Mic, Upload } from 'lucide-react';

interface VoiceCloningProps {
  onVoiceCreated: (voiceId: string) => void;
}

const VoiceCloning: React.FC<VoiceCloningProps> = ({ onVoiceCreated }) => {
  const [voiceName, setVoiceName] = useState('');
  const [audioFiles, setAudioFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAudioFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (audioFiles.length === 0 || !voiceName) return;

    setIsLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('name', voiceName);
    audioFiles.forEach((file) => formData.append('files', file));

    try {
      const response = await fetch('/api/clone-voice', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Voice cloning failed');
      }

      if (!data.voice_id) {
        throw new Error('Voice ID not received from the server');
      }

      onVoiceCreated(data.voice_id);
    } catch (error) {
      console.error('Error cloning voice:', error);
      setError(error instanceof Error ? error.message : 'Failed to clone voice. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-semibold text-indigo-800 mb-6">Clone Your Voice</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="voiceName" className="block text-sm font-medium text-gray-700 mb-1">
            Voice Name
          </label>
          <input
            type="text"
            id="voiceName"
            value={voiceName}
            onChange={(e) => setVoiceName(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            required
            placeholder="Enter a name for your voice clone"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Upload Audio Samples</label>
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
            >
              <Upload className="mr-2" size={18} />
              Upload Files
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              multiple
              accept="audio/*"
              className="hidden"
            />
            <span className="text-sm text-gray-500">
              {audioFiles.length} file(s) selected
            </span>
          </div>
        </div>
        <button
          type="submit"
          disabled={isLoading || audioFiles.length === 0 || !voiceName}
          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Cloning Voice...
            </>
          ) : (
            <>
              <Mic className="mr-2" size={18} />
              Clone Voice
            </>
          )}
        </button>
      </form>
      {error && (
        <div className="text-red-600 text-sm mt-2 p-3 bg-red-100 rounded-lg">
          Error: {error}
        </div>
      )}
    </div>
  );
};

export default VoiceCloning;