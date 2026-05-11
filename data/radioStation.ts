export interface RadioStation {
  id: string;
  name: string;
  schedule: string;
  time: string;
  repeat: string;
  country: string;
  timezone: string;
  url: string | null;
  latitude: number;
  longitude: number;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export type RadioStationInput = Omit<RadioStation, 'id' | 'created_at' | 'updated_at'>;
