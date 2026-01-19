import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import ItemCard from '@/components/ItemCard';
import { itemService } from '@/services/items';
import { Item } from '@/types';
import { Plus, Search } from 'lucide-react';

export default function ItemsPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadItems();
  }, [typeFilter, search]);

  const loadItems = async () => {
    try {
      const data = await itemService.getAll(typeFilter, search);
      setItems(data);
    } catch (error) {
      console.error('Error loading items:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Meus Itens</h1>
          <button
            onClick={() => navigate('/items/new')}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            Novo Item
          </button>
        </div>

        <div className="card mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar por nome..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input pl-10"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="input sm:w-48"
            >
              <option value="">Todos os tipos</option>
              <option value="SUBSCRIPTION">Assinaturas</option>
              <option value="ACCOUNT">Contas</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-gray-600">Carregando...</div>
        ) : items.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-600 mb-4">Nenhum item encontrado</p>
            <button
              onClick={() => navigate('/items/new')}
              className="btn btn-primary"
            >
              Adicionar Primeiro Item
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onClick={() => navigate(`/items/${item.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
