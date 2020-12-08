const http = require('http');
const onefakerest = require('onefakerest');
const faker = require('faker');

function createFakeRestServer () {
  faker.seed(1);

  return new Promise(resolve => {
    const handler = onefakerest({
      pagination: {
        limit: 5
      },

      data: {
        users: {
          records: 2,
          generator: function () {
            return {
              id: faker.random.uuid(),
              firstName: faker.name.firstName(),
              lastName: faker.name.lastName(),
              noteCount: 0
            };
          }
        },

        notes: {
          records: 10,
          generator: function ({ users }) {
            const user = faker.random.arrayElement(users);
            user.noteCount = user.noteCount + 1;

            return {
              id: faker.random.uuid(),
              userId: user.id,
              subject: faker.lorem.sentence(5),
              content: faker.lorem.paragraphs(2)
            };
          }
        }
      }
    });

    const server = http.createServer(handler);
    server.on('listening', function () {
      resolve({
        baseUrl: `http://localhost:${server.address().port}`,
        server,
        close: () => server.close()
      });
    });
    server.listen();
  });
}

module.exports = createFakeRestServer;
