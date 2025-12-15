'use client';

import { useEffect, useState } from 'react';
import { AdminAPI } from '@/lib/adminApi';

interface Award {
    id?: number;
    title: string;
    organization: string;
    location: string;
    year: string;
    rank?: string;
}

export default function AwardsAdmin() {
    const [awards, setAwards] = useState<Award[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingAward, setEditingAward] = useState<Award | null>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        loadAwards();
    }, []);

    const loadAwards = async () => {
        try {
            const data = await AdminAPI.list('awards');
            setAwards(data);
        } catch (error) {
            console.error('Failed to load awards:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (award: Award) => {
        try {
            if (award.id) {
                await AdminAPI.update('awards', award.id, award);
            } else {
                await AdminAPI.create('awards', award);
            }
            loadAwards();
            setShowModal(false);
            setEditingAward(null);
        } catch (error) {
            alert('Failed to save award');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this award?')) return;
        try {
            await AdminAPI.delete('awards', id);
            loadAwards();
        } catch (error) {
            alert('Failed to delete award');
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>;
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Awards</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">{awards.length} total awards</p>
                </div>
                <button
                    onClick={() => {
                        setEditingAward({
                            title: '',
                            organization: '',
                            location: '',
                            year: new Date().getFullYear().toString(),
                        });
                        setShowModal(true);
                    }}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                    + Add Award
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Organization</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Year</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Rank</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {awards.map((award) => (
                            <tr key={award.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{award.title}</td>
                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{award.organization}</td>
                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{award.year}</td>
                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{award.rank || '-'}</td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button
                                        onClick={() => {
                                            setEditingAward(award);
                                            setShowModal(true);
                                        }}
                                        className="text-blue-600 dark:text-blue-400 hover:underline"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => award.id && handleDelete(award.id)}
                                        className="text-red-600 dark:text-red-400 hover:underline"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && editingAward && (
                <AwardModal
                    award={editingAward}
                    onSave={handleSave}
                    onClose={() => {
                        setShowModal(false);
                        setEditingAward(null);
                    }}
                />
            )}
        </div>
    );
}

function AwardModal({ award, onSave, onClose }: {
    award: Award;
    onSave: (award: Award) => void;
    onClose: () => void;
}) {
    const [formData, setFormData] = useState(award);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {award.id ? 'Edit Award' : 'Add Award'}
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title *</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Organization *</label>
                            <input
                                type="text"
                                required
                                value={formData.organization}
                                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location *</label>
                            <input
                                type="text"
                                required
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Year *</label>
                            <input
                                type="text"
                                required
                                value={formData.year}
                                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rank</label>
                            <input
                                type="text"
                                value={formData.rank || ''}
                                onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                placeholder="e.g., 1st place, Gold"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
