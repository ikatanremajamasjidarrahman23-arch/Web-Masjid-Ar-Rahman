"use client";

import React from "react";
import { Users } from "lucide-react";

type Member = {
  id: string;
  name: string;
  position: string;
  parentId: string | null;
  order: number;
};

export default function OrganizationChart({ members }: { members: Member[] }) {
  if (members.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10 bg-gray-50 rounded-2xl border border-gray-100">
        Data struktur organisasi belum tersedia.
      </div>
    );
  }

  return (
    <div className="w-full mt-6">
      <div className="overflow-hidden border border-gray-200 shadow-sm rounded-xl">
        {/* Desktop Table View */}
        <table className="min-w-full divide-y divide-gray-200 hidden md:table">
          <thead className="bg-[#0f5132]">
            <tr>
              <th
                scope="col"
                className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider w-16"
              >
                No
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider"
              >
                Jabatan
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider"
              >
                Nama
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {members.map((member, index) => (
              <tr
                key={member.id}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-normal break-words text-sm font-semibold text-[#0f5132]">
                  {member.position}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 whitespace-pre-line leading-relaxed break-words">
                  {member.name.replace(/\\n/g, '\n')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile Card View */}
        <div className="md:hidden flex flex-col divide-y divide-gray-200 bg-white">
          {members.map((member) => (
            <div key={member.id} className="p-4 hover:bg-gray-50 transition-colors duration-150">
               <div className="flex justify-center mb-2 border-b border-gray-100 pb-2">
                 <span className="text-sm font-bold text-[#0f5132] text-center uppercase tracking-wide break-words">
                   {member.position}
                 </span>
               </div>
               <div className="text-sm text-gray-800 whitespace-pre-line leading-relaxed font-medium text-center">
                 {member.name.replace(/\\n/g, '\n')}
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
