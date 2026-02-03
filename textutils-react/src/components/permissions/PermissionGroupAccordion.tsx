type PermissionItem = {
  id: number;
  name: string;
};

type Props = {
  permissions: Record<string, PermissionItem[]>;
  selected: string[];
  inherited?: string[];
  onChange: (values: string[]) => void;
};

export default function PermissionGroupAccordion({
  permissions,
  selected,
  inherited = [],
  onChange,
}: Props) {
  const toggle = (name: string) => {
    if (inherited.includes(name)) return;

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
          <h6 className="fw-bold">{group}</h6>

          {items.map((p) => {
            const isInherited = inherited.includes(p.name);

            return (
              <label key={p.id} className="d-block">
                <input
                  type="checkbox"
                  className="me-2"
                  checked={selected.includes(p.name) || isInherited}
                  disabled={isInherited}
                  onChange={() => toggle(p.name)}
                />
                {p.name}
                {isInherited && (
                  <span className="text-muted ms-2">(inherited)</span>
                )}
              </label>
            );
          })}
        </div>
      ))}
    </div>
  );
}
