type Props = {
  items: string[];
  selected: string[];
  onToggle: (value: string) => void;
  disabled?: (item: string) => boolean;
};

export default function CheckboxGrid({
  items,
  selected,
  onToggle,
  disabled,
}: Props) {
  return (
    <div className="row">
      {items.map((item) => (
        <div key={item} className="col-md-4 mb-2">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id={item}
              checked={selected.includes(item)}
              disabled={disabled?.(item)}
              onChange={() => onToggle(item)}
            />
            <label
              className="form-check-label"
              htmlFor={item}
            >
              {item}
            </label>
          </div>
        </div>
      ))}
    </div>
  );
}
