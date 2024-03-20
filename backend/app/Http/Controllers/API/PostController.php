<?php

namespace App\Http\Controllers\API;

use App\Events\PostBroadCastEvent;
use App\Http\Controllers\Controller;
use App\Http\Requests\PostRequest;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Log;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $posts = Post::select("id", "user_id", "title", "image_url", "url", "created_at", "vote", "comment_count", "description")->with('user')->orderByDesc("id")->cursorPaginate(20);
        return response()->json($posts);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(PostRequest $request)
    {
        $payload = $request->validated();
        try {
            $user = $request->user();
            $payload["user_id"] = $user->id;
            $post = Post::create($payload)->with("user")->orderByDesc("id")->first();
            PostBroadCastEvent::dispatch($post);
            return response()->json(["message" => "Post created successfully!", "post" => $post]);
        } catch (\Exception $err) {
            Log::info("post-error => " . $err->getMessage());
            return response()->json(["message" => "something went wrong.please try again!"], 500);
        }

    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
