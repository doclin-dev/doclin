package com.doclin.view

import com.doclin.controller.LoginController
import java.awt.BorderLayout
import javax.swing.*

class DoclinStartView : JPanel() {
    private val contentPanel = JPanel()
    private val loggedInView = LoggedInView()
    private val loggedOutView = LoggedOutView { // Pass the callback
        if (LoginController.login()) {
            updateView()
        } else {
            // Handle login failure (if needed)
        }
    }

    init {
        contentPanel.layout = BoxLayout(contentPanel, BoxLayout.Y_AXIS)
        updateView()

        val scrollPane = JScrollPane(contentPanel)
        scrollPane.verticalScrollBarPolicy = ScrollPaneConstants.VERTICAL_SCROLLBAR_AS_NEEDED
        scrollPane.horizontalScrollBarPolicy = ScrollPaneConstants.HORIZONTAL_SCROLLBAR_NEVER

        layout = BorderLayout()
        add(scrollPane, BorderLayout.CENTER)
    }

    private fun updateView() {
        contentPanel.removeAll()
        if (LoginController.isLoggedIn()) {
            contentPanel.add(loggedInView)
        } else {
            contentPanel.add(loggedOutView)
        }
        contentPanel.revalidate()
        contentPanel.repaint()
    }
}