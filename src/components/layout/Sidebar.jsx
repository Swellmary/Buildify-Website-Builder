import { useState, createContext, useContext } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Plus, FolderOpen, LayoutTemplate,
  Settings as SettingsIcon, LogOut, Bell,
  PanelLeftClose, PanelLeftOpen
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import Avatar from '../ui/Avatar'

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/builder', icon: Plus, label: 'New Project' },
  { to: '/dashboard?view=projects', icon: FolderOpen, label: 'My Projects' },
  { to: '/settings', icon: SettingsIcon, label: 'Settings' },
]

// Context so pages can read collapsed state
const SidebarContext = createContext({ collapsed: false })
export const useSidebar = () => useContext(SidebarContext)

export default function Sidebar() {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/')
    } catch (err) {
      console.error('Sign out failed:', err)
    }
  }

  const w = collapsed ? 'w-[72px]' : 'w-64'

  return (
    <SidebarContext.Provider value={{ collapsed }}>
      <aside className={`${w} bg-primary min-h-screen flex flex-col shrink-0 transition-all duration-300 relative`}>

        {/* Toggle button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-white border border-border shadow-sm flex items-center justify-center text-text-muted hover:text-primary hover:shadow-md transition-all z-40"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <PanelLeftOpen size={12} /> : <PanelLeftClose size={12} />}
        </button>

        {/* User info + avatar + bell */}
        <div className={`border-b border-white/10 ${collapsed ? 'p-3' : 'p-5'}`}>
          <div className={`flex items-center ${collapsed ? 'flex-col gap-2' : 'gap-3'}`}>
            <Avatar
              name={profile?.name}
              src={profile?.avatar}
              size={collapsed ? 'sm' : 'md'}
              className="!bg-white/10 !text-white cursor-pointer shrink-0"
              onClick={() => navigate('/settings')}
            />
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white truncate">{profile?.name || 'User'}</p>
                <p className="text-xs text-white/50 truncate">{profile?.email || ''}</p>
              </div>
            )}
          </div>

          {/* Bell */}
          <button
            className={`relative rounded-lg hover:bg-white/10 transition-colors ${
              collapsed ? 'p-2 w-full flex justify-center mt-2' : 'p-2 mt-3 w-full flex items-center gap-3'
            }`}
          >
            <Bell size={16} className="text-white/50" />
            {!collapsed && <span className="text-xs text-white/50">Notifications</span>}
            {/* Notification dot */}
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-accent" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-0.5">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                `flex items-center rounded-lg text-sm font-medium transition-all duration-200 ${
                  collapsed
                    ? `justify-center p-2.5 ${isActive ? 'bg-white/15 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'}`
                    : `gap-3 px-3 py-2.5 ${isActive ? 'bg-white/15 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'}`
                }`
              }
            >
              <item.icon size={18} className="shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className={`border-t border-white/10 ${collapsed ? 'p-2' : 'p-4'}`}>
          {/* Sign out */}
          <button
            onClick={handleSignOut}
            title={collapsed ? 'Sign Out' : undefined}
            className={`flex items-center w-full rounded-lg text-sm text-white/40 hover:text-white/80 hover:bg-white/5 transition-colors ${
              collapsed ? 'justify-center p-2.5' : 'gap-2 px-3 py-2'
            }`}
          >
            <LogOut size={16} className="shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </SidebarContext.Provider>
  )
}
