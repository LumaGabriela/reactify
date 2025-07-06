import { Link } from "@inertiajs/react"

export default function GuestLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col items-center bg-background pt-6 sm:justify-center sm:pt-0">
      <div className="mb-12">
        <Link href="/">
          <h1 className="text-6xl font-bold text-white mb-6 animate-fade-in-up">
            <span className="text-purple-2">Reactify</span>
          </h1>
        </Link>
      </div>

      <div className="w-full overflow-hidden px-6 py-8 sm:max-w-md sm:rounded-xl">
        {children}
      </div>
    </div>
  )
}
