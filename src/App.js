import { useState, useEffect } from 'react';


function Materias({ materias = [], loading }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Matérias</h2>
          <p className="text-gray-600">Gerenciamento de matérias do cursinho</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center">
          <PlusIcon />
          Nova Matéria
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando matérias...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {materias && materias.length > 0 ? (
            materias.map((materia) => (
              <div key={materia.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="h-2" style={{ backgroundColor: materia.cor }}></div>
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium text-gray-800">{materia.nome}</h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${materia.ativa ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {materia.ativa ? 'Ativa' : 'Inativa'}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">{materia.descricao || 'Sem descrição'}</p>
                  
                  <div className="mt-4 flex justify-end space-x-2">
                    <button className="text-yellow-600 hover:text-yellow-800">
                      <EditIcon />
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full bg-white rounded-lg shadow-sm p-6 text-center">
              <p className="text-gray-500">Nenhuma matéria encontrada</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CalendarioAulas({ aulas }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  // Obter primeiro e último dia do mês atual
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const firstDayOfWeek = firstDayOfMonth.getDay();

  // Gerar dias do calendário
  const daysInMonth = lastDayOfMonth.getDate();
  const days = [];

  // Dias vazios do início
  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push(null);
  }

  // Dias do mês
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  // Função para obter aulas de um dia específico
  const getAulasForDay = (day) => {
    if (!day) return [];
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return aulas.filter(aula => {
      if (!aula.data_hora_inicio) return false;
      const aulaDate = new Date(aula.data_hora_inicio).toISOString().split('T')[0];
      return aulaDate === dateStr;
    });
  };

  // Navegar entre meses
  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <div className="p-6">
      {/* Header do calendário */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={previousMonth}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextMonth}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Grid do calendário */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {/* Cabeçalho dos dias da semana */}
        {weekDays.map(day => (
          <div key={day} className="p-3 text-center text-sm font-medium text-gray-500 bg-gray-50">
            {day}
          </div>
        ))}

        {/* Células dos dias */}
        {days.map((day, index) => {
          const aulasDay = getAulasForDay(day);
          const isToday = day && 
            currentDate.getFullYear() === new Date().getFullYear() &&
            currentDate.getMonth() === new Date().getMonth() &&
            day === new Date().getDate();

          return (
            <div
              key={index}
              className={`min-h-[120px] p-2 border border-gray-200 ${
                day ? 'bg-white hover:bg-gray-50 cursor-pointer' : 'bg-gray-50'
              } ${isToday ? 'bg-blue-50 border-blue-200' : ''}`}
              onClick={() => day && setSelectedDate(day)}
            >
              {day && (
                <>
                  <div className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-600' : 'text-gray-800'}`}>
                    {day}
                  </div>
                  <div className="space-y-1">
                    {aulasDay.slice(0, 2).map((aula, aulaIndex) => (
                      <div
                        key={aulaIndex}
                        className="text-xs p-1 rounded truncate"
                        style={{ 
                          backgroundColor: `${aula.materia_cor || '#3B82F6'}20`,
                          color: aula.materia_cor || '#3B82F6'
                        }}
                        title={`${aula.titulo} - ${aula.materia_nome}`}
                      >
                        {new Date(aula.data_hora_inicio).toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })} {aula.titulo}
                      </div>
                    ))}
                    {aulasDay.length > 2 && (
                      <div className="text-xs text-gray-500 text-center">
                        +{aulasDay.length - 2} mais
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal de detalhes do dia selecionado */}
      {selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold">
                Aulas do dia {selectedDate} de {monthNames[currentDate.getMonth()]}
              </h4>
              <button
                onClick={() => setSelectedDate(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-3">
              {getAulasForDay(selectedDate).length > 0 ? (
                getAulasForDay(selectedDate).map((aula, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-medium text-gray-800">{aula.titulo}</h5>
                      <span
                        className="px-2 py-1 text-xs rounded-full"
                        style={{
                          backgroundColor: `${aula.materia_cor || '#3B82F6'}20`,
                          color: aula.materia_cor || '#3B82F6'
                        }}
                      >
                        {aula.materia_nome}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>
                        <strong>Horário:</strong>{' '}
                        {new Date(aula.data_hora_inicio).toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })} - {' '}
                        {new Date(aula.data_hora_fim).toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                      {aula.professor_nome && <p><strong>Professor:</strong> {aula.professor_nome}</p>}
                      {aula.turma_nome && <p><strong>Turma:</strong> {aula.turma_nome}</p>}
                      {aula.sala && <p><strong>Sala:</strong> {aula.sala}</p>}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">
                  Nenhuma aula agendada para este dia
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Aulas({ aulas = [], loading }) {
  const [currentView, setCurrentView] = useState('lista'); // 'lista' ou 'calendario'
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Aulas</h2>
          <p className="text-gray-600">Calendário e gerenciamento de aulas</p>
        </div>
        <div className="flex space-x-3">
          <div className="inline-flex rounded-md shadow-sm">
            <button
              onClick={() => setCurrentView('lista')}
              className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                currentView === 'lista'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border border-gray-300`}
            >
              Lista
            </button>
            <button
              onClick={() => setCurrentView('calendario')}
              className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                currentView === 'calendario'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border border-gray-300 border-l-0`}
            >
              Calendário
            </button>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center">
            <PlusIcon />
            Nova Aula
          </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando aulas...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm">
          {currentView === 'lista' ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aula
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Matéria
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Professor
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Turma
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data e Hora
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {aulas && aulas.length > 0 ? (
                    aulas.map((aula) => (
                      <tr key={aula.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{aula.titulo}</div>
                          <div className="text-sm text-gray-500">Sala: {aula.sala || '-'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span 
                            className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full" 
                            style={{ 
                              backgroundColor: `${aula.materia_cor}20`, 
                              color: aula.materia_cor || '#4A5568'
                            }}
                          >
                            {aula.materia_nome || 'Sem matéria'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {aula.professor_nome || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {aula.turma_nome || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {aula.data_hora_inicio ? new Date(aula.data_hora_inicio).toLocaleDateString('pt-BR') : '-'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {aula.data_hora_inicio ? new Date(aula.data_hora_inicio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : ''} - 
                            {aula.data_hora_fim ? new Date(aula.data_hora_fim).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : ''}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <EyeIcon />
                            </button>
                            <button className="text-yellow-600 hover:text-yellow-900">
                              <EditIcon />
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              <TrashIcon />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                        Nenhuma aula encontrada
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <CalendarioAulas aulas={aulas} />
          )}
        </div>
      )}
    </div>
  );
}

function Frequencias() {
  const [frequencias, setFrequencias] = useState([]);
  const [aulas, setAulas] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAula, setSelectedAula] = useState('');
  const [selectedAluno, setSelectedAluno] = useState('');
  const [presente, setPresente] = useState(true);
  const [observacoes, setObservacoes] = useState('');
 
  const [frequenciaFilter, setFrequenciaFilter] = useState('');
  const [currentView, setCurrentView] = useState('lista'); // 'lista' ou 'registrar'

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Carregar frequências
        const frequenciasResponse = await fetch(`${API_BASE_URL}/api/frequencias/`);
        if (!frequenciasResponse.ok) throw new Error('Erro ao carregar frequências');
        const frequenciasData = await frequenciasResponse.json();
        setFrequencias(frequenciasData.results || []);

        // Carregar aulas para o formulário
        const aulasResponse = await fetch(`${API_BASE_URL}/api/aulas/`);
        if (!aulasResponse.ok) throw new Error('Erro ao carregar aulas');
        const aulasData = await aulasResponse.json();
        setAulas(aulasData.results || []);

        // Carregar alunos para o formulário
        const alunosResponse = await fetch(`${API_BASE_URL}/api/alunos/`);
        if (!alunosResponse.ok) throw new Error('Erro ao carregar alunos');
        const alunosData = await alunosResponse.json();
        setAlunos(alunosData.results || []);

        setLoading(false);
      } catch (error) {
        console.error('Erro:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAula || !selectedAluno) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/frequencias/registrar-frequencia/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          aula: parseInt(selectedAula),
          aluno: parseInt(selectedAluno),
          presente,
          observacoes,
        }),
      });

      if (!response.ok) throw new Error('Erro ao registrar frequência');

      // Recarregar frequências após o registro
      const frequenciasResponse = await fetch(`${API_BASE_URL}/api/frequencias/`);
      if (!frequenciasResponse.ok) throw new Error('Erro ao recarregar frequências');
      const frequenciasData = await frequenciasResponse.json();
      setFrequencias(frequenciasData.results || []);

      // Limpar formulário
      setSelectedAula('');
      setSelectedAluno('');
      setPresente(true);
      setObservacoes('');
      setCurrentView('lista');
    } catch (error) {
      console.error('Erro:', error);
      alert('Ocorreu um erro ao registrar a frequência.');
    }
  };

  // Filtrar frequências
  const filteredFrequencias = frequencias.filter(freq => {
    if (frequenciaFilter) {
      return freq.aluno_nome.toLowerCase().includes(frequenciaFilter.toLowerCase()) ||
             freq.aula_titulo.toLowerCase().includes(frequenciaFilter.toLowerCase()) ||
             freq.materia_nome.toLowerCase().includes(frequenciaFilter.toLowerCase());
    }
    return true;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Frequências</h2>
          <p className="text-gray-600">Controle de frequência dos alunos</p>
        </div>
        <div className="flex space-x-3">
          <div className="inline-flex rounded-md shadow-sm">
            <button
              onClick={() => setCurrentView('lista')}
              className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                currentView === 'lista'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border border-gray-300`}
            >
              Lista
            </button>
            <button
              onClick={() => setCurrentView('registrar')}
              className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                currentView === 'registrar'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border border-gray-300 border-l-0`}
            >
              Registrar
            </button>
          </div>
        </div>
      </div>

      {currentView === 'registrar' && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Registrar Frequência</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Aula</label>
                <select 
                  value={selectedAula} 
                  onChange={(e) => setSelectedAula(e.target.value)}
                  className="w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Selecione uma aula</option>
                  {aulas.map(aula => (
                    <option key={aula.id} value={aula.id}>
                      {aula.titulo} - {aula.materia_nome} ({new Date(aula.data_hora_inicio).toLocaleDateString('pt-BR')})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Aluno</label>
                <select 
                  value={selectedAluno} 
                  onChange={(e) => setSelectedAluno(e.target.value)}
                  className="w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Selecione um aluno</option>
                  {alunos.map(aluno => (
                    <option key={aluno.id} value={aluno.id}>
                      {aluno.nome_completo} - {aluno.numero_matricula}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Presença</label>
                <div className="mt-2">
                  <label className="inline-flex items-center">
                    <input 
                      type="checkbox"
                      checked={presente}
                      onChange={(e) => setPresente(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-gray-700">Presente na aula</span>
                  </label>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                <textarea 
                  value={observacoes} 
                  onChange={(e) => setObservacoes(e.target.value)}
                  rows="3"
                  className="w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Observações sobre a presença do aluno..."
                ></textarea>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button 
                type="button" 
                onClick={() => setCurrentView('lista')}
                className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Registrar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Buscar frequências..."
                value={frequenciaFilter}
                onChange={(e) => setFrequenciaFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-6 text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando frequências...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aluno
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aula
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Matéria
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Presença
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Observações
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredFrequencias.length > 0 ? (
                  filteredFrequencias.map((freq) => (
                    <tr key={freq.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{freq.aluno_nome}</div>
                        <div className="text-xs text-gray-500">{freq.aluno_matricula}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{freq.aula_titulo}</div>
                        <div className="text-xs text-gray-500">{freq.aula_horario}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {freq.materia_nome}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(freq.data_registro).toLocaleDateString('pt-BR')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${freq.presente ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {freq.presente ? 'Presente' : 'Ausente'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 max-w-xs truncate">
                          {freq.observacoes || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <button className="text-yellow-600 hover:text-yellow-900">
                            <EditIcon />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <TrashIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                      Nenhuma frequência encontrada
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}



  
function AlunoDetalhe({ alunoId, alunos = [], onBack }) {
  const aluno = alunos.find(a => a.id === alunoId);

  if (!aluno) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">Aluno não encontrado</p>
        <button 
          onClick={onBack}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
        >
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <button 
          onClick={onBack}
          className="mr-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full p-2"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-1">{aluno.nome_completo}</h2>
          <p className="text-gray-600">Matrícula: {aluno.numero_matricula}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Dados Pessoais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Nome Completo</p>
                <p className="font-medium">{aluno.nome_completo}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">CPF</p>
                <p className="font-medium">{aluno.cpf || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">RG</p>
                <p className="font-medium">{aluno.rg || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Data de Nascimento</p>
                <p className="font-medium">{aluno.data_nascimento ? new Date(aluno.data_nascimento).toLocaleDateString('pt-BR') : '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Sexo</p>
                <p className="font-medium">{aluno.sexo === 'M' ? 'Masculino' : 'Feminino'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Idade</p>
                <p className="font-medium">{aluno.idade || '-'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Contato</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Telefone</p>
                <p className="font-medium">{aluno.telefone || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">E-mail</p>
                <p className="font-medium">{aluno.email || '-'}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500">Endereço</p>
                <p className="font-medium">{aluno.endereco || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Cidade</p>
                <p className="font-medium">{aluno.cidade || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Estado</p>
                <p className="font-medium">{aluno.estado || '-'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Dados Acadêmicos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Escola de Origem</p>
                <p className="font-medium">{aluno.escola_origem || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ano de Conclusão do Ensino Médio</p>
                <p className="font-medium">{aluno.ano_conclusao_ensino_medio || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Turma</p>
                <p className="font-medium">{aluno.turma_nome || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Data de Matrícula</p>
                <p className="font-medium">{aluno.data_matricula ? new Date(aluno.data_matricula).toLocaleDateString('pt-BR') : '-'}</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Status do Aluno</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Situação</p>
                <p className={`font-medium flex items-center ${aluno.ativo ? 'text-green-600' : 'text-red-600'}`}>
                  <span className={`h-2 w-2 rounded-full ${aluno.ativo ? 'bg-green-500' : 'bg-red-500'} mr-2`}></span>
                  {aluno.ativo ? 'Ativo' : 'Inativo'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ações</p>
                <div className="flex space-x-2 mt-2">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm flex items-center">
                    <EditIcon />
                    <span className="ml-2">Editar Dados</span>
                  </button>
                  <button className="bg-red-100 hover:bg-red-200 text-red-700 py-2 px-4 rounded-md text-sm flex items-center">
                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                    {aluno.ativo ? 'Inativar' : 'Ativar'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Ações Rápidas</h3>
            <div className="space-y-3">
              <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-md text-sm flex items-center justify-center">
                <ClipboardIcon />
                <span className="ml-2">Ver Notas</span>
              </button>
              <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-md text-sm flex items-center justify-center">
                <ChartIcon />
                <span className="ml-2">Ver Frequência</span>
              </button>
              <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-md text-sm flex items-center justify-center">
                <CalendarIcon />
                <span className="ml-2">Ver Calendário</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


function Turmas({ turmas = [], loading }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Turmas</h2>
          <p className="text-gray-600">Gerenciamento de turmas do cursinho</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center">
          <PlusIcon />
          Nova Turma
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando turmas...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {turmas.length > 0 ? (
            turmas.map((turma) => (
              <div key={turma.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-800">{turma.nome}</h3>
                      <p className="text-sm text-gray-500 mt-1">{turma.periodo} - {turma.ano}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${turma.ativa ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {turma.ativa ? 'Ativa' : 'Inativa'}
                    </span>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-500">Vagas</span>
                      <span className="text-sm font-medium">{turma.vagas_ocupadas}/{turma.vagas}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${Math.min((turma.vagas_ocupadas / turma.vagas) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Data Início</p>
                        <p className="text-sm font-medium">{turma.data_inicio ? new Date(turma.data_inicio).toLocaleDateString('pt-BR') : '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Data Fim</p>
                        <p className="text-sm font-medium">{turma.data_fim ? new Date(turma.data_fim).toLocaleDateString('pt-BR') : '-'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-6 py-3">
                  <div className="flex justify-between">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Ver Alunos
                    </button>
                    <div className="flex space-x-2">
                      <button className="text-yellow-600 hover:text-yellow-800">
                        <EditIcon />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full bg-white rounded-lg shadow-sm p-6 text-center">
              <p className="text-gray-500">Nenhuma turma encontrada</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


function Notas() {
  const [notas, setNotas] = useState([]);
  const [provas, setProvas] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProva, setSelectedProva] = useState('');
  const [selectedAluno, setSelectedAluno] = useState('');
  const [nota, setNota] = useState('');
  const [presente, setPresente] = useState(true);
  const [observacoes, setObservacoes] = useState('');
  const [formVisible, setFormVisible] = useState(false);
  const [notaFilter, setNotaFilter] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Carregar notas
        const notasResponse = await fetch(`${API_BASE_URL}/api/notas/`);
        if (!notasResponse.ok) throw new Error('Erro ao carregar notas');
        const notasData = await notasResponse.json();
        setNotas(notasData.results || []);

        // Carregar provas para o formulário
        const provasResponse = await fetch(`${API_BASE_URL}/api/provas/`);
        if (!provasResponse.ok) throw new Error('Erro ao carregar provas');
        const provasData = await provasResponse.json();
        setProvas(provasData.results || []);

        // Carregar alunos para o formulário
        const alunosResponse = await fetch(`${API_BASE_URL}/api/alunos/`);
        if (!alunosResponse.ok) throw new Error('Erro ao carregar alunos');
        const alunosData = await alunosResponse.json();
        setAlunos(alunosData.results || []);

        setLoading(false);
      } catch (error) {
        console.error('Erro:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProva || !selectedAluno || nota === '') return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/notas/registrar-nota/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prova: parseInt(selectedProva),
          aluno: parseInt(selectedAluno),
          nota: parseFloat(nota),
          presente,
          observacoes,
        }),
      });

      if (!response.ok) throw new Error('Erro ao registrar nota');

      // Recarregar notas após o registro
      const notasResponse = await fetch(`${API_BASE_URL}/api/notas/`);
      if (!notasResponse.ok) throw new Error('Erro ao recarregar notas');
      const notasData = await notasResponse.json();
      setNotas(notasData.results || []);

      // Limpar formulário
      setSelectedProva('');
      setSelectedAluno('');
      setNota('');
      setPresente(true);
      setObservacoes('');
      setFormVisible(false);
    } catch (error) {
      console.error('Erro:', error);
      alert('Ocorreu um erro ao registrar a nota.');
    }
  };

  // Filtrar notas
  const filteredNotas = notas.filter(nota => {
    if (notaFilter) {
      return nota.aluno_nome.toLowerCase().includes(notaFilter.toLowerCase()) ||
             nota.prova_titulo.toLowerCase().includes(notaFilter.toLowerCase()) ||
             nota.materia_nome.toLowerCase().includes(notaFilter.toLowerCase());
    }
    return true;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Notas</h2>
          <p className="text-gray-600">Gerenciamento de notas e avaliações</p>
        </div>
        <button 
          onClick={() => setFormVisible(!formVisible)}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center"
        >
          {formVisible ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Cancelar
            </>
          ) : (
            <>
              <PlusIcon />
              Registrar Nota
            </>
          )}
        </button>
      </div>

      {formVisible && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Registrar Nova Nota</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prova</label>
                <select 
                  value={selectedProva} 
                  onChange={(e) => setSelectedProva(e.target.value)}
                  className="w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Selecione uma prova</option>
                  {provas.map(prova => (
                    <option key={prova.id} value={prova.id}>
                      {prova.titulo} - {prova.materia_nome}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Aluno</label>
                <select 
                  value={selectedAluno} 
                  onChange={(e) => setSelectedAluno(e.target.value)}
                  className="w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Selecione um aluno</option>
                  {alunos.map(aluno => (
                    <option key={aluno.id} value={aluno.id}>
                      {aluno.nome_completo} - {aluno.numero_matricula}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nota</label>
                <input 
                  type="number" 
                  step="0.1"
                  min="0"
                  max="10"
                  value={nota} 
                  onChange={(e) => setNota(e.target.value)}
                  className="w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Presente</label>
                <div className="mt-2">
                  <label className="inline-flex items-center">
                    <input 
                      type="checkbox"
                      checked={presente}
                      onChange={(e) => setPresente(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-gray-700">Presente na avaliação</span>
                  </label>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                <textarea 
                  value={observacoes} 
                  onChange={(e) => setObservacoes(e.target.value)}
                  rows="3"
                  className="w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button 
                type="button" 
                onClick={() => setFormVisible(false)}
                className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Registrar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Buscar notas..."
                value={notaFilter}
                onChange={(e) => setNotaFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-6 text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando notas...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aluno
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avaliação
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Matéria
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nota
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Presença
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredNotas.length > 0 ? (
                  filteredNotas.map((nota) => (
                    <tr key={nota.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{nota.aluno_nome}</div>
                        <div className="text-xs text-gray-500">{nota.aluno_matricula}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{nota.prova_titulo}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span 
                          className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800"
                        >
                          {nota.materia_nome}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {nota.nota} / {nota.prova_nota_maxima}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${nota.presente ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {nota.presente ? 'Presente' : 'Ausente'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(nota.data_lancamento).toLocaleDateString('pt-BR')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <button className="text-yellow-600 hover:text-yellow-900">
                            <EditIcon />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <TrashIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                      Nenhuma nota encontrada
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}










// API Base URL
const API_BASE_URL = 'http://localhost:8000';

// Funções de API simplificadas
const fetchApiInfo = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Error fetching API info:', error);
    throw error;
  }
};

const fetchAlunos = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/alunos/`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Error fetching alunos:', error);
    throw error;
  }
};

const fetchTurmas = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/turmas/`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Error fetching turmas:', error);
    throw error;
  }
};

const fetchMaterias = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/materias/`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Error fetching materias:', error);
    throw error;
  }
};

const fetchAulas = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/aulas/`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Error fetching aulas:', error);
    throw error;
  }
};

export default function App() {
  const [apiInfo, setApiInfo] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [alunosList, setAlunosList] = useState([]);
  const [turmasList, setTurmasList] = useState([]);
  const [materiasList, setMateriasList] = useState([]);
  const [aulasList, setAulasList] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [selectedAlunoId, setSelectedAlunoId] = useState(null);

  useEffect(() => {
    const loadApiInfo = async () => {
      try {
        const data = await fetchApiInfo();
        setApiInfo(data);
        setLoading(false);
      } catch (err) {
        setError('Falha ao conectar à API. Verifique se o servidor está em execução.');
        setLoading(false);
      }
    };

    loadApiInfo();
  }, []);

  useEffect(() => {
    if (currentPage === 'alunos' && alunosList.length === 0) {
      setDataLoading(true);
      fetchAlunos()
        .then(data => {
          setAlunosList(data.results || []);
          setDataLoading(false);
        })
        .catch(() => {
          setDataLoading(false);
        });
    }

    if (currentPage === 'turmas' && turmasList.length === 0) {
      setDataLoading(true);
      fetchTurmas()
        .then(data => {
          setTurmasList(data.results || []);
          setDataLoading(false);
        })
        .catch(() => {
          setDataLoading(false);
        });
    }

    if (currentPage === 'materias' && materiasList.length === 0) {
      setDataLoading(true);
      fetchMaterias()
        .then(data => {
          setMateriasList(data.results || []);
          setDataLoading(false);
        })
        .catch(() => {
          setDataLoading(false);
        });
    }

    if (currentPage === 'aulas' && aulasList.length === 0) {
      setDataLoading(true);
      fetchAulas()
        .then(data => {
          setAulasList(data.results || []);
          setDataLoading(false);
        })
        .catch(() => {
          setDataLoading(false);
        });
    }
  }, [currentPage, alunosList.length, turmasList.length, materiasList.length, aulasList.length]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg text-gray-700">Carregando aplicação...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-red-500 text-5xl mb-4 flex justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-16 h-16">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">Erro de Conexão</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="bg-gray-100 p-4 rounded-md mb-6">
            <p className="text-sm text-gray-700 font-mono">
              Certifique-se de que o servidor Django está rodando em:<br />
              <span className="font-bold">http://localhost:8000</span>
            </p>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition duration-200"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  const handleAlunoDetail = (id) => {
    setSelectedAlunoId(id);
    setCurrentPage('alunoDetalhe');
  };

  const goBack = () => {
    setSelectedAlunoId(null);
    setCurrentPage('alunos');
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard apiInfo={apiInfo} />;
      case 'alunos':
        return <Alunos alunos={alunosList} loading={dataLoading} onViewAluno={handleAlunoDetail} />;
      case 'alunoDetalhe':
        return <AlunoDetalhe alunoId={selectedAlunoId} alunos={alunosList} onBack={goBack} />;
      case 'turmas':
        return <Turmas turmas={turmasList} loading={dataLoading} />;
      case 'materias':
        return <Materias materias={materiasList} loading={dataLoading} />;
      case 'aulas':
        return <Aulas aulas={aulasList} loading={dataLoading} />;
      case 'notas':
        return <Notas />;
      case 'frequencias':
        return <Frequencias />;
      default:
        return <Dashboard apiInfo={apiInfo} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div 
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-blue-800 text-white transition-all duration-300 ease-in-out flex flex-col`}
      >
        {/* Logo */}
        <div className="p-4 flex items-center justify-between border-b border-blue-700">
          {sidebarOpen && (
            <div className="flex items-center">
              <span className="text-xl font-bold text-white">Cursinho CFS</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white hover:bg-blue-700 rounded-md p-2 focus:outline-none"
          >
            <MenuIcon />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-2 px-2">
            <li>
              <button
                onClick={() => setCurrentPage('dashboard')}
                className={`flex items-center px-4 py-3 text-white hover:bg-blue-700 rounded-md transition-colors w-full text-left ${currentPage === 'dashboard' ? 'bg-blue-700' : ''}`}
              >
                <HomeIcon />
                {sidebarOpen && <span className="ml-3">Dashboard</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentPage('alunos')}
                className={`flex items-center px-4 py-3 text-white hover:bg-blue-700 rounded-md transition-colors w-full text-left ${currentPage === 'alunos' || currentPage === 'alunoDetalhe' ? 'bg-blue-700' : ''}`}
              >
                <UserIcon />
                {sidebarOpen && <span className="ml-3">Alunos</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentPage('turmas')}
                className={`flex items-center px-4 py-3 text-white hover:bg-blue-700 rounded-md transition-colors w-full text-left ${currentPage === 'turmas' ? 'bg-blue-700' : ''}`}
              >
                <UsersIcon />
                {sidebarOpen && <span className="ml-3">Turmas</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentPage('materias')}
                className={`flex items-center px-4 py-3 text-white hover:bg-blue-700 rounded-md transition-colors w-full text-left ${currentPage === 'materias' ? 'bg-blue-700' : ''}`}
              >
                <BookIcon />
                {sidebarOpen && <span className="ml-3">Matérias</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentPage('aulas')}
                className={`flex items-center px-4 py-3 text-white hover:bg-blue-700 rounded-md transition-colors w-full text-left ${currentPage === 'aulas' ? 'bg-blue-700' : ''}`}
              >
                <CalendarIcon />
                {sidebarOpen && <span className="ml-3">Aulas</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentPage('notas')}
                className={`flex items-center px-4 py-3 text-white hover:bg-blue-700 rounded-md transition-colors w-full text-left ${currentPage === 'notas' ? 'bg-blue-700' : ''}`}
              >
                <ClipboardIcon />
                {sidebarOpen && <span className="ml-3">Notas</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentPage('frequencias')}
                className={`flex items-center px-4 py-3 text-white hover:bg-blue-700 rounded-md transition-colors w-full text-left ${currentPage === 'frequencias' ? 'bg-blue-700' : ''}`}
              >
                <ChartIcon />
                {sidebarOpen && <span className="ml-3">Frequências</span>}
              </button>
            </li>
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-blue-700">
          <button
            className="flex items-center text-white hover:bg-blue-700 rounded-md p-2 transition-colors w-full text-left"
          >
            <LogoutIcon />
            {sidebarOpen && <span className="ml-3">Sair</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-semibold text-gray-800">Cursinho CFS 2026</h1>
            <p className="text-sm text-gray-600">Sistema de Gestão Acadêmica</p>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

// Icon Components
function HomeIcon() {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="20" 
      height="20" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="20" 
      height="20" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="20" 
      height="20" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="20" 
      height="20" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="20" 
      height="20" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}

function ClipboardIcon() {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="20" 
      height="20" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <rect width="14" height="18" x="5" y="3" rx="2" />
      <path d="M9 13h6" />
      <path d="M9 17h6" />
      <path d="M9 9h6" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="20" 
      height="20" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M3 3v18h18" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="20" 
      height="20" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="18" 
      height="18" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="18" 
      height="18" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="18" 
      height="18" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="20" 
      height="20" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className="mr-2"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="20" 
      height="20" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className="mr-2"
    >
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

// Page Components
function Dashboard({ apiInfo }) {
  const [stats, setStats] = useState({
    turmas: 0,
    alunos: 0,
    materias: 0,
    provas: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        // Buscar dados reais da API
        const [alunosResponse, turmasResponse, materiasResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/api/alunos/`),
          fetch(`${API_BASE_URL}/api/turmas/`),
          fetch(`${API_BASE_URL}/api/materias/`)
        ]);

        const alunosData = await alunosResponse.json();
        const turmasData = await turmasResponse.json();
        const materiasData = await materiasResponse.json();

        // Tentar buscar provas se a API existir
        let provasCount = 0;
        try {
          const provasResponse = await fetch(`${API_BASE_URL}/api/provas/`);
          if (provasResponse.ok) {
            const provasData = await provasResponse.json();
            provasCount = provasData.count || provasData.results?.length || 0;
          }
        } catch (error) {
          console.log('API de provas não disponível');
        }
        
        setStats({
          turmas: turmasData.count || turmasData.results?.length || 0,
          alunos: alunosData.count || alunosData.results?.length || 0,
          materias: materiasData.count || materiasData.results?.length || 0,
          provas: provasCount
        });
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Dashboard</h2>
        <p className="text-gray-600">Bem-vindo ao Sistema de Gestão do Cursinho CFS 2026</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <StatCard title="Turmas" value={stats.turmas} color="blue" icon={<UsersIcon />} />
            <StatCard title="Alunos" value={stats.alunos} color="green" icon={<UserIcon />} />
            <StatCard title="Matérias" value={stats.materias} color="purple" icon={<BookIcon />} />
            <StatCard title="Provas" value={stats.provas} color="orange" icon={<ClipboardIcon />} />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Informações da API</h3>
          {apiInfo ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Versão</p>
                <p className="font-medium">{apiInfo.version}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium flex items-center">
                  <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                  {apiInfo.status}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Matérias</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {apiInfo.subjects && apiInfo.subjects.map((subject, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-sm">
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Próximas Aulas</h3>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="h-12 w-12 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mr-4">
                <CalendarIcon />
              </div>
              <div>
                <p className="font-medium">Matemática - Geometria Espacial</p>
                <p className="text-sm text-gray-500">Hoje, 08:00 - 10:00</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="h-12 w-12 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center mr-4">
                <CalendarIcon />
              </div>
              <div>
                <p className="font-medium">Português - Análise Sintática</p>
                <p className="text-sm text-gray-500">Hoje, 10:30 - 12:30</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="h-12 w-12 rounded-lg bg-green-100 text-green-700 flex items-center justify-center mr-4">
                <CalendarIcon />
              </div>
              <div>
                <p className="font-medium">Física - Mecânica</p>
                <p className="text-sm text-gray-500">Amanhã, 08:00 - 10:00</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente para skeleton loading dos cards
function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
      <div className="flex items-center">
        <div className="h-12 w-12 rounded-lg bg-gray-200 mr-4"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color, icon }) {
  const bgColor = {
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    purple: 'bg-purple-100 text-purple-700',
    orange: 'bg-orange-100 text-orange-700',
  }[color];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center">
        <div className={`h-12 w-12 rounded-lg ${bgColor} flex items-center justify-center mr-4`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-semibold">{value}</p>
        </div>
      </div>
    </div>
  );
}
function Alunos({ alunos = [], loading, onViewAluno }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Alunos</h2>
          <p className="text-gray-600">Gerenciamento de alunos do cursinho</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center">
          <PlusIcon />
          Novo Aluno
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Buscar alunos..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50">
              <FilterIcon />
              Filtros
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-6 text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando alunos...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Matrícula
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Turma
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {alunos.length > 0 ? (
                  alunos.map((aluno) => (
                    <tr key={aluno.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mr-3">
                            {aluno.nome_completo ? aluno.nome_completo.charAt(0) : '?'}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{aluno.nome_completo}</div>
                            <div className="text-sm text-gray-500">{aluno.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{aluno.numero_matricula}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{aluno.turma_nome}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${aluno.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {aluno.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => onViewAluno(aluno.id)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <EyeIcon />
                          </button>
                          <button className="text-yellow-600 hover:text-yellow-900">
                            <EditIcon />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <TrashIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                      <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                        Nenhum aluno encontrado
                      </td>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
