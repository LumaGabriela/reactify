import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import {
  AlertCircle,
  Users,
  Slash,
  Check,
  Clock,
  CheckCircle,
  Target,
  GitBranch, List,
  ChevronDown,
  ChevronUp,
  PenLine as EditIcon, X
} from 'lucide-react';
import TextArea from '@/Components/TextArea';
import ProgressIcon from '../../Components/ProgressIcon'
import { router } from '@inertiajs/react';

// Card com capacidade de expansão e contração
const ExpandableCard = ({
  title,
  content,
  color = "#6366f1",
  icon: IconComponent = CheckCircle,
  col = 1,
  onContentUpdate
}) => {
  const [expanded, setExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editableContent, setEditableContent] = useState(content);
  const [isHovered, setIsHovered] = useState(false);

  const handleSave = () => {
    onContentUpdate(editableContent);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditableContent(content);
    setIsEditing(false);
  };

  return (
    <div
      className={` bg-gray-800 rounded-lg border-t-4 transition-all duration-300 shadow-lg hover:shadow-xl cursor-default ${col === 2 ? 'col-span-2' : ''} ${expanded ? 'row-span-2' : ''}`}
      style={{ borderColor: color }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-4 justify-between !h-full">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            <IconComponent size={20} color={color} className="mr-2" />
            <h3 className="text-white font-bold text-lg m-0">{title}</h3>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-gray-400 hover:text-white transition-colors"
              title="Editar conteúdo"
            >
              <EditIcon size={20} />
            </button>
          )}{
            (isEditing && (
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-white transition-colors"
                title="Cancelar edição"
              >
                <X size={20} />
              </button>
            ))
          }
        </div>

        <div className={` text-gray-300 text-sm overflow-hidden transition-all duration-300 ${expanded ? 'max-h-96' : 'max-h-24'}`}>
          {isEditing ? (
            <TextArea
              value={editableContent}
              onChange={(e) => setEditableContent(e.target.value)}
              onEnter={handleSave}
            />
          ) : (
            <p className=''>{content}</p>
           
          )}
        </div>

        {!isEditing && !expanded && content?.length > 150 && (
          <div className="text-right mt-2">
            <button
              onClick={() => setExpanded(true)}
              className="text-xs text-gray-400 hover:text-gray-200 flex items-center justify-end w-full"
            >
              Mostrar mais <ChevronDown size={14} className="ml-1" />
            </button>
          </div>
        )}

        {!isEditing && expanded && (
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

const MainView = ({ project = {}, setProject }) => {
  // Estado para armazenar o conteúdo dos cards que pode ser editado
  const [productCanvas, setProductCanvas] = useState(project?.product_canvas || {});
  const [colors] = useState({
    red: "#f43f5e",
    blue: "#6366f1",
    cyan: "#06b6d4",
    green: "#22c55e",
    yellow: "#f59e0b",
    gray: "#6b7280",
    purple: "#8b5cf6",
    turquoise: "#14b8a6",
  })
  // Função para atualizar o conteúdo de um card específico
  const updateProductCanvas = (prop, newContent) => {
    const updatedProductCanvas = { ...productCanvas };
    updatedProductCanvas[prop] = newContent;

    setProductCanvas(updatedProductCanvas);

    setProject({ ...project, product_canvas: updatedProductCanvas });

    router.patch(route('product-canvas.update', productCanvas.id), {
      [prop]: newContent,
    })
  };

  const updateProject = (prop, content) => {
    if (!project) {
      console.error('Project object is not defined');
      return;
    }

    if (!Object.prototype.hasOwnProperty.call(project, prop)) {
      console.error(`Property '${prop}' does not exist on project object`);
      return;
    }

    setProject({ ...project, [prop]: content });

    router.patch(route('project.update', project.id), { [prop]: content });
  };
  return (
    <div className="min-h-screen w-full text-white p-6">
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
                    style={{ width: '68%' }}
                  />
                </div>
                <span className="text-sm font-medium">68%</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3 cursor-pointer select-none">
            <div className="bg-gray-800 px-3 py-2 rounded-lg border-2 border-gray-700">
              <div className="text-xs text-gray-400 mb-1">Prazo</div>
              <div className="text-lg font-bold">48 dias</div>
            </div>
          </div>
        </div>
      </div>

      {/* Indicadores de progresso */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4 items-center justify-center bg-gray-800 p-4 rounded-lg">
        <ProgressIcon
          value={project?.stories?.length || 0}
          max={20}
          color={colors.blue}
          label="Stories"
          icon={List}
        />
        <ProgressIcon
          value={project?.personas?.length || 0}
          max={10}
          color={colors.red}
          label="Personas"
          icon={Users}
        />
        <ProgressIcon
          value={project?.goalSketches?.length || 0}
          max={15}
          color={colors.cyan}
          label="Goals"
          icon={Target}
        />
        <ProgressIcon
          value={project?.journeys?.length || 0}
          max={10}
          color={colors.turquoise}
          label="Journeys"
          icon={GitBranch}
        />
      </div>

      {/* Dashboard principal - Layout de grid responsivo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {/* Cards de informação */}
        <ExpandableCard
          title={project?.title || 'Projeto'}
          content={project?.description || 'Descrição do projeto'}
          col={2}
          color={colors.blue}
          icon={List}
          onContentUpdate={(content) => updateProject('description', content)}
        />
        <ExpandableCard
          title='Problemas'
          content={productCanvas.issues}
          color={colors.red}
          icon={AlertCircle}
          onContentUpdate={(content) => updateProductCanvas('issues', content)}
        />
        <ExpandableCard
          title='Soluções'
          content={productCanvas.solutions}
          color={colors.red}
          icon={CheckCircle}
          onContentUpdate={(content) => updateProductCanvas('solutions', content)}
        />
        <ExpandableCard
          title='Personas envolvidas'
          content={productCanvas.personas}
          color={colors.cyan}
          icon={Users}
          onContentUpdate={(content) => updateProductCanvas('personas', content)}
        />
        <ExpandableCard
          title='Restrições'
          content={productCanvas.restrictions}
          color={colors.cyan}
          icon={Slash}
          onContentUpdate={(content) => updateProductCanvas('restrictions', content)}
        />
        <ExpandableCard
          title='É'
          content={productCanvas.product_is}
          color={colors.turquoise}
          icon={Check}
          onContentUpdate={(content) => updateProductCanvas('product_is', content)}
        />
        <ExpandableCard
          title='Não É'
          content={productCanvas.product_is_not}
          color={colors.turquoise}
          icon={X}
          onContentUpdate={(content) => updateProductCanvas('product_is_not', content)}
        />
      </div>
    </div>
  );
};

export default MainView;