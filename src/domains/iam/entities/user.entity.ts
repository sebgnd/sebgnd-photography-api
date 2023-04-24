import { Entity } from '@libs/entity';

export type User = Entity & {
  sso: {
    providerUserId: string,
    provider: string,
  },
}
