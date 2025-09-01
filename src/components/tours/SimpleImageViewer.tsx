import React, { useState } from "react";
import { ResponsiveImage } from "@/components/ui/responsive-image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const SimpleImageViewer = ({ images, altPrefix = "Image" }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const openModal = (index) => {
    setSelectedIndex(index);
    document.body.style.overflow = 'hidden'; // Prevent background scroll
  };

  const closeModal = () => {
    setSelectedIndex(null);
    document.body.style.overflow = 'unset';
  };

  const navigate = (direction) => {
    if (selectedIndex === null) return;
    const newIndex = direction === 'prev' 
      ? (selectedIndex - 1 + images.length) % images.length
      : (selectedIndex + 1) % images.length;
    setSelectedIndex(newIndex);
  };

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyPress = (e) => {
      if (selectedIndex === null) return;
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowLeft') navigate('prev');
      if (e.key === 'ArrowRight') navigate('next');
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedIndex]);

  return (
    <>
      {/* Simple Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {images.slice(0, 8).map((image, index) => (
          <div 
            key={index}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => openModal(index)}
          >
            <ResponsiveImage
              src={image.src || image.file_path}
              alt={image.alt || `${altPrefix} ${index + 1}`}
              className="w-full h-32 object-cover rounded"
              loading="lazy"
              fetchPriority={index === 0 ? "high" : "low"}
            />
          </div>
        ))}
      </div>

      {/* Simple Modal Overlay */}
      {selectedIndex !== null && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center"
          onClick={closeModal}
        >
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-60"
            onClick={closeModal}
          >
            <X size={32} />
          </button>

          {/* Navigation Buttons */}
          <button
            className="absolute left-4 text-white hover:text-gray-300 z-60"
            onClick={(e) => { e.stopPropagation(); navigate('prev'); }}
          >
            <ChevronLeft size={48} />
          </button>
          
          <button
            className="absolute right-4 text-white hover:text-gray-300 z-60"
            onClick={(e) => { e.stopPropagation(); navigate('next'); }}
          >
            <ChevronRight size={48} />
          </button>

          {/* Image */}
          <div className="max-w-[90vw] max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <img
              src={images[selectedIndex]?.src || images[selectedIndex]?.file_path}
              alt={images[selectedIndex]?.alt || `${altPrefix} ${selectedIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white">
            {selectedIndex + 1} of {images.length}
          </div>
        </div>
      )}
    </>
  );
};

export default SimpleImageViewer;