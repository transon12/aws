<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
Route::group(['middleware' => 'log'], function () {
    Route::get('/login', 'LoginController@login')->name('login');
    Route::post('/login', 'LoginController@checkAuth')->name('check-account');
    Route::get('/register', 'UserController@register')->name('register');
    Route::post('/register', 'UserController@registrationAccount')->name('register-account');
    Route::group(['middleware' => 'check-account'], function () {
        Route::get('/', 'HomeController@dashboard')->name('home');
    });
});
