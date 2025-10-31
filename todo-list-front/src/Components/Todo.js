import {
    Container,
    Typography,
    TextField,
    Button,
    Card,
    CardContent,
    Grid,
    IconButton,
    Checkbox,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import UndoIcon from "@mui/icons-material/Undo";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect, useState } from "react";
import api from "./Api";
import { motion, AnimatePresence } from "framer-motion";

export default function Todo() {
    const [tasks, setTasks] = useState([]);
    const [form, setForm] = useState({
        title: "",
        description: "",
        due_date: "",
    });
    const [editingTask, setEditingTask] = useState(null);

    // Fetch tasks
    async function fetchtasks() {
        const res = await api.get("/tasks");
        setTasks(res.data);
    }

    // Add new task
    async function addTask(e) {
        e.preventDefault();
        await api.post("/tasks", { ...form, isCompleted: false });
        setForm({ title: "", description: "", due_date: "" });
        await fetchtasks();
    }

    // Delete task
    async function deleteTask(id) {
        await api.delete(`/tasks/${id}`);
        await fetchtasks();
    }

    // Toggle completion 
    async function toggleTask(task) {
        await api.put(`/tasks/${task.id}`, {
            ...task,
            isCompleted: !task.isCompleted,
        });
        await fetchtasks();
    }

    // Start editing
    function startEditing(task) {
        setEditingTask({ ...task });
    }

    // Handle edit form changes
    function handleEditChange(e) {
        const { name, value, type, checked } = e.target;
        setEditingTask({
            ...editingTask,
            [name]: type === "checkbox" ? checked : value,
        });
    }

    // Save edited task
    async function saveTask() {
        await api.put(`/tasks/${editingTask.id}`, editingTask);
        setEditingTask(null);
        await fetchtasks();
    }

    useEffect(() => {
        fetchtasks();
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            style={{
                minHeight: "100vh",
                padding: "50px 20px",
                background:
                    "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1470&q=80') center/cover no-repeat",
            }}
        >
            <Container
                maxWidth="md"
                sx={{
                    backdropFilter: "blur(15px)",
                    backgroundColor: "rgba(255,255,255,0.25)",
                    borderRadius: 4,
                    p: 4,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                }}
            >
                <Typography variant="h3" align="center" gutterBottom fontWeight="bold">
                    Task Management
                </Typography>

                {/* Add Task Form */}
                <Card sx={{ mb: 4, p: 3, borderRadius: 4, boxShadow: 5 }}>
                    <form onSubmit={addTask}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    label="Title"
                                    fullWidth
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    label="Description"
                                    fullWidth
                                    value={form.description}
                                    onChange={(e) =>
                                        setForm({ ...form, description: e.target.value })
                                    }
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <TextField
                                    label="Due Date"
                                    type="date"
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    value={form.due_date}
                                    onChange={(e) =>
                                        setForm({ ...form, due_date: e.target.value })
                                    }
                                />
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                sm={1}
                                sx={{ display: "flex", alignItems: "center" }}
                            >
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                >
                                    Add
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Card>

                {/* Edit Task Form */}
                {editingTask && (
                    <Card
                        sx={{
                            mb: 4,
                            p: 3,
                            borderRadius: 4,
                            boxShadow: 5,
                            backgroundColor: "rgba(250,250,250,0.85)",
                        }}
                    >
                        <Typography variant="h6" mb={2}>
                            Edit Task
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    name="title"
                                    label="Title"
                                    fullWidth
                                    value={editingTask.title}
                                    onChange={handleEditChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    name="description"
                                    label="Description"
                                    fullWidth
                                    value={editingTask.description}
                                    onChange={handleEditChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <TextField
                                    name="due_date"
                                    label="Due Date"
                                    type="date"
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    value={editingTask.due_date}
                                    onChange={handleEditChange}
                                />
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                sm={1}
                                sx={{ display: "flex", alignItems: "center" }}
                            >
                                <Checkbox
                                    name="isCompleted"
                                    checked={editingTask.isCompleted}
                                    onChange={handleEditChange}
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={saveTask}
                                    sx={{ ml: 1 }}
                                >
                                    Save
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={() => setEditingTask(null)}
                                    sx={{ ml: 1 }}
                                >
                                    Cancel
                                </Button>
                            </Grid>
                        </Grid>
                    </Card>
                )}

                {/* Tasks List */}
                <Grid container spacing={2}>
                    <AnimatePresence>
                        {tasks.map((task) => (
                            <Grid item xs={12} key={task.id}>
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Card
                                        sx={{
                                            borderLeft: task.isCompleted
                                                ? "6px solid green"
                                                : "6px solid #1976d2",
                                            borderRadius: 4,
                                            boxShadow: 3,
                                            backgroundColor: task.isCompleted
                                                ? "rgba(240,253,244,0.8)"
                                                : "rgba(255,255,255,0.8)",
                                            transition: "all 0.3s ease",
                                            "&:hover": { scale: 1.02, boxShadow: 6 },
                                        }}
                                    >
                                        <CardContent
                                            sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                            }}
                                        >
                                            <div>
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        textDecoration: task.isCompleted
                                                            ? "line-through"
                                                            : "none",
                                                    }}
                                                >
                                                    {task.title}
                                                </Typography>
                                                <Typography color="text.secondary">
                                                    {task.description || "No description"}
                                                </Typography>
                                                {task.due_date && (
                                                    <Typography variant="body2" color="text.secondary">
                                                        Due: {task.due_date}
                                                    </Typography>
                                                )}
                                            </div>

                                            <div>
                                                <IconButton onClick={() => toggleTask(task)}>
                                                    {task.isCompleted ? (
                                                        <UndoIcon />
                                                    ) : (
                                                        <CheckCircleIcon />
                                                    )}
                                                </IconButton>
                                                <IconButton onClick={() => startEditing(task)}>
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton
                                                    onClick={() => deleteTask(task.id)}
                                                    color="error"
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </Grid>
                        ))}
                    </AnimatePresence>
                </Grid>
            </Container>
        </motion.div>
    );
}
