type Props = {
  rows?: number;
  cols?: number;
};

export default function TableSkeleton({
  rows = 5,
  cols = 4,
}: Props) {
  return (
    <tbody>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i}>
          <td colSpan={cols}>
            <div className="placeholder-glow">
              <span
                className="placeholder col-12 bg-secondary"
                style={{ height: 20 }}
              />
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  );
}
