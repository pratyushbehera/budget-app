import { useEffect, useMemo, useState, useCallback } from "react";
import { DEFAULT_CATEGORIES } from "./utils/constants";
import { uid } from "./utils/helpers";
import { SummaryCards } from "./components/SummaryCards";
import { AddTransactionForm } from "./components/AddTransactionForm";
import { TransactionsTable } from "./components/TransactionsTable";
import { SummaryTable } from "./components/SummaryTable";
import { NeedsWantsSavingsChart } from "./components/NeedsWantsSavingsChart";
import { MonthlySpendTrendChart } from "./components/MonthlySpendTrendChart";
import { DeleteConfirmationModal } from "./components/DeleteConfirmationModal";
import { Tabs, TabContent } from "./components/Tabs";
import { InsightsTab } from "./components/InsightsTab";
import { Header } from "./components/Header"; // Import the Header component
import { Login } from "./components/Auth/Login"; // Import Login component
import { Signup } from "./components/Auth/Signup"; // Import Signup component

export default function App() {
    const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().slice(5, 7)); // "MM"
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear().toString()); // "YYYY"
    const [activeTab, setActiveTab] = useState("dashboard"); // State to manage active tab

    // Auth states
    const [userToken, setUserToken] = useState(localStorage.getItem('userToken') || null);
    const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem('userInfo')) || null);
    const [isAuthenticated, setIsAuthenticated] = useState(!!userToken);
    const [showLoginScreen, setShowLoginScreen] = useState(true); // true for login, false for signup

    useEffect(() => {
        if (userToken && userInfo) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    }, [userToken, userInfo]);

    const loginUser = (data) => {
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('userInfo', JSON.stringify(data));
        setUserToken(data.token);
        setUserInfo(data);
        setIsAuthenticated(true);
    };

    const signupUser = (data) => {
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('userInfo', JSON.stringify(data));
        setUserToken(data.token);
        setUserInfo(data);
        setIsAuthenticated(true);
    };

    const logoutUser = () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userInfo');
        setUserToken(null);
        setUserInfo(null);
        setIsAuthenticated(false);
        setShowLoginScreen(true); // Go back to login screen after logout
    };

    // Transactions store
    const [transactions, setTransactions] = useState([]);

    // Planned amounts per category (mapping categoryName -> planned amount)
    const [plans, setPlans] = useState({});
    const [hasPendingPlanChanges, setHasPendingPlanChanges] = useState(false);

    // State for delete confirmation modal
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [transactionToDeleteId, setTransactionToDeleteId] = useState(null);

    // State for AI insights
    const [insight, setInsight] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Helper functions for offline actions
    const getOfflineActions = () => {
        try {
            const raw = localStorage.getItem('offline_actions');
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            console.error("Error reading offline actions from localStorage:", e);
            return [];
        }
    };

    const saveOfflineAction = (action) => {
        const actions = getOfflineActions();
        actions.push(action);
        localStorage.setItem('offline_actions', JSON.stringify(actions));
    };

    const syncOfflineActions = async () => {
        const actions = getOfflineActions();
        if (actions.length === 0) return;

        console.log("Attempting to sync offline actions:", actions);

        const successfulActionIndices = [];

        for (let i = 0; i < actions.length; i++) {
            const action = actions[i];
            try {
                let response;
                if (action.type === 'addTransaction') {
                    response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/transactions`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(action.payload)
                    });
                } else if (action.type === 'removeTransaction') {
                    response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/transactions/${action.payload.id}`, {
                        method: 'DELETE',
                    });
                } else if (action.type === 'updatePlans') {
                    response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/plans`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ data: action.payload })
                    });
                }

                if (response && response.ok) {
                    console.log("Offline action synced successfully:", action);
                    successfulActionIndices.push(i);
                } else {
                    console.error("Failed to sync offline action:", action, response.status, response.statusText);
                }
            } catch (error) {
                console.error("Network error during offline action sync:", action, error);
            }
        }

        // Remove successfully synced actions from the queue (in reverse order to avoid index issues)
        successfulActionIndices.reverse().forEach(index => {
            actions.splice(index, 1);
        });
        localStorage.setItem('offline_actions', JSON.stringify(actions));

        // Refetch data after sync to ensure UI is up-to-date
        if (successfulActionIndices.length > 0) {
            fetchTransactions();
            fetchPlans();
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchTransactions();
            fetchPlans(); // This will fetch all plans, then monthlyPlans useMemo will filter
        }
    }, [isAuthenticated]); // Load all plans once on initial mount and when authenticated status changes

    // Fetch data from backend
    const fetchTransactions = () => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/transactions`)
            .then(res => res.json())
            .then(data => setTransactions(data))
            .catch(err => console.error("Error fetching transactions:", err));
    };

    const fetchPlans = () => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/plans`)
            .then(res => res.json())
            .then(data => setPlans(data))
            .catch(err => console.error("Error fetching plans:", err));
    };

    // Filter transactions by current month and year
    const filteredTransactionsByMonth = useMemo(() => {
        return transactions.filter(t => t.date.startsWith(`${currentYear}-${currentMonth}`));
    }, [transactions, currentYear, currentMonth]);

    // Dummy function for now, will be implemented fully later
    const generateInsight = async () => {
        console.log("Generating insight...");
        setInsight("Generating your AI-powered insight...");
        setIsLoading(true);

        const prompt = `Generate a concise budget insight for ${currentMonth}/${currentYear}.\n\n` +
            `Planned amounts (categorized):\n` +
            `${JSON.stringify(monthlyPlans, null, 2)}\n\n` +
            `Actual spending (categorized):\n` +
            `${JSON.stringify(sumsByCategory, null, 2)}\n\n` +
            `Total Income: ${incomeTotal}\n` +
            `Total Expenses: ${expenseTotal}\n` +
            `Savings: ${savings}\n` +
            `Savings Percentage: ${savingsPct.toFixed(2)}%\n\n` +
            `Based on this data, provide an actionable insight about planning vs. spending, identify areas of overspending or underspending, and offer a recommendation. Keep it under 200 words.`;

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/generate-insight`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch insight from API.');
            }

            const aiInsight = await response.json();
            setInsight(aiInsight);

            // Save the generated insight to the database
            await fetch(`${import.meta.env.VITE_BACKEND_URL}/insights`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    year: currentYear,
                    month: currentMonth,
                    content: aiInsight,
                })
            });

        } catch (error) {
            console.error("Error generating insight:", error);
            setInsight(`Failed to generate insight: ${error.message}. Please check your API key and server logs.`);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchInsight = useCallback(async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/insights/${currentYear}/${currentMonth}`);
            if (!response.ok) {
                throw new Error('Failed to fetch insight.');
            }
            const storedInsight = await response.json();
            setInsight(storedInsight);
        } catch (error) {
            console.error("Error fetching insight:", error);
            setInsight("Failed to load previous insight.");
        }
    }, [currentYear, currentMonth]);

    useEffect(() => {
        if (activeTab === "insights") {
            fetchInsight();
        }
    }, [activeTab, currentMonth, currentYear, fetchInsight]);

    // Filtered plans for the current month and year
    const monthlyPlans = useMemo(() => {
        return plans[currentYear]?.[currentMonth] || {};
    }, [plans, currentYear, currentMonth]);

    useEffect(() => {
        localStorage.setItem("budget_plans_v1", JSON.stringify(plans));
    }, [plans]);

    // Form state
    const flatCategoryList = useMemo(() => {
        return Object.values(DEFAULT_CATEGORIES).flat();
    }, []);

    const initialFormState = { date: new Date().toISOString().slice(0, 10), category: flatCategoryList[0] || "", amount: "", notes: "" };

    const [form, setForm] = useState(initialFormState);
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("All");
    const [searchText, setSearchText] = useState("");

    // Add transaction
    function addTransaction(e) {
        e?.preventDefault();
        const amount = Number(form.amount || 0);
        if (!form.date || !form.category || !amount) return alert("Please fill date, category and amount (non-zero)");
        const t = { id: uid(), date: form.date, category: form.category, amount: amount, notes: form.notes };
        fetch(`${import.meta.env.VITE_BACKEND_URL}/transactions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(t)
        })
            .then(res => res.json())
            .then(newTransaction => {
                // Temporarily add to local state to reflect immediately
                const updatedTransactions = [...transactions, newTransaction];
                localStorage.setItem('offline_transactions', JSON.stringify(updatedTransactions));

                // Try to sync immediately if online
                if (navigator.onLine) {
                    syncOfflineActions();
                } else {
                    // Store action for offline sync
                    const offlineAction = { type: 'addTransaction', payload: t };
                    saveOfflineAction(offlineAction);
                }
                setTransactions(prev => [newTransaction, ...prev]);
                setForm(initialFormState);
            })
            .catch(err => {
                console.error("Error adding transaction:", err);
                // Store offline
                const offlineAction = { type: 'addTransaction', payload: t };
                saveOfflineAction(offlineAction);
                // Optimistically update UI
                setTransactions(prev => [t, ...prev]);
                setForm(initialFormState);
                console.log("Transaction saved offline.");
            });
    }

    function removeTransaction(id) {
        setTransactionToDeleteId(id);
        setIsDeleteModalOpen(true);
    }

    const handleConfirmDelete = (id) => {
        setIsDeleteModalOpen(false);
        setTransactionToDeleteId(null);

        fetch(`${import.meta.env.VITE_BACKEND_URL}/transactions/${id}`, {
            method: 'DELETE',
        })
            .then(res => res.json())
            .then(() => {
                setTransactions(prev => prev.filter(t => t.id !== id));
                if (navigator.onLine) {
                    syncOfflineActions();
                } else {
                    // Store action for offline sync
                    const offlineAction = { type: 'removeTransaction', payload: { id } };
                    saveOfflineAction(offlineAction);
                }
            })
            .catch(err => {
                console.error("Error deleting transaction:", err);
                const offlineAction = { type: 'removeTransaction', payload: { id } };
                saveOfflineAction(offlineAction);
                setTransactions(prev => prev.filter(t => t.id !== id));
                console.log("Transaction deletion saved offline.");
            });
    };

    // Calculate sums by category
    const sumsByCategory = useMemo(() => {
        const sums = {};
        for (const t of filteredTransactionsByMonth) {
            sums[t.category] = (sums[t.category] || 0) + Number(t.amount);
        }
        return sums;
    }, [filteredTransactionsByMonth]);

    // Income total
    const incomeTotal = useMemo(() => {
        return Object.keys(sumsByCategory).filter(k => DEFAULT_CATEGORIES.Income.includes(k)).reduce((s, k) => s + (sumsByCategory[k] || 0), 0);
    }, [sumsByCategory]);

    // Expense total (everything except Income categories)
    const expenseTotal = useMemo(() => {
        return Object.keys(sumsByCategory).filter(k => !DEFAULT_CATEGORIES.Income.includes(k)).reduce((s, k) => s + (sumsByCategory[k] || 0), 0);
    }, [sumsByCategory]);

    const savings = incomeTotal - expenseTotal;
    const savingsPct = incomeTotal ? (savings / incomeTotal) * 100 : 0;

    // Pie data: Needs (Fixed Needs) vs Wants (Variable Wants) vs Savings (Savings & Investments)
    const needsSum = Object.keys(sumsByCategory).filter(k => DEFAULT_CATEGORIES["Fixed Needs"].includes(k)).reduce((s, k) => s + (sumsByCategory[k] || 0), 0);
    const wantsSum = Object.keys(sumsByCategory).filter(k => DEFAULT_CATEGORIES["Variable Wants"].includes(k)).reduce((s, k) => s + (sumsByCategory[k] || 0), 0);
    const savingsInvestSum = Object.keys(sumsByCategory).filter(k => DEFAULT_CATEGORIES["Savings & Investments"].includes(k)).reduce((s, k) => s + (sumsByCategory[k] || 0), 0);

    const pieData = [
        { name: "Needs", value: needsSum },
        { name: "Wants", value: wantsSum },
        { name: "Savings/Investments", value: savingsInvestSum },
    ];

    // 50/30/20 Rule calculations
    const allocatedNeeds = incomeTotal * 0.50;
    const allocatedWants = incomeTotal * 0.20;
    const allocatedSavings = incomeTotal * 0.30;

    const needsBreakdown = { allocated: allocatedNeeds, actual: needsSum, remaining: allocatedNeeds - needsSum, percentage: 50 };
    const wantsBreakdown = { allocated: allocatedWants, actual: wantsSum, remaining: allocatedWants - wantsSum, percentage: 20 };
    const savingsBreakdown = { allocated: allocatedSavings, actual: savingsInvestSum, remaining: allocatedSavings - savingsInvestSum, percentage: 30 };

    // Monthly trend: group by month (YYYY-MM)
    const monthlyTrend = useMemo(() => {
        const incomeMap = {};
        const expenseMap = {};

        for (const t of transactions) { // Use all transactions for trend, not just filtered by month
            const month = t.date.slice(0, 7); // YYYY-MM
            if (DEFAULT_CATEGORIES.Income.includes(t.category)) {
                incomeMap[month] = (incomeMap[month] || 0) + Number(t.amount);
            } else {
                expenseMap[month] = (expenseMap[month] || 0) + Number(t.amount);
            }
        }

        const allMonths = Array.from(new Set([...Object.keys(incomeMap), ...Object.keys(expenseMap)])).sort();

        const trendData = allMonths.map(month => ({
            month,
            income: incomeMap[month] || 0,
            expense: expenseMap[month] || 0,
        }));
        return trendData;
    }, [transactions]);

    function updatePlanned(cat, value) {
        setPlans(prev => ({ ...prev, [currentYear]: { ...prev[currentYear], [currentMonth]: { ...prev[currentYear]?.[currentMonth], [cat]: Number(value || 0) } } }));
        setHasPendingPlanChanges(true);
    }

    const copyPreviousMonthPlans = async () => {
        const currentMonthNum = parseInt(currentMonth, 10);
        const currentYearNum = parseInt(currentYear, 10);

        let prevMonthNum = currentMonthNum - 1;
        let prevYearNum = currentYearNum;

        if (prevMonthNum === 0) {
            prevMonthNum = 12;
            prevYearNum -= 1;
        }

        const prevMonth = String(prevMonthNum).padStart(2, '0');
        const prevYear = String(prevYearNum);

        console.log(`Attempting to copy plans from ${prevMonth}-${prevYear} to ${currentMonth}-${currentYear}`);

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/plans`);
            if (!response.ok) throw new Error('Failed to fetch all plans for copy.');
            const allPlans = await response.json();

            const previousMonthPlans = allPlans[prevYear]?.[prevMonth] || {};
            console.log("Previous month's plans fetched:", previousMonthPlans);

            setPlans(prev => ({
                ...prev,
                [currentYear]: {
                    ...prev[currentYear],
                    [currentMonth]: previousMonthPlans
                }
            }));
            setHasPendingPlanChanges(true);
            console.log("Plans copied from previous month. Click Apply Changes to save.");
        } catch (error) {
            console.error("Error copying previous month's plans:", error);
            alert("Failed to copy previous month's plans. Please try again.");
        }
    };

    const applyPlans = () => {
        if (!navigator.onLine) {
            const offlineAction = { type: 'updatePlans', payload: plans };
            saveOfflineAction(offlineAction);
            setHasPendingPlanChanges(false);
            console.log("Plan update saved offline.");
            return;
        }

        fetch(`${import.meta.env.VITE_BACKEND_URL}/plans`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: plans })
        })
            .then(res => res.json())
            .then(data => {
                console.log("Plans updated successfully:", data);
                setHasPendingPlanChanges(false);
                syncOfflineActions(); // Sync any pending offline actions after a successful online plan update
            })
            .catch(err => {
                console.error("Error updating plans:", err);
                const offlineAction = { type: 'updatePlans', payload: plans };
                saveOfflineAction(offlineAction);
                setHasPendingPlanChanges(false);
                console.log("Plan update saved offline.");
            });
    };

    // Export transactions to CSV
    function exportCSV() {
        const header = ["id", "date", "category", "amount", "notes"];
        const rows = filteredTransactionsByMonth.map(t => [t.id, t.date, t.category, t.amount, `"${(t.notes || "")}"`]);
        const csv = [header.join(","), ...rows.map(r => r.join(","))].join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `transactions_${currentYear}-${currentMonth}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // Filtered transactions for table
    const filteredTransactions = filteredTransactionsByMonth.filter(t => {
        if (selectedCategoryFilter !== "All" && t.category !== selectedCategoryFilter) return false;
        if (searchText && !(`${t.notes} ${t.category}`.toLowerCase().includes(searchText.toLowerCase()))) return false;
        return true;
    });


    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans">
                <div className="max-w-6xl mx-auto space-y-6">
                    {showLoginScreen ? (
                        <Login onLoginSuccess={loginUser} onSwitchToSignup={() => setShowLoginScreen(false)} />
                    ) : (
                        <Signup onSignupSuccess={signupUser} onSwitchToLogin={() => setShowLoginScreen(true)} />
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans">
            <div className="max-w-6xl mx-auto space-y-6">
                <Header
                    currentMonth={currentMonth}
                    setCurrentMonth={setCurrentMonth}
                    currentYear={currentYear}
                    setCurrentYear={setCurrentYear}
                    exportCSV={exportCSV}
                    logoutUser={logoutUser}
                />

                <Tabs activeTab={activeTab} onTabChange={setActiveTab}>
                    <TabContent label="Dashboard" value="dashboard">
                        <div className="space-y-6">
                            <SummaryCards incomeTotal={incomeTotal} expenseTotal={expenseTotal} savings={savings} savingsPct={savingsPct} plans={monthlyPlans} />
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <NeedsWantsSavingsChart
                                    pieData={pieData}
                                    needsBreakdown={needsBreakdown}
                                    wantsBreakdown={wantsBreakdown}
                                    savingsBreakdown={savingsBreakdown}
                                />
                                <MonthlySpendTrendChart monthlyTrend={monthlyTrend} />
                            </div>
                        </div>
                    </TabContent>
                    <TabContent label="Transactions" value="transactions">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <AddTransactionForm form={form} setForm={setForm} addTransaction={addTransaction} flatCategoryList={flatCategoryList} />
                            <TransactionsTable selectedCategoryFilter={selectedCategoryFilter} setSelectedCategoryFilter={setSelectedCategoryFilter} searchText={searchText} setSearchText={setSearchText} flatCategoryList={flatCategoryList} filteredTransactions={filteredTransactions} removeTransaction={removeTransaction} />
                        </div>
                    </TabContent>
                    <TabContent label="Plans" value="plans">
                        <SummaryTable sumsByCategory={sumsByCategory} plans={monthlyPlans} updatePlanned={updatePlanned} incomeTotal={incomeTotal} expenseTotal={expenseTotal} hasPendingPlanChanges={hasPendingPlanChanges} applyPlans={applyPlans} copyPreviousMonthPlans={copyPreviousMonthPlans} />
                    </TabContent>
                    <TabContent label="Insights" value="insights">
                        <InsightsTab
                            monthlyPlans={monthlyPlans}
                            incomeTotal={incomeTotal}
                            expenseTotal={expenseTotal}
                            savings={savings}
                            savingsPct={savingsPct}
                            generateInsight={generateInsight}
                            insight={insight}
                            isLoading={isLoading}
                        />
                    </TabContent>
                </Tabs>

                <footer className="text-center text-sm text-gray-500 mt-6">Built for quick budgeting.</footer>
            </div>
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                itemId={transactionToDeleteId}
            />
        </div>
    );
}
