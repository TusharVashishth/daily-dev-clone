<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
    public function updateProfileImage(Request $request)
    {
        $payload = $request->validate([
            "profile_image" => "required|image|mimes:jpg,png,svg,webp,jpeg,gif|max:2048"
        ]);
        try {
            $user = $request->user();
            $filename = $payload["profile_image"]->store("images_" . $user->id);
            User::where("id", $user->id)->update(["profile_image" => $filename]);
            return response()->json(["image" => $filename]);
        } catch (\Exception $err) {
            Log::info("Profile image error =>" . $err->getMessage());
            return response()->json(["message" => "Something went wrong!"], 500);
        }



    }
}
