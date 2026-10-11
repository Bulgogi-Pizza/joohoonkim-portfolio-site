'use client';

import { useEffect, useState } from 'react';
import { AdminAPI } from '@/lib/adminApi';
import MarkdownContent from '@/components/MarkdownContent';

interface Opening {
    id: number;
    content: string;
    updated_at: string;
}

export default function OpeningAdmin() {
    const [content, setContent] = useState('');
    const [savedContent, setSavedContent] = useState('');
    const [updatedAt, setUpdatedAt] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadOpening();
    }, []);

    const applyOpening = (opening: Opening) => {
        setContent(opening.content);
        setSavedContent(opening.content);
        setUpdatedAt(opening.updated_at);
    };

    const loadOpening = async () => {
        try {
            applyOpening(await AdminAPI.list('opening'));
        } catch (error) {
            console.error('Failed to load opening:', error);
            alert('Failed to load opening');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            applyOpening(await AdminAPI.put('opening', { content }));
        } catch (error) {
            alert('Failed to save opening');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>;
    }

    const isDirty = content !== savedContent;

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Opening</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Markdown content for the public Opening page.
                        {updatedAt && ` Last saved ${new Date(updatedAt).toLocaleString()}.`}
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving || !isDirty}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {saving ? 'Saving...' : 'Save'}
                </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
                    <p className="px-6 py-3 bg-gray-50 dark:bg-gray-700 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Markdown</p>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        spellCheck={false}
                        className="flex-1 min-h-[70vh] w-full p-6 font-mono text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none resize-y"
                        placeholder={'## Open Positions\n\nWe are looking for motivated graduate students...'}
                    />
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <p className="px-6 py-3 bg-gray-50 dark:bg-gray-700 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Preview</p>
                    <div className="p-6 min-h-[70vh] bg-paper dark:bg-dark-bg">
                        {content.trim() ? (
                            <MarkdownContent content={content} />
                        ) : (
                            <p className="text-center py-12 text-ink-3 dark:text-dark-ink-3">No open positions at the moment.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
