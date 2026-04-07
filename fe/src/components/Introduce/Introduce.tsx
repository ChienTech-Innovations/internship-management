"use client";

import { metrics } from "@/components/mock/data";
import { Button } from "@/components/ui/button";
import { CircleCheck, Star, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useAuthStore } from "@/store/useAuthStore";

const Introduce = () => {
  const router = useRouter();
  const { isAuthenticated, redirectBasedOnRole, userDetails } = useAuthStore();

  const handleGetStarted = () => {
    if (isAuthenticated && userDetails) {
      redirectBasedOnRole(userDetails.role);
    } else {
      router.push("/login");
    }
  };

  return (
    <>
      <section
        id="introduce"
        className="relative min-h-screen flex items-center pt-16 bg-cover bg-center"
        style={{ backgroundImage: "url('/bg_banner_home.webp')" }}
      >
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Content Side */}
            <div className="text-white space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium">
                  <Star className="w-4 h-4 mr-2 text-yellow-300" />
                  Trusted by 500+ Organizations Worldwide
                </div>

                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Transform Your{" "}
                  <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                    Internship Program
                  </span>
                </h1>

                <p className="text-xl lg:text-2xl text-blue-100 leading-relaxed max-w-2xl">
                  Comprehensive platform that connects mentors and interns,
                  streamlines training processes, and delivers measurable
                  results for successful internship programs.
                </p>
              </div>

              <div className="flex justify-center">
                <Button className="group" onClick={handleGetStarted}>
                  Get Started Here
                </Button>
              </div>
              <div className="grid sm:grid-cols-3 gap-6 pt-8">
                {[
                  "No credit card required",
                  "14-day free trial",
                  "Setup in 5 minutes"
                ].map((text) => (
                  <div key={text} className="flex items-center gap-3">
                    <CircleCheck className="w-5 h-5 text-green-300 flex-shrink-0" />
                    <span className="text-blue-100">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Image Side */}
            <div className="relative">
              <div className="relative z-10">
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                  <div className="bg-white rounded-2xl p-6 shadow-2xl">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            Dashboard Overview
                          </h3>
                          <p className="text-sm text-gray-500">
                            Real-time analytics
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {metrics.slice(0, 4).map((metric, index) => {
                          const Icon = metric.icon;
                          return (
                            <div
                              key={index}
                              className="bg-gray-50 rounded-xl p-4 text-center"
                            >
                              <Icon
                                className={`w-6 h-6 mx-auto mb-2 ${metric.color}`}
                              />
                              <div
                                className={`text-2xl font-bold ${metric.color}`}
                              >
                                {metric.value}
                              </div>
                              <div className="text-xs text-gray-600">
                                {metric.label}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-20 h-20 bg-yellow-300 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-green-300 rounded-full opacity-20 animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Introduce;
