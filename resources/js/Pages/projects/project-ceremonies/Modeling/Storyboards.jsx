import React, { useState, useCallback } from 'react'
import { Excalidraw } from '@excalidraw/excalidraw'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  MousePointer,
  Pencil,
  Square,
  Circle,
  Triangle,
  Type,
  Eraser,
  Trash2,
  Palette,
  Minus,
  Download,
  RefreshCw,
} from 'lucide-react'

const Storyboards = ({}) => {
  const [selectedColor, setSelectedColor] = useState('#000000')
  const [strokeWidth, setStrokeWidth] = useState(2)
  const [excalidrawAPI, setExcalidrawAPI] = useState(null)
  const [activeTool, setActiveTool] = useState('selection')
  const [isExporting, setIsExporting] = useState(false)

  // Cores predefinidas
  const predefinedColors = [
    '#000000',
    '#e03131',
    '#2f9e44',
    '#1971c2',
    '#f08c00',
    '#e64980',
    '#0ca678',
    '#fd7e14',
    '#6741d9',
    '#c2255c',
    '#495057',
    '#868e96',
  ]

  // Função para definir ferramenta ativa
  const handleToolChange = useCallback(
    (toolType) => {
      if (excalidrawAPI) {
        excalidrawAPI.setActiveTool({ type: toolType })
        setActiveTool(toolType)
      }
    },
    [excalidrawAPI],
  )

  // Função para limpar tudo
  const clearAll = useCallback(() => {
    if (excalidrawAPI) {
      excalidrawAPI.updateScene({
        elements: [],
        appState: {
          selectedElementIds: {},
        },
      })
    }
  }, [excalidrawAPI])

  // Função para deletar elementos selecionados
  const deleteSelected = useCallback(() => {
    if (excalidrawAPI) {
      const appState = excalidrawAPI.getAppState()
      const selectedIds = Object.keys(appState.selectedElementIds || {})

      if (selectedIds.length > 0) {
        const elements = excalidrawAPI.getSceneElements()
        const filteredElements = elements.filter(
          (el) => !selectedIds.includes(el.id),
        )

        excalidrawAPI.updateScene({
          elements: filteredElements,
          appState: {
            selectedElementIds: {},
          },
        })
      }
    }
  }, [excalidrawAPI])

  // Função para alterar cor
  const handleColorChange = useCallback(
    (color) => {
      setSelectedColor(color)
      if (excalidrawAPI) {
        excalidrawAPI.updateScene({
          appState: {
            currentItemStrokeColor: color,
            currentItemBackgroundColor:
              color === '#000000' ? 'transparent' : color + '20',
          },
        })
      }
    },
    [excalidrawAPI],
  )

  // Função para alterar espessura
  const handleStrokeWidthChange = useCallback(
    (width) => {
      const widthNum = parseInt(width)
      setStrokeWidth(widthNum)
      if (excalidrawAPI) {
        excalidrawAPI.updateScene({
          appState: {
            currentItemStrokeWidth: widthNum,
          },
        })
      }
    },
    [excalidrawAPI],
  )

  // Função para exportar como imagem usando método nativo do Excalidraw
  const exportAsImage = useCallback(async () => {
    if (!excalidrawAPI) {
      alert('Canvas não está pronto. Aguarde um momento e tente novamente.')
      return
    }

    setIsExporting(true)

    try {
      const elements = excalidrawAPI.getSceneElements()

      if (!elements || elements.length === 0) {
        alert('Não há elementos para exportar. Desenhe algo primeiro!')
        setIsExporting(false)
        return
      }

      console.log('Exportando...', elements.length, 'elementos')

      // Importar a função de exportação do Excalidraw
      const { exportToCanvas } = await import('@excalidraw/excalidraw')

      const canvas = await exportToCanvas({
        elements: elements,
        appState: {
          ...excalidrawAPI.getAppState(),
          exportBackground: true,
          viewBackgroundColor: '#ffffff',
          exportPadding: 20,
          exportScale: 1,
          exportEmbedScene: false,
        },
        files: excalidrawAPI.getFiles() || {},
        getDimensions: (width, height) => {
          return {
            width: Math.max(width, 800),
            height: Math.max(height, 600),
          }
        },
      })

      // Verificar se o canvas foi criado corretamente
      if (!canvas || canvas.width === 0 || canvas.height === 0) {
        throw new Error('Canvas de exportação inválido')
      }

      console.log('Canvas exportado:', {
        width: canvas.width,
        height: canvas.height,
      })
      downloadCanvas(canvas, 'storyboard')
    } catch (error) {
      console.error('Erro ao exportar:', error)

      // Método alternativo usando screenshot
      try {
        await exportUsingScreenshot()
      } catch (screenshotError) {
        console.error('Erro no screenshot:', screenshotError)
        alert(
          'Erro ao exportar a imagem. Verifique se há elementos desenhados no canvas.',
        )
      }
    } finally {
      setIsExporting(false)
    }
  }, [excalidrawAPI])

  // Função auxiliar para download
  const downloadCanvas = (canvas, filename) => {
    try {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            alert('Erro ao gerar imagem')
            return
          }

          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.download = `${filename}-${new Date().toISOString().slice(0, 10)}.png`
          link.href = url
          link.style.display = 'none'

          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)

          // Cleanup
          setTimeout(() => URL.revokeObjectURL(url), 100)

          console.log('✅ Exportação realizada com sucesso!')
        },
        'image/png',
        0.95,
      )
    } catch (error) {
      console.error('Erro no download:', error)
      alert('Erro ao fazer download da imagem')
    }
  }

  // Configuração inicial
  const initialData = {
    elements: [],
    appState: {
      viewBackgroundColor: '#ffffff',
      currentItemStrokeColor: selectedColor,
      currentItemBackgroundColor: 'transparent',
      currentItemStrokeWidth: strokeWidth,
      currentItemRoughness: 1,
      currentItemOpacity: 100,
      gridSize: null,
      zoom: { value: 1 },
    },
  }

  const toolButtons = [
    { id: 'selection', icon: MousePointer, label: 'Seleção' },
    { id: 'freedraw', icon: Pencil, label: 'Desenho Livre' },
    { id: 'rectangle', icon: Square, label: 'Retângulo' },
    { id: 'ellipse', icon: Circle, label: 'Círculo' },
    { id: 'diamond', icon: Triangle, label: 'Losango' },
    { id: 'text', icon: Type, label: 'Texto' },
    { id: 'eraser', icon: Eraser, label: 'Borracha' },
  ]

  return (
    <div className="w-full h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Barra de Ferramentas */}
      <div className="bg-card border-b border-border p-2 shadow-sm flex-shrink-0 z-10">
        <section className="flex items-center justify-between gap-2 flex-wrap">
          {/* Ferramentas de Desenho */}
          <div className="flex items-center gap-1">
            {toolButtons.map(({ id, icon: Icon, label }) => (
              <Button
                key={id}
                variant={activeTool === id ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleToolChange(id)}
                className="h-10 w-10 p-0"
                title={label}
              >
                <Icon className="w-4 h-4" />
              </Button>
            ))}
          </div>

          {/* Separador */}
          <Separator orientation="vertical" className="h-8" />

          {/* Seletor de Cores */}
          <div className="flex items-center gap-1 text-muted-foreground">
            <Palette className="w-4 h-4" />
            <span className="text-sm">Cores:</span>

            <div className="flex gap-1">
              {predefinedColors.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorChange(color)}
                  className={`w-7 h-7 rounded-md border-2 transition-all hover:scale-110 ${
                    selectedColor === color
                      ? 'border-gray-900 shadow-md'
                      : 'border-gray-300 hover:border-gray-500'
                  }`}
                  style={{ backgroundColor: color }}
                  title={`Cor: ${color}`}
                />
              ))}
            </div>
            <Input
              type="color"
              value={selectedColor}
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-8 h-8 p-0 border-2 border-gray-300 rounded cursor-pointer"
              title="Seletor de cor personalizada"
            />
          </div>

          {/* Separador */}
          <Separator orientation="vertical" className="h-8" />

          {/* Espessura do Traço */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <Minus className="w-4 h-4" />
            <span className="text-sm">Espessura:</span>
            <Select
              value={strokeWidth.toString()}
              onValueChange={handleStrokeWidthChange}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1px</SelectItem>
                <SelectItem value="2">2px</SelectItem>
                <SelectItem value="4">4px</SelectItem>
                <SelectItem value="8">8px</SelectItem>
                <SelectItem value="12">12px</SelectItem>
                <SelectItem value="16">16px</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Separador */}
          <Separator orientation="vertical" className="h-8" />

          {/* Ações */}
          <section className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={deleteSelected}
              title="Deletar Selecionados"
            >
              <Trash2 className="size-4" />
            </Button>

            <Button
              variant="destructive"
              size="icon"
              onClick={clearAll}
              title="Limpar Tudo"
            >
              <RefreshCw className="size-4" />
            </Button>

            <Button
              variant="outline"
              onClick={exportAsImage}
              disabled={isExporting}
              title="Exportar como PNG"
            >
              <Download className="size-4" />
              {isExporting ? 'Exportando...' : 'Exportar'}
            </Button>
          </section>
        </section>
      </div>

      {/* Canvas do Excalidraw */}
      <div
        className="flex-1 relative"
        style={{ height: 'calc(100vh - 120px)' }}
      >
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
          excalidrawAPI={(api) => {
            setExcalidrawAPI(api)
            // Definir ferramenta inicial
            setTimeout(() => {
              api.setActiveTool({ type: 'selection' })
            }, 100)
          }}
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
        />
      </div>
    </div>
  )
}

export default Storyboards
