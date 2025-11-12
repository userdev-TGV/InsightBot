import { ChevronUp, ChevronDown, User, MessageSquare, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'

function ContainerReferences({ height, isMinimized, onMinimize, selectedRecord, feedbackData, assistanceMode }) {
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
        <div className="border-b border-black/10 px-6 py-3 flex items-center justify-between bg-white">
          <h2 className="text-sm font-medium text-black/60 uppercase tracking-wide">Referencias y Contexto</h2>
          <button
            onClick={onMinimize}
            className="text-black/30 hover:text-black transition-colors"
          >
            {isMinimized ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>

        {!isMinimized && (
          <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8">
            {/* Datos del Feedback */}
            {feedbackData ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-medium text-black/60 mb-3 uppercase tracking-wide">Datos del Feedback</h3>
                  <div className="space-y-3 text-sm text-black">
                    <div>
                      <span className="text-black/60">Destinatario:</span>
                      <span className="ml-2 font-medium">{feedbackData.recipient}</span>
                    </div>
                    <div>
                      <span className="text-black/60">Tipo:</span>
                      <span className="ml-2">{feedbackData.type}</span>
                    </div>
                    <div>
                      <span className="text-black/60">Contexto:</span>
                      <span className="ml-2">{feedbackData.context}</span>
                    </div>
                    <div>
                      <span className="text-black/60">Observaciones:</span>
                      <p className="mt-2 text-black/80 leading-relaxed">{feedbackData.observations}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-black/40 py-12">
                <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No hay feedback activo</p>
                <p className="text-xs mt-1 text-black/30">Inicia una conversación en el ChatBot</p>
              </div>
            )}

            {/* Historial */}
            {selectedRecord && (
              <div className="pt-4 border-t border-black/10">
                <h3 className="text-xs font-medium text-black/60 mb-3 uppercase tracking-wide">Historial Relacionado</h3>
                <div className="text-sm text-black">
                  <p>Registro seleccionado: <span className="font-medium">{selectedRecord.name}</span></p>
                </div>
              </div>
            )}

            {/* Capacidades IA */}
            {assistanceMode && (
              <div className="pt-4 border-t border-black/10">
                <h3 className="text-xs font-medium text-black/60 mb-4 uppercase tracking-wide flex items-center gap-2">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Capacidades IA
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-black/80">Competencia Detectada</span>
                      <span className="text-sm font-medium text-black">85%</span>
                    </div>
                    <div className="w-full bg-black/10 rounded-full h-1.5">
                      <div className="bg-accent-red h-1.5 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-black/80">Sentimiento</span>
                    <span className="text-sm font-medium text-black">Positivo</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default ContainerReferences

