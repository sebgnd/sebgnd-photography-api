export type Optionnal<T> = T | undefined | null;
export type PersistedEntity = {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
