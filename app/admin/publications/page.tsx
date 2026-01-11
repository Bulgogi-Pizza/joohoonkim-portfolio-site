'use client';

import { useEffect, useState } from 'react';
import { AdminAPI } from '@/lib/adminApi';

interface Publication {
    id?: number;
    title: string;
    authors: string;
    journal: string;
    volume?: string;
    pages?: string;
    year: string;
    doi?: string;
    arxiv?: string;
    status?: string;
    impact_factor?: number;
    contribution_type?: string;
    is_first_author?: boolean;
    is_corresponding_author?: boolean;
    is_equal_contribution?: boolean;
    featured_info?: string;
}

export default function PublicationsAdmin() {
    const [publications, setPublications] = useState<Publication[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingPub, setEditingPub] = useState<Publication | null>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        loadPublications();
    }, []);

    const loadPublications = async () => {
        try {
            const data = await AdminAPI.list('publications');
            setPublications(data);
        } catch (error) {
            console.error('Failed to load publications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (pub: Publication) => {
        try {
            if (pub.id) {
                await AdminAPI.update('publications', pub.id, pub);
            } else {
                await AdminAPI.create('publications', pub);
            }
            loadPublications();
            setShowModal(false);
            setEditingPub(null);
        } catch (error) {
            alert('Failed to save publication');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this publication?')) return;
        try {
            await AdminAPI.delete('publications', id);
            loadPublications();
        } catch (error) {
            alert('Failed to delete publication');
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
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Publications</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">{publications.length} total publications</p>
                </div>
                <button
                    onClick={() => {
                        setEditingPub({
                            title: '',
                            authors: '',
                            journal: '',
                            year: new Date().getFullYear().toString(),
                            featured_info: '',
                        });
                        setShowModal(true);
                    }}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                    + Add Publication
                </button>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Journal</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Year</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {publications.map((pub) => (
                                <tr key={pub.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">{pub.title}</div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">{pub.authors}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{pub.journal}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{pub.year}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs rounded ${pub.status === 'published' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                            pub.status === 'in revision' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                                            }`}>
                                            {pub.status || 'published'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button
                                            onClick={() => {
                                                setEditingPub(pub);
                                                setShowModal(true);
                                            }}
                                            className="text-blue-600 dark:text-blue-400 hover:underline"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => pub.id && handleDelete(pub.id)}
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
            </div>

            {/* Modal */}
            {showModal && editingPub && (
                <PublicationModal
                    publication={editingPub}
                    onSave={handleSave}
                    onClose={() => {
                        setShowModal(false);
                        setEditingPub(null);
                    }}
                />
            )}
        </div>
    );
}

function PublicationModal({ publication, onSave, onClose }: {
    publication: Publication;
    onSave: (pub: Publication) => void;
    onClose: () => void;
}) {
    const [formData, setFormData] = useState(publication);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {publication.id ? 'Edit Publication' : 'Add Publication'}
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
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Authors *</label>
                            <input
                                type="text"
                                required
                                value={formData.authors}
                                onChange={(e) => setFormData({ ...formData, authors: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Journal *</label>
                            <input
                                type="text"
                                required
                                value={formData.journal}
                                onChange={(e) => setFormData({ ...formData, journal: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
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
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Volume</label>
                            <input
                                type="text"
                                value={formData.volume || ''}
                                onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pages</label>
                            <input
                                type="text"
                                value={formData.pages || ''}
                                onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">DOI</label>
                            <input
                                type="text"
                                value={formData.doi || ''}
                                onChange={(e) => setFormData({ ...formData, doi: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                            <select
                                value={formData.status || 'published'}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            >
                                <option value="published">Published</option>
                                <option value="in revision">In Revision</option>
                                <option value="accepted">Accepted</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Featured Info</label>
                            <input
                                type="text"
                                value={formData.featured_info || ''}
                                onChange={(e) => setFormData({ ...formData, featured_info: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
