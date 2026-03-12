import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import Button from '../ui/Button'
import Avatar from '../ui/Avatar'
import Modal from '../ui/Modal'
import { Lock, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AccountSettings() {
  const { profile, updatePassword, deleteAccount } = useAuth()
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [changingPw, setChangingPw] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleChangePw = async (e) => {
    e.preventDefault()
    if (newPw.length < 8) { toast.error('Password must be at least 8 characters'); return }
    if (newPw !== confirmPw) { toast.error('Passwords do not match'); return }
    setChangingPw(true)
    try {
      await updatePassword(newPw)
      toast.success('Password updated successfully')
      setCurrentPw(''); setNewPw(''); setConfirmPw('')
    } catch (err) {
      toast.error(err.message || 'Failed to update password')
    } finally {
      setChangingPw(false)
    }
  }

  const handleDelete = async () => {
    try {
      await deleteAccount()
      toast.success('Account deleted')
      setShowDeleteModal(false)
    } catch (err) {
      toast.error(err.message || 'Failed to delete account')
    }
  }

  return (
    <div className="space-y-8">
      {/* Profile */}
      <div>
        <h3 className="text-lg font-semibold text-primary mb-4">Profile</h3>
        <div className="flex items-center gap-4 p-5 bg-bg-secondary rounded-xl border border-border">
          <Avatar name={profile?.name} src={profile?.avatar} size="xl" />
          <div>
            <p className="font-semibold text-primary text-lg">{profile?.name || 'User'}</p>
            <p className="text-sm text-text-muted">{profile?.email || 'No email'}</p>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div>
        <h3 className="text-lg font-semibold text-primary mb-4">Change Password</h3>
        <form onSubmit={handleChangePw} className="space-y-3 max-w-md">
          <div>
            <label className="text-sm font-medium text-primary mb-1 block">Current Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light" />
              <input type="password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-primary mb-1 block">New Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light" />
              <input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="Min 8 characters"
                className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg text-sm placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-primary mb-1 block">Confirm New Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light" />
              <input type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all" />
            </div>
          </div>
          <Button type="submit" loading={changingPw} size="sm">Update Password</Button>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="pt-6 border-t border-border">
        <h3 className="text-lg font-semibold text-error mb-2">Danger Zone</h3>
        <p className="text-sm text-text-muted mb-4">Once you delete your account, there is no going back.</p>
        <Button variant="danger" size="sm" onClick={() => setShowDeleteModal(true)}>
          <AlertTriangle size={14} /> Delete Account
        </Button>
      </div>

      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Account">
        <div className="p-6">
          <p className="text-sm text-text-muted mb-6">This will permanently delete your account and all projects. This action cannot be undone.</p>
          <div className="flex gap-3">
            <Button variant="danger" onClick={handleDelete} fullWidth>Yes, Delete My Account</Button>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)} fullWidth>Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
