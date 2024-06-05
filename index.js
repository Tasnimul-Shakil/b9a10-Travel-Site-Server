const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
    origin: ['https://b9a10-tourism-website.web.app'],
    credentials: true,
    optionSuccessStatus: 200,
};
// DB_USER=coffeeMaster
// DB_PASS=QvOPQCfOoQv9sDQO

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
        const tourCollection = client.db('spotDB').collection('spot');
        const userCollection = client.db('spotDB').collection('user');

        app.get('/spot', async (req, res) => {
            const allWork = await tourCollection.find({}).toArray();
            res.json(allWork);
        });

        app.get('/spot/:id', async (req, res) => {
            const id = req.params.id;
            if (!ObjectId.isValid(id)) {
                return res.status(400).json({ error: 'Invalid ID format' });
            }
            const query = { _id: new ObjectId(id) };
            const result = await tourCollection.findOne(query);
            if (!result) {
                return res.status(404).json({ error: 'Work not found' });
            }
            res.json(result);
        });

        app.post('/spot', async (req, res) => {
            const newWork = req.body;
            console.log('your new work:',newWork)
            const result = await tourCollection.insertOne(newWork);
            res.json(result);
        });

        app.get('/profile/:email', async (req, res) => {
            const userEmail = req.params.email;
            try {
              const userCards = await collection.find({ user_email: userEmail }).toArray();
              res.json(userCards);
            } catch (error) {
              res.status(500).send('Error retrieving data');
            }
          });
          
        
        

        app.put('/spot/:id', async (req, res) => {
            const id = req.params.id;
            if (!ObjectId.isValid(id)) {
                return res.status(400).json({ error: 'Invalid ID format' });
            }
            const updatedWork = req.body;
            const query = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const result = await tourCollection.replaceOne(query, updatedWork, options);
            res.json(result);
        });

        app.delete('/spot/:id', async (req, res) => {
            const id = req.params.id;
            if (!ObjectId.isValid(id)) {
                return res.status(400).json({ error: 'Invalid ID format' });
            }
            const query = { _id: new ObjectId(id) };
            const result = await tourCollection.deleteOne(query);
            res.json(result);
        });
        
        app.get('/user', async (req, res) => {
            const allUser = await userCollection.find({}).toArray();
            res.json(allUser);
        });

        app.post('/user', async (req, res) => {
            const newUser = req.body;
            console.log(newUser)
            const result = await userCollection.insertOne(newUser);
            res.json(result); 
        })

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
