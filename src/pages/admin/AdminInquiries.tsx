import React, { useEffect, useState } from 'react';
import { Send, CheckCircle2, Clock, AlertCircle, RefreshCw, Trash2, Search, ExternalLink, Filter } from 'lucide-react';
import { Inquiry } from '../../types';
import { api } from '../../services/api';

export const AdminInquiries: React.FC = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    loadInquiries();
  }, []);

  const loadInquiries = async () => {
    try {
      setLoading(true);
      const data = await api.getInquiries();
      setInquiries(data || []);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load inquiries:', err);
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: Inquiry['status']) => {
    try {
      setUpdatingId(id);
      await api.updateInquiryStatus(id, status);
      await loadInquiries();
      setUpdatingId(null);
    } catch (err) {
      console.error('Failed to update inquiry status:', err);
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      await api.deleteInquiry(id);
      await loadInquiries();
    } catch (err) {
      console.error('Failed to delete inquiry:', err);
    }
  };

  const filtered = inquiries.filter(inq => {
    const matchesSearch =
      inq.customerName.toLowerCase().includes(search.toLowerCase()) ||
      inq.phone.includes(search) ||
      (inq.telegramUsername && inq.telegramUsername.toLowerCase().includes(search.toLowerCase())) ||
      (inq.productName && inq.productName.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || inq.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-stone-900 flex items-center gap-2">
            <Send className="w-5 h-5 text-emerald-700" />
            <span>Customer Product Inquiries</span>
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            All inquiries trigger instant Telegram notifications to administrator <strong>@Mercyyy_07</strong>.
          </p>
        </div>

        <button
          onClick={loadInquiries}
          className="flex items-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold px-3.5 py-2 rounded-xl transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by customer name, phone, telegram handle, product..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-stone-600">
          <Filter className="w-4 h-4 text-stone-400" />
          <span>Status:</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-xs font-medium focus:ring-2 focus:ring-emerald-700 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="contacted">Contacted</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table / List */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-xs text-stone-500 font-medium">
            Loading customer inquiries...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <Send className="w-8 h-8 text-stone-300 mx-auto" />
            <p className="text-xs font-bold text-stone-600">No inquiries found matching your filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-50 text-stone-500 uppercase font-extrabold text-[10px] tracking-wider border-b border-stone-200">
                  <th className="p-4">Inquiry #</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Product / Item</th>
                  <th className="p-4">Qty</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium text-stone-800">
                {filtered.map(inq => {
                  const tgUser = (inq.telegramUsername || '').startsWith('@')
                    ? inq.telegramUsername
                    : inq.telegramUsername ? `@${inq.telegramUsername}` : null;

                  return (
                    <tr key={inq.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="p-4 font-bold text-emerald-900">
                        {inq.inquiryNumber}
                      </td>
                      <td className="p-4 space-y-0.5">
                        <div className="font-bold text-stone-900">{inq.customerName}</div>
                        <div className="text-[11px] text-stone-500">{inq.email}</div>
                      </td>
                      <td className="p-4 space-y-0.5">
                        <div className="font-bold text-stone-900">{inq.productName || 'General Inquiry'}</div>
                        <div className="text-[11px] text-stone-500 truncate max-w-xs">{inq.message}</div>
                      </td>
                      <td className="p-4 font-bold text-stone-900">
                        {inq.quantity}
                      </td>
                      <td className="p-4 space-y-1">
                        <a href={`tel:${inq.phone}`} className="block text-emerald-800 font-bold hover:underline">
                          {inq.phone}
                        </a>
                        {tgUser && (
                          <a
                            href={`https://t.me/${tgUser.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded text-[10px] hover:bg-sky-200"
                          >
                            <Send className="w-2.5 h-2.5" />
                            <span>{tgUser}</span>
                          </a>
                        )}
                      </td>
                      <td className="p-4">
                        <select
                          value={inq.status}
                          disabled={updatingId === inq.id}
                          onChange={e => handleUpdateStatus(inq.id, e.target.value as any)}
                          className="bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1 text-[11px] font-bold focus:outline-none"
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Processing">Processing</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDelete(inq.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Inquiry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
