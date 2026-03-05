'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { getApiUrl } from '@/lib/api/config';

const POSITIONS = [
    'Chair',
    'Vice Chair',
    'Secretary',
    'Treasurer',
    'Joint Secretary',
    'Joint Treasurer',
    'Webmaster',
    'Counselor',
    'Advisor',
    'Chairperson',
];

export default function EditMember() {
    const router = useRouter();
    const params = useParams();
    const memberId = params.id as string;

    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        linkedin: '',
        position: 'Member',
        photo_url: '',
        rank: '' as string | number,
        domain: '',
    });
    const [imageFile, setImageFile] = useState<File | null>(null);

    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<{ field: string; message: string }[]>([]);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    useEffect(() => {
        const fetchMember = async () => {
            try {
                const res = await fetch(getApiUrl(`/api/members/${memberId}`), { credentials: 'include' });
                const raw = await res.text();
                const data = raw ? JSON.parse(raw) : {};

                if (res.ok && data.success) {
                    const member = data.data;
                    setFormData({
                        fullname: member.fullname || '',
                        email: member.email || '',
                        linkedin: member.linkedin || '',
                        position: member.position || 'Member',
                        photo_url: member.photo_url || '',
                        rank: member.rank ?? '',
                        domain: member.domain || '',
                    });
                } else {
                    showToast(data.error || 'Failed to load member', 'error');
                }
            } catch (error) {
                console.error('Error fetching member details:', error);
                showToast('Unable to connect to server.', 'error');
            } finally {
                setLoading(false);
            }
        };

        if (memberId) {
            fetchMember();
        }
    }, [memberId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const isFacultyAdvisor = formData.position === 'Advisor';
    const showDomain = !['Chair', 'Advisor', 'Counselor'].includes(formData.position);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setErrors([]);

        if (!formData.fullname.trim()) {
            setErrors([{ field: 'fullname', message: 'Full name is required' }]);
            setSubmitting(false);
            return;
        }

        if (!formData.email.trim() || !formData.email.includes('@')) {
            setErrors([{ field: 'email', message: 'Valid email is required' }]);
            setSubmitting(false);
            return;
        }

        try {
            const payload = new FormData();
            payload.append('fullname', formData.fullname);
            payload.append('email', formData.email);
            payload.append('position', formData.position);

            if (isFacultyAdvisor && formData.rank !== '') {
                payload.append('rank', String(formData.rank));
            }
            if (showDomain && formData.domain) {
                payload.append('domain', formData.domain);
            }

            if (formData.linkedin) payload.append('linkedin', formData.linkedin);
            if (!imageFile && formData.photo_url === '') {
                payload.append('photo_url', ''); // Tell backend to remove the photo
            }
            if (imageFile) payload.append('photo', imageFile);

            const res = await fetch(getApiUrl(`/api/members/${memberId}`), {
                method: 'PUT',
                body: payload,
                credentials: 'include'
            });

            if (res.ok) {
                showToast('Member updated successfully!');
                setTimeout(() => router.push('/admin/members'), 1000);
            } else {
                const data = await res.json();
                if (data.errors && Array.isArray(data.errors)) {
                    const messages = data.errors.map((err: any) => err.msg).join('\n');
                    showToast(`Validation failed: ${messages}`, 'error');
                } else {
                    showToast(data.error || 'Failed to update member', 'error');
                }
            }
        } catch (error) {
            console.error('Error updating member', error);
            showToast('Network error, please try again.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-3xl mx-auto space-y-5">
                <div className="rounded-2xl border border-[#d9e8ff] bg-white p-6">
                    <div className="mb-5 h-8 w-48 animate-pulse rounded bg-[#eaf3ff]" />
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        {[0, 1, 2, 3].map((item) => (
                            <div key={item} className="h-16 animate-pulse rounded-xl bg-[#eff6ff]" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-8 flex items-center gap-4">
                <Link
                    href="/admin/members"
                    className="p-2 rounded-full hover:bg-white/50 transition-colors text-[#64748B] hover:text-[#0A1A2F]"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </Link>
                <div>
                    <h2 className="text-3xl font-bold text-[#0A1A2F]">Edit Member</h2>
                    <p className="text-[#64748B] text-sm mt-1">Update profile information for {formData.fullname}</p>
                </div>
            </div>

            <div className="bg-white/70 backdrop-blur-md border border-[#D4E4F7]/60 rounded-3xl p-8 shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Full Name */}
                        <div className="relative group md:col-span-2">
                            <input
                                id="fullname"
                                type="text"
                                name="fullname"
                                value={formData.fullname}
                                onChange={handleChange}
                                className={`peer w-full bg-transparent border-b-2 py-3 text-[#0A1A2F] outline-none transition-colors duration-300 placeholder-transparent ${errors.find(e => e.field === 'fullname')
                                    ? 'border-red-500 focus:border-red-500'
                                    : 'border-[#D4E4F7] focus:border-[#0B5ED7]'
                                    }`}
                                placeholder=" "
                                required
                            />
                            <label
                                htmlFor="fullname"
                                className={`absolute left-0 -top-3.5 text-xs font-medium transition-all duration-300 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-focus:-top-3.5 peer-focus:text-xs peer-focus:font-medium ${errors.find(e => e.field === 'fullname')
                                    ? 'text-red-500 peer-placeholder-shown:text-red-400 peer-focus:text-red-500'
                                    : 'text-[#0B5ED7] peer-placeholder-shown:text-[#94A3B8] peer-focus:text-[#0B5ED7]'
                                    }`}
                            >
                                Full Name
                            </label>
                            <div className={`absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-300 peer-focus:w-full ${errors.find(e => e.field === 'fullname') ? 'bg-red-500' : 'bg-[#0B5ED7]'}`} />
                            {errors.find(e => e.field === 'fullname') && (
                                <p className="text-red-500 text-xs mt-1 absolute">{errors.find(e => e.field === 'fullname')?.message}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="relative group">
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`peer w-full bg-transparent border-b-2 py-3 text-[#0A1A2F] outline-none transition-colors duration-300 placeholder-transparent ${errors.find(e => e.field === 'email')
                                    ? 'border-red-500 focus:border-red-500'
                                    : 'border-[#D4E4F7] focus:border-[#0B5ED7]'
                                    }`}
                                placeholder=" "
                                required
                            />
                            <label
                                htmlFor="email"
                                className={`absolute left-0 -top-3.5 text-xs font-medium transition-all duration-300 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-focus:-top-3.5 peer-focus:text-xs peer-focus:font-medium ${errors.find(e => e.field === 'email')
                                    ? 'text-red-500 peer-placeholder-shown:text-red-400 peer-focus:text-red-500'
                                    : 'text-[#0B5ED7] peer-placeholder-shown:text-[#94A3B8] peer-focus:text-[#0B5ED7]'
                                    }`}
                            >
                                Email Address
                            </label>
                            <div className={`absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-300 peer-focus:w-full ${errors.find(e => e.field === 'email') ? 'bg-red-500' : 'bg-[#0B5ED7]'}`} />
                            {errors.find(e => e.field === 'email') && (
                                <p className="text-red-500 text-xs mt-1 absolute">{errors.find(e => e.field === 'email')?.message}</p>
                            )}
                        </div>

                        {/* LinkedIn */}
                        <div className="relative group">
                            <input
                                id="linkedin"
                                type="url"
                                name="linkedin"
                                value={formData.linkedin}
                                onChange={handleChange}
                                className="peer w-full bg-transparent border-b-2 py-3 text-[#0A1A2F] outline-none transition-colors duration-300 placeholder-transparent border-[#D4E4F7] focus:border-[#0B5ED7]"
                                placeholder=" "
                            />
                            <label
                                htmlFor="linkedin"
                                className="absolute left-0 -top-3.5 text-xs font-medium transition-all duration-300 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-focus:-top-3.5 peer-focus:text-xs peer-focus:font-medium text-[#0B5ED7] peer-placeholder-shown:text-[#94A3B8] peer-focus:text-[#0B5ED7]"
                            >
                                LinkedIn URL (Optional)
                            </label>
                            <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#0B5ED7] transition-all duration-300 peer-focus:w-full" />
                        </div>

                        {/* Position */}
                        <div className="relative group md:col-span-1">
                            <label htmlFor="position" className="block text-xs font-medium text-[#0B5ED7] mb-1">
                                Position
                            </label>
                            <select
                                id="position"
                                name="position"
                                value={formData.position}
                                onChange={handleChange}
                                className="w-full bg-transparent border-b-2 border-[#D4E4F7] py-3 text-[#0A1A2F] outline-none transition-colors duration-300 focus:border-[#0B5ED7]"
                                required
                            >
                                {POSITIONS.map(pos => (
                                    <option key={pos} value={pos}>{pos}</option>
                                ))}
                            </select>
                        </div>

                        {/* Rank (Faculty Advisor only) */}
                        {isFacultyAdvisor && (
                            <div className="relative group md:col-span-1">
                                <input
                                    id="rank"
                                    type="number"
                                    name="rank"
                                    min="1"
                                    value={formData.rank}
                                    onChange={handleChange}
                                    className="peer w-full bg-transparent border-b-2 py-3 text-[#0A1A2F] outline-none transition-colors duration-300 placeholder-transparent border-[#D4E4F7] focus:border-[#0B5ED7]"
                                    placeholder=" "
                                />
                                <label
                                    htmlFor="rank"
                                    className="absolute left-0 -top-3.5 text-xs font-medium transition-all duration-300 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-focus:-top-3.5 peer-focus:text-xs peer-focus:font-medium text-[#0B5ED7] peer-placeholder-shown:text-[#94A3B8] peer-focus:text-[#0B5ED7]"
                                >
                                    Rank (1 = Most Senior)
                                </label>
                                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#0B5ED7] transition-all duration-300 peer-focus:w-full" />
                            </div>
                        )}

                        {/* Domain (not for Chair/Faculty Advisor/Counselor) */}
                        {showDomain && (
                            <div className="relative group md:col-span-1">
                                <input
                                    id="domain"
                                    type="text"
                                    name="domain"
                                    value={formData.domain}
                                    onChange={handleChange}
                                    className="peer w-full bg-transparent border-b-2 py-3 text-[#0A1A2F] outline-none transition-colors duration-300 placeholder-transparent border-[#D4E4F7] focus:border-[#0B5ED7]"
                                    placeholder=" "
                                />
                                <label
                                    htmlFor="domain"
                                    className="absolute left-0 -top-3.5 text-xs font-medium transition-all duration-300 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-focus:-top-3.5 peer-focus:text-xs peer-focus:font-medium text-[#0B5ED7] peer-placeholder-shown:text-[#94A3B8] peer-focus:text-[#0B5ED7]"
                                >
                                    Domain (e.g. AI/ML, Web Dev)
                                </label>
                                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#0B5ED7] transition-all duration-300 peer-focus:w-full" />
                            </div>
                        )}

                        {/* Image Upload */}
                        <div className="relative group md:col-span-1 flex flex-col justify-center">
                            <label className="block text-sm font-medium text-[#0B5ED7] mb-2">
                                Profile Photo
                            </label>

                            {/* Current photo preview with remove option */}
                            {formData.photo_url && !imageFile && (
                                <div className="mb-4 relative inline-block w-max">
                                    <div className="h-24 w-24 rounded-2xl overflow-hidden border-2 border-[#D4E4F7] shadow-sm">
                                        <img src={getApiUrl(formData.photo_url)} alt="Current profile" className="h-full w-full object-cover" />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, photo_url: '' }))}
                                        className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600 hover:scale-110 transition-all z-10"
                                        title="Remove photo"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            )}

                            {/* New localized photo preview with remove option */}
                            {imageFile && (
                                <div className="mb-4 relative inline-block w-max">
                                    <div className="h-24 w-24 rounded-2xl overflow-hidden border-2 border-[#D4E4F7] shadow-sm">
                                        <img src={URL.createObjectURL(imageFile)} alt="New profile" className="h-full w-full object-cover" />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setImageFile(null);
                                            // Reset the input field so same file can be selected again
                                            const fileInput = document.getElementById('photo') as HTMLInputElement;
                                            if (fileInput) fileInput.value = '';
                                        }}
                                        className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600 hover:scale-110 transition-all z-10"
                                        title="Remove selected photo"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            )}

                            <input
                                id="photo"
                                type="file"
                                accept="image/*"
                                aria-label="Profile Photo Upload"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-slate-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-[#0B5ED7]/10 file:text-[#0B5ED7]
                                hover:file:bg-[#0B5ED7]/20
                            "
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="group relative px-8 py-3 bg-gradient-to-r from-[#0A1A2F] to-[#0B5ED7] text-white font-medium rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] disabled:opacity-70"
                        >
                            <span className="relative z-10">{submitting ? 'Updating...' : 'Save Changes'}</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-[#0B5ED7] to-[#0A1A2F] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </button>
                    </div>
                </form>
            </div >

            {/* Toast Notification */}
            {toast && (
                <div className={`fixed bottom-6 right-6 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-[100] transform transition-all duration-300 translate-y-0 opacity-100 ${toast.type === 'success' ? 'bg-[#0A1A2F] text-white border-l-4 border-green-500' : 'bg-red-50 text-red-600 border border-red-200'
                    }`}>
                    {toast.type === 'success' ? (
                        <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )}
                    <span className="font-medium">{toast.message}</span>
                    <button onClick={() => setToast(null)} aria-label="Close Notification" className="ml-4 opacity-70 hover:opacity-100 transition-opacity">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            )}
        </div >
    );
}
