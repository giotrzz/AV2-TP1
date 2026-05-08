
import { useState } from 'react'
import { useApp } from '../context/AppContext'
import Badge from '../components/Badge'
import Modal from '../components/Modal'
import Campo from '../components/Campo'
import Botao from '../components/Botao'

function FormNovaAeronave({ onFechar }) {
  const { adicionarAeronave, aeronaves } = useApp()

  const [codigo,     setCodigo]     = useState('')
  const [modelo,     setModelo]     = useState('')
  const [tipo,       setTipo]       = useState('COMERCIAL')
  const [capacidade, setCapacidade] = useState('')
  const [alcance,    setAlcance]    = useState('')
  const [erro,       setErro]       = useState('')

  function salvar() {

    if (!codigo || !modelo || !capacidade || !alcance) {
      setErro('Preencha todos os campos.')
      return
    }
    if (aeronaves.some((a) => a.codigo === codigo)) {
      setErro('Já existe uma aeronave com este código.')
      return
    }

    adicionarAeronave({
      id: codigo,
      codigo,
      modelo,
      tipo,
      capacidade: Number(capacidade),
      alcance: Number(alcance),
      pecas: [],
      etapas: [],
      testes: [],
    })
    onFechar()
  }

  return (
    <div>
      <Campo label="Código único (ex: AC-042)" valor={codigo} onChange={setCodigo} placeholder="AC-042" />
      <Campo label="Modelo"                     valor={modelo} onChange={setModelo} placeholder="Boeing 737 MAX" />
      <Campo label="Tipo" valor={tipo} onChange={setTipo}
        opcoes={['COMERCIAL', 'MILITAR']} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <Campo label="Capacidade (pax)" valor={capacidade} onChange={setCapacidade} tipo="number" placeholder="189" />
        <Campo label="Alcance (km)"     valor={alcance}    onChange={setAlcance}    tipo="number" placeholder="6110" />
      </div>

      {erro && <p style={{ color: '#dc2626', fontSize: '13px', marginBottom: '12px' }}>{erro}</p>}

      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
        <Botao variante="secundario" onClick={onFechar}>Cancelar</Botao>
        <Botao onClick={salvar}>Cadastrar</Botao>
      </div>
    </div>
  )
}

function DetalheAeronave({ aeronave, onVoltar }) {
  const [aba, setAba] = useState('pecas')

  const abas = [
    { id: 'pecas',   label: `Peças (${aeronave.pecas.length})`   },
    { id: 'etapas',  label: `Etapas (${aeronave.etapas.length})` },
    { id: 'testes',  label: `Testes (${aeronave.testes.length})` },
  ]

  return (
    <div style={{ padding: '28px' }}>
      {/* Cabeçalho */}
      <button
        onClick={onVoltar}
        style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontSize: '13px', marginBottom: '16px', fontFamily: 'inherit' }}
      >

      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '800' }}>{aeronave.codigo}</h1>
        <Badge valor={aeronave.tipo} />
      </div>
      <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>{aeronave.modelo}</p>

      {/* Info rápida */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '28px' }}>
        {[
          { label: 'Capacidade', valor: `${aeronave.capacidade} pax` },
          { label: 'Alcance',    valor: `${aeronave.alcance} km`     },
          { label: 'Tipo',       valor: aeronave.tipo                 },
        ].map((item) => (
          <div key={item.label} style={{ background: '#fff', borderRadius: '10px', padding: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>{item.label}</div>
            <div style={{ fontSize: '16px', fontWeight: '700' }}>{item.valor}</div>
          </div>
        ))}
      </div>

      {/* Abas */}
      <div style={{ display: 'flex', borderBottom: '2px solid #e2e8f0', marginBottom: '20px' }}>
        {abas.map((a) => (
          <button
            key={a.id}
            onClick={() => setAba(a.id)}
            style={{
              padding: '10px 20px',
              background: 'none',
              border: 'none',
              borderBottom: aba === a.id ? '2px solid #1d4ed8' : '2px solid transparent',
              marginBottom: '-2px',
              fontSize: '13px',
              fontWeight: aba === a.id ? '700' : '400',
              color: aba === a.id ? '#1d4ed8' : '#64748b',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {a.label}
          </button>
        ))}
      </div>

      {/* Conteúdo da aba */}
      {aba === 'pecas' && <TabelaPecas aeronave={aeronave} />}
      {aba === 'etapas' && <TabelaEtapas aeronave={aeronave} />}
      {aba === 'testes' && <TabelaTestes aeronave={aeronave} />}
    </div>
  )
}

function TabelaPecas({ aeronave }) {
  const { adicionarPeca, atualizarStatusPeca, temPermissao } = useApp()
  const [modalAberto, setModalAberto] = useState(false)

  const [nome,       setNome]       = useState('')
  const [tipo,       setTipo]       = useState('NACIONAL')
  const [fornecedor, setFornecedor] = useState('')
  const [status,     setStatus]     = useState('EM_PRODUCAO')

  function salvarPeca() {
    if (!nome || !fornecedor) return
    adicionarPeca(aeronave.codigo, {
      id: `p${Date.now()}`,
      nome, tipo, fornecedor, status,
    })
    setNome(''); setFornecedor('')
    setModalAberto(false)
  }

  const podeEditar = temPermissao('ADMINISTRADOR', 'ENGENHEIRO', 'OPERADOR')

  return (
    <div>
      {podeEditar && (
        <div style={{ marginBottom: '16px' }}>
          <Botao onClick={() => setModalAberto(true)}>+ Nova peça</Botao>
        </div>
      )}

      {aeronave.pecas.length === 0
        ? <p style={{ color: '#94a3b8' }}>Nenhuma peça cadastrada.</p>
        : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Nome', 'Tipo', 'Fornecedor', 'Status', 'Ação'].map((h) => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '11px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {aeronave.pecas.map((p) => (
                <tr key={p.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 14px', fontSize: '13px', fontWeight: '500' }}>{p.nome}</td>
                  <td style={{ padding: '12px 14px' }}><Badge valor={p.tipo} /></td>
                  <td style={{ padding: '12px 14px', fontSize: '13px', color: '#475569' }}>{p.fornecedor}</td>
                  <td style={{ padding: '12px 14px' }}><Badge valor={p.status} /></td>
                  <td style={{ padding: '12px 14px' }}>
                    {podeEditar && (
                      <select
                        value={p.status}
                        onChange={(e) => atualizarStatusPeca(aeronave.codigo, p.id, e.target.value)}
                        style={{ fontSize: '12px', padding: '4px 8px', border: '1px solid #e2e8f0', borderRadius: '6px', fontFamily: 'inherit' }}
                      >
                        {['EM_PRODUCAO', 'EM_TRANSPORTE', 'PRONTA'].map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      }

      <Modal aberto={modalAberto} onFechar={() => setModalAberto(false)} titulo="Nova Peça">
        <Campo label="Nome da peça"  valor={nome}       onChange={setNome}       placeholder="Motor Turbofan" />
        <Campo label="Tipo"          valor={tipo}       onChange={setTipo}       opcoes={['NACIONAL', 'IMPORTADA']} />
        <Campo label="Fornecedor"    valor={fornecedor} onChange={setFornecedor} placeholder="TurboCo Ltda" />
        <Campo label="Status"        valor={status}     onChange={setStatus}     opcoes={['EM_PRODUCAO', 'EM_TRANSPORTE', 'PRONTA']} />
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <Botao variante="secundario" onClick={() => setModalAberto(false)}>Cancelar</Botao>
          <Botao onClick={salvarPeca}>Adicionar</Botao>
        </div>
      </Modal>
    </div>
  )
}

function TabelaEtapas({ aeronave }) {
  const { adicionarEtapa, atualizarStatusEtapa, temPermissao } = useApp()
  const [modalAberto, setModalAberto] = useState(false)
  const [nome,  setNome]  = useState('')
  const [prazo, setPrazo] = useState('')

  function salvarEtapa() {
    if (!nome || !prazo) return
    adicionarEtapa(aeronave.codigo, {
      id: `e${Date.now()}`,
      nome, prazo,
      status: 'PENDENTE',
      funcionariosIds: [],
    })
    setNome(''); setPrazo('')
    setModalAberto(false)
  }

  const podeEditar = temPermissao('ADMINISTRADOR', 'ENGENHEIRO')

  function proximoStatus(statusAtual) {
    if (statusAtual === 'PENDENTE')  return 'ANDAMENTO'
    if (statusAtual === 'ANDAMENTO') return 'CONCLUIDA'
    return null // CONCLUIDA não tem próximo
  }

  return (
    <div>
      {podeEditar && (
        <div style={{ marginBottom: '16px' }}>
          <Botao onClick={() => setModalAberto(true)}>+ Nova etapa</Botao>
        </div>
      )}

      {aeronave.etapas.length === 0
        ? <p style={{ color: '#94a3b8' }}>Nenhuma etapa cadastrada.</p>
        : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Nome', 'Prazo', 'Status', 'Ação'].map((h) => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '11px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {aeronave.etapas.map((e) => {
                const prox = proximoStatus(e.status)
                return (
                  <tr key={e.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 14px', fontSize: '13px', fontWeight: '500' }}>{e.nome}</td>
                    <td style={{ padding: '12px 14px', fontSize: '13px', color: '#475569' }}>{e.prazo}</td>
                    <td style={{ padding: '12px 14px' }}><Badge valor={e.status} /></td>
                    <td style={{ padding: '12px 14px' }}>
                      {podeEditar && prox && (
                        <button
                          onClick={() => atualizarStatusEtapa(aeronave.codigo, e.id, prox)}
                          style={{
                            fontSize: '12px', padding: '4px 10px',
                            border: '1px solid #d1d5db', borderRadius: '6px',
                            background: '#fff', cursor: 'pointer', fontFamily: 'inherit',
                          }}
                        >
                          {prox === 'ANDAMENTO' ? '▶ Iniciar' : '✓ Finalizar'}
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )
      }

      <Modal aberto={modalAberto} onFechar={() => setModalAberto(false)} titulo="Nova Etapa">
        <Campo label="Nome da etapa" valor={nome}  onChange={setNome}  placeholder="Montagem da fuselagem" />
        <Campo label="Prazo"         valor={prazo} onChange={setPrazo} tipo="date" />
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <Botao variante="secundario" onClick={() => setModalAberto(false)}>Cancelar</Botao>
          <Botao onClick={salvarEtapa}>Adicionar</Botao>
        </div>
      </Modal>
    </div>
  )
}

function TabelaTestes({ aeronave }) {
  const { adicionarTeste, temPermissao } = useApp()
  const [modalAberto, setModalAberto] = useState(false)
  const [tipo,      setTipo]      = useState('ELETRICO')
  const [resultado, setResultado] = useState('APROVADO')

  function salvarTeste() {
    adicionarTeste(aeronave.codigo, {
      id: `t${Date.now()}`,
      tipo, resultado,
      data: new Date().toLocaleDateString('pt-BR'),
    })
    setModalAberto(false)
  }

  const podeEditar = temPermissao('ADMINISTRADOR', 'ENGENHEIRO')

  return (
    <div>
      {podeEditar && (
        <div style={{ marginBottom: '16px' }}>
          <Botao onClick={() => setModalAberto(true)}>+ Registrar teste</Botao>
        </div>
      )}

      {aeronave.testes.length === 0
        ? <p style={{ color: '#94a3b8' }}>Nenhum teste registrado.</p>
        : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Tipo', 'Resultado', 'Data'].map((h) => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '11px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {aeronave.testes.map((t) => (
                <tr key={t.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 14px' }}><Badge valor={t.tipo} /></td>
                  <td style={{ padding: '12px 14px' }}><Badge valor={t.resultado} /></td>
                  <td style={{ padding: '12px 14px', fontSize: '13px', color: '#475569' }}>{t.data}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      }

      <Modal aberto={modalAberto} onFechar={() => setModalAberto(false)} titulo="Registrar Teste">
        <Campo label="Tipo de teste" valor={tipo}      onChange={setTipo}      opcoes={['ELETRICO', 'HIDRAULICO', 'AERODINAMICO']} />
        <Campo label="Resultado"     valor={resultado} onChange={setResultado} opcoes={['APROVADO', 'REPROVADO']} />
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <Botao variante="secundario" onClick={() => setModalAberto(false)}>Cancelar</Botao>
          <Botao onClick={salvarTeste}>Registrar</Botao>
        </div>
      </Modal>
    </div>
  )
}


export default function Aeronaves() {
  const { aeronaves, temPermissao } = useApp()
  const [modalAberto,      setModalAberto]      = useState(false)
  const [aeronaveDetalhe,  setAeronaveDetalhe]  = useState(null)

  if (aeronaveDetalhe) {

    const aeronaveAtual = aeronaves.find((a) => a.codigo === aeronaveDetalhe.codigo)
    return (
      <DetalheAeronave
        aeronave={aeronaveAtual}
        onVoltar={() => setAeronaveDetalhe(null)}
      />
    )
  }

  return (
    <div style={{ padding: '28px' }}>

      {/* Cabeçalho */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '800' }}>Aeronaves</h1>
          <p style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>
            {aeronaves.length} aeronave(s) cadastrada(s)
          </p>
        </div>
        {temPermissao('ADMINISTRADOR', 'ENGENHEIRO') && (
          <Botao onClick={() => setModalAberto(true)}>+ Nova aeronave</Botao>
        )}
      </div>

      {/* Tabela */}
      <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Código', 'Modelo', 'Tipo', 'Capacidade', 'Alcance', 'Peças', 'Etapas'].map((h) => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {aeronaves.length === 0 && (
              <tr>
                <td colSpan={7} style={{ padding: '32px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>
                  Nenhuma aeronave cadastrada ainda.
                </td>
              </tr>
            )}
            {aeronaves.map((a) => (
              <tr
                key={a.id}
                onClick={() => setAeronaveDetalhe(a)}
                style={{ borderTop: '1px solid #f1f5f9', cursor: 'pointer' }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '700', color: '#1d4ed8' }}>{a.codigo}</td>
                <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '500' }}>{a.modelo}</td>
                <td style={{ padding: '14px 16px' }}><Badge valor={a.tipo} /></td>
                <td style={{ padding: '14px 16px', fontSize: '13px', color: '#475569' }}>{a.capacidade} pax</td>
                <td style={{ padding: '14px 16px', fontSize: '13px', color: '#475569' }}>{a.alcance} km</td>
                <td style={{ padding: '14px 16px', fontSize: '13px', color: '#475569' }}>{a.pecas.length}</td>
                <td style={{ padding: '14px 16px', fontSize: '13px', color: '#475569' }}>{a.etapas.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de nova aeronave */}
      <Modal aberto={modalAberto} onFechar={() => setModalAberto(false)} titulo="Nova Aeronave">
        <FormNovaAeronave onFechar={() => setModalAberto(false)} />
      </Modal>
    </div>
  )
}