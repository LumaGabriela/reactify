import { usePage } from "@inertiajs/react"
import React, { useState, useEffect } from "react"
import {
  Sun,
  Moon,
  Plus,
  MessageSquare,
  MoreVertical,
  Check,
  User,
} from "lucide-react"

const RightMenu = () => {
  const user = usePage().props.auth.user
  const teamMembers = [
    { id: 1, avatar: "/api/placeholder/24/24", color: "bg-pink-300" },
    { id: 2, avatar: "/api/placeholder/24/24", color: "bg-orange-300" },
    { id: 3, avatar: "/api/placeholder/24/24", color: "bg-green-400" },
    { id: 4, avatar: "/api/placeholder/24/24", color: "bg-pink-400" },
    { id: 5, avatar: "/api/placeholder/24/24", color: "bg-yellow-300" },
    { id: 6, avatar: "/api/placeholder/24/24", color: "bg-blue-300" },
  ]

  const messages = [
    {
      id: 1,
      name: "Samantha",
      message: "i added my new tasks",
      avatar: "/api/placeholder/36/36",
      color: "bg-pink-300",
      time: "9:34",
    },
    {
      id: 2,
      name: "John",
      message: "well done john",
      avatar: "/api/placeholder/36/36",
      color: "bg-red-300",
      checked: true,
    },
    {
      id: 3,
      name: "Alexander Purwoto",
      message: "we'll have a meeting at 9AM",
      avatar: "/api/placeholder/36/36",
      color: "bg-indigo-400",
      checked: true,
    },
  ]

  const [theme, setTheme] = useState(() =>
    document.documentElement.classList.contains("dark") ? "dark" : "light"
  )

  const handleThemeToggle = () => {
    const isDark = document.documentElement.classList.toggle("dark")
    const newTheme = isDark ? "dark" : "light"
    localStorage.setItem("theme", newTheme) // Save preference to localStorage
    setTheme(newTheme) // Update our component's state
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

  return (
    <div className="flex flex-col h-screen bg-gray-1 text-white max-w-sm ">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <User
              className="bg-violet-800/80 p-px rounded-full"
              size={32}
            />
          </div>
          <div>
            <h5 className="font-semibold">{user?.name}</h5>
            <p className="text-xs text-gray-400">{user?.email}</p>
          </div>
          {/* botao para alterar o tema */}
          <button
            onClick={handleThemeToggle}
            className="inline-flex items-center justify-center p-2 rounded-full text-orange-600 dark:text-indigo-300 bg-gray-800 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-colors duration-200"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Moon className="size-6" />
            ) : (
              <Sun className="size-6 " />
            )}
          </button>
        </div>
      </div>

      {/* Team members */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold">
            Team Member
            <span className="text-gray-400">(6)</span>
          </h4>
          <button className="rounded-full">
            <Plus className="h-6 w-6" />
          </button>
        </div>
        <div className="flex -space-x-2">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className={`${member.color} rounded-full p-0.5`}
            >
              <User />
            </div>
          ))}
        </div>
      </div>

      {/* Recent Messages */}
      <div className="flex-1 overflow-auto">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center text-indigo-400">
            <MessageSquare className="h-5 w-5 mr-2" />
            <span>Recent Messages</span>
          </div>
          <button>
            <MoreVertical className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <div className="px-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="rounded-xl border mb-2 px-2 flex items-center justify-between py-3 cursor-pointer"
            >
              <div className="flex items-center">
                <div className={`${msg.color} rounded-full p-0.5 mr-3`}>
                  <User
                    alt={msg.name}
                    className="rounded-full w-8 h-8"
                  />
                </div>
                <div>
                  <h5 className="font-medium">{msg.name}</h5>
                  <p className="text-xs text-gray-400">{msg.message}</p>
                </div>
              </div>
              {msg.time ? (
                <div className="bg-indigo-600 rounded-full px-2 py-0.5 text-xs">
                  {msg.time}
                </div>
              ) : msg.checked ? (
                <Check className="h-5 w-5 text-green-500" />
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default RightMenu
