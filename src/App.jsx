import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import FloatingWhatsApp from './components/ui/FloatingWhatsApp'
import Home from './pages/Home'

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Home />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  )
}

export default App
