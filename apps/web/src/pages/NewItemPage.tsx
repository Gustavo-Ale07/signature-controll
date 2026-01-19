import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Layout from '@/components/Layout';
import { itemService } from '@/services/items';
import { ArrowLeft } from 'lucide-react';

const itemSchema = z.object({
  type: z.enum(['SUBSCRIPTION', 'ACCOUNT']),
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().max(255).optional().or(z.literal('')),
  password: z.string().optional(),
  value: z.number().positive('Valor deve ser positivo').optional().or(z.nan()),
  billingDay: z.number().min(1).max(31).optional().or(z.nan()),
  duration: z.enum(['MONTHLY', 'SEMIANNUAL', 'ANNUAL']).optional().or(z.literal('')),
  notes: z.string().optional(),
});

type ItemForm = z.infer<typeof itemSchema>;

export default function NewItemPage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string>('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ItemForm>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      type: 'SUBSCRIPTION',
    },
  });

  const itemType = watch('type');

  const onSubmit = async (data: ItemForm) => {
    try {
      setError('');
      await itemService.create({
        ...data,
        value: data.value || undefined,
        billingDay: data.billingDay || undefined,
        duration: data.duration || undefined,
        icon: iconFile || undefined,
      });
      navigate('/items');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao criar item');
    }
  };

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIconFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setIconPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Novo Item</h1>

        <div className="card">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center gap-2 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    {...register('type')}
                    value="SUBSCRIPTION"
                    className="text-primary-600"
                  />
                  <span>Assinatura</span>
                </label>
                <label className="flex items-center gap-2 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    {...register('type')}
                    value="ACCOUNT"
                    className="text-primary-600"
                  />
                  <span>Conta</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome
              </label>
              <input
                type="text"
                {...register('name')}
                className="input"
                placeholder="Ex: Netflix, Gmail, etc."
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email/Login
              </label>
              <input
                type="email"
                {...register('email')}
                className="input"
                placeholder="seu@email.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <input
                type="password"
                {...register('password')}
                className="input"
                placeholder="********"
              />
              <p className="text-sm text-gray-500 mt-1">
                Será armazenada de forma criptografada
              </p>
            </div>

            {itemType === 'SUBSCRIPTION' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Valor (R$)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      {...register('value', { valueAsNumber: true })}
                      className="input"
                      placeholder="0,00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dia de Cobrança
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="31"
                      {...register('billingDay', { valueAsNumber: true })}
                      className="input"
                      placeholder="1-31"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Periodicidade
                  </label>
                  <select {...register('duration')} className="input">
                    <option value="">Selecione...</option>
                    <option value="MONTHLY">Mensal</option>
                    <option value="SEMIANNUAL">Semestral</option>
                    <option value="ANNUAL">Anual</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notas
              </label>
              <textarea
                {...register('notes')}
                className="input"
                rows={3}
                placeholder="Observações adicionais..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ícone
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleIconChange}
                className="input"
              />
              {iconPreview && (
                <img
                  src={iconPreview}
                  alt="Preview"
                  className="mt-2 w-20 h-20 object-cover rounded-lg"
                />
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary flex-1"
              >
                {isSubmitting ? 'Salvando...' : 'Salvar'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/items')}
                className="btn btn-secondary"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
