import { Member, IMember } from '../models/member';

export async function getAllMembers(): Promise<IMember[]> {
  return await Member.find().sort({ created_at: 1 });
}

export async function getMemberById(id: string): Promise<IMember | null> {
  return await Member.findById(id);
}

export async function createMember(memberData: Partial<IMember>): Promise<string> {
  const member = new Member(memberData);
  const savedMember = await member.save();
  return savedMember._id.toString();
}

export async function updateMember(id: string, memberData: Partial<IMember>): Promise<boolean> {
  const result = await Member.findByIdAndUpdate(id, memberData, { new: true, runValidators: true });
  return result !== null;
}

export async function deleteMember(id: string): Promise<boolean> {
  const result = await Member.findByIdAndDelete(id);
  return result !== null;
}
