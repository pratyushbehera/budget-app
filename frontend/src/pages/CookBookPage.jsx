import { useState } from "react";
import { ThemeToggle } from "../features/dashboard/components/ThemeToggle";
import { Modal } from "../shared/components/Modal";
import { DateRangePicker } from "../shared/components/DateRangePicker";

import Button from "@/shared/system/button";
import { PlusIcon } from "lucide-react";

export default function CookBookPage() {
  const [modal, setModal] = useState(true);
  return (
    <div>
      Cookbook
      <ThemeToggle />
      <h1>Button</h1>
      <div className="flex gap-4">
        <Button>Save changes</Button>
        <Button onClick={() => setModal(true)}>Modal</Button>
        <Button onClick={() => setModal(true)} isLoading={true}>
          Modal
        </Button>
        <Button variant="secondary" size="sm">
          Cancel
        </Button>
        <Button variant="tertiary">Delete transaction</Button>
        <Button variant="tertiary" leftIcon={<PlusIcon className="w-6 h-6" />}>
          Add category
        </Button>
        <Button variant="ghost" fullWidth>
          View all
        </Button>
      </div>
      <DateRangePicker />
      {modal && (
        <Modal
          title="Test modal"
          maxWidth="max-w-xl"
          onClose={() => setModal(false)}
        >
          Content here
        </Modal>
      )}
    </div>
  );
}
