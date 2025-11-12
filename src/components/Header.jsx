function Header({ assistanceMode, onToggleAssistance }) {
  return (
    <header className="bg-white border-b border-black/10 px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-base font-medium text-black">Modo Asistencia</h1>
          <span className="text-sm text-black/40">TGV Argentina</span>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-xs text-black/50 uppercase tracking-wide">Modo Asistencia</span>
          <button
            onClick={onToggleAssistance}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
              assistanceMode ? 'bg-accent-red' : 'bg-black/20'
            }`}
          >
            <span
              className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform shadow-sm ${
                assistanceMode ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </button>
          <span className={`text-xs font-medium min-w-[50px] ${
            assistanceMode ? 'text-accent-red' : 'text-black/30'
          }`}>
            {assistanceMode ? 'ACTIVO' : 'INACTIVO'}
          </span>
        </div>
      </div>
    </header>
  )
}

export default Header

