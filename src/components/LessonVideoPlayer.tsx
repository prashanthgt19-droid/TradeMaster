import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Video, 
  CheckCircle2, 
  Clock, 
  Edit3, 
  ExternalLink, 
  RotateCcw, 
  Sparkles, 
  AlertCircle,
  HelpCircle,
  Info
} from 'lucide-react';
import { Lesson } from '../types';

interface Props {
  lesson: Lesson;
  onVideoComplete?: () => void;
}

// Verified educational video IDs for trading topics
const DEFAULT_TOPIC_VIDEOS: Record<number, { id: string; title: string; channel: string; duration: string }> = {
  1: { id: 'p7HKvqRI_Bo', title: 'Stock Market Basics & How Exchanges Work', channel: 'Financial Education', duration: '14 mins' },
  2: { id: 'C32_X7y5c_w', title: 'The Ultimate Candlestick Patterns Masterclass', channel: 'Trading Strategy Guides', duration: '16 mins' },
  3: { id: 'pX8msjL9e88', title: 'Support, Resistance & Trendline Analysis Secrets', channel: 'Price Action Academy', duration: '15 mins' },
  4: { id: 'n7Z45c8P47Q', title: 'Technical Indicators: RSI, EMA & MACD Guide', channel: 'Market Strategies', duration: '18 mins' },
  5: { id: 'eA2v4N2x5B4', title: 'Intraday Trading Setups & VWAP Strategies', channel: 'Day Trading Pro', duration: '15 mins' },
  6: { id: 'r6j2yY7L2q8', title: 'Price Action & Breakout Trading Secrets', channel: 'Chart Reading Pro', duration: '14 mins' },
  7: { id: '0v74K_69DoQ', title: 'Futures & Options (F&O) Concepts Explained', channel: 'Derivatives Masterclass', duration: '20 mins' },
  8: { id: 'a2v7c4_j2nQ', title: 'Risk Management & Position Sizing 1% Rule', channel: 'Capital Preservation', duration: '12 mins' },
  9: { id: 'wYv2c4N7m8s', title: 'Trading Psychology & Overcoming FOMO/Greed', channel: 'Trading Mindset', duration: '13 mins' },
  10: { id: 'vL7x5z8N4cQ', title: 'Forex Currency Pairs, Pips, Lots & RBI Guidelines', channel: 'Global Forex Academy', duration: '17 mins' },
  11: { id: 'ybXk8v4m2wQ', title: 'Cryptocurrency Trading & Liquidation Risk Controls', channel: 'Crypto Navigator', duration: '15 mins' },
};

// Extract standard 11-char YouTube video ID or detect direct MP4 video URL
export function parseVideoSource(urlOrId: string): { type: 'youtube' | 'direct'; value: string } {
  if (!urlOrId) return { type: 'youtube', value: 'p7HKvqRI_Bo' };
  const trimmed = urlOrId.trim();

  // Direct MP4 / WebM video file
  if (/\.(mp4|webm|ogg)($|\?)/i.test(trimmed)) {
    return { type: 'direct', value: trimmed };
  }

  // Direct 11 character YouTube ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return { type: 'youtube', value: trimmed };
  }

  // youtu.be/ID
  const shortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return { type: 'youtube', value: shortMatch[1] };

  // youtube.com/watch?v=ID
  const watchMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch) return { type: 'youtube', value: watchMatch[1] };

  // youtube.com/embed/ID
  const embedMatch = trimmed.match(/embed\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch) return { type: 'youtube', value: embedMatch[1] };

  return { type: 'youtube', value: trimmed };
}

export const LessonVideoPlayer: React.FC<Props> = ({ lesson, onVideoComplete }) => {
  const topicDefault = DEFAULT_TOPIC_VIDEOS[lesson.level] || DEFAULT_TOPIC_VIDEOS[1];
  const defaultSource = lesson.video?.youtubeId || lesson.video?.videoUrl || topicDefault.id;

  const storageKey = `tm_custom_video_${lesson.id}`;
  const watchedKey = `tm_video_watched_${lesson.id}`;

  const [activeSource, setActiveSource] = useState<string>(() => {
    return localStorage.getItem(storageKey) || defaultSource;
  });

  const [isWatched, setIsWatched] = useState<boolean>(() => {
    return localStorage.getItem(watchedKey) === 'true';
  });

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [inputUrl, setInputUrl] = useState<string>(activeSource);
  const [editError, setEditError] = useState<string>('');
  const [iframeBlockedNotice, setIframeBlockedNotice] = useState<boolean>(false);

  const parsed = parseVideoSource(activeSource);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    const src = saved || lesson.video?.youtubeId || lesson.video?.videoUrl || topicDefault.id;
    setActiveSource(src);
    setInputUrl(src);
    setIsWatched(localStorage.getItem(watchedKey) === 'true');
    setIsPlaying(false);
    setIframeBlockedNotice(false);
  }, [lesson.id]);

  const handleSaveCustomVideo = () => {
    setEditError('');
    if (!inputUrl.trim()) {
      setEditError('Please paste a YouTube URL, video ID, or direct MP4 link.');
      return;
    }

    const res = parseVideoSource(inputUrl);
    setActiveSource(res.value);
    localStorage.setItem(storageKey, res.value);
    setIsEditing(false);
    setIsPlaying(true);
  };

  const handleResetToDefault = () => {
    localStorage.removeItem(storageKey);
    const initial = lesson.video?.youtubeId || lesson.video?.videoUrl || topicDefault.id;
    setActiveSource(initial);
    setInputUrl(initial);
    setIsEditing(false);
  };

  const handleToggleWatched = () => {
    const nextState = !isWatched;
    setIsWatched(nextState);
    localStorage.setItem(watchedKey, String(nextState));
    if (nextState && onVideoComplete) {
      onVideoComplete();
    }
  };

  const videoMeta = lesson.video || {
    title: `${lesson.title} - Video Masterclass`,
    channelName: topicDefault.channel,
    duration: topicDefault.duration,
  };

  const youtubeWatchUrl = `https://www.youtube.com/watch?v=${parsed.value}`;

  return (
    <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl mb-6">
      {/* Video Container (16:9 Aspect Ratio) */}
      <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
        {isPlaying ? (
          parsed.type === 'direct' ? (
            <video
              src={parsed.value}
              controls
              autoPlay
              className="w-full h-full object-contain bg-black"
            >
              Your browser does not support HTML5 video.
            </video>
          ) : (
            <div className="relative w-full h-full">
              <iframe
                src={`https://www.youtube.com/embed/${parsed.value}?autoplay=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`}
                title={videoMeta.title || lesson.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />

              {/* Float helper in case browser or nested iframe restricts YouTube */}
              <div className="absolute top-2 right-2 z-20">
                <a
                  href={youtubeWatchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-black/80 hover:bg-red-600 text-white text-[11px] font-bold flex items-center gap-1 backdrop-blur-sm border border-white/20 transition-all shadow-lg"
                  title="Open video directly in YouTube App or Tab"
                >
                  <ExternalLink size={11} />
                  <span>Open in YouTube</span>
                </a>
              </div>
            </div>
          )
        ) : (
          <div className="relative w-full h-full flex flex-col items-center justify-center text-center p-6 bg-gradient-to-t from-slate-950 via-slate-900 to-slate-950 group">
            {/* Background Thumbnail Image */}
            {parsed.type === 'youtube' && (
              <img
                src={`https://img.youtube.com/vi/${parsed.value}/hqdefault.jpg`}
                alt="Video preview"
                className="absolute inset-0 w-full h-full object-cover opacity-40 filter blur-xs group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            )}

            {/* Play Button Overlay */}
            <div className="relative z-10 space-y-3.5 max-w-md mx-auto">
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setIsPlaying(true)}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-slate-950 flex items-center justify-center transition-all shadow-2xl shadow-emerald-500/40 hover:scale-110 mx-auto cursor-pointer"
                  title="Play Video Lesson In-App"
                >
                  <Play size={28} className="fill-slate-950 ml-1" />
                </button>
              </div>

              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 inline-flex items-center gap-1 mb-1.5">
                  <Video size={11} /> Video Masterclass
                </span>
                <h3 className="text-sm sm:text-base font-black text-white line-clamp-2">
                  {videoMeta.title || lesson.title}
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Watch step-by-step video breakdown with interactive notes
                </p>
              </div>

              {/* Direct YouTube button on thumbnail for instant 100% reliable play */}
              {parsed.type === 'youtube' && (
                <div className="pt-1 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-all shadow-md"
                  >
                    <Play size={13} className="fill-slate-950" />
                    <span>Watch In-App</span>
                  </button>
                  <a
                    href={youtubeWatchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-xl bg-red-600/90 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-red-600/20"
                  >
                    <ExternalLink size={13} />
                    <span>Open in YouTube App</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Video Controls & Meta Bar */}
      <div className="p-4 sm:p-5 bg-slate-900 border-t border-slate-800 text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-white font-extrabold text-xs sm:text-sm">
                {videoMeta.title || lesson.title}
              </span>
              {isWatched && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 size={11} /> Completed
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 text-slate-400 text-[11px]">
              <span>{videoMeta.channelName || 'TradeMaster India'}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock size={11} /> {videoMeta.duration || `${lesson.estimatedMinutes} mins`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Direct Open in YouTube */}
            {parsed.type === 'youtube' && (
              <a
                href={youtubeWatchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl font-bold text-xs bg-red-600 hover:bg-red-500 text-white transition-all flex items-center gap-1.5 shadow-md shadow-red-600/20"
                title="Watch on YouTube (guaranteed to play if iframe is restricted)"
              >
                <ExternalLink size={13} />
                <span className="hidden sm:inline">Watch on</span> YouTube
              </a>
            )}

            {/* Mark as Watched Button */}
            <button
              onClick={handleToggleWatched}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
                isWatched
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
              }`}
            >
              <CheckCircle2 size={13} className={isWatched ? 'text-emerald-400' : 'text-slate-400'} />
              <span>{isWatched ? 'Watched' : 'Mark Watched'}</span>
            </button>

            {/* Custom Video Editor Button */}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              title="Add or Change Video for this lesson"
            >
              <Edit3 size={15} />
            </button>
          </div>
        </div>

        {/* Video Editor Panel (Allows user to paste custom YouTube link, channel video, or MP4 URL) */}
        {isEditing && (
          <div className="mt-4 pt-3 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-bold text-[11px] flex items-center gap-1">
                <Sparkles size={12} className="text-amber-400" />
                <span>Customize Lesson Video (YouTube Link / Video ID / MP4):</span>
              </span>
              <button
                onClick={handleResetToDefault}
                className="text-[10px] text-slate-400 hover:text-white underline flex items-center gap-1"
              >
                <RotateCcw size={10} /> Reset to Default
              </button>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="e.g. https://www.youtube.com/watch?v=... or direct .mp4 URL"
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={handleSaveCustomVideo}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shrink-0"
              >
                Apply Video
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`${lesson.title} trading tutorial stock market`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-[11px] flex items-center gap-1.5 transition-colors border border-slate-700"
              >
                <ExternalLink size={12} className="text-red-400" />
                <span>Search Top YouTube Videos for "{lesson.title}"</span>
              </a>
            </div>

            {editError && (
              <p className="text-[11px] text-red-400 flex items-center gap-1">
                <AlertCircle size={12} /> {editError}
              </p>
            )}

            {/* Quick Free Creator Guide */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-[11px] text-slate-300">
              <p className="font-bold text-amber-400 flex items-center gap-1">
                <Sparkles size={12} /> How to Create Professional Lesson Videos for Free (₹0):
              </p>
              <ul className="space-y-1 text-slate-400 list-disc list-inside text-[10px]">
                <li><strong>Screen & Chart Recording:</strong> Use free <em>OBS Studio</em> or <em>Windows Game Bar (Win+G)</em> to record live TradingView charts in 1080p.</li>
                <li><strong>Visual Slides:</strong> Use free <em>Canva</em> for candlestick diagrams, bullet point summaries, and thumbnails.</li>
                <li><strong>Voiceover:</strong> Use free <em>ElevenLabs</em> or <em>Clipchamp Text-to-Speech</em> for studio-quality AI narration without needing a microphone.</li>
                <li><strong>Hosting:</strong> Upload as Unlisted or Public to your YouTube channel, then paste the URL above!</li>
              </ul>
            </div>
          </div>
        )}

        {/* Informative advice note on browser iframe restrictions */}
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-start gap-2 text-[11px] text-slate-400 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/60">
          <Info size={14} className="text-indigo-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span>
              <strong>Playback Tip:</strong> If your browser blocks embedded video playback due to cookie privacy policies or ad-blockers, simply tap the red <strong className="text-red-400">Open in YouTube</strong> button above to watch directly with zero restrictions.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
