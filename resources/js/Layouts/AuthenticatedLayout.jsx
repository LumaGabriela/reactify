import React from 'react'
import LeftMenu from '../Components/LeftMenu'
import { useState, useEffect } from 'react'
import { usePage } from '@inertiajs/react'
import { toast } from 'sonner'
const AuthenticatedLayout = ({ children }) => {
  const { message, status, flash_key } = usePage().props.flash

  useEffect(() => {
    if (!message || !status) return

    switch (status) {
      case 'success':
        toast.success(message)
        break
      case 'error':
        toast.error(message)
        break
      case 'warning':
        toast.warning(message)
        break
      case 'info':
        toast.info(message)
        break
      default:
        toast(message)
        break
    }
  }, [flash_key])
  return (
    <div className="flex justify-start min-h-screen bg-background w-min-full">
      <LeftMenu />
      {children}
    </div>
  )
}
export default AuthenticatedLayout
