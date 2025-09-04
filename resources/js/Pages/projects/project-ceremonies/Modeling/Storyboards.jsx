import React, { useState } from 'react'
import { router } from '@inertiajs/react'
import {
  Excalidraw,
  WelcomeScreen,
  Footer,
  exportToBlob,
} from '@excalidraw/excalidraw'
import { storyVariants } from '../StoryDiscovery/Stories'

const StoryCard = ({ story }) => {
  const selectedVariant = storyVariants[story?.type] || storyVariants.user

  return (
    <div
      className={`
          flex items-start h-14 w-1/2 p-1 gap-1 text-xs font-normal text-foreground
          border border-border bg-card rounded-md shadow-sm transition-opacity duration-300
        `}
    >
      {story && (
        <Badge
          variant="outline"
          className={`border-transparent text-primary-foreground font-bold w-fit cursor-pointer ${selectedVariant.bg}`}
        >
          {`${story?.type === 'system' ? 'SS' : 'US'}${story.id}`.toUpperCase()}
        </Badge>
      )}

      <p className="text-sm text-left">
        {story?.title || 'Selecione uma story'}
      </p>
    </div>
  )
}

const Storyboards = ({ project, setProject }) => {
  const [excalidrawAPI, setExcalidrawAPI] = useState(null)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [selectedStory, setSelectedStory] = useState(null)
  // Dentro do seu componente
  const [searchQuery, setSearchQuery] = useState('')
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
      currentItemStrokeWidth: 2,
      currentItemRoughness: 1,
      currentItemOpacity: 100,
      gridSize: null,
      zoom: { value: 1 },
    },
  }

  const handleSaveCanvas = async () => {
    // Verificação para garantir que temos tudo o que precisamos
    if (!excalidrawAPI || !selectedStory) {
      alert('Por favor, selecione uma story antes de salvar.')
      return
    }

    try {
      const blob = await exportToBlob({
        elements: excalidrawAPI.getSceneElements(),
        appState: excalidrawAPI.getAppState(),
        files: excalidrawAPI.getFiles(),
        mimeType: 'image/png',
      })

      // Cria um objeto File a partir do Blob
      const imageFile = new File(
        [blob],
        `storyboard_story_id=${selectedStory.id}.png`,
        {
          type: 'image/png',
        },
      )

      // Prepara os dados e envia com o hook useForm
      const formData = {
        image: imageFile,
        story_id: selectedStory.id,
      }

      router.post(route('storyboard.store'), formData, {
        onSuccess: () => {
          console.log('Storyboard salvo com sucesso!')
          // Você pode adicionar um feedback aqui, como um toast.
        },
        onError: (errors) => {
          console.error('Erro ao salvar:', errors)
          alert('Ocorreu um erro ao salvar o storyboard.')
        },
      })
    } catch (error) {
      console.error('Erro ao exportar o canvas:', error)
      alert('Não foi possível gerar a imagem do canvas.')
    }
  }
  return (
    <div
      className="w-full h-96 mt-2 flex flex-col overflow-hidden"
      style={{ height: 'calc(100vh - 105px)' }}
    >
      {/* Barra de Ferramentas */}

      {/* Canvas do Excalidraw */}
      <div className="excalidraw-wrapper flex-1 relative h-full">
        <Excalidraw
          initialData={initialData}
          excalidrawAPI={(api) => setExcalidrawAPI(api)}
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
            <Button onClick={handleSaveCanvas}>Salvar</Button>
            <Command className="flex-col-reverse w-1/2 font-normal text-sm">
              <CommandInput
                ref={commandInputRef}
                onValueChange={(value) => {
                  setSearchQuery(value)
                }}
                placeholder="Buscar stories..."
                className="!border-none focus:!outline-none focus:!ring-0 !bg-transparent"
              />
              <CommandList className="overflow-y-auto overflow-x-hidden">
                <CommandEmpty className="py-6 text-sm">
                  Nenhum projeto encontrado.
                </CommandEmpty>

                <CommandGroup
                  className={`${searchQuery.length > 0 ? '' : 'hidden'} text-left`}
                >
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
