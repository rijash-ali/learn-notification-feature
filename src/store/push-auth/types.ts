export interface IPushAuth {
    /**
     * Unique identifier created by your backend when a login attempt begins.
     * It represents a single authentication challenge that must be approved on the user’s mobile device.
     */
    challengeId: string | null;
    status: 'idle' | 'pending' | 'approved' | 'rejected' | 'timeout',
    pageAttributes: {
        isAuthenticating: boolean
    }
}