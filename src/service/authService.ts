
export const requestChallenge = async (): Promise<{ status: number; data: string }> => {
    return new Promise(resolve => resolve({
        status: 200,
        data: crypto.randomUUID(),
    }));
}


export const checkChallengeStatus = async () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        status: 200,
        data: {
          status: Math.random() > 0.5 ? "approved" : "rejected"
        }
      });
    }, 10000);
  });
};
