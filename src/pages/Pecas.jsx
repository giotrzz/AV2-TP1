// ─────────────────────────────────────────────
//  pages/Pecas.jsx
//  Lista todas as peças de todas as aeronaves
// ─────────────────────────────────────────────

import { useApp } from '../context/AppContext'
import Badge from '../components/Badge'

export default function Pecas() {
  const { aeronaves, atualizarStatusPeca, temPermissao } = useApp()

  // Junta todas as peças com referência à aeronave
  const todasPecas = aeronaves.flatMap((a) =>
    a.pecas.map((p) => ({ peca: p, aeronave: a }))
  )

  const podeEditar = temPermissao('ADMINISTRADOR', 'ENGENHEIRO', 'OPERADOR')

  return (
    <div style={{ padding: '28px' }}>

      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '800' }}>Peças</h1>
        <p style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>
          {todasPecas.length} peça(s) cadastrada(s)
        </p>
      </div>

      <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Nome', 'Tipo', 'Fornecedor', 'Aeronave', 'Status', 'Atualizar'].map((h) => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {todasPecas.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
                  Nenhuma peça cadastrada.
                </td>
              </tr>
            )}
            {todasPecas.map(({ peca, aeronave }) => (
              <tr key={peca.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '600' }}>{peca.nome}</td>
                <td style={{ padding: '14px 16px' }}><Badge valor={peca.tipo} /></td>
                <td style={{ padding: '14px 16px', fontSize: '13px', color: '#475569' }}>{peca.fornecedor}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ fontSize: '12px', background: '#eff6ff', color: '#1d4ed8', padding: '2px 8px', borderRadius: '6px', fontWeight: '600' }}>
                    {aeronave.codigo}
                  </span>
                </td>
                <td style={{ padding: '14px 16px' }}><Badge valor={peca.status} /></td>
                <td style={{ padding: '14px 16px' }}>
                  {podeEditar && (
                    <select
                      value={peca.status}
                      onChange={(e) => atualizarStatusPeca(aeronave.codigo, peca.id, e.target.value)}
                      style={{ fontSize: '12px', padding: '5px 8px', border: '1px solid #e2e8f0', borderRadius: '6px', fontFamily: 'inherit' }}
                    >
                      <option value="EM_PRODUCAO">EM_PRODUCAO</option>
                      <option value="EM_TRANSPORTE">EM_TRANSPORTE</option>
                      <option value="PRONTA">PRONTA</option>
                    </select>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}