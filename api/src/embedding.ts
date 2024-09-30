import axios from 'axios';
import { PYTHON_API_HOST } from './envConstants';

const CREATE_EMBEDDING_URL = `${PYTHON_API_HOST}/generate_embedding`;

export const createEmbedding = async (text: string): Promise<number[]> => {
  try {
    const payload = {
      text: text,
    };

    const response = await axios.post(CREATE_EMBEDDING_URL, payload);
    return response.data.embedding;
  } catch (error) {
    console.error(`An error occurred in createEmbedding: ${error.message}`);
    throw error;
  }
};
