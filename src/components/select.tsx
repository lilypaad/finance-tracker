"use client";

import { useMemo } from "react";
import { SingleValue } from "react-select";
import CreateableSelect from "react-select/creatable";

type Props = {
  onChangeAction: (value?: string) => void;
  onCreateAction?: (value: string) => void;
  options?: { label: string; value: string }[];
  value?: string | number | null | undefined;
  disabled?: boolean;
  placeholder?: string;
};

export function Select({value, onChangeAction, disabled, onCreateAction, options, placeholder}: Props) {
  const onSelect = (option: SingleValue<{ label: string, value: string }>) => {
    onChangeAction(option?.value);
  };

  const formattedValue = useMemo(() => {
    return options?.find((option) => option.value === value);
  }, [options, value]);

  return (
    <CreateableSelect
      placeholder={placeholder}
      className="text-sm h-10"
      styles={{
        control: (base) => ({ ...base, borderColor: "#e2e8f0", ":hover": { borderColor: "#e2e8f0" }})
      }}
      value={formattedValue}
      onChange={onSelect}
      onCreateOption={onCreateAction}
      options={options}
      isDisabled={disabled}
    />
  );
}