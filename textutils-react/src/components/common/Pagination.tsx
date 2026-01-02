type Props = {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({
  currentPage,
  lastPage,
  onPageChange,
}: Props) {
  if (lastPage <= 1) return null;

  return (
    <div className="d-flex align-items-center gap-2">
      <button
        className="btn btn-outline-secondary btn-sm px-2"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Prev
      </button>

      <span className="text-muted small">
        {currentPage}/{lastPage}
      </span>

      <button
        className="btn btn-outline-secondary btn-sm px-2"
        disabled={currentPage === lastPage}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </button>
    </div>
  );
}
