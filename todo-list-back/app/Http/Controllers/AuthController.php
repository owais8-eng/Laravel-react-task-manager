<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{

    public function register(Request $request) {


        $data = $request->validate([
            'name' => 'required|string',
            'email'=> 'required|string|unique:users,email|email',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' =>$data['email'],
            'password' =>Hash::make($data['password'])
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json(['user' => $user , 'token' => $token]);
    }

    public function login(Request $request)  {

        $data = $request->validate([
            'email' => 'required|string',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $data['email'])->first();
        if(!$user || !Hash::check($data['password'],$user->password)) {

            return response()->json(['message' => 'invalid credentials'], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;
        return response()->json(['user' => $user, 'token' => $token]);
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        return response()->json(['message' => 'Logged out']);
    }

}
