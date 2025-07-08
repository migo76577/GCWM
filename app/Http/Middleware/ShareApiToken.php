<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class ShareApiToken
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Share API token with Inertia pages if user is authenticated
        if (auth()->check()) {
            Inertia::share([
                'api_token' => $request->session()->get('api_token'),
            ]);
        }

        return $next($request);
    }
}