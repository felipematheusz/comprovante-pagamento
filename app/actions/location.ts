'use server';

export interface LocationData {
  latitude: number;
  longitude: number;
  city: string;
  region: string;
  country: string;
  ip: string;
  error?: string;
}

export async function getLocationData(): Promise<LocationData> {
  try {
    const response = await fetch('http://ip-api.com/json');
    if (!response.ok) {
      throw new Error('Erro ao obter localização');
    }
    const data = await response.json();

    return {
      ip: data.query,
      latitude: data.lat,
      longitude: data.lon,
      city: data.city,
      region: data.regionName,
      country: data.country,
    };
  } catch (error) {
    return {
      ip: '',
      latitude: 0,
      longitude: 0,
      city: '',
      region: '',
      country: '',
      error: "Erro ao obter localização: " + (error as Error).message
    };
  }
} 