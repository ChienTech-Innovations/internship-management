import { metrics } from "@/components/mock/data";
import React from "react";

const Metric = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-2xl group-hover:scale-110 transition-transform duration-300 mb-4">
                  <Icon className={`w-8 h-8 ${metric.color}`} />
                </div>
                <div className={`text-4xl font-bold ${metric.color} mb-2`}>
                  {metric.value}
                </div>
                <div className="text-gray-600 font-medium">{metric.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Metric;
