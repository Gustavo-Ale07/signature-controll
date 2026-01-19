import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { itemService } from '@/services/items';
import { Item } from '@/types';
import { ArrowLeft, Eye, EyeOff, Trash2, Edit } from 'lucide-react';

export default function ItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<Item | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadItem();
    }
  }, [id]);

  const loadItem = async () => {
    try {
      if (!id) return;
      const data = await itemService.getById(id);
      setItem(data);
    } catch (error) {
      console.error('Error loading item:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPassword = async () => {
    try {
      if (!id) return;
      const data = await itemService.getSecret(id);
      setPassword(data.password);
      setShowPassword(true);
    } catch (error) {
      console.error('Error loading password:', error);
    }
  };

  const handleDelete = async () => {
    if (!id || !confirm('Tem certeza que deseja excluir este item?')) return;

    try {
      await itemService.delete(id);
      navigate('/items');
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getDurationLabel = (duration?: string) => {
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

  if (!item) {
    return (
      <Layout>
        <div className="text-gray-600">Item não encontrado</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/items')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={20} />
          Voltar
        </button>

        <div className="card">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              {item.iconPath && (
                <img
                  src={item.iconPath}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{item.name}</h1>
                <p className="text-gray-600">
                  {item.type === 'SUBSCRIPTION' ? 'Assinatura' : 'Conta'}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/items/${id}/edit`)}
                className="btn btn-secondary flex items-center gap-2"
              >
                <Edit size={18} />
                Editar
              </button>
              <button
                onClick={handleDelete}
                className="btn bg-red-100 text-red-600 hover:bg-red-200"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {item.email && (
              <div>
                <label className="text-sm font-medium text-gray-700">Email/Login</label>
                <p className="text-gray-900 mt-1">{item.email}</p>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-700">Senha</label>
              <div className="flex items-center gap-3 mt-1">
                {showPassword && password ? (
                  <p className="text-gray-900 font-mono">{password}</p>
                ) : (
                  <p className="text-gray-400">********</p>
                )}
                <button
                  onClick={() => {
                    if (!showPassword && !password) {
                      loadPassword();
                    } else {
                      setShowPassword(!showPassword);
                    }
                  }}
                  className="text-primary-600 hover:text-primary-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {item.type === 'SUBSCRIPTION' && (
              <>
                {item.value && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Valor</label>
                    <p className="text-2xl font-bold text-primary-600 mt-1">
                      {formatCurrency(item.value)}
                    </p>
                  </div>
                )}

                {item.duration && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Periodicidade</label>
                    <p className="text-gray-900 mt-1">{getDurationLabel(item.duration)}</p>
                  </div>
                )}

                {item.billingDay && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Dia de Cobrança</label>
                    <p className="text-gray-900 mt-1">Todo dia {item.billingDay}</p>
                  </div>
                )}
              </>
            )}

            {item.notes && (
              <div>
                <label className="text-sm font-medium text-gray-700">Notas</label>
                <p className="text-gray-900 mt-1 whitespace-pre-wrap">{item.notes}</p>
              </div>
            )}

            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Criado em: {new Date(item.createdAt).toLocaleDateString('pt-BR')}
              </p>
              <p className="text-sm text-gray-500">
                Última atualização: {new Date(item.updatedAt).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
