import React, { useState, useCallback } from 'react'
import { Excalidraw, WelcomeScreen } from '@excalidraw/excalidraw'

const Storyboards = ({}) => {
  const [strokeWidth, setStrokeWidth] = useState(2)
  const [activeTool, setActiveTool] = useState('selection')
  const [isDarkMode, setIsDarkMode] = useState('light')

  useEffect(() => {
    const html = document.querySelector('html')
    setIsDarkMode(html.classList.contains('dark'))
    console.log(isDarkMode)
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
      <div className="flex-1 relative h-full">
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
            <WelcomeScreen.Hints.HelpHint />
          </WelcomeScreen>
        </Excalidraw>
      </div>
    </div>
  )
}

export default Storyboards
