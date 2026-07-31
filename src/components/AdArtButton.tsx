"use client";

import { useState } from "react";
import { FileText, X, ExternalLink } from "lucide-react";

interface AdArtButtonProps {
  content?: string | null;
  fileUrl?: string | null;
}

export default function AdArtButton({ content, fileUrl }: AdArtButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!content && !fileUrl) {
    return null; // Don't render the button if there is no AD/ART available
  }

  return (
    <>
      {/* Hyperlink/Button to trigger popup */}
      <button 
        onClick={() => setIsOpen(true)}
        className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-primary-50 hover:bg-primary-100 text-primary-700 rounded-full font-medium transition-colors border border-primary-200"
      >
        <FileText className="w-5 h-5" />
        Lihat AD/ART Kepengurusan DKM
      </button>

      {/* Popup Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FileText className="w-6 h-6 text-primary-600" />
                AD/ART Kepengurusan DKM
              </h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {content && (
                <div className="prose prose-primary max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {content}
                </div>
              )}
              
              {fileUrl && (
                <div className="w-full flex flex-col items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                  <div className="w-full bg-gray-100 px-4 py-3 flex justify-between items-center border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-700">Dokumen Lampiran</span>
                    <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
                      Buka di tab baru <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                  {fileUrl.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={fileUrl} alt="AD/ART Document" className="w-full h-auto max-w-3xl mx-auto p-4" />
                  ) : (
                    <iframe src={fileUrl} className="w-full h-[60vh] min-h-[500px]" title="AD/ART PDF" />
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button 
                onClick={() => setIsOpen(false)}
                className="px-6 py-2 bg-gray-900 text-white hover:bg-gray-800 rounded-xl font-medium transition-colors"
              >
                Tutup
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
