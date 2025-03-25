// utils/sainteLague.js
function calculateSainteLagueSeats(groups, totalSeats) {
  const seatAllocation = groups.map(group => ({
    ...group,
    seatsAllocated: 0, // Initially, no seats are allocated
    votes: group.totalVotes || 0, // Assuming each group has totalVotes property
  }));

  // Continue allocating seats until all totalSeats are allocated
  for (let i = 0; i < totalSeats; i++) {
    // Calculate the quotient for each group
    seatAllocation.forEach(group => {
      group.quotient = group.votes / (2 * group.seatsAllocated + 1);
    });

    // Sort groups by quotient in descending order
    seatAllocation.sort((a, b) => b.quotient - a.quotient);

    // Allocate a seat to the group with the highest quotient
    seatAllocation[0].seatsAllocated++;
  }

  // Return the groups with their final seat allocation
  return seatAllocation;
}

module.exports = calculateSainteLagueSeats;
