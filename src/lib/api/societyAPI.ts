import { ApiResponse, Society } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

class SocietyAPI {
  private baseUrl: string;

  constructor(baseUrl: string = API_URL) {
    this.baseUrl = baseUrl;
  }

  async getSocieties(
    limit: number = 100,
    offset: number = 0
  ): Promise<Society[]> {
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    params.append('offset', offset.toString());

    const response = await fetch(
      `${this.baseUrl}/api/societies?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch societies: ${response.statusText}`);
    }

    const data: ApiResponse<Society[]> = await response.json();
    return data.data || [];
  }
}

export const societyAPI = new SocietyAPI();
export default SocietyAPI;
