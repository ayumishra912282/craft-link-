import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Sparkles, Mic, Globe, CheckCircle2, RotateCcw } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import ScrollReveal from './ScrollReveal';

export const AUDIO_STORIES = [
  {
    id: 'story-blue-pottery',
    craftName: 'Jaipur Blue Pottery',
    artisanName: 'Ramesh Kumawat',
    region: 'Kot Jewar, Rajasthan',
    duration: '0:48',
    audioTextHindi: 'राम-राम सा! मैं रमेश कुमावत, जयपुर के कोट जेवर गाँव से। हमारी यह नीली मिट्टी की कला 400 साल पुरानी है। इसमें सामान्य चिकनी मिट्टी नहीं, बल्कि क्वार्ट्ज पत्थर, प्राकृतिक गोंद और साजी का उपयोग होता है। हर फूल-पत्ती को हम हाथ से प्राकृतिक रंगों से सजाते हैं।',
    audioTextEnglish: 'Greetings! I am Ramesh Kumawat from Kot Jewar village, Jaipur. Our blue pottery craft is over 400 years old. Instead of regular clay, we use powdered quartz, natural tree gum, and natural minerals. Every peacock and floral motif is painted entirely by hand.',
    waveform: [35, 60, 45, 80, 95, 60, 40, 85, 90, 75, 45, 60, 90, 100, 70, 50, 85, 60, 40, 70, 85, 95, 60, 45, 30]
  },
  {
    id: 'story-dhokra',
    craftName: 'Bastar Dhokra Lost-Wax',
    artisanName: 'Sukhlal Baghel',
    region: 'Kondagaon, Bastar',
    duration: '0:55',
    audioTextHindi: 'जोहार! मैं सुखलाल बघेल, बस्तर छत्तीसगढ़ से। हमारी ढोकरा धातु कला मोहन जोदड़ो की कांस्य नृत्यांगना जितनी प्राचीन है। साल के जंगलों से मधुमक्खी का मोम लाकर पहले सांचा बनाते हैं, फिर मिट्टी की तीन परतें चढ़ाकर पिघले पीतल से ढालते हैं।',
    audioTextEnglish: 'Johar! I am Sukhlal Baghel from Bastar, Chhattisgarh. Our Dhokra craft dates back 4,000 years to the Indus Valley dancing girl. We harvest natural beeswax from Sal forests to sculpt the initial wax model, coat it in sacred river clay, and cast in melted brass.',
    waveform: [40, 75, 90, 65, 50, 85, 100, 70, 45, 80, 95, 60, 40, 75, 90, 85, 50, 65, 80, 95, 70, 50, 40, 30, 20]
  },
  {
    id: 'story-banarasi',
    craftName: 'Banarasi Kadwa Silk',
    artisanName: 'Master Ansari',
    region: 'Chowk, Varanasi',
    duration: '0:52',
    audioTextHindi: 'अस्सलाम वालेकुम। बनारस की कढ़वा बुनाई में हर ज़री का बूटा अलग-अलग सुइयों से हाथों से गूँथा जाता है। एक शाही साड़ी को पूरा होने में 3 से 4 महीने लगते हैं। यह सिर्फ कपड़ा नहीं, गंगा-जमुनी तहज़ीब और पुरखों की नेमत है।',
    audioTextEnglish: 'Greetings. In Banarasi Kadwa weaving, each gold zari motif is individually woven with micro-needles by hand. A single bridal saree takes 3 to 4 months of patient dedication on pit looms. It is living poetry of Indian handloom.',
    waveform: [30, 50, 70, 85, 95, 60, 45, 80, 100, 75, 60, 85, 90, 65, 45, 70, 85, 95, 60, 45, 55, 75, 60, 40, 25]
  }
];

export default function ArtisanAudioStoryteller() {
  const { lang } = useLanguage();
  const [activeStoryIdx, setActiveStoryIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioCtxRef = useRef(null);
  const oscillatorRef = useRef(null);

  const activeStory = AUDIO_STORIES[activeStoryIdx];

  // Stop sound when unmounted or paused
  const stopAudioTone = () => {
    try {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
        oscillatorRef.current = null;
      }
    } catch (e) {}
  };

  // Play pleasant acoustic ambient frequency
  const playAudioTone = () => {
    try {
      if (isMuted) return;
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      const osc = audioCtxRef.current.createOscillator();
      const gain = audioCtxRef.current.createGain();
      
      // Soothing warm pentatonic drone (D3 / A3 heritage tone)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(activeStoryIdx === 0 ? 146.83 : activeStoryIdx === 1 ? 220 : 164.81, audioCtxRef.current.currentTime);
      gain.gain.setValueAtTime(0.04, audioCtxRef.current.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtxRef.current.currentTime + 3);

      osc.connect(gain);
      gain.connect(audioCtxRef.current.destination);
      osc.start();
      oscillatorRef.current = osc;
    } catch (e) {
      console.warn('Web Audio synthesis error:', e);
    }
  };

  // Simulated playback timer & Speech Synthesis
  useEffect(() => {
    let interval;
    if (isPlaying) {
      playAudioTone();
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            stopAudioTone();
            return 0;
          }
          return prev + 2;
        });
      }, 500);
    } else {
      stopAudioTone();
    }
    return () => {
      clearInterval(interval);
      stopAudioTone();
    };
  }, [isPlaying, isMuted, activeStoryIdx]);

  const handleTogglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      stopAudioTone();
    } else {
      setIsPlaying(true);
      if ('speechSynthesis' in window && !isMuted) {
        window.speechSynthesis.cancel();
        const textToSpeak = lang === 'hi' ? activeStory.audioTextHindi : activeStory.audioTextEnglish;
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.rate = 0.95;
        utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
        
        // Find suitable voice if available
        const voices = window.speechSynthesis.getVoices();
        const matchingVoice = voices.find(v => (lang === 'hi' ? v.lang.includes('hi') : v.lang.includes('en')));
        if (matchingVoice) utterance.voice = matchingVoice;

        utterance.onend = () => {
          setIsPlaying(false);
          setProgress(100);
          stopAudioTone();
        };
        utterance.onerror = () => {
          console.warn('Speech synthesis playback fallback active');
        };
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <ScrollReveal>
        <div className="bg-gradient-to-br from-amber-50/80 via-white to-orange-50/40 dark:from-[#131B2A] dark:via-[#111622] dark:to-[#131B2A] rounded-3xl p-8 sm:p-12 border border-amber-200/70 dark:border-stone-800 shadow-xl relative overflow-hidden">
          
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Section Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-8 mb-8 border-b border-amber-200/50 dark:border-stone-800">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 mb-2 border border-amber-200 dark:border-amber-800/40">
                <Mic className="w-3.5 h-3.5 text-[#C85A32] dark:text-amber-400" />
                <span>{lang === 'hi' ? 'कारीगर की अपनी आवाज़' : 'Living Artisan Voices'}</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold font-serif text-stone-900 dark:text-stone-100">
                {lang === 'hi' ? 'हस्तशिल्प की अनकही कहानियाँ सुनें' : 'Listen to Untold Craft Stories'}
              </h2>
            </div>

            {/* Story Picker Tabs */}
            <div className="flex flex-wrap gap-2">
              {AUDIO_STORIES.map((st, idx) => (
                <button
                  key={st.id}
                  onClick={() => {
                    setActiveStoryIdx(idx);
                    setIsPlaying(false);
                    setProgress(0);
                    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeStoryIdx === idx
                      ? 'bg-stone-900 dark:bg-amber-500 text-white dark:text-stone-950 shadow-md'
                      : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:border-amber-400'
                  }`}
                >
                  {st.craftName}
                </button>
              ))}
            </div>
          </div>

          {/* Player Main Body */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Artisan Profile & Control */}
            <div className="lg:col-span-4 space-y-6">
              <div className="p-6 rounded-2xl bg-white dark:bg-[#1C263A] border border-amber-100 dark:border-stone-700 shadow-sm space-y-4">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#C85A32] dark:text-amber-400">
                    {lang === 'hi' ? 'मास्टर शिल्पकार' : 'Master Karigar'}
                  </div>
                  <h3 className="text-xl font-bold font-serif text-stone-900 dark:text-stone-100">
                    {activeStory.artisanName}
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    {activeStory.region}
                  </p>
                </div>

                {/* Big Play / Pause Button */}
                <div className="flex items-center gap-4 pt-2">
                  <button
                    onClick={handleTogglePlay}
                    className="w-14 h-14 rounded-2xl bg-gradient-to-r from-amber-600 to-[#C85A32] text-white flex items-center justify-center shadow-lg hover:scale-105 transition-all"
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                  </button>

                  <div className="flex-1">
                    <div className="text-xs font-bold text-stone-900 dark:text-stone-100">
                      {isPlaying ? (lang === 'hi' ? 'सुना जा रहा है...' : 'Now Playing...') : (lang === 'hi' ? 'कहानी सुनें' : 'Click to Play')}
                    </div>
                    <div className="text-[11px] text-stone-400 font-mono">
                      {activeStory.duration} • {lang === 'hi' ? 'ध्वनि आलेख' : 'Audio Story'}
                    </div>
                  </div>

                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
                    title={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Live Dynamic Waveform & Clean Transcript */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Animated Waveform Visualizer */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#1C263A] border border-amber-100 dark:border-stone-700 shadow-sm flex items-center justify-between gap-1.5 h-24 px-6 overflow-hidden">
                {activeStory.waveform.map((bar, idx) => (
                  <motion.div
                    key={idx}
                    animate={{
                      height: isPlaying ? [bar * 0.4, bar * 0.8, bar * 0.5] : `${bar * 0.5}%`,
                      backgroundColor: isPlaying && idx < (progress / 100) * activeStory.waveform.length
                        ? '#C85A32'
                        : '#CBD5E1'
                    }}
                    transition={{
                      duration: 0.4,
                      repeat: isPlaying ? Infinity : 0,
                      repeatType: 'reverse',
                      delay: idx * 0.03
                    }}
                    className="flex-1 rounded-full min-h-[4px]"
                  />
                ))}
              </div>

              {/* Clean Single Language Transcript */}
              <div className="p-6 rounded-2xl bg-white/70 dark:bg-[#1C263A]/70 border border-stone-200 dark:border-stone-700 space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                  {lang === 'hi' ? 'आधिकारिक आलेख' : 'Artisan Narrative Transcript'}
                </div>
                <p className="text-sm sm:text-base text-stone-800 dark:text-stone-200 leading-relaxed font-serif italic">
                  "{lang === 'hi' ? activeStory.audioTextHindi : activeStory.audioTextEnglish}"
                </p>
              </div>
            </div>

          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
