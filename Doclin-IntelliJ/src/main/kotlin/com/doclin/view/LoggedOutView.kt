package com.doclin.view

import java.awt.Component
import javax.swing.*

class LoggedOutView : JPanel() {

    init {
        layout = BoxLayout(this, BoxLayout.Y_AXIS)

        val loginButton = JButton("Login")
        // Dummy login button - no action for now
        loginButton.addActionListener {
            // Add login logic here later
        }

        loginButton.alignmentX = Component.CENTER_ALIGNMENT
        add(loginButton)
    }
}