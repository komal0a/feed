import { useRef, useEffect, useState } from "react";
import { Heart, ShoppingBag, MessageCircle } from "lucide-react";

interface Reel {
  id: string;
  videoUrl: string;
  restaurant: string;
  dishName: string;
  price: string;
}

// Dummy data using public test streams
const SAMPLE_REELS: Reel[] = [
  {
    id: "1",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    restaurant: "The Corner Bakery",
    dishName: "Fudge Lava Cake",
    price: "₹299",
  },
  {
    id: "2",
    videoUrl: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
    restaurant: "Green Garden Bistro",
    dishName: "Harvest Avocado Salad",
    price: "₹349",
  },
];

export default function ReelFeed() {
  return (
    <div className="h-screen w-full bg-black overflow-y-scroll snap-y snap-mandatory scrollbar-none">
      {SAMPLE_REELS.map((reel) => (
        <ReelItem key={reel.id} reel={reel} />
      ))}
    </div>
  );
}

function ReelItem({ reel }: { reel: Reel }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoRef.current?.play().catch(() => {});
          setIsPlaying(true);
        } else {
          videoRef.current?.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.6 },
    );

    if (videoRef.current) observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="h-screen w-full snap-start relative flex items-center justify-center bg-black">
      {/* Video element */}
      <video
        ref={videoRef}
        src={reel.videoUrl}
        loop
        playsInline
        muted
        className="h-full w-full object-cover"
        onClick={() => {
          if (isPlaying) {
            videoRef.current?.pause();
          } else {
            videoRef.current?.play();
          }
          setIsPlaying(!isPlaying);
        }}
      />

      {/* Right Side Interaction Bar */}
      <div className="absolute right-4 bottom-32 flex flex-col gap-6 text-white items-center">
        <button className="p-2 bg-black/40 rounded-full backdrop-blur-md">
          <Heart className="w-7 h-7" />
        </button>
        <button className="p-2 bg-black/40 rounded-full backdrop-blur-md">
          <MessageCircle className="w-7 h-7" />
        </button>
      </div>

      {/* Bottom Information Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-linear-to-t from-black/80 to-transparent text-white flex flex-col gap-3">
        <div>
          <h3 className="font-bold text-lg">{reel.restaurant}</h3>
          <p className="text-sm text-gray-300">{reel.dishName}</p>
        </div>

        {/* Primary Action Call to Action */}
        <button className="w-full bg-white text-black font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
          <ShoppingBag className="w-5 h-5" />
          Order Now • {reel.price}
        </button>
      </div>
    </div>
  );
}
