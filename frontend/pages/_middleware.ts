import { NextRequest, NextResponse } from "next/server";

const Middleware = (req: NextRequest) =>
  req.nextUrl.pathname === req.nextUrl.pathname.toLowerCase()
    ? NextResponse.next()
    : NextResponse.redirect(
        `${req.nextUrl.origin}${req.nextUrl.pathname.toLowerCase()}`
      );

export default Middleware;
