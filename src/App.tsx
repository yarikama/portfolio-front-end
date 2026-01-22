import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import ScrollProgress from './components/ui/ScrollProgress'
import CursorFollower from './components/ui/CursorFollower'
import ProtectedRoute from './components/admin/ProtectedRoute'
import { Home, ArchivePage, NotesPage, NotePage } from './pages'
import {
  AdminLogin,
  AdminNotesList,
  AdminNoteEditor,
  AdminProjectsList,
  AdminProjectEditor,
} from './pages/admin'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin routes - no header/footer */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminNotesList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/notes"
          element={
            <ProtectedRoute>
              <AdminNotesList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/notes/new"
          element={
            <ProtectedRoute>
              <AdminNoteEditor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/notes/:id/edit"
          element={
            <ProtectedRoute>
              <AdminNoteEditor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/projects"
          element={
            <ProtectedRoute>
              <AdminProjectsList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/projects/new"
          element={
            <ProtectedRoute>
              <AdminProjectEditor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/projects/:id/edit"
          element={
            <ProtectedRoute>
              <AdminProjectEditor />
            </ProtectedRoute>
          }
        />

        {/* Public routes - with header/footer */}
        <Route
          path="*"
          element={
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
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
