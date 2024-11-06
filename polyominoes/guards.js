// Function to place guards in a dispersed manner
function placeGuards(squares, minDistance) {
    const guards = [];
    const activeSquares = getActiveSquares(squares); // Only consider active squares for guard placement

    // Start with the first active square as the first guard position
    if (activeSquares.length > 0) {
        guards.push(activeSquares[0]);
        activeSquares[0].watched = true; // Mark as watched
    }

    // Place additional guards ensuring minimum distance
    for (let i = 1; i < activeSquares.length; i++) {
        const square = activeSquares[i];
        
        // Check if this square can be a guard, respecting the minDistance
        let validGuardPosition = true;
        for (let guard of guards) {
            const distance = Math.abs(guard.x - square.x) + Math.abs(guard.y - square.y);
            if (distance < minDistance) {
                validGuardPosition = false;
                break;
            }
        }

        if (validGuardPosition) {
            guards.push(square); // Place guard here
            square.watched = true; // Mark this square as watched
        }
    }

    // Return the guard positions
    return guards;
}

// Function to mark all squares visible to each guard
function markVisibility(squares, guards) {
    for (let guard of guards) {
        // Mark all squares in line-of-sight as "watched"
        for (let square of squares) {
            if (isVisible(guard, square)) {
                square.watched = true;
            }
        }
    }
}

// Helper function to check if a square is within the visibility of a guard
function isVisible(guard, square) {
    // Check if the square is horizontally or vertically aligned with the guard
    return (
        (guard.x === square.x && Math.abs(guard.y - square.y) <= square.size) ||
        (guard.y === square.y && Math.abs(guard.x - square.x) <= square.size)
    );
}

// Function to validate the coverage of all active squares
function validateCoverage(squares) {
    // Ensure every active square is either directly guarded or within line-of-sight of a guard
    for (let square of squares) {
        if (square.active && !square.watched) {
            return false; // If there's an active square that's unwatched, return false
        }
    }
    return true; // All active squares are covered
}

// Main function to solve the Dispersive Art Gallery Problem
function solveDispersiveArtGallery(squares, minDistance) {
    // Step 1: Place guards in dispersed locations based on minimum distance
    const guards = placeGuards(squares, minDistance);
    
    // Step 2: Mark visibility for each guard
    markVisibility(squares, guards);
    
    // Step 3: Validate if all active squares are covered
    const isCovered = validateCoverage(squares);

    // Display results
    if (isCovered) {
        console.log("All active squares are covered with guards placed at:");
        console.log(guards.map(g => `(${g.x}, ${g.y})`));
        resultMessage = `Polyomino: valid - Guards placed at ${guards.length} locations`;
    } else {
        console.log("Not all active squares are covered. Increase the number of guards or adjust minimum distance.");
        resultMessage = "Polyomino: invalid - not all squares covered";
    }
    return guards;
}
