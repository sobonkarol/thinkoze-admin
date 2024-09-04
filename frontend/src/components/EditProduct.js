import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Container, Table, Form, Modal } from 'react-bootstrap';
import { PencilSquare, Trash } from 'react-bootstrap-icons';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

function ManageProducts() {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [pdf, setPdf] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    useEffect(() => {
        const fetchProducts = async () => {
            const response = await axios.get('https://thinkoze-admin.onrender.com/products');
            setProducts(response.data);
        };
        fetchProducts();
    }, []);

    const handleEditClick = (product) => {
        setSelectedProduct(product);
        setName(product.name);
        setPrice(product.price);
        setDescription(product.description);
        setImage(null);  // Reset image, will only update if user uploads a new one
        setPdf(null);    // Reset pdf, will only update if user uploads a new one
        setShowEditModal(true);
    };

    const handleDeleteClick = (product) => {
        setSelectedProduct(product);
        setShowDeleteModal(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('description', description);

        // If new image or PDF has been selected, append them to formData
        if (image) {
            formData.append('image', image);
        }
        if (pdf) {
            formData.append('pdf', pdf);
        }

        await axios.put(`https://thinkoze-admin.onrender.com/edit-product/${selectedProduct._id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        setShowEditModal(false);
        setSnackbarMessage('Produkt zaktualizowany!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true); // Otwórz Snackbar po edycji

        // Fetch updated list of products
        const response = await axios.get('https://thinkoze-admin.onrender.com/products');
        setProducts(response.data);
    };

    const handleDeleteConfirm = async () => {
        await axios.delete(`https://thinkoze-admin.onrender.com/delete-product/${selectedProduct._id}`);
        setShowDeleteModal(false);
        setSnackbarMessage('Produkt usunięty!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true); // Otwórz Snackbar po usunięciu

        // Fetch updated list of products
        const response = await axios.get('https://thinkoze-admin.onrender.com/products');
        setProducts(response.data);
    };

    return (
        <Container className="mt-4">
            <h2>Zarządzaj produktami</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Nazwa</th>
                        <th>Cena</th>
                        <th>Krótki opis</th>
                        <th>Zdjęcie</th>
                        <th>Karta techniczna</th>
                        <th>Akcje</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product._id}>
                            <td>{product.name}</td>
                            <td>{product.price}</td>
                            <td>{product.description}</td>
                            <td>
                                {product.imageUrl ? (
                                    <a href={`https://thinkoze-admin.onrender.com${product.imageUrl}`} target="_blank" rel="noopener noreferrer">
                                        Zobacz zdjęcie
                                    </a>
                                ) : (
                                    'Brak zdjęcia'
                                )}
                            </td>
                            <td>
                                {product.pdfUrl ? (
                                    <a href={`https://thinkoze-admin.onrender.com${product.pdfUrl}`} target="_blank" rel="noopener noreferrer">
                                        Zobacz kartę techniczną
                                    </a>
                                ) : (
                                    'Brak karty technicznej'
                                )}
                            </td>
                            <td>
                                <Button variant="outline-primary" className="me-2" onClick={() => handleEditClick(product)}>
                                    <PencilSquare />
                                </Button>
                                <Button variant="outline-danger" onClick={() => handleDeleteClick(product)}>
                                    <Trash />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Modal do edycji produktu */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edytuj produkt</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleEditSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nazwa produktu</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Wprowadź nazwę produktu"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Cena produktu</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Wprowadź cenę produktu"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Krótki opis</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Wprowadź opis produktu"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Zdjęcie</Form.Label>
                            <Form.Control
                                type="file"
                                onChange={(e) => setImage(e.target.files[0])} // Obsługa zmiany zdjęcia
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Karta techniczna (PDF)</Form.Label>
                            <Form.Control
                                type="file"
                                onChange={(e) => setPdf(e.target.files[0])} // Obsługa zmiany PDF
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Zapisz zmiany
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Modal do potwierdzenia usunięcia */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Potwierdź usunięcie</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Czy na pewno chcesz usunąć produkt: {selectedProduct?.name}?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Anuluj
                    </Button>
                    <Button variant="danger" onClick={handleDeleteConfirm}>
                        Usuń
                    </Button>
                </Modal.Footer>
            </Modal>

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

export default ManageProducts;