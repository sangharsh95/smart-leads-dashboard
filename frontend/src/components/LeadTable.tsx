import React from 'react';
import type { Lead } from '../types';
import { format } from 'date-fns';
import { Edit2, Trash2, FileX, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../context/AuthContext';

interface LeadTableProps {
  leads: Lead[];
  loading: boolean;
  error: string;
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
}

const LeadTable: React.FC<LeadTableProps> = ({ leads, loading, error, onEdit, onDelete }) => {
  const { user } = useAuth();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'Contacted': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'Qualified': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'Lost': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center text-red-500 min-h-[300px]">
        {error}
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 min-h-[300px]">
        <FileX className="w-12 h-12 mb-3 text-gray-400 dark:text-gray-600" />
        <p className="text-lg font-medium text-gray-900 dark:text-white">No leads found</p>
        <p className="text-sm">Try adjusting your filters or search query.</p>
      </div>
    );
  }

  return (
    <table className="w-full text-left border-collapse min-w-max">
      <thead className="bg-gray-50 dark:bg-gray-800/80 sticky top-0 z-10 shadow-sm">
        <tr>
          <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
          <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
          <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
          <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Source</th>
          <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Added</th>
          <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
        {leads.map((lead) => (
          <tr key={lead._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors group">
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm font-medium text-gray-900 dark:text-white">{lead.name}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-500 dark:text-gray-400">{lead.email}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className={clsx('px-2.5 py-1 text-xs font-medium rounded-full', getStatusColor(lead.status))}>
                {lead.status}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-500 dark:text-gray-400">{lead.source}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {format(new Date(lead.createdAt), 'MMM d, yyyy')}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onEdit(lead)}
                  className="p-1.5 text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 bg-gray-100 dark:bg-gray-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                >
                  <Edit2 size={16} />
                </button>
                {user?.role === 'Admin' && (
                  <button
                    onClick={() => onDelete(lead._id)}
                    className="p-1.5 text-gray-500 hover:text-red-600 dark:hover:text-red-400 bg-gray-100 dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default LeadTable;
