import React from 'react'
import { useNavigate } from 'react-router-dom'

const Hero = () => {
  const navigate = useNavigate()
  return (
     <section className="relative bg-gradient-to-br from-green-800 via-green-700 to-green-900 text-white overflow-hidden">
    <div className="absolute inset-0 opacity-10">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzBoLTZ2LTZoNnYtNmgtNnYtNmg2di02aC02djZoLTZ2LTZoNnYtNmgtNnYtNmgtNnY2aC02di02SDZ2Nmg2djZINnY2aDZ2Nmg2djZoNnY2aDZ2Nmg2di02aDZ2Nmg2di02aDZ2Nmg2di02aC02di02aDZ2LTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] bg-repeat"></div>
    </div>
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
          Streamline Your Dues Verification
        </h1>
        <p className="text-lg md:text-xl mb-10 text-green-50 max-w-2xl mx-auto">
          Easily upload your payment proof and get verified quickly. Administrators can efficiently manage and verify student payments.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={() => navigate('/register')}  className="bg-white text-green-800 px-8 py-3 rounded-md font-semibold hover:bg-green-50 transition shadow-lg">
            Student Login
          </button>
          <button onClick={() => navigate('/login')} className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-md font-semibold hover:bg-white hover:text-green-800 transition">
            Admin Login
          </button>
        </div>
      </div>
    </div>
  </section>
  )
}

export default Hero
