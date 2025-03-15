package com.doclin.view

import java.awt.Component
import javax.swing.*

class LoggedOutView(private val onLogin: () -> Unit) : JPanel() { // Add a callback

    init {
        layout = BoxLayout(this, BoxLayout.Y_AXIS)

        val loginButton = JButton("Login")
        loginButton.addActionListener {
            onLogin() // Call the callback when the button is clicked
        }

        loginButton.alignmentX = Component.CENTER_ALIGNMENT
        add(loginButton)
    }
}