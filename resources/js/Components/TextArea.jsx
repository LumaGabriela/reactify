import React, { useRef, useEffect } from "react";
const TextArea = ({ value, onChange, onEnter }) => {
  const textareaRef = useRef(null);
  //Aciona a funcao sempre que o texto do textarea mudar
  useEffect(() => {
    adjustTextAreaHeight();
  }, [value]);

  //Funcao para ajustar a altura do textarea
  const adjustTextAreaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.resize = 'none';
      textarea.style.webkitAppearence = 'none';
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }
  return (
    <textarea
      ref={textareaRef}
      value={value}
      onKeyUp={(e) => { if (e.key === 'Enter') onEnter() }}
      onChange={onChange}
      className="text-white text-sm bg-transparent p-0 border-none w-full h-max rounded outline-none focus:ring-0 focus:outline-none"
      autoFocus
    />
  )
}

export default TextArea;