import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  BookOpen, 
  FileText, 
  BarChart3, 
  Plus,
  Search,
  ChevronRight,
  GraduationCap,
  Clock,
  Target,
  Trophy,
  User,
  Phone,
  MapPin,
  X,
  Save,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  TrendingUp,
  BookCheck
} from 'lucide-react';

// Configuração da API
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Serviço para fazer requisições à API
class ApiService {
  static async get(endpoint, params = {}) {
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        url.searchParams.append(key, params[key]);
      }
    });
    
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  static async post(endpoint, data) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
}

// Componente de Loading
const Loading = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

// Componente de Notificação
const Notification = ({ message, type, onClose }) => {
  const bgColor = type === 'success' ? 'bg-green-100 border-green-500 text-green-700' :
                  type === 'error' ? 'bg-red-100 border-red-500 text-red-700' :
                  'bg-blue-100 border-blue-500 text-blue-700';

  const Icon = type === 'success' ? CheckCircle : 
               type === 'error' ? XCircle : AlertCircle;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 border-l-4 rounded-lg shadow-lg ${bgColor}`}>
      <div className="flex items-center">
        <Icon className="h-5 w-5 mr-2" />
        <span className="font-medium">{message}</span>
        <button onClick={onClose} className="ml-4 hover:opacity-70">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

// Componente de Card de Estatística
const StatCard = ({ title, value, icon: Icon, color = "blue", trend }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {trend && (
          <p className="text-sm text-green-600 mt-1">
            {trend > 0 ? '+' : ''}{trend}% vs mês anterior
          </p>
        )}
      </div>
      <div className={`p-3 rounded-full bg-${color}-100`}>
        <Icon className={`h-6 w-6 text-${color}-600`} />
      </div>
    </div>
  </div>
);

// Componente Dashboard
const Dashboard = () => {
  const [stats, setStats] = useState({
    totalAlunos: 0,
    totalTurmas: 0,
    totalAulas: 0,
    mediaGeral: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [alunos, turmas, aulas] = await Promise.all([
          ApiService.get('/alunos/'),
          ApiService.get('/turmas/'),
          ApiService.get('/aulas/')
        ]);

        setStats({
          totalAlunos: alunos.count || alunos.length || 0,
          totalTurmas: turmas.count || turmas.length || 0,
          totalAulas: aulas.count || aulas.length || 0,
          mediaGeral: 8.5
        });
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Cursinho CFS 2026 - Preparatório para Aeronáutica
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total de Alunos"
          value={stats.totalAlunos}
          icon={Users}
          color="blue"
          trend={5}
        />
        <StatCard
          title="Turmas Ativas"
          value={stats.totalTurmas}
          icon={GraduationCap}
          color="green"
        />
        <StatCard
          title="Aulas Programadas"
          value={stats.totalAulas}
          icon={Calendar}
          color="purple"
        />
        <StatCard
          title="Média Geral"
          value={stats.mediaGeral.toFixed(1)}
          icon={Trophy}
          color="yellow"
          trend={2}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Próximas Aulas</h3>
          <div className="space-y-3">
            <div className="flex items-center p-3 bg-blue-50 rounded-lg">
              <div className="flex-shrink-0">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Matemática - Turma A</p>
                <p className="text-sm text-gray-500">Hoje, 08:00 - 10:00</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-green-50 rounded-lg">
              <div className="flex-shrink-0">
                <BookOpen className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Português - Turma B</p>
                <p className="text-sm text-gray-500">Hoje, 14:00 - 16:00</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Matérias</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: 'Português', color: 'red', students: 45 },
              { name: 'Matemática', color: 'blue', students: 43 },
              { name: 'Física', color: 'purple', students: 41 },
              { name: 'Inglês', color: 'green', students: 38 }
            ].map((materia) => (
              <div key={materia.name} className={`p-3 bg-${materia.color}-50 rounded-lg`}>
                <p className={`text-sm font-medium text-${materia.color}-800`}>
                  {materia.name}
                </p>
                <p className={`text-xs text-${materia.color}-600`}>
                  {materia.students} alunos
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente de Formulário de Matrícula
const FormularioMatricula = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    nome_completo: '',
    cpf: '',
    rg: '',
    data_nascimento: '',
    sexo: '',
    telefone: '',
    email: '',
    endereco: '',
    cidade: '',
    estado: 'CE',
    cep: '',
    escola_origem: '',
    ano_conclusao_ensino_medio: new Date().getFullYear(),
    turma: '',
    nome_responsavel: '',
    telefone_responsavel: ''
  });
  const [turmas, setTurmas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchTurmas = async () => {
      try {
        const data = await ApiService.get('/turmas/', { ativa: true });
        setTurmas(data.results || data);
      } catch (error) {
        console.error('Erro ao carregar turmas:', error);
      }
    };
    fetchTurmas();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const response = await ApiService.post('/matricula/matricular/', formData);
      onSuccess(response);
      onClose();
    } catch (error) {
      setErrors({ general: 'Erro ao realizar matrícula. Verifique os dados.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Nova Matrícula</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {errors.general}
            </div>
          )}

          {/* Dados Pessoais */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Dados Pessoais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  name="nome_completo"
                  value={formData.nome_completo}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CPF *
                </label>
                <input
                  type="text"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleChange}
                  placeholder="000.000.000-00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  RG *
                </label>
                <input
                  type="text"
                  name="rg"
                  value={formData.rg}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Nascimento *
                </label>
                <input
                  type="date"
                  name="data_nascimento"
                  value={formData.data_nascimento}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sexo *
                </label>
                <select
                  name="sexo"
                  value={formData.sexo}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Selecione</option>
                  <option value="M">Masculino</option>
                  <option value="F">Feminino</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Turma *
                </label>
                <select
                  name="turma"
                  value={formData.turma}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Selecione uma turma</option>
                  {turmas.map((turma) => (
                    <option key={turma.id} value={turma.id}>
                      {turma.nome} - {turma.periodo} ({turma.vagas_disponiveis || 0} vagas)
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Dados de Contato */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Dados de Contato</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone *
                </label>
                <input
                  type="tel"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  placeholder="(85) 99999-9999"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Endereço *
                </label>
                <input
                  type="text"
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cidade *
                </label>
                <input
                  type="text"
                  name="cidade"
                  value={formData.cidade}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CEP *
                </label>
                <input
                  type="text"
                  name="cep"
                  value={formData.cep}
                  onChange={handleChange}
                  placeholder="00000-000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Dados Acadêmicos */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Dados Acadêmicos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Escola de Origem *
                </label>
                <input
                  type="text"
                  name="escola_origem"
                  value={formData.escola_origem}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ano de Conclusão do Ensino Médio *
                </label>
                <input
                  type="number"
                  name="ano_conclusao_ensino_medio"
                  value={formData.ano_conclusao_ensino_medio}
                  onChange={handleChange}
                  min="2020"
                  max="2030"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Dados do Responsável */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Dados do Responsável (se menor de idade)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Responsável
                </label>
                <input
                  type="text"
                  name="nome_responsavel"
                  value={formData.nome_responsavel}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone do Responsável
                </label>
                <input
                  type="tel"
                  name="telefone_responsavel"
                  value={formData.telefone_responsavel}
                  onChange={handleChange}
                  placeholder="(85) 99999-9999"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Processando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Realizar Matrícula
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Componente de Lista de Alunos
const AlunosList = ({ onNovaMatricula }) => {
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTurma, setSelectedTurma] = useState('');
  const [turmas, setTurmas] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [alunosData, turmasData] = await Promise.all([
          ApiService.get('/alunos/', { search: searchTerm, turma: selectedTurma }),
          ApiService.get('/turmas/')
        ]);
        
        setAlunos(alunosData.results || alunosData);
        setTurmas(turmasData.results || turmasData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchTerm, selectedTurma]);

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Alunos</h1>
        <button 
          onClick={onNovaMatricula}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Nova Matrícula
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nome, matrícula ou CPF..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedTurma}
              onChange={(e) => setSelectedTurma(e.target.value)}
            >
              <option value="">Todas as turmas</option>
              {turmas.map((turma) => (
                <option key={turma.id} value={turma.id}>
                  {turma.nome}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aluno
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Matrícula
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Turma
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contato
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {alunos.map((aluno) => (
                <tr key={aluno.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {aluno.nome_completo}
                        </div>
                        <div className="text-sm text-gray-500">
                          {aluno.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {aluno.numero_matricula}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {aluno.turma_nome}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {aluno.telefone}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      aluno.ativo 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {aluno.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      Ver detalhes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Componente de Calendário
const Calendario = () => {
  const [aulas, setAulas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    materia: '',
    turma: '',
    data_inicio: '',
    data_fim: ''
  });
  const [materias, setMaterias] = useState([]);
  const [turmas, setTurmas] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [aulasData, materiasData, turmasData] = await Promise.all([
          ApiService.get('/aulas/calendario/', filtros),
          ApiService.get('/materias/'),
          ApiService.get('/turmas/')
        ]);
        
        setAulas(aulasData.results || aulasData);
        setMaterias(materiasData.results || materiasData);
        setTurmas(turmasData.results || turmasData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filtros]);

  const handleFiltroChange = (key, value) => {
    setFiltros(prev => ({ ...prev, [key]: value }));
  };

  const formatarData = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Calendário de Aulas</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          Nova Aula
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Início
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={filtros.data_inicio}
              onChange={(e) => handleFiltroChange('data_inicio', e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Fim
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={filtros.data_fim}
              onChange={(e) => handleFiltroChange('data_fim', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Matéria
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={filtros.materia}
              onChange={(e) => handleFiltroChange('materia', e.target.value)}
            >
              <option value="">Todas as matérias</option>
              {materias.map((materia) => (
                <option key={materia.id} value={materia.id}>
                  {materia.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Turma
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={filtros.turma}
              onChange={(e) => handleFiltroChange('turma', e.target.value)}
            >
              <option value="">Todas as turmas</option>
              {turmas.map((turma) => (
                <option key={turma.id} value={turma.id}>
                  {turma.nome}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {aulas.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Nenhuma aula encontrada para os filtros selecionados</p>
            </div>
          ) : (
            aulas.map((aula) => (
              <div key={aula.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: aula.materia_cor || '#3B82F6' }}
                    ></div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{aula.titulo}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          {aula.materia_nome}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {aula.turma_nome}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {aula.professor_nome}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      {formatarData(aula.data_hora_inicio)}
                    </div>
                    {aula.sala && (
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        {aula.sala}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// Componente de Notas
const Notas = () => {
  const [notas, setNotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    aluno: '',
    materia: '',
    turma: ''
  });
  const [alunos, setAlunos] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const [showRegistroForm, setShowRegistroForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [notasData, alunosData, materiasData, turmasData] = await Promise.all([
          ApiService.get('/notas/', filtros),
          ApiService.get('/alunos/'),
          ApiService.get('/materias/'),
          ApiService.get('/turmas/')
        ]);
        
        setNotas(notasData.results || notasData);
        setAlunos(alunosData.results || alunosData);
        setMaterias(materiasData.results || materiasData);
        setTurmas(turmasData.results || turmasData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filtros]);

  const handleFiltroChange = (key, value) => {
    setFiltros(prev => ({ ...prev, [key]: value }));
  };

  const getNotaColor = (nota) => {
    if (nota >= 7) return 'text-green-600';
    if (nota >= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Notas e Avaliações</h1>
        <button 
          onClick={() => setShowRegistroForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Registrar Nota
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Aluno
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={filtros.aluno}
              onChange={(e) => handleFiltroChange('aluno', e.target.value)}
            >
              <option value="">Todos os alunos</option>
              {alunos.map((aluno) => (
                <option key={aluno.id} value={aluno.id}>
                  {aluno.nome_completo} - {aluno.numero_matricula}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Matéria
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={filtros.materia}
              onChange={(e) => handleFiltroChange('materia', e.target.value)}
            >
              <option value="">Todas as matérias</option>
              {materias.map((materia) => (
                <option key={materia.id} value={materia.id}>
                  {materia.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Turma
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={filtros.turma}
              onChange={(e) => handleFiltroChange('turma', e.target.value)}
            >
              <option value="">Todas as turmas</option>
              {turmas.map((turma) => (
                <option key={turma.id} value={turma.id}>
                  {turma.nome}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tabela de Notas */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aluno
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prova
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Matéria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nota
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {notas.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center">
                    <BookCheck className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhuma nota encontrada</p>
                  </td>
                </tr>
              ) : (
                notas.map((nota) => (
                  <tr key={nota.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {nota.aluno_nome}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {nota.prova_titulo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {nota.materia_nome}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`text-sm font-semibold ${getNotaColor(nota.nota)}`}>
                          {nota.nota}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">
                          /{nota.prova_nota_maxima}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        nota.presente 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {nota.presente ? 'Presente' : 'Ausente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(nota.data_lancamento).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 flex items-center gap-1">
                        <Edit className="h-4 w-4" />
                        Editar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Componente de Relatórios
const Relatorios = () => {
  const [selectedAluno, setSelectedAluno] = useState('');
  const [selectedTurma, setSelectedTurma] = useState('');
  const [relatorio, setRelatorio] = useState(null);
  const [estatisticas, setEstatisticas] = useState(null);
  const [alunos, setAlunos] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [alunosData, turmasData] = await Promise.all([
          ApiService.get('/alunos/'),
          ApiService.get('/turmas/')
        ]);
        setAlunos(alunosData.results || alunosData);
        setTurmas(turmasData.results || turmasData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };
    fetchData();
  }, []);

  const buscarRelatorioAluno = async () => {
    if (!selectedAluno) return;
    
    setLoading(true);
    try {
      const data = await ApiService.get(`/alunos/${selectedAluno}/relatorio-desempenho/`);
      setRelatorio(data);
    } catch (error) {
      console.error('Erro ao buscar relatório:', error);
    } finally {
      setLoading(false);
    }
  };

  const buscarEstatisticasTurma = async () => {
    if (!selectedTurma) return;
    
    setLoading(true);
    try {
      const data = await ApiService.get(`/turmas/${selectedTurma}/estatisticas/`);
      setEstatisticas(data);
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Relatórios e Estatísticas</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Relatório Individual */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Target className="h-5 w-5" />
            Relatório Individual
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Selecionar Aluno
              </label>
              <select
                value={selectedAluno}
                onChange={(e) => setSelectedAluno(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Escolha um aluno</option>
                {alunos.map((aluno) => (
                  <option key={aluno.id} value={aluno.id}>
                    {aluno.nome_completo} - {aluno.numero_matricula}
                  </option>
                ))}
              </select>
            </div>
            
            <button
              onClick={buscarRelatorioAluno}
              disabled={!selectedAluno || loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Carregando...
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  Gerar Relatório
                </>
              )}
            </button>
          </div>

          {relatorio && (
            <div className="mt-6 space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">
                  {relatorio.aluno_nome}
                </h3>
                <p className="text-sm text-gray-600">
                  Matrícula: {relatorio.numero_matricula} | Turma: {relatorio.turma_nome}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-600">Média Geral</p>
                  <p className="text-xl font-bold text-blue-800">{relatorio.media_geral}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm text-green-600">Frequência</p>
                  <p className="text-xl font-bold text-green-800">{relatorio.percentual_frequencia}%</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Desempenho por Matéria</h4>
                <div className="space-y-2">
                  {relatorio.desempenho_materias?.map((materia) => (
                    <div key={materia.materia} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-sm font-medium">{materia.materia}</span>
                      <span className={`text-sm font-bold ${getNotaColor(materia.media)}`}>
                        {materia.media}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Estatísticas da Turma */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Estatísticas da Turma
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Selecionar Turma
              </label>
              <select
                value={selectedTurma}
                onChange={(e) => setSelectedTurma(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Escolha uma turma</option>
                {turmas.map((turma) => (
                  <option key={turma.id} value={turma.id}>
                    {turma.nome} - {turma.periodo}
                  </option>
                ))}
              </select>
            </div>
            
            <button
              onClick={buscarEstatisticasTurma}
              disabled={!selectedTurma || loading}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Carregando...
                </>
              ) : (
                <>
                  <BarChart3 className="h-4 w-4" />
                  Gerar Estatísticas
                </>
              )}
            </button>
          </div>

          {estatisticas && (
            <div className="mt-6 space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">
                  {estatisticas.turma_nome}
                </h3>
                <p className="text-sm text-gray-600">
                  {estatisticas.alunos_ativos} alunos ativos de {estatisticas.total_alunos}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm text-green-600">Média da Turma</p>
                  <p className="text-xl font-bold text-green-800">{estatisticas.media_geral_turma}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-600">Frequência Média</p>
                  <p className="text-xl font-bold text-blue-800">{estatisticas.media_frequencia}%</p>
                </div>
              </div>

              {estatisticas.melhor_aluno && (
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <p className="text-sm text-yellow-600 flex items-center gap-1">
                    <Star className="h-4 w-4" />
                    Melhor Aluno
                  </p>
                  <p className="font-semibold text-yellow-800">
                    {estatisticas.melhor_aluno.aluno__nome_completo} - Média: {estatisticas.melhor_aluno.media}
                  </p>
                </div>
              )}

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Desempenho por Matéria</h4>
                <div className="space-y-2">
                  {estatisticas.desempenho_por_materia?.map((materia) => (
                    <div key={materia.materia} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-sm font-medium">{materia.materia}</span>
                      <span className={`text-sm font-bold ${getNotaColor(materia.media)}`}>
                        {materia.media} ({materia.total_notas} notas)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  function getNotaColor(nota) {
    if (nota >= 7) return 'text-green-600';
    if (nota >= 5) return 'text-yellow-600';
    return 'text-red-600';
  }
};

// Componente principal da aplicação
const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showMatriculaForm, setShowMatriculaForm] = useState(false);
  const [notification, setNotification] = useState(null);

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'alunos', name: 'Alunos', icon: Users },
    { id: 'calendario', name: 'Calendário', icon: Calendar },
    { id: 'notas', name: 'Notas', icon: FileText },
    { id: 'relatorios', name: 'Relatórios', icon: Target },
  ];

  const handleMatriculaSuccess = (response) => {
    setNotification({
      message: 'Matrícula realizada com sucesso!',
      type: 'success'
    });
  };

  const closeNotification = () => {
    setNotification(null);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'alunos':
        return (
          <div>
            <AlunosList onNovaMatricula={() => setShowMatriculaForm(true)} />
            {showMatriculaForm && (
              <FormularioMatricula
                onClose={() => setShowMatriculaForm(false)}
                onSuccess={handleMatriculaSuccess}
              />
            )}
          </div>
        );
      case 'calendario':
        return <Calendario />;
      case 'notas':
        return <Notas />;
      case 'relatorios':
        return <Relatorios />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notificação */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
      )}

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <GraduationCap className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-900">Cursinho CFS 2026</h1>
                <p className="text-sm text-gray-500">Preparatório Aeronáutica</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Sistema de Gerenciamento
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <tab.icon className="h-5 w-5 mr-3" />
                    {tab.name}
                    {activeTab === tab.id && (
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            </nav>
          </div>

          {/* Main content */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;