import { useState, useEffect, useCallback, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Sparkles, Copy, ExternalLink, RefreshCw,
  Columns, Code2, Eye, Shield, Gauge, Check, Loader2, Save,
  Paperclip, PanelLeftClose, PanelLeftOpen, Send, Clock, Globe,
  ChevronRight, ChevronDown, PanelLeft, Menu, LogOut,
  LayoutDashboard, Plus, FolderOpen, Settings as SettingsIcon, Bell
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import Avatar from '../components/ui/Avatar'
import StylePresets from '../components/builder/StylePresets'
import PreviewPane from '../components/builder/PreviewPane'
import CodeView from '../components/builder/CodeView'
import FileTree from '../components/builder/FileTree'
import ChatBubble from '../components/builder/ChatBubble'
import SecurityScanner from '../components/builder/SecurityScanner'
import VersionHistory from '../components/builder/VersionHistory'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import ErrorBoundary from '../components/ui/ErrorBoundary'
import { useGemini } from '../hooks/useGemini'
import { useAuth } from '../hooks/useAuth'
import { useProjects } from '../hooks/useProjects'
import { CATEGORIES } from '../components/builder/CategoryBrowser'
import toast from 'react-hot-toast'

const VIEW_MODES = [
  { id: 'split', icon: Columns, label: 'Split View' },
  { id: 'code', icon: Code2, label: 'Code Only' },
  { id: 'preview', icon: Eye, label: 'Preview Only' },
]

export default function Builder() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { saveProject, publishProject, unpublishProject } = useProjects()
  const { files, setFiles, messages, isGenerating, error, generate, dailyCount, dailyLimit, setError } = useGemini()

  const [prompt, setPrompt] = useState('')
  const [style, setStyle] = useState('minimal')
  const [category, setCategory] = useState('')
  const [projectType, setProjectType] = useState('static') // 'static' | 'fullstack'
  
  const [viewMode, setViewMode] = useState('split')
  const [copied, setCopied] = useState(false)
  
  const [hasStarted, setHasStarted] = useState(false)
  const [leftCollapsed, setLeftCollapsed] = useState(false)
  
  const [activeFile, setActiveFile] = useState(null)
  
  // Project State Tracking for saving/publishing
  const [currentProject, setCurrentProject] = useState(null)
  const [publishModalOpen, setPublishModalOpen] = useState(false)
  const [securityScanOpen, setSecurityScanOpen] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState(260)
  const isResizing = useRef(false)
  
  const { profile, signOut } = useAuth()
  const chatScrollRef = useRef(null)

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/')
    } catch (err) {
      console.error('Sign out failed:', err)
    }
  }

  const NAV_ITEMS = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/builder', icon: Plus, label: 'New Project' },
    { to: '/dashboard?view=projects', icon: FolderOpen, label: 'My Projects' },
    { to: '/settings', icon: SettingsIcon, label: 'Settings' },
  ]

  // Populate from navigation state or existing project edits
  useEffect(() => {
    const s = location.state
    if (s?.prompt) setPrompt(s.prompt)
    if (s?.template) {
      setPrompt(s.template.prompt || '')
      setStyle(s.template.style || 'minimal')
      setCategory(s.template.category || '')
    }
    if (s?.project) {
      setHasStarted(true)
      setCurrentProject(s.project)
      setPrompt(s.project.prompt || '')
      setStyle(s.project.style || 'minimal')
      setCategory(s.project.category || '')
      setProjectType(s.project.type || 'static')
      
      try {
        const parsedFiles = JSON.parse(s.project.html_content)
        if (Array.isArray(parsedFiles)) {
          setFiles(parsedFiles)
          setActiveFile(parsedFiles[0])
        } else {
          // Fallback legacy static
          const fallbackFiles = [{ path: 'index.html', content: s.project.html_content }]
          setFiles(fallbackFiles)
          setActiveFile(fallbackFiles[0])
        }
      } catch (e) {
        // Fallback for non-JSON content (legacy static)
        const fallbackFiles = [{ path: 'index.html', content: s.project.html_content }]
        setFiles(fallbackFiles)
        setActiveFile(fallbackFiles[0])
      }
    }
  }, [location.state, setFiles])

  // Scroll chat to bottom on new messages
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight
    }
  }, [messages])

  // Set default active file when files arrive
  useEffect(() => {
    if (files && files.length > 0 && !activeFile) {
      setActiveFile(files[0])
    }
  }, [files, activeFile])

  // Handle errors
  useEffect(() => {
    if (error === 'no-key') { toast.error('Add your Gemini API key in Settings first'); setError(null) }
    else if (error === 'rate-limit') { toast.error('Rate limit reached — max 10 per hour'); setError(null) }
    else if (error === 'api-error') { toast.error('Generation failed'); setError(null) }
    else if (error === 'empty-prompt') { toast.error('Please describe your website'); setError(null) }
  }, [error, setError])

  const apiKey = (() => {
    try { return JSON.parse(localStorage.getItem('gemini_api_key') || '""') } catch { return '' }
  })()

  // Generate Flow
  const handleGenerate = useCallback(async () => {
    if (!apiKey) {
      toast.error(<span>Add your API key in <button className="underline font-medium" onClick={() => navigate('/settings')}>Settings</button></span>)
      return
    }
    if (!prompt.trim()) { toast.error('Please enter a prompt'); return }

    setHasStarted(true)
    const result = await generate(apiKey, prompt, projectType)
    
    if (result && result.files) {
      toast.success('Generated successfully', { id: 'gen-success' })
      setActiveFile(result.files[0])
      setPrompt('') // clear input for follow-up
      
      // Auto-save flow
      if (user) {
        setIsSaving(true)
        try {
          const savedData = await saveProject({
            id: currentProject?.id,
            user_id: user.id,
            name: currentProject?.name && currentProject.name !== 'New Project' 
                  ? currentProject.name 
                  : (prompt.substring(0, 30) || 'Untitled Project'),
            prompt: currentProject?.prompt || prompt, 
            style,
            category,
            type: projectType,
            html_content: JSON.stringify(result.files),
            is_public: currentProject?.is_public || false
          })
          setCurrentProject(savedData)
          toast.success('Saved ✓', { id: 'auto-save' })
        } catch (e) {
          toast.error('Failed to auto-save project')
        } finally {
          setIsSaving(false)
        }
      }
    }
  }, [apiKey, prompt, style, category, projectType, generate, navigate, saveProject, currentProject, user])

  const handleManualSave = useCallback(async () => {
    if (!user) {
      toast.error('Sign in to save your project');
      return;
    }
    const tid = toast.loading('Saving...');
    setIsSaving(true);
    try {
      const savedData = await saveProject({
        id: currentProject?.id,
        user_id: user.id,
        name: currentProject?.name && currentProject.name !== 'New Project' 
              ? currentProject.name 
              : (prompt && prompt.length > 5 ? prompt.substring(0, 30) : 'Untitled Project'),
        prompt: currentProject?.prompt || prompt, 
        style,
        category,
        type: projectType,
        html_content: JSON.stringify(files),
        is_public: currentProject?.is_public || false
      });
      setCurrentProject(savedData);
      toast.success('Saved ✓', { id: tid });
    } catch (e) {
      toast.error('Failed to save', { id: tid });
    } finally {
      setIsSaving(false);
    }
  }, [user, currentProject, prompt, style, category, projectType, files, saveProject]);


  const handleCopy = async () => {
    if (!activeFile) return
    await navigator.clipboard.writeText(activeFile.content)
    setCopied(true)
    toast.success('Code copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleOpenNewTab = () => {
    if (!activeFile || projectType === 'fullstack') return
    const blob = new Blob([activeFile.content], { type: 'text/html' })
    window.open(URL.createObjectURL(blob), '_blank')
  }

  const handlePublishToggle = async () => {
    if (!currentProject) return
    if (currentProject.is_public) {
      const data = await unpublishProject(currentProject.id)
      setCurrentProject(data)
      toast.success('Project unpublished')
    } else {
      const data = await publishProject(currentProject.id)
      setCurrentProject(data)
      toast.success('Project published')
    }
  }

  const getPrimaryHTML = () => {
    if (!files || files.length === 0) return ''
    if (projectType === 'static') return files[0].content
    // For fullstack, we return a fallback UI unless they view code
  const indexHtml = files.find(f => f.path.includes('index.html'))
    return indexHtml ? indexHtml.content : '<html><body><div style="font-family:sans-serif;padding:2rem;">Deploy to see live preview for Full Stack apps.</div></body></html>'
  }

  // Sidebar resize logic
  const handleMouseMove = useCallback((e) => {
    if (!isResizing.current) return
    const newWidth = e.clientX - (leftCollapsed ? 0 : 400) // Offset for the main left chat sidebar
    if (newWidth > 160 && newWidth < 600) {
      setSidebarWidth(newWidth)
    }
  }, [leftCollapsed])

  const stopResizing = useCallback(() => {
    isResizing.current = false
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', stopResizing)
    document.body.style.cursor = 'default'
    document.body.style.userSelect = 'auto'
  }, [handleMouseMove])

  const startResizing = useCallback((e) => {
    isResizing.current = true
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', stopResizing)
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }, [handleMouseMove, stopResizing])

  // Cleanup effect
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', stopResizing)
    }
  }, [handleMouseMove, stopResizing])

  return (
    <div className="h-screen bg-bg-secondary overflow-hidden">
      <div className="flex flex-col min-w-0 h-full overflow-hidden">
        {/* TOP BAR */}
        <header className="bg-white border-b border-border px-6 py-3 flex items-center justify-between sticky top-0 z-30 shrink-0 shadow-sm">
          <div className="flex items-center gap-4">
            {/* HOVER DROPDOWN MENU */}
            <div 
              className="relative"
              onMouseEnter={() => setMenuOpen(true)}
              onMouseLeave={() => setMenuOpen(false)}
            >
              <button 
                className={`p-2 rounded-lg transition-all ${menuOpen ? 'bg-primary text-white' : 'bg-bg-secondary text-text-muted hover:text-primary border border-border'}`}
              >
                <Menu size={20} />
              </button>

              {/* DROPDOWN PANEL */}
              <div className={`absolute top-full left-0 mt-1 w-64 bg-primary text-white rounded-xl shadow-2xl border border-white/10 py-4 z-50 transition-all duration-300 origin-top-left ${menuOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}>
                 <div className="px-5 pb-4 border-b border-white/10 mb-2">
                    <div className="flex items-center gap-3">
                       <Avatar name={profile?.name} src={profile?.avatar} size="sm" className="bg-white/10" />
                       <div className="min-w-0">
                          <p className="text-sm font-bold truncate">{profile?.name || 'User'}</p>
                          <p className="text-[10px] text-white/50 truncate">{profile?.email}</p>
                       </div>
                    </div>
                 </div>
                 
                 <nav className="px-2 space-y-1">
                    {NAV_ITEMS.map((item) => (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                            isActive ? 'bg-white/15 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'
                          }`
                        }
                      >
                        <item.icon size={18} />
                        <span>{item.label}</span>
                      </NavLink>
                    ))}
                 </nav>

                 <div className="mt-4 pt-2 border-t border-white/10 px-2">
                    <button 
                      onClick={handleSignOut}
                      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-white/40 hover:text-white/80 hover:bg-white/5 transition-all"
                    >
                       <LogOut size={18} />
                       <span>Sign Out</span>
                    </button>
                 </div>
              </div>
            </div>

            <div className="w-px h-6 bg-border mx-1" />
            
            <button 
              onClick={() => setLeftCollapsed(!leftCollapsed)}
              className={`p-1.5 rounded-lg transition-all flex items-center gap-2 ${
                leftCollapsed 
                  ? 'bg-accent/10 text-accent border border-accent/20' 
                  : 'text-text-muted hover:bg-bg-secondary border border-transparent'
              }`}
              title={leftCollapsed ? "Open Chat" : "Collapse Chat"}
            >
              {leftCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
              {leftCollapsed && <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline">Open Prompt</span>}
            </button>
            <h1 className="text-sm font-semibold text-primary ml-2 truncate max-w-[200px]">
              {currentProject?.name || 'New Project'}
            </h1>
            {currentProject?.is_public && <Badge variant="success">Published</Badge>}
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-secondary border border-border text-xs hidden sm:flex">
              <Gauge size={14} className="text-text-light" />
              <span className="font-semibold text-primary">{dailyCount}</span>
              <span className="text-text-light">/ {dailyLimit} today</span>
            </div>
          </div>
        </header>

        {/* Main builder split layout */}
        <div className="flex-1 flex overflow-hidden relative">
          
          {/* Left Panel - Chat & Input */}
          <div 
            className={`shrink-0 border-r border-border bg-white flex flex-col transition-all duration-300 ${
              leftCollapsed ? 'w-0 overflow-hidden opacity-0' : 'w-[400px]'
            }`}
          >
            {/* Intro Config Options (hides after start) */}
            {!hasStarted && (
              <div className="p-6 border-b border-border space-y-6 shrink-0 overflow-y-auto max-h-[50%]">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2 block">Generation Type</label>
                  <div className="flex gap-2 p-1 bg-bg-secondary border border-border rounded-lg">
                    <button 
                      className={`flex-1 py-1.5 text-xs font-medium rounded transition-colors ${projectType === 'static' ? 'bg-white shadow-sm text-primary' : 'text-text-muted hover:text-primary'}`}
                      onClick={() => setProjectType('static')}
                    >Static Website</button>
                    <button 
                      className={`flex-1 py-1.5 text-xs font-medium rounded transition-colors ${projectType === 'fullstack' ? 'bg-white shadow-sm text-primary' : 'text-text-muted hover:text-primary'}`}
                      onClick={() => setProjectType('fullstack')}
                    >Full Stack App</button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2 block">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                  >
                    <option value="">All Categories</option>
                    {CATEGORIES.map(c => (
                      <option key={c.id} value={c.label}>{c.icon} {c.label}</option>
                    ))}
                  </select>
                </div>

                <StylePresets selected={style} onSelect={setStyle} />
              </div>
            )}

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-6" ref={chatScrollRef}>
              {messages.length === 0 && hasStarted && !isGenerating && (
                <div className="text-center text-sm text-text-muted py-8">Chat history is empty</div>
              )}
              {messages.map((msg, idx) => (
                <ChatBubble key={idx} role={msg.role} content={msg.content} />
              ))}
              {isGenerating && (
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
                    <Loader2 size={16} className="animate-spin" />
                  </div>
                  <div className="px-4 py-2 bg-bg-secondary rounded-2xl rounded-tl-sm text-sm text-text-muted animate-pulse">
                    Thinking... Building your project...
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-border shrink-0">
              <div className="relative border border-border rounded-xl focus-within:ring-2 focus-within:ring-accent/20 focus-within:border-accent transition-all bg-bg-secondary">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={isGenerating}
                  placeholder={hasStarted ? "Ask to change colors, add sections, etc..." : "Describe what you want to build..."}
                  className="w-full px-4 py-3 bg-transparent text-sm min-h-[80px] focus:outline-none resize-none disabled:opacity-50"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleGenerate()
                    }
                  }}
                />
                <div className="absolute left-2 bottom-2">
                  <button className="p-1.5 rounded-lg text-text-light hover:text-text hover:bg-black/5 transition-colors group relative">
                    <Paperclip size={18} />
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none">Attach files (Coming soon)</span>
                  </button>
                </div>
                <div className="absolute right-2 bottom-2">
                  <Button size="sm" variant="primary" className="!p-2 rounded-lg" disabled={isGenerating || !prompt.trim()} onClick={handleGenerate}>
                    <Send size={16} className="ml-0.5" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3 px-1">
                <Shield size={12} className="text-success" />
                <span className="text-[10px] font-medium text-emerald-700 uppercase tracking-wide">Local Processing Active</span>
              </div>
            </div>
          </div>

          {/* Right Panel - Content Area */}
          <div className="flex-1 flex flex-col min-w-0 bg-bg-secondary overflow-hidden relative">
              {/* Toolbar */}
              <div className="bg-white border-b border-border px-4 py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-bg-secondary rounded-lg p-1 border border-border shrink-0">
                    {VIEW_MODES.map(m => (
                      <button
                        key={m.id}
                        onClick={() => setViewMode(m.id)}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                          viewMode === m.id ? 'bg-white text-primary shadow-sm' : 'text-text-muted hover:text-primary'
                        }`}
                      >
                        <m.icon size={14} /> <span className="hidden xl:inline">{m.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {files.length > 0 && (
                  <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto">
                    <Button variant="ghost" size="sm" onClick={() => setSecurityScanOpen(true)}>
                      <Shield size={14} /> <span className="hidden lg:inline">Security</span>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setHistoryOpen(true)}>
                      <Clock size={14} /> <span className="hidden lg:inline">History</span>
                    </Button>
                    <div className="w-px h-4 bg-border mx-1" />
                    <Button variant="ghost" size="sm" onClick={handleCopy}>
                      {copied ? <><Check size={14} className="text-success" /> Copied</> : <><Copy size={14} /> Copy</>}
                    </Button>
                    <div className="w-px h-4 bg-border mx-1" />
                    <Button variant="ghost" size="sm" onClick={handleManualSave} disabled={isSaving}>
                      {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} 
                      <span className="hidden lg:inline ml-1">Save</span>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setPublishModalOpen(true)}>
                      <Globe size={14} /> <span className="hidden lg:inline ml-1">Publish</span>
                    </Button>
                    {projectType === 'static' && (
                      <Button variant="ghost" size="sm" onClick={handleOpenNewTab}><ExternalLink size={14} /></Button>
                    )}
                  </div>
                )}
              </div>

              {/* Views */}
              <div className="flex-1 flex overflow-hidden p-4 gap-4">
                {isGenerating && files.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center">
                    <Loader2 size={32} className="text-accent animate-spin mb-4" />
                    <p className="text-primary font-medium">Scaffolding your project...</p>
                  </div>
                ) : files.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center border-2 border-dashed border-border rounded-xl bg-white">
                    <div className="text-center">
                      <Sparkles size={32} className="mx-auto mb-4 text-accent/20" />
                      <p className="text-text-muted">Describe a project in the left panel to begin</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {(viewMode === 'split' || viewMode === 'code') && (
                      <div className="flex-1 flex overflow-hidden gap-4">
                        {files.length > 0 && (
                          <>
                            <FileTree 
                              files={files} 
                              activeFile={activeFile} 
                              onSelectFile={setActiveFile} 
                              leftCollapsed={leftCollapsed}
                              setLeftCollapsed={setLeftCollapsed}
                              width={sidebarWidth}
                            />
                            <div 
                              onMouseDown={startResizing}
                              className="w-1.5 -ml-1.5 relative z-10 cursor-col-resize hover:bg-accent/20 transition-colors active:bg-accent/40"
                              title="Drag to resize"
                            />
                          </>
                        )}
                        <ErrorBoundary>
                          <CodeView 
                            code={activeFile?.content || ''} 
                            language={activeFile?.path.endsWith('.json') ? 'json' : (activeFile?.path.endsWith('.css') ? 'css' : 'html')} 
                            filename={activeFile?.path || 'index.html'}
                          />
                        </ErrorBoundary>
                      </div>
                    )}
                    {(viewMode === 'split' || viewMode === 'preview') && (
                      <ErrorBoundary>
                        <PreviewPane code={getPrimaryHTML()} type={projectType} />
                      </ErrorBoundary>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

      {/* Overlays */}
      <Modal isOpen={publishModalOpen} onClose={() => setPublishModalOpen(false)} title="Publish Project">
         <div className="p-8 text-center space-y-6">
            <Globe className="mx-auto text-accent" size={32} />
            {currentProject?.is_public ? (
               <>
                  <p className="text-sm text-text-muted">Your project is live and accessible to the public.</p>
                  <div className="p-4 bg-bg-secondary border border-border rounded-lg break-all text-sm font-mono text-primary">
                    {`${window.location.origin}/p/${currentProject.slug}`}
                  </div>
                  <div className="flex gap-4">
                    <Button variant="secondary" fullWidth onClick={() => navigator.clipboard.writeText(`${window.location.origin}/p/${currentProject.slug}`)}>Copy Link</Button>
                    <Button variant="outline" className="text-red-500 border-red-100" fullWidth onClick={handlePublishToggle}>Unpublish</Button>
                  </div>
               </>
            ) : (
               <>
                  <p className="text-sm text-text-muted">Publishing creates a unique link for anyone to visit your project.</p>
                  <Button variant="primary" fullWidth size="lg" onClick={handlePublishToggle}>Publish to Web</Button>
               </>
            )}
         </div>
      </Modal>

      <SecurityScanner code={getPrimaryHTML()} open={securityScanOpen} onOpenChange={setSecurityScanOpen} />
      
      <div className={`fixed top-0 right-0 h-screen w-80 bg-white shadow-2xl z-50 transition-transform duration-300 ${historyOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <VersionHistory 
          projectId={currentProject?.id} 
          onClose={() => setHistoryOpen(false)}
          onRestore={(str) => {
            try {
              const res = JSON.parse(str)
              setFiles(res)
              setActiveFile(res[0])
            } catch (e) {
              setFiles([{ path: 'index.html', content: str }])
              setActiveFile({ path: 'index.html', content: str })
            }
            setHistoryOpen(false)
            toast.success('Restored previous version')
          }}
        />
      </div>
      {historyOpen && <div className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm" onClick={() => setHistoryOpen(false)} />}
    </div>
  )
}
