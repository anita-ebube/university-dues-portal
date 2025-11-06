import React from "react";

const BenefitCard = ({ icon: Icon, title, description,bgColor = "bg-green-50" }) => (
  <div className="bg-white rounded-lg p-8 text-center hover:shadow-xl transition-shadow">
    <div className={`${bgColor} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
      {Icon && <Icon className="w-6 h-6 text-green-700" />}
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

export default BenefitCard;
