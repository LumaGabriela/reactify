const PopUpConfirmation = ({ onConfirm, onCancel, message }) => {
    return (
      // Fundo escuro
        <>
        <div
            onClick={onCancel}
            style={{ height: document.body.scrollHeight }}
            className="h-screen min-w-full bg-gray-900/60 fixed top-0 left-0  z-10 transition-colors"/>
          {/* Pop up de confirmacao */}
            <div className="absolute left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/2 bg-gray-700 rounded shadow-lg p-3 z-10 min-w-40 popup-animation">
                <div className="text-white text-xs mb-2">
                    {message}
                </div>
                <div className="flex justify-between gap-1">
                    <button
                        className="bg-red-500 hover:bg-red-600 text-white text-xs py-0.5 px-2 rounded text-center flex-1"
                        onClick={onConfirm}
                    >
                        Sim
                    </button>
                    <button
                        className="bg-gray-600 hover:bg-gray-500 text-white text-xs py-0.5 px-2 rounded text-center flex-1"
                        onClick={onCancel}
                    >
                        Não
                    </button>
                </div>
            </div>
        </>
    );
}

export default PopUpConfirmation