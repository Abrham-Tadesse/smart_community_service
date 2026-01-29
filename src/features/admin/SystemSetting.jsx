import { useEffect, useState } from 'react'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import { toast } from 'react-toastify'

const DEFAULT_SETTINGS = [
  { key: 'siteTitle', label: 'Site Title', type: 'text', value: 'Smart Community Service' },
  { key: 'notificationEmail', label: 'Notification Email', type: 'email', value: 'admin@example.com' },
  { key: 'itemsPerPage', label: 'Items Per Page', type: 'number', value: 10 },
  { key: 'responseWindowDays', label: 'Response Window (days)', type: 'number', value: 7 },
  { key: 'enableEmailNotifications', label: 'Enable Email Notifications', type: 'checkbox', value: true },
  { key: 'showAnalytics', label: 'Show Analytics', type: 'checkbox', value: true }
]

const SystemSetting = () => {
  const [settings, setSettings] = useState([])

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('systemSettings') || 'null')
    if (stored && Array.isArray(stored)) {
      setSettings(stored)
    } else {
      setSettings(DEFAULT_SETTINGS)
    }
  }, [])

  const updateValue = (index, newValue) => {
    setSettings(prev => {
      const next = [...prev]
      // coerce types
      if (next[index].type === 'number') next[index].value = Number(newValue)
      else if (next[index].type === 'checkbox') next[index].value = !!newValue
      else next[index].value = newValue
      return next
    })
  }

  const moveUp = (index) => {
    if (index === 0) return
    setSettings(prev => {
      const next = [...prev]
      const tmp = next[index - 1]
      next[index - 1] = next[index]
      next[index] = tmp
      return next
    })
  }

  const moveDown = (index) => {
    setSettings(prev => {
      if (index === prev.length - 1) return prev
      const next = [...prev]
      const tmp = next[index + 1]
      next[index + 1] = next[index]
      next[index] = tmp
      return next
    })
  }

  const handleSave = () => {
    localStorage.setItem('systemSettings', JSON.stringify(settings))
    toast.success('Settings saved')
  }

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS)
    localStorage.removeItem('systemSettings')
    toast.info('Settings reset to defaults')
  }

  return (
    <div className="page-container">
      <div className="container">
        <div className="mb-6">
          <h1 className="section-title">System Settings</h1>
          <p className="section-subtitle">Configure site-wide settings</p>
        </div>

        <div className="card mb-6">
          <div className="card-body">
            {settings.map((s, idx) => (
              <div key={s.key} className="flex items-center gap-4 mb-4">
                <div className="flex-1">
                  {s.type === 'checkbox' ? (
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={!!s.value}
                        onChange={(e) => updateValue(idx, e.target.checked)}
                      />
                      <span className="font-medium">{s.label}</span>
                    </label>
                  ) : (
                    <Input
                      label={s.label}
                      type={s.type}
                      name={s.key}
                      value={s.value}
                      onChange={(e) => updateValue(idx, e.target.value)}
                    />
                  )}
                </div>
                {/* static order: controls removed per request */}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={handleSave}>Save Settings</Button>
          <Button variant="outline" onClick={handleReset}>Reset to Defaults</Button>
        </div>
      </div>
    </div>
  )
}

export default SystemSetting
