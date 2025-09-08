import React, { useState, useEffect } from 'react'

import { router } from '@inertiajs/react'

import {
  Excalidraw,
  WelcomeScreen,
  Footer,
  exportToBlob,
} from '@excalidraw/excalidraw'

import { storyVariants } from '../../StoryDiscovery/Stories'

import { CornerDownLeft } from 'lucide-react'

const blobToDataURL = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
    reader.readAsDataURL(blob)
  })
}

const StoryCard = ({ story }) => {
  const selectedVariant = storyVariants[story?.type] || storyVariants.user

  return (
    <div
      className={`
          flex items-start h-14 w-1/2 p-1 gap-1 text-sm font-normal text-foreground
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
      <p className="text-left">{story?.title || 'Selecione uma story'}</p>
    </div>
  )
}

const Editor = ({ project, storyboard, setTab }) => {
  const [excalidrawAPI, setExcalidrawAPI] = useState(null)
  const [sceneData, setSceneData] = useState(null)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [selectedStory, setSelectedStory] = useState(
    project.stories?.find((story) => story.id === storyboard?.story_id) || null,
  )
  const [isProcessing, setIsProcessing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [commandInputRef, setCommandInputRef] = useState(null)
  const [pendingImageUrl, setPendingImageUrl] = useState(
    storyboard?.image_url || null,
  )

  useEffect(() => {
    const html = document.querySelector('html')
    setIsDarkMode(html.classList.contains('dark'))
  }, [])

  useEffect(() => {
    // Este useEffect agora PREPARA os dados ANTES de renderizar o Excalidraw
    const prepareInitialScene = async () => {
      const imageUrl = storyboard?.image_url

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

    prepareInitialScene()
  }, [storyboard?.image_url]) // Roda apenas se a URL da imagem mudar

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
    <div
      className="w-full mt-2 flex "
      style={{ height: 'calc(100vh - 105px)' }}
    >
      <section className="flex flex-col w-1/5 h-full ">
        <div className="flex justify-between py-2">
          <Button
            onClick={handleSaveCanvas}
            disabled={isProcessing || !selectedStory}
          >
            Salvar
          </Button>
          <Button
          // onClick={handleSaveCanvas}
          // disabled={isProcessing || !selectedStory}
          >
            Inserir anexo
          </Button>
        </div>
        <Command className=" font-normal text-sm">
          <CommandInput
            ref={commandInputRef}
            onValueChange={(value) => {
              setSearchQuery(value)
            }}
            placeholder="Buscar stories..."
            className="!border-none focus:!outline-none focus:!ring-0 !bg-transparent"
          />

          <CommandList className=" overflow-x-hidden max-h-full">
            <CommandEmpty className="py-6 text-sm">
              Nenhum projeto encontrado.
            </CommandEmpty>

            <CommandGroup className={`text-left`}>
              {project?.stories?.map((story) => (
                <CommandItem
                  key={story.id}
                  value={story.id}
                  onSelect={() => {
                    setSelectedStory(story)
                  }}
                  className={`${selectedStory.id === story.id ? 'text-background bg-muted-foreground' : ''}`}
                >
                  <Badge
                  // className={`${selectedStory.id === story.id ? 'bg-accent text-foreground' : ''}`}
                  >
                    {story.type === 'user' ? 'US' : 'SS'}
                    {story.id}
                  </Badge>
                  {story.title}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </section>
      <div className="excalidraw-wrapper flex-1 relative w-[85%] h-full">
        {/* RENDERIZAÇÃO CONDICIONAL */}
        {!sceneData ? (
          <div className="w-full h-full flex items-center justify-center bg-card text-foreground">
            Carregando storyboard...
          </div>
        ) : (
          <Excalidraw
            initialData={sceneData}
            excalidrawAPI={(api) => setExcalidrawAPI(api)}
            renderTopRightUI={() => (
              <TooltipProvider>
                <Tooltip delayDuration={100}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="secondary"
                      className="size-10"
                      onClick={() => setTab({ tab: 'index', storyboard: null })}
                    >
                      <CornerDownLeft />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Storyboards</TooltipContent>
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
            {/*
            <Footer>
              <StoryCard story={selectedStory} />
              <Button
                onClick={handleSaveCanvas}
                disabled={isProcessing || !selectedStory}
              >
                Salvar
              </Button>
            </Footer>*/}
          </Excalidraw>
        )}
      </div>
    </div>
  )
}

export default Editor
