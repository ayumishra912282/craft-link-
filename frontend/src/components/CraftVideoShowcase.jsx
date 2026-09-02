import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Play, Youtube, ExternalLink, Sparkles, Film,
  Clock, MapPin, Award, CheckCircle2
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import ScrollReveal from './ScrollReveal';
import LiquidGlassCard from './LiquidGlassCard';

export const CRAFT_VIDEOS = [
  {
    id: 'blue-pottery-jaipur',
    title: 'जयपुर की विश्वप्रसिद्ध नीली मिट्टी की कला व निर्माण',
    englishTitle: 'Jaipur Blue Pottery: The 400-Year Persian-Rajput Quartz Craft',
    channel: 'BBC Hindi & Culturebox',
    duration: '12:45',
    region: 'Jaipur, Rajasthan',
    category: 'Pottery & Ceramics',
    tag: 'GI Tag Heritage',
    thumbnail: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
    youtubeSearchUrl: 'https://www.youtube.com/results?search_query=Jaipur+Blue+Pottery+making+in+Hindi',
    descriptionHindi: 'जानिए कैसे बिना मिट्टी के केवल क्वार्ट्ज पत्थर, प्राकृतिक गोंद और तांबे के रंगों से तैयार होता है राजस्थान का गौरवशाली ब्लू पॉटरी।',
    descriptionEnglish: 'Discover how Rajasthan\'s royal blue pottery is hand-turned without clay using pure quartz crystal, gum, and Egyptian copper oxides.'
  },
  {
    id: 'dhokra-bastar',
    title: 'बस्तर ढोकरा शिल्प: 4000 वर्ष प्राचीन लॉस्ट-वैक्स कांस्य कला',
    englishTitle: 'Bastar Dhokra: The 4,000-Year Ancient Lost-Wax Bronze Craft',
    channel: 'Shades of Rural India / Aditya Birla Kaarigari',
    duration: '15:20',
    region: 'Bastar, Chhattisgarh',
    category: 'Tribal Metal Craft',
    tag: 'Ancient Bronze Age',
    thumbnail: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80',
    youtubeSearchUrl: 'https://www.youtube.com/results?search_query=Bastar+Dhokra+art+making+in+Hindi',
    descriptionHindi: 'मोहन जोदड़ो कालीन नृत्यांगना शैली से जुड़ी ढोकरा धातु कला, जिसे आज भी बस्तर के आदिवासी कारीगर मोम व मिट्टी की सांचों से ढालते हैं।',
    descriptionEnglish: 'Preserving 4,000-year-old Indus Valley lost-wax casting methods sculpted with natural beeswax from Sal forests and river clay.'
  },
  {
    id: 'banarasi-silk',
    title: 'बनारसी साड़ियों की बुनाई: कढ़वा व शुद्ध ज़री का जादू',
    englishTitle: 'Banarasi Handloom Silk: Heritage Kadwa Weaving & Pure Zari',
    channel: 'Doordarshan Heritage Hindi',
    duration: '18:10',
    region: 'Varanasi, Uttar Pradesh',
    category: 'Handloom & Textiles',
    tag: 'GI Protected Silk',
    thumbnail: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    youtubeSearchUrl: 'https://www.youtube.com/results?search_query=Banarasi+Saree+weaving+documentary+hindi',
    descriptionHindi: 'एक असली बनारसी साड़ी को तैयार करने में 3 से 6 महीने का समय और सैकड़ों वर्षों की पीढ़ी-दर-पीढ़ी विरासत।',
    descriptionEnglish: 'Witness master handloom weavers intertwining pure gold zari on pit looms over 3 to 6 months of master artisanal patience.'
  },
  {
    id: 'channapatna-toys',
    title: 'चेन्नापटनम खिलौने: 100% प्राकृतिक लाख व लकड़ी का चमत्कार',
    englishTitle: 'Channapatna Wooden Craft: Eco-Friendly Lacquer Toys',
    channel: 'Epic On India / The Better India Hindi',
    duration: '10:35',
    region: 'Channapatna, Karnataka',
    category: 'Woodcraft & Lacquerware',
    tag: 'Safe Non-Toxic GI',
    thumbnail: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
    youtubeSearchUrl: 'https://www.youtube.com/results?search_query=Channapatna+wooden+toys+documentary+hindi',
    descriptionHindi: 'टीपू सुल्तान कालीन 200 वर्ष पुरानी पारंपरिक कला जिसमें प्राकृतिक वनस्पति रंगों और आंवले की लाख से लकड़ी के खिलौने चमकते हैं।',
    descriptionEnglish: 'Organic lacquerware turned from ivory wood and colored with natural turmeric and indigo, sustaining 200 years of royal heritage.'
  }
];

export default function CraftVideoShowcase() {
  const { lang } = useLanguage();
  const [activeVideo, setActiveVideo] = useState(null);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <ScrollReveal>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40 mb-3">
              <Film className="w-3.5 h-3.5 text-[#C85A32] dark:text-amber-400" />
              <span>{lang === 'hi' ? 'भारतीय हस्तकला वृत्तचित्र' : 'Indian Craft Documentaries'}</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-serif text-stone-900 dark:text-stone-100 tracking-tight">
              {lang === 'hi' ? 'कारीगरों की कला का जीवंत दर्शन' : 'Living Heritage in Motion'}
            </h2>
          </div>
          <p className="text-sm text-stone-600 dark:text-stone-300 max-w-md font-sans leading-relaxed">
            {lang === 'hi'
              ? 'भारतीय कारीगरों की पीढ़ियों पुरानी कला यात्रा और शिल्प निर्माण विधियों को सीधे समझें।'
              : 'Authentic documentary stories highlighting the generational dedication of India\'s master artisans.'}
          </p>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {CRAFT_VIDEOS.map((video, idx) => (
          <ScrollReveal key={video.id} delay={idx * 0.08}>
            <div className="flex flex-col h-full bg-white dark:bg-[#131B2A] rounded-3xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all group">
              
              {/* Thumbnail with Direct Watch Link */}
              <div className="relative aspect-video overflow-hidden bg-stone-100 dark:bg-stone-900">
                <img
                  src={video.thumbnail}
                  alt={lang === 'hi' ? video.title : video.englishTitle}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Duration Badge */}
                <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/80 text-white text-[10px] font-mono font-bold backdrop-blur-xs flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>{video.duration}</span>
                </div>

                {/* GI Tag / Badge */}
                <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-white/90 dark:bg-stone-900/90 text-stone-900 dark:text-stone-100 text-[10px] font-bold border border-stone-200 dark:border-stone-700 shadow-xs">
                  {video.tag}
                </div>

                {/* Big YouTube Play Overlay */}
                <a
                  href={video.youtubeSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors"
                  title="Watch on YouTube"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-600 to-red-500 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-white ml-0.5" />
                  </div>
                </a>
              </div>

              {/* Video Details */}
              <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
                    <span className="font-bold text-[#C85A32] dark:text-amber-400">{video.category}</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{video.region}</span>
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100 leading-snug line-clamp-2">
                    {lang === 'hi' ? video.title : video.englishTitle}
                  </h3>

                  <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed line-clamp-3 font-sans">
                    {lang === 'hi' ? video.descriptionHindi : video.descriptionEnglish}
                  </p>
                </div>

                {/* Footer Action */}
                <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-stone-400 font-sans truncate max-w-[150px]">
                    {video.channel}
                  </span>
                  <a
                    href={video.youtubeSearchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-red-600 dark:text-red-400 hover:underline"
                  >
                    <span>Watch</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
