import React from "react";

type ImageMosaicProps = {
  images: string[];
  altPrefix?: string;
};

const ImageMosaic: React.FC<ImageMosaicProps> = ({ images, altPrefix = "Image" }) => {
  const list = images.length >= 5 ? images.slice(0, 5) : [...images, ...Array(Math.max(0, 5 - images.length)).fill("/placeholder.svg")];

  return (
    <div className="grid grid-cols-4 grid-rows-2 gap-2">
      {/* Big tile */}
      <img
        src={list[0]}
        alt={`${altPrefix} 1`}
        loading="lazy"
        className="col-span-2 row-span-2 h-full w-full rounded-md object-cover"
      />
      {/* Four small tiles */}
      {list.slice(1, 5).map((src, idx) => (
        <img
          key={idx}
          src={src}
          alt={`${altPrefix} ${idx + 2}`}
          loading="lazy"
          className="h-full w-full rounded-md object-cover"
        />
      ))}
    </div>
  );
};

export default ImageMosaic;
