import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { 
  Calendar, Clock, CheckCircle, AlertTriangle, 
  Users, Target, GitBranch, List, TrendingUp, 
  ArrowRight, ChevronDown, ChevronUp, Maximize, Minimize
} from 'lucide-react';
import ProgressIcon from '../../Components/ProgressIcon'

// Card com capacidade de expansão e contração
const ExpandableCard = ({ title, content, color = "#6366f1", icon: IconComponent = CheckCircle }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className={`bg-gray-800 rounded-lg border-t-4 transition-all duration-300 shadow-lg hover:shadow-xl ${expanded ? 'row-span-2' : ''}`} style={{ borderColor: color }}>
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            <IconComponent size={20} color={color} className="mr-2" />
            <h3 className="text-white font-bold text-lg">{title}</h3>
          </div>
          <button 
            onClick={() => setExpanded(!expanded)} 
            className="text-gray-400 hover:text-white transition-colors"
          >
            {expanded ? <Minimize size={18} /> : <Maximize size={18} />}
          </button>
        </div>
        <div className={`text-gray-300 text-sm overflow-hidden transition-all duration-300 ${expanded ? 'max-h-96' : 'max-h-24'}`}>
          {content}
        </div>
        {!expanded && content.length > 150 && (
          <div className="text-right mt-2">
            <button 
              onClick={() => setExpanded(true)}
              className="text-xs text-gray-400 hover:text-gray-200 flex items-center justify-end w-full"
            >
              Mostrar mais <ChevronDown size={14} className="ml-1" />
            </button>
          </div>
        )}
        {expanded && (
          <div className="text-right mt-2">
            <button 
              onClick={() => setExpanded(false)}
              className="text-xs text-gray-400 hover:text-gray-200 flex items-center justify-end w-full"
            >
              Mostrar menos <ChevronUp size={14} className="ml-1" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const MainView = ({ project = {} }) => {

  // Conteúdo dos cards
  const cardContents = [
    {
      title: project.title || "Nome do Projeto",
      content: project.description,
      color: "#6366f1",
      icon: Calendar
    },
    {
      title: "Solução para demanda",
      content: "Este card descreve como o projeto resolve uma demanda específica. Aqui são detalhadas as necessidades que o projeto atende e como ele propõe solucioná-las de forma eficiente. O projeto implementa um sistema integrado que centraliza o gerenciamento de recursos, otimiza a alocação de tarefas e fornece métricas em tempo real do progresso das atividades.",
      color: "#f43f5e",
      icon: TrendingUp
    },
    {
      title: "É",
      content: "Este card define o que o projeto é. Aqui são listadas as características, funcionalidades e aspectos positivos que fazem parte do escopo e da identidade do projeto. O sistema é uma plataforma colaborativa que permite acompanhamento de progresso em tempo real, visualização de métricas de desempenho, integração com ferramentas externas, e geração de relatórios personalizados para diferentes níveis gerenciais.",
      color: "#06b6d4",
      icon: CheckCircle
    },
    {
      title: "Não é",
      content: "Este card esclarece o que o projeto não é. Aqui são definidos os limites do projeto, evitando expectativas equivocadas e garantindo um alinhamento claro sobre o que está fora do escopo. O projeto não é um substituto para ferramentas específicas de áreas como contabilidade ou recursos humanos, não é uma solução para gestão financeira completa, e não inclui integrações com sistemas legados sem APIs disponíveis.",
      color: "#14b8a6",
      icon: AlertTriangle
    }
  ];

  return (
    <div className="min-h-screen text-white p-6">
      {/* Cabeçalho do dashboard */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>

            <div className="flex items-center text-gray-400">
              <Clock size={16} className="mr-1" />
              <span>Atualizado: {new Date().toLocaleDateString()}</span>
              <span className="mx-2">•</span>
              <span className='px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800'>
                Ativo
              </span>
            </div>
            <div className="text-left">
              <div className="text-gray-400 text-sm mb-1">Conclusão</div>
              <div className="flex items-center">
                <div className="w-32 h-2 bg-gray-700 rounded-full mr-2">
                  <div 
                    className="h-2 bg-green-500 rounded-full" 
                    style={{ width: 68 }} 
                  />
                </div>
                <span className="text-sm font-medium">68%</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
              <div className="bg-gray-800 px-3 py-2 rounded-lg border border-gray-700">
                <div className="text-xs text-gray-400 mb-1">Prazo</div>
                <div className="text-lg font-bold">48 dias</div>
              </div>
          </div>
        </div>
      </div>

      {/* Indicadores de progresso */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
  <div className="lg:col-span-4 flex flex-wrap justify-center lg:justify-between items-center p-4 bg-gray-800 rounded-lg shadow-lg gap-3">
    <ProgressIcon 
      value={project?.stories?.length || 0} 
      max={20}
      color="#6366f1" 
      label="Stories" 
      icon={List}
    />
    <ProgressIcon 
      value={project?.personas?.length || 0} 
      max={10}
      color="#f43f5e" 
      label="Personas" 
      icon={Users}
    />
    <ProgressIcon 
      value={project?.goalSketches?.length || 0} 
      max={15}
      color="#06b6d4" 
      label="Goals" 
      icon={Target}
    />
    <ProgressIcon 
      value={project?.journeys?.length || 0} 
      max={10}
      color="#14b8a6" 
      label="Journeys" 
      icon={GitBranch}
    />
  </div>
</div>

      {/* Dashboard principal - Layout de grid responsivo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {/* Cards de informação */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {cardContents.map((card, index) => (
            <ExpandableCard 
              key={index} 
              title={card.title}
              content={card.content}
              color={card.color}
              icon={card.icon}
            />
          ))}
        </div>

      </div>
    </div>
  );
};

export default MainView;