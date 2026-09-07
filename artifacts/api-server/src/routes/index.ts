import { Router, type IRouter } from "express";
import healthRouter from "./health";
import treesRouter from "./trees";
import custodyRouter from "./custody";
import checkpointsRouter from "./checkpoints";
import dashboardRouter from "./dashboard";
import authRouter from "./auth";
import uploadRouter from "./upload";
import failureAutopsyRouter from "./failure-autopsy";

const router: IRouter = Router();

router.use(healthRouter);
router.use(treesRouter);
router.use(custodyRouter);
router.use(checkpointsRouter);
router.use(dashboardRouter);
router.use(authRouter);
router.use(uploadRouter);
router.use(failureAutopsyRouter);

export default router;
