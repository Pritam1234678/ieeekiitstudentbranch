'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { validateEvent, ValidationError } from '@/utils/validation';
import { getApiUrl } from '@/lib/api/config';

export default function CreateEvent() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        start_time: '',
        end_time: '',
        place: '',
        registration_link: '',
        managed_by: '',
        contact_details: '7608976946',
    });
    const [imageFile, setImageFile] = useState<File | null>(null);


    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<ValidationError[]>([]);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
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
                return new Date(`${isoTime}+05:30`).toISOString();
            };

            const payload = new FormData();
            payload.append('title', formData.title);
            payload.append('description', formData.description);
            payload.append('start_time', toUTC(formData.start_time));
            payload.append('end_time', toUTC(formData.end_time));

            if (formData.place) payload.append('place', formData.place);
            if (formData.registration_link) payload.append('registration_link', formData.registration_link);
            if (formData.managed_by) {
                const societiesArray = formData.managed_by.split(',').map(s => s.trim()).filter(s => s);
                payload.append('managed_by', JSON.stringify(societiesArray));
            }
            if (formData.contact_details) payload.append('contact_details', formData.contact_details);

            if (imageFile) {
                payload.append('image', imageFile);
            }

            const res = await fetch(getApiUrl('/api/events'), {
                method: 'POST',
                // Content-Type header must be undefined for FormData to let browser set boundary
                body: payload,
                credentials: 'include'
            });


            if (res.ok) {
                showToast('Event created successfully!');
                setTimeout(() => router.push('/admin/events'), 1000);
            } else {
                const data = await res.json();
                if (data.errors && Array.isArray(data.errors)) {
                    const messages = data.errors.map((err: any) => err.msg).join('\n');
                    showToast(`Validation failed: ${messages}`, 'error');
                } else {
                    showToast(data.error || 'Failed to create event', 'error');
                }
            }
        } catch (error) {
            console.error('Error creating event', error);
        } finally {
            setSubmitting(false);
        }
    };

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
                    <h2 className="text-3xl font-bold text-[#0A1A2F]">Create Event</h2>
                    <p className="text-[#64748B] text-sm mt-1">Schedule a new event</p>
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
                                className={`absolute left-0 -top-3.5 text-xs font-medium transition-all duration-300 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-focus:-top-3.5 peer-focus:text-xs peer-focus:font-medium ${errors.find(e => e.field === 'end_time')
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

                        {/* Place */}
                        <div className="relative group">
                            <input
                                id="place"
                                type="text"
                                name="place"
                                value={formData.place}
                                onChange={handleChange}
                                className="peer w-full bg-transparent border-b-2 py-3 text-[#0A1A2F] outline-none transition-colors duration-300 placeholder-transparent border-[#D4E4F7] focus:border-[#0B5ED7]"
                                placeholder=" "
                            />
                            <label
                                htmlFor="place"
                                className="absolute left-0 -top-3.5 text-xs font-medium transition-all duration-300 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-focus:-top-3.5 peer-focus:text-xs peer-focus:font-medium text-[#0B5ED7] peer-placeholder-shown:text-[#94A3B8] peer-focus:text-[#0B5ED7]"
                            >
                                Place / Venue
                            </label>
                            <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#0B5ED7] transition-all duration-300 peer-focus:w-full" />
                        </div>

                        {/* Registration Link */}
                        <div className="relative group">
                            <input
                                id="registration_link"
                                type="url"
                                name="registration_link"
                                value={formData.registration_link}
                                onChange={handleChange}
                                className="peer w-full bg-transparent border-b-2 py-3 text-[#0A1A2F] outline-none transition-colors duration-300 placeholder-transparent border-[#D4E4F7] focus:border-[#0B5ED7]"
                                placeholder=" "
                            />
                            <label
                                htmlFor="registration_link"
                                className="absolute left-0 -top-3.5 text-xs font-medium transition-all duration-300 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-focus:-top-3.5 peer-focus:text-xs peer-focus:font-medium text-[#0B5ED7] peer-placeholder-shown:text-[#94A3B8] peer-focus:text-[#0B5ED7]"
                            >
                                Registration Link (Optional)
                            </label>
                            <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#0B5ED7] transition-all duration-300 peer-focus:w-full" />
                        </div>

                        {/* Managed By */}
                        <div className="relative group">
                            <input
                                id="managed_by"
                                type="text"
                                name="managed_by"
                                value={formData.managed_by}
                                onChange={handleChange}
                                className="peer w-full bg-transparent border-b-2 py-3 text-[#0A1A2F] outline-none transition-colors duration-300 placeholder-transparent border-[#D4E4F7] focus:border-[#0B5ED7]"
                                placeholder=" "
                            />
                            <label
                                htmlFor="managed_by"
                                className="absolute left-0 -top-3.5 text-xs font-medium transition-all duration-300 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-focus:-top-3.5 peer-focus:text-xs peer-focus:font-medium text-[#0B5ED7] peer-placeholder-shown:text-[#94A3B8] peer-focus:text-[#0B5ED7]"
                            >
                                Managed By (Societies, comma separated)
                            </label>
                            <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#0B5ED7] transition-all duration-300 peer-focus:w-full" />
                        </div>

                        {/* Contact Details */}
                        <div className="relative group">
                            <input
                                id="contact_details"
                                type="tel"
                                name="contact_details"
                                value={formData.contact_details}
                                onChange={handleChange}
                                className="peer w-full bg-transparent border-b-2 py-3 text-[#0A1A2F] outline-none transition-colors duration-300 placeholder-transparent border-[#D4E4F7] focus:border-[#0B5ED7]"
                                placeholder=" "
                            />
                            <label
                                htmlFor="contact_details"
                                className="absolute left-0 -top-3.5 text-xs font-medium transition-all duration-300 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-focus:-top-3.5 peer-focus:text-xs peer-focus:font-medium text-[#0B5ED7] peer-placeholder-shown:text-[#94A3B8] peer-focus:text-[#0B5ED7]"
                            >
                                Contact Number
                            </label>
                            <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#0B5ED7] transition-all duration-300 peer-focus:w-full" />
                        </div>

                        {/* Image Upload */}
                        <div className="relative group">
                            <label className="block text-sm font-medium text-[#0A1A2F] mb-2">
                                Event Image (Optional)
                            </label>
                            <input
                                id="image"
                                type="file"
                                accept="image/*"
                                aria-label="Event Image Upload"
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
                            className={`absolute left-0 -top-3.5 text-xs font-medium transition-all duration-300 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-focus:-top-3.5 peer-focus:text-xs peer-focus:font-medium ${errors.find(e => e.field === 'description')
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
                            <span className="relative z-10">{submitting ? 'Creating...' : 'Create Event'}</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-[#0B5ED7] to-[#0A1A2F] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </button>
                    </div>
                </form>
            </div >

            {/* Toast Notification */}
            {toast && (
                <div className={`fixed bottom-6 right-6 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-50 transform transition-all duration-300 translate-y-0 opacity-100 ${toast.type === 'success' ? 'bg-[#0A1A2F] text-white border-l-4 border-green-500' : 'bg-red-50 text-red-600 border border-red-200'
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
