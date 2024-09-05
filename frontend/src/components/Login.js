import React, { useState } from 'react';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import './Login.css'; // Plik CSS do stylizacji tła

const Login = ({ onLogin }) => {
    const [password, setPassword] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const correctPassword = 'mojeHaslo'; // Ustal hasło

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === correctPassword) {
            setSnackbarMessage('Zalogowano pomyślnie!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            setTimeout(onLogin, 1500); // Wywołaj funkcję logowania po zamknięciu Snackbara
        } else {
            setSnackbarMessage('Niepoprawne hasło, spróbuj ponownie.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    return (
        <div className="login-background">
            <Container>
                <Row className="justify-content-center">
                    <Col md={6} lg={4}>
                        <div className="login-box">
                            <h2>Podaj hasło</h2>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Control
                                        type="password"
                                        placeholder="Wprowadź hasło"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="p-2"
                                    />
                                </Form.Group>
                                <Button variant="primary" type="submit">
                                    Zaloguj się
                                </Button>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </Container>

            {/* Snackbar */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default Login;