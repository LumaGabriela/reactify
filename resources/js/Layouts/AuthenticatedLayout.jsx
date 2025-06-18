import React from "react"
import LeftMenu from "../Components/LeftMenu"
import RightMenu from "../Components/RightMenu"
import { useState, useEffect } from "react"
import { usePage } from "@inertiajs/react"
import { toast } from "sonner"
const AuthenticatedLayout = ({ children }) => {
  const { message, status, flash_key } = usePage().props.flash

  useEffect(() => {
    console.log(message, status)

    if (!message || !status) return

    switch (status) {
      case "success":
        toast.success(message)
        break
      case "error":
        toast.error(message)
        break
      case "warning":
        toast.warning(message)
        break
      case "info":
        toast.info(message)
        break
      default:
        toast(message)
        break
    }
  }, [flash_key])
  return (
    <div className="flex justify-between min-h-screen bg-gray-1 w-min-full">
      <LeftMenu />
      {children}
      <RightMenu />
    </div>
  )
}
export default AuthenticatedLayout
