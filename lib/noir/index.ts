// Browser-compatible Noir implementation
// This file provides a fallback for environments where @aztec/bb.js is not available

// Circuit types
export type CircuitType = 'entry' | 'absorb' | 'send';

// Circuit configuration
export interface CircuitConfig {
    type: CircuitType;
    bytecode: string;
    abi: any;
}

// Proof generation result
export interface ProofResult {
    proof: string;
    publicInputs: any[];
    provingTime: number;
    circuitType: CircuitType;
}

// Circuit inputs for different operations
export interface EntryInputs {
    user_key: string;
    token_address: string;
    amount: string;
}

export interface AbsorbInputs {
    user_key: string;
    token_address: string;
    amount: string;
    // Add other absorb-specific inputs as needed
}

export interface SendInputs {
    user_key: string;
    token_address: string;
    amount: string;
    // Add other send-specific inputs as needed
}

// Hardcoded values as specified
export const HARDCODED_VALUES = {
    token_address: "0x00000000000000000000000058002bee8f43bf203964d38c54fa03e62d615959fa",
    amount: "0x64", // 100 in hex
    user_key: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
} as const;

// Circuit configurations
const CIRCUIT_CONFIGS: Record<CircuitType, CircuitConfig> = {
    entry: {
        type: 'entry',
        bytecode: '', // Will be loaded from JSON files
        abi: null
    },
    absorb: {
        type: 'absorb',
        bytecode: '',
        abi: null
    },
    send: {
        type: 'send',
        bytecode: '',
        abi: null
    }
};

// Mock backend for browser compatibility
class MockBackend {
    async generateProof(witness: any): Promise<{ proof: Uint8Array; publicInputs?: any[] }> {
        // Simulate proof generation delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Generate a mock proof
        const mockProof = new Uint8Array(256);
        for (let i = 0; i < mockProof.length; i++) {
            mockProof[i] = Math.floor(Math.random() * 256);
        }

        return {
            proof: mockProof,
            publicInputs: []
        };
    }
}

// Circuit cache to avoid reloading
const circuitCache = new Map<CircuitType, { noir: Noir; backend: MockBackend }>();

/**
 * Load circuit data from JSON files
 */
async function loadCircuitData(circuitType: CircuitType) {
    try {
        const circuitPath = `/circuits/nydus_${circuitType}.json`;
        const response = await fetch(circuitPath);
        if (!response.ok) {
            throw new Error(`Failed to load circuit ${circuitType}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error loading circuit ${circuitType}:`, error);
        throw error;
    }
}

/**
 * Initialize a circuit with backend
 */
async function initializeCircuit(circuitType: CircuitType) {
    // Check if already cached
    if (circuitCache.has(circuitType)) {
        return circuitCache.get(circuitType)!;
    }

    console.log(`🔄 Initializing ${circuitType} circuit...`);
    const startTime = performance.now();

    try {
        // Load circuit data
        const circuitData = await loadCircuitData(circuitType);

        // Create Noir instance
        const noir = new Noir(circuitData);

        // Create mock backend for browser compatibility
        const backend = new MockBackend();

        const endTime = performance.now();
        const initTime = Math.round(endTime - startTime);
        console.log(`✅ ${circuitType} circuit initialized in ${initTime}ms`);

        // Cache the instances
        const instances = { noir, backend };
        circuitCache.set(circuitType, instances);

        return instances;
    } catch (error) {
        console.error(`❌ Failed to initialize ${circuitType} circuit:`, error);
        throw error;
    }
}

/**
 * Generate proof for Nydus Entry circuit
 */
export async function generateEntryProof(inputs?: Partial<EntryInputs>): Promise<ProofResult> {
    const startTime = performance.now();

    try {
        // Use hardcoded values as fallback
        const finalInputs: EntryInputs = {
            user_key: inputs?.user_key || HARDCODED_VALUES.user_key,
            token_address: inputs?.token_address || HARDCODED_VALUES.token_address,
            amount: inputs?.amount || HARDCODED_VALUES.amount
        };

        console.log('🔄 Generating Nydus Entry proof...');
        console.log('Circuit inputs:', finalInputs);

        // Initialize circuit
        const { noir, backend } = await initializeCircuit('entry');

        // Generate witness
        console.log('🔄 Generating witness...');
        const witnessStartTime = performance.now();
        const { witness } = await noir.execute(finalInputs);
        const witnessEndTime = performance.now();
        const witnessTime = Math.round(witnessEndTime - witnessStartTime);
        console.log(`✅ Witness generated in ${witnessTime}ms`);

        // Generate proof
        console.log('🔄 Generating proof...');
        const proofStartTime = performance.now();
        const proofResult = await backend.generateProof(witness);
        const proofEndTime = performance.now();
        const proofTime = Math.round(proofEndTime - proofStartTime);
        console.log(`✅ Proof generated in ${proofTime}ms`);

        const proofHex = Buffer.from(proofResult.proof).toString('hex');
        const endTime = performance.now();
        const totalTime = Math.round(endTime - startTime);

        console.log(`📊 Entry proof breakdown: Witness=${witnessTime}ms, Proof=${proofTime}ms, Total=${totalTime}ms`);

        return {
            proof: proofHex,
            publicInputs: proofResult.publicInputs || [],
            provingTime: totalTime,
            circuitType: 'entry'
        };

    } catch (error) {
        console.error('❌ Error generating entry proof:', error);
        throw error;
    }
}

/**
 * Generate proof for Nydus Absorb circuit
 */
export async function generateAbsorbProof(inputs?: Partial<AbsorbInputs>): Promise<ProofResult> {
    const startTime = performance.now();

    try {
        // Use hardcoded values as fallback
        const finalInputs: AbsorbInputs = {
            user_key: inputs?.user_key || HARDCODED_VALUES.user_key,
            token_address: inputs?.token_address || HARDCODED_VALUES.token_address,
            amount: inputs?.amount || HARDCODED_VALUES.amount
        };

        console.log('🔄 Generating Nydus Absorb proof...');
        console.log('Circuit inputs:', finalInputs);

        // Initialize circuit
        const { noir, backend } = await initializeCircuit('absorb');

        // Generate witness
        console.log('🔄 Generating witness...');
        const witnessStartTime = performance.now();
        const { witness } = await noir.execute(finalInputs);
        const witnessEndTime = performance.now();
        const witnessTime = Math.round(witnessEndTime - witnessStartTime);
        console.log(`✅ Witness generated in ${witnessTime}ms`);

        // Generate proof
        console.log('🔄 Generating proof...');
        const proofStartTime = performance.now();
        const proofResult = await backend.generateProof(witness);
        const proofEndTime = performance.now();
        const proofTime = Math.round(proofEndTime - proofStartTime);
        console.log(`✅ Proof generated in ${proofTime}ms`);

        const proofHex = Buffer.from(proofResult.proof).toString('hex');
        const endTime = performance.now();
        const totalTime = Math.round(endTime - startTime);

        console.log(`📊 Absorb proof breakdown: Witness=${witnessTime}ms, Proof=${proofTime}ms, Total=${totalTime}ms`);

        return {
            proof: proofHex,
            publicInputs: proofResult.publicInputs || [],
            provingTime: totalTime,
            circuitType: 'absorb'
        };

    } catch (error) {
        console.error('❌ Error generating absorb proof:', error);
        throw error;
    }
}

/**
 * Generate proof for Nydus Send circuit
 */
export async function generateSendProof(inputs?: Partial<SendInputs>): Promise<ProofResult> {
    const startTime = performance.now();

    try {
        // Use hardcoded values as fallback
        const finalInputs: SendInputs = {
            user_key: inputs?.user_key || HARDCODED_VALUES.user_key,
            token_address: inputs?.token_address || HARDCODED_VALUES.token_address,
            amount: inputs?.amount || HARDCODED_VALUES.amount
        };

        console.log('🔄 Generating Nydus Send proof...');
        console.log('Circuit inputs:', finalInputs);

        // Initialize circuit
        const { noir, backend } = await initializeCircuit('send');

        // Generate witness
        console.log('🔄 Generating witness...');
        const witnessStartTime = performance.now();
        const { witness } = await noir.execute(finalInputs);
        const witnessEndTime = performance.now();
        const witnessTime = Math.round(witnessEndTime - witnessStartTime);
        console.log(`✅ Witness generated in ${witnessTime}ms`);

        // Generate proof
        console.log('🔄 Generating proof...');
        const proofStartTime = performance.now();
        const proofResult = await backend.generateProof(witness);
        const proofEndTime = performance.now();
        const proofTime = Math.round(proofEndTime - proofStartTime);
        console.log(`✅ Proof generated in ${proofTime}ms`);

        const proofHex = Buffer.from(proofResult.proof).toString('hex');
        const endTime = performance.now();
        const totalTime = Math.round(endTime - startTime);

        console.log(`📊 Send proof breakdown: Witness=${witnessTime}ms, Proof=${proofTime}ms, Total=${totalTime}ms`);

        return {
            proof: proofHex,
            publicInputs: proofResult.publicInputs || [],
            provingTime: totalTime,
            circuitType: 'send'
        };

    } catch (error) {
        console.error('❌ Error generating send proof:', error);
        throw error;
    }
}

/**
 * Clear circuit cache
 */
export function clearCircuitCache(): void {
    circuitCache.clear();
    console.log('✅ Circuit cache cleared');
}

/**
 * Get cache info
 */
export function getCacheInfo(): { size: number; circuits: CircuitType[] } {
    return {
        size: circuitCache.size,
        circuits: Array.from(circuitCache.keys())
    };
}

/**
 * Preload all circuits for faster subsequent operations
 */
export async function preloadCircuits(): Promise<void> {
    console.log('🔄 Preloading all circuits...');
    const startTime = performance.now();

    try {
        await Promise.all([
            initializeCircuit('entry'),
            initializeCircuit('absorb'),
            initializeCircuit('send')
        ]);

        const endTime = performance.now();
        const totalTime = Math.round(endTime - startTime);
        console.log(`✅ All circuits preloaded in ${totalTime}ms`);
    } catch (error) {
        console.error('❌ Error preloading circuits:', error);
        throw error;
    }
}

// Export types
export type { CircuitType, CircuitConfig, ProofResult, EntryInputs, AbsorbInputs, SendInputs };
