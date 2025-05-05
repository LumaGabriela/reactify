import React, { useState, useEffect } from 'react';
import { Plus, CircleX, Pencil, Check, ChevronDown } from 'lucide-react';
import PopUpConfirmation from '@/Components/PopUpConfimation';
import TextArea from '@/Components/TextArea';
import PopUpSelect from '@/Components/PopUpSelect';
const Goals = ({ project, setProject }) => {
    const [goalTypes] = useState([
        { color: 'bg-orange-600', title: 'BG' },
        { color: 'bg-purple-600', title: 'CG' },
    ])
    const [goalPriorities] = useState([
        { color: 'bg-red-600', title: 'HIGH' },
        { color: 'bg-yellow-600', title: 'MED' },
        { color: 'bg-green-600', title: 'LOW' },
        { color: 'bg-pink-600', title: 'URGENT' },
    ])
    // Estado para controlar qual goal está sendo editada
    const [editingId, setEditingId] = useState(null);
    // Estado para armazenar o valor temporário durante a edição
    const [editValue, setEditValue] = useState('');
    // Estado para controlar qual goal está com o seletor de tipo aberto
    const [typeSelectId, setTypeSelectId] = useState(null);
    // Estado para controlar qual goal está com o seletor de prioridade aberto
    const [prioritySelectId, setPrioritySelectId] = useState(null);
    // Estado para controlar qual goal está com o diálogo de confirmação de exclusão aberto
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);


    // Função para adicionar uma nova goal
    const addNewGoal = () => {
        setProject({
            ...project,
            goalSketches: [
                ...project.goalSketches || [],
                {
                    id: project.goalSketches ? project.goalSketches.length + 1 : 1,
                    title: 'Nova Goal',
                    type: 'BG',
                    priority: 'MED'
                }
            ]
        });
    };

    // Função para alternar entre modo de edição e visualização
    const editGoal = (goal) => {
        console.log('editando: ', goal);
        if (editingId === goal.id) {
            // Se já estiver editando esta goal, salve as alterações
            const updatedGoals = (project.goalSketches || []).map(g =>
                g.id === goal.id ? { ...g, title: editValue } : g
            );
            setProject({ ...project, goalSketches: updatedGoals });
            setEditingId(null); // Sai do modo de edição
        } else {
            // Entra no modo de edição para esta goal
            setEditingId(goal.id);
            setEditValue(goal.title); // Inicializa o campo com o valor atual
        }
    };

    // Função para lidar com mudanças no input
    const handleInputChange = (e) => {
        setEditValue(e.target.value);
    };

    // Função para alternar a exibição do seletor de tipo
    const toggleTypeSelect = (goalId) => {
        if (typeSelectId === goalId) {
            setTypeSelectId(null);
        } else {
            setTypeSelectId(goalId);
            setPrioritySelectId(null); // Fecha outros seletores
            setDeleteConfirmId(null); // Fecha o diálogo de exclusão caso esteja aberto
        }
    };

    // Função para alternar a exibição do seletor de prioridade
    const togglePrioritySelect = (goalId) => {
        if (prioritySelectId === goalId) {
            setPrioritySelectId(null);
        } else {
            setPrioritySelectId(goalId);
            setTypeSelectId(null); // Fecha outros seletores
            setDeleteConfirmId(null); // Fecha o diálogo de exclusão caso esteja aberto
        }
    };

    // Função para alterar o tipo da goal
    const changeGoalType = (goalId, newType) => {
        const updatedGoals = (project.goalSketches || []).map(g =>
            g.id === goalId ? { ...g, type: newType } : g
        );
        setProject({ ...project, goalSketches: updatedGoals });
        setTypeSelectId(null); // Fecha o seletor de tipo
    };

    // Função para alterar a prioridade da goal
    const changeGoalPriority = (goalId, newPriority) => {
        const updatedGoals = (project.goalSketches || []).map(g =>
            g.id === goalId ? { ...g, priority: newPriority } : g
        );
        setProject({ ...project, goalSketches: updatedGoals });
        setPrioritySelectId(null); // Fecha o seletor de prioridade
    };

    // Função para alternar a exibição do diálogo de confirmação de exclusão
    const toggleDeleteConfirm = (goalId) => {
        if (deleteConfirmId === goalId) {
            setDeleteConfirmId(null);
        } else {
            setDeleteConfirmId(goalId);
            setTypeSelectId(null); // Fecha o seletor de tipo caso esteja aberto
            setPrioritySelectId(null); // Fecha o seletor de prioridade caso esteja aberto
            setEditingId(null); // Fecha a edição caso esteja aberta
        }
    };

    // Função para excluir a goal
    const deleteGoal = (goalId) => {
        const updatedGoals = (project.goalSketches || []).filter(g => g.id !== goalId);
        setProject({ ...project, goalSketches: updatedGoals });
        setDeleteConfirmId(null); // Fecha o diálogo de confirmação
    };

    // Helper para definir a cor de fundo baseada na prioridade
    const getPriorityColor = (priority) => {
        const foundPriority = goalPriorities.find(item => item.title === priority);
        return foundPriority ? foundPriority.color : '';
    };


    return (
        <div className="goalSketches rounded grid sm:grid-cols-1 md:grid-cols-2 gap-2 w-full p-2 cursor-pointer items-center">
            {project.goalSketches && project.goalSketches.length > 0 ? (
                project.goalSketches.map((goal) => (
                    <div key={goal.id} className="goal bg-gray-800 rounded-lg p-2 shadow-md col-span-1 h-full">
                        <div className="flex items-center mb-2 gap-2 relative">
                            {/* Tipo da Goal (BG/CG) */}
                            <div
                                className={`${goal.type === 'BG' ? 'bg-purple-600' : 'bg-orange-600'} text-white text-xs font-medium py-1 px-3 rounded-full cursor-pointer flex items-center`}
                                onClick={() => toggleTypeSelect(goal.id)}
                            >
                                {goal.type}
                                <ChevronDown size={14} className="ml-1" />
                            </div>

                            {/* Seletor de tipo */}
                            {typeSelectId === goal.id && (
                                <PopUpSelect
                                    types={goalTypes}
                                    onClick={(type) => changeGoalType(goal.id, type.title)}
                                />
                            )}

                            {/* Prioridade da Goal */}
                            <div
                                className={`${getPriorityColor(goal.priority)} text-white text-xs font-medium py-1 px-3 rounded-full cursor-pointer flex items-center`}
                                onClick={() => togglePrioritySelect(goal.id)}
                            >
                                {goal.priority}
                                <ChevronDown size={14} className="ml-1" />
                            </div>

                            {/* Seletor de prioridade */}
                            {prioritySelectId === goal.id && (
                                <PopUpSelect
                                    types={goalPriorities}
                                    onClick={(priority) => changeGoalPriority(goal.id, priority.title)}
                                />
                            )}
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center w-full">
                                <div className="rounded-full flex items-center justify-center text-white text-xs w-full">
                                    {editingId === goal.id ? (
                                        <TextArea
                                            value={editValue}
                                            onChange={handleInputChange}
                                            onEnter={(e) => { if (e.key === 'Enter') { editGoal(goal) } }}
                                        />
                                    ) : (
                                        <span className="w-full">{goal.title}</span>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-1">
                                <button
                                    className={`edit flex p-1 hover:bg-gray-700 rounded transition-colors ${editingId === goal.id ? 'bg-green-700 hover:bg-green-800' : ''}`}
                                    onClick={() => editGoal(goal)}
                                >
                                    {editingId === goal.id ? (
                                        // Ícone de confirmação quando estiver editando
                                        <Check size={16} className='stroke-green-400' />
                                    ) : (
                                        // Ícone de edição quando não estiver editando
                                        <Pencil size={16} className='stroke-gray-400' />
                                    )}
                                </button>
                                <button
                                    className="p-1 flex hover:bg-gray-700 rounded"
                                    onClick={() => toggleDeleteConfirm(goal.id)}
                                >
                                    <CircleX size={16} className={`${deleteConfirmId === goal.id ? 'stroke-red-400' : 'stroke-gray-400'}`} />
                                </button>

                                {/* Diálogo de confirmação de exclusão */}
                                {deleteConfirmId === goal.id && (
                                    <PopUpConfirmation
                                        onConfirm={() => deleteGoal(goal.id)}
                                        onCancel={() => setDeleteConfirmId(null)}
                                        message="Deseja remover esta goal?"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                // Exibir um card de exemplo quando não houver goals
                <div className="bg-gray-800 rounded-lg p-4 shadow-md">
                    <div className="flex items-center mb-2 gap-2">
                        <div className="bg-purple-600 text-white text-xs font-medium py-1 px-3 rounded-full">
                            BG
                        </div>
                        <div className="bg-yellow-600 text-white text-xs font-medium py-1 px-3 rounded-full">
                            med
                        </div>
                    </div>
                    <div className="text-white text-base font-medium mb-4">
                        Descobrir quem está por trás do desaparecimento dos artefatos
                    </div>
                </div>
            )}

            {/* Botão "Nova goal" */}
            <button
                className="col-span-2 flex items-center justify-center w-full py-1 bg-gray-800 hover:bg-gray-700 text-blue-400 rounded-lg transition-colors rounded shadow-md"
                onClick={addNewGoal}
            >
                <Plus size={18} className="mr-2" />
                <span>Nova goal</span>
            </button>
        </div>
    );
}

export default Goals;