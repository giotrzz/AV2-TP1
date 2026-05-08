

export default function Modal({ aberto, onFechar, titulo, children }) {
  // Se não estiver aberto, não renderiza nada
  if (!aberto) return null

  return (
    // Fundo escuro semi-transparente
    <div
      onClick={onFechar}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      {/* Caixa do modal — stopPropagation evita fechar ao clicar dentro */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '24px',
          width: '100%',
          maxWidth: '420px',
          margin: '0 16px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        }}
      >
        {/* Cabeçalho com título e botão fechar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#111' }}>{titulo}</h2>
          <button
            onClick={onFechar}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              color: '#6b7280',
              lineHeight: 1,
              padding: '0 4px',
            }}
          >
            ×
          </button>
        </div>

        {/* Conteúdo passado pelo pai */}
        {children}
      </div>
    </div>
  )
}