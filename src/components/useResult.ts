import { useContext } from 'react';
import { ResultContext } from './ResultContext';
import { ResultContextType } from '@/types';

function useResult(): ResultContextType {
  const context = useContext(ResultContext);

  if (!context) {
    throw new Error('useResult must be used within a ResultProvider');
  }

  return context;
}

export default useResult;
