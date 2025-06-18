import React, { useState, useEffect } from 'react';
import { Play, Pause, Search, Link, Monitor, Clock, Globe, User } from 'lucide-react';

interface ViewerState {
  id: number;
  mode: 'search' | 'link';
  keyword: string;
  videoUrl: string;
  resultRank: number;
  resolution: string;
  duration: number;
  proxy: string;
  userAgent: string;
  status: 'idle' | 'watching' | 'done';
  timeRemaining: number;
  videoTitle: string;
  videoThumbnail: string;
}

const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (iPad; CPU OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1'
];

const mockSearchResults = [
  { title: 'Lofi Hip Hop Beats - Study Music 2024', thumbnail: 'https://images.pexels.com/photos/4709285/pexels-photo-4709285.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop' },
  { title: 'Relaxing Jazz Music for Work & Study', thumbnail: 'https://images.pexels.com/photos/164936/pexels-photo-164936.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop' },
  { title: 'Deep House Mix 2024 - Best Electronic Music', thumbnail: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop' },
  { title: 'Ambient Chillout Music - Relaxation Sounds', thumbnail: 'https://images.pexels.com/photos/1694900/pexels-photo-1694900.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop' },
  { title: 'Piano Instrumental Music - Peaceful Melody', thumbnail: 'https://images.pexels.com/photos/210887/pexels-photo-210887.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop' }
];

function App() {
  const [viewers, setViewers] = useState<ViewerState[]>(() => 
    Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      mode: 'search' as const,
      keyword: '',
      videoUrl: '',
      resultRank: 1,
      resolution: '720p',
      duration: 5,
      proxy: '',
      userAgent: userAgents[Math.floor(Math.random() * userAgents.length)],
      status: 'idle' as const,
      timeRemaining: 0,
      videoTitle: '',
      videoThumbnail: ''
    }))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setViewers(prev => prev.map(viewer => {
        if (viewer.status === 'watching' && viewer.timeRemaining > 0) {
          const newTimeRemaining = viewer.timeRemaining - 1;
          return {
            ...viewer,
            timeRemaining: newTimeRemaining,
            status: newTimeRemaining === 0 ? 'done' : 'watching'
          };
        }
        return viewer;
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const updateViewer = (id: number, updates: Partial<ViewerState>) => {
    setViewers(prev => prev.map(viewer => 
      viewer.id === id ? { ...viewer, ...updates } : viewer
    ));
  };

  const generateRandomUserAgent = (id: number) => {
    const randomUA = userAgents[Math.floor(Math.random() * userAgents.length)];
    updateViewer(id, { userAgent: randomUA });
  };

  const loadSuggestions = (id: number, keyword: string, rank: number) => {
    if (!keyword.trim()) return;
    
    const mockResult = mockSearchResults[Math.floor(Math.random() * mockSearchResults.length)];
    updateViewer(id, {
      videoTitle: `${mockResult.title} (Rank ${rank})`,
      videoThumbnail: mockResult.thumbnail
    });
  };

  const startViewing = (id: number) => {
    const viewer = viewers.find(v => v.id === id);
    if (!viewer) return;

    if (viewer.mode === 'search' && !viewer.keyword.trim()) {
      alert('Please enter a search keyword');
      return;
    }
    if (viewer.mode === 'link' && !viewer.videoUrl.trim()) {
      alert('Please enter a video URL');
      return;
    }

    updateViewer(id, {
      status: 'watching',
      timeRemaining: viewer.duration * 60
    });
  };

  const stopViewing = (id: number) => {
    updateViewer(id, {
      status: 'idle',
      timeRemaining: 0
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'watching': return 'text-green-400';
      case 'done': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'watching': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'done': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black">
      {/* Header */}
      <div className="bg-black/50 backdrop-blur-lg border-b border-gray-800">
        <div className="container mx-auto px-6 py-8">
          <h1 className="text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-orbitron">
            YT Auto ViewBot
          </h1>
          <p className="text-center text-gray-300 mt-3 text-lg font-inter">
            Watch 5 YouTube Videos at Once
          </p>
        </div>
      </div>

      {/* Main Dashboard */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-6">
          {viewers.map((viewer) => (
            <div key={viewer.id} className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 hover:border-cyan-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10">
              {/* Card Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white font-orbitron">
                  Viewer {viewer.id}
                </h2>
                <div className={`px-3 py-1 rounded-full border text-sm font-medium ${getStatusBadgeColor(viewer.status)}`}>
                  {viewer.status.toUpperCase()}
                </div>
              </div>

              {/* Mode Toggle */}
              <div className="mb-6">
                <div className="flex rounded-lg bg-gray-700/50 p-1">
                  <button
                    onClick={() => updateViewer(viewer.id, { mode: 'search' })}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-all duration-200 ${
                      viewer.mode === 'search'
                        ? 'bg-cyan-500 text-white shadow-lg'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    <Search size={16} />
                    Search
                  </button>
                  <button
                    onClick={() => updateViewer(viewer.id, { mode: 'link' })}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-all duration-200 ${
                      viewer.mode === 'link'
                        ? 'bg-cyan-500 text-white shadow-lg'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    <Link size={16} />
                    Link
                  </button>
                </div>
              </div>

              {/* Input Section */}
              <div className="space-y-4 mb-6">
                {viewer.mode === 'search' ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Search Keyword
                      </label>
                      <input
                        type="text"
                        value={viewer.keyword}
                        onChange={(e) => updateViewer(viewer.id, { keyword: e.target.value })}
                        placeholder="e.g. lofi beats 2024"
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Result Rank
                      </label>
                      <select
                        value={viewer.resultRank}
                        onChange={(e) => updateViewer(viewer.id, { resultRank: parseInt(e.target.value) })}
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                      >
                        {Array.from({ length: 10 }, (_, i) => (
                          <option key={i + 1} value={i + 1}>
                            Rank {i + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={() => loadSuggestions(viewer.id, viewer.keyword, viewer.resultRank)}
                      disabled={!viewer.keyword.trim()}
                      className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      Load Suggestions
                    </button>
                  </>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      YouTube Video URL
                    </label>
                    <input
                      type="url"
                      value={viewer.videoUrl}
                      onChange={(e) => updateViewer(viewer.id, { videoUrl: e.target.value })}
                      placeholder="https://youtube.com/watch?v=..."
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200"
                    />
                  </div>
                )}

                {/* Video Preview */}
                {viewer.videoTitle && (
                  <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30">
                    <div className="flex gap-3">
                      <img
                        src={viewer.videoThumbnail}
                        alt="Video thumbnail"
                        className="w-16 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white font-medium truncate">
                          {viewer.videoTitle}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Ready to view
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Monitor size={16} className="inline mr-1" />
                      Resolution
                    </label>
                    <select
                      value={viewer.resolution}
                      onChange={(e) => updateViewer(viewer.id, { resolution: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white text-sm focus:border-cyan-500"
                    >
                      <option value="144p">144p</option>
                      <option value="360p">360p</option>
                      <option value="720p">720p</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Clock size={16} className="inline mr-1" />
                      Duration
                    </label>
                    <select
                      value={viewer.duration}
                      onChange={(e) => updateViewer(viewer.id, { duration: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white text-sm focus:border-cyan-500"
                    >
                      <option value={5}>5 min</option>
                      <option value={6}>6 min</option>
                      <option value={8}>8 min</option>
                      <option value={10}>10 min</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Globe size={16} className="inline mr-1" />
                    Manual Proxy
                  </label>
                  <input
                    type="text"
                    value={viewer.proxy}
                    onChange={(e) => updateViewer(viewer.id, { proxy: e.target.value })}
                    placeholder="IP:PORT or IP:PORT:USER:PASS"
                    className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 text-sm focus:border-cyan-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-300">
                      <User size={16} className="inline mr-1" />
                      User Agent
                    </label>
                    <button
                      onClick={() => generateRandomUserAgent(viewer.id)}
                      className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      Regenerate
                    </button>
                  </div>
                  <textarea
                    value={viewer.userAgent}
                    readOnly
                    className="w-full px-4 py-2 bg-gray-700/30 border border-gray-600/50 rounded-lg text-gray-300 text-xs resize-none h-16"
                  />
                </div>
              </div>

              {/* Status and Timer */}
              {viewer.status === 'watching' && (
                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-green-400 font-medium">Watching...</span>
                    <span className={`text-2xl font-bold font-mono ${viewer.timeRemaining <= 60 ? 'animate-pulse text-red-400' : 'text-green-400'}`}>
                      {formatTime(viewer.timeRemaining)}
                    </span>
                  </div>
                  <div className="mt-2 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-cyan-400 h-2 rounded-full transition-all duration-1000"
                      style={{ 
                        width: `${((viewer.duration * 60 - viewer.timeRemaining) / (viewer.duration * 60)) * 100}%` 
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={() => viewer.status === 'watching' ? stopViewing(viewer.id) : startViewing(viewer.id)}
                disabled={viewer.status === 'done'}
                className={`w-full px-6 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 ${
                  viewer.status === 'watching'
                    ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg shadow-red-500/25'
                    : viewer.status === 'done'
                    ? 'bg-gray-600 cursor-not-allowed text-gray-400'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white shadow-lg shadow-cyan-500/25'
                }`}
              >
                {viewer.status === 'watching' ? (
                  <>
                    <Pause size={20} />
                    Stop Viewing
                  </>
                ) : viewer.status === 'done' ? (
                  'Completed'
                ) : (
                  <>
                    <Play size={20} />
                    Start Viewing
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;