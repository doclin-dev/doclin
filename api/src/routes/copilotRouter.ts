import express from 'express';
import { postPrompt } from '../controllers/copilotController';

const copilotRouter = express.Router({ mergeParams: true });

copilotRouter.post('/', postPrompt);

export default copilotRouter;
