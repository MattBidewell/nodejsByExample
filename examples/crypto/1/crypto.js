// The <b>Crypto</b> module provides cryptographic functionality including hashing, encryption, and random number generation.


// Import crypto functions
import { 
  randomBytes, randomUUID, randomInt,
  createHash, createHmac,
  createCipheriv, createDecipheriv,
  scrypt, scryptSync,
  generateKeyPairSync,
  createSign, createVerify,
  timingSafeEqual
} from 'node:crypto';


// <b>Random Data Generation</b>
// Generate cryptographically secure random data.

// Random bytes
const bytes = randomBytes(16);
console.log('Random bytes:', bytes.toString('hex'));

// Random UUID (v4)
const uuid = randomUUID();
console.log('UUID:', uuid); // e.g., '550e8400-e29b-41d4-a716-446655440000'

// Random integer in range
const num = randomInt(1, 100); // 1 to 99 (exclusive max)
console.log('Random int:', num);


// <b>Hashing</b>
// Create one-way hashes of data.

// SHA-256 (most common)
const sha256 = createHash('sha256')
  .update('Hello World')
  .digest('hex');
console.log('SHA-256:', sha256);

// MD5 (not secure, but useful for checksums)
const md5 = createHash('md5')
  .update('Hello World')
  .digest('hex');
console.log('MD5:', md5);

// Update multiple times
const multiHash = createHash('sha256');
multiHash.update('Hello ');
multiHash.update('World');
console.log('Multi-update:', multiHash.digest('hex'));

// Different output formats
const hash = createHash('sha256').update('test');
console.log('Hex:', hash.copy().digest('hex'));
console.log('Base64:', hash.copy().digest('base64'));
console.log('Buffer:', hash.digest());


// <b>Hashing Files</b>
// Hash file contents efficiently using streams.
import { createReadStream } from 'node:fs';

async function hashFile(filepath) {
  const hash = createHash('sha256');
  const stream = createReadStream(filepath);
  
  for await (const chunk of stream) {
    hash.update(chunk);
  }
  
  return hash.digest('hex');
}

// hashFile('./example.txt').then(console.log);


// <b>HMAC (Hash-based Message Authentication Code)</b>
// Create authenticated hashes using a secret key.
const secret = 'my-secret-key';
const hmac = createHmac('sha256', secret)
  .update('Hello World')
  .digest('hex');
console.log('HMAC:', hmac);

// Verify HMAC
function verifyHmac(message, receivedHmac, secret) {
  const expected = createHmac('sha256', secret)
    .update(message)
    .digest();
  const received = Buffer.from(receivedHmac, 'hex');
  
  // Use timing-safe comparison to prevent timing attacks
  return timingSafeEqual(expected, received);
}


// <b>Password Hashing with scrypt</b>
// Securely hash passwords (slow by design).
async function hashPassword(password) {
  const salt = randomBytes(16);
  
  return new Promise((resolve, reject) => {
    scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(salt.toString('hex') + ':' + derivedKey.toString('hex'));
    });
  });
}

async function verifyPassword(password, stored) {
  const [saltHex, hashHex] = stored.split(':');
  const salt = Buffer.from(saltHex, 'hex');
  const storedHash = Buffer.from(hashHex, 'hex');
  
  return new Promise((resolve, reject) => {
    scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(timingSafeEqual(storedHash, derivedKey));
    });
  });
}

// Usage
hashPassword('myPassword123').then(async (hashed) => {
  console.log('Hashed password:', hashed.substring(0, 50) + '...');
  const valid = await verifyPassword('myPassword123', hashed);
  console.log('Password valid:', valid);
});


// <b>Symmetric Encryption (AES)</b>
// Encrypt and decrypt data with a shared key.
function encrypt(text, key) {
  const iv = randomBytes(16); // Initialization vector
  const cipher = createCipheriv('aes-256-cbc', key, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return iv.toString('hex') + ':' + encrypted;
}

function decrypt(encryptedData, key) {
  const [ivHex, encrypted] = encryptedData.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = createDecipheriv('aes-256-cbc', key, iv);
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

// Key must be 32 bytes for AES-256
const encryptionKey = randomBytes(32);
const encrypted = encrypt('Secret message', encryptionKey);
const decrypted = decrypt(encrypted, encryptionKey);

console.log('Encrypted:', encrypted);
console.log('Decrypted:', decrypted);


// <b>Asymmetric Encryption (RSA)</b>
// Generate key pairs and sign/verify data.

// Generate RSA key pair
const { publicKey, privateKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
});

console.log('Public key generated:', publicKey.substring(0, 50) + '...');


// <b>Digital Signatures</b>
// Sign data with private key, verify with public key.
function signData(data, privateKey) {
  const sign = createSign('SHA256');
  sign.update(data);
  return sign.sign(privateKey, 'hex');
}

function verifySignature(data, signature, publicKey) {
  const verify = createVerify('SHA256');
  verify.update(data);
  return verify.verify(publicKey, signature, 'hex');
}

const message = 'Important message';
const signature = signData(message, privateKey);
const isValid = verifySignature(message, signature, publicKey);

console.log('Signature:', signature.substring(0, 50) + '...');
console.log('Signature valid:', isValid);


// <b>Timing-Safe Comparison</b>
// Prevent timing attacks when comparing secrets.
function safeCompare(a, b) {
  // Convert to buffers of same length
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  
  if (bufA.length !== bufB.length) {
    return false;
  }
  
  return timingSafeEqual(bufA, bufB);
}


// <b>Practical Example: Token Generation</b>
// Generate secure tokens for auth, CSRF, etc.
function generateToken(length = 32) {
  return randomBytes(length).toString('base64url');
}

function generateApiKey() {
  const prefix = 'sk_live_';
  const key = randomBytes(24).toString('base64url');
  return prefix + key;
}

console.log('Token:', generateToken());
console.log('API Key:', generateApiKey());


// <b>Practical Example: Secure Session ID</b>
// Generate collision-resistant session identifiers.
function generateSessionId() {
  const timestamp = Date.now().toString(36);
  const random = randomBytes(16).toString('base64url');
  return `${timestamp}_${random}`;
}

console.log('Session ID:', generateSessionId());
