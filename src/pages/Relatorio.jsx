// ─────────────────────────────────────────────
//  pages/Relatorio.jsx
//  Gera e exibe o relatório final de entrega
//  Permite baixar como arquivo .txt
// ─────────────────────────────────────────────

import { useState } from 'react'
import { useApp } from '../context/AppContext'
import Badge from '../components/Badge'
import Campo from '../components/Campo'
import Botao from '../components/Botao'

export default function Relatorio() {
  const { aeronaves, funcionarios, temPermissao } = useApp()

  const [codigoAeronave, setCodigoAeronave] = useState('')
  const [nomeCliente,    setNomeCliente]    = useState('')
  const [dataEntrega,    setDataEntrega]    = useState('')
  const [gerado,         setGerado]         = useState(false)

  // Aeronave selecionada
  const aeronave = aeronaves.find((a) => a.codigo === codigoAeronave)

  const podeGerar = temPermissao('ADMINISTRADOR', 'ENGENHEIRO')

  // Gera o texto do relatório no formato do CLI original
  function gerarTexto() {
    if (!aeronave) return ''
    const sep  = '='.repeat(62)
    const dash = '-'.repeat(62)
    const linhas = [
      sep,
      '       RELATÓRIO FINAL DE ENTREGA  -  AEROCODE',
      sep,
      `  Data de geração : ${new Date().toLocaleString('pt-BR')}`,
      `  Cliente         : ${nomeCliente}`,
      `  Data de entrega : ${dataEntrega}`,
      dash,
      '  AERONAVE',
      dash,
      `  Código    : ${aeronave.codigo}`,
      `  Modelo    : ${aeronave.modelo}`,
      `  Tipo      : ${aeronave.tipo}`,
      `  Capacidade: ${aeronave.capacidade} passageiros`,
      `  Alcance   : ${aeronave.alcance} km`,
      dash,
      `  PEÇAS UTILIZADAS (${aeronave.pecas.length})`,
      dash,
    ]

    if (aeronave.pecas.length === 0) {
      linhas.push('  Nenhuma peça registrada.')
    } else {
      aeronave.pecas.forEach((p, i) => {
        linhas.push(`  ${i + 1}. ${p.nome} | ${p.tipo} | ${p.fornecedor} | ${p.status}`)
      })
    }

    linhas.push(dash, `  ETAPAS DE PRODUÇÃO (${aeronave.etapas.length})`, dash)
    if (aeronave.etapas.length === 0) {
      linhas.push('  Nenhuma etapa registrada.')
    } else {
      aeronave.etapas.forEach((e, i) => {
        linhas.push(`  ${i + 1}. ${e.nome} | Prazo: ${e.prazo} | ${e.status}`)
        const funcs = e.funcionariosIds
          .map((id) => funcionarios.find((f) => f.id === id)?.nome)
          .filter(Boolean)
        funcs.forEach((fn) => linhas.push(`     - ${fn}`))
      })
    }

    linhas.push(dash, `  TESTES (${aeronave.testes.length})`, dash)
    if (aeronave.testes.length === 0) {
      linhas.push('  Nenhum teste registrado.')
    } else {
      aeronave.testes.forEach((t, i) => {
        linhas.push(`  ${i + 1}. ${t.tipo} | ${t.resultado} | ${t.data}`)
      })
    }

    linhas.push(sep, '  FIM DO RELATÓRIO', sep)
    return linhas.join('\n')
  }

  // Faz o download do arquivo .txt
  function baixarTxt() {
    const texto = gerarTexto()
    const blob  = new Blob([texto], { type: 'text/plain' })
    const url   = URL.createObjectURL(blob)
    const link  = document.createElement('a')
    link.href     = url
    link.download = `relatorio_${codigoAeronave}_${Date.now()}.txt`
    link.click()
    URL.revokeObjectURL(url)
  }

  if (!podeGerar) {
    return (
      <div style={{ padding: '28px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '16px' }}>Relatórios</h1>
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '16px', color: '#dc2626', fontSize: '14px' }}>
          ⛔ Acesso negado. Apenas Administradores e Engenheiros podem gerar relatórios.
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '28px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '800' }}>Gerar Relatório de Entrega</h1>
        <p style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>
          Preencha os dados abaixo e visualize o relatório antes de salvar
        </p>
      </div>

      {/* Formulário */}
      <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: '24px', maxWidth: '500px' }}>
        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
            Aeronave
          </label>
          <select
            value={codigoAeronave}
            onChange={(e) => { setCodigoAeronave(e.target.value); setGerado(false) }}
            style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit' }}
          >
            <option value="">Selecione uma aeronave...</option>
            {aeronaves.map((a) => (
              <option key={a.id} value={a.codigo}>
                {a.codigo} — {a.modelo}
              </option>
            ))}
          </select>
        </div>

        <Campo label="Nome do cliente"  valor={nomeCliente} onChange={(v) => { setNomeCliente(v);  setGerado(false) }} placeholder="LATAM Airlines" />
        <Campo label="Data de entrega"  valor={dataEntrega} onChange={(v) => { setDataEntrega(v);  setGerado(false) }} tipo="date" />

        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
          <Botao
            onClick={() => setGerado(true)}
            desabilitado={!codigoAeronave || !nomeCliente || !dataEntrega}
          >
            Visualizar relatório
          </Botao>
          {gerado && (
            <Botao variante="secundario" onClick={baixarTxt}>
              ⬇ Baixar .txt
            </Botao>
          )}
        </div>
      </div>

      {/* Pré-visualização */}
      {gerado && aeronave && (
        <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '16px' }}>
            Pré-visualização
          </h2>

          {/* Cabeçalho do relatório */}
          <div style={{ background: '#0f172a', color: '#f1f5f9', borderRadius: '8px', padding: '16px 20px', marginBottom: '20px' }}>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>RELATÓRIO FINAL DE ENTREGA</div>
            <div style={{ fontSize: '18px', fontWeight: '800' }}>{aeronave.codigo} — {aeronave.modelo}</div>
            <div style={{ marginTop: '8px', fontSize: '13px', color: '#94a3b8' }}>
              Cliente: <span style={{ color: '#f1f5f9' }}>{nomeCliente}</span>
              &nbsp;&nbsp;|&nbsp;&nbsp;
              Entrega: <span style={{ color: '#f1f5f9' }}>{dataEntrega}</span>
            </div>
          </div>

          {/* Dados em grade */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

            {/* Info aeronave */}
            <div>
              <h3 style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '10px' }}>Aeronave</h3>
              <div style={{ fontSize: '13px', lineHeight: '1.8' }}>
                <div><strong>Tipo:</strong> <Badge valor={aeronave.tipo} /></div>
                <div><strong>Capacidade:</strong> {aeronave.capacidade} pax</div>
                <div><strong>Alcance:</strong> {aeronave.alcance} km</div>
              </div>
            </div>

            {/* Peças */}
            <div>
              <h3 style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '10px' }}>Peças ({aeronave.pecas.length})</h3>
              {aeronave.pecas.length === 0
                ? <p style={{ color: '#94a3b8', fontSize: '13px' }}>Nenhuma</p>
                : aeronave.pecas.map((p) => (
                  <div key={p.id} style={{ fontSize: '13px', marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{p.nome}</span>
                    <Badge valor={p.status} />
                  </div>
                ))
              }
            </div>

            {/* Etapas */}
            <div>
              <h3 style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '10px' }}>Etapas ({aeronave.etapas.length})</h3>
              {aeronave.etapas.length === 0
                ? <p style={{ color: '#94a3b8', fontSize: '13px' }}>Nenhuma</p>
                : aeronave.etapas.map((e) => (
                  <div key={e.id} style={{ fontSize: '13px', marginBottom: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{e.nome}</span>
                    <Badge valor={e.status} />
                  </div>
                ))
              }
            </div>

            {/* Testes */}
            <div>
              <h3 style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '10px' }}>Testes ({aeronave.testes.length})</h3>
              {aeronave.testes.length === 0
                ? <p style={{ color: '#94a3b8', fontSize: '13px' }}>Nenhum</p>
                : aeronave.testes.map((t) => (
                  <div key={t.id} style={{ fontSize: '13px', marginBottom: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{t.tipo}</span>
                    <Badge valor={t.resultado} />
                  </div>
                ))
              }
            </div>
          </div>

          {/* Texto bruto (estilo terminal) */}
          <details style={{ marginTop: '20px' }}>
            <summary style={{ cursor: 'pointer', fontSize: '13px', color: '#64748b', userSelect: 'none' }}>
              Ver texto completo (formato .txt)
            </summary>
            <pre
              style={{
                marginTop: '12px',
                background: '#0f172a',
                color: '#94a3b8',
                padding: '16px',
                borderRadius: '8px',
                fontSize: '11px',
                fontFamily: "'Fira Code', monospace",
                overflowX: 'auto',
                lineHeight: '1.6',
                whiteSpace: 'pre-wrap',
              }}
            >
              {gerarTexto()}
            </pre>
          </details>
        </div>
      )}
    </div>
  )
}