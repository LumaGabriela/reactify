const PopUpSelect = ({ onClick, onCancel, types }) => {
  return (
    <>
    {/* fundo escuro */}
    <div 
      onClick={onCancel} 
      style={{ height: document.body.scrollHeight }}
      className="h-screen min-w-full bg-gray-900/60 fixed top-0 left-0 z-10 transition-colors"
    />
    {/* Popup de selecao  */}
    <div 
        className={`select-container flex flex-col items-center justify-center absolute -translate-y-[3rem] z-20 bg-gray-700 rounded shadow-lg p-2 shadow-md popup-animation`}

        onClick={(e) => e.stopPropagation()} // Evita que o clique no container feche o popup
      >
        <h1 className="text-white text-sm font-medium">Select type</h1>
        <div className="flex gap-2">
          {types && types.map((type, index) => (
            <div 
              key={index} 
              className={`${type.color || 'bg-gray-400'} text-white text-xs font-medium py-1 px-3 rounded-full cursor-pointer shadow-md`}
              onClick={() => onClick?.(type)}
            >
              {type.title}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default PopUpSelect;