import { File, Folder, ChevronRight, ChevronDown, Search, Save, Globe, Loader2, ChevronLeft } from 'lucide-react'
import { useState, useMemo } from 'react'

export default function FileTree({ 
  files, 
  activeFile, 
  onSelectFile,
  leftCollapsed,
  setLeftCollapsed,
  onSave,
  onPublish,
  isSaving,
  width = 256
}) {
  const [expandedFolders, setExpandedFolders] = useState(['src', 'public', 'supabase'])
  const [searchQuery, setSearchQuery] = useState('')

  const toggleFolder = (path) => {
    setExpandedFolders(prev => 
      prev.includes(path) ? prev.filter(p => p !== path) : [...prev, path]
    )
  }

  // Parse flat files into a nested tree structure
  const treeData = useMemo(() => {
    const root = { name: 'root', type: 'folder', children: {}, path: '' }
    
    files.forEach(file => {
      const parts = file.path.split('/')
      let current = root
      
      parts.forEach((part, index) => {
        const isLast = index === parts.length - 1
        if (!current.children[part]) {
          current.children[part] = {
            name: part,
            type: isLast ? 'file' : 'folder',
            children: {},
            path: parts.slice(0, index + 1).join('/'),
            fileData: isLast ? file : null
          }
        }
        current = current.children[part]
      })
    })
    
    return root
  }, [files])

  const renderNode = (node, depth = 0) => {
    const isFolder = node.type === 'folder'
    const isExpanded = expandedFolders.includes(node.path)
    const isActive = activeFile?.path === node.path
    
    // Filter by search query if any
    if (searchQuery && node.name !== 'root' && !node.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        // If it's a folder, check if any children match
        if (isFolder) {
            const hasMatchingChild = Object.values(node.children).some(child => 
                child.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                (child.type === 'folder' && folderHasMatch(child))
            )
            if (!hasMatchingChild) return null
        } else {
            return null
        }
    }

    function folderHasMatch(n) {
        return Object.values(n.children).some(c => 
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            (c.type === 'folder' && folderHasMatch(c))
        )
    }

    if (node.name === 'root') {
      return Object.values(node.children).map(child => renderNode(child, depth))
    }

    return (
      <div key={node.path} className="select-none">
        <button
          onClick={() => {
            if (isFolder) toggleFolder(node.path)
            else onSelectFile(node.fileData)
          }}
          style={{ paddingLeft: `${depth * 12 + 12}px` }}
          className={`w-full flex items-center gap-2 py-1.5 rounded-md text-xs text-left transition-all group ${
            isActive 
              ? 'bg-accent/10 text-accent font-medium' 
              : 'text-text-muted hover:bg-white hover:text-primary'
          }`}
        >
          <div className="flex items-center justify-center w-3 h-3">
            {isFolder && (isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />)}
          </div>
          
          {isFolder ? (
            <Folder size={14} className={`shrink-0 ${isExpanded ? 'text-accent' : 'text-text-light'}`} />
          ) : (
            <File size={14} className={`shrink-0 ${isActive ? 'text-accent' : 'text-text-light'}`} />
          )}
          
          <span className="truncate flex-1 tracking-tight">{node.name}</span>
          
          {isActive && (
             <div className="w-1 h-3 bg-accent rounded-full mr-1 shrink-0" />
          )}
        </button>

        {isFolder && isExpanded && (
          <div className="mt-0.5">
            {Object.values(node.children)
              .sort((a, b) => {
                // Sort folders first, then files alphabetically
                if (a.type !== b.type) return a.type === 'folder' ? -1 : 1
                return a.name.localeCompare(b.name)
              })
              .map(child => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  if (!files || files.length === 0) return null

  return (
    <div 
      className="border-r border-border bg-[#f8fafc] flex flex-col shrink-0 overflow-hidden"
      style={{ width: `${width}px` }}
    >
      {/* Header with Search & Controls */}
      <div className="p-4 space-y-3 shrink-0 border-b border-border bg-white shadow-sm">
        <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Code Management</h3>
            <span className="text-[10px] bg-bg-secondary px-1.5 py-0.5 rounded border border-border text-text-light">{files.length}</span>
        </div>
        
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-light" />
          <input 
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-bg-secondary border border-border rounded-lg pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      {/* Tree Content */}
      <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
        {renderNode(treeData)}
      </div>
    </div>
  )
}
