import { useState, useContext } from "react";
import api from "./Api";
import { AuthContext } from "../Contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
    Container,
    TextField,
    Button,
    Typography,
    Card,
    CardContent,
    CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";

export default function Register() {
    const { login } = useContext(AuthContext);
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post("/register", form);
            login(res.data.user, res.data.token);
            navigate("/tasks");
        } catch (err) {
            alert("فشل التسجيل. تحقق من البيانات المدخلة.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                    "url('https://images.unsplash.com/photo-1522204502588-9b2de4f3a89a?auto=format&fit=crop&w=1600&q=80') center/cover no-repeat",
            }}
        >
            <Container maxWidth="xs">
                <Card
                    component={motion.div}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    sx={{
                        backdropFilter: "blur(15px)",
                        backgroundColor: "rgba(255,255,255,0.25)",
                        p: 4,
                        borderRadius: 4,
                        boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                    }}
                >
                    <CardContent>
                        <Typography
                            variant="h4"
                            align="center"
                            gutterBottom
                            fontWeight="bold"
                            sx={{ color: "#1976d2" }}
                        >
                            Register
                        </Typography>

                        <form onSubmit={handleSubmit}>
                            <TextField
                                label="Name"
                                fullWidth
                                margin="normal"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                required
                            />
                            <TextField
                                label="Email"
                                type="email"
                                fullWidth
                                margin="normal"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                required
                            />
                            <TextField
                                label="Password"
                                type="password"
                                fullWidth
                                margin="normal"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                required
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                sx={{ mt: 2, py: 1 }}
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={24} /> : "Register"}
                            </Button>
                        </form>

                        <Typography
                            variant="body2"
                            align="center"
                            sx={{ mt: 2, color: "black", cursor: "pointer" }}
                            onClick={() => navigate("/login")}
                        >
                            Already have an account? Login
                        </Typography>
                    </CardContent>
                </Card>
            </Container>
        </motion.div>
    );
}
