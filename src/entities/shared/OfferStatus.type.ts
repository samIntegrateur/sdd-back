import { registerEnumType } from 'type-graphql';

export enum OfferStatus {
  AVAILABLE = 'AVAILABLE',
  PROMISED = 'PROMISED',
  GIVEN = 'GIVEN',
  CANCELED = 'CANCELED',
}

registerEnumType(OfferStatus, {
  name: "OfferStatus",
  description: "Status of an offer",
});
