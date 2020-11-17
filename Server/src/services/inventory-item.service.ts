import { InventoryItem } from "../entities/inventory-item.entity";
import { EntityManager, wrap, QueryOrder, QueryOrderMap } from "mikro-orm";

export {
  getInventoryItems as getAllInventoryItems,
  getInventoryItem,
  updateInventoryItem,
  addInventoryItem,
  removeInventoryItem,
  countInventoryItems,
};

async function countInventoryItems(em: EntityManager, activeOnly = false) {
  if (!(em instanceof EntityManager)) return Error("invalid request");

  try {
    const count = await em.count(
      InventoryItem,
      activeOnly ? { active: true } : {}
    );
    return count;
  } catch (ex) {
    return ex;
  }
}

async function getInventoryItems(
  em: EntityManager,
  page: number,
  limit: number,
  sort = "",
  activeOnly = false
): Promise<Error | InventoryItem[]> {
  if (!(em instanceof EntityManager)) return Error("invalid request");

  let sorting: QueryOrderMap = {};
  if (sort) {
    const sortParams = sort.split("_");
    const column = sortParams[0];
    const order = sortParams[1];
    if (column && order) {
      sorting[column] = order === "desc" ? QueryOrder.DESC : QueryOrder.ASC;
    } else {
      return Error("invalid params");
    }
  }

  try {
    const items = await em.find(
      InventoryItem,
      activeOnly ? { active: true } : { },
      {
        orderBy: sorting,
        limit: limit,
        offset: (page - 1) * limit,
      }
    );
    await new Promise((resolve) => setTimeout(resolve, 500));
    return items;
  } catch (ex) {
    return ex;
  }
}

async function getInventoryItem(
  em: EntityManager,
  id: string
): Promise<Error | InventoryItem | null> {
  if (!(em instanceof EntityManager)) return Error("invalid request");

  if (!id || typeof id !== "string") return Error("invalid params");

  try {
    const item = await em.findOne(InventoryItem, { id: id });
    return item;
  } catch (ex) {
    return ex;
  }
}

async function removeInventoryItem(
  em: EntityManager,
  id: string
): Promise<Error | void> {
  if (!(em instanceof EntityManager)) return Error("invalid request");

  if (!id || typeof id !== "string") return Error("invalid params");

  try {
    const item = await em.findOneOrFail(InventoryItem, { id });
    await em.removeAndFlush(item);
  } catch (ex) {
    return ex;
  }
}

async function updateInventoryItem(
  em: EntityManager,
  inventoryItem: Partial<InventoryItem>,
  id: string
): Promise<Error | InventoryItem> {
  if (!(em instanceof EntityManager)) return Error("invalid request");

  if (
    !inventoryItem ||
    typeof inventoryItem !== "object" ||
    !inventoryItem.id ||
    id !== inventoryItem.id
  )
    return Error("invalid params");

  try {
    const item = await em.findOneOrFail(InventoryItem, {
      id: inventoryItem.id,
    });
    wrap(item).assign(inventoryItem);
    await em.persistAndFlush(item);
    return item;
  } catch (ex) {
    return ex;
  }
}

async function addInventoryItem(
  em: EntityManager,
  inventoryItem: Partial<InventoryItem>
): Promise<Error | InventoryItem> {
  if (!(em instanceof EntityManager)) return Error("invalid request");

  if (!inventoryItem || typeof inventoryItem !== "object" || inventoryItem.id)
    return Error("invalid params");

  try {
    const item = new InventoryItem(inventoryItem);
    await em.persistAndFlush(item);
    return item;
  } catch (ex) {
    return ex;
  }
}
