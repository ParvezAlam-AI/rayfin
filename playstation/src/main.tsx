import { createRoot } from 'react-dom/client';

import App from '@/App';
import { AuthProvider } from '@/hooks/AuthContext';
import { bootstrapAuth } from '@/services/bootstrap';
import type { IAuthService } from '@/services/IAuthService';

import './main.css';

const previewMode =
  import.meta.env.DEV &&
  new URLSearchParams(window.location.search).has('preview');

const previewAuthService: IAuthService = {
  fabricAuthEnabled: false,
  async signIn() {
    return { id: 'preview-user', email: 'preview@rayfin.local', name: 'Preview' };
  },
  async signOut() {},
  async getCurrentUser() {
    return { id: 'preview-user', email: 'preview@rayfin.local', name: 'Preview' };
  },
  async initEmbeddedAuth() {
    return { id: 'preview-user', email: 'preview@rayfin.local', name: 'Preview' };
  },
};

const authService = previewMode ? previewAuthService : bootstrapAuth();

createRoot(document.getElementById('root')!).render(
  <AuthProvider authService={authService}>
    <App />
  </AuthProvider>
);
