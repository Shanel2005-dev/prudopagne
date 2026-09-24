import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import CataloguePage from './pages/CataloguePage';
import ProductPage from './pages/ProductPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminProductsPage from './pages/AdminProductsPage';
import AdminHistoryPage from './pages/AdminHistoryPage';
import AdminProductFormPage from './pages/AdminProductFormPage';

function SiteChrome({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAdminWorkspace = location.pathname.startsWith('/admin') && location.pathname !== '/admin/connexion';

  if (isAdminWorkspace) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <SiteChrome>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/catalogue" element={<CataloguePage />} />
            <Route path="/produit/:id" element={<ProductPage />} />
            <Route path="/admin/connexion" element={<AdminLoginPage />} />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} />
            <Route path="/admin/produits" element={<ProtectedRoute><AdminProductsPage /></ProtectedRoute>} />
            <Route path="/admin/historique" element={<ProtectedRoute><AdminHistoryPage /></ProtectedRoute>} />
            <Route path="/admin/produits/nouveau" element={<ProtectedRoute><AdminProductFormPage /></ProtectedRoute>} />
            <Route path="/admin/produits/:id/modifier" element={<ProtectedRoute><AdminProductFormPage /></ProtectedRoute>} />
          </Routes>
        </SiteChrome>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
