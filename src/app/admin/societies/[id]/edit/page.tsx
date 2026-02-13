'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { validateSociety, ValidationError } from '@/utils/validation';

export default function EditSociety({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [id, setId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        logo_url: '',
        chair_name: '',
        description: '',
        faculty_name: 'random',
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<ValidationError[]>([]);

    // Unwrap params using React.use()
    const resolvedParams = use(params);

    useEffect(() => {
        if (resolvedParams.id) {
            setId(resolvedParams.id);
            fetchSociety(resolvedParams.id);
        }
    }, [resolvedParams]);

    const fetchSociety = async (societyId: string) => {
        try {
            const res = await fetch(`http://localhost:5000/api/societies/${societyId}`);
            const data = await res.json();
            if (data.success) {
                setFormData({
                    ...data.data,
                    faculty_name: data.data.faculty_name || 'random'
                });
            }
        } catch (error) {
            console.error('Failed to fetch society', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;
        setSubmitting(true);

        if (!id) return;
        setSubmitting(true);
        setErrors([]);

        const validationErrors = validateSociety(formData);
        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            setSubmitting(false);
            return;
        }

        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`http://localhost:5000/api/societies/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push('/admin/societies');
            } else {
                alert('Failed to update society');
            }
        } catch (error) {
            console.error('Error updating society', error);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0B5ED7]"></div>
        </div>
    );

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-8 flex items-center gap-4">
                <Link
                    href="/admin/societies"
                    className="p-2 rounded-full hover:bg-white/50 transition-colors text-[#64748B] hover:text-[#0A1A2F]"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </Link>
                <div>
                    <h2 className="text-3xl font-bold text-[#0A1A2F]">Edit Society</h2>
                    <p className="text-[#64748B] text-sm mt-1">Update society details</p>
                </div>
            </div>

            <div className="bg-white/70 backdrop-blur-md border border-[#D4E4F7]/60 rounded-3xl p-8 shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Name Input */}
                        <div className="relative group">
                            <input
                                id="name"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`peer w-full bg-transparent border-b-2 py-3 text-[#0A1A2F] outline-none transition-colors duration-300 placeholder-transparent ${errors.find(e => e.field === 'name')
                                        ? 'border-red-500 focus:border-red-500'
                                        : 'border-[#D4E4F7] focus:border-[#0B5ED7]'
                                    }`}
                                placeholder=" "
                                required
                            />
                            <label
                                htmlFor="name"
                                className={`absolute left-0 -top-3.5 text-xs font-medium transition-all duration-300 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-[#94A3B8] peer-placeholder-shown:font-normal peer-focus:-top-3.5 peer-focus:text-xs peer-focus:font-medium ${errors.find(e => e.field === 'name')
                                        ? 'text-red-500 peer-placeholder-shown:text-red-400 peer-focus:text-red-500'
                                        : 'text-[#0B5ED7] peer-placeholder-shown:text-[#94A3B8] peer-focus:text-[#0B5ED7]'
                                    }`}
                            >
                                Society Name
                            </label>
                            <div className={`absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-300 peer-focus:w-full ${errors.find(e => e.field === 'name') ? 'bg-red-500' : 'bg-[#0B5ED7]'
                                }`} />
                            {errors.find(e => e.field === 'name') && (
                                <p className="text-red-500 text-xs mt-1 absolute">{errors.find(e => e.field === 'name')?.message}</p>
                            )}
                        </div>

                        {/* Chair Name Input */}
                        <div className="relative group">
                            <input
                                id="chair_name"
                                type="text"
                                name="chair_name"
                                value={formData.chair_name || ''}
                                onChange={handleChange}
                                className={`peer w-full bg-transparent border-b-2 py-3 text-[#0A1A2F] outline-none transition-colors duration-300 placeholder-transparent ${errors.find(e => e.field === 'chair_name')
                                        ? 'border-red-500 focus:border-red-500'
                                        : 'border-[#D4E4F7] focus:border-[#0B5ED7]'
                                    }`}
                                placeholder=" "
                            />
                            <label
                                htmlFor="chair_name"
                                className={`absolute left-0 -top-3.5 text-xs font-medium transition-all duration-300 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-[#94A3B8] peer-placeholder-shown:font-normal peer-focus:-top-3.5 peer-focus:text-xs peer-focus:font-medium ${errors.find(e => e.field === 'chair_name')
                                        ? 'text-red-500 peer-placeholder-shown:text-red-400 peer-focus:text-red-500'
                                        : 'text-[#0B5ED7] peer-placeholder-shown:text-[#94A3B8] peer-focus:text-[#0B5ED7]'
                                    }`}
                            >
                                Chairperson Name
                            </label>
                            <div className={`absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-300 peer-focus:w-full ${errors.find(e => e.field === 'chair_name') ? 'bg-red-500' : 'bg-[#0B5ED7]'
                                }`} />
                            {errors.find(e => e.field === 'chair_name') && (
                                <p className="text-red-500 text-xs mt-1 absolute">{errors.find(e => e.field === 'chair_name')?.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Logo URL */}
                    <div className="relative group">
                        <input
                            id="logo_url"
                            type="text"
                            name="logo_url"
                            value={formData.logo_url || ''}
                            onChange={handleChange}
                            className={`peer w-full bg-transparent border-b-2 py-3 text-[#0A1A2F] outline-none transition-colors duration-300 placeholder-transparent ${errors.find(e => e.field === 'logo_url')
                                    ? 'border-red-500 focus:border-red-500'
                                    : 'border-[#D4E4F7] focus:border-[#0B5ED7]'
                                }`}
                            placeholder=" "
                        />
                        <label
                            htmlFor="logo_url"
                            className={`absolute left-0 -top-3.5 text-xs font-medium transition-all duration-300 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-[#94A3B8] peer-placeholder-shown:font-normal peer-focus:-top-3.5 peer-focus:text-xs peer-focus:font-medium ${errors.find(e => e.field === 'logo_url')
                                    ? 'text-red-500 peer-placeholder-shown:text-red-400 peer-focus:text-red-500'
                                    : 'text-[#0B5ED7] peer-placeholder-shown:text-[#94A3B8] peer-focus:text-[#0B5ED7]'
                                }`}
                        >
                            Logo URL
                        </label>
                        <div className={`absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-300 peer-focus:w-full ${errors.find(e => e.field === 'logo_url') ? 'bg-red-500' : 'bg-[#0B5ED7]'
                            }`} />
                        {errors.find(e => e.field === 'logo_url') && (
                            <p className="text-red-500 text-xs mt-1 absolute">{errors.find(e => e.field === 'logo_url')?.message}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="relative group">
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description || ''}
                            onChange={handleChange}
                            rows={4}
                            className={`peer w-full bg-transparent border-b-2 py-3 text-[#0A1A2F] outline-none transition-colors duration-300 placeholder-transparent resize-none ${errors.find(e => e.field === 'description')
                                    ? 'border-red-500 focus:border-red-500'
                                    : 'border-[#D4E4F7] focus:border-[#0B5ED7]'
                                }`}
                            placeholder=" "
                        />
                        <label
                            htmlFor="description"
                            className={`absolute left-0 -top-3.5 text-xs font-medium transition-all duration-300 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-[#94A3B8] peer-placeholder-shown:font-normal peer-focus:-top-3.5 peer-focus:text-xs peer-focus:font-medium ${errors.find(e => e.field === 'description')
                                    ? 'text-red-500 peer-placeholder-shown:text-red-400 peer-focus:text-red-500'
                                    : 'text-[#0B5ED7] peer-placeholder-shown:text-[#94A3B8] peer-focus:text-[#0B5ED7]'
                                }`}
                        >
                            Description
                        </label>
                        <div className={`absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-300 peer-focus:w-full ${errors.find(e => e.field === 'description') ? 'bg-red-500' : 'bg-[#0B5ED7]'
                            }`} />
                        {errors.find(e => e.field === 'description') && (
                            <p className="text-red-500 text-xs mt-1 absolute">{errors.find(e => e.field === 'description')?.message}</p>
                        )}
                    </div>

                    {/* Faculty Name (Replaces Source URL) */}
                    <div className="relative group">
                        <input
                            id="faculty_name"
                            type="text"
                            name="faculty_name"
                            value={formData.faculty_name || ''}
                            onChange={handleChange}
                            className={`peer w-full bg-transparent border-b-2 py-3 text-[#0A1A2F] outline-none transition-colors duration-300 placeholder-transparent ${errors.find(e => e.field === 'faculty_name')
                                    ? 'border-red-500 focus:border-red-500'
                                    : 'border-[#D4E4F7] focus:border-[#0B5ED7]'
                                }`}
                            placeholder=" "
                        />
                        <label
                            htmlFor="faculty_name"
                            className={`absolute left-0 -top-3.5 text-xs font-medium transition-all duration-300 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-[#94A3B8] peer-placeholder-shown:font-normal peer-focus:-top-3.5 peer-focus:text-xs peer-focus:font-medium ${errors.find(e => e.field === 'faculty_name')
                                    ? 'text-red-500 peer-placeholder-shown:text-red-400 peer-focus:text-red-500'
                                    : 'text-[#0B5ED7] peer-placeholder-shown:text-[#94A3B8] peer-focus:text-[#0B5ED7]'
                                }`}
                        >
                            Faculty Name
                        </label>
                        <div className={`absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-300 peer-focus:w-full ${errors.find(e => e.field === 'faculty_name') ? 'bg-red-500' : 'bg-[#0B5ED7]'
                            }`} />
                        {errors.find(e => e.field === 'faculty_name') && (
                            <p className="text-red-500 text-xs mt-1 absolute">{errors.find(e => e.field === 'faculty_name')?.message}</p>
                        )}
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="group relative px-8 py-3 bg-gradient-to-r from-[#0A1A2F] to-[#0B5ED7] text-white font-medium rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] disabled:opacity-70"
                        >
                            <span className="relative z-10">{submitting ? 'Updating...' : 'Update Society'}</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-[#0B5ED7] to-[#0A1A2F] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
