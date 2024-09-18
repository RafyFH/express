const sequelize = require('./database');
// const Borrow = require('/models/Borrows');
// const Book = require('/models/Books');
// const Member = require('/models/Members');

// Verify associations
const checkAssociations = async () => {
    try {
        // Sync all models and associations
        await sequelize.sync({ force: false });
        console.log('Associations are set up correctly.');
    } catch (error) {
        console.error('Error setting up associations:', error);
    }
};

checkAssociations();