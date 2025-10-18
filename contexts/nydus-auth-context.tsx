"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAccount } from 'wagmi';

interface NydusAuthState {
    // EOA (Externally Owned Account) address from wallet
    eoaAddress: string | null;

    // Public key coordinates derived from signature
    publicKeyX: string | null;
    publicKeyY: string | null;

    // Signature and related data
    signature: string | null;
    signatureHash: string | null;
    messageHash: string | null;
    recoveredAddress: string | null;

    // Authentication status
    isAuthenticated: boolean;
    isInitialized: boolean;
}

interface NydusAuthContextType extends NydusAuthState {
    // Actions
    setAuthData: (data: Partial<NydusAuthState>) => void;
    clearAuthData: () => void;
    isConnected: boolean;
}

const NydusAuthContext = createContext<NydusAuthContextType | undefined>(undefined);

export function NydusAuthProvider({ children }: { children: ReactNode }) {
    const { address, isConnected } = useAccount();

    const [authState, setAuthState] = useState<NydusAuthState>({
        eoaAddress: null,
        publicKeyX: null,
        publicKeyY: null,
        signature: null,
        signatureHash: null,
        messageHash: null,
        recoveredAddress: null,
        isAuthenticated: false,
        isInitialized: false,
    });

    // Initialize auth state from localStorage on mount
    useEffect(() => {
        const savedAuthData = localStorage.getItem('nydus-auth-data');
        if (savedAuthData) {
            try {
                const parsedData = JSON.parse(savedAuthData);
                setAuthState(prevState => ({
                    ...prevState,
                    ...parsedData,
                    isInitialized: true,
                }));
            } catch (error) {
                console.error('Failed to parse saved auth data:', error);
                setAuthState(prevState => ({
                    ...prevState,
                    isInitialized: true,
                }));
            }
        } else {
            setAuthState(prevState => ({
                ...prevState,
                isInitialized: true,
            }));
        }
    }, []);

    // Clear auth data when wallet disconnects
    useEffect(() => {
        if (!isConnected) {
            clearAuthData();
        }
    }, [isConnected]);

    // Update EOA address when wallet connects
    useEffect(() => {
        if (isConnected && address) {
            setAuthState(prevState => ({
                ...prevState,
                eoaAddress: address,
            }));
        }
    }, [isConnected, address]);

    const setAuthData = (data: Partial<NydusAuthState>) => {
        setAuthState(prevState => {
            const newState = {
                ...prevState,
                ...data,
                isAuthenticated: !!(data.signature && data.publicKeyX && data.publicKeyY),
            };

            // Save to localStorage
            localStorage.setItem('nydus-auth-data', JSON.stringify(newState));

            return newState;
        });
    };

    const clearAuthData = () => {
        setAuthState({
            eoaAddress: null,
            publicKeyX: null,
            publicKeyY: null,
            signature: null,
            signatureHash: null,
            messageHash: null,
            recoveredAddress: null,
            isAuthenticated: false,
            isInitialized: true,
        });

        // Clear from localStorage
        localStorage.removeItem('nydus-auth-data');
    };

    const contextValue: NydusAuthContextType = {
        ...authState,
        setAuthData,
        clearAuthData,
        isConnected,
    };

    return (
        <NydusAuthContext.Provider value={contextValue}>
            {children}
        </NydusAuthContext.Provider>
    );
}

export function useNydusAuth() {
    const context = useContext(NydusAuthContext);
    if (context === undefined) {
        throw new Error('useNydusAuth must be used within a NydusAuthProvider');
    }
    return context;
}
