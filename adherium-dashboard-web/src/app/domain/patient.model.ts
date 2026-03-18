export interface Patient {
  external_id: string;
  demographics: {
    initials: string;
    age: { value: number; unit: string };
  };
  condition: {
    name: string;
    code: { system: string; value: string; display: string };
  };
}
