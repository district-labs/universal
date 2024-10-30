export type NonUndefined<T> = {
  [P in keyof T]-?: Exclude<T[P], undefined>;
};
