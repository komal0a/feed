import { Navigation, Search } from 'lucide-react';

export default function DiscoveryMap() {
  return (
    <div className="h-screen w-full bg-zinc-950 relative overflow-hidden flex flex-col">
      {/* Search Header */}
      <div className="absolute top-0 left-0 right-0 p-6 pt-12 z-20 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex gap-4 items-center bg-zinc-900/80 backdrop-blur-md p-4 rounded-2xl border border-zinc-800">
          <Search className="w-5 h-5 text-zinc-400" />
          <input 
            type="text" 
            placeholder="Search neighborhoods or cravings..." 
            className="bg-transparent border-none outline-none text-white w-full placeholder-zinc-500"
          />
        </div>
      </div>

      {/* Mock Map Background (Dark Radar Grid) */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle at center, #3f3f46 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      {/* Center Position Marker */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
        <div className="w-16 h-16 bg-emerald-500/20 rounded-full animate-ping absolute" />
        <div className="w-4 h-4 bg-emerald-500 rounded-full border-2 border-zinc-900 z-10" />
      </div>

      {/* Floating Trending Thumbnail 1 */}
      <div className="absolute top-1/3 left-1/4 z-10 group cursor-pointer">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-zinc-800 group-hover:border-white transition-colors shadow-xl">
          <video src="/video1.mp4" autoPlay loop muted className="w-full h-full object-cover" />
        </div>
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-zinc-900 px-3 py-1 rounded-full text-xs text-white whitespace-nowrap font-medium border border-zinc-800">
          Lava Cake • 2m
        </div>
      </div>

      {/* Floating Trending Thumbnail 2 */}
      <div className="absolute bottom-1/3 right-1/4 z-10 group cursor-pointer">
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
          <video src="/video2.mp4" autoPlay loop muted className="w-full h-full object-cover" />
        </div>
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-zinc-900 px-3 py-1 rounded-full text-xs text-emerald-400 whitespace-nowrap font-medium border border-zinc-800">
          Trending 🔥
        </div>
      </div>

      {/* Swipe Back Hint */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 text-zinc-500 text-sm font-medium">
        <Navigation className="w-4 h-4 -rotate-90" />
        Swipe left for Feed
      </div>
    </div>
  );
}
