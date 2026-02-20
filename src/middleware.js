import { NextResponse } from "next/server";

export async function middleware(request) {
  try {
    const path = request.nextUrl.pathname;

    // Prepare headers for settings fetch
    const myHeaders = new Headers();
    const uat = request.cookies.get("uat")?.value;
    if (uat) myHeaders.append("Authorization", `Bearer ${uat}`);
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      mode: "cors",
    };

    // fetch settings from backend (use provided envs)
    let settingData = null;
    try {
      const apiBase = (
        process.env.API_PROD_URL ||
        process.env.NEXT_PUBLIC_API_URL ||
        ""
      ).replace(/\/$/, "");
      if (apiBase) {
        const res = await fetch(apiBase + "/settings", requestOptions);
        if (
          res.ok &&
          (res.headers.get("content-type") || "").includes("application/json")
        ) {
          settingData = await res.json();
        }
      }
    } catch (err) {
      console.error("middleware: failed to fetch /settings", err);
      settingData = null;
    }

    const protectedRoutes = [
      `/account/dashboard`,
      `/account/notification`,
      `/account/wallet`,
      `/account/bank-details`,
      `/account/point`,
      `/account/refund`,
      `/account/order`,
      `/account/addresses`,
      `/wishlist`,
      `/compare`,
    ];

    // MAINTENANCE handling
    if (settingData?.values?.maintenance?.maintenance_mode) {
      if (path !== "/maintenance") {
        return NextResponse.redirect(new URL(`/maintenance`, request.url));
      }
    } else {
      // If maintenance cookie exists but backend says no maintenance, clear it
      if (request.cookies.get("maintenance")) {
        const resp = NextResponse.next();
        resp.cookies.delete("maintenance");
        return NextResponse.redirect(new URL(`/`, request.url));
      }
    }

    // Protect routes that require auth
    if (protectedRoutes.includes(path) && !request.cookies.has("uat")) {
      const currentPath = request?.cookies?.get("currentPath")?.value || "/";
      const response = NextResponse.redirect(new URL(currentPath, request.url));
      response.cookies.set("showAuthToast", "true", { httpOnly: false });
      return response;
    }

    // Checkout flow: require login unless guest checkout enabled
    if (path === "/checkout" && !request.cookies.has("uat")) {
      const guestCheckout = !!settingData?.values?.activation?.guest_checkout;
      if (!guestCheckout) {
        return NextResponse.redirect(new URL(`/auth/login`, request.url));
      }
      // if guestCheckout is true, allow unless cartData indicates digital-only
      if (request.cookies.get("cartData") === "digital") {
        return NextResponse.redirect(new URL(`/auth/login`, request.url));
      }
    }

    // Auth redirects
    if (path === "/auth/login" && request.cookies.has("uat")) {
      return NextResponse.redirect(new URL(`/`, request.url));
    }

    if (path !== "/auth/login") {
      if (path === "/auth/otp-verification" && !request.cookies.has("ue")) {
        return NextResponse.redirect(new URL(`/auth/login`, request.url));
      }
      if (
        path === "/auth/update-password" &&
        (!request.cookies.has("uo") || !request.cookies.has("ue"))
      ) {
        return NextResponse.redirect(new URL(`/auth/login`, request.url));
      }
    }

    if (request.headers.get("x-redirected")) {
      return NextResponse.next();
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
