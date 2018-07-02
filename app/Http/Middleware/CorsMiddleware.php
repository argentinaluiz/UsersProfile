<?php

namespace CodeShopping\Http\Middleware;

use Closure;

class CorsMiddleware
{
    public function handle($request, Closure $next)
    {
        if ($request->is('api/*')) {
            header('Access-Control-Allow-Origin: http://localhost:4200');
            header('Access-Control-Allow-Headers: Content-Type');
        }
        return $next($request);
    }
}
