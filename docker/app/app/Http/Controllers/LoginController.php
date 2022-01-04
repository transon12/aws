<?php


namespace App\Http\Controllers;


use App\Services\UserManagerService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class LoginController extends Controller
{
    protected $userManagerService;

    public function __construct(UserManagerService $userManagerService)
    {
        $this->userManagerService = $userManagerService;
    }

    public function login()
    {
        if(!Auth::check()){
            return view('welcome');
        }
        return redirect('/');
    }

    /**
     * @param Request $request
     */

    public function checkAuth(Request $request) {

        if($this->userManagerService->checkAuthor($request)) {
            return redirect('home');
        }
        return redirect()->back()->withInput()->withErrors(['LoginErrors' => 'Please check password or email']);
    }
}
