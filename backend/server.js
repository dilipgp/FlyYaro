require('dotenv').config();

const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Health check (optional but useful)
app.get('/', (req, res) => {
    res.send('FlyYaro Backend is running 🚀');
});

app.post('/search-flights', async (req, res) => {

    try {

        const response = await axios.post(
            'https://api.duffel.com/air/offer_requests',
            {
                data: {
                    slices: [
                        {
                            origin: req.body.origin,
                            destination: req.body.destination,
                            departure_date: req.body.departure_date
                        }
                    ],
                    passengers: [
                        {
                            type: 'adult'
                        }
                    ],
                    cabin_class: 'economy'
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.DUFFEL_TOKEN}`,
                    'Duffel-Version': 'v2',
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }
        );

        res.json(response.data);

    } catch (error) {

        // 🔥 IMPORTANT: show real error from Duffel
        console.log("\n===== DUFFEL ERROR START =====");

        if (error.response) {
            console.log("STATUS:", error.response.status);
            console.log("DATA:", JSON.stringify(error.response.data, null, 2));
        } else {
            console.log("MESSAGE:", error.message);
        }

        console.log("===== DUFFEL ERROR END =====\n");

        res.status(500).json({
            error: 'Flight search failed'
        });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});