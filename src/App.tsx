import React from 'react';
import ReelFeed from './components/ReelFeed';
import DiscoveryMap from './components/DiscoveryMap';

export default function App() {
  return (
    /* 
      1. flex: Puts children side by side
      2. overflow-x-scroll: Enables horizontal scrolling
      3. snap-x snap-mandatory: Forces the screen to lock into place (no half-scrolling)
    */
    <div className="h-screen w-full flex overflow-x-scroll snap-x snap-mandatory scrollbar-none bg-black">
      
      {/* Left Screen: The Vertical Feed */}
      <div className="min-w-full h-full snap-start relative">
        <ReelFeed />
      </div>

      {/* Right Screen: The Discovery Map */}
      <div className="min-w-full h-full snap-start relative border-l border-zinc-900">
        <DiscoveryMap />
      </div>

    </div>
  );
}