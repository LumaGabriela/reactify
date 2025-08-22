// Local: resources/js/Components/ChatBot.jsx

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, X, SendHorizontal } from 'lucide-react'

/**
 * ChatBot Component
 * * Um componente de UI que renderiza um botão flutuante e um popover de chat.
 * Utiliza Shadcn/UI para os componentes e Framer Motion para animações.
 *
 * @returns {JSX.Element} O componente ChatBot renderizado.
 */
const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Olá! 👋 Como posso te ajudar hoje sobre o sistema?',
      sender: 'bot',
      timestamp: new Date().toISOString(),
    },
    {
      id: 2,
      text: 'Gostaria de .........',
      sender: 'user',
      timestamp: new Date().toISOString(),
    },
  ])
  const [isOpen, setIsOpen] = useState(true)
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const toggleChat = () => {
    setIsOpen((prevState) => !prevState)
  }
  const handleSendMessage = () => {
    if (message.trim() === '') return

    // setIsLoading(true)
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: prevMessages.length + 1,
        text: message,
        sender: 'user',
        timestamp: new Date().toISOString(),
      },
    ])
    setMessage('')
  }

  return (
    <>
      {/* Janela do Chat (Popover) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} // Curva de easing mais suave
            style={{ transformOrigin: 'bottom right' }}
            className="fixed bottom-[calc(4.5rem)] right-5 w-96 max-w-md h-[35rem] bg-card border border-border rounded-lg shadow-2xl flex flex-col z-40"
            role="dialog"
            aria-modal="true"
            aria-labelledby="chat-heading"
          >
            {/* Cabeçalho do Chat */}
            <header className="flex justify-between items-center p-4 bg-primary text-primary-foreground rounded-t-lg">
              <h3 id="chat-heading" className="text-base font-semibold">
                Assistente Virtual
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleChat}
                className="size-5"
              >
                <X className="size-5" />
              </Button>
            </header>

            {/* Corpo do Chat (área de mensagens) */}
            <main className="flex-1 text-xs font-normal p-4 overflow-y-auto bg-background flex flex-col gap-2">
              {/* Mensagem de boas-vindas do bot */}
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`relative flex items-center ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`rounded-lg px-4 py-2 ${message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
                  >
                    {message.text}
                  </div>
                  <span
                    style={{
                      clipPath: 'polygon(0 0, 50% 100%, 100% 0)',
                    }}
                    className={`absolute bottom-0 size-3 block translate-y-1/2 ${message.sender === 'user' ? 'bg-primary text-primary-foreground -rotate-45 translate-x-1/2' : 'bg-secondary text-secondary-foreground rotate-45 -translate-x-1/2'}`}
                  />
                </div>
              ))}
            </main>

            {/* Rodapé do Chat (campo de input) */}
            <div className="p-4 border-t border-border bg-card rounded-b-lg">
              <div className="flex items-center space-x-2">
                <Input
                  disabled={isLoading}
                  type="text"
                  placeholder="Digite sua pergunta..."
                  className="flex-1"
                  value={message}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage()
                    }
                  }}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <Button
                  disabled={isLoading}
                  size="icon"
                  aria-label="Enviar mensagem"
                  onClick={handleSendMessage}
                >
                  <SendHorizontal className="size-5" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botão flutuante para abrir e fechar o chat */}
      <Button
        onClick={toggleChat}
        size="icon"
        className="fixed bottom-5 right-5 w-14 h-14 rounded-full shadow-lg transition-transform transform hover:scale-110 z-50"
        aria-label={isOpen ? 'Fechar chat' : 'Abrir chat'}
        aria-expanded={isOpen}
      >
        {/* Animação para trocar o ícone */}
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={isOpen ? 'close' : 'chat'}
            initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
            transition={{ duration: 0.2 }}
          >
            {isOpen ? (
              <X className="h-8 w-8" />
            ) : (
              <MessageSquare className="h-8 w-8" />
            )}
          </motion.div>
        </AnimatePresence>
      </Button>
    </>
  )
}

export default ChatBot
