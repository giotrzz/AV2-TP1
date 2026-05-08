import { useState } from 'react'
import { AppProvider, useApp } from './context/AppContext'
import Sidebar from './components/Sidebar'

import Login         from './pages/Login'
import Aeronaves     from './pages/Aeronaves'
import Etapas        from './pages/Etapas'
import Pecas         from './pages/Pecas'
import Testes        from './pages/Testes'
import Funcionarios  from './pages/Funcionarios'
import Relatorio     from './pages/Relatorio'

function AppLogado() {
  const [paginaAtual, setPaginaAtual] = useState('aeronaves')

  const paginas = {
    aeronaves:    <Aeronaves />,
    etapas:       <Etapas />,
    pecas:        <Pecas />,
    testes:       <Testes />,
    funcionarios: <Funcionarios />,
    relatorio:    <Relatorio />,
  }

  return (
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#1e1e1e' }}>
        {/* Sidebar - Ideal que ela tenha um cinza bem escuro */}
        <Sidebar paginaAtual={paginaAtual} onNavegar={setPaginaAtual} />
        
        <main style={{ 
          flex: 1, 
          overflow: 'auto', 
          backgroundColor: '#f5f5f5', // Cinza claro para o fundo
          padding: '20px' 
        }}>
          <div style={{ 
            backgroundColor: '#ffffff', 
            borderRadius: '8px', 
            padding: '20px', 
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            minHeight: 'calc(100vh - 40px)' 
          }}>
            {paginas[paginaAtual]}
          </div>
        </main>
      </div>
    )
}

function AppConteudo() {
  const { usuarioLogado } = useApp()
  if (!usuarioLogado) return <Login />
  return <AppLogado />
}

export default function App() {
  return (
    <AppProvider>
      <AppConteudo />
    </AppProvider>
  )
}