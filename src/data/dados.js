

export const funcionariosIniciais = [
  {
    id: 'F0001',
    nome: 'Administrador',
    telefone: '(12) 99999-0000',
    endereco: 'Rua 99, São José dos Campos',
    usuario: 'admin',
    // senha: admin123
    senhaHash: 'admin123',
    nivelPermissao: 'ADMINISTRADOR',
  },
  {
    id: 'F0002',
    nome: 'Gerson',
    telefone: '(11) 9384-3452',
    endereco: 'Rua tbm n sei, 42 - SP',
    usuario: 'g.penha',
    senhaHash: 'eng123',
    nivelPermissao: 'ENGENHEIRO',
  },
  {
    id: 'F0003',
    nome: 'Gioavna',
    telefone: '(xx) 35465-5657',
    endereco: 'Av. sei la, 100 - sp',
    usuario: 'g.tarozo',
    senhaHash: 'op123',
    nivelPermissao: 'OPERADOR',
  },
]

export const aeronavesIniciais = [
  {
    id: 'AC-041',
    codigo: 'AC-041',
    modelo: 'Boeing 737 MAX',
    tipo: 'COMERCIAL',
    capacidade: 189,
    alcance: 6110,
    pecas: [
      { id: 'p1', nome: 'Motor Turbofan CFM56', tipo: 'IMPORTADA', fornecedor: 'CFM International', status: 'PRONTA' },
      { id: 'p2', nome: 'Trem de Pouso Principal', tipo: 'NACIONAL', fornecedor: 'AeroPeças SA', status: 'PRONTA' },
      { id: 'p3', nome: 'Avionics Kit FMS', tipo: 'IMPORTADA', fornecedor: 'Honeywell', status: 'EM_TRANSPORTE' },
    ],
    etapas: [
      {
        id: 'e1', nome: 'Montagem da Fuselagem', prazo: '2025-03-31',
        status: 'CONCLUIDA', funcionariosIds: ['F0002', 'F0003'],
      },
      {
        id: 'e2', nome: 'Instalação dos Motores', prazo: '2025-05-15',
        status: 'ANDAMENTO', funcionariosIds: ['F0002'],
      },
      {
        id: 'e3', nome: 'Testes Elétricos', prazo: '2025-06-30',
        status: 'PENDENTE', funcionariosIds: [],
      },
    ],
    testes: [
      { id: 't1', tipo: 'ELETRICO', resultado: 'APROVADO', data: '10/04/2025' },
      { id: 't2', tipo: 'HIDRAULICO', resultado: 'APROVADO', data: '12/04/2025' },
    ],
  },
  {
    id: 'AC-039',
    codigo: 'AC-039',
    modelo: 'Embraer E195-E2',
    tipo: 'COMERCIAL',
    capacidade: 146,
    alcance: 4200,
    pecas: [
      { id: 'p4', nome: 'Motor PW1900G', tipo: 'IMPORTADA', fornecedor: 'Pratt & Whitney', status: 'PRONTA' },
    ],
    etapas: [
      {
        id: 'e4', nome: 'Pintura Externa', prazo: '2025-06-20',
        status: 'PENDENTE', funcionariosIds: [],
      },
    ],
    testes: [
      { id: 't3', tipo: 'AERODINAMICO', resultado: 'REPROVADO', data: '05/04/2025' },
    ],
  },
  {
    id: 'AC-038',
    codigo: 'AC-038',
    modelo: 'F-39 Gripen NG',
    tipo: 'MILITAR',
    capacidade: 1,
    alcance: 3200,
    pecas: [],
    etapas: [],
    testes: [
      { id: 't4', tipo: 'HIDRAULICO', resultado: 'APROVADO', data: '08/04/2025' },
    ],
  },
]