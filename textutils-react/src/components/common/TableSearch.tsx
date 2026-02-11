type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function TableSearch({
  value,
  onChange,
  placeholder = "Search...",
}: Props) {
  return (
    <div className="mb-3">
      <input
        className="form-control"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
