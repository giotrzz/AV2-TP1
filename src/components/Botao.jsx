// src/components/Botao.jsx

export default function Botao({ children, onClick, variante = 'primario', desabilitado = false }) {
  
  const estiloBase = {
    padding: '6px 12px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: desabilitado ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    minWidth: '100px',
    textTransform: 'uppercase', // Dá um ar mais sério/industrial
    letterSpacing: '0.5px'
  };

  const variantes = {
    // Botão Principal (Escuro como a sidebar)
    primario: {
      backgroundColor: '#1a1a1a', 
      color: '#ffffff',
      border: '1px solid #000000',
    },
    // Botão Secundário (Cinza médio, ótimo para tabelas)
    secundario: {
      backgroundColor: '#f1f1f1',
      color: '#333333',
      border: '1px solid #ccc',
    },
    // Para botões de "Iniciar" ou "Finalizar" que precisam de destaque
    sucesso: {
      backgroundColor: '#2d2d2d',
      color: '#ffffff',
      border: '2px solid #4CAF50', // Apenas uma borda verde fina
    }
  };

  const estiloFinal = { ...estiloBase, ...variantes[variante] };

  return (
    <button 
      onClick={onClick} 
      disabled={desabilitado} 
      style={estiloFinal}
      onMouseEnter={(e) => e.currentTarget.style.filter = 'contrast(1.5)'}
      onMouseLeave={(e) => e.currentTarget.style.filter = 'contrast(1)'}
    >
      {children}
    </button>
  );
}