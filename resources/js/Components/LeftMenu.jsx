import { useState, useEffect } from 'react'
import { usePage, router, Link } from '@inertiajs/react'
import {
  Grid,
  User,
  Squirrel,
  LogOut,
  Sun,
  Moon,
  Home,
  Bell,
  ChevronsRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

const LeftMenu = () => {
  const [isHovered, setIsHovered] = useState(false)
  const { props } = usePage()
  const user = props.auth.user
  const notifications = props.auth.notifications || []
  const projects = props.auth.projects || []
  const [theme, setTheme] = useState(() =>
    document.documentElement.classList.contains('dark') ? 'dark' : 'light',
  )

  const cardVariants = {
    hidden: {
      opacity: 0,
      x: -90,
    },
    visible: {
      opacity: 1,
      x: 0,
    },
    transition: {
      duration: 0.22,
    },
  }
  const handleThemeToggle = () => {
    const isDark = document.documentElement.classList.toggle('dark')
    const newTheme = isDark ? 'dark' : 'light'
    localStorage.setItem('theme', newTheme)
    setTheme(newTheme)
  }

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const newTheme = document.documentElement.classList.contains('dark')
        ? 'dark'
        : 'light'
      setTheme(newTheme)
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })
    return () => observer.disconnect()
  }, [])

  const menuItems = [
    {
      name: 'Notifications',
      url: 'notifications.index',
      icon: Bell,
      badge: notifications.length,
    },
    { name: 'Profile', url: 'profile.edit', icon: User },
    { name: 'Logout', url: 'logout', icon: LogOut },
  ]
  const projectPages = [
    {
      name: 'Inception',
      url: 'inception',
    },
    {
      name: 'Story Discovery',
      url: 'story-discovery',
    },
    {
      name: 'Refining',
      url: 'refining',
    },
    {
      name: 'Modeling',
      url: 'modeling',
    },
    {
      name: 'Backlog',
      url: 'backlog',
    },
  ]

  const currentRouteName = route().current()
  const currentProjectId = route().params.project

  const isProjectsSectionActive =
    currentRouteName &&
    currentRouteName.startsWith('project') &&
    !route().current('projects.index')

  useEffect(() => {
    console.log(props)
  }, [props])

  return (
    <AnimatePresence>
      <motion.aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        animate={{ opacity: 1, width: isHovered ? '14rem' : '4rem' }}
        transition={{ duration: 0.3 }}
        className={
          'fixed bg-background text-foreground border-r border-border flex flex-col min-h-screen z-50'
        }
      >
        {/* Header */}
        {isHovered ? (
          <motion.header
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={cardVariants.transition}
            className="p-4 h-16"
          >
            <div className="flex items-center justify-between">
              {/* link para dasboard */}
              <Link
                as="div"
                className="flex items-center gap-3 cursor-pointer"
                href={route('dashboard')}
              >
                <Squirrel className="size-8 text-primary" />
                <h1
                  className={cn(
                    'text-xl font-bold my-0 mx-2',
                    isHovered ? '' : 'hidden',
                  )}
                >
                  Reactify
                </h1>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleThemeToggle}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Moon className="size-4" />
                ) : (
                  <Sun className="size-4" />
                )}
              </Button>
            </div>
          </motion.header>
        ) : (
          <motion.div
            variants={cardVariants}
            initial="visible"
            animate="visible"
            exit="hidden"
            transition={cardVariants.transition}
            className="w-full p-4 h-16 flex items-center justify-center"
          >
            <ChevronsRight className="size-5 text-foreground" />
          </motion.div>
        )}

        {/* User Info Section */}

        <section className="p-2 flex gap-3 items-center border-y border-border">
          <div className="size-10 z-10 bg-primary rounded-full flex-shrink-0 flex items-center justify-center">
            {user?.provider_avatar ? (
              <img
                src={user.provider_avatar}
                alt="User Avatar"
                className="size-full rounded-full object-contain"
              />
            ) : (
              <User className="size-8 text-primary-foreground" />
            )}
          </div>
          {isHovered && (
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={cardVariants.transition}
              className=""
            >
              <p className="text-sm font-medium text-foreground truncate">
                {user?.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email}
              </p>
            </motion.div>
          )}
        </section>

        {/* Navigation */}
        {isHovered && (
          <motion.nav
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={cardVariants.transition}
            className="flex-1 p-2 space-y-1"
          >
            {/* Botão Home/Dashboard */}
            <Button
              variant="ghost"
              onClick={() => router.get(route('dashboard'))}
              className={cn(
                'flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors w-full justify-start',
                route().current('dashboard') &&
                  'bg-accent text-accent-foreground',
              )}
            >
              <Home className="size-5" />
              <span className="font-medium hidden md:inline">Home</span>
            </Button>

            {/* Accordion Principal para "My Projects" */}
            <Accordion
              type="single"
              collapsible
              defaultValue={isProjectsSectionActive ? 'projects' : undefined}
            >
              <AccordionItem value="projects" className="border-b-0">
                <AccordionTrigger
                  className={cn(
                    'flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors w-full hover:no-underline hover:bg-accent',
                    isProjectsSectionActive &&
                      'bg-accent text-accent-foreground',
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <Grid className="h-5 w-5" />
                    <span className="font-medium hidden md:inline truncate">
                      My Projects
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-1 pl-4">
                  {/* Mapeando cada projeto para um Accordion aninhado */}
                  {projects.map((project) => {
                    const isCurrentProject =
                      Number(currentProjectId) === project.id
                    return (
                      <Accordion
                        key={project.id}
                        type="single"
                        collapsible
                        defaultValue={
                          isCurrentProject ? `project-${project.id}` : undefined
                        }
                      >
                        <AccordionItem
                          value={`project-${project.id}`}
                          className="border-b-0"
                        >
                          <AccordionTrigger
                            className={cn(
                              'justify-start w-full text-left h-9 font-normal hover:no-underline rounded-md px-2 ',
                              isCurrentProject ? 'bg-primary ' : 'bg-accent ',
                            )}
                          >
                            <span
                              className={cn(
                                isCurrentProject
                                  ? 'text-primary-foreground '
                                  : 'text-foreground ',
                                ' truncate',
                              )}
                            >
                              {project.title}
                            </span>
                          </AccordionTrigger>
                          <AccordionContent className="pt-1">
                            <div className="flex flex-col space-y-1 pl-5">
                              {/* Link para a página principal do projeto */}
                              {projectPages.map((item, index) => (
                                <Button
                                  key={index}
                                  variant="secondary"
                                  onClick={() =>
                                    router.get(
                                      route('project.show', {
                                        project: project.id,
                                        page: item.url,
                                      }),
                                    )
                                  }
                                  className={cn(
                                    'justify-start w-full text-left h-8 font-normal',
                                    route().current('project.show') &&
                                      isCurrentProject &&
                                      route().params.page === item.url
                                      ? 'text-primary-foreground bg-primary'
                                      : 'text-muted-foreground',
                                  )}
                                >
                                  <span className="truncate">{item.name}</span>
                                </Button>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    )
                  })}
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Outros itens do menu */}
            {menuItems.map((item, index) => {
              const IconComponent = item.icon
              const isActive = currentRouteName === item.url
              return (
                <Button
                  key={index}
                  variant="ghost"
                  onClick={() => {
                    if (item.url === 'logout') {
                      router.post(route('logout'))
                      return
                    }
                    router.get(route(item.url))
                  }}
                  className={cn(
                    'flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors w-full justify-start',
                    isActive && 'bg-accent text-accent-foreground',
                  )}
                >
                  <IconComponent className="size-5" />
                  <span className="font-medium hidden md:inline">
                    {item.name}
                  </span>
                  {item.badge && <Badge className="ml-2">{item.badge}</Badge>}
                </Button>
              )
            })}
          </motion.nav>
        )}
      </motion.aside>
    </AnimatePresence>
  )
}

export default LeftMenu
