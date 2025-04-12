package com.doclin.controller

object ThreadsController {
    private val allThreads = mutableListOf<String>()
    private val fileThreads = mutableMapOf<String, List<String>>()

    init {
        fetchThreadsFromAPI()
    }

    private fun fetchThreadsFromAPI() {
        //TODO: replace dummy data with real data from api
        val dummyAllThreads = emptyList<String>()
        val dummyFileThreads = emptyMap<String, List<String>>()

        allThreads.addAll(dummyAllThreads)
        fileThreads.putAll(dummyFileThreads)
        println("Threads fetched from API")
    }

    fun getAllThreads(): List<String> {
        return allThreads
    }

    fun getFileThreads(filename: String): List<String> {
        return fileThreads[filename] ?: emptyList()
    }

    fun postThread(threadText: String) {
        allThreads.add(threadText)
        println("Thread posted: $threadText")
    }

    fun addFileThread(filename: String, threadText: String) {
        val threads = fileThreads.getOrDefault(filename, mutableListOf()) as MutableList<String>
        threads.add(threadText)
        fileThreads[filename] = threads
        println("Thread posted to $filename: $threadText")
    }
}