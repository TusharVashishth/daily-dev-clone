<?php

namespace App\Http\Controllers\API;

use App\Events\CommentIncrement;
use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\Post;
use Illuminate\Http\Request;
use Log;

class CommentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $postId = $request->get("post_id");
        $comments = Comment::select("id", "user_id", "post_id", "comment", "created_at")->where("post_id", $postId)->with('user')->orderByDesc("id")->cursorPaginate(15);
        return response()->json($comments);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $payload = $request->validate([
            "comment" => "required|min:2|max:2000",
            "post_id" => "required"
        ]);
        try {
            $user = $request->user();
            $payload["user_id"] = $user->id;
            Post::where("id", $payload["post_id"])->increment("comment_count", 1);
            $comment = Comment::create($payload)->with('user')->orderByDesc("id")->first();
            CommentIncrement::dispatch($payload["post_id"]);
            return response()->json(["comment" => $comment, "message" => "Comment added succcesfully!"]);
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
