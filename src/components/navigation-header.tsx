"use client";

import React from "react";
// import { ThemeSwitcher } from "@/components/theme/theme-switcher";
import { cn } from "@/lib/utils";

interface NavigationItem {
  label: string;
  href: string;
  hasDropdown?: boolean;
}

const navigationItems: NavigationItem[] = [
  { label: "Products", href: "/products", hasDropdown: true },
  { label: "Customers", href: "/customers" },
  { label: "Resources", href: "/resources", hasDropdown: true },
  { label: "Company", href: "/company", hasDropdown: true },
  { label: "Docs", href: "/docs" },
  { label: "Pricing", href: "/pricing" },
];

export function NavigationHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gray-800">
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-7 h-7 flex items-center justify-center">
            <svg 
              width="28" 
              height="28" 
              viewBox="0 0 24 24" 
              fill="none" 
              className="text-white"
            >
              <rect x="2" y="2" width="8" height="8" fill="currentColor" />
              <rect x="2" y="14" width="8" height="8" fill="currentColor" />
              <rect x="14" y="2" width="8" height="8" fill="currentColor" />
              <rect x="14" y="14" width="8" height="8" fill="currentColor" />
              <rect x="6" y="6" width="4" height="4" fill="black" />
              <rect x="6" y="18" width="4" height="4" fill="black" />
              <rect x="18" y="6" width="4" height="4" fill="black" />
              <rect x="18" y="18" width="4" height="4" fill="black" />
            </svg>
          </div>
          <span className="text-white font-inter font-normal text-xl tracking-wide">
            speakeasy
          </span>
        </div>

        {/* Navigation Items */}
        <div className="hidden md:flex items-center space-x-8">
          {navigationItems.map((item) => (
            <div key={item.label} className="relative group">
              <a
                href={item.href}
                className={cn(
                  "text-gray-300 hover:text-white font-inter text-sm font-medium transition-colors duration-200",
                  "flex items-center space-x-1"
                )}
              >
                <span>{item.label}</span>
                {item.hasDropdown && (
                  <svg 
                    width="12" 
                    height="12" 
                    viewBox="0 0 12 12" 
                    fill="none" 
                    className="text-gray-400"
                  >
                    <path 
                      d="M3 4.5L6 7.5L9 4.5" 
                      stroke="currentColor" 
                      strokeWidth="1.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </a>
            </div>
          ))}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          {/* Login */}
          <a
            href="/login"
            className="hidden md:inline-flex items-center px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200 font-inter"
          >
            LOG IN
          </a>

          {/* Book a Demo Button */}
          <a
            href="/demo"
            className="inline-flex items-center px-6 py-2.5 bg-white text-black text-sm font-medium font-inter rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            BOOK A DEMO
          </a>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white p-2">
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </nav>
    </header>
  );
}