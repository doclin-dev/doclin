package com.doclin.controller

object LoginController {
    private var isLoggedIn = false

    fun login(): Boolean {
        // TODO: replace with actual authentication
        isLoggedIn = true
        return true
    }

    fun logout(): Boolean {
        // TODO: replace with actual logout logic
        isLoggedIn = false
        return true
    }

    fun isLoggedIn(): Boolean {
        return isLoggedIn
    }
}