import { MotionConfig } from 'motion/react'
import { lazy, Suspense, useEffect, type ReactNode } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router'

import { CartDrawer } from './components/CartDrawer'
import { Footer, Toaster } from './components/Chrome'
import { Nav } from './components/Nav'
import { Container, Spinner } from './components/ui'
import { StoreProvider } from './lib/store'
import { About } from './pages/About'
import { Checkout } from './pages/Checkout'
import { Contact } from './pages/Contact'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'
import { OrderConfirmed, Orders } from './pages/Orders'
import { ProductPage } from './pages/Product'
import { Quiz } from './pages/Quiz'
import { Shop } from './pages/Shop'
import { Wishlist } from './pages/Wishlist'

// The style guide is only for builders, so it loads on demand.
const StyleGuide = lazy(() => import('./pages/StyleGuide').then((m) => ({ default: m.StyleGuide })))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

/** Inner pages: the header sits on the page instead of the hero photo. */
function Page({ children }: { children: ReactNode }) {
  return (
    <>
      <Container className="pt-5 sm:pt-8">
        <Nav tone="solid" />
      </Container>
      <main id="main" className="animate-rise">
        {children}
      </main>
    </>
  )
}

export function App() {
  return (
    <BrowserRouter>
      <MotionConfig reducedMotion="user">
        <StoreProvider>
          <ScrollToTop />
          <a href="#main" className="sr-only z-[70] rounded-pill bg-ink px-5 py-3 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
            Skip to content
          </a>
          <Routes>
            <Route
              index
              element={
                <main id="main">
                  <Home />
                </main>
              }
            />
            <Route path="shop" element={<Page><Shop /></Page>} />
            <Route path="product/:slug" element={<Page><ProductPage /></Page>} />
            <Route path="quiz" element={<Page><Quiz /></Page>} />
            <Route path="wishlist" element={<Page><Wishlist /></Page>} />
            <Route path="checkout" element={<Page><Checkout /></Page>} />
            <Route path="order/:reference" element={<Page><OrderConfirmed /></Page>} />
            <Route path="orders" element={<Page><Orders /></Page>} />
            <Route path="contact" element={<Page><Contact /></Page>} />
            <Route path="about" element={<Page><About /></Page>} />
            <Route path="styleguide" element={<Page><Suspense fallback={<Container className="mt-16"><Spinner label="Loading style guide" /></Container>}><StyleGuide /></Suspense></Page>} />
            <Route path="*" element={<Page><NotFound /></Page>} />
          </Routes>
          <Footer />
          <CartDrawer />
          <Toaster />
        </StoreProvider>
      </MotionConfig>
    </BrowserRouter>
  )
}
