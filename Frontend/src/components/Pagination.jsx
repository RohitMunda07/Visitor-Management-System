export default function Pagination({ pagination, onPageChange }) {
  if (!pagination) return null;

  const {
    currentPage,
    hasNext,
    hasPrevious,
  } = pagination;

  return (
    <div className="flex items-center justify-center gap-4 mt-6">
      {/* Prev Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrevious}
        className={`px-3 py-1.5 border rounded text-sm shadow
          ${hasPrevious
            ? "bg-white text-gray-700 hover:bg-gray-100"
            : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
      >
        Prev
      </button>

      {/* Current Page */}
      <span className="px-4 py-1.5 border rounded text-sm bg-gray-50 text-gray-700">
        Page {currentPage}
      </span>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNext}
        className={`px-3 py-1.5 border rounded text-sm shadow
          ${hasNext
            ? "bg-white text-gray-700 hover:bg-gray-100"
            : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
      >
        Next
      </button>
    </div>
  );
}
