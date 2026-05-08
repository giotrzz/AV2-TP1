/// ─────────────────────────────────────────────
//  Sidebar.jsx — Versão Industrial Gray
// ─────────────────────────────────────────────

import { useApp } from '../context/AppContext'

const ITENS_MENU = [
  { id: 'aeronaves',     icone: '✈',  label: 'Aeronaves'    },
  { id: 'etapas',        icone: '◫',  label: 'Etapas'       },
  { id: 'pecas',         icone: '⚙',  label: 'Peças'        },
  { id: 'testes',        icone: '✓',  label: 'Testes'       },
  { id: 'funcionarios',  icone: '👤', label: 'Funcionários'  },
  { id: 'relatorio',     icone: '📄', label: 'Relatórios'   },
]

export default function Sidebar({ paginaAtual, onNavegar }) {
  const { usuarioLogado, logout } = useApp()

  return (
    <aside
      style={{
        width: '210px',
        minHeight: '100vh',
        backgroundColor: '#1a1a1a', // Cinza quase preto
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        borderRight: '1px solid #333'
      }}
    >
      {/* Logo */}
      <div style={{ padding: '24px 16px', borderBottom: '1px solid #333' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '24px', color: '#e0e0e0' }}>✈</span>
          <span style={{ color: '#ffffff', fontSize: '15px', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase' }}>
            AeroCode
          </span>
        </div>
      </div>

      {/* Itens de navegação */}
      <nav style={{ padding: '16px 0', flex: 1 }}>
        {ITENS_MENU.map((item) => {
          const ativo = paginaAtual === item.id

          return (
            <button
              key={item.id}
              onClick={() => onNavegar(item.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 20px',
                background: ativo ? '#333333' : 'none', // Cinza médio para item ativo
                border: 'none',
                borderLeft: ativo ? '4px solid #9e9e9e' : '4px solid transparent', // Indicador cinza claro
                color: ativo ? '#ffffff' : '#888888', // Branco para ativo, cinza fosco para inativo
                fontSize: '13px',
                fontWeight: ativo ? '600' : '500',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => !ativo && (e.target.style.backgroundColor = '#252525')}
              onMouseLeave={(e) => !ativo && (e.target.style.backgroundColor = 'transparent')}
            >
              <span style={{ fontSize: '16px', width: '20px', textAlign: 'center' }}>{item.icone}</span>
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* Rodapé: usuário logado */}
      <div style={{ padding: '20px 16px', borderTop: '1px solid #333', backgroundColor: '#151515' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px', // Avatar quadradinho fica mais industrial
              backgroundColor: '#444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '13px',
              fontWeight: '700',
              color: '#fff',
              flexShrink: 0,
            }}
          >
            {usuarioLogado?.nome
              .split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('')}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ color: '#e0e0e0', fontSize: '12px', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {usuarioLogado?.nome}
            </div>
            <div style={{ color: '#666', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {usuarioLogado?.nivelPermissao}
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          style={{
            width: '100%',
            padding: '8px',
            background: 'transparent',
            border: '1px solid #444',
            borderRadius: '4px',
            color: '#888',
            fontSize: '11px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => { e.target.style.borderColor = '#666'; e.target.style.color = '#eee'; }}
          onMouseLeave={(e) => { e.target.style.borderColor = '#444'; e.target.style.color = '#888'; }}
        >
          LOGOUT
        </button>
      </div>
    </aside>
  )
}