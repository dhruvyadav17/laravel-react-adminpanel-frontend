type Props = {
  colSpan: number;
  message?: string;
};

export default function TableEmptyRow({
  colSpan,
  message = "No records found",
}: Props) {
  return (
    <tr>
      <td colSpan={colSpan} className="text-center text-muted py-4">
        {message}
      </td>
    </tr>
  );
}
