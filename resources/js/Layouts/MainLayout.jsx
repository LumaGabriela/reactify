import React from 'react'
import LeftMenu from '../Components/LeftMenu'
import { useState, useEffect } from 'react'
import { usePage } from '@inertiajs/react'
import { toast } from 'sonner'
import { Link } from '@inertiajs/react'
import { Particles } from '@/components/magicui/particles'

const GuestLayout = ({ children }) => {
  return (
    <div className="guestlayout flex min-h-screen w-full flex-col items-center bg-background pt-6 sm:justify-center sm:pt-0">
      <Particles className="absolute inset-0 w-full h-full" />
      <div className="mb-12">
        <Link
          as={'button'}
          href="/"
          className="text-6xl font-bold text-primary mb-6 animate-fade-in-up"
        >
          Reactify
        </Link>
      </div>

      <div className="w-full overflow-hidden px-6 py-8 sm:max-w-md sm:rounded-xl  text-foreground">
        {children}
      </div>
    </div>
  )
}

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
      <main className="ml-16 flex-1 flex flex-col p-2 bg-background text-foreground items-center ">
        {children}
      </main>
    </div>
  )
}

const MainLayout = ({ children }) => {
  const user = usePage().props.auth.user
  return user ? (
    <AuthenticatedLayout>{children}</AuthenticatedLayout>
  ) : (
    <GuestLayout>{children}</GuestLayout>
  )
}

export default MainLayout
