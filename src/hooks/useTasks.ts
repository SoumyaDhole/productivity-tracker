import { useState } from "react";

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = (task: Task) => {
    setTasks((current) => [...current, task]);
  };

  return {
    tasks,
    addTask,
  };
};

export default useTasks;
