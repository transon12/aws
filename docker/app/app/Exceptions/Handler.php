<?php

namespace App\Exceptions;

use App\Mail\ExceptionMail;
use App\Mail\ExceptionOccured;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Log;
use Throwable;
use Mail;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array
     */
    protected $dontReport = [
//
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array
     */
    protected $dontFlash = [
        'password',
        'password_confirmation',
    ];

    /**
     * Report or log an exception.
     *
     * @param \Throwable $exception
     * @return void
     *
     * @throws \Exception
     */
    public function report(Throwable $exception)
    {
        // emails.exception is the template of your email
        // it will have access to the $error that we are passing below
        if ($this->shouldReport($exception)) {
            $this->sendEmail($exception); // sends an email
        }

        return parent::report($exception);

    }

    /**
     * Render an exception into an HTTP response.
     *
     * @param \Illuminate\Http\Request $request
     * @param \Throwable $exception
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @throws \Throwable
     */
    public function render($request, Throwable $exception)
    {
        return parent::render($request, $exception);
    }

    public function sendEmail(Throwable $exception)
    {
        try {
            \Mail::to(config('configApp.mail.to'))->send(new ExceptionMail($exception));
        } catch (Throwable $exception) {
            Log::error($exception);
        }
        Log::error($exception);
    }
}
