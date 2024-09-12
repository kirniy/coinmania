
const ActionButton = ({ icon: Icon, label, onClick, primary = false, large = false, isLink = false, link, disabled=false}) => isLink ? (
  <a href={link} className={`flex items-center justify-center px-4 py-2 rounded-lg font-bold mb-3 ${
    large ? 'text-lg w-full' : 'text-sm'
  } ${
    primary ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black' : 'bg-gray-600 text-white'
  }`}>
    <Icon size={large ? 24 : 16} className="mr-2" />
    {label}
  </a>
) : (
  <button
    className={`flex items-center justify-center px-4 py-2 rounded-lg font-bold mb-3 ${
      large ? 'text-lg w-full' : 'text-sm'
    } ${
      primary ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black' : 'bg-gray-600 text-white'
    }`}
    onClick={onClick}
    disabled={disabled}
    style={disabled ? {opacity: 0.5} : {}}
  >
    <Icon size={large ? 24 : 16} className="mr-2" />
    {label}
  </button>
);

export default ActionButton