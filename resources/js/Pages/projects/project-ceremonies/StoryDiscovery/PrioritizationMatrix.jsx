import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Helper to sort goals by priority, handling both 'med' and 'medium'
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
  // --- DEBUGGING LINE ---
  // Isso nos mostrará exatamente o que o servidor está enviando.
  console.log('Dados recebidos do servidor:', initialProject);
  // --- FIM DA DEBUGGING LINE ---

  const [project, setProject] = useState(initialProject);
  const [stories, setStories] = useState(initialProject.stories || []);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setProject(initialProject);
    setStories(initialProject.stories || []);
  }, [initialProject]);

  const goals = [...(project.goal_sketches || [])].sort(sortGoals);
  const complexities = ['low', 'medium', 'high'];

  const unprioritizedStories = stories.filter(
    (s) => s.value === null || s.complexity === null,
  );

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, goalValue, complexityValue) => {
    e.preventDefault();
    const storyId = parseInt(e.dataTransfer.getData('storyId'), 10);
    if (!storyId) return;

    setStories((prevStories) =>
      prevStories.map((story) =>
        story.id === storyId
          ? { ...story, value: goalValue, complexity: complexityValue }
          : story,
      ),
    );
  };

  const handleSave = () => {
    setIsSaving(true);
    router.patch(
      `/project/${project.id}/prioritization-matrix`,
      { stories },
      {
        preserveState: true,
        preserveScroll: true,
        onSuccess: (page) => {
          setProject(page.props.project);
          setStories(page.props.project.stories || []);
          toast.success('Matriz de priorização salva com sucesso!');
        },
        onError: () => {
          toast.error('Ocorreu um erro ao salvar a matriz.');
        },
        onFinish: () => {
          setIsSaving(false);
        },
      },
    );
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Matriz de Priorização</h1>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Salvando...' : 'Salvar Matriz'}
        </Button>
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
                {complexities.map((complexity) => (
                  <MatrixCell
                    key={`${goal.id}-${complexity}`}
                    onDrop={(e) => handleDrop(e, index, complexity)}
                    onDragOver={handleDragOver}
                  >
                    {stories
                      .filter(
                        (s) => s.value === index && s.complexity === complexity,
                      )
                      .map((story) => (
                        <StoryCard key={story.id} story={story} />
                      ))}
                  </MatrixCell>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrioritizationMatrix;
