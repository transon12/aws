<?php


namespace App\Http\Controllers;
use App\Services\CallApiService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;


class HomeController extends Controller
{
    protected $callApiService;
    public function __construct(CallApiService $callApiService)
    {
        $this->callApiService = $callApiService;
    }
    public function dashboard()
    {
        $list = json_decode($this->callApiService->GetAPI());
        $user = Auth::user();
        Log::info("cuss");
        return view('home', ['list'=> $list->data, 'user'=>$user]);
    }
}
