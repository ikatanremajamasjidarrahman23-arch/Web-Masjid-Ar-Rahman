"use client";

import { useState, useRef } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar, Trash2, Plus, Upload, Loader2, Video, Edit, X, Save, PlayCircle, Image as ImageIcon } from "lucide-react";
import { createPhbiEvent, deletePhbiEvent, addPhbiMedia, deletePhbiMedia, updatePhbiEvent } from "@/app/actions/phbi";
import axios from "axios";
import { compressImage } from "@/utils/imageCompression";

export default function PhbiClientManager({ initialEvents }: { initialEvents: any[] }) {
  const [isUploading, setIsUploading] = useState<{ [key: string]: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const createFormRef = useRef<HTMLFormElement>(null);

  const handleUploadPhoto = async (eventId: string, files: FileList) => {
    const event = initialEvents.find(ev => ev.id === eventId);
    const currentPhotoCount = event ? event.media.filter((m: any) => m.type === "IMAGE").length : 0;
    
    const maxAllowed = 5 - currentPhotoCount;
    if (maxAllowed <= 0) {
      alert("Maksimal 5 foto per acara telah tercapai.");
      return;
    }

    const filesToUpload = Array.from(files).slice(0, maxAllowed);
    if (files.length > maxAllowed) {
      alert(`Hanya ${maxAllowed} foto pertama yang akan diunggah karena batas maksimal 5 foto.`);
    }

    setIsUploading({ ...isUploading, [eventId]: true });
    
    try {
      for (const file of filesToUpload) {
        const compressedFile = await compressImage(file);
        const formData = new FormData();
        formData.append("file", compressedFile);
        
        const res = await axios.post("/api/upload", formData);
        const imageUrl = res.data.data.secure_url;

        const mediaData = new FormData();
        mediaData.append("phbiEventId", eventId);
        mediaData.append("type", "IMAGE");
        mediaData.append("url", imageUrl);
        
        await addPhbiMedia(mediaData);
      }
    } catch (error) {
      alert("Sebagian atau seluruh foto gagal diunggah.");
    } finally {
      setIsUploading({ ...isUploading, [eventId]: false });
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const fileInput = e.currentTarget.elements.namedItem("photos") as HTMLInputElement;
    const files = fileInput.files;

    if (files && files.length > 5) {
      alert("Maksimal hanya boleh 5 foto saat membuat acara!");
      setIsSubmitting(false);
      return;
    }

    try {
      const submitData = new FormData();
      submitData.append("title", formData.get("title") as string);
      submitData.append("description", formData.get("description") as string);
      submitData.append("date", formData.get("date") as string);
      submitData.append("linkMore", formData.get("linkMore") as string);

      const result = await createPhbiEvent(submitData);
      if (result.success && result.id && files && files.length > 0) {
        await handleUploadPhoto(result.id, files);
      }
      createFormRef.current?.reset();
    } catch (error) {
      alert("Terjadi kesalahan saat menyimpan acara.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddVideo = async (eventId: string) => {
    const url = prompt("Masukkan ID Video YouTube (Contoh: dQw4w9WgXcQ)");
    if (!url) return;
    
    const mediaData = new FormData();
    mediaData.append("phbiEventId", eventId);
    mediaData.append("type", "VIDEO");
    mediaData.append("url", url);
    
    await addPhbiMedia(mediaData);
  };

  return (
    <div className="space-y-12">
      {/* Form Tambah Event */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-primary-600" /> Tambah Acara PHBI Baru
        </h3>
        <form ref={createFormRef} onSubmit={handleCreateSubmit} className="grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Acara</label>
            <input required type="text" name="title" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" placeholder="Contoh: Peringatan Isra Mi'raj 1445H" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Singkat</label>
            <textarea required name="description" rows={2} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" placeholder="Deskripsi kegiatan..."></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Acara</label>
            <input required type="date" name="date" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Link Album Eksternal (Opsional)</label>
            <input type="url" name="linkMore" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" placeholder="https://drive.google.com/..." />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Foto (Maksimal 5)</label>
            <input type="file" name="photos" multiple accept="image/*" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100" />
          </div>
          <div className="md:col-span-2 flex items-end">
            <button type="submit" disabled={isSubmitting} className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Simpan Acara"}
            </button>
          </div>
        </form>
      </div>

      {/* Daftar Event */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-900">Daftar Acara & Media</h3>
        {initialEvents.length === 0 ? (
          <p className="text-gray-500 italic">Belum ada acara PHBI yang ditambahkan.</p>
        ) : (
          initialEvents.map((event) => {
            const isEditing = editingId === event.id;
            return (
              <div key={event.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {isEditing ? (
                  <form action={async (formData) => {
                    await updatePhbiEvent(formData);
                    setEditingId(null);
                  }} className="p-6 border-b border-gray-100 grid md:grid-cols-2 gap-4 bg-gray-50/50">
                    <input type="hidden" name="id" value={event.id} />
                    <div className="md:col-span-2 flex justify-between items-center">
                      <h4 className="font-bold text-gray-900">Edit Acara</h4>
                      <button type="button" onClick={() => setEditingId(null)} className="text-gray-500 hover:text-gray-700">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs text-gray-500 mb-1">Nama Acara</label>
                      <input required type="text" name="title" defaultValue={event.title} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs text-gray-500 mb-1">Deskripsi Singkat</label>
                      <textarea required name="description" defaultValue={event.description} rows={2} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"></textarea>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Tanggal Acara</label>
                      <input required type="date" name="date" defaultValue={format(new Date(event.date), "yyyy-MM-dd")} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Link Album Eksternal</label>
                      <input type="url" name="linkMore" defaultValue={event.linkMore || ""} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" placeholder="https://..." />
                    </div>
                    <div className="md:col-span-2 flex justify-end gap-2 mt-2">
                      <button type="button" onClick={() => setEditingId(null)} className="px-4 py-2 text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium transition-colors">Batal</button>
                      <button type="submit" className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
                        <Save className="w-4 h-4" /> Simpan Perubahan
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between md:items-start gap-4">
                    <div>
                      <h4 className="text-xl font-bold text-gray-900">{event.title}</h4>
                      <p className="text-gray-600 text-sm mt-1">{event.description}</p>
                      <div className="flex flex-wrap items-center gap-4 mt-2">
                        <div className="flex items-center gap-1.5 text-primary-600 text-sm font-medium">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(event.date), "dd MMMM yyyy", { locale: id })}
                        </div>
                        {event.linkMore && (
                          <a href={event.linkMore} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                            🔗 Link Album Eksternal
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => setEditingId(event.id)} className="flex items-center gap-2 bg-gray-50 text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        <Edit className="w-4 h-4" /> Edit
                      </button>
                      
                      {event.media.filter((m: any) => m.type === "IMAGE").length < 5 ? (
                        <label className="cursor-pointer flex items-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                          {isUploading[event.id] ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                          Upload Foto (Maks 5)
                          <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                              handleUploadPhoto(event.id, e.target.files);
                              e.target.value = "";
                            }
                          }} disabled={isUploading[event.id]} />
                        </label>
                      ) : (
                        <div className="flex items-center gap-2 bg-gray-100 text-gray-400 px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed" title="Batas 5 foto tercapai">
                          <Upload className="w-4 h-4" /> Upload Foto (Penuh)
                        </div>
                      )}
                      
                      <button onClick={() => handleAddVideo(event.id)} className="flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        <Video className="w-4 h-4" /> + YouTube
                      </button>
                      <button onClick={() => deletePhbiEvent(event.id)} className="flex items-center gap-2 bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-red-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        <Trash2 className="w-4 h-4" /> Hapus
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="p-6 bg-gray-50/50">
                  {event.media.length === 0 ? (
                    <p className="text-sm text-gray-500 italic text-center py-4">Belum ada foto/video untuk acara ini.</p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                      {event.media.map((item: any) => (
                        <div key={item.id} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-200 shadow-sm">
                          {item.type === "IMAGE" ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img src={item.url} alt="Media" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800 text-white p-2 text-center">
                              <PlayCircle className="w-8 h-8 text-red-500 mb-2" />
                              <span className="text-xs break-all line-clamp-2">{item.url}</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button onClick={() => deletePhbiMedia(item.id)} className="bg-red-600 text-white p-2 rounded-full hover:scale-110 transition-transform">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
