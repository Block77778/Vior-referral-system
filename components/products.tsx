'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'

export default function Products() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerView, setItemsPerView] = useState(5)

  const products = [
    {
      id: 1,
      name: 'Valure - Black Edition',
      category: 'Premium Perfume',
      description: 'Sophisticated and timeless, our Black Edition captures luxury and elegance in every spray.',
      image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-11-13%20at%203.35.15%20PM%20%282%29-CQH6EmVC5uXwBYimqmE1EsC5mfxPgV.jpeg',
      delay: '0s'
    },
    {
      id: 2,
      name: 'Belly Blaster',
      category: 'Weight Loss Tea',
      description: 'A powerful blend designed to support your wellness journey with natural ingredients.',
      image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-11-13%20at%203.35.14%20PM-iBUm6D2I4VvSg0E8PlkqZEo1RCLi6q.jpeg',
      delay: '0.1s'
    },
    {
      id: 3,
      name: 'Ultra Diabetes Crusher',
      category: 'Wellness Tea',
      description: 'Scientifically formulated to help maintain healthy blood sugar levels naturally.',
      image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-11-13%20at%203.35.16%20PM-SfaiV9MV5azqoK8tztRU5K4IYVlbo5.jpeg',
      delay: '0.2s'
    },
    {
      id: 4,
      name: 'Valure - Rose Edition',
      category: 'Premium Perfume',
      description: 'Delicate floral notes create a romantic and memorable fragrance experience.',
      image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-11-13%20at%203.35.15%20PM%20%284%29-5ebYGxMtxukY9oDRglDtva11MXoS2c.jpeg',
      delay: '0.3s'
    },
    {
      id: 5,
      name: 'Luxury Sports Car',
      category: 'Car Rental Fleet',
      description: 'Experience premium luxury and performance with our exclusive international rental fleet.',
      image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-11-13%20at%203.48.23%20PM%20%285%29-tlifuSMAn6Lpj0e77aVTduSSwAQboy.jpeg',
      delay: '0.4s'
    },
    {
      id: 6,
      name: 'GastroGuard Plus',
      category: 'Digestive Tea',
      description: 'Advanced digestive support formula for optimal gut health and wellness.',
      image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-11-13%20at%203.35.15%20PM%20%285%29-tTtVfH1BcM3TL4AH2nN5CkSeox9o4s.jpeg',
      delay: '0.5s'
    },
    {
      id: 7,
      name: 'Valure - Green Edition',
      category: 'Premium Perfume',
      description: 'Fresh and invigorating scent that brings nature\'s elegance to your everyday moments.',
      image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-11-13%20at%203.35.15%20PM-vkl7IumvMgcimdw2maru42g6CeAvoD.jpeg',
      delay: '0.6s'
    },
    {
      id: 8,
      name: 'Valure - Gold Edition',
      category: 'Premium Perfume',
      description: 'Opulent golden notes blend for a truly premium and unforgettable fragrance journey.',
      image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-11-13%20at%203.35.15%20PM%20%283%29-NQ4FuLGfm3yYMSWJOLNXWgwofhccJE.jpeg',
      delay: '0.7s'
    },
    {
      id: 9,
      name: 'Valure - Blue Edition',
      category: 'Premium Perfume',
      description: 'Calm and composed, the Blue Edition delivers a serene and sophisticated aroma.',
      image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-11-13%20at%203.35.15%20PM%20%281%29-pmJH5R08T2UEpCBK8XXq5Uww0YEEwD.jpeg',
      delay: '0.8s'
    },
    {
      id: 10,
      name: 'Valure - Luxury Collection',
      category: 'Premium Perfume',
      description: 'The ultimate collection showcasing our finest fragrances in one prestigious offering.',
      image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-11-13%20at%203.35.14%20PM%20%281%29-cFI4sQaKULXxT8wbJk2z8AWOypJ9I6.jpeg',
      delay: '0.9s'
    }
  ]

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setItemsPerView(4)
      } else if (window.innerWidth >= 1024) {
        setItemsPerView(3)
      } else if (window.innerWidth >= 768) {
        setItemsPerView(2)
      } else {
        setItemsPerView(1)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const maxIndex = Math.max(0, products.length - itemsPerView)

  const handlePrev = () => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : maxIndex))
  }

  const handleNext = () => {
    setCurrentIndex(prev => (prev < maxIndex ? prev + 1 : 0))
  }

  return (
    <section className="py-24 px-4 md:px-8 lg:px-16 bg-gradient-to-b from-[#0a1f1a] to-[#132b24] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#00d4aa] opacity-5 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#d4af37] opacity-5 blur-3xl rounded-full translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="text-[#00d4aa]" size={24} />
            <span className="text-[#00d4aa] font-semibold uppercase tracking-wider text-sm">Our Collection</span>
            <Sparkles className="text-[#00d4aa]" size={24} />
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#ffffff] mb-4 text-balance">
            Our Products
          </h2>
          <p className="text-[#b0d4cc] text-lg md:text-xl max-w-2xl mx-auto">
            Luxury, wellness, and performance products generating real revenue for the VIOR ecosystem.
          </p>
        </div>

        <div className="relative">
          <div className="overflow-hidden px-2">
            <div 
              className="flex gap-6 transition-transform duration-700 ease-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`
              }}
            >
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex-shrink-0 group"
                  style={{
                    width: `${100 / itemsPerView}%`,
                    minWidth: `${100 / itemsPerView}%`
                  }}
                >
                  <div className="relative rounded-2xl overflow-hidden border border-[#00d4aa]/30 hover:border-[#00d4aa]/70 transition-all duration-500 bg-[#132b24] h-full flex flex-col">
                    {/* Image Container - Larger */}
                    <div className="relative h-80 overflow-hidden bg-[#0a1f1a]">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-contain p-4 group-hover:scale-115 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-[#00d4aa]/0 via-transparent to-[#0a1f1a]/70 group-hover:from-[#00d4aa]/10 transition-all duration-500"></div>
                    </div>

                    {/* Product Info - Always Visible with enhanced styling */}
                    <div className="flex-1 p-6 flex flex-col justify-between">
                      <div>
                        <h3 className="text-[#00d4aa] font-serif font-bold text-lg mb-2 group-hover:text-[#00f0cc] transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-[#b0d4cc] text-sm font-medium mb-3 capitalize">
                          {product.category}
                        </p>
                      </div>
                      
                      <p className="text-[#b0d4cc] text-sm leading-relaxed opacity-90 group-hover:opacity-100 transition-opacity">
                        {product.description}
                      </p>

                      {/* Bottom accent */}
                      <div className="mt-4 pt-4 border-t border-[#00d4aa]/20 group-hover:border-[#00d4aa]/50 transition-all">
                        <span className="text-xs text-[#00d4aa] font-semibold">View Details →</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons - Unique Design */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 md:-translate-x-12 z-20 p-3 rounded-full bg-[#00d4aa] text-[#0a1f1a] hover:bg-[#00f0cc] hover:scale-125 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-[#00d4aa]/40 group"
            aria-label="Previous products"
          >
            <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 md:translate-x-12 z-20 p-3 rounded-full bg-[#00d4aa] text-[#0a1f1a] hover:bg-[#00f0cc] hover:scale-125 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-[#00d4aa]/40 group"
            aria-label="Next products"
          >
            <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Indicator Dots - Enhanced */}
          <div className="flex justify-center gap-3 mt-10">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-gradient-to-r from-[#00d4aa] to-[#00f0cc] w-10 h-3 shadow-lg shadow-[#00d4aa]/50' 
                    : 'bg-[#00d4aa]/20 w-3 h-3 hover:bg-[#00d4aa]/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <p className="text-[#b0d4cc] mb-6 text-lg">
            Every product generates profits that strengthen the VIOR ecosystem
          </p>
          <button className="px-8 py-3 bg-gradient-to-r from-[#00d4aa] to-[#00f0cc] text-[#0a1f1a] rounded-lg font-bold hover:shadow-xl hover:shadow-[#00d4aa]/50 transform hover:scale-105 transition-all duration-300">
            Explore Our Partnership
          </button>
        </div>
      </div>
    </section>
  )
}
