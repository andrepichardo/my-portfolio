"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
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
import DeleteProjectButton from "./DeleteProjectButton";

export interface ProjectRow {
  id: string;
  title: string;
  slug: string;
  technologies: string;
  imageUrl: string;
  published: boolean;
}

interface ProjectListProps {
  projects: ProjectRow[];
  /** displayOrder of the first row on this page, so ordering stays global. */
  startOrder: number;
  /** Ordering is meaningless while the list is filtered, so it is disabled. */
  sortable: boolean;
}

function Row({
  project,
  sortable,
}: {
  project: ProjectRow;
  sortable: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: project.id, disabled: !sortable });

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-3 bg-white dark:bg-[#1f2937] ${
        isDragging ? "relative z-10 shadow-lg opacity-90" : ""
      }`}
    >
      {sortable ? (
        <button
          type="button"
          className="shrink-0 text-gray-300 hover:text-[#5651e5] dark:text-gray-600 dark:hover:text-[#5651e5] cursor-grab active:cursor-grabbing transition-colors touch-none px-1"
          aria-label={`Reorder ${project.title}`}
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
      ) : (
        <span className="shrink-0 w-6.5" />
      )}

      <div className="relative w-14 h-10 sm:w-20 sm:h-14 shrink-0 rounded-md overflow-hidden bg-gray-100 dark:bg-[#111827]">
        {project.imageUrl && (
          <Image
            src={project.imageUrl}
            alt=""
            fill
            className="object-cover"
            unoptimized
          />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="font-medium text-gray-800 dark:text-white truncate">
          {project.title}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate font-mono">
          /{project.slug}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 truncate hidden sm:block mt-0.5">
          {project.technologies}
        </p>
      </div>

      <span
        className={`shrink-0 hidden xs:inline-flex px-2 py-1 rounded-full text-xs font-medium ${
          project.published
            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
            : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
        }`}
      >
        {project.published ? "Published" : "Draft"}
      </span>

      <div className="flex items-center gap-2 shrink-0">
        <Link href={`/admin/projects/${project.id}/edit`}>
          <button
            type="button"
            className="bg-[#5651e5] hover:bg-[#726ee7] text-white text-[13px] rounded-md px-3 py-1 cursor-pointer transition-colors"
          >
            Edit
          </button>
        </Link>
        <DeleteProjectButton id={project.id} />
      </div>
    </li>
  );
}

export default function ProjectList({
  projects,
  startOrder,
  sortable,
}: ProjectListProps) {
  const router = useRouter();
  const [items, setItems] = useState(projects);

  // Keep in sync when the server sends a new page, search or refreshed data.
  useEffect(() => {
    setItems(projects);
  }, [projects]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((p) => p.id === active.id);
    const newIndex = items.findIndex((p) => p.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const previous = items;
    const reordered = arrayMove(items, oldIndex, newIndex);
    setItems(reordered);

    try {
      const res = await fetch("/api/projects/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ids: reordered.map((p) => p.id),
          startOrder,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error);
      }
      router.refresh();
    } catch (err) {
      setItems(previous);
      toast.error(
        err instanceof Error && err.message
          ? err.message
          : "Could not save the new order."
      );
      router.refresh();
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((p) => p.id)}
        strategy={verticalListSortingStrategy}
      >
        <ul className="divide-y divide-gray-100 dark:divide-gray-700">
          {items.map((project) => (
            <Row key={project.id} project={project} sortable={sortable} />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}
