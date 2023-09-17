// runs a local server and serves the public folder

import Fastify from 'fastify';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const fastify = Fastify({
  logger: true
});

const publicPath = path.join(__dirname, '../public');

fastify.register(import('@fastify/static'), {
  root: publicPath,
})

try {
  await fastify.listen({ port: 3000 })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}


