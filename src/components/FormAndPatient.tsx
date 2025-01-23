import { ReactNode } from 'react';

function FormAndPatient({
  className,
  children
}: {
  className?: string;
  children: ReactNode;
}) {
  return <section className={className}>{children}</section>;
}

export default FormAndPatient;
