import Image from "next/image";

export default function SelayangPandang() {
  const photos = [
    {
      src: "/masjid-bg.jpg",
      alt: "Masjid Ar-Rahman Tampak Depan",
      className: "col-span-2 row-span-2 md:col-span-1 md:row-span-2",
    },
    {
      src: "https://images.unsplash.com/photo-1564683214964-15de16ce9b1f?q=80&w=800&auto=format&fit=crop", // Placeholder interior
      alt: "Interior Masjid",
      className: "col-span-1 row-span-1",
    },
    {
      src: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=800&auto=format&fit=crop", // Placeholder kegiatan
      alt: "Kegiatan Masjid",
      className: "col-span-1 row-span-1",
    },
    {
      src: "https://images.unsplash.com/photo-1591462002166-51f7bb0d2919?q=80&w=800&auto=format&fit=crop", // Placeholder arsitektur
      alt: "Detail Arsitektur",
      className: "col-span-2 md:col-span-1 row-span-1",
    },
    {
      src: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?q=80&w=800&auto=format&fit=crop", // Placeholder jamaah
      alt: "Area Jamaah",
      className: "col-span-2 md:col-span-1 row-span-1",
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
            Selayang Pandang
          </h2>
          <div className="w-20 h-1.5 bg-primary-600 rounded-full mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Menengok sekilas keindahan arsitektur dan suasana nyaman di Masjid Jami' Ar-Rahman. Tempat ibadah yang menenangkan jiwa.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[150px] md:auto-rows-[200px]">
          {photos.map((photo, index) => (
            <div 
              key={index} 
              className={`relative overflow-hidden rounded-2xl shadow-md group ${photo.className}`}
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300 z-10"></div>
              {/* Note: Using next/image requires domains to be configured in next.config.mjs if using external URLs. 
                  Since these are placeholders, we'll use a standard img tag to avoid config issues during development.
                  For production with real images, it's better to use <Image /> with appropriate config or local images.
              */}
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-20 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <span className="text-white font-medium text-sm md:text-base">
                  {photo.alt}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
