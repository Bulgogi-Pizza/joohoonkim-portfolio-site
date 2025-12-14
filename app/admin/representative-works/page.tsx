'use client';

import { useEffect, useState } from 'react';
import { AdminAPI } from '@/lib/adminApi';
import { getImageUrl } from '@/lib/imageUtils';

interface RepresentativeWork {
    id?: number;
    title: string;
    journal: string;
    volume?: string;
    is_in_revision: boolean;
    pages?: string;
    year?: string;
    image_path: string;
    order_index: number;
    is_active: boolean;
}

export default function RepresentativeWorksAdmin() {
    const [items, setItems] = useState<RepresentativeWork[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState<RepresentativeWork | null>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = async () => {
        try {
            const data = await AdminAPI.list('representative-works');
            setItems(data);
        } catch (error) {
            console.error('Failed to load representative works:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (item: RepresentativeWork) => {
        try {
            if (item.id) {
                await AdminAPI.update('representative-works', item.id, item);
            } else {
                await AdminAPI.create('representative-works', item);
            }
            loadItems();
            setShowModal(false);
            setEditing(null);
        } catch (error) {
            alert('Failed to save');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this entry?')) return;
        try {
            await AdminAPI.delete('representative-works', id);
            loadItems();
        } catch (error) {
            alert('Failed to delete');
        }
    };

    if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Representative Works</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">{items.length} items</p>
                </div>
                <button
                    onClick={() => {
                        setEditing({
                            title: '',
                            journal: '',
                            image_path: '',
                            order_index: 0,
                            is_active: true,
                            is_in_revision: false
                        });
                        setShowModal(true);
                    }}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                    + Add Work
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Order</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Image</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Journal</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {items.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{item.order_index}</td>
                                <td className="px-6 py-4">
                                    {item.image_path && (
                                        <img src={getImageUrl(item.image_path)} alt={item.title} className="h-12 w-20 object-cover rounded" />
                                    )}
                                </td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{item.title}</td>
                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                                    {item.journal}
                                    {item.is_in_revision && <span className="ml-2 px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded-full">In Revision</span>}
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <span className={`px-2 py-1 rounded-full text-xs ${item.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {item.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button onClick={() => { setEditing(item); setShowModal(true); }} className="text-blue-600 dark:text-blue-400 hover:underline">Edit</button>
                                    <button onClick={() => item.id && handleDelete(item.id)} className="text-red-600 dark:text-red-400 hover:underline">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && editing && (
                <Modal item={editing} onSave={handleSave} onClose={() => { setShowModal(false); setEditing(null); }} />
            )}
        </div>
    );
}

function Modal({ item, onSave, onClose }: { item: RepresentativeWork; onSave: (item: RepresentativeWork) => void; onClose: () => void; }) {
    const [formData, setFormData] = useState(item);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{item.id ? 'Edit' : 'Add'} Representative Work</h2>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title *</label>
                        <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Journal *</label>
                            <input type="text" required value={formData.journal} onChange={(e) => setFormData({ ...formData, journal: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Year</label>
                            <input type="text" value={formData.year || ''} onChange={(e) => setFormData({ ...formData, year: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Volume</label>
                            <input type="text" value={formData.volume || ''} onChange={(e) => setFormData({ ...formData, volume: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pages</label>
                            <input type="text" value={formData.pages || ''} onChange={(e) => setFormData({ ...formData, pages: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Image *</label>
                        <div className="flex gap-4 items-center">
                            <input
                                type="text"
                                required
                                value={formData.image_path}
                                onChange={(e) => setFormData({ ...formData, image_path: e.target.value })}
                                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                placeholder="Image URL"
                            />
                            <label className="cursor-pointer px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition">
                                <span>Upload</span>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        try {
                                            const res = await AdminAPI.uploadFile('representative-works/upload-image', file);
                                            setFormData({ ...formData, image_path: res.image_path });
                                        } catch (err) {
                                            alert('Upload failed');
                                        }
                                    }}
                                />
                            </label>
                        </div>
                        {formData.image_path && (
                            <div className="mt-2">
                                <img src={getImageUrl(formData.image_path)} alt="Preview" className="h-32 w-auto object-contain bg-gray-100 rounded" />
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.is_in_revision}
                                onChange={(e) => setFormData({ ...formData, is_in_revision: e.target.checked })}
                                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">In Revision</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.is_active}
                                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Active</span>
                        </label>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Order Index</label>
                        <input type="number" value={formData.order_index} onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
                        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
