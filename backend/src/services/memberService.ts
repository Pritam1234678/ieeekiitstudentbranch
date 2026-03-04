import { Member, IMember } from '../models/member';

export async function getAllMembers(): Promise<IMember[]> {
  return await Member.find().sort({ created_at: 1 });
}

export async function getFacultyAdvisors(): Promise<IMember[]> {
  return await Member.find({ position: 'Advisor' }).sort({ rank: 1 });
}

export async function getNextFacultyRank(): Promise<number> {
  const top = await Member.findOne({ position: 'Advisor', rank: { $exists: true } }).sort({ rank: -1 });
  return top && top.rank != null ? top.rank + 1 : 1;
}

export async function getMemberById(id: string): Promise<IMember | null> {
  return await Member.findById(id);
}

/** Throws if any other Faculty Advisor already holds this rank */
async function checkRankConflict(rank: number, excludeId?: string): Promise<void> {
  const query: any = { position: 'Faculty Advisor', rank };
  if (excludeId) query._id = { $ne: excludeId };
  const existing = await Member.findOne(query);
  if (existing) {
    throw Object.assign(
      new Error(`Rank ${rank} is already assigned to "${existing.fullname}". Please choose a different rank.`),
      { code: 'RANK_CONFLICT', statusCode: 409 }
    );
  }
}

export async function createMember(memberData: Partial<IMember>): Promise<string> {
  // Auto-assign rank for Faculty Advisors if not provided
  if (memberData.position === 'Advisor' && memberData.rank == null) {
    memberData.rank = await getNextFacultyRank();
  }
  // Explicit rank provided — validate uniqueness
  if (memberData.position === 'Advisor' && memberData.rank != null) {
    await checkRankConflict(Number(memberData.rank));
  }
  const member = new Member(memberData);
  const savedMember = await member.save();
  return savedMember._id.toString();
}

export async function updateMember(id: string, memberData: Partial<IMember>): Promise<boolean> {
  // If rank is being set for a Faculty Advisor, validate uniqueness (excluding self)
  if (memberData.position === 'Advisor' && memberData.rank != null) {
    await checkRankConflict(Number(memberData.rank), id);
  } else if (memberData.rank != null) {
    // Also check when position isn't being changed but rank is being set
    const current = await Member.findById(id);
    if (current?.position === 'Advisor') {
      await checkRankConflict(Number(memberData.rank), id);
    }
  }
  const result = await Member.findByIdAndUpdate(id, memberData, { new: true, runValidators: true });
  return result !== null;
}

export async function deleteMember(id: string): Promise<boolean> {
  const result = await Member.findByIdAndDelete(id);
  return result !== null;
}
