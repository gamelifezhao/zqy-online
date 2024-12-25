"use client";
import React from "react";
import { Quote } from "@/components/ui/Quote";

const Home = () => {
  return (
    <div className="relative min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-4 text-primary">
            昀  の世界
          </h1>
          <p className="text-xl text-primary/80">
            Here's an argvchs...
          </p>
        </div>
      </div>
    
      {/* Quote Section */}
      {/* <div className="container mx-auto px-4 py-16">
        <Quote />
      </div> */}
    </div>
  );
};

export default Home;
