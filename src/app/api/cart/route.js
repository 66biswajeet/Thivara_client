import { NextResponse } from "next/server";

// Store cart state in memory (ideally this should be in a database or session store)
let cartState = null;

export async function GET() {
  // If cart was cleared, return empty cart
  if (cartState === null) {
    // Return empty cart structure
    return NextResponse.json({ items: [], total: 0 });
  }

  // Otherwise return the stored cart state
  return NextResponse.json(cartState);
}

export async function POST(request) {
  try {
    const body = await request.json();
    // Update cart state
    cartState = body;
    return NextResponse.json({ success: true, data: cartState });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update cart" },
      { status: 400 }
    );
  }
}

export async function DELETE() {
  // Clear the cart
  cartState = null;
  return NextResponse.json({
    success: true,
    message: "Cart cleared successfully",
    data: { items: [], total: 0 },
  });
}
