import React, { useState, useEffect } from 'react';
import { Plus, CircleX, Pencil, Check, ChevronDown } from 'lucide-react';
import PopUpConfirmation from '@/Components/PopUpConfimation';
import TextArea from '@/Components/TextArea';

const StoryCard = ({ 
  story, 
  toggleTypeSelect,
  changeStoryType,
  typeSelectId,
  editingId, 
  editValue,
  handleInputChange,
  editStory,
  deleteConfirmId,
  toggleDeleteConfirm,
  deleteStory,
  setDeleteConfirmId
}) => {
  return (
    <div  className={`story bg-gray-800 rounded-lg p-2 shadow-md col-span-1`}>
    <div className="flex items-center mb-2 relative">
      <div
        className={`${story.type === 'user' ? 'bg-pink-600' : 'bg-cyan-600'} text-white text-xs font-medium py-1 px-3 rounded-full cursor-pointer`}
        onClick={() => toggleTypeSelect(story.id)}
      >
        {story.type}
      </div>

      {/* Seletor de tipo */}
      {typeSelectId === story.id && (
        <div className="flex items-center justify-center absolute -top-9 -left-2 z-10 bg-gray-700 rounded shadow-lg px-2 py-1 shadow-md">
          <div
            className="bg-pink-600 text-white text-xs font-medium py-1 px-3 rounded-full cursor-pointer mr-1 shadow-md"
            onClick={() => changeStoryType(story.id, 'user')}
          >
            user
          </div>
          <div
            className="bg-cyan-600 text-white text-xs font-medium py-1 px-3 rounded-full cursor-pointer shadow-md"
            onClick={() => changeStoryType(story.id, 'system')}
          >
            system
          </div>
        </div>
      )}
    </div>

    <div className="flex items-center justify-between ">
      <div className="flex items-cente w-full">
        <div className="rounded-full flex items-center justify-center text-white text-xs w-full">
          {editingId === story.id ? (
            <TextArea
              value={editValue}
              onEnter={(e) => { if (e.key === 'Enter') {editStory(story)}}}
              onChange={handleInputChange}
            />
          ) : (
            <span className="w-full ">{story.title}</span>
          )}
        </div>
      </div>
      <div className="flex gap-1">
        <button
          className={`edit flex p-1 hover:bg-gray-700 rounded transition-colors ${editingId === story.id ? 'bg-green-700 hover:bg-green-800' : ''}`}
          onClick={() => editStory(story)}
        >
          {editingId === story.id ? (
            // Ícone de confirmação quando estiver editando
            <Check size={16} className='stroke-green-400' />
          ) : (
            // Ícone de edição quando não estiver editando
            <Pencil size={16} className='stroke-gray-400' />
          )}
        </button>
        <button
          className="p-1 flex hover:bg-gray-700 rounded"
          onClick={() => toggleDeleteConfirm(story.id)}
        >
          <CircleX size={16} className={`${deleteConfirmId === story.id ? 'stroke-red-400' : 'stroke-gray-400'}`} />
        </button>

        {/* Diálogo de confirmação de exclusão */}
        {deleteConfirmId === story.id && (
          <PopUpConfirmation
            onConfirm={() => deleteStory(story.id)}
            onCancel={() => setDeleteConfirmId(null)}
            message="Deseja remover esta story?"
          />
        )}
      </div>
    </div>
  </div>
  );
};

const GoalCard = ({ 
    goal,
    toggleTypeSelect,
    changeGoalType,
    typeSelectId,
    togglePrioritySelect,
    changeGoalPriority,
    prioritySelectId,
    editingId,
    editValue,
    handleInputChange,
    editGoal,
    deleteConfirmId,
    toggleDeleteConfirm,
    deleteGoal,
    setDeleteConfirmId,

 }) => {
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
        const getPriorityColor = (priority) => {
            const foundPriority = goalPriorities.find(item => item.title === priority);
            return foundPriority ? foundPriority.color : '';
        };
        const getGoalTypeColor = (type) => {
          const foundType = goalTypes.find((item) => item.title === type);
          return foundType ? foundType.color : '';
        };
    return(
    <div key={goal.id} className="goal bg-gray-800 rounded-lg p-2 shadow-md col-span-1 h-full">
    <div className="flex items-center mb-2 gap-2">
        {/* Tipo da Goal (BG/CG) */}
        <div
            className={`${getGoalTypeColor(goal.type)} text-white text-xs font-medium py-1 px-3 rounded-full cursor-pointer flex items-center`}
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
                onCancel={() => setTypeSelectId(null)}
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
                onCancel={() => setPrioritySelectId(null)}
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
)}

export { StoryCard, GoalCard}