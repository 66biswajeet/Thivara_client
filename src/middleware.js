import { NextResponse } from "next/server";

export async function middleware(request) {
  try {
    const {
      nextUrl: { search },
    } = request;
    const urlSearchParams = new URLSearchParams(search);
    const params = Object.fromEntries(urlSearchParams.entries());

    let myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      `Bearer ${request.cookies.get("uat")?.value}`,
    );
    myHeaders.append("Content-Type", "application/json");

    let requestOptions = {
      method: "GET",
      headers: myHeaders,
      mode: "cors",
    };

    let settingData = null;
    try {
      const response = await fetch(
        process.env.API_PROD_URL + "/settings",
        requestOptions,
      );
      if (response.ok) {
        settingData = await response.json();
      }
    } catch (fetchError) {
      console.error("Settings fetch error:", fetchError);
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

    const path = request.nextUrl.pathname;

    if (request.cookies.has("maintenance") && path !== `/maintenance`) {
      try {
        let myHeaders = new Headers();
        myHeaders.append(
          "Authorization",
          `Bearer ${request.cookies.get("uat")?.value}`,
        );
        myHeaders.append("Content-Type", "application/json");
        let requestOptions = {
          method: "GET",
          headers: myHeaders,
          mode: "cors",
        };

        let response = await fetch(
          process.env.API_PROD_URL + "/settings",
          requestOptions,
        );
        if (!response.ok) {
          return NextResponse.next();
        }
        let data = await response.json();

        if (
          data?.values?.maintenance?.maintenance_mode &&
          path !== `/maintenance`
        ) {
          return NextResponse.redirect(new URL(`/maintenance`, request.url));
        } else {
          if (request.cookies.get("maintenance")) {
            return NextResponse.next();
          } else {
            const response = NextResponse.next();
            response.cookies.delete("maintenance");
            return NextResponse.redirect(new URL(`/`, request.url));
          }
        }
      } catch (error) {
        console.error("Maintenance check error:", error);
        return NextResponse.next();
      }
    }

    if (protectedRoutes.includes(path) && !request.cookies.has("uat")) {
      const currentPath = request?.cookies?.get("currentPath")?.value || "/";
      const response = NextResponse.redirect(new URL(currentPath, request.url));
      response.cookies.set("showAuthToast", "true", { httpOnly: false });
      return response;
    }

    if (!request.cookies.has("maintenance") && path === `/maintenance`) {
      return NextResponse.redirect(new URL(`/`, request.url));
    }

    if (path === `/checkout` && !request.cookies.has("uat")) {
      if (settingData?.values?.activation?.guest_checkout) {
        if (request.cookies.get("cartData") === "digital") {
          return NextResponse.redirect(new URL(`/auth/login`, request.url));
        }
      } else {
        return NextResponse.redirect(new URL(`/auth/login`, request.url));
      }
    }

    if (path === `/auth/login` && request.cookies.has("uat")) {
      return NextResponse.redirect(new URL(`/`, request.url));
    }

    if (path !== `/auth/login`) {
      if (path === `/auth/otp-verification` && !request.cookies.has("ue")) {
        return NextResponse.redirect(new URL(`/auth/login`, request.url));
      }
      if (
        path === `/auth/update-password` &&
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
