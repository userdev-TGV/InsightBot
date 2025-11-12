// Tipos básicos para la estructura del bot Insight

export interface Message {
  id: string | number;
  type: 'user' | 'assistant';
  content: string;
}

export interface CollapsedSections {
  references: boolean;
  chat: boolean;
  database: boolean;
}

// Tipos para Referencias (solo lectura, se actualiza dinámicamente)
export interface ReferenceContent {
  title?: string;
  description?: string;
  fields?: {
    label: string;
    value: string;
  }[];
  context?: string;
}

// Tipos para Chat History
export interface ChatHistory {
  id: string | number;
  name: string;
  type: string;
  messages: Message[];
  createdAt: string;
}

// Tipos para Base de Datos
export interface FeedbackRecord {
  id: string | number;
  userPhoto?: string;
  userName: string; // Usuario que dio el feedback
  recipientName: string; // A quién se le dio feedback
  feedback: string;
  context: string;
  date?: string;
}

export interface SharePointRecord {
  id: string | number;
  // Primeras 3 columnas (llenadas manualmente)
  nombre: string;
  contexto: string;
  feedback: string;
  // Últimas 3 columnas (generadas por IA)
  analisisIA?: string;
  recomendaciones?: string;
  puntuacion?: string;
  status: 'Pausado' | 'En proceso' | 'Finalizado' | 'Finalizado negativo';
  date?: string;
}

export interface KnowledgeSource {
  id: string | number;
  name: string;
  type: 'pdf' | string;
  size?: string;
  date?: string;
  url?: string; // Link o referencia al PDF
}

// Componente activo para Referencias dinámicas
export type ActiveComponent = 'chatbot' | 'database' | 'references' | null;

