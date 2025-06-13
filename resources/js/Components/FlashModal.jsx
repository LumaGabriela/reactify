import { useState, useEffect } from 'react';
import { CircleX } from 'lucide-react';
import { usePage } from '@inertiajs/react';

const FlashModal = ({ duration = 5000 }) => {
  const [visible, setVisible] = useState(true);
  const [color, setColor] = useState(null);
  const { message, status, flash_key } = usePage().props.flash;

  useEffect(() => {
    // Set visible to true whenever message or status changes
    setVisible(true);

    // Set the color based on status
    switch (status) {
      case 'success':
        setColor('border-green-500 text-green-500');
        break;
      case 'error':
        setColor('border-red-500 text-red-500');
        break;
      case 400:
        setColor('border-red-500 text-red-500');
        break;
      case 'warning':
        setColor('border-yellow-500 text-yellow-500');
        break;
      case 'info':
        setColor('border-blue-500 text-blue-500');
        break;
      default:
        setColor('border-gray-500 text-gray-500');
        break;
    }

    // Set up the timeout to hide the modal
    const timeout = setTimeout(() => setVisible(false), duration);
    
    // Cleanup the timeout on unmount or when message/status changes
    return () => clearTimeout(timeout);
  }, [flash_key]);

  if (!visible || !message || !status) return null;

  return (
    <div
      className={`${color} text-white bg-gray-800 border-[3px] slide-down fixed top-8 left-1/2 px-4 py-2 
      rounded-lg shadow-lg flex items-center justify-between animate-disapear
      w-[300px] cursor-pointer select-none z-50`}
    >
      <span className="text-md font-semibold w-full text-center">
        {message}
      </span>
      <button
        className={`${color} transition-colors`}
        onClick={() => setVisible(false)}
      >
        <CircleX size={24} />
      </button>
    </div>
  );
};

export default FlashModal;