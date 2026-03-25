declare module "@xenova/transformers" {
  export const env: {
    allowLocalModels: boolean;
    useBrowserCache: boolean;
  };

  export function pipeline(
    task: "feature-extraction",
    model: string,
  ): Promise<(
    text: string,
    options?: { pooling?: "mean" | "cls"; normalize?: boolean },
  ) => Promise<{ data: Float32Array | number[] }>>;
}
