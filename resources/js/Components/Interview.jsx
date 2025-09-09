import React, { useState, useRef } from 'react'
import { router } from '@inertiajs/react'
import {
  UploadCloud,
  FileText,
  Mic,
  Film,
  Loader2,
  AlertTriangle,
  Trash2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const InterviewListItem = ({ interview }) => {
  const handleDelete = (e) => {
    e.preventDefault()

    if (confirm('Tem certeza de que deseja excluir esta entrevista?')) {
      router.delete(route('interview.destroy', interview.id), {
        preserveScroll: true,
        onSuccess: () => {
          toast.success('Entrevista excluída com sucesso.')
        },
        onError: (errors) => {
          console.error('Erro ao excluir:', errors)
          toast.error('Ocorreu um erro ao excluir a entrevista.')
        },
      })
    }
  }

  const getFileIcon = (fileName) => {
    if (/\.(mp3|wav|ogg|m4a)$/i.test(fileName)) {
      return <Mic className="h-5 w-5 flex-shrink-0 text-blue-500" />
    }
    if (/\.(mp4|mov|avi|webm)$/i.test(fileName)) {
      return <Film className="h-5 w-5 flex-shrink-0 text-purple-500" />
    }
    if (/\.(txt|md|doc|docx|pdf)$/i.test(fileName)) {
      return <FileText className="h-5 w-5 flex-shrink-0 text-gray-500" />
    }
    return <FileText className="h-5 w-5 flex-shrink-0 text-gray-400" />
  }

  return (
    <div className="flex items-center justify-between rounded-md bg-background p-3 transition-colors hover:bg-muted/80">
      <a
        href={interview.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-1 items-center gap-3 truncate"
      >
        {getFileIcon(interview.file_name)}
        <span className="flex-1 truncate text-sm font-medium text-foreground">
          {interview.file_name}
        </span>
      </a>
      <button
        onClick={handleDelete}
        className="ml-4 text-destructive opacity-60 transition-opacity hover:opacity-100"
        title="Excluir Entrevista"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  )
}

const InterviewUploadCard = ({
  projectId,
  interviews = [],
  className = '',
}) => {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setIsUploading(true)
    setError(null)
    setUploadProgress(0)

    router.post(
      route('project.interviews.store', projectId),
      {
        interview: file,
      },
      {
        onProgress: (progress) => {
          setUploadProgress(progress.percentage)
        },
        onSuccess: () => {
          setIsUploading(false)
          if (fileInputRef.current) {
            fileInputRef.current.value = ''
          }
        },
        onError: (errors) => {
          const errorMessage =
            errors.interview || 'Ocorreu um erro. Tente novamente.'
          setError(errorMessage)
          toast.error(errorMessage)
          setIsUploading(false)
          if (fileInputRef.current) {
            fileInputRef.current.value = ''
          }
        },
        onFinish: () => {
          setIsUploading(false)
        },
      },
    )
  }

  return (
    <div
      className={`${className}  rounded-lg border-t-4 border-t-primary bg-card p-4 shadow-lg transition-all duration-300 hover:shadow-xl`}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h3 className="flex items-center text-lg font-bold text-card-foreground">
          <Mic className="mr-2 h-5 w-5 text-primary" />
          Entrevistas
        </h3>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          {isUploading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <UploadCloud className="mr-2 h-4 w-4" />
          )}
          {isUploading
            ? `Enviando... ${uploadProgress}%`
            : 'Carregar Entrevista'}
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="audio/*,video/*,text/*,.pdf,.doc,.docx"
        />
      </div>

      {error && (
        <div className="mb-4 flex items-center rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          <AlertTriangle className="mr-2 h-4 w-4" />
          {error}
        </div>
      )}

      <div className="mt-2 space-y-2">
        {interviews.length > 0 ? (
          interviews.map((interview) => (
            <InterviewListItem key={interview.id} interview={interview} />
          ))
        ) : (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Nenhuma entrevista carregada ainda.
          </div>
        )}
      </div>
    </div>
  )
}

export default InterviewUploadCard
