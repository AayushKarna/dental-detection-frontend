import MainForm from './MainForm';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface Patient {
  fullName: string;
  age: number;
  sex: string;
  dateRegistered: string;
  image: string;
}

interface MainFormCardProps {
  className?: string;
  patients: Patient[];
  onPatientChange: (patientName: string) => void;
}

function MainFormCard({
  className,
  patients,
  onPatientChange
}: MainFormCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Upload X-ray</CardTitle>
      </CardHeader>
      <CardContent>
        <MainForm patients={patients} onPatientChange={onPatientChange} />
      </CardContent>
    </Card>
  );
}

export default MainFormCard;
