'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';

export default function CollectionsPage() {
  const { collections, addCollection, deleteCollection, showToast } = useStore();
  const [newName, setNewName] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleAdd = () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    addCollection(trimmed);
    setNewName('');
    setShowForm(false);
    showToast('Collection created!');
  };

  const handleDelete = (id: string) => {
    deleteCollection(id);
    showToast('Collection deleted');
  };

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-black text-[#3e2723]">Manage Collections</h2>
        <button
          onClick={() => setShowForm(v => !v)}
          className="bg-gradient-to-br from-[#8d5524] to-[#b87333] text-white px-4 py-2 rounded-lg text-sm font-bold hover:-translate-y-0.5 transition-all shadow-md"
        >
          <i className="fas fa-plus mr-2" />New Collection
        </button>
      </div>

      {/* Inline create form */}
      {showForm && (
        <div className="bg-white border border-[#8d5524]/20 rounded-2xl p-5 mb-6 shadow-sm">
          <h4 className="font-bold text-sm text-gray-600 mb-3">Collection Name</h4>
          <div className="flex gap-3">
            <input
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              placeholder="e.g., Winter Special 2026"
              className="flex-grow px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#8d5524] text-sm"
              autoFocus
            />
            <button
              onClick={handleAdd}
              className="bg-gradient-to-br from-[#8d5524] to-[#b87333] text-white px-5 py-3 rounded-xl font-bold text-sm"
            >
              Create
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-3 rounded-xl border text-gray-500 text-sm font-bold hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Collections list */}
      {collections.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border">
          <i className="fas fa-layer-group text-5xl text-gray-200 block mb-4" />
          <p className="text-gray-400 font-bold">No collections yet</p>
          <p className="text-gray-400 text-sm">Create your first collection to group products by theme or season.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {collections.map(c => (
            <div
              key={c.id}
              className="bg-white p-6 rounded-2xl border shadow-sm flex items-center justify-between hover:border-[#8d5524]/30 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#8d5524]/10 to-[#b87333]/10 rounded-xl flex items-center justify-center">
                  <i className="fas fa-layer-group text-[#8d5524]" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{c.name}</h3>
                  <p className="text-sm text-gray-500">{c.count} products • {c.date}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => showToast('Edit feature coming soon!')}
                  className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-bold hover:bg-gray-200 transition-all"
                >
                  <i className="fas fa-edit mr-1" />Edit
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="px-4 py-2 text-red-500 text-sm font-bold hover:bg-red-50 rounded-lg transition-all"
                >
                  <i className="fas fa-trash mr-1" />Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}