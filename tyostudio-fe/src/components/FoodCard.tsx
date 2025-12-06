import React from 'react';

interface FoodCardProps {
  imageSrc: string;
  name: string;
}

const FoodCard: React.FC<FoodCardProps> = ({ imageSrc, name }) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group">
      <div className="relative h-48 w-full overflow-hidden">
        {/* Placeholder image jika url asli tidak ada */}
        <img
          src={imageSrc}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-800 mb-4 line-clamp-1" title={name}>{name}</h3>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between items-center pb-2 border-b border-gray-100 last:border-0 last:pb-0">
            <span>Energi</span>
            <span className="font-semibold text-gray-800">350 Kkal</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-gray-100 last:border-0 last:pb-0">
            <span>Protein</span>
            <span className="font-semibold text-gray-800">12g</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Lemak</span>
            <span className="font-semibold text-gray-800">8g</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;