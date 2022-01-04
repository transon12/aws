<?php

namespace App\Services ;
use App\Models\UserModel;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use  Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;

class UserManagerService
{
    /**
     * @param $user
     * @return false
     * @throws Exception
     */
    public function createUser($user, $message)
    {
        if (!$user) return false;
        $isExist = UserModel::query()
            ->where('email','=', $user->email)->exists();
        if ($isExist) {
            $message = 'email existed:' .$user->email;
            return false;
        }
        $request = $user;
        try {
            DB::transaction(function ($user) use ($request) {
                UserModel::create([
                    'name' => $request->name,
                    'password' => Hash::make($request->password),
                    'email' => $request->email,
                ]);
            });
        } catch (\Exception $e) {
            Log::info('email existed:' .$user->email);
            throw $e;
        }
        return true;

    }

    public function checkAuthor($user)
    {
        if (Auth::guard()->attempt(['email' => $user->email, 'password' => $user->password])) {
            Session::push('user', Auth::user());
            return true;
        }
        return  false;
    }

}
