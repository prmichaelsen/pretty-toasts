import React from 'react'
import { useToast } from '@prmichaelsen/pretty-toasts/standalone'

function App() {
  const toast = useToast()

  const handleSuccess = () => {
    toast.success({
      id: `success-${Date.now()}`,
      title: 'Success!',
      message: 'This is a success toast notification',
      duration: 5000,
    })
  }

  const handleError = () => {
    toast.error({
      id: `error-${Date.now()}`,
      title: 'Error!',
      message: 'This is an error toast notification',
      duration: 5000,
    })
  }

  const handleWarning = () => {
    toast.warning({
      id: `warning-${Date.now()}`,
      title: 'Warning!',
      message: 'This is a warning toast notification',
      duration: 5000,
    })
  }

  const handleInfo = () => {
    toast.info({
      id: `info-${Date.now()}`,
      title: 'Info',
      message: 'This is an info toast notification',
      duration: 5000,
    })
  }

  const handleLongMessage = () => {
    toast.success({
      id: `long-${Date.now()}`,
      title: 'Long Message Test',
      message: 'This is a much longer message to test how the toast handles multiple lines of text. It should wrap nicely and display all the content without breaking the layout.',
      duration: 8000,
    })
  }

  const handleNoMessage = () => {
    toast.info({
      id: `no-msg-${Date.now()}`,
      title: 'Title Only',
      duration: 3000,
    })
  }

  const handleShortDuration = () => {
    toast.success({
      id: `short-${Date.now()}`,
      title: 'Quick Toast',
      message: 'This will disappear in 2 seconds',
      duration: 2000,
    })
  }

  const handleLongDuration = () => {
    toast.info({
      id: `long-dur-${Date.now()}`,
      title: 'Long Duration',
      message: 'This will stay for 15 seconds',
      duration: 15000,
    })
  }

  const handleMultiple = () => {
    toast.success({ id: `multi-1-${Date.now()}`, title: 'First Toast', message: 'Toast 1' })
    setTimeout(() => toast.error({ id: `multi-2-${Date.now()}`, title: 'Second Toast', message: 'Toast 2' }), 500)
    setTimeout(() => toast.warning({ id: `multi-3-${Date.now()}`, title: 'Third Toast', message: 'Toast 3' }), 1000)
    setTimeout(() => toast.info({ id: `multi-4-${Date.now()}`, title: 'Fourth Toast', message: 'Toast 4' }), 1500)
  }

  const handleProgressUpload = () => {
    const uploadId = `upload-${Date.now()}`
    
    // Start upload
    toast.info({
      id: uploadId,
      title: 'Uploading...',
      message: 'Starting upload',
      progress: 0,
    })

    // Simulate progress
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      
      if (progress <= 100) {
        toast.toast({
          id: uploadId,
          type: progress === 100 ? 'success' : 'info',
          title: progress === 100 ? 'Upload Complete!' : 'Uploading...',
          message: `${progress}% complete`,
          progress,
        })
      }
      
      if (progress >= 100) {
        clearInterval(interval)
      }
    }, 500)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #1e1b4b, #581c87, #1e1b4b)',
      padding: '2rem',
    }}>
      <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>
          Toast Test Page (Standalone)
        </h1>
        <p style={{ color: '#cbd5e1', marginBottom: '2rem' }}>
          Test the 
          <a
            href="https://github.com/prmichaelsen/pretty-toasts"
            style={{ color: '#60a5fa', textDecoration: 'none' }}
            target="_blank"
            rel="noopener noreferrer"
          >
            @prmichaelsen/pretty-toasts
          </a>
          library with React Context
        </p>

        <div style={{
          background: 'rgba(30, 27, 75, 0.6)',
          backdropFilter: 'blur(12px)',
          borderRadius: '0.75rem',
          padding: '2rem',
          border: '1px solid rgba(139, 92, 246, 0.3)',
        }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '600', color: 'white', marginBottom: '1.5rem' }}>
            Toast Types
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
            <Button onClick={handleSuccess} variant="success">Success Toast</Button>
            <Button onClick={handleError} variant="error">Error Toast</Button>
            <Button onClick={handleWarning} variant="warning">Warning Toast</Button>
            <Button onClick={handleInfo} variant="info-outline">Info Toast</Button>
          </div>

          <h2 style={{ fontSize: '1.75rem', fontWeight: '600', color: 'white', marginBottom: '1.5rem' }}>
            Message Variations
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
            <Button onClick={handleLongMessage} variant="success">Long Message</Button>
            <Button onClick={handleNoMessage} variant="warning">Title Only (No Message)</Button>
          </div>

          <h2 style={{ fontSize: '1.75rem', fontWeight: '600', color: 'white', marginBottom: '1.5rem' }}>
            Duration Tests
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
            <Button onClick={handleShortDuration} variant="success">Short (2s)</Button>
            <Button onClick={handleLongDuration} variant="warning">Long (15s)</Button>
          </div>

          <h2 style={{ fontSize: '1.75rem', fontWeight: '600', color: 'white', marginBottom: '1.5rem' }}>
            Advanced Tests
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Button onClick={handleMultiple} variant="success">Multiple Toasts (Stacking)</Button>
            <Button onClick={handleProgressUpload} variant="info">Progress Upload Simulation</Button>
          </div>

          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            background: 'rgba(51, 65, 85, 0.5)',
            borderRadius: '0.5rem',
            border: '1px solid #475569',
          }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'white', marginBottom: '0.5rem' }}>
              Interactive Features
            </h3>
            <ul style={{ color: '#cbd5e1', fontSize: '0.875rem', lineHeight: '1.5' }}>
              <li>• <strong>Hover</strong> over a toast to pause auto-dismiss</li>
              <li>• <strong>Click</strong> a toast to make it permanent (no auto-dismiss)</li>
              <li>• <strong>Swipe/Drag</strong> a toast to dismiss it manually</li>
              <li>• <strong>Progress bar</strong> shows time remaining</li>
            </ul>
          </div>
        </div>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <a
            href="https://github.com/prmichaelsen/pretty-toasts"
            style={{ color: '#60a5fa', textDecoration: 'none' }}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub →
          </a>
        </div>
      </div>
    </div>
  )
}

// Beautiful gradient button component matching the original design
interface ButtonProps {
  onClick: () => void
  variant: 'success' | 'error' | 'warning' | 'info' | 'info-outline'
  children: React.ReactNode
}

function Button({ onClick, variant, children }: ButtonProps) {
  const styles = {
    success: {
      background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
      border: 'none',
    },
    error: {
      background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
      border: 'none',
    },
    warning: {
      background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
      border: 'none',
    },
    info: {
      background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
      border: 'none',
    },
    'info-outline': {
      background: 'transparent',
      border: '2px solid #6366f1',
    },
  }

  const [isHovered, setIsHovered] = React.useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        padding: '1rem 2rem',
        borderRadius: '0.75rem',
        ...styles[variant],
        color: 'white',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        fontSize: '1rem',
        width: '100%',
        opacity: isHovered ? 0.9 : 1,
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: isHovered 
          ? '0 10px 25px -5px rgba(139, 92, 246, 0.5)' 
          : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      }}
    >
      {children}
    </button>
  )
}

export default App
