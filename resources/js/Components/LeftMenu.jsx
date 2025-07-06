import { useState, useEffect } from "react"
import { usePage, router } from "@inertiajs/react"
import { Grid, User, Squirrel, LogOut, Sun, Moon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion" // 1. Importar componentes do Accordion

const LeftMenu = () => {
  const { props } = usePage()
  const user = props.auth.user
  const projects = props.projects || []
  const [theme, setTheme] = useState(() =>
    document.documentElement.classList.contains("dark") ? "dark" : "light"
  )

  // O seu código para o tema permanece o mesmo...
  const handleThemeToggle = () => {
    const isDark = document.documentElement.classList.toggle("dark")
    const newTheme = isDark ? "dark" : "light"
    localStorage.setItem("theme", newTheme)
    setTheme(newTheme)
  }

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const newTheme = document.documentElement.classList.contains("dark")
        ? "dark"
        : "light"
      setTheme(newTheme)
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })
    return () => observer.disconnect()
  }, [])


  // 2. Removemos "My Projects" do array principal para tratá-lo separadamente
  const menuItems = [
    { name: "Profile", url: "profile.edit", icon: User },
    { name: "Logout", url: "logout", icon: LogOut },
  ]
  
  // Lógica para o estado ativo
  const currentRouteName = route().current()
  const currentProjectId = route().params.project // Pega o ID do projeto da URL, se existir

  const isProjectsSectionActive = currentRouteName && currentRouteName.startsWith('project');

  return (
    <div className="w-40 md:w-64 bg-background text-foreground border-r border-border flex flex-col h-screen z-10">
      {/* Header (sem alterações) */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Squirrel className="size-8 text-primary" />
            <h1 className="text-xl font-bold m-0">Reactify</h1>
          </div>
          <Button variant="ghost" size="icon" onClick={handleThemeToggle} aria-label="Toggle theme">
            {theme === "dark" ? <Moon className="size-4" /> : <Sun className="size-4" />}
          </Button>
        </div>
      </div>

      {/* User Info Section (sem alterações) */}
      <div className="p-3 border-b border-border">
        {/* ... seu código de info do usuário ... */}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1">
        {/* 3. Accordion para os Projetos */}
        <Accordion type="single" collapsible defaultValue={isProjectsSectionActive ? "projects" : undefined}>
          <AccordionItem value="projects" className="border-b-0">
            <AccordionTrigger className={cn(
              "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors w-full hover:no-underline hover:bg-accent",
              isProjectsSectionActive && "bg-accent text-accent-foreground"
            )}>
              <div className="flex items-center space-x-3">
                 <Grid className="h-5 w-5" />
                 <span className="font-medium hidden md:inline">My Projects</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-1">
                <div className="flex flex-col space-y-1 pl-6">
                    {projects.map((project) => {
                        // O link do projeto está ativo se a rota for 'project.show' e o ID for o mesmo
                        const isProjectLinkActive = currentRouteName === 'project.show' && Number(currentProjectId) === project.id;
                        return (
                            <Button
                                key={project.id}
                                variant="ghost"
                                onClick={() => router.get(route('project.show', { project: project.id }))}
                                className={cn(
                                    "justify-start w-full text-left h-9 font-normal",
                                    isProjectLinkActive ? "text-primary" : "text-muted-foreground"
                                )}
                            >
                               {project.title}
                            </Button>
                        )
                    })}
                </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        {/* 4. Mapeando os outros itens do menu */}
        {menuItems.map((item, index) => {
          const IconComponent = item.icon
          const isActive = currentRouteName === item.url

          return (
            <Button
              key={index}
              variant="ghost"
              onClick={() => {
                if (item.url === "logout") {
                  router.post(route("logout"))
                  return
                }
                router.get(route(item.url))
              }}
              className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors w-full justify-start",
                  isActive && "bg-accent text-accent-foreground"
              )}
            >
              <IconComponent className="h-5 w-5" />
              <span className="font-medium hidden md:inline">{item.name}</span>
            </Button>
          )
        })}
      </nav>
    </div>
  )
}

export default LeftMenu