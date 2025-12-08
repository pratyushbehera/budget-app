import React from "react";

export function GroupSection({ groups = [], form, updateFormField, disabled }) {
  return (
    <div className="mt-6 border rounded-lg p-4 bg-gray-50 dark:bg-gray-850">
      <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-600 mb-2">
        Group (Optional)
      </h3>

      <label
        htmlFor="group"
        className="text-xs font-medium text-gray-500 dark:text-gray-400"
      >
        Group
      </label>
      <select
        id="group"
        name="groupId"
        value={form.groupId}
        onChange={updateFormField}
        disabled={disabled}
        className="input-field mt-1"
      >
        <option value="">No Group</option>
        {groups.map((g) => (
          <option key={g._id || g.id} value={g._id || g.id}>
            {g.name}
          </option>
        ))}
      </select>

      {disabled && (
        <p className="text-xs text-primary-600 mt-1">
          This transaction belongs to the selected group and cannot be changed.
        </p>
      )}
    </div>
  );
}
