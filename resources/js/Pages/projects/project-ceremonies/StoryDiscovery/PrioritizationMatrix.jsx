import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

// Helper to sort goals by priority
const priorityOrder = { high: 1, medium: 2, med: 2, low: 3 };
const sortGoals = (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority];

// The component for a single draggable story
const StoryCard = ({ story }) => (
  <div
    draggable
    onDragStart={(e) => {
      e.dataTransfer.setData('storyId', story.id);
      e.dataTransfer.effectAllowed = 'move';
    }}
    className="p-2 mb-2 bg-card border rounded-md shadow-sm cursor-grab active:cursor-grabbing"
  >
    <p className="text-sm font-medium">{story.title}</p>
  </div>
);

// The component for a single cell in the matrix
const MatrixCell = ({ children, onDrop, onDragOver }) => (
  <div
    onDrop={onDrop}
    onDragOver={onDragOver}
    className="h-32 p-2 border bg-muted/25 rounded-md overflow-y-auto"
  >
    {children}
  </div>
);

const PrioritizationMatrix = ({ project: initialProject }) => {
  const [stories, setStories] = useState(initialProject.stories || []);
  const [goals, setGoals] = useState([...(initialProject.goal_sketches || [])].sort(sortGoals));

  useEffect(() => {
    setStories(initialProject.stories || []);
    setGoals([...(initialProject.goal_sketches || [])].sort(sortGoals));
  }, [initialProject]);

  const complexities = ['low', 'medium', 'high'];

  const unprioritizedStories = stories.filter(
    (s) => s.value === null || s.complexity === null,
  );

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, goalIndex, complexityValue) => {
    e.preventDefault();
    const storyId = parseInt(e.dataTransfer.getData('storyId'), 10);
    if (!storyId) return;

    const storyToUpdate = stories.find((s) => s.id === storyId);
    if (!storyToUpdate) return;

    const originalState = [...stories];
    
    // Higher row (lower index) = higher business value
    const businessValue = goalIndex !== null ? goals.length - 1 - goalIndex : null;

    // Optimistic update
    setStories((prevStories) =>
      prevStories.map((story) =>
        story.id === storyId
          ? { ...story, value: businessValue, complexity: complexityValue }
          : story,
      ),
    );

    axios.patch(`/api/stories/${storyId}/prioritize`, {
        value: businessValue,
        complexity: complexityValue,
    })
    .then(() => {
        toast.success(`Estória "${storyToUpdate.title}" atualizada!`);
    })
    .catch(() => {
        toast.error('Ocorreu um erro ao atualizar a estória.');
        // Revert optimistic update on error
        setStories(originalState);
    });
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Matriz de Priorização</h1>
      </div>

      <div className="flex gap-6">
        <div className="w-1/4">
          <h2 className="text-lg font-semibold mb-4">Estórias Não Priorizadas</h2>
          <div
            className="p-2 border rounded-lg bg-slate-50 min-h-[400px]"
            onDrop={(e) => handleDrop(e, null, null)}
            onDragOver={handleDragOver}
          >
            {unprioritizedStories.length > 0 ? (
              unprioritizedStories.map((story) => (
                <StoryCard key={story.id} story={story} />
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center pt-4">
                Nenhuma estória para priorizar.
              </p>
            )}
          </div>
        </div>

        <div className="w-3/4">
          <div className="grid grid-cols-4 gap-x-4 gap-y-2 items-center">
            <div></div>
            {complexities.map((complexity) => (
              <div key={complexity} className="text-center font-semibold capitalize">
                {complexity}
              </div>
            ))}

            {goals.map((goal, index) => (
              <React.Fragment key={goal.id}>
                <div className="font-semibold text-right pr-4">
                  {goal.title}
                </div>
                {complexities.map((complexity) => {
                  const cellValue = goals.length - 1 - index;
                  return (
                    <MatrixCell
                      key={`${goal.id}-${complexity}`}
                      onDrop={(e) => handleDrop(e, index, complexity)}
                      onDragOver={handleDragOver}
                    >
                      {stories
                        .filter(
                          (s) => s.value === cellValue && s.complexity === complexity,
                        )
                        .map((story) => (
                          <StoryCard key={story.id} story={story} />
                        ))}
                    </MatrixCell>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrioritizationMatrix;
