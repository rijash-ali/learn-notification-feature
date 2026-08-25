
/**
 * Generator flow for push authentication polling.
 *
 * The flow repeatedly yields a `CALL_API` effect so the caller can check
 * the current challenge status, then waits for a short delay before retrying.
 * It terminates when the challenge is approved, rejected, or when the timeout
 * elapses.
 *
 * @param timeoutMs - Maximum wait time in milliseconds before yielding a
 *                    `TIMEOUT` event. Defaults to `60000`.
 * @yields {{ type: "CALL_API" }} to request the current auth status.
 * @yields {{ type: "DELAY", ms: number }} to pause before the next poll.
 * @yields {{ type: "APPROVED" | "REJECTED" | "TIMEOUT" }} terminal events.
 */
function* pushAuthFlow(timeoutMs = 60000) {
    const start = Date.now();

    while (true) {
        if(Date.now() - start > timeoutMs) {
            yield { type: "TIMEOUT"}
            return;
        }

        // @ts-ignore
        const authStatus = yield { type: "CALL_API" };

        if (authStatus === "approved") {
            yield { type: "APPROVED" }
            return;
        }
        
        if (authStatus === "rejected") {
            yield { type: "REJECTED" }
            return;
        }

        /** Wait for 2s before next poll */
        yield { type: "DELAY", ms: 2000 }
    }
}

export { pushAuthFlow };