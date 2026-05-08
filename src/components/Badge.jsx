// ─────────────────────────────────────────────
//  Badge.jsx — etiqueta colorida de status
// ─────────────────────────────────────────────

// Mapa: valor → cor de fundo e texto
const CORES = {
  APROVADO:       { bg: '#dcfce7', cor: '#166534' },
  CONCLUIDA:      { bg: '#dcfce7', cor: '#166534' },
  PRONTA:         { bg: '#dcfce7', cor: '#166534' },
  REPROVADO:      { bg: '#fee2e2', cor: '#991b1b' },
  ANDAMENTO:      { bg: '#fef9c3', cor: '#854d0e' },
  EM_TRANSPORTE:  { bg: '#fef9c3', cor: '#854d0e' },
  PENDENTE:       { bg: '#f1f5f9', cor: '#475569' },
  EM_PRODUCAO:    { bg: '#dbeafe', cor: '#1e40af' },
  COMERCIAL:      { bg: '#dbeafe', cor: '#1e40af' },
  MILITAR:        { bg: '#f3e8ff', cor: '#6b21a8' },
  ADMINISTRADOR:  { bg: '#dbeafe', cor: '#1e40af' },
  ENGENHEIRO:     { bg: '#f0fdf4', cor: '#166534' },
  OPERADOR:       { bg: '#f1f5f9', cor: '#475569' },
  NACIONAL:       { bg: '#f0fdf4', cor: '#166534' },
  IMPORTADA:      { bg: '#fef9c3', cor: '#854d0e' },
  ELETRICO:       { bg: '#dbeafe', cor: '#1e40af' },
  HIDRAULICO:     { bg: '#f3e8ff', cor: '#6b21a8' },
  AERODINAMICO:   { bg: '#ecfdf5', cor: '#065f46' },
}

export default function Badge({ valor }) {
  const estilo = CORES[valor] || { bg: '#f1f5f9', cor: '#475569' }

  return (
    <span
      style={{
        backgroundColor: estilo.bg,
        color: estilo.cor,
        padding: '2px 8px',
        borderRadius: '9999px',
        fontSize: '11px',
        fontWeight: '600',
        whiteSpace: 'nowrap',
        display: 'inline-block',
      }}
    >
      {valor}
    </span>
  )
}