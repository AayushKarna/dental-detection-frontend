import { Patient } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface PatientCardProps {
  className?: string;
  selectedPatient: Patient | null;
}

function PatientCard({ className, selectedPatient }: PatientCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Patient Profile</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-x-4">
        <img
          src={selectedPatient ? selectedPatient.image : './placeholder.png'}
          alt="Placeholder Photo"
          className="size-32 aspect-square rounded-md"
        />

        <ul className="flex flex-col gap-3">
          <li>
            <span className="font-semibold">Name: </span>{' '}
            {selectedPatient ? selectedPatient.fullName : ''}
          </li>
          <li>
            <span className="font-semibold">Age: </span>{' '}
            {selectedPatient ? selectedPatient.age : ''}
          </li>
          <li>
            <span className="font-semibold">Sex: </span>{' '}
            {selectedPatient ? selectedPatient.sex : ''}
          </li>
          <li>
            <span className="font-semibold">Date Registered: </span>{' '}
            {selectedPatient ? selectedPatient.dateRegistered : ''}
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}

export default PatientCard;
