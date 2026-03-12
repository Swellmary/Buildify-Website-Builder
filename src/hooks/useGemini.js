import { useState, useCallback } from 'react'
import { generateProject, checkRateLimit, incrementDailyCount, getDailyCount } from '../lib/gemini'

export function useGemini() {
  const [files, setFiles] = useState([]) // Array of { path, content }
  const [messages, setMessages] = useState([]) // Conversation history { role: 'user' | 'ai', content }
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState(null)
  const [dailyCount, setDailyCount] = useState(getDailyCount())

  const generate = useCallback(async (apiKey, userPrompt, projectType = 'static') => {
    if (!apiKey) {
      setError('no-key')
      return null
    }
    if (!userPrompt.trim()) {
      setError('empty-prompt')
      return null
    }
    if (!checkRateLimit()) {
      setError('rate-limit')
      return null
    }

    setIsGenerating(true)
    setError(null)

    // Add user message to history
    const history = [...messages, { role: 'user', content: userPrompt }]
    setMessages(history)

    try {
      const response = await generateProject(apiKey, history, projectType)
      
      // Update state with result
      setFiles(response.files || [])
      setMessages([...history, { role: 'ai', content: response.message }])
      
      const count = incrementDailyCount()
      setDailyCount(count)
      
      return response
    } catch (err) {
      console.error('Generation failed:', err)
      setError('api-error')
      // Important trick for conversational UI: pop the failed user message or leave it?
      // For now, let's leave it so they can read/edit, but we'll flag an error.
      return null
    } finally {
      setIsGenerating(false)
    }
  }, [messages]) // Depend on messages to send history

  const reset = useCallback(() => {
    setFiles([])
    setMessages([])
    setError(null)
  }, [])

  return {
    files,
    setFiles,
    messages,
    setMessages,
    isGenerating,
    error,
    setError,
    generate,
    reset,
    dailyCount,
    dailyLimit: 1500,
  }
}
