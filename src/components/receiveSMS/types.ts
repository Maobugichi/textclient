import { Dispatch, SetStateAction } from "react";

interface InputProps {
  tableValues: any;
  numberInfo: any;
  setNumberInfo: Dispatch<SetStateAction<any>>;
 
  setReqId: Dispatch<SetStateAction<any>>;
  cancel: boolean;
  req_id: string;
}

interface Country {
  id: string;
  title: string;
  [key: string]: any;
}

export  type { InputProps , Country}