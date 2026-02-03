"use client"

import { useState, useEffect } from "react"
import { Home, Car, Smartphone, BookOpen, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react"

const ecosystemItems = [
  {
    icon: Car,
    title: "Car Rentals",
    description: "Expanding regional and international rental operations.",
    image: "/images/whatsapp-20image-202025-11-13-20at-203.jpeg",
  },
  {
    icon: TrendingUp,
    title: "Perfume & Lifestyle",
    description: "Building luxury retail and online brands.",
    image: "/images/luxury-perfume-bottles-cosmetics-lifestyle-premium.jpg",
  },
  {
    icon: Home,
    title: "Real Estate",
    description: "Acquiring income-generating properties.",
    image: "/images/luxury-modern-real-estate-building-property-invest.jpg",
  },
  {
    icon: Smartphone,
    title: "Mobile Applications",
    description: "Launching utility-based and lifestyle apps.",
    image: "/images/mobile-application-development-smartphone-ui-desig.jpg",
  },
  {
    icon: BookOpen,
    title: "Education",
    description: "Investing in private educational ventures.",
    image: "/images/online-education-learning-platform-university-camp.jpg",
  },
  {
    icon: TrendingUp,
    title: "Trading Firms",
    description: "Establishing trading capital funds for steady income.",
    image: "/images/stock-market-trading-financial-charts-cryptocurren.jpg",
  },
]

export default function Ecosystem() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerView, setItemsPerView] = useState(1)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerView(3)
      } else if (window.innerWidth >= 768) {
        setItemsPerView(2)
      } else {
        setItemsPerView(1)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const maxIndex = Math.max(0, ecosystemItems.length - itemsPerView)

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0))
  }

  return (
    <section id="ecosystem" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#132b24]/50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white">Our Ecosystem</h2>
          <p className="text-base sm:text-lg md:text-xl text-[#b0d4cc] max-w-2xl mx-auto px-4">
            Real-world businesses backing VIOR token growth. From luxury perfumes to wellness products, each division
            generates tangible value for holders.
          </p>
        </div>

        {/* Slider Container */}
        <div className="relative">
          {/* Items Grid */}
          <div className="overflow-hidden">
            <div
              className="flex gap-6 transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
              }}
            >
              {ecosystemItems.map((item, idx) => {
                const Icon = item.icon
                return (
                  <div key={idx} className="flex-shrink-0" style={{ width: `${100 / itemsPerView}%` }}>
                    <div className="group relative rounded-2xl border border-[#00d4aa]/30 bg-[#0a1f1a] overflow-hidden hover:border-[#00d4aa]/60 transition-all duration-500 hover:shadow-2xl hover:shadow-[#00d4aa]/20 h-full mx-2">
                      {/* Image container with overlay */}
                      <div className="relative h-56 overflow-hidden bg-[#132b24]">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700 ease-out"
                        />
                        {/* Premium gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-b from-[#00d4aa]/0 via-[#00d4aa]/0 to-[#0a1f1a]/80 group-hover:from-[#00d4aa]/10 group-hover:via-[#00d4aa]/5 transition-all duration-500" />
                      </div>

                      {/* Content */}
                      <div className="relative p-6 sm:p-8 space-y-3 h-full flex flex-col">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00d4aa]/30 to-[#00d4aa]/10 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-[#00d4aa]/40 transition-all duration-300 border border-[#00d4aa]/40">
                          <Icon size={24} className="text-[#00d4aa]" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-[#00d4aa] transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-sm sm:text-base text-[#b0d4cc] flex-grow">{item.description}</p>

                        {/* Bottom accent line */}
                        <div className="pt-4 border-t border-[#00d4aa]/20 group-hover:border-[#00d4aa]/50 transition-all duration-300">
                          <div className="text-xs text-[#00d4aa] font-semibold">Learn More →</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={handlePrev}
            className="absolute -left-6 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-[#00d4aa] text-[#0a1f1a] hover:scale-110 transition-transform duration-300 hover:shadow-lg hover:shadow-[#00d4aa]/40 hidden md:flex items-center justify-center"
            aria-label="Previous item"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={handleNext}
            className="absolute -right-6 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-[#00d4aa] text-[#0a1f1a] hover:scale-110 transition-transform duration-300 hover:shadow-lg hover:shadow-[#00d4aa]/40 hidden md:flex items-center justify-center"
            aria-label="Next item"
          >
            <ChevronRight size={24} />
          </button>

          {/* Mobile Navigation */}
          <div className="flex gap-2 justify-center mt-6 md:hidden">
            <button
              onClick={handlePrev}
              className="px-4 py-2 rounded-lg bg-[#00d4aa]/20 border border-[#00d4aa]/50 text-[#00d4aa] hover:bg-[#00d4aa]/30 transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={handleNext}
              className="px-4 py-2 rounded-lg bg-[#00d4aa]/20 border border-[#00d4aa]/50 text-[#00d4aa] hover:bg-[#00d4aa]/30 transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: Math.max(1, ecosystemItems.length - itemsPerView + 1) }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? "bg-[#00d4aa] w-8" : "bg-[#00d4aa]/30 w-2 hover:bg-[#00d4aa]/50"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
