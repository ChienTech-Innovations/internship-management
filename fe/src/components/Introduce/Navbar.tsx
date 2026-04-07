"use client";

import { navLinks } from "@/components/mock/data";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";

const Navbar = ({ scrolled }: { scrolled: boolean }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { isAuthenticated, logout } = useAuthStore();

  const handleAuthAction = () => {
    if (isAuthenticated) {
      logout();
    } else {
      router.push("/login");
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Image
              src="/tma.webp"
              width={80}
              height={30}
              alt="InternHub logo"
            />
            <div className="flex flex-col">
              <h1
                className={`text-xl font-bold transition-colors duration-300 ${
                  scrolled ? "text-gray-900" : "text-white"
                }`}
              >
                InternHub
              </h1>
              <span
                className={`text-xs transition-colors duration-300 ${
                  scrolled ? "text-gray-500" : "text-blue-100"
                }`}
              >
                Professional Platform
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`font-medium transition-all duration-300 hover:scale-105 ${
                    scrolled
                      ? "text-gray-700 hover:text-blue-600"
                      : "text-white hover:text-blue-200"
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div className="hidden md:block">
            <button
              className={`px-6 py-2.5 font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                scrolled
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-white text-blue-600 hover:bg-blue-50"
              }`}
              onClick={handleAuthAction}
            >
              {isAuthenticated ? "Logout" : "Login"}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-lg transition-colors duration-300 ${
                scrolled ? "text-gray-700" : "text-white"
              }`}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <button
                className="w-full mt-4 px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors duration-200"
                onClick={handleAuthAction}
              >
                {isAuthenticated ? "Logout" : "Login"}
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
