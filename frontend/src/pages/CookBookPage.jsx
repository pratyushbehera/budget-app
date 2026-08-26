import { useState } from "react";
import { ThemeToggle } from "../features/dashboard/components/ThemeToggle";
import { DateRangePicker } from "../shared/components/DateRangePicker";

import Button from "@/shared/system/Button";
import Modal from "@/shared/system/Modal";
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
        <Modal size="xl" onClose={() => setModal(false)}>
          <Modal.Header>Test modal</Modal.Header>
          <Modal.Body>Content here</Modal.Body>
          <Modal.Footer>Action</Modal.Footer>
        </Modal>
      )}
    </div>
  );
}
