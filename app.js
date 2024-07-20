const express = require('express');
const axios = require('axios');
const sequelize = require('./utils/database');
const User = require('./models/user');

const app = express();
const port = 3000;

// Sync the database and initialize the table
async function initializeDatabase() {
    try {
        await sequelize.sync({ force: true });
        console.log('Database synchronized');

        // Download and store data
        // Fetch data from the API
        const datasetUrl = 'https://jsonplaceholder.typicode.com/users';
        const response = await axios.get(datasetUrl);
        const data = response.data;

        // Map the data to match the model structure
        const users = data.map(user => ({
            name: user.name,
            username: user.username,
            email: user.email,
            address_street: user.address.street,
            address_suite: user.address.suite,
            address_city: user.address.city,
            address_zipcode: user.address.zipcode,
            address_geo_lat: user.address.geo.lat,
            address_geo_lng: user.address.geo.lng,
            phone: user.phone,
            website: user.website,
            company_name: user.company.name,
            company_catchPhrase: user.company.catchPhrase,
            company_bs: user.company.bs,
        }));

        // Bulk insert the data into the database
        await User.bulkCreate(users);
        console.log('Data successfully inserted');
    
    } catch (error) {
        console.error('Error initializing database:', error);
    }
}

initializeDatabase();

// Route to get paginated data
app.get('/users', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    try {
        const { count, rows } = await User.findAndCountAll({
            limit,
            offset,
        });

        const totalPages = Math.ceil(count / limit);

        res.json({
            page,
            limit,
            totalPages,
            totalItems: count,
            users: rows,
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Server error');
    }
});

// Route to create a new user
app.post('/users', async (req, res) => {
    const { name, username, email, address, phone, website, company } = req.body;
    try {
        const newUser = await User.create({
            name,
            username,
            email,
            address_street: address.street,
            address_suite: address.suite,
            address_city: address.city,
            address_zipcode: address.zipcode,
            address_geo_lat: address.geo.lat,
            address_geo_lng: address.geo.lng,
            phone,
            website,
            company_name: company.name,
            company_catchPhrase: company.catchPhrase,
            company_bs: company.bs,
        });
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send('Server error');
    }
});

// Route to delete a user by ID
app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findOne({ where: { id } });
        if (user) {
            await user.destroy();
            res.status(204).send();
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send('Server error');
    }
});

// Route to update a user by ID
app.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { name, username, email, address, phone, website, company } = req.body;
    try {
        const user = await User.findOne({ where: { id } });
        if (user) {
            user.name = name;
            user.username = username;
            user.email = email;
            user.address_street = address.street;
            user.address_suite = address.suite;
            user.address_city = address.city;
            user.address_zipcode = address.zipcode;
            user.address_geo_lat = address.geo.lat;
            user.address_geo_lng = address.geo.lng;
            user.phone = phone;
            user.website = website;
            user.company_name = company.name;
            user.company_catchPhrase = company.catchPhrase;
            user.company_bs = company.bs;

            await user.save();
            res.status(200).json(user);
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send('Server error');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
