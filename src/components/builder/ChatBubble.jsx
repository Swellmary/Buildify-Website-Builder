import React from 'react'
import { Sparkles, User as UserIcon } from 'lucide-react'
import Avatar from '../ui/Avatar'
import { useAuth } from '../../hooks/useAuth'

export default function ChatBubble({ role, content, timestamp }) {
  const { profile } = useAuth()
  const isAI = role === 'ai'

  const formattedTime = (ts) => {
    if (!ts) return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    try {
      return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } catch {
      return ts
    }
  }

  return (
    <div className={`flex gap-3 mb-6 ${isAI ? '' : 'flex-row-reverse'}`}>
      <div className="shrink-0">
        {isAI ? (
          <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
            <Sparkles size={16} />
          </div>
        ) : (
          <Avatar name={profile?.name} src={profile?.avatar} size="sm" className="w-8 h-8 text-xs" />
        )}
      </div>

      <div className={`max-w-[85%] flex flex-col ${isAI ? 'items-start' : 'items-end'}`}>
        <div className="flex items-center gap-2 mb-1.5 px-1">
          <span className="text-xs font-semibold text-primary">
            {isAI ? 'Buildify AI' : profile?.name || 'You'}
          </span>
          <span className="text-[10px] text-text-light">{formattedTime(timestamp)}</span>
        </div>
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm ${
            isAI 
              ? 'bg-bg-secondary text-primary border border-border rounded-tl-sm' 
              : 'bg-accent text-white rounded-tr-sm'
          }`}
          style={{ whiteSpace: 'pre-wrap' }}
        >
          {content}
        </div>
      </div>
    </div>
  )
}
