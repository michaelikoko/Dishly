import 'bootstrap-icons/font/bootstrap-icons.css'
import '../styles/custom.scss'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import { AuthModalProvider } from '../context/AuthModalContext'
import { getCurrentUser } from '../actions/auth'
import { UserProvider } from '../context/UserContext'
import { Suspense } from 'react'
import { Poppins } from 'next/font/google'

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
})

export const metadata = {
  title: 'Dishly',
  description: 'Share and discover amazing recipes with Dishly.',
}

export default async function RootLayout({ children }) {
  const user = await getCurrentUser()
  //console.log('Current User:', user)

  return (
    <AuthModalProvider>
      <UserProvider userInfo={user}>
        <html lang="en" className={poppins.variable}>
          <head>
            <link rel="icon" href="/logo.ico" sizes="any" />
          </head>
          <body>
            <main>
              <NavBar />
              <Suspense>{children}</Suspense>
            </main>
            <Footer />
          </body>
        </html>
      </UserProvider>
    </AuthModalProvider>
  )
}

export const dynamic = 'force-dynamic'
