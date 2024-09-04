import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';

function NavigationBar({ onLogout }) {  // Dodaj obsługę wylogowania przez onLogout
    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand href="/">Thinkoze Panel Admina</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/add">Dodaj produkt</Nav.Link>
                        <Nav.Link as={Link} to="/edit">Zarządzaj produktami</Nav.Link>
                    </Nav>
                    <Nav className="ms-auto">
                        <Button variant="outline-light" onClick={onLogout}>Wyloguj</Button>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavigationBar;