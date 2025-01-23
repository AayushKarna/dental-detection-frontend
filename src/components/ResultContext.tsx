import { ResultContextType, ResultType } from '@/types';
import { createContext, useState, ReactNode } from 'react';

const ResultContext = createContext<ResultContextType | null>(null);

function ResultProvider({ children }: { children: ReactNode }) {
  const [result, setResult] = useState<ResultType | null>(null);

  return (
    <ResultContext.Provider value={{ result, setResult }}>
      {children}
    </ResultContext.Provider>
  );
}

export { ResultContext, ResultProvider };
