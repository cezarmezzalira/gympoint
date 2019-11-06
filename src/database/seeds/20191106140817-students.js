module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert(
      'students',
      [
        {
          name: 'Cezar Augusto Mezzalira',
          email: 'cezar.mezzalira@gmail.com',
          age: 29,
          weight: 99,
          height: 1.81,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Caroline Domingos Mezzalira',
          email: 'domingos.caroline@gmail.com',
          age: 27,
          weight: 63,
          height: 1.71,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Rafael Henrique Mezzalira',
          email: 'c4rafael@gmail.com',
          age: 26,
          weight: 90,
          height: 1.84,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: () => {},
};
