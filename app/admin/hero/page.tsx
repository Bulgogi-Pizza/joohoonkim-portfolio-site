'use client';

import { useEffect, useState } from 'react';
import { AdminAPI } from '@/lib/adminApi';

interface HeroContent {
    id?: number;
    title: string;
    title_highlight: string;
    description: string;
    cta_primary_text: string;
    cta_primary_link: string;
    cta_secondary_text: string;
    cta_secondary_link: string;
    is_active: boolean;
}

const defaultHero: HeroContent = {
    title: 'Innovating',
    title_highlight: 'Nanophotonics',
    description: 'Ph.D. student at POSTECH, specializing in nanofabrication and metasurfaces for next-gen optical applications like VR/AR and optical computing.',
    cta_primary_text: 'Explore Research',
    cta_primary_link: '/research',
    cta_secondary_text: 'View CV',
    cta_secondary_link: '/cv',
    is_active: true
};

export default function HeroAdmin() {
    const [items, setItems] = useState<HeroContent[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState<HeroContent | null>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = async () => {
        try {
            const data = await AdminAPI.list('hero/all');
            setItems(data);
        } catch (error) {
            console.error('Failed to load hero contents:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (item: HeroContent) => {
        try {
            if (item.id) {
                await AdminAPI.update('hero', item.id, item);
            } else {
                await AdminAPI.create('hero', item);
            }
            loadItems();
            setShowModal(false);
            setEditing(null);
        } catch (error) {
            alert('Failed to save');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this hero content?')) return;
        try {
            await AdminAPI.delete('hero', id);
            loadItems();
        } catch (error) {
            alert('Failed to delete');
        }
    };

    const handleActivate = async (id: number) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/hero/${id}/activate`, {
                method: 'POST',
                credentials: 'include',
            });
            if (!res.ok) throw new Error('Failed to activate');
            loadItems();
        } catch (error) {
            alert('Failed to activate');
        }
    };

    if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Hero Content</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Manage homepage hero section text. Only one can be active at a time.
                    </p>
                </div>
                <button
                    onClick={() => {
                        setEditing({ ...defaultHero });
                        setShowModal(true);
                    }}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                    + Add Hero Content
                </button>
            </div>

            {items.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">No hero content yet. Default values will be used.</p>
                    <button
                        onClick={() => {
                            setEditing({ ...defaultHero });
                            setShowModal(true);
                        }}
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        Create your first hero content
                    </button>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Description</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {items.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                            {item.title} <span className="text-blue-600 dark:text-blue-400">{item.title_highlight}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-md truncate">
                                        {item.description}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs rounded ${item.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'}`}>
                                            {item.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        {!item.is_active && (
                                            <button onClick={() => item.id && handleActivate(item.id)} className="text-green-600 dark:text-green-400 hover:underline">Activate</button>
                                        )}
                                        <button onClick={() => { setEditing(item); setShowModal(true); }} className="text-blue-600 dark:text-blue-400 hover:underline">Edit</button>
                                        <button onClick={() => item.id && handleDelete(item.id)} className="text-red-600 dark:text-red-400 hover:underline">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showModal && editing && (
                <Modal item={editing} onSave={handleSave} onClose={() => { setShowModal(false); setEditing(null); }} />
            )}
        </div>
    );
}

function Modal({ item, onSave, onClose }: { item: HeroContent; onSave: (item: HeroContent) => void; onClose: () => void; }) {
    const [formData, setFormData] = useState(item);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{item.id ? 'Edit' : 'Add'} Hero Content</h2>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="p-6 space-y-6">
                    {/* Preview Section */}
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-3">Preview</p>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            {formData.title} <span className="text-blue-600 dark:text-blue-400">{formData.title_highlight}</span>
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">{formData.description}</p>
                        <div className="flex gap-3">
                            <span className="px-4 py-2 bg-blue-600 text-white text-sm rounded">{formData.cta_primary_text}</span>
                            <span className="px-4 py-2 border border-gray-300 text-gray-700 dark:text-gray-300 text-sm rounded">{formData.cta_secondary_text}</span>
                        </div>
                    </div>

                    {/* Title Fields */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title (First Line) *</label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                placeholder="e.g., Innovating"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title Highlight (Second Line) *</label>
                            <input
                                type="text"
                                required
                                value={formData.title_highlight}
                                onChange={(e) => setFormData({ ...formData, title_highlight: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                placeholder="e.g., Nanophotonics"
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">This text will be highlighted in the brand color</p>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description *</label>
                        <textarea
                            required
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="Brief description about your research focus..."
                        />
                    </div>

                    {/* Primary CTA */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Primary Button Text *</label>
                            <input
                                type="text"
                                required
                                value={formData.cta_primary_text}
                                onChange={(e) => setFormData({ ...formData, cta_primary_text: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                placeholder="e.g., Explore Research"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Primary Button Link *</label>
                            <input
                                type="text"
                                required
                                value={formData.cta_primary_link}
                                onChange={(e) => setFormData({ ...formData, cta_primary_link: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                placeholder="e.g., /research"
                            />
                        </div>
                    </div>

                    {/* Secondary CTA */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Secondary Button Text *</label>
                            <input
                                type="text"
                                required
                                value={formData.cta_secondary_text}
                                onChange={(e) => setFormData({ ...formData, cta_secondary_text: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                placeholder="e.g., View CV"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Secondary Button Link *</label>
                            <input
                                type="text"
                                required
                                value={formData.cta_secondary_link}
                                onChange={(e) => setFormData({ ...formData, cta_secondary_link: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                placeholder="e.g., /cv"
                            />
                        </div>
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                        <select
                            value={formData.is_active ? 'active' : 'inactive'}
                            onChange={(e) => setFormData({ ...formData, is_active: e.target.value === 'active' })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                            <option value="active">Active (will be displayed on homepage)</option>
                            <option value="inactive">Inactive</option>
                        </select>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Setting to active will deactivate any other hero content</p>
                    </div>

                    <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
                        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

