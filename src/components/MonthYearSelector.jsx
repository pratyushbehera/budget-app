import React from "react";

const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
];

const years = () => {
    const currentYear = new Date().getFullYear();
    const yearsArray = [];
    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
        yearsArray.push(i.toString());
    }
    return yearsArray;
};

export function MonthYearSelector({ currentMonth, setCurrentMonth, currentYear, setCurrentYear }) {
    return (
        <div className="flex gap-2">
            <select value={currentMonth} onChange={e => setCurrentMonth(e.target.value)} className="p-2 border rounded">
                {months.map(month => (
                    <option key={month.value} value={month.value}>
                        {month.label}
                    </option>
                ))}
            </select>
            <select value={currentYear} onChange={e => setCurrentYear(e.target.value)} className="p-2 border rounded">
                {years().map(year => (
                    <option key={year} value={year}>
                        {year}
                    </option>
                ))}
            </select>
        </div>
    );
}
