export const trackBy = (index: number, item: any & { id: string }): string => {
  return item.id;
};
