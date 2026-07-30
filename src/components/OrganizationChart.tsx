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
    <div className="overflow-x-auto pb-8 pt-4 custom-scrollbar">
      <div className="min-w-max flex justify-center px-4">
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
      <div className="w-48 sm:w-56 bg-white border-2 border-primary-100 rounded-xl shadow-sm p-4 text-center z-10 relative transition-transform transform hover:-translate-y-1 hover:shadow-md hover:border-primary-300">
        <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-3 text-primary-600">
          <UserCircle className="w-8 h-8" />
        </div>
        <h3 className="font-bold text-gray-900 text-sm mb-1 leading-snug">{node.position}</h3>
        <p className="text-gray-600 text-xs sm:text-sm font-medium">{node.name}</p>
      </div>
      
      {/* Connector line down to children */}
      {node.children.length > 0 && (
        <div className="w-px h-6 bg-primary-300"></div>
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
                      <div className="absolute top-0 left-0 w-1/2 h-px bg-primary-300"></div>
                    )}
                    {!isLast && (
                      <div className="absolute top-0 right-0 w-1/2 h-px bg-primary-300"></div>
                    )}
                  </>
                )}

                {/* Top vertical connector from horizontal line to the node */}
                <div className="w-px h-6 bg-primary-300"></div>

                <OrgNode node={child} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
