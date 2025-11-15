import ForgeUI, { render, Fragment, Text, Task, Button, useState, useProductContext } from '@forge/ui';

const App = () => {
  const [tasks, setTasks] = useState([
    { text: "Complete assignment", done: false },
    { text: "Prepare notes", done: false }
  ]);

  const toggleTask = (index) => {
    const updated = [...tasks];
    updated[index].done = !updated[index].done;
    setTasks(updated);
  };

  return (
    <Fragment>
      <Text>👋 Welcome to SmartAssist — Your AI Student Helper</Text>
      <Text>Below are your tasks:</Text>

      {tasks.map((task, index) => (
        <Task
          key={index}
          text={`${task.done ? "✔️" : "⬜"} ${task.text}`}
          onClick={() => toggleTask(index)}
        />
      ))}

      <Button text="Add new task (AI coming soon)" />
    </Fragment>
  );
};

export const run = render(<App />);
