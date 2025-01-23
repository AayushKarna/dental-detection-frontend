import './App.css';
import MainFormCard from './components/MainFormCard';
import ResultCard from './components/ResultCard';
import FormAndPatient from './components/FormAndPatient';
import PatientCard from './components/PatientCard';
import HeadingCard from './components/HeadingCard';
import Sidebar from './components/Sidebar';
import { useEffect, useState } from 'react';
import { Patient } from './types';

type PatientResponseType = {
  age: number;
  date_registered: string;
  full_name: string;
  id: number;
  image: string;
  sex: string;
};

type PatientsResponseType = {
  data: {
    length: number;
    patients: PatientResponseType[];
  };
};

function App() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  useEffect(() => {
    async function fetchPatients() {
      try {
        const res = await fetch('http://127.0.0.1:5000/api/v1/patients');
        const data: PatientsResponseType = await res.json();
        const fetchedPatients: Patient[] = data.data.patients.map(patient => ({
          fullName: patient.full_name,
          age: patient.age,
          sex: patient.sex,
          dateRegistered: patient.date_registered,
          image: patient.image
        }));
        setPatients(fetchedPatients);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    }

    fetchPatients();
  }, []);

  function onPatientChange(patientName: string) {
    const correspondingPatient = patients.find(
      patient => patient.fullName === patientName
    );

    if (!correspondingPatient) return setSelectedPatient(null);

    setSelectedPatient({ ...correspondingPatient });
  }

  return (
    <main className="container mx-auto py-4 grid grid-cols-12 gap-3 items-start">
      <FormAndPatient className="col-span-4 self-stretch flex flex-col gap-3">
        <HeadingCard className="grow" />
        <MainFormCard patients={patients} onPatientChange={onPatientChange} />
        <PatientCard selectedPatient={selectedPatient} />
      </FormAndPatient>

      <ResultCard className="col-span-6 grow self-stretch" />
      <Sidebar className="col-span-2" />
    </main>
  );
}

export default App;
