export const moveBlob = async (source: string, target: string) => {
  try {
    const blob = await hubBlob().get(source);
    if (blob) {
      await hubBlob().put(target, blob);
      await hubBlob().del(source);
    }
  } catch (err) {
    throw createError({
      status: 500,
      message: "Can't move item",
    });
  }
};

export const copyBlob = async (source: string, target: string) => {
  try {
    const blob = await hubBlob().get(source);
    if (blob) {
      return hubBlob().put(target, blob);
    }
  } catch (err) {
    throw createError({
      status: 500,
      message: "Can't make copy",
    });
  }
};

export const deleteBlob = async (path: string, timestamp: number) => {
  try {
    const blob = await hubBlob().get(path);
    if (blob) {
      await hubBlob().put(`_trash/${timestamp}/${path}`, blob);
      await hubBlob().del(path);
    }
  } catch (err) {
    throw createError({
      status: 500,
      message: "Can't delete item",
    });
  }
};
