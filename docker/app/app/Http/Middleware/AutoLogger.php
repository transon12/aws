<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class AutoLogger
{
    /**
     * Handle an incoming request.
     *
     * @param Request $request
     * @param Closure $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next, $guard = null)
    {
        $this->writeLog($request, $guard);
        return $next($request);
    }

    private function writeLog(Request $request, $guard = null): void
    {
        $userInfo = "";
        if (Auth::check()) {
            $userInfo = array(
                'user_id' => Auth::user()->id,
                'user_name' => Auth::user()->name,
            );
        } else {
            if (config('app.log_debug')) {
                Log::info($request->method(), ['url' => $request->fullUrl(), ' auth' => $userInfo, ' request' => $request->all()]);
            }
            Log::info($request->method(), ['url' => $request->url(), ' request' => $request->all()]);
        }

    }
}
