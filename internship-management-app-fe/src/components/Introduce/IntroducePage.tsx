"use client";

import React, { useEffect, useState } from "react";
import Footer from "@/components/Introduce/Footer";
import Introduce from "@/components/Introduce/Introduce";
import Metric from "@/components/Introduce/Metric";
import Feature from "@/components/Introduce/Feature";
import Benefit from "@/components/Introduce/Benefit";
import Testimonial from "@/components/Introduce/Testimonial";
import Navbar from "@/components/Introduce/Navbar";

const IntroducePage = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar scrolled={scrolled} />
      <Introduce />
      <Metric />
      <Feature />
      <Benefit />
      <Testimonial />
      <Footer />
    </div>
  );
};

export default IntroducePage;
