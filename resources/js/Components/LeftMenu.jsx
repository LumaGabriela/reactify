import { useState, useEffect } from "react"
import { Link, usePage } from "@inertiajs/react"
import { Grid, User, Squirrel, LogOut, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"

const LeftMenu = () => {
  const { props } = usePage()
  const user = props.auth.user

  const [theme, setTheme] = useState(() => (document.documentElement.classList.contains("dark") ? "dark" : "light"))

  const handleThemeToggle = () => {
    const isDark = document.documentElement.classList.toggle("dark")
    const newTheme = isDark ? "dark" : "light"
    localStorage.setItem("theme", newTheme)
    setTheme(newTheme)
  }

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const newTheme = document.documentElement.classList.contains("dark") ? "dark" : "light"
      setTheme(newTheme)
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => observer.disconnect()
  }, [])

  const items = [
    { name: "My Projects", url: "projects.index", icon: Grid },
    { name: "Profile", url: "profile.edit", icon: User },
    // { name: 'Settings', url: 'config', icon: Settings },
    { name: "Logout", url: "logout", icon: LogOut },
  ]

  const currentRoute = route().current()

  return (
    <div className="w-40 md:w-64 bg-background text-foreground border-r border-border flex flex-col h-screen z-10">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Squirrel className="size-8 text-primary" />
            <h1 className="text-xl font-bold m-0">Reactify</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleThemeToggle}
            className="inline-flex items-center justify-center p-2 rounded-full text-primary hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors duration-200"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Moon className="size-4" /> : <Sun className="size-4" />}
          </Button>
        </div>
      </div>

      {/* User Info Section */}
      <div className="p-3 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="size-10 bg-primary rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{user?.name || "User Name"}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email || "user@example.com"}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {items.map((item, index) => {
          const IconComponent = item.icon
          const isActive = currentRoute === item.url

          return (
            <Link
              key={index}
              href={route(item.url)}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <IconComponent className="h-5 w-5" />
              <span className="font-medium hidden md:inline">{item.name}</span>
              {item.badge && (
                <span className="ml-auto bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full hidden md:inline">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

export default LeftMenu
