'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toISTInputString } from '@/utils/helpers';
import { validateEvent, ValidationError } from '@/utils/validation';
import { getApiUrl } from '@/lib/api/config';

export default function EditEvent({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [id, setId] = useState<string | null>(null);

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
    const [currentImageUrl, setCurrentImageUrl] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [galleryImages, setGalleryImages] = useState<any[]>([]);
    const [galleryFiles, setGalleryFiles] = useState<FileList | null>(null);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [uploadingGallery, setUploadingGallery] = useState(false);
    const [errors, setErrors] = useState<ValidationError[]>([]);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };


    const resolvedParams = use(params);

    useEffect(() => {
        if (resolvedParams.id) {
            setId(resolvedParams.id);
            fetchEvent(resolvedParams.id);
        }
    }, [resolvedParams]);

    const fetchEvent = async (eventId: string) => {
        try {
            const res = await fetch(getApiUrl(`/api/events/${eventId}`));
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
                    description: data.data.description || '',
                    start_time: toISTInputString(data.data.start_time),
                    end_time: toISTInputString(data.data.end_time),
                    place: data.data.place || '',
                    registration_link: data.data.registration_link || '',
                    managed_by: Array.isArray(data.data.managed_by) ? data.data.managed_by.join(', ') : (data.data.managed_by || ''),
                    contact_details: data.data.contact_details || '7608976946',
                });
                setCurrentImageUrl(data.data.image_url || '');
                if (data.data.images) {
                    setGalleryImages(data.data.images);
                }

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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleGalleryFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setGalleryFiles(e.target.files);
        }
    };

    const handleUploadGallery = async () => {
        if (!galleryFiles || galleryFiles.length === 0 || !id) return;
        setUploadingGallery(true);

        const formData = new FormData();
        Array.from(galleryFiles).forEach((file) => {
            formData.append('images', file);
        });

        try {
            const res = await fetch(getApiUrl(`/api/events/${id}/images`), {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });

            if (res.ok) {
                const data = await res.json();
                setGalleryImages([...data.data, ...galleryImages]);
                setGalleryFiles(null);
                // Reset file input
                const fileInput = document.getElementById('gallery_images') as HTMLInputElement;
                if (fileInput) fileInput.value = '';
                showToast('Images uploaded successfully');
            } else {
                showToast('Failed to upload images', 'error');
            }
        } catch (error) {
            console.error('Error uploading images', error);
        } finally {
            setUploadingGallery(false);
        }
    };

    const handleDeleteGalleryImage = async (imageId: string) => {
        if (!confirm('Are you sure you want to delete this image?')) return;

        try {
            const res = await fetch(getApiUrl(`/api/events/images/${imageId}`), {
                method: 'DELETE',
                credentials: 'include'
            });

            if (res.ok) {
                setGalleryImages(galleryImages.filter(img => img._id !== imageId));
                showToast('Image deleted successfully');
            } else {
                showToast('Failed to delete image', 'error');
            }
        } catch (error) {
            console.error('Error deleting image', error);
        }
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

            const res = await fetch(getApiUrl(`/api/events/${id}`), {
                method: 'PUT',
                // Content-Type header must be undefined for FormData
                body: payload,
                credentials: 'include'
            });


            if (res.ok) {
                showToast('Event updated successfully');
                setTimeout(() => router.push('/admin/events'), 1000);
            } else {
                const data = await res.json();
                if (data.errors && Array.isArray(data.errors)) {
                    const messages = data.errors.map((err: any) => err.msg).join('\n');
                    showToast(`Validation failed: ${messages}`, 'error');
                } else {
                    showToast(data.error || 'Failed to update event', 'error');
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
                    </div>

                    {/* Image Upload */}
                    <div className="relative group">
                        <label className="block text-sm font-medium text-[#0A1A2F] mb-2">
                            Update Main Event Image
                        </label>
                        {currentImageUrl && (
                            <div className="mb-2">
                                <img src={getApiUrl(currentImageUrl)} alt="Current" className="h-32 object-cover rounded-md" />
                            </div>
                        )}
                        <input
                            id="image"
                            type="file"
                            accept="image/*"
                            aria-label="Update Main Event Image"
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

            {/* Gallery Management Section */}
            <div className="mt-8 bg-white/70 backdrop-blur-md border border-[#D4E4F7]/60 rounded-3xl p-8 shadow-sm">
                <h3 className="text-2xl font-bold text-[#0A1A2F] mb-6">Event Gallery</h3>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-[#0A1A2F] mb-2">
                        Upload New Images
                    </label>
                    <div className="flex gap-4">
                        <input
                            id="gallery_images"
                            type="file"
                            multiple
                            accept="image/*"
                            aria-label="Upload New Gallery Images"
                            onChange={handleGalleryFilesChange}
                            className="block w-full text-sm text-slate-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-[#0B5ED7]/10 file:text-[#0B5ED7]
                                hover:file:bg-[#0B5ED7]/20
                            "
                        />
                        <button
                            type="button"
                            onClick={handleUploadGallery}
                            disabled={uploadingGallery || !galleryFiles}
                            className="px-6 py-2 bg-[#0B5ED7] text-white rounded-full hover:bg-[#094bb3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {uploadingGallery ? 'Uploading...' : 'Upload'}
                        </button>
                    </div>
                    {/* Display Selected Files Preview */}
                    {galleryFiles && galleryFiles.length > 0 && (
                        <div className="mt-4 p-4 bg-[#F8FAFC] rounded-xl border border-[#D4E4F7]">
                            <h4 className="text-sm font-semibold text-[#0A1A2F] mb-3">Selected Files ({galleryFiles.length}):</h4>
                            <ul className="space-y-2">
                                {Array.from(galleryFiles).map((file, index) => (
                                    <li key={index} className="flex items-center text-sm text-[#475569] bg-white px-3 py-2 rounded-lg border border-[#E2E8F0] shadow-sm">
                                        <svg className="w-4 h-4 mr-2 text-[#0B5ED7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span className="truncate flex-1">{file.name}</span>
                                        <span className="text-xs text-[#94A3B8] ml-2">({(file.size / 1024).toFixed(1)} KB)</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {galleryImages.map((img) => (
                        <div key={img._id} className="relative group rounded-xl overflow-hidden aspect-square">
                            <img
                                src={getApiUrl(img.url)}
                                alt="Gallery"
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <button
                                    onClick={() => handleDeleteGalleryImage(img._id)}
                                    aria-label="Delete Image"
                                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors transform hover:scale-110"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                    {galleryImages.length === 0 && (
                        <p className="text-[#64748B] col-span-full text-center py-8">No images in gallery</p>
                    )}
                </div>
            </div>

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
        </div>
    );
}
