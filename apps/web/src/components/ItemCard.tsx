import { Item } from '@/types';
import { CreditCard, User, Calendar } from 'lucide-react';
import clsx from 'clsx';

interface ItemCardProps {
  item: Item;
  onClick: () => void;
}

export default function ItemCard({ item, onClick }: ItemCardProps) {
  const isSubscription = item.type === 'SUBSCRIPTION';

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

  return (
    <div
      onClick={onClick}
      className="card hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-start gap-4">
        <div
          className={clsx(
            'w-12 h-12 rounded-lg flex items-center justify-center',
            isSubscription ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600'
          )}
        >
          {item.iconPath ? (
            <img src={item.iconPath} alt={item.name} className="w-full h-full object-cover rounded-lg" />
          ) : isSubscription ? (
            <CreditCard size={24} />
          ) : (
            <User size={24} />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
          <p className="text-sm text-gray-500">
            {isSubscription ? 'Assinatura' : 'Conta'}
          </p>

          {isSubscription && item.value && (
            <div className="mt-2 flex items-center gap-4 text-sm">
              <span className="font-semibold text-primary-600">
                {formatCurrency(item.value)}
              </span>
              {item.duration && (
                <span className="text-gray-500">{getDurationLabel(item.duration)}</span>
              )}
            </div>
          )}

          {item.billingDay && (
            <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
              <Calendar size={14} />
              <span>Todo dia {item.billingDay}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
