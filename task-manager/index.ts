#!/usr/bin/env ts-node
import { loadTasks, addTask, completeTask, deleteTask, Task } from "./tasks";

function printUsage(): void {
  console.log(`Task Manager - usage:
  list                 List all tasks
  add <title>          Add a new task
  done <id>            Mark a task as completed
  delete <id>          Delete a task
  help                 Show this help message`);
}

function printTask(task: Task): void {
  const mark = task.completed ? "[x]" : "[ ]";
  console.log(`${mark} #${task.id} ${task.title}`);
}

function listTasks(): void {
  const tasks = loadTasks();
  if (tasks.length === 0) {
    console.log("No tasks yet. Add one with: add <title>");
    return;
  }
  tasks.forEach(printTask);
}

function main(): void {
  const [command, ...args] = process.argv.slice(2);

  switch (command) {
    case "list":
      listTasks();
      break;
    case "add": {
      const title = args.join(" ").trim();
      if (!title) {
        console.error("Error: a task title is required.");
        process.exit(1);
      }
      const task = addTask(title);
      console.log(`Added task #${task.id}: ${task.title}`);
      break;
    }
    case "done": {
      const id = Number(args[0]);
      if (!Number.isInteger(id)) {
        console.error("Error: a valid task id is required.");
        process.exit(1);
      }
      console.log(completeTask(id) ? `Completed task #${id}` : `No task found with id #${id}`);
      break;
    }
    case "delete": {
      const id = Number(args[0]);
      if (!Number.isInteger(id)) {
        console.error("Error: a valid task id is required.");
        process.exit(1);
      }
      console.log(deleteTask(id) ? `Deleted task #${id}` : `No task found with id #${id}`);
      break;
    }
    case "help":
    case undefined:
      printUsage();
      break;
    default:
      console.error(`Unknown command: ${command}`);
      printUsage();
      process.exit(1);
  }
}

main();
