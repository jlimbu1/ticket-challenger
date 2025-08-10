import { ITicketUpdateData } from "@/interface";

export function getAllBoughtTickets(tickets: ITicketUpdateData[]) {
  return tickets?.filter((x) => x.bought);
}
