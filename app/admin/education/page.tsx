'use client';

import { useEffect, useState } from 'react';
import { AdminAPI } from '@/lib/adminApi';

interface Education {
    id?: number;
    degree: string;
    institution: string;
    location: string;
    start_year: string;
    end_year: string;
    advisor?: string;
    description?: string;
}

export default function EducationAdmin() {
    const [items, setItems] = useState<Education[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState<Education | null>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = async () => {
        try {
            const data = await AdminAPI.list('education');
            setItems(data);
        } catch (error) {
            console.error('Failed to load education:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (item: Education) => {
        try {
            if (item.id) {
                await AdminAPI.update('education', item.id, item);
            } else {
                await AdminAPI.create('education', item);
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
            await AdminAPI.delete('education', id);
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
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Education</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">{items.length} entries</p>
                </div>
                <button
                    onClick={() => {
                        setEditing({ degree: '', institution: '', location: '', start_year: '', end_year: '' });
                        setShowModal(true);
                    }}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                    + Add Education
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Degree</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Institution</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Period</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {items.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{item.degree}</td>
                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{item.institution}</td>
                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{item.start_year} - {item.end_year}</td>
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

function Modal({ item, onSave, onClose }: { item: Education; onSave: (item: Education) => void; onClose: () => void; }) {
    const [formData, setFormData] = useState(item);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{item.id ? 'Edit' : 'Add'} Education</h2>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Degree *</label>
                        <input type="text" required value={formData.degree} onChange={(e) => setFormData({ ...formData, degree: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Institution *</label>
                            <input type="text" required value={formData.institution} onChange={(e) => setFormData({ ...formData, institution: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location *</label>
                            <input type="text" required value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Start Year *</label>
                            <input type="text" required value={formData.start_year} onChange={(e) => setFormData({ ...formData, start_year: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">End Year *</label>
                            <input type="text" required value={formData.end_year} onChange={(e) => setFormData({ ...formData, end_year: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Advisor</label>
                        <input type="text" value={formData.advisor || ''} onChange={(e) => setFormData({ ...formData, advisor: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
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
