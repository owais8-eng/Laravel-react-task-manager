<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $tasks = $request->user()->tasks()->select(['id', 'user_id', 'title', 'description', 'isCompleted', 'due_date'])->get();
        return response()->json($tasks, 200);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'title' => 'required|string|max:250',
            'description' => 'nullable|string',
            'isCompleted' => 'boolean',
            'due_date' => 'nullable|date',
        ]);

        $task = $request->user()->tasks()->create($validatedData);
        return response()->json([
            'data' => $task,
            'message' => ' task created successfully',
        ], 201);
    }

    public function show(Request $request, $id)
    {
        $task = $request->user()->tasks()->findOrFail($id);
        return response()->json($task, 200);
    }

    public function delete(Request $request, $id)
    {
        $task = $request->user()->tasks()->findOrFail($id);
        $task->delete();

        return response()->json([
            'data' => $task,
            'message' => 'Task deleted successfully',
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $task = $request->user()->tasks()->findOrFail($id);

        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'isCompleted' => 'boolean',
            'due_date' => 'nullable|date'
        ]);

        $task->update($validatedData);

        return response()->json([
            'data' => $task,
            'message' => 'Task updated successfully',
        ], 200);
    }
}
