"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Identified {
  id: string;
}

function Row({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex items-center gap-3 px-3 sm:px-4 py-3 bg-white dark:bg-[#1f2937] ${
        isDragging ? "relative z-10 shadow-lg opacity-90" : ""
      }`}
    >
      <button
        type="button"
        className="shrink-0 text-gray-300 hover:text-[#5651e5] dark:text-gray-600 dark:hover:text-[#5651e5] cursor-grab active:cursor-grabbing transition-colors touch-none px-1"
        aria-label="Reorder"
        {...attributes}
        {...listeners}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
          <circle cx="5" cy="3" r="1.5" fill="currentColor" />
          <circle cx="11" cy="3" r="1.5" fill="currentColor" />
          <circle cx="5" cy="8" r="1.5" fill="currentColor" />
          <circle cx="11" cy="8" r="1.5" fill="currentColor" />
          <circle cx="5" cy="13" r="1.5" fill="currentColor" />
          <circle cx="11" cy="13" r="1.5" fill="currentColor" />
        </svg>
      </button>
      {children}
    </li>
  );
}

/**
 * Drag-to-reorder list shared by the skills and social link managers. Neither
 * is paginated, so it always sends the whole list of ids and lets the endpoint
 * rewrite the sequence.
 *
 * `dndId` must be stable: without it dnd-kit builds aria-describedby from a
 * module-level counter that differs between server and client, which shows up
 * as a hydration error on every reload.
 */
export default function SortableList<T extends Identified>({
  items,
  endpoint,
  dndId,
  onSaved,
  renderItem,
}: {
  items: T[];
  endpoint: string;
  dndId: string;
  onSaved: () => void;
  renderItem: (item: T) => React.ReactNode;
}) {
  const [rows, setRows] = useState(items);

  useEffect(() => {
    setRows(items);
  }, [items]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = rows.findIndex((r) => r.id === active.id);
    const newIndex = rows.findIndex((r) => r.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const previous = rows;
    const reordered = arrayMove(rows, oldIndex, newIndex);
    setRows(reordered);

    try {
      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: reordered.map((r) => r.id) }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error);
      }
      onSaved();
    } catch (err) {
      setRows(previous);
      toast.error(
        err instanceof Error && err.message
          ? err.message
          : "Could not save the new order."
      );
      onSaved();
    }
  };

  return (
    <DndContext
      id={dndId}
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={rows.map((r) => r.id)}
        strategy={verticalListSortingStrategy}
      >
        <ul className="divide-y divide-gray-100 dark:divide-gray-700">
          {rows.map((row) => (
            <Row key={row.id} id={row.id}>
              {renderItem(row)}
            </Row>
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}
