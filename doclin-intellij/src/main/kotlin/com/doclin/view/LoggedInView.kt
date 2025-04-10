package com.doclin.view

import java.awt.GridLayout
import javax.swing.*
import javax.swing.border.EmptyBorder

class LoggedInView : JPanel() {

    private val messageTextArea = JTextArea(5, 20)
    private val anonymousCheckbox = JCheckBox("Post as an anonymous user")
    private val submitButton = JButton("Submit")

    init {
        layout = GridLayout(4, 1, 5, 5)
        border = EmptyBorder(10, 10, 10, 10)

        val titlePanel = JPanel()
        titlePanel.layout = BoxLayout(titlePanel, BoxLayout.LINE_AXIS)
        val titleLabel = JLabel("Create new thread")
        titleLabel.font = titleLabel.font.deriveFont(java.awt.Font.BOLD, 16f)
        titlePanel.add(titleLabel)
        titlePanel.add(Box.createHorizontalGlue())
        add(titlePanel)

        val buttonsPanel = JPanel()
        buttonsPanel.layout = GridLayout(1, 2, 5, 0)
        val allThreadsButton = JButton("All Threads")
        val fileThreadsButton = JButton("File Threads")
        buttonsPanel.add(allThreadsButton)
        buttonsPanel.add(fileThreadsButton)
        add(buttonsPanel)

        val messageScrollPane = JScrollPane(messageTextArea)
        add(messageScrollPane)

        val controlsPanel = JPanel()
        controlsPanel.layout = BoxLayout(controlsPanel, BoxLayout.LINE_AXIS)
        controlsPanel.add(anonymousCheckbox)
        controlsPanel.add(Box.createHorizontalGlue())
        controlsPanel.add(submitButton)
        add(controlsPanel)

        allThreadsButton.addActionListener {
            println("All Threads button clicked")
        }
        fileThreadsButton.addActionListener {
            println("File Threads button clicked")
        }
        submitButton.addActionListener {
            val message = messageTextArea.text
            val isAnonymous = anonymousCheckbox.isSelected
            JOptionPane.showMessageDialog(this, "Message: '$message', Anonymous: $isAnonymous")
        }
    }
}