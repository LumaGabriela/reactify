import { router } from '@inertiajs/react'
import { Excalidraw, WelcomeScreen, exportToBlob } from '@excalidraw/excalidraw'
import { storyVariants } from '../../StoryDiscovery/Stories'
import { Paperclip } from 'lucide-react'

const blobToDataURL = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
    reader.readAsDataURL(blob)
  })
}

const StoryCard = ({ story, onSelect, isSelected = false }) => {
  const selectedVariant = storyVariants[story?.type] || storyVariants.user

  return (
    <div
      onClick={onSelect}
      className={`
          flex items-start min-h-14 p-1 gap-1 cursor-pointer text-sm font-normal text-foreground
          border border-border rounded-md shadow-sm transition-opacity duration-300 bg-card ${isSelected ? 'border-2 border-primary' : ''}
        `}
    >
      {story && (
        <Badge
          variant="outline"
          className={`border-transparent text-primary-foreground font-bold w-fit cursor-pointer ${selectedVariant.bg} `}
        >
          {`${story?.type === 'system' ? 'SS' : 'US'}${story.id}`.toUpperCase()}
        </Badge>
      )}
      <p className="text-left">{story?.title || 'Selecione uma story'}</p>
    </div>
  )
}

const Editor = ({ project, setTab }) => {
  const [excalidrawAPI, setExcalidrawAPI] = useState(null)
  const [sceneData, setSceneData] = useState(null)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [selectedStory, setSelectedStory] = useState(null)

  const [isProcessing, setIsProcessing] = useState(false)
  const [commandInputRef, setCommandInputRef] = useState(null)

  useEffect(() => {
    const html = document.querySelector('html')
    setIsDarkMode(html.classList.contains('dark'))
  }, [])

  useEffect(() => {
    // 1. Se não houver story selecionada, limpa os dados e termina.
    if (!selectedStory) {
      setSceneData({ elements: [], files: {} })
      return
    }

    // 2. Dispara o recarregamento (mostrando o loader).
    // Esta é a sua descoberta crucial que força a remontagem do Excalidraw.
    setSceneData(null)
    // Este useEffect agora PREPARA os dados ANTES de renderizar o Excalidraw
    const prepareInitialScene = async () => {
      const currentStoryboard = project.storyboards.find(
        (sb) => sb.story_id === selectedStory.id,
      )

      const imageUrl = currentStoryboard?.image_url

      console.log(imageUrl)
      // Se não houver imagem, preparamos uma cena vazia e terminamos
      if (!imageUrl) {
        setSceneData({
          elements: [],
          files: {},
        })
        return
      }

      console.log('⏳ Preparando cena inicial com a imagem:', imageUrl)
      try {
        const response = await fetch(imageUrl, { mode: 'cors' })
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`)
        const blob = await response.blob()
        const dataURL = await blobToDataURL(blob)

        const img = new Image()
        img.onload = () => {
          const fileId = `storyboard-file-${Date.now()}`

          const imageElement = {
            id: `storyboard-element-${Date.now()}`,
            type: 'image',
            fileId,
            status: 'saved',
            x: 50,
            y: 50,
            width: img.width,
            height: img.height,
            boundElements: [],
            groupIds: [],
            isDeleted: false,
            angle: 0,
            locked: false,
            opacity: 100,
            seed: Math.floor(Math.random() * 1000000),
            version: 3,
            versionNonce: Math.floor(Math.random() * 1000000),
            updated: Date.now(),
            frameId: null,
            link: null,
            roundness: null,
            strokeStyle: 'solid',
            strokeWidth: 1,
            strokeColor: '#000000',
            backgroundColor: 'transparent',
            fillStyle: 'hachure',
            roughness: 1,
          }

          const files = {
            [fileId]: {
              mimeType: blob.type,
              id: fileId,
              dataURL,
              created: Date.now(),
            },
          }

          console.log(
            '✅ Dados da cena prontos para serem injetados via initialData.',
          )
          setSceneData({
            elements: [imageElement],
            files: files,
          })
        }
        img.src = dataURL
      } catch (error) {
        console.error('Erro ao preparar a cena inicial:', error)
        setSceneData({ elements: [], files: {} })
      }
    }

    setTimeout(prepareInitialScene(), 0)
  }, [selectedStory, project.storyboards]) // Roda apenas se a URL da imagem mudar

  const handleSaveCanvas = async () => {
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

      const imageFile = new File(
        [blob],
        `storyboard_story_id=${selectedStory.id}.png`,
        {
          type: 'image/png',
        },
      )

      const formData = {
        image: imageFile,
        story_id: selectedStory.id,
        project_id: project.id,
      }

      router.post(route('storyboard.store'), formData, {
        onStart: () => {
          setIsProcessing(true)
        },
        onSuccess: () => {
          console.log('Storyboard salvo com sucesso!')
        },
        onError: (errors) => {
          console.error('Erro ao salvar:', errors)
          alert('Ocorreu um erro ao salvar o storyboard.')
        },
        onFinish: () => {
          setIsProcessing(false)
        },
      })
    } catch (error) {
      console.error('Erro ao exportar o canvas:', error)
      alert('Não foi possível gerar a imagem do canvas.')
    }
  }

  return (
    <div className="w-full mt-2 flex" style={{ height: 'calc(100vh - 105px)' }}>
      <section className="flex flex-col w-1/5 h-full gap-2 p-2">
        <div className="flex justify-between">
          <Button
            onClick={handleSaveCanvas}
            disabled={isProcessing || !selectedStory}
          >
            Salvar
          </Button>
        </div>
        {/* user stories*/}
        {project?.stories
          ?.filter((story) => story.type === 'user')
          .map((story) => (
            <StoryCard
              key={story.id}
              story={story}
              isSelected={story.id === selectedStory?.id}
              onSelect={() => {
                setSelectedStory(story)
              }}
            />
          ))}
        {/*system stories */}
        {project?.stories
          ?.filter((story) => story.type === 'system')
          .map((story) => (
            <StoryCard
              key={story.id}
              story={story}
              isSelected={story.id === selectedStory?.id}
              onSelect={() => {
                setSelectedStory(story)
              }}
            />
          ))}
      </section>
      <div className="excalidraw-wrapper flex-1 relative w-[85%] h-full">
        {/* RENDERIZAÇÃO CONDICIONAL */}
        {!sceneData ? (
          <div className="w-full h-full flex items-center justify-center bg-card text-foreground">
            Carregando storyboard...
          </div>
        ) : (
          <Excalidraw
            key={selectedStory ? selectedStory.id : 'no-story-selected'}
            initialData={sceneData}
            excalidrawAPI={(api) => setExcalidrawAPI(api)}
            renderTopRightUI={() => (
              <TooltipProvider>
                <Tooltip delayDuration={100}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="secondary"
                      className="size-10"
                      onClick={() => console.log('anexos')}
                    >
                      <Paperclip />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Inserir anexo</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
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
                image: true,
              },
            }}
          >
            <WelcomeScreen>
              <WelcomeScreen.Hints.ToolbarHint />
              <WelcomeScreen.Hints.MenuHint />
            </WelcomeScreen>
          </Excalidraw>
        )}
      </div>
    </div>
  )
}

export default Editor
