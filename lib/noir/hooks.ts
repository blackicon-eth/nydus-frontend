import { useState, useCallback, useRef } from 'react';
import {
    generateEntryProof,
    generateAbsorbProof,
    generateSendProof,
    preloadCircuits,
    clearCircuitCache,
    getCacheInfo,
    type ProofResult,
    type EntryInputs,
    type AbsorbInputs,
    type SendInputs
} from './browser-compatible';

// Hook state interface
interface NoirHookState {
    isGenerating: boolean;
    isPreloading: boolean;
    currentProof: ProofResult | null;
    error: string | null;
    cacheInfo: { size: number; circuits: string[] } | null;
}

// Hook return type
interface UseNoirReturn {
    // State
    isGenerating: boolean;
    isPreloading: boolean;
    currentProof: ProofResult | null;
    error: string | null;
    cacheInfo: { size: number; circuits: string[] } | null;

    // Actions
    generateEntryProof: (inputs?: Partial<EntryInputs>) => Promise<ProofResult>;
    generateAbsorbProof: (inputs?: Partial<AbsorbInputs>) => Promise<ProofResult>;
    generateSendProof: (inputs?: Partial<SendInputs>) => Promise<ProofResult>;
    preloadAllCircuits: () => Promise<void>;
    clearCache: () => void;
    refreshCacheInfo: () => void;
    clearError: () => void;
}

/**
 * Hook for managing Noir proof generation
 */
export function useNoir(): UseNoirReturn {
    const [state, setState] = useState<NoirHookState>({
        isGenerating: false,
        isPreloading: false,
        currentProof: null,
        error: null,
        cacheInfo: null
    });

    const abortControllerRef = useRef<AbortController | null>(null);

    // Clear error
    const clearError = useCallback(() => {
        setState(prev => ({ ...prev, error: null }));
    }, []);

    // Refresh cache info
    const refreshCacheInfo = useCallback(() => {
        const info = getCacheInfo();
        setState(prev => ({ ...prev, cacheInfo: info }));
    }, []);

    // Clear cache
    const clearCache = useCallback(() => {
        clearCircuitCache();
        refreshCacheInfo();
    }, [refreshCacheInfo]);

    // Preload all circuits
    const preloadAllCircuits = useCallback(async () => {
        setState(prev => ({ ...prev, isPreloading: true, error: null }));

        try {
            await preloadCircuits();
            refreshCacheInfo();
            console.log('✅ All circuits preloaded successfully');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to preload circuits';
            setState(prev => ({ ...prev, error: errorMessage }));
            console.error('❌ Error preloading circuits:', error);
        } finally {
            setState(prev => ({ ...prev, isPreloading: false }));
        }
    }, [refreshCacheInfo]);

    // Generate entry proof
    const handleGenerateEntryProof = useCallback(async (inputs?: Partial<EntryInputs>): Promise<ProofResult> => {
        setState(prev => ({ ...prev, isGenerating: true, error: null }));

        // Cancel any ongoing operation
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();

        try {
            const result = await generateEntryProof(inputs);
            setState(prev => ({
                ...prev,
                currentProof: result,
                isGenerating: false
            }));
            return result;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to generate entry proof';
            setState(prev => ({
                ...prev,
                error: errorMessage,
                isGenerating: false
            }));
            throw error;
        }
    }, []);

    // Generate absorb proof
    const handleGenerateAbsorbProof = useCallback(async (inputs?: Partial<AbsorbInputs>): Promise<ProofResult> => {
        setState(prev => ({ ...prev, isGenerating: true, error: null }));

        // Cancel any ongoing operation
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();

        try {
            const result = await generateAbsorbProof(inputs);
            setState(prev => ({
                ...prev,
                currentProof: result,
                isGenerating: false
            }));
            return result;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to generate absorb proof';
            setState(prev => ({
                ...prev,
                error: errorMessage,
                isGenerating: false
            }));
            throw error;
        }
    }, []);

    // Generate send proof
    const handleGenerateSendProof = useCallback(async (inputs?: Partial<SendInputs>): Promise<ProofResult> => {
        setState(prev => ({ ...prev, isGenerating: true, error: null }));

        // Cancel any ongoing operation
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();

        try {
            const result = await generateSendProof(inputs);
            setState(prev => ({
                ...prev,
                currentProof: result,
                isGenerating: false
            }));
            return result;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to generate send proof';
            setState(prev => ({
                ...prev,
                error: errorMessage,
                isGenerating: false
            }));
            throw error;
        }
    }, []);

    return {
        // State
        isGenerating: state.isGenerating,
        isPreloading: state.isPreloading,
        currentProof: state.currentProof,
        error: state.error,
        cacheInfo: state.cacheInfo,

        // Actions
        generateEntryProof: handleGenerateEntryProof,
        generateAbsorbProof: handleGenerateAbsorbProof,
        generateSendProof: handleGenerateSendProof,
        preloadAllCircuits,
        clearCache,
        refreshCacheInfo,
        clearError
    };
}

export default useNoir;
