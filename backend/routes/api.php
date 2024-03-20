<?php


use App\Events\CommentIncrement;
use App\Events\PostBroadCastEvent;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\CommentController;
use App\Http\Controllers\API\PostController;
use App\Http\Controllers\API\UserController;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResources([
        "post" => PostController::class,
        "comment" => CommentController::class,
    ]);

    Route::post("/update/profile", [UserController::class, 'updateProfileImage']);
});


Route::post("/test/channel", function (Request $request) {
    // $post = Post::where("id", "2")->with('user')->first();
    // PostBroadCastEvent::dispatch($post);
    CommentIncrement::dispatch(2);
    // TestEvent::dispatch($request->all());
    return response()->json(["message" => "data sent successfully!"]);
});

Route::post("/auth/login", [AuthController::class, 'login']);
Route::post("/auth/register", [AuthController::class, 'register']);
Route::post("/auth/checkCredentials", [AuthController::class, 'checkCredentias']);

Broadcast::routes(['middleware' => ['auth:sanctum']]);