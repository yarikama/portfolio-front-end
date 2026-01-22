import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import ScrollProgress from './components/ui/ScrollProgress'
import CursorFollower from './components/ui/CursorFollower'
import { Home, ArchivePage, NotesPage, NotePage } from './pages'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-paper text-ink cursor-none">
        <CursorFollower />
        <ScrollProgress />
        <Header />
        <main className="pb-24">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/archive" element={<ArchivePage />} />
            <Route path="/notes" element={<NotesPage />} />
            <Route path="/notes/:slug" element={<NotePage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
