// ─────────────────────────────────────────────
//  Campo.jsx — campo de formulário reutilizável
//  Junta o <label> e o <input> (ou <select>)
//  num único componente para não repetir código.
// ─────────────────────────────────────────────

export default function Campo({ label, tipo = 'text', valor, onChange, opcoes, placeholder }) {
  const estiloLabel = {
    display: 'block',
    fontSize: '12px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '4px',
  }

  const estiloInput = {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#111',
    background: '#fff',
    outline: 'none',
    boxSizing: 'border-box',
  }

  return (
    <div style={{ marginBottom: '14px' }}>
      <label style={estiloLabel}>{label}</label>

      {/* Se passou opcoes[], renderiza um <select> */}
      {opcoes ? (
        <select value={valor} onChange={(e) => onChange(e.target.value)} style={estiloInput}>
          {opcoes.map((op) => (
            <option key={op.valor ?? op} value={op.valor ?? op}>
              {op.label ?? op}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={tipo}
          value={valor}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={estiloInput}
        />
      )}
    </div>
  )
}