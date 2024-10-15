let wasmModule;
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

export async function initWasm() {
  if (typeof window === 'undefined') {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    // Node.js environment
    const { default: init, ...bindings } = await import('../wasm/wallet_bindings.js');
    const fs = await import('fs');
    const path = await import('path');
    
    const wasmPath = path.join(__dirname, '../wasm/wallet_bindings_bg.wasm');
    const wasmBuffer = fs.readFileSync(wasmPath);
    
    await init(wasmBuffer);
    wasmModule = bindings;
  } else {
    // Browser environment
    const { default: init, ...bindings } = await import('../wasm/wallet_bindings.js');
    await init();
    wasmModule = bindings;
  }
}

export function getWasmModule() {
  if (!wasmModule) {
    throw new Error('WASM module not initialized. Call initWasm() first.');
  }
  return wasmModule;
}

