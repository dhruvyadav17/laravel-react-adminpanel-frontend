type PermissionItem = {
  id: number;
  name: string;
};

type Props = {
  permissions: Record<string, PermissionItem[]>;
  selected: string[];
  onChange: (values: string[]) => void;
};

export default function PermissionGroupAccordion({
  permissions,
  selected,
  onChange,
}: Props) {
  const toggle = (name: string) => {
    onChange(
      selected.includes(name)
        ? selected.filter((p) => p !== name)
        : [...selected, name]
    );
  };

  return (
    <div>
      {Object.entries(permissions).map(([group, items]) => (
        <div key={group} className="mb-3">
          <h6 className="fw-bold">{group} Permissions</h6>

          {items.map((p) => (
            <label key={p.id} className="d-block">
              <input
                type="checkbox"
                className="me-2"
                checked={selected.includes(p.name)}
                onChange={() => toggle(p.name)}
              />
              {p.name}
            </label>
          ))}
        </div>
      ))}
    </div>
  );
}
