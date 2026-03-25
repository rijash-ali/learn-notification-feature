import { useRef } from "react"
import { pushAuthFlow } from "./pushAuthFlow";

export const usePushAuthRunner = (flow = pushAuthFlow) => {
    const running = useRef(false);

    async function start(
        challengeId: string, 
        { checkStatus, onEvent }: { checkStatus: Function, onEvent: Function }
    ) {
        /** Prevent double execution for same instance */
        if (running.current) return;

        running.current = true;

        const gen = flow();

        let next = gen.next();

        while(!next.done) {
            const effect = next.value;

            if (effect.type === "CALL_API") {
                const response = await checkStatus(challengeId);
                next = gen.next(response.data.status);
            }

            else if (effect.type === "DELAY") {
                await new Promise(res => setTimeout(res, effect.ms));
                next = gen.next();
            }

            /** Handle events - APPROVED/REJECTED/TIMEOUT */
            else {
                onEvent(effect);
                next = gen.next();
            }
        }

        running.current = false;
    }

    return { start };
}