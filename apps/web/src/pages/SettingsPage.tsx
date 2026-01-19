import Layout from '@/components/Layout';
import { useUser } from '@clerk/clerk-react';

export default function SettingsPage() {
  const { user } = useUser();

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Configurações</h1>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Informações da Conta</h2>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <p className="text-gray-900 mt-1">{user?.primaryEmailAddress?.emailAddress}</p>
            </div>

            {user?.fullName && (
              <div>
                <label className="text-sm font-medium text-gray-700">Nome</label>
                <p className="text-gray-900 mt-1">{user.fullName}</p>
              </div>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Mais opções de configuração em breve
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
