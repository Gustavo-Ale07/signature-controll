import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { itemService } from '@/services/items';
import { DashboardStats } from '@/types';
import { TrendingUp, Calendar, Plus } from 'lucide-react';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await itemService.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getDurationLabel = (duration: string) => {
    switch (duration) {
      case 'MONTHLY':
        return 'Mensal';
      case 'SEMIANNUAL':
        return 'Semestral';
      case 'ANNUAL':
        return 'Anual';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-gray-600">Carregando...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <button
            onClick={() => navigate('/items/new')}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            Novo Item
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-primary-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Gasto Mensal Estimado</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats ? formatCurrency(stats.monthlyTotal) : 'R$ 0,00'}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Próximas Cobranças</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.upcomingBillings.length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {stats && stats.upcomingBillings.length > 0 && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Próximas Cobranças</h2>
            <div className="space-y-3">
              {stats.upcomingBillings.map((billing) => (
                <div
                  key={billing.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => navigate(`/items/${billing.id}`)}
                >
                  <div>
                    <p className="font-medium text-gray-900">{billing.name}</p>
                    <p className="text-sm text-gray-500">
                      Todo dia {billing.billingDay} - {getDurationLabel(billing.duration)}
                    </p>
                  </div>
                  <p className="font-semibold text-primary-600">
                    {formatCurrency(billing.value)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {stats && stats.upcomingBillings.length === 0 && (
          <div className="card text-center py-12">
            <p className="text-gray-600">Nenhuma assinatura cadastrada ainda</p>
            <button
              onClick={() => navigate('/items/new')}
              className="btn btn-primary mt-4"
            >
              Adicionar Primeira Assinatura
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}
