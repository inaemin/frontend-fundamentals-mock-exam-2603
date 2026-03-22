import { Select } from '_tosslib/components';

interface FieldSelectOption {
  value: string;
  label: string;
}

interface FieldSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: FieldSelectOption[];
  placeholder?: string;
  'aria-label'?: string;
}

export function FieldSelect({ value, onChange, options, placeholder = '선택', 'aria-label': ariaLabel }: FieldSelectProps) {
  return (
    <Select value={value} onChange={e => onChange(e.target.value)} aria-label={ariaLabel}>
      <option value="">{placeholder}</option>
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </Select>
  );
}
