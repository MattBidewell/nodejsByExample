// The <b>os</b> module provides operating system-related utility methods and properties for getting system information, CPU details, memory stats, and more.


import os from 'node:os';


// <b>Platform Information</b>
// Get basic information about the operating system.
console.log('Platform:', os.platform());   // 'darwin', 'linux', 'win32'
console.log('OS Type:', os.type());        // 'Darwin', 'Linux', 'Windows_NT'
console.log('Architecture:', os.arch());   // 'x64', 'arm64', 'arm'
console.log('Release:', os.release());     // OS version string
console.log('Version:', os.version());     // OS kernel version
console.log('Machine:', os.machine());     // Machine type (e.g., 'arm64')


// <b>System Paths</b>
// Get common system directory paths.
console.log('Home Directory:', os.homedir());   // User's home directory
console.log('Temp Directory:', os.tmpdir());    // System temp directory
console.log('Hostname:', os.hostname());        // Computer's hostname


// <b>CPU Information</b>
// Get details about the CPU cores.
const cpus = os.cpus();
console.log('CPU Count:', cpus.length);
console.log('CPU Model:', cpus[0].model);
console.log('CPU Speed:', cpus[0].speed, 'MHz');

// Detailed CPU info for each core
cpus.forEach((cpu, index) => {
  console.log(`Core ${index}:`, {
    model: cpu.model,
    speed: cpu.speed,
    times: cpu.times  // user, nice, sys, idle, irq
  });
});


// <b>Memory Information</b>
// Get system memory statistics.
const totalMem = os.totalmem();
const freeMem = os.freemem();

console.log('Total Memory:', (totalMem / 1024 / 1024 / 1024).toFixed(2), 'GB');
console.log('Free Memory:', (freeMem / 1024 / 1024 / 1024).toFixed(2), 'GB');
console.log('Used Memory:', ((totalMem - freeMem) / 1024 / 1024 / 1024).toFixed(2), 'GB');
console.log('Memory Usage:', ((1 - freeMem / totalMem) * 100).toFixed(1), '%');


// <b>System Uptime</b>
// Get system uptime in seconds.
const uptime = os.uptime();
const days = Math.floor(uptime / 86400);
const hours = Math.floor((uptime % 86400) / 3600);
const minutes = Math.floor((uptime % 3600) / 60);

console.log(`System Uptime: ${days}d ${hours}h ${minutes}m`);


// <b>User Information</b>
// Get information about the current user.
const userInfo = os.userInfo();
console.log('Username:', userInfo.username);
console.log('User Home:', userInfo.homedir);
console.log('User Shell:', userInfo.shell);
console.log('User UID:', userInfo.uid);
console.log('User GID:', userInfo.gid);


// <b>Network Interfaces</b>
// Get information about network interfaces.
const networkInterfaces = os.networkInterfaces();

for (const [name, interfaces] of Object.entries(networkInterfaces)) {
  console.log(`\nInterface: ${name}`);
  for (const iface of interfaces) {
    console.log(`  ${iface.family}: ${iface.address}`);
    console.log(`    MAC: ${iface.mac}`);
    console.log(`    Internal: ${iface.internal}`);
  }
}


// <b>Get Primary IP Address</b>
// Helper to find the primary non-internal IPv4 address.
function getPrimaryIP() {
  const interfaces = os.networkInterfaces();
  
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1';
}

console.log('Primary IP:', getPrimaryIP());


// <b>System Load Average</b>
// Get 1, 5, and 15 minute load averages (Unix only).
const loadAvg = os.loadavg();
console.log('Load Average (1m):', loadAvg[0].toFixed(2));
console.log('Load Average (5m):', loadAvg[1].toFixed(2));
console.log('Load Average (15m):', loadAvg[2].toFixed(2));


// <b>System Constants</b>
// Access OS-level constants.
console.log('Priority Constants:', {
  low: os.constants.priority.PRIORITY_LOW,
  normal: os.constants.priority.PRIORITY_NORMAL,
  high: os.constants.priority.PRIORITY_HIGH
});

// Signal constants
console.log('SIGINT:', os.constants.signals.SIGINT);
console.log('SIGTERM:', os.constants.signals.SIGTERM);

// Error constants
console.log('ENOENT:', os.constants.errno.ENOENT);
console.log('EACCES:', os.constants.errno.EACCES);


// <b>End of Line Character</b>
// Platform-specific line ending.
console.log('EOL:', JSON.stringify(os.EOL));  // '\n' on Unix, '\r\n' on Windows

// Use for cross-platform file writing
const lines = ['line 1', 'line 2', 'line 3'];
const content = lines.join(os.EOL);
console.log('Content with EOL:', content);


// <b>Dev Null Path</b>
// Path to the null device.
console.log('Dev Null:', os.devNull);  // '/dev/null' or '\\\\.\\nul'


// <b>Available Parallelism</b>
// Get recommended number of parallel operations.
console.log('Available Parallelism:', os.availableParallelism());


// <b>Practical Example: System Info Reporter</b>
// Generate a comprehensive system report.
function generateSystemReport() {
  const report = {
    timestamp: new Date().toISOString(),
    system: {
      platform: os.platform(),
      type: os.type(),
      release: os.release(),
      architecture: os.arch(),
      hostname: os.hostname()
    },
    cpu: {
      model: os.cpus()[0]?.model,
      cores: os.cpus().length,
      parallelism: os.availableParallelism()
    },
    memory: {
      total: `${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`,
      free: `${(os.freemem() / 1024 / 1024 / 1024).toFixed(2)} GB`,
      usagePercent: `${((1 - os.freemem() / os.totalmem()) * 100).toFixed(1)}%`
    },
    uptime: {
      seconds: os.uptime(),
      formatted: formatUptime(os.uptime())
    },
    user: os.userInfo().username,
    network: {
      primaryIP: getPrimaryIP()
    }
  };
  
  return report;
}

function formatUptime(seconds) {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${d}d ${h}h ${m}m`;
}

console.log('\n=== System Report ===');
console.log(JSON.stringify(generateSystemReport(), null, 2));


// <b>Practical Example: Resource Monitor</b>
// Monitor system resources over time.
function createResourceMonitor(intervalMs = 1000) {
  let running = true;
  
  const monitor = {
    start() {
      const check = () => {
        if (!running) return;
        
        const memUsage = (1 - os.freemem() / os.totalmem()) * 100;
        const loadAvg = os.loadavg()[0];
        const timestamp = new Date().toLocaleTimeString();
        
        console.log(`[${timestamp}] Memory: ${memUsage.toFixed(1)}% | Load: ${loadAvg.toFixed(2)}`);
        
        setTimeout(check, intervalMs);
      };
      check();
    },
    
    stop() {
      running = false;
    }
  };
  
  return monitor;
}

// Usage: const monitor = createResourceMonitor(2000);
// monitor.start();
// setTimeout(() => monitor.stop(), 10000);


// <b>Practical Example: Cross-Platform Checks</b>
// Handle platform-specific logic.
function getPlatformInfo() {
  const platform = os.platform();
  
  const info = {
    isWindows: platform === 'win32',
    isMac: platform === 'darwin',
    isLinux: platform === 'linux',
    pathSeparator: platform === 'win32' ? '\\' : '/',
    shellCommand: platform === 'win32' ? 'cmd.exe' : '/bin/sh',
    homeEnvVar: platform === 'win32' ? 'USERPROFILE' : 'HOME'
  };
  
  return info;
}

console.log('\n=== Platform Info ===');
console.log(getPlatformInfo());
