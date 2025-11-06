import React from "react";

const FeatureCard = ({ icon: Icon, title, description, bgColor = "bg-green-50" }) => (
  <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow">
    <div className={`${bgColor} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
      {Icon && <Icon className="w-6 h-6 text-green-700" />}
    </div>

    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
  </div>
);

export default FeatureCard;