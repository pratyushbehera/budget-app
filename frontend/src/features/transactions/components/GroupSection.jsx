import Select from "@/shared/system/FormField/Select";

export function GroupSection({ groups = [], form, updateFormField, disabled }) {
  return (
    <div className="mt-6 border rounded-lg p-4 bg-gray-50 dark:bg-gray-200">
      <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-600 mb-2">
        Group (Optional)
      </h3>

      <Select
        options={groups.map((grp) => ({
          label: grp.name,
          value: grp._id || g.id,
        }))}
        placeholder="No group"
        name="groupId"
        value={form.groupId}
        onChange={updateFormField}
        disabled={disabled}
      />

      {disabled && (
        <p className="text-xs text-primary-600 mt-1">
          This transaction belongs to the selected group and cannot be changed.
        </p>
      )}
    </div>
  );
}
