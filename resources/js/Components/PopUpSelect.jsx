const PopUpSelect = ({onClick, types} ) => {
console.log(types)
    return (
    <div className="flex items-center justify-center absolute -top-9 left-20 z-10 bg-gray-700 rounded shadow-lg p-2  shadow-md gap-2">
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
)}

export default PopUpSelect