'use client';

import { useEffect, useState } from 'react';
import { AdminAPI } from '@/lib/adminApi';
import { getImageUrl } from '@/lib/imageUtils';

interface ResearchArea {
    id?: number;
    title: string;
    slug: string;
    icon_path?: string;
    description: string;
    order_index: number;
    is_active: boolean;
}

export default function ResearchAreasAdmin() {
    const [items, setItems] = useState<ResearchArea[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState<ResearchArea | null>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = async () => {
        try {
            const data = await AdminAPI.list('research-areas?active_only=False');
            setItems(data);
        } catch (error) {
            console.error('Failed to load research areas:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (item: ResearchArea) => {
        try {
            if (item.id) {
                await AdminAPI.update('research-areas', item.id, item);
            } else {
                await AdminAPI.create('research-areas', item);
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
            await AdminAPI.delete('research-areas', id);
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
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Research Areas</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">{items.length} research areas</p>
                </div>
                <button
                    onClick={() => {
                        setEditing({
                            title: '',
                            slug: '',
                            description: '',
                            order_index: items.length + 1,
                            is_active: true
                        });
                        setShowModal(true);
                    }}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                    + Add Research Area
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Slug</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Order</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Active</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {items.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{item.title}</td>
                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{item.slug}</td>
                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{item.order_index}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs rounded ${item.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'}`}>
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

function Modal({ item, onSave, onClose }: { item: ResearchArea; onSave: (item: ResearchArea) => void; onClose: () => void; }) {
    const [formData, setFormData] = useState(item);

    const generateSlug = (title: string) => {
        return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{item.id ? 'Edit' : 'Add'} Research Area</h2>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title *</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => {
                                const newTitle = e.target.value;
                                setFormData({
                                    ...formData,
                                    title: newTitle,
                                    slug: generateSlug(newTitle)
                                });
                            }}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Slug *</label>
                        <input
                            type="text"
                            required
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="auto-generated from title"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description *</label>
                        <textarea
                            required
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={5}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="Markdown supported"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Supports Markdown formatting</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Order Index *</label>
                            <input
                                type="number"
                                required
                                value={formData.order_index}
                                onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                            <select
                                value={formData.is_active ? 'active' : 'inactive'}
                                onChange={(e) => setFormData({ ...formData, is_active: e.target.value === 'active' })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Icon</label>
                            <div className="flex gap-4 items-center">
                                <input
                                    type="text"
                                    value={formData.icon_path || ''}
                                    onChange={(e) => setFormData({ ...formData, icon_path: e.target.value })}
                                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="Icon URL"
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
                                                const res = await AdminAPI.uploadFile('research-areas/upload-icon', file);
                                                setFormData({ ...formData, icon_path: res.icon_path });
                                            } catch (err) {
                                                alert('Upload failed');
                                            }
                                        }}
                                    />
                                </label>
                            </div>
                            {formData.icon_path && (
                                <div className="mt-2">
                                    <img src={getImageUrl(formData.icon_path)} alt="Icon preview" className="h-12 w-12 object-contain bg-gray-100 rounded" />
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Content Image (for Markdown)</label>
                            <div className="flex gap-4 items-center">
                                <label className="cursor-pointer px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition">
                                    <span>Upload Image to Insert</span>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;
                                            try {
                                                const res = await AdminAPI.uploadFile('research-areas/upload-content-image', file);
                                                // Insert markdown image syntax at cursor or append
                                                const imageMarkdown = `\n![${file.name}](${res.image_path})\n`;
                                                setFormData({ ...formData, description: formData.description + imageMarkdown });
                                            } catch (err) {
                                                alert('Upload failed');
                                            }
                                        }}
                                    />
                                </label>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Uploads an image and appends Markdown syntax to description</p>
                        </div>

                        <div className="flex justify-end gap-4 pt-4">
                            <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
                            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save</button>
                        </div>          </div>
                </form>
            </div>
        </div>
    );
}
