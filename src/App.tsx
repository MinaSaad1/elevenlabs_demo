import React, { useState } from 'react';
import VoiceCloning from './components/VoiceCloning';
import TextToSpeech from './components/TextToSpeech';
import { Mic, MessageSquare } from 'lucide-react';

function App() {
  const [voiceId, setVoiceId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 animate-gradient flex flex-col items-center justify-center p-4">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">VoiceClone AI</h1>
        <p className="text-xl text-indigo-100">Clone your voice and make it say anything!</p>
      </header>

      <main className="w-full max-w-3xl bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl shadow-2xl p-8 transition-all hover:shadow-glow">
        <div className="flex items-center justify-center mb-8 space-x-4">
          <div className={`flex items-center ${!voiceId ? 'text-indigo-600' : 'text-gray-400'}`}>
            <Mic size={24} className="mr-2" />
            <span className="font-semibold">Clone Voice</span>
          </div>
          <div className="h-px w-16 bg-gray-300"></div>
          <div className={`flex items-center ${voiceId ? 'text-indigo-600' : 'text-gray-400'}`}>
            <MessageSquare size={24} className="mr-2" />
            <span className="font-semibold">Generate Speech</span>
          </div>
        </div>
        {!voiceId ? (
          <VoiceCloning onVoiceCreated={setVoiceId} />
        ) : (
          <TextToSpeech voiceId={voiceId} />
        )}
      </main>

      <footer className="mt-12 text-center text-indigo-100">
        <p>&copy; 2023 VoiceClone AI. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;