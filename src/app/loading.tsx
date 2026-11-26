export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16">
      <div className="w-8 h-8 rounded-full border-3 border-primary-200 border-t-primary-600 animate-spin" />
      <p className="mt-3 text-sm text-gray-500 font-medium">Memuat halaman...</p>
    </div>
  );
}

