'use client';

import { useEffect, useState } from 'react';
import { AdminAPI } from '@/lib/adminApi';

interface ContactInfo {
    id?: number;
    label: string;
    value: string;
    data_type: string;
    order_index: number;
}

interface CVProfile {
    id?: number;
    name: string;
    title: string;
    bio: string;
    profile_image: string;
    contact_info: ContactInfo[];
}

const emptyProfile: CVProfile = {
    name: '',
    title: '',
    bio: '',
    profile_image: '',
    contact_info: [],
};

export default function CVProfileAdmin() {
    const [profile, setProfile] = useState<CVProfile>(emptyProfile);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetch('/api/cv/profile')
            .then(r => r.ok ? r.json() : null)
            .then(data => {
                if (data) setProfile(data);
            })
            .catch(err => console.error('Failed to load profile:', err))
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            if (profile.id) {
                await AdminAPI.update('cv/profile', profile.id, profile);
            } else {
                await AdminAPI.create('cv/profile', profile);
            }
            alert('저장되었습니다.');
        } catch {
            alert('저장에 실패했습니다.');
        } finally {
            setSaving(false);
        }
    };

    const updateContact = (index: number, field: keyof ContactInfo, value: string | number) => {
        const updated = [...profile.contact_info];
        updated[index] = { ...updated[index], [field]: value };
        setProfile({ ...profile, contact_info: updated });
    };

    const addContact = () => {
        setProfile({
            ...profile,
            contact_info: [
                ...profile.contact_info,
                { label: '', value: '', data_type: 'text', order_index: profile.contact_info.length },
            ],
        });
    };

    const removeContact = (index: number) => {
        const updated = profile.contact_info.filter((_, i) => i !== index);
        setProfile({ ...profile, contact_info: updated });
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
    );

    return (
        <div className="max-w-3xl">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">CV Profile</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">이름, 직책, 연락처, 링크 수정</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
                >
                    {saving ? 'Saving...' : 'Save'}
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name *</label>
                    <input
                        type="text"
                        value={profile.name}
                        onChange={e => setProfile({ ...profile, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title / Position</label>
                    <input
                        type="text"
                        value={profile.title}
                        onChange={e => setProfile({ ...profile, title: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</label>
                    <textarea
                        rows={4}
                        value={profile.bio}
                        onChange={e => setProfile({ ...profile, bio: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mt-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Contact Info &amp; Links</h2>
                    <button
                        onClick={addContact}
                        className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        + Add
                    </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                    data_type: <code>email</code> / <code>phone</code> / <code>link</code> / <code>text</code> — label이 &quot;office&quot;이면 사무실로 표시
                </p>

                <div className="space-y-3">
                    {profile.contact_info.map((contact, index) => (
                        <div key={index} className="grid grid-cols-12 gap-2 items-center">
                            <input
                                type="text"
                                placeholder="Label (e.g. Email, Office)"
                                value={contact.label}
                                onChange={e => updateContact(index, 'label', e.target.value)}
                                className="col-span-3 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                            <input
                                type="text"
                                placeholder="Value"
                                value={contact.value}
                                onChange={e => updateContact(index, 'value', e.target.value)}
                                className="col-span-5 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                            <select
                                value={contact.data_type}
                                onChange={e => updateContact(index, 'data_type', e.target.value)}
                                className="col-span-2 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            >
                                <option value="text">text</option>
                                <option value="email">email</option>
                                <option value="phone">phone</option>
                                <option value="link">link</option>
                            </select>
                            <input
                                type="number"
                                placeholder="Order"
                                value={contact.order_index}
                                onChange={e => updateContact(index, 'order_index', parseInt(e.target.value) || 0)}
                                className="col-span-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                            <button
                                onClick={() => removeContact(index)}
                                className="col-span-1 text-red-600 dark:text-red-400 hover:underline text-sm text-center"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    {profile.contact_info.length === 0 && (
                        <p className="text-sm text-gray-400 dark:text-gray-500">연락처 정보가 없습니다. + Add를 눌러 추가하세요.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
