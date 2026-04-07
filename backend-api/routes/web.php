<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/docs/openapi.json', function () {
    return redirect()->route('swagger.openapi');
})->name('swagger.openapi.redirect');
