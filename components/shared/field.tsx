import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

interface FieldProps {
  label: string;
  name: string;
}

const Field = ({ label, name }: FieldProps) => {
  return (
    <Label className="flex flex-col gap-2 w-full">
      <span className="text-xl font-semibold self-start">{label}</span>
      <Input type="file" placeholder={label} name={name}/>
    </Label>
  );
};

export default Field;
