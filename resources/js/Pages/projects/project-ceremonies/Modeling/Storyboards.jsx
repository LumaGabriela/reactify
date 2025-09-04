import React, { useState } from 'react'
import { Excalidraw, WelcomeScreen, Footer } from '@excalidraw/excalidraw'
import { storyVariants } from '../StoryDiscovery/Stories'

const StoryCard = ({ story }) => {
  const selectedVariant = storyVariants[story?.type] || storyVariants.user

  return (
    <div
      className={`
          flex flex-col h-24 w-80 items-center justify-start p-2 gap-1 text-xs font-normal text-foreground
          border border-border bg-card rounded-md shadow-sm transition-opacity duration-300 min-h-16
        `}
    >
      <div className="mr-auto">
        {story && (
          <Badge
            variant="outline"
            className={`border-transparent text-primary-foreground font-bold w-fit cursor-pointer ${selectedVariant.bg}`}
          >
            {`${story?.type === 'system' ? 'SS' : 'US'}${story.id}`.toUpperCase()}
          </Badge>
        )}
      </div>

      <p className="text-sm text-center">
        {story?.title || 'Selecione uma story'}
      </p>
    </div>
  )
}

const Storyboards = ({ project, setProject }) => {
  const [strokeWidth, setStrokeWidth] = useState(2)
  const [activeTool, setActiveTool] = useState('selection')
  const [isDarkMode, setIsDarkMode] = useState('light')
  const [selectedStory, setSelectedStory] = useState(null)

  const [commandInputRef, setCommandInputRef] = useState(null)
  useEffect(() => {
    const html = document.querySelector('html')
    setIsDarkMode(html.classList.contains('dark'))
  }, [])
  // Configuração inicial
  const initialData = {
    elements: [],
    appState: {
      viewBackgroundColor: '#ffffff',
      currentItemStrokeColor: '#000000',
      currentItemBackgroundColor: 'transparent',
      currentItemStrokeWidth: strokeWidth,
      currentItemRoughness: 1,
      currentItemOpacity: 100,
      gridSize: null,
      zoom: { value: 1 },
    },
  }

  return (
    <div
      className="w-full h-96 mt-2 flex flex-col overflow-hidden"
      style={{ height: 'calc(100vh - 140px)' }}
    >
      {/* Barra de Ferramentas */}

      {/* Canvas do Excalidraw */}
      <div className="excalidraw-wrapper flex-1 relative h-full">
        <Excalidraw
          initialData={initialData}
          onChange={(elements, appState) => {
            // Sincronizar estado quando necessário
            if (
              appState.activeTool?.type &&
              appState.activeTool.type !== activeTool
            ) {
              setActiveTool(appState.activeTool.type)
            }
          }}
          langCode="pt-BR"
          theme={isDarkMode ? 'dark' : 'light'}
          UIOptions={{
            canvasActions: {
              changeViewBackgroundColor: true,
              clearCanvas: true,
              export: false,
              loadScene: true,
              saveAsImage: true,
              saveToActiveFile: true,
              toggleTheme: true,
              saveFileToDisk: false,
            },
            tools: {
              image: false,
            },
          }}
        >
          <WelcomeScreen>
            <WelcomeScreen.Hints.ToolbarHint />
            <WelcomeScreen.Hints.MenuHint />
            {/* <WelcomeScreen.Hints.HelpHint />*/}
          </WelcomeScreen>
          <Footer>
            <StoryCard story={selectedStory} />
            <Command className=" flex-col-reverse">
              <CommandInput
                ref={commandInputRef}
                placeholder="Buscar stories..."
                className="flex h-12 w-full rounded-md border-none bg-transparent px-4 py-3 text-sm text-zinc-300 placeholder:text-zinc-500 focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <CommandList className="max-h-[300px] overflow-y-auto overflow-x-hidden">
                <CommandEmpty className="py-6 text-center text-sm text-zinc-500">
                  Nenhum projeto encontrado.
                </CommandEmpty>
                <CommandGroup>
                  {project?.stories?.map((story) => (
                    <CommandItem
                      key={story.id}
                      value={story.id}
                      onSelect={() => {
                        setSelectedStory(story)
                      }}
                    >
                      <Badge>
                        {story.type === 'user' ? 'US' : 'SS'}
                        {story.id}
                      </Badge>
                      {story.title}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </Footer>
        </Excalidraw>
      </div>
    </div>
  )
}

export default Storyboards
