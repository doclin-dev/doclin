const MODEL = 'Xenova/all-MiniLM-L6-v2';

export const createEmbedding = async (input: string, vectorSize: number = 384): Promise<number[]> => {
  try {
    const TransformersApi = Function('return import("@xenova/transformers")')();
    const { pipeline } = await TransformersApi;
    const pipe = await pipeline('feature-extraction', MODEL);

    const embedding = await pipe(input, { pooling: 'mean', normalize: true });
    const extractedData: number[] = Array.from(embedding.data);
    const resizedVector = resizeVector(extractedData, vectorSize);

    return normalizeVector(resizedVector);
  } catch (error) {
    console.error('Error in createEmbedding:', error);
    throw error;
  }
};

const resizeVector = (vector: number[], targetSize: number): number[] => {
  if (vector.length === targetSize) {
    return vector;
  } else if (vector.length < targetSize) {
    return vector.concat(Array(targetSize - vector.length).fill(0));
  } else {
    return vector.slice(0, targetSize);
  }
};

const normalizeVector = (vector: number[]): number[] => {
  const norm = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0));
  return vector.map((value) => value / norm);
};
