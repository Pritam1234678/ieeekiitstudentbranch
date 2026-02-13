import { executeQuery } from '../config/db';
import { Society } from '../models/society';

export async function getSocieties(
  limit: number = 100,
  offset: number = 0
): Promise<Society[]> {
  const query = 'SELECT * FROM societies LIMIT ? OFFSET ?';
  const societies = await executeQuery<Society[]>(query, [limit, offset]);
  return societies;
}

export async function getSocietyById(id: number): Promise<Society | null> {
  const query = 'SELECT * FROM societies WHERE id = ?';
  const societies = await executeQuery<Society[]>(query, [id]);
  return societies.length > 0 ? societies[0] : null;
}

export async function createSociety(society: Omit<Society, 'id'>): Promise<Society> {
  // Use 'random' as default if faculty_name is missing (though frontend should send it)
  const facultyName = society.faculty_name || 'random';
  
  const query = 'INSERT INTO societies (name, logo_url, chair_name, description, faculty_name) VALUES (?, ?, ?, ?, ?)';
  const result = await executeQuery<any>(query, [
    society.name,
    society.logo_url,
    society.chair_name,
    society.description,
    facultyName
  ]);
  return { ...society, faculty_name: facultyName, id: result.insertId };
}

export async function updateSociety(id: number, society: Partial<Society>): Promise<boolean> {
  const updates: string[] = [];
  const values: any[] = [];
  
  if (society.name !== undefined) { updates.push('name = ?'); values.push(society.name); }
  if (society.logo_url !== undefined) { updates.push('logo_url = ?'); values.push(society.logo_url); }
  if (society.chair_name !== undefined) { updates.push('chair_name = ?'); values.push(society.chair_name); }
  if (society.description !== undefined) { updates.push('description = ?'); values.push(society.description); }
  if (society.faculty_name !== undefined) { updates.push('faculty_name = ?'); values.push(society.faculty_name); }

  if (updates.length === 0) return false;

  const dynamicQuery = `UPDATE societies SET ${updates.join(', ')} WHERE id = ?`;
  values.push(id);
  
  const result = await executeQuery<any>(dynamicQuery, values);
  return result.affectedRows > 0;
}

export async function deleteSociety(id: number): Promise<boolean> {
  const query = 'DELETE FROM societies WHERE id = ?';
  const result = await executeQuery<any>(query, [id]);
  return result.affectedRows > 0;
}

export async function getSocietyCount(): Promise<number> {
  const query = 'SELECT COUNT(*) as count FROM societies';
  const result = await executeQuery<{ count: number }[]>(query);
  return result[0].count;
}
