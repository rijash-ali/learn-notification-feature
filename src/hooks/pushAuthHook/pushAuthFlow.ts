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