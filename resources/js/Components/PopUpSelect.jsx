const PopUpSelect = ({ onClick, onCancel, types }) => {
    console.log(types)
    return (
        <div
            onClick={(onCancel)}
            className="h-screen min-w-full bg-gray-900/60 fixed top-0 left-0 z-9 transition-colors"
        >
            <div

                className="select-container flex items-center justify-center relative  top-1/2 left-1/2 -translate-x-1/2 translate-y-1/4 h-12 w-80 z-10 bg-gray-700 rounded shadow-lg p-2 z-10 shadow-md gap-2">
                {types && types.map((type, index) => (
                    <div
                        key={index}
                        className={`${type.color || 'bg-gray-400'} text-white text-xs font-medium py-1 px-3 rounded-full cursor-pointer shadow-md `}
                        onClick={() => onClick?.(type)}
                    >
                        {type.title}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PopUpSelect