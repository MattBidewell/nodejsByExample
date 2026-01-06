// Development server with live reload
// Watches for file changes, rebuilds, and notifies browser via SSE

import Fastify from 'fastify';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { watch } from 'chokidar';
import { buildSite } from './generate.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const fastify = Fastify({
  logger: true
});

const publicPath = path.join(__dirname, '../public');
const rootPath = path.join(__dirname, '..');

// Track connected SSE clients
const clients = new Set();

// Live reload script to inject into HTML pages
const liveReloadScript = `
<script>
(function() {
  const evtSource = new EventSource('/livereload');
  evtSource.onmessage = function(event) {
    if (event.data === 'reload') {
      console.log('[LiveReload] Reloading...');
      location.reload();
    }
  };
  evtSource.onerror = function() {
    console.log('[LiveReload] Connection lost, retrying...');
  };
})();
</script>
</body>`;

// SSE endpoint for live reload
fastify.get('/livereload', (request, reply) => {
  reply.raw.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });

  // Send initial connection message
  reply.raw.write('data: connected\n\n');

  // Add client to set
  clients.add(reply.raw);

  // Remove client on disconnect
  request.raw.on('close', () => {
    clients.delete(reply.raw);
  });
});

// Notify all clients to reload
function notifyClients() {
  for (const client of clients) {
    client.write('data: reload\n\n');
  }
}

// Register static file serving with HTML injection for live reload
fastify.register(import('@fastify/static'), {
  root: publicPath,
  extensions: ['html'],
  decorateReply: false
});

// Hook to inject live reload script into HTML responses
fastify.addHook('onSend', (request, reply, payload, done) => {
  const contentType = reply.getHeader('content-type');
  
  if (contentType && contentType.includes('text/html') && payload) {
    // Convert payload to string if it's a stream or buffer
    if (typeof payload === 'string') {
      const injected = payload.replace('</body>', liveReloadScript);
      done(null, injected);
    } else if (Buffer.isBuffer(payload)) {
      const html = payload.toString();
      const injected = html.replace('</body>', liveReloadScript);
      done(null, injected);
    } else {
      // For streams, we need to collect the data first
      let data = '';
      payload.on('data', chunk => data += chunk);
      payload.on('end', () => {
        const injected = data.replace('</body>', liveReloadScript);
        done(null, injected);
      });
      payload.on('error', err => done(err));
      return;
    }
  } else {
    done(null, payload);
  }
});

// Debounce rebuild to avoid multiple rapid rebuilds
let rebuildTimeout = null;
let isRebuilding = false;

function scheduleRebuild(changedPath) {
  if (rebuildTimeout) {
    clearTimeout(rebuildTimeout);
  }
  
  rebuildTimeout = setTimeout(async () => {
    if (isRebuilding) return;
    
    isRebuilding = true;
    console.log(`\n[LiveReload] Change detected: ${changedPath}`);
    console.log('[LiveReload] Rebuilding...');
    
    try {
      const startTime = Date.now();
      buildSite();
      const duration = Date.now() - startTime;
      console.log(`[LiveReload] Build completed in ${duration}ms`);
      
      // Small delay to ensure files are written
      setTimeout(() => {
        notifyClients();
        console.log(`[LiveReload] Notified ${clients.size} client(s)`);
      }, 100);
    } catch (err) {
      console.error('[LiveReload] Build failed:', err.message);
    } finally {
      isRebuilding = false;
    }
  }, 200); // 200ms debounce
}

// Set up file watcher
function setupWatcher() {
  const watchPaths = [
    path.join(rootPath, 'examples'),
    path.join(rootPath, 'templates'),
    path.join(rootPath, 'styles.css')
  ];
  
  const watcher = watch(watchPaths, {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true,
    ignoreInitial: true
  });
  
  watcher
    .on('change', scheduleRebuild)
    .on('add', scheduleRebuild)
    .on('unlink', scheduleRebuild);
  
  console.log('[LiveReload] Watching for changes in:');
  watchPaths.forEach(p => console.log(`  - ${path.relative(rootPath, p)}`));
  
  return watcher;
}

// Initial build
console.log('[LiveReload] Running initial build...');
try {
  buildSite();
  console.log('[LiveReload] Initial build complete');
} catch (err) {
  console.error('[LiveReload] Initial build failed:', err.message);
  process.exit(1);
}

// Start server and watcher
try {
  await fastify.listen({ port: 3000 });
  console.log(`\n[LiveReload] Server running at http://localhost:3000`);
  setupWatcher();
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
