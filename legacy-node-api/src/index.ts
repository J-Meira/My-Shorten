import { Knex } from './database/knex';
import { server } from './server';

const port = process.env.PORT || '3000';

if (process.env.IS_DEBUG) {
  server.listen(port, () => console.log(`Running on port: ${port}`));
} else {
  console.log('Started migrations');
  Knex.migrate
    .latest()
    .then(() => {
      server.listen(port, () => console.log(`Running on port: ${port}`));
    })
    .catch(console.log);
}
