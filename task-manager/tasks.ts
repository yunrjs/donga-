import * as fs from "fs";
import * as path from "path";

export interface Task {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
}

const DATA_FILE = path.join(__dirname, "tasks.json");

/** Load all tasks from the JSON data file. Returns an empty list if none exist. */
export function loadTasks(): Task[] {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Task[]) : [];
  } catch {
    return [];
  }
}

/** Persist the given tasks to the JSON data file. */
export function saveTasks(tasks: Task[]): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2) + "\n", "utf-8");
}

/** Add a new task with the given title and return it. */
export function addTask(title: string): Task {
  const tasks = loadTasks();
  const nextId = tasks.reduce((max, t) => Math.max(max, t.id), 0) + 1;
  const task: Task = {
    id: nextId,
    title,
    completed: false,
    createdAt: new Date().toISOString(),
  };
  tasks.push(task);
  saveTasks(tasks);
  return task;
}

/** Mark the task with the given id as completed. Returns true if found. */
export function completeTask(id: number): boolean {
  const tasks = loadTasks();
  const task = tasks.find((t) => t.id === id);
  if (!task) return false;
  task.completed = true;
  saveTasks(tasks);
  return true;
}

/** Remove the task with the given id. Returns true if a task was removed. */
export function deleteTask(id: number): boolean {
  const tasks = loadTasks();
  const next = tasks.filter((t) => t.id !== id);
  if (next.length === tasks.length) return false;
  saveTasks(next);
  return true;
}
