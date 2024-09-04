const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const mongoUrl = process.env.MONGODB_URL;


const app = express();
app.use(cors());
app.use(express.json());

// Konfiguracja połączenia z MongoDB
mongoose.connect('mongodb+srv://karolsobon:H81XqLCvlFosIOK5@cluster0.violt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Konfiguracja multer dla przesyłania plików (obrazów i PDF)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Sprawdzamy typ pliku, aby umieścić obraz w odpowiednim folderze
        if (file.mimetype === 'application/pdf') {
            cb(null, 'upload/pdfs/'); // Folder dla plików PDF
        } else {
            cb(null, 'upload/images/'); // Folder dla obrazów
        }
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Nadanie nazwy pliku z czasem
    },
});

const upload = multer({ storage: storage });

// Schemat dla produktu, z obsługą opisu, zdjęcia i pliku PDF
const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String,  // Pole dla opisu technicznego
    imageUrl: String,     // Pole dla ścieżki do obrazu
    pdfUrl: String        // Nowe pole dla ścieżki do pliku PDF
});

const Product = mongoose.model('Product', productSchema);

// Endpoint do dodawania produktu z obsługą plików (obraz i PDF)
app.post('/add-product', upload.fields([{ name: 'image' }, { name: 'pdf' }]), async (req, res) => {
    const { name, price, description } = req.body;
    
    // Ścieżka do obrazu, jeśli przesłano
    const imageUrl = req.files['image'] ? `/upload/images/${req.files['image'][0].filename}` : '';
    // Ścieżka do pliku PDF, jeśli przesłano
    const pdfUrl = req.files['pdf'] ? `/upload/pdfs/${req.files['pdf'][0].filename}` : '';

    const newProduct = new Product({
        name,
        price,
        description,
        imageUrl,
        pdfUrl
    });

    await newProduct.save();
    res.json({ message: 'Product added!' });
});

// Endpoint do pobierania wszystkich produktów
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find(); // Pobiera wszystkie produkty
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Unable to fetch products' });
    }
});

// Endpoint do edycji produktu
app.put('/edit-product/:id', upload.fields([{ name: 'image' }, { name: 'pdf' }]), async (req, res) => {
    const { id } = req.params;
    const { name, price, description } = req.body;
    
    // Zaktualizuj ścieżkę do obrazu, jeśli przesłano nowy plik
    const imageUrl = req.files['image'] ? `/upload/images/${req.files['image'][0].filename}` : undefined;
    // Zaktualizuj ścieżkę do pliku PDF, jeśli przesłano nowy plik
    const pdfUrl = req.files['pdf'] ? `/upload/pdfs/${req.files['pdf'][0].filename}` : undefined;

    try {
        const updatedData = { name, price, description };
        if (imageUrl) updatedData.imageUrl = imageUrl; // Zaktualizuj obraz, jeśli jest nowy
        if (pdfUrl) updatedData.pdfUrl = pdfUrl;       // Zaktualizuj PDF, jeśli jest nowy

        const product = await Product.findByIdAndUpdate(id, updatedData, { new: true });
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ message: 'Product updated!' });
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
});

// Endpoint do usuwania produktu
app.delete('/delete-product/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ message: 'Product deleted!' });
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
});

// Endpoint do serwowania plików z folderu uploads
app.use('/upload', express.static('upload'));

// Uruchom serwer
app.listen(5001, () => {
    console.log('Server is running on port 5001');
});