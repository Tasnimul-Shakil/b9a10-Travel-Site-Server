const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
    origin: ['http://localhost:5173'],
    credentials: true,
    optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xehxmtv.mongodb.net`;

async function run() {
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

    try {
        const workCollection = client.db('spotDB').collection('spot');

        app.get('/spot', async (req, res) => {
            const allWork = await workCollection.find({}).toArray();
            res.json(allWork);
        });

        app.get('/spot/:id', async (req, res) => {
            const id = req.params.id;
            if (!ObjectId.isValid(id)) {
                return res.status(400).json({ error: 'Invalid ID format' });
            }
            const query = { _id: new ObjectId(id) };
            const result = await workCollection.findOne(query);
            if (!result) {
                return res.status(404).json({ error: 'Work not found' });
            }
            res.json(result);
        });

        app.post('/spot', async (req, res) => {
            const newWork = req.body;
            const result = await workCollection.insertOne(newWork);
            res.json(result);
        });

        app.put('/spot/:id', async (req, res) => {
            const id = req.params.id;
            if (!ObjectId.isValid(id)) {
                return res.status(400).json({ error: 'Invalid ID format' });
            }
            const updatedWork = req.body;
            const query = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const result = await workCollection.replaceOne(query, updatedWork, options);
            res.json(result);
        });

        app.delete('/spot/:id', async (req, res) => {
            const id = req.params.id;
            if (!ObjectId.isValid(id)) {
                return res.status(400).json({ error: 'Invalid ID format' });
            }
            const query = { _id: new ObjectId(id) };
            const result = await workCollection.deleteOne(query);
            res.json(result);
        });

        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    } finally {
        // Ensure that the client will close when you finish/error
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Work making service is running...');
});

app.listen(port, () => {
    console.log(`Work listening on port: ${port}`);
});
