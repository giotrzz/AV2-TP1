

import { useState } from 'react'
import { useApp } from '../context/AppContext'
import Badge from '../components/Badge'
import Modal from '../components/Modal'
import Botao from '../components/Botao'

export default function Etapas() {
  const { aeronaves, funcionarios, atualizarStatusEtapa, associarFuncionarioEtapa, temPermissao } = useApp()
  const [etapaSelecionada, setEtapaSelecionada] = useState(null) // { aeronave, etapa }
  const [funcSelecionado,  setFuncSelecionado]  = useState('')

  const podeEditar = temPermissao('ADMINISTRADOR', 'ENGENHEIRO')

  // Junta todas as etapas com referência à aeronave
  const todasEtapas = aeronaves.flatMap((a) =>
    a.etapas.map((e) => ({ etapa: e, aeronave: a }))
  )

  function proximoStatus(status) {
    if (status === 'PENDENTE')  return { label: '▶ Iniciar',   prox: 'ANDAMENTO' }
    if (status === 'ANDAMENTO') return { label: '✓ Finalizar', prox: 'CONCLUIDA' }
    return null
  }

  function associar() {
    if (!funcSelecionado || !etapaSelecionada) return
    associarFuncionarioEtapa(etapaSelecionada.aeronave.codigo, etapaSelecionada.etapa.id, funcSelecionado)
    setEtapaSelecionada(null)
    setFuncSelecionado('')
  }

  return (
    <div style={{ padding: '28px' }}>

      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '800' }}>Etapas de Produção</h1>
        <p style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>
          {todasEtapas.length} etapa(s) no total
        </p>
      </div>

      <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Etapa', 'Aeronave', 'Prazo', 'Status', 'Funcionários', 'Ações'].map((h) => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {todasEtapas.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
                  Nenhuma etapa cadastrada.
                </td>
              </tr>
            )}
            {todasEtapas.map(({ etapa, aeronave }) => {
              const transicao = proximoStatus(etapa.status)
              // Busca os nomes dos funcionários associados
              const funcsAssociados = etapa.funcionariosIds
                .map((id) => funcionarios.find((f) => f.id === id)?.nome)
                .filter(Boolean)

              return (
                <tr key={etapa.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '600' }}>{etapa.nome}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontSize: '12px', background: '#eff6ff', color: '#1d4ed8', padding: '2px 8px', borderRadius: '6px', fontWeight: '600' }}>
                      {aeronave.codigo}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#475569' }}>{etapa.prazo}</td>
                  <td style={{ padding: '14px 16px' }}><Badge valor={etapa.status} /></td>
                  <td style={{ padding: '14px 16px', fontSize: '12px', color: '#475569' }}>
                    {funcsAssociados.length === 0
                      ? <span style={{ color: '#cbd5e1' }}>Nenhum</span>
                      : funcsAssociados.join(', ')
                    }
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {podeEditar && transicao && (
                        <button variante ="primario"
                          onClick={() => atualizarStatusEtapa(aeronave.codigo, etapa.id, transicao.prox)}
                          style={{ fontSize: '12px', padding: '4px 10px', border: '1px solid #d1d5db', borderRadius: '6px', background: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}
                        >
                          {transicao.label}
                        </button>
                      )}
                      {podeEditar && (
                        <button variante = "secundario"
                          onClick={() => setEtapaSelecionada({ etapa, aeronave })}
                          style={{ fontSize: '12px', padding: '4px 10px', border: '1px solid #d1d5db', borderRadius: '6px', background: '#fff', cursor: 'pointer', fontFamily: 'inherit', }}
                        >
                          + Funcionário
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Modal: associar funcionário */}
      <Modal
        aberto={!!etapaSelecionada}
        onFechar={() => setEtapaSelecionada(null)}
        titulo={`Associar funcionário — ${etapaSelecionada?.etapa.nome}`}
      >
        <p style={{ fontSize: '13px', color: '#475569', marginBottom: '16px' }}>
          Selecione um funcionário para associar a esta etapa.
        </p>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
            Funcionário
          </label>
          <select
            value={funcSelecionado}
            onChange={(e) => setFuncSelecionado(e.target.value)}
            style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit' }}
          >
            <option value="">Selecione...</option>
            {funcionarios
              .filter((f) => !etapaSelecionada?.etapa.funcionariosIds.includes(f.id))
              .map((f) => (
                <option key={f.id} value={f.id}>
                  {f.nome} ({f.nivelPermissao})
                </option>
              ))
            }
          </select>
        </div>

        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <Botao variante="secundario" onClick={() => setEtapaSelecionada(null)}>Cancelar</Botao>
          <Botao onClick={associar} desabilitado={!funcSelecionado}>Associar</Botao>
        </div>
      </Modal>
    </div>
  )
}