import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import ScrollProgress from './components/ui/ScrollProgress'
import CursorFollower from './components/ui/CursorFollower'
import AskProvider from './components/ask/AskProvider'
import AskWidget from './components/ask/AskWidget'
import ProtectedRoute from './components/admin/ProtectedRoute'
import Home from './pages/Home'
import ArchivePage from './pages/ArchivePage'
import NotesPage from './pages/NotesPage'

// Split out routes that pull in markdown/KaTeX or the admin editors, so the
// home page does not download them. Import files directly, not through the
// barrels, or the barrel's static re-exports pull them back into the main chunk.
const NotePage = lazy(() => import('./pages/NotePage'))
const AdminLogin = lazy(() => import('./pages/admin/Login'))
const AdminNotesList = lazy(() => import('./pages/admin/NotesList'))
const AdminNoteEditor = lazy(() => import('./pages/admin/NoteEditor'))
const AdminProjectsList = lazy(() => import('./pages/admin/ProjectsList'))
const AdminProjectEditor = lazy(() => import('./pages/admin/ProjectEditor'))
const AdminCategoriesList = lazy(() => import('./pages/admin/CategoriesList'))
const AdminCategoryEditor = lazy(() => import('./pages/admin/CategoryEditor'))

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={null}>
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
          <Route
            path="/admin/categories"
            element={
              <ProtectedRoute>
                <AdminCategoriesList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/categories/new"
            element={
              <ProtectedRoute>
                <AdminCategoryEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/categories/:id/edit"
            element={
              <ProtectedRoute>
                <AdminCategoryEditor />
              </ProtectedRoute>
            }
          />

          {/* Public routes - with header/footer */}
          <Route
            path="*"
            element={
              // One ask conversation for every public page: the home page
              // section and the floating chat share it.
              <AskProvider>
                <div className="min-h-dvh bg-paper text-ink">
                  <CursorFollower />
                  <ScrollProgress />
                  <Header />
                  <main className="pb-24">
                    <Suspense fallback={<div className="min-h-dvh" />}>
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/archive" element={<ArchivePage />} />
                        <Route path="/notes" element={<NotesPage />} />
                        <Route path="/notes/:slug" element={<NotePage />} />
                      </Routes>
                    </Suspense>
                  </main>
                  <Footer />
                  <AskWidget />
                </div>
              </AskProvider>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
