import React from "react";
import { Lock, Unlock, ShieldAlert, ShieldCheck } from "lucide-react";

interface QATopBarProps {
  lockState: {
    lockedBy: string | null;
    userName: string | null;
    lockedAt: number | null;
  };
  remainingTime: number;
  currentUserUid: string;
  currentUserRole: string;
  handleForceUnlock: () => void;
  releaseLockManually: () => void;
}

export const QATopBar: React.FC<QATopBarProps> = ({
  lockState,
  remainingTime,
  currentUserUid,
  currentUserRole,
  handleForceUnlock,
  releaseLockManually,
}) => {
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const isLockedBySomeoneElse = lockState.lockedBy && lockState.lockedBy !== currentUserUid;

  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs">
      <div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#405189]/10 text-[#405189] flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight">
            QA Test Cases & Execution Matrix
          </h2>
        </div>
        <p className="text-xs text-slate-400 font-semibold mt-1">
          Kelola test suite, skenario pengujian, dan catat hasil eksekusi pengujian kualitas perangkat lunak.
        </p>
      </div>

      {/* Velzon Concurrency Lock Panel */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-50/80 border border-slate-200/60 p-3 rounded-xl w-full lg:w-auto">
        {lockState.lockedBy ? (
          <>
            {isLockedBySomeoneElse ? (
              <div className="flex items-center gap-3 w-full lg:w-auto">
                <div className="p-2 bg-rose-50 text-[#f06548] rounded-xl">
                  <Lock className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <span className="text-[10px] text-[#f06548] font-black uppercase tracking-wider block">
                    DILOCK OLEH LAIN
                  </span>
                  <span className="text-xs font-bold text-slate-700 block mt-0.5">
                    {lockState.userName}
                  </span>
                </div>
                {(currentUserRole === "admin" || currentUserRole === "head" || currentUserRole === "manager") && (
                  <button
                    onClick={handleForceUnlock}
                    className="ml-auto lg:ml-2 px-3 py-1.5 bg-[#f06548] hover:bg-[#d95338] text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Force Unlock
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3 w-full lg:w-auto">
                <div className="p-2 bg-emerald-50 text-[#0ab39c] rounded-xl">
                  <Unlock className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-[#0ab39c] font-black uppercase tracking-wider">
                      Anda Memegang Lock
                    </span>
                    <span className="px-2 py-0.5 bg-[#405189]/10 text-[#405189] text-[10px] font-black rounded-lg">
                      {formatTime(remainingTime)}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-400 block mt-0.5">
                    Auto-Unlock dalam 15 mnt inaktivitas
                  </span>
                </div>
                <button
                  onClick={releaseLockManually}
                  className="ml-auto lg:ml-2 px-3 py-1.5 bg-slate-200/80 hover:bg-slate-300 text-slate-700 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                >
                  Unlock Now
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center gap-2 px-2 py-1">
            <span className="w-2 h-2 rounded-full bg-slate-300" />
            <span className="text-xs text-slate-500 font-bold">
              Tidak ada kunci aktif. Membuka test suite akan mengunci otomatis.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
