import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Container, Table, Modal } from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

function DeleteProduct() {
    const [products, setProducts] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            const response = await axios.get('https://thinkoze-admin.onrender.com/products');
            setProducts(response.data);
        };
        fetchProducts();
    }, []);

    const handleDeleteClick = (product) => {
        setSelectedProduct(product);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        await axios.delete(`https://thinkoze-admin.onrender.com/delete-product/${selectedProduct._id}`);
        setShowDeleteModal(false);
        setSnackbarOpen(true); // Otwórz Snackbar po usunięciu
    
        // Zamiast pełnego odświeżenia, pobieramy listę produktów ponownie
        const response = await axios.get('https://thinkoze-admin.onrender.com/products');
        setProducts(response.data);
    };    

    return (
        <Container className="mt-4">
            <h2>Usuń produkty</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nazwa</th>
                        <th>Cena</th>
                        <th>Akcje</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product._id}>
                            <td>{product._id}</td>
                            <td>{product.name}</td>
                            <td>{product.price}</td>
                            <td>
                                <Button variant="outline-danger" onClick={() => handleDeleteClick(product)}>
                                    <Trash />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

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
                <Alert onClose={() => setSnackbarOpen(false)} severity="success">
                    Produkt usunięty!
                </Alert>
            </Snackbar>
        </Container>
    );
}

export default DeleteProduct;