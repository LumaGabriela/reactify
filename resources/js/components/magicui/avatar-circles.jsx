/* eslint-disable @next/next/no-img-element */
'use client'
import { cn } from '@/lib/utils'
import { User } from 'lucide-react'

export const AvatarCircles = ({ numPeople, className, avatarUrls }) => {
  return (
    <div className={cn('z-10 flex -space-x-4 rtl:space-x-reverse', className)}>
      {avatarUrls.map((url, index) => (
        <a
          key={index}
          href={url.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {url.imageUrl ? (
            <img
              key={index}
              className="h-10 w-10 rounded-full border-2 bg-card border-border"
              src={url.imageUrl}
              width={40}
              height={40}
              alt={`Avatar ${index + 1}`}
            />
          ) : (
            <User className="size-10 rounded-full dark:text-slate-400 text-slate-800 border-border border bg-background" />
          )}
        </a>
      ))}
      {(numPeople ?? 0) > 0 && (
        <a
          className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-border bg-background text-center text-xs font-medium text-foreground hover:bg-accent transition-colors"
          href=""
        >
          +{numPeople}
        </a>
      )}
    </div>
  )
}
