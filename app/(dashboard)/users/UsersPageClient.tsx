"use client";

import { useState } from "react";
import { Plus, ShieldCheck } from "lucide-react";
import { ProvisionUserModal } from "./ProvisionUserModal";
import { repairIdentityAction } from "./actions";
import { useRouter } from "next/navigation";

interface UsersPageClientProps {
  isITAdmin: boolean;
}

export function UsersPageClient({ isITAdmin }: UsersPageClientProps) {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between px-1 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-medium tracking-tight text-zinc-900 mb-1">Personnel Directory</h1>
          <p className="text-zinc-500 font-medium text-sm italic">Organizational hierarchy and tactical access management.</p>
        </div>
        {isITAdmin && (
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900 text-white text-[10px] font-semibold rounded-xl hover:bg-zinc-800 transition-all shadow-lg active:scale-95 uppercase tracking-widest"
          >
            <Plus size={16} className="stroke-2" />
            Provision Node
          </button>
        )}
      </div>

      {showModal && <ProvisionUserModal onClose={() => setShowModal(false)} />}
    </>
  );
}
