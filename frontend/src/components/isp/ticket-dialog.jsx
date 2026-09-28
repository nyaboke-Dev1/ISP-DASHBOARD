import { useEffect, useState } from "react";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createTicket } from "@/lib/isp";
import { useActorName, useWorkspaceAction } from "@/hooks/use-workspace";

const schema = z.object({
  customer_id: z.number().int().positive("Choose a customer"),
  subject: z
    .string()
    .trim()
    .min(4, "Subject must be at least 4 characters")
    .max(140),
  description: z.string().trim().max(1000),
  priority: z.enum(["high", "medium", "low"]),
  assignee: z
    .string()
    .trim()
    .min(2, "Assignee is required")
    .max(80),
});

export function TicketDialog({
  open,
  onOpenChange,
  customers,
}) {
  const actor = useActorName();

  const [customerId, setCustomerId] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [assignee, setAssignee] = useState(actor);
  const [errors, setErrors] = useState({});

  const create = useWorkspaceAction(
    (input) => createTicket(input, actor),
    "Ticket created"
  );

  useEffect(() => {
    if (!open) return;

    setCustomerId("");
    setSubject("");
    setDescription("");
    setPriority("medium");
    setAssignee(actor);
    setErrors({});
  }, [open, actor]);

  const submit = (e) => {
    e.preventDefault();

    const parsed = schema.safeParse({
      customer_id: Number(customerId),
      subject,
      description,
      priority,
      assignee,
    });

    if (!parsed.success) {
      const next = {};

      for (const issue of parsed.error.issues) {
        const field = issue.path[0];

        if (field && !next[field]) {
          next[field] = issue.message;
        }
      }

      setErrors(next);
      return;
    }

    create.mutate(parsed.data, {
      onSuccess: () => onOpenChange(false),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New support ticket</DialogTitle>

          <DialogDescription>
            Log a customer issue so the team can pick it up and track progress.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="ticket-customer">Customer</Label>

            <Select value={customerId} onValueChange={setCustomerId}>
              <SelectTrigger id="ticket-customer">
                <SelectValue placeholder="Select customer" />
              </SelectTrigger>

              <SelectContent>
                {customers.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {errors.customer_id ? (
              <FieldError message={errors.customer_id} />
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ticket-subject">Subject</Label>

            <Input
              id="ticket-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Intermittent connection in the evening"
              aria-invalid={!!errors.subject}
            />

            {errors.subject ? (
              <FieldError message={errors.subject} />
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ticket-description">Details</Label>

            <Textarea
              id="ticket-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What did the customer report?"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="ticket-priority">Priority</Label>

              <Select
                value={priority}
                onValueChange={setPriority}
              >
                <SelectTrigger id="ticket-priority">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ticket-assignee">Assignee</Label>

              <Input
                id="ticket-assignee"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                aria-invalid={!!errors.assignee}
              />

              {errors.assignee ? (
                <FieldError message={errors.assignee} />
              ) : null}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={create.isPending}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={create.isPending}>
              {create.isPending ? "Creating…" : "Create ticket"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function FieldError({ message }) {
  return (
    <p role="alert" className="text-xs font-medium text-danger">
      {message}
    </p>
  );
}
