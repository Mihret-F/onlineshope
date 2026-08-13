import React from 'react';
import { CheckCircle2, ShoppingBag, PhoneCall, Copy, Check } from 'lucide-react';
import { Inquiry } from '../types';

interface InquirySuccessModalProps {
  inquiry: Inquiry;
  onClose: () => void;
  onNavigate?: (path: string) => void;
}

export const InquirySuccessModal: React.FC<InquirySuccessModalProps> = ({
  inquiry,
  onClose,
  onNavigate = (_path: string) => {}
}) => {
  const [copied, setCopied] = React.useState(false);

  const copyInquiryNumber = () => {
    navigator.clipboard.writeText(inquiry.inquiryNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-stone-100 p-6 sm:p-8 text-center my-8">
        
        {/* Success Icon */}
        <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-black text-stone-900 mb-2">
          Inquiry Submitted Successfully
        </h2>

        <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-6">
          Thank you for contacting <strong className="text-stone-900">Mercy Shopes</strong>. Your inquiry has been received successfully.
        </p>

        {/* Inquiry Ticket Card */}
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 mb-6 text-left space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-stone-500 font-semibold">Your Inquiry ID:</span>
            <button
              onClick={copyInquiryNumber}
              className="inline-flex items-center gap-1 text-[11px] text-emerald-800 font-bold bg-emerald-100 hover:bg-emerald-200 px-2 py-0.5 rounded transition-colors"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-700" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
          <p className="text-lg font-black font-mono text-emerald-900">
            {inquiry.inquiryNumber}
          </p>

          <div className="pt-2 border-t border-stone-200/80 text-xs text-stone-600 space-y-1">
            <p><strong className="text-stone-800">Product:</strong> {inquiry.productName || 'General Request'}</p>
            <p><strong className="text-stone-800">Customer:</strong> {inquiry.customerName} ({inquiry.phone})</p>
            <p><strong className="text-stone-800">Telegram:</strong> {inquiry.telegramUsername || 'N/A'}</p>
          </div>
        </div>

        <p className="text-xs text-stone-500 mb-6 leading-relaxed">
          Our team will review your request and contact you shortly via phone or Telegram using the information you provided.
        </p>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              onClose();
              onNavigate('/products');
            }}
            className="flex items-center justify-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 px-4 rounded-xl text-xs transition-colors shadow-sm"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Continue Shopping</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onNavigate('/contact');
            }}
            className="flex items-center justify-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold py-3 px-4 rounded-xl text-xs transition-colors"
          >
            <PhoneCall className="w-4 h-4 text-stone-600" />
            <span>Contact Us</span>
          </button>
        </div>

      </div>
    </div>
  );
};
