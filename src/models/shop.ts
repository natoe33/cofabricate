/**
 * A shop on Cofabricate
 * @id Shop id (uuid)
 * @name Shop name (string)
 * @description Shop description (string)
 * @currency Accepted currencies (list of string)
 * @min_price Minimum order amount
 * @location Shop country
 */
export class Shop {
  event_id?: string;
  id: string;
  name: string;
  description: string;
  currency: string[];
  min_price: number;
  location: string[];

  constructor(
    event_id: string | undefined,
    id: string,
    name: string,
    description: string,
    currency: string[],
    min_price: number,
    location: string[]
  ) {
    this.event_id = event_id;
    this.id = id;
    this.name = name;
    this.description = description;
    this.currency = currency;
    this.min_price = min_price;
    this.location = location;
  }
}
