import { authMiddleware } from "@clerk/nextjs";

// Define your protected routes
const protectedRoutes = [
  '/',
  '/upcoming',
  '/meeting(.*)',
  '/previous',
  '/recordings',
  '/personal-room',
];

// Apply authMiddleware to protect routes
const protectedRouteMiddleware = authMiddleware();

// Custom middleware to protect routes
function customAuthMiddleware(handler: any) {
  return async (req: any, res: any) => {
    // Check if the requested route is in the list of protected routes
    const isProtectedRoute = protectedRoutes.some(route => req.url.match(new RegExp(`^${route}$`)));

    // If it's a protected route and the user is not authenticated, redirect to the sign-in page
    if (isProtectedRoute && !req.headers.authorization) {
      res.writeHead(302, { Location: '/sign-in' });
      res.end();
      return;
    }

    // If it's not a protected route or the user is authenticated, proceed with the original handler
    return handler(req, res);
  };
}

// Apply custom auth middleware to protected routes
export default customAuthMiddleware(protectedRouteMiddleware);

// Optionally, you can configure other routes or files to exclude from authentication
export const config = {
  matcher: [
    // Exclude static files and Next.js internals
    "/((?!.+\\.[\\w]+$|_next).*)",
    // Re-include any files in the api or trpc folders that might have an extension
    "/(api|trpc)(.*)"
  ]
};
