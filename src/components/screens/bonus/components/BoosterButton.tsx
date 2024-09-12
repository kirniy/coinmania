import React from 'react'

interface BoosterButtonProps {
  title: string;
  description: string;
  count: string;
  icon: any;
  isAvailable: boolean;
  onClick: (e: any) => void;
}

const BoosterButton: React.FC<BoosterButtonProps> = ({ title, description, isAvailable, count, icon: Icon, onClick }) => {
  return (
    <button 
      className="bg-gradient-to-br from-yellow-500 to-orange-500 text-black font-bold p-3 rounded-xl shadow-lg text-left w-full mb-2"
      disabled={!isAvailable}
      onClick={onClick}
      style={!isAvailable ? {opacity: 0.5} : {}}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center">
            <Icon className="mr-2" size={20} />
          <span className="text-sm">{title}</span>
        </div>
        <span className="text-xs bg-black bg-opacity-20 px-2 py-0.5 rounded-full">{count}</span>
      </div>
      <p className="text-xs opacity-75">{description}</p>
    </button>
  );
};

export default BoosterButton;