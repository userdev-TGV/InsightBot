import { useState } from 'react'
import { ChevronUp, ChevronDown, Send } from 'lucide-react'
import { motion } from 'framer-motion'

function ContainerChatbot({ height, isMinimized, onMinimize, chatHistory, setChatHistory, setFeedbackData, assistanceMode }) {
  const [inputMessage, setInputMessage] = useState('')

  const handleSend = () => {
    if (!inputMessage.trim()) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: inputMessage,
      timestamp: new Date()
    }

    setChatHistory([...chatHistory, userMessage])

    // Simular respuesta del bot
    setTimeout(() => {
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: `He recibido tu mensaje: "${inputMessage}". Procesando información...`,
        timestamp: new Date()
      }
      setChatHistory(prev => [...prev, botMessage])

      // Simular actualización de feedback
      if (inputMessage.toLowerCase().includes('feedback')) {
        setFeedbackData({
          recipient: 'Juan Pérez',
          type: 'Observación',
          context: 'Reunión de Proyecto',
          observations: inputMessage
        })
      }
    }, 500)

    setInputMessage('')
    // Reset textarea height
    const textarea = document.querySelector('textarea')
    if (textarea) {
      textarea.style.height = 'auto'
    }
  }

  const handleTextareaChange = (e) => {
    setInputMessage(e.target.value)
    // Auto-resize textarea
    const textarea = e.target
    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`
  }

  return (
    <motion.div
      className="border-b border-black/10 bg-white overflow-hidden"
      style={{ height }}
      initial={false}
      animate={{ height }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <div className="h-full flex flex-col">
        {/* Header del contenedor */}
        <div className="border-b border-black/10 px-8 py-3 flex items-center justify-between bg-white">
          <h2 className="text-sm font-medium text-black/60 uppercase tracking-wide">Chat</h2>
          <button
            onClick={onMinimize}
            className="text-black/30 hover:text-black transition-colors"
          >
            {isMinimized ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>

        {!isMinimized && (
          <>
            {/* Área de mensajes */}
            <div className="flex-1 overflow-y-auto px-8 py-12">
              {chatHistory.length === 0 ? (
                <div className="flex items-center justify-center h-full text-black/30">
                  <div className="text-center max-w-md">
                    <p className="text-base mb-1">Inicia una conversación</p>
                    <p className="text-sm text-black/20">Escribe un mensaje para comenzar</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-12 max-w-4xl mx-auto">
                  {chatHistory.map((message) => (
                    <div
                      key={message.id}
                      className={`${
                        message.type === 'user' ? 'ml-auto' : 'mr-auto'
                      }`}
                      style={{ maxWidth: '85%' }}
                    >
                      {message.type === 'bot' && (
                        <div className="mb-2">
                          <span className="text-xs font-medium text-black/40 uppercase tracking-wide">Asistente</span>
                        </div>
                      )}
                      <div
                        className={`${
                          message.type === 'user'
                            ? 'bg-black text-white'
                            : 'text-black'
                        }`}
                      >
                        <p className={`leading-relaxed whitespace-pre-wrap ${
                          message.type === 'user' ? 'text-sm' : 'text-base'
                        }`}>
                          {message.text}
                        </p>
                      </div>
                      {message.type === 'user' && (
                        <div className="mt-2">
                          <span className="text-xs text-black/30">Tú</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Input de mensaje */}
            <div className="border-t border-black/10 bg-white px-8 py-4">
              <div className="max-w-4xl mx-auto">
                <div className="flex gap-3 items-end">
                  <div className="flex-1">
                    <textarea
                      value={inputMessage}
                      onChange={handleTextareaChange}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          handleSend()
                        }
                      }}
                      placeholder="Escribe un mensaje..."
                      rows={1}
                      className="w-full px-0 py-2 border-0 bg-transparent text-black placeholder:text-black/30 focus:outline-none resize-none text-sm leading-relaxed"
                      style={{ minHeight: '24px', maxHeight: '200px' }}
                    />
                  </div>
                  <button
                    onClick={handleSend}
                    disabled={!inputMessage.trim()}
                    className="p-2 text-black/40 hover:text-black transition-colors disabled:opacity-30"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                {assistanceMode && (
                  <p className="text-xs text-accent-red mt-2">
                    Modo Asistencia ACTIVO
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  )
}

export default ContainerChatbot

