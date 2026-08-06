import Image from "next/image";

type Photo = { id: string, title: string, imageUrl: string };

type Props = {
  photos?: Photo[];
  title?: string;
  description?: string;
};

export default function SelayangPandang({ photos: dbPhotos, title, description }: Props) {
  // Use DB photos if available, otherwise use placeholders so UI doesn't look broken
  const defaultPhotos = [
    {
      src: "/masjid-bg.jpg",
      className: "col-span-2 row-span-2 md:col-span-1 md:row-span-2",
    },
    {
      src: "https://images.unsplash.com/photo-1564683214964-15de16ce9b1f?q=80&w=800&auto=format&fit=crop",
      className: "col-span-1 row-span-1",
    },
    {
      src: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=800&auto=format&fit=crop",
      className: "col-span-1 row-span-1",
    },
    {
      src: "https://images.unsplash.com/photo-1591462002166-51f7bb0d2919?q=80&w=800&auto=format&fit=crop",
      className: "col-span-2 md:col-span-1 row-span-1",
    },
    {
      src: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?q=80&w=800&auto=format&fit=crop",
      className: "col-span-2 md:col-span-1 row-span-1",
    }
  ];

  const photos = dbPhotos && dbPhotos.length > 0 
    ? dbPhotos.map((p, i) => ({
        src: p.imageUrl,
        className: defaultPhotos[i % defaultPhotos.length].className
      }))
    : defaultPhotos;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
            {title || "Selayang Pandang"}
          </h2>
          <div className="w-20 h-1.5 bg-primary-600 rounded-full mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {description || "Menengok sekilas keindahan arsitektur dan suasana nyaman di Masjid Jami' Ar-Rahman. Tempat ibadah yang menenangkan jiwa."}
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
                alt="Galeri Masjid"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
