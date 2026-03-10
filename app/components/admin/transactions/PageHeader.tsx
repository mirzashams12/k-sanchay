export default function PageHeader() {
    return (
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Ledger</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Track and record financial movements</p>
            </div>
        </header>
    );
}