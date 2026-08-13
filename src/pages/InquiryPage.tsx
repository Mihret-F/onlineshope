import React from 'react';
import { InquiryModal } from '../components/InquiryModal';
import { Product, Inquiry } from '../types';

interface InquiryPageProps {
  products: Product[];
  onSuccess: (inquiry: Inquiry) => void;
  onNavigate: (path: string) => void;
}

export const InquiryPage: React.FC<InquiryPageProps> = ({
  products,
  onSuccess,
  onNavigate
}) => {
  return (
    <div className="py-8 bg-stone-50 min-h-[80vh]">
      <InquiryModal
        productsList={products}
        onClose={() => onNavigate('/')}
        onSuccess={onSuccess}
      />
    </div>
  );
};
