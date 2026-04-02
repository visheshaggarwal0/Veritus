import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 p-6">
      <div className="w-full max-w-md p-10 bg-white border border-zinc-200 rounded-[2.5rem] shadow-2xl shadow-zinc-200 text-center">
        <div className="w-16 h-16 bg-zinc-900 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-zinc-200 rotate-3 mx-auto">
          <span className="text-white text-3xl font-black italic -rotate-3">V</span>
        </div>
        <h1 className="text-3xl font-black text-zinc-900 tracking-tighter mb-2">VERITUS</h1>
        <p className="text-zinc-500 text-sm font-medium mb-10">Welcome to the secure hierarchical workspace.</p>
        
        <Link 
          href="/login"
          className="inline-block w-full py-4 bg-zinc-900 text-white font-black rounded-2xl hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200 active:scale-[0.98]"
        >
          LOG IN TO ACCESS WORKSPACE
        </Link>
        
        <div className="mt-10 pt-8 border-t border-zinc-100">
          <p className="text-[10px] text-zinc-400 font-black uppercase tracking-[0.2em]">Authorized Personnel Only</p>
        </div>
      </div>
    </div>
  );
}
