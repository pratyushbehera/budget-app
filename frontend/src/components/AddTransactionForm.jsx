import { PlusCircle } from "lucide-react";
import PropTypes from 'prop-types';

export function AddTransactionForm({ form, setForm, addTransaction, flatCategoryList }) {
    const isFormValid = form.date && form.category && Number(form.amount) > 0;

    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-semibold">Add Transaction</h2>
            <form className="mt-3 space-y-2" onSubmit={addTransaction}>
                <div className="flex gap-2">
                    <input id="transaction-date" name="date" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="flex-1 p-2 border rounded" required />
                    <select id="transaction-category" name="category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="flex-1 p-2 border rounded" required>
                        <option value="" disabled>Select Category</option>
                        {flatCategoryList.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
                <div className="flex gap-2">
                    <input id="transaction-amount" name="amount" placeholder="Amount" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} className="flex-1 p-2 border rounded" inputMode="numeric" required />
                </div>
                <div className="flex gap-2">
                    <input id="transaction-notes" name="notes" placeholder="Notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="flex-1 p-2 border rounded" />
                </div>
                <div className="flex justify-end">
                    <button type="submit" disabled={!isFormValid} className={`inline-flex items-center gap-2 px-3 py-2 rounded ${isFormValid ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-400 text-white cursor-not-allowed'}`}>
                        <PlusCircle size={16} /> Add
                    </button>
                </div>
            </form>
        </div>
    );
}

AddTransactionForm.propTypes = {
    form: PropTypes.object.isRequired,
    setForm: PropTypes.func.isRequired,
    addTransaction: PropTypes.func.isRequired,
    flatCategoryList: PropTypes.array.isRequired,
};