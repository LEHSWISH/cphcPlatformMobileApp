export interface IStepper {
  labels: string[];
  stepCount: number;
  currentStepNumber: number;
  previousStep?: () => void;
  nextStep?: () => void;
}
