import { Select, SelectProps } from "@mantine/core";
import { useState } from "react";

export default function GDropDown({ data, onChange, value, label, name, searchable, clearable }: SelectProps) {
  const [searchValue, onSearchChange] = useState<any>("");
  const dropdownData: any[] =
    typeof data[0] === "object" ? data : data.map((item, i) => ({ label: item as any, value: i.toString() }));

  return (
    <Select
      data={dropdownData.filter((x) => x.label.toLowerCase().startsWith(searchValue.toLowerCase()))}
      label={label}
      name={name}
      searchable={searchable}
      clearable={clearable}
      onChange={onChange}
      value={value ?? ""}
      searchValue={searchValue}
      onSearchChange={onSearchChange}
    />
  );
}
