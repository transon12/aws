<?php


namespace App\Http\Controllers;
use App\Services\UserManagerService;
use Illuminate\Http\Request;

class UserController extends Controller
{
    protected $userManagerService;

    public function __construct(UserManagerService $userManagerService)
    {
        $this->userManagerService = $userManagerService;
    }
    public function register()
    {
        return view('register');
    }

    /**
     * @param Request $request
     */

    public function registrationAcCount(Request $request){
        $message ="";
       if(!$this->userManagerService->createUser($request, $message)){
           return redirect()->back()->withInput()->withErrors(['Error' => $message]);
       }
        return redirect('/login');
    }
}
