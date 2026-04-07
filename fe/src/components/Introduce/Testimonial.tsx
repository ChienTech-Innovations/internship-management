import { testimonials } from "@/components/mock/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import React from "react";

const Testimonial = () => {
  return (
    <section id="testimonials" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            What People Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Hear from our interns, mentors, and partners about their experience
            with InternHub.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <Card key={index} className="text-center">
              <CardHeader className="text-center">
                <div className="w-14 h-14 bg-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <User className="w-7 h-7 text-white" />
                </div>
                <CardTitle>{t.name}</CardTitle>
                <p className="text-sm text-gray-500">{t.role}</p>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 italic">“{t.quote}”</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
