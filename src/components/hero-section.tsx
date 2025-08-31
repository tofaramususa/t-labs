"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HeroSection() {
  return (
    <section className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Background Dotted Pattern - More accurate positioning */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Main flowing dotted pattern in center-right area */}
        <div 
          className="absolute top-1/2 left-1/2 w-[800px] h-[400px] transform -translate-y-1/2 translate-x-8"
          style={{ 
            backgroundImage: `radial-gradient(circle at 3px 3px, rgba(255,255,255,0.12) 2px, transparent 2px)`,
            backgroundSize: '12px 12px',
            maskImage: 'radial-gradient(ellipse 80% 60% at center, black 20%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at center, black 20%, transparent 80%)',
          }}
        />
        
        {/* Additional subtle pattern layers */}
        <div 
          className="absolute top-[45%] left-[55%] w-[600px] h-[300px] transform -translate-y-1/2"
          style={{ 
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.08) 1px, transparent 1px)`,
            backgroundSize: '8px 8px',
            maskImage: 'radial-gradient(ellipse 70% 50% at center, black 30%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 50% at center, black 30%, transparent 70%)',
          }}
        />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Hero Content - Main Layout */}
        <div className="flex-1 flex items-center">
          <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Side - Main Headlines */}
              <div className="lg:col-span-7 pt-16 lg:pt-0">
                <div className="space-y-2 lg:space-y-1">
                  <h1 className={cn(
                    "hero-headline text-white",
                    "text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl",
                    "font-light tracking-tight leading-[0.9] lg:leading-[0.85]"
                  )}>
                    Craft exceptional
                  </h1>
                </div>
              </div>

              {/* Right Side - API experiences */}
              <div className="lg:col-span-5 lg:mt-16">
                <h2 className={cn(
                  "hero-headline text-white",
                  "text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl",
                  "font-light tracking-tight leading-[0.9] lg:leading-[0.85]",
                  "text-right"
                )}>
                  API experiences.
                </h2>
              </div>
            </div>

            {/* Second Row - Digital experiences */}
            <div className="mt-1 lg:mt-2">
              <div className="lg:col-span-7">
                <h1 className={cn(
                  "hero-headline text-white",
                  "text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl",
                  "font-light tracking-tight leading-[0.9] lg:leading-[0.85]"
                )}>
                  digital experiences.
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Content Area */}
        <div className="pb-16 lg:pb-20">
          <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
              
              {/* Left - Description Text */}
              <div className="lg:col-span-7 space-y-4">
                <p className="text-gray-300 text-base lg:text-lg leading-relaxed max-w-lg">
                  Create APIs that developers love and LLMs understand.
                </p>
                <p className="text-gray-300 text-base lg:text-lg leading-relaxed max-w-lg">
                  Polish OpenAPI, generate SDKs, and build MCP servers
                </p>
                <p className="text-gray-300 text-base lg:text-lg leading-relaxed max-w-lg">
                  all on our complete API development platform.
                </p>
              </div>

              {/* Right - CTA Buttons */}
              <div className="lg:col-span-5 lg:text-right">
                <div className="flex flex-col sm:flex-row lg:justify-end gap-4">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="font-inter font-medium tracking-widest uppercase text-xs px-8 py-4 border-gray-400 text-gray-300 hover:bg-gray-800 hover:border-white hover:text-white"
                  >
                    START BUILDING
                  </Button>
                  <Button 
                    variant="default" 
                    size="lg"
                    className="font-inter font-medium tracking-widest uppercase text-xs px-8 py-4 bg-white text-black hover:bg-gray-100"
                  >
                    BOOK A DEMO
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}