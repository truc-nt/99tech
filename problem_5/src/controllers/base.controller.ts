import { Request } from "express";
import { FilterParam } from "../models/repository.model";

/**
 * BaseController provides common utilities for all controllers,
 * such as extracting and normalizing query parameters.
 */
export default class BaseController {
  /**
   * Extract and normalize query parameters from an Express request.
   *
   * Supports:
   * - `limit` (default 50): maximum number of results
   * - `offset` (default 0): pagination start index
   * - `sort`: single or multiple sort fields in the format "field,asc|desc"
   * - Any other query parameters are collected into `other`
   *
   * @param req Express request object
   * @returns Normalized FilterParam object
   */
  protected getQueryParam(req: Request): FilterParam {
    const { limit = 50, offset = 0, sort, ...rest } = req.query;

    const parsedSort: { name: string; order: "asc" | "desc" }[] = [];

    /**
     * Normalize a single sort entry string into a {name, order} object.
     *
     * @param entry Sort entry (e.g., "name,asc")
     */
    const normalizeSort = (entry: unknown): void => {
      if (typeof entry === "string") {
        const [name, order] = entry.split(",");
        const lowerOrder = order?.toLowerCase();
        if (name && lowerOrder && (lowerOrder === "asc" || lowerOrder === "desc")) {
          parsedSort.push({ name, order: lowerOrder });
        }
      }
    };

    if (Array.isArray(sort)) {
      sort.forEach(normalizeSort);
    } else {
      normalizeSort(sort);
    }

    return {
      limit: Number(limit),
      offset: Number(offset),
      sort: parsedSort,
      other: rest as Record<string, string | string[]>,
    };
  }
}
