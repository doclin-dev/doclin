package com.doclin.controller

object LoginController {

    private var isLoggedIn = false

    fun login(): Boolean {
        // Dummy login logic - replace with actual authentication later
        isLoggedIn = true
        return true
    }

    fun logout(): Boolean {
        // Dummy logout logic
        isLoggedIn = false
        return true
    }

    fun isLoggedIn(): Boolean {
        return isLoggedIn
    }
}