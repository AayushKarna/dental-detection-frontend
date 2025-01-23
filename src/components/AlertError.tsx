import { Alert, AlertTitle } from './ui/alert';
import { XCircle } from '@phosphor-icons/react';

export default function AlertError({ error }: { error: string }) {
  return (
    <Alert className="bg-red-600 mb-4 min-w-full">
      <AlertTitle className="flex flex-row items-center gap-3 text-white">
        <XCircle size={18} weight="fill" />
        <span>{error}</span>
      </AlertTitle>
    </Alert>
  );
}
