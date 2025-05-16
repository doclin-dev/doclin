package com.doclin.view

import java.awt.BorderLayout
import java.awt.Component
import javax.swing.*
import com.doclin.controller.LoginController

class DoclinStartView : JPanel() {

    private val contentPanel = JPanel()
    private val loggedInView = LoggedInView()
    private val loggedOutView = LoggedOutView {
        if (LoginController.login()) {
            updateView()
        }
    }

    init {
        contentPanel.layout = BoxLayout(contentPanel, BoxLayout.Y_AXIS)
        contentPanel.alignmentX = Component.LEFT_ALIGNMENT
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

        contentPanel.add(Box.createVerticalGlue())
        contentPanel.revalidate()
        contentPanel.repaint()
    }
}