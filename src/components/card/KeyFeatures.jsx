import React from "react";
import { features } from "../../data/features";
import FeatureCard from "../card/FeatureCard";

const KeyFeatures = () => (
  <section className="py-20 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Key Features
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Everything you need for a seamless dues verification experience.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </div>
  </section>
);

export default KeyFeatures;
