export interface HealthResponse {
  status: 'ok';
}

export const getHealth = (): HealthResponse => {
  return {
    status: 'ok',
  };
};
