import { Society, ISociety } from '../models/society';

export async function getAllSocieties(): Promise<ISociety[]> {
  return await Society.find().lean();
}

export async function getSocietyById(id: string): Promise<ISociety | null> {
  return await Society.findById(id).lean();
}

export async function createSociety(societyData: {
  name: string;
  logo_url?: string;
  chair_name?: string;
  description?: string;
  faculty_name?: string;
}): Promise<string> {
  const society = new Society(societyData);
  const savedSociety = await society.save();
  return savedSociety._id.toString();
}

export async function updateSociety(
  id: string,
  societyData: {
    name?: string;
    logo_url?: string;
    chair_name?: string;
    description?: string;
    faculty_name?: string;
  }
): Promise<boolean> {
  const updates: any = {};
  
  if (societyData.name !== undefined) updates.name = societyData.name;
  if (societyData.logo_url !== undefined) updates.logo_url = societyData.logo_url;
  if (societyData.chair_name !== undefined) updates.chair_name = societyData.chair_name;
  if (societyData.description !== undefined) updates.description = societyData.description;
  if (societyData.faculty_name !== undefined) updates.faculty_name = societyData.faculty_name;

  if (Object.keys(updates).length === 0) {
    throw new Error('No fields to update');
  }

  const result = await Society.findByIdAndUpdate(id, updates, { new: true });
  return result !== null;
}

export async function deleteSociety(id: string): Promise<boolean> {
  const result = await Society.findByIdAndDelete(id);
  return result !== null;
}
