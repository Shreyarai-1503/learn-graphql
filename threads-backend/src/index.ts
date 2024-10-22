import express from 'express';

const app = express();
const PORT = Number(process.env.PORT) || 8000;


app.get('/', (req, res) => {
    res.json({message: 'Server is up and running'});
})


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})
