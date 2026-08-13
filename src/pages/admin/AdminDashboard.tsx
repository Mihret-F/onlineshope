import React, { useEffect, useState } from 'react';
import {
  Package,
  Layers,
  Send,
  AlertCircle,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowRight
} from 'lucide-react';
import { DashboardStats, Inquiry } from '../../types';
import { api } from '../../services/api';

interface AdminDashboardProps {
  onNavigateTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateTab }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentInquiries, setRecentInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [s, inqs] = await Promise.all([
        api.getStats(),
        api.getInquiries()
      ]);
      setStats(s);
      setRecentInquiries(inqs.slice(0, 5));
      setLoading(false);
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <div className="py-16 text-center space-y-3">
        <Loader2 className="w-8 h-8 text-emerald-700 animate-spin mx-auto" />
        <p className="text-xs font-semibold text-stone-500">Loading Dashboard Metrics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Products */}
        <div
          onClick={() => onNavigateTab('products')}
          className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs cursor-pointer hover:border-emerald-600 transition-all space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Total Products</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-stone-900">{stats.totalProducts}</p>
          <div className="flex items-center gap-3 text-[11px] text-stone-500 font-medium">
            <span className="text-emerald-700 font-bold">{stats.activeProducts} Active</span>
            <span>•</span>
            <span className="text-amber-700 font-bold">{stats.outOfStockProducts} Out of Stock</span>
          </div>
        </div>

        {/* Categories */}
        <div
          onClick={() => onNavigateTab('categories')}
          className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs cursor-pointer hover:border-emerald-600 transition-all space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Categories</span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-stone-900">{stats.totalCategories}</p>
          <p className="text-[11px] text-stone-500 font-medium">
            Active Product Collections
          </p>
        </div>

        {/* Total Inquiries */}
        <div
          onClick={() => onNavigateTab('inquiries')}
          className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs cursor-pointer hover:border-emerald-600 transition-all space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Total Inquiries</span>
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-800 flex items-center justify-center">
              <Send className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-stone-900">{stats.totalInquiries}</p>
          <div className="flex items-center gap-3 text-[11px] font-medium">
            <span className="text-rose-700 font-bold">{stats.newInquiries} New</span>
            <span>•</span>
            <span className="text-emerald-700 font-bold">{stats.completedInquiries} Completed</span>
          </div>
        </div>

        {/* Pending Action */}
        <div
          onClick={() => onNavigateTab('inquiries')}
          className="bg-emerald-900 text-white p-5 rounded-2xl shadow-md cursor-pointer hover:bg-emerald-950 transition-all space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider">Pending Action</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-800 text-emerald-100 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white">{stats.newInquiries + stats.pendingInquiries}</p>
          <p className="text-[11px] text-emerald-200 font-medium">
            Inquiries awaiting review
          </p>
        </div>

      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Products by Category Breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center justify-between">
            <span>Products by Category</span>
            <Layers className="w-4 h-4 text-emerald-700" />
          </h3>
          <div className="space-y-3">
            {stats.productsByCategory.map((cat, idx) => {
              const percentage = stats.totalProducts > 0 ? Math.round((cat.count / stats.totalProducts) * 100) : 0;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-stone-700">
                    <span>{cat.category}</span>
                    <span>{cat.count} items ({percentage}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-700 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Most Requested Products */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center justify-between">
            <span>Most Requested Products</span>
            <TrendingUp className="w-4 h-4 text-emerald-700" />
          </h3>
          {stats.mostRequestedProducts.length > 0 ? (
            <div className="space-y-3">
              {stats.mostRequestedProducts.map((prod, idx) => (
                <div key={idx} className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 flex items-center justify-between text-xs">
                  <div className="font-bold text-stone-900 truncate max-w-[220px]">
                    {idx + 1}. {prod.name}
                  </div>
                  <span className="bg-emerald-100 text-emerald-900 font-extrabold px-2.5 py-1 rounded-full">
                    {prod.inquiriesCount} Inquiries
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-stone-500 py-8 text-center">No inquiry trends data yet.</p>
          )}
        </div>

      </div>

      {/* Recent Inquiries Section */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-stone-900">Recent Customer Inquiries</h3>
          <button
            onClick={() => onNavigateTab('inquiries')}
            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-900"
          >
            <span>View All Inquiries</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentInquiries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700 border-collapse">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50 text-stone-500 uppercase tracking-wider text-[10px]">
                  <th className="p-3">Inquiry ID</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Product</th>
                  <th className="p-3">Qty</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {recentInquiries.map(inq => (
                  <tr key={inq.id} className="hover:bg-stone-50 transition-colors">
                    <td className="p-3 font-mono font-bold text-emerald-900">{inq.inquiryNumber}</td>
                    <td className="p-3 font-semibold text-stone-900">{inq.customerName}</td>
                    <td className="p-3">{inq.phone}</td>
                    <td className="p-3 font-medium text-stone-800 truncate max-w-[180px]">
                      {inq.productName || 'General Request'}
                    </td>
                    <td className="p-3 font-bold">{inq.quantity}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        inq.status === 'New' ? 'bg-rose-100 text-rose-800' :
                        inq.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {inq.status}
                      </span>
                    </td>
                    <td className="p-3 text-stone-500">
                      {new Date(inq.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-stone-500 py-6 text-center">No customer inquiries submitted yet.</p>
        )}
      </div>

    </div>
  );
};
