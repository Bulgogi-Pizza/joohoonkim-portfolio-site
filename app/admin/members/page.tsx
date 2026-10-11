'use client';

import { useEffect, useState } from 'react';
import { AdminAPI } from '@/lib/adminApi';
import { getImageUrl } from '@/lib/imageUtils';
import { Member, MemberCategory } from '@/components/MemberCard';

interface MemberForm {
    id?: number;
    category: MemberCategory;
    name: string;
    email: string;
    position: string;
    research_interest: string;
    education: string[];
    image_path: string | null;
    order_index: number | null;
}

const CATEGORY_LABELS: Record<MemberCategory, string> = {
    pi: 'PI',
    researcher: 'Researcher',
    alumni: 'Alumni',
};

const FILTERS: (MemberCategory | 'all')[] = ['all', 'pi', 'researcher', 'alumni'];

const inputClass = 'w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white';
const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2';

const toForm = (member: Member): MemberForm => ({
    id: member.id,
    category: member.category,
    name: member.name,
    email: member.email ?? '',
    position: member.position ?? '',
    research_interest: member.research_interest ?? '',
    education: member.education,
    image_path: member.image_path,
    order_index: member.order_index,
});

const toPayload = (form: MemberForm) => ({
    category: form.category,
    name: form.name,
    email: form.email.trim() || null,
    position: form.position.trim() || null,
    research_interest: form.category === 'researcher' ? form.research_interest.trim() || null : null,
    education: form.education.map(line => line.trim()).filter(Boolean),
    image_path: form.image_path,
    order_index: form.order_index,
});

export default function MembersAdmin() {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<MemberCategory | 'all'>('all');
    const [editing, setEditing] = useState<MemberForm | null>(null);

    useEffect(() => {
        loadMembers();
    }, []);

    const loadMembers = async () => {
        try {
            const data = await AdminAPI.list('members');
            setMembers(data);
        } catch (error) {
            console.error('Failed to load members:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (form: MemberForm) => {
        try {
            const payload = toPayload(form);
            if (form.id) {
                await AdminAPI.update('members', form.id, payload);
            } else {
                await AdminAPI.create('members', payload);
            }
            loadMembers();
            setEditing(null);
        } catch (error) {
            alert('Failed to save member');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this member?')) return;
        try {
            await AdminAPI.delete('members', id);
            loadMembers();
        } catch (error) {
            alert('Failed to delete member');
        }
    };

    const visibleMembers = filter === 'all' ? members : members.filter(m => m.category === filter);

    if (loading) {
        return <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>;
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Members</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">{members.length} total members</p>
                </div>
                <button
                    onClick={() => setEditing({
                        category: filter === 'all' ? 'researcher' : filter,
                        name: '',
                        email: '',
                        position: '',
                        research_interest: '',
                        education: [],
                        image_path: null,
                        order_index: null,
                    })}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                    + Add Member
                </button>
            </div>

            <div className="flex gap-2 mb-4">
                {FILTERS.map(key => (
                    <button
                        key={key}
                        onClick={() => setFilter(key)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === key
                            ? 'bg-blue-600 text-white'
                            : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                    >
                        {key === 'all' ? 'All' : CATEGORY_LABELS[key]}
                        <span className="ml-1.5 opacity-70">
                            {key === 'all' ? members.length : members.filter(m => m.category === key).length}
                        </span>
                    </button>
                ))}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Photo</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Email</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Order</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {visibleMembers.map((member) => (
                            <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <td className="px-6 py-4">
                                    {member.image_path ? (
                                        <img src={getImageUrl(member.image_path)} alt={member.name} className="h-12 w-12 object-cover rounded" />
                                    ) : (
                                        <div className="h-12 w-12 rounded bg-gray-100 dark:bg-gray-700" />
                                    )}
                                </td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{member.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{CATEGORY_LABELS[member.category]}</td>
                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{member.email || '-'}</td>
                                <td className="px-6 py-4 text-center text-sm text-gray-900 dark:text-white">{member.order_index ?? '-'}</td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button
                                        onClick={() => setEditing(toForm(member))}
                                        className="text-blue-600 dark:text-blue-400 hover:underline"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(member.id)}
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

            {editing && (
                <MemberModal
                    member={editing}
                    onSave={handleSave}
                    onClose={() => setEditing(null)}
                />
            )}
        </div>
    );
}

function MemberModal({ member, onSave, onClose }: {
    member: MemberForm;
    onSave: (member: MemberForm) => void;
    onClose: () => void;
}) {
    const [formData, setFormData] = useState(member);

    const setEducation = (education: string[]) => setFormData({ ...formData, education });

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {member.id ? 'Edit Member' : 'Add Member'}
                    </h2>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Category *</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value as MemberCategory })}
                                className={inputClass}
                            >
                                {(Object.keys(CATEGORY_LABELS) as MemberCategory[]).map(key => (
                                    <option key={key} value={key}>{CATEGORY_LABELS[key]}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>Name *</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className={inputClass}
                            />
                        </div>
                    </div>

                    <div>
                        <label className={labelClass}>Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label className={labelClass}>Position</label>
                        <textarea
                            rows={3}
                            value={formData.position}
                            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                            className={inputClass}
                        />
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">줄바꿈은 그대로 표시됩니다. Alumni는 현재 소속(근무처)을 입력하세요.</p>
                    </div>

                    {formData.category === 'researcher' && (
                        <div>
                            <label className={labelClass}>Research Interest</label>
                            <input
                                type="text"
                                value={formData.research_interest}
                                onChange={(e) => setFormData({ ...formData, research_interest: e.target.value })}
                                className={inputClass}
                            />
                        </div>
                    )}

                    <div>
                        <label className={labelClass}>Education</label>
                        <div className="space-y-2">
                            {formData.education.map((line, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={line}
                                        onChange={(e) => setEducation(formData.education.map((l, i) => i === idx ? e.target.value : l))}
                                        placeholder="e.g., B.S., Mechanical Engineering, SKKU (2024)"
                                        className={inputClass}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setEducation(formData.education.filter((_, i) => i !== idx))}
                                        className="px-3 py-2 text-red-600 dark:text-red-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={() => setEducation([...formData.education, ''])}
                            className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        >
                            + Add education
                        </button>
                    </div>

                    <div>
                        <label className={labelClass}>Photo</label>
                        <div className="flex gap-4 items-center">
                            {formData.image_path ? (
                                <img src={getImageUrl(formData.image_path)} alt="Preview" className="h-24 w-24 object-cover bg-gray-100 rounded" />
                            ) : (
                                <div className="h-24 w-24 rounded bg-gray-100 dark:bg-gray-700" />
                            )}
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
                                            const res = await AdminAPI.uploadFile('members/upload-image', file);
                                            setFormData(prev => ({ ...prev, image_path: res.image_path }));
                                        } catch (err) {
                                            alert('Upload failed');
                                        }
                                    }}
                                />
                            </label>
                            {formData.image_path && (
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, image_path: null })}
                                    className="text-sm text-red-600 dark:text-red-400 hover:underline"
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className={labelClass}>Order</label>
                        <input
                            type="number"
                            value={formData.order_index ?? ''}
                            onChange={e => setFormData({ ...formData, order_index: e.target.value ? parseInt(e.target.value) : null })}
                            placeholder="클수록 위, 비면 자동(새 항목 = 맨 위)"
                            className={inputClass}
                        />
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
