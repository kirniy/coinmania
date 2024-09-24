import { AmountDisplay } from '@/components/common/AmountDisplay';
import { ArrowUp } from 'lucide-react'
import React from 'react'

interface UpgradeItemProps {
  title: string;
  icon: any;
  level: number,
  maxLevel: number,
  cost: number,
  effect: string;
  isMax: boolean;
  onClick: () => void;
}

const UpgradeItem: React.FC<UpgradeItemProps> = ({ isMax, title, level, maxLevel, cost, icon: Icon, onClick, effect }) => (
  <div 
    className="bg-gradient-to-br from-purple-500 to-indigo-500 text-white p-3 rounded-xl shadow-lg text-left w-full mb-2"
  >
    <div className="flex items-center justify-between mb-1">
      <div className="flex items-center">
        <Icon className="mr-2" size={20} />
        <span className="text-sm">{title}</span>
      </div>
      <span className="text-xs bg-white bg-opacity-20 px-2 py-0.5 rounded-full whitespace-nowrap">Левел {level}/{maxLevel}</span>
    </div>
    <p className="text-xs mb-2">{effect}</p>
    <div className="flex justify-between items-center">
      {!isMax ? (
        <button className="bg-yellow-400 text-black text-xs font-bold py-1 px-2 rounded-lg flex items-center" onClick={onClick}>
        <ArrowUp size={12} className="mr-1" />
        Прокачать за <AmountDisplay amount={cost} coinSize={12} className='ml-1' />
      </button>
      ) : (<span className='text-xs font-bold flex items-cente'>
        Достигнут максимальный уровень!
      </span>)}
    </div>
  </div>
);

export default UpgradeItem