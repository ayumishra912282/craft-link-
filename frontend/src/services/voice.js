/**
 * Voice Service to provide a personal touch with Hindi TTS.
 * Uses Web Speech API as a fallback, or can be extended for ElevenLabs.
 */

export const speakHindi = (text) => {
  if (!('speechSynthesis' in window)) return;

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  
  // Try to find a Hindi voice
  const voices = window.speechSynthesis.getVoices();
  const hindiVoice = voices.find(v => v.lang === 'hi-IN' || v.lang.includes('hi'));
  
  if (hindiVoice) {
    utterance.voice = hindiVoice;
  }
  
  utterance.lang = 'hi-IN';
  utterance.rate = 0.9; // Slightly slower for better clarity
  utterance.pitch = 1.0;

  window.speechSynthesis.speak(utterance);
};

// Initialize voices (some browsers need this to load voices)
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
}
