import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, SendHorizontal, LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const ChatBot = ({ project, currentPage }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Olá! 👋 Como posso te ajudar hoje sobre o sistema?',
      sender: 'bot',
      timestamp: new Date().toISOString(),
    }
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatBodyRef = useRef(null);

  // Efeito para rolar para a última mensagem
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);
  
  const toggleChat = () => {
    // Ao abrir, limpa o histórico da sessão anterior.
    // if (!isOpen) {
    //     setMessages([]);
    // }
    setIsOpen((prevState) => !prevState);
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '' || !project.id) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      message: inputMessage,
      created_at: new Date().toISOString(),
    };
    
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

        const response = await fetch(`/api/chat/${project.id}/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken,
                'X-Requested-With': 'XMLHttpRequest',
            },
            body: JSON.stringify({
                message: userMessage.message,
                page_context: currentPage,
                history: newMessages.map(m => ({ sender: m.sender, message: m.message })), // Envia o histórico
            }),
        });

        if (!response.ok) {
            throw new Error('A resposta da rede não foi bem-sucedida.');
        }

        const aiResponse = await response.json();
        
        const formattedAiResponse = {
            ...aiResponse,
            text: aiResponse.message,
        };
        
        setMessages((prevMessages) => [...prevMessages, formattedAiResponse]);

    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        const errorMessage = {
            id: `temp-error-${Date.now()}`,
            text: 'Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente.',
            sender: 'ai',
            timestamp: new Date().toISOString(),
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: 'bottom right' }}
            className="fixed bottom-[calc(4.5rem)] right-5 w-96 max-w-md h-[35rem] bg-card border border-border rounded-lg shadow-2xl flex flex-col z-40"
            role="dialog"
          >
            <header className="flex justify-between items-center p-4 bg-primary text-primary-foreground rounded-t-lg">
              <h3 id="chat-heading" className="text-base font-semibold">
                Assistente Virtual
              </h3>
              {/* REMOVIDO: Botão de lixeira */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleChat}
                className="size-5 hover:bg-primary/80"
              >
                <X className="size-5" />
              </Button>
            </header>

            <main ref={chatBodyRef} className="flex-1 text-xs font-normal p-4 overflow-y-auto bg-background flex flex-col gap-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-2.5 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 ${message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
                  >
                    {/* MODIFICADO: A propriedade 'text' agora é adicionada localmente. A original é 'message' */}
                    {message.text || message.message}
                  </div>
                </div>
              ))}
              {isLoading && (
                 <div className="flex items-center gap-2.5 justify-start">
                    <div className="bg-secondary text-secondary-foreground rounded-lg px-3 py-2 flex items-center">
                        <LoaderCircle className="animate-spin size-4" />
                    </div>
                 </div>
              )}
            </main>

            <div className="p-4 border-t border-border bg-card rounded-b-lg">
                <div className="flex items-center space-x-2">
                    <Input
                    disabled={isLoading}
                    type="text"
                    placeholder="Digite sua pergunta..."
                    className="flex-1"
                    value={inputMessage}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !isLoading) {
                        handleSendMessage();
                        }
                    }}
                    onChange={(e) => setInputMessage(e.target.value)}
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

      <Button
        onClick={toggleChat}
        size="icon"
        className="fixed bottom-5 right-5 w-14 h-14 rounded-full shadow-lg transition-transform transform hover:scale-110 z-50"
        aria-label={isOpen ? 'Fechar chat' : 'Abrir chat'}
        aria-expanded={isOpen}
      >
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={isOpen ? 'close' : 'chat'}
            initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
            transition={{ duration: 0.2 }}
          >
            {isOpen ? <X className="h-8 w-8" /> : <MessageSquare className="h-8 w-8" />}
          </motion.div>
        </AnimatePresence>
      </Button>
    </>
  );
};

export default ChatBot;