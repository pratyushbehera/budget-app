import React from "react";
import { Download } from "lucide-react";
import { MonthYearSelector } from "./MonthYearSelector";

export function Header({ currentMonth, setCurrentMonth, currentYear, setCurrentYear, exportCSV, logoutUser }) {
    return (
        <header className="flex flex-col items-start gap-3 md:gap-0 justify-between md:flex-row md:items-center">
            <h1 className="text-2xl md:text-3xl font-bold">Monthly Budget — Dashboard</h1>
            <div className="flex items-center gap-3 justify-between w-full md:w-auto">
                <MonthYearSelector currentMonth={currentMonth} setCurrentMonth={setCurrentMonth} currentYear={currentYear} setCurrentYear={setCurrentYear} />
                <button className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-2 rounded shadow" onClick={exportCSV}>
                    <Download size={16} /> Export CSV
                </button>
                {logoutUser && (
                    <button className="flex items-center gap-2 bg-red-600 text-white px-3 py-2 rounded shadow" onClick={logoutUser}>
                        Logout
                    </button>
                )}
            </div>
        </header>
    );
}
