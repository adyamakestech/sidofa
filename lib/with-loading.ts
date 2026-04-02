type WithLoadingOptions = {
  startLoading?: () => void;
  stopLoading?: () => void;
  minDuration?: number;
};

export async function withLoading<T>(
  fn: () => Promise<T>,
  options?: WithLoadingOptions,
): Promise<T | undefined> {
  const start = Date.now();

  options?.startLoading?.();

  try {
    return await fn();
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    const elapsed = Date.now() - start;

    if (
      typeof options?.minDuration === "number" &&
      elapsed < options.minDuration
    ) {
      await new Promise((r) => setTimeout(r, options.minDuration! - elapsed));
    }

    options?.stopLoading?.();
  }
}
