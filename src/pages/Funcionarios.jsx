// ─────────────────────────────────────────────
//  pages/Funcionarios.jsx
//  Lista funcionários e permite cadastrar novos
//  (só ADMINISTRADOR pode cadastrar)
// ─────────────────────────────────────────────

import { useState } from 'react'
import { useApp } from '../context/AppContext'
import Badge from '../components/Badge'
import Modal from '../components/Modal'
import Campo from '../components/Campo'
import Botao from '../components/Botao'

export default function Funcionarios() {
  const { funcionarios, adicionarFuncionario, temPermissao } = useApp()
  const [modalAberto, setModalAberto] = useState(false)

  // Campos do formulário
  const [nome,    setNome]    = useState('')
  const [tel,     setTel]     = useState('')
  const [end,     setEnd]     = useState('')
  const [usuario, setUsuario] = useState('')
  const [senha,   setSenha]   = useState('')
  const [nivel,   setNivel]   = useState('OPERADOR')
  const [erro,    setErro]    = useState('')

  function salvar() {
    if (!nome || !usuario || !senha) {
      setErro('Nome, usuário e senha são obrigatórios.')
      return
    }
    if (funcionarios.some((f) => f.usuario === usuario)) {
      setErro('Já existe um funcionário com este login.')
      return
    }

    adicionarFuncionario({
      id: `F${Date.now()}`,
      nome, telefone: tel, endereco: end,
      usuario, senhaHash: senha, // em produção usaria hash SHA-256
      nivelPermissao: nivel,
    })

    // Limpa o formulário
    setNome(''); setTel(''); setEnd(''); setUsuario(''); setSenha(''); setErro('')
    setModalAberto(false)
  }

  // Gera as iniciais do nome para o avatar
  function iniciais(nome) {
    return nome.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
  }

  // Cores de avatar por nível
  const coresAvatar = {
    ADMINISTRADOR: { bg: '#dbeafe', cor: '#1d4ed8' },
    ENGENHEIRO:    { bg: '#dcfce7', cor: '#166534' },
    OPERADOR:      { bg: '#f3f4f6', cor: '#374151' },
  }

  return (
    <div style={{ padding: '28px' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '800' }}>Funcionários</h1>
          <p style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>
            {funcionarios.length} funcionário(s) cadastrado(s)
          </p>
        </div>
        {/* Só ADMINISTRADOR vê o botão de cadastro */}
        {temPermissao('ADMINISTRADOR') && (
          <Botao onClick={() => setModalAberto(true)}>+ Novo funcionário</Botao>
        )}
      </div>

      {/* Cards de funcionários */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {funcionarios.map((f) => {
          const cor = coresAvatar[f.nivelPermissao] || coresAvatar.OPERADOR
          return (
            <div
              key={f.id}
              style={{
                background: '#fff',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                display: 'flex',
                gap: '14px',
                alignItems: 'flex-start',
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: '44px', height: '44px', borderRadius: '50%',
                  background: cor.bg, color: cor.cor,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '14px', fontWeight: '800', flexShrink: 0,
                }}
              >
                {iniciais(f.nome)}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '2px' }}>{f.nome}</div>
                <div style={{ marginBottom: '8px' }}><Badge valor={f.nivelPermissao} /></div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  <div>👤 {f.usuario}</div>
                  {f.telefone && <div>📞 {f.telefone}</div>}
                  {f.endereco  && <div style={{ marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>📍 {f.endereco}</div>}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal de cadastro */}
      <Modal aberto={modalAberto} onFechar={() => setModalAberto(false)} titulo="Novo Funcionário">
        <Campo label="Nome completo" valor={nome}    onChange={setNome}    placeholder="Maria Silva" />
        <Campo label="Telefone"      valor={tel}     onChange={setTel}     placeholder="(11) 99999-0000" />
        <Campo label="Endereço"      valor={end}     onChange={setEnd}     placeholder="Rua das Aeronaves, 42" />
        <Campo label="Login (usuário)" valor={usuario} onChange={setUsuario} placeholder="m.silva" />
        <Campo label="Senha"         valor={senha}   onChange={setSenha}   tipo="password" placeholder="••••••••" />
        <Campo label="Nível de permissão" valor={nivel} onChange={setNivel}
          opcoes={['ADMINISTRADOR', 'ENGENHEIRO', 'OPERADOR']} />

        {erro && <p style={{ color: '#dc2626', fontSize: '13px', marginBottom: '12px' }}>{erro}</p>}

        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <Botao variante="secundario" onClick={() => setModalAberto(false)}>Cancelar</Botao>
          <Botao onClick={salvar}>Cadastrar</Botao>
        </div>
      </Modal>
    </div>
  )
}