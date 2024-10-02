import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container } from 'react-bootstrap';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

function AddProduct() {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState(''); // Stan dla opisu technicznego
    const [image, setImage] = useState(null); // Stan dla obrazu
    const [pdf, setPdf] = useState(null); // Stan dla pliku PDF
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Walidacja formularza - wymagane pola
        if (!name || !price ) {
            setSnackbarMessage('Nazwa, cena i krótki opis są wymagane!');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return; // Zatrzymanie przesyłania formularza, jeśli walidacja nie przeszła
        }

        // Tworzenie FormData dla przesyłania pliku i danych
        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('description', description); // Dodanie opisu technicznego
        formData.append('image', image); // Dodanie pliku obrazu
        formData.append('pdf', pdf); // Dodanie pliku PDF

        // Wysłanie danych do serwera
        try {
            await axios.post('https://thinkoze-admin.onrender.com/add-product', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Zresetuj pola formularza
            setName('');
            setPrice('');
            setDescription('');
            setImage(null);
            setPdf(null);

            setSnackbarMessage('Produkt dodany!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true); // Otwórz Snackbar po dodaniu produktu
        } catch (error) {
            console.error('Error adding product', error);
            setSnackbarMessage('Błąd podczas dodawania produktu');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    return (
        <Container className="mt-4">
            <h2>Dodaj produkt</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Nazwa</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Podaj nazwę produktu"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Cena</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Podaj cenę produktu"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Krótki opis</Form.Label> {/* Nowe pole dla opisu technicznego */}
                    <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Podaj krótki opis"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Zdjęcie</Form.Label> {/* Pole dla zdjęcia */}
                    <Form.Control
                        type="file"
                        onChange={(e) => setImage(e.target.files[0])} // Obsługa pliku obrazu
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Karta techniczna</Form.Label> {/* Pole dla pliku PDF */}
                    <Form.Control
                        type="file"
                        onChange={(e) => setPdf(e.target.files[0])} // Obsługa pliku PDF
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Dodaj produkt
                </Button>
            </Form>

            {/* Snackbar */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
}

export default AddProduct;