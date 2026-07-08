import type { Response } from "express";
import { UserRole } from "@prisma/client";

import { AppError } from "../../errors/AppError";
import type { AuthenticatedRequest } from "../../interfaces/request.interface";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { serviceService } from "./service.service";
import type { ServiceQueryInput } from "./service.validation";

const getParamId = (value: string | string[] | undefined, message: string) => {
  const id = Array.isArray(value) ? value[0] : value;

  if (!id) {
    throw new AppError(400, message);
  }

  return id;
};

const getActor = (req: AuthenticatedRequest) => {
  if (!req.user) {
    throw new AppError(401, "Unauthorized");
  }

  return req.user;
};

export const serviceController = {
  listServices: catchAsync(async (req, res: Response) => {
    const query = req.query as unknown as ServiceQueryInput;
    const result = await serviceService.listServices(query);

    return sendResponse({
      res,
      message: "Services retrieved successfully",
      data: result,
    });
  }),

  getServiceById: catchAsync(async (req, res: Response) => {
    const serviceId = getParamId(req.params.id, "Service id is required");
    const service = await serviceService.getServiceById(serviceId);

    return sendResponse({
      res,
      message: "Service retrieved successfully",
      data: service,
    });
  }),

  createService: catchAsync(async (req, res: Response) => {
    const actor = getActor(req as AuthenticatedRequest);
    const service = await serviceService.createService(req.body, actor);

    return sendResponse({
      res,
      statusCode: 201,
      message: "Service created successfully",
      data: service,
    });
  }),

  updateService: catchAsync(async (req, res: Response) => {
    const actor = getActor(req as AuthenticatedRequest);
    const serviceId = getParamId(req.params.id, "Service id is required");
    const service = await serviceService.updateService(
      serviceId,
      req.body,
      actor,
    );

    return sendResponse({
      res,
      message: "Service updated successfully",
      data: service,
    });
  }),

  deleteService: catchAsync(async (req, res: Response) => {
    const actor = getActor(req as AuthenticatedRequest);
    const serviceId = getParamId(req.params.id, "Service id is required");
    const result = await serviceService.deleteService(serviceId, actor);

    return sendResponse({
      res,
      message: result.message,
      data: {},
    });
  }),
};
