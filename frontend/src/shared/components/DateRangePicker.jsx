import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { useDispatch, useSelector } from "react-redux";
import { setDateRange } from "../../app/store/appSlice";
import { CalendarDays, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import "./DateRangePicker.css";

export function DateRangePicker() {
  const dispatch = useDispatch();
  const { dateMode, selectedMonth, startDate, endDate } = useSelector(
    (state) => state.app
  );

  const [isOpen, setIsOpen] = useState(false);
  const [tempMode, setTempMode] = useState(dateMode);

  // Internal state for pickers
  const [internalDate, setInternalDate] = useState(new Date());
  const [internalRange, setInternalRange] = useState([null, null]);

  useEffect(() => {
    if (dateMode === "month") {
      const [year, month] = selectedMonth.split("-");
      setInternalDate(new Date(year, month - 1));
    } else if (dateMode === "year") {
      setInternalDate(new Date(selectedMonth, 0));
    } else if (dateMode === "range" && startDate && endDate) {
      setInternalRange([new Date(startDate), new Date(endDate)]);
    }
    setTempMode(dateMode);
  }, [dateMode, selectedMonth, startDate, endDate, isOpen]);

  const handleApply = () => {
    if (tempMode === "month") {
      const monthStr = format(internalDate, "yyyy-MM");
      dispatch(setDateRange({ mode: "month", month: monthStr, startDate: null, endDate: null }));
    } else if (tempMode === "year") {
      const yearStr = format(internalDate, "yyyy");
      const start = `${yearStr}-01-01`;
      const end = `${yearStr}-12-31`;
      dispatch(setDateRange({ mode: "year", month: yearStr, startDate: start, endDate: end }));
    } else if (tempMode === "range") {
      const [start, end] = internalRange;
      if (start && end) {
        dispatch(
          setDateRange({
            mode: "range",
            startDate: format(start, "yyyy-MM-dd"),
            endDate: format(end, "yyyy-MM-dd"),
            month: `${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`,
          })
        );
      }
    }
    setIsOpen(false);
  };

  const getDisplayText = () => {
    if (dateMode === "month") {
      return format(new Date(selectedMonth + "-01"), "MMMM yyyy");
    } else if (dateMode === "year") {
      return `Year ${selectedMonth}`;
    } else if (dateMode === "range" && startDate && endDate) {
      return `${format(new Date(startDate), "MMM d, yy")} - ${format(new Date(endDate), "MMM d, yy")}`;
    }
    return "Select Date";
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-6 py-3 bg-gray-100 dark:bg-gray-950 rounded-full font-bold text-gray-700 dark:text-white border-2 border-white-100/20 hover:border-primary-500 transition-all shadow-sm group"
      >
        <CalendarDays className="w-5 h-5 text-primary-500 group-hover:scale-110 transition-transform" />
        <span className="whitespace-nowrap">{getDisplayText()}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/5 backdrop-blur-[2px]"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute left-0 lg:left-auto lg:right-0  mt-3 z-40 bg-white dark:bg-gray-950 rounded-[2rem] shadow-2xl border border-gray-100 dark:border-gray-800 p-6 min-w-[350px]"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-black text-gray-900 dark:text-white">Select Period</h3>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Mode Switcher */}
              <div className="flex p-1 bg-gray-100 dark:bg-gray-950 rounded-2xl mb-6">
                {["month", "year", "range"].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setTempMode(mode)}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${tempMode === mode
                      ? "bg-white dark:bg-gray-950/20 text-primary-500 shadow-sm"
                      : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                      }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>

              <div className="flex justify-center date-picker-container">
                {tempMode === "month" && (
                  <DatePicker
                    selected={internalDate}
                    onChange={(date) => setInternalDate(date)}
                    showMonthYearPicker
                    inline
                    calendarClassName="premium-calendar"
                  />
                )}
                {tempMode === "year" && (
                  <DatePicker
                    selected={internalDate}
                    onChange={(date) => setInternalDate(date)}
                    showYearPicker
                    dateFormat="yyyy"
                    inline
                    calendarClassName="premium-calendar"
                  />
                )}
                {tempMode === "range" && (
                  <DatePicker
                    selectsRange={true}
                    startDate={internalRange[0]}
                    endDate={internalRange[1]}
                    onChange={(update) => setInternalRange(update)}
                    inline
                    calendarClassName="premium-calendar"
                  />
                )}
              </div>

              <div className="mt-8">
                <button
                  onClick={handleApply}
                  disabled={tempMode === "range" && (!internalRange[0] || !internalRange[1])}
                  className="w-full btn-primary h-12 rounded-2xl shadow-lg shadow-primary-500/20 disabled:opacity-50 disabled:shadow-none"
                >
                  Apply Selection
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
