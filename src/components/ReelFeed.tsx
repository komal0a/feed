import { useRef, useEffect, useState } from 'react';
import { Heart, ShoppingBag, MessageCircle, MapPin } from 'lucide-react';

// --- TYPES ---
interface Reel {
  id: string;
  videoUrl: string;
  restaurant: string;
  dishName: string;
  price: string;
  lat?: number;
  lng?: number;
}

const demoReels: Reel[] = [
  {
    id: 'demo-1',
    videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    restaurant: 'Demo Kitchen',
    dishName: 'Connect the feed API to replace this demo reel',
    price: '₹299',
  },
];

// --- MAIN FEED COMPONENT ---
export default function ReelFeed() {
  const canLocate = 'geolocation' in navigator;
  const [reels, setReels] = useState<Reel[]>(canLocate ? [] : demoReels);
  const [loading, setLoading] = useState(canLocate);

  useEffect(() => {
    if (!canLocate) return;

    // 1. Grab user location
    navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          // 2. Fetch hyper-local food from backend
          try {
            const response = await fetch(`http://localhost:3000/api/feed?lat=${latitude}&lng=${longitude}`);
            if (!response.ok) {
              throw new Error(`Feed request failed with status ${response.status}`);
            }

            const data: unknown = await response.json();
            setReels(Array.isArray(data) && data.length > 0 ? data : demoReels);
          } catch (error) {
            console.error("Backend is asleep or unreachable", error);
            setReels(demoReels);
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          console.error("User denied location", error);
          setReels(demoReels);
          setLoading(false);
        }
    );
  }, [canLocate]);

  if (loading) {
    return (
      <div className="h-screen bg-black text-white flex items-center justify-center font-medium animate-pulse">
        Locating nearby cravings...
      </div>
    );
  }
  
  return (
    <div className="h-screen w-full bg-black overflow-y-scroll snap-y snap-mandatory scrollbar-none">
      {reels.length === 0 ? (
        <div className="h-full flex items-center justify-center text-zinc-500">No reels found in your area.</div>
      ) : (
        reels.map((reel) => (
          <ReelItem key={reel.id} reel={reel} />
        ))
      )}
    </div>
  );
}

// --- INDIVIDUAL REEL COMPONENT ---
function ReelItem({ reel }: { reel: Reel }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Handle auto-play and pause when scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoRef.current?.play()
            .then(() => setIsPlaying(true))
            .catch(() => setIsPlaying(false));
        } else {
          videoRef.current?.pause();
          setIsPlaying(false);
          setIsCheckoutOpen(false); // Close drawer if they scroll away
        }
      },
      { threshold: 0.6 } // Triggers when 60% of the video is visible
    );

    if (videoRef.current) observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="h-screen w-full snap-start relative flex items-center justify-center bg-black overflow-hidden">
      
      {/* 1. The Video */}
      <video
        ref={videoRef}
        src={reel.videoUrl}
        loop
        playsInline
        preload="metadata"
        muted // Muted by default for browser autoplay policies
        className="h-full w-full object-cover cursor-pointer"
        onCanPlay={() => setVideoError(false)}
        onError={() => {
          setVideoError(true);
          setIsPlaying(false);
        }}
        onClick={() => {
          if (isPlaying) videoRef.current?.pause();
          else videoRef.current?.play();
          setIsPlaying(!isPlaying);
        }}
      />

      {videoError && (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-zinc-400">
          Video unavailable
        </div>
      )}

      {/* 2. Social Interaction Bar (Right Side) */}
      <div className="absolute right-4 bottom-32 flex flex-col gap-6 text-white items-center z-10">
        <button className="p-3 bg-black/40 rounded-full backdrop-blur-md active:scale-90 transition-transform">
          <Heart className="w-6 h-6" />
        </button>
        <button className="p-3 bg-black/40 rounded-full backdrop-blur-md active:scale-90 transition-transform">
          <MessageCircle className="w-6 h-6" />
        </button>
      </div>

      {/* 3. Info & Trigger Overlay (Bottom) */}
      <div className="absolute bottom-0 left-0 right-0 p-6 pb-8 bg-gradient-to-t from-black/90 via-black/40 to-transparent text-white flex flex-col gap-4 z-10 pointer-events-none">
        <div className="pointer-events-auto">
          <h3 className="font-bold text-2xl tracking-tight">{reel.restaurant}</h3>
          <p className="text-sm text-zinc-300 font-medium">{reel.dishName}</p>
        </div>

        {/* The Trigger Button */}
        <button 
          onClick={() => setIsCheckoutOpen(true)}
          className="pointer-events-auto w-full bg-white text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-2xl"
        >
          <ShoppingBag className="w-5 h-5" />
          Grab This • {reel.price}
        </button>
      </div>

      {/* 4. The Slide-Up Checkout Drawer */}
      {isCheckoutOpen && (
        <div className="absolute inset-0 z-50 flex items-end justify-center">
          {/* Dimmed backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsCheckoutOpen(false)} 
          />
          
          {/* Drawer UI */}
          <div className="relative w-full bg-zinc-900 rounded-t-[2rem] p-6 pb-10 text-white animate-in slide-in-from-bottom-full duration-300 ease-out">
            {/* Drag Handle */}
            <div className="w-12 h-1.5 bg-zinc-700 rounded-full mx-auto mb-8" />
            
            <h2 className="text-2xl font-bold mb-1">Confirm Order</h2>
            <p className="text-zinc-400 mb-6">{reel.restaurant}</p>

            <div className="flex justify-between items-center bg-zinc-800/50 p-5 rounded-2xl mb-6 border border-zinc-800">
              <span className="font-medium text-lg">{reel.dishName}</span>
              <span className="font-bold text-lg">{reel.price}</span>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-zinc-400 mb-8">
              <MapPin className="w-4 h-4" />
              <p>Delivery to current location • ~25 mins</p>
            </div>

            {/* Final Action Button */}
            <button 
              onClick={() => alert('Routing to Stripe/Payment Gateway...')}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-lg py-4 rounded-2xl transition-colors shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
              Pay Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
