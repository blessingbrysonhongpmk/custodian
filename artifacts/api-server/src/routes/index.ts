import { Router, type IRouter } from "express";
import healthRouter from "./health";
import treesRouter from "./trees";
import custodyRouter from "./custody";
import checkpointsRouter from "./checkpoints";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(treesRouter);
router.use(custodyRouter);
router.use(checkpointsRouter);
router.use(dashboardRouter);

export default router;
