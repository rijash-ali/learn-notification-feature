
export const requestChallenge = async (): Promise<{ status: number; data: string }> => {
    return new Promise(resolve => resolve({
        status: 200,
        data: crypto.randomUUID(),
    }));
}


export const checkChallengeStatus = async () => {
  console.log('@test - checkChallengeStatus invoked');
  return new Promise(resolve => {
    setTimeout(() => {
      const randomChanceVar = (Math.random() * 10) % 5;
      const authStatus = randomChanceVar > 2 ? "pending" : randomChanceVar > 1 ? "approved" : "rejected";
      resolve({
        status: 200,
        data: {
          status: authStatus
        }
      });
    }, 1000);
  });
};
