import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem
} from '@/components/ui/extension/file-upload';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CloudUpload, Paperclip } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import useResult from './useResult';
import { Patient, ResultError, ResultType } from '@/types';
import { Spinner } from '@phosphor-icons/react';
import AlertError from './AlertError';
import toast, { Toaster } from 'react-hot-toast';

interface MainFormProps {
  patients: Patient[];
  onPatientChange: (patientName: string) => void;
}

function notifySuccess(text: string) {
  toast.success(text, {
    duration: 3000,
    position: 'top-right'
  });
}

const formSchema = z.object({
  patient: z
    .string({ required_error: 'Please select a patient.' })
    .min(1, 'Please select a patient.'),
  file: z
    .any()
    .nullable()
    .refine(file => file !== null, {
      message: 'At least one file is required.'
    })
});

type ResponseData = ResultType | ResultError | null | undefined;

function isResultError(data: ResponseData): data is ResultError {
  return (data as ResultError).message !== undefined;
}

function MainForm({ patients, onPatientChange }: MainFormProps) {
  const { setResult } = useResult();
  const [files, setFiles] = useState<File[] | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patient: '',
      file: null
    }
  });

  function handleFileChange(files: File[] | null) {
    if (files && files.length > 0) {
      const selectedFile = files.at(-1);
      if (selectedFile) {
        setFiles([selectedFile]);
        form.setValue('file', selectedFile);
        form.trigger('file');
      }
    } else {
      setFiles(null);
      form.setValue('file', null);
      form.trigger('file');
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setError(null);

    try {
      const TIMEOUT_SEC = 15;
      const formData = new FormData();

      formData.append('patient', values.patient);

      if (files && files.length > 0) {
        formData.append('file', files[0]);
      } else {
        throw new Error('No file given.');
      }

      const requestUrl = 'http://127.0.0.1:5000/api/v1/predict';
      const requestConfig = {
        method: 'POST',
        body: formData,
        signal: AbortSignal.timeout(TIMEOUT_SEC * 1000)
      };

      const response = await fetch(requestUrl, requestConfig);

      const data: ResponseData = await response.json();

      if (!response.ok) {
        if (isResultError(data)) {
          throw new Error(
            data.message || 'Failed to upload file. Please try again.'
          );
        }
      }

      if (data === null || data === undefined || isResultError(data)) {
        throw new Error('No valid data returned.');
      }

      setResult(data);
      notifySuccess('X-ray uploaded successfully.');
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === 'TimeoutError') {
          setError('Request Timeout.');
        } else if (error.name === 'AbortError') {
          setError('Fetch aborted.');
        } else {
          setError(error.message || 'Something went wrong.');
        }
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setLoading(false);
    }
  }

  const dropZoneConfig = {
    maxFiles: 5,
    maxSize: 1024 * 1024 * 4,
    multiple: true
  };

  return (
    <Form {...form}>
      {Boolean(error) && (
        <AlertError error={error ?? 'Something went wrong.'} />
      )}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="patient"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel htmlFor="patient">Patient</FormLabel>
              <Select
                onValueChange={e => {
                  field.onChange(e);
                  onPatientChange(e);
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger id="patient">
                    <SelectValue placeholder="Select a patient" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {patients.map(patient => (
                    <SelectItem key={patient.fullName} value={patient.fullName}>
                      {patient.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage>{fieldState.error?.message}</FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file"
          render={({ fieldState }) => (
            <FormItem>
              <FormLabel htmlFor="file">Select File</FormLabel>
              <FormControl>
                <FileUploader
                  value={files}
                  onValueChange={handleFileChange}
                  dropzoneOptions={dropZoneConfig}
                  className="relative bg-background rounded-lg p-2"
                >
                  <FileInput
                    id="file"
                    className="outline-dashed outline-1 outline-slate-500"
                  >
                    <div className="flex items-center justify-center flex-col p-8 w-full">
                      <CloudUpload className="text-gray-500 w-10 h-10" />
                      <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span>
                        &nbsp; or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        PNG, JPG, or JPEG
                      </p>
                    </div>
                  </FileInput>

                  <FileUploaderContent>
                    {files &&
                      files.length > 0 &&
                      files.map((file, i) => (
                        <FileUploaderItem key={i} index={i}>
                          <Paperclip className="h-4 w-4 stroke-current" />
                          <span>{file.name}</span>
                        </FileUploaderItem>
                      ))}
                  </FileUploaderContent>
                </FileUploader>
              </FormControl>
              <FormMessage>{fieldState.error?.message}</FormMessage>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="min-w-full flex items-center gap-3"
          disabled={loading}
        >
          {loading && <Spinner size={20} className="animate-spin" />}
          <span>{loading ? 'Uploading...' : 'Upload and Analyze'}</span>
        </Button>
        <Toaster />
      </form>
    </Form>
  );
}

export default MainForm;
