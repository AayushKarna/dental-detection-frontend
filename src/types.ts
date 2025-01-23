export type Box = {
  class: number;
  confidence: number;
  h: number;
  w: number;
  x: number;
  y: number;
};

export type ResultData = {
  boxes: Box[];
  names: { [key: number]: string };
  orig_shape: [number, number];
  path: string;
  speed: {
    inference: number;
    postprocess: number;
    preprocess: number;
  };
};

export type ResultType = {
  data: {
    image: string;
    message: string;
    result: ResultData[];
  };
  status: string;
};

export type ResultError = {
  message: string;
  status: string;
};

export type ResultContextType = {
  result: ResultType | null;
  setResult: React.Dispatch<React.SetStateAction<ResultType | null>>;
};

export interface Patient {
  fullName: string;
  age: number;
  sex: string;
  dateRegistered: string;
  image: string;
}
