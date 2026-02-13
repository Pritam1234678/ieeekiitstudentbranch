'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toISTInputString } from '@/utils/helpers';
import { validateEvent, ValidationError } from '@/utils/validation';

export default function EditEvent({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [id, setId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        image_url: '',
        description: '',
        start_time: '',
        end_time: '',
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<ValidationError[]>([]);

    const resolvedParams = use(params);

    useEffect(() => {
        if (resolvedParams.id) {
            setId(resolvedParams.id);
            fetchEvent(resolvedParams.id);
        }
    }, [resolvedParams]);

    const fetchEvent = async (eventId: string) => {
        try {
            const res = await fetch(`http://localhost:5000/api/events/${eventId}`);
            const data = await res.json();
            if (data.success) {
                // Format dates for datetime-local input (YYYY-MM-DDThh:mm)
                const formatForInput = (dateStr: string) => {
                    if (!dateStr) return '';
                    const date = new Date(dateStr);
                    // Adjust for local timezone offset
                    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
                    return date.toISOString().slice(0, 16);
                };

                setFormData({
                    title: data.data.title,
                    image_url: data.data.image_url || '',
                    description: data.data.description || '',
                    start_time: toISTInputString(data.data.start_time),
                    end_time: toISTInputString(data.data.end_time),
                });
            }
        } catch (error) {
            console.error('Failed to fetch event', error);
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
        setErrors([]);

        const validationErrors = validateEvent(formData);
        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            setSubmitting(false);
            return;
        }

        try {
            // Convert IST input time to UTC for storage
            const toUTC = (isoTime: string) => {
                if (!isoTime) return '';
                // Ensure we treat the input as IST
                return new Date(`${isoTime}+05:30`).toISOString();
            };

            const payload: any = {
                ...formData,
                start_time: toUTC(formData.start_time),
                end_time: toUTC(formData.end_time),
            };

            // Remove empty image_url to avoid validation error
            if (!payload.image_url) {
                delete payload.image_url;
            }

            const token = localStorage.getItem('adminToken');
            const res = await fetch(`http://localhost:5000/api/events/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                router.push('/admin/events');
            } else {
                const data = await res.json();
                if (data.errors && Array.isArray(data.errors)) {
                    const messages = data.errors.map((err: any) => err.msg).join('\n');
                    alert(`Validation failed:\n${messages}`);
                } else {
                    alert(data.error || 'Failed to update event');
                }
            }
        } catch (error) {
            console.error('Error updating event', error);
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
                    href="/admin/events"
                    className="p-2 rounded-full hover:bg-white/50 transition-colors text-[#64748B] hover:text-[#0A1A2F]"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </Link>
                <div>
                    <h2 className="text-3xl font-bold text-[#0A1A2F]">Edit Event</h2>
                    <p className="text-[#64748B] text-sm mt-1">Update event details</p>
                </div>
            </div>

            <div className="bg-white/70 backdrop-blur-md border border-[#D4E4F7]/60 rounded-3xl p-8 shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Title Input */}
                        <div className="relative group md:col-span-2">
                            <input
                                id="title"
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className={`peer w-full bg-transparent border-b-2 py-3 text-[#0A1A2F] outline-none transition-colors duration-300 placeholder-transparent ${errors.find(e => e.field === 'title')
                                    ? 'border-red-500 focus:border-red-500'
                                    : 'border-[#D4E4F7] focus:border-[#0B5ED7]'
                                    }`}
                                placeholder=" "
                                required
                            />
                            <label
                                htmlFor="title"
                                className={`absolute left-0 -top-3.5 text-xs font-medium transition-all duration-300 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-focus:-top-3.5 peer-focus:text-xs peer-focus:font-medium ${errors.find(e => e.field === 'title')
                                    ? 'text-red-500 peer-placeholder-shown:text-red-400 peer-focus:text-red-500'
                                    : 'text-[#0B5ED7] peer-placeholder-shown:text-[#94A3B8] peer-focus:text-[#0B5ED7]'
                                    }`}
                            >
                                Event Title
                            </label>
                            <div className={`absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-300 peer-focus:w-full ${errors.find(e => e.field === 'title') ? 'bg-red-500' : 'bg-[#0B5ED7]'
                                }`} />
                            {errors.find(e => e.field === 'title') && (
                                <p className="text-red-500 text-xs mt-1 absolute">{errors.find(e => e.field === 'title')?.message}</p>
                            )}
                        </div>

                        {/* Start Time */}
                        <div className="relative group">
                            <input
                                id="start_time"
                                type="datetime-local"
                                name="start_time"
                                value={formData.start_time}
                                onChange={handleChange}
                                className={`peer w-full bg-transparent border-b-2 py-3 text-[#0A1A2F] outline-none transition-colors duration-300 placeholder-transparent ${errors.find(e => e.field === 'start_time')
                                    ? 'border-red-500 focus:border-red-500'
                                    : 'border-[#D4E4F7] focus:border-[#0B5ED7]'
                                    }`}
                                placeholder=" "
                                required
                            />
                            <label
                                htmlFor="start_time"
                                className={`absolute left-0 -top-3.5 text-xs font-medium transition-all duration-300 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-focus:-top-3.5 peer-focus:text-xs peer-focus:font-medium ${errors.find(e => e.field === 'start_time')
                                    ? 'text-red-500 peer-placeholder-shown:text-red-400 peer-focus:text-red-500'
                                    : 'text-[#0B5ED7] peer-placeholder-shown:text-[#94A3B8] peer-focus:text-[#0B5ED7]'
                                    }`}
                            >
                                Start Time
                            </label>
                            <div className={`absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-300 peer-focus:w-full ${errors.find(e => e.field === 'start_time') ? 'bg-red-500' : 'bg-[#0B5ED7]'
                                }`} />
                            {errors.find(e => e.field === 'start_time') && (
                                <p className="text-red-500 text-xs mt-1 absolute">{errors.find(e => e.field === 'start_time')?.message}</p>
                            )}
                        </div>

                        {/* End Time */}
                        <div className="relative group">
                            <input
                                id="end_time"
                                type="datetime-local"
                                name="end_time"
                                value={formData.end_time}
                                onChange={handleChange}
                                className={`peer w-full bg-transparent border-b-2 py-3 text-[#0A1A2F] outline-none transition-colors duration-300 placeholder-transparent ${errors.find(e => e.field === 'end_time')
                                    ? 'border-red-500 focus:border-red-500'
                                    : 'border-[#D4E4F7] focus:border-[#0B5ED7]'
                                    }`}
                                placeholder=" "
                                required
                            />
                            <label
                                htmlFor="end_time"
                                className={`absolute left-0 -top-3.5 text-xs font-medium transition-all duration-300 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-[#94A3B8] peer-placeholder-shown:font-normal peer-focus:-top-3.5 peer-focus:text-xs peer-focus:font-medium ${errors.find(e => e.field === 'end_time')
                                    ? 'text-red-500 peer-placeholder-shown:text-red-400 peer-focus:text-red-500'
                                    : 'text-[#0B5ED7] peer-placeholder-shown:text-[#94A3B8] peer-focus:text-[#0B5ED7]'
                                    }`}
                            >
                                End Time
                            </label>
                            <div className={`absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-300 peer-focus:w-full ${errors.find(e => e.field === 'end_time') ? 'bg-red-500' : 'bg-[#0B5ED7]'
                                }`} />
                            {errors.find(e => e.field === 'end_time') && (
                                <p className="text-red-500 text-xs mt-1 absolute">{errors.find(e => e.field === 'end_time')?.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Image URL */}
                    <div className="relative group">
                        <input
                            id="image_url"
                            type="text"
                            name="image_url"
                            value={formData.image_url}
                            onChange={handleChange}
                            className={`peer w-full bg-transparent border-b-2 py-3 text-[#0A1A2F] outline-none transition-colors duration-300 placeholder-transparent ${errors.find(e => e.field === 'image_url')
                                ? 'border-red-500 focus:border-red-500'
                                : 'border-[#D4E4F7] focus:border-[#0B5ED7]'
                                }`}
                            placeholder=" "
                        />
                        <label
                            htmlFor="image_url"
                            className={`absolute left-0 -top-3.5 text-xs font-medium transition-all duration-300 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-[#94A3B8] peer-placeholder-shown:font-normal peer-focus:-top-3.5 peer-focus:text-xs peer-focus:font-medium ${errors.find(e => e.field === 'image_url')
                                ? 'text-red-500 peer-placeholder-shown:text-red-400 peer-focus:text-red-500'
                                : 'text-[#0B5ED7] peer-placeholder-shown:text-[#94A3B8] peer-focus:text-[#0B5ED7]'
                                }`}
                        >
                            Image URL
                        </label>
                        <div className={`absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-300 peer-focus:w-full ${errors.find(e => e.field === 'image_url') ? 'bg-red-500' : 'bg-[#0B5ED7]'
                            }`} />
                        {errors.find(e => e.field === 'image_url') && (
                            <p className="text-red-500 text-xs mt-1 absolute">{errors.find(e => e.field === 'image_url')?.message}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="relative group">
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
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

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="group relative px-8 py-3 bg-gradient-to-r from-[#0A1A2F] to-[#0B5ED7] text-white font-medium rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] disabled:opacity-70"
                        >
                            <span className="relative z-10">{submitting ? 'Updating...' : 'Update Event'}</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-[#0B5ED7] to-[#0A1A2F] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
