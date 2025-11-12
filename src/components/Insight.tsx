import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, Send, ChevronLeft, ChevronRight, BookOpen, Plus, 
  MessageSquare, Database, FileDown, Image as ImageIcon,
  PlayCircle, PauseCircle, CheckCircle, XCircle, History, X, User, Mail, AlertCircle,
  Square, CheckSquare
} from 'lucide-react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { Message, CollapsedSections, KnowledgeSource, ReferenceContent, ChatHistory, FeedbackRecord } from '../types/insight.types';

// Estados del flujo de chat
type ChatStep = 'greeting' | 'asking_name' | 'asking_context' | 'asking_feedback' | 'completed' | 'waiting_restart';

export default function Insight() {
  const [collapsedSections, setCollapsedSections] = useState<CollapsedSections>({
    references: false,
    chat: false,
    database: false
  });
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [referenceContent, setReferenceContent] = useState<ReferenceContent | null>(null);
  const [chatStep, setChatStep] = useState<ChatStep>('greeting');
  const [feedbackData, setFeedbackData] = useState<{
    nombre?: string;
    contexto?: string;
    feedback?: string;
  }>({});
  
  // Estados para Base de Datos
  const [feedbackRecords, setFeedbackRecords] = useState<FeedbackRecord[]>([]);
  const [processSteps, setProcessSteps] = useState<{
    id: number;
    name: string;
    context: string;
    status: 'Pausado' | 'En proceso' | 'Finalizado' | 'Finalizado negativo';
  }[]>([
    { id: 1, name: 'Recopilación', context: 'Datos del feedback recopilados', status: 'Finalizado' },
    { id: 2, name: 'Análisis IA', context: 'Procesando con inteligencia artificial', status: 'En proceso' },
    { id: 3, name: 'Recomendaciones', context: 'Generando sugerencias de mejora', status: 'Pausado' },
    { id: 4, name: 'Evaluación', context: 'Revisión final y validación', status: 'Pausado' }
  ]);
  const [knowledgeSources] = useState<KnowledgeSource[]>([
    {
      id: 1,
      name: 'Guía de Evaluación de Feedback.pdf',
      type: 'pdf',
      size: '2.4 MB',
      date: '2024-01-10',
      url: 'https://example.com/guia-evaluacion-feedback.pdf'
    }
  ]);
  const [assistanceMode, setAssistanceMode] = useState<boolean>(false);
  const driverRef = useRef<any>(null);

  // Configurar driver.js para el modo asistencia
  useEffect(() => {
    if (assistanceMode) {
      // Asegurar que las secciones estén expandidas para el tour
      setCollapsedSections({
        references: false,
        chat: false,
        database: false
      });

      // Esperar un momento para que el DOM se actualice
      setTimeout(() => {
        const driverObj = driver({
          showProgress: true,
          showButtons: ['next', 'previous', 'close'],
          allowClose: true,
          overlayColor: 'rgba(15, 23, 42, 0.45)',
          stagePadding: 12,
          popoverClass: 'driverjs-theme',
          nextBtnText: 'Siguiente',
          prevBtnText: 'Anterior',
          doneBtnText: 'Cerrar',
          steps: [
            {
              element: '#header-actions',
              popover: {
                title: '⚙️ Controles principales',
                description: 'Desde aquí puedes activar el modo asistencia para recibir una guía paso a paso o reiniciar toda la experiencia con “Crear un nuevo chat”.',
                side: 'bottom',
                align: 'center'
              }
            },
            {
              element: '#section-references',
              popover: {
                title: '📚 Sección de Referencias',
                description: 'Esta sección muestra información contextual que se actualiza dinámicamente según el estado del chat. Incluye el contexto del chat y las fuentes de conocimiento (PDFs).',
                side: 'right',
                align: 'start'
              }
            },
            {
              element: '#reference-context',
              popover: {
                title: '🗂️ Contexto del chat',
                description: 'Aquí se detalla el destinatario, el contexto y el texto del feedback que se está generando. Se actualiza automáticamente con cada paso del chat.',
                side: 'right',
                align: 'start'
              }
            },
            {
              element: '#reference-knowledge',
              popover: {
                title: '📎 Fuentes de conocimiento',
                description: 'Listado de documentos de referencia (por ejemplo PDFs) utilizados por InsightBot para evaluar y enriquecer el feedback.',
                side: 'right',
                align: 'center'
              }
            },
            {
              element: '#chat-messages',
              popover: {
                title: '💬 Conversación con InsightBot',
                description: 'Este panel muestra el historial de la conversación. InsightBot guía la recopilación del feedback paso a paso.',
                side: 'left',
                align: 'center'
              }
            },
            {
              element: '#chat-input',
              popover: {
                title: '⌨️ Barra de respuesta',
                description: 'Aquí ingresas tus respuestas. InsightBot puede pedir el nombre, contexto, feedback completo o confirmar si quieres iniciar otro chat.',
                side: 'top',
                align: 'center'
              }
            },
            {
              element: '#database-block',
              popover: {
                title: '🗃️ Últimos registros',
                description: 'Tarjetas con los feedback más recientes generados por InsightBot. Cada tarjeta muestra destinatario, contexto y resumen del feedback.',
                side: 'left',
                align: 'start'
              }
            },
            {
              element: '#database-processes',
              popover: {
                title: '🚀 Estado de los procesos con IA',
                description: 'Monitoreo del progreso de análisis automáticos: recopilación, análisis con IA, generación de recomendaciones y evaluación final.',
                side: 'left',
                align: 'center'
              }
            }
          ],
          onDestroyStarted: () => {
            setAssistanceMode(false);
          }
        });

        driverObj.drive();
        driverRef.current = driverObj;
      }, 300);
    } else {
      // Limpiar el driver cuando se desactiva
      if (driverRef.current) {
        driverRef.current.destroy();
        driverRef.current = null;
      }
    }

    return () => {
      if (driverRef.current) {
        driverRef.current.destroy();
      }
    };
  }, [assistanceMode]);

  // Inicializar con datos simulados
  useEffect(() => {
    // Datos simulados de feedback records
    setFeedbackRecords([
      {
        id: 1,
        userName: 'María González',
        recipientName: 'Juan Pérez',
        feedback: 'Excelente trabajo en el proyecto X. Muy proactivo y colaborativo.',
        context: 'Sesión con Cliente - Proyecto Q4',
        date: '2024-01-15'
      },
      {
        id: 2,
        userName: 'Carlos Rodríguez',
        recipientName: 'Ana Martínez',
        feedback: 'Necesita mejorar la comunicación en reuniones de equipo.',
        context: 'Reunión de equipo - Sprint Planning',
        date: '2024-01-14'
      },
      {
        id: 3,
        userName: 'Laura Sánchez',
        recipientName: 'Pedro López',
        feedback: 'Muy buen desempeño técnico, pero debe trabajar más en la documentación.',
        context: 'Charla Mano a Mano - Revisión mensual',
        date: '2024-01-13'
      }
    ]);


    // Inicializar con mensaje de saludo
    if (messages.length === 0) {
      setTimeout(() => {
        const greetingMessage: Message = {
          id: Date.now(),
          type: 'assistant',
          content: '¡Hola! Estoy aquí para ayudarte a generar feedback de empleados o colaboradores. ¿Podrías decirme el nombre o correo electrónico de la persona a quien le darás feedback?'
        };
        setMessages([greetingMessage]);
        setChatStep('asking_name');
        setReferenceContent({
          title: 'Generación de Feedback',
          description: 'Este chat te ayudará a crear feedback estructurado para empleados o colaboradores.',
          fields: [
            { label: 'Paso actual', value: 'Solicitando información del destinatario' },
            { label: 'Estado', value: 'Esperando nombre o correo' }
          ],
          context: 'El sistema está listo para recibir la información necesaria para generar el feedback.'
        });
      }, 500);
    }
  }, []);

  const toggleSection = (section: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev]
    }));
  };

  const getExpandedCount = () => {
    return Object.values(collapsedSections).filter(v => !v).length;
  };

  const getSectionWidth = (section: string) => {
    if (collapsedSections[section as keyof typeof collapsedSections]) return 'w-12';
    const expandedCount = getExpandedCount();
    if (expandedCount === 3) return 'flex-1';
    if (expandedCount === 2) return 'flex-1';
    return 'flex-1';
  };

  // Función para actualizar referencias según el paso del chat
  const updateReferenceContent = (step: ChatStep, data?: any) => {
    switch (step) {
      case 'greeting':
        return {
          title: 'Generación de Feedback',
          description: 'Este chat te ayudará a crear feedback estructurado para empleados o colaboradores.',
          fields: [
            { label: 'Paso actual', value: 'Iniciando conversación' },
            { label: 'Estado', value: 'Esperando inicio' }
          ],
          context: 'El sistema está listo para ayudarte a generar feedback.'
        };
      case 'asking_name':
        return {
          title: 'Información del Destinatario',
          description: 'Necesitamos saber a quién se le dará el feedback.',
          fields: [
            { label: 'Paso actual', value: 'Solicitando nombre o correo' },
            { label: 'Estado', value: 'Esperando información del destinatario' }
          ],
          context: 'Por favor, proporciona el nombre o correo electrónico de la persona que recibirá el feedback.'
        };
      case 'asking_context':
        return {
          title: 'Contexto del Feedback',
          description: 'Necesitamos conocer el contexto en el que se generó este feedback.',
          fields: [
            { label: 'Destinatario', value: data?.nombre || 'Pendiente' },
            { label: 'Paso actual', value: 'Solicitando contexto' },
            { label: 'Estado', value: 'Esperando información del contexto' }
          ],
          context: 'Ejemplos de contexto: Sesión con Cliente, Reunión de equipo, Proyecto X, Charla Mano a Mano.'
        };
      case 'asking_feedback':
        return {
          title: 'Contenido del Feedback',
          description: 'Ahora necesitamos el contenido del feedback que deseas proporcionar.',
          fields: [
            { label: 'Destinatario', value: data?.nombre || 'Pendiente' },
            { label: 'Contexto', value: data?.contexto || 'Pendiente' },
            { label: 'Paso actual', value: 'Solicitando feedback' },
            { label: 'Estado', value: 'Esperando contenido del feedback' }
          ],
          context: 'Proporciona el reporte de desempeño, observaciones y comentarios que deseas incluir.'
        };
      case 'completed':
        return {
          title: 'Feedback Completado',
          description: 'El feedback ha sido registrado exitosamente.',
          fields: [
            { label: 'Destinatario', value: data?.nombre || '' },
            { label: 'Contexto', value: data?.contexto || '' },
            { label: 'Feedback', value: data?.feedback?.substring(0, 50) + '...' || '' },
            { label: 'Estado', value: 'Completado' }
          ],
          context: 'El chat ha finalizado. Si deseas crear otro feedback más tarde, puedes iniciar una nueva conversación.'
        };
      case 'waiting_restart':
        return {
          title: 'Feedback Registrado',
          description: 'El feedback ha sido registrado exitosamente. El sistema está procesando esta información.',
          fields: [
            { label: 'Destinatario', value: data?.nombre || '' },
            { label: 'Contexto', value: data?.contexto || '' },
            { label: 'Feedback', value: data?.feedback?.substring(0, 50) + '...' || '' },
            { label: 'Estado', value: 'Esperando respuesta' }
          ],
          context: '¿Deseas crear otro feedback? Responde "sí" para continuar o "no" para finalizar.'
        };
      default:
        return null;
    }
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    const userMessage: Message = {
      id: Date.now(),
      type: 'user',
      content: inputMessage
    };
    
    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage.trim();
    setInputMessage('');
    
    // Procesar según el paso actual
    setTimeout(() => {
      let nextStep: ChatStep = chatStep;
      const newFeedbackData = { ...feedbackData };
      
      if (chatStep === 'asking_name') {
        newFeedbackData.nombre = currentInput;
        nextStep = 'asking_context';
        const assistantMessage: Message = {
          id: Date.now() + 1,
          type: 'assistant',
          content: `Perfecto, el feedback será para ${currentInput}. Ahora, ¿podrías proporcionarme el contexto? Por ejemplo: "Sesión con Cliente", "Reunión de equipo", "Proyecto X", o "Charla Mano a Mano".`
        };
        setMessages(prev => [...prev, assistantMessage]);
        setReferenceContent(updateReferenceContent('asking_context', newFeedbackData));
      } else if (chatStep === 'asking_context') {
        newFeedbackData.contexto = currentInput;
        nextStep = 'asking_feedback';
        const assistantMessage: Message = {
          id: Date.now() + 1,
          type: 'assistant',
          content: `Entendido, el contexto es: "${currentInput}". Ahora, por favor proporciona el feedback: reporte de desempeño, observaciones y comentarios que deseas incluir.`
        };
        setMessages(prev => [...prev, assistantMessage]);
        setReferenceContent(updateReferenceContent('asking_feedback', newFeedbackData));
      } else if (chatStep === 'asking_feedback') {
        newFeedbackData.feedback = currentInput;
        nextStep = 'waiting_restart';
        const assistantMessage: Message = {
          id: Date.now() + 1,
          type: 'assistant',
          content: `¡Excelente! He registrado el feedback. El sistema está procesando esta información y generando análisis adicionales con IA. ¿Deseas crear otro feedback? Responde "sí" o "no".`
        };
        setMessages(prev => [...prev, assistantMessage]);
        setReferenceContent(updateReferenceContent('completed', newFeedbackData));
        
        // Agregar a la base de datos simulada
        const newFeedbackRecord: FeedbackRecord = {
          id: Date.now(),
          userName: 'InsightBot',
          recipientName: newFeedbackData.nombre || '',
          feedback: newFeedbackData.feedback || '',
          context: newFeedbackData.contexto || '',
          date: new Date().toISOString().split('T')[0]
        };
        
        setFeedbackRecords(prev => [newFeedbackRecord, ...prev]);
        
        // Simular progreso de procesos
        setTimeout(() => {
          setProcessSteps(prev => prev.map(step => 
            step.id === 1 ? { ...step, status: 'Finalizado', context: 'Datos completos y validados' } : step
          ));
        }, 1000);
        
        setTimeout(() => {
          setProcessSteps(prev => prev.map(step => 
            step.id === 2 ? { ...step, status: 'En proceso', context: 'Analizando patrones y tendencias' } : step
          ));
        }, 2000);
        
        setTimeout(() => {
          setProcessSteps(prev => prev.map(step => 
            step.id === 3 ? { ...step, status: 'En proceso', context: 'Creando sugerencias personalizadas' } : step
          ));
        }, 4000);
        
        setTimeout(() => {
          setProcessSteps(prev => prev.map(step => 
            step.id === 4 ? { ...step, status: 'Finalizado', context: 'Evaluación completada exitosamente' } : step
          ));
        }, 6000);
      } else if (chatStep === 'waiting_restart') {
        const response = currentInput.toLowerCase().trim();
        if (response === 'sí' || response === 'si' || response === 'yes' || response === 'y') {
          // Reiniciar el chat
          nextStep = 'asking_name';
          setFeedbackData({});
          const assistantMessage: Message = {
            id: Date.now() + 1,
            type: 'assistant',
            content: 'Perfecto. Por favor, proporciona el nombre o correo de la siguiente persona.'
          };
          setMessages(prev => [...prev, assistantMessage]);
          setReferenceContent(updateReferenceContent('asking_name'));
        } else if (response === 'no' || response === 'n') {
          // No reiniciar, mantener en completed
          nextStep = 'completed';
          const assistantMessage: Message = {
            id: Date.now() + 1,
            type: 'assistant',
            content: 'Entendido. El chat ha finalizado. Si deseas crear otro feedback más tarde, puedes iniciar una nueva conversación.'
          };
          setMessages(prev => [...prev, assistantMessage]);
          setReferenceContent(updateReferenceContent('completed', newFeedbackData));
        } else {
          // Respuesta no reconocida
          const assistantMessage: Message = {
            id: Date.now() + 1,
            type: 'assistant',
            content: 'Por favor, responde "sí" si deseas crear otro feedback o "no" si prefieres finalizar.'
          };
          setMessages(prev => [...prev, assistantMessage]);
          nextStep = 'waiting_restart'; // Mantener en el mismo estado
        }
      }
      
      setChatStep(nextStep);
      setFeedbackData(newFeedbackData);
    }, 500);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pausado':
        return <PauseCircle className="w-2.5 h-2.5 text-yellow-600" />;
      case 'En proceso':
        return <PlayCircle className="w-2.5 h-2.5 text-blue-600" />;
      case 'Finalizado':
        return <CheckCircle className="w-2.5 h-2.5 text-green-600" />;
      case 'Finalizado negativo':
        return <XCircle className="w-2.5 h-2.5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pausado':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'En proceso':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Finalizado':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'Finalizado negativo':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 relative" style={{ transform: 'scale(0.92)', transformOrigin: 'top left', width: '108.69%', height: '108.69%' }}>
      {/* Header */}
      <div className="h-14 border-b border-gray-100 flex items-center justify-between px-6 flex-shrink-0 bg-white shadow-sm">
        <div className="flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <h1 className="text-xl font-semibold text-gray-900">Insight</h1>
        </div>
        
        <div id="header-actions" className="flex items-center gap-3">
          <button
            className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors shadow-sm flex items-center gap-2 ${
              assistanceMode ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setAssistanceMode(prev => !prev)}
          >
            {assistanceMode ? (
              <CheckSquare className="w-4 h-4" />
            ) : (
              <Square className="w-4 h-4" />
            )}
            Modo asistencia
          </button>
          <button
            className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
            onClick={() => window.location.reload()}
          >
            <Plus className="w-4 h-4 inline mr-1" />
            Crear un nuevo chat
          </button>
        </div>
      </div>

      {/* Main Content - 3 Sections */}
      <div className="flex-1 flex overflow-hidden bg-gray-50 p-4 gap-4">
        {/* Section 1: Referencias (Solo Lectura) */}
        <div id="section-references" className={`${getSectionWidth('references')} flex flex-col transition-all duration-300 bg-white rounded-3xl shadow-sm overflow-hidden ${assistanceMode ? 'relative z-30 ring-4 ring-blue-200 shadow-xl opacity-100' : ''}`}>
          <div className="h-12 border-b border-gray-100 flex items-center justify-between px-4 flex-shrink-0 bg-white">
            {!collapsedSections.references && (
              <h2 className="font-semibold text-gray-900">Referencias</h2>
            )}
            <button
              onClick={() => toggleSection('references')}
              className="p-1.5 hover:bg-gray-100 rounded-xl transition-colors ml-auto"
            >
              {collapsedSections.references ? 
                <ChevronRight className="w-5 h-5 text-gray-600" /> : 
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              }
            </button>
          </div>

          {collapsedSections.references ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="transform -rotate-90 whitespace-nowrap text-sm font-medium text-gray-600">
                REFERENCIAS
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col overflow-hidden gap-3 p-3">
              {referenceContent ? (
                <>
                  {/* Apartado 1: Contenido de Referencia */}
                  <div id="reference-context" className="flex-[0.8] flex flex-col overflow-hidden border-2 border-gray-200 rounded-2xl bg-white/95 shadow-lg">
                    <div className="px-4 py-2 flex-shrink-0 border-b border-gray-200 bg-gray-50/50">
                      <h3 className="text-xs font-semibold text-gray-700">Contexto del Chat</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                      <div className="space-y-3">
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900 mb-2">
                            {referenceContent.title}
                          </h3>
                          {referenceContent.description && (
                            <p className="text-xs text-gray-600 mb-3">
                              {referenceContent.description}
                            </p>
                          )}
                        </div>

                        {referenceContent.fields && referenceContent.fields.length > 0 && (
                          <div className="space-y-2">
                            {referenceContent.fields.map((field, index) => (
                              <div key={index} className="p-2.5 bg-gray-50 rounded-xl border border-gray-100 shadow-sm">
                                <div className="text-xs font-medium text-gray-500 mb-1">
                                  {field.label}
                                </div>
                                <div className="text-xs text-gray-900">
                                  {field.value}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {referenceContent.context && (
                          <div className="p-2.5 bg-blue-50 rounded-xl border border-blue-100 shadow-sm">
                            <p className="text-xs text-blue-700">
                              {referenceContent.context}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Apartado 2: Fuente de Conocimiento */}
                  <div id="reference-knowledge" className="flex-[0.2] flex flex-col overflow-hidden border-2 border-gray-200 rounded-2xl bg-gray-50/60 shadow-lg">
                    <div className="px-4 py-2 flex-shrink-0 border-b border-gray-200 bg-white/50">
                      <h3 className="text-xs font-semibold text-gray-700">Fuente de Conocimiento</h3>
                    </div>
                    <div className="flex-1 px-4 py-3 overflow-hidden">
                      {knowledgeSources.length > 0 ? (
                        <div className="grid grid-cols-1 gap-2">
                          {knowledgeSources.slice(0, 4).map((source) => (
                            <a
                              key={source.id}
                              href={source.url || source.name}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 p-2 bg-white rounded-lg hover:bg-gray-50 transition-all cursor-pointer group shadow-sm border border-gray-100"
                            >
                              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                                <FileText className="w-4 h-4 text-red-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-blue-600 hover:text-blue-700 truncate">{source.name}</p>
                                {source.size && (
                                  <p className="text-xs text-gray-500 truncate">{source.size}</p>
                                )}
                              </div>
                            </a>
                          ))}
                          {knowledgeSources.length > 4 && (
                            <div className="text-xs text-gray-500 text-center py-1 border border-dashed border-gray-200 rounded-lg">
                              + {knowledgeSources.length - 4} fuentes adicionales
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center text-xs text-gray-500 border border-dashed border-gray-200 rounded-lg">
                          <FileText className="w-4 h-4 mb-1 text-gray-400" />
                          No hay fuentes registradas
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Apartado 1: Contenido de Referencia */}
                  <div className="flex-[0.8] flex flex-col overflow-hidden border-2 border-gray-200 rounded-2xl bg-white shadow-sm">
                    <div className="px-4 py-2 flex-shrink-0 border-b border-gray-200 bg-gray-50/50">
                      <h3 className="text-xs font-semibold text-gray-700">Contexto del Chat</h3>
                    </div>
                    <div className="flex-1 flex items-center justify-center p-4">
                      <div className="text-center">
                        <h3 className="text-sm font-semibold text-gray-900 mb-2">
                          ¿Qué puedes hacer con el chat?
                        </h3>
                        <div className="text-xs text-gray-600 space-y-1.5 text-left">
                          <p>• Generar feedback estructurado para empleados o colaboradores</p>
                          <p>• Proporcionar contexto sobre situaciones laborales</p>
                          <p>• Crear reportes de desempeño y observaciones</p>
                          <p>• Analizar y procesar información con IA</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-3">
                          Esta sección se actualizará automáticamente según el contexto del chat
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Apartado 2: Fuente de Conocimiento */}
                  <div className="flex-[0.4] flex flex-col overflow-hidden border-2 border-gray-200 rounded-2xl bg-gray-50/30 shadow-sm">
                    <div className="px-4 py-2 flex-shrink-0 border-b border-gray-200 bg-white/50">
                      <h3 className="text-xs font-semibold text-gray-700">Fuente de Conocimiento</h3>
                    </div>
                    <div className="flex-1 px-4 py-3 overflow-hidden">
                      {knowledgeSources.length > 0 ? (
                        <div className="grid grid-cols-1 gap-2">
                          {knowledgeSources.slice(0, 4).map((source) => (
                            <a
                              key={source.id}
                              href={source.url || source.name}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 p-2 bg-white rounded-lg hover:bg-gray-50 transition-all cursor-pointer group shadow-sm border border-gray-100"
                            >
                              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                                <FileText className="w-4 h-4 text-red-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-blue-600 hover:text-blue-700 truncate">{source.name}</p>
                                {source.size && (
                                  <p className="text-xs text-gray-500 truncate">{source.size}</p>
                                )}
                              </div>
                            </a>
                          ))}
                          {knowledgeSources.length > 4 && (
                            <div className="text-xs text-gray-500 text-center py-1 border border-dashed border-gray-200 rounded-lg">
                              + {knowledgeSources.length - 4} fuentes adicionales
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center text-xs text-gray-500 border border-dashed border-gray-200 rounded-lg">
                          <FileText className="w-4 h-4 mb-1 text-gray-400" />
                          No hay fuentes registradas
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Section 2: Chat */}
        <div id="section-chat" className={`${getSectionWidth('chat')} flex flex-col transition-all duration-300 bg-white rounded-3xl shadow-sm overflow-hidden ${assistanceMode ? 'relative z-30 ring-4 ring-indigo-200 shadow-xl opacity-100' : ''}`}>
          <div className="h-12 border-b border-gray-100 flex items-center justify-between px-4 flex-shrink-0 bg-white">
            {!collapsedSections.chat && (
              <h2 className="font-semibold text-gray-900">Chat</h2>
            )}
            <button
              onClick={() => toggleSection('chat')}
              className="p-1.5 hover:bg-gray-100 rounded-xl transition-colors ml-auto"
            >
              {collapsedSections.chat ? 
                <ChevronRight className="w-5 h-5 text-gray-600" /> : 
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              }
            </button>
          </div>

          {collapsedSections.chat ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="transform -rotate-90 whitespace-nowrap text-sm font-medium text-gray-600">
                CHAT
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
              {messages.length === 0 ? (
                <div className="flex-1 flex items-center justify-center p-4 min-h-0">
                  <div className="text-center max-w-md">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-purple-50 rounded-full mb-3 shadow-sm">
                      <MessageSquare className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Chat de Feedback
                    </h3>
                    <p className="text-sm text-gray-600">
                      Iniciando conversación...
                    </p>
                  </div>
                </div>
              ) : (
                <div id="chat-messages" className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] ${msg.type === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-900'} rounded-3xl px-4 py-2.5 text-sm shadow-sm`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div id="chat-input" className="border-t border-gray-100 p-3 flex-shrink-0 bg-white/95 backdrop-blur-sm z-10">
                <div className="flex items-end gap-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !(chatStep === 'completed') && handleSendMessage()}
                    placeholder={
                      chatStep === 'asking_name' 
                        ? 'Nombre o correo del destinatario...'
                        : chatStep === 'asking_context'
                        ? 'Contexto (ej: Sesión con Cliente, Reunión de equipo...)'
                        : chatStep === 'asking_feedback'
                        ? 'Escribe el feedback...'
                        : chatStep === 'waiting_restart'
                        ? 'Responde "sí" o "no"...'
                        : chatStep === 'completed'
                        ? 'El chat ha finalizado'
                        : 'Escribe tu mensaje...'
                    }
                    disabled={chatStep === 'completed'}
                    className="flex-1 bg-gray-50 rounded-2xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || chatStep === 'completed'}
                    className="p-2 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section 3: Base de Datos */}
        <div id="section-database" className={`${getSectionWidth('database')} flex flex-col transition-all duration-300 bg-white rounded-3xl shadow-sm overflow-hidden ${assistanceMode ? 'relative z-30 ring-4 ring-emerald-200 shadow-xl opacity-100' : ''}`}>
          <div className="h-12 border-b border-gray-100 flex items-center justify-between px-4 flex-shrink-0 bg-white">
            {!collapsedSections.database && (
              <h2 className="font-semibold text-gray-900">Base de Datos</h2>
            )}
            <button
              onClick={() => toggleSection('database')}
              className="p-1.5 hover:bg-gray-100 rounded-xl transition-colors ml-auto"
            >
              {collapsedSections.database ? 
                <ChevronRight className="w-5 h-5 text-gray-600" /> : 
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              }
            </button>
          </div>

          {collapsedSections.database ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="transform -rotate-90 whitespace-nowrap text-sm font-medium text-gray-600">
                BASE DE DATOS
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col overflow-hidden gap-3 p-3">
              {/* Subsección 1: Tarjetas de Registros (40%) */}
              <div id="database-block" className="flex-[0.4] flex flex-col overflow-hidden border-2 border-gray-200 rounded-2xl bg-gray-50/30 shadow-sm">
                <div className="px-3 py-1.5 flex-shrink-0 border-b border-gray-200 bg-white/50">
                  <h3 className="text-xs font-semibold text-gray-700">Últimos Registros</h3>
                </div>
                <div className="flex-1 px-3 py-2 overflow-y-auto">
                      <div id="database-records" className="grid grid-cols-2 gap-2 max-w-[420px] mx-auto w-full">
                    {feedbackRecords.length === 0 ? (
                      <div className="col-span-2 text-center py-4">
                        <div className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full mb-1.5">
                          <Database className="w-3.5 h-3.5 text-gray-400" />
                        </div>
                        <p className="text-[10px] text-gray-500">No hay registros</p>
                      </div>
                    ) : (
                      feedbackRecords.map((record) => (
                        <div key={record.id} className="bg-white rounded-lg p-2 hover:bg-gray-50 transition-all cursor-pointer shadow-sm flex flex-col border border-gray-100">
                          <div className="flex items-center gap-2 mb-1.5">
                            <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                              <User className="w-3.5 h-3.5 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-semibold text-gray-900 truncate mb-0.5">{record.userName}</div>
                              <div className="flex items-center gap-0.5">
                                <Mail className="w-2 h-2 text-gray-400" />
                                <span className="text-xs text-gray-500 truncate">{record.recipientName}</span>
                              </div>
                            </div>
                          </div>
                          <div className="mb-1.5">
                            <div className="text-xs font-medium text-gray-500 mb-0.5">Contexto:</div>
                            <div className="text-xs text-gray-700 bg-gray-50 px-1.5 py-0.5 rounded line-clamp-1 border border-gray-100">{record.context}</div>
                          </div>
                          <div className="flex-1">
                            <div className="text-xs font-medium text-gray-500 mb-0.5">Feedback:</div>
                            <div className="text-xs text-gray-700 bg-gray-50 px-1.5 py-0.5 rounded line-clamp-2 border border-gray-100">{record.feedback}</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Subsección 2: Indicador de Procesos (60%) */}
              <div id="database-processes" className="flex-[0.6] flex flex-col overflow-hidden border-2 border-gray-200 rounded-2xl bg-white shadow-sm">
                <div className="px-3 py-1.5 flex-shrink-0 border-b border-gray-200 bg-gray-50/50">
                  <h3 className="text-xs font-semibold text-gray-700">Procesos</h3>
                </div>
                <div className="flex-1 p-1.5 min-h-0">
                  <div className="h-full grid grid-cols-2 grid-rows-2 gap-1.5">
                    {processSteps.map((step) => (
                      <div key={step.id} className="bg-gray-50 rounded-lg p-1.5 border border-gray-100 hover:bg-gray-100 transition-all flex flex-col overflow-hidden">
                        <div className="flex items-center gap-1.5 mb-1">
                          <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                            <span className="text-xs font-semibold text-blue-600">{step.id}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold text-gray-900 truncate">
                              {step.name}
                            </div>
                          </div>
                        </div>
                        <div className="flex-1 min-h-0 mb-1">
                          <div className="text-xs text-gray-600 leading-tight line-clamp-3">
                            {step.context}
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5 flex-shrink-0">
                          {getStatusIcon(step.status)}
                          <span className={`text-xs px-1 py-0.5 rounded-full border ${getStatusColor(step.status)} truncate`}>
                            {step.status === 'Pausado' ? 'Pausado' : step.status === 'En proceso' ? 'Proceso' : step.status === 'Finalizado' ? 'Finalizado' : 'Finalizado -'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
