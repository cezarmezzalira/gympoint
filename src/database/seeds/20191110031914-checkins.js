const { subDays } = require('date-fns');

module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert(
      'checkins',
      [
        {
          student_id: 2,
          created_at: subDays(new Date(), 7),
          updated_at: subDays(new Date(), 7),
        },
        {
          student_id: 2,
          created_at: subDays(new Date(), 6),
          updated_at: subDays(new Date(), 6),
        },
        {
          student_id: 2,
          created_at: subDays(new Date(), 5),
          updated_at: subDays(new Date(), 5),
        },
        {
          student_id: 2,
          created_at: subDays(new Date(), 5),
          updated_at: subDays(new Date(), 5),
        },
        {
          student_id: 2,
          created_at: subDays(new Date(), 4),
          updated_at: subDays(new Date(), 4),
        },
        {
          student_id: 2,
          created_at: subDays(new Date(), 3),
          updated_at: subDays(new Date(), 3),
        },
        {
          student_id: 2,
          created_at: subDays(new Date(), 2),
          updated_at: subDays(new Date(), 2),
        },
      ],
      {}
    );
  },

  down: () => {},
};
