export function getAllBoughtTickets(tickets) {
    return tickets?.filter((x) => x.bought);
}
