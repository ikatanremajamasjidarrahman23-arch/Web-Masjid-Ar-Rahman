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
    <div className="overflow-x-auto w-full custom-scrollbar mt-6">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden border border-gray-200 shadow-sm rounded-xl">
          <table className="min-w-full divide-y divide-gray-200">
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#0f5132]">
                    {member.position}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                    {member.name.replace(/\\n/g, '\n')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
