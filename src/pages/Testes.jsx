

import { useApp } from '../context/AppContext'
import Badge from '../components/Badge'

export default function Testes() {
  const { aeronaves } = useApp()

  // Junta todos os testes com referência à aeronave
  const todosTestes = aeronaves.flatMap((a) =>
    a.testes.map((t) => ({ teste: t, aeronave: a }))
  )

  const aprovados  = todosTestes.filter((t) => t.teste.resultado === 'APROVADO').length
  const reprovados = todosTestes.filter((t) => t.teste.resultado === 'REPROVADO').length

  return (
    <div style={{ padding: '28px' }}>

      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '800' }}>Testes</h1>
        <p style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>
          {todosTestes.length} teste(s) — {aprovados} aprovados · {reprovados} reprovados
        </p>
      </div>

      <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Aeronave', 'Modelo', 'Tipo', 'Resultado', 'Data'].map((h) => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {todosTestes.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
                  Nenhum teste registrado.
                </td>
              </tr>
            )}
            {todosTestes.map(({ teste, aeronave }) => (
              <tr key={teste.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ fontSize: '12px', background: '#eff6ff', color: '#1d4ed8', padding: '2px 8px', borderRadius: '6px', fontWeight: '600' }}>
                    {aeronave.codigo}
                  </span>
                </td>
                <td style={{ padding: '14px 16px', fontSize: '13px', color: '#475569' }}>{aeronave.modelo}</td>
                <td style={{ padding: '14px 16px' }}><Badge valor={teste.tipo} /></td>
                <td style={{ padding: '14px 16px' }}><Badge valor={teste.resultado} /></td>
                <td style={{ padding: '14px 16px', fontSize: '13px', color: '#475569' }}>{teste.data}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}