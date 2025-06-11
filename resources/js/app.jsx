import "../css/app.css"
import "bootstrap/dist/css/bootstrap.min.css"
import React from "react"
import "./bootstrap"
import { createInertiaApp } from "@inertiajs/react"
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers"
import { createRoot } from "react-dom/client"
import { configureEcho } from "@laravel/echo-react"
import { TooltipProvider } from "@radix-ui/react-tooltip"
configureEcho({
  broadcaster: "reverb",
})

createInertiaApp({
  title: (title) => `${title}`,
  resolve: (name) =>
    resolvePageComponent(
      `./Pages/${name}.jsx`,
      import.meta.glob("./Pages/**/*.jsx")
    ),
  eager: true,
  setup({ el, App, props }) {
    const root = createRoot(el)
    root.render(
      <TooltipProvider>
        <App {...props} />
      </TooltipProvider>
    )
  },
  progress: {
    color: "transparent",
  },
})
