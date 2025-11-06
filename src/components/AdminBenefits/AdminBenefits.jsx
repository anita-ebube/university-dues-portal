import React from "react";
import BenefitCard from "./BenefitCard";
import { benefits } from "../../data/benefits";

const AdminBenefits = () => (
  <section className="py-20 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Benefits for Administrators
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          A centralized and efficient system for managing student dues.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {benefits.map((benefit, index) => (
          <BenefitCard key={index} {...benefit} />
        ))}
      </div>
    </div>
  </section>
);

export default AdminBenefits;
