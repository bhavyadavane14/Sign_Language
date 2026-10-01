export interface ModelInfo {
  type: string;
  framework: string;
  version: string;
  classesCount: number;
  accuracy: string;
}

export interface ModelStatus {
  isLoaded: boolean;
  isPredicting: boolean;
  error?: string;
}
