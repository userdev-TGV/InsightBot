import { useState } from 'react'
import { ChevronUp, ChevronDown, FileText, Activity, BookOpen, User } from 'lucide-react'
import { motion } from 'framer-motion'

function ContainerDatabase({ height, isMinimized, onMinimize, onSelectRecord }) {
  // Datos de ejemplo
  const [records] = useState([
    { id: 1, name: 'Juan Pérez', role: 'Desarrollador Senior', image: null },
    { id: 2, name: 'María González', role: 'Project Manager', image: null },
    { id: 3, name: 'Carlos Rodríguez', role: 'QA Engineer', image: null },
  ])

  const [processes] = useState([
    { id: 1, name: 'Feedback - Juan Pérez', status: 'en_proceso' },
    { id: 2, name: 'Capacitación - María González', status: 'pausado' },
    { id: 3, name: 'Evaluación - Carlos Rodríguez', status: 'finalizado' },
    { id: 4, name: 'Revisión - Ana Martínez', status: 'finalizado_negativo' },
  ])

  const [knowledgeSources] = useState([
    { id: 1, name: 'Manual de Evaluación de Desempeño.pdf', type: 'PDF' },
    { id: 2, name: 'Guía de Competencias Técnicas.pdf', type: 'PDF' },
    { id: 3, name: 'Protocolo de Feedback.pdf', type: 'PDF' },
    { id: 4, name: 'Matriz de Evaluación.pdf', type: 'PDF' },
  ])

  const getStatusColor = (status) => {
    switch (status) {
      case 'pausado':
        return 'bg-black/20 text-black/60'
      case 'en_proceso':
        return 'bg-accent-red text-white'
      case 'finalizado':
        return 'bg-black text-white'
      case 'finalizado_negativo':
        return 'bg-accent-red text-white'
      default:
        return 'bg-black/20 text-black/60'
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pausado':
        return 'Pausado'
      case 'en_proceso':
        return 'En Proceso'
      case 'finalizado':
        return 'Finalizado'
      case 'finalizado_negativo':
        return 'Finalizado Negativo'
      default:
        return status
    }
  }

  return (
    <motion.div
      className="bg-white overflow-hidden"
      style={{ height }}
      initial={false}
      animate={{ height }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <div className="h-full flex flex-col">
        {/* Header del contenedor */}
        <div className="border-b border-black/10 px-6 py-3 flex items-center justify-between bg-white">
          <h2 className="text-sm font-medium text-black/60 uppercase tracking-wide">Base de Datos y Conocimiento</h2>
          <button
            onClick={onMinimize}
            className="text-black/30 hover:text-black transition-colors"
          >
            {isMinimized ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>

        {!isMinimized && (
          <div className="flex-1 overflow-y-auto px-6 py-8">
            <div className="grid grid-cols-1 gap-8">
              {/* A. Tarjetas de Registro */}
              <div>
                <h3 className="text-xs font-medium text-black/60 mb-4 uppercase tracking-wide flex items-center gap-2">
                  <User className="w-3.5 h-3.5" />
                  Tarjetas de Registro (SharePoint)
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {records.map((record) => (
                    <div
                      key={record.id}
                      onClick={() => onSelectRecord(record)}
                      className="border border-black/10 p-4 hover:border-black/30 transition-colors cursor-pointer bg-white"
                    >
                      <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center mb-3 mx-auto">
                        <User className="w-5 h-5 text-black/60" />
                      </div>
                      <h4 className="text-sm font-medium text-black text-center">{record.name}</h4>
                      <p className="text-xs text-black/50 text-center mt-1">{record.role}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* B. Monitoreo de Procesos */}
              <div className="pt-4 border-t border-black/10">
                <h3 className="text-xs font-medium text-black/60 mb-4 uppercase tracking-wide flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5" />
                  Monitoreo de Procesos
                </h3>
                <div className="space-y-2">
                  {processes.map((process) => (
                    <div
                      key={process.id}
                      className="flex items-center justify-between py-2.5 px-0 hover:bg-black/5 transition-colors"
                    >
                      <span className="text-sm text-black/80">{process.name}</span>
                      <span
                        className={`px-2.5 py-1 text-xs font-medium ${getStatusColor(
                          process.status
                        )}`}
                      >
                        {getStatusLabel(process.status)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* C. Fuente de Conocimiento */}
              <div className="pt-4 border-t border-black/10">
                <h3 className="text-xs font-medium text-black/60 mb-4 uppercase tracking-wide flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5" />
                  Fuente de Conocimiento
                </h3>
                <div className="space-y-1">
                  {knowledgeSources.map((source) => (
                    <div
                      key={source.id}
                      className="flex items-center gap-3 py-2.5 px-0 hover:bg-black/5 transition-colors"
                    >
                      <FileText className="w-4 h-4 text-black/40" />
                      <div className="flex-1">
                        <p className="text-sm text-black/80">{source.name}</p>
                        <p className="text-xs text-black/40">{source.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default ContainerDatabase

