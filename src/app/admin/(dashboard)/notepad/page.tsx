import NotepadClient from "./NotepadClient";

export const revalidate = 0; // Disable cache for admin page

export default async function AdminNotepadPage() {
  return (
    <div className="space-y-6">
      <NotepadClient />
    </div>
  );
}
