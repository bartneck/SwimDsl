export interface ResponsivenessCase {
  name: string;
  changedSetting: string;
  baselineValue: string | number;
  modifiedValue: string | number;

  baselineMetric: number;
  modifiedMetric: number;

  direction: "increase" | "decrease" | "change" | "unchanged";
  responded: boolean;
}

export interface ResponsivenessResult {
  totalCases: number;
  responsiveCases: number;
  responsivenessPercentage: number;
  cases: ResponsivenessCase[];
}

export function evaluateResponsiveness(cases: ResponsivenessCase[]): ResponsivenessResult {
  if (cases.length === 0) {
    return {
      totalCases: 0,
      responsiveCases: 0,
      responsivenessPercentage: 0,
      cases: [],
    };
  }

  const responsiveCases = cases.filter((test) => test.responded).length;

  return {
    totalCases: cases.length,
    responsiveCases,
    responsivenessPercentage:
      (responsiveCases / cases.length) * 100,
    cases,
  };
}
