import ForgeUI, {
  render,
  Fragment,
  Text,
  TextField,
  Form,
  Button,
  useState,
  Table,
  Head,
  Row,
  Cell,
  Strong,
  Code,
} from "@forge/ui";
import { storage } from "@forge/api";

// --- simple mock AI helper (replace with real AI call if you have API) ---
async function aiSummarize(text) {
  // Placeholder: agar real AI chahiye to yaha network call daalo
  // Example: call your backend / OpenAI or Forge AI
  // For now simple mock:
  const summary =
    text.length > 120
      ? text.slice(0, 117).trim() + "..."
      : text || "No details provided";
  return `Summary: ${summary}`;
}

// --- helper to load/save tasks in Forge storage ---
async function loadTasks() {
  const s = await storage.get("smartassist_tasks");
  return s || [];
}
async function saveTasks(tasks) {
  await storage.set("smartassist_tasks", tasks);
}

// --- Main App component ---
const App = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // load tasks on component mount
  (async () => {
    if (loading) {
      const t = await loadTasks();
      setTasks(t);
      setLoading(false);
    }
  })();

  // add new task
  async function onAdd(formData) {
    const now = Date.now();
    const newTask = {
      id: String(now),
      title: formData.title,
      details: formData.details || "",
      done: false,
      createdAt: now,
    };
    const updated = [newTask, ...tasks];
    await saveTasks(updated);
    setTasks(updated);
  }

  // toggle done
  async function onToggleDone(id) {
    const updated = tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
    await saveTasks(updated);
    setTasks(updated);
  }

  // remove task
  async function onRemove(id) {
    const updated = tasks.filter((t) => t.id !== id);
    await saveTasks(updated);
    setTasks(updated);
  }

  // generate AI summary for a task (mock)
  async function onSummarize(id) {
    const t = tasks.find((x) => x.id === id);
    if (!t) return;
    const summary = await aiSummarize(t.details || t.title);
    // put summary into details (so user can see)
    const updated = tasks.map((x) => (x.id === id ? { ...x, details: (x.details || "") + "\n\n" + summary } : x));
    await saveTasks(updated);
    setTasks(updated);
  }

  return (
    <Fragment>
      <Text><Strong>SmartAssist — Student Productivity Helper (Demo)</Strong></Text>
      <Text>Quick tasks, reminders and an AI-summarize demo (mock). Use the form below to add tasks.</Text>

      <Form
        onSubmit={async (formData) => {
          await onAdd(formData);
        }}
      >
        <TextField name="title" label="Task title (e.g. Finish math assignment)" isRequired />
        <TextField name="details" label="Details (optional)" />
        <Button text="Add task" />
      </Form>

      <Text />
      {tasks.length === 0 ? (
        <Text>No tasks yet — add one above.</Text>
      ) : (
        <Table>
          <Head>
            <Cell><Strong>Task</Strong></Cell>
            <Cell><Strong>Details</Strong></Cell>
            <Cell><Strong>Status</Strong></Cell>
            <Cell><Strong>Actions</Strong></Cell>
          </Head>
          {tasks.map((t) => (
            <Row key={t.id}>
              <Cell>
                {t.done ? <Text>✅ {t.title}</Text> : <Text>{t.title}</Text>}
              </Cell>
              <Cell>
                <Code>{t.details || "-"}</Code>
              </Cell>
              <Cell>
                <Text>{t.done ? "Done" : "Pending"}</Text>
              </Cell>
              <Cell>
                <Fragment>
                  <Button text={t.done ? "Mark Pending" : "Mark Done"} onClick={async () => await onToggleDone(t.id)} />
                  <Button text="AI Summary" onClick={async () => await onSummarize(t.id)} />
                  <Button text="Remove" onClick={async () => await onRemove(t.id)} />
                </Fragment>
              </Cell>
            </Row>
          ))}
        </Table>
      )}
    </Fragment>
  );
};

// render the app
export const run = render(<App />);

    
