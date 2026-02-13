
// Basic URL validation
const isValidUrl = (url: string): boolean => {
  if (!url) return true; // Allow empty if optional
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export interface ValidationError {
  field: string;
  message: string;
}

export interface EventFormData {
  title: string;
  image_url?: string;
  description?: string;
  start_time: string;
  end_time: string;
}

export const validateEvent = (data: EventFormData): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Title validation
  if (!data.title || data.title.trim().length < 3) {
    errors.push({ field: 'title', message: 'Title must be at least 3 characters long' });
  }

  // Description validation (optional but if provided should be meaningful)
  if (data.description && data.description.trim().length > 0 && data.description.trim().length < 10) {
     errors.push({ field: 'description', message: 'Description should be at least 10 characters if provided' });
  }

  // Image URL validation
  if (data.image_url && !isValidUrl(data.image_url)) {
    errors.push({ field: 'image_url', message: 'Please enter a valid Image URL' });
  }

  // Date validation
  if (!data.start_time) {
    errors.push({ field: 'start_time', message: 'Start time is required' });
  }

  if (!data.end_time) {
    errors.push({ field: 'end_time', message: 'End time is required' });
  }

  if (data.start_time && data.end_time) {
    const start = new Date(data.start_time);
    const end = new Date(data.end_time);

    if (isNaN(start.getTime())) {
       errors.push({ field: 'start_time', message: 'Invalid start time format' });
    }
    if (isNaN(end.getTime())) {
       errors.push({ field: 'end_time', message: 'Invalid end time format' });
    }

    if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end <= start) {
      errors.push({ field: 'end_time', message: 'End time must be after start time' });
    }
  }

  return errors;
};

export interface SocietyFormData {
  name: string;
  logo_url?: string;
  chair_name?: string;
  description?: string;
  faculty_name?: string;
}

export const validateSociety = (data: SocietyFormData): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Name validation
  if (!data.name || data.name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Society name is required' });
  }

  // Chair Name validation
  if (!data.chair_name || data.chair_name.trim().length < 2) {
    errors.push({ field: 'chair_name', message: 'Chairperson name is required' });
  }
  
  // Faculty Name validation
  if (!data.faculty_name || data.faculty_name.trim().length < 2) {
    errors.push({ field: 'faculty_name', message: 'Faculty name is required' });
  }

  // Logo URL validation
  if (data.logo_url && !isValidUrl(data.logo_url)) {
    errors.push({ field: 'logo_url', message: 'Please enter a valid Logo URL' });
  }

  return errors;
};
