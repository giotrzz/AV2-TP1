
import { useState } from 'react'
import { useApp } from '../context/AppContext'

export default function Login() {
  // Campos controlados pelo estado local
  const [usuario, setUsuario] = useState('')
  const [senha, setSenha]     = useState('')
  const [erro, setErro]       = useState('')

  const { login } = useApp()

  function handleSubmit(e) {
    e.preventDefault() // evita recarregar a página
    setErro('')

    const sucesso = login(usuario, senha)
    if (!sucesso) {
      setErro('Usuário ou senha incorretos.')
    }

  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '40px',
          width: '100%',
          maxWidth: '380px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
        }}
      >
        {/* Cabeçalho */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '36px', marginBottom: '8px' }}>✈</div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a' }}>
            AeroCode
          </h1>
          <p style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>
            Sistema de Produção de Aeronaves
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
              Usuário
            </label>
            <input
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="seu.usuario"
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1.5px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                fontFamily: 'inherit',
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
              Senha
            </label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1.5px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                fontFamily: 'inherit',
              }}
            />
          </div>

          {/* Mensagem de erro */}
          {erro && (
            <div
              style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#dc2626',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '13px',
                marginBottom: '16px',
              }}
            >
              {erro}
            </div>
          )}

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              background: '#1d4ed8',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Entrar →
          </button>
        </form>

        {/* Dica de acesso */}
        <div
          style={{
            marginTop: '24px',
            padding: '12px',
            background: '#f8fafc',
            borderRadius: '8px',
            fontSize: '12px',
            color: '#64748b',
          }}
        >
          <strong style={{ display: 'block', marginBottom: '4px' }}>Contas de teste:</strong>
          admin / admin123 (Administrador)<br />
          m.silva / eng123 (Engenheiro)<br />
          j.pereira / op123 (Operador)
        </div>
      </div>
    </div>
  )
}