export const runtime = "nodejs";

import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = await fetch("https://api.paymongo.com/v1/checkout_sessions", {
      method: "POST",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(process.env.PAYMONGO_SECRET_KEY + ":").toString("base64"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          attributes: {
            send_email_receipt: false,
            show_description: true,
            show_line_items: true,

            line_items: [
              {
                currency: "PHP",
                amount: 10000, // ₱100
                name: "Machine Gun Car",
                quantity: 1,
              },
            ],

            payment_method_types: ["gcash"],

            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/failed`,
          },
        },
      }),
    });

    const data = await response.json();

    console.log("CHECKOUT SESSION:", data);

    return NextResponse.json(data);
  } catch (error) {
    console.error("ERROR:", error);

    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}