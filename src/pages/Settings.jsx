import { useState } from 'react'
import { Key, User, Plug } from 'lucide-react'
import Sidebar from '../components/layout/Sidebar'
import ApiKeySettings from '../components/settings/ApiKeySettings'
import AccountSettings from '../components/settings/AccountSettings'
import BackendConnections from '../components/settings/BackendConnections'

const TABS = [
  { id: 'api', label: 'API Keys', icon: Key },
  { id: 'account', label: 'Account', icon: User },
  { id: 'backends', label: 'Backend Connections', icon: Plug },
]

export default function Settings() {
  const [activeTab, setActiveTab] = useState('api')

  return (
    <div className="flex min-h-screen bg-bg-secondary">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-border px-6 py-4 sticky top-0 z-30">
          <h1 className="text-xl font-bold text-primary">Settings</h1>
          <p className="text-sm text-text-muted">Manage your account and integrations</p>
        </header>

        <main className="flex-1 p-6 max-w-4xl">
          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-white rounded-xl border border-border mb-8 w-fit">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-text-muted hover:text-primary hover:bg-bg-secondary'
                }`}
              >
                <tab.icon size={16} /> {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="bg-white rounded-xl border border-border p-6">
            {activeTab === 'api' && <ApiKeySettings />}
            {activeTab === 'account' && <AccountSettings />}
            {activeTab === 'backends' && <BackendConnections />}
          </div>
        </main>
      </div>
    </div>
  )
}
