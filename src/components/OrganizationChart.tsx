"use client";

import React, { useMemo } from "react";
import { UserCircle } from "lucide-react";

type Member = {
  id: string;
  name: string;
  position: string;
  parentId: string | null;
  order: number;
};

type TreeNode = Member & {
  children: TreeNode[];
};

export default function OrganizationChart({ members }: { members: Member[] }) {
  // Build tree
  const tree = useMemo(() => {
    const map = new Map<string, TreeNode>();
    const roots: TreeNode[] = [];

    // Initialize map
    members.forEach(m => {
      map.set(m.id, { ...m, children: [] });
    });

    // Build hierarchy
    members.forEach(m => {
      const node = map.get(m.id);
      if (node) {
        if (m.parentId && map.has(m.parentId)) {
          map.get(m.parentId)!.children.push(node);
        } else {
          roots.push(node);
        }
      }
    });

    // Sort children
    const sortNode = (node: TreeNode) => {
      node.children.sort((a, b) => a.order - b.order);
      node.children.forEach(sortNode);
    };
    roots.sort((a, b) => a.order - b.order);
    roots.forEach(sortNode);

    return roots;
  }, [members]);

  if (members.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10 bg-gray-50 rounded-2xl border border-gray-100">
        Bagan struktur organisasi belum tersedia.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto pb-8 pt-8 custom-scrollbar bg-[#0f5132] rounded-2xl p-4 relative border-[6px] border-[#ffd700]">
      {/* Background decoration - optional subtle pattern */}
      <div className="absolute inset-0 opacity-10 bg-[url('/islamic-pattern.png')] bg-repeat rounded-xl pointer-events-none"></div>
      <div className="min-w-max flex justify-center px-4 relative z-10">
        {tree.map(root => (
          <OrgNode key={root.id} node={root} />
        ))}
      </div>
    </div>
  );
}

function OrgNode({ node }: { node: TreeNode }) {
  return (
    <div className="flex flex-col items-center">
      {/* Node Card */}
      <div className="w-56 sm:w-64 flex flex-col shadow-md z-10 relative transition-transform transform hover:-translate-y-1 hover:shadow-lg border border-gray-300 bg-white">
        {/* Header - Yellow */}
        <div className="bg-[#ffcc00] py-2 px-3 flex items-center justify-center border-b border-gray-400 min-h-[3rem]">
          <h3 className="font-bold text-gray-900 text-sm leading-snug uppercase text-center">{node.position}</h3>
        </div>
        {/* Body - White */}
        <div className="p-3 text-center flex items-center justify-center min-h-[4rem]">
          <p className="text-gray-800 text-xs sm:text-sm font-medium whitespace-pre-line leading-relaxed">
            {node.name.replace(/\\n/g, '\n')}
          </p>
        </div>
      </div>
      
      {/* Connector line down to children */}
      {node.children.length > 0 && (
        <div className="w-0.5 h-8 bg-white"></div>
      )}

      {/* Children Container */}
      {node.children.length > 0 && (
        <div className="flex justify-center">
          {node.children.map((child, index) => {
            const isFirst = index === 0;
            const isLast = index === node.children.length - 1;
            const isOnly = node.children.length === 1;

            return (
              <div key={child.id} className="relative flex flex-col items-center px-2 sm:px-4">
                {/* Horizontal line segments */}
                {!isOnly && (
                  <>
                    {!isFirst && (
                      <div className="absolute top-0 left-0 w-1/2 h-0.5 bg-white"></div>
                    )}
                    {!isLast && (
                      <div className="absolute top-0 right-0 w-1/2 h-0.5 bg-white"></div>
                    )}
                  </>
                )}

                {/* Top vertical connector from horizontal line to the node */}
                <div className="w-0.5 h-8 bg-white"></div>

                <OrgNode node={child} />
              </div>

            );
          })}
        </div>
      )}
    </div>
  );
}
