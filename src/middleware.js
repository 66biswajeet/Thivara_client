import { NextResponse } from "next/server";

export async function middleware(request) {
  try {
    const {
      nextUrl: { search },
    } = request;
    const urlSearchParams = new URLSearchParams(search);
    const params = Object.fromEntries(urlSearchParams.entries());

<<<<<<< HEAD
  let myHeaders = new Headers();
  myHeaders.append(
    "Authorization",
    `Bearer ${request.cookies.get("uat")?.value}`,
  );
  let requestOptions = {
    method: "GET",
    headers: myHeaders,
  };
  let settingData = {};
  try {
    const apiBase =
      process.env.API_PROD_URL || process.env.NEXT_PUBLIC_API_URL || "";
    const res = await fetch(
      apiBase.replace(/\/$/, "") + "/settings",
      requestOptions,
    );
    if (!res.ok) {
      // non-2xx response — don't throw, just keep defaults
      // eslint-disable-next-line no-console
      console.warn(`middleware: /settings fetch returned status ${res.status}`);
    } else {
      const ct = res.headers.get("content-type") || "";
      if (ct.includes("application/json")) {
        settingData = await res.json();
      } else {
        // received HTML or other non-JSON response (e.g., an error page)
        // eslint-disable-next-line no-console
        console.warn(
          "middleware: /settings did not return JSON, content-type:",
          ct,
        );
      }
    }
  } catch (err) {
    // network or parsing error — log and continue with empty settings
    // eslint-disable-next-line no-console
    console.error("middleware: failed to fetch /settings", err);
  }
  const protectedRoutes = [
    `/account/dashboard`,
    `/account/notification`,
    `/account/wallet`,
    `/account/bank-details`,
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
=======
>>>>>>> c3a63f2119f5fda8178f83991f69e378b1a87159
    let myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      `Bearer ${request.cookies.get("uat")?.value}`,
    );
<<<<<<< HEAD
=======
    myHeaders.append("Content-Type", "application/json");

>>>>>>> c3a63f2119f5fda8178f83991f69e378b1a87159
    let requestOptions = {
      method: "GET",
      headers: myHeaders,
      mode: "cors",
    };

<<<<<<< HEAD
    // reuse previously-fetched settings when available, otherwise try a guarded fetch
    let data = settingData;
    if (!data || Object.keys(data).length === 0) {
      try {
        const apiBase =
          process.env.API_PROD_URL || process.env.NEXT_PUBLIC_API_URL || "";
        const res = await fetch(
          apiBase.replace(/\/$/, "") + "/settings",
          requestOptions,
        );
        if (
          res.ok &&
          (res.headers.get("content-type") || "").includes("application/json")
        ) {
          data = await res.json();
        }
      } catch (err) {
        // ignore and treat as no maintenance
        // eslint-disable-next-line no-console
        console.error("middleware: fallback fetch /settings failed", err);
      }
    }

    if (
      data?.values?.maintenance?.maintenance_mode &&
      path !== `/maintenance`
    ) {
      return NextResponse.redirect(new URL(`/maintenance`, request.url));
    } else {
      if (request.cookies.get("maintenance")) {
=======
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
>>>>>>> c3a63f2119f5fda8178f83991f69e378b1a87159
        return NextResponse.next();
      }
    }

<<<<<<< HEAD
  if (protectedRoutes.includes(path) && !request.cookies.has("uat")) {
    const response = NextResponse.redirect(
      new URL(request?.cookies?.get("currentPath").value, request.url),
    );
    response.cookies.set("showAuthToast", "true", { httpOnly: false });
    return response;
  }
=======
    if (protectedRoutes.includes(path) && !request.cookies.has("uat")) {
      const currentPath = request?.cookies?.get("currentPath")?.value || "/";
      const response = NextResponse.redirect(new URL(currentPath, request.url));
      response.cookies.set("showAuthToast", "true", { httpOnly: false });
      return response;
    }
>>>>>>> c3a63f2119f5fda8178f83991f69e378b1a87159

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
<<<<<<< HEAD
    if (
      path == `/auth/update-password` &&
      (!request.cookies.has("uo") || !request.cookies.has("ue"))
    ) {
      return NextResponse.redirect(new URL(`/auth/login`, request.url));
    }
  }
=======
>>>>>>> c3a63f2119f5fda8178f83991f69e378b1a87159

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
