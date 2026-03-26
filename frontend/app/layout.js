import './globals.css'
import { AuthProvider } from '../context/AuthContext'
import { Toaster } from 'react-hot-toast'

export const metadata = {
  title: 'Life OS - Your Personal Operating System',
  description: 'Manage your goals, health, finances, relationships and tasks in one place',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}