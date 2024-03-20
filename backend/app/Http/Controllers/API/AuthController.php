<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Log;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $payload = $request->validate([
            "name" => "required|min:2|max:50",
            "email" => "required|email|unique:users,email",
            "username" => "required|alpha_num:ascii|min:4|max:50|unique:users,username",
            "password" => "required|min:6|max:50|confirmed"
        ]);

        try {
            $payload["password"] = Hash::make($payload["password"]);
            User::create($payload);
            return response()->json(["status" => 200, "message" => "Account created successfully!"]);
        } catch (\Exception $err) {
            Log::info("user_register_err =>" . $err->getMessage());
            return response()->json(["status" => 500, "message" => "Something went wrong!"], 500);
        }
    }

    // * Login user
    public function login(Request $request)
    {
        $payload = $request->validate([
            "email" => "required|email",
            "password" => "required"
        ]);

        try {
            $user = User::where("email", $payload["email"])->first();
            if ($user) {
                // * Check password
                if (!Hash::check($payload["password"], $user->password)) {
                    return response()->json(["status" => 401, "message" => "Invalid credentials."]);
                }

                $token = $user->createToken("web")->plainTextToken;
                $authRes = array_merge($user->toArray(), ["token" => $token]);
                return ["status" => 200, "user" => $authRes, "message" => "Loggedin succssfully!"];
            }
            return response()->json(["status" => 401, "message" => "No account found with these credentials."]);
        } catch (\Exception $err) {
            Log::info("user_register_err =>" . $err->getMessage());
            return response()->json(["status" => 500, "message" => "Something went wrong!"], 500);
        }
    }

    // * check credentials
    public function checkCredentias(Request $request)
    {
        $payload = $request->validate([
            "email" => "required|email",
            "password" => "required"
        ]);

        try {
            $user = User::where("email", $payload["email"])->first();
            if ($user) {
                // * Check password
                if (!Hash::check($payload["password"], $user->password)) {
                    return response()->json(["status" => 401, "message" => "Invalid credentials."]);
                }
                return ["status" => 200, "message" => "Loggedin succssfully!"];
            }
            return response()->json(["status" => 401, "message" => "No account found with these credentials."]);
        } catch (\Exception $err) {
            Log::info("user_register_err =>" . $err->getMessage());
            return response()->json(["status" => 500, "message" => "Something went wrong!"], 500);
        }
    }

    // * Logout 
    public function logout(Request $request)
    {
        try {
            $request->user()->currentAccessToken()->delete();
            return ["status" => 200, "message" => "logged out successfully!"];
        } catch (\Exception $err) {
            Log::info("user_logout_err =>" . $err->getMessage());
            return response()->json(["status" => 500, "message" => "Something went wrong!"], 500);
        }
    }
}
