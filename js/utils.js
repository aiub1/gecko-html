// conditions to determine if two objects are colliding ( ex.: object1 = player ; object2 = collisionBlock)

function collision({ object1, object2, canvas }) {
  return (
    // floor collision
    object1.position.y + object1.height >= object2.position.y &&
    // roof collision
    object1.position.y <= object2.position.y + object2.height &&
    // left wall collision
    object1.position.x <= object2.position.x + object2.width &&
    // right wall collision
    object1.position.x + object1.width >= object2.position.x
  );
}

function floorCollision({ player, object1, object2 }) {
  // We add a small margin for error to account for floating-point precision issues
  const marginOfError = 0.5; // You can adjust this value based on your game's needs

  // Check if the player's bottom y-coordinate is within a small margin of the collision block's top y-coordinate
  return (
    player.velocity.y >= 0 &&
    object1.position.y + object1.height >= object2.position.y - marginOfError &&
    object1.position.y + object1.height <= object2.position.y + marginOfError
  );
}