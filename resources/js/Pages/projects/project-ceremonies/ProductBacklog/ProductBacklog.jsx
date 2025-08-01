import React, { useState, useEffect } from 'react';

// Declaring Enums directly as requested
const StoryBacklogStatus = {
  PRODUCT_BACKLOG: 'product_backlog',
  SPRINT_BACKLOG: 'sprint_backlog',
  DELIVERED: 'delivered',
};

const ProductBacklog = ({ project }) => {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    if (project && project.stories) {
      setStories(project.stories);
    }
  }, [project]);

  // Stories that are in the backlog but have not been prioritized yet (value is null)
  const unprioritizedStories = stories.filter(
    (story) => story.backlog_status === StoryBacklogStatus.PRODUCT_BACKLOG && story.value === null,
  );

  // Stories that have been prioritized (value is not null) and are ready to be worked on
  const productBacklogStories = stories
    .filter((story) => story.backlog_status === StoryBacklogStatus.PRODUCT_BACKLOG && story.value !== null)
    .sort((a, b) => {
      // Sort by value descending (higher value first)
      return (b.value ?? -1) - (a.value ?? -1);
    });

  const sprintBacklogStories = stories.filter(
    (story) => story.backlog_status === StoryBacklogStatus.SPRINT_BACKLOG,
  );
  
  const deliveredStories = stories.filter(
    (story) => story.backlog_status === StoryBacklogStatus.DELIVERED,
  );

  const board = {
    unprioritized: unprioritizedStories,
    productBacklog: productBacklogStories,
    sprintBacklog: sprintBacklogStories,
    delivered: deliveredStories,
  };

  const columnTitles = {
    unprioritized: 'Backlog (Não Priorizado)',
    productBacklog: 'Product Backlog (Priorizado)',
    sprintBacklog: 'Sprint Backlog',
    delivered: 'Delivered',
  };

  return (
    <div className="flex space-x-4 p-4 min-h-[500px]">
      {Object.keys(board).map((columnId) => (
        <div
          key={columnId}
          className="w-1/4 bg-muted rounded-lg p-3 flex flex-col"
        >
          <h2 className="text-lg font-bold mb-4 text-foreground px-1">
            {columnTitles[columnId]}
          </h2>
          <div className="space-y-3">
            {board[columnId].length > 0 ? (
              board[columnId].map((card) => (
                <div
                  key={card.id}
                  className="bg-card p-3 rounded-md shadow-sm text-foreground text-sm"
                >
                  <p className="font-semibold">{`US${card.id}`}</p>
                  <p>{card.title}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center pt-4">
                Nenhuma estória nesta coluna.
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductBacklog;
