// Local: resources/js/Components/ChatBot.jsx

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Componentes do Shadcn/UI e ícones
import { Button } from '@/components/ui/button' // Adapte o caminho se necessário
import { Input } from '@/components/ui/input' // Vamos usar o Input do shadcn também
import { MessageSquare, X, SendHorizontal } from 'lucide-react'

/**
 * ChatBot Component
 * * Um componente de UI que renderiza um botão flutuante e um popover de chat.
 * Utiliza Shadcn/UI para os componentes e Framer Motion para animações.
 *
 * @returns {JSX.Element} O componente ChatBot renderizado.
 */
const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleChat = () => {
    setIsOpen((prevState) => !prevState)
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
            <div className="flex justify-between items-center p-4 bg-primary text-primary-foreground rounded-t-lg">
              <h3 id="chat-heading" className="text-lg font-semibold">
                Assistente Virtual
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleChat}
                className="h-8 w-8 hover:bg-primary-foreground/10"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Corpo do Chat (área de mensagens) */}
            <div className="flex-1 text-sm p-4 overflow-y-auto bg-background space-y-4">
              {/* Mensagem de boas-vindas do bot */}
              <div className="flex justify-start">
                <div className="p-3 rounded-lg bg-muted text-muted-foreground max-w-xs">
                  <p>Olá! 👋 Como posso te ajudar hoje sobre o sistema?</p>
                </div>
              </div>
              {/* Exemplo de mensagem do usuário */}
              <div className="flex justify-end">
                <div className="p-3 rounded-lg bg-primary text-primary-foreground max-w-xs">
                  <p>Gostaria de saber como criar um novo relatório.</p>
                </div>
              </div>
            </div>

            {/* Rodapé do Chat (campo de input) */}
            <div className="p-4 border-t border-border bg-card rounded-b-lg">
              <div className="flex items-center space-x-2">
                <Input
                  type="text"
                  placeholder="Digite sua pergunta..."
                  className="flex-1"
                />
                <Button size="icon" aria-label="Enviar mensagem">
                  <SendHorizontal className="h-5 w-5" />
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
